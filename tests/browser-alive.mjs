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
    else if (message.method === 'LayerTree.layerTreeDidChange') layers = message.params.layers || [];
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
    const nativeFrame = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = callback => nativeFrame(time => { window.__frames++; callback(time); });
    const nativeFetch = window.fetch.bind(window);
    window.fetch = (url, options) => String(url).startsWith('https://rt6ds-eqaaa-aaaad-agv7q-cai.raw.icp0.io/')
      ? Promise.resolve(new Response(JSON.stringify({ total_beats: 123, organs: [{ organ: 'first-body', age_seconds: 65, seq: 20 }] }), { status: 200 }))
      : nativeFetch(url, options);
  ` });
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: origin });
  for (let i = 0; i < 70; i++) {
    if (await evaluate(`document.documentElement.classList.contains('alive-ready')`)) break;
    if (i === 69) throw new Error('Alive failed to initialize');
    await delay(100);
  }
  await evaluate('document.fonts.ready'); await delay(4000);
  async function record(name, expression) {
    const result = await evaluate(expression);
    if (!result) {
      await screenshot('failure');
      console.log('FAIL DETAIL', JSON.stringify({name, errors, state: await evaluate(`({status:document.querySelector('[data-registry-status]')?.textContent,open:document.querySelector('#specimen-sheet')?.open,active:document.activeElement?.outerHTML})`)}));
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
  await record('Refraction shifts 9px opposite the hand and distant seed dims', `(()=>{const s=document.querySelector('.hero-art').style;return s.getPropertyValue('--refract-x')==='-9px' && s.getPropertyValue('--refract-y')==='9px' && Number(s.getPropertyValue('--seed-strength'))<.3;})()`);
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...crossing });
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
  await record('Specimen remains lit with translucent rounded sheet and text dismiss', `(()=>{const s=document.querySelector('#specimen-sheet'),c=getComputedStyle(s);return s.closest('.specimen').querySelector('[data-sheet-lit][data-alive-lit]') && c.backgroundColor==='rgba(22, 18, 30, 0.55)' && c.borderRadius==='26px' && c.backdropFilter.includes('blur(24px)') && s.querySelector('[data-sheet-close]').textContent==='dismiss';})()`);
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
  await send('Emulation.setScriptExecutionDisabled', {value:true});
  await send('Page.navigate', {url:origin}); await delay(350);
  await record('No-JS keeps original loop explanation and hides enhancement controls', `!document.documentElement.classList.contains('alive-ready') && !document.querySelector('.loop-panels').hidden && !document.querySelector('#loop-panel-0').hidden && document.querySelector('[data-organism-status]').hidden`);
  metrics.networkHosts = [...networkHosts];
  assert.deepEqual(metrics.networkHosts, ['127.0.0.1:52498'], 'Isolated witness fixture makes no external requests');
  assert.deepEqual(errors, []);
  await writeFile(resolve(output, 'metrics.json'), JSON.stringify({ checks, metrics, errors, witness: 'isolated fixture; not live production proof' }, null, 2));
  console.log(JSON.stringify({ checks: checks.length, metrics, errors }));
} finally {
  if (send && socket?.readyState === WebSocket.OPEN) await send('Browser.close', {}, null).catch(() => {});
  socket?.close(); chrome?.kill(); preview?.kill();
  await writeFile(resolve(output, 'chrome.log'), chromeLog);
}
