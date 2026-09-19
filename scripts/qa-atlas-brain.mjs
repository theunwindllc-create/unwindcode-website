// Real local retrieval plus isolated browser fixtures. No remote chat prompts.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const {default:puppeteer} = await import(pathToFileURL(process.env.ATLAS_PUPPETEER_PATH));
const origin = process.env.ATLAS_PREVIEW_URL || 'http://localhost:52498';
const output = new URL('../artifacts/living-atlas-qa/', import.meta.url);
await mkdir(output,{recursive:true});
const browser = await puppeteer.launch({executablePath:process.env.ATLAS_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'],timeout:60000});
const checks=[]; const errors=[]; const pass=name=>{checks.push(name);console.log('PASS',name)};
try {
 const page = await browser.newPage();
 await page.setViewport({width:1440,height:1000});
 page.on('pageerror',e=>errors.push(e.message));
 let requests=[]; let fixture=null;
 await page.setRequestInterception(true);
 page.on('request',req=>{
   const url=new URL(req.url());
   if(['/api/chat','/api/grounding'].includes(url.pathname)) {
     requests.push({path:url.pathname,body:req.postData()});
     if(fixture && url.pathname==='/api/chat') {req.respond({status:fixture.status,contentType:'application/json',headers:fixture.headers||{},body:JSON.stringify(fixture.body)});return;}
   }
   req.continue();
 });
 await page.goto(origin,{waitUntil:'networkidle0'});
 await page.waitForSelector('#atlas-brain-launcher');
 await page.click('#atlas-brain-launcher');
 assert.equal(requests.length,0);
 assert.equal(await page.$eval('#atlas-brain-tab-sources',e=>e.getAttribute('aria-selected')),'true');
 assert.equal(await page.evaluate(()=>document.activeElement.id),'atlas-brain-input');
 await page.click('#atlas-brain-panel-sources .atlas-brain-suggestion');
 assert.equal(requests.length,0);
 pass('Opening and suggested questions do not send requests');
 await page.click('.atlas-brain-submit');
 await page.waitForSelector('.atlas-brain-source');
 assert.equal(requests.length,1);
 assert.ok(await page.$$eval('.atlas-brain-citation[href]',els=>els.length)>0);
 assert.ok(await page.$eval('#atlas-brain-panel-sources .atlas-brain-history',e=>e.textContent.includes('answer generation disabled')));
 await page.screenshot({path:new URL('phase2-brain-sources.png',output).pathname});
 pass('Actual local grounding packet renders citations, qualifications and retrieval boundary');
 await page.keyboard.press('Escape');
 await page.waitForFunction(()=>!document.getElementById('atlas-brain-dialog').open);
 await page.waitForFunction(()=>document.activeElement.id==='atlas-brain-launcher');
 pass('Escape closes modal and restores launcher focus');
 await page.click('#atlas-brain-launcher');
 await page.click('#atlas-brain-tab-conversation');
 async function submit(text){
   await page.$eval('#atlas-brain-input',(e,value)=>{e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));},text);
   await page.click('.atlas-brain-submit');
   await page.waitForFunction(()=>!document.querySelector('.atlas-brain-submit').disabled);
 }
 fixture={status:200,body:{success:true,reply:'Fixture reply <script>window.__unsafe=true</script>',conversation_id:'fixture-123'}};
 await submit('Hello fixture');
 assert.equal(await page.evaluate(()=>window.__unsafe),undefined);
 assert.ok(await page.$eval('#atlas-brain-panel-conversation',e=>e.textContent.includes('<script>')));
 await submit('Second fixture');
 assert.equal(JSON.parse(requests.at(-1).body).conversation_id,'fixture-123');
 pass('Isolated 200 replies render as text and carry current-document conversation ID');
 const packet=(await(await fetch(`${origin}/api/grounding?q=architecture`)).json()).packet;
 fixture={status:409,body:{success:false,reply:'FORBIDDEN FREEFORM',display:{mode:'grounding_review_required',component:'citation_review_card',answer_generation:'disabled',allow_freeform_answer:false,render_required:true,render_citations:true,render_claim_qualifications:true,render_refusal_rules:true},grounding:packet}};
 await submit('Review fixture');
 await page.waitForSelector('#atlas-brain-panel-conversation .atlas-brain-packet');
 const text=await page.$eval('#atlas-brain-panel-conversation',e=>e.textContent);
 assert.ok(!text.includes('FORBIDDEN FREEFORM'));
 for(const rule of packet.refusal_rules) assert.ok(text.includes(rule));
 for(const q of packet.required_qualifications) assert.ok(text.includes(q.interpretation_boundary));
 assert.equal(await page.$eval('#atlas-brain-input',e=>e.value),'Review fixture');
 pass('409 preserves every qualification and refusal rule without displaying a freeform reply');
 for(const [status,expected] of [[400,'not accepted'],[403,'not authorized'],[429,'Too many'],[502,'could not complete'],[503,'unavailable']]){
   fixture={status,headers:{'retry-after':'7'},body:{error:'SECRET_PROVIDER_DETAIL'}};
   await submit(`Failure fixture ${status}`);
   const message=await page.$eval('#atlas-brain-status',e=>e.textContent);
   assert.ok(message.includes(expected),message);
   assert.ok(!message.includes('SECRET_PROVIDER_DETAIL'));
   assert.equal(await page.$eval('#atlas-brain-input',e=>e.value),`Failure fixture ${status}`);
 }
 pass('400/403/429/502/503 failures retain drafts and conceal provider details');
 fixture={status:200,body:{success:true,reply:'UNAPPROVED',conversation_id:'bad id'}};
 await submit('Malformed fixture');
 assert.ok(await page.$eval('#atlas-brain-status',e=>e.textContent.includes('unreadable')));
 pass('Malformed response fails closed');
 const count=requests.length;
 await submit('Two\nlines');
 assert.equal(requests.length,count);
 pass('Client rejects control characters without sending');
 await page.keyboard.press('Escape');
 await page.click('#lang-toggle');
 await page.click('#atlas-brain-launcher');
 assert.equal(await page.$eval('#atlas-brain-dialog',e=>e.lang),'es');
 assert.ok(await page.$eval('#atlas-brain-tab-sources',e=>e.textContent.includes('Fuentes')));
 assert.ok(await page.$eval('#atlas-brain-panel-conversation',e=>e.textContent.includes('Fixture reply')));
 for(const width of [320,390,768]){
   await page.setViewport({width,height:844});
   await page.waitForFunction(()=>!document.querySelector('.atlas-brain-shell').getAnimations().some(a=>a.playState==='running'));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const bounds=await page.$eval('#atlas-brain-dialog',e=>({client:e.clientWidth,scroll:e.scrollWidth,overflow:[...e.querySelectorAll('*')].filter(n=>n.getBoundingClientRect().right>e.getBoundingClientRect().right+1).slice(0,6).map(n=>n.className)}));
   assert.ok(bounds.scroll<=bounds.client,JSON.stringify({width,...bounds}));
 }
 await page.setViewport({width:390,height:844});
 await page.click('#atlas-brain-tab-sources');
 await page.screenshot({path:new URL('phase2-brain-mobile-es.png',output).pathname});
 for(let i=0;i<22;i++){await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.getElementById('atlas-brain-dialog').contains(document.activeElement)));}
 pass('Spanish dynamic wrappers preserve original replies; modal fits 320/390/768 and contains keyboard focus');
 await page.keyboard.press('Escape');
 await page.goto(`${origin}/home`,{waitUntil:'networkidle0'});
 assert.equal(await page.$$eval('#atlas-brain-launcher',e=>e.length),1);
 await page.click('#open-chat');
 assert.equal(await page.$eval('#atlas-brain-dialog',e=>e.open),true);
 assert.equal(await page.$eval('#chat-modal',e=>e.classList.contains('open')),false);
 pass('Legacy console uses the single shared dialog');
 assert.deepEqual(errors,[]);
 pass('No browser script errors');
 await writeFile(new URL('phase2-brain-report.json',output),JSON.stringify({checks,errors,liveProviderTested:false,fixturesClearlyIsolated:true},null,2));
} finally {await browser.close();}
