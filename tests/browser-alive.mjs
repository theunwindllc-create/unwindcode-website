/* Optional dependency-free Chromium QA. Owns and stops its loopback preview. */
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
const output = resolve('artifacts/living-atlas-qa/alive');
await mkdir(output, { recursive: true });
const delay = ms => new Promise(r => setTimeout(r, ms));
const origin = 'http://127.0.0.1:52498';
try { await fetch(origin); throw new Error('Preview port already occupied; refusing to take ownership.'); }
catch (e) { if (e.message.startsWith('Preview port')) throw e; }
let preview, chrome, socket, send;
let chromeLog = '';
const errors = [], checks = [], metrics = {};
const networkHosts = new Set();
let layers = [];
let recordingEntranceLayers = true;
const layerMeasurements = [];
try {
  preview = spawn(process.execPath, ['scripts/preview-atlas.mjs'], { windowsHide: true, stdio: 'pipe' });
  let previewLog = '';
  preview.stdout.on('data', d => { previewLog += d; });
  preview.stderr.on('data', d => { previewLog += d; });
  preview.on('error', e => errors.push(e.message));
  for (let i = 0; i < 30; i++) {
    try { if ((await fetch(origin)).ok) break; } catch {}
    if (i === 29) throw new Error(`Preview failed: ${previewLog}`);
    await delay(100);
  }
  chrome = spawn(process.env.ATLAS_CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
    '--headless=new', '--no-sandbox', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    '--disable-background-networking', '--disable-sync', '--remote-debugging-port=0',
    '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    `--user-data-dir=${resolve(output, `chrome-profile-${Date.now()}`)}`, 'about:blank',
  ], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  const endpoint = await new Promise((res, rej) => {
    let log = '';
    const timer = setTimeout(() => rej(new Error(`Chrome did not start: ${log.slice(-1000)}`)), 12000);
    chrome.on('error', e => { clearTimeout(timer); rej(e); });
    chrome.stderr.on('data', d => {
      log += d;
      chromeLog += d;
      const found = log.match(/DevTools listening on (ws:\/\/\S+)/);
      if (found) { clearTimeout(timer); res(found[1]); }
    });
  });
  socket = new WebSocket(endpoint);
  await new Promise((res, rej) => { socket.onopen = res; socket.onerror = rej; });
  let id = 0, session;
  const waiting = new Map();
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const item = waiting.get(message.id);
      if (!item) return;
      waiting.delete(message.id);
      clearTimeout(item.timer);
      message.error ? item.reject(new Error(JSON.stringify(message.error))) : item.resolve(message.result);
    } else if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text + ': ' + message.params.exceptionDetails.exception?.description);
    else if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push(message.params.args.map(a=>a.value || a.description).join(' '));
    else if (message.method === 'Network.requestWillBeSent' && /^https?:/.test(message.params.request.url)) networkHosts.add(new URL(message.params.request.url).host);
    else if (message.method === 'LayerTree.layerTreeDidChange') {
      layers = message.params.layers || [];
      if (recordingEntranceLayers && send) layerMeasurements.push(Promise.all(layers.map(layer =>
        send('LayerTree.compositingReasons', { layerId: layer.layerId }).catch(() => ({compositingReasonIds:[]}))))
        .then(reasons => reasons.filter(r=>r.compositingReasonIds.some(id=>/active.*animation/i.test(id))).length));
    }
  };
  send = (method, params = {}, sid = session) => new Promise((resolve, reject) => {
    const key = ++id;
    waiting.set(key, { resolve, reject, timer: setTimeout(() => { waiting.delete(key); reject(new Error(`CDP timeout ${method}`)); }, 15000) });
    socket.send(JSON.stringify({ id: key, method, params, ...(sid ? { sessionId: sid } : {}) }));
  });
  const target = await send('Target.createTarget', { url: 'about:blank' });
  session = (await send('Target.attachToTarget', { targetId: target.targetId, flatten: true })).sessionId;
  await send('Page.enable'); await send('Runtime.enable'); await send('Performance.enable');
  await send('Network.enable'); await send('LayerTree.enable');
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `
    window.__frames = 0;
    window.__arrival = []; window.__jobs = []; window.__seq = 20;
    const nativeFrame = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = callback => nativeFrame(time => { window.__frames++; callback(time); });
    const nativeAnimate = Element.prototype.animate;
    Element.prototype.animate = function(frames, options) {
      const animation = nativeAnimate.call(this, frames, options);
      window.__jobs.push({target:this.className || this.id,duration:options.duration,frames,start:performance.now()});
      return animation;
    };
    const nativeTimer = window.setTimeout.bind(window);
    window.setTimeout = (callback, ms, ...args) => {
      if(ms === 60000) window.__poll = callback;
      return nativeTimer(callback, ms, ...args);
    };
    let end = 0;
    const watch = time => {
      if (!end) end = time + 3200;
      const root = document.documentElement, word = document.querySelector('.living-word');
      window.__arrival.push({time,phase:root.dataset.entrance || '',running:document.getAnimations().filter(a=>a.playState==='running').length,
        word:word ? {opacity:getComputedStyle(word).opacity,filter:getComputedStyle(word).filter} : null,
        witness:document.querySelector('[data-witness]')?.dataset.witnessState,
        witnessVisible:document.querySelector('.witness-reading') ? getComputedStyle(document.querySelector('.witness-reading')).visibility : null});
      if(time<end) nativeFrame(watch);
    }; nativeFrame(watch);
    const nativeFetch = window.fetch.bind(window);
    window.fetch = (url, options) => String(url).startsWith('https://rt6ds-eqaaa-aaaad-agv7q-cai.raw.icp0.io/')
      ? new Promise((resolve,reject)=>{
          const answer=()=>window.__offline ? reject(new Error('fixture offline')) : resolve(new Response(JSON.stringify({ total_beats:123+window.__seq-20, organs:[{organ:'first-body',age_seconds:65,seq:window.__seq}] }),{status:200}));
          if(sessionStorage.getItem('test-witness')==='hold') window.__answer=answer; else nativeTimer(answer, 500);
        })
      : nativeFetch(url, options);
  ` });
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: origin });
  for (let i = 0; i < 70; i++) {
    if (await evaluate(`document.documentElement.classList.contains('alive-ready')`)) break;
    if (i === 69) throw new Error('Alive failed to initialize');
    await delay(100);
  }
  await evaluate('document.fonts.ready');
  metrics.entranceCompositorSamples=[];
  for(let sample=0;sample<18;sample++) {
    await send('LayerTree.disable');await send('LayerTree.enable');await delay(80);
    const phase=await evaluate('document.documentElement.dataset.entrance');
    if(!phase)break;
    const reasons=await Promise.all(layers.map(layer=>send('LayerTree.compositingReasons',{layerId:layer.layerId}).catch(()=>({compositingReasonIds:[]}))));
    const animated=reasons.map((r,i)=>({...r,backendNodeId:layers[i]?.backendNodeId})).filter(r=>r.compositingReasonIds.some(id=>/active.*animation/i.test(id)));
    metrics.entranceCompositorSamples.push({phase,active:animated.length,animated});
  }
  await delay(4000);
  recordingEntranceLayers = false;
  metrics.entranceAcceleratedLayersMax = Math.max(0, ...await Promise.all(layerMeasurements), ...metrics.entranceCompositorSamples.map(s=>s.active));
  metrics.entranceLayerSnapshots = layerMeasurements.length;
  assert.ok(layerMeasurements.length > 0, 'Chromium supplied actual layer snapshots');
  assert.ok(metrics.entranceCompositorSamples.some(s=>s.phase==='words'), 'Compositor observations include the word phase');
  console.log('COMPOSITOR',JSON.stringify({maximum:metrics.entranceAcceleratedLayersMax,samples:metrics.entranceCompositorSamples.length,phases:[...new Set(metrics.entranceCompositorSamples.map(s=>s.phase))]}));
  assert.ok(metrics.entranceAcceleratedLayersMax <= 2, 'Entrance uses at most two accelerated animation layers');
  async function record(name, expression) {
    const result = await evaluate(expression);
    if (!result) {
      await screenshot('failure');
      console.log('FAIL DETAIL', JSON.stringify({name, errors, state: await evaluate(`({status:document.querySelector('[data-registry-status]')?.textContent,open:document.querySelector('#specimen-sheet')?.open,active:document.activeElement?.tagName,jobs:__jobs?.slice(-4),running:document.getAnimations().map(a=>({target:a.effect.target?.className,state:a.playState,time:a.currentTime})),entrance:document.documentElement.dataset.entrance})`)}));
    }
    assert.ok(result, name);
    checks.push(name); console.log('PASS', name);
  }
  async function screenshot(name) {
    const result = await send('Page.captureScreenshot', { format: 'png' });
    await writeFile(resolve(output, `${name}.png`), Buffer.from(result.data, 'base64'));
  }
  async function artShot(selector, name) {
    const clip = await evaluate(`(()=>{const b=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();
      const x=Math.max(0,b.left),y=Math.max(0,b.top);return {x:x+scrollX,y:y+scrollY,width:Math.min(innerWidth,b.right)-x,height:Math.min(innerHeight,b.bottom)-y,scale:1};})()`);
    const { data } = await send('Page.captureScreenshot', { format: 'png', clip });
    await writeFile(resolve(output, `${name}.png`), Buffer.from(data, 'base64'));
    return data;
  }
  async function pixelDiff(before, after) {
    return evaluate(`(async()=>{
      async function pixels(data){const image=new Image();image.src='data:image/png;base64,'+data;await image.decode();
        const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
        const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);return ctx.getImageData(0,0,image.width,image.height);}
      const a=await pixels(${JSON.stringify(before)}), b=await pixels(${JSON.stringify(after)});
      if(a.width!==b.width||a.height!==b.height)throw Error('Diff bounds changed');
      let changed=0, maxDelta=0, total=0;
      for(let i=0;i<a.data.length;i+=4){const delta=Math.max(...[0,1,2].map(c=>Math.abs(a.data[i+c]-b.data[i+c])));
        if(delta>=8)changed++;maxDelta=Math.max(maxDelta,delta);total+=delta;}
      return {width:a.width,height:a.height,threshold:8,changedPercent:changed/(a.width*a.height)*100,maxDelta,meanDelta:total/(a.width*a.height)};
    })()`);
  }
  async function edgeScan(selector, name, inject = false) {
    const clip = await evaluate(`(()=>{const b=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();const x=Math.max(0,b.left-2),y=Math.max(document.querySelector('#nav').getBoundingClientRect().bottom+1,b.top-2);return {x:x+scrollX,y:y+scrollY,width:Math.min(innerWidth,b.right+2)-x,height:Math.min(innerHeight,b.bottom+2)-y,scale:1};})()`);
    const {data} = await send('Page.captureScreenshot', {format:'png',clip});
    await writeFile(resolve(output, name+'.png'), Buffer.from(data,'base64'));
    return evaluate(`(async()=>{
      const img=new Image(); img.src='data:image/png;base64,'+${JSON.stringify(data)}; await img.decode();
      const canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;
      const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);
      if(${inject}){ctx.fillStyle='rgb(16 16 16)';ctx.fillRect(20,20,180,140);ctx.fillStyle='rgb(5 5 5)';ctx.fillRect(30,30,160,120);}
      const {data:p,width:w,height:h}=ctx.getImageData(0,0,img.width,img.height);
      const l=new Float32Array(w*h);for(let i=0;i<l.length;i++)l[i]=.2126*p[i*4]+.7152*p[i*4+1]+.0722*p[i*4+2];
      let maximum=0,runs=0;const examples=[];
      for(const axis of ['row','column']) {
        const across=axis==='row'?w:h, lines=axis==='row'?h:w;
        for(let line=1;line<lines;line++) {
          let length=0,sign=0,minStep=255;
          const finish=()=>{maximum=Math.max(maximum,length);if(length>=120){runs++;if(examples.length<8)examples.push({axis,line,length,minStep});}length=0;minStep=255;};
          for(let j=0;j<across;j++) {
            const a=axis==='row'?l[line*w+j]:l[j*w+line], b=axis==='row'?l[(line-1)*w+j]:l[j*w+line-1];
            const step=a-b,s=Math.sign(step);
            if(a<40&&b<40&&Math.abs(step)>=3){if(sign!==s)finish();sign=s;length++;minStep=Math.min(minStep,Math.abs(step));}
            else finish();
          }finish();
        }
      }
      return {width:w,height:h,runs,longest:maximum,examples};
    })()`);
  }
  async function contrastScan(name) {
    // Conservative bounds check: every background pixel under each text line, including whitespace.
    // Gradients are assessed at their darkest stop; antialiasing is not mistaken for authored color.
    const tokens=await evaluate(`(()=>{
      const result=[],walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
      while(node=walker.nextNode()) {
        if(!node.textContent.trim()||node.parentElement.closest('script,style,svg'))continue;
        const el=node.parentElement,c=getComputedStyle(el);if(c.visibility!=='visible'||!el.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}))continue;
        const range=document.createRange();range.selectNodeContents(node);
        const top=document.querySelector('#nav').getBoundingClientRect().bottom+1;
        const boxes=[...range.getClientRects()].filter(b=>b.width>0&&b.height>0&&b.bottom>top&&b.top<innerHeight-85)
          .map(b=>({x:b.left,y:Math.max(top,b.top),w:b.width,h:Math.min(innerHeight-85,b.bottom)-Math.max(top,b.top)}));
        if(!boxes.length)continue;
        const color=el.closest('.living-word')?[240,238,246]:c.color.match(/[\\d.]+/g).slice(0,3).map(Number);
        const size=parseFloat(c.fontSize),bold=Number(c.fontWeight)>=700;
        result.push({text:node.textContent.trim().slice(0,70),color,threshold:size>=24||(bold&&size>=18.66)?3:4.5,boxes});
      }
      const style=document.createElement('style');style.id='contrast-probe';style.textContent='body * {color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;} .living-word {background:none!important;}';document.head.append(style);
      return result;
    })()`);
    const {data}=await send('Page.captureScreenshot',{format:'png'});
    await writeFile(resolve(output, 'contrast-'+name+'.png'), Buffer.from(data,'base64'));
    await evaluate(`document.querySelector('#contrast-probe').remove()`);
    const result=await evaluate(`(async()=>{
      const img=new Image();img.src='data:image/png;base64,'+${JSON.stringify(data)};await img.decode();
      const canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);
      const p=ctx.getImageData(0,0,img.width,img.height).data;
      const lum=rgb=>rgb.reduce((sum,c,i)=>{c/=255;return sum+[.2126,.7152,.0722][i]*(c<=.04045?c/12.92:((c+.055)/1.055)**2.4);},0);
      const failures=[];let minimum=99,checked=0;
      for(const token of ${JSON.stringify(tokens)}){
        let ratio=99,point=null;const fg=lum(token.color);
        for(const b of token.boxes)for(let y=Math.max(0,Math.ceil(b.y));y<Math.min(img.height,b.y+b.h);y+=2)for(let x=Math.max(0,Math.ceil(b.x));x<Math.min(img.width,b.x+b.w);x+=2){
          const i=(y*img.width+x)*4,bg=lum([p[i],p[i+1],p[i+2]]),r=(Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05);if(r<ratio){ratio=r;point={x,y};}
        }
        if(ratio===99)continue;checked++;minimum=Math.min(minimum,ratio);if(ratio<token.threshold)failures.push({text:token.text,ratio,threshold:token.threshold,point});
      }return {checked,minimum,failures};
    })()`);
    if(result.failures.length) console.log('CONTRAST',name,JSON.stringify(result));
    return {name,...result};
  }
  metrics.entrance = await evaluate(`({samples:__arrival,jobs:__jobs.filter(j=>j.duration!==12000)})`);
  await record('Entrance passes seed, glass and words once and settles in 2.1s', `(()=>{const phases=new Set(__arrival.map(s=>s.phase));return ['seed','glass','words'].every(p=>phases.has(p)) && !document.documentElement.hasAttribute('data-entrance') && __jobs.some(j=>j.duration===2100);})()`);
  await record('Entrance has at most two simultaneous WAAPI targets; headline starts blurred and invisible', `__arrival.every(s=>s.running<=2) && __arrival.some(s=>s.word?.filter==='blur(14px)' && s.word.opacity==='0')`);
  await record('No witness arrives before an actual response and no loading UI appears', `__arrival.filter(s=>s.witness==='loading').every(s=>s.witnessVisible==='hidden') && __arrival.some(s=>s.phase==='words' && s.witness==='ready' && s.witnessVisible==='visible')`);
  await record('Hero image remains eager and high priority; entrance has no overlay', `document.querySelector('.hero-image').fetchPriority==='high' && document.querySelector('.hero-image').loading!=='lazy' && !document.querySelector('[data-entrance-overlay]')`);
  await record('Condensing words never wrap within a word', `[...document.querySelectorAll('.living-word')].every(e=>getComputedStyle(e).whiteSpace==='nowrap')`);
  await record('One public source reading, no fabricated total', `document.querySelector('[data-witness]').textContent.includes('123 total beats')`);
  const frameStart = await evaluate('window.__frames');
  await delay(1000);
  metrics.idleFrames = await evaluate(`window.__frames - ${frameStart}`);
  metrics.idleAnimations = await evaluate(`document.getAnimations().filter(a => a.playState === 'running').length`);
  metrics.domElements = await evaluate('document.querySelectorAll("*").length');
  metrics.browserMetrics = (await send('Performance.getMetrics')).metrics.filter(x => ['JSHeapUsedSize', 'JSHeapTotalSize', 'Nodes', 'LayoutCount', 'RecalcStyleCount'].includes(x.name));
  assert.equal(metrics.idleFrames, 0); assert.equal(metrics.idleAnimations, 1);
  metrics.animatedCompositorLayers = [];
  await send('LayerTree.disable'); await send('LayerTree.enable'); await delay(100);
  await screenshot('1440-hero');
  for (const layer of layers) {
    const reasons = await send('LayerTree.compositingReasons', { layerId: layer.layerId }).catch(e=>{
      if(e.message.includes('No layer matching')) return {compositingReasonIds:[]}; throw e;
    });
    if (reasons.compositingReasonIds.some(reason=>/active.*animation/i.test(reason))) metrics.animatedCompositorLayers.push(reasons);
  }
  await record('Breath owns one transform-only animated target and one promoted layer', `(()=>{const all=document.getAnimations().filter(a=>a.playState==='running'),hero=document.querySelector('.hero-art');return all.length===1 && all[0].effect.target===hero && all[0].effect.getKeyframes().every(f=>Object.keys(f).every(k=>['offset','computedOffset','easing','composite','transform'].includes(k))) && [...document.querySelectorAll('*')].filter(e=>getComputedStyle(e).willChange.includes('transform')).length===1;})()`);
  assert.equal(metrics.animatedCompositorLayers.length, 1, 'Chrome reports one active accelerated transform layer');
  checks.push('Zero idle rAF and exactly one decorative hero breath with WebGL offscreen');
  await screenshot('1440-hero');
  await record('Desktop caption has three distinct slots', `(()=>{const r=s=>document.querySelector(s).getBoundingClientRect(),a=r('.scroll-cue'),b=r('.witness-reading'),c=r('.figure-note');return a.right<=b.left && b.right<=c.left;})()`);
  // Isolate response from the independently tested breath; identical transform for both samples.
  await evaluate(`document.querySelector('.hero-art').getAnimations().forEach(a=>{a.pause();a.currentTime=0;}); document.querySelector('.hero').dispatchEvent(new Event('pointerleave'))`);
  const rest = await artShot('.hero-art', '1440-light-rest');
  const wholeHeroRest = await artShot('.hero', '1440-whole-hero-rest');
  const crossing = await evaluate(`(()=>{const a=document.querySelector('.hero-art'),b=a.getBoundingClientRect(),i=a.querySelector('img'),s=Math.min(b.width/i.naturalWidth,b.height/i.naturalHeight);return {x:b.left+b.width/2+(Number(a.dataset.seedX)-.5)*i.naturalWidth*s,y:b.top+b.height/2+(Number(a.dataset.seedY)-.5)*i.naturalHeight*s};})()`);
  await evaluate(`(()=>{const a=document.querySelector('.hero-art'),b=a.getBoundingClientRect();a.closest('.hero').dispatchEvent(new PointerEvent('pointermove',{clientX:b.right,clientY:b.top,pointerType:'mouse'}));})()`);
  await delay(50);
  await record('Refraction shifts 9px opposite the hand and distant seed dims', `(()=>{const s=document.querySelector('.hero-art').style;return s.getPropertyValue('--refract-x')==='-9px' && s.getPropertyValue('--refract-y')==='9px' && Number(s.getPropertyValue('--seed-strength'))<.3;})()`);
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...crossing });
  await delay(50);
  await record('Pointer lights the hero', `document.querySelector('.hero-art').hasAttribute('data-alive-lit')`);
  await record('Crossing seed brightens as the hand approaches', `Number(document.querySelector('.hero-art').style.getPropertyValue('--seed-strength'))>.88`);
  await delay(100);
  const litHero = await artShot('.hero-art', '1440-light-crossing');
  metrics.heroLight = await pixelDiff(rest, litHero);
  metrics.wholeHeroLight = await pixelDiff(wholeHeroRest, await artShot('.hero', '1440-whole-hero-crossing'));
  assert.ok(metrics.wholeHeroLight.changedPercent >= 8, 'Full hero box rendered pixel response >=8%');
  checks.push('Full 1440x900 hero box also exceeds 8% rendered response');
  console.log('LIGHT', JSON.stringify(metrics.heroLight));
  assert.ok(metrics.heroLight.changedPercent >= 8, 'Hero rendered pixel response >=8% at channel delta >=8');
  checks.push('Hero rendered pixel response >=8%');
  await delay(300);
  metrics.lightSettled = await pixelDiff(litHero, await artShot('.hero-art', '1440-light-settled'));
  assert.equal(metrics.lightSettled.changedPercent, 0, 'Light settles within 300ms');
  const tokenBaseline = await evaluate(`(()=>{document.querySelector('.hero').dispatchEvent(new Event('pointerleave'));return getComputedStyle(document.querySelector('.hero-sub')).color;})()`);
  await evaluate(`(()=>{const b=document.querySelector('.hero-sub').getBoundingClientRect();document.querySelector('.hero').dispatchEvent(new PointerEvent('pointermove',{clientX:b.left+20,clientY:b.top+10,pointerType:'mouse'}));})()`); await delay(60);
  await record('Text proximity brightens and headline gradient follows the same coalesced input', `getComputedStyle(document.querySelector('.hero-sub')).color!==${JSON.stringify(tokenBaseline)} && document.querySelector('.living-word').style.getPropertyValue('--word-light-x').endsWith('px')`);
  await evaluate(`document.querySelector('.hero').dispatchEvent(new Event('pointerleave'))`);
  await record('Pointer leave restores exact resting text and static gradient', `getComputedStyle(document.querySelector('.hero-sub')).color===${JSON.stringify(tokenBaseline)} && !document.querySelector('.living-word').style.getPropertyValue('--word-light-x')`);
  await evaluate(`window.__seq++;void window.__poll()`); await delay(560);
  await record('Confirmed beat updates atomically and owns one 360ms circuit plus reading luminance pass', `document.querySelector('[data-witness]').textContent.includes('124 total beats') && document.getAnimations().filter(a=>a.playState==='running').length===2 && __jobs.slice(-2).every(j=>j.duration===360)`);
  await delay(420);
  const jobsBeforeSame = await evaluate('__jobs.length');
  await evaluate('void window.__poll()'); await delay(620);
  await record('Repeated observation does not fake a new beat', `__jobs.length===${jobsBeforeSame}`);
  await evaluate(`document.dispatchEvent(new Event('visibilitychange'))`);
  await screenshot('1440-presence');
  // Real background-tab transition, not a synthetic visibility event.
  const other = await send('Target.createTarget', {url:'about:blank'});
  await send('Target.activateTarget', {targetId:other.targetId}); await delay(200);
  await record('Hidden tab pauses decorative breath', `document.hidden && document.querySelector('.hero-art').getAnimations().every(a=>a.playState!=='running')`);
  await send('Target.activateTarget', {targetId:target.targetId});
  await send('Target.closeTarget', {targetId:other.targetId}); await delay(200);
  await record('Returning to visible hero resumes one breath', `!document.hidden && document.getAnimations().filter(a=>a.playState==='running').length===1`);
  await evaluate(`document.querySelector('#organisms').scrollIntoView({behavior:'instant',block:'start'})`);
  await delay(1800);
  await record('Hero offscreen has zero running animations', `!document.querySelector('.hero-art').getAnimations().some(a=>a.playState==='running') && document.getAnimations().every(a=>a.playState!=='running')`);
  await record('Section headings and introductions condense once in 420ms without translation', `__jobs.some(j=>j.duration===420) && [...document.querySelectorAll('h2,.section-intro')].every(e=>!e.style.opacity && !e.style.filter)`);
  const organismHeadingArrivals = await evaluate(`__jobs.filter(j=>j.duration===420&&j.target==='organisms-title').length`);
  assert.equal(organismHeadingArrivals, 1, 'First visible organism heading starts one condensation');
  await evaluate(`document.querySelector('.specimen-image').scrollIntoView({behavior:'instant',block:'center'})`);
  await delay(900);
  await evaluate(`document.querySelector('.specimen-image').dispatchEvent(new Event('pointerleave'))`);
  const specimenRest = await artShot('.specimen-image', '1440-specimen-rest');
  await evaluate(`document.querySelector('.specimen-image').focus()`);
  await delay(100);
  metrics.specimenLight = await pixelDiff(specimenRest, await artShot('.specimen-image', '1440-specimen-focus'));
  assert.ok(metrics.specimenLight.changedPercent > 2, 'Keyboard light is visibly rendered on specimen');
  await record('Keyboard focus reaches the specimen nucleus with full light', `document.querySelector('.specimen-image').hasAttribute('data-alive-lit') && Number(document.querySelector('.specimen-image').style.getPropertyValue('--seed-strength'))>.88`);
  checks.push('Keyboard focus visibly lights specimen');
  await evaluate(`document.querySelector('[data-organism-status]').scrollIntoView({behavior:'instant',block:'center'}); document.querySelector('[data-organism-status]').focus()`);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await delay(450);
  await record('Enter opens registry sheet with plain public status', `document.querySelector('#specimen-sheet').open && document.querySelector('[data-registry-status]').textContent === 'Public concept · reviewed as public-safe'`);
  await record('Specimen remains lit with translucent rounded sheet and text dismiss', `(()=>{const s=document.querySelector('#specimen-sheet'),c=getComputedStyle(s);return s.closest('.specimen').querySelector('[data-sheet-lit][data-alive-lit]') && c.backgroundColor==='rgba(22, 18, 30, 0.42)' && c.backgroundImage.includes('rgba(239, 227, 255, 0.1)') && c.borderRadius==='26px' && c.backdropFilter.includes('blur(24px)') && s.querySelector('[data-sheet-close]').textContent==='dismiss';})()`);
  await record('Status condensation originates at its text affordance', `(()=>{const s=document.querySelector('#specimen-sheet'),b=s.getBoundingClientRect(),t=s.closest('.specimen').querySelector('[data-organism-status]').getBoundingClientRect(),o=getComputedStyle(s).transformOrigin.split(' ').map(parseFloat);return Math.abs(b.left+o[0]-t.left-t.width/2)<1 && Math.abs(b.top+o[1]-t.top-t.height/2)<1;})()`);
  await screenshot('1440-status');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await delay(230);
  await record('Escape dissolves and restores status focus', `!document.querySelector('#specimen-sheet').open && document.activeElement.matches('[data-organism-status]')`);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32, text: ' ' });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  await delay(400);
  await record('Space opens status sheet', `document.querySelector('#specimen-sheet').open`);
  await evaluate(`document.querySelector('#specimen-sheet [data-sheet-close]').click(); document.querySelector('#systems').scrollIntoView({behavior:'instant'}); document.querySelector('#loop-tab-2').click()`);
  await delay(450);
  await record('Loop tab keeps ARIA relationship and opens glass', `document.querySelector('#loop-tab-2').getAttribute('aria-selected') === 'true' && !document.querySelector('.loop-panels').hidden && !document.querySelector('#loop-panel-2').hidden`);
  await screenshot('1440-loop');
  metrics.stages = [];
  for(let step=0;step<6;step++) {
    await evaluate(`document.querySelector('#loop-tab-${step}').click()`); await delay(650);
    const geometry = await evaluate(`(()=>{const stage=document.querySelector('[data-infinity]'), sheet=document.querySelector('.loop-panels'),b=stage.getBoundingClientRect(),s=sheet.getBoundingClientRect(),line=document.querySelector('.loop-thread').getBoundingClientRect(),p=stage.projectStep(${step});
      return {step:${step},side:stage.closest('.loop-system').dataset.sheetSide,stage:{x:b.x,y:b.y,width:b.width,height:b.height},sheet:{x:s.x,y:s.y,width:s.width,height:s.height},point:p,outside:s.right<=b.left||s.left>=b.right,thread:line.width>0,webgl:stage.classList.contains('webgl-ready')};})()`);
    metrics.stages.push(geometry); assert.ok(geometry.outside && geometry.thread && geometry.webgl, 'Stage sheet outside loop with projected thread and WebGL marker');
  }
  checks.push('All six projected stage sheets outside loop bounds with light threads');
  await screenshot('1440-loop-stage5');
  await evaluate(`document.querySelector('.loop-panels [data-sheet-close]').click()`); await delay(230);
  await record('Loop close returns focus to selected tab', `document.activeElement.id === 'loop-tab-5' && document.querySelector('.loop-panels').hidden`);
  await evaluate(`document.querySelector('#motion-toggle').click()`);
  await record('Pause cancels light and animation', `document.documentElement.classList.contains('motion-paused') && !document.querySelector('[data-alive-lit]') && document.getAnimations().every(a => a.playState !== 'running')`);
  await evaluate(`window.scrollTo({top:0,behavior:'instant'})`); await delay(200);
  await record('Pause also brakes hero while it is in view', `document.getAnimations().every(a=>a.playState!=='running')`);
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await delay(100);
  await record('Reduced motion locks brake', `document.querySelector('#motion-toggle').disabled && document.getAnimations().every(a => a.playState !== 'running')`);
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }, { name: 'prefers-reduced-transparency', value: 'reduce' }] });
  await evaluate(`document.querySelector('#loop-tab-0').click()`);
  await record('Reduced transparency provides opaque sheet', `getComputedStyle(document.querySelector('.alive-sheet')).backgroundColor==='rgb(22, 18, 30)' && getComputedStyle(document.querySelector('.alive-sheet')).backdropFilter==='none'`);
  await evaluate(`document.querySelector('.loop-panels [data-sheet-close]').click()`);
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  for (const width of [400, 320]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 800, deviceScaleFactor: 1, mobile: false });
    if (width === 400) {
      await evaluate(`window.scrollTo({top:0,behavior:'instant'})`); await delay(150); await screenshot('400-hero-en');
      await record('English mobile caption clears fixed controls', `document.querySelector('.figure-note').getBoundingClientRect().bottom<innerHeight-82`);
    }
    await evaluate(`window.scrollTo({top:0,behavior:'instant'}); if(document.documentElement.lang !== 'es') document.querySelector('#lang-toggle').click()`);
    await delay(150);
    await record(`No overflow and whole hero at ${width}px Spanish`, `document.documentElement.scrollWidth <= innerWidth && getComputedStyle(document.querySelector('.hero-image')).objectFit === 'contain'`);
    await screenshot(`${width}-hero-es`);
    await record(`Caption slots stack without collision at ${width}px`, `(()=>{const r=s=>document.querySelector(s).getBoundingClientRect(),a=r('.scroll-cue'),b=r('.witness-reading'),c=r('.figure-note');return a.bottom<=b.top && b.bottom<=c.top && c.bottom<=document.querySelector('.hero').getBoundingClientRect().bottom-86 && (innerWidth!==400||c.bottom<innerHeight-82);})()`);
    await evaluate(`document.querySelector('#systems').scrollIntoView({behavior:'instant'}); document.querySelector('#loop-tab-3').click()`);
    await record(`Mobile glass drawer within ${width}px viewport`, `(()=>{const b=document.querySelector('.loop-panels').getBoundingClientRect(); return b.left>=0 && b.right<=innerWidth && b.bottom<=innerHeight && b.top>=0;})()`);
    await screenshot(`${width}-drawer-es`);
    await evaluate(`document.querySelector('.loop-panels [data-sheet-close]').click()`);
  }
  await record('All dynamic marked Spanish copy is translated', `[...document.querySelectorAll('[data-es]')].every(el => el.textContent === el.dataset.es)`);
  await evaluate(`document.querySelector('[data-organism-status]').scrollIntoView({behavior:'instant',block:'center'});document.querySelector('[data-organism-status]').click()`); await delay(200);
  await record('Spanish public eyebrow, dismiss and witness label', `document.querySelector('[data-registry-status]').textContent==='Concepto público · revisado para uso público' && document.querySelector('#specimen-sheet [data-sheet-close]').textContent==='descartar' && document.querySelector('.witness-label').textContent==='TESTIGO · INTERNET COMPUTER'`);
  await screenshot('320-status-es');
  await evaluate(`document.querySelector('#specimen-sheet [data-sheet-close]').click();document.activeElement.blur();if(document.documentElement.lang==='es')document.querySelector('#lang-toggle').click()`);
  metrics.edgeScans = [];
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:5,y:150});
  for (const width of [1440,1024,400]) {
    await send('Emulation.setDeviceMetricsOverride', {width,height:width===400?800:900,deviceScaleFactor:1,mobile:false});
    for (let n=0;n<5;n++) {
      const selector=n===0?'.hero-art':`.specimen:nth-child(${n}) .specimen-image`;
      await evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});${n===0 ? "window.scrollTo({top:0,behavior:'instant'});" : "el.scrollIntoView({behavior:'instant',block:'center'});"}return el.querySelector('img').decode();})()`);
      await delay(80);
      const scan=await edgeScan(selector, `edge-${width}-${n}`);
      metrics.edgeScans.push({viewport:width,art:n,...scan});
      console.log('EDGE',JSON.stringify(metrics.edgeScans.at(-1)));
      assert.equal(scan.runs,0,`No 120px dark straight step in ${width}px art ${n}`);
      await record(`Both ${width}px art ${n} layers blend and have elliptical edge masks`, `(()=>{const e=document.querySelector(${JSON.stringify(selector)});return [...e.querySelectorAll('img')].every(i=>['screen','lighten'].includes(getComputedStyle(i).mixBlendMode)&&getComputedStyle(i).maskImage.includes('radial-gradient')) && getComputedStyle(e).backgroundColor==='rgba(0, 0, 0, 0)' && getComputedStyle(e).borderTopWidth==='0px';})()`);
    }
  }
  metrics.edgePositiveControl = await edgeScan('.specimen:nth-child(4) .specimen-image','edge-positive-control-source',true);
  assert.ok(metrics.edgePositiveControl.runs>0,'Edge detector rejects an injected rectangle');
  checks.push('All 15 resting art scans have zero straight dark seams; positive control rejected');
  metrics.contrast=[];
  for(const width of [1440,1024,400]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height:width===400?800:900,deviceScaleFactor:1,mobile:false});
    await evaluate(`window.scrollTo({top:0,behavior:'instant'});Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));`);
    const height=await evaluate('document.documentElement.scrollHeight');
    for(let y=0;y<height;y+=600){
      await evaluate(`scrollTo({top:${y},behavior:'instant'})`); await delay(35);
      metrics.contrast.push(await contrastScan('homepage-'+width+'-'+y));
    }
    await evaluate(`document.querySelector('[data-organism-status]').scrollIntoView({behavior:'instant',block:'center'});document.querySelector('[data-organism-status]').click()`);await delay(100);
    metrics.contrast.push(await contrastScan('specimen-sheet-'+width));
    await screenshot('polished-sheet-'+width);
    await evaluate(`document.querySelector('#specimen-sheet [data-sheet-close]').click();document.querySelector('#systems').scrollIntoView({behavior:'instant'});document.querySelector('#loop-tab-3').click()`);await delay(100);
    metrics.contrast.push(await contrastScan('loop-sheet-'+width));
    await evaluate(`document.querySelector('.loop-panels [data-sheet-close]').click()`);
  }
  assert.deepEqual(metrics.contrast.flatMap(scan=>scan.failures), [], 'Every audited text token clears its AA threshold against rendered background pixels');
  checks.push('AA contrast at all three widths and in both glass sheets; darkest gradient stop does not reduce original text luminance');
  await record('Revisiting a heading does not replay its arrival', `__jobs.filter(j=>j.duration===420&&j.target==='organisms-title').length===${organismHeadingArrivals}`);

  // Return visit, delayed witness, interruption, back navigation and accessibility paths.
  await send('Emulation.setEmulatedMedia',{features:[]});
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  async function navigateReady(url=origin) {
    await send('Page.navigate',{url});
    for(let i=0;i<100;i++){if(await evaluate(`document.documentElement?.classList.contains('alive-ready')`))return;await delay(25);}
    throw new Error('Arrival navigation failed');
  }
  await evaluate(`localStorage.setItem('uc-atlas-motion','on');sessionStorage.setItem('test-witness','hold')`);
  await navigateReady(); await delay(1100);
  await record('Same session returns with words only; delayed witness stays invisible', `!__jobs.some(j=>j.duration===2100) && __jobs.some(j=>j.duration===840) && getComputedStyle(document.querySelector('.witness-reading')).visibility==='hidden'`);
  await evaluate('window.__answer()'); await delay(70);
  await record('A late real response starts its own condensation', `document.querySelector('[data-witness]').dataset.witnessState==='ready' && __jobs.at(-1).duration===420 && __jobs.at(-1).target==='witness-reading'`);
  await delay(480);
  await record('Late arrival leaves only the breath', `document.getAnimations().filter(a=>a.playState==='running').length===1`);
  await evaluate(`sessionStorage.removeItem('test-witness');sessionStorage.removeItem('uc-alive-entrance')`);
  await navigateReady(); await delay(180);
  await screenshot('entrance-seed');
  await delay(450); await screenshot('entrance-glass');
  await delay(600); await screenshot('entrance-words');
  await delay(1100);
  await record('Second fresh entrance finishes without retained opacity or filters', `!document.documentElement.hasAttribute('data-entrance') && [...document.querySelectorAll('.living-word,.hero-sub,#nav,.hero-caption > *')].every(e=>!e.style.opacity&&!e.style.filter)`);
  for (const gesture of ['key','click','tap','scroll','pause','hidden','reduced']) {
    await evaluate(`sessionStorage.removeItem('uc-alive-entrance');localStorage.setItem('uc-atlas-motion','on')`);
    await navigateReady(); await delay(80);
    assert.ok(await evaluate(`document.documentElement.hasAttribute('data-entrance')`),`Entrance started for ${gesture}`);
    if(gesture==='key') await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Shift',code:'ShiftLeft',windowsVirtualKeyCode:16});
    if(gesture==='click') await send('Input.dispatchMouseEvent',{type:'mousePressed',x:1000,y:750,button:'left',clickCount:1});
    if(gesture==='tap') {await send('Emulation.setTouchEmulationEnabled',{enabled:true});await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:1000,y:750}]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
    if(gesture==='scroll') await evaluate(`scrollTo({top:80,behavior:'instant'})`);
    if(gesture==='pause') await evaluate(`document.querySelector('#motion-toggle').click()`);
    if(gesture==='reduced') await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    let background;
    if(gesture==='hidden'){background=await send('Target.createTarget',{url:'about:blank'});await send('Target.activateTarget',{targetId:background.targetId});}
    await delay(120);
    await record(`Entrance yields instantly to ${gesture}`, `!document.documentElement.hasAttribute('data-entrance') && [...document.querySelectorAll('.living-word,#nav,.hero-sub')].every(e=>!e.style.opacity&&!e.style.filter) && !document.getAnimations().some(a=>a.playState==='running'&&a.effect.getTiming().duration===2100)`);
    if(background){await send('Target.activateTarget',{targetId:target.targetId});await send('Target.closeTarget',{targetId:background.targetId});}
    if(gesture==='click')await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:1000,y:750,button:'left',clickCount:1});
    await send('Emulation.setEmulatedMedia',{features:[]});
    await send('Emulation.setTouchEmulationEnabled',{enabled:false});
  }
  await evaluate(`sessionStorage.removeItem('uc-alive-entrance');localStorage.setItem('uc-atlas-motion','on')`);
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await navigateReady(); await delay(600);
  await record('Reduced motion on first load is instant with zero animations', `!__jobs.some(j=>j.duration===2100) && document.getAnimations().every(a=>a.playState!=='running') && [...document.querySelectorAll('.living-word')].every(e=>!e.style.opacity&&!e.style.filter)`);
  await send('Emulation.setEmulatedMedia',{features:[]});
  await evaluate(`sessionStorage.removeItem('uc-alive-entrance')`);
  await navigateReady(origin+'#organisms'); await delay(800);
  await record('Direct section links never wait on the entrance', `!__jobs.some(j=>j.duration===2100) && document.querySelector('#organisms').getBoundingClientRect().top<innerHeight`);
  await evaluate(`sessionStorage.removeItem('uc-alive-entrance')`);
  await navigateReady(); await delay(2300);
  await send('Page.navigate',{url:origin+'/architecture'}); await delay(500);
  const history = await send('Page.getNavigationHistory');
  await send('Page.navigateToHistoryEntry',{entryId:history.entries[history.currentIndex-1].id}); await delay(800);
  await record('Actual history back does not replay the entrance', `!document.documentElement.hasAttribute('data-entrance') && !document.getAnimations().some(a=>a.playState==='running'&&a.effect.getTiming().duration===2100)`);
  const deniedStorageScript=await send('Page.addScriptToEvaluateOnNewDocument',{source:`
    const read=Storage.prototype.getItem,write=Storage.prototype.setItem;
    Storage.prototype.getItem=function(key){if(key==='uc-alive-entrance')throw new DOMException('Test storage denial','SecurityError');return read.call(this,key);};
    Storage.prototype.setItem=function(key,value){if(key==='uc-alive-entrance')throw new DOMException('Test storage denial','SecurityError');return write.call(this,key,value);};
  `});
  await navigateReady();await delay(1000);
  await record('Storage denial degrades to words only without a replay or exception', `!__jobs.some(j=>j.duration===2100) && document.querySelector('.living-word') && !document.documentElement.hasAttribute('data-entrance')`);
  await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:deniedStorageScript.identifier});
  await send('Emulation.setEmulatedMedia',{features:[{name:'forced-colors',value:'active'}]});
  await record('Forced colors keeps gradient text readable', `getComputedStyle(document.querySelector('.living-word')).backgroundImage==='none' && getComputedStyle(document.querySelector('.living-word')).color!=='rgba(0, 0, 0, 0)'`);
  await send('Emulation.setEmulatedMedia',{features:[]});
  await send('Emulation.setScriptExecutionDisabled', {value:true});
  await send('Page.navigate', {url:origin}); await delay(350);
  await record('No-JS keeps original loop explanation and hides enhancement controls', `!document.documentElement.classList.contains('alive-ready') && !document.querySelector('.loop-panels').hidden && !document.querySelector('#loop-panel-0').hidden && document.querySelector('[data-organism-status]').hidden`);
  metrics.networkHosts = [...networkHosts];
  assert.deepEqual(metrics.networkHosts, ['127.0.0.1:52498'], 'Isolated witness fixture makes no external requests');
  assert.deepEqual(errors, []);
  await writeFile(resolve(output, 'metrics.json'), JSON.stringify({ checks, metrics, errors, witness: 'isolated fixture; not live production proof' }, null, 2));
  console.log(JSON.stringify({ checks: checks.length, idleFrames:metrics.idleFrames,idleAnimations:metrics.idleAnimations,
    entranceAcceleratedLayersMax:metrics.entranceAcceleratedLayersMax,edgeScans:metrics.edgeScans.length,contrastFailures:metrics.contrast.flatMap(s=>s.failures).length,errors }));
} finally {
  let browserClosed = false;
  if (send && socket?.readyState === WebSocket.OPEN) await send('Browser.close', {}, null).then(()=>{browserClosed=true;}).catch(() => {});
  socket?.close(); chrome?.kill(); preview?.kill();
  await delay(250);
  let previewStopped = false;
  try { await fetch(origin); } catch { previewStopped = true; }
  await writeFile(resolve(output, 'lifecycle.json'), JSON.stringify({ browserClosed, previewStopped,
    chrome:{pid:chrome?.pid,exitCode:chrome?.exitCode,signalCode:chrome?.signalCode},
    preview:{pid:preview?.pid,exitCode:preview?.exitCode,signalCode:preview?.signalCode} },null,2));
  await writeFile(resolve(output, 'chrome.log'), chromeLog);
}
