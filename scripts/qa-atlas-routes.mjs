// Read-only browser QA. Writes only phase2-routes* artifacts; never submits chat.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { publicRoutes } from './apply-atlas-shell.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'artifacts/living-atlas-qa');
const origin = new URL(process.env.ATLAS_PREVIEW_URL || 'http://localhost:52498').origin;
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(origin).hostname)) {
  throw new Error('Route QA is restricted to a loopback preview.');
}
const modulePath = process.env.ATLAS_PUPPETEER_PATH || '/Users/jesuscasares/Documents/Lizard Solutions/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
const { default: puppeteer } = await import(pathToFileURL(modulePath));
const routes = [...new Set(['/', ...publicRoutes])];
const representatives = new Set([
  '/', '/home', '/architecture', '/philosophy', '/vision', '/build-with-us',
  '/organisms', '/organisms/visual-cortex', '/organisms/infinity-mirror',
  '/organisms/financial-organisms', '/organisms/brain-cell-architecture',
  '/organisms/research-organisms', '/organisms/infinity-mirror/experience',
  '/proof', '/proof/ledger', '/transmissions',
  '/transmissions/01-entropy-of-agents', '/transmissions/35-the-ledger-learned-to-be-witnessed',
]);
const narrowRoutes = [...representatives].filter(route => routes.includes(route));
const selected = process.env.ATLAS_QA_ROUTES?.split(',').filter(Boolean);
const explicitCases = process.env.ATLAS_QA_CASES ? JSON.parse(process.env.ATLAS_QA_CASES) : null;
if (explicitCases && (!Array.isArray(explicitCases) || explicitCases.some(item => !routes.includes(item.route) || ![320, 390, 1440].includes(item.width)))) throw new Error('Invalid targeted cases.');
const skipPreferences = process.env.ATLAS_QA_SKIP_PREFERENCES === '1';
const preferencesOnly = process.env.ATLAS_QA_PREFERENCES_ONLY === '1';
const label = process.env.ATLAS_QA_LABEL || (preferencesOnly ? 'preferences' : selected ? 'focused' : '');
if (label && !/^[a-z0-9-]+$/.test(label)) throw new Error('Invalid artifact label.');
const artifactPrefix = `phase2-routes${label ? `-${label}` : ''}`;
if (selected?.some(route => !routes.includes(route))) throw new Error('Unknown route filter.');
const crawlRoutes = explicitCases ? [...new Set(explicitCases.map(item => item.route))] : selected || routes;
const widths = process.env.ATLAS_QA_WIDTHS?.split(',').map(Number) || [1440, 390];
if (widths.some(width => ![320, 390, 1440].includes(width))) throw new Error('Unsupported viewport.');
const jobs = preferencesOnly ? [] : explicitCases || widths.flatMap(width => crawlRoutes.map(route => ({ route, width })));
if (!preferencesOnly && !explicitCases && !selected && !widths.includes(320)) jobs.push(...narrowRoutes.map(route => ({ route, width: 320 })));
const report = {
  startedAt: new Date().toISOString(), origin, explicitPublicRoutes: publicRoutes.length,
  distinctRoutesIncludingRoot: routes.length, filtered: Boolean(selected || explicitCases), preferencesSkipped: skipPreferences,
  contract: 'No chat, subscription, external API, or mutating requests. Screenshots are viewport-only.',
  routes: [], persistence: [], screenshots: [], fatal: null,
};
await mkdir(output, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: process.env.ATLAS_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true, timeout: 60000,
  args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  defaultViewport: { width: 1440, height: 1000, deviceScaleFactor: 1 },
});
const slug = route => route === '/' ? 'root' : route.slice(1).replaceAll('/', '-');
const pause = milliseconds => new Promise(done => setTimeout(done, milliseconds));

async function monitoredPage(context) {
  const page = await context.newPage();
  page.setDefaultNavigationTimeout(30000);
  page.setDefaultTimeout(5000);
  const events = { jsErrors: [], httpErrors: [], networkErrors: [], blocked: [], consoleErrors: [] };
  const blocked = new WeakSet();
  await page.setRequestInterception(true);
  page.on('request', request => {
    const url = new URL(request.url());
    const sameOrigin = url.origin === origin;
    const externalAPI = !sameOrigin && ['fetch', 'xhr', 'websocket', 'eventsource', 'ping'].includes(request.resourceType());
    const localAPI = sameOrigin && url.pathname.startsWith('/api/');
    const allowedLocalAPI = ['/api/status', '/api/search', '/api/grounding'].includes(url.pathname);
    if (!['GET', 'HEAD'].includes(request.method()) || externalAPI || (localAPI && !allowedLocalAPI)) {
      blocked.add(request);
      events.blocked.push({ url: `${url.origin}${url.pathname}`, method: request.method(), type: request.resourceType() });
      void request.abort('blockedbyclient').catch(() => {});
    } else {
      void request.continue().catch(() => {});
    }
  });
  page.on('pageerror', error => events.jsErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') events.consoleErrors.push(message.text()); });
  page.on('response', response => {
    if (response.status() >= 400) events.httpErrors.push({ url: response.url(), status: response.status(), type: response.request().resourceType() });
  });
  page.on('requestfailed', request => {
    if (!blocked.has(request) && request.failure()?.errorText !== 'net::ERR_ABORTED') {
      events.networkErrors.push({ url: request.url(), error: request.failure()?.errorText, type: request.resourceType() });
    }
  });
  return { page, events, reset: () => Object.values(events).forEach(values => { values.length = 0; }) };
}

async function ready(page, route) {
  const response = await page.goto(new URL(route, origin).href, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('#atlas-brain-launcher'), { timeout: 8000 });
  await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(done => setTimeout(done, 4000))]));
  await page.evaluate(() => { for (const image of document.images) image.loading = 'eager'; });
  let imageTimeout = false;
  try {
    await page.waitForFunction(() => [...document.images].every(image => image.complete), { timeout: 8000 });
  } catch { imageTimeout = true; }
  // A background headless tab may never receive RAF; readiness must stay bounded.
  await page.waitForFunction(() => document.readyState !== 'loading' && document.body?.getBoundingClientRect().width > 0, { timeout: 4000 });
  await pause(180);
  return { status: response?.status(), imageTimeout };
}

async function inspect(page) {
  return page.evaluate(() => {
    const cssPath = element => {
      if (element.id) return `#${CSS.escape(element.id)}`;
      const classes = [...element.classList].slice(0, 4).map(name => `.${CSS.escape(name)}`).join('');
      return `${element.tagName.toLowerCase()}${classes}`;
    };
    const visible = element => {
      const style = getComputedStyle(element);
      return element.getClientRects().length && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0;
    };
    const docWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    const overflowNodes = docWidth > innerWidth + 1 ? [...document.querySelectorAll('body *')]
      .filter(visible).map(element => {
        const rect = element.getBoundingClientRect(), style = getComputedStyle(element);
        return { selector: cssPath(element), left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width), display: style.display, minWidth: style.minWidth, whiteSpace: style.whiteSpace, overflowX: style.overflowX };
      }).filter(node => node.right > innerWidth + 1 || node.left < -1).sort((a, b) => b.right - a.right).slice(0, 18) : [];
    const badImages = [...document.images].filter(image => !image.complete || image.naturalWidth === 0)
      .map(image => ({ src: image.currentSrc || image.src, complete: image.complete, hidden: !visible(image) }));
    const rgba = value => {
      const values = value.match(/[\d.]+/g)?.map(Number);
      return values && values.length >= 3 ? [...values.slice(0, 3), values[3] ?? 1] : [0, 0, 0, 0];
    };
    const blend = (front, back) => front.slice(0, 3).map((channel, i) => channel * front[3] + back[i] * (1 - front[3]));
    const luminance = rgb => rgb.map(channel => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    }).reduce((value, channel, i) => value + channel * [0.2126, 0.7152, 0.0722][i], 0);
    const historical = document.body.classList.contains('transmission-body');
    const samples = historical ? [...document.querySelectorAll('.blog-main h1,.blog-subtitle,.blog-content p,.blog-content h2,.blog-content h3,.blog-content li,.blog-content strong')]
      .filter(element => visible(element) && element.textContent.trim().length > 4).slice(0, 100).map(element => {
        const ancestors = []; for (let node = element; node; node = node.parentElement) ancestors.unshift(node);
        let background = [255, 255, 255], uncertainBackground = false;
        for (const node of ancestors) {
          const style = getComputedStyle(node);
          background = blend(rgba(style.backgroundColor), background);
          if (style.backgroundImage !== 'none' || Number(style.opacity) < 0.99) uncertainBackground = true;
        }
        const style = getComputedStyle(element), foreground = blend(rgba(style.color), background);
        const light = luminance(foreground), dark = luminance(background);
        const ratio = (Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05);
        const size = parseFloat(style.fontSize), weight = parseInt(style.fontWeight, 10);
        const threshold = size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5;
        return { selector: cssPath(element), text: element.textContent.trim().slice(0, 90), color: style.color, background: background.map(Math.round), ratio: Number(ratio.toFixed(2)), threshold, uncertainBackground };
      }) : [];
    return {
      title: document.title, lang: document.documentElement.lang, bodyClass: document.body.className,
      shell: document.body.dataset.atlasShell, viewport: innerWidth, documentWidth: docWidth,
      overflowPixels: Math.max(0, docWidth - innerWidth), overflowNodes,
      imageCount: document.images.length, badImages,
      launcherCount: document.querySelectorAll('#atlas-brain-launcher').length,
      visibleLauncherCount: [...document.querySelectorAll('.atlas-brain-launcher')].filter(visible).length,
      historicalLegibility: historical ? { sampled: samples.length, darkBody: luminance(rgba(getComputedStyle(document.body).backgroundColor)) < 0.05, failures: samples.filter(sample => !sample.uncertainBackground && sample.ratio + 0.02 < sample.threshold), uncertain: samples.filter(sample => sample.uncertainBackground).length, samples: samples.slice(0, 8) } : null,
    };
  });
}

async function checkMenu(page) {
  const selector = await page.evaluate(() => ['#nav-toggle', '#menu-toggle'].find(value => {
    const element = document.querySelector(value);
    return element && element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden';
  }) || null);
  if (!selector) return { present: false };
  const state = () => page.evaluate(() => Boolean(document.querySelector('#mobile-menu[open], #nav-links.open, #nav.menu-open')));
  await page.click(selector);
  await pause(220);
  const opened = await state();
  await page.keyboard.press('Escape');
  await pause(140);
  const escapeClosed = !(await state());
  const focusRestored = await page.$eval(selector, element => document.activeElement === element);
  if (!escapeClosed) { await page.click(selector); await pause(140); }
  return { present: true, selector, opened, escapeClosed, focusRestored, closed: !(await state()) };
}

async function screenshot(page, route, width, suffix = '') {
  const name = `${artifactPrefix}-${width}-${slug(route)}${suffix}.png`;
  await page.screenshot({ path: resolve(output, name), fullPage: false });
  report.screenshots.push(name);
}

let finished = 0;
async function worker() {
  const context = await browser.createBrowserContext();
  const monitor = await monitoredPage(context);
  const { page, events, reset } = monitor;
  try {
    for (let job; (job = jobs.shift());) {
      const { route, width } = job;
      reset();
      const result = { route, width, defects: [] };
      try {
        await page.setViewport({ width, height: width === 1440 ? 1000 : 844, deviceScaleFactor: 1 });
        Object.assign(result, await ready(page, route), await inspect(page));
        if (result.status !== 200) result.defects.push(`HTTP ${result.status}`);
        if (result.shell !== 'v2') result.defects.push('Missing shared shell');
        if (result.overflowPixels > 1) result.defects.push(`Horizontal overflow ${result.overflowPixels}px`);
        if (result.badImages.length) result.defects.push(`${result.badImages.length} unloaded/broken images`);
        if (result.launcherCount !== 1 || result.visibleLauncherCount !== 1) result.defects.push('Brain launcher count/visibility');
        if (result.historicalLegibility?.failures.length) result.defects.push(`${result.historicalLegibility.failures.length} historical text contrast failures`);
        if (representatives.has(route) && (width !== 320 || explicitCases)) {
          await screenshot(page, route, width);
          if (result.historicalLegibility) {
            await page.$eval('.blog-content', element => element.scrollIntoView({ behavior: 'instant', block: 'start' }));
            await pause(100);
            await screenshot(page, route, width, '-body');
            await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
          }
        }
        if (width === 390) {
          result.menu = await checkMenu(page);
          if (result.menu.present && (!result.menu.opened || !result.menu.closed)) result.defects.push('Mobile menu does not open/close');
          if (result.menu.present && !result.menu.escapeClosed) result.defects.push('Escape does not close mobile menu');
          if (result.menu.present && result.menu.escapeClosed && !result.menu.focusRestored) result.defects.push('Escape does not restore menu-toggle focus');
        }
      } catch (error) { result.defects.push(`QA exception: ${error.message}`); }
      result.events = structuredClone(events);
      if (events.jsErrors.length) result.defects.push(`${events.jsErrors.length} uncaught JS errors`);
      if (events.httpErrors.length) result.defects.push(`${events.httpErrors.length} HTTP resource/API errors`);
      if (events.networkErrors.length) result.defects.push(`${events.networkErrors.length} failed resource requests`);
      report.routes.push(result);
      finished++;
      if (result.defects.length) console.log('ISSUE', width, route, result.defects.join('; '), JSON.stringify(events.httpErrors));
      if (finished % 10 === 0) console.log(`Progress ${finished}: ${report.routes.filter(item => item.defects.length).length} route/viewport cases with findings`);
    }
  } finally { await context.close(); }
}

async function checkPersistence() {
  const context = await browser.createBrowserContext();
  const { page } = await monitoredPage(context);
  try {
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    await ready(page, '/');
    await page.click('#lang-toggle');
    // Strict real-pointer check: no centering workaround or DOM activation for a pass.
    // The final build makes this the same fixed-left control as the deeper routes.
    await pause(120);
    report.motionPointerTarget = await page.evaluate(() => {
      const button = document.querySelector('#motion-toggle'), box = button.getBoundingClientRect();
      const target = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
      return { hit: target === button || button.contains(target), target: target?.outerHTML.slice(0, 350), position: getComputedStyle(button).position, left: box.left, right: box.right, top: box.top, bottom: box.bottom };
    });
    await page.click('#motion-toggle');
    let confirmedPointerActivation = report.motionPointerTarget.hit;
    try {
      await page.waitForFunction(() => localStorage.getItem('uc-atlas-motion') === 'off' && document.documentElement.classList.contains('motion-paused'), { timeout: 2000, polling: 100 });
    } catch { confirmedPointerActivation = false; }
    report.preferenceActivation = await page.evaluate(() => {
      const button = document.querySelector('#motion-toggle');
      const box = button.getBoundingClientRect();
      const target = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
      return { savedMotion: localStorage.getItem('uc-atlas-motion'), paused: document.documentElement.classList.contains('motion-paused'), disabled: button.disabled, control: button.outerHTML, clickTarget: target?.outerHTML.slice(0, 450), scrollY };
    });
    report.preferenceActivation.confirmedPointerActivation = confirmedPointerActivation;
    if (report.preferenceActivation.savedMotion !== 'off') {
      // Distinguish a pointer-hit problem from persistence after actual activation.
      await screenshot(page, '/', 390, '-motion-pointer');
      await page.$eval('#motion-toggle', button => button.click());
      await pause(100);
      report.preferenceActivation.afterDOMActivation = await page.evaluate(() => ({ savedMotion: localStorage.getItem('uc-atlas-motion'), paused: document.documentElement.classList.contains('motion-paused') }));
    }
    const sequence = ['/', '/architecture', '/organisms/visual-cortex', '/transmissions/01-entropy-of-agents', '/transmissions/02-deploying-agents-on-chain', '/transmissions/35-the-ledger-learned-to-be-witnessed', '/home', '/lab'];
    for (const route of sequence) {
      await ready(page, route);
      const result = await page.evaluate(() => ({
        lang: document.documentElement.lang, savedLanguage: localStorage.getItem('uc-lang'),
        savedMotion: localStorage.getItem('uc-atlas-motion'), paused: document.documentElement.classList.contains('motion-paused'),
        motionState: document.documentElement.dataset.atlasMotionState,
        launcher: document.querySelector('#atlas-brain-launcher')?.textContent,
      }));
      report.persistence.push({ route, ...result, pass: result.lang.startsWith('es') && result.savedLanguage === 'es' && result.savedMotion === 'off' && result.paused && result.launcher?.includes('Pregunta') });
    }
  } catch (error) { report.persistence.push({ pass: false, error: error.message }); }
  finally { await context.close(); }
}

try {
  console.log(`Crawling ${crawlRoutes.length} public routes; ${jobs.length} viewport cases; ${representatives.size} representative screenshot routes.`);
  if (jobs.length) await Promise.all(Array.from({ length: 3 }, () => worker()));
  if (!skipPreferences) await checkPersistence();
} catch (error) { report.fatal = error.stack; }
finally {
  await browser.close();
  report.completedAt = new Date().toISOString();
  report.routes.sort((a, b) => a.route.localeCompare(b.route) || b.width - a.width);
  const issues = report.routes.filter(result => result.defects.length);
  report.summary = {
    checkedCases: report.routes.length, routesChecked: new Set(report.routes.map(result => result.route)).size,
    casesWithFindings: issues.length, persistencePassed: skipPreferences ? null : report.persistence.every(result => result.pass),
    motionPointerPassed: skipPreferences ? null : report.preferenceActivation?.confirmedPointerActivation === true,
    menuEscapeFailures: report.routes.filter(result => result.menu?.present && !result.menu.escapeClosed).map(result => result.route),
    screenshotCount: report.screenshots.length,
    unexpectedMutatingRequests: report.routes.flatMap(result => result.events?.blocked || []).filter(request => !['GET', 'HEAD'].includes(request.method)).length,
  };
  await writeFile(resolve(output, `${artifactPrefix}-report.json`), JSON.stringify(report, null, 2) + '\n');
  const lines = ['# Phase 2 public route QA', '', `Preview: ${origin}`, `Completed: ${report.completedAt}`, '',
    `Checked ${report.summary.routesChecked} routes across ${report.summary.checkedCases} viewport cases. ${issues.length} cases have findings. Saved ${report.screenshots.length} viewport screenshots.`, '',
    '## Findings', '', ...issues.map(result => `- ${result.width}px ${result.route}: ${result.defects.join('; ')}`),
    ...(issues.length ? [] : ['No route-crawl defects found.']), '', '## Cross-route preferences', '',
    ...report.persistence.map(result => `- ${result.pass ? 'PASS' : 'FAIL'} ${result.route || ''}: ${result.error || `language=${result.lang}, motion=${result.savedMotion}, paused=${result.paused}`}`), '',
    skipPreferences ? 'Preference checks were not repeated in this targeted fix verification; see the final full-run report.' : `Motion button pointer activation: ${report.summary.motionPointerPassed ? 'PASS (storage and paused state confirmed before navigation)' : 'FAIL; see activation diagnostics in JSON'}.`, '',
    '## Mobile menu Escape behavior', '',
    ...(report.summary.menuEscapeFailures.length ? report.summary.menuEscapeFailures.map(route => `- Escape does not close the menu on ${route}; the toggle button does close it.`) : ['Escape closes every tested mobile menu.']), '',
    'No chat or subscription submissions were made. Non-read-only and external API browser requests were blocked. External static assets were allowed. Contrast sampling is a diagnostic, not a complete accessibility audit. Brain conversation/source flows are owned by the main agent.',
    ...(report.fatal ? ['', 'Fatal QA error:', '```', report.fatal, '```'] : []), ''];
  await writeFile(resolve(output, `${artifactPrefix}-summary.md`), lines.join('\n'));
  await new Promise(done => process.stdout.write(JSON.stringify(report.summary) + '\n', done));
  const exitCode = issues.length || report.fatal || report.summary.persistencePassed === false || report.summary.motionPointerPassed === false ? 1 : 0;
  // Browser and artifacts are already closed/flushed; do not retain Puppeteer timers.
  process.exit(exitCode);
}
