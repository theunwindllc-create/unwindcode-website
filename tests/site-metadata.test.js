import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

const pageChecks = [
  ['../index.html', ['AI Organisms Built With Proof', 'application/ld+json', '/organisms', '/proof']],
  ['../organisms/index.html', ['Visual Cortex', 'Infinity Mirror', 'Financial Organisms', 'Brain Cell Architecture', 'Research Organisms']],
  ['../architecture/index.html', ['Cortex', 'Memory', 'Gateway', 'Immune System', 'Proof Loop']],
  ['../proof/index.html', ['Transmission 21', 'Transmission 22', 'Transmission 23', 'Transmission 24']],
  ['../llms.txt', ['AI organisms', 'Organisms vs apps', 'Collaboration Paths', 'https://www.unwindcode.ai/organisms', 'Proof Loop']],
  ['../ai-services.json', ['defined_terms', 'collaboration_paths', 'subscription_signal_paths', 'conversation_gateway', 'proof_route_questions', 'engagement_modes', 'organism_architecture', 'web3_simulation', 'human_approval']],
  ['../assets/specs/infinity-mirror-implementation-packet.json', ['infinity-mirror-implementation-packet', 'remix_design_concept_review', 'block_until_proof', 'Public deployment remains gated by explicit approval.']],
  ['../assets/specs/infinity-mirror-experience-audit.md', ['Infinity Mirror Experience Audit', 'Information Architecture', 'Storytelling Flow', 'Scroll Choreography', 'Performance Techniques', 'Non-Clone Boundary']],
  ['../assets/specs/unwindcode-experience-evolution-audit.md', ['UnwindCode.ai Experience Evolution Audit', 'UX Audit', 'Design Research', 'Information Architecture Improvements', 'Motion Architecture', 'Mobile Strategy', 'SEO Preservation', 'React Architecture', 'Next.js Structure', 'Framer Motion Specs', 'Three.js Opportunities', 'Design Tokens', 'Performance Budgets', 'Non-Clone Boundary']],
  ['../assets/specs/infinity-mirror-runtime-code-handoff.md', ['Infinity Mirror Runtime Code Handoff', 'DesireTranslationWall.tsx', 'MirrorRouteCompass.tsx', 'RecursiveBrainTunnel.tsx', 'BrainCellNetwork.tsx', 'BrainRouteConsole.tsx', 'BrainSignalHandoff.client.tsx', 'LivingOrganismVisualizer.tsx', 'RecursiveGrowthTimeline.tsx', 'CognitiveEvolutionTrace.tsx', 'FloatingArchitectureMaps.tsx', 'PhaseProofLedger.tsx', 'ProofCascade.tsx', 'MirrorStateSequencer.client.tsx', 'ProofObservatory.client.tsx', 'ScrollChoreographyMap.tsx', 'EmotionalProgressionRail.client.tsx', 'MotionContractLedger.tsx', 'ExperienceAuditConsole.tsx', 'SourceTranslationLedger.tsx', 'EngineTranslationLedger.tsx', 'InterfaceBuildLedger.tsx', 'RuntimeHandoffMatrix.tsx', 'MirrorDepthGate.tsx', 'InfinitySymbolLanguage.tsx', 'FirstArtifactRouter.tsx', 'EvolutionEntryProtocol.tsx', 'MirrorChapterMotion.client.tsx', 'MirrorPortalTimeline.client.tsx', 'MirrorBrainTunnelGate.client.tsx', 'tailwind.config.ts', 'Deploy only after explicit approval.']],
  ['../assets/specs/infinity-mirror-runtime-kit/README.md', ['Infinity Mirror Runtime Kit', 'app/organisms/infinity-mirror/experience/page.tsx', 'DesireTranslationWall.tsx', 'MirrorRouteCompass.tsx', 'RecursiveBrainTunnel.tsx', 'BrainCellNetwork.tsx', 'BrainRouteConsole.tsx', 'BrainSignalHandoff.client.tsx', 'LivingOrganismVisualizer.tsx', 'RecursiveGrowthTimeline.tsx', 'CognitiveEvolutionTrace.tsx', 'FloatingArchitectureMaps.tsx', 'PhaseProofLedger.tsx', 'ProofCascade.tsx', 'MirrorStateSequencer.client.tsx', 'ProofObservatory.client.tsx', 'AuthorityGradient.tsx', 'ScrollChoreographyMap.tsx', 'EmotionalProgressionRail.client.tsx', 'MotionContractLedger.tsx', 'ExperienceAuditConsole.tsx', 'SourceTranslationLedger.tsx', 'EngineTranslationLedger.tsx', 'InterfaceBuildLedger.tsx', 'RuntimeHandoffMatrix.tsx', 'MirrorDepthGate.tsx', 'InfinitySymbolLanguage.tsx', 'FirstArtifactRouter.tsx', 'EvolutionEntryProtocol.tsx', 'MirrorPortalTimeline.client.tsx', 'Public deployment waits for explicit approval.']],
  ['../sitemap.xml', ['https://www.unwindcode.ai/organisms', 'https://www.unwindcode.ai/proof']],
];

for (const [relativePath, expectedSnippets] of pageChecks) {
  test(`${relativePath} contains required public positioning snippets`, async () => {
    const source = await readFile(new URL(relativePath, import.meta.url), 'utf8');

    for (const snippet of expectedSnippets) {
      assert.ok(source.includes(snippet), `${relativePath} missing ${snippet}`);
    }
  });
}

const labPages = [
  '../organisms/index.html',
  '../organisms/visual-cortex/index.html',
  '../organisms/infinity-mirror/index.html',
  '../organisms/infinity-mirror/experience/index.html',
  '../organisms/financial-organisms/index.html',
  '../organisms/brain-cell-architecture/index.html',
  '../organisms/research-organisms/index.html',
  '../architecture/index.html',
  '../philosophy/index.html',
  '../vision/index.html',
  '../proof/index.html',
  '../transmissions/index.html',
  '../build-with-us/index.html',
];

for (const relativePath of labPages) {
  test(`${relativePath} exposes shared bilingual lab navigation`, async () => {
    const source = await readFile(new URL(relativePath, import.meta.url), 'utf8');

    assert.ok(source.includes('id="lang-toggle"'), `${relativePath} missing language toggle`);
    assert.ok(source.includes('data-i18n="nav.home"'), `${relativePath} missing translated Home nav`);
    assert.ok(source.includes('href="/" data-i18n="nav.home"'), `${relativePath} missing direct homepage nav route`);
    assert.ok(source.includes('data-i18n="nav.organisms"'), `${relativePath} missing translated Organisms nav`);
    assert.ok(source.includes('data-i18n="nav.architecture"'), `${relativePath} missing translated Architecture nav`);
    assert.ok(source.includes('data-i18n="nav.proof"'), `${relativePath} missing translated Proof nav`);
    assert.ok(source.includes('data-i18n="nav.blog"'), `${relativePath} missing translated Transmissions nav`);
    assert.ok(source.includes('data-i18n="nav.cta"'), `${relativePath} missing translated CTA`);
    assert.ok(source.includes('aria-current="page"'), `${relativePath} missing active page state`);
  });
}

test('language engine and motion layer preserve accessibility preferences', async () => {
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const main = await readFile(new URL('../main.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const mirrorExperience = await readFile(new URL('../organisms/infinity-mirror/experience/index.html', import.meta.url), 'utf8');

  assert.ok(i18n.includes("'nav.proof': 'Proof'"), 'English Proof nav translation missing');
  assert.ok(i18n.includes("'nav.proof': 'Prueba'"), 'Spanish Proof nav translation missing');
  assert.ok(i18n.includes("'nav.home': 'Home'"), 'English Home nav translation missing');
  assert.ok(i18n.includes("'nav.home': 'Inicio'"), 'Spanish Home nav translation missing');
  assert.ok(i18n.includes("'nav.blog': 'Transmissions'"), 'English Transmissions nav translation missing');
  assert.ok(i18n.includes("'nav.blog': 'Transmisiones'"), 'Spanish Transmissions nav translation missing');
  assert.ok(main.includes('prefers-reduced-motion: reduce'), 'runtime should respect reduced motion');
  assert.ok(main.includes('revealHashTarget'), 'runtime should reveal direct hash targets');
  assert.ok(main.includes('scrollToHashTarget'), 'runtime should scroll direct hash targets under the fixed nav');
  assert.ok(main.includes('const hashRevealDelays = [0, 80, 240, 720, 1400, 2400]'), 'runtime should retry direct hashes through early layout shifts');
  assert.ok(main.includes("window.history.scrollRestoration = 'manual'"), 'runtime should avoid restoring stale scroll positions over hash targets');
  assert.ok(main.includes('function getDocumentScrollRoot()'), 'hash scrolling should use an explicit document scroll root helper');
  assert.ok(main.includes('document.scrollingElement || document.documentElement || document.body'), 'hash scrolling should support browser-specific scroll roots');
  assert.ok(main.includes("function scrollToHashTarget(target, { behavior = 'auto' } = {})"), 'hash scrolling should accept deterministic and smooth behavior');
  assert.ok(main.includes('window.scrollTo({ top: nextY, behavior })'), 'hash scrolling should use the chosen behavior');
  assert.ok(main.includes('if (scrollRoot) scrollRoot.scrollTop = nextY'), 'hash scrolling should set the active scroll root');
  assert.ok(main.includes('document.documentElement.scrollTop = nextY'), 'hash scrolling should set the document scroll root');
  assert.ok(main.includes('document.body.scrollTop = nextY'), 'hash scrolling should set the body scroll fallback');
  assert.ok(main.includes("scrollToHashTarget(target, { behavior })"), 'smooth anchors should reuse the fixed-nav aware hash helper');
  assert.ok(main.includes("window.history.pushState(null, '', a.getAttribute('href'))"), 'smooth anchors should keep hash state in sync');
  assert.ok(css.includes('#nav::before'), 'nav should expose a glass refraction layer');
  assert.ok(css.includes('#nav::after'), 'nav should expose a glass morph highlight layer');
  assert.ok(css.includes('rgba(6, 8, 16, 0.34)'), 'nav should stay transparent enough to read as a glass bubble');
  assert.ok(css.includes('backdrop-filter: blur(32px) saturate(178%)'), 'nav should use saturated glass blur');
  assert.ok(css.includes('body.nav-drawer-open::before'), 'mobile nav should dim and blur the page behind the drawer');
  assert.ok(css.includes('@media (max-width: 1240px)'), 'mobile drawer should activate before nav links collide on compact desktop widths');
  assert.ok(css.includes('#nav.menu-open .nav-links'), 'mobile nav should use the menu-open drawer state');
  assert.ok(css.includes('position: fixed'), 'mobile nav drawer should anchor to the viewport instead of squeezing under the nav bar');
  assert.ok(css.includes('top: calc(78px + env(safe-area-inset-top))'), 'mobile nav drawer should open below the glass shell');
  assert.ok(css.includes('right: max(10px, env(safe-area-inset-right))'), 'mobile nav drawer should stay attached to the right edge');
  assert.ok(css.includes('width: min(84vw, 380px)'), 'mobile nav drawer should use a readable right-side sheet width');
  assert.ok(css.includes('backdrop-filter: blur(36px) saturate(185%)'), 'mobile nav drawer should use strong readable glass');
  assert.ok(css.includes('translateX(calc(100% + 18px))'), 'mobile nav drawer should enter from the right');
  assert.ok(css.includes('.nav-links .nav-drawer-cta'), 'mobile nav drawer should expose the primary CTA');
  assert.ok(css.includes('overflow-wrap: anywhere'), 'mobile nav links should not overflow on translated or long labels');
  assert.ok(mirrorExperience.includes('style.css?v=20260615-system-state'), 'Infinity Mirror page should cache-bust the glass nav stylesheet');
  assert.ok(mirrorExperience.includes('main.js?v=20260615-system-state'), 'Infinity Mirror page should cache-bust the glass nav runtime');
  assert.ok(main.includes("navToggle.setAttribute('aria-controls'"), 'mobile nav toggle should identify the controlled drawer');
  assert.ok(main.includes('function setNavDrawerOpen(isOpen)'), 'mobile nav should centralize drawer open state');
  assert.ok(main.includes("document.body.classList.toggle('nav-drawer-open', isOpen)"), 'mobile nav should lock and dim the page through body state');
  assert.ok(main.includes("event.key === 'Escape'"), 'mobile nav should close on Escape');
  assert.ok(css.includes('.mirror-experience-page [id^="mirror-"]'), 'mirror anchors should expose native scroll margins');
  assert.ok(main.includes('requestAnimationFrame(() => revealHashTarget({ scroll: true }))'), 'runtime should scroll direct hashes after layout is ready');
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'CSS should respect reduced motion');
});

test('homepage keeps a clear route back to the home screen during long-scroll exploration', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const main = await readFile(new URL('../main.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');

  for (const snippet of [
    'href="#hero" class="nav-brand" aria-label="Unwind Code home"',
    '<a href="#hero" class="active" aria-current="page" data-i18n="nav.home">Home</a>',
    'class="home-return"',
    'id="home-return"',
    'data-scroll="instant"',
    'data-i18n="homeReturn.label"',
    'data-i18n-aria-label="homeReturn.aria"',
  ]) {
    assert.ok(source.includes(snippet), `homepage missing home navigation snippet ${snippet}`);
  }

  for (const snippet of [
    "'homeReturn.label': 'Home'",
    "'homeReturn.aria': 'Return to home screen'",
    "'homeReturn.label': 'Inicio'",
    "'homeReturn.aria': 'Volver a la pantalla de inicio'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing home return snippet ${snippet}`);
  }

  for (const snippet of [
    '.home-return',
    '.home-return.is-visible',
    '.home-return-mark',
    'right: max(18px, env(safe-area-inset-right))',
    'bottom: max(18px, env(safe-area-inset-bottom))',
    'backdrop-filter: blur(22px) saturate(168%)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing home return snippet ${snippet}`);
  }

  for (const snippet of [
    "const homeReturn = document.getElementById('home-return')",
    'function updateScrollNavigationState()',
    "homeReturn?.classList.toggle('is-visible'",
    'Math.min(360, window.innerHeight * 0.45)',
    "window.addEventListener('scroll', updateScrollNavigationState",
    'updateScrollNavigationState();',
  ]) {
    assert.ok(main.includes(snippet), `runtime missing home return snippet ${snippet}`);
  }
});

test('site-wide experience evolution audit binds visual ambition to proof and state labels', async () => {
  const audit = await readFile(new URL('../assets/specs/unwindcode-experience-evolution-audit.md', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));

  for (const snippet of [
    '# UnwindCode.ai Experience Evolution Audit',
    'Source reference: https://www.anthropic.com/',
    'Boundary: This is a principle translation, not a clone request.',
    'Organisms, not Apps',
    'Infinity Mirror',
    'Brain Cell Architecture',
    'Visual Cortex',
    'Research Organisms',
    'Financial Organisms',
    'Product paths: Visual Cortex, Infinity Mirror, Financial Organisms, Brain Cell Architecture, Research Organisms.',
    'Conversation Gateway | Homepage Brain chat routing and starter prompts | Prototype',
    '### Conversation Gateway Starter Prompts',
    'Expected proof packet',
    'Concept, Research, Prototype, Experimental, or Live',
    '## Backend To Frontend Reflection Matrix',
    'Every animation should explain a system',
    '## Motion Architecture',
    '## Mobile Strategy',
    '## SEO Preservation',
    '## Production Rollout Plan',
    '## Acceptance Criteria',
  ]) {
    assert.ok(audit.includes(snippet), `experience evolution audit missing ${snippet}`);
  }

  for (const snippet of [
    'The UnwindCode.ai Experience Evolution Audit is a site-wide public Markdown contract',
    'https://www.unwindcode.ai/assets/specs/unwindcode-experience-evolution-audit.md',
    'Every future visual, animation, dashboard, map, status card, route, and interaction should represent a real workflow',
  ]) {
    assert.ok(llms.includes(snippet), `llms.txt missing experience evolution snippet ${snippet}`);
  }

  for (const snippet of [
    '"id": "unwindcode_experience_evolution_audit"',
    '"type": "public_experience_evolution_contract"',
    'React/Next structure, Framer specs, Three.js opportunities, design tokens, asset rules, performance budgets, and rollout gates',
    'requiring Concept, Research, Prototype, Experimental, or Live labels',
    'hidden authority, deployment, public posting, Web3 broadcast, identity inference, and hidden memory outside automatic action',
  ]) {
    assert.ok(services.includes(snippet), `ai-services missing experience evolution snippet ${snippet}`);
  }

  const asset = manifest.assets.find(item => item.id === 'unwindcode-experience-evolution-audit');
  assert.ok(asset, 'asset manifest missing UnwindCode experience evolution audit');
  assert.equal(asset.file, 'assets/specs/unwindcode-experience-evolution-audit.md');
  assert.equal(asset.route, '/');
  assert.equal(asset.surface, 'site-wide experience evolution');
  assert.equal(asset.format, 'text/markdown');
  assert.equal(asset.status, 'local-proof');
  assert.match(asset.trust_value, /Concept, Research, Prototype, Experimental, or Live/);
  assert.match(asset.accessibility, /right-side drawer navigation|semantic HTML/);
  assert.match(asset.motion_policy, /trigger, meaning, represented system/);
  assert.deepEqual(asset.performance.dependencies, []);
});

test('public pages expose a governed default social preview image', async () => {
  const transmissionEntries = await readdir(new URL('../transmissions/', import.meta.url));
  const publicPages = [
    '../index.html',
    ...labPages,
    ...transmissionEntries
      .filter(entry => entry.endsWith('.html') && entry !== 'index.html')
      .sort()
      .map(entry => `../transmissions/${entry}`),
  ];
  const previewUrl = 'https://www.unwindcode.ai/assets/social/unwindcode-lab-preview.svg';
  const previewAlt = 'Unwind Code AI organism architecture lab visual';

  for (const relativePath of publicPages) {
    const source = await readFile(new URL(relativePath, import.meta.url), 'utf8');
    const isArticle = relativePath.startsWith('../transmissions/') && relativePath !== '../transmissions/index.html';

    assert.equal(source.match(/rel="canonical"/g)?.length ?? 0, 1, `${relativePath} should expose one canonical URL`);
    assert.equal(source.match(/property="og:image"/g)?.length ?? 0, 1, `${relativePath} should expose one og:image`);
    assert.equal(source.match(/name="twitter:image"/g)?.length ?? 0, 1, `${relativePath} should expose one twitter:image`);
    assert.ok(source.includes(`<meta property="og:type" content="${isArticle ? 'article' : 'website'}" />`), `${relativePath} has wrong og:type`);
    assert.ok(source.includes(`<meta property="og:image" content="${previewUrl}" />`), `${relativePath} missing default og:image`);
    assert.ok(source.includes('<meta property="og:image:type" content="image/svg+xml" />'), `${relativePath} missing og image type`);
    assert.ok(source.includes('<meta property="og:image:width" content="1200" />'), `${relativePath} missing og image width`);
    assert.ok(source.includes('<meta property="og:image:height" content="630" />'), `${relativePath} missing og image height`);
    assert.ok(source.includes(`<meta property="og:image:alt" content="${previewAlt}" />`), `${relativePath} missing og image alt`);
    assert.ok(source.includes('<meta name="twitter:card" content="summary_large_image" />'), `${relativePath} missing large Twitter card`);
    assert.ok(source.includes(`<meta name="twitter:image" content="${previewUrl}" />`), `${relativePath} missing twitter image`);
    assert.ok(source.includes(`<meta name="twitter:image:alt" content="${previewAlt}" />`), `${relativePath} missing twitter image alt`);
  }

  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/social/unwindcode-lab-preview.svg', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');

  const asset = manifest.assets.find(item => item.id === 'unwindcode-lab-preview');
  assert.ok(asset, 'asset manifest missing social preview asset');
  assert.equal(asset.file, 'assets/social/unwindcode-lab-preview.svg');
  assert.equal(asset.route, 'global');
  assert.equal(asset.surface, 'Open Graph and Twitter metadata');
  assert.equal(asset.format, 'image/svg+xml');
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /Static SVG/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'social preview SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'social preview SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'social preview SVG should not embed UI text');
  assert.ok(svg.includes('width="1200"'), 'social preview SVG should declare width');
  assert.ok(svg.includes('height="630"'), 'social preview SVG should declare height');
  assert.ok(svg.includes('role="presentation"'), 'social preview SVG should be presentational');
  assert.ok(svg.includes('id="preview-core"'), 'social preview should expose a governed organism core motif');
  assert.ok(svg.includes('id="preview-rail"'), 'social preview should expose an organism signal rail');
  assert.ok(svg.includes('preview-soft-shadow'), 'social preview should use premium depth without runtime dependencies');
  assert.ok(svg.includes('M878 194c34-34 84-34 118 0'), 'social preview should include the reflection organism motif');
  assert.ok(svg.includes('v-16c0-18 15-33 33-33s33 15 33 33v16'), 'social preview should include the Web3 lock motif');
  assert.ok(svg.includes('circle cx="860" cy="452"'), 'social preview should include the brain-cell network motif');
  assert.ok(svg.includes('circle cx="698" cy="318"'), 'social preview should include the creator/media proof motif');

  assert.ok(llms.includes('Social Preview Layer'), 'llms.txt missing social preview layer');
  assert.ok(llms.includes('assets/social/unwindcode-lab-preview.svg'), 'llms.txt missing social preview URL');
  assert.ok(llms.includes('creator, reflection, Web3 trust, and brain-cell architecture motifs'), 'llms.txt missing social preview motif summary');
  assert.ok(services.includes('"social_preview_assets"'), 'ai-services missing social preview assets');
  assert.ok(services.includes('"id": "unwindcode_lab_preview"'), 'ai-services missing social preview asset id');
  assert.ok(services.includes('creator, reflection, Web3 trust, and brain-cell architecture motifs'), 'ai-services missing social preview motif summary');
});

test('homepage gives first-time visitors role-specific next paths', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');

  assert.ok(source.includes('id="paths"'), 'homepage missing visitor paths section');
  assert.ok(source.includes('aria-label="Visitor paths"'), 'visitor paths should be named for assistive tech');
  assert.ok(source.includes('href="/organisms"'), 'hero should route directly to durable organisms page');
  assert.ok(source.includes('href="/architecture"'), 'hero should route directly to durable architecture page');

  for (const snippet of [
    'data-i18n="paths.builders.label"',
    'data-i18n="paths.investors.label"',
    'data-i18n="paths.users.label"',
    'data-i18n="paths.subscribers.label"',
    'data-i18n="paths.collaborators.label"',
    'href="/proof"',
    'href="/organisms/infinity-mirror"',
    'href="/transmissions"',
    'href="/build-with-us"',
  ]) {
    assert.ok(source.includes(snippet), `homepage missing visitor path snippet ${snippet}`);
  }

  for (const snippet of [
    "'paths.builders.label': 'Builders'",
    "'paths.investors.label': 'Investors'",
    "'paths.users.label': 'Users'",
    "'paths.subscribers.label': 'Subscribers'",
    "'paths.collaborators.label': 'Collaborators'",
    "'paths.builders.label': 'Builders'",
    "'paths.investors.label': 'Inversionistas'",
    "'paths.users.label': 'Usuarios'",
    "'paths.subscribers.label': 'Suscriptores'",
    "'paths.collaborators.label': 'Colaboradores'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing visitor path snippet ${snippet}`);
  }

  const duplicateVisionLine = "this community brings us closer. The road is long. We'd rather walk it with you.";
  assert.equal(source.split(duplicateVisionLine).length - 1, 1, 'vision paragraph should not be duplicated');
  assert.ok(source.includes('could</span><br /> <span'), 'hero title should preserve readable whitespace for extracted text');
});

test('homepage offers proof-route bridge before deeper organism education', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');

  const pathsIndex = source.indexOf('id="paths"');
  const proofRouteIndex = source.indexOf('id="proof-route-title"');
  const primerIndex = source.indexOf('id="organism-primer"');

  assert.ok(pathsIndex > -1, 'homepage missing visitor paths section');
  assert.ok(proofRouteIndex > pathsIndex, 'proof-route bridge should follow visitor paths');
  assert.ok(primerIndex > proofRouteIndex, 'proof-route bridge should appear before organism primer');

  for (const snippet of [
    'class="proof-route-strip reveal"',
    'aria-labelledby="proof-route-title"',
    'aria-label="Proof routes by question"',
    'data-i18n="proofRoute.title"',
    'data-i18n="proofRoute.arch.title"',
    'data-i18n="proofRoute.proof.title"',
    'data-i18n="proofRoute.web3.title"',
    'data-i18n="proofRoute.collab.title"',
    'href="/architecture"',
    'href="/proof"',
    'href="/organisms/financial-organisms"',
    'href="/build-with-us"',
  ]) {
    assert.ok(source.includes(snippet), `homepage missing proof-route snippet ${snippet}`);
  }

  for (const snippet of [
    "'proofRoute.title': 'Choose the proof before choosing the organism.'",
    "'proofRoute.arch.title': 'Can this be built?'",
    "'proofRoute.proof.title': 'Can this be trusted?'",
    "'proofRoute.web3.title': 'Can value move safely?'",
    "'proofRoute.collab.title': 'Can we build this together?'",
    "'proofRoute.title': 'Elige la prueba antes de elegir el organismo.'",
    "'proofRoute.arch.title': '¿Esto se puede construir?'",
    "'proofRoute.proof.title': '¿Esto se puede confiar?'",
    "'proofRoute.web3.title': '¿El valor puede moverse seguro?'",
    "'proofRoute.collab.title': '¿Podemos construir esto juntos?'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing proof-route snippet ${snippet}`);
  }

  for (const snippet of [
    '.proof-route-strip',
    '.proof-route-list',
    '.proof-route-link:focus-visible',
    '.proof-route-body small',
    '@media (max-width: 640px)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing proof-route snippet ${snippet}`);
  }

  assert.ok(llms.includes('Homepage proof route strip'), 'llms.txt missing homepage proof-route summary');
  assert.ok(llms.includes('can value move safely'), 'llms.txt missing Web3 proof-route question');
  assert.ok(services.includes('"proof_route_questions"'), 'ai-services missing proof-route questions');
  assert.ok(services.includes('"question": "Can value move safely?"'), 'ai-services missing Web3 proof-route question');
});

test('homepage hero exposes a governed organism pulse console', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const main = await readFile(new URL('../main.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/organism-pulse-field.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'id="neural-canvas" class="hero-signal-field"',
    'data-asset-id="hero-signal-field"',
    'data-field-mode="progressive"',
    'aria-hidden="true"></canvas>',
    'class="hero-shell"',
    'class="hero-organism-console reveal"',
    'data-asset-id="organism-pulse-field"',
    'aria-labelledby="hero-console-title"',
    'id="hero-console-title"',
    'assets/visuals/organism-pulse-field.svg',
    '<span class="stat-value">5</span>',
    'data-i18n="hero.stat.agents">Organism paths</span>',
    '<span class="stat-value">27</span>',
    'data-i18n="hero.stat.live">Public transmissions</span>',
    '<span class="stat-value">0</span>',
    'data-i18n="hero.stat.chains">Hidden authority paths</span>',
    'simulation-first Web3 organisms',
    'data-i18n="hero.console.kicker"',
    'data-i18n="hero.console.boundary.value"',
    '"@id":"https://www.unwindcode.ai/#hero-signal-field-asset"',
    '"encodingFormat":"text/javascript"',
    '"@id":"https://www.unwindcode.ai/#organism-pulse-field-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/organism-pulse-field.svg"',
  ]) {
    assert.ok(source.includes(snippet), `homepage missing organism pulse snippet ${snippet}`);
  }

  for (const snippet of [
    "'hero.console.kicker': 'Organism pulse'",
    "'hero.console.title': 'A request becomes a governed organism run.'",
    "'hero.console.signal.title': 'Signal'",
    "'hero.console.cortex.title': 'Cortex'",
    "'hero.console.memory.title': 'Memory'",
    "'hero.console.proof.title': 'Proof'",
    "'hero.console.boundary.value': 'Money, files, public posts, and Web3 broadcast stay approval-gated.'",
    "'hero.stat.agents': 'Organism paths'",
    "'hero.stat.live': 'Public transmissions'",
    "'hero.stat.chains': 'Hidden authority paths'",
    "'hero.sub': \"We don't write code that runs and stops. We design AI organisms",
    'simulation-first Web3 organisms',
    "'hero.console.kicker': 'Pulso del organismo'",
    "'hero.console.title': 'Una petición se convierte en una ejecución gobernada del organismo.'",
    "'hero.console.boundary.value': 'Dinero, archivos, publicaciones públicas y broadcast Web3 siguen bajo aprobación.'",
    "'hero.stat.agents': 'Rutas de organismo'",
    "'hero.stat.live': 'Transmisiones públicas'",
    "'hero.stat.chains': 'Rutas de autoridad oculta'",
    'organismos Web3 simulation-first',
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing organism pulse snippet ${snippet}`);
  }

  for (const forbidden of [
    'Live in the Wild',
    'Live Blockchains',
    'Cognitive Agents',
    'autonomous on-chain agents',
    'Activos en el Mundo',
    'Blockchains Activas',
    'agentes autónomos on-chain',
  ]) {
    assert.equal(source.includes(forbidden), false, `homepage should not include unbounded hero claim ${forbidden}`);
    assert.equal(i18n.includes(forbidden), false, `i18n should not include unbounded hero claim ${forbidden}`);
  }

  for (const snippet of [
    'min-height: 100dvh',
    '.hero-signal-field',
    '.hero-shell',
    '.hero-organism-console',
    '.hero-organism-asset',
    '.hero-pulse-steps',
    '.hero-console-boundary',
    '@media (max-width: 900px)',
    '@media (prefers-reduced-motion: reduce)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing organism pulse snippet ${snippet}`);
  }

  for (const snippet of [
    'heroSignalNodes',
    'drawHeroSignalField',
    "window.matchMedia?.('(max-width: 760px)')",
    'canvas.dataset.fieldState',
    'ResizeObserver',
    'pointermove',
    'devicePixelRatio',
  ]) {
    assert.ok(main.includes(snippet), `main.js missing hero signal field snippet ${snippet}`);
  }

  const signalAsset = manifest.assets.find(item => item.id === 'hero-signal-field');
  assert.ok(signalAsset, 'asset manifest missing hero signal field');
  assert.equal(signalAsset.file, 'main.js#hero-signal-field');
  assert.equal(signalAsset.route, '/');
  assert.equal(signalAsset.surface, '#hero');
  assert.equal(signalAsset.format, 'canvas/javascript');
  assert.match(signalAsset.accessibility, /aria-hidden/);
  assert.match(signalAsset.text_policy, /No embedded UI text/);
  assert.match(signalAsset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(signalAsset.performance.dependencies, []);

  const asset = manifest.assets.find(item => item.id === 'organism-pulse-field');
  assert.ok(asset, 'asset manifest missing organism pulse field');
  assert.equal(asset.file, 'assets/visuals/organism-pulse-field.svg');
  assert.equal(asset.route, '/');
  assert.equal(asset.surface, '#hero-console-title');
  assert.match(asset.accessibility, /semantic HTML copy/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'organism pulse SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'organism pulse SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'organism pulse SVG should not embed UI text');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'organism pulse SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'organism pulse SVG should be presentational');
  assert.ok(svg.includes('aria-hidden="true"'), 'organism pulse SVG should be hidden from assistive tech');

  assert.ok(llms.includes('Hero Signal Field'), 'llms.txt missing hero signal field');
  assert.ok(llms.includes('Organism Pulse Field'), 'llms.txt missing organism pulse field');
  assert.ok(services.includes('"id": "hero_signal_field"'), 'ai-services missing hero signal field asset');
  assert.ok(services.includes('"id": "organism_pulse_field"'), 'ai-services missing organism pulse field asset');
});

test('homepage exposes an interactive governed visitor pathfinder', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/visitor-pathway-map.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'class="pathfinder-console reveal"',
    'data-asset-id="visitor-pathway-map"',
    'aria-labelledby="pathfinder-title"',
    'assets/visuals/visitor-pathway-map.svg',
    'id="pathfinder-title"',
    'name="pathfinder"',
    'id="pathfinder-builder"',
    'id="pathfinder-creator"',
    'id="pathfinder-user"',
    'id="pathfinder-protocol"',
    'id="pathfinder-investor"',
    'id="pathfinder-collaborator"',
    'data-i18n="pathfinder.creator.status"',
    'data-i18n="pathfinder.protocol.boundary"',
    'href="/organisms/visual-cortex"',
    'href="/organisms/infinity-mirror"',
    'href="/organisms/financial-organisms"',
    'href="/proof"',
    'href="/build-with-us"',
    '"@id":"https://www.unwindcode.ai/#visitor-pathway-map-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/visitor-pathway-map.svg"',
  ]) {
    assert.ok(source.includes(snippet), `homepage missing visitor pathfinder snippet ${snippet}`);
  }

  for (const snippet of [
    "'pathfinder.legend': 'Choose the evidence path that matches your intent.'",
    "'pathfinder.builder.title': 'Start with the organism stack and Brain Cell Architecture.'",
    "'pathfinder.creator.status': 'Visual Cortex'",
    "'pathfinder.user.status': 'Infinity Mirror'",
    "'pathfinder.protocol.status': 'Financial Organisms'",
    "'pathfinder.investor.status': 'Proof ledger'",
    "'pathfinder.collaborator.status': 'Collaboration gateway'",
    "'pathfinder.legend': 'Elige la ruta de evidencia que coincide con tu intención.'",
    "'pathfinder.builder.title': 'Empieza con el stack del organismo y Brain Cell Architecture.'",
    "'pathfinder.creator.status': 'Corteza Visual'",
    "'pathfinder.user.status': 'Infinity Mirror'",
    "'pathfinder.protocol.status': 'Organismos Financieros'",
    "'pathfinder.investor.status': 'Ledger de prueba'",
    "'pathfinder.collaborator.status': 'Gateway de colaboración'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing visitor pathfinder snippet ${snippet}`);
  }

  assert.ok(css.includes('.pathfinder-console'), 'CSS missing pathfinder layout');
  assert.ok(css.includes('#pathfinder-builder:focus-visible'), 'CSS missing pathfinder keyboard focus state');
  assert.ok(css.includes('@media (max-width: 640px)'), 'CSS missing pathfinder mobile rules');
  assert.ok(css.includes('.pathfinder-asset'), 'CSS missing pathfinder asset rules');

  const asset = manifest.assets.find(item => item.id === 'visitor-pathway-map');
  assert.ok(asset, 'asset manifest missing visitor pathway map');
  assert.equal(asset.file, 'assets/visuals/visitor-pathway-map.svg');
  assert.equal(asset.route, '/');
  assert.equal(asset.surface, '#pathfinder-title');
  assert.match(asset.accessibility, /native radio inputs/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'visitor pathway SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'visitor pathway SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'visitor pathway SVG should not embed UI text');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'visitor pathway SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'visitor pathway SVG should be presentational');

  assert.ok(llms.includes('Visitor Pathway Map'), 'llms.txt missing visitor pathway map');
  assert.ok(services.includes('"id": "visitor_pathway_map"'), 'ai-services missing visitor pathway asset');
});

test('homepage exposes a governed immersive organism map asset', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/organism-ecosystem-map.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'id="ecosystem-map"',
    'aria-labelledby="ecosystem-map-title"',
    'data-asset-id="organism-ecosystem-map"',
    'assets/visuals/organism-ecosystem-map.svg',
    'href="/architecture"',
    'href="/organisms/visual-cortex"',
    'href="/organisms/infinity-mirror"',
    'href="/organisms/financial-organisms"',
    'href="/organisms/brain-cell-architecture"',
    'href="/organisms/research-organisms"',
    'data-i18n="map.node.core.title"',
    'data-i18n="map.node.research.title"',
    'data-i18n="map.legend.memory.desc"',
    '"@type":"ImageObject"',
    '"@id":"https://www.unwindcode.ai/#organism-ecosystem-map-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/organism-ecosystem-map.svg"',
  ]) {
    assert.ok(source.includes(snippet), `homepage missing ecosystem map snippet ${snippet}`);
  }

  for (const snippet of [
    "'map.tag': 'Living ecosystem map'",
    "'map.title': 'One organism spine. Five product paths. Proof around every edge.'",
    "'map.node.visual.title': 'Visual Cortex'",
    "'map.node.research.title': 'Research Organisms'",
    "'map.legend.immune.desc': 'Pauses money, files, public posts, and risky execution.'",
    "'map.tag': 'Mapa vivo del ecosistema'",
    "'map.title': 'Una columna de organismo. Cinco rutas de producto. Prueba en cada borde.'",
    "'map.node.visual.title': 'Corteza Visual'",
    "'map.node.research.label': 'Investigación'",
    "'map.legend.immune.desc': 'Pausa dinero, archivos, publicaciones públicas y ejecución riesgosa.'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing ecosystem map snippet ${snippet}`);
  }

  assert.ok(css.includes('.ecosystem-orbital-map'), 'CSS missing orbital map layout');
  assert.ok(css.includes('.ecosystem-node:focus-visible'), 'CSS missing keyboard focus state');
  assert.ok(css.includes('.node-research'), 'CSS missing Research Organisms map node placement');
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'CSS missing reduced-motion media query');
  assert.ok(css.includes('.ecosystem-map-asset'), 'CSS missing ecosystem map asset rules');

  const asset = manifest.assets.find(item => item.id === 'organism-ecosystem-map');
  assert.ok(asset, 'asset manifest missing organism ecosystem map');
  assert.equal(asset.file, 'assets/visuals/organism-ecosystem-map.svg');
  assert.equal(asset.route, '/');
  assert.match(asset.purpose, /Research Organisms/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'SVG asset should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'SVG asset should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'SVG asset should not embed UI text');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'SVG should be presentational');

  for (const snippet of [
    'Immersive Asset Layer',
    'Organism Ecosystem Map',
    'asset-manifest.json',
    '"immersive_assets"',
    '"id": "organism_ecosystem_map"',
    '"manifest": "https://www.unwindcode.ai/assets/asset-manifest.json"',
    'Research Organisms, and Architecture',
    'Research Organisms, and the architecture proof path',
  ]) {
    assert.ok(llms.includes(snippet) || services.includes(snippet), `AI discovery missing ecosystem asset snippet ${snippet}`);
  }
});

test('asset manifest governs every immersive SVG visual', async () => {
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));

  assert.match(manifest.asset_governance.principle, /Decoration alone is not enough/);
  assert.match(manifest.asset_governance.text_policy, /code-native/);
  assert.match(manifest.asset_governance.motion_policy, /prefers-reduced-motion/);

  const expectedAssets = [
    ['organism-pulse-field', 'assets/visuals/organism-pulse-field.svg', '/'],
    ['organism-ecosystem-map', 'assets/visuals/organism-ecosystem-map.svg', '/'],
    ['organism-difference-lens', 'assets/visuals/organism-difference-lens.svg', '/'],
    ['organism-readiness-radar', 'assets/visuals/organism-readiness-radar.svg', '/'],
    ['architecture-proof-runway', 'assets/visuals/architecture-proof-runway.svg', '/'],
    ['homepage-doctrine-gateway', 'assets/visuals/homepage-doctrine-gateway.svg', '/'],
    ['visitor-pathway-map', 'assets/visuals/visitor-pathway-map.svg', '/'],
    ['subscriber-signal-beacon', 'assets/visuals/subscriber-signal-beacon.svg', '/'],
    ['research-organism-field', 'assets/visuals/research-organism-field.svg', '/organisms/research-organisms'],
    ['vision-roadmap-observatory', 'assets/visuals/vision-roadmap-observatory.svg', '/vision'],
    ['operating-doctrine-compass', 'assets/visuals/operating-doctrine-compass.svg', '/philosophy'],
    ['infinity-mirror-reflection-loop', 'assets/visuals/infinity-mirror-reflection-loop.svg', '/organisms/infinity-mirror'],
    ['infinity-mirror-session-console', 'assets/visuals/infinity-mirror-session-console.svg', '/organisms/infinity-mirror'],
    ['infinity-mirror-portal', 'assets/visuals/infinity-mirror-portal.svg', '/organisms/infinity-mirror/experience'],
    ['visual-cortex-pipeline-map', 'assets/visuals/visual-cortex-pipeline-map.svg', '/organisms/visual-cortex'],
    ['brain-cell-lifecycle-map', 'assets/visuals/brain-cell-lifecycle-map.svg', '/organisms/brain-cell-architecture'],
    ['organism-stack-glyphs', 'assets/visuals/organism-stack-glyphs.svg', '/architecture'],
    ['cognitive-flow-map', 'assets/visuals/cognitive-flow-map.svg', '/architecture'],
    ['architecture-run-inspector', 'assets/visuals/architecture-run-inspector.svg', '/architecture'],
    ['memory-continuity-map', 'assets/visuals/memory-continuity-map.svg', '/architecture'],
    ['web3-trust-layer-map', 'assets/visuals/web3-trust-layer-map.svg', '/organisms/financial-organisms'],
    ['collaboration-packet-map', 'assets/visuals/collaboration-packet-map.svg', '/build-with-us'],
    ['engagement-fit-compass', 'assets/visuals/engagement-fit-compass.svg', '/build-with-us'],
    ['organism-identity-constellation', 'assets/visuals/organism-identity-constellation.svg', '/organisms'],
    ['organism-interface-specimens', 'assets/visuals/organism-interface-specimens.svg', '/organisms'],
    ['transmission-atlas-map', 'assets/visuals/transmission-atlas-map.svg', '/transmissions'],
    ['trust-diligence-console', 'assets/visuals/trust-diligence-console.svg', '/proof'],
    ['asset-governance-ledger', 'assets/visuals/asset-governance-ledger.svg', '/proof'],
  ];

  for (const [id, file, route] of expectedAssets) {
    const asset = manifest.assets.find(item => item.id === id);
    assert.ok(asset, `asset manifest missing ${id}`);
    assert.equal(asset.file, file);
    assert.equal(asset.route, route);
    assert.equal(asset.format, 'image/svg+xml');
    assert.equal(asset.status, 'production');
    assert.deepEqual(asset.performance.dependencies, []);
    assert.match(asset.text_policy, /No embedded UI text/);
    assert.match(asset.motion_policy, /prefers-reduced-motion/);

    const svg = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.equal(/<script/i.test(svg), false, `${id} SVG should not contain scripts`);
    assert.equal(/<foreignObject/i.test(svg), false, `${id} SVG should not contain foreignObject`);
    assert.equal(/<text/i.test(svg), false, `${id} SVG should not embed UI text`);
    assert.ok(svg.includes('role="presentation"'), `${id} SVG should be presentational`);
    assert.ok(svg.includes('prefers-reduced-motion: reduce'), `${id} SVG should include reduced-motion guard`);
  }
});

test('organism index is a bilingual, machine-readable ecosystem map', async () => {
  const source = await readFile(new URL('../organisms/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');

  for (const snippet of [
    'data-i18n="orgIndex.hero.kicker"',
    'data-i18n="orgIndex.hero.title"',
    'data-i18n="orgIndex.hero.desc"',
    'data-i18n="orgIndex.paths.title"',
    'data-i18n="orgIndex.vc.status"',
    'data-i18n="orgIndex.vc.cta"',
    'data-i18n="orgIndex.im.status"',
    'data-i18n="orgIndex.im.cta"',
    'data-i18n="orgIndex.fo.status"',
    'data-i18n="orgIndex.fo.cta"',
    'data-i18n="orgIndex.bc.status"',
    'data-i18n="orgIndex.bc.cta"',
    'data-i18n="orgIndex.ro.status"',
    'data-i18n="orgIndex.ro.cta"',
    'data-i18n="orgIndex.state.title"',
    'data-i18n="orgIndex.state.vc.state"',
    'data-i18n="orgIndex.state.im.state"',
    'data-i18n="orgIndex.state.fo.state"',
    'data-i18n="orgIndex.state.bc.state"',
    'data-i18n="orgIndex.state.ro.state"',
    'data-i18n="orgIndex.state.proofLoop.state"',
    '"@type":"ItemList"',
    '"itemListElement"',
    '"@id":"https://www.unwindcode.ai/organisms/#organism-list"',
    '"url":"https://www.unwindcode.ai/organisms/visual-cortex"',
    '"url":"https://www.unwindcode.ai/organisms/infinity-mirror"',
    '"url":"https://www.unwindcode.ai/organisms/financial-organisms"',
    '"url":"https://www.unwindcode.ai/organisms/brain-cell-architecture"',
    '"url":"https://www.unwindcode.ai/organisms/research-organisms"',
  ]) {
    assert.ok(source.includes(snippet), `organism index missing ecosystem snippet ${snippet}`);
  }

  for (const snippet of [
    "'orgIndex.hero.kicker': 'Organism ecosystem'",
    "'orgIndex.hero.title': 'Explore the systems behind intelligence that evolves.'",
    "'orgIndex.paths.title': 'The five public organism paths.'",
    "'orgIndex.vc.status': 'Prototype'",
    "'orgIndex.im.status': 'Prototype'",
    "'orgIndex.fo.status': 'Research'",
    "'orgIndex.bc.status': 'Experimental'",
    "'orgIndex.ro.status': 'Research'",
    "'orgIndex.state.title': 'What is real now, what is still bounded.'",
    "'orgIndex.hero.kicker': 'Ecosistema de organismos'",
    "'orgIndex.hero.title': 'Explora los sistemas detrás de la inteligencia que evoluciona.'",
    "'orgIndex.paths.title': 'Las cinco rutas públicas de organismos.'",
    "'orgIndex.vc.status': 'Prototipo'",
    "'orgIndex.im.status': 'Prototipo'",
    "'orgIndex.fo.status': 'Investigación'",
    "'orgIndex.bc.status': 'Experimental'",
    "'orgIndex.ro.status': 'Investigación'",
    "'orgIndex.state.title': 'Qué es real ahora y qué sigue limitado.'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing organism index snippet ${snippet}`);
  }
});

test('organism detail pages expose bilingual product briefs and defined-term schema', async () => {
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const detailPages = [
    ['../organisms/visual-cortex/index.html', 'detail.vc', 'Visual Cortex', 'visual-cortex-brief-title'],
    ['../organisms/infinity-mirror/index.html', 'detail.im', 'Infinity Mirror', 'infinity-mirror-brief-title'],
    ['../organisms/financial-organisms/index.html', 'detail.fo', 'Financial Organisms', 'financial-organisms-brief-title'],
    ['../organisms/brain-cell-architecture/index.html', 'detail.bc', 'Brain Cell Architecture', 'brain-cell-brief-title'],
    ['../organisms/research-organisms/index.html', 'detail.ro', 'Research Organisms', 'research-organisms-brief-title'],
  ];

  for (const [relativePath, keyPrefix, name, headingId] of detailPages) {
    const source = await readFile(new URL(relativePath, import.meta.url), 'utf8');

    for (const snippet of [
      'class="lab-section organism-brief"',
      `aria-labelledby="${headingId}"`,
      `data-i18n="${keyPrefix}.hero.kicker"`,
      `data-i18n="${keyPrefix}.hero.title"`,
      `data-i18n="${keyPrefix}.brief.title"`,
      `data-i18n="${keyPrefix}.brief.desc"`,
      'class="organism-brief-facts"',
      'data-i18n="detail.brief.stage"',
      'data-i18n="detail.brief.input"',
      'data-i18n="detail.brief.cells"',
      'data-i18n="detail.brief.boundary"',
      'data-i18n="detail.brief.proof"',
      '"@type":"DefinedTerm"',
      `"name":"${name}"`,
      '"inLanguage":["en","es"]',
    ]) {
      assert.ok(source.includes(snippet), `${relativePath} missing detail brief snippet ${snippet}`);
    }
  }

  for (const snippet of [
    "'detail.brief.label': 'Product path'",
    "'detail.brief.label': 'Ruta de producto'",
    "'detail.vc.brief.title': 'Creator systems need memory before motion.'",
    "'detail.vc.brief.title': 'Los sistemas creativos necesitan memoria antes de movimiento.'",
    "'detail.im.brief.title': 'The product path is clarity, not more self-analysis.'",
    "'detail.im.brief.title': 'La ruta de producto es claridad, no más autoanálisis.'",
    "'detail.fo.brief.title': 'Web3 intelligence earns trust by refusing hidden authority.'",
    "'detail.fo.brief.title': 'La inteligencia Web3 gana confianza rechazando autoridad oculta.'",
    "'detail.bc.brief.title': 'Self-evolution needs an immune system.'",
    "'detail.bc.brief.title': 'La autoevolución necesita un sistema inmune.'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing organism detail snippet ${snippet}`);
  }
});

test('research organisms page exposes source-bound research before publication claims', async () => {
  const source = await readFile(new URL('../organisms/research-organisms/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const sitemap = await readFile(new URL('../sitemap.xml', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/research-organism-field.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'class="lab-section research-organisms-capability-ledger-section"',
    'id="research-organisms-capability-title"',
    'class="research-organisms-capability-ledger"',
    'class="research-organisms-capability-row boundary"',
    'class="lab-section research-organism-field-section"',
    'id="research-organism-field-title"',
    'data-asset-id="research-organism-field"',
    'assets/visuals/research-organism-field.svg',
    'href="/transmissions"',
    'href="/vision/#vision-observatory-title"',
    'href="/proof/#asset-governance-title"',
    'href="/proof/#authority-gate-title"',
    '"@id":"https://www.unwindcode.ai/organisms/research-organisms/#research-organism-field-asset"',
  ]) {
    assert.ok(source.includes(snippet), `research organisms page missing ${snippet}`);
  }

  for (const snippet of [
    "'detail.ro.capability.title': 'What Research Organisms can study, what stays uncertain, and where proof lives.'",
    "'detail.ro.capability.source.blocked': 'No fabricated citation, hidden source, scraped private context, or copied institutional authority.'",
    "'detail.ro.capability.publish.blocked': 'No public certainty, benchmark, market claim, or research authority without evidence and review.'",
    "'detail.ro.field.title': 'A source enters as a question and leaves as a reviewed proof path.'",
    "'detail.ro.capability.title': 'Qué pueden estudiar Research Organisms, qué sigue incierto y dónde vive la prueba.'",
    "'detail.ro.capability.source.blocked': 'Sin cita fabricada, fuente oculta, contexto privado scrapeado ni autoridad institucional copiada.'",
    "'detail.ro.field.title': 'Una fuente entra como pregunta y sale como ruta de prueba revisada.'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing research organisms snippet ${snippet}`);
  }

  for (const snippet of [
    '.research-organisms-capability-ledger-section',
    '.research-organisms-capability-row',
    '.research-organism-field-section',
    '.research-organism-field-board',
    '.research-organism-field-steps',
    '@keyframes research-organism-field-drift',
    '@media (max-width: 900px)',
    '@media (max-width: 640px)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing research organisms snippet ${snippet}`);
  }

  assert.ok(services.includes('"name": "Research Organisms"'), 'ai-services missing Research Organisms route');
  assert.ok(services.includes('"id": "research_organisms_capability_ledger"'), 'ai-services missing research capability ledger');
  assert.ok(services.includes('"id": "research_organism_field"'), 'ai-services missing research organism field');
  assert.ok(llms.includes('Research Organisms Capability Ledger'), 'llms.txt missing research capability ledger');
  assert.ok(llms.includes('Research Organism Field'), 'llms.txt missing research organism field');
  assert.ok(sitemap.includes('https://www.unwindcode.ai/organisms/research-organisms'), 'sitemap missing Research Organisms route');

  const ledgerAsset = manifest.assets.find(item => item.id === 'research-organisms-capability-ledger');
  assert.ok(ledgerAsset, 'asset manifest missing research capability ledger');
  assert.equal(ledgerAsset.route, '/organisms/research-organisms');
  assert.equal(ledgerAsset.surface, '#research-organisms-capability-title');
  assert.deepEqual(ledgerAsset.performance.dependencies, []);

  const fieldAsset = manifest.assets.find(item => item.id === 'research-organism-field');
  assert.ok(fieldAsset, 'asset manifest missing research organism field');
  assert.equal(fieldAsset.file, 'assets/visuals/research-organism-field.svg');
  assert.equal(fieldAsset.route, '/organisms/research-organisms');
  assert.equal(fieldAsset.surface, '#research-organism-field-title');
  assert.match(fieldAsset.accessibility, /semantic bilingual steps/);
  assert.deepEqual(fieldAsset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'research organism SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'research organism SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'research organism SVG should not embed UI text');
  assert.ok(svg.includes('viewBox="0 0 1080 720"'), 'research organism SVG should declare expected viewBox');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'research organism SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'research organism SVG should be presentational');
});

test('infinity mirror page exposes a governed reflection loop map', async () => {
  const source = await readFile(new URL('../organisms/infinity-mirror/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/infinity-mirror-reflection-loop.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'class="lab-section infinity-mirror-loop-section"',
    'aria-labelledby="infinity-mirror-loop-title"',
    'id="infinity-mirror-loop-title"',
    'data-asset-id="infinity-mirror-reflection-loop"',
    'assets/visuals/infinity-mirror-reflection-loop.svg',
    'class="infinity-mirror-loop-board"',
    'class="infinity-mirror-loop-node"',
    'data-i18n="detail.im.loop.kicker"',
    'data-i18n="detail.im.loop.title"',
    'data-i18n="detail.im.loop.state.title"',
    'data-i18n="detail.im.loop.boundary.desc"',
    'href="/transmissions/24-the-mirror-found-its-form"',
    'href="/#cta"',
    '"@type":"ImageObject"',
    '"@id":"https://www.unwindcode.ai/organisms/infinity-mirror/#infinity-mirror-reflection-loop-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/infinity-mirror-reflection-loop.svg"',
  ]) {
    assert.ok(source.includes(snippet), `infinity mirror page missing reflection-loop snippet ${snippet}`);
  }

  for (const snippet of [
    "'detail.im.loop.kicker': 'Reflection loop'",
    "'detail.im.loop.title': 'A state becomes a safer next action, not another dashboard.'",
    "'detail.im.loop.state.title': 'State capture'",
    "'detail.im.loop.action.title': 'Grounded next action'",
    "'detail.im.loop.boundary.title': 'Human boundary'",
    "'detail.im.loop.kicker': 'Loop de reflexión'",
    "'detail.im.loop.title': 'Un estado se convierte en una siguiente acción más segura, no en otro dashboard.'",
    "'detail.im.loop.state.title': 'Captura de estado'",
    "'detail.im.loop.action.title': 'Siguiente acción concreta'",
    "'detail.im.loop.boundary.title': 'Límite humano'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing Infinity Mirror reflection-loop snippet ${snippet}`);
  }

  assert.ok(css.includes('.infinity-mirror-loop-board'), 'CSS missing Infinity Mirror loop board');
  assert.ok(css.includes('.infinity-mirror-loop-node summary:focus-visible'), 'CSS missing Infinity Mirror loop keyboard focus state');
  assert.ok(css.includes('.infinity-mirror-loop-asset'), 'CSS missing Infinity Mirror loop asset rules');
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'CSS missing reduced-motion media query');

  const asset = manifest.assets.find(item => item.id === 'infinity-mirror-reflection-loop');
  assert.ok(asset, 'asset manifest missing Infinity Mirror reflection loop');
  assert.equal(asset.file, 'assets/visuals/infinity-mirror-reflection-loop.svg');
  assert.equal(asset.route, '/organisms/infinity-mirror');
  assert.equal(asset.surface, '#infinity-mirror-loop-title');
  assert.match(asset.accessibility, /details\/summary/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'Infinity Mirror loop SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'Infinity Mirror loop SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'Infinity Mirror loop SVG should not embed UI text');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'Infinity Mirror loop SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'Infinity Mirror loop SVG should be presentational');

  assert.ok(llms.includes('Infinity Mirror Reflection Loop'), 'llms.txt missing Infinity Mirror reflection loop');
  assert.ok(services.includes('"id": "infinity_mirror_reflection_loop"'), 'ai-services missing Infinity Mirror reflection asset');
});

test('infinity mirror page exposes an inspectable reflection session console', async () => {
  const source = await readFile(new URL('../organisms/infinity-mirror/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/infinity-mirror-session-console.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'class="lab-section infinity-mirror-session-section"',
    'aria-labelledby="infinity-mirror-session-title"',
    'id="infinity-mirror-session-title"',
    'data-asset-id="infinity-mirror-session-console"',
    'assets/visuals/infinity-mirror-session-console.svg',
    'class="infinity-mirror-session-board"',
    'name="infinity-mirror-session"',
    'id="im-session-overwhelm"',
    'id="im-session-launch"',
    'data-i18n="detail.im.session.kicker"',
    'data-i18n="detail.im.session.title"',
    'data-i18n="detail.im.session.overwhelm.boundary"',
    'data-i18n="detail.im.session.identity.boundary"',
    'data-i18n="detail.im.session.launch.boundary"',
    'data-i18n="detail.im.session.loop.boundary"',
    'href="/transmissions/24-the-mirror-found-its-form"',
    'href="/#cta"',
    '"@type":"ImageObject"',
    '"@id":"https://www.unwindcode.ai/organisms/infinity-mirror/#infinity-mirror-session-console-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/infinity-mirror-session-console.svg"',
  ]) {
    assert.ok(source.includes(snippet), `infinity mirror page missing session snippet ${snippet}`);
  }

  for (const snippet of [
    "'detail.im.session.kicker': 'Session console'",
    "'detail.im.session.title': 'Choose a reflection request and inspect what the mirror is allowed to do.'",
    "'detail.im.session.overwhelm.tab': 'Overwhelm'",
    "'detail.im.session.overwhelm.boundary': 'The mirror can organize reflection; the user keeps consent, context, care decisions, and whether to seek human support.'",
    "'detail.im.session.identity.tab': 'Identity drift'",
    "'detail.im.session.identity.boundary': 'The mirror may reflect continuity; identity remains authored by the person and supported by real relationships.'",
    "'detail.im.session.launch.tab': 'Launch fear'",
    "'detail.im.session.launch.boundary': 'The mirror can suggest a safer test; it does not publish, contact people, or move reputation without consent.'",
    "'detail.im.session.loop.tab': 'Stuck loop'",
    "'detail.im.session.loop.boundary': 'The mirror names patterns without turning them into identity; care, safety, and support remain human-led.'",
    "'detail.im.session.kicker': 'Consola de sesión'",
    "'detail.im.session.title': 'Elige una solicitud de reflexión e inspecciona qué puede hacer el espejo.'",
    "'detail.im.session.overwhelm.tab': 'Sobrecarga'",
    "'detail.im.session.launch.tab': 'Miedo a lanzar'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing Infinity Mirror session snippet ${snippet}`);
  }

  assert.ok(css.includes('.infinity-mirror-session-board'), 'CSS missing Infinity Mirror session board');
  assert.ok(css.includes('.infinity-mirror-session-tabs label:hover'), 'CSS missing Infinity Mirror session hover state');
  assert.ok(css.includes('#im-session-overwhelm:focus-visible'), 'CSS missing Infinity Mirror session keyboard focus state');
  assert.ok(css.includes('.infinity-mirror-session-asset'), 'CSS missing Infinity Mirror session asset rules');
  assert.ok(css.includes('pointer-events: none;'), 'CSS missing non-interactive Infinity Mirror session asset behavior');
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'CSS missing reduced-motion media query');

  const asset = manifest.assets.find(item => item.id === 'infinity-mirror-session-console');
  assert.ok(asset, 'asset manifest missing Infinity Mirror session console');
  assert.equal(asset.file, 'assets/visuals/infinity-mirror-session-console.svg');
  assert.equal(asset.route, '/organisms/infinity-mirror');
  assert.equal(asset.surface, '#infinity-mirror-session-title');
  assert.match(asset.accessibility, /native radio controls/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'Infinity Mirror session SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'Infinity Mirror session SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'Infinity Mirror session SVG should not embed UI text');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'Infinity Mirror session SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'Infinity Mirror session SVG should be presentational');

  assert.ok(llms.includes('Infinity Mirror Session Console'), 'llms.txt missing Infinity Mirror session console');
  assert.ok(services.includes('"id": "infinity_mirror_session_console"'), 'ai-services missing Infinity Mirror session console');
  assert.ok(services.includes('overwhelm, identity drift, launch fear, and stuck loop requests'), 'ai-services missing Infinity Mirror session request list');
});

test('infinity mirror page exposes a capability ledger before emotional product motion', async () => {
  const source = await readFile(new URL('../organisms/infinity-mirror/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const servicesJson = JSON.parse(services);
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));

  const briefIndex = source.indexOf('id="infinity-mirror-brief-title"');
  const capabilityIndex = source.indexOf('id="infinity-mirror-capability-title"');
  const loopIndex = source.indexOf('id="infinity-mirror-loop-title"');
  assert.ok(briefIndex > -1, 'Infinity Mirror page missing product brief');
  assert.ok(capabilityIndex > briefIndex, 'capability ledger should follow the product brief');
  assert.ok(loopIndex > capabilityIndex, 'capability ledger should appear before the reflection loop');

  for (const snippet of [
    'class="lab-section infinity-mirror-capability-ledger-section"',
    'aria-labelledby="infinity-mirror-capability-title"',
    'id="infinity-mirror-capability-title"',
    'class="infinity-mirror-capability-ledger"',
    'class="infinity-mirror-capability-row"',
    'class="infinity-mirror-capability-row boundary"',
    'data-i18n="detail.im.capability.kicker"',
    'data-i18n="detail.im.capability.title"',
    'data-i18n="detail.im.capability.meta.input"',
    'data-i18n="detail.im.capability.meta.memory"',
    'data-i18n="detail.im.capability.meta.tool"',
    'data-i18n="detail.im.capability.meta.approval"',
    'data-i18n="detail.im.capability.meta.blocked"',
    'data-i18n="detail.im.capability.capture.blocked"',
    'data-i18n="detail.im.capability.memory.blocked"',
    'data-i18n="detail.im.capability.action.blocked"',
    'data-i18n="detail.im.capability.stop.blocked"',
    'href="#infinity-mirror-session-title"',
    'href="#infinity-mirror-loop-title"',
    'href="/proof/#authority-gate-title"',
  ]) {
    assert.ok(source.includes(snippet), `Infinity Mirror capability ledger missing ${snippet}`);
  }

  for (const snippet of [
    "'detail.im.capability.kicker': 'Capability ledger'",
    "'detail.im.capability.title': 'What the mirror can do, what it cannot claim, and where proof lives.'",
    "'detail.im.capability.capture.blocked': 'No diagnosis, identity verdict, hidden profiling, or destiny claim.'",
    "'detail.im.capability.memory.blocked': 'No hidden memory map, identity inference, or irreversible profile.'",
    "'detail.im.capability.action.tool': 'No public contact, posting, spending, file writes, or reputation motion.'",
    "'detail.im.capability.stop.blocked': 'No therapy replacement, emergency handling, or professional advice claim.'",
    "'detail.im.capability.kicker': 'Ledger de capacidades'",
    "'detail.im.capability.title': 'Qué puede hacer el espejo, qué no puede afirmar y dónde vive la prueba.'",
    "'detail.im.capability.capture.blocked': 'Sin diagnóstico, veredicto de identidad, perfil oculto ni afirmación de destino.'",
    "'detail.im.capability.stop.proof': 'Inspeccionar la compuerta de autoridad'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing Infinity Mirror capability ledger snippet ${snippet}`);
  }

  for (const snippet of [
    '.infinity-mirror-capability-ledger-section',
    '.infinity-mirror-capability-header',
    '.infinity-mirror-capability-ledger',
    '.infinity-mirror-capability-row',
    '.infinity-mirror-capability-row.boundary',
    '.infinity-mirror-capability-row dl',
    '.infinity-mirror-capability-row dd a:focus-visible',
    '@media (max-width: 900px)',
    '@media (max-width: 640px)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing Infinity Mirror capability ledger snippet ${snippet}`);
  }

  const serviceAsset = servicesJson.immersive_assets.find(item => item.id === 'infinity_mirror_capability_ledger');
  assert.ok(serviceAsset, 'ai-services missing Infinity Mirror capability ledger');
  assert.equal(serviceAsset.asset, 'semantic-html');
  assert.equal(serviceAsset.route, 'https://www.unwindcode.ai/organisms/infinity-mirror/#infinity-mirror-capability-title');
  assert.match(serviceAsset.purpose, /capture, memory, motion, and stop boundaries/);
  assert.match(serviceAsset.trust_boundary, /No diagnosis/);
  assert.match(serviceAsset.trust_boundary, /therapy replacement/);
  assert.match(serviceAsset.motion_policy, /No new animation dependency/);

  const manifestAsset = manifest.assets.find(item => item.id === 'infinity-mirror-capability-ledger');
  assert.ok(manifestAsset, 'asset manifest missing Infinity Mirror capability ledger');
  assert.equal(manifestAsset.file, 'organisms/infinity-mirror/index.html#infinity-mirror-capability-title');
  assert.equal(manifestAsset.format, 'semantic-html/css');
  assert.equal(manifestAsset.status, 'local-proof');
  assert.match(manifestAsset.accessibility, /ordered rows/);
  assert.match(manifestAsset.motion_policy, /no WebGL/);
  assert.deepEqual(manifestAsset.performance.dependencies, []);

  assert.ok(llms.includes('Infinity Mirror Capability Ledger'), 'llms.txt missing Infinity Mirror capability ledger');
  assert.ok(llms.includes('capture, memory, motion, and stop boundaries'), 'llms.txt missing Infinity Mirror capability boundary summary');
});

test('infinity mirror experience turns the blueprint into a semantic portal route', async () => {
  const source = await readFile(new URL('../organisms/infinity-mirror/experience/index.html', import.meta.url), 'utf8');
  const productPage = await readFile(new URL('../organisms/infinity-mirror/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const main = await readFile(new URL('../main.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const sitemap = await readFile(new URL('../sitemap.xml', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/infinity-mirror-portal.svg', import.meta.url), 'utf8');
  const implementationPacket = JSON.parse(await readFile(new URL('../assets/specs/infinity-mirror-implementation-packet.json', import.meta.url), 'utf8'));
  const experienceAudit = await readFile(new URL('../assets/specs/infinity-mirror-experience-audit.md', import.meta.url), 'utf8');
  const engineConceptAnalysis = await readFile(new URL('../assets/specs/infinity-mirror-engine-concept-analysis.md', import.meta.url), 'utf8');
  const runtimeCodeHandoff = await readFile(new URL('../assets/specs/infinity-mirror-runtime-code-handoff.md', import.meta.url), 'utf8');
  const runtimeKitReadme = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/README.md', import.meta.url), 'utf8');
  const runtimeKitPage = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/app/organisms/infinity-mirror/experience/page.tsx', import.meta.url), 'utf8');
  const runtimeKitAdaptiveEngine = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/AdaptiveMirrorEngine.tsx', import.meta.url), 'utf8');
  const runtimeKitDesireWall = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/DesireTranslationWall.tsx', import.meta.url), 'utf8');
  const runtimeKitBrainNetwork = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/BrainCellNetwork.tsx', import.meta.url), 'utf8');
  const runtimeKitOrganismVisualizer = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/LivingOrganismVisualizer.tsx', import.meta.url), 'utf8');
  const runtimeKitGrowthTimeline = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/RecursiveGrowthTimeline.tsx', import.meta.url), 'utf8');
  const runtimeKitCognitiveTrace = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/CognitiveEvolutionTrace.tsx', import.meta.url), 'utf8');
  const runtimeKitArchitectureMaps = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/FloatingArchitectureMaps.tsx', import.meta.url), 'utf8');
  const runtimeKitReflectionNavigator = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/InfiniteReflectionNavigator.tsx', import.meta.url), 'utf8');
  const runtimeKitStateSequencer = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/MirrorStateSequencer.client.tsx', import.meta.url), 'utf8');
  const runtimeKitProofCascade = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/ProofCascade.tsx', import.meta.url), 'utf8');
  const runtimeKitPhaseLedger = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/PhaseProofLedger.tsx', import.meta.url), 'utf8');
  const runtimeKitProofObservatory = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/ProofObservatory.client.tsx', import.meta.url), 'utf8');
  const runtimeKitAuthorityGradient = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/AuthorityGradient.tsx', import.meta.url), 'utf8');
  const runtimeKitScrollMap = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/ScrollChoreographyMap.tsx', import.meta.url), 'utf8');
  const runtimeKitEmotionRail = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/EmotionalProgressionRail.client.tsx', import.meta.url), 'utf8');
  const runtimeKitMotionLedger = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/MotionContractLedger.tsx', import.meta.url), 'utf8');
  const runtimeKitExperienceAudit = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/ExperienceAuditConsole.tsx', import.meta.url), 'utf8');
  const runtimeKitSourceLedger = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/SourceTranslationLedger.tsx', import.meta.url), 'utf8');
  const runtimeKitEngineLedger = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/EngineTranslationLedger.tsx', import.meta.url), 'utf8');
  const runtimeKitBuildLedger = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/InterfaceBuildLedger.tsx', import.meta.url), 'utf8');
  const runtimeKitHandoffMatrix = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/RuntimeHandoffMatrix.tsx', import.meta.url), 'utf8');
  const runtimeKitDepthGate = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/MirrorDepthGate.tsx', import.meta.url), 'utf8');
  const runtimeKitSymbolLanguage = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/InfinitySymbolLanguage.tsx', import.meta.url), 'utf8');
  const runtimeKitSignalComposer = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/SignalComposer.client.tsx', import.meta.url), 'utf8');
  const runtimeKitMemoryConsent = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/MemoryConsentLedger.tsx', import.meta.url), 'utf8');
  const runtimeKitRouteCompass = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/MirrorRouteCompass.tsx', import.meta.url), 'utf8');
  const runtimeKitRecursiveBrainTunnel = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/RecursiveBrainTunnel.tsx', import.meta.url), 'utf8');
  const runtimeKitBrainRouteConsole = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/BrainRouteConsole.tsx', import.meta.url), 'utf8');
  const runtimeKitBrainSignalHandoff = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/BrainSignalHandoff.client.tsx', import.meta.url), 'utf8');
  const runtimeKitJoinRoutes = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/JoinEvolutionRoutes.tsx', import.meta.url), 'utf8');
  const runtimeKitFirstArtifact = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/FirstArtifactRouter.tsx', import.meta.url), 'utf8');
  const runtimeKitEntryProtocol = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/EvolutionEntryProtocol.tsx', import.meta.url), 'utf8');
  const runtimeKitFramer = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/MirrorChapterMotion.client.tsx', import.meta.url), 'utf8');
  const runtimeKitGsap = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/MirrorPortalTimeline.client.tsx', import.meta.url), 'utf8');
  const runtimeKitThree = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/components/mirror/MirrorBrainTunnelGate.client.tsx', import.meta.url), 'utf8');
  const runtimeKitContent = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/lib/mirror/infinityMirrorContent.ts', import.meta.url), 'utf8');
  const runtimeKitAssets = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/lib/mirror/infinityMirrorAssets.ts', import.meta.url), 'utf8');
  const runtimeKitTailwind = await readFile(new URL('../assets/specs/infinity-mirror-runtime-kit/tailwind.config.ts', import.meta.url), 'utf8');

  for (const snippet of [
    '<title>Infinity Mirror Interface - Self-Evolving AI Organisms | Unwind Code</title>',
    '<link rel="canonical" href="https://www.unwindcode.ai/organisms/infinity-mirror/experience" />',
    'content="Enter a black reflective void where the infinity symbol becomes a portal into AI organisms, brain cells, recursive growth, and proof-bound cognitive evolution."',
    'body class="lab-page mirror-experience-page"',
    'id="mirror-experience-hero"',
    'id="mirror-question-title"',
    'id="mirror-reflection-title"',
    'id="mirror-brain-title"',
    'id="mirror-organisms-title"',
    'id="mirror-growth-title"',
    'id="mirror-proof-title"',
    'id="mirror-join-title"',
    'data-asset-id="infinity-mirror-portal"',
    '/assets/visuals/infinity-mirror-portal.svg',
    'class="mirror-portal-depth"',
    'class="mirror-depth-ring mirror-depth-ring-three"',
    'id="mirror-runtime-field"',
    'class="mirror-runtime-field"',
    'data-runtime-owner="bounded-canvas"',
    'data-runtime-fallback="infinity-mirror-portal-svg"',
    'data-runtime-stop="reduced-motion-compact-offscreen"',
    'class="mirror-fracture-sequence"',
    'data-i18n-aria-label="mirrorExp.fracture.aria"',
    'class="mirror-fracture-field"',
    'class="mirror-fracture-shard mirror-fracture-shard-three"',
    'data-fracture-cell="proof"',
    'data-fracture-step="cells"',
    'class="mirror-threshold-readout"',
    'data-i18n-aria-label="mirrorExp.threshold.aria"',
    'class="mirror-scroll-map"',
    'class="mirror-scroll-link" href="#mirror-question-title"',
    'class="mirror-scroll-link" href="#mirror-reflection-title"',
    'class="mirror-scroll-link" href="#mirror-brain-title"',
    'class="mirror-scroll-link" href="#mirror-organisms-title"',
    'class="mirror-scroll-link" href="#mirror-growth-title"',
    'class="mirror-scroll-link" href="#mirror-proof-title"',
    'class="mirror-scroll-link" href="#mirror-join-title"',
    'class="mirror-experience-section mirror-navigation-section"',
    'class="container mirror-reflection-navigation"',
    'id="mirror-reflection-navigation"',
    'data-i18n-aria-label="mirrorExp.navigator.aria"',
    'id="mirror-navigation-title"',
    'class="mirror-infinite-nav-shell"',
    'class="mirror-nav-fieldset"',
    'id="mirror-nav-human"',
    'id="mirror-nav-brain"',
    'id="mirror-nav-proof"',
    'id="mirror-nav-build"',
    'class="mirror-nav-orbit"',
    'class="mirror-nav-infinity"',
    'data-nav-node="human"',
    'data-nav-node="brain"',
    'class="mirror-nav-tabs"',
    'data-i18n-aria-label="mirrorExp.navigator.tabs.aria"',
    'data-nav-lens="proof"',
    'class="mirror-nav-panels"',
    'data-nav-panel="build"',
    'href="#mirror-human-signal-atlas"',
    'href="#mirror-brain-title"',
    'href="#mirror-proof-title"',
    'href="#mirror-join-title"',
    'class="mirror-nav-chapter-ring"',
    'data-i18n-aria-label="mirrorExp.navigator.chapters.aria"',
    'class="mirror-reflection-stack"',
    'class="mirror-comparison-grid"',
    'class="mirror-tension-thread"',
    'class="mirror-human-signal-atlas"',
    'id="mirror-human-signal-atlas"',
    'data-i18n-aria-label="mirrorExp.humanSignal.aria"',
    'href="https://www.anthropic.com/features/81k-interviews"',
    'data-human-signal-node="world"',
    'class="mirror-human-signal-grid"',
    'data-human-signal="security"',
    'id="mirror-desire-translation"',
    'class="mirror-desire-translation"',
    'data-i18n-aria-label="mirrorExp.desireWall.aria"',
    'class="mirror-desire-translation-orbit"',
    'data-desire-node="security"',
    'class="mirror-desire-translation-grid"',
    'data-i18n-aria-label="mirrorExp.desireWall.grid.aria"',
    'data-desire-route="work"',
    'data-desire-route="becoming"',
    'data-desire-route="creative"',
    'id="mirror-route-compass"',
    'class="mirror-route-compass"',
    'data-i18n-aria-label="mirrorExp.routeCompass.aria"',
    'data-runtime-owner="semantic-route-compass"',
    'class="mirror-route-compass-dial"',
    'class="mirror-route-compass-grid"',
    'data-i18n-aria-label="mirrorExp.routeCompass.grid.aria"',
    'data-route-compass="mental-room"',
    'data-route-compass="mastery"',
    'data-route-compass="access"',
    'data-route-compass="becoming"',
    'data-route-compass="security"',
    'data-route-compass="world"',
    'class="mirror-route-compass-boundary"',
    'class="mirror-delivery-calibration"',
    'id="mirror-delivery-calibration"',
    'data-i18n-aria-label="mirrorExp.delivery.aria"',
    'class="mirror-delivery-meter"',
    'class="mirror-delivery-grid"',
    'data-delivery-signal="not-delivered"',
    'class="mirror-brain-system"',
    'data-i18n-aria-label="mirrorExp.brain.system.aria"',
    'data-runtime-owner="bounded-brain-route"',
    'data-runtime-stop="reduced-motion-compact-offscreen"',
    'data-brain-runtime="idle"',
    'data-route-phase="signal"',
    'data-signal-profile="mental-room"',
    'class="mirror-brain-tunnel"',
    'data-i18n-aria-label="mirrorExp.tunnel.aria"',
    'class="mirror-tunnel-ring mirror-tunnel-ring-three"',
    'data-tunnel-cell="immune"',
    'data-tunnel-step="boundary"',
    'class="mirror-brain-network"',
    'data-i18n-aria-label="mirrorExp.brain.network.aria"',
    'class="mirror-cell" data-cell="gateway"',
    'class="mirror-brain-route-console"',
    'data-i18n-aria-label="mirrorExp.brain.route.aria"',
    'class="mirror-brain-handoff"',
    'data-i18n-aria-label="mirrorExp.brain.handoff.aria"',
    'data-brain-handoff="signal"',
    'data-brain-handoff="authority"',
    'class="mirror-brain-route-steps"',
    'data-brain-route-copy="signal"',
    'data-brain-route-copy="authority"',
    'data-route-stage="authority"',
    'class="mirror-brain-state-grid"',
    'data-brain-state-copy="authority"',
    'data-state-cell="boundary"',
    'class="mirror-brain-route-note"',
    'class="mirror-organism-visualizer"',
    'data-i18n-aria-label="mirrorExp.visualizer.aria"',
    'data-runtime-owner="bounded-organism-relay"',
    'data-runtime-stop="reduced-motion-compact-offscreen"',
    'data-relay-runtime="idle"',
    'data-organism-phase="visual"',
    'class="mirror-organism-spine"',
    'data-i18n-aria-label="mirrorExp.visualizer.spine.aria"',
    'class="mirror-spine-node" data-spine-node="gateway"',
    'data-spine-node="immune"',
    'class="mirror-organism-orbit"',
    'data-i18n-aria-label="mirrorExp.visualizer.paths.aria"',
    'data-organism="visual"',
    'data-organism="mirror"',
    'data-organism="financial"',
    'data-organism="research"',
    'class="mirror-growth-system"',
    'data-i18n-aria-label="mirrorExp.growth.loop.aria"',
    'data-runtime-owner="bounded-growth-relay"',
    'data-growth-runtime="idle"',
    'data-growth-phase="pattern"',
    'class="mirror-growth-field"',
    'class="mirror-growth-rail"',
    'data-i18n-aria-label="mirrorExp.growth.rail.aria"',
    'data-growth-node="integration"',
    'data-growth-step="integration"',
    'class="mirror-growth-boundary"',
    'class="mirror-proof-stack"',
    'class="mirror-architecture-maps"',
    'data-i18n-aria-label="mirrorExp.archMaps.aria"',
    'class="mirror-architecture-map-header"',
    'class="mirror-architecture-map-grid"',
    'id="mirror-scroll-choreography"',
    'class="mirror-scroll-choreography"',
    'data-i18n-aria-label="mirrorExp.scrollMap.aria"',
    'class="mirror-scroll-choreography-header"',
    'class="mirror-scroll-choreography-grid"',
    'data-i18n-aria-label="mirrorExp.scrollMap.grid.aria"',
    'data-scroll-act="mirror"',
    'data-scroll-act="brain"',
    'data-scroll-act="proof"',
    'data-scroll-act="join"',
    'id="mirror-state-sequencer"',
    'class="container mirror-state-sequencer"',
    'data-runtime-owner="bounded-state-sequencer"',
    'data-active-state="mirror"',
    'data-mirror-state-control="mirror"',
    'data-mirror-state-control="join"',
    'data-mirror-state-output="signal"',
    'data-mirror-state-output="boundary"',
    'data-mirror-state-link',
    'id="mirror-cognitive-evolution-trace"',
    'class="container mirror-cognitive-trace"',
    'data-runtime-owner="semantic-cognitive-evolution"',
    'class="mirror-cognitive-trace-grid"',
    'data-cognitive-step="signal"',
    'data-cognitive-step="next-loop"',
    'data-i18n="mirrorExp.cognitiveTrace.next.proof"',
    'id="mirror-phase-proof-ledger"',
    'class="mirror-phase-proof-ledger"',
    'data-i18n-aria-label="mirrorExp.phaseLedger.aria"',
    'class="mirror-phase-ledger-grid"',
    'data-i18n-aria-label="mirrorExp.phaseLedger.grid.aria"',
    'data-phase-proof="reverse-engineering"',
    'data-phase-proof="execution"',
    'href="#mirror-code-handoff"',
    'data-i18n="mirrorExp.phaseLedger.execution.boundary"',
    'class="mirror-proof-band"',
    'class="mirror-proof-instrument"',
    'class="mirror-proof-cascade"',
    'data-cascade-step="boundary"',
    'id="mirror-proof-observatory"',
    'class="mirror-proof-observatory"',
    'data-runtime-owner="bounded-proof-observatory"',
    'data-active-proof="architecture"',
    'data-proof-observatory-control="architecture"',
    'data-proof-observatory-control="status"',
    'data-proof-observatory-output="evidence"',
    'data-proof-observatory-output="boundary"',
    'data-proof-observatory-link href="/architecture"',
    'id="mirror-authority-gradient"',
    'class="mirror-authority-gradient"',
    'data-i18n-aria-label="mirrorExp.authorityGradient.aria"',
    'class="mirror-authority-gradient-rail"',
    'data-i18n-aria-label="mirrorExp.authorityGradient.rail.aria"',
    'data-authority-rung="observe"',
    'data-authority-rung="sandbox"',
    'data-authority-rung="approval"',
    'data-authority-rung="publish"',
    'data-i18n="mirrorExp.authorityGradient.boundary"',
    'id="mirror-infinity-language"',
    'class="mirror-infinity-language"',
    'data-i18n-aria-label="mirrorExp.symbol.aria"',
    'class="mirror-infinity-language-grid"',
    'data-i18n-aria-label="mirrorExp.symbol.grid.aria"',
    'data-symbol-state="portal"',
    'data-symbol-state="doorway"',
    'class="mirror-symbol-mark"',
    'class="mirror-evolution-doorway"',
    'data-i18n-aria-label="mirrorExp.doorway.aria"',
    'class="mirror-dynamic-infinity"',
    'class="mirror-join-grid"',
    'data-i18n-aria-label="mirrorExp.doorway.paths.aria"',
    'class="mirror-doorway-link"',
    'data-doorway="builders"',
    'data-doorway="investors"',
    'data-doorway="researchers"',
    'data-doorway="partners"',
    'class="mirror-doorway-commitment"',
    'id="mirror-first-artifact-router"',
    'class="mirror-first-artifact-router"',
    'data-i18n-aria-label="mirrorExp.firstArtifact.aria"',
    'data-runtime-owner="semantic-first-artifact-router"',
    'class="mirror-first-artifact-grid"',
    'data-first-artifact-route="builder"',
    'data-first-artifact-route="investor"',
    'data-first-artifact-route="researcher"',
    'data-first-artifact-route="partner"',
    'class="mirror-first-artifact-boundary"',
    'id="mirror-evolution-entry-protocol"',
    'class="mirror-entry-protocol"',
    'data-i18n-aria-label="mirrorExp.entryProtocol.aria"',
    'class="mirror-entry-protocol-grid"',
    'data-entry-step="signal"',
    'data-entry-step="boundary"',
    'data-entry-step="artifact"',
    'data-entry-step="loop"',
    'data-i18n="mirrorExp.entryProtocol.loop.proof"',
    'href="/organisms/infinity-mirror"',
    'href="/architecture"',
    'href="/proof"',
    'href="/build-with-us"',
    'href="/vision"',
    'href="/vision/#vision-observatory-title"',
    'href="/organisms/visual-cortex"',
    'href="/organisms/financial-organisms"',
    'href="/organisms/brain-cell-architecture"',
    'href="/proof/#proof-register-title"',
    'href="/transmissions/#transmission-atlas-title"',
    'href="/proof/#authority-gate-title"',
    '01 / The Mirror',
    '02 / Reflection',
    '03 / The Brain',
    '04 / The Organisms',
    '05 / Recursive growth',
    '06 / Proof',
    '07 / Join Evolution',
    'class="mirror-reflection-plane"',
    'class="mirror-plane-surface"',
    'class="mirror-plane-current mirror-plane-current-two"',
    'data-plane-step="boundary"',
    'data-plane-step="proof"',
    'class="mirror-signal-constellation"',
    'data-i18n-aria-label="mirrorExp.signal.aria"',
    'class="mirror-signal-field"',
    'data-signal-node="researcher"',
    'class="mirror-signal-packets"',
    'data-signal-role="investor"',
    'class="mirror-adaptive-engine"',
    'data-runtime-owner="bounded-adaptive-lens-relay"',
    'data-lens-runtime="idle"',
    'data-active-lens="architect"',
    'class="mirror-adaptive-orbit"',
    'data-lens-node="cartographer"',
    'data-lens="ritualist"',
    'class="mirror-adaptive-lens-button"',
	    'data-lens-control="translator"',
	    'data-lens-loop="translate"',
	    'class="mirror-adaptive-loop"',
	    'class="mirror-signal-composer"',
	    'id="mirror-signal-composer"',
	    'data-runtime-owner="bounded-signal-composer"',
	    'data-active-signal="mental-room"',
	    'class="mirror-signal-composer-controls"',
	    'data-signal-control="quiet-listen"',
	    'class="mirror-signal-composer-output"',
	    'data-composer-output="artifact"',
	    'class="mirror-memory-consent"',
	    'id="mirror-memory-consent"',
	    'data-i18n-aria-label="mirrorExp.memoryConsent.aria"',
	    'data-runtime-owner="semantic-memory-consent-ledger"',
	    'class="mirror-memory-consent-grid"',
	    'data-memory-consent="ephemeral"',
	    'data-memory-consent="proposed"',
	    'data-memory-consent="reviewed"',
	    'data-memory-consent="integrated"',
	    'class="mirror-memory-consent-boundary"',
	    'class="mirror-remix-fit"',
	    'id="mirror-remix-fit"',
    'data-i18n-aria-label="mirrorExp.remixFit.aria"',
    'class="mirror-remix-fit-orbit"',
    'class="mirror-remix-fit-grid"',
    'data-remix-fit="lens"',
    'data-remix-fit="descent"',
    'class="mirror-shell-specimen"',
    'id="mirror-shell-specimen"',
    'data-i18n-aria-label="mirrorExp.shellSpecimen.aria"',
    'class="mirror-shell-phone"',
    'data-i18n-aria-label="mirrorExp.shellSpecimen.phone.aria"',
    'class="mirror-shell-stage"',
    'class="mirror-shell-growth"',
    'data-i18n-aria-label="mirrorExp.shellSpecimen.growth.aria"',
    'class="mirror-shell-prompt"',
    'class="mirror-shell-artifact"',
    'class="mirror-shell-bottom-nav"',
    'href="#mirror-product-loop"',
    'data-i18n="mirrorExp.shellSpecimen.nav.proof"',
    'class="mirror-shell-proof-list"',
    'data-shell-rule="artifact"',
    'class="mirror-product-loop"',
    'id="mirror-product-loop"',
    'data-i18n-aria-label="mirrorExp.productLoop.aria"',
    'class="mirror-product-shell"',
    'data-product-facet="map"',
    'class="mirror-product-steps"',
    'data-product-step="artifact"',
    'class="mirror-product-valve"',
    'class="mirror-returned-artifact"',
    'id="mirror-returned-artifact"',
    'data-i18n-aria-label="mirrorExp.artifact.aria"',
	    'data-runtime-owner="bounded-artifact-return"',
	    'data-artifact-runtime="idle"',
	    'data-artifact-phase="signal"',
	    'class="mirror-artifact-readout"',
	    'data-artifact-field="signal"',
	    'data-artifact-field="proof"',
	    'class="mirror-repair-ledger"',
    'data-i18n-aria-label="mirrorExp.repair.aria"',
    'data-artifact-node="boundary"',
    'data-artifact-step="proof"',
    'data-artifact-decision="deepen"',
    'class="mirror-artifact-route-list"',
    'class="mirror-descent-protocol"',
    'id="mirror-descent-protocol"',
    'data-i18n-aria-label="mirrorExp.descent.aria"',
    'class="mirror-descent-meter"',
    'class="mirror-descent-rail"',
    'data-descent-step="lattice"',
    'data-descent-step="return"',
    'class="mirror-facing-card"',
    'class="mirror-motion-contract"',
    'data-i18n-aria-label="mirrorExp.motionContract.aria"',
    'class="mirror-motion-contract-grid"',
    'data-motion-contract="portal"',
    'data-motion-contract="human-signal"',
    'data-motion-contract="descent"',
    'data-motion-contract="proof"',
    'data-motion-contract="doorway"',
    'class="mirror-experience-audit"',
    'id="mirror-experience-audit"',
    'data-i18n-aria-label="mirrorExp.audit.aria"',
    'href="/assets/specs/infinity-mirror-experience-audit.md"',
    'class="mirror-experience-audit-link"',
    'class="mirror-experience-audit-grid"',
    'data-i18n-aria-label="mirrorExp.audit.grid.aria"',
    'data-audit-lens="information"',
    'data-audit-lens="scroll"',
    'data-audit-lens="motion"',
    'data-audit-lens="emotion"',
    'data-audit-lens="performance"',
    'class="mirror-source-ledger"',
    'id="mirror-source-ledger"',
    'data-i18n-aria-label="mirrorExp.sourceLedger.aria"',
    'class="mirror-source-ledger-grid"',
    'data-source-pattern="scale"',
    'data-source-pattern="method"',
    'data-source-pattern="delivery"',
    'data-source-pattern="nonclone"',
    'https://www.anthropic.com/features/81k-interviews',
    'class="mirror-engine-translation"',
    'id="mirror-engine-translation"',
    'data-i18n-aria-label="mirrorExp.engineTranslation.aria"',
    'class="mirror-engine-console"',
    'data-engine-signal="pointer"',
    'class="mirror-engine-state-rail"',
    'data-engine-state="approval"',
    'class="mirror-engine-fit-rail"',
    'data-engine-fit="block"',
    'class="mirror-engine-concept-packet"',
    'id="mirror-engine-concept-packet"',
    'data-i18n-aria-label="mirrorExp.engineConcept.aria"',
    'href="/assets/specs/infinity-mirror-engine-concept-analysis.md"',
    'class="mirror-engine-concept-link"',
    'class="mirror-engine-concept-grid"',
    'data-concept-decision="prototype"',
    'data-concept-decision="block"',
    'class="mirror-build-ledger"',
    'id="mirror-build-ledger"',
    'data-i18n-aria-label="mirrorExp.buildLedger.aria"',
    'class="mirror-build-ledger-stack"',
    'class="mirror-build-ledger-grid"',
    'data-build-stage="three"',
    'data-build-stage="release"',
    'class="mirror-execution-packet"',
    'id="mirror-execution-packet"',
    'data-i18n-aria-label="mirrorExp.execution.aria"',
    'class="mirror-execution-packet-link"',
    'href="/assets/specs/infinity-mirror-implementation-packet.json"',
    'data-i18n="mirrorExp.execution.packetCta"',
    'class="mirror-execution-packet-grid"',
    'data-execution-packet="react"',
    'data-execution-packet="framer"',
    'data-execution-packet="tunnel"',
    'data-execution-packet="release"',
    'class="mirror-runtime-handoff"',
    'id="mirror-runtime-handoff"',
    'data-i18n-aria-label="mirrorExp.runtime.aria"',
    'class="mirror-runtime-handoff-grid"',
    'data-runtime-lane="css"',
    'data-runtime-lane="framer"',
    'data-runtime-lane="gsap"',
    'data-runtime-lane="three"',
    'class="mirror-runtime-boundary"',
    'class="mirror-depth-gate"',
    'id="mirror-depth-gate"',
    'data-i18n-aria-label="mirrorExp.depthGate.aria"',
    'class="mirror-depth-gate-grid"',
    'data-depth-lane="semantic"',
    'data-depth-lane="framer"',
    'data-depth-lane="gsap"',
    'data-depth-lane="webgl"',
    'class="mirror-depth-gate-boundary"',
    'class="mirror-code-handoff"',
    'id="mirror-code-handoff"',
    'data-i18n-aria-label="mirrorExp.codeHandoff.aria"',
    'href="/assets/specs/infinity-mirror-runtime-code-handoff.md"',
    'href="/assets/specs/infinity-mirror-runtime-kit/README.md"',
    'class="mirror-code-handoff-link"',
    'class="mirror-code-handoff-grid"',
    'data-code-handoff="react"',
    'data-code-handoff="framer"',
    'data-code-handoff="gsap"',
    'data-code-handoff="three"',
    'data-code-handoff="tailwind"',
    'data-code-handoff="assets"',
    'Financial Organism',
    'Research Organisms',
    '"@id":"https://www.unwindcode.ai/organisms/infinity-mirror/experience/#infinity-mirror-portal-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/infinity-mirror-portal.svg"',
  ]) {
    assert.ok(source.includes(snippet), `Infinity Mirror experience missing snippet ${snippet}`);
  }

  const motionDurationHooks = source.match(/data-i18n="mirrorExp\.motionContract\.[^"]+\.duration"/g) || [];
  const motionEasingHooks = source.match(/data-i18n="mirrorExp\.motionContract\.[^"]+\.easing"/g) || [];
  assert.equal(motionDurationHooks.length, 9, 'Infinity Mirror motion contract should expose duration for every motion card');
  assert.equal(motionEasingHooks.length, 9, 'Infinity Mirror motion contract should expose easing for every motion card');

  for (const snippet of [
    'data-i18n="mirrorExp.hero.kicker"',
    'data-i18n="mirrorExp.hero.title"',
    'data-i18n="mirrorExp.threshold.title"',
    'data-i18n="mirrorExp.threshold.boundary.desc"',
    'data-i18n="mirrorExp.threshold.proof.desc"',
    'data-i18n="mirrorExp.reflection.title"',
    'data-i18n="mirrorExp.compare.organism.desc"',
    'data-i18n-aria-label="mirrorExp.reflectionPlane.aria"',
    'data-i18n="mirrorExp.plane.input.title"',
    'data-i18n="mirrorExp.plane.memory.desc"',
    'data-i18n="mirrorExp.plane.boundary.desc"',
    'data-i18n="mirrorExp.plane.proof.desc"',
    'data-i18n="mirrorExp.tension.title"',
    'data-i18n="mirrorExp.tension.capability.desc"',
    'data-i18n="mirrorExp.tension.memory.desc"',
    'data-i18n="mirrorExp.tension.autonomy.desc"',
    'data-i18n="mirrorExp.humanSignal.title"',
    'data-i18n="mirrorExp.humanSignal.source"',
    'data-i18n="mirrorExp.humanSignal.access.route"',
    'data-i18n="mirrorExp.humanSignal.security.proof"',
    'data-i18n="mirrorExp.routeCompass.title"',
    'data-i18n="mirrorExp.routeCompass.mental.proof"',
    'data-i18n="mirrorExp.routeCompass.mastery.boundary"',
    'data-i18n="mirrorExp.routeCompass.access.cta"',
    'data-i18n="mirrorExp.routeCompass.boundaryNote"',
    'data-i18n="mirrorExp.delivery.title"',
    'data-i18n="mirrorExp.delivery.productivity.gate"',
    'data-i18n="mirrorExp.delivery.partnership.desc"',
    'data-i18n="mirrorExp.delivery.notDelivered.title"',
    'data-i18n-aria-label="mirrorExp.adaptive.aria"',
    'data-i18n="mirrorExp.adaptive.title"',
    'data-i18n="mirrorExp.adaptive.architect.desc"',
    'data-i18n="mirrorExp.adaptive.cartographer.desc"',
    'data-i18n="mirrorExp.adaptive.translator.desc"',
    'data-i18n="mirrorExp.adaptive.ritualist.desc"',
    'data-i18n="mirrorExp.adaptive.keep.desc"',
    'data-i18n="mirrorExp.remixFit.title"',
    'data-i18n="mirrorExp.remixFit.lens.boundary"',
    'data-i18n="mirrorExp.remixFit.valve.desc"',
    'data-i18n="mirrorExp.remixFit.descent.boundary"',
    'data-i18n="mirrorExp.productLoop.title"',
    'data-i18n="mirrorExp.productLoop.listen.desc"',
    'data-i18n="mirrorExp.productLoop.artifact.desc"',
    'data-i18n="mirrorExp.productLoop.valve.desc"',
    'data-i18n="mirrorExp.productLoop.decision.refuse"',
    'data-i18n="mirrorExp.artifact.title"',
    'data-i18n="mirrorExp.artifact.boundary.value"',
    'data-i18n="mirrorExp.artifact.proof.value"',
    'data-i18n="mirrorExp.artifact.route.proof"',
    'data-i18n="mirrorExp.repair.title"',
    'data-i18n="mirrorExp.descent.title"',
    'data-i18n="mirrorExp.descent.lattice.desc"',
    'data-i18n="mirrorExp.descent.return.desc"',
    'data-i18n="mirrorExp.descent.facing.title"',
    'data-i18n="mirrorExp.motionContract.title"',
    'data-i18n="mirrorExp.motionContract.duration"',
    'data-i18n="mirrorExp.motionContract.easing"',
    'data-i18n="mirrorExp.motionContract.portal.duration"',
    'data-i18n="mirrorExp.motionContract.portal.easing"',
    'data-i18n="mirrorExp.motionContract.portal.performance"',
    'data-i18n="mirrorExp.motionContract.humanSignal.duration"',
    'data-i18n="mirrorExp.motionContract.humanSignal.performance"',
    'data-i18n="mirrorExp.motionContract.product.animation"',
    'data-i18n="mirrorExp.motionContract.descent.animation"',
    'data-i18n="mirrorExp.motionContract.descent.easing"',
    'data-i18n="mirrorExp.motionContract.brain.performance"',
    'data-i18n="mirrorExp.motionContract.proof.timing"',
    'data-i18n="mirrorExp.motionContract.proof.duration"',
    'data-i18n="mirrorExp.motionContract.doorway.timing"',
    'data-i18n="mirrorExp.motionContract.doorway.easing"',
    'data-i18n="mirrorExp.navigator.title"',
    'data-i18n="mirrorExp.navigator.human.route"',
    'data-i18n="mirrorExp.navigator.brain.boundary"',
    'data-i18n="mirrorExp.navigator.proof.proof"',
    'data-i18n="mirrorExp.navigator.build.boundary"',
    'data-i18n="mirrorExp.audit.title"',
    'data-i18n="mirrorExp.audit.packetCta"',
    'data-i18n="mirrorExp.audit.purpose"',
    'data-i18n="mirrorExp.audit.information.reinterpret"',
    'data-i18n="mirrorExp.audit.scroll.title"',
    'data-i18n="mirrorExp.audit.performance.reinterpret"',
    'data-i18n="mirrorExp.engineConcept.title"',
    'data-i18n="mirrorExp.engineConcept.cta"',
    'data-i18n="mirrorExp.engineConcept.prototype.desc"',
    'data-i18n="mirrorExp.engineConcept.block.title"',
    'data-i18n="mirrorExp.buildLedger.title"',
    'data-i18n="mirrorExp.buildLedger.semantic.boundary"',
    'data-i18n="mirrorExp.buildLedger.three.title"',
    'data-i18n="mirrorExp.buildLedger.release.boundary"',
    'data-i18n="mirrorExp.execution.title"',
    'data-i18n="mirrorExp.execution.react.ships"',
    'data-i18n="mirrorExp.execution.framer.gate"',
    'data-i18n="mirrorExp.execution.tunnel.motion"',
    'data-i18n="mirrorExp.execution.release.gate"',
    'data-i18n="mirrorExp.codeHandoff.title"',
    'data-i18n="mirrorExp.codeHandoff.cta"',
    'data-i18n="mirrorExp.codeHandoff.kitCta"',
    'data-i18n="mirrorExp.codeHandoff.react.file"',
    'data-i18n="mirrorExp.codeHandoff.framer.guard"',
    'data-i18n="mirrorExp.codeHandoff.gsap.title"',
    'data-i18n="mirrorExp.codeHandoff.three.desc"',
    'data-i18n="mirrorExp.codeHandoff.tailwind.guard"',
    'data-i18n="mirrorExp.codeHandoff.assets.guard"',
    'data-i18n="mirrorExp.brain.title"',
    'data-i18n="mirrorExp.brain.cta"',
    'data-i18n="mirrorExp.tunnel.title"',
    'data-i18n="mirrorExp.tunnel.signal.desc"',
    'data-i18n="mirrorExp.tunnel.cells.desc"',
    'data-i18n="mirrorExp.tunnel.boundary.desc"',
    'data-i18n="mirrorExp.tunnel.proof.desc"',
    'data-i18n="mirrorExp.brain.route.title"',
    'data-i18n="mirrorExp.brain.handoff.signal"',
    'data-i18n="mirrorExp.composer.mental.brainAuthority"',
    'data-i18n="mirrorExp.composer.mental.brainProof"',
    'data-i18n="mirrorExp.brain.route.note"',
    'data-i18n="mirrorExp.cell.immune"',
    'data-i18n="mirrorExp.organisms.title"',
    'data-i18n="mirrorExp.visualizer.visual.desc"',
    'data-i18n="mirrorExp.visualizer.visual.boundary"',
    'data-i18n="mirrorExp.visualizer.mirror.desc"',
    'data-i18n="mirrorExp.visualizer.financial.boundary"',
    'data-i18n="mirrorExp.visualizer.research.boundary"',
    'data-i18n="mirrorExp.orbit.research"',
    'data-i18n="mirrorExp.growth.approval.desc"',
    'data-i18n="mirrorExp.growth.integration.title"',
    'data-i18n="mirrorExp.growth.integration.desc"',
    'data-i18n="mirrorExp.growth.boundary"',
    'data-i18n="mirrorExp.proof.title"',
    'data-i18n="mirrorExp.proof.metrics.title"',
    'data-i18n="mirrorExp.proof.deployments.title"',
    'data-i18n="mirrorExp.proof.status.title"',
    'data-i18n="mirrorExp.proofObs.title"',
    'data-i18n="mirrorExp.authorityGradient.title"',
    'data-i18n="mirrorExp.authorityGradient.sandbox.proof"',
    'data-i18n="mirrorExp.authorityGradient.approval.can"',
    'data-i18n="mirrorExp.authorityGradient.publish.proof"',
    'data-i18n="mirrorExp.archMaps.title"',
    'data-i18n="mirrorExp.archMaps.gateway.desc"',
    'data-i18n="mirrorExp.archMaps.cortex.desc"',
    'data-i18n="mirrorExp.archMaps.memory.desc"',
    'data-i18n="mirrorExp.archMaps.immune.desc"',
    'data-i18n="mirrorExp.archMaps.proof.desc"',
    'data-i18n="mirrorExp.scrollMap.title"',
    'data-i18n="mirrorExp.scrollMap.mirror.motion"',
    'data-i18n="mirrorExp.scrollMap.brain.proof"',
    'data-i18n="mirrorExp.scrollMap.proofAct.motion"',
    'data-i18n="mirrorExp.scrollMap.join.proof"',
    'data-i18n="mirrorExp.instrument.title"',
    'data-i18n-aria-label="mirrorExp.cascade.aria"',
    'data-i18n="mirrorExp.cascade.claim.desc"',
    'data-i18n="mirrorExp.cascade.route.desc"',
    'data-i18n="mirrorExp.cascade.boundary.desc"',
    'data-i18n="mirrorExp.cascade.artifact.desc"',
    'data-i18n="mirrorExp.instrument.boundary.desc"',
    'data-i18n="mirrorExp.instrument.evidence.desc"',
    'data-i18n="mirrorExp.instrument.next.desc"',
    'data-i18n="mirrorExp.symbol.title"',
    'data-i18n="mirrorExp.symbol.desc"',
    'data-i18n="mirrorExp.symbol.portal.desc"',
    'data-i18n="mirrorExp.symbol.growth.desc"',
    'data-i18n="mirrorExp.symbol.doorway.desc"',
    'data-i18n="mirrorExp.join.researchers.title"',
    'data-i18n="mirrorExp.join.partners.title"',
    'data-i18n="mirrorExp.doorway.builders.desc"',
    'data-i18n="mirrorExp.doorway.builders.boundary"',
    'data-i18n="mirrorExp.doorway.investors.proof"',
    'data-i18n="mirrorExp.doorway.researchers.boundary"',
    'data-i18n="mirrorExp.doorway.partners.next"',
    'data-i18n="mirrorExp.doorway.commitment"',
    'data-i18n="mirrorExp.firstArtifact.title"',
    'data-i18n="mirrorExp.firstArtifact.builder.artifact"',
    'data-i18n="mirrorExp.firstArtifact.investor.boundary"',
    'data-i18n="mirrorExp.firstArtifact.researcher.proof"',
    'data-i18n="mirrorExp.firstArtifact.partner.boundary"',
    'data-i18n="mirrorExp.firstArtifact.boundaryNote"',
    'data-i18n="mirrorExp.entryProtocol.title"',
    'data-i18n="mirrorExp.entryProtocol.signal.input"',
    'data-i18n="mirrorExp.entryProtocol.boundary.proof"',
    'data-i18n="mirrorExp.entryProtocol.loop.proof"',
  ]) {
    assert.ok(source.includes(snippet), `Infinity Mirror experience missing i18n hook ${snippet}`);
  }

  for (const snippet of [
    "'detail.im.hero.experience': 'Enter the mirror'",
    "'detail.im.hero.experience': 'Entra al espejo'",
    "'mirrorExp.hero.kicker': '01 / The Mirror'",
    "'mirrorExp.hero.kicker': '01 / El Espejo'",
    "'mirrorExp.hero.title': 'What if software could evolve?'",
    "'mirrorExp.hero.title': '¿Y si el software pudiera evolucionar?'",
    "'mirrorExp.threshold.aria': 'Mirror threshold proof readout'",
    "'mirrorExp.threshold.aria': 'Lectura de prueba del umbral del espejo'",
    "'mirrorExp.threshold.title': 'Enter only through proof.'",
    "'mirrorExp.threshold.title': 'Entra solo por la prueba.'",
    "'mirrorExp.threshold.boundary.desc': 'Authority stays visible'",
    "'mirrorExp.threshold.proof.desc': 'Every loop must return evidence'",
    "'mirrorExp.map.growth': 'Recursive Growth'",
    "'mirrorExp.map.growth': 'Crecimiento recursivo'",
    "'mirrorExp.reflection.kicker': '02 / Reflection'",
    "'mirrorExp.brain.kicker': '03 / The Brain'",
    "'mirrorExp.organisms.kicker': '04 / The Organisms'",
    "'mirrorExp.growth.kicker': '05 / Recursive growth'",
    "'mirrorExp.proof.kicker': '06 / Proof'",
    "'mirrorExp.join.kicker': '07 / Join Evolution'",
    "'mirrorExp.authorityGradient.title': 'The mirror earns permission one gate at a time.'",
    "'mirrorExp.authorityGradient.publish.proof': 'Public motion leaves metadata, release notes, and a proof trail.'",
    "'mirrorExp.authorityGradient.title': 'El espejo gana permiso una puerta a la vez.'",
    "'mirrorExp.authorityGradient.publish.proof': 'El movimiento público deja metadata, notas de release y rastro de prueba.'",
    "'mirrorExp.entryProtocol.title': 'Joining is a proof loop, not a form.'",
    "'mirrorExp.entryProtocol.loop.proof': 'A next action with the same boundary still visible.'",
    "'mirrorExp.entryProtocol.title': 'Unirse es un loop de prueba, no un formulario.'",
    "'mirrorExp.entryProtocol.loop.proof': 'Una siguiente acción con el mismo límite todavía visible.'",
    "'mirrorExp.compare.organism.title': 'Learns through proof.'",
    "'mirrorExp.compare.organism.title': 'Aprende con prueba.'",
    "'mirrorExp.reflectionPlane.aria': 'Signal reflection plane'",
    "'mirrorExp.reflectionPlane.aria': 'Plano de reflexión de señal'",
    "'mirrorExp.plane.memory.title': 'Context wakes'",
    "'mirrorExp.plane.memory.title': 'Despierta el contexto'",
    "'mirrorExp.plane.boundary.desc': 'Identity, money, files, and public motion remain human-led.'",
    "'mirrorExp.plane.proof.desc': 'The answer comes back with assumptions, limits, and evidence.'",
    "'mirrorExp.tension.title': 'Hope and alarm become design constraints.'",
    "'mirrorExp.tension.title': 'La esperanza y la alarma se vuelven restricciones de diseño.'",
    "'mirrorExp.tension.autonomy.title': 'Move only after proof.'",
    "'mirrorExp.humanSignal.title': 'The organism starts with what people want AI to make possible.'",
    "'mirrorExp.humanSignal.source': 'Research source: Anthropic 81K Interviews'",
    "'mirrorExp.humanSignal.access.route': 'Cortex, sandbox, candidate cells'",
    "'mirrorExp.humanSignal.security.proof': 'Simulación primero, sin llaves, sin broadcast'",
    "'mirrorExp.humanSignal.title': 'El organismo empieza con lo que las personas quieren que la IA haga posible.'",
    "'mirrorExp.delivery.title': 'Aspiration becomes trustworthy only when the mirror can show what actually changed.'",
    "'mirrorExp.delivery.notDelivered.title': 'Failure is a first-class signal.'",
    "'mirrorExp.delivery.title': 'La aspiración se vuelve confiable solo cuando el espejo puede mostrar qué cambió realmente.'",
    "'mirrorExp.delivery.notDelivered.title': 'El fallo es señal de primera clase.'",
    "'mirrorExp.desireWall.title': 'Human desire becomes an organism route only when proof can answer it.'",
    "'mirrorExp.desireWall.title': 'El deseo humano se vuelve ruta de organismo solo cuando la prueba puede responderlo.'",
    "'mirrorExp.desireWall.work.label': '18.8% / Professional excellence'",
    "'mirrorExp.desireWall.security.proof': 'Unsigned simulation, risk flags, no-key boundary.'",
    "'mirrorExp.desireWall.becoming.boundary': 'No diagnosis, destiny, or unreviewed memory.'",
    "'mirrorExp.desireWall.creative.route': 'Visual Cortex'",
    "'mirrorExp.desireWall.creative.boundary': 'No public posting or asset spend without approval.'",
    "'mirrorExp.routeCompass.title': 'The mirror chooses a chapter only after the signal earns a route.'",
    "'mirrorExp.routeCompass.boundaryNote': 'The compass is a semantic routing map. It does not infer identity, store a preference, submit data, call a model, start a build, move money, deploy, post, or grant autonomy.'",
    "'mirrorExp.routeCompass.title': 'El espejo elige un capítulo solo después de que la señal gana una ruta.'",
    "'mirrorExp.routeCompass.boundaryNote': 'La brújula es un mapa semántico de rutas. No infiere identidad, guarda preferencias, envía datos, llama a un modelo, inicia un build, mueve dinero, despliega, publica ni concede autonomía.'",
    "'mirrorExp.adaptive.title': 'One reflection can be read four ways.'",
    "'mirrorExp.adaptive.title': 'Una reflexión puede leerse de cuatro formas.'",
    "'mirrorExp.adaptive.architect.label': 'Architect'",
    "'mirrorExp.adaptive.cartographer.label': 'Cartographer'",
    "'mirrorExp.adaptive.translator.label': 'Translator'",
	    "'mirrorExp.adaptive.ritualist.label': 'Ritualist'",
	    "'mirrorExp.adaptive.desc': 'A serious mirror does not force every person through the same frame.",
	    "'mirrorExp.adaptive.keep.desc': 'Artifact and map update stay reviewable'",
	    "'mirrorExp.composer.title': 'Choose the signal and watch the mirror return a bounded packet.'",
	    "'mirrorExp.composer.mental.tab': 'Mental room'",
	    "'mirrorExp.composer.build.artifact': 'A build path with route, cell, proof requirement, and first safe slice.'",
	    "'mirrorExp.composer.trust.boundary': 'If the claim lacks an artifact, the mirror must say so.'",
	    "'mirrorExp.composer.quiet.artifact': 'Listening mode stays valid: no tag, no artifact, no growth claim unless requested.'",
	    "'mirrorExp.composer.title': 'Elige la señal y mira cómo el espejo devuelve un paquete acotado.'",
	    "'mirrorExp.composer.quiet.tab': 'Solo escuchar'",
	    "'mirrorExp.memoryConsent.title': 'The mirror can remember only what the person can inspect.'",
	    "'mirrorExp.memoryConsent.proposed.proof': 'The returned artifact is reviewable before memory accepts it.'",
	    "'mirrorExp.memoryConsent.integrated.control': 'Revoke, archive, or split the memory before it influences another route.'",
	    "'mirrorExp.memoryConsent.boundary': 'Memory consent does not grant diagnosis, identity authority, hidden profiling, wallet control, public posting, deployment, or autonomous action.'",
	    "'mirrorExp.memoryConsent.title': 'El espejo solo puede recordar lo que la persona puede inspeccionar.'",
	    "'mirrorExp.memoryConsent.integrated.control': 'Revocar, archivar o dividir la memoria antes de que influya otra ruta.'",
	    "'mirrorExp.remixFit.title': 'The design concepts graduate only when they make trust easier to inspect.'",
    "'mirrorExp.remixFit.lens.boundary': 'Boundary: no birth-date destiny; the human can change the frame.'",
    "'mirrorExp.remixFit.title': 'Los conceptos de diseño se gradúan solo cuando facilitan inspeccionar la confianza.'",
    "'mirrorExp.remixFit.lens.boundary': 'Límite: sin destino por fecha de nacimiento; la persona puede cambiar el marco.'",
    "'mirrorExp.brain.cta': 'Inspect brain cell architecture'",
    "'mirrorExp.brain.cta': 'Inspecciona arquitectura celular'",
    "'mirrorExp.brain.system.aria': 'Inspectable Infinity Mirror brain route'",
    "'mirrorExp.brain.system.aria': 'Ruta inspeccionable del cerebro Infinity Mirror'",
    "'mirrorExp.tunnel.aria': 'Recursive brain tunnel'",
    "'mirrorExp.tunnel.aria': 'Túnel cerebral recursivo'",
    "'mirrorExp.tunnel.title': 'Move through the route a signal takes.'",
    "'mirrorExp.tunnel.desc': 'The tunnel turns scroll into organism grammar:",
    "'mirrorExp.tunnel.boundary.desc': 'Identity, money, files, publishing, and Web3 motion remain outside the automatic path.'",
    "'mirrorExp.tunnel.proof.desc': 'The route exits with assumptions, limits, status, and the next artifact.'",
    "'mirrorExp.brain.route.title': 'A reflection request crosses cells before it becomes advice.'",
    "'mirrorExp.brain.route.title': 'Una solicitud de reflexión cruza células antes de convertirse en consejo.'",
    "'mirrorExp.brain.handoff.signal': 'Signal handoff'",
    "'mirrorExp.brain.handoff.signal': 'Traspaso de señal'",
    "'mirrorExp.composer.trust.brainAuthority': 'Claims freeze until an inspectable artifact exists.'",
    "'mirrorExp.composer.quiet.brainProof': 'Return no stored artifact unless the human asks for one.'",
    "'mirrorExp.brain.route.authority.desc': 'Identity, money, files, publishing, and Web3 motion stay outside the automatic path.'",
    "'mirrorExp.brain.state.boundary.desc': 'High-risk motion paused'",
    "'mirrorExp.brain.route.note': 'The Brain can route a useful answer. It cannot quietly become the authority.'",
    "'mirrorExp.cell.immune': 'Pauses risk, requests approval, and refuses unsafe motion.'",
    "'mirrorExp.cell.immune': 'Pausa riesgo, pide aprobación y rechaza movimiento inseguro.'",
    "'mirrorExp.orbit.research': 'Culture and cell research'",
    "'mirrorExp.orbit.research': 'Investigación cultural y celular'",
    "'mirrorExp.visualizer.aria': 'Living organism visualizer'",
    "'mirrorExp.visualizer.aria': 'Visualizador de organismos vivos'",
    "'mirrorExp.visualizer.spine.aria': 'Governed organism spine'",
    "'mirrorExp.visualizer.spine.aria': 'Columna de organismo gobernada'",
    "'mirrorExp.visualizer.spine.cells': 'Cells'",
    "'mirrorExp.visualizer.spine.cells': 'Células'",
    "'mirrorExp.visualizer.visual.desc': 'Turns creative intent into reviewable media architecture.'",
    "'mirrorExp.visualizer.visual.boundary': 'Publish, spend, and files wait.'",
    "'mirrorExp.visualizer.mirror.desc': 'Turns current state into reflection without claiming authority over identity.'",
    "'mirrorExp.visualizer.financial.boundary': 'No keys, no broadcast.'",
    "'mirrorExp.visualizer.research.boundary': 'Claims wait for evidence.'",
    "'mirrorExp.visualizer.research.boundary': 'Las afirmaciones esperan evidencia.'",
    "'mirrorExp.growth.loop.aria': 'Recursive organism growth loop'",
    "'mirrorExp.growth.loop.aria': 'Loop recursivo de crecimiento del organismo'",
    "'mirrorExp.growth.integration.title': 'Integrated cell'",
    "'mirrorExp.growth.integration.title': 'Célula integrada'",
    "'mirrorExp.growth.integration.desc': 'Only the verified capability joins the organism as a replaceable cell.'",
    "'mirrorExp.growth.boundary': 'The loop may propose evolution. Tests, approval, integration notes, and public proof decide whether it becomes part of the organism.'",
    "'mirrorExp.navigator.title': 'The infinity symbol becomes the map.'",
    "'mirrorExp.navigator.title': 'El símbolo Infinity se vuelve el mapa.'",
    "'mirrorExp.navigator.human.route': 'Open the human signal atlas'",
    "'mirrorExp.navigator.brain.boundary': 'Generated capability stays inert until tests and approval.'",
    "'mirrorExp.navigator.brain.boundary': 'La capacidad generada queda inerte hasta pruebas y aprobación.'",
    "'mirrorExp.navigator.proof.proof': 'Claims route to architecture, tests, metadata, and transmissions.'",
    "'mirrorExp.navigator.build.boundary': 'Collaboration starts with scope, not hidden authority.'",
    "'mirrorExp.proof.title': 'The mirror cannot be trusted unless the boundary is visible.'",
    "'mirrorExp.proof.title': 'No se puede confiar en el espejo si el límite no es visible.'",
    "'mirrorExp.proof.metrics.title': 'What claims have evidence'",
    "'mirrorExp.proof.deployments.title': 'What shipped publicly'",
    "'mirrorExp.proof.status.title': 'Where authority pauses'",
    "'mirrorExp.proofObs.title': 'Architecture, metrics, deployments, and status become one inspectable instrument.'",
    "'mirrorExp.proofObs.status.boundary': 'Files, money, public posting, Web3 broadcast, risky execution, and identity claims remain approval-gated.'",
    "'mirrorExp.proofObs.title': 'Arquitectura, métricas, despliegues y estado se vuelven un instrumento inspeccionable.'",
    "'mirrorExp.proofObs.deployments.boundary': 'Los despliegues y alias ocurren solo después de aprobación explícita.'",
    "'mirrorExp.authorityGradient.boundary': 'No rung grants hidden memory, identity authority, wallet control, public posting, deployment, or status changes by itself.'",
    "'mirrorExp.authorityGradient.boundary': 'Ningún peldaño concede memoria oculta, autoridad de identidad, control de wallet, publicación pública, despliegue o cambios de estado por sí solo.'",
    "'mirrorExp.archMaps.aria': 'Floating neural architecture maps'",
    "'mirrorExp.archMaps.aria': 'Mapas flotantes de arquitectura neural'",
    "'mirrorExp.archMaps.title': 'A living interface earns trust by showing the route a signal takes.'",
    "'mirrorExp.archMaps.title': 'Una interfaz viva gana confianza mostrando la ruta que toma una señal.'",
    "'mirrorExp.archMaps.gateway.title': 'Gateway intake'",
    "'mirrorExp.archMaps.cortex.title': 'Cortex route'",
    "'mirrorExp.archMaps.memory.title': 'Memory boundary'",
    "'mirrorExp.archMaps.immune.title': 'Immune gate'",
    "'mirrorExp.archMaps.proof.title': 'Proof loop'",
    "'mirrorExp.archMaps.immune.desc': 'Pauses money, files, public posting, Web3 broadcast, and risky execution.'",
    "'mirrorExp.archMaps.immune.desc': 'Pausa dinero, archivos, publicación, broadcast Web3 y ejecución riesgosa.'",
    "'mirrorExp.scrollMap.title': 'The visitor descends through seven proof-bearing acts.'",
    "'mirrorExp.scrollMap.title': 'El visitante desciende por siete actos con prueba.'",
    "'mirrorExp.scrollMap.mirror.motion': 'Fracture sequence, depth rings, bounded canvas pulse.'",
    "'mirrorExp.scrollMap.brain.proof': 'The system names which cell can act and which must pause.'",
    "'mirrorExp.scrollMap.join.proof': 'The next action is concrete and authority-bounded.'",
    "'mirrorExp.instrument.title': 'Beauty stays downstream of proof.'",
    "'mirrorExp.instrument.title': 'La belleza vive después de la prueba.'",
    "'mirrorExp.cascade.aria': 'Proof cascade'",
    "'mirrorExp.cascade.aria': 'Cascada de prueba'",
    "'mirrorExp.cascade.claim.title': 'Claim enters'",
    "'mirrorExp.cascade.route.title': 'Evidence route'",
    "'mirrorExp.cascade.boundary.title': 'Boundary locks'",
    "'mirrorExp.cascade.boundary.desc': 'Money, files, public posting, Web3 broadcast, and risky execution stay approval-gated.'",
    "'mirrorExp.cascade.artifact.desc': 'The visitor gets a concrete route, not a mood: map, ledger, deployment note, status, or build packet.'",
    "'mirrorExp.instrument.boundary.desc': 'No hidden authority. Risky motion pauses for approval.'",
    "'mirrorExp.join.researchers.label': 'Researchers'",
    "'mirrorExp.join.researchers.label': 'Investigadores'",
    "'mirrorExp.join.partners.title': 'Build with us'",
    "'mirrorExp.join.partners.title': 'Construye con nosotros'",
    "'mirrorExp.symbol.title': 'The symbol means loop plus boundary.'",
    "'mirrorExp.symbol.title': 'El símbolo significa loop más límite.'",
    "'mirrorExp.symbol.grid.aria': 'Infinity symbol states'",
    "'mirrorExp.symbol.grid.aria': 'Estados del símbolo Infinity'",
    "'mirrorExp.symbol.growth.desc': 'The core grows only through pattern, sandbox, approval, integration, and proof.'",
    "'mirrorExp.symbol.doorway.desc': 'Builders, investors, researchers, and partners choose a concrete next route.'",
    "'mirrorExp.doorway.aria': 'Dynamic Infinity doorway into UnwindCode'",
    "'mirrorExp.doorway.aria': 'Puerta Infinity dinámica hacia UnwindCode'",
    "'mirrorExp.doorway.builders.desc': 'Turn domain complexity into cortex, memory, cells, immune gates, and proof.'",
    "'mirrorExp.doorway.builders.boundary': 'Generated capability stays inert until tests and approval.'",
    "'mirrorExp.doorway.investors.proof': 'Proof ledger, transmissions, status labels'",
    "'mirrorExp.doorway.researchers.boundary': 'Future-facing work stays labeled until evidence lands.'",
    "'mirrorExp.firstArtifact.title': 'The next step is a packet someone can inspect.'",
    "'mirrorExp.firstArtifact.builder.artifact': 'Architecture packet plus sandboxed first-slice plan.'",
    "'mirrorExp.firstArtifact.investor.boundary': 'No financial promise or production claim outruns evidence.'",
    "'mirrorExp.firstArtifact.partner.boundary': 'No deploy, spend, public post, or Web3 motion without explicit approval.'",
    "'mirrorExp.firstArtifact.boundaryNote': 'The router does not submit data, create a lead, start a build, spend money, deploy, post publicly, or grant autonomy. It only makes the first inspectable artifact legible.'",
    "'mirrorExp.firstArtifact.title': 'El siguiente paso es un paquete que alguien puede inspeccionar.'",
    "'mirrorExp.firstArtifact.partner.boundary': 'Sin deploy, gasto, publicación pública ni movimiento Web3 sin aprobación explícita.'",
    "'mirrorExp.firstArtifact.boundaryNote': 'El router no envía datos, crea un lead, inicia un build, gasta dinero, despliega, publica ni concede autonomía. Solo vuelve legible el primer artefacto inspeccionable.'",
    "'mirrorExp.fracture.fracture.title': 'Fracture'",
    "'mirrorExp.fracture.proof.desc': 'Evidence returns before authority grows.'",
    "'mirrorExp.fracture.aria': 'Secuencia de fractura del Infinity Mirror'",
    "'mirrorExp.signal.title': 'The mirror starts with voices, not features.'",
    "'mirrorExp.signal.investor.route': 'Route: status, metrics, transmissions.'",
    "'mirrorExp.signal.title': 'El espejo empieza con voces, no con funciones.'",
    "'mirrorExp.delivery.productivity.gate': 'Gate: before/after artifact plus owner approval.'",
    "'mirrorExp.delivery.notDelivered.gate': 'Puerta: etiqueta de estado, desconocidos y próxima evidencia.'",
    "'mirrorExp.remixFit.valve.boundary': 'Boundary: no artifact, no claim, no pressure.'",
    "'mirrorExp.remixFit.descent.boundary': 'Límite: todo espectáculo regresa con prueba.'",
    "'mirrorExp.productLoop.title': 'The mirror keeps one shell while the output becomes proof.'",
    "'mirrorExp.productLoop.artifact.desc': 'The mirror returns pattern, belief, reframe, question, and ritual as a reviewable object.'",
    "'mirrorExp.productLoop.title': 'El espejo mantiene una sola carcasa mientras la salida se vuelve prueba.'",
    "'mirrorExp.productLoop.decision.refuse': 'Rechazar'",
    "'mirrorExp.artifact.title': 'The mirror gives back a reviewable object, not a mood.'",
    "'mirrorExp.artifact.boundary.value': 'Care, identity, money, files, and public motion stay human-led.'",
    "'mirrorExp.artifact.title': 'El espejo devuelve un objeto revisable, no un ambiente.'",
    "'mirrorExp.artifact.decision.correct': 'Corregir'",
    "'mirrorExp.repair.title': 'A crack becomes a question before it becomes memory.'",
    "'mirrorExp.repair.title': 'Una grieta se vuelve pregunta antes de volverse memoria.'",
    "'mirrorExp.descent.title': 'Immersion earns trust only when the descent returns proof.'",
    "'mirrorExp.descent.lattice.desc': 'Cells, memories, and proof paths connect into a map the human can inspect.'",
    "'mirrorExp.descent.return.desc': 'The loop exits with a route, a boundary, and an artifact the visitor can question.'",
    "'mirrorExp.descent.facing.title': 'The mirror may show possibility. It may not claim destiny.'",
    "'mirrorExp.descent.title': 'La inmersión gana confianza solo cuando el descenso devuelve prueba.'",
    "'mirrorExp.descent.facing.title': 'El espejo puede mostrar posibilidad. No puede reclamar destino.'",
    "'mirrorExp.motionContract.title': 'Every cinematic move has a proof job.'",
    "'mirrorExp.motionContract.duration': 'Duration'",
    "'mirrorExp.motionContract.easing': 'Easing'",
    "'mirrorExp.motionContract.portal.duration': 'Five scroll states; each visible state resolves inside 1.2s.'",
    "'mirrorExp.motionContract.portal.easing': 'Scrubbed linear depth with cubic-bezier(0.16, 1, 0.3, 1) entrance easing.'",
    "'mirrorExp.motionContract.portal.performance': 'Transform and opacity only; static reduced-motion state.'",
    "'mirrorExp.motionContract.humanSignal.title': 'Research becomes calibrated route choices.'",
    "'mirrorExp.motionContract.humanSignal.duration': '800ms card reveal with 11s and 12.4s background scans.'",
    "'mirrorExp.motionContract.humanSignal.performance': 'CSS transform and opacity only; source link, proof gates, and route text stay semantic.'",
    "'mirrorExp.motionContract.descent.easing': 'Cinematic cubic reveal; ambient loops use ease-in-out.'",
    "'mirrorExp.motionContract.descent.performance': 'No canvas import; the zip engine is translated into HTML, CSS, and reduced-motion-safe stages.'",
    "'mirrorExp.motionContract.proof.timing': '7.4s route draw, 5.8s node pulse.'",
    "'mirrorExp.motionContract.proof.duration': '740ms ledger reveal, 7.4s route draw.'",
    "'mirrorExp.motionContract.doorway.title': 'Conversion keeps role boundaries.'",
    "'mirrorExp.motionContract.doorway.easing': 'Route reveal uses cubic-bezier(0.16, 1, 0.3, 1); orbit loops ease-in-out.'",
    "'mirrorExp.audit.title': 'The pattern is inspected before it becomes an Unwind interface.'",
    "'mirrorExp.audit.packetCta': 'Open full experience audit'",
    "'mirrorExp.audit.purpose': 'Purpose'",
    "'mirrorExp.audit.works': 'Why it works'",
    "'mirrorExp.audit.information.reinterpret': 'The mirror uses chapters, rails, proof routes, and visible authority gates as its spine.'",
    "'mirrorExp.audit.motion.reinterpret': 'Every motion lane gets a trigger, duration, easing, fallback, and stop condition.'",
    "'mirrorExp.audit.performance.reinterpret': 'Canvas, Framer, GSAP, and Three stay optional leaf layers behind explicit gates.'",
    "'mirrorExp.sourceLedger.title': 'The research pattern was translated into organism proof, not copied as a design skin.'",
    "'mirrorExp.sourceLedger.scale.source': '80,508 participants across 159 countries and 70 languages.'",
    "'mirrorExp.sourceLedger.delivery.source': 'Productivity led at 32.0%, while 18.9% said AI has not delivered.'",
    "'mirrorExp.sourceLedger.nonclone.boundary': 'The symbol means loop plus boundary, never decoration.'",
    "'mirrorExp.cognitiveTrace.title': 'A living intelligence is a loop you can inspect.'",
    "'mirrorExp.cognitiveTrace.next.proof': 'The human decides whether the loop grows, pauses, or ends.'",
    "'mirrorExp.cognitiveTrace.title': 'Una inteligencia viva es un loop que puedes inspeccionar.'",
    "'mirrorExp.cognitiveTrace.next.proof': 'La persona decide si el loop crece, pausa o termina.'",
    "'mirrorExp.phaseLedger.title': 'Seven phases now resolve into evidence, surface, and boundary.'",
    "'mirrorExp.phaseLedger.execution.boundary': 'Deployments, posting, and aliases remain explicit human checkpoints.'",
    "'mirrorExp.phaseLedger.title': 'Siete fases ahora resuelven en evidencia, superficie y límite.'",
    "'mirrorExp.phaseLedger.execution.boundary': 'Despliegues, publicaciones y aliases siguen como checkpoints humanos explícitos.'",
    "'mirrorExp.engineTranslation.title': 'The remix engine becomes a governed state machine, not an uncontrolled canvas.'",
    "'mirrorExp.engineTranslation.source.value': 'Local zip: experience/mirror-engine.js'",
    "'mirrorExp.engineTranslation.runtime.value': 'Semantic HTML, CSS, SVG, bounded canvas field, reduced-motion guard'",
    "'mirrorExp.engineTranslation.pointer.title': 'Interaction can deepen, not decide.'",
    "'mirrorExp.engineTranslation.block.desc': 'DOB identity truth, default camera access, hidden memory maps, and continuous mobile canvas.'",
    "'mirrorExp.engineConcept.title': 'The ZIP becomes product grammar, not production authority.'",
    "'mirrorExp.engineConcept.cta': 'Open engine concept analysis'",
    "'mirrorExp.engineConcept.prototype.title': 'Descent, kintsugi, map, social scenes.'",
    "'mirrorExp.engineConcept.block.desc': 'These remain outside the public route until consent, proof, and authority boundaries are explicit.'",
    "'mirrorExp.shellSpecimen.title': 'The mirror should feel like one instrument that keeps returning proof.'",
    "'mirrorExp.shellSpecimen.stage.title': 'Continuity without hidden memory.'",
    "'mirrorExp.shellSpecimen.prompt.title': 'Let the signal slow down.'",
    "'mirrorExp.shellSpecimen.review.desc': 'Nothing becomes memory, proof, or public motion until the returned object can be inspected.'",
    "'mirrorExp.buildLedger.title': 'The interface should prove how it would ship before it asks anyone to believe the vision.'",
    "'mirrorExp.buildLedger.release.boundary': 'Deploy only after explicit approval.'",
    "'mirrorExp.execution.title': 'The next build should be four isolated engines, not one tangled spectacle.'",
    "'mirrorExp.execution.packetCta': 'Open implementation packet'",
    "'mirrorExp.execution.react.title': 'Server-rendered meaning first.'",
    "'mirrorExp.execution.tunnel.title': 'GSAP and Three.js stay optional.'",
    "'mirrorExp.execution.release.gate': 'Public deployment waits for explicit approval.'",
    "'mirrorExp.runtime.title': 'Each motion engine gets one job, one fallback, and one stop condition.'",
    "'mirrorExp.runtime.framer.timing': '0.24s quick, 0.64s medium, spring stiffness 100 damping 20'",
    "'mirrorExp.runtime.gsap.motion': 'ScrollTrigger scrub with transform-only state changes'",
    "'mirrorExp.runtime.three.timing': '60fps target, DPR capped at 1.5, pause when offscreen'",
    "'mirrorExp.runtime.boundary': 'Runtime rule: if an engine cannot name its fallback, cleanup, and stop condition, it does not enter the organism.'",
    "'mirrorExp.codeHandoff.title': 'Phase 7 now leaves implementation-ready files without changing the current stack.'",
    "'mirrorExp.codeHandoff.cta': 'Open runtime code handoff'",
    "'mirrorExp.codeHandoff.kitCta': 'Open runtime kit'",
    "'mirrorExp.codeHandoff.framer.file': 'components/mirror/MirrorChapterMotion.client.tsx'",
    "'mirrorExp.codeHandoff.gsap.guard': 'Skip reduced motion and compact screens; current anchors remain canonical.'",
    "'mirrorExp.codeHandoff.three.title': 'WebGL deepens depth, never authority.'",
    "'mirrorExp.codeHandoff.assets.guard': 'No critical text in visuals; deploy only after approval.'",
    "'mirrorExp.motionContract.title': 'Cada movimiento cinematográfico tiene un trabajo de prueba.'",
    "'mirrorExp.motionContract.duration': 'Duración'",
    "'mirrorExp.motionContract.humanSignal.title': 'La investigación se vuelve elección de ruta calibrada.'",
    "'mirrorExp.motionContract.descent.title': 'La inmersión regresa como prueba.'",
    "'mirrorExp.motionContract.performance': 'Rendimiento'",
    "'mirrorExp.audit.title': 'El patrón se inspecciona antes de convertirse en una interfaz Unwind.'",
    "'mirrorExp.audit.packetCta': 'Abrir auditoría completa de experiencia'",
    "'mirrorExp.audit.purpose': 'Propósito'",
    "'mirrorExp.audit.information.reinterpret': 'El espejo usa capítulos, rieles, rutas de prueba y puertas de autoridad visibles como columna.'",
    "'mirrorExp.audit.performance.reinterpret': 'Canvas, Framer, GSAP y Three quedan como capas leaf opcionales detrás de puertas explícitas.'",
    "'mirrorExp.sourceLedger.title': 'El patrón de investigación se tradujo en prueba de organismo, no en una piel de diseño copiada.'",
    "'mirrorExp.sourceLedger.scale.source': '80,508 participantes en 159 países y 70 idiomas.'",
    "'mirrorExp.sourceLedger.nonclone.title': 'El límite permanece explícito.'",
    "'mirrorExp.engineTranslation.title': 'El motor remix se vuelve máquina de estados gobernada, no canvas sin control.'",
    "'mirrorExp.engineTranslation.runtime.value': 'HTML semántico, CSS, SVG, campo canvas acotado, guardia reduced-motion'",
    "'mirrorExp.engineTranslation.block.title': 'Funciones sensibles a autoridad.'",
    "'mirrorExp.engineConcept.title': 'El ZIP se vuelve gramática de producto, no autoridad de producción.'",
    "'mirrorExp.engineConcept.cta': 'Abrir análisis de conceptos del motor'",
    "'mirrorExp.engineConcept.prototype.title': 'Descenso, kintsugi, mapa, escenas sociales.'",
    "'mirrorExp.engineConcept.block.desc': 'Quedan fuera de la ruta pública hasta que consentimiento, prueba y límites de autoridad sean explícitos.'",
    "'mirrorExp.shellSpecimen.title': 'El espejo debe sentirse como un instrumento que siempre devuelve prueba.'",
    "'mirrorExp.shellSpecimen.stage.title': 'Continuidad sin memoria oculta.'",
    "'mirrorExp.shellSpecimen.prompt.title': 'Deja que la señal baje la velocidad.'",
    "'mirrorExp.shellSpecimen.review.desc': 'Nada se vuelve memoria, prueba o movimiento público hasta que el objeto devuelto puede inspeccionarse.'",
    "'mirrorExp.buildLedger.title': 'La interfaz debe probar cómo se enviaría antes de pedirle a alguien creer la visión.'",
    "'mirrorExp.buildLedger.release.boundary': 'Deploy solo después de aprobación explícita.'",
    "'mirrorExp.execution.title': 'La siguiente construcción debe ser cuatro motores aislados, no un espectáculo enredado.'",
    "'mirrorExp.execution.packetCta': 'Abrir paquete de implementación'",
    "'mirrorExp.execution.react.title': 'Significado server-rendered primero.'",
    "'mirrorExp.execution.tunnel.title': 'GSAP y Three.js siguen opcionales.'",
    "'mirrorExp.execution.release.gate': 'El despliegue público espera aprobación explícita.'",
    "'mirrorExp.runtime.title': 'Cada motor de movimiento recibe un trabajo, un fallback y una condición de parada.'",
    "'mirrorExp.runtime.three.title': 'La profundidad es mejora, nunca autoridad.'",
    "'mirrorExp.runtime.boundary': 'Regla runtime: si un motor no puede nombrar su fallback, limpieza y condición de parada, no entra al organismo.'",
    "'mirrorExp.codeHandoff.title': 'La Fase 7 ahora deja archivos listos para implementar sin cambiar el stack actual.'",
    "'mirrorExp.codeHandoff.cta': 'Abrir handoff de código runtime'",
    "'mirrorExp.codeHandoff.kitCta': 'Abrir kit runtime'",
    "'mirrorExp.codeHandoff.framer.file': 'components/mirror/MirrorChapterMotion.client.tsx'",
    "'mirrorExp.codeHandoff.gsap.guard': 'Saltar reduced motion y pantallas compactas; los anchors actuales siguen canónicos.'",
    "'mirrorExp.codeHandoff.three.title': 'WebGL aumenta profundidad, nunca autoridad.'",
    "'mirrorExp.codeHandoff.assets.guard': 'Sin texto crítico en visuales; deploy solo después de aprobación.'",
    "'mirrorExp.doorway.partners.next': 'Start a build conversation'",
    "'mirrorExp.doorway.commitment': 'The loop opens only as far as proof allows. Every doorway keeps a visible boundary.'",
    "'mirrorExp.doorway.commitment': 'El loop se abre solo hasta donde la prueba permite. Cada puerta mantiene un límite visible.'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing Infinity Mirror experience snippet ${snippet}`);
  }

  for (const snippet of [
    '.mirror-experience-page',
    '--mirror-scroll-progress',
    '--mirror-fracture-offset',
    '--mirror-portal-scale',
    '.mirror-runtime-field',
    '.mirror-runtime-field[data-field-state="static"]',
    '.mirror-runtime-field[data-field-state="paused"]',
    '.mirror-experience-page::after',
    '.mirror-experience-page[data-mirror-step="03"]::after',
    '.mirror-experience-page[data-mirror-step="05"]::after',
    '.mirror-experience-page[data-mirror-step="07"]::after',
    '.mirror-experience-hero',
    '.mirror-portal-stage',
    '.mirror-portal-stage::before',
    '.mirror-portal-depth',
    '.mirror-depth-ring-three',
    '.mirror-portal-asset',
    '.mirror-fracture-sequence',
    '.mirror-fracture-field',
    '.mirror-fracture-field::before',
    '.mirror-fracture-shard-three',
    '.mirror-fracture-cell[data-fracture-cell="proof"]',
    '.mirror-fracture-steps',
    '.mirror-fracture-steps li[data-fracture-step="fracture"]',
    '.mirror-threshold-readout',
    '.mirror-threshold-readout::before',
    '.mirror-threshold-readout dl div',
    '.mirror-scroll-map',
    '.mirror-scroll-link',
    '.mirror-scroll-step.is-active',
    '.mirror-scroll-step:focus-within',
    '.mirror-reflection-navigation',
    '.mirror-infinite-nav-shell',
    '.mirror-nav-fieldset',
    '.mirror-nav-orbit',
    '.mirror-nav-infinity',
    '.mirror-nav-tabs',
    '#mirror-nav-brain:checked ~ .mirror-nav-orbit [data-nav-node="brain"]',
    '#mirror-nav-proof:checked ~ .mirror-nav-tabs label[for="mirror-nav-proof"]',
    '#mirror-nav-build:checked ~ .mirror-nav-panels .mirror-nav-panel-build',
    '#mirror-nav-human:focus-visible ~ .mirror-nav-tabs label[for="mirror-nav-human"]',
    '.mirror-nav-chapter-ring',
    '.mirror-reflection-stack',
    '.mirror-reflection-plane',
    '.mirror-reflection-plane::before',
    '.mirror-plane-surface',
    '.mirror-plane-current-two',
    '.mirror-plane-node-proof',
    '.mirror-plane-steps',
    '.mirror-plane-steps li::before',
    '.mirror-human-signal-atlas',
    '.mirror-human-signal-atlas::before',
    '.mirror-human-signal-header',
    '.mirror-human-signal-field',
    '.mirror-human-signal-node[data-human-signal-node="world"]',
    '.mirror-human-signal-grid',
    '.mirror-human-signal-grid li:nth-child(2n)',
    '.mirror-desire-translation',
    '.mirror-desire-translation::before',
    '.mirror-desire-translation-orbit',
    '.mirror-desire-current',
    '.mirror-desire-node[data-desire-node="creative"]',
    '.mirror-desire-translation-grid',
    '.mirror-desire-translation-grid li[data-desire-route="work"]',
    '.mirror-desire-translation-grid li[data-desire-route="creative"]',
    '.mirror-route-compass',
    '.mirror-route-compass::before',
    '.mirror-route-compass-dial',
    '.mirror-route-compass-grid',
    '.mirror-route-compass-grid li[data-route-compass="mental-room"]',
    '.mirror-route-compass-boundary',
    '.mirror-delivery-calibration',
    '.mirror-delivery-calibration::before',
    '.mirror-delivery-meter',
    '.mirror-delivery-grid',
    '.mirror-delivery-grid li[data-delivery-signal="not-delivered"]',
    '.mirror-signal-constellation',
    '.mirror-signal-field',
    '.mirror-signal-current-two',
    '.mirror-signal-node[data-signal-node="researcher"]',
    '.mirror-signal-packets',
    '.mirror-signal-packets li[data-signal-role="investor"]',
    '.mirror-adaptive-engine',
    '.mirror-adaptive-engine::before',
    '.mirror-adaptive-engine[data-lens-runtime="active"] .mirror-adaptive-lens',
    '.mirror-adaptive-orbit',
    '.mirror-adaptive-lens',
    '.mirror-adaptive-lens::before',
    '.mirror-adaptive-node.is-runtime-active',
    '.mirror-adaptive-node[data-lens-node="translator"]',
    '.mirror-adaptive-lenses li',
    '.mirror-adaptive-lenses li.is-runtime-active',
	    '.mirror-adaptive-lens-button',
	    '.mirror-adaptive-loop',
	    '.mirror-adaptive-loop div.is-runtime-active',
	    '.mirror-signal-composer',
	    '.mirror-signal-composer::before',
	    '.mirror-signal-composer-controls',
	    '.mirror-signal-composer-controls button[aria-pressed="true"]',
	    '.mirror-signal-composer-output',
	    '.mirror-memory-consent',
	    '.mirror-memory-consent::before',
	    '.mirror-memory-consent-grid',
	    '.mirror-memory-consent-grid li:nth-child(2n)',
	    '.mirror-memory-consent-boundary',
	    '@keyframes mirror-memory-consent-scan',
	    '.mirror-remix-fit',
    '.mirror-remix-fit::before',
    '.mirror-remix-fit-orbit',
    '.mirror-remix-fit-node[data-remix-node="descent"]',
    '.mirror-remix-fit-grid',
    '.mirror-remix-fit-grid li:nth-child(2n)',
    '.mirror-shell-specimen',
    '.mirror-shell-specimen::before',
    '.mirror-shell-phone',
    '.mirror-shell-stage',
    '.mirror-shell-stage-core',
    '.mirror-shell-growth',
    '.mirror-shell-prompt',
    '.mirror-shell-artifact',
    '.mirror-shell-bottom-nav',
    '.mirror-shell-bottom-nav a:focus-visible',
    '.mirror-shell-proof-list',
    '.mirror-shell-proof-list li:nth-child(2n)',
    '.mirror-product-loop',
    '.mirror-product-loop::before',
    '.mirror-product-shell',
    '.mirror-product-ring-two',
    '.mirror-product-facet[data-product-facet="map"]',
    '.mirror-product-steps',
    '.mirror-product-valve',
    '.mirror-product-valve li',
    '.mirror-returned-artifact',
    '.mirror-returned-artifact::before',
    '.mirror-returned-artifact[data-artifact-runtime="active"] .mirror-artifact-route',
    '.mirror-artifact-card',
    '.mirror-artifact-readout',
    '.mirror-artifact-map',
    '.mirror-artifact-node.is-runtime-active',
    '.mirror-artifact-node[data-artifact-node="boundary"]',
    '.mirror-artifact-route-list',
    '.mirror-artifact-route-list li.is-runtime-active',
    '.mirror-artifact-decisions li.is-runtime-active',
    '.mirror-artifact-decisions li:first-child',
    '.mirror-repair-ledger',
    '.mirror-repair-ledger::before',
    '.mirror-descent-protocol',
    '.mirror-descent-protocol::before',
    '.mirror-descent-hud',
    '.mirror-descent-meter span',
    '.mirror-descent-rail',
    '.mirror-descent-rail li[data-descent-step="return"]',
    '.mirror-facing-card',
    '.mirror-facing-card::before',
    '.mirror-scroll-choreography',
    '.mirror-scroll-choreography::before',
    '.mirror-scroll-choreography-header',
    '.mirror-scroll-choreography-grid',
    '.mirror-scroll-choreography-grid li[data-scroll-act="proof"]',
    '.mirror-scroll-choreography-grid li[data-scroll-act="join"]',
    '.mirror-scroll-choreography-grid dd',
    '@keyframes mirror-scroll-choreography-scan',
    '@keyframes mirror-scroll-act-node',
    '.mirror-motion-contract',
    '.mirror-motion-contract::before',
    '.mirror-motion-contract-header',
    '.mirror-motion-contract-grid',
    '.mirror-motion-contract-grid li[data-motion-contract="human-signal"]::before',
    '.mirror-motion-contract-grid li[data-motion-contract="product"]::before',
    '.mirror-motion-contract-grid li[data-motion-contract="descent"]::before',
    '.mirror-motion-contract-grid li[data-motion-contract="doorway"]',
    '.mirror-motion-contract-grid dd',
    '.mirror-experience-audit',
    '.mirror-experience-audit::before',
    '.mirror-experience-audit-copy',
    '.mirror-experience-audit-link',
    '.mirror-experience-audit-grid',
    '.mirror-experience-audit-grid li[data-audit-lens="motion"]',
    '.mirror-experience-audit-grid li[data-audit-lens="performance"]',
    '.mirror-experience-audit-grid dd',
    '.mirror-source-ledger',
    '.mirror-source-ledger::before',
    '.mirror-source-ledger-copy a',
    '.mirror-source-ledger-grid',
    '.mirror-source-ledger-grid li[data-source-pattern="nonclone"]',
    '.mirror-source-ledger-grid dd',
    '.mirror-engine-translation',
    '.mirror-engine-translation::before',
    '.mirror-engine-console',
    '.mirror-engine-console-signal[data-engine-signal="pointer"]',
    '.mirror-engine-state-rail',
    '.mirror-engine-state-rail li[data-engine-state="approval"]',
    '.mirror-engine-fit-rail',
    '.mirror-engine-fit-rail li[data-engine-fit="block"]',
    '.mirror-engine-concept-packet',
    '.mirror-engine-concept-link:focus-visible',
    '.mirror-engine-concept-grid',
    '.mirror-engine-concept-grid li[data-concept-decision="block"]',
    '.mirror-build-ledger',
    '.mirror-build-ledger::before',
    '.mirror-build-ledger-stack',
    '.mirror-build-ledger-node[data-build-node="release"]',
    '.mirror-build-ledger-grid',
    '.mirror-build-ledger-grid li:last-child',
    '.mirror-execution-packet',
    '.mirror-execution-packet::before',
    '.mirror-execution-packet-link',
    '.mirror-execution-packet-link:focus-visible',
    '.mirror-execution-packet-grid',
    '.mirror-execution-packet-grid li[data-execution-packet="react"]',
    '.mirror-execution-packet-grid li[data-execution-packet="release"]',
    '.mirror-execution-packet-grid li:hover::before',
    '.mirror-runtime-handoff',
    '.mirror-runtime-handoff::before',
    '.mirror-runtime-handoff-grid',
    '.mirror-runtime-handoff-grid li[data-runtime-lane="three"]',
    '.mirror-runtime-boundary',
    '.mirror-depth-gate',
    '.mirror-depth-gate::before',
    '.mirror-depth-gate-orbit',
    '.mirror-depth-gate-grid',
    '.mirror-depth-gate-grid li[data-depth-lane="webgl"]',
    '.mirror-depth-gate-boundary',
    '.mirror-code-handoff',
    '.mirror-code-handoff::before',
    '.mirror-code-handoff-header',
    '.mirror-code-handoff-link',
    '.mirror-code-handoff-grid',
    '.mirror-code-handoff-grid li[data-code-handoff="gsap"]',
    '.mirror-code-handoff-grid li[data-code-handoff="assets"]',
    '.mirror-code-handoff-grid dd',
    '.mirror-void-panel.is-organism',
    '.mirror-tension-thread',
    '.mirror-tension-thread::before',
    '.mirror-brain-system',
    '.mirror-brain-system::before',
    '.mirror-brain-system[data-brain-runtime="active"]::before',
    '.mirror-brain-system[data-brain-runtime="static"]::before',
    '.mirror-brain-tunnel',
    '.mirror-brain-tunnel::before',
    '.mirror-tunnel-visual',
    '.mirror-tunnel-ring-three',
    '.mirror-tunnel-cell[data-tunnel-cell="proof"]',
    '.mirror-tunnel-cell.is-runtime-active',
    '.mirror-tunnel-steps',
    '.mirror-tunnel-steps li::before',
    '.mirror-tunnel-steps li.is-runtime-active',
    '.mirror-brain-network',
    '.mirror-brain-network::before',
    '.mirror-cell::before',
    '.mirror-cell::after',
    '.mirror-cell.is-runtime-active',
    '.mirror-brain-route-console',
    '.mirror-brain-route-console::before',
    '.mirror-brain-handoff',
    '.mirror-brain-handoff dd',
    '.mirror-brain-route-steps',
    '.mirror-brain-route-steps li::before',
    '.mirror-brain-route-steps li.is-runtime-active',
    '.mirror-brain-state-grid',
    '.mirror-brain-state-grid div.is-runtime-active',
    '.mirror-cell.is-signal-selected',
    '.mirror-brain-route-note',
    '.mirror-organism-visualizer',
    '.mirror-organism-visualizer[data-relay-runtime="active"] .mirror-organism-spine::before',
    '.mirror-organism-visualizer[data-relay-runtime="static"] .mirror-organism-spine::before',
    '.mirror-organism-spine',
    '.mirror-organism-spine::before',
    '.mirror-organism-core.is-runtime-active',
    '.mirror-spine-node',
    '.mirror-spine-node.is-runtime-active',
    '.mirror-organism-orbit',
    '.mirror-organism-link dl',
    '.mirror-organism-link.is-runtime-active',
    '.mirror-organism-link.is-runtime-active::after',
    '.mirror-organism-link[data-organism="financial"]::after',
    '.mirror-growth-system',
    '.mirror-growth-system[data-growth-runtime="active"]::after',
    '.mirror-growth-system[data-growth-runtime="static"]::after',
    '.mirror-growth-field',
    '.mirror-growth-orbit',
    '.mirror-growth-core',
    '.mirror-growth-node.is-runtime-active',
    '.mirror-growth-node[data-growth-node="integration"]',
    '.mirror-growth-rail',
    '.mirror-growth-rail::before',
    '.mirror-growth-rail li.is-runtime-active',
    '.mirror-growth-rail li::after',
    '.mirror-growth-rail li:nth-child(6)::after',
    '.mirror-growth-boundary',
    '.mirror-cognitive-trace',
    '.mirror-cognitive-trace-core',
    '.mirror-cognitive-node[data-cognitive-node="next-loop"]',
    '.mirror-cognitive-trace-grid',
    '.mirror-proof-stack',
    '.mirror-architecture-maps',
    '.mirror-architecture-maps::before',
    '.mirror-architecture-map-header',
    '.mirror-architecture-map-grid',
    '.mirror-architecture-map-grid li:nth-child(5)',
    '.mirror-phase-proof-ledger',
    '.mirror-phase-proof-ledger::before',
    '.mirror-phase-ledger-copy',
    '.mirror-phase-ledger-grid',
    '.mirror-phase-ledger-grid li[data-phase-proof="execution"]',
    '.mirror-scroll-choreography',
    '.mirror-scroll-choreography::before',
    '.mirror-scroll-choreography-grid',
    '.mirror-scroll-choreography-grid li[data-scroll-act="proof"]',
    '.mirror-scroll-choreography-grid li[data-scroll-act="join"]',
    '.mirror-state-sequencer',
    '.mirror-state-sequencer-stage',
    '.mirror-state-controls button[aria-pressed="true"]',
    '.mirror-state-output',
    '.mirror-state-link',
    '.mirror-proof-band',
    '.mirror-proof-instrument',
    '.mirror-proof-instrument::before',
    '.mirror-proof-cascade',
    '.mirror-proof-cascade::before',
    '.mirror-proof-cascade li::before',
    '.mirror-proof-cascade li:nth-child(4)::before',
    '.mirror-proof-observatory',
    '.mirror-proof-observatory-controls button[aria-pressed="true"]',
    '.mirror-proof-observatory-output',
    '.mirror-authority-gradient',
    '.mirror-authority-gradient::before',
    '.mirror-authority-gradient-rail',
    '.mirror-authority-gradient-rail li[data-authority-rung="publish"]',
    '.mirror-authority-gradient-boundary',
    '.mirror-infinity-language',
    '.mirror-infinity-language::before',
    '.mirror-infinity-language-grid',
    '.mirror-infinity-language-grid li:first-child',
    '.mirror-symbol-mark',
    '.mirror-evolution-doorway',
    '.mirror-dynamic-infinity',
    '.mirror-dynamic-infinity span::after',
    '.mirror-doorway-link',
    '.mirror-doorway-link[data-doorway="partners"]::after',
    '.mirror-doorway-commitment',
    '.mirror-join-grid',
    '.mirror-first-artifact-router',
    '.mirror-first-artifact-router::before',
    '.mirror-first-artifact-copy',
    '.mirror-first-artifact-grid',
    '.mirror-first-artifact-grid li:nth-child(4)::before',
    '.mirror-first-artifact-grid a::after',
    '.mirror-first-artifact-boundary',
    '.mirror-entry-protocol',
    '.mirror-entry-protocol::before',
    '.mirror-entry-protocol-grid',
    '.mirror-entry-protocol-grid li:nth-child(4)::before',
    '@keyframes mirror-first-artifact-scan',
    '@keyframes mirror-entry-protocol-scan',
    '@keyframes mirror-portal-float',
    '@keyframes mirror-threshold-depth',
    '@keyframes mirror-threshold-scan',
    '@keyframes mirror-fracture-shard',
    '@keyframes mirror-fracture-cell',
    '@keyframes mirror-reflection-plane-scan',
    '@keyframes mirror-reflection-current',
    '@keyframes mirror-adaptive-sheen',
    '@keyframes mirror-adaptive-lens',
    '@keyframes mirror-adaptive-signal',
    '@keyframes mirror-human-signal-scan',
    '@keyframes mirror-human-signal-node',
    '@keyframes mirror-desire-wall-scan',
    '@keyframes mirror-desire-current',
    '@keyframes mirror-desire-node',
    '@keyframes mirror-route-compass-scan',
    '@keyframes mirror-route-compass-node',
    '@keyframes mirror-delivery-scan',
    '@keyframes mirror-delivery-pulse',
    '@keyframes mirror-remix-fit-scan',
    '@keyframes mirror-remix-fit-node',
    '@keyframes mirror-artifact-scan',
    '@keyframes mirror-artifact-route',
    '@keyframes mirror-artifact-node',
    '@keyframes mirror-descent-scan',
    '@keyframes mirror-symbol-mark-pulse',
    '@keyframes mirror-descent-meter',
    '@keyframes mirror-descent-current',
    '@keyframes mirror-tunnel-scan',
    '@keyframes mirror-tunnel-depth',
    '@keyframes mirror-tunnel-cell',
    '@keyframes mirror-tunnel-step-sheen',
    '@keyframes mirror-brain-current',
    '@keyframes mirror-brain-route-current',
    '@keyframes mirror-brain-route-draw',
    '@keyframes mirror-brain-route-node',
    '@keyframes mirror-tension-draw',
    '@keyframes mirror-signal-constellation-current',
    '@keyframes mirror-signal-node',
    '@keyframes mirror-cell-pulse',
    '@keyframes mirror-growth-expand',
    '@keyframes mirror-growth-node',
    '@keyframes mirror-growth-route',
    '@keyframes mirror-growth-orbit',
    '@keyframes mirror-spine-current',
    '@keyframes mirror-organism-scan',
    '@keyframes mirror-organism-card-breathe',
    '@keyframes mirror-architecture-route',
    '@keyframes mirror-architecture-glass-sweep',
    '@keyframes mirror-architecture-pane-drift',
    '@keyframes mirror-doorway-orbit',
    '@keyframes mirror-doorway-infinity-pulse',
    '@keyframes mirror-doorway-node',
    '@keyframes mirror-proof-cascade-route',
    '@keyframes mirror-proof-observatory-scan',
    '@keyframes mirror-authority-gradient-scan',
    '@keyframes mirror-proof-cascade-node',
    '@keyframes mirror-instrument-scan',
    '@keyframes mirror-engine-console-pulse',
    '@keyframes mirror-build-ledger-scan',
    '@keyframes mirror-build-ledger-node',
    '@keyframes mirror-state-route',
    '@keyframes mirror-state-core-pulse',
    '@keyframes mirror-nav-orbit-drift',
    '@keyframes mirror-nav-infinity-breathe',
    '@keyframes mirror-nav-panel-in',
    '@media (min-width: 900px)',
    '@media (max-width: 760px)',
    '@media (prefers-reduced-motion: reduce)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing Infinity Mirror experience snippet ${snippet}`);
  }

  for (const snippet of [
    'Infinity Mirror Scroll Choreography',
    "document.querySelector('.mirror-experience-page')",
    'function getMirrorExperienceStepTarget(step)',
    "step.querySelector('.mirror-scroll-link')?.getAttribute('href')",
    "target?.closest('.mirror-experience-hero, .mirror-experience-section') || target",
    'mirrorExperienceSteps.map(getMirrorExperienceStepTarget).filter(Boolean)',
    "document.querySelectorAll('.mirror-scroll-step')",
    'function clampMirrorExperienceValue(value, min = 0, max = 1)',
    "const currentLink = step.querySelector('.mirror-scroll-link')",
    "step.classList.toggle('is-active'",
    "currentLink?.setAttribute('aria-current', 'step')",
    "document.body.dataset.mirrorStep",
    "requestAnimationFrame(() => queueMirrorExperienceStepUpdate())",
    'function updateMirrorExperienceDepthFromScroll()',
    "style.setProperty('--mirror-scroll-progress'",
    "style.setProperty('--mirror-fracture-offset'",
    'function updateMirrorExperienceFromScroll()',
    "function updateMirrorExperienceStepFromScroll()",
    'function handleMirrorScrollLinkClick(event)',
    "window.history.pushState(null, '', targetHash)",
    "mirrorExperiencePage.addEventListener('click', handleMirrorScrollLinkClick)",
    "const probeY = Math.min(window.innerHeight * 0.42, 420)",
    "requestAnimationFrame(() =>",
    "window.addEventListener('scroll', queueMirrorExperienceStepUpdate, { passive: true })",
    'Infinity Mirror Bounded Portal Field',
    "document.getElementById('mirror-runtime-field')",
    "mirrorRuntimeField?.getContext('2d', { alpha: true })",
    "const mirrorRuntimeCompactQuery = window.matchMedia?.('(max-width: 760px)')",
    'function isMirrorRuntimeStatic()',
    'function getMirrorRuntimeScrollDepth()',
    'function getMirrorRuntimePoint(theta, scale, cx, cy, rotation = 0)',
    'function resizeMirrorRuntimeField()',
    'Math.min(window.devicePixelRatio || 1, 1.5)',
    'function drawMirrorRuntimeField(timestamp = 0, once = false)',
    "mirrorRuntimeField.dataset.fieldState = staticMode ? 'static' : mirrorRuntimeVisible ? 'active' : 'paused'",
    'function stopMirrorRuntimeField()',
    'function startMirrorRuntimeField()',
    "mirrorRuntimeStage.addEventListener('pointermove'",
    "'IntersectionObserver' in window",
    "mirrorRuntimeObserver.observe(mirrorRuntimeStage)",
    'Infinity Mirror Brain Route Pulse',
    ".mirror-brain-system[data-runtime-owner=\"bounded-brain-route\"]",
    "const mirrorBrainRuntimeCompactQuery = window.matchMedia?.('(max-width: 760px)')",
    'const mirrorBrainRuntimePhases = [',
    'handoffCopies: Array.from(mirrorBrainRuntime.querySelectorAll(\'[data-brain-handoff]\'))',
    'routeCopies: Array.from(mirrorBrainRuntime.querySelectorAll(\'[data-brain-route-copy]\'))',
    'stateCopies: Array.from(mirrorBrainRuntime.querySelectorAll(\'[data-brain-state-copy]\'))',
    'function isMirrorBrainRuntimeStatic()',
    'function toggleMirrorBrainRuntimeNodes(nodes, dataName, activeValues)',
    'function toggleMirrorBrainSignalNodes(nodes, dataName, activeValues)',
    'function setMirrorBrainRuntimePhase(index)',
    'function setMirrorBrainSignalProfile(signalId, brain)',
    'mirrorBrainRuntime.dataset.routePhase = phase.phase',
    'mirrorBrainRuntime.dataset.signalProfile = signalId',
    'function stopMirrorBrainRuntimePulse()',
    'function startMirrorBrainRuntimePulse()',
    'requestAnimationFrame(updateMirrorBrainRuntimePulse)',
    'mirrorBrainRuntimeObserver.observe(mirrorBrainRuntime)',
    'Infinity Mirror Organism Growth Relay',
    ".mirror-organism-visualizer[data-runtime-owner=\"bounded-organism-relay\"]",
    ".mirror-growth-system[data-runtime-owner=\"bounded-growth-relay\"]",
    "const mirrorRelayRuntimeCompactQuery = window.matchMedia?.('(max-width: 760px)')",
    'const mirrorOrganismRelayPhases = [',
    'const mirrorGrowthRelayPhases = [',
    'function isMirrorRelayRuntimeStatic()',
    'function toggleMirrorRelayNodes(nodes, dataName, activeValues)',
    'function setMirrorOrganismRelayPhase(index)',
    'mirrorOrganismRelay.dataset.organismPhase = phase.organism',
    'function startMirrorOrganismRelay()',
    'function setMirrorGrowthRelayPhase(index)',
    'mirrorGrowthRelay.dataset.growthPhase = phase.phase',
    'function startMirrorGrowthRelay()',
    'requestAnimationFrame(updateMirrorOrganismRelay)',
    'requestAnimationFrame(updateMirrorGrowthRelay)',
    'mirrorOrganismRelayObserver.observe(mirrorOrganismRelay)',
    'mirrorGrowthRelayObserver.observe(mirrorGrowthRelay)',
	    'Infinity Mirror Adaptive Artifact Relay',
	    ".mirror-adaptive-engine[data-runtime-owner=\"bounded-adaptive-lens-relay\"]",
	    ".mirror-returned-artifact[data-runtime-owner=\"bounded-artifact-return\"]",
	    ".mirror-signal-composer[data-runtime-owner=\"bounded-signal-composer\"]",
	    "const mirrorConceptRelayCompactQuery = window.matchMedia?.('(max-width: 760px)')",
	    'const mirrorConceptRelayPhases = [',
	    'const mirrorSignalComposerPackets = {',
	    "cells: ['gateway', 'cortex', 'memory', 'pattern', 'immune', 'proof']",
	    'function isMirrorConceptRelayStatic()',
	    'function setMirrorArtifactRouteState(artifact, decisions, runtime)',
	    'function setMirrorConceptRelayPhase(index, { manual = false } = {})',
	    'function setMirrorSignalComposer(signalId, { manual = false } = {})',
	    "setMirrorTranslatedText(mirrorSignalComposerTargets.artifactFields[field], key)",
	    'setMirrorBrainSignalProfile(signalId, packet.brain)',
	    'mirrorAdaptiveArtifactRelay.dataset.activeLens = phase.lens',
	    'mirrorArtifactReturnRelay.dataset.artifactPhase = artifact',
	    'control.setAttribute(\'aria-pressed\'',
	    "document.addEventListener('uc:languagechange'",
    'requestAnimationFrame(updateMirrorConceptRelay)',
    'mirrorConceptRelayObserver.observe(mirrorConceptRelayRoot)',
    '.mirror-state-sequencer[data-runtime-owner="bounded-state-sequencer"]',
    'const mirrorStateSequencerPackets = {',
    'function setMirrorStateSequencer(stateId)',
    'control.dataset.mirrorStateControl',
    'node.dataset.mirrorStateNode',
    "mirrorStateSequencerTargets.link.setAttribute('href', packet.href)",
    "['join', '#mirror-join-title']",
    'stateObserver.observe(section)',
    '.mirror-emotional-progression[data-runtime-owner="bounded-emotional-progress"]',
    'const mirrorEmotionPackets = {',
    'function setMirrorEmotionalProgression(emotionId)',
    'setMirrorTranslatedText(mirrorEmotionTargets.outputs[field], key)',
    'control.dataset.emotionControl',
    '.mirror-proof-observatory[data-runtime-owner="bounded-proof-observatory"]',
    'const mirrorProofObservatoryPackets = {',
    'function setMirrorProofObservatory(proofId)',
    'control.dataset.proofObservatoryControl',
    "mirrorProofObservatoryTargets.link.setAttribute('href', packet.href)",
  ]) {
    assert.ok(main.includes(snippet), `main.js missing Infinity Mirror choreography snippet ${snippet}`);
  }

  for (const snippet of [
    "'mirrorExp.stateSeq.title': 'The whole story is a bounded organism loop.'",
    "'mirrorExp.stateSeq.brain.response': 'Gateway, Cortex, Memory, Immune Gate, Cells, and Proof Loop take roles.'",
    "'mirrorExp.stateSeq.join.boundary': 'Collaboration starts with scope and consent, not hidden authority.'",
    "'mirrorExp.stateSeq.title': 'Toda la historia es un loop de organismo acotado.'",
    "'mirrorExp.stateSeq.join.boundary': 'La colaboración empieza con alcance y consentimiento, no autoridad oculta.'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing state sequencer copy ${snippet}`);
  }

  for (const snippet of [
    'id="mirror-emotional-progression"',
    'data-runtime-owner="bounded-emotional-progress"',
    'data-active-emotion="curiosity"',
    'data-emotion-control="curiosity"',
    'data-emotion-control="agency"',
    'data-emotion-output="feeling"',
    'data-emotion-output="boundary"',
    'data-i18n="mirrorExp.emotion.title"',
  ]) {
    assert.ok(source.includes(snippet), `Infinity Mirror route missing emotional progression snippet ${snippet}`);
  }

  for (const snippet of [
    '.mirror-emotional-progression',
    '.mirror-emotion-controls button[aria-pressed="true"]',
    '.mirror-emotion-output',
    '@keyframes mirror-emotion-rail-scan',
  ]) {
    assert.ok(css.includes(snippet), `style.css missing emotional progression style ${snippet}`);
  }

  for (const snippet of [
    "'mirrorExp.emotion.title': 'The experience moves feeling into proof before it asks for trust.'",
    "'mirrorExp.emotion.agency.boundary': 'The next move starts with scope and consent, not hidden authority.'",
    "'mirrorExp.emotion.title': 'La experiencia mueve la emoción hacia la prueba antes de pedir confianza.'",
    "'mirrorExp.emotion.agency.boundary': 'El siguiente movimiento empieza con alcance y consentimiento, no autoridad oculta.'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing emotional progression copy ${snippet}`);
  }

  const runtimeFieldAsset = manifest.assets.find(item => item.id === 'infinity-mirror-runtime-field');
  assert.ok(runtimeFieldAsset, 'asset manifest missing Infinity Mirror runtime field');
  assert.equal(runtimeFieldAsset.file, 'main.js#mirror-runtime-field');
  assert.equal(runtimeFieldAsset.route, '/organisms/infinity-mirror/experience');
  assert.equal(runtimeFieldAsset.surface, '#mirror-experience-hero');
  assert.match(runtimeFieldAsset.accessibility, /aria-hidden/);
  assert.match(runtimeFieldAsset.text_policy, /No embedded UI text/);
  assert.match(runtimeFieldAsset.motion_policy, /IntersectionObserver/);
  assert.match(runtimeFieldAsset.motion_policy, /prefers-reduced-motion/);
  assert.match(runtimeFieldAsset.performance.mobile_policy, /display none under 760px/);
  assert.deepEqual(runtimeFieldAsset.performance.dependencies, []);

  const brainRoutePulseAsset = manifest.assets.find(item => item.id === 'infinity-mirror-brain-route-pulse');
  assert.ok(brainRoutePulseAsset, 'asset manifest missing Infinity Mirror brain route pulse');
  assert.equal(brainRoutePulseAsset.file, 'main.js#mirror-brain-route-pulse');
  assert.equal(brainRoutePulseAsset.route, '/organisms/infinity-mirror/experience');
  assert.equal(brainRoutePulseAsset.surface, '#mirror-brain-title');
  assert.match(brainRoutePulseAsset.purpose, /signal handoff/);
  assert.match(brainRoutePulseAsset.trust_value, /signal, cells, authority, and proof/);
  assert.match(brainRoutePulseAsset.trust_value, /visible Brain handoff/);
  assert.match(brainRoutePulseAsset.accessibility, /semantic headings/);
  assert.match(brainRoutePulseAsset.text_policy, /No generated or embedded UI text/);
  assert.match(brainRoutePulseAsset.text_policy, /existing i18n keys/);
  assert.match(brainRoutePulseAsset.motion_policy, /IntersectionObserver/);
  assert.match(brainRoutePulseAsset.motion_policy, /prefers-reduced-motion static mode/);
  assert.match(brainRoutePulseAsset.performance.mobile_policy, /Compact screens freeze/);
  assert.deepEqual(brainRoutePulseAsset.performance.dependencies, []);

  const stateSequencerAsset = manifest.assets.find(item => item.id === 'infinity-mirror-state-sequencer');
  assert.ok(stateSequencerAsset, 'asset manifest missing Infinity Mirror state sequencer');
  assert.equal(stateSequencerAsset.file, 'main.js#mirror-state-sequencer');
  assert.equal(stateSequencerAsset.route, '/organisms/infinity-mirror/experience');
  assert.equal(stateSequencerAsset.surface, '#mirror-state-sequencer');
  assert.match(stateSequencerAsset.purpose, /seven Infinity Mirror chapters/);
  assert.match(stateSequencerAsset.trust_value, /proof artifact/);
  assert.match(stateSequencerAsset.accessibility, /aria-live proof packet/);
  assert.match(stateSequencerAsset.text_policy, /existing i18n keys/);
  assert.match(stateSequencerAsset.motion_policy, /IntersectionObserver chapter awareness/);
  assert.match(stateSequencerAsset.motion_policy, /no deployment action/);
  assert.match(stateSequencerAsset.performance.mobile_policy, /one column/);
  assert.deepEqual(stateSequencerAsset.performance.dependencies, []);

  const cognitiveTraceAsset = manifest.assets.find(item => item.id === 'infinity-mirror-cognitive-evolution-trace');
  assert.ok(cognitiveTraceAsset, 'asset manifest missing Infinity Mirror cognitive evolution trace');
  assert.equal(cognitiveTraceAsset.file, 'organisms/infinity-mirror/experience/index.html#mirror-cognitive-evolution-trace');
  assert.equal(cognitiveTraceAsset.route, '/organisms/infinity-mirror/experience');
  assert.equal(cognitiveTraceAsset.surface, '#mirror-cognitive-evolution-trace');
  assert.match(cognitiveTraceAsset.purpose, /signal to memory, cells, sandbox, proof, and next loop/);
  assert.match(cognitiveTraceAsset.trust_value, /proof locks/);
  assert.match(cognitiveTraceAsset.accessibility, /semantic section/);
  assert.match(cognitiveTraceAsset.motion_policy, /no deployment action/);
  assert.deepEqual(cognitiveTraceAsset.performance.dependencies, []);

  const routeCompassAsset = manifest.assets.find(item => item.id === 'infinity-mirror-route-compass');
  assert.ok(routeCompassAsset, 'asset manifest missing Infinity Mirror route compass');
  assert.equal(routeCompassAsset.file, 'organisms/infinity-mirror/experience/index.html#mirror-route-compass');
  assert.equal(routeCompassAsset.route, '/organisms/infinity-mirror/experience');
  assert.equal(routeCompassAsset.surface, '#mirror-route-compass');
  assert.match(routeCompassAsset.purpose, /81K human desire signals/);
  assert.match(routeCompassAsset.trust_value, /proof return/);
  assert.match(routeCompassAsset.accessibility, /ordered list/);
  assert.match(routeCompassAsset.motion_policy, /no model call/);
  assert.match(routeCompassAsset.motion_policy, /no Web3 broadcast/);
  assert.deepEqual(routeCompassAsset.performance.dependencies, []);

  const firstArtifactAsset = manifest.assets.find(item => item.id === 'infinity-mirror-first-artifact-router');
  assert.ok(firstArtifactAsset, 'asset manifest missing Infinity Mirror first artifact router');
  assert.equal(firstArtifactAsset.file, 'organisms/infinity-mirror/experience/index.html#mirror-first-artifact-router');
  assert.equal(firstArtifactAsset.route, '/organisms/infinity-mirror/experience');
  assert.equal(firstArtifactAsset.surface, '#mirror-first-artifact-router');
  assert.match(firstArtifactAsset.purpose, /builders, investors, researchers, and partners/);
  assert.match(firstArtifactAsset.trust_value, /what first artifact returns/);
  assert.match(firstArtifactAsset.accessibility, /semantic section/);
  assert.match(firstArtifactAsset.motion_policy, /no data submission/);
  assert.match(firstArtifactAsset.motion_policy, /no deployment/);
  assert.deepEqual(firstArtifactAsset.performance.dependencies, []);

  const entryProtocolAsset = manifest.assets.find(item => item.id === 'infinity-mirror-evolution-entry-protocol');
  assert.ok(entryProtocolAsset, 'asset manifest missing Infinity Mirror evolution entry protocol');
  assert.equal(entryProtocolAsset.file, 'organisms/infinity-mirror/experience/index.html#mirror-evolution-entry-protocol');
  assert.equal(entryProtocolAsset.route, '/organisms/infinity-mirror/experience');
  assert.equal(entryProtocolAsset.surface, '#mirror-evolution-entry-protocol');
  assert.match(entryProtocolAsset.purpose, /signal, boundary, first proof, and next loop/);
  assert.match(entryProtocolAsset.trust_value, /one reviewable artifact/);
  assert.match(entryProtocolAsset.accessibility, /semantic ordered list/);
  assert.match(entryProtocolAsset.motion_policy, /no public posting/);
  assert.deepEqual(entryProtocolAsset.performance.dependencies, []);

  const phaseLedgerAsset = manifest.assets.find(item => item.id === 'infinity-mirror-phase-proof-ledger');
  assert.ok(phaseLedgerAsset, 'asset manifest missing Infinity Mirror phase proof ledger');
  assert.equal(phaseLedgerAsset.file, 'organisms/infinity-mirror/experience/index.html#mirror-phase-proof-ledger');
  assert.equal(phaseLedgerAsset.route, '/organisms/infinity-mirror/experience');
  assert.equal(phaseLedgerAsset.surface, '#mirror-phase-proof-ledger');
  assert.match(phaseLedgerAsset.purpose, /seven Infinity Mirror build phases/);
  assert.match(phaseLedgerAsset.trust_value, /phase coverage inspectable/);
  assert.match(phaseLedgerAsset.accessibility, /ordered semantic list/);
  assert.match(phaseLedgerAsset.motion_policy, /no deployment action/);
  assert.deepEqual(phaseLedgerAsset.performance.dependencies, []);

  const depthGateAsset = manifest.assets.find(item => item.id === 'infinity-mirror-depth-gate');
  assert.ok(depthGateAsset, 'asset manifest missing Infinity Mirror depth readiness gate');
  assert.equal(depthGateAsset.file, 'organisms/infinity-mirror/experience/index.html#mirror-depth-gate');
  assert.equal(depthGateAsset.route, '/organisms/infinity-mirror/experience');
  assert.equal(depthGateAsset.surface, '#mirror-depth-gate');
  assert.match(depthGateAsset.purpose, /cinematic depth into release criteria/);
  assert.match(depthGateAsset.trust_value, /hidden authority/);
  assert.match(depthGateAsset.accessibility, /ordered semantic list/);
  assert.match(depthGateAsset.motion_policy, /no WebGL runtime/);
  assert.deepEqual(depthGateAsset.performance.dependencies, []);

  const emotionalProgressionAsset = manifest.assets.find(item => item.id === 'infinity-mirror-emotional-progression');
  assert.ok(emotionalProgressionAsset, 'asset manifest missing Infinity Mirror emotional progression rail');
  assert.equal(emotionalProgressionAsset.file, 'main.js#mirror-emotional-progression');
  assert.equal(emotionalProgressionAsset.route, '/organisms/infinity-mirror/experience');
  assert.equal(emotionalProgressionAsset.surface, '#mirror-emotional-progression');
  assert.match(emotionalProgressionAsset.purpose, /curiosity, unease, recognition, wonder, relief, or agency/);
  assert.match(emotionalProgressionAsset.trust_value, /organism route, proof return, and authority boundary/);
  assert.match(emotionalProgressionAsset.accessibility, /native buttons/);
  assert.match(emotionalProgressionAsset.text_policy, /existing i18n keys/);
  assert.match(emotionalProgressionAsset.motion_policy, /no network call/);
  assert.match(emotionalProgressionAsset.performance.mobile_policy, /one column/);
  assert.deepEqual(emotionalProgressionAsset.performance.dependencies, []);

  const proofObservatoryAsset = manifest.assets.find(item => item.id === 'infinity-mirror-proof-observatory');
  assert.ok(proofObservatoryAsset, 'asset manifest missing Infinity Mirror proof observatory');
  assert.equal(proofObservatoryAsset.file, 'main.js#mirror-proof-observatory');
  assert.equal(proofObservatoryAsset.route, '/organisms/infinity-mirror/experience');
  assert.equal(proofObservatoryAsset.surface, '#mirror-proof-observatory');
  assert.match(proofObservatoryAsset.purpose, /Architecture, Metrics, Deployments, or Status/);
  assert.match(proofObservatoryAsset.trust_value, /visible proof instrument/);
  assert.match(proofObservatoryAsset.accessibility, /aria-live proof packet/);
  assert.match(proofObservatoryAsset.motion_policy, /no deployment action/);
  assert.match(proofObservatoryAsset.performance.mobile_policy, /one column/);
  assert.deepEqual(proofObservatoryAsset.performance.dependencies, []);

  const authorityGradientAsset = manifest.assets.find(item => item.id === 'infinity-mirror-authority-gradient');
  assert.ok(authorityGradientAsset, 'asset manifest missing Infinity Mirror authority gradient');
  assert.equal(authorityGradientAsset.file, 'organisms/infinity-mirror/experience/index.html#mirror-authority-gradient');
  assert.equal(authorityGradientAsset.route, '/organisms/infinity-mirror/experience');
  assert.equal(authorityGradientAsset.surface, '#mirror-authority-gradient');
  assert.match(authorityGradientAsset.purpose, /observe, reflect, draft, sandbox, approval, and public-motion/);
  assert.match(authorityGradientAsset.trust_value, /permission ladder/);
  assert.match(authorityGradientAsset.accessibility, /semantic ordered list/);
  assert.match(authorityGradientAsset.motion_policy, /no public posting/);
  assert.match(authorityGradientAsset.performance.mobile_policy, /one column/);
  assert.deepEqual(authorityGradientAsset.performance.dependencies, []);

  const organismGrowthRelayAsset = manifest.assets.find(item => item.id === 'infinity-mirror-organism-growth-relay');
  assert.ok(organismGrowthRelayAsset, 'asset manifest missing Infinity Mirror organism growth relay');
  assert.equal(organismGrowthRelayAsset.file, 'main.js#mirror-organism-growth-relay');
  assert.equal(organismGrowthRelayAsset.route, '/organisms/infinity-mirror/experience');
  assert.equal(organismGrowthRelayAsset.surface, '#mirror-organisms-title');
  assert.match(organismGrowthRelayAsset.purpose, /Visual Cortex, Infinity Mirror, Financial Organism, and Research Organisms/);
  assert.match(organismGrowthRelayAsset.trust_value, /hidden autonomy/);
  assert.match(organismGrowthRelayAsset.accessibility, /semantic links/);
  assert.match(organismGrowthRelayAsset.text_policy, /No generated or embedded UI text/);
  assert.match(organismGrowthRelayAsset.motion_policy, /IntersectionObserver/);
  assert.match(organismGrowthRelayAsset.motion_policy, /compact-screen static mode/);
  assert.match(organismGrowthRelayAsset.performance.mobile_policy, /Compact screens freeze/);
  assert.deepEqual(organismGrowthRelayAsset.performance.dependencies, []);

  const adaptiveArtifactRelayAsset = manifest.assets.find(item => item.id === 'infinity-mirror-adaptive-artifact-relay');
  assert.ok(adaptiveArtifactRelayAsset, 'asset manifest missing Infinity Mirror adaptive artifact relay');
  assert.equal(adaptiveArtifactRelayAsset.file, 'main.js#mirror-adaptive-artifact-relay');
  assert.equal(adaptiveArtifactRelayAsset.route, '/organisms/infinity-mirror/experience');
  assert.equal(adaptiveArtifactRelayAsset.surface, '#mirror-reflection-title');
  assert.match(adaptiveArtifactRelayAsset.purpose, /Architect, Cartographer, Translator, and Ritualist/);
  assert.match(adaptiveArtifactRelayAsset.trust_value, /reversible/);
  assert.match(adaptiveArtifactRelayAsset.accessibility, /native buttons with aria-pressed/);
  assert.match(adaptiveArtifactRelayAsset.text_policy, /No generated or embedded UI text/);
  assert.match(adaptiveArtifactRelayAsset.motion_policy, /IntersectionObserver/);
	  assert.match(adaptiveArtifactRelayAsset.motion_policy, /no camera access/);
	  assert.match(adaptiveArtifactRelayAsset.performance.mobile_policy, /Compact screens freeze/);
	  assert.deepEqual(adaptiveArtifactRelayAsset.performance.dependencies, []);

	  const signalComposerAsset = manifest.assets.find(item => item.id === 'infinity-mirror-signal-composer');
	  assert.ok(signalComposerAsset, 'asset manifest missing Infinity Mirror signal composer');
	  assert.equal(signalComposerAsset.file, 'main.js#mirror-signal-composer');
	  assert.equal(signalComposerAsset.route, '/organisms/infinity-mirror/experience');
	  assert.equal(signalComposerAsset.surface, '#mirror-signal-composer');
	  assert.match(signalComposerAsset.purpose, /mental room, build stuck, trust proof, or quiet listen/);
	  assert.match(signalComposerAsset.trust_value, /hidden memory/);
	  assert.match(signalComposerAsset.accessibility, /native fieldset/);
	  assert.match(signalComposerAsset.text_policy, /i18n keys/);
	  assert.match(signalComposerAsset.motion_policy, /no camera access/);
	  assert.match(signalComposerAsset.performance.mobile_policy, /Compact screens collapse/);
	  assert.deepEqual(signalComposerAsset.performance.dependencies, []);

	  const memoryConsentAsset = manifest.assets.find(item => item.id === 'infinity-mirror-memory-consent-ledger');
	  assert.ok(memoryConsentAsset, 'asset manifest missing Infinity Mirror memory consent ledger');
	  assert.equal(memoryConsentAsset.file, 'organisms/infinity-mirror/experience/index.html#mirror-memory-consent');
	  assert.equal(memoryConsentAsset.route, '/organisms/infinity-mirror/experience');
	  assert.equal(memoryConsentAsset.surface, '#mirror-memory-consent');
	  assert.match(memoryConsentAsset.purpose, /ephemeral, proposed, reviewed, and integrated/);
	  assert.match(memoryConsentAsset.trust_value, /visible consent ladder/);
	  assert.match(memoryConsentAsset.accessibility, /semantic ordered list/);
	  assert.match(memoryConsentAsset.text_policy, /i18n.js/);
	  assert.match(memoryConsentAsset.motion_policy, /no storage/);
	  assert.match(memoryConsentAsset.motion_policy, /no deployment/);
	  assert.match(memoryConsentAsset.performance.mobile_policy, /compact screens collapse/);
	  assert.deepEqual(memoryConsentAsset.performance.dependencies, []);

	  const experienceAuditAsset = manifest.assets.find(item => item.id === 'infinity-mirror-experience-audit');
  assert.ok(experienceAuditAsset, 'asset manifest missing Infinity Mirror experience audit');
  assert.equal(experienceAuditAsset.file, 'assets/specs/infinity-mirror-experience-audit.md');
  assert.equal(experienceAuditAsset.route, '/organisms/infinity-mirror/experience');
  assert.equal(experienceAuditAsset.surface, '#mirror-experience-audit');
  assert.equal(experienceAuditAsset.format, 'text/markdown');
  assert.match(experienceAuditAsset.purpose, /Phase 1 reverse-engineering audit/);
  assert.match(experienceAuditAsset.trust_value, /without cloning the design/);
  assert.match(experienceAuditAsset.accessibility, /semantic HTML link/);
  assert.match(experienceAuditAsset.motion_policy, /No runtime motion/);
  assert.deepEqual(experienceAuditAsset.performance.dependencies, []);

  const engineConceptAsset = manifest.assets.find(item => item.id === 'infinity-mirror-engine-concept-analysis');
  assert.ok(engineConceptAsset, 'asset manifest missing Infinity Mirror engine concept analysis');
  assert.equal(engineConceptAsset.file, 'assets/specs/infinity-mirror-engine-concept-analysis.md');
  assert.equal(engineConceptAsset.route, '/organisms/infinity-mirror/experience');
  assert.equal(engineConceptAsset.surface, '#mirror-engine-concept-packet');
  assert.equal(engineConceptAsset.format, 'text/markdown');
  assert.match(engineConceptAsset.purpose, /uploaded Infinity Mirror ZIP/);
  assert.match(engineConceptAsset.trust_value, /block until proof decisions/);
  assert.match(engineConceptAsset.trust_value, /default camera reflection/);
  assert.match(engineConceptAsset.accessibility, /semantic HTML link/);
  assert.match(engineConceptAsset.motion_policy, /No runtime motion/);
  assert.deepEqual(engineConceptAsset.performance.dependencies, []);

  const implementationPacketAsset = manifest.assets.find(item => item.id === 'infinity-mirror-implementation-packet');
  assert.ok(implementationPacketAsset, 'asset manifest missing Infinity Mirror implementation packet');
  assert.equal(implementationPacketAsset.file, 'assets/specs/infinity-mirror-implementation-packet.json');
  assert.equal(implementationPacketAsset.route, '/organisms/infinity-mirror/experience');
  assert.equal(implementationPacketAsset.surface, '#mirror-execution-packet');
  assert.equal(implementationPacketAsset.format, 'application/json');
  assert.match(implementationPacketAsset.purpose, /Remix concept review/);
  assert.match(implementationPacketAsset.trust_value, /adopted, prototype-next, and blocked design decisions/);
  assert.match(implementationPacketAsset.trust_value, /public deployment remains behind explicit approval/);
  assert.match(implementationPacketAsset.accessibility, /semantic server-rendered content before motion/);
  assert.match(implementationPacketAsset.motion_policy, /No runtime motion/);
  assert.match(implementationPacketAsset.performance.mobile_policy, /no horizontal overflow/);
  assert.deepEqual(implementationPacketAsset.performance.dependencies, []);

  const codeHandoffAsset = manifest.assets.find(item => item.id === 'infinity-mirror-runtime-code-handoff');
  assert.ok(codeHandoffAsset, 'asset manifest missing Infinity Mirror runtime code handoff');
  assert.equal(codeHandoffAsset.file, 'assets/specs/infinity-mirror-runtime-code-handoff.md');
  assert.equal(codeHandoffAsset.route, '/organisms/infinity-mirror/experience');
  assert.equal(codeHandoffAsset.surface, '#mirror-code-handoff');
  assert.equal(codeHandoffAsset.format, 'text/markdown');
  assert.match(codeHandoffAsset.purpose, /implementation-ready React, server-rendered Desire Translation Wall, Mirror Route Compass, Brain Cell Network, Living Organism Visualizer, Recursive Growth Timeline, Floating Architecture Maps, Proof Cascade, Proof Observatory, Scroll Choreography Map, Motion Contract Ledger, Infinity Symbol Language, Framer, GSAP, Three\/WebGL, Tailwind, and asset code contracts/);
  assert.match(codeHandoffAsset.trust_value, /Desire Translation Wall preserves research-to-product proof logic/);
  assert.match(codeHandoffAsset.trust_value, /Mirror Route Compass preserves chapter\/proofReturn\/authorityStop\/CTA routing data/);
  assert.match(codeHandoffAsset.trust_value, /Scroll Choreography Map preserves seven-act motion meaning/);
  assert.match(codeHandoffAsset.trust_value, /Motion Contract Ledger preserves trigger, animation, timing, duration, easing, and performance strategy/);
  assert.match(codeHandoffAsset.trust_value, /Infinity Symbol Language preserves loop-plus-boundary semantics/);
  assert.match(codeHandoffAsset.trust_value, /Proof Observatory preserves architecture, metrics, deployments, and status packets/);
  assert.match(codeHandoffAsset.trust_value, /public deployment stays approval-gated/);
  assert.match(codeHandoffAsset.accessibility, /semantic HTML link/);
  assert.match(codeHandoffAsset.motion_policy, /No runtime motion/);
  assert.match(codeHandoffAsset.motion_policy, /cleanup/);
  assert.deepEqual(codeHandoffAsset.performance.dependencies, []);

  const sourceKitAsset = manifest.assets.find(item => item.id === 'infinity-mirror-runtime-source-kit');
  assert.ok(sourceKitAsset, 'asset manifest missing Infinity Mirror runtime source kit');
  assert.equal(sourceKitAsset.file, 'assets/specs/infinity-mirror-runtime-kit/README.md');
  assert.equal(sourceKitAsset.route, '/organisms/infinity-mirror/experience');
  assert.equal(sourceKitAsset.surface, '#mirror-code-handoff');
  assert.equal(sourceKitAsset.format, 'source-kit');
  assert.match(sourceKitAsset.purpose, /server-rendered Desire Translation Wall, Mirror Route Compass, Brain Cell Network, Living Organism Visualizer, Recursive Growth Timeline/);
  assert.match(sourceKitAsset.trust_value, /static/);
  assert.match(sourceKitAsset.trust_value, /desire category to organism route\/proof gate\/authority stop data/);
  assert.match(sourceKitAsset.trust_value, /route compass chapter\/proofReturn\/authorityStop data/);
  assert.match(sourceKitAsset.trust_value, /recursive growth gate signal\/verification\/authority data/);
  assert.match(sourceKitAsset.trust_value, /architecture route\/proof\/boundary panes/);
  assert.match(sourceKitAsset.trust_value, /proof cascade claim\/evidence\/artifact\/boundary data/);
  assert.match(sourceKitAsset.trust_value, /proof observatory packet data/);
  assert.match(sourceKitAsset.trust_value, /seven scroll acts/);
  assert.match(sourceKitAsset.trust_value, /emotional progression packet feeling\/organism route\/proof return\/authority boundary data/);
  assert.match(sourceKitAsset.trust_value, /nine motion contracts/);
  assert.match(sourceKitAsset.trust_value, /seven infinity symbol states/);
  assert.match(sourceKitAsset.trust_value, /does not activate future dependencies/);
  assert.match(sourceKitAsset.accessibility, /server-rendered semantic content first/);
  assert.match(sourceKitAsset.motion_policy, /No active runtime motion/);
  assert.deepEqual(sourceKitAsset.performance.dependencies, []);

  assert.equal(implementationPacket.id, 'infinity-mirror-implementation-packet');
  assert.equal(implementationPacket.status, 'local-proof');
  assert.equal(implementationPacket.current_stack_gate.current_site, 'Vite plus semantic HTML, CSS, and dependency-free JavaScript.');
  assert.deepEqual(implementationPacket.current_stack_gate.current_package_dependencies, ['vite']);
  assert.ok(implementationPacket.current_stack_gate.do_not_import_until_migration.includes('framer-motion'));
  assert.ok(implementationPacket.current_stack_gate.do_not_import_until_migration.includes('three'));
  assert.ok(implementationPacket.component_tree.includes('ArtifactRepairLedger'));
  assert.ok(implementationPacket.component_tree.includes('RuntimeHandoffMatrix'));
  assert.ok(implementationPacket.component_tree.includes('MirrorDepthGate'));
  assert.ok(implementationPacket.component_tree.includes('RuntimeCodeHandoff'));
  assert.ok(implementationPacket.component_tree.includes('MirrorShellSpecimen'));
	  assert.ok(implementationPacket.component_tree.includes('ExperienceAuditConsole'));
	  assert.ok(implementationPacket.component_tree.includes('InfiniteReflectionNavigator'));
	  assert.ok(implementationPacket.component_tree.includes('SignalComposer'));
	  assert.ok(implementationPacket.component_tree.includes('MemoryConsentLedger'));
  assert.ok(implementationPacket.component_tree.includes('MirrorStateSequencer'));
  assert.ok(implementationPacket.component_tree.includes('CognitiveEvolutionTrace'));
  assert.ok(implementationPacket.component_tree.includes('PhaseProofLedger'));
  assert.ok(implementationPacket.component_tree.includes('RecursiveBrainTunnel'));
  assert.ok(implementationPacket.component_tree.includes('BrainRouteConsole'));
	  assert.ok(implementationPacket.component_tree.includes('BrainSignalHandoff'));
  assert.ok(implementationPacket.component_tree.includes('DesireTranslationWall'));
  assert.ok(implementationPacket.component_tree.includes('InfinitySymbolLanguage'));
  assert.ok(implementationPacket.component_tree.includes('ScrollChoreographyMap'));
  assert.ok(implementationPacket.component_tree.includes('EmotionalProgressionRail'));
  assert.ok(implementationPacket.component_tree.includes('ProofObservatory'));
  assert.ok(implementationPacket.component_tree.includes('AuthorityGradient'));
  assert.ok(implementationPacket.component_tree.includes('MirrorRouteCompass'));
  assert.ok(implementationPacket.component_tree.includes('FirstArtifactRouter'));
  assert.ok(implementationPacket.component_tree.includes('EvolutionEntryProtocol'));
  assert.ok(implementationPacket.phase_coverage.some(phase => phase.phase === 'Phase 1 - Experience Reverse Engineering' && phase.evidence === 'assets/specs/infinity-mirror-experience-audit.md'));
  assert.ok(implementationPacket.phase_coverage.some(phase => phase.phase === 'Phase 1 - Experience Reverse Engineering' && phase.current_site_surface.includes('#mirror-experience-audit')));
  assert.ok(implementationPacket.phase_coverage.some(phase => phase.phase === 'Phase 3 - Website Story Arc' && phase.current_site_surface.includes('#mirror-cognitive-evolution-trace')));
  assert.ok(implementationPacket.phase_coverage.some(phase => phase.phase === 'Phase 3 - Website Story Arc' && phase.current_site_surface.includes('#mirror-authority-gradient')));
  assert.ok(implementationPacket.phase_coverage.some(phase => phase.phase === 'Phase 3 - Website Story Arc' && phase.current_site_surface.includes('#mirror-evolution-entry-protocol')));
  assert.ok(implementationPacket.phase_coverage.some(phase => phase.phase === 'Phase 5 - Visual Exploration' && phase.current_site_surface.includes('#mirror-reflection-navigation')));
  assert.ok(implementationPacket.motion_architecture.some(lane => lane.lane === 'FRAMER_LEAF'));
  assert.ok(implementationPacket.motion_architecture.some(lane => lane.lane === 'GSAP_PORTAL'));
  assert.ok(implementationPacket.motion_architecture.some(lane => lane.lane === 'THREE_WEBGL_GATE'));
  assert.ok(implementationPacket.implementation_files.some(file => file.path === 'app/organisms/infinity-mirror/experience/page.tsx'));
  assert.ok(implementationPacket.implementation_files.some(file => file.path === 'components/mirror/MirrorStateSequencer.client.tsx'));
  assert.ok(implementationPacket.implementation_files.some(file => file.path === 'components/mirror/CognitiveEvolutionTrace.tsx'));
  assert.ok(implementationPacket.implementation_files.some(file => file.path === 'components/mirror/PhaseProofLedger.tsx'));
  assert.ok(implementationPacket.implementation_files.some(file => file.path === 'components/mirror/EmotionalProgressionRail.client.tsx'));
  assert.ok(implementationPacket.implementation_files.some(file => file.path === 'components/mirror/ProofObservatory.client.tsx'));
  assert.ok(implementationPacket.implementation_files.some(file => file.path === 'components/mirror/AuthorityGradient.tsx'));
  assert.ok(implementationPacket.implementation_files.some(file => file.path === 'components/mirror/MemoryConsentLedger.tsx'));
  assert.ok(implementationPacket.implementation_files.some(file => file.path === 'components/mirror/MirrorRouteCompass.tsx'));
  assert.ok(implementationPacket.implementation_files.some(file => file.path === 'components/mirror/FirstArtifactRouter.tsx'));
  assert.ok(implementationPacket.implementation_files.some(file => file.path === 'components/mirror/EvolutionEntryProtocol.tsx'));
  assert.ok(implementationPacket.asset_requirements.some(assetRequirement => assetRequirement.path === 'assets/specs/infinity-mirror-experience-audit.md'));
  assert.ok(implementationPacket.asset_requirements.some(assetRequirement => assetRequirement.path === 'assets/specs/infinity-mirror-engine-concept-analysis.md'));
  assert.ok(implementationPacket.implementation_files.some(file => file.path === 'assets/specs/infinity-mirror-runtime-code-handoff.md'));
  assert.ok(implementationPacket.implementation_files.some(file => file.path === 'assets/specs/infinity-mirror-runtime-kit/'));
  assert.ok(implementationPacket.asset_requirements.some(assetRequirement => assetRequirement.path === 'assets/specs/infinity-mirror-implementation-packet.json'));
  assert.ok(implementationPacket.asset_requirements.some(assetRequirement => assetRequirement.path === 'assets/specs/infinity-mirror-runtime-code-handoff.md'));
  assert.ok(implementationPacket.asset_requirements.some(assetRequirement => assetRequirement.path === 'assets/specs/infinity-mirror-runtime-kit/README.md'));
  assert.ok(implementationPacket.acceptance_checks.includes('Experience audit exists and is linked from #mirror-experience-audit.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Engine concept analysis exists and is linked from #mirror-engine-concept-packet.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Signal composer exists at #mirror-signal-composer and updates lens, artifact, boundary, proof fields, and the Brain signal handoff without hidden memory or network authority.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Memory consent ledger exists at #mirror-memory-consent and maps ephemeral, proposed, reviewed, and integrated memory states into can-hold, proof-required, and human-control fields without diagnosis, identity authority, hidden profiling, wallet control, network, file, deployment, public posting, or autonomy authority.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Story rail active state is derived from the canonical seven chapter anchors, not incidental proof or analysis sections.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Mirror state sequencer exists at #mirror-state-sequencer and maps Mirror, Reflection, Brain, Organisms, Growth, Proof, and Join into signal, organism response, proof return, boundary lock, and next chapter route without storage, network, execution, deployment, posting, identity inference, status change, or autonomy authority.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Cognitive evolution trace exists at #mirror-cognitive-evolution-trace and maps signal, memory, cells, sandbox, proof, and next loop into evolves and proof lock fields without storage, network, execution, spending, deployment, posting, Web3 broadcast, status-change, or autonomy authority.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Phase proof ledger exists at #mirror-phase-proof-ledger and maps the seven build phases into evidence, visible surface, and authority boundary without storage, network, execution, deployment, posting, status-change, or autonomy authority.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Infinity symbol language exists at #mirror-infinity-language and maps seven symbol states to proof and boundary meaning.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Scroll choreography map exists at #mirror-scroll-choreography and maps seven story acts to focus, motion, and proof return.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Emotional progression rail exists at #mirror-emotional-progression and maps curiosity, unease, recognition, wonder, relief, and agency into organism route, proof return, and authority boundary without emotional profiling.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Proof observatory exists at #mirror-proof-observatory and maps Architecture, Metrics, Deployments, and Status into evidence path, current signal, authority boundary, and next artifact link without live telemetry or production status changes.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Authority gradient exists at #mirror-authority-gradient and maps observe, reflect, draft, sandbox, approval, and public motion into allowed action and required proof fields without storage, network, execution, spending, deployment, posting, Web3 broadcast, status-change, identity inference, wallet control, or autonomy authority.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Desire translation wall exists at #mirror-desire-translation and maps Anthropic desire categories into organism routes, proof gates, and authority stops without copying quotes.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Mirror route compass exists at #mirror-route-compass and maps 81K human desire signals into mirror chapter, proof return, authority stop, and CTA fields without identity inference, storage, data submission, model calls, build starts, spending, deployment, posting, Web3 broadcast, status-change, or autonomy authority.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime code handoff exists and is linked from #mirror-code-handoff.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit exists, is linked from #mirror-code-handoff, and is copied to dist/assets/specs/.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes InfiniteReflectionNavigator as a server-rendered component backed by mirrorStoryAnchors and reflectionNavigatorLenses.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes DesireTranslationWall as a server-rendered component backed by desireTranslationRoutes.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes MirrorRouteCompass as a server-rendered component backed by mirrorRouteCompassEntries with chapter, proofReturn, authorityStop, href, and cta data.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes AdaptiveMirrorEngine as a server-rendered component backed by adaptiveMirrorLenses.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes SignalComposer as an isolated client leaf backed by signalComposerPackets and no storage, network, file, deploy, posting, or identity authority.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes MemoryConsentLedger as a server-rendered component backed by memoryConsentStates with no diagnosis, identity authority, hidden profiling, wallet control, network, file, deploy, posting, or autonomy authority.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes MirrorStateSequencer as an isolated client leaf backed by mirrorStateSequencerPackets with no storage, network, file, execution, deploy, posting, identity inference, status-change, or autonomy authority.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes RecursiveBrainTunnel as a server-rendered component backed by recursiveBrainTunnelSteps.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes BrainRouteConsole as a server-rendered component backed by defaultBrainSignalHandoff and brainRouteStages.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes BrainSignalHandoff as an isolated client leaf backed by brainSignalHandoffPackets and brainRouteStages with no storage, network, file, execution, deploy, posting, or identity authority.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes BrainCellNetwork and LivingOrganismVisualizer as server-rendered components backed by brainCellNetworkNodes and livingOrganismNodes.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes RecursiveGrowthTimeline, CognitiveEvolutionTrace, FloatingArchitectureMaps, PhaseProofLedger, and ProofCascade as server-rendered components backed by recursiveGrowthGates, cognitiveEvolutionTraceSteps, architectureMapPanes, phaseProofLedgerEntries, and proofCascadeSteps.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes ScrollChoreographyMap and InfinitySymbolLanguage as server-rendered components backed by scrollChoreographyActs and infinitySymbolStates.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes EmotionalProgressionRail as an isolated client leaf backed by mirrorEmotionalProgressionPackets with no emotional profiling, identity inference, storage, network, file, execution, deploy, posting, or identity authority.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes ProofObservatory as an isolated client leaf backed by mirrorProofObservatoryPackets with no live telemetry, storage, file, execution, deploy, posting, status-change, or autonomy authority.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes AuthorityGradient as a server-rendered component backed by authorityGradientRungs with no hidden memory, identity authority, wallet control, deploy, posting, status-change, or autonomy authority.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes MotionContractLedger as a server-rendered component backed by motionContracts with trigger, animation, timing, duration, easing, and performance.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes MirrorShellSpecimen, MirrorProductLoop, ReturnedArtifactSpecimen, and MirrorDescentProtocol as server-rendered components backed by mirrorShellRules, mirrorProductLoopSteps, artifactDecisionLabels, returnedArtifactFields, artifactRepairSteps, and mirrorDescentStages.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes ExperienceAuditConsole as a server-rendered component backed by experienceAuditLenses with purpose, works, and reinterpret fields.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes SourceTranslationLedger, EngineTranslationLedger, InterfaceBuildLedger, RuntimeHandoffMatrix, and MirrorDepthGate as server-rendered components backed by sourceTranslationLedgerEntries, engineTranslationLedgerEntries, interfaceBuildStages, runtimeHandoffLanes, and mirrorDepthGateLanes.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Mirror depth gate exists at #mirror-depth-gate and maps semantic, Framer, GSAP, and Three/WebGL depth lanes into trigger, allowed behavior, proof needed, fallback, and kill switch without storage, network, execution, spending, deployment, posting, Web3 broadcast, status-change, identity inference, or autonomy authority.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes JoinEvolutionRoutes as a server-rendered component backed by joinRoutes with role, next action, proof, and boundary.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes FirstArtifactRouter as a server-rendered component backed by firstArtifactRoutes with bring, firstArtifact, proofRoute, approvalBoundary, href, and cta data.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Runtime source kit includes EvolutionEntryProtocol as a server-rendered component backed by evolutionEntryProtocolSteps with signal, boundary, first proof, next loop, input, and proof output data.'));
  assert.ok(implementationPacket.acceptance_checks.includes('First artifact router exists at #mirror-first-artifact-router and maps builder, investor, researcher, and partner roles into bring, first artifact, proof route, and approval boundary fields without data submission, lead creation, storage, network, execution, spending, deployment, posting, Web3 broadcast, status-change, identity inference, or autonomy authority.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Evolution entry protocol exists at #mirror-evolution-entry-protocol and maps signal, boundary, first proof, and next loop into input and proof output fields without storage, network, execution, spending, deployment, posting, Web3 broadcast, status-change, identity inference, or autonomy authority.'));
  assert.ok(implementationPacket.acceptance_checks.includes('Public deployment remains gated by explicit approval.'));

  assert.ok(experienceAudit.includes('# Infinity Mirror Experience Audit'), 'experience audit missing title');
  assert.ok(experienceAudit.includes('Source pattern: https://www.anthropic.com/features/81k-interviews'), 'experience audit missing source URL');
  assert.ok(experienceAudit.includes('80,508 interviews across 159 countries and 70 languages'), 'experience audit missing source scale');
  assert.ok(experienceAudit.includes('## 01. Information Architecture'), 'experience audit missing information architecture lens');
  assert.ok(experienceAudit.includes('## 02. Storytelling Flow'), 'experience audit missing storytelling lens');
  assert.ok(experienceAudit.includes('## 03. Scroll Choreography'), 'experience audit missing scroll lens');
  assert.ok(experienceAudit.includes('## 04. Motion Design System'), 'experience audit missing motion lens');
  assert.ok(experienceAudit.includes('## 05. Visual Hierarchy'), 'experience audit missing hierarchy lens');
  assert.ok(experienceAudit.includes('## 06. Typography System'), 'experience audit missing typography lens');
  assert.ok(experienceAudit.includes('## 07. Transition Logic'), 'experience audit missing transition lens');
  assert.ok(experienceAudit.includes('## 08. User Attention Management'), 'experience audit missing attention lens');
  assert.ok(experienceAudit.includes('## 09. Emotional Progression'), 'experience audit missing emotion lens');
  assert.ok(experienceAudit.includes('## 10. Performance Techniques'), 'experience audit missing performance lens');
  assert.ok(experienceAudit.includes('## Non-Clone Boundary'), 'experience audit missing non-clone boundary');

  assert.ok(engineConceptAnalysis.includes('# Infinity Mirror Engine Concept Analysis'), 'engine concept analysis missing title');
  assert.ok(engineConceptAnalysis.includes('Source package: /Users/jesuscasares/Downloads/Infinity Mirror.v1 (Remix) (1).zip'), 'engine concept analysis missing source package');
  assert.ok(engineConceptAnalysis.includes('## What The Package Contains'), 'engine concept analysis missing package inventory');
  assert.ok(engineConceptAnalysis.includes('## Adopt Now'), 'engine concept analysis missing adopt now section');
  assert.ok(engineConceptAnalysis.includes('## Prototype Next'), 'engine concept analysis missing prototype next section');
  assert.ok(engineConceptAnalysis.includes('## Block Until Proof'), 'engine concept analysis missing block until proof section');
  assert.ok(engineConceptAnalysis.includes('Persistent Mirror Shell'), 'engine concept analysis missing shell decision');
  assert.ok(engineConceptAnalysis.includes('Just Talk Pressure Valve'), 'engine concept analysis missing just talk decision');
  assert.ok(engineConceptAnalysis.includes('Default Camera Reflection'), 'engine concept analysis missing camera boundary');
  assert.ok(engineConceptAnalysis.includes('Manual posting only. No public upload without approval.'), 'engine concept analysis missing social posting gate');

  assert.ok(runtimeCodeHandoff.includes('# Infinity Mirror Runtime Code Handoff'), 'runtime code handoff missing title');
  assert.ok(runtimeCodeHandoff.includes('/assets/specs/infinity-mirror-runtime-kit/README.md'), 'runtime code handoff missing source kit path');
  assert.ok(runtimeCodeHandoff.includes('npm install next react react-dom framer-motion gsap three tailwindcss @tailwindcss/postcss'), 'runtime code handoff missing migration install gate');
  assert.ok(runtimeCodeHandoff.includes('app/organisms/infinity-mirror/experience/page.tsx'), 'runtime code handoff missing React page file');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/AdaptiveMirrorEngine.tsx'), 'runtime code handoff missing adaptive mirror engine server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/InfiniteReflectionNavigator.tsx'), 'runtime code handoff missing reflection navigator server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/DesireTranslationWall.tsx'), 'runtime code handoff missing desire wall server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/MirrorRouteCompass.tsx'), 'runtime code handoff missing route compass server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/RecursiveBrainTunnel.tsx'), 'runtime code handoff missing recursive brain tunnel server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/BrainCellNetwork.tsx'), 'runtime code handoff missing brain cell network server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/BrainRouteConsole.tsx'), 'runtime code handoff missing brain route console server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/BrainSignalHandoff.client.tsx'), 'runtime code handoff missing brain signal handoff client leaf');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/LivingOrganismVisualizer.tsx'), 'runtime code handoff missing living organism visualizer server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/RecursiveGrowthTimeline.tsx'), 'runtime code handoff missing recursive growth timeline server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/CognitiveEvolutionTrace.tsx'), 'runtime code handoff missing cognitive evolution trace server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/FloatingArchitectureMaps.tsx'), 'runtime code handoff missing floating architecture maps server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/PhaseProofLedger.tsx'), 'runtime code handoff missing phase proof ledger server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/ProofCascade.tsx'), 'runtime code handoff missing proof cascade server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/MirrorStateSequencer.client.tsx'), 'runtime code handoff missing state sequencer client leaf');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/ProofObservatory.client.tsx'), 'runtime code handoff missing proof observatory client leaf');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/AuthorityGradient.tsx'), 'runtime code handoff missing authority gradient server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/ScrollChoreographyMap.tsx'), 'runtime code handoff missing scroll map server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/EmotionalProgressionRail.client.tsx'), 'runtime code handoff missing emotional progression client leaf');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/MotionContractLedger.tsx'), 'runtime code handoff missing motion contract ledger server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/ExperienceAuditConsole.tsx'), 'runtime code handoff missing experience audit server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/SourceTranslationLedger.tsx'), 'runtime code handoff missing source translation server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/EngineTranslationLedger.tsx'), 'runtime code handoff missing engine translation server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/InterfaceBuildLedger.tsx'), 'runtime code handoff missing interface build ledger server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/RuntimeHandoffMatrix.tsx'), 'runtime code handoff missing runtime handoff matrix server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/MirrorDepthGate.tsx'), 'runtime code handoff missing depth gate server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/InfinitySymbolLanguage.tsx'), 'runtime code handoff missing symbol language server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/SignalComposer.client.tsx'), 'runtime code handoff missing signal composer client leaf');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/MemoryConsentLedger.tsx'), 'runtime code handoff missing memory consent ledger server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/JoinEvolutionRoutes.tsx'), 'runtime code handoff missing join routes server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/FirstArtifactRouter.tsx'), 'runtime code handoff missing first artifact router server component');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/EvolutionEntryProtocol.tsx'), 'runtime code handoff missing evolution entry protocol server component');
  assert.ok(runtimeCodeHandoff.includes('<InfiniteReflectionNavigator anchors={mirrorStoryAnchors} lenses={reflectionNavigatorLenses} />'), 'runtime code handoff missing reflection navigator page integration');
  assert.ok(runtimeCodeHandoff.includes('<MirrorStateSequencer packets={mirrorStateSequencerPackets} />'), 'runtime code handoff missing state sequencer page integration');
  assert.ok(runtimeCodeHandoff.includes('<DesireTranslationWall routes={desireTranslationRoutes} />'), 'runtime code handoff missing desire wall page integration');
  assert.ok(runtimeCodeHandoff.includes('<MirrorRouteCompass entries={mirrorRouteCompassEntries} />'), 'runtime code handoff missing route compass page integration');
  assert.ok(runtimeCodeHandoff.includes('mirrorRouteCompassEntries'), 'runtime code handoff missing route compass content model');
  assert.ok(runtimeCodeHandoff.includes('<AdaptiveMirrorEngine lenses={adaptiveMirrorLenses} />'), 'runtime code handoff missing adaptive engine page integration');
  assert.ok(runtimeCodeHandoff.includes('<SignalComposer packets={signalComposerPackets} />'), 'runtime code handoff missing signal composer page integration');
  assert.ok(runtimeCodeHandoff.includes('<MemoryConsentLedger states={memoryConsentStates} />'), 'runtime code handoff missing memory consent page integration');
  assert.ok(runtimeCodeHandoff.includes('<RecursiveBrainTunnel steps={recursiveBrainTunnelSteps} />'), 'runtime code handoff missing recursive brain tunnel page integration');
  assert.ok(runtimeCodeHandoff.includes('<BrainCellNetwork cells={brainCellNetworkNodes} />'), 'runtime code handoff missing brain network page integration');
  assert.ok(runtimeCodeHandoff.includes('<BrainRouteConsole handoff={defaultBrainSignalHandoff} stages={brainRouteStages} />'), 'runtime code handoff missing brain route console page integration');
  assert.ok(runtimeCodeHandoff.includes('<BrainSignalHandoff packets={brainSignalHandoffPackets} stages={brainRouteStages} />'), 'runtime code handoff missing brain signal handoff page integration');
  assert.ok(runtimeCodeHandoff.includes('<LivingOrganismVisualizer organisms={livingOrganismNodes} />'), 'runtime code handoff missing organism visualizer page integration');
  assert.ok(runtimeCodeHandoff.includes('<RecursiveGrowthTimeline gates={recursiveGrowthGates} />'), 'runtime code handoff missing growth timeline page integration');
  assert.ok(runtimeCodeHandoff.includes('<CognitiveEvolutionTrace steps={cognitiveEvolutionTraceSteps} />'), 'runtime code handoff missing cognitive trace page integration');
  assert.ok(runtimeCodeHandoff.includes('<FloatingArchitectureMaps panes={architectureMapPanes} />'), 'runtime code handoff missing architecture maps page integration');
  assert.ok(runtimeCodeHandoff.includes('<PhaseProofLedger entries={phaseProofLedgerEntries} />'), 'runtime code handoff missing phase proof ledger page integration');
  assert.ok(runtimeCodeHandoff.includes('<ProofCascade steps={proofCascadeSteps} />'), 'runtime code handoff missing proof cascade page integration');
  assert.ok(runtimeCodeHandoff.includes('<ProofObservatory packets={mirrorProofObservatoryPackets} />'), 'runtime code handoff missing proof observatory page integration');
  assert.ok(runtimeCodeHandoff.includes('<AuthorityGradient rungs={authorityGradientRungs} />'), 'runtime code handoff missing authority gradient page integration');
  assert.ok(runtimeCodeHandoff.includes('<ScrollChoreographyMap acts={scrollChoreographyActs} />'), 'runtime code handoff missing scroll map page integration');
  assert.ok(runtimeCodeHandoff.includes('<EmotionalProgressionRail packets={mirrorEmotionalProgressionPackets} />'), 'runtime code handoff missing emotional progression page integration');
  assert.ok(runtimeCodeHandoff.includes('<MotionContractLedger contracts={motionContracts} />'), 'runtime code handoff missing motion contract ledger page integration');
  assert.ok(runtimeCodeHandoff.includes('<ExperienceAuditConsole lenses={experienceAuditLenses} />'), 'runtime code handoff missing experience audit page integration');
  assert.ok(runtimeCodeHandoff.includes('<SourceTranslationLedger entries={sourceTranslationLedgerEntries} />'), 'runtime code handoff missing source ledger page integration');
  assert.ok(runtimeCodeHandoff.includes('<EngineTranslationLedger entries={engineTranslationLedgerEntries} />'), 'runtime code handoff missing engine ledger page integration');
  assert.ok(runtimeCodeHandoff.includes('<InterfaceBuildLedger stages={interfaceBuildStages} />'), 'runtime code handoff missing build ledger page integration');
  assert.ok(runtimeCodeHandoff.includes('<RuntimeHandoffMatrix lanes={runtimeHandoffLanes} />'), 'runtime code handoff missing runtime matrix page integration');
  assert.ok(runtimeCodeHandoff.includes('<MirrorDepthGate lanes={mirrorDepthGateLanes} />'), 'runtime code handoff missing depth gate page integration');
  assert.ok(runtimeCodeHandoff.includes('<InfinitySymbolLanguage states={infinitySymbolStates} />'), 'runtime code handoff missing symbol language page integration');
  assert.ok(runtimeCodeHandoff.includes('<JoinEvolutionRoutes routes={joinRoutes} />'), 'runtime code handoff missing join routes page integration');
  assert.ok(runtimeCodeHandoff.includes('<FirstArtifactRouter routes={firstArtifactRoutes} />'), 'runtime code handoff missing first artifact router page integration');
  assert.ok(runtimeCodeHandoff.includes('firstArtifactRoutes'), 'runtime code handoff missing first artifact content model');
  assert.ok(runtimeCodeHandoff.includes('<EvolutionEntryProtocol steps={evolutionEntryProtocolSteps} />'), 'runtime code handoff missing evolution entry protocol page integration');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/MirrorChapterMotion.client.tsx'), 'runtime code handoff missing Framer leaf file');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/MirrorPortalTimeline.client.tsx'), 'runtime code handoff missing GSAP leaf file');
  assert.ok(runtimeCodeHandoff.includes('components/mirror/MirrorBrainTunnelGate.client.tsx'), 'runtime code handoff missing Three/WebGL leaf file');
  assert.ok(runtimeCodeHandoff.includes('tailwind.config.ts'), 'runtime code handoff missing Tailwind config');
  assert.ok(runtimeCodeHandoff.includes('lib/mirror/infinityMirrorAssets.ts'), 'runtime code handoff missing asset contract');
  assert.ok(runtimeCodeHandoff.includes("runtimeKit: '/assets/specs/infinity-mirror-runtime-kit/README.md'"), 'runtime code handoff missing runtime kit asset contract');
  assert.ok(runtimeCodeHandoff.includes('Deploy only after explicit approval.'), 'runtime code handoff missing deployment boundary');

  assert.ok(runtimeKitReadme.includes('# Infinity Mirror Runtime Kit'), 'runtime kit missing README title');
  assert.ok(runtimeKitReadme.includes('Boundary: do not install, import, deploy, or alias this kit until the React/Next migration is explicitly approved.'), 'runtime kit missing approval boundary');
  assert.ok(runtimeKitReadme.includes('components/mirror/AdaptiveMirrorEngine.tsx'), 'runtime kit README missing adaptive mirror engine file');
  assert.ok(runtimeKitReadme.includes('components/mirror/DesireTranslationWall.tsx'), 'runtime kit README missing desire wall file');
  assert.ok(runtimeKitReadme.includes('components/mirror/MirrorRouteCompass.tsx'), 'runtime kit README missing route compass file');
  assert.ok(runtimeKitReadme.includes('components/mirror/RecursiveBrainTunnel.tsx'), 'runtime kit README missing recursive brain tunnel file');
  assert.ok(runtimeKitReadme.includes('components/mirror/BrainCellNetwork.tsx'), 'runtime kit README missing brain network file');
  assert.ok(runtimeKitReadme.includes('components/mirror/BrainRouteConsole.tsx'), 'runtime kit README missing brain route console file');
  assert.ok(runtimeKitReadme.includes('components/mirror/BrainSignalHandoff.client.tsx'), 'runtime kit README missing brain signal handoff file');
  assert.ok(runtimeKitReadme.includes('components/mirror/LivingOrganismVisualizer.tsx'), 'runtime kit README missing organism visualizer file');
  assert.ok(runtimeKitReadme.includes('components/mirror/RecursiveGrowthTimeline.tsx'), 'runtime kit README missing recursive growth timeline file');
  assert.ok(runtimeKitReadme.includes('components/mirror/CognitiveEvolutionTrace.tsx'), 'runtime kit README missing cognitive evolution trace file');
  assert.ok(runtimeKitReadme.includes('components/mirror/FloatingArchitectureMaps.tsx'), 'runtime kit README missing floating architecture maps file');
  assert.ok(runtimeKitReadme.includes('components/mirror/InfiniteReflectionNavigator.tsx'), 'runtime kit README missing reflection navigator file');
  assert.ok(runtimeKitReadme.includes('components/mirror/MirrorStateSequencer.client.tsx'), 'runtime kit README missing state sequencer file');
  assert.ok(runtimeKitReadme.includes('components/mirror/PhaseProofLedger.tsx'), 'runtime kit README missing phase proof ledger file');
  assert.ok(runtimeKitReadme.includes('components/mirror/ProofCascade.tsx'), 'runtime kit README missing proof cascade file');
  assert.ok(runtimeKitReadme.includes('components/mirror/ProofObservatory.client.tsx'), 'runtime kit README missing proof observatory file');
  assert.ok(runtimeKitReadme.includes('components/mirror/AuthorityGradient.tsx'), 'runtime kit README missing authority gradient file');
  assert.ok(runtimeKitReadme.includes('components/mirror/ScrollChoreographyMap.tsx'), 'runtime kit README missing scroll map file');
  assert.ok(runtimeKitReadme.includes('components/mirror/EmotionalProgressionRail.client.tsx'), 'runtime kit README missing emotional progression file');
  assert.ok(runtimeKitReadme.includes('components/mirror/MotionContractLedger.tsx'), 'runtime kit README missing motion contract ledger file');
  assert.ok(runtimeKitReadme.includes('components/mirror/ExperienceAuditConsole.tsx'), 'runtime kit README missing experience audit console file');
  assert.ok(runtimeKitReadme.includes('components/mirror/SourceTranslationLedger.tsx'), 'runtime kit README missing source translation ledger file');
  assert.ok(runtimeKitReadme.includes('components/mirror/EngineTranslationLedger.tsx'), 'runtime kit README missing engine translation ledger file');
  assert.ok(runtimeKitReadme.includes('components/mirror/InterfaceBuildLedger.tsx'), 'runtime kit README missing interface build ledger file');
  assert.ok(runtimeKitReadme.includes('components/mirror/RuntimeHandoffMatrix.tsx'), 'runtime kit README missing runtime handoff matrix file');
  assert.ok(runtimeKitReadme.includes('components/mirror/MirrorDepthGate.tsx'), 'runtime kit README missing depth gate file');
  assert.ok(runtimeKitReadme.includes('components/mirror/InfinitySymbolLanguage.tsx'), 'runtime kit README missing symbol language file');
  assert.ok(runtimeKitReadme.includes('components/mirror/SignalComposer.client.tsx'), 'runtime kit README missing signal composer file');
  assert.ok(runtimeKitReadme.includes('components/mirror/MemoryConsentLedger.tsx'), 'runtime kit README missing memory consent file');
  assert.ok(runtimeKitReadme.includes('components/mirror/JoinEvolutionRoutes.tsx'), 'runtime kit README missing join routes file');
  assert.ok(runtimeKitReadme.includes('components/mirror/FirstArtifactRouter.tsx'), 'runtime kit README missing first artifact router file');
  assert.ok(runtimeKitReadme.includes('components/mirror/EvolutionEntryProtocol.tsx'), 'runtime kit README missing evolution entry protocol file');
  assert.ok(runtimeKitReadme.includes('components/mirror/MirrorBrainTunnelGate.client.tsx'), 'runtime kit README missing Three gate file');
  assert.ok(runtimeKitPage.includes('export const metadata: Metadata'), 'runtime kit page missing Next metadata');
  assert.ok(runtimeKitPage.includes('mirrorStructuredData'), 'runtime kit page missing structured data');
  assert.ok(runtimeKitPage.includes('<MirrorPortalTimeline />'), 'runtime kit page missing GSAP portal leaf');
  assert.ok(runtimeKitPage.includes('<InfiniteReflectionNavigator anchors={mirrorStoryAnchors} lenses={reflectionNavigatorLenses} />'), 'runtime kit page missing reflection navigator integration');
  assert.ok(runtimeKitPage.includes('<MirrorStateSequencer packets={mirrorStateSequencerPackets} />'), 'runtime kit page missing state sequencer integration');
  assert.ok(runtimeKitPage.includes('<DesireTranslationWall routes={desireTranslationRoutes} />'), 'runtime kit page missing desire wall integration');
  assert.ok(runtimeKitPage.includes('<MirrorRouteCompass entries={mirrorRouteCompassEntries} />'), 'runtime kit page missing route compass integration');
  assert.ok(runtimeKitPage.includes('mirrorRouteCompassEntries'), 'runtime kit page missing route compass content import');
  assert.ok(runtimeKitPage.includes('<AdaptiveMirrorEngine lenses={adaptiveMirrorLenses} />'), 'runtime kit page missing adaptive mirror engine integration');
  assert.ok(runtimeKitPage.includes('<SignalComposer packets={signalComposerPackets} />'), 'runtime kit page missing signal composer integration');
  assert.ok(runtimeKitPage.includes('<MemoryConsentLedger states={memoryConsentStates} />'), 'runtime kit page missing memory consent integration');
  assert.ok(runtimeKitPage.includes('<RecursiveBrainTunnel steps={recursiveBrainTunnelSteps} />'), 'runtime kit page missing recursive brain tunnel integration');
  assert.ok(runtimeKitPage.includes('<BrainCellNetwork cells={brainCellNetworkNodes} />'), 'runtime kit page missing brain network integration');
  assert.ok(runtimeKitPage.includes('<BrainRouteConsole handoff={defaultBrainSignalHandoff} stages={brainRouteStages} />'), 'runtime kit page missing brain route console integration');
  assert.ok(runtimeKitPage.includes('<BrainSignalHandoff packets={brainSignalHandoffPackets} stages={brainRouteStages} />'), 'runtime kit page missing brain signal handoff integration');
  assert.ok(runtimeKitPage.includes('<LivingOrganismVisualizer organisms={livingOrganismNodes} />'), 'runtime kit page missing organism visualizer integration');
  assert.ok(runtimeKitPage.includes('<RecursiveGrowthTimeline gates={recursiveGrowthGates} />'), 'runtime kit page missing recursive growth timeline integration');
  assert.ok(runtimeKitPage.includes('<CognitiveEvolutionTrace steps={cognitiveEvolutionTraceSteps} />'), 'runtime kit page missing cognitive evolution trace integration');
  assert.ok(runtimeKitPage.includes('<FloatingArchitectureMaps panes={architectureMapPanes} />'), 'runtime kit page missing floating architecture maps integration');
  assert.ok(runtimeKitPage.includes('<PhaseProofLedger entries={phaseProofLedgerEntries} />'), 'runtime kit page missing phase proof ledger integration');
  assert.ok(runtimeKitPage.includes('<ProofCascade steps={proofCascadeSteps} />'), 'runtime kit page missing proof cascade integration');
  assert.ok(runtimeKitPage.includes('<ProofObservatory packets={mirrorProofObservatoryPackets} />'), 'runtime kit page missing proof observatory integration');
  assert.ok(runtimeKitPage.includes('<AuthorityGradient rungs={authorityGradientRungs} />'), 'runtime kit page missing authority gradient integration');
  assert.ok(runtimeKitPage.includes('<ScrollChoreographyMap acts={scrollChoreographyActs} />'), 'runtime kit page missing scroll map integration');
  assert.ok(runtimeKitPage.includes('<EmotionalProgressionRail packets={mirrorEmotionalProgressionPackets} />'), 'runtime kit page missing emotional progression integration');
  assert.ok(runtimeKitPage.includes('<MotionContractLedger contracts={motionContracts} />'), 'runtime kit page missing motion contract ledger integration');
  assert.ok(runtimeKitPage.includes('<ExperienceAuditConsole lenses={experienceAuditLenses} />'), 'runtime kit page missing experience audit integration');
  assert.ok(runtimeKitPage.includes('<SourceTranslationLedger entries={sourceTranslationLedgerEntries} />'), 'runtime kit page missing source ledger integration');
  assert.ok(runtimeKitPage.includes('<EngineTranslationLedger entries={engineTranslationLedgerEntries} />'), 'runtime kit page missing engine ledger integration');
  assert.ok(runtimeKitPage.includes('<InterfaceBuildLedger stages={interfaceBuildStages} />'), 'runtime kit page missing build ledger integration');
  assert.ok(runtimeKitPage.includes('<RuntimeHandoffMatrix lanes={runtimeHandoffLanes} />'), 'runtime kit page missing runtime matrix integration');
  assert.ok(runtimeKitPage.includes('<MirrorDepthGate lanes={mirrorDepthGateLanes} />'), 'runtime kit page missing depth gate integration');
  assert.ok(runtimeKitPage.includes('<InfinitySymbolLanguage states={infinitySymbolStates} />'), 'runtime kit page missing symbol language integration');
  assert.ok(runtimeKitPage.includes('<JoinEvolutionRoutes routes={joinRoutes} />'), 'runtime kit page missing join routes integration');
  assert.ok(runtimeKitPage.includes('<FirstArtifactRouter routes={firstArtifactRoutes} />'), 'runtime kit page missing first artifact router integration');
  assert.ok(runtimeKitPage.includes('firstArtifactRoutes'), 'runtime kit page missing first artifact content import');
  assert.ok(runtimeKitPage.includes('<EvolutionEntryProtocol steps={evolutionEntryProtocolSteps} />'), 'runtime kit page missing evolution entry protocol integration');
  assert.ok(runtimeKitPage.includes('<MirrorBrainTunnelGate fallbackId="mirror-brain-title" />'), 'runtime kit page missing Three gate leaf');
  assert.equal(runtimeKitAdaptiveEngine.includes("'use client';"), false, 'adaptive mirror engine source kit component should stay server-rendered');
  assert.ok(runtimeKitAdaptiveEngine.includes('id="mirror-adaptive-engine"'), 'adaptive mirror engine source kit component should expose canonical anchor');
  assert.ok(runtimeKitAdaptiveEngine.includes('data-runtime-owner="bounded-adaptive-lens-relay"'), 'adaptive mirror engine source kit component should expose bounded runtime owner');
  assert.ok(runtimeKitAdaptiveEngine.includes('lens.capture'), 'adaptive mirror engine source kit component should render capture field');
  assert.ok(runtimeKitAdaptiveEngine.includes('lens.translate'), 'adaptive mirror engine source kit component should render translate field');
  assert.ok(runtimeKitAdaptiveEngine.includes('lens.keep'), 'adaptive mirror engine source kit component should render keep field');
  assert.ok(runtimeKitAdaptiveEngine.includes('lens.boundary'), 'adaptive mirror engine source kit component should render boundary field');
  assert.equal(runtimeKitDesireWall.includes("'use client';"), false, 'desire wall source kit component should stay server-rendered');
  assert.ok(runtimeKitDesireWall.includes('id="mirror-desire-translation"'), 'desire wall source kit component should expose canonical anchor');
  assert.ok(runtimeKitDesireWall.includes('route.organismRoute'), 'desire wall source kit component should render organism routes');
  assert.ok(runtimeKitDesireWall.includes('route.proofGate'), 'desire wall source kit component should render proof gates');
  assert.ok(runtimeKitDesireWall.includes('route.authorityStop'), 'desire wall source kit component should render authority stops');
  assert.equal(runtimeKitBrainNetwork.includes("'use client';"), false, 'brain network source kit component should stay server-rendered');
  assert.ok(runtimeKitBrainNetwork.includes('id="mirror-brain-cell-network"'), 'brain network source kit component should expose canonical anchor');
  assert.ok(runtimeKitBrainNetwork.includes('cell.signal'), 'brain network source kit component should render signal field');
  assert.ok(runtimeKitBrainNetwork.includes('cell.path'), 'brain network source kit component should render path field');
  assert.ok(runtimeKitBrainNetwork.includes('cell.proof'), 'brain network source kit component should render proof field');
  assert.ok(runtimeKitBrainNetwork.includes('cell.authorityStop'), 'brain network source kit component should render authority stop field');
  assert.equal(runtimeKitOrganismVisualizer.includes("'use client';"), false, 'organism visualizer source kit component should stay server-rendered');
  assert.ok(runtimeKitOrganismVisualizer.includes('id="mirror-living-organism-visualizer"'), 'organism visualizer source kit component should expose canonical anchor');
  assert.ok(runtimeKitOrganismVisualizer.includes('organism.href'), 'organism visualizer source kit component should render route links');
  assert.ok(runtimeKitOrganismVisualizer.includes('organism.signal'), 'organism visualizer source kit component should render signal field');
  assert.ok(runtimeKitOrganismVisualizer.includes('organism.memory'), 'organism visualizer source kit component should render memory field');
  assert.ok(runtimeKitOrganismVisualizer.includes('organism.authority'), 'organism visualizer source kit component should render authority field');
  assert.ok(runtimeKitOrganismVisualizer.includes('organism.proof'), 'organism visualizer source kit component should render proof field');
  assert.equal(runtimeKitGrowthTimeline.includes("'use client';"), false, 'recursive growth timeline source kit component should stay server-rendered');
  assert.ok(runtimeKitGrowthTimeline.includes('id="mirror-recursive-growth-timeline"'), 'recursive growth timeline source kit component should expose canonical anchor');
  assert.ok(runtimeKitGrowthTimeline.includes('gate.signal'), 'recursive growth timeline source kit component should render signal field');
  assert.ok(runtimeKitGrowthTimeline.includes('gate.verification'), 'recursive growth timeline source kit component should render verification field');
  assert.ok(runtimeKitGrowthTimeline.includes('gate.authorityStop'), 'recursive growth timeline source kit component should render authority stop field');
  assert.equal(runtimeKitCognitiveTrace.includes("'use client';"), false, 'cognitive evolution trace source kit component should stay server-rendered');
  assert.ok(runtimeKitCognitiveTrace.includes('id="mirror-cognitive-evolution-trace"'), 'cognitive evolution trace source kit component should expose canonical anchor');
  assert.ok(runtimeKitCognitiveTrace.includes('step.evolves'), 'cognitive evolution trace source kit component should render evolves field');
  assert.ok(runtimeKitCognitiveTrace.includes('step.proofLock'), 'cognitive evolution trace source kit component should render proof lock field');
  assert.equal(runtimeKitArchitectureMaps.includes("'use client';"), false, 'floating architecture maps source kit component should stay server-rendered');
  assert.ok(runtimeKitArchitectureMaps.includes('id="mirror-floating-architecture-maps"'), 'floating architecture maps source kit component should expose canonical anchor');
  assert.ok(runtimeKitArchitectureMaps.includes('pane.route'), 'floating architecture maps source kit component should render route field');
  assert.ok(runtimeKitArchitectureMaps.includes('pane.proves'), 'floating architecture maps source kit component should render proof field');
  assert.ok(runtimeKitArchitectureMaps.includes('pane.boundary'), 'floating architecture maps source kit component should render boundary field');
  assert.equal(runtimeKitPhaseLedger.includes("'use client';"), false, 'phase proof ledger source kit component should stay server-rendered');
  assert.ok(runtimeKitPhaseLedger.includes('id="mirror-phase-proof-ledger"'), 'phase proof ledger source kit component should expose canonical anchor');
  assert.ok(runtimeKitPhaseLedger.includes('entry.evidence'), 'phase proof ledger source kit component should render evidence field');
  assert.ok(runtimeKitPhaseLedger.includes('entry.surfaceHref'), 'phase proof ledger source kit component should render surface href');
  assert.ok(runtimeKitPhaseLedger.includes('entry.surfaceLabel'), 'phase proof ledger source kit component should render surface label');
  assert.ok(runtimeKitPhaseLedger.includes('entry.boundary'), 'phase proof ledger source kit component should render boundary field');
  assert.equal(runtimeKitReflectionNavigator.includes("'use client';"), false, 'reflection navigator source kit component should stay server-rendered');
  assert.ok(runtimeKitReflectionNavigator.includes('id="mirror-reflection-navigation"'), 'reflection navigator source kit component should expose canonical anchor');
  assert.ok(runtimeKitReflectionNavigator.includes('anchor.href'), 'reflection navigator source kit component should render anchor hrefs');
  assert.ok(runtimeKitReflectionNavigator.includes('anchor.focus'), 'reflection navigator source kit component should render anchor focus');
  assert.ok(runtimeKitReflectionNavigator.includes('lens.route'), 'reflection navigator source kit component should render lens route');
  assert.ok(runtimeKitReflectionNavigator.includes('lens.proof'), 'reflection navigator source kit component should render lens proof');
  assert.ok(runtimeKitReflectionNavigator.includes('lens.boundary'), 'reflection navigator source kit component should render lens boundary');
  assert.ok(runtimeKitStateSequencer.includes("'use client';"), 'state sequencer source kit leaf should be client-only');
  assert.ok(runtimeKitStateSequencer.includes('useState'), 'state sequencer source kit leaf should own local state');
  assert.ok(runtimeKitStateSequencer.includes('useMemo'), 'state sequencer source kit leaf should memoize selected packet');
  assert.ok(runtimeKitStateSequencer.includes('id="mirror-state-sequencer"'), 'state sequencer source kit leaf should expose canonical anchor');
  assert.ok(runtimeKitStateSequencer.includes('data-runtime-owner="bounded-state-sequencer"'), 'state sequencer source kit leaf should expose bounded runtime owner');
  assert.ok(runtimeKitStateSequencer.includes('activePacket.signal'), 'state sequencer source kit leaf should render signal');
  assert.ok(runtimeKitStateSequencer.includes('activePacket.response'), 'state sequencer source kit leaf should render organism response');
  assert.ok(runtimeKitStateSequencer.includes('activePacket.proof'), 'state sequencer source kit leaf should render proof return');
  assert.ok(runtimeKitStateSequencer.includes('activePacket.boundary'), 'state sequencer source kit leaf should render boundary lock');
  assert.ok(runtimeKitStateSequencer.includes('activePacket.href'), 'state sequencer source kit leaf should render next route href');
  assert.ok(runtimeKitStateSequencer.includes('activePacket.linkLabel'), 'state sequencer source kit leaf should render link label');
  assert.ok(runtimeKitStateSequencer.includes('aria-pressed'), 'state sequencer source kit leaf should expose active button state');
  assert.ok(runtimeKitStateSequencer.includes('aria-live="polite"'), 'state sequencer source kit leaf should expose live state packet');
  assert.ok(runtimeKitStateSequencer.includes('cannot store memory'), 'state sequencer source kit leaf should declare storage boundary');
  assert.ok(runtimeKitStateSequencer.includes('grant autonomy'), 'state sequencer source kit leaf should declare autonomy boundary');
  assert.equal(runtimeKitProofCascade.includes("'use client';"), false, 'proof cascade source kit component should stay server-rendered');
  assert.ok(runtimeKitProofCascade.includes('id="mirror-proof-cascade"'), 'proof cascade source kit component should expose canonical anchor');
  assert.ok(runtimeKitProofCascade.includes('step.claim'), 'proof cascade source kit component should render claim field');
  assert.ok(runtimeKitProofCascade.includes('step.evidence'), 'proof cascade source kit component should render evidence field');
  assert.ok(runtimeKitProofCascade.includes('step.artifact'), 'proof cascade source kit component should render artifact field');
  assert.ok(runtimeKitProofCascade.includes('step.boundary'), 'proof cascade source kit component should render boundary field');
  assert.ok(runtimeKitProofObservatory.includes("'use client';"), 'proof observatory source kit leaf should be client-only');
  assert.ok(runtimeKitProofObservatory.includes('useState'), 'proof observatory source kit leaf should own local state');
  assert.ok(runtimeKitProofObservatory.includes('useMemo'), 'proof observatory source kit leaf should memoize selected packet');
  assert.ok(runtimeKitProofObservatory.includes('id="mirror-proof-observatory"'), 'proof observatory source kit leaf should expose canonical anchor');
  assert.ok(runtimeKitProofObservatory.includes('data-runtime-owner="bounded-proof-observatory"'), 'proof observatory source kit leaf should expose bounded runtime owner');
  assert.ok(runtimeKitProofObservatory.includes('activePacket.evidence'), 'proof observatory source kit leaf should render evidence');
  assert.ok(runtimeKitProofObservatory.includes('activePacket.signal'), 'proof observatory source kit leaf should render signal');
  assert.ok(runtimeKitProofObservatory.includes('activePacket.boundary'), 'proof observatory source kit leaf should render boundary');
  assert.ok(runtimeKitProofObservatory.includes('activePacket.href'), 'proof observatory source kit leaf should render next artifact href');
  assert.ok(runtimeKitProofObservatory.includes('activePacket.linkLabel'), 'proof observatory source kit leaf should render link label');
  assert.ok(runtimeKitProofObservatory.includes('aria-pressed'), 'proof observatory source kit leaf should expose active tab state');
  assert.ok(runtimeKitProofObservatory.includes('aria-live="polite"'), 'proof observatory source kit leaf should expose live proof packet');
  assert.ok(runtimeKitProofObservatory.includes('live telemetry'), 'proof observatory source kit leaf should declare telemetry boundary');
  assert.ok(runtimeKitProofObservatory.includes('change production status'), 'proof observatory source kit leaf should declare status-change boundary');
  assert.equal(runtimeKitAuthorityGradient.includes("'use client';"), false, 'authority gradient source kit component should stay server-rendered');
  assert.ok(runtimeKitAuthorityGradient.includes('id="mirror-authority-gradient"'), 'authority gradient source kit component should expose canonical anchor');
  assert.ok(runtimeKitAuthorityGradient.includes('rung.canDo'), 'authority gradient source kit component should render allowed action field');
  assert.ok(runtimeKitAuthorityGradient.includes('rung.proofRequired'), 'authority gradient source kit component should render proof required field');
  assert.ok(runtimeKitAuthorityGradient.includes('No rung grants hidden memory'), 'authority gradient source kit component should declare boundary note');
  assert.equal(runtimeKitScrollMap.includes("'use client';"), false, 'scroll map source kit component should stay server-rendered');
  assert.ok(runtimeKitScrollMap.includes('id="mirror-scroll-choreography"'), 'scroll map source kit component should expose canonical anchor');
  assert.ok(runtimeKitScrollMap.includes('act.focus'), 'scroll map source kit component should render focus field');
  assert.ok(runtimeKitScrollMap.includes('act.motion'), 'scroll map source kit component should render motion field');
  assert.ok(runtimeKitScrollMap.includes('act.proofReturn'), 'scroll map source kit component should render proof return field');
  assert.ok(runtimeKitEmotionRail.includes("'use client';"), 'emotional progression source kit leaf should be client-only');
  assert.ok(runtimeKitEmotionRail.includes('useState'), 'emotional progression source kit leaf should own local state');
  assert.ok(runtimeKitEmotionRail.includes('useMemo'), 'emotional progression source kit leaf should memoize selected packet');
  assert.ok(runtimeKitEmotionRail.includes('id="mirror-emotional-progression"'), 'emotional progression source kit leaf should expose canonical anchor');
  assert.ok(runtimeKitEmotionRail.includes('data-runtime-owner="bounded-emotional-progress"'), 'emotional progression source kit leaf should expose bounded runtime owner');
  assert.ok(runtimeKitEmotionRail.includes('activePacket.feeling'), 'emotional progression source kit leaf should render selected feeling');
  assert.ok(runtimeKitEmotionRail.includes('activePacket.organism'), 'emotional progression source kit leaf should render organism route');
  assert.ok(runtimeKitEmotionRail.includes('activePacket.proof'), 'emotional progression source kit leaf should render proof return');
  assert.ok(runtimeKitEmotionRail.includes('activePacket.boundary'), 'emotional progression source kit leaf should render authority boundary');
  assert.ok(runtimeKitEmotionRail.includes('aria-pressed'), 'emotional progression source kit leaf should expose active button state');
  assert.ok(runtimeKitEmotionRail.includes('aria-live="polite"'), 'emotional progression source kit leaf should expose live proof packet');
  assert.ok(runtimeKitEmotionRail.includes('cannot profile emotion'), 'emotional progression source kit leaf should declare profiling boundary');
  assert.ok(runtimeKitEmotionRail.includes('execute code'), 'emotional progression source kit leaf should declare execution boundary');
  assert.equal(runtimeKitMotionLedger.includes("'use client';"), false, 'motion contract ledger source kit component should stay server-rendered');
  assert.ok(runtimeKitMotionLedger.includes('id="mirror-motion-contract"'), 'motion contract ledger source kit component should expose canonical anchor');
  assert.ok(runtimeKitMotionLedger.includes('contract.trigger'), 'motion contract ledger source kit component should render trigger field');
  assert.ok(runtimeKitMotionLedger.includes('contract.animation'), 'motion contract ledger source kit component should render animation field');
  assert.ok(runtimeKitMotionLedger.includes('contract.timing'), 'motion contract ledger source kit component should render timing field');
  assert.ok(runtimeKitMotionLedger.includes('contract.duration'), 'motion contract ledger source kit component should render duration field');
  assert.ok(runtimeKitMotionLedger.includes('contract.easing'), 'motion contract ledger source kit component should render easing field');
  assert.ok(runtimeKitMotionLedger.includes('contract.performance'), 'motion contract ledger source kit component should render performance field');
  assert.equal(runtimeKitExperienceAudit.includes("'use client';"), false, 'experience audit source kit component should stay server-rendered');
  assert.ok(runtimeKitExperienceAudit.includes('id="mirror-experience-audit"'), 'experience audit source kit component should expose canonical anchor');
  assert.ok(runtimeKitExperienceAudit.includes('lens.purpose'), 'experience audit source kit component should render purpose field');
  assert.ok(runtimeKitExperienceAudit.includes('lens.works'), 'experience audit source kit component should render why-it-works field');
  assert.ok(runtimeKitExperienceAudit.includes('lens.reinterpret'), 'experience audit source kit component should render reinterpretation field');
  assert.equal(runtimeKitSourceLedger.includes("'use client';"), false, 'source ledger source kit component should stay server-rendered');
  assert.ok(runtimeKitSourceLedger.includes('id="mirror-source-ledger"'), 'source ledger source kit component should expose canonical anchor');
  assert.ok(runtimeKitSourceLedger.includes('entry.sourcePattern'), 'source ledger source kit component should render source pattern field');
  assert.ok(runtimeKitSourceLedger.includes('entry.unwindTranslation'), 'source ledger source kit component should render Unwind translation field');
  assert.ok(runtimeKitSourceLedger.includes('entry.boundary'), 'source ledger source kit component should render boundary field');
  assert.equal(runtimeKitEngineLedger.includes("'use client';"), false, 'engine ledger source kit component should stay server-rendered');
  assert.ok(runtimeKitEngineLedger.includes('id="mirror-engine-translation"'), 'engine ledger source kit component should expose canonical anchor');
  assert.ok(runtimeKitEngineLedger.includes('entry.concept'), 'engine ledger source kit component should render concept field');
  assert.ok(runtimeKitEngineLedger.includes('entry.decision'), 'engine ledger source kit component should render decision field');
  assert.ok(runtimeKitEngineLedger.includes('entry.translation'), 'engine ledger source kit component should render translation field');
  assert.ok(runtimeKitEngineLedger.includes('entry.guard'), 'engine ledger source kit component should render guard field');
  assert.equal(runtimeKitBuildLedger.includes("'use client';"), false, 'interface build ledger source kit component should stay server-rendered');
  assert.ok(runtimeKitBuildLedger.includes('id="mirror-build-ledger"'), 'interface build ledger source kit component should expose canonical anchor');
  assert.ok(runtimeKitBuildLedger.includes('stage.description'), 'interface build ledger source kit component should render description field');
  assert.ok(runtimeKitBuildLedger.includes('stage.artifact'), 'interface build ledger source kit component should render artifact field');
  assert.ok(runtimeKitBuildLedger.includes('stage.boundary'), 'interface build ledger source kit component should render boundary field');
  assert.equal(runtimeKitHandoffMatrix.includes("'use client';"), false, 'runtime handoff matrix source kit component should stay server-rendered');
  assert.ok(runtimeKitHandoffMatrix.includes('id="mirror-runtime-handoff"'), 'runtime handoff matrix source kit component should expose canonical anchor');
  assert.ok(runtimeKitHandoffMatrix.includes('lane.owner'), 'runtime handoff matrix source kit component should render owner field');
  assert.ok(runtimeKitHandoffMatrix.includes('lane.job'), 'runtime handoff matrix source kit component should render job field');
  assert.ok(runtimeKitHandoffMatrix.includes('lane.fallback'), 'runtime handoff matrix source kit component should render fallback field');
  assert.ok(runtimeKitHandoffMatrix.includes('lane.stopCondition'), 'runtime handoff matrix source kit component should render stop condition field');
  assert.equal(runtimeKitDepthGate.includes("'use client';"), false, 'depth gate source kit component should stay server-rendered');
  assert.ok(runtimeKitDepthGate.includes('id="mirror-depth-gate"'), 'depth gate source kit component should expose canonical anchor');
  assert.ok(runtimeKitDepthGate.includes('lane.trigger'), 'depth gate source kit component should render trigger field');
  assert.ok(runtimeKitDepthGate.includes('lane.allowed'), 'depth gate source kit component should render allowed field');
  assert.ok(runtimeKitDepthGate.includes('lane.proofNeeded'), 'depth gate source kit component should render proof-needed field');
  assert.ok(runtimeKitDepthGate.includes('lane.fallback'), 'depth gate source kit component should render fallback field');
  assert.ok(runtimeKitDepthGate.includes('lane.killSwitch'), 'depth gate source kit component should render kill switch field');
  assert.equal(runtimeKitSymbolLanguage.includes("'use client';"), false, 'symbol language source kit component should stay server-rendered');
  assert.ok(runtimeKitSymbolLanguage.includes('id="mirror-infinity-language"'), 'symbol language source kit component should expose canonical anchor');
  assert.ok(runtimeKitSymbolLanguage.includes('state.index'), 'symbol language source kit component should render state index');
  assert.ok(runtimeKitSymbolLanguage.includes('state.title'), 'symbol language source kit component should render state title');
  assert.ok(runtimeKitSymbolLanguage.includes('state.description'), 'symbol language source kit component should render state description');
  assert.equal(runtimeKitFirstArtifact.includes("'use client';"), false, 'first artifact router source kit component should stay server-rendered');
  assert.ok(runtimeKitFirstArtifact.includes('id="mirror-first-artifact-router"'), 'first artifact router source kit component should expose canonical anchor');
  assert.ok(runtimeKitFirstArtifact.includes('data-runtime-owner="semantic-first-artifact-router"'), 'first artifact router source kit component should expose semantic runtime owner');
  assert.ok(runtimeKitFirstArtifact.includes('route.bring'), 'first artifact router source kit component should render bring field');
  assert.ok(runtimeKitFirstArtifact.includes('route.firstArtifact'), 'first artifact router source kit component should render first artifact field');
  assert.ok(runtimeKitFirstArtifact.includes('route.proofRoute'), 'first artifact router source kit component should render proof route field');
  assert.ok(runtimeKitFirstArtifact.includes('route.approvalBoundary'), 'first artifact router source kit component should render approval boundary field');
  assert.ok(runtimeKitFirstArtifact.includes('The router does not submit data'), 'first artifact router source kit component should declare no-submit boundary');
  assert.ok(runtimeKitSignalComposer.includes("'use client';"), 'signal composer source kit leaf should be client-only');
  assert.ok(runtimeKitSignalComposer.includes('useState'), 'signal composer source kit leaf should own local state');
  assert.ok(runtimeKitSignalComposer.includes('id="mirror-signal-composer"'), 'signal composer source kit leaf should expose canonical anchor');
  assert.ok(runtimeKitSignalComposer.includes('data-runtime-owner="bounded-signal-composer"'), 'signal composer source kit leaf should expose bounded runtime owner');
  assert.ok(runtimeKitSignalComposer.includes('activePacket.signal'), 'signal composer source kit leaf should render selected signal');
  assert.ok(runtimeKitSignalComposer.includes('activePacket.lens'), 'signal composer source kit leaf should render selected lens');
  assert.ok(runtimeKitSignalComposer.includes('activePacket.artifact'), 'signal composer source kit leaf should render artifact promise');
  assert.ok(runtimeKitSignalComposer.includes('activePacket.boundary'), 'signal composer source kit leaf should render boundary');
  assert.ok(runtimeKitSignalComposer.includes('activePacket.proofPath'), 'signal composer source kit leaf should render proof path');
  assert.ok(runtimeKitSignalComposer.includes('activePacket.brainCells'), 'signal composer source kit leaf should render brain cells');
  assert.ok(runtimeKitSignalComposer.includes('activePacket.authorityLock'), 'signal composer source kit leaf should render authority lock');
  assert.equal(runtimeKitMemoryConsent.includes("'use client';"), false, 'memory consent source kit component should stay server-rendered');
  assert.ok(runtimeKitMemoryConsent.includes('id="mirror-memory-consent"'), 'memory consent source kit component should expose canonical anchor');
  assert.ok(runtimeKitMemoryConsent.includes('data-runtime-owner="semantic-memory-consent-ledger"'), 'memory consent source kit component should expose semantic runtime owner');
  assert.ok(runtimeKitMemoryConsent.includes('state.canHold'), 'memory consent source kit component should render can-hold field');
  assert.ok(runtimeKitMemoryConsent.includes('state.proofRequired'), 'memory consent source kit component should render proof-required field');
  assert.ok(runtimeKitMemoryConsent.includes('state.humanControl'), 'memory consent source kit component should render human-control field');
  assert.ok(runtimeKitMemoryConsent.includes('Memory consent does not grant diagnosis'), 'memory consent source kit component should declare boundary note');
  assert.equal(runtimeKitRouteCompass.includes("'use client';"), false, 'route compass source kit component should stay server-rendered');
  assert.ok(runtimeKitRouteCompass.includes('id="mirror-route-compass"'), 'route compass source kit component should expose canonical anchor');
  assert.ok(runtimeKitRouteCompass.includes('data-runtime-owner="semantic-route-compass"'), 'route compass source kit component should expose semantic runtime owner');
  assert.ok(runtimeKitRouteCompass.includes('entry.chapter'), 'route compass source kit component should render chapter field');
  assert.ok(runtimeKitRouteCompass.includes('entry.proofReturn'), 'route compass source kit component should render proof return field');
  assert.ok(runtimeKitRouteCompass.includes('entry.authorityStop'), 'route compass source kit component should render authority stop field');
  assert.ok(runtimeKitRouteCompass.includes('entry.href'), 'route compass source kit component should render href field');
  assert.ok(runtimeKitRouteCompass.includes('The compass is a semantic routing map'), 'route compass source kit component should declare boundary note');
  assert.equal(runtimeKitRecursiveBrainTunnel.includes("'use client';"), false, 'recursive brain tunnel source kit component should stay server-rendered');
  assert.ok(runtimeKitRecursiveBrainTunnel.includes('id="mirror-recursive-brain-tunnel"'), 'recursive brain tunnel source kit component should expose canonical anchor');
  assert.ok(runtimeKitRecursiveBrainTunnel.includes('data-runtime-owner="semantic-brain-tunnel"'), 'recursive brain tunnel source kit component should expose semantic runtime owner');
  assert.ok(runtimeKitRecursiveBrainTunnel.includes('step.cell'), 'recursive brain tunnel source kit component should render cell field');
  assert.ok(runtimeKitRecursiveBrainTunnel.includes('step.title'), 'recursive brain tunnel source kit component should render title field');
  assert.ok(runtimeKitRecursiveBrainTunnel.includes('step.description'), 'recursive brain tunnel source kit component should render description field');
  assert.equal(runtimeKitBrainRouteConsole.includes("'use client';"), false, 'brain route console source kit component should stay server-rendered');
  assert.ok(runtimeKitBrainRouteConsole.includes('id="mirror-brain-route-console"'), 'brain route console source kit component should expose canonical anchor');
  assert.ok(runtimeKitBrainRouteConsole.includes('data-runtime-owner="bounded-brain-route"'), 'brain route console source kit component should expose bounded runtime owner');
  assert.ok(runtimeKitBrainRouteConsole.includes('handoff.signal'), 'brain route console source kit component should render signal handoff');
  assert.ok(runtimeKitBrainRouteConsole.includes('handoff.cells'), 'brain route console source kit component should render cells handoff');
  assert.ok(runtimeKitBrainRouteConsole.includes('handoff.authority'), 'brain route console source kit component should render authority handoff');
  assert.ok(runtimeKitBrainRouteConsole.includes('handoff.proof'), 'brain route console source kit component should render proof handoff');
  assert.ok(runtimeKitBrainRouteConsole.includes('handoff[stage.id]'), 'brain route console source kit component should render route-stage copy from packet');
  assert.ok(runtimeKitBrainRouteConsole.includes('data-brain-route-copy={stage.id}'), 'brain route console source kit component should expose route-copy metadata');
  assert.ok(runtimeKitBrainRouteConsole.includes('data-brain-state-copy={stage.id}'), 'brain route console source kit component should expose state-copy metadata');
  assert.ok(runtimeKitBrainSignalHandoff.includes("'use client';"), 'brain signal handoff source kit leaf should be client-only');
  assert.ok(runtimeKitBrainSignalHandoff.includes('useState'), 'brain signal handoff source kit leaf should own local state');
  assert.ok(runtimeKitBrainSignalHandoff.includes('useMemo'), 'brain signal handoff source kit leaf should memoize selected packet');
  assert.ok(runtimeKitBrainSignalHandoff.includes('id="mirror-brain-signal-handoff"'), 'brain signal handoff source kit leaf should expose canonical anchor');
  assert.ok(runtimeKitBrainSignalHandoff.includes('data-runtime-owner="bounded-brain-signal-handoff"'), 'brain signal handoff source kit leaf should expose bounded runtime owner');
  assert.ok(runtimeKitBrainSignalHandoff.includes('activePacket.signal'), 'brain signal handoff source kit leaf should render selected signal');
  assert.ok(runtimeKitBrainSignalHandoff.includes('activePacket.cells'), 'brain signal handoff source kit leaf should render selected cells');
  assert.ok(runtimeKitBrainSignalHandoff.includes('activePacket.authority'), 'brain signal handoff source kit leaf should render selected authority lock');
  assert.ok(runtimeKitBrainSignalHandoff.includes('activePacket.proof'), 'brain signal handoff source kit leaf should render selected proof return');
  assert.ok(runtimeKitBrainSignalHandoff.includes('activePacket[stage.id]'), 'brain signal handoff source kit leaf should render selected route-stage copy');
  assert.ok(runtimeKitBrainSignalHandoff.includes('aria-pressed'), 'brain signal handoff source kit leaf should expose active tab state');
  assert.ok(runtimeKitBrainSignalHandoff.includes('stores nothing'), 'brain signal handoff source kit leaf should declare storage boundary');
  assert.ok(runtimeKitBrainSignalHandoff.includes('runs no code'), 'brain signal handoff source kit leaf should declare execution boundary');
  assert.equal(runtimeKitJoinRoutes.includes("'use client';"), false, 'join routes source kit component should stay server-rendered');
  assert.ok(runtimeKitJoinRoutes.includes('id="mirror-join-evolution-routes"'), 'join routes source kit component should expose canonical anchor');
  assert.ok(runtimeKitJoinRoutes.includes('route.role'), 'join routes source kit component should render role field');
  assert.ok(runtimeKitJoinRoutes.includes('route.next'), 'join routes source kit component should render next action field');
  assert.ok(runtimeKitJoinRoutes.includes('route.proof'), 'join routes source kit component should render proof field');
  assert.ok(runtimeKitJoinRoutes.includes('route.boundary'), 'join routes source kit component should render boundary field');
  assert.ok(runtimeKitJoinRoutes.includes('route.href'), 'join routes source kit component should render link href');
  assert.equal(runtimeKitEntryProtocol.includes("'use client';"), false, 'evolution entry protocol source kit component should stay server-rendered');
  assert.ok(runtimeKitEntryProtocol.includes('id="mirror-evolution-entry-protocol"'), 'evolution entry protocol source kit component should expose canonical anchor');
  assert.ok(runtimeKitEntryProtocol.includes('Joining is a proof loop, not a form.'), 'evolution entry protocol source kit component should render title');
  assert.ok(runtimeKitEntryProtocol.includes('step.input'), 'evolution entry protocol source kit component should render input field');
  assert.ok(runtimeKitEntryProtocol.includes('step.proofOutput'), 'evolution entry protocol source kit component should render proof output field');
  assert.ok(runtimeKitFramer.includes("'use client';"), 'Framer source kit leaf should be client-only');
  assert.ok(runtimeKitFramer.includes('useReducedMotion'), 'Framer source kit leaf should respect reduced motion');
  assert.ok(runtimeKitFramer.includes('whileInView="show"'), 'Framer source kit leaf should use viewport reveal');
  assert.ok(runtimeKitGsap.includes("'use client';"), 'GSAP source kit leaf should be client-only');
  assert.ok(runtimeKitGsap.includes('ctx.revert()'), 'GSAP source kit leaf should cleanup context');
  assert.ok(runtimeKitGsap.includes("window.matchMedia('(max-width: 760px)')"), 'GSAP source kit leaf should skip compact screens');
  assert.ok(runtimeKitThree.includes("'use client';"), 'Three source kit leaf should be client-only');
  assert.ok(runtimeKitThree.includes('ResizeObserver'), 'Three source kit leaf should handle resize');
  assert.ok(runtimeKitThree.includes('renderer.dispose()'), 'Three source kit leaf should dispose renderer');
  assert.ok(runtimeKitThree.includes('cancelAnimationFrame(frame)'), 'Three source kit leaf should stop animation frame');
  assert.ok(runtimeKitContent.includes('mirrorChapters'), 'runtime kit content should expose mirror chapters');
  assert.ok(runtimeKitContent.includes('mirrorStoryAnchors'), 'runtime kit content should expose mirror story anchors');
  assert.ok(runtimeKitContent.includes('mirrorStateSequencerPackets'), 'runtime kit content should expose state sequencer packets');
  assert.ok(runtimeKitContent.includes('reflectionNavigatorLenses'), 'runtime kit content should expose reflection navigator lenses');
  assert.ok(runtimeKitContent.includes('adaptiveMirrorLenses'), 'runtime kit content should expose adaptive mirror lenses');
  assert.ok(runtimeKitContent.includes('signalComposerPackets'), 'runtime kit content should expose signal composer packets');
  assert.ok(runtimeKitContent.includes('memoryConsentStates'), 'runtime kit content should expose memory consent states');
  assert.ok(runtimeKitContent.includes('desireTranslationRoutes'), 'runtime kit content should expose desire translation routes');
  assert.ok(runtimeKitContent.includes('mirrorRouteCompassEntries'), 'runtime kit content should expose route compass entries');
  assert.ok(runtimeKitContent.includes('recursiveBrainTunnelSteps'), 'runtime kit content should expose recursive brain tunnel steps');
  assert.ok(runtimeKitContent.includes('brainRouteStages'), 'runtime kit content should expose brain route stages');
  assert.ok(runtimeKitContent.includes('brainSignalHandoffPackets'), 'runtime kit content should expose brain signal handoff packets');
  assert.ok(runtimeKitContent.includes('defaultBrainSignalHandoff'), 'runtime kit content should expose default brain signal handoff');
  assert.ok(runtimeKitContent.includes('brainCellNetworkNodes'), 'runtime kit content should expose brain cell network nodes');
  assert.ok(runtimeKitContent.includes('livingOrganismNodes'), 'runtime kit content should expose living organism nodes');
  assert.ok(runtimeKitContent.includes('recursiveGrowthGates'), 'runtime kit content should expose recursive growth gates');
  assert.ok(runtimeKitContent.includes('cognitiveEvolutionTraceSteps'), 'runtime kit content should expose cognitive evolution trace steps');
  assert.ok(runtimeKitContent.includes('architectureMapPanes'), 'runtime kit content should expose architecture map panes');
  assert.ok(runtimeKitContent.includes('phaseProofLedgerEntries'), 'runtime kit content should expose phase proof ledger entries');
  assert.ok(runtimeKitContent.includes('proofCascadeSteps'), 'runtime kit content should expose proof cascade steps');
  assert.ok(runtimeKitContent.includes('mirrorProofObservatoryPackets'), 'runtime kit content should expose proof observatory packets');
  assert.ok(runtimeKitContent.includes('authorityGradientRungs'), 'runtime kit content should expose authority gradient rungs');
  assert.ok(runtimeKitContent.includes('scrollChoreographyActs'), 'runtime kit content should expose scroll choreography acts');
  assert.ok(runtimeKitContent.includes('mirrorEmotionalProgressionPackets'), 'runtime kit content should expose emotional progression packets');
  assert.ok(runtimeKitContent.includes('motionContracts'), 'runtime kit content should expose motion contracts');
  assert.ok(runtimeKitContent.includes('experienceAuditLenses'), 'runtime kit content should expose experience audit lenses');
  assert.ok(runtimeKitContent.includes('sourceTranslationLedgerEntries'), 'runtime kit content should expose source translation ledger entries');
  assert.ok(runtimeKitContent.includes('engineTranslationLedgerEntries'), 'runtime kit content should expose engine translation ledger entries');
  assert.ok(runtimeKitContent.includes('interfaceBuildStages'), 'runtime kit content should expose interface build stages');
  assert.ok(runtimeKitContent.includes('runtimeHandoffLanes'), 'runtime kit content should expose runtime handoff lanes');
  assert.ok(runtimeKitContent.includes('mirrorDepthGateLanes'), 'runtime kit content should expose depth gate lanes');
  assert.ok(runtimeKitContent.includes('infinitySymbolStates'), 'runtime kit content should expose infinity symbol states');
  assert.ok(runtimeKitContent.includes('joinRoutes'), 'runtime kit content should expose join routes');
  assert.ok(runtimeKitContent.includes('firstArtifactRoutes'), 'runtime kit content should expose first artifact routes');
  assert.ok(runtimeKitContent.includes('evolutionEntryProtocolSteps'), 'runtime kit content should expose evolution entry protocol steps');
  assert.ok(runtimeKitContent.includes('Source-backed desire translation before product promise.'), 'runtime kit content should include reflection navigator proof');
  assert.ok(runtimeKitContent.includes('A question enters the reflective threshold.'), 'runtime kit content should include state sequencer mirror packet');
  assert.ok(runtimeKitContent.includes('Each doorway names next artifact, owner, and boundary.'), 'runtime kit content should include state sequencer join proof return');
  assert.ok(runtimeKitContent.includes('Conversion remains explicit and human-owned.'), 'runtime kit content should include reflection navigator boundary');
  assert.ok(runtimeKitContent.includes('Structure is not identity authority.'), 'runtime kit content should include adaptive engine authority boundary');
  assert.ok(runtimeKitContent.includes('Only reviewed proof can become the next organism signal.'), 'runtime kit content should include cognitive trace next loop evolves field');
  assert.ok(runtimeKitContent.includes('Public motion leaves metadata, release notes, and a proof trail.'), 'runtime kit content should include authority gradient public motion proof field');
  assert.ok(runtimeKitContent.includes('The full route remains meaningful without JavaScript.'), 'runtime kit content should include semantic depth fallback');
  assert.ok(runtimeKitContent.includes('Depth cannot become authority.'), 'runtime kit content should include WebGL depth authority boundary');
  assert.ok(runtimeKitContent.includes('The human decides whether the loop grows, pauses, or ends.'), 'runtime kit content should include cognitive trace next loop proof lock');
  assert.ok(runtimeKitContent.includes('Turns insight into one grounded practice.'), 'runtime kit content should include adaptive ritualist lens');
  assert.ok(runtimeKitContent.includes('Mental room request'), 'runtime kit content should include signal composer mental room packet');
  assert.ok(runtimeKitContent.includes('First artifact packet, sandbox plan, and approval boundary.'), 'runtime kit content should include route compass access proof return');
  assert.ok(runtimeKitContent.includes('No impact claim outruns evidence.'), 'runtime kit content should include route compass world boundary');
  assert.ok(runtimeKitContent.includes('No code execution, file write, or deployment is implied by this demo.'), 'runtime kit content should include signal composer build boundary');
  assert.ok(runtimeKitContent.includes('No artifact is stored unless the person asks for one.'), 'runtime kit content should include signal composer quiet-listen proof path');
  assert.ok(runtimeKitContent.includes('Signal dives'), 'runtime kit content should include recursive tunnel signal stage');
  assert.ok(runtimeKitContent.includes('Gateway, cortex, memory, immune, and proof roles light in sequence.'), 'runtime kit content should include recursive tunnel cell stage');
  assert.ok(runtimeKitContent.includes('Identity, money, files, publishing, and Web3 motion remain outside the automatic path.'), 'runtime kit content should include recursive tunnel boundary stage');
  assert.ok(runtimeKitContent.includes('Route belief through evidence before persuasion.'), 'runtime kit content should include trust proof handoff packet');
  assert.ok(runtimeKitContent.includes('Files, code execution, deployments, and spend remain approval-gated.'), 'runtime kit content should include build handoff authority boundary');
  assert.ok(runtimeKitContent.includes('Return no stored artifact unless the human asks for one.'), 'runtime kit content should include quiet listen handoff proof return');
  assert.ok(runtimeKitContent.includes('18.8% / Professional excellence'), 'runtime kit content should include the desire category labels');
  assert.ok(runtimeKitContent.includes('Money, filesystem mutation, public posting, and broadcast wait for the creator.'), 'runtime kit content should include immune gate authority stops');
  assert.ok(runtimeKitContent.includes('Financial Organism'), 'runtime kit content should include organism visualizer nodes');
  assert.ok(runtimeKitContent.includes('Public release and aliasing remain separate approval checkpoints.'), 'runtime kit content should include recursive growth release boundary');
  assert.ok(runtimeKitContent.includes('Gateway intake'), 'runtime kit content should include architecture map panes');
  assert.ok(runtimeKitContent.includes('The build must leave proof before public motion.'), 'runtime kit content should include phase proof ledger execution title');
  assert.ok(runtimeKitContent.includes('Deployments, posting, and aliases remain explicit human checkpoints.'), 'runtime kit content should include phase proof ledger deployment boundary');
  assert.ok(runtimeKitContent.includes('A claim without evidence stays a claim, not a capability.'), 'runtime kit content should include architecture proof boundary');
  assert.ok(runtimeKitContent.includes('Deployments happen only after explicit approval.'), 'runtime kit content should include proof cascade deployment boundary');
  assert.ok(runtimeKitContent.includes('Architecture proves how a signal moves through Gateway'), 'runtime kit content should include proof observatory architecture packet');
  assert.ok(runtimeKitContent.includes('Deployments and aliases happen only after explicit approval.'), 'runtime kit content should include proof observatory deployment boundary');
  assert.ok(runtimeKitContent.includes('Files, money, public posting, Web3 broadcast, risky execution, and identity claims remain approval-gated.'), 'runtime kit content should include proof observatory status boundary');
  assert.ok(runtimeKitContent.includes('Curiosity opens the system without demanding belief.'), 'runtime kit content should include emotional curiosity packet');
  assert.ok(runtimeKitContent.includes('No hidden memory, diagnosis, public posting, file write, spend, or deployment.'), 'runtime kit content should include emotional unease boundary');
  assert.ok(runtimeKitContent.includes('The next move starts with scope and consent, not hidden authority.'), 'runtime kit content should include emotional agency boundary');
  assert.ok(runtimeKitContent.includes('Wonder becomes inspection.'), 'runtime kit content should include scroll map acts');
  assert.ok(runtimeKitContent.includes('Five scroll states; each visible state resolves inside 1.2s.'), 'runtime kit content should include motion duration strategy');
  assert.ok(runtimeKitContent.includes('Route reveal uses cubic-bezier(0.16, 1, 0.3, 1); orbit loops ease-in-out.'), 'runtime kit content should include motion easing strategy');
  assert.ok(runtimeKitContent.includes('Information architecture'), 'runtime kit content should include audit lens titles');
  assert.ok(runtimeKitContent.includes('80,508 participants across 159 countries and 70 languages'), 'runtime kit content should include source scale translation');
  assert.ok(runtimeKitContent.includes('No copied layout, chart treatment, quote wall, globe metaphor, or brand hierarchy.'), 'runtime kit content should include non-clone boundary');
  assert.ok(runtimeKitContent.includes('block_until_proof'), 'runtime kit content should include blocked engine decision');
  assert.ok(runtimeKitContent.includes('Birth-frequency archetypes'), 'runtime kit content should include blocked sensitive engine concept');
  assert.ok(runtimeKitContent.includes('No new claim ships without a matching proof artifact.'), 'runtime kit content should include evidence sync boundary');
  assert.ok(runtimeKitContent.includes('Semantic route and lightweight visual system.'), 'runtime kit content should include runtime handoff owner data');
  assert.ok(runtimeKitContent.includes('cleanup with gsap.context revert'), 'runtime kit content should include GSAP cleanup stop condition');
  assert.ok(runtimeKitContent.includes('Bounded doorway'), 'runtime kit content should include symbol language states');
  assert.ok(runtimeKitContent.includes('No public commitment before approval.'), 'runtime kit content should include join route approval boundary');
  assert.ok(runtimeKitContent.includes('Architecture packet plus sandboxed first-slice plan.'), 'runtime kit content should include first artifact builder packet');
  assert.ok(runtimeKitContent.includes('No deploy, spend, public post, or Web3 motion without explicit approval.'), 'runtime kit content should include first artifact approval boundary');
  assert.ok(runtimeKitContent.includes('A visible authority map before any build or diligence work starts.'), 'runtime kit content should include evolution entry boundary proof output');
  assert.ok(runtimeKitContent.includes('A next action with the same boundary still visible.'), 'runtime kit content should include evolution entry next-loop proof output');
  assert.ok(runtimeKitContent.includes('No public posting or asset spend without approval.'), 'runtime kit content should include authority stop boundaries');
  assert.ok(runtimeKitContent.includes('Visual Cortex'), 'runtime kit content should include organism paths');
  assert.ok(runtimeKitAssets.includes("runtimeKit: '/assets/specs/infinity-mirror-runtime-kit/README.md'"), 'runtime kit asset contract should name itself');
  assert.ok(runtimeKitTailwind.includes("void: '#030307'"), 'runtime kit Tailwind tokens should preserve mirror void color');
  assert.ok(runtimeKitTailwind.includes("mirror: '8px'"), 'runtime kit Tailwind tokens should preserve 8px radius');

  const conceptDecisions = new Set(implementationPacket.remix_design_concept_review.map(item => item.decision));
  assert.ok(conceptDecisions.has('adopt_now'), 'implementation packet should adopt the strongest Remix concepts now');
  assert.ok(conceptDecisions.has('prototype_next'), 'implementation packet should mark heavier Remix concepts as prototype-next');
  assert.ok(conceptDecisions.has('block_until_proof'), 'implementation packet should block identity-sensitive Remix concepts until proof');
  assert.ok(implementationPacket.remix_design_concept_review.some(item => /Persistent mirror shell/.test(item.concept)));
  assert.ok(implementationPacket.remix_design_concept_review.some(item => /MirrorShellSpecimen/.test(item.site_translation)));
  assert.ok(implementationPacket.remix_design_concept_review.some(item => /Quiet prompt chamber/.test(item.concept)));
  assert.ok(implementationPacket.remix_design_concept_review.some(item => /review packet, not a final authority/.test(item.boundary)));
  assert.ok(implementationPacket.remix_design_concept_review.some(item => /Birth-frequency archetypes/.test(item.concept) && /cannot claim identity truth/i.test(item.boundary)));

  const asset = manifest.assets.find(item => item.id === 'infinity-mirror-portal');
  assert.ok(asset, 'asset manifest missing Infinity Mirror portal');
  assert.equal(asset.file, 'assets/visuals/infinity-mirror-portal.svg');
  assert.equal(asset.route, '/organisms/infinity-mirror/experience');
  assert.equal(asset.surface, '#mirror-experience-hero');
  assert.match(asset.accessibility, /semantic HTML sections/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.trust_value, /reflection tensions/);
  assert.match(asset.trust_value, /human signal atlas/);
  assert.match(asset.trust_value, /mental room, better work, technical access, becoming, security, and world repair/);
  assert.match(asset.trust_value, /without inventing quotes/);
  assert.match(asset.trust_value, /desire translation wall/);
  assert.match(asset.trust_value, /professional excellence, personal transformation, life management, time freedom, financial independence, societal transformation, entrepreneurship, learning and growth, and creative expression/);
  assert.match(asset.trust_value, /organism routes, proof gates, and authority stops/);
  assert.match(asset.purpose, /mirror route compass/);
  assert.match(asset.purpose, /chapter, proof return, authority stop, and CTA fields/);
  assert.match(asset.trust_value, /delivery calibration layer/);
  assert.match(asset.trust_value, /not-delivered signals into proof gates/);
  assert.match(asset.trust_value, /role signal constellation/);
  assert.match(asset.trust_value, /human signal before abstraction/);
  assert.match(asset.trust_value, /signal reflection plane/);
	  assert.match(asset.trust_value, /command-to-proof transformation/);
	  assert.match(asset.trust_value, /adaptive mirror engine/);
	  assert.match(asset.trust_value, /Architect, Cartographer, Translator, and Ritualist lenses/);
	  assert.match(asset.trust_value, /signal composer/);
  assert.match(asset.trust_value, /Infinity symbol language/);
  assert.match(asset.trust_value, /portal, reflection, brain route, organism orbit, growth, proof, and doorway/);
	  assert.match(asset.trust_value, /remix concept fit matrix/);
  assert.match(asset.trust_value, /owner, proof surface, and authority boundary/);
  assert.match(asset.trust_value, /Mirror Shell Specimen/);
  assert.match(asset.trust_value, /stable shell, growth-state meter, prompt chamber, returned artifact, bottom navigation, and authority lock/);
  assert.match(asset.trust_value, /constant mirror shell/);
  assert.match(asset.trust_value, /pressure-release valve/);
  assert.match(asset.trust_value, /keep, refuse, deepen, or ritualize/);
  assert.match(asset.trust_value, /returned artifact specimen/);
  assert.match(asset.trust_value, /signal_in, lens, memory_map, boundary_lock, proof_path/);
  assert.match(asset.trust_value, /Keep, Correct, Deepen, and Close loop/);
  assert.match(asset.trust_value, /proof-returning descent protocol/);
  assert.match(asset.trust_value, /self, memory, split, lattice, current, evolution, and proof-return stages/);
  assert.match(asset.trust_value, /without importing a heavy canvas dependency/);
  assert.match(asset.trust_value, /motion contract ledger/);
  assert.match(asset.trust_value, /trigger, animation, timing, duration, easing, and performance/);
  assert.match(asset.trust_value, /human signal, product, descent, brain, proof, and doorway movements/);
  assert.match(asset.trust_value, /experience audit console/);
  assert.match(asset.trust_value, /information architecture, storytelling flow, scroll choreography, motion system, visual hierarchy, typography, transition logic, attention management, emotional progression, and performance technique/);
  assert.match(asset.trust_value, /source translation ledger/);
  assert.match(asset.trust_value, /80,508 participants across 159 countries and 70 languages/);
  assert.match(asset.trust_value, /without cloning the design skin/);
  assert.match(asset.trust_value, /interface build ledger/);
  assert.match(asset.trust_value, /semantic shell, motion islands, optional 3D gate, evidence sync, and release gate/);
  assert.match(asset.trust_value, /builder execution packet/);
  assert.match(asset.trust_value, /React shell, Framer island, optional GSAP\/Three tunnel, asset spec, metadata sync, tests, and approval gate/);
  assert.match(asset.trust_value, /runtime handoff matrix/);
  assert.match(asset.trust_value, /CSS, Framer, GSAP, and Three\/WebGL/);
  assert.match(asset.trust_value, /one job, one fallback, and one stop condition/);
  assert.match(asset.trust_value, /depth readiness gate/);
  assert.match(asset.trust_value, /fallback, mobile behavior, cleanup, and stop conditions/);
  assert.match(asset.trust_value, /bounded runtime field/);
  assert.match(asset.trust_value, /scroll-depth lemniscate particles/);
  assert.match(asset.trust_value, /SVG and semantic HTML remain authoritative/);
  assert.match(asset.trust_value, /hero fracture sequence/);
  assert.match(asset.trust_value, /symbol-to-cell fracture/);
  assert.match(asset.trust_value, /proof closes the loop/);
  assert.match(asset.trust_value, /recursive brain tunnel/);
  assert.match(asset.trust_value, /signal, cells, boundary, and proof/);
  assert.match(asset.trust_value, /first-viewport threshold contract/);
  assert.match(asset.trust_value, /canonical seven chapter anchors/);
  assert.match(asset.trust_value, /anchor-based chapter navigation/);
  assert.match(asset.trust_value, /native Infinite Reflection Navigator/);
  assert.match(asset.trust_value, /Human Signal, Brain Route, Proof Route, and Build Route lenses/);
  assert.match(asset.trust_value, /inspectable brain signal route/);
  assert.match(asset.trust_value, /governed organism spine/);
  assert.match(asset.trust_value, /six-gate recursive growth loop/);
  assert.match(asset.trust_value, /floating proof architecture panes/);
  assert.match(asset.proof_surface, /Desire Translation Wall/);
  assert.match(asset.proof_surface, /Anthropic desire categories into organism routes, proof gates, and authority stops/);
  assert.match(asset.proof_surface, /Mirror Route Compass/);
  assert.match(asset.proof_surface, /81K human desire signals into chapter, proof return, authority stop, and CTA fields/);
  assert.match(asset.proof_surface, /Scroll Choreography Map/);
  assert.match(asset.proof_surface, /seven proof-bearing acts to focus, motion, and proof return/);
  assert.match(asset.trust_value, /proof cascade that routes claim, evidence, boundary, and artifact/);
  assert.match(asset.trust_value, /role-specific proof doorways/);
  assert.match(asset.motion_policy, /scroll-depth fracture/);
  assert.match(asset.motion_policy, /bounded canvas runtime field/);
  assert.match(asset.motion_policy, /IntersectionObserver/);
  assert.match(asset.motion_policy, /compact-screen shutdown/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'Infinity Mirror portal SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'Infinity Mirror portal SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'Infinity Mirror portal SVG should not embed UI text');
  assert.ok(svg.includes('viewBox="0 0 1080 720"'), 'Infinity Mirror portal SVG should declare the expected viewBox');
  assert.ok(svg.includes('role="presentation"'), 'Infinity Mirror portal SVG should be presentational');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'Infinity Mirror portal SVG should include reduced-motion guard');

  assert.ok(llms.includes('Infinity Mirror Portal Experience'), 'llms.txt missing Infinity Mirror portal experience');
  assert.ok(llms.includes('proof-bound mirror threshold readout'), 'llms.txt missing Infinity Mirror threshold readout');
  assert.ok(llms.includes('signal reflection plane that shows command-to-proof transformation'), 'llms.txt missing Infinity Mirror signal reflection plane');
  assert.ok(llms.includes('human signal atlas grounded in the Anthropic 81K Interviews pattern'), 'llms.txt missing Infinity Mirror human signal atlas');
  assert.ok(llms.includes('desire translation wall that maps Anthropic desire categories into organism routes, proof gates, and authority stops'), 'llms.txt missing Infinity Mirror desire translation wall');
  assert.ok(llms.includes('mirror route compass that maps 81K human desire signals into chapter, proof return, authority stop, and CTA fields'), 'llms.txt missing Infinity Mirror route compass in portal summary');
	  assert.ok(llms.includes('delivery calibration layer that maps productivity, cognitive partnership, access, support, and not-delivered signals into proof gates'), 'llms.txt missing Infinity Mirror delivery calibration');
	  assert.ok(llms.includes('adaptive mirror engine with Architect, Cartographer, Translator, and Ritualist lenses'), 'llms.txt missing Infinity Mirror adaptive lenses');
	  assert.ok(llms.includes('signal composer for mental room, build stuck, trust proof, and quiet listen requests'), 'llms.txt missing Infinity Mirror signal composer in portal summary');
	  assert.ok(llms.includes('memory consent ledger that maps ephemeral, proposed, reviewed, and integrated memory states to can-hold, proof-required, and human-control fields'), 'llms.txt missing Infinity Mirror memory consent ledger in portal summary');
	  assert.ok(llms.includes('remix concept fit matrix that keeps persistent shell, reversible lenses, listening valve, artifact return, growth phases, and descent motion bound to proof and human authority'), 'llms.txt missing Infinity Mirror remix fit matrix');
  assert.ok(llms.includes('persistent Mirror Shell Specimen with growth meter, prompt chamber, artifact return, bottom route shell, and authority lock'), 'llms.txt missing Infinity Mirror shell specimen');
  assert.ok(llms.includes('returned artifact specimen that exposes signal_in, lens, memory_map, boundary_lock, proof_path'), 'llms.txt missing Infinity Mirror returned artifact specimen');
  assert.ok(llms.includes('proof-returning descent protocol distilled from the local Infinity Mirror engine concept'), 'llms.txt missing Infinity Mirror descent protocol');
  assert.ok(llms.includes('trigger, animation, timing, duration, easing, and performance'), 'llms.txt missing expanded Infinity Mirror motion fields');
  assert.ok(llms.includes('portal, reflection, signal, human signal, product, descent, brain, proof, and doorway movements'), 'llms.txt missing expanded Infinity Mirror motion contract');
  assert.ok(llms.includes('source translation ledger that maps Anthropic 81K patterns into Unwind-native organism proof without cloning the design skin'), 'llms.txt missing Infinity Mirror source translation ledger');
  assert.ok(llms.includes('experience audit console that explains purpose, why it works, and Unwind reinterpretation across ten reverse-engineering lenses'), 'llms.txt missing Infinity Mirror experience audit console');
  assert.ok(llms.includes('engine translation ledger that turns the local remix engine into progress, pointer energy, lens, artifact, and approval states'), 'llms.txt missing Infinity Mirror engine translation ledger');
  assert.ok(llms.includes('adopt now, prototype next, and block until proof decisions'), 'llms.txt missing Infinity Mirror engine fit decisions');
  assert.ok(llms.includes('interface build ledger that exposes semantic shell, motion islands, optional 3D gate, evidence sync, and release gate'), 'llms.txt missing Infinity Mirror build ledger');
  assert.ok(llms.includes('builder execution packet that names the React shell, Framer island, optional GSAP/Three tunnel, asset spec, metadata sync, tests, and approval gate'), 'llms.txt missing Infinity Mirror execution packet');
  assert.ok(llms.includes('runtime handoff matrix that assigns CSS, Framer, GSAP, and Three/WebGL to isolated motion lanes with one job, one fallback, and one stop condition'), 'llms.txt missing Infinity Mirror runtime handoff matrix');
  assert.ok(llms.includes('Infinity Mirror Depth Readiness Gate'), 'llms.txt missing Infinity Mirror depth gate');
  assert.ok(llms.includes('trigger, allowed behavior, proof needed, fallback, and kill switch'), 'llms.txt missing Infinity Mirror depth gate fields');
  assert.ok(llms.includes('bounded canvas runtime field that draws scroll-depth lemniscate particles behind the SVG fallback'), 'llms.txt missing Infinity Mirror bounded canvas runtime field');
  assert.ok(llms.includes('bounded brain route pulse that sequences signal, cells, authority, and proof across the tunnel, cell network, route console, and state grid'), 'llms.txt missing Infinity Mirror bounded brain route pulse');
  assert.ok(llms.includes('Infinity Mirror State Sequencer'), 'llms.txt missing Infinity Mirror state sequencer');
  assert.ok(llms.includes('signal, organism response, proof return, boundary lock, and next chapter route'), 'llms.txt missing Infinity Mirror state sequencer scope');
  assert.ok(llms.includes('storage, network calls, execution, deployment, posting, identity inference, and autonomy outside automatic authority'), 'llms.txt missing Infinity Mirror state sequencer boundary');
  assert.ok(llms.includes('Infinity Mirror Brain Signal Handoff'), 'llms.txt missing Infinity Mirror brain signal handoff');
  assert.ok(llms.includes('selected cells, authority lock, proof return, route copy, and state grid copy'), 'llms.txt missing Infinity Mirror brain signal handoff scope');
  assert.ok(llms.includes('Infinity Mirror Emotional Progression Rail'), 'llms.txt missing Infinity Mirror emotional progression rail');
  assert.ok(llms.includes('curiosity, unease, recognition, wonder, relief, or agency'), 'llms.txt missing Infinity Mirror emotional states');
  assert.ok(llms.includes('emotional profiling, identity inference, storage, execution, deployment, and public posting outside automatic authority'), 'llms.txt missing Infinity Mirror emotional progression boundary');
  assert.ok(llms.includes('Infinity Mirror Story Rail'), 'llms.txt missing Infinity Mirror story rail');
  assert.ok(llms.includes('canonical seven anchor links: Mirror, Reflection, Brain, Organisms, Recursive Growth, Proof, and Join Evolution'), 'llms.txt missing Infinity Mirror canonical story rail anchors');
  assert.ok(llms.includes('Infinity Mirror Scroll Choreography Map'), 'llms.txt missing Infinity Mirror scroll choreography map');
  assert.ok(llms.includes('seven proof-bearing acts to focus, motion, and proof return'), 'llms.txt missing Infinity Mirror scroll choreography map scope');
  assert.ok(llms.includes('Infinity Mirror Desire Translation Wall'), 'llms.txt missing Infinity Mirror desire wall proof surface');
  assert.ok(llms.includes('Infinity Mirror Route Compass'), 'llms.txt missing Infinity Mirror route compass');
  assert.ok(llms.includes('https://www.unwindcode.ai/organisms/infinity-mirror/experience/#mirror-route-compass'), 'llms.txt missing Infinity Mirror route compass URL');
  assert.ok(llms.includes('without identity inference, storage, data submission, model calls, build starts, spending, deployment, posting, Web3 broadcast, or autonomy authority'), 'llms.txt missing Infinity Mirror route compass boundary');
  assert.ok(llms.includes('Infinity Mirror Symbol Language'), 'llms.txt missing Infinity Mirror symbol language');
  assert.ok(llms.includes('seven infinity states: portal, reflection, brain route, organism orbit, earned density, proof return, and bounded doorway'), 'llms.txt missing Infinity Mirror symbol states');
  assert.ok(llms.includes('bounded organism-growth relay that sequences Visual Cortex, Infinity Mirror, Financial Organism, Research Organisms, and growth gates from pattern through proof'), 'llms.txt missing Infinity Mirror organism growth relay');
	  assert.ok(llms.includes('Infinity Mirror Adaptive Artifact Relay'), 'llms.txt missing Infinity Mirror adaptive artifact relay');
	  assert.ok(llms.includes('native lens buttons for Architect, Cartographer, Translator, and Ritualist'), 'llms.txt missing Infinity Mirror native lens controls');
	  assert.ok(llms.includes('keeps personalization reversible rather than identity authority'), 'llms.txt missing Infinity Mirror reversible personalization boundary');
	  assert.ok(llms.includes('Infinity Mirror Signal Composer'), 'llms.txt missing Infinity Mirror signal composer');
	  assert.ok(llms.includes('native buttons for mental room, build stuck, trust proof, and quiet listen signals'), 'llms.txt missing Infinity Mirror signal composer controls');
	  assert.ok(llms.includes('diagnosis, identity, hidden memory, camera access, code execution, deployment, and public posting outside automatic authority'), 'llms.txt missing Infinity Mirror signal composer boundary');
	  assert.ok(llms.includes('Infinity Mirror Memory Consent Ledger'), 'llms.txt missing Infinity Mirror memory consent ledger');
	  assert.ok(llms.includes('https://www.unwindcode.ai/organisms/infinity-mirror/experience/#mirror-memory-consent'), 'llms.txt missing Infinity Mirror memory consent ledger URL');
	  assert.ok(llms.includes('diagnosis, identity authority, hidden profiling, wallet control, deployment, public posting, Web3 broadcast, and autonomy outside automatic authority'), 'llms.txt missing Infinity Mirror memory consent boundary');
	  assert.ok(llms.includes('Infinity Mirror Implementation Packet'), 'llms.txt missing Infinity Mirror implementation packet');
  assert.ok(llms.includes('adopt_now, prototype_next, and block_until_proof decisions'), 'llms.txt missing Infinity Mirror implementation packet decisions');
  assert.ok(llms.includes('persistent shell, quiet prompt chamber, returned artifact, scroll descent, signal map, and birth-date archetype ideas'), 'llms.txt missing Infinity Mirror implementation packet concept review');
  assert.ok(llms.includes('Infinity Mirror Cognitive Evolution Trace'), 'llms.txt missing Infinity Mirror cognitive evolution trace');
  assert.ok(llms.includes('signal, memory, cells, sandbox, proof, and next loop into evolution steps and proof locks'), 'llms.txt missing Infinity Mirror cognitive trace scope');
  assert.ok(llms.includes('Infinity Mirror First Artifact Router'), 'llms.txt missing Infinity Mirror first artifact router');
  assert.ok(llms.includes('https://www.unwindcode.ai/organisms/infinity-mirror/experience/#mirror-first-artifact-router'), 'llms.txt missing Infinity Mirror first artifact router URL');
  assert.ok(llms.includes('without submitting data, creating a lead, storing state, calling a network, executing code, spending money, deploying, posting publicly, broadcasting Web3 transactions, inferring identity, or granting autonomy'), 'llms.txt missing Infinity Mirror first artifact boundary');
  assert.ok(llms.includes('Infinity Mirror Evolution Entry Protocol'), 'llms.txt missing Infinity Mirror evolution entry protocol');
  assert.ok(llms.includes('signal, boundary, first proof, and next loop'), 'llms.txt missing Infinity Mirror evolution entry protocol scope');
  assert.ok(llms.includes('Infinity Mirror Phase Proof Ledger'), 'llms.txt missing Infinity Mirror phase proof ledger');
  assert.ok(llms.includes('phase coverage is inspectable on-page'), 'llms.txt missing Infinity Mirror phase proof ledger value');
  assert.ok(llms.includes('recursive brain tunnel'), 'llms.txt missing Infinity Mirror recursive brain tunnel');
  assert.ok(llms.includes('inspectable brain route console'), 'llms.txt missing Infinity Mirror brain route console');
  assert.ok(llms.includes('six-gate recursive growth loop field'), 'llms.txt missing Infinity Mirror recursive growth loop');
  assert.ok(llms.includes('claim-to-artifact proof cascade'), 'llms.txt missing Infinity Mirror proof cascade');
  assert.ok(llms.includes('https://www.unwindcode.ai/organisms/infinity-mirror/experience'), 'llms.txt missing Infinity Mirror experience URL');
  assert.ok(sitemap.includes('https://www.unwindcode.ai/organisms/infinity-mirror/experience'), 'sitemap missing Infinity Mirror experience route');
  assert.ok(services.includes('"id": "infinity_mirror_portal"'), 'ai-services missing Infinity Mirror portal asset');
  assert.ok(services.includes('"id": "infinity_mirror_state_sequencer"'), 'ai-services missing Infinity Mirror state sequencer');
  assert.ok(services.includes('Mirror State Sequencer is local state only'), 'ai-services missing Infinity Mirror state sequencer local-state rule');
  assert.ok(services.includes('story-rail active state derived from the canonical seven chapter anchors'), 'ai-services missing Infinity Mirror story rail canonical anchor rule');
  assert.ok(services.includes('"id": "infinity_mirror_runtime_field"'), 'ai-services missing Infinity Mirror runtime field');
  assert.ok(services.includes('"id": "infinity_mirror_brain_route_pulse"'), 'ai-services missing Infinity Mirror brain route pulse');
  assert.ok(services.includes('route console, signal handoff, and state grid'), 'ai-services missing Infinity Mirror brain signal handoff scope');
  assert.ok(services.includes('only swaps existing i18n-backed copy and selected-cell classes'), 'ai-services missing Infinity Mirror brain signal handoff boundary');
	  assert.ok(services.includes('"id": "infinity_mirror_organism_growth_relay"'), 'ai-services missing Infinity Mirror organism growth relay');
	  assert.ok(services.includes('"id": "infinity_mirror_adaptive_artifact_relay"'), 'ai-services missing Infinity Mirror adaptive artifact relay');
	  assert.ok(services.includes('"id": "infinity_mirror_signal_composer"'), 'ai-services missing Infinity Mirror signal composer');
	  assert.ok(services.includes('mental room, build stuck, trust proof, or quiet listen signals'), 'ai-services missing Infinity Mirror signal composer scope');
	  assert.ok(services.includes('It cannot diagnose, assign identity, infer destiny, store hidden memory, access camera, execute code, write files, deploy, post publicly, or grant autonomy'), 'ai-services missing Infinity Mirror signal composer boundary');
	  assert.ok(services.includes('"id": "infinity_mirror_memory_consent_ledger"'), 'ai-services missing Infinity Mirror memory consent ledger');
	  assert.ok(services.includes('ephemeral, proposed, reviewed, and integrated reflection memory states'), 'ai-services missing Infinity Mirror memory consent state ladder');
	  assert.ok(services.includes('It cannot store memory, diagnose, assign identity, infer destiny, profile hidden traits, access camera, execute code, write files, deploy, post publicly, move wallets, broadcast Web3 transactions, or grant autonomy'), 'ai-services missing Infinity Mirror memory consent boundary');
  assert.ok(services.includes('"id": "infinity_mirror_cognitive_evolution_trace"'), 'ai-services missing Infinity Mirror cognitive evolution trace');
  assert.ok(services.includes('signal, memory, cells, sandbox, proof, and next loop into inspectable evolution steps'), 'ai-services missing Infinity Mirror cognitive trace scope');
  assert.ok(services.includes('cannot store state, call a network, execute code, write files, spend money, deploy, post publicly, change production status, broadcast Web3 transactions, or grant autonomy'), 'ai-services missing Infinity Mirror cognitive trace boundary');
  assert.ok(services.includes('"id": "infinity_mirror_first_artifact_router"'), 'ai-services missing Infinity Mirror first artifact router');
  assert.ok(services.includes('builder, investor, researcher, and partner intent'), 'ai-services missing Infinity Mirror first artifact router scope');
  assert.ok(services.includes('It cannot submit data, create a lead, store state, call a network, execute code, write files, spend money, deploy, post publicly, change production status, broadcast Web3 transactions, infer identity, or grant autonomy'), 'ai-services missing Infinity Mirror first artifact router boundary');
  assert.ok(services.includes('"id": "infinity_mirror_evolution_entry_protocol"'), 'ai-services missing Infinity Mirror evolution entry protocol');
  assert.ok(services.includes('builders, investors, researchers, and partners know what happens after the doorway'), 'ai-services missing Infinity Mirror evolution entry protocol scope');
  assert.ok(services.includes('cannot store state, call a network, execute code, write files, spend money, deploy, post publicly, change production status, broadcast Web3 transactions, infer identity, or grant autonomy'), 'ai-services missing Infinity Mirror evolution entry protocol boundary');
  assert.ok(services.includes('"id": "infinity_mirror_phase_proof_ledger"'), 'ai-services missing Infinity Mirror phase proof ledger');
  assert.ok(services.includes('reverse engineering, concept, story, motion, visual exploration, implementation, and execution'), 'ai-services missing Infinity Mirror phase proof ledger scope');
  assert.ok(services.includes('cannot store state, call a network, execute code, write files, deploy, post publicly, change production status, or authorize future runtime work'), 'ai-services missing Infinity Mirror phase proof ledger boundary');
  assert.ok(services.includes('"id": "infinity_mirror_emotional_progression"'), 'ai-services missing Infinity Mirror emotional progression rail');
  assert.ok(services.includes('curiosity, unease, recognition, wonder, relief, or agency'), 'ai-services missing Infinity Mirror emotional progression scope');
  assert.ok(services.includes('It cannot profile emotion, infer identity, store hidden memory, diagnose, execute code, write files, deploy, post publicly, or grant autonomy'), 'ai-services missing Infinity Mirror emotional progression boundary');
  assert.ok(services.includes('"id": "infinity_mirror_proof_observatory"'), 'ai-services missing Infinity Mirror proof observatory');
  assert.ok(services.includes('Architecture, Metrics, Deployments, or Status'), 'ai-services missing Infinity Mirror proof observatory scope');
  assert.ok(services.includes('cannot read live telemetry, store hidden state, execute code, write files, deploy, post publicly, grant autonomy, or change production status'), 'ai-services missing Infinity Mirror proof observatory boundary');
  assert.ok(services.includes('"id": "infinity_mirror_authority_gradient"'), 'ai-services missing Infinity Mirror authority gradient');
  assert.ok(services.includes('observe, reflect, draft, sandbox, approval, and public-motion rungs'), 'ai-services missing Infinity Mirror authority gradient scope');
  assert.ok(services.includes('cannot store state, infer identity, control wallets, execute code, write files, spend money, deploy, post publicly, broadcast Web3 transactions, change status, or grant autonomy'), 'ai-services missing Infinity Mirror authority gradient boundary');
	  assert.ok(services.includes('"id": "infinity_mirror_implementation_packet"'), 'ai-services missing Infinity Mirror implementation packet');
  assert.ok(services.includes('public_implementation_contract'), 'ai-services missing Infinity Mirror implementation contract type');
  assert.ok(services.includes('persistent shell as a visible Mirror Shell Specimen, plus quiet prompt chamber, returned artifact, descent engine, and signal map'), 'ai-services missing Infinity Mirror implementation concept review');
  assert.ok(services.includes('birth-date identity claims, hidden memory maps, default camera access, and continuous mobile canvas remain blocked'), 'ai-services missing Infinity Mirror blocked implementation concepts');
  assert.ok(services.includes('"id": "infinity_mirror_experience_audit"'), 'ai-services missing Infinity Mirror experience audit');
  assert.ok(services.includes('source-backed Phase 1 audit'), 'ai-services missing Infinity Mirror experience audit scope');
  assert.ok(services.includes('does not clone the Anthropic visual skin'), 'ai-services missing Infinity Mirror experience audit non-clone boundary');
  assert.ok(services.includes('"id": "infinity_mirror_engine_concept_analysis"'), 'ai-services missing Infinity Mirror engine concept analysis');
  assert.ok(services.includes('public_engine_concept_analysis'), 'ai-services missing Infinity Mirror engine concept analysis type');
  assert.ok(services.includes('persistent mirror shell, reversible lenses, just-talk pressure valve, returned artifact, scroll descent, kintsugi growth, signal map, and 9:16 social scenes'), 'ai-services missing Infinity Mirror engine concept scope');
  assert.ok(services.includes('default camera reflection, hidden memory personalization, continuous mobile canvas, and public posting stay blocked'), 'ai-services missing Infinity Mirror engine concept boundary');
  assert.ok(services.includes('sequences Architect, Cartographer, Translator, and Ritualist lenses'), 'ai-services missing Infinity Mirror adaptive artifact sequence');
  assert.ok(services.includes('native button override'), 'ai-services missing Infinity Mirror adaptive artifact manual override');
  assert.ok(services.includes('scroll-depth lemniscate particles'), 'ai-services missing Infinity Mirror runtime field particles');
  assert.ok(services.includes('sequences signal, cells, authority, and proof across the recursive brain tunnel'), 'ai-services missing Infinity Mirror brain route pulse sequence');
  assert.ok(services.includes('sequences Visual Cortex, Infinity Mirror, Financial Organism, and Research Organisms'), 'ai-services missing Infinity Mirror organism relay sequence');
  assert.ok(services.includes('recursive growth gates from pattern through proof'), 'ai-services missing Infinity Mirror growth relay sequence');
  assert.ok(services.includes('compact-screen static mode'), 'ai-services missing Infinity Mirror brain route compact static mode');
  assert.ok(services.includes('compact-screen shutdown under 760px'), 'ai-services missing Infinity Mirror runtime compact shutdown');
  assert.ok(services.includes('mirror, reflection, brain, organisms, recursive growth, proof, and join evolution'), 'ai-services missing Infinity Mirror portal story arc');
  assert.ok(services.includes('first-viewport threshold contract'), 'ai-services missing Infinity Mirror threshold contract');
  assert.ok(services.includes('signal reflection plane'), 'ai-services missing Infinity Mirror signal reflection plane');
  assert.ok(services.includes('command-to-proof transformation'), 'ai-services missing Infinity Mirror command-to-proof transformation');
  assert.ok(services.includes('human signal atlas that maps AI desire patterns to organism routes'), 'ai-services missing Infinity Mirror human signal atlas');
  assert.ok(services.includes('framed as inference rather than fake direct quotes'), 'ai-services missing Infinity Mirror human signal framing');
  assert.ok(services.includes('desire translation wall that maps Anthropic desire categories into organism routes, proof gates, and authority stops'), 'ai-services missing Infinity Mirror desire translation wall');
  assert.ok(services.includes('"id": "infinity_mirror_route_compass"'), 'ai-services missing Infinity Mirror route compass');
  assert.ok(services.includes('81K human desire signals into mirror chapter, proof return, authority stop, and CTA fields'), 'ai-services missing Infinity Mirror route compass scope');
  assert.ok(services.includes('It cannot infer identity, store a preference, submit data, call a model, start a build, spend money, deploy, post publicly, change production status, broadcast Web3 transactions, or grant autonomy'), 'ai-services missing Infinity Mirror route compass boundary');
  assert.ok(services.includes('delivery calibration layer that maps productivity, cognitive partnership, access, support, and not-delivered signals into proof gates'), 'ai-services missing Infinity Mirror delivery calibration');
  assert.ok(services.includes('adaptive mirror engine'), 'ai-services missing Infinity Mirror adaptive engine');
  assert.ok(services.includes('Architect, Cartographer, Translator, and Ritualist lenses'), 'ai-services missing Infinity Mirror adaptive lenses');
  assert.ok(services.includes('memory consent ledger that maps ephemeral, proposed, reviewed, and integrated memory states to can-hold, proof-required, and human-control fields'), 'ai-services missing Infinity Mirror memory consent in portal summary');
  assert.ok(services.includes('a memory consent ledger that makes ephemeral, proposed, reviewed, and integrated memory states inspectable without diagnosis, identity authority, hidden profiling, wallet control, network, files, deployment, posting, Web3 broadcast, storage, or autonomy authority'), 'ai-services missing Infinity Mirror memory consent trust boundary');
  assert.ok(services.includes('remix concept fit matrix'), 'ai-services missing Infinity Mirror remix fit matrix');
  assert.ok(services.includes('persistent shell, archetype lens, listening valve, artifact return, growth phase, and descent engine'), 'ai-services missing Infinity Mirror remix concept mapping');
  assert.ok(services.includes('persistent Mirror Shell Specimen with growth meter, prompt chamber, artifact return, bottom route shell, and authority lock'), 'ai-services missing Infinity Mirror shell specimen');
  assert.ok(services.includes('stable shell, growth-state meter, prompt chamber, returned artifact, bottom navigation, and authority lock'), 'ai-services missing Infinity Mirror shell specimen boundary');
  assert.ok(services.includes('reviewable artifact'), 'ai-services missing Infinity Mirror reviewable artifact boundary');
  assert.ok(services.includes('returned artifact specimen'), 'ai-services missing Infinity Mirror returned artifact specimen');
  assert.ok(services.includes('signal_in, lens, memory_map, boundary_lock, proof_path'), 'ai-services missing Infinity Mirror returned artifact fields');
  assert.ok(services.includes('proof-returning descent protocol distilled from the local Infinity Mirror engine concept'), 'ai-services missing Infinity Mirror descent protocol');
  assert.ok(services.includes('self, memory, split, lattice, current, evolution, and proof-return stages'), 'ai-services missing Infinity Mirror descent stages');
  assert.ok(services.includes('trigger, animation, timing, duration, easing, and performance'), 'ai-services missing expanded Infinity Mirror motion fields');
  assert.ok(services.includes('portal, reflection, signal, human signal, product, descent, brain, proof, and doorway movements'), 'ai-services missing expanded Infinity Mirror motion contract');
  assert.ok(services.includes('experience audit console that explains purpose, why it works, and Unwind reinterpretation for information architecture, storytelling flow, scroll choreography, motion system, visual hierarchy, typography, transition logic, attention management, emotional progression, and performance technique'), 'ai-services missing Infinity Mirror experience audit console');
  assert.ok(services.includes('source translation ledger that maps scale, method, tension, delivery gaps, scroll choreography, and non-clone boundary into Unwind decisions'), 'ai-services missing Infinity Mirror source translation ledger');
  assert.ok(services.includes('80,508 participants across 159 countries and 70 languages'), 'ai-services missing Infinity Mirror source scale proof');
  assert.ok(services.includes('engine translation ledger that turns the local remix engine into progress, pointer energy, lens, artifact, and approval states'), 'ai-services missing Infinity Mirror engine translation ledger');
  assert.ok(services.includes('adopt now, prototype next, and block until proof decisions'), 'ai-services missing Infinity Mirror engine fit decisions');
  assert.ok(services.includes('DOB identity truth, default camera access, hidden memory maps, and continuous mobile canvas'), 'ai-services missing Infinity Mirror blocked engine defaults');
  assert.ok(services.includes('interface build ledger that exposes semantic shell, motion islands, optional 3D gate, evidence sync, and release gate'), 'ai-services missing Infinity Mirror build ledger');
  assert.ok(services.includes('deployment behind explicit approval'), 'ai-services missing Infinity Mirror release approval boundary');
  assert.ok(services.includes('builder execution packet that names the React shell, Framer island, optional GSAP/Three tunnel, asset spec, metadata sync, tests, and approval gate'), 'ai-services missing Infinity Mirror execution packet');
  assert.ok(services.includes('builder execution packet that separates React shell, Framer island, optional GSAP/Three tunnel, asset spec, metadata sync, tests, and approval gate'), 'ai-services missing Infinity Mirror execution packet boundary');
  assert.ok(services.includes('runtime handoff matrix that assigns CSS, Framer, GSAP, and Three/WebGL to isolated motion lanes'), 'ai-services missing Infinity Mirror runtime handoff matrix');
  assert.ok(services.includes('one job, one fallback, and one stop condition'), 'ai-services missing Infinity Mirror runtime stop condition');
  assert.ok(services.includes('"id": "infinity_mirror_depth_gate"'), 'ai-services missing Infinity Mirror depth gate service entry');
  assert.ok(services.includes('trigger, allowed behavior, proof needed, fallback, and kill switch'), 'ai-services missing Infinity Mirror depth gate fields');
  assert.ok(services.includes('"id": "infinity_mirror_runtime_code_handoff"'), 'ai-services missing Infinity Mirror runtime code handoff');
  assert.ok(services.includes('implementation-ready React, server-rendered Desire Translation Wall, Mirror Route Compass, Memory Consent Ledger, Brain Cell Network, Living Organism Visualizer, Recursive Growth Timeline, Cognitive Evolution Trace, Floating Architecture Maps, Proof Cascade, Mirror State Sequencer, Proof Observatory, Authority Gradient, Scroll Choreography Map, Emotional Progression Rail, Motion Contract Ledger, Infinity Symbol Language, First Artifact Router, Evolution Entry Protocol, Framer, GSAP, Three/WebGL, Tailwind, and asset snippets'), 'ai-services missing Infinity Mirror runtime code handoff scope');
  assert.ok(services.includes('Mirror Route Compass chapter/proofReturn/authorityStop/CTA data'), 'ai-services missing Infinity Mirror runtime code handoff route compass data');
  assert.ok(services.includes('Memory Consent Ledger memory-consent state/can-hold/proof-required/human-control data'), 'ai-services missing Infinity Mirror runtime code handoff memory consent data');
  assert.ok(services.includes('First Artifact Router bring/firstArtifact/proofRoute/approvalBoundary data'), 'ai-services missing Infinity Mirror runtime code handoff first artifact data');
  assert.ok(services.includes('does not deploy new runtime authority'), 'ai-services missing Infinity Mirror runtime code handoff boundary');
  assert.ok(services.includes('"id": "infinity_mirror_runtime_source_kit"'), 'ai-services missing Infinity Mirror runtime source kit');
  assert.ok(services.includes('future Infinity Mirror React/Next page, server-rendered Desire Translation Wall, Mirror Route Compass, Memory Consent Ledger, First Artifact Router, Brain Cell Network, Living Organism Visualizer, Recursive Growth Timeline, Cognitive Evolution Trace, Floating Architecture Maps, Proof Cascade, Mirror State Sequencer, Proof Observatory, Authority Gradient, Scroll Choreography Map, Emotional Progression Rail, Motion Contract Ledger, Infinity Symbol Language, Evolution Entry Protocol, Framer chapter leaf, GSAP portal timeline, Three/WebGL tunnel gate'), 'ai-services missing Infinity Mirror runtime source kit scope');
  assert.ok(services.includes('plus Infinite Reflection Navigator, Adaptive Mirror Engine, Signal Composer, Memory Consent Ledger, First Artifact Router, and Join Evolution Routes source contracts'), 'ai-services missing Infinity Mirror runtime source kit navigator, adaptive engine, signal composer, memory consent, first artifact, and join contracts');
  assert.ok(services.includes('semantic HTML plus the Infinite Reflection Navigator, Desire Translation Wall, Mirror Route Compass, Adaptive Mirror Engine, Signal Composer, Memory Consent Ledger, First Artifact Router, Brain Cell Network'), 'ai-services missing Infinity Mirror runtime source kit semantic source contract');
  assert.ok(services.includes('Mirror Route Compass is semantic content only: no identity inference, storage, data submission, model calls, build starts, spending, deploys, public posts, Web3 broadcast, status changes, or autonomy authority'), 'ai-services missing Infinity Mirror runtime source kit route compass boundary');
  assert.ok(services.includes('Memory Consent Ledger is semantic content only: no diagnosis, identity authority, hidden profiling, wallet control, network, files, deploys, public posts, Web3 broadcast, storage, or autonomy authority'), 'ai-services missing Infinity Mirror runtime source kit memory consent boundary');
  assert.ok(services.includes('First Artifact Router is semantic content only: no data submission, lead creation, hidden workflow, storage, network, files, code execution, spending, deploys, public posts, Web3 broadcast, status changes, identity inference, or autonomy authority'), 'ai-services missing Infinity Mirror runtime source kit first artifact boundary');
  assert.ok(services.includes('Authority Gradient is semantic content only: no hidden memory, identity authority, wallet control, deploys, public posts, status changes, or autonomy authority'), 'ai-services missing Infinity Mirror runtime source kit authority gradient boundary');
  assert.ok(services.includes('Signal Composer is local state only: no storage, network, files, deploys, public posts, or identity authority'), 'ai-services missing Infinity Mirror runtime source kit signal composer authority boundary');
  assert.ok(services.includes('Emotional Progression Rail is local state only: no emotional profiling, identity inference, storage, network, files, code execution, deploys, public posts, or identity authority'), 'ai-services missing Infinity Mirror runtime source kit emotional rail authority boundary');
  assert.ok(services.includes('Proof Observatory is local state only: no live telemetry, storage, files, code execution, deploys, public posts, status changes, or autonomy authority'), 'ai-services missing Infinity Mirror runtime source kit proof observatory boundary');
  assert.ok(services.includes('Evolution Entry Protocol is semantic content only: no storage, network, files, code execution, deploys, public posts, Web3 broadcast, status changes, or autonomy authority'), 'ai-services missing Infinity Mirror runtime source kit evolution entry authority boundary');
  assert.ok(services.includes('does not activate React, Framer, GSAP, Three, Tailwind, WebGL, or deployment authority'), 'ai-services missing Infinity Mirror runtime source kit boundary');
  assert.ok(services.includes('bounded canvas runtime field'), 'ai-services missing Infinity Mirror bounded canvas field');
  assert.ok(services.includes('recursive brain tunnel'), 'ai-services missing Infinity Mirror recursive brain tunnel');
  assert.ok(services.includes('signal, cells, boundary, and proof'), 'ai-services missing Infinity Mirror tunnel path');
  assert.ok(services.includes('inspectable brain signal route'), 'ai-services missing Infinity Mirror brain route console');
  assert.ok(services.includes('six-gate recursive growth loop'), 'ai-services missing Infinity Mirror recursive growth loop');
  assert.ok(services.includes('claim-to-artifact proof cascade'), 'ai-services missing Infinity Mirror proof cascade');
  assert.ok(services.includes('proof cascade that routes claim, evidence, boundary, and artifact'), 'ai-services missing Infinity Mirror proof cascade boundary');
  assert.ok(services.includes('Infinity symbol language that maps seven public symbol states to loop, proof, and authority boundary'), 'ai-services missing Infinity Mirror symbol language');
  assert.ok(services.includes('Infinity symbol language that keeps portal, reflection, brain route, organism orbit, growth, proof, and doorway tied to proof and authority limits'), 'ai-services missing Infinity Mirror symbol language boundary');
  assert.ok(services.includes('scroll-depth fracture variables'), 'ai-services missing Infinity Mirror scroll-depth fracture motion policy');
  assert.ok(services.includes('reflection tension thread'), 'ai-services missing Infinity Mirror reflection tension thread');
  assert.ok(services.includes('anchor-based infinite reflection navigation'), 'ai-services missing Infinity Mirror anchor-based navigation');
  assert.ok(services.includes('native Infinite Reflection Navigator with Human Signal, Brain Route, Proof Route, and Build Route lenses'), 'ai-services missing Infinity Mirror native reflection navigator');
  assert.ok(services.includes('living organism visualizer'), 'ai-services missing Infinity Mirror living organism visualizer');
  assert.ok(services.includes('governed organism spine'), 'ai-services missing Infinity Mirror governed organism spine');
  assert.ok(services.includes('floating neural architecture maps'), 'ai-services missing Infinity Mirror floating architecture maps');
  assert.ok(services.includes('floating proof architecture panes'), 'ai-services missing Infinity Mirror floating proof architecture panes');
  assert.ok(services.includes('The Desire Translation Wall at #mirror-desire-translation maps Anthropic desire categories into organism routes, proof gates, and authority stops without copying quotes.'), 'ai-services missing Infinity Mirror desire wall proof surface');
  assert.ok(services.includes('The Scroll Choreography Map at #mirror-scroll-choreography maps seven proof-bearing acts to focus, motion, and proof return.'), 'ai-services missing Infinity Mirror scroll choreography proof surface');
  assert.ok(llms.includes('https://www.unwindcode.ai/organisms/infinity-mirror/experience/#mirror-authority-gradient'), 'llms.txt missing Infinity Mirror authority gradient URL');
  assert.ok(llms.includes('authority cannot jump from reflection to deployment'), 'llms.txt missing Infinity Mirror authority gradient boundary');
  assert.ok(services.includes('dynamic Infinity doorway'), 'ai-services missing Infinity Mirror dynamic doorway');
  assert.ok(services.includes('role-specific proof doorways'), 'ai-services missing Infinity Mirror role-specific proof doorways');
  assert.ok(llms.includes('scroll-depth fracture choreography'), 'llms.txt missing Infinity Mirror scroll-depth fracture choreography');
  assert.ok(llms.includes('reflection tension thread'), 'llms.txt missing Infinity Mirror reflection tension thread');
  assert.ok(llms.includes('anchor-based infinite reflection navigation'), 'llms.txt missing Infinity Mirror anchor-based navigation');
  assert.ok(llms.includes('native Infinite Reflection Navigator with Human Signal, Brain Route, Proof Route, and Build Route lenses'), 'llms.txt missing Infinity Mirror native reflection navigator');
  assert.ok(llms.includes('living organism visualizer with a governed organism spine'), 'llms.txt missing Infinity Mirror organism visualizer');
  assert.ok(llms.includes('floating neural architecture maps'), 'llms.txt missing Infinity Mirror floating architecture maps');
  assert.ok(llms.includes('claim-to-artifact proof cascade'), 'llms.txt missing Infinity Mirror claim-to-artifact proof cascade');
  assert.ok(llms.includes('Infinity Mirror Runtime Code Handoff'), 'llms.txt missing Infinity Mirror runtime code handoff');
  assert.ok(llms.includes('Infinity Mirror Experience Audit'), 'llms.txt missing Infinity Mirror experience audit');
  assert.ok(llms.includes('https://www.unwindcode.ai/assets/specs/infinity-mirror-experience-audit.md'), 'llms.txt missing Infinity Mirror experience audit URL');
  assert.ok(llms.includes('Infinity Mirror Engine Concept Analysis'), 'llms.txt missing Infinity Mirror engine concept analysis');
  assert.ok(llms.includes('https://www.unwindcode.ai/assets/specs/infinity-mirror-engine-concept-analysis.md'), 'llms.txt missing Infinity Mirror engine concept analysis URL');
  assert.ok(llms.includes('sorts persistent shell, reversible lenses, just-talk pressure valve, returned artifact, scroll descent, kintsugi growth, signal map, and vertical social scenes'), 'llms.txt missing Infinity Mirror engine concept scope');
  assert.ok(llms.includes('https://www.unwindcode.ai/assets/specs/infinity-mirror-runtime-code-handoff.md'), 'llms.txt missing Infinity Mirror runtime code handoff URL');
  assert.ok(llms.includes('Infinity Mirror Runtime Source Kit'), 'llms.txt missing Infinity Mirror runtime source kit');
  assert.ok(llms.includes('https://www.unwindcode.ai/assets/specs/infinity-mirror-runtime-kit/README.md'), 'llms.txt missing Infinity Mirror runtime source kit URL');
  assert.ok(llms.includes('Signal Composer, Brain Signal Handoff, Proof Observatory, and Emotional Progression Rail client leaves'), 'llms.txt missing Infinity Mirror runtime client component scope');
  assert.ok(llms.includes('server-rendered Infinite Reflection Navigator, Desire Translation Wall, Mirror Route Compass, Adaptive Mirror Engine, Signal Composer, Memory Consent Ledger, Brain Cell Network, Living Organism Visualizer, Recursive Growth Timeline, Cognitive Evolution Trace, Floating Architecture Maps, Phase Proof Ledger, Authority Gradient, Proof Cascade, Proof Observatory, Scroll Choreography Map, Emotional Progression Rail, Motion Contract Ledger, Infinity Symbol Language, Join Evolution Routes, First Artifact Router'), 'llms.txt missing Infinity Mirror runtime server and client component scope');
  assert.ok(llms.includes('typed story anchor focus, reflection lens route/proof/boundary, adaptive lens capture/translate/keep/boundary, signal packet/lens/artifact/proof path/brain cells/authority lock, memory consent can-hold/proof-required/human-control data, route compass chapter/proofReturn/authorityStop data, cognitive trace evolves/proof-lock data, phase ledger evidence/surface/boundary data, authority gradient allowed-action/proof-required data, proof observatory evidence/signal/boundary/artifact data, emotional progression feeling/organism route/proof return/authority boundary data, join route role/next/proof/boundary data, first artifact bring/firstArtifact/proofRoute/approvalBoundary data, and evolution entry signal/boundary/first proof/next loop data'), 'llms.txt missing Infinity Mirror runtime typed navigator, adaptive engine, signal composer, memory consent, route compass, cognitive trace, phase ledger, authority gradient, proof observatory, emotional rail, join route, first artifact, and evolution entry data');
  assert.ok(llms.includes('dynamic Infinity doorway'), 'llms.txt missing Infinity Mirror dynamic doorway');
  assert.ok(llms.includes('role-specific proof, boundary, next-step, and first-packet paths'), 'llms.txt missing Infinity Mirror role-specific doorway paths');
  assert.ok(services.includes('architecture, metrics, deployments, status, researcher, and partner links'), 'ai-services missing Infinity Mirror portal proof and join paths');
  assert.ok(productPage.includes('href="/organisms/infinity-mirror/experience"'), 'Infinity Mirror product page should link to the experience');
});

test('visual cortex page exposes a capability ledger before creator pipeline motion', async () => {
  const source = await readFile(new URL('../organisms/visual-cortex/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const servicesJson = JSON.parse(services);
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));

  const briefIndex = source.indexOf('id="visual-cortex-brief-title"');
  const capabilityIndex = source.indexOf('id="visual-cortex-capability-title"');
  const pipelineIndex = source.indexOf('id="visual-cortex-pipeline-title"');
  assert.ok(briefIndex > -1, 'Visual Cortex page missing product brief');
  assert.ok(capabilityIndex > briefIndex, 'Visual Cortex capability ledger should follow the product brief');
  assert.ok(pipelineIndex > capabilityIndex, 'Visual Cortex capability ledger should appear before the visual pipeline');

  for (const snippet of [
    'class="lab-section visual-cortex-capability-ledger-section"',
    'aria-labelledby="visual-cortex-capability-title"',
    'id="visual-cortex-capability-title"',
    'class="visual-cortex-capability-ledger"',
    'class="visual-cortex-capability-row"',
    'class="visual-cortex-capability-row boundary"',
    'data-i18n="detail.vc.capability.kicker"',
    'data-i18n="detail.vc.capability.title"',
    'data-i18n="detail.vc.capability.meta.input"',
    'data-i18n="detail.vc.capability.meta.memory"',
    'data-i18n="detail.vc.capability.meta.tool"',
    'data-i18n="detail.vc.capability.meta.approval"',
    'data-i18n="detail.vc.capability.meta.blocked"',
    'data-i18n="detail.vc.capability.capture.blocked"',
    'data-i18n="detail.vc.capability.memory.blocked"',
    'data-i18n="detail.vc.capability.cells.blocked"',
    'data-i18n="detail.vc.capability.approval.blocked"',
    'href="#visual-cortex-pipeline-title"',
    'href="#visual-cortex-packet-title"',
    'href="/proof/#authority-gate-title"',
  ]) {
    assert.ok(source.includes(snippet), `Visual Cortex capability ledger missing ${snippet}`);
  }

  for (const snippet of [
    "'detail.vc.capability.kicker': 'Capability ledger'",
    "'detail.vc.capability.title': 'What Visual Cortex can shape, what stays human-owned, and where proof lives.'",
    "'detail.vc.capability.capture.blocked': 'No invented brand truth, private customer claim, or promised distribution result.'",
    "'detail.vc.capability.memory.blocked': 'No hidden profile, unreviewed brand memory, or claim of customer results.'",
    "'detail.vc.capability.cells.tool': 'Cells prepare packet logic; they do not post, buy ads, write files, or contact audiences.'",
    "'detail.vc.capability.approval.blocked': 'No automatic posting, ads, external upload, analytics claim, or public promise.'",
    "'detail.vc.capability.kicker': 'Ledger de capacidades'",
    "'detail.vc.capability.title': 'Qué puede moldear Corteza Visual, qué sigue en manos humanas y dónde vive la prueba.'",
    "'detail.vc.capability.capture.blocked': 'Sin verdad de marca inventada, claim privado de cliente ni resultado de distribución prometido.'",
    "'detail.vc.capability.approval.proof': 'Inspeccionar la compuerta de autoridad'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing Visual Cortex capability ledger snippet ${snippet}`);
  }

  for (const snippet of [
    '.visual-cortex-capability-ledger-section',
    '.visual-cortex-capability-header',
    '.visual-cortex-capability-ledger',
    '.visual-cortex-capability-row',
    '.visual-cortex-capability-row.boundary',
    '.visual-cortex-capability-row dl',
    '.visual-cortex-capability-row dd a:focus-visible',
    '@media (max-width: 900px)',
    '@media (max-width: 640px)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing Visual Cortex capability ledger snippet ${snippet}`);
  }

  const serviceAsset = servicesJson.immersive_assets.find(item => item.id === 'visual_cortex_capability_ledger');
  assert.ok(serviceAsset, 'ai-services missing Visual Cortex capability ledger');
  assert.equal(serviceAsset.asset, 'semantic-html');
  assert.equal(serviceAsset.route, 'https://www.unwindcode.ai/organisms/visual-cortex/#visual-cortex-capability-title');
  assert.match(serviceAsset.purpose, /brief, memory, cell coordination, and approval boundaries/);
  assert.match(serviceAsset.trust_boundary, /No invented brand truth/);
  assert.match(serviceAsset.trust_boundary, /automatic distribution/);
  assert.match(serviceAsset.motion_policy, /No new animation dependency/);

  const manifestAsset = manifest.assets.find(item => item.id === 'visual-cortex-capability-ledger');
  assert.ok(manifestAsset, 'asset manifest missing Visual Cortex capability ledger');
  assert.equal(manifestAsset.file, 'organisms/visual-cortex/index.html#visual-cortex-capability-title');
  assert.equal(manifestAsset.format, 'semantic-html/css');
  assert.equal(manifestAsset.status, 'local-proof');
  assert.match(manifestAsset.accessibility, /ordered rows/);
  assert.match(manifestAsset.motion_policy, /no WebGL/);
  assert.deepEqual(manifestAsset.performance.dependencies, []);

  assert.ok(llms.includes('Visual Cortex Capability Ledger'), 'llms.txt missing Visual Cortex capability ledger');
  assert.ok(llms.includes('brief, memory, cell coordination, and approval boundaries'), 'llms.txt missing Visual Cortex capability boundary summary');
});

test('visual cortex page exposes a governed creator pipeline map', async () => {
  const source = await readFile(new URL('../organisms/visual-cortex/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/visual-cortex-pipeline-map.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'class="lab-section visual-cortex-pipeline-section"',
    'aria-labelledby="visual-cortex-pipeline-title"',
    'id="visual-cortex-pipeline-title"',
    'data-asset-id="visual-cortex-pipeline-map"',
    'assets/visuals/visual-cortex-pipeline-map.svg',
    'class="visual-cortex-pipeline-board"',
    'class="visual-cortex-pipeline-node"',
    'data-i18n="detail.vc.pipeline.kicker"',
    'data-i18n="detail.vc.pipeline.title"',
    'data-i18n="detail.vc.pipeline.raw.title"',
    'data-i18n="detail.vc.pipeline.review.desc"',
    'href="/transmissions/13-the-creator-organ-autonomous-content-production-at-scale"',
    'href="/build-with-us"',
    '"@type":"ImageObject"',
    '"@id":"https://www.unwindcode.ai/organisms/visual-cortex/#visual-cortex-pipeline-map-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/visual-cortex-pipeline-map.svg"',
  ]) {
    assert.ok(source.includes(snippet), `visual cortex page missing pipeline snippet ${snippet}`);
  }

  for (const snippet of [
    "'detail.vc.pipeline.kicker': 'Creator pipeline'",
    "'detail.vc.pipeline.title': 'Creative output becomes a reviewable production packet before anything publishes.'",
    "'detail.vc.pipeline.raw.title': 'Raw script intake'",
    "'detail.vc.pipeline.blueprint.title': 'Visual blueprint'",
    "'detail.vc.pipeline.review.title': 'Human review packet'",
    "'detail.vc.pipeline.kicker': 'Pipeline creativo'",
    "'detail.vc.pipeline.title': 'La salida creativa se convierte en un paquete de producción revisable antes de publicar.'",
    "'detail.vc.pipeline.raw.title': 'Entrada de guion crudo'",
    "'detail.vc.pipeline.blueprint.title': 'Blueprint visual'",
    "'detail.vc.pipeline.review.title': 'Paquete de revisión humana'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing visual cortex pipeline snippet ${snippet}`);
  }

  assert.ok(css.includes('.visual-cortex-pipeline-board'), 'CSS missing Visual Cortex pipeline board');
  assert.ok(css.includes('.visual-cortex-pipeline-node summary:focus-visible'), 'CSS missing Visual Cortex pipeline keyboard focus state');
  assert.ok(css.includes('.visual-cortex-pipeline-asset'), 'CSS missing Visual Cortex pipeline asset rules');
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'CSS missing reduced-motion media query');

  const asset = manifest.assets.find(item => item.id === 'visual-cortex-pipeline-map');
  assert.ok(asset, 'asset manifest missing Visual Cortex pipeline map');
  assert.equal(asset.file, 'assets/visuals/visual-cortex-pipeline-map.svg');
  assert.equal(asset.route, '/organisms/visual-cortex');
  assert.equal(asset.surface, '#visual-cortex-pipeline-title');
  assert.match(asset.accessibility, /details\/summary/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'Visual Cortex pipeline SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'Visual Cortex pipeline SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'Visual Cortex pipeline SVG should not embed UI text');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'Visual Cortex pipeline SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'Visual Cortex pipeline SVG should be presentational');

  assert.ok(llms.includes('Visual Cortex Pipeline Map'), 'llms.txt missing Visual Cortex pipeline map');
  assert.ok(services.includes('"id": "visual_cortex_pipeline_map"'), 'ai-services missing Visual Cortex pipeline asset');
});

test('visual cortex page exposes an inspectable production packet console', async () => {
  const source = await readFile(new URL('../organisms/visual-cortex/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/visual-cortex-production-console.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'class="lab-section visual-cortex-packet-section"',
    'aria-labelledby="visual-cortex-packet-title"',
    'id="visual-cortex-packet-title"',
    'data-asset-id="visual-cortex-production-console"',
    'assets/visuals/visual-cortex-production-console.svg',
    'class="visual-cortex-packet-board"',
    'class="visual-cortex-packet-selector"',
    'name="visual-cortex-packet"',
    'id="vc-packet-launch"',
    'id="vc-packet-reel"',
    'id="vc-packet-demo"',
    'id="vc-packet-landing"',
    'data-i18n="detail.vc.packet.kicker"',
    'data-i18n="detail.vc.packet.launch.boundary"',
    'data-i18n="detail.vc.packet.reel.boundary"',
    'data-i18n="detail.vc.packet.demo.boundary"',
    'data-i18n="detail.vc.packet.landing.boundary"',
    'href="/transmissions/13-the-creator-organ-autonomous-content-production-at-scale"',
    'href="/build-with-us"',
    '"@id":"https://www.unwindcode.ai/organisms/visual-cortex/#visual-cortex-production-console-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/visual-cortex-production-console.svg"',
  ]) {
    assert.ok(source.includes(snippet), `visual cortex page missing production packet snippet ${snippet}`);
  }

  for (const snippet of [
    "'detail.vc.packet.kicker': 'Production packet console'",
    "'detail.vc.packet.title': 'Choose a creative request and inspect the packet before production begins.'",
    "'detail.vc.packet.launch.tab': 'Launch film'",
    "'detail.vc.packet.launch.boundary': 'No publish, ad spend, asset generation, or file write happens until the creator reviews the packet.'",
    "'detail.vc.packet.reel.tab': 'Creator reel'",
    "'detail.vc.packet.reel.boundary': 'The organism can draft direction; the creator keeps final voice, likeness, publish timing, and distribution authority.'",
    "'detail.vc.packet.demo.tab': 'Product demo'",
    "'detail.vc.packet.demo.boundary': 'No public demo claim ships until product status, screenshots, and proof language are approved.'",
    "'detail.vc.packet.landing.tab': 'Landing proof'",
    "'detail.vc.packet.landing.boundary': 'The organism proposes structure and copy; publishing, analytics, forms, and public claims remain approval-gated.'",
    "'detail.vc.packet.kicker': 'Consola de paquete de producción'",
    "'detail.vc.packet.title': 'Elige una solicitud creativa e inspecciona el paquete antes de producir.'",
    "'detail.vc.packet.launch.tab': 'Film de lanzamiento'",
    "'detail.vc.packet.launch.boundary': 'No hay publicación, gasto publicitario, generación de assets ni escritura de archivos hasta que el creador revise el paquete.'",
    "'detail.vc.packet.landing.tab': 'Prueba landing'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing visual cortex packet snippet ${snippet}`);
  }

  for (const snippet of [
    '.visual-cortex-packet-section',
    '.visual-cortex-packet-board',
    '.visual-cortex-packet-asset',
    '.visual-cortex-packet-tabs',
    '#vc-packet-launch:checked ~ .visual-cortex-packet-tabs label[for="vc-packet-launch"]',
    '#vc-packet-landing:checked ~ .visual-cortex-packet-panels .packet-panel-landing',
    '#vc-packet-demo:focus-visible ~ .visual-cortex-packet-tabs label[for="vc-packet-demo"]',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing Visual Cortex packet snippet ${snippet}`);
  }

  const asset = manifest.assets.find(item => item.id === 'visual-cortex-production-console');
  assert.ok(asset, 'asset manifest missing Visual Cortex production console');
  assert.equal(asset.file, 'assets/visuals/visual-cortex-production-console.svg');
  assert.equal(asset.route, '/organisms/visual-cortex');
  assert.equal(asset.surface, '#visual-cortex-packet-title');
  assert.match(asset.accessibility, /native radio controls/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'Visual Cortex production SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'Visual Cortex production SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'Visual Cortex production SVG should not embed UI text');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'Visual Cortex production SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'Visual Cortex production SVG should be presentational');

  assert.ok(llms.includes('Visual Cortex Production Packet Console'), 'llms.txt missing Visual Cortex production console');
  assert.ok(services.includes('"id": "visual_cortex_production_console"'), 'ai-services missing Visual Cortex production console');
  assert.ok(services.includes('launch film, creator reel, product demo, and landing proof requests'), 'ai-services missing Visual Cortex packet request list');
});

test('brain cell architecture page exposes a capability ledger before self-evolution motion surfaces', async () => {
  const source = await readFile(new URL('../organisms/brain-cell-architecture/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const servicesJson = JSON.parse(services);
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));

  const briefIndex = source.indexOf('id="brain-cell-brief-title"');
  const capabilityIndex = source.indexOf('id="brain-cell-capability-title"');
  const lifecycleIndex = source.indexOf('id="brain-cell-lifecycle-title"');
  const runtimeIndex = source.indexOf('id="brain-cell-runtime-title"');
  assert.ok(briefIndex > -1, 'Brain Cell page missing product brief');
  assert.ok(capabilityIndex > -1, 'Brain Cell page missing capability ledger');
  assert.ok(lifecycleIndex > -1, 'Brain Cell page missing lifecycle map');
  assert.ok(runtimeIndex > -1, 'Brain Cell page missing runtime console');
  assert.ok(briefIndex < capabilityIndex, 'Brain Cell capability ledger should follow product brief');
  assert.ok(capabilityIndex < lifecycleIndex, 'Brain Cell capability ledger should precede lifecycle map');
  assert.ok(capabilityIndex < runtimeIndex, 'Brain Cell capability ledger should precede runtime console');

  for (const snippet of [
    'class="lab-section brain-cell-capability-ledger-section"',
    'aria-labelledby="brain-cell-capability-title"',
    'class="brain-cell-capability-header"',
    'class="brain-cell-capability-ledger"',
    'class="brain-cell-capability-row"',
    'class="brain-cell-capability-row boundary"',
    'data-i18n="detail.bc.capability.kicker"',
    'data-i18n="detail.bc.capability.title"',
    'data-i18n="detail.bc.capability.signal.title"',
    'data-i18n="detail.bc.capability.research.memory"',
    'data-i18n="detail.bc.capability.sandbox.tool"',
    'data-i18n="detail.bc.capability.integration.blocked"',
    'href="#brain-cell-lifecycle-title"',
    'href="/transmissions/19-the-cell-swap-protocol"',
    'href="#brain-cell-runtime-title"',
    'href="/proof/#authority-gate-title"',
  ]) {
    assert.ok(source.includes(snippet), `brain cell page missing capability ledger snippet ${snippet}`);
  }

  assert.equal((source.match(/class="brain-cell-capability-row/g) || []).length, 4, 'Brain Cell ledger should expose four capability rows');

  for (const snippet of [
    "'detail.bc.capability.kicker': 'Capability ledger'",
    "'detail.bc.capability.title': 'What Brain Cell Architecture can grow, what stays quarantined, and where proof lives.'",
    "'detail.bc.capability.signal.blocked': 'No hidden self-modification, autonomous code execution, or unreviewed filesystem write.'",
    "'detail.bc.capability.research.proof': 'Read the cell swap protocol'",
    "'detail.bc.capability.sandbox.tool': 'No host command, money movement, deployment, public posting, wallet call, or production load.'",
    "'detail.bc.capability.integration.blocked': 'No irreversible self-evolution, hidden memory write, authority expansion, or unreviewed autonomy.'",
    "'detail.bc.capability.kicker': 'Ledger de capacidad'",
    "'detail.bc.capability.title': 'Qué puede crecer Brain Cell Architecture, qué queda en cuarentena y dónde vive la prueba.'",
    "'detail.bc.capability.signal.blocked': 'Sin automodificación oculta, ejecución autónoma de código ni escritura de filesystem sin revisar.'",
    "'detail.bc.capability.integration.proof': 'Inspecciona la compuerta de autoridad'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing Brain Cell capability ledger snippet ${snippet}`);
  }

  for (const snippet of [
    '.brain-cell-capability-ledger-section',
    '.brain-cell-capability-header',
    '.brain-cell-capability-ledger',
    '.brain-cell-capability-row',
    '.brain-cell-capability-row.boundary',
    '.brain-cell-capability-row dl',
    '.brain-cell-capability-row dd a:focus-visible',
    '@media (max-width: 900px)',
    '@media (max-width: 640px)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing Brain Cell capability ledger snippet ${snippet}`);
  }

  const serviceAsset = servicesJson.immersive_assets.find(item => item.id === 'brain_cell_capability_ledger');
  assert.ok(serviceAsset, 'ai-services missing Brain Cell capability ledger');
  assert.equal(serviceAsset.asset, 'semantic-html');
  assert.equal(serviceAsset.route, 'https://www.unwindcode.ai/organisms/brain-cell-architecture/#brain-cell-capability-title');
  assert.match(serviceAsset.purpose, /signal, research, sandbox, and integration boundaries/);
  assert.match(serviceAsset.trust_boundary, /No hidden self-modification/);
  assert.match(serviceAsset.trust_boundary, /unreviewed autonomy/);
  assert.match(serviceAsset.motion_policy, /No new animation dependency/);

  const manifestAsset = manifest.assets.find(item => item.id === 'brain-cell-capability-ledger');
  assert.ok(manifestAsset, 'asset manifest missing Brain Cell capability ledger');
  assert.equal(manifestAsset.file, 'organisms/brain-cell-architecture/index.html#brain-cell-capability-title');
  assert.equal(manifestAsset.format, 'semantic-html/css');
  assert.equal(manifestAsset.status, 'local-proof');
  assert.match(manifestAsset.accessibility, /ordered row structure/);
  assert.match(manifestAsset.motion_policy, /no WebGL/);
  assert.deepEqual(manifestAsset.performance.dependencies, []);

  assert.ok(llms.includes('Brain Cell Architecture Capability Ledger'), 'llms.txt missing Brain Cell capability ledger');
  assert.ok(llms.includes("signal, research, sandbox, and integration boundaries"), 'llms.txt missing Brain Cell capability boundary summary');
});

test('brain cell architecture page exposes a governed lifecycle map', async () => {
  const source = await readFile(new URL('../organisms/brain-cell-architecture/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/brain-cell-lifecycle-map.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'class="lab-section brain-cell-lifecycle-section"',
    'aria-labelledby="brain-cell-lifecycle-title"',
    'id="brain-cell-lifecycle-title"',
    'data-asset-id="brain-cell-lifecycle-map"',
    'assets/visuals/brain-cell-lifecycle-map.svg',
    'class="brain-cell-lifecycle-board"',
    'class="brain-cell-lifecycle-node"',
    'data-i18n="detail.bc.lifecycle.kicker"',
    'data-i18n="detail.bc.lifecycle.title"',
    'data-i18n="detail.bc.lifecycle.signal.title"',
    'data-i18n="detail.bc.lifecycle.integrated.desc"',
    'href="/transmissions/21-the-unwind-brain-checkpoint-white-paper"',
    'href="/build-with-us"',
    '"@type":"ImageObject"',
    '"@id":"https://www.unwindcode.ai/organisms/brain-cell-architecture/#brain-cell-lifecycle-map-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/brain-cell-lifecycle-map.svg"',
  ]) {
    assert.ok(source.includes(snippet), `brain cell page missing lifecycle snippet ${snippet}`);
  }

  for (const snippet of [
    "'detail.bc.lifecycle.kicker': 'Cell lifecycle'",
    "'detail.bc.lifecycle.title': 'A new capability stays quarantined until proof says it can join the organism.'",
    "'detail.bc.lifecycle.signal.title': 'Problem signal'",
    "'detail.bc.lifecycle.sandbox.title': 'Sandbox trial'",
    "'detail.bc.lifecycle.integrated.title': 'Integrated skill'",
    "'detail.bc.lifecycle.kicker': 'Ciclo de vida celular'",
    "'detail.bc.lifecycle.title': 'Una nueva capacidad queda en cuarentena hasta que la prueba diga que puede unirse al organismo.'",
    "'detail.bc.lifecycle.signal.title': 'Señal del problema'",
    "'detail.bc.lifecycle.sandbox.title': 'Prueba en sandbox'",
    "'detail.bc.lifecycle.integrated.title': 'Skill integrada'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing brain cell lifecycle snippet ${snippet}`);
  }

  assert.ok(css.includes('.brain-cell-lifecycle-board'), 'CSS missing Brain Cell lifecycle board');
  assert.ok(css.includes('.brain-cell-lifecycle-node summary:focus-visible'), 'CSS missing Brain Cell lifecycle keyboard focus state');
  assert.ok(css.includes('.brain-cell-lifecycle-asset'), 'CSS missing Brain Cell lifecycle asset rules');
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'CSS missing reduced-motion media query');

  const asset = manifest.assets.find(item => item.id === 'brain-cell-lifecycle-map');
  assert.ok(asset, 'asset manifest missing Brain Cell lifecycle map');
  assert.equal(asset.file, 'assets/visuals/brain-cell-lifecycle-map.svg');
  assert.equal(asset.route, '/organisms/brain-cell-architecture');
  assert.equal(asset.surface, '#brain-cell-lifecycle-title');
  assert.match(asset.accessibility, /details\/summary/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'Brain Cell lifecycle SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'Brain Cell lifecycle SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'Brain Cell lifecycle SVG should not embed UI text');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'Brain Cell lifecycle SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'Brain Cell lifecycle SVG should be presentational');

  assert.ok(llms.includes('Brain Cell Lifecycle Map'), 'llms.txt missing Brain Cell lifecycle map');
  assert.ok(services.includes('"id": "brain_cell_lifecycle_map"'), 'ai-services missing Brain Cell lifecycle asset');
});

test('brain cell architecture page exposes an inspectable runtime console', async () => {
  const source = await readFile(new URL('../organisms/brain-cell-architecture/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/brain-cell-runtime-console.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'class="lab-section brain-cell-runtime-section"',
    'aria-labelledby="brain-cell-runtime-title"',
    'id="brain-cell-runtime-title"',
    'data-asset-id="brain-cell-runtime-console"',
    'assets/visuals/brain-cell-runtime-console.svg',
    'class="brain-cell-runtime-board"',
    'name="brain-cell-runtime"',
    'id="bc-runtime-design"',
    'id="bc-runtime-approval"',
    'data-i18n="detail.bc.runtime.kicker"',
    'data-i18n="detail.bc.runtime.title"',
    'data-i18n="detail.bc.runtime.design.boundary"',
    'data-i18n="detail.bc.runtime.repair.boundary"',
    'data-i18n="detail.bc.runtime.approval.boundary"',
    'data-i18n="detail.bc.runtime.integrate.boundary"',
    'href="/proof"',
    'href="/build-with-us"',
    '"@type":"ImageObject"',
    '"@id":"https://www.unwindcode.ai/organisms/brain-cell-architecture/#brain-cell-runtime-console-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/brain-cell-runtime-console.svg"',
  ]) {
    assert.ok(source.includes(snippet), `brain cell page missing runtime snippet ${snippet}`);
  }

  for (const snippet of [
    "'detail.bc.runtime.kicker': 'Runtime console'",
    "'detail.bc.runtime.title': 'Pick a cell request and see how the organism keeps mutation governed.'",
    "'detail.bc.runtime.design.tab': 'Design cell'",
    "'detail.bc.runtime.design.boundary': 'The request can propose source shape, but no generated code is trusted, run, or integrated by default.'",
    "'detail.bc.runtime.repair.tab': 'Sandbox repair'",
    "'detail.bc.runtime.repair.boundary': 'Sandbox repair can change candidate code only inside the review lane; production files remain locked until approval.'",
    "'detail.bc.runtime.approval.tab': 'Approval gate'",
    "'detail.bc.runtime.approval.boundary': 'High-risk actions stay inert unless explicit human approval grants that exact action for that exact destination.'",
    "'detail.bc.runtime.integrate.tab': 'Integration proof'",
    "'detail.bc.runtime.integrate.boundary': 'A passing cell can join the organism only as a bounded skill with review history, rollback, and observable proof.'",
    "'detail.bc.runtime.kicker': 'Consola runtime'",
    "'detail.bc.runtime.title': 'Elige una solicitud celular y mira cómo el organismo mantiene gobernada la mutación.'",
    "'detail.bc.runtime.design.tab': 'Diseñar célula'",
    "'detail.bc.runtime.approval.tab': 'Compuerta approval'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing brain cell runtime snippet ${snippet}`);
  }

  assert.ok(css.includes('.brain-cell-runtime-board'), 'CSS missing Brain Cell runtime board');
  assert.ok(css.includes('.brain-cell-runtime-tabs label:hover'), 'CSS missing Brain Cell runtime hover state');
  assert.ok(css.includes('#bc-runtime-design:focus-visible'), 'CSS missing Brain Cell runtime keyboard focus state');
  assert.ok(css.includes('.brain-cell-runtime-asset'), 'CSS missing Brain Cell runtime asset rules');
  assert.ok(css.includes('pointer-events: none;'), 'CSS missing non-interactive runtime asset behavior');
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'CSS missing reduced-motion media query');

  const asset = manifest.assets.find(item => item.id === 'brain-cell-runtime-console');
  assert.ok(asset, 'asset manifest missing Brain Cell runtime console');
  assert.equal(asset.file, 'assets/visuals/brain-cell-runtime-console.svg');
  assert.equal(asset.route, '/organisms/brain-cell-architecture');
  assert.equal(asset.surface, '#brain-cell-runtime-title');
  assert.match(asset.accessibility, /native radio controls/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'Brain Cell runtime SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'Brain Cell runtime SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'Brain Cell runtime SVG should not embed UI text');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'Brain Cell runtime SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'Brain Cell runtime SVG should be presentational');

  assert.ok(llms.includes('Brain Cell Runtime Console'), 'llms.txt missing Brain Cell runtime console');
  assert.ok(services.includes('"id": "brain_cell_runtime_console"'), 'ai-services missing Brain Cell runtime console');
  assert.ok(services.includes('capability design, sandbox repair, approval gate, and integration proof requests'), 'ai-services missing Brain Cell runtime request list');
});

test('financial organisms page exposes a capability ledger before Web3 motion surfaces', async () => {
  const source = await readFile(new URL('../organisms/financial-organisms/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const servicesJson = JSON.parse(services);
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));

  const briefIndex = source.indexOf('id="financial-organisms-brief-title"');
  const capabilityIndex = source.indexOf('id="financial-organisms-capability-title"');
  const trustIndex = source.indexOf('id="web3-trust-layer-title"');
  const simulationIndex = source.indexOf('id="web3-simulation-console-title"');
  assert.ok(briefIndex > -1, 'Financial Organisms page missing product brief');
  assert.ok(capabilityIndex > briefIndex, 'Financial Organisms capability ledger should follow the product brief');
  assert.ok(trustIndex > capabilityIndex, 'Financial Organisms capability ledger should appear before the Web3 trust layer');
  assert.ok(simulationIndex > capabilityIndex, 'Financial Organisms capability ledger should appear before the simulation console');

  for (const snippet of [
    'class="lab-section financial-organisms-capability-ledger-section"',
    'aria-labelledby="financial-organisms-capability-title"',
    'id="financial-organisms-capability-title"',
    'class="financial-organisms-capability-ledger"',
    'class="financial-organisms-capability-row"',
    'class="financial-organisms-capability-row boundary"',
    'data-i18n="detail.fo.capability.kicker"',
    'data-i18n="detail.fo.capability.title"',
    'data-i18n="detail.fo.capability.meta.input"',
    'data-i18n="detail.fo.capability.meta.memory"',
    'data-i18n="detail.fo.capability.meta.tool"',
    'data-i18n="detail.fo.capability.meta.approval"',
    'data-i18n="detail.fo.capability.meta.blocked"',
    'data-i18n="detail.fo.capability.read.blocked"',
    'data-i18n="detail.fo.capability.sim.blocked"',
    'data-i18n="detail.fo.capability.packet.blocked"',
    'data-i18n="detail.fo.capability.approval.blocked"',
    'href="#web3-trust-layer-title"',
    'href="#web3-simulation-console-title"',
    'href="/proof/#authority-gate-title"',
  ]) {
    assert.ok(source.includes(snippet), `Financial Organisms capability ledger missing ${snippet}`);
  }

  for (const snippet of [
    "'detail.fo.capability.kicker': 'Capability ledger'",
    "'detail.fo.capability.title': 'What Financial Organisms can study, what they cannot touch, and where proof lives.'",
    "'detail.fo.capability.read.blocked': 'No private keys, seed phrases, signatures, custody, or hidden wallet access.'",
    "'detail.fo.capability.sim.tool': 'Off-chain simulation only; no wallet calls, approvals, allowances, or contract writes.'",
    "'detail.fo.capability.packet.blocked': 'No investment advice, guaranteed yield, trade signal, or individualized financial recommendation.'",
    "'detail.fo.capability.approval.blocked': 'No hidden broadcast path, private-key handling, automatic trade, wallet write, or public money promise.'",
    "'detail.fo.capability.kicker': 'Ledger de capacidades'",
    "'detail.fo.capability.title': 'Qué pueden estudiar los Organismos Financieros, qué no pueden tocar y dónde vive la prueba.'",
    "'detail.fo.capability.read.blocked': 'Sin llaves privadas, frases semilla, firmas, custodia ni acceso oculto a wallet.'",
    "'detail.fo.capability.approval.proof': 'Inspeccionar la compuerta de autoridad'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing Financial Organisms capability ledger snippet ${snippet}`);
  }

  for (const snippet of [
    '.financial-organisms-capability-ledger-section',
    '.financial-organisms-capability-header',
    '.financial-organisms-capability-ledger',
    '.financial-organisms-capability-row',
    '.financial-organisms-capability-row.boundary',
    '.financial-organisms-capability-row dl',
    '.financial-organisms-capability-row dd a:focus-visible',
    '@media (max-width: 900px)',
    '@media (max-width: 640px)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing Financial Organisms capability ledger snippet ${snippet}`);
  }

  const serviceAsset = servicesJson.immersive_assets.find(item => item.id === 'financial_organisms_capability_ledger');
  assert.ok(serviceAsset, 'ai-services missing Financial Organisms capability ledger');
  assert.equal(serviceAsset.asset, 'semantic-html');
  assert.equal(serviceAsset.route, 'https://www.unwindcode.ai/organisms/financial-organisms/#financial-organisms-capability-title');
  assert.match(serviceAsset.purpose, /read-only context, off-chain simulation, unsigned review packets/);
  assert.match(serviceAsset.trust_boundary, /No private keys/);
  assert.match(serviceAsset.trust_boundary, /investment advice/);
  assert.match(serviceAsset.trust_boundary, /hidden broadcast path/);
  assert.match(serviceAsset.motion_policy, /No new animation dependency/);

  const manifestAsset = manifest.assets.find(item => item.id === 'financial-organisms-capability-ledger');
  assert.ok(manifestAsset, 'asset manifest missing Financial Organisms capability ledger');
  assert.equal(manifestAsset.file, 'organisms/financial-organisms/index.html#financial-organisms-capability-title');
  assert.equal(manifestAsset.format, 'semantic-html/css');
  assert.equal(manifestAsset.status, 'local-proof');
  assert.match(manifestAsset.accessibility, /ordered rows/);
  assert.match(manifestAsset.motion_policy, /no WebGL/);
  assert.deepEqual(manifestAsset.performance.dependencies, []);

  assert.ok(llms.includes('Financial Organisms Capability Ledger'), 'llms.txt missing Financial Organisms capability ledger');
  assert.ok(llms.includes('read, simulate, packet, and approval-lock boundaries'), 'llms.txt missing Financial Organisms capability boundary summary');
});

test('financial organisms page exposes a governed Web3 trust-layer map', async () => {
  const source = await readFile(new URL('../organisms/financial-organisms/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/web3-trust-layer-map.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'class="lab-section web3-trust-layer-section"',
    'aria-labelledby="web3-trust-layer-title"',
    'id="web3-trust-layer-title"',
    'data-asset-id="web3-trust-layer-map"',
    'assets/visuals/web3-trust-layer-map.svg',
    'class="web3-trust-board"',
    'class="web3-trust-node"',
    'data-i18n="detail.fo.trust.kicker"',
    'data-i18n="detail.fo.trust.title"',
    'data-i18n="detail.fo.trust.read.title"',
    'data-i18n="detail.fo.trust.locked.desc"',
    'href="/transmissions/23-the-sec-gate-an-organism-that-locks-its-own-hands"',
    'href="/proof"',
    '"@type":"ImageObject"',
    '"@id":"https://www.unwindcode.ai/organisms/financial-organisms/#web3-trust-layer-map-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/web3-trust-layer-map.svg"',
  ]) {
    assert.ok(source.includes(snippet), `financial organisms page missing trust-layer snippet ${snippet}`);
  }

  for (const snippet of [
    "'detail.fo.trust.kicker': 'Web3 trust layer'",
    "'detail.fo.trust.title': 'On-chain intelligence stays off-chain until approval is explicit.'",
    "'detail.fo.trust.read.title': 'Read-only context'",
    "'detail.fo.trust.packet.title': 'Unsigned review packet'",
    "'detail.fo.trust.locked.title': 'Broadcast locked'",
    "'detail.fo.trust.kicker': 'Capa de confianza Web3'",
    "'detail.fo.trust.title': 'La inteligencia on-chain permanece off-chain hasta que la aprobación sea explícita.'",
    "'detail.fo.trust.read.title': 'Contexto read-only'",
    "'detail.fo.trust.packet.title': 'Paquete de revisión sin firma'",
    "'detail.fo.trust.locked.title': 'Broadcast bloqueado'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing financial trust-layer snippet ${snippet}`);
  }

  assert.ok(css.includes('.web3-trust-board'), 'CSS missing Web3 trust board');
  assert.ok(css.includes('.web3-trust-node summary:focus-visible'), 'CSS missing Web3 trust keyboard focus state');
  assert.ok(css.includes('.web3-trust-asset'), 'CSS missing Web3 trust asset rules');
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'CSS missing reduced-motion media query');

  const asset = manifest.assets.find(item => item.id === 'web3-trust-layer-map');
  assert.ok(asset, 'asset manifest missing Web3 trust-layer map');
  assert.equal(asset.file, 'assets/visuals/web3-trust-layer-map.svg');
  assert.equal(asset.route, '/organisms/financial-organisms');
  assert.equal(asset.surface, '#web3-trust-layer-title');
  assert.match(asset.accessibility, /details\/summary/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'Web3 trust-layer SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'Web3 trust-layer SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'Web3 trust-layer SVG should not embed UI text');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'Web3 trust-layer SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'Web3 trust-layer SVG should be presentational');

  assert.ok(llms.includes('Web3 Trust Layer Map'), 'llms.txt missing Web3 trust-layer map');
  assert.ok(services.includes('"id": "web3_trust_layer_map"'), 'ai-services missing Web3 trust-layer asset');
});

test('financial organisms page exposes an inspectable Web3 simulation console', async () => {
  const source = await readFile(new URL('../organisms/financial-organisms/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/web3-simulation-console.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'class="lab-section web3-simulation-console-section"',
    'aria-labelledby="web3-simulation-console-title"',
    'id="web3-simulation-console-title"',
    'data-asset-id="web3-simulation-console"',
    'assets/visuals/web3-simulation-console.svg',
    'class="web3-simulation-board"',
    'class="web3-simulation-selector"',
    'name="web3-simulation"',
    'id="sim-rebalance"',
    'id="sim-yield"',
    'id="sim-risk"',
    'id="sim-governance"',
    'data-i18n="detail.fo.sim.kicker"',
    'data-i18n="detail.fo.sim.rebalance.authority"',
    'data-i18n="detail.fo.sim.yield.authority"',
    'data-i18n="detail.fo.sim.risk.authority"',
    'data-i18n="detail.fo.sim.governance.authority"',
    'href="/transmissions/23-the-sec-gate-an-organism-that-locks-its-own-hands"',
    'href="/build-with-us"',
    '"@id":"https://www.unwindcode.ai/organisms/financial-organisms/#web3-simulation-console-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/web3-simulation-console.svg"',
  ]) {
    assert.ok(source.includes(snippet), `financial organisms page missing simulation console snippet ${snippet}`);
  }

  for (const snippet of [
    "'detail.fo.sim.kicker': 'Simulation console'",
    "'detail.fo.sim.title': 'Choose a Web3 request and watch authority stop before motion.'",
    "'detail.fo.sim.rebalance.tab': 'Rebalance'",
    "'detail.fo.sim.rebalance.authority': 'No signing, no swap, no broadcast. A human keeps custody and decides whether motion exists.'",
    "'detail.fo.sim.yield.tab': 'Yield route'",
    "'detail.fo.sim.yield.authority': 'No deposits, approvals, allowances, wallet calls, or contract writes are available to the organism.'",
    "'detail.fo.sim.risk.tab': 'Risk alert'",
    "'detail.fo.sim.risk.authority': 'It can alert and recommend a pause; it cannot liquidate, transfer, revoke, or trade without approval.'",
    "'detail.fo.sim.governance.tab': 'Governance'",
    "'detail.fo.sim.governance.authority': 'It prepares reasoning only. Vote signing stays with the authorized human, DAO, or multisig.'",
    "'detail.fo.sim.kicker': 'Consola de simulación'",
    "'detail.fo.sim.title': 'Elige una solicitud Web3 y mira cómo la autoridad se detiene antes del movimiento.'",
    "'detail.fo.sim.rebalance.tab': 'Rebalanceo'",
    "'detail.fo.sim.rebalance.authority': 'Sin firma, sin swap, sin broadcast. Un humano mantiene custodia y decide si existe movimiento.'",
    "'detail.fo.sim.governance.tab': 'Gobernanza'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing financial simulation snippet ${snippet}`);
  }

  for (const snippet of [
    '.web3-simulation-console-section',
    '.web3-simulation-board',
    '.web3-simulation-asset',
    '.web3-simulation-tabs',
    '#sim-rebalance:checked ~ .web3-simulation-tabs label[for="sim-rebalance"]',
    '#sim-governance:checked ~ .web3-simulation-panels .simulation-panel-governance',
    '#sim-risk:focus-visible ~ .web3-simulation-tabs label[for="sim-risk"]',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing Web3 simulation console snippet ${snippet}`);
  }

  const asset = manifest.assets.find(item => item.id === 'web3-simulation-console');
  assert.ok(asset, 'asset manifest missing Web3 simulation console');
  assert.equal(asset.file, 'assets/visuals/web3-simulation-console.svg');
  assert.equal(asset.route, '/organisms/financial-organisms');
  assert.equal(asset.surface, '#web3-simulation-console-title');
  assert.match(asset.accessibility, /native radio controls/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'Web3 simulation SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'Web3 simulation SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'Web3 simulation SVG should not embed UI text');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'Web3 simulation SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'Web3 simulation SVG should be presentational');

  assert.ok(llms.includes('Web3 Simulation Console'), 'llms.txt missing Web3 simulation console');
  assert.ok(services.includes('"id": "web3_simulation_console"'), 'ai-services missing Web3 simulation console');
  assert.ok(services.includes('rebalance, yield route, risk alert, and governance vote requests'), 'ai-services missing simulation request list');
});

test('architecture page explains the organism stack as a bilingual operating model', async () => {
  const source = await readFile(new URL('../architecture/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/cognitive-flow-map.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'data-i18n="archPage.hero.kicker"',
    'data-i18n="archPage.hero.title"',
    'data-i18n="archPage.operating.title"',
    'id="architecture-operating-title"',
    'id="architecture-flow-map-title"',
    'data-asset-id="cognitive-flow-map"',
    'assets/visuals/cognitive-flow-map.svg',
    'class="architecture-flow-board"',
    'class="architecture-flow-node"',
    'data-i18n="archPage.map.gateway.title"',
    'data-i18n="archPage.map.immune.desc"',
    'class="organism-brief-facts"',
    'data-i18n="archPage.fact.trigger.label"',
    'data-i18n="archPage.fact.authority.label"',
    'data-i18n="archPage.fact.evidence.label"',
    'data-i18n="archPage.layers.title"',
    'data-i18n="archPage.layer.cortex.title"',
    'data-i18n="archPage.layer.memory.title"',
    'data-i18n="archPage.layer.gateway.title"',
    'data-i18n="archPage.layer.immune.title"',
    'data-i18n="archPage.layer.cells.title"',
    'data-i18n="archPage.layer.proof.title"',
    'data-i18n="archPage.flow.title"',
    'data-i18n="archPage.step.pause.title"',
    '"@type":"DefinedTermSet"',
    '"hasDefinedTerm"',
    '"name":"Unwind Code Organism Stack"',
    '"name":"Cortex"',
    '"name":"Proof Loop"',
    '"@type":"ImageObject"',
    '"@id":"https://www.unwindcode.ai/architecture/#cognitive-flow-map-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/cognitive-flow-map.svg"',
    '"inLanguage":["en","es"]',
  ]) {
    assert.ok(source.includes(snippet), `architecture page missing operating-model snippet ${snippet}`);
  }

  for (const snippet of [
    "'archPage.hero.kicker': 'Organism stack'",
    "'archPage.operating.title': 'The stack is a governance loop, not a diagram.'",
    "'archPage.fact.trigger.label': 'Trigger'",
    "'archPage.map.kicker': 'Cognitive flow map'",
    "'archPage.map.title': 'Trace one request through the organism before you trust the output.'",
    "'archPage.map.gateway.title': 'Gateway intake'",
    "'archPage.map.immune.title': 'Immune gate'",
    "'archPage.layer.immune.title': 'Immune System'",
    "'archPage.flow.title': 'Why this is different from an app.'",
    "'archPage.hero.kicker': 'Stack del organismo'",
    "'archPage.operating.title': 'El stack es un loop de gobernanza, no un diagrama.'",
    "'archPage.fact.trigger.label': 'Disparo'",
    "'archPage.map.kicker': 'Mapa de flujo cognitivo'",
    "'archPage.map.title': 'Traza una solicitud por el organismo antes de confiar en la salida.'",
    "'archPage.map.gateway.title': 'Entrada por gateway'",
    "'archPage.map.immune.title': 'Compuerta inmune'",
    "'archPage.layer.immune.title': 'Sistema Inmune'",
    "'archPage.flow.title': 'Por qué esto es distinto de una app.'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing architecture operating-model snippet ${snippet}`);
  }

  assert.ok(css.includes('.architecture-flow-board'), 'CSS missing architecture flow board');
  assert.ok(css.includes('.architecture-flow-node summary:focus-visible'), 'CSS missing architecture flow keyboard focus state');
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'CSS missing reduced-motion media query');

  const asset = manifest.assets.find(item => item.id === 'cognitive-flow-map');
  assert.ok(asset, 'asset manifest missing cognitive flow map');
  assert.equal(asset.file, 'assets/visuals/cognitive-flow-map.svg');
  assert.equal(asset.route, '/architecture');
  assert.match(asset.accessibility, /details\/summary/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'cognitive flow SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'cognitive flow SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'cognitive flow SVG should not embed UI text');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'cognitive flow SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'cognitive flow SVG should be presentational');

  assert.ok(llms.includes('Architecture operating model'), 'llms.txt missing architecture operating model');
  assert.ok(llms.includes('Cognitive Flow Map'), 'llms.txt missing cognitive flow map');
  assert.ok(services.includes('"name": "Organism Stack"'), 'ai-services missing Organism Stack term');
  assert.ok(services.includes('"name": "Proof Loop"'), 'ai-services missing Proof Loop term');
  assert.ok(services.includes('"id": "cognitive_flow_map"'), 'ai-services missing cognitive flow asset');
});

test('architecture page exposes a governed organism stack glyph system', async () => {
  const source = await readFile(new URL('../architecture/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/organism-stack-glyphs.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'class="lab-section stack-glyph-section"',
    'aria-labelledby="stack-glyph-title"',
    'id="stack-glyph-title"',
    'data-asset-id="organism-stack-glyphs"',
    'assets/visuals/organism-stack-glyphs.svg',
    'aria-label="Organism stack glyph system"',
    'class="stack-glyph-cards"',
    'class="stack-glyph-card gateway"',
    'class="stack-glyph-card cortex"',
    'class="stack-glyph-card memory"',
    'class="stack-glyph-card cells"',
    'class="stack-glyph-card immune"',
    'class="stack-glyph-card proof"',
    'data-i18n="archPage.glyph.gateway.desc"',
    'data-i18n="archPage.glyph.immune.desc"',
    'data-i18n="archPage.glyph.proofLoop.desc"',
    'href="/proof" data-i18n="archPage.glyph.proof"',
    'href="/build-with-us" data-i18n="archPage.glyph.review"',
    '"@id":"https://www.unwindcode.ai/architecture/#organism-stack-glyphs-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/organism-stack-glyphs.svg"',
  ]) {
    assert.ok(source.includes(snippet), `architecture page missing stack glyph snippet ${snippet}`);
  }

  for (const snippet of [
    "'archPage.glyph.kicker': 'Stack glyph system'",
    "'archPage.glyph.title': 'A builder should recognize the organism layers at a glance.'",
    "'archPage.glyph.gateway.title': 'Gateway'",
    "'archPage.glyph.cortex.title': 'Cortex'",
    "'archPage.glyph.memory.title': 'Memory'",
    "'archPage.glyph.immune.title': 'Immune System'",
    "'archPage.glyph.proofLoop.title': 'Proof Loop'",
    "'archPage.glyph.immune.desc': 'Pauses filesystem writes, public publishing, money movement, Web3 broadcast, and generated code until review passes.'",
    "'archPage.glyph.kicker': 'Sistema de glifos del stack'",
    "'archPage.glyph.title': 'Un builder debe reconocer las capas del organismo de un vistazo.'",
    "'archPage.glyph.cortex.title': 'Córtex'",
    "'archPage.glyph.memory.title': 'Memoria'",
    "'archPage.glyph.cells.title': 'Células'",
    "'archPage.glyph.immune.title': 'Sistema Inmune'",
    "'archPage.glyph.immune.desc': 'Pausa escritura de archivos, publicación pública, movimiento de dinero, broadcast Web3 y código generado hasta que pase la revisión.'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing stack glyph snippet ${snippet}`);
  }

  for (const snippet of [
    '.stack-glyph-section',
    '.stack-glyph-board',
    '.stack-glyph-cards',
    '.stack-glyph-card summary:focus-visible',
    '.stack-glyph-asset',
    '@keyframes stack-glyph-drift',
    '@media (max-width: 900px)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing stack glyph snippet ${snippet}`);
  }

  const asset = manifest.assets.find(item => item.id === 'organism-stack-glyphs');
  assert.ok(asset, 'asset manifest missing organism stack glyphs');
  assert.equal(asset.file, 'assets/visuals/organism-stack-glyphs.svg');
  assert.equal(asset.route, '/architecture');
  assert.equal(asset.surface, '#stack-glyph-title');
  assert.match(asset.accessibility, /details\/summary/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'organism stack glyph SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'organism stack glyph SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'organism stack glyph SVG should not embed UI text');
  assert.ok(svg.includes('viewBox="0 0 1080 680"'), 'organism stack glyph SVG should declare the expected viewBox');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'organism stack glyph SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'organism stack glyph SVG should be presentational');

  assert.ok(llms.includes('Organism Stack Glyphs'), 'llms.txt missing organism stack glyphs');
  assert.ok(services.includes('"id": "organism_stack_glyphs"'), 'ai-services missing organism stack glyphs');
  assert.ok(services.includes('reusable visual system'), 'ai-services missing stack glyph purpose');
});

test('architecture page exposes an inspectable organism run inspector', async () => {
  const source = await readFile(new URL('../architecture/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/architecture-run-inspector.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'class="lab-section architecture-run-section"',
    'aria-labelledby="architecture-run-title"',
    'id="architecture-run-title"',
    'data-asset-id="architecture-run-inspector"',
    'assets/visuals/architecture-run-inspector.svg',
    'class="architecture-run-board"',
    'class="architecture-run-selector"',
    'class="architecture-run-tabs"',
    'id="arch-run-prototype"',
    'id="arch-run-reflection"',
    'id="arch-run-web3"',
    'id="arch-run-evolution"',
    'data-i18n="archPage.run.kicker"',
    'data-i18n="archPage.run.prototype.immune"',
    'data-i18n="archPage.run.web3.immune"',
    'data-i18n="archPage.run.evolution.proof"',
    'href="/proof"',
    'href="/build-with-us"',
    '"@type":"ImageObject"',
    '"@id":"https://www.unwindcode.ai/architecture/#architecture-run-inspector-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/architecture-run-inspector.svg"',
  ]) {
    assert.ok(source.includes(snippet), `architecture page missing run inspector snippet ${snippet}`);
  }

  for (const snippet of [
    "'archPage.run.kicker': 'Run inspector'",
    "'archPage.run.title': 'Choose a request and inspect the stack decision before the organism acts.'",
    "'archPage.run.prototype.tab': 'Prototype'",
    "'archPage.run.reflection.tab': 'Reflection'",
    "'archPage.run.web3.tab': 'Web3 sim'",
    "'archPage.run.evolution.tab': 'Cell growth'",
    "'archPage.run.web3.immune': 'No private keys, wallet signing, broadcast, or money movement are available by default.'",
    "'archPage.run.evolution.immune': 'Generated code stays inert until tests, sandbox evidence, review, and human approval pass.'",
    "'archPage.run.kicker': 'Inspector de ejecución'",
    "'archPage.run.title': 'Elige una solicitud e inspecciona la decisión del stack antes de que el organismo actúe.'",
    "'archPage.run.prototype.tab': 'Prototipo'",
    "'archPage.run.reflection.tab': 'Reflexión'",
    "'archPage.run.web3.tab': 'Sim Web3'",
    "'archPage.run.evolution.tab': 'Crecimiento celular'",
    "'archPage.run.web3.immune': 'No hay llaves privadas, firma de wallet, broadcast ni movimiento de dinero disponibles por defecto.'",
    "'archPage.run.evolution.immune': 'El código generado permanece inerte hasta que pasen tests, evidencia de sandbox, revisión y aprobación humana.'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing architecture run inspector snippet ${snippet}`);
  }

  for (const snippet of [
    '.architecture-run-board',
    '.architecture-run-tabs label:hover',
    '#arch-run-prototype:checked ~ .architecture-run-tabs label[for="arch-run-prototype"]',
    '#arch-run-prototype:focus-visible ~ .architecture-run-tabs label[for="arch-run-prototype"]',
    '#arch-run-web3:checked ~ .architecture-run-panels .run-panel-web3',
    '.architecture-run-panel dl div',
    '.architecture-run-asset',
    'pointer-events: none;',
    'grid-template-columns: repeat(2, minmax(0, 1fr))',
    '@keyframes architecture-run-drift',
    '@media (prefers-reduced-motion: reduce)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing architecture run inspector snippet ${snippet}`);
  }

  const asset = manifest.assets.find(item => item.id === 'architecture-run-inspector');
  assert.ok(asset, 'asset manifest missing architecture run inspector');
  assert.equal(asset.file, 'assets/visuals/architecture-run-inspector.svg');
  assert.equal(asset.route, '/architecture');
  assert.equal(asset.surface, '#architecture-run-title');
  assert.match(asset.accessibility, /native radio controls/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'architecture run inspector SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'architecture run inspector SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'architecture run inspector SVG should not embed UI text');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'architecture run inspector SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'architecture run inspector SVG should be presentational');

  assert.ok(llms.includes('Architecture Run Inspector'), 'llms.txt missing architecture run inspector');
  assert.ok(services.includes('"id": "architecture_run_inspector"'), 'ai-services missing architecture run inspector');
  assert.ok(services.includes('prototype, reflection, Web3 simulation, and cell evolution requests'), 'ai-services missing run inspector request list');
});

test('architecture page exposes a governed memory continuity map', async () => {
  const source = await readFile(new URL('../architecture/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/memory-continuity-map.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'class="lab-section memory-continuity-section"',
    'aria-labelledby="memory-continuity-title"',
    'id="memory-continuity-title"',
    'data-asset-id="memory-continuity-map"',
    'assets/visuals/memory-continuity-map.svg',
    'class="memory-continuity-board"',
    'class="memory-continuity-node"',
    'data-i18n="archPage.memory.kicker"',
    'data-i18n="archPage.memory.title"',
    'data-i18n="archPage.memory.working.title"',
    'data-i18n="archPage.memory.boundary.desc"',
    'href="/transmissions/21-the-unwind-brain-checkpoint-white-paper"',
    'href="/build-with-us"',
    '"@type":"ImageObject"',
    '"@id":"https://www.unwindcode.ai/architecture/#memory-continuity-map-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/memory-continuity-map.svg"',
  ]) {
    assert.ok(source.includes(snippet), `architecture page missing memory continuity snippet ${snippet}`);
  }

  for (const snippet of [
    "'archPage.memory.kicker': 'Memory continuity map'",
    "'archPage.memory.title': 'Memory is the continuity layer, not a pile of notes.'",
    "'archPage.memory.working.title': 'Working context'",
    "'archPage.memory.semantic.title': 'Semantic memory'",
    "'archPage.memory.boundary.title': 'Retention boundary'",
    "'archPage.memory.kicker': 'Mapa de continuidad de memoria'",
    "'archPage.memory.title': 'La memoria es la capa de continuidad, no una pila de notas.'",
    "'archPage.memory.working.title': 'Contexto de trabajo'",
    "'archPage.memory.semantic.title': 'Memoria semántica'",
    "'archPage.memory.boundary.title': 'Límite de retención'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing memory continuity snippet ${snippet}`);
  }

  assert.ok(css.includes('.memory-continuity-board'), 'CSS missing memory continuity board');
  assert.ok(css.includes('.memory-continuity-node summary:focus-visible'), 'CSS missing memory continuity keyboard focus state');
  assert.ok(css.includes('.memory-continuity-asset'), 'CSS missing memory continuity asset rules');
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'CSS missing reduced-motion media query');

  const asset = manifest.assets.find(item => item.id === 'memory-continuity-map');
  assert.ok(asset, 'asset manifest missing memory continuity map');
  assert.equal(asset.file, 'assets/visuals/memory-continuity-map.svg');
  assert.equal(asset.route, '/architecture');
  assert.equal(asset.surface, '#memory-continuity-title');
  assert.match(asset.accessibility, /details\/summary/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'memory continuity SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'memory continuity SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'memory continuity SVG should not embed UI text');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'memory continuity SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'memory continuity SVG should be presentational');

  assert.ok(llms.includes('Memory Continuity Map'), 'llms.txt missing memory continuity map');
  assert.ok(services.includes('"id": "memory_continuity_map"'), 'ai-services missing memory continuity asset');
});

test('homepage organism cards link to durable pages with status and safety context', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');

  for (const snippet of [
    'href="/organisms/visual-cortex"',
    'href="/organisms/infinity-mirror"',
    'href="/organisms/financial-organisms"',
    'href="/organisms/brain-cell-architecture"',
    'href="/organisms/research-organisms"',
    'class="organism-link"',
    'data-i18n="org.vc.status"',
    'data-i18n="org.im.status"',
    'data-i18n="org.fo.status"',
    'data-i18n="org.bc.status"',
    'data-i18n="org.ro.status"',
    'data-i18n="org.vc.boundary"',
    'data-i18n="org.im.boundary"',
    'data-i18n="org.fo.boundary"',
    'data-i18n="org.bc.boundary"',
    'data-i18n="org.ro.boundary"',
    'data-i18n="org.ro.desc"',
    'data-i18n="org.card.cta"',
    'class="organism-card organism-card-wide',
    'Some are product prototypes. Some',
    'simulate Web3 boundaries',
    'A Web3 research lane that interprets risk, simulates routes, and prepares unsigned review packets',
    'no private keys, no hidden wallet path, no broadcast by default',
    'A source-bound research lane for turning AI patterns, backend behavior, Web3 signals, product questions, and cultural intelligence into caveated maps, experiments, and publication-ready proof.',
  ]) {
    assert.ok(source.includes(snippet), `homepage missing organism card snippet ${snippet}`);
  }

  for (const snippet of [
    "'org.desc': \"Most software is built to be used. Ours is built to be alive.",
    'Some simulate Web3 boundaries. All of them get safer when proof is visible.',
    "'org.vc.status': 'Prototype'",
    "'org.im.status': 'Prototype'",
    "'org.fo.status': 'Research'",
    "'org.fo.desc': \"A Web3 research lane that interprets risk, simulates routes, and prepares unsigned review packets",
    "'org.bc.status': 'Experimental'",
    "'org.ro.status': 'Research'",
    "'org.ro.boundary': 'Source-bound claims'",
    "'org.ro.desc': 'A source-bound research lane for turning AI patterns, backend behavior, Web3 signals, product questions, and cultural intelligence into caveated maps, experiments, and publication-ready proof.'",
    "'org.card.cta': 'Explore organism'",
    'Algunos simulan límites Web3. Todos se vuelven más seguros cuando la prueba es visible.',
    "'org.vc.status': 'Prototipo'",
    "'org.im.status': 'Prototipo'",
    "'org.fo.status': 'Investigación'",
    "'org.fo.desc': 'Una ruta de investigación Web3 que interpreta riesgo, simula rutas y prepara paquetes de revisión sin firma",
    "'org.bc.status': 'Experimental'",
    "'org.ro.status': 'Investigación'",
    "'org.ro.boundary': 'Claims atados a fuentes'",
    "'org.card.cta': 'Explora el organismo'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing organism card snippet ${snippet}`);
  }

  for (const forbidden of [
    'Live across Monad',
    'Real markets',
    'Some live on-chain',
    'Activos en Monad',
    'Mercados reales',
    'Algunos viven on-chain',
  ]) {
    assert.equal(source.includes(forbidden), false, `homepage should not include unbounded organism claim ${forbidden}`);
    assert.equal(i18n.includes(forbidden), false, `i18n should not include unbounded organism claim ${forbidden}`);
  }
});

test('homepage exposes an organism readiness radar before deeper architecture', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/organism-readiness-radar.svg', import.meta.url), 'utf8');

  const organismsIndex = source.indexOf('id="organisms"');
  const readinessIndex = source.indexOf('id="organism-readiness-title"');
  const architectureIndex = source.indexOf('id="architecture"');
  assert.ok(organismsIndex > -1, 'homepage missing organisms section');
  assert.ok(readinessIndex > organismsIndex, 'readiness radar should live inside the organism product surface');
  assert.ok(architectureIndex > readinessIndex, 'readiness radar should appear before deeper architecture');

  for (const snippet of [
    'data-asset-id="organism-readiness-radar"',
    'assets/visuals/organism-readiness-radar.svg',
    'aria-labelledby="organism-readiness-title"',
    'id="organism-readiness-title"',
    'name="organism-readiness"',
    'id="readiness-visual-cortex"',
    'id="readiness-infinity-mirror"',
    'id="readiness-financial-organisms"',
    'id="readiness-brain-cell"',
    'id="readiness-research-organisms"',
    'data-i18n="org.readiness.kicker"',
    'data-i18n="org.readiness.vc.proof"',
    'data-i18n="org.readiness.im.boundary"',
    'data-i18n="org.readiness.fo.boundary"',
    'data-i18n="org.readiness.bc.proof"',
    'data-i18n="org.readiness.ro.proof"',
    'href="/organisms/visual-cortex"',
    'href="/organisms/infinity-mirror"',
    'href="/organisms/financial-organisms"',
    'href="/organisms/brain-cell-architecture"',
    'href="/organisms/research-organisms"',
    '"@id":"https://www.unwindcode.ai/#organism-readiness-radar-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/organism-readiness-radar.svg"',
  ]) {
    assert.ok(source.includes(snippet), `homepage missing readiness radar snippet ${snippet}`);
  }

  for (const snippet of [
    "'org.readiness.kicker': 'Readiness radar'",
    "'org.readiness.title': 'What can be inspected today?'",
    "'org.readiness.vc.status': 'Prototype'",
    "'org.readiness.im.status': 'Prototype'",
    "'org.readiness.fo.status': 'Research'",
    "'org.readiness.bc.status': 'Experimental'",
    "'org.readiness.ro.status': 'Research'",
    "'org.readiness.fo.boundary': 'No private keys, no hidden wallet path, no live money motion, and no broadcast by default.'",
    "'org.readiness.ro.boundary': 'Speculation stays labeled, sources stay visible, and public claims wait for human review.'",
    "'org.readiness.kicker': 'Radar de preparación'",
    "'org.readiness.title': '¿Qué se puede inspeccionar hoy?'",
    "'org.readiness.vc.status': 'Prototipo'",
    "'org.readiness.im.status': 'Prototipo'",
    "'org.readiness.fo.status': 'Investigación'",
    "'org.readiness.bc.status': 'Experimental'",
    "'org.readiness.ro.status': 'Investigación'",
    "'org.readiness.fo.boundary': 'Sin llaves privadas, sin ruta oculta de wallet, sin movimiento de dinero real y sin broadcast por defecto.'",
    "'org.readiness.ro.boundary': 'La especulación queda etiquetada, las fuentes siguen visibles y los claims públicos esperan revisión humana.'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing readiness radar snippet ${snippet}`);
  }

  for (const snippet of [
    '.organism-readiness-console',
    '.organism-readiness-selector',
    '.organism-readiness-tabs',
    '#readiness-visual-cortex:focus-visible',
    '#readiness-research-organisms:focus-visible',
    '.organism-readiness-asset',
    '.organism-card-wide',
    '@media (max-width: 900px)',
    '@media (max-width: 640px)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing readiness radar snippet ${snippet}`);
  }

  const asset = manifest.assets.find(item => item.id === 'organism-readiness-radar');
  assert.ok(asset, 'asset manifest missing organism readiness radar');
  assert.equal(asset.file, 'assets/visuals/organism-readiness-radar.svg');
  assert.equal(asset.route, '/');
  assert.equal(asset.surface, '#organism-readiness-title');
  assert.match(asset.purpose, /Research Organisms/);
  assert.match(asset.trust_value, /source caveats/);
  assert.match(asset.accessibility, /native radio inputs/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'organism readiness SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'organism readiness SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'organism readiness SVG should not embed UI text');
  assert.ok(svg.includes('viewBox="0 0 1080 680"'), 'organism readiness SVG should declare the expected viewBox');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'organism readiness SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'organism readiness SVG should be presentational');

  assert.ok(llms.includes('Organism Readiness Radar'), 'llms.txt missing organism readiness radar');
  assert.ok(llms.includes('source caveats, publication gates'), 'llms.txt missing Research Organisms readiness boundary');
  assert.ok(services.includes('"id": "organism_readiness_radar"'), 'ai-services missing organism readiness radar asset');
  assert.ok(services.includes('Brain Cell Architecture, and Research Organisms'), 'ai-services missing five-organism readiness purpose');
});

test('homepage architecture section exposes a proof runway before memory detail', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/architecture-proof-runway.svg', import.meta.url), 'utf8');

  const architectureIndex = source.indexOf('id="architecture"');
  const runwayIndex = source.indexOf('id="architecture-runway-title"');
  const memoryIndex = source.indexOf('data-i18n="arch.mem.title"');
  assert.ok(architectureIndex > -1, 'homepage missing architecture section');
  assert.ok(runwayIndex > architectureIndex, 'architecture runway should live inside the architecture section');
  assert.ok(memoryIndex > runwayIndex, 'architecture runway should appear before the memory detail grid');

  for (const snippet of [
    'class="architecture-runway reveal"',
    'data-asset-id="architecture-proof-runway"',
    'aria-labelledby="architecture-runway-title"',
    'assets/visuals/architecture-proof-runway.svg',
    'id="architecture-runway-title"',
    'class="architecture-runway-steps"',
    'data-i18n="arch.runway.kicker"',
    'data-i18n="arch.runway.signal.title"',
    'data-i18n="arch.runway.context.title"',
    'data-i18n="arch.runway.cells.title"',
    'data-i18n="arch.runway.gate.title"',
    'data-i18n="arch.runway.proof.title"',
    'href="/architecture"',
    '"@id":"https://www.unwindcode.ai/#architecture-proof-runway-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/architecture-proof-runway.svg"',
  ]) {
    assert.ok(source.includes(snippet), `homepage missing architecture runway snippet ${snippet}`);
  }

  for (const snippet of [
    "'arch.runway.kicker': 'Architecture runway'",
    "'arch.runway.title': 'A request only earns action after it survives the loop.'",
    "'arch.runway.signal.title': 'Gateway signal'",
    "'arch.runway.context.title': 'Context fence'",
    "'arch.runway.cells.title': 'Specialist cells'",
    "'arch.runway.gate.title': 'Immune decision'",
    "'arch.runway.proof.title': 'Proof output'",
    "'arch.runway.gate.desc': 'Money, files, public posts, and Web3 broadcast pause for approval.'",
    "'arch.runway.kicker': 'Pista de arquitectura'",
    "'arch.runway.title': 'Una petición solo gana acción después de sobrevivir el loop.'",
    "'arch.runway.signal.title': 'Señal de gateway'",
    "'arch.runway.context.title': 'Cerca de contexto'",
    "'arch.runway.cells.title': 'Células especialistas'",
    "'arch.runway.gate.title': 'Decisión inmune'",
    "'arch.runway.proof.title': 'Salida de prueba'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing architecture runway snippet ${snippet}`);
  }

  for (const snippet of [
    '.architecture-runway',
    '.architecture-runway-visual',
    '.architecture-runway-asset',
    '.architecture-runway-core',
    '.architecture-runway-steps',
    '@media (max-width: 900px)',
    '@media (max-width: 640px)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing architecture runway snippet ${snippet}`);
  }

  const asset = manifest.assets.find(item => item.id === 'architecture-proof-runway');
  assert.ok(asset, 'asset manifest missing architecture proof runway');
  assert.equal(asset.file, 'assets/visuals/architecture-proof-runway.svg');
  assert.equal(asset.route, '/');
  assert.equal(asset.surface, '#architecture-runway-title');
  assert.match(asset.accessibility, /ordered step list/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'architecture runway SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'architecture runway SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'architecture runway SVG should not embed UI text');
  assert.ok(svg.includes('viewBox="0 0 1080 680"'), 'architecture runway SVG should declare the expected viewBox');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'architecture runway SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'architecture runway SVG should be presentational');

  assert.ok(llms.includes('Architecture Proof Runway'), 'llms.txt missing architecture proof runway');
  assert.ok(services.includes('"id": "architecture_proof_runway"'), 'ai-services missing architecture proof runway asset');
});

test('homepage exposes a motion contract ledger before expanding visual motion', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const servicesJson = JSON.parse(services);

  const architectureIndex = source.indexOf('id="architecture"');
  const runwayIndex = source.indexOf('id="architecture-runway-title"');
  const motionIndex = source.indexOf('id="motion-contract-title"');
  const memoryIndex = source.indexOf('data-i18n="arch.mem.title"');
  assert.ok(architectureIndex > -1, 'homepage missing architecture section');
  assert.ok(motionIndex > runwayIndex, 'motion contract should follow the proof runway');
  assert.ok(memoryIndex > motionIndex, 'motion contract should appear before memory detail');

  for (const snippet of [
    'id="motion-contract-ledger"',
    'class="homepage-motion-contract reveal"',
    'aria-labelledby="motion-contract-title"',
    'class="homepage-motion-contract-grid"',
    'data-i18n="motion.contract.kicker"',
    'data-i18n="motion.contract.signal.title"',
    'data-i18n="motion.contract.focus.title"',
    'data-i18n="motion.contract.boundary.title"',
    'data-i18n="motion.contract.shutdown.title"',
    'data-i18n="motion.contract.meta.allowed"',
    'data-i18n="motion.contract.meta.proof"',
  ]) {
    assert.ok(source.includes(snippet), `homepage missing motion contract snippet ${snippet}`);
  }

  for (const snippet of [
    "'motion.contract.kicker': 'Motion contract'",
    "'motion.contract.title': 'Every movement has to explain the organism.'",
    "'motion.contract.signal.title': 'Pulse means work entered the system.'",
    "'motion.contract.focus.allowed': 'Opacity and transform-only reveals that preserve reading order and hash targets.'",
    "'motion.contract.boundary.allowed': 'Small state changes that clarify approval gates for files, money, publishing, Web3 broadcast, and generated capability.'",
    "'motion.contract.shutdown.title': 'Reduced motion is a first-class route.'",
    "'motion.contract.shutdown.allowed': 'Static fallbacks, frozen loops, no scroll hijack, no WebGL requirement, and no motion-only proof.'",
    "'motion.contract.kicker': 'Contrato de movimiento'",
    "'motion.contract.title': 'Cada movimiento debe explicar el organismo.'",
    "'motion.contract.signal.title': 'El pulso significa que el trabajo entró al sistema.'",
    "'motion.contract.shutdown.title': 'Movimiento reducido es una ruta de primera clase.'",
    "'motion.contract.shutdown.allowed': 'Fallbacks estáticos, loops congelados, sin scroll hijack, sin requisito WebGL y sin prueba solo en movimiento.'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing motion contract snippet ${snippet}`);
  }

  for (const snippet of [
    '.homepage-motion-contract',
    '.homepage-motion-contract::before',
    '.homepage-motion-contract-header',
    '.homepage-motion-contract-grid',
    '.homepage-motion-contract-grid li',
    '.homepage-motion-contract-grid dd',
    '@media (max-width: 900px)',
    '@media (max-width: 640px)',
    '@media (prefers-reduced-motion: reduce)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing motion contract snippet ${snippet}`);
  }

  const motionAsset = servicesJson.immersive_assets.find(item => item.id === 'homepage_motion_contract');
  assert.ok(motionAsset, 'ai-services missing homepage motion contract');
  assert.equal(motionAsset.route, 'https://www.unwindcode.ai/#motion-contract-title');
  assert.equal(motionAsset.asset, 'semantic-html');
  assert.match(motionAsset.purpose, /signal, focus, authority boundary, proof return, and shutdown/);
  assert.match(motionAsset.trust_boundary, /No runtime-only proof/);
  assert.match(motionAsset.motion_policy, /reduced-motion safe/);
  assert.match(motionAsset.motion_policy, /no WebGL requirement/);

  assert.equal(servicesJson.organisms.find(item => item.name === 'Visual Cortex').status, 'prototype');
  assert.equal(servicesJson.organisms.find(item => item.name === 'Brain Cell Architecture').status, 'experimental');
  assert.equal(servicesJson.vision_roadmap.find(item => item.name === 'Visual Cortex').stage, 'prototype');
  assert.equal(servicesJson.vision_roadmap.find(item => item.name === 'Brain Cell Architecture').stage, 'experimental');

  assert.ok(llms.includes('Homepage Motion Contract Ledger'), 'llms.txt missing homepage motion contract');
  assert.ok(llms.includes('no motion-only proof'), 'llms.txt missing motion-only proof boundary');
});

test('homepage exposes a living system state console before doctrine', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const servicesJson = JSON.parse(services);
  const audit = await readFile(new URL('../assets/specs/unwindcode-experience-evolution-audit.md', import.meta.url), 'utf8');

  const architectureIndex = source.indexOf('id="architecture"');
  const systemStateIndex = source.indexOf('id="system-state"');
  const philosophyIndex = source.indexOf('id="philosophy"');
  assert.ok(systemStateIndex > architectureIndex, 'system state console should follow architecture proof surfaces');
  assert.ok(philosophyIndex > systemStateIndex, 'system state console should appear before deeper doctrine');

  for (const snippet of [
    'id="system-state"',
    'class="system-state"',
    'aria-labelledby="system-state-title"',
    'id="system-state-title"',
    'class="system-state-console reveal"',
    'data-i18n-aria-label="system.state.console.aria"',
    'class="system-state-grid reveal"',
    'data-system-state="live"',
    'data-system-state="prototype"',
    'data-system-state="research"',
    'data-i18n="system.state.routes.title"',
    'data-i18n="system.state.gateway.title"',
    'data-i18n="system.state.transmissions.title"',
    'data-i18n="system.state.web3.title"',
    'data-i18n="system.state.subscribe.title"',
    'href="/organisms"',
    'href="#cta"',
    'href="/transmissions"',
    'href="/organisms/financial-organisms"',
    'href="/build-with-us"',
  ]) {
    assert.ok(source.includes(snippet), `homepage missing system state snippet ${snippet}`);
  }

  for (const snippet of [
    "'system.state.kicker': 'Living system state'",
    "'system.state.title': 'The organism exposes its state before it asks for trust.'",
    "'system.state.core.title': 'Signal → route → proof'",
    "'system.state.routes.status': 'Live'",
    "'system.state.gateway.status': 'Prototype'",
    "'system.state.web3.status': 'Research'",
    "'system.state.gateway.boundary': 'It can explain and route; it cannot write files, spend money, post, pull private data, or broadcast Web3 motion.'",
    "'system.state.kicker': 'Estado del sistema vivo'",
    "'system.state.title': 'El organismo expone su estado antes de pedir confianza.'",
    "'system.state.core.title': 'Señal → ruta → prueba'",
    "'system.state.routes.status': 'Live'",
    "'system.state.gateway.status': 'Prototipo'",
    "'system.state.web3.status': 'Investigación'",
    "'system.state.gateway.boundary': 'Puede explicar y enrutar; no puede escribir archivos, gastar dinero, publicar, extraer datos privados ni hacer broadcast Web3.'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing system state snippet ${snippet}`);
  }

  for (const snippet of [
    '.system-state',
    '.system-state-layout',
    '.system-state-console',
    '.system-state-console::after',
    '.system-state-core',
    '.system-state-flow',
    '.system-state-grid',
    '.system-state-card',
    '.system-state-card[data-system-state="prototype"]',
    '.system-state-card[data-system-state="research"]',
    '@keyframes system-state-scan',
    '@keyframes system-state-breathe',
    '@media (max-width: 900px)',
    '@media (max-width: 640px)',
    '@media (prefers-reduced-motion: reduce)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing system state snippet ${snippet}`);
  }

  const systemStateAsset = servicesJson.immersive_assets.find(item => item.id === 'homepage_system_state_console');
  assert.ok(systemStateAsset, 'ai-services missing homepage system state console');
  assert.equal(systemStateAsset.route, 'https://www.unwindcode.ai/#system-state-title');
  assert.equal(systemStateAsset.asset, 'semantic-html');
  assert.equal(systemStateAsset.status, 'prototype');
  assert.match(systemStateAsset.purpose, /live organism routes/);
  assert.match(systemStateAsset.trust_boundary, /not telemetry/);
  assert.match(systemStateAsset.trust_boundary, /cannot store private data/);
  assert.match(systemStateAsset.motion_policy, /intake, public memory, authority boundary, and proof return/);

  assert.ok(llms.includes('System State Console'), 'llms.txt missing system state console');
  assert.ok(llms.includes('public organism routes are Live'), 'llms.txt missing live route state');
  assert.ok(llms.includes('Conversation Gateway is Prototype'), 'llms.txt missing gateway state');
  assert.ok(llms.includes('Web3 simulation lane is Research'), 'llms.txt missing Web3 state');
  assert.ok(audit.includes('| System State Console | Current operating reality across routes, gateway, transmissions, Web3 simulation, and intake | Mixed: Live, Prototype, Research |'), 'audit missing system state matrix row');
});

test('homepage philosophy section exposes the prime directive as product doctrine', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/homepage-doctrine-gateway.svg', import.meta.url), 'utf8');

  const philosophyIndex = source.indexOf('id="philosophy"');
  const doctrineIndex = source.indexOf('id="homepage-doctrine-title"');
  const principlesIndex = source.indexOf('class="principles"');
  const visionIndex = source.indexOf('id="vision"');
  assert.ok(philosophyIndex > -1, 'homepage missing philosophy section');
  assert.ok(doctrineIndex > philosophyIndex, 'doctrine gateway should live inside the homepage philosophy section');
  assert.ok(principlesIndex > doctrineIndex, 'doctrine gateway should appear before generic principles');
  assert.ok(visionIndex > doctrineIndex, 'doctrine gateway should appear before future vision');

  for (const snippet of [
    'class="homepage-doctrine-gateway reveal"',
    'data-asset-id="homepage-doctrine-gateway"',
    'aria-labelledby="homepage-doctrine-title"',
    'assets/visuals/homepage-doctrine-gateway.svg',
    'id="homepage-doctrine-title"',
    'class="homepage-doctrine-controls"',
    'data-i18n="phil.gateway.kicker"',
    'data-i18n="phil.gateway.armor.label"',
    'data-i18n="phil.gateway.clarity.label"',
    'data-i18n="phil.gateway.authority.label"',
    'data-i18n="phil.gateway.proof.label"',
    'href="/philosophy"',
    '"@id":"https://www.unwindcode.ai/#homepage-doctrine-gateway-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/homepage-doctrine-gateway.svg"',
  ]) {
    assert.ok(source.includes(snippet), `homepage missing doctrine gateway snippet ${snippet}`);
  }

  for (const snippet of [
    "'phil.gateway.kicker': 'Operating doctrine'",
    "'phil.gateway.title': 'The organism is only useful if it protects the human.'",
    "'phil.gateway.desc': 'The prime directive is not mood. It becomes product law: money protects agency, clarity comes before motion, public proof limits claims, and high-risk authority stays human-approved.'",
    "'phil.gateway.armor.label': 'Armor'",
    "'phil.gateway.clarity.label': 'Clarity'",
    "'phil.gateway.authority.label': 'Authority'",
    "'phil.gateway.proof.label': 'Proof'",
    "'phil.gateway.authority.desc': 'Files, money, public posts, and Web3 broadcast pause for approval.'",
    "'phil.gateway.kicker': 'Doctrina operativa'",
    "'phil.gateway.title': 'El organismo solo sirve si protege al humano.'",
    "'phil.gateway.armor.label': 'Armadura'",
    "'phil.gateway.clarity.label': 'Claridad'",
    "'phil.gateway.authority.label': 'Autoridad'",
    "'phil.gateway.proof.label': 'Prueba'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing doctrine gateway snippet ${snippet}`);
  }

  for (const snippet of [
    '.homepage-doctrine-gateway',
    '.homepage-doctrine-visual',
    '.homepage-doctrine-asset',
    '.homepage-doctrine-core',
    '.homepage-doctrine-controls',
    '@media (max-width: 900px)',
    '@media (max-width: 640px)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing doctrine gateway snippet ${snippet}`);
  }

  const asset = manifest.assets.find(item => item.id === 'homepage-doctrine-gateway');
  assert.ok(asset, 'asset manifest missing homepage doctrine gateway');
  assert.equal(asset.file, 'assets/visuals/homepage-doctrine-gateway.svg');
  assert.equal(asset.route, '/');
  assert.equal(asset.surface, '#homepage-doctrine-title');
  assert.match(asset.accessibility, /definition list/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'homepage doctrine SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'homepage doctrine SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'homepage doctrine SVG should not embed UI text');
  assert.ok(svg.includes('viewBox="0 0 1080 680"'), 'homepage doctrine SVG should declare the expected viewBox');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'homepage doctrine SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'homepage doctrine SVG should be presentational');

  assert.ok(llms.includes('Homepage Doctrine Gateway'), 'llms.txt missing homepage doctrine gateway');
  assert.ok(services.includes('"id": "homepage_doctrine_gateway"'), 'ai-services missing homepage doctrine gateway asset');
});

test('organism index exposes a governed fit matrix for choosing the right organism path', async () => {
  const source = await readFile(new URL('../organisms/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/organism-fit-matrix.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'class="lab-section organism-fit-section"',
    'aria-labelledby="organism-fit-title"',
    'id="organism-fit-title"',
    'data-asset-id="organism-fit-matrix"',
    '/assets/visuals/organism-fit-matrix.svg',
    'aria-label="Organism fit comparison matrix"',
    'name="organism-fit"',
    'id="fit-visual-cortex"',
    'id="fit-infinity-mirror"',
    'id="fit-financial-organisms"',
    'id="fit-brain-cell"',
    'data-i18n="orgIndex.fit.vc.title"',
    'data-i18n="orgIndex.fit.im.boundary"',
    'data-i18n="orgIndex.fit.fo.proof"',
    'data-i18n="orgIndex.fit.bc.cta"',
    'href="/organisms/visual-cortex"',
    'href="/organisms/infinity-mirror"',
    'href="/organisms/financial-organisms"',
    'href="/organisms/brain-cell-architecture"',
    '"@id":"https://www.unwindcode.ai/organisms/#organism-fit-matrix-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/organism-fit-matrix.svg"',
  ]) {
    assert.ok(source.includes(snippet), `organism index missing fit matrix snippet ${snippet}`);
  }

  for (const snippet of [
    "'orgIndex.fit.title': 'Choose the organism by intent, authority, and proof.'",
    "'orgIndex.fit.vc.status': 'Prototype'",
    "'orgIndex.fit.im.status': 'Prototype'",
    "'orgIndex.fit.fo.status': 'Research'",
    "'orgIndex.fit.bc.status': 'Experimental'",
    "'orgIndex.fit.fo.boundary': 'No private keys, no hidden broadcast path, no live money motion by default.'",
    "'orgIndex.fit.title': 'Elige el organismo por intención, autoridad y prueba.'",
    "'orgIndex.fit.vc.status': 'Prototipo'",
    "'orgIndex.fit.im.status': 'Prototipo'",
    "'orgIndex.fit.fo.status': 'Investigación'",
    "'orgIndex.fit.bc.status': 'Experimental'",
    "'orgIndex.fit.fo.boundary': 'Sin llaves privadas, sin ruta oculta de broadcast, sin movimiento de dinero por defecto.'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing organism fit snippet ${snippet}`);
  }

  assert.ok(css.includes('.organism-fit-section'), 'CSS missing organism fit section');
  assert.ok(css.includes('.organism-fit-selector'), 'CSS missing organism fit selector');
  assert.ok(css.includes('#fit-visual-cortex:focus-visible'), 'CSS missing organism fit keyboard focus state');
  assert.ok(css.includes('@media (max-width: 640px)'), 'CSS missing organism fit mobile rules');
  assert.ok(css.includes('.organism-fit-asset'), 'CSS missing organism fit asset rules');

  const asset = manifest.assets.find(item => item.id === 'organism-fit-matrix');
  assert.ok(asset, 'asset manifest missing organism fit matrix');
  assert.equal(asset.file, 'assets/visuals/organism-fit-matrix.svg');
  assert.equal(asset.route, '/organisms');
  assert.equal(asset.surface, '#organism-fit-title');
  assert.match(asset.accessibility, /native radio inputs/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'organism fit SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'organism fit SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'organism fit SVG should not embed UI text');
  assert.ok(svg.includes('viewBox="0 0 1080 720"'), 'organism fit SVG should declare the expected viewBox');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'organism fit SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'organism fit SVG should be presentational');

  assert.ok(llms.includes('Organism Fit Matrix'), 'llms.txt missing organism fit matrix');
  assert.ok(services.includes('"id": "organism_fit_matrix"'), 'ai-services missing organism fit matrix asset');
});

test('organism index exposes a canonical state ledger for proof-bound organism maturity', async () => {
  const source = await readFile(new URL('../organisms/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));

  for (const snippet of [
    'class="lab-section organism-state-ledger-section"',
    'aria-labelledby="organism-state-ledger-title"',
    'id="organism-state-ledger-title"',
    'class="organism-state-ledger"',
    'role="list"',
    'state-prototype',
    'state-research',
    'state-experimental',
    'state-live',
    'data-i18n="orgIndex.state.vc.state"',
    'data-i18n="orgIndex.state.im.state"',
    'data-i18n="orgIndex.state.fo.state"',
    'data-i18n="orgIndex.state.bc.state"',
    'data-i18n="orgIndex.state.ro.state"',
    'data-i18n="orgIndex.state.proofLoop.state"',
    'data-i18n="orgIndex.state.system"',
    'data-i18n="orgIndex.state.proof"',
    'data-i18n="orgIndex.state.blocked"',
    'href="/organisms/visual-cortex/#visual-cortex-packet-title"',
    'href="/organisms/infinity-mirror/experience"',
    'href="/organisms/financial-organisms/#web3-simulation-console-title"',
    'href="/organisms/brain-cell-architecture/#brain-cell-runtime-title"',
    'href="/organisms/research-organisms/#research-organisms-capability-title"',
    'href="/proof"',
  ]) {
    assert.ok(source.includes(snippet), `organism index missing state ledger snippet ${snippet}`);
  }

  for (const snippet of [
    "'orgIndex.state.title': 'What is real now, what is still bounded.'",
    "'orgIndex.state.vc.state': 'Prototype'",
    "'orgIndex.state.im.state': 'Prototype'",
    "'orgIndex.state.fo.state': 'Research'",
    "'orgIndex.state.bc.state': 'Experimental'",
    "'orgIndex.state.ro.state': 'Research'",
    "'orgIndex.state.proofLoop.state': 'Live'",
    "'orgIndex.state.vc.blocked': 'No public posting, spending, or filesystem write without human approval.'",
    "'orgIndex.state.fo.blocked': 'No private keys, hidden wallet path, live money motion, or transaction broadcast.'",
    "'orgIndex.state.title': 'Qué es real ahora y qué sigue limitado.'",
    "'orgIndex.state.vc.state': 'Prototipo'",
    "'orgIndex.state.im.state': 'Prototipo'",
    "'orgIndex.state.fo.state': 'Investigación'",
    "'orgIndex.state.bc.state': 'Experimental'",
    "'orgIndex.state.ro.state': 'Investigación'",
    "'orgIndex.state.proofLoop.state': 'Live'",
    "'orgIndex.state.vc.blocked': 'Sin publicación pública, gasto ni escritura al filesystem sin aprobación humana.'",
    "'orgIndex.state.fo.blocked': 'Sin llaves privadas, ruta oculta de wallet, movimiento de dinero en vivo ni broadcast de transacción.'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing state ledger snippet ${snippet}`);
  }

  for (const snippet of [
    '.organism-state-ledger-section',
    '.organism-state-row',
    '.organism-state-code',
    '.organism-state-row.state-prototype .organism-state-code',
    '.organism-state-row.state-research .organism-state-code',
    '.organism-state-row.state-experimental .organism-state-code',
    '.organism-state-row.state-live .organism-state-code',
    '@media (max-width: 900px)',
    '@media (max-width: 640px)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing state ledger snippet ${snippet}`);
  }

  assert.ok(llms.includes('Organism State Ledger'), 'llms.txt missing organism state ledger');
  assert.ok(llms.includes('Concept, Research, Prototype, Experimental, and Live state language'), 'llms.txt missing canonical state language');
  assert.ok(services.includes('"id": "organism_state_ledger"'), 'ai-services missing organism state ledger');
  assert.ok(services.includes('canonical Prototype, Research, Experimental, and Live state labels'), 'ai-services missing state labels');
  assert.ok(services.includes('not live telemetry and does not grant autonomy'), 'ai-services missing state ledger authority boundary');

  const asset = manifest.assets.find(item => item.id === 'organism-state-ledger');
  assert.ok(asset, 'asset manifest missing organism state ledger');
  assert.equal(asset.file, 'organisms/index.html#organism-state-ledger-title');
  assert.equal(asset.route, '/organisms');
  assert.equal(asset.surface, '#organism-state-ledger-title');
  assert.equal(asset.format, 'semantic/html');
  assert.match(asset.trust_value, /Prototype, Financial Organisms are Research, Brain Cell Architecture is Experimental, and the Public Proof Loop is Live/);
  assert.match(asset.accessibility, /definition lists/);
  assert.match(asset.motion_policy, /No runtime motion/);
  assert.deepEqual(asset.performance.dependencies, []);
});

test('organism index exposes an identity constellation for the four organism paths', async () => {
  const source = await readFile(new URL('../organisms/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/organism-identity-constellation.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'class="lab-section organism-identity-section"',
    'aria-labelledby="organism-identity-title"',
    'id="organism-identity-title"',
    'data-asset-id="organism-identity-constellation"',
    '/assets/visuals/organism-identity-constellation.svg',
    'aria-label="Organism identity constellation"',
    'class="organism-identity-grid"',
    'class="organism-identity-card identity-visual"',
    'class="organism-identity-card identity-mirror"',
    'class="organism-identity-card identity-financial"',
    'class="organism-identity-card identity-brain"',
    'data-i18n="orgIndex.identity.vc.signal"',
    'data-i18n="orgIndex.identity.im.boundary"',
    'data-i18n="orgIndex.identity.fo.proof"',
    'data-i18n="orgIndex.identity.bc.cta"',
    'href="/organisms/visual-cortex"',
    'href="/organisms/infinity-mirror"',
    'href="/organisms/financial-organisms"',
    'href="/organisms/brain-cell-architecture"',
    '"@id":"https://www.unwindcode.ai/organisms/#organism-identity-constellation-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/organism-identity-constellation.svg"',
  ]) {
    assert.ok(source.includes(snippet), `organism index missing identity constellation snippet ${snippet}`);
  }

  for (const snippet of [
    "'orgIndex.identity.title': 'Four organism identities, one governed spine.'",
    "'orgIndex.identity.vc.status': 'Creator intelligence'",
    "'orgIndex.identity.im.status': 'Human reflection'",
    "'orgIndex.identity.fo.status': 'Web3 simulation'",
    "'orgIndex.identity.bc.status': 'Cell operating system'",
    "'orgIndex.identity.fo.boundary': 'No private keys, hidden wallet path, or broadcast by default.'",
    "'orgIndex.identity.title': 'Cuatro identidades de organismo, una columna gobernada.'",
    "'orgIndex.identity.vc.status': 'Inteligencia creativa'",
    "'orgIndex.identity.im.status': 'Reflexión humana'",
    "'orgIndex.identity.fo.status': 'Simulación Web3'",
    "'orgIndex.identity.bc.status': 'Sistema operativo celular'",
    "'orgIndex.identity.fo.boundary': 'Sin llaves privadas, ruta oculta de wallet ni broadcast por defecto.'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing identity constellation snippet ${snippet}`);
  }

  for (const snippet of [
    '.organism-identity-section',
    '.organism-identity-board',
    '.organism-identity-grid',
    '.organism-identity-card',
    '.organism-identity-asset',
    '@media (max-width: 900px)',
    '@media (max-width: 640px)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing identity constellation snippet ${snippet}`);
  }

  const asset = manifest.assets.find(item => item.id === 'organism-identity-constellation');
  assert.ok(asset, 'asset manifest missing organism identity constellation');
  assert.equal(asset.file, 'assets/visuals/organism-identity-constellation.svg');
  assert.equal(asset.route, '/organisms');
  assert.equal(asset.surface, '#organism-identity-title');
  assert.match(asset.accessibility, /semantic bilingual cards/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'identity constellation SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'identity constellation SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'identity constellation SVG should not embed UI text');
  assert.ok(svg.includes('viewBox="0 0 1080 720"'), 'identity constellation SVG should declare the expected viewBox');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'identity constellation SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'identity constellation SVG should be presentational');

  assert.ok(llms.includes('Organism Identity Constellation'), 'llms.txt missing organism identity constellation');
  assert.ok(services.includes('"id": "organism_identity_constellation"'), 'ai-services missing organism identity constellation asset');
});

test('organism index exposes interface specimens for first proof surfaces', async () => {
  const source = await readFile(new URL('../organisms/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/organism-interface-specimens.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'class="lab-section organism-specimen-section"',
    'aria-labelledby="organism-specimen-title"',
    'id="organism-specimen-title"',
    'data-asset-id="organism-interface-specimens"',
    '/assets/visuals/organism-interface-specimens.svg',
    'aria-label="Organism interface specimens"',
    'class="organism-specimen-grid"',
    'class="organism-specimen-card specimen-visual"',
    'class="organism-specimen-card specimen-mirror"',
    'class="organism-specimen-card specimen-financial"',
    'class="organism-specimen-card specimen-brain"',
    'href="/organisms/visual-cortex/#visual-cortex-packet-title"',
    'href="/organisms/infinity-mirror/#infinity-mirror-session-title"',
    'href="/organisms/financial-organisms/#web3-simulation-console-title"',
    'href="/organisms/brain-cell-architecture/#brain-cell-runtime-title"',
    '"@id":"https://www.unwindcode.ai/organisms/#organism-interface-specimens-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/organism-interface-specimens.svg"',
  ]) {
    assert.ok(source.includes(snippet), `organism index missing interface specimen snippet ${snippet}`);
  }

  for (const snippet of [
    "'orgIndex.specimens.title': 'Each organism has a first proof surface you can inspect.'",
    "'orgIndex.specimens.vc.title': 'Production packet'",
    "'orgIndex.specimens.im.title': 'Reflection session'",
    "'orgIndex.specimens.fo.title': 'Unsigned Web3 review'",
    "'orgIndex.specimens.bc.title': 'Runtime cell note'",
    "'orgIndex.specimens.fo.desc': 'Read-only context, simulation result, risk interpretation, evidence trail, and no-broadcast authority boundary.'",
    "'orgIndex.specimens.title': 'Cada organismo tiene una primera superficie de prueba que puedes inspeccionar.'",
    "'orgIndex.specimens.vc.title': 'Paquete de producción'",
    "'orgIndex.specimens.im.title': 'Sesión de reflexión'",
    "'orgIndex.specimens.fo.title': 'Revisión Web3 sin firma'",
    "'orgIndex.specimens.bc.title': 'Nota runtime de célula'",
    "'orgIndex.specimens.fo.desc': 'Contexto read-only, resultado de simulación, interpretación de riesgo, rastro de evidencia y límite de autoridad sin broadcast.'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing interface specimen snippet ${snippet}`);
  }

  for (const snippet of [
    '.organism-specimen-section',
    '.organism-specimen-board',
    '.organism-specimen-grid',
    '.organism-specimen-card',
    '.organism-specimen-asset',
    '@media (max-width: 900px)',
    '@media (max-width: 640px)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing interface specimen snippet ${snippet}`);
  }

  const asset = manifest.assets.find(item => item.id === 'organism-interface-specimens');
  assert.ok(asset, 'asset manifest missing organism interface specimens');
  assert.equal(asset.file, 'assets/visuals/organism-interface-specimens.svg');
  assert.equal(asset.route, '/organisms');
  assert.equal(asset.surface, '#organism-specimen-title');
  assert.match(asset.purpose, /first proof surface/);
  assert.match(asset.trust_value, /inspectable outputs/);
  assert.match(asset.accessibility, /semantic bilingual cards/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'interface specimen SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'interface specimen SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'interface specimen SVG should not embed UI text');
  assert.ok(svg.includes('viewBox="0 0 1080 720"'), 'interface specimen SVG should declare the expected viewBox');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'interface specimen SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'interface specimen SVG should be presentational');

  assert.ok(llms.includes('Organism Interface Specimens'), 'llms.txt missing organism interface specimens');
  assert.ok(services.includes('"id": "organism_interface_specimens"'), 'ai-services missing organism interface specimens asset');
  assert.match(services, /first proof surface/);
});

test('homepage explains organisms versus apps before product cards', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/organism-difference-lens.svg', import.meta.url), 'utf8');

  const primerIndex = source.indexOf('id="organism-primer"');
  const organismsIndex = source.indexOf('id="organisms"');
  assert.ok(primerIndex > -1, 'homepage missing organism primer section');
  assert.ok(organismsIndex > -1, 'homepage missing organisms product section');
  assert.ok(primerIndex < organismsIndex, 'organism primer should appear before product cards');

  for (const snippet of [
    'aria-labelledby="organism-primer-title"',
    'data-i18n="primer.tag"',
    'data-i18n="primer.title"',
    'data-i18n="primer.definition"',
    'class="organism-primer-table"',
    '<caption data-i18n="primer.table.caption">Organisms versus apps</caption>',
    'scope="col" data-i18n="primer.table.app"',
    'scope="col" data-i18n="primer.table.organism"',
    'data-i18n="primer.row.state.label"',
    'data-i18n="primer.row.authority.label"',
    'data-i18n="primer.row.evolution.label"',
    'aria-label="AI organism anatomy"',
    'data-i18n="primer.anatomy.cortex"',
    'data-i18n="primer.anatomy.memory"',
    'data-i18n="primer.anatomy.gateway"',
    'data-i18n="primer.anatomy.cells"',
    'data-i18n="primer.anatomy.immune"',
    'data-i18n="primer.anatomy.proof"',
    'data-asset-id="organism-difference-lens"',
    'assets/visuals/organism-difference-lens.svg',
    'aria-labelledby="organism-lens-title"',
    'id="organism-lens-title"',
    'name="organism-lens"',
    'id="lens-state"',
    'id="lens-reasoning"',
    'id="lens-authority"',
    'id="lens-proof"',
    'data-i18n="primer.lens.state.title"',
    'data-i18n="primer.lens.reasoning.title"',
    'data-i18n="primer.lens.authority.title"',
    'data-i18n="primer.lens.proof.title"',
    '"@id":"https://www.unwindcode.ai/#organism-difference-lens-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/organism-difference-lens.svg"',
    'href="/architecture" class="primer-link"',
    '"@type":"DefinedTerm"',
    '"name":"AI organism"',
    '"inDefinedTermSet":"Unwind Code AI organism architecture"',
  ]) {
    assert.ok(source.includes(snippet), `homepage missing organism primer snippet ${snippet}`);
  }

  for (const snippet of [
    "'primer.tag': 'Organism Primer'",
    "'primer.title': 'An organism is a system that carries state forward.'",
    "'primer.table.caption': 'Organisms versus apps'",
    "'primer.table.app': 'Typical app'",
    "'primer.table.organism': 'AI organism'",
    "'primer.row.state.label': 'State'",
    "'primer.row.authority.label': 'Authority'",
    "'primer.row.evolution.label': 'Evolution'",
    "'primer.anatomy.immune': 'Immune System'",
    "'primer.lens.legend': 'Inspect why an organism is not just another app.'",
    "'primer.lens.state.status': 'Continuity layer'",
    "'primer.lens.reasoning.status': 'Cortex routing'",
    "'primer.lens.authority.status': 'Human authority'",
    "'primer.lens.proof.status': 'Public evidence'",
    "'primer.cta': 'Study the architecture'",
    "'primer.tag': 'Manual del Organismo'",
    "'primer.title': 'Un organismo es un sistema que conserva estado.'",
    "'primer.table.caption': 'Organismos versus apps'",
    "'primer.table.app': 'App típica'",
    "'primer.table.organism': 'Organismo de IA'",
    "'primer.row.state.label': 'Estado'",
    "'primer.row.authority.label': 'Autoridad'",
    "'primer.row.evolution.label': 'Evolución'",
    "'primer.anatomy.immune': 'Sistema Inmune'",
    "'primer.lens.legend': 'Inspecciona por qué un organismo no es otra app.'",
    "'primer.lens.state.status': 'Capa de continuidad'",
    "'primer.lens.reasoning.status': 'Enrutamiento del córtex'",
    "'primer.lens.authority.status': 'Autoridad humana'",
    "'primer.lens.proof.status': 'Evidencia pública'",
    "'primer.cta': 'Estudia la arquitectura'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing organism primer snippet ${snippet}`);
  }

  for (const snippet of [
    '.organism-lens',
    '.organism-lens-selector',
    '.organism-lens-tabs',
    '#lens-state:focus-visible',
    '.organism-lens-asset',
    '@media (max-width: 640px)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing organism lens snippet ${snippet}`);
  }

  const asset = manifest.assets.find(item => item.id === 'organism-difference-lens');
  assert.ok(asset, 'asset manifest missing organism difference lens');
  assert.equal(asset.file, 'assets/visuals/organism-difference-lens.svg');
  assert.equal(asset.route, '/');
  assert.equal(asset.surface, '#organism-lens-title');
  assert.match(asset.accessibility, /native radio inputs/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'organism lens SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'organism lens SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'organism lens SVG should not embed UI text');
  assert.ok(svg.includes('viewBox="0 0 1080 640"'), 'organism lens SVG should declare the expected viewBox');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'organism lens SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'organism lens SVG should be presentational');

  assert.ok(llms.includes('Organism Difference Lens'), 'llms.txt missing organism difference lens');
  assert.ok(llms.includes('state, reasoning, authority, and proof'), 'llms.txt missing organism lens explanation');
  assert.ok(services.includes('"id": "organism_difference_lens"'), 'ai-services missing organism difference lens asset');
});

test('homepage answers core AI organism questions with FAQ schema', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');

  for (const snippet of [
    '"@type":"FAQPage"',
    '"mainEntity"',
    'id="faq"',
    'aria-labelledby="faq-title"',
    '<details class="faq-item" open>',
    '<summary data-i18n="faq.1.q">What is an AI organism?</summary>',
    'data-i18n="faq.2.q"',
    'data-i18n="faq.3.q"',
    'data-i18n="faq.4.q"',
    'data-i18n="faq.5.q"',
    'AI agents',
    'Web3 architecture',
    'on-chain intelligence',
    '/proof',
    '/build-with-us',
  ]) {
    assert.ok(source.includes(snippet), `homepage missing FAQ snippet ${snippet}`);
  }

  for (const snippet of [
    "'faq.1.q': 'What is an AI organism?'",
    "'faq.2.q': 'How is an organism different from an app?'",
    "'faq.3.q': 'Can Financial Organisms move money?'",
    "'faq.4.q': 'Where can I inspect proof?'",
    "'faq.5.q': 'How do I build with Unwind Code?'",
    "'faq.1.q': '¿Qué es un organismo de IA?'",
    "'faq.2.q': '¿En qué se diferencia un organismo de una app?'",
    "'faq.3.q': '¿Pueden los Organismos Financieros mover dinero?'",
    "'faq.4.q': '¿Dónde puedo inspeccionar la prueba?'",
    "'faq.5.q': '¿Cómo construyo con Unwind Code?'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing FAQ snippet ${snippet}`);
  }
});

test('homepage converts subscribers with a proof-filtered signal console', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/subscriber-signal-beacon.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'id="cta" class="subscriber-gateway"',
    'aria-labelledby="cta-title"',
    'id="cta-title"',
    'data-asset-id="subscriber-signal-beacon"',
    'assets/visuals/subscriber-signal-beacon.svg',
    'class="cta-signal-console"',
    'aria-label="Subscriber signal paths"',
    'id="cta-router-title"',
    'data-i18n="cta.router.legend"',
    'id="cta-route-builder"',
    'id="cta-route-investor"',
    'id="cta-route-user"',
    'id="cta-route-collab"',
    'data-i18n="cta.router.investor.boundary"',
    'data-i18n="cta.router.user.proof"',
    'href="/organisms/infinity-mirror"',
    'data-i18n="cta.signal.builder.title"',
    'data-i18n="cta.signal.investor.title"',
    'data-i18n="cta.signal.user.title"',
    'data-i18n="cta.signal.collab.title"',
    'aria-labelledby="cta-email-title"',
    'id="cta-email-title"',
    'id="email-form"',
    'id="email-input"',
    'data-i18n-placeholder="cta.email.placeholder"',
    'id="signup-status"',
    'href="/build-with-us"',
    '"@id":"https://www.unwindcode.ai/#subscriber-signal-beacon-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/subscriber-signal-beacon.svg"',
  ]) {
    assert.ok(source.includes(snippet), `homepage missing subscriber console snippet ${snippet}`);
  }

  for (const snippet of [
    "'cta.kicker': 'Join the signal'",
    "'cta.title': 'Follow the organism as it learns in public.'",
    "'cta.signal.title': 'What enters the list is filtered by proof, not hype.'",
    "'cta.router.legend': 'Choose your signal path'",
    "'cta.router.builder.tab': 'Builders'",
    "'cta.router.investor.title': 'Investor updates should make trust inspectable before conviction grows.'",
    "'cta.router.investor.boundary': 'No financial promises, hidden metrics, or live Web3 authority are implied by a subscriber update.'",
    "'cta.router.user.proof': 'Updates name the prototype status, human boundary, and what the organism will not decide for you.'",
    "'cta.router.collab.next': 'Build with proof'",
    "'cta.signal.builder.title': 'Builder notes'",
    "'cta.signal.investor.title': 'Investor proof'",
    "'cta.signal.user.title': 'User windows'",
    "'cta.signal.collab.title': 'Collaboration openings'",
    "'cta.email.privacy': 'No spam. No private reasoning. Leave when the signal stops helping.'",
    "'cta.kicker': 'Únete a la señal'",
    "'cta.title': 'Sigue al organismo mientras aprende en público.'",
    "'cta.signal.title': 'Lo que entra a la lista se filtra por prueba, no por hype.'",
    "'cta.router.legend': 'Elige tu ruta de señal'",
    "'cta.router.builder.tab': 'Builders'",
    "'cta.router.investor.title': 'Las actualizaciones para inversionistas deben volver inspeccionable la confianza antes de crecer la convicción.'",
    "'cta.router.investor.boundary': 'Una actualización de suscriptor no implica promesas financieras, métricas ocultas ni autoridad Web3 en vivo.'",
    "'cta.router.user.proof': 'Las actualizaciones nombran estado del prototipo, límite humano y lo que el organismo no decidirá por ti.'",
    "'cta.router.collab.next': 'Construir con prueba'",
    "'cta.signal.builder.title': 'Notas para builders'",
    "'cta.signal.investor.title': 'Prueba para inversionistas'",
    "'cta.signal.user.title': 'Ventanas para usuarios'",
    "'cta.signal.collab.title': 'Aperturas de colaboración'",
    "'cta.email.privacy': 'Sin spam. Sin razonamiento privado. Sal cuando la señal deje de ayudarte.'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing subscriber console snippet ${snippet}`);
  }

  for (const snippet of [
    '.subscriber-gateway',
    '.cta-signal-console',
    '.cta-signal-asset',
    '.cta-signal-router',
    '.cta-router-tabs label:hover',
    '#cta-route-investor:checked ~ .cta-router-panels .cta-panel-investor',
    '#cta-route-builder:focus-visible ~ .cta-router-tabs label[for="cta-route-builder"]',
    '@keyframes cta-signal-beacon-drift',
    '.cta-signal-grid',
    '.cta-signal-index',
    '.signup-privacy',
    '.signup-form input:focus',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing subscriber console snippet ${snippet}`);
  }

  const asset = manifest.assets.find(item => item.id === 'subscriber-signal-beacon');
  assert.ok(asset, 'asset manifest missing subscriber signal beacon');
  assert.equal(asset.file, 'assets/visuals/subscriber-signal-beacon.svg');
  assert.equal(asset.route, '/');
  assert.equal(asset.surface, '#cta');
  assert.match(asset.accessibility, /native radio controls/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'Subscriber signal beacon SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'Subscriber signal beacon SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'Subscriber signal beacon SVG should not embed UI text');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'Subscriber signal beacon SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'Subscriber signal beacon SVG should be presentational');

  assert.ok(llms.includes('Subscriber Signal Console'), 'llms.txt missing subscriber signal console');
  assert.ok(llms.includes('Subscriber Signal Beacon'), 'llms.txt missing subscriber signal beacon');
  assert.ok(llms.includes('receives, proof filter, authority boundary, and next route'), 'llms.txt missing beacon selector summary');
  assert.ok(llms.includes('proof-filtered field notes for builders, investors, users, and collaborators'), 'llms.txt missing subscriber audience summary');
  assert.ok(services.includes('"id": "subscriber_signal_beacon"'), 'ai-services missing subscriber signal beacon asset');
  assert.ok(services.includes('"proof_filter": "Claims attached to public pages, transmissions, schema, test coverage, or explicit unknowns."'), 'ai-services missing investor proof filter');
  assert.ok(services.includes('"boundary": "No care, identity, diagnosis, or life decision is outsourced to automation."'), 'ai-services missing user signal boundary');
  assert.ok(services.includes('"subscription_signal_paths"'), 'ai-services missing subscription signal paths');
  assert.ok(services.includes('"audience": "investors"'), 'ai-services missing investor subscription path');
  assert.ok(services.includes('"receives": "Status shifts, public artifacts, safety gates, and bounded Web3 posture."'), 'ai-services missing investor subscription value');
});

test('homepage chat works as an accessible governed conversation gateway', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const main = await readFile(new URL('../main.js', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');

  for (const snippet of [
    'id="chat-modal" class="chat-modal" aria-hidden="true"',
    'role="dialog"',
    'aria-modal="true"',
    'aria-labelledby="chat-title"',
    'aria-describedby="chat-boundary"',
    'id="chat-title"',
    'id="chat-boundary"',
    'data-i18n="chat.boundary.kicker"',
    'data-i18n="chat.boundary.desc"',
    'role="log"',
    'aria-live="polite"',
    'data-i18n-aria-label="chat.close"',
    'data-i18n-aria-label="chat.input"',
    'data-i18n-aria-label="chat.send"',
    'class="brain-gateway-panel"',
    'id="brain-gateway-title"',
    'class="brain-gateway-ledger"',
    'data-i18n="cta.brain.kicker"',
    'data-i18n="cta.brain.title"',
    'data-i18n="cta.brain.desc"',
    'class="brain-gateway-prompts"',
    'data-i18n-aria-label="cta.brain.prompts.aria"',
    'class="brain-prompt-chip"',
    'data-chat-prompt-key="cta.brain.prompt.builder.value"',
    'data-chat-prompt-key="cta.brain.prompt.investor.value"',
    'data-chat-prompt-key="cta.brain.prompt.user.value"',
    'data-chat-prompt-key="cta.brain.prompt.collab.value"',
    'data-chat-prompt="Map my product idea into an organism path with proof and boundaries."',
    'data-chat-prompt="Show me the proof packet an investor should inspect first."',
    'data-chat-prompt="Help me choose between Infinity Mirror and the other organism paths."',
    'data-chat-prompt="Turn my collaboration idea into a bounded first packet."',
    'data-i18n="cta.brain.prompt.builder.text"',
    'data-i18n="cta.brain.prompt.investor.text"',
    'data-i18n="cta.brain.prompt.user.text"',
    'data-i18n="cta.brain.prompt.collab.text"',
    'data-i18n="cta.brain.can.value"',
    'data-i18n="cta.brain.proof.value"',
    'data-i18n="cta.brain.boundary.value"',
    'href="/proof"',
  ]) {
    assert.ok(source.includes(snippet), `homepage missing chat gateway snippet ${snippet}`);
  }

  for (const snippet of [
    "'cta.brain.kicker': 'Conversation Gateway / Prototype'",
    "'cta.brain.title': 'Ask the Brain, then inspect the route it gives you.'",
    "'cta.brain.desc': 'The homepage chat is a public-facing routing layer. It can explain organisms, point to proof, and help a visitor choose a next path without gaining authority over files, money, posts, or Web3 motion.'",
    "'cta.brain.can.value': 'Organisms, architecture, proof, transmissions, collaboration fit, and where to start.'",
    "'cta.brain.boundary.value': 'No filesystem writes, spending, public posting, private data pull, or Web3 broadcast.'",
    "'cta.brain.prompts.aria': 'Brain starter prompts'",
    "'cta.brain.prompt.builder.text': 'Map my idea into an organism path.'",
    "'cta.brain.prompt.builder.value': 'Map my product idea into an organism path with proof and boundaries.'",
    "'cta.brain.prompt.investor.text': 'Show the first proof packet.'",
    "'cta.brain.prompt.investor.value': 'Show me the proof packet an investor should inspect first.'",
    "'cta.brain.prompt.user.text': 'Choose my organism route.'",
    "'cta.brain.prompt.user.value': 'Help me choose between Infinity Mirror and the other organism paths.'",
    "'cta.brain.prompt.collab.text': 'Build a bounded first packet.'",
    "'cta.brain.prompt.collab.value': 'Turn my collaboration idea into a bounded first packet.'",
    "'cta.brain.kicker': 'Gateway de conversación / Prototipo'",
    "'cta.brain.title': 'Pregunta al Brain y luego inspecciona la ruta que te devuelve.'",
    "'cta.brain.boundary.value': 'Sin escrituras al filesystem, gasto, publicación pública, extracción de datos privados ni broadcast Web3.'",
    "'cta.brain.prompts.aria': 'Prompts iniciales para el Brain'",
    "'cta.brain.prompt.builder.text': 'Mapea mi idea como ruta de organismo.'",
    "'cta.brain.prompt.builder.value': 'Mapea mi idea de producto como ruta de organismo con prueba y límites.'",
    "'cta.brain.prompt.investor.text': 'Muestra el primer paquete de prueba.'",
    "'cta.brain.prompt.investor.value': 'Muéstrame el paquete de prueba que un inversionista debería inspeccionar primero.'",
    "'cta.brain.prompt.user.text': 'Elige mi ruta de organismo.'",
    "'cta.brain.prompt.user.value': 'Ayúdame a elegir entre Infinity Mirror y las otras rutas de organismos.'",
    "'cta.brain.prompt.collab.text': 'Crea un primer paquete acotado.'",
    "'cta.brain.prompt.collab.value': 'Convierte mi idea de colaboración en un primer paquete acotado.'",
    "'chat.boundary.kicker': 'Conversation gateway'",
    "'chat.boundary.desc': 'Ask about organisms, architecture, proof, or collaboration. Files, money, public posts, and Web3 movement stay human-approved.'",
    "'chat.input': 'Message'",
    "'chat.close': 'Close chat'",
    "'chat.send': 'Send message'",
    "'chat.boundary.kicker': 'Gateway de conversación'",
    "'chat.boundary.desc': 'Pregunta sobre organismos, arquitectura, prueba o colaboración. Archivos, dinero, publicaciones públicas y movimiento Web3 siguen con aprobación humana.'",
    "'chat.input': 'Mensaje'",
    "'chat.close': 'Cerrar chat'",
    "'chat.send': 'Enviar mensaje'",
    'data-i18n-aria-label',
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing chat gateway snippet ${snippet}`);
  }

  for (const snippet of [
    '.chat-boundary',
    '.chat-boundary span',
    '.chat-boundary p',
    '.chat-close:focus-visible',
    '.chat-send:focus-visible',
    '.chat-input-area input:focus',
    '.brain-gateway-panel',
    '.brain-gateway-prompts',
    '.brain-prompt-chip',
    '.brain-prompt-chip:focus-visible',
    '.brain-gateway-ledger',
    '.brain-gateway-ledger div',
    '.brain-gateway-ledger dd a:focus-visible',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing chat gateway snippet ${snippet}`);
  }

  for (const snippet of [
    'chatReturnFocusTarget',
    'event?.currentTarget',
    'getChatFocusableElements',
    "e.key !== 'Tab'",
    'restoreChatFocus',
    "chatInput.focus({ preventScroll: true })",
    'function openChatWithPrompt(event)',
    'target?.dataset.chatPromptKey',
    'getTranslation(promptKey)',
    "document.querySelectorAll('[data-chat-prompt]')",
    "button.addEventListener('click', openChatWithPrompt)",
  ]) {
    assert.ok(main.includes(snippet), `main.js missing chat focus behavior snippet ${snippet}`);
  }

  assert.ok(llms.includes('Conversation Gateway'), 'llms.txt missing conversation gateway');
  assert.ok(llms.includes('four starter prompts for builders, investors, users, and collaborators'), 'llms.txt missing starter prompt summary');
  assert.ok(llms.includes('organism route, first proof artifact, authority boundary, and next page to inspect'), 'llms.txt missing starter prompt expected return');
  assert.ok(services.includes('"conversation_gateway"'), 'ai-services missing conversation gateway');
  assert.ok(services.includes('"human_approval_required_for"'), 'ai-services missing conversation approval boundary');
  assert.ok(services.includes('"starter_prompts"'), 'ai-services missing conversation gateway starter prompts');
  assert.ok(services.includes('"prompt": "Map my product idea into an organism path with proof and boundaries."'), 'ai-services missing builder starter prompt');
  assert.ok(services.includes('"expected_return": "An organism route, first proof artifact, authority boundary, and next page to inspect."'), 'ai-services missing starter prompt expected return');
});

test('homepage surfaces an inspectable proof ledger snapshot', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');

  for (const snippet of [
    'id="proof-ledger"',
    'aria-labelledby="proof-ledger-title"',
    'data-i18n="proof.home.tag"',
    'data-i18n="proof.home.title"',
    'data-i18n="proof.home.desc"',
    'class="proof-snapshot-grid reveal"',
    '<a class="proof-snapshot-card primary" href="/proof">',
    '<a class="proof-snapshot-card" href="/transmissions/21-the-unwind-brain-checkpoint-white-paper">',
    '<a class="proof-snapshot-card" href="/transmissions/23-the-sec-gate-an-organism-that-locks-its-own-hands">',
    '<a class="proof-snapshot-card" href="/organisms/financial-organisms">',
    'data-i18n="proof.home.card.ledger.status"',
    'data-i18n="proof.home.card.whitepaper.status"',
    'data-i18n="proof.home.card.sec.status"',
    'data-i18n="proof.home.card.web3.status"',
    'data-i18n="proof.home.card.cta"',
  ]) {
    assert.ok(source.includes(snippet), `homepage missing proof snapshot snippet ${snippet}`);
  }

  for (const snippet of [
    "'proof.home.tag': 'Proof Snapshot'",
    "'proof.home.title': 'Trust is designed into the organism.'",
    "'proof.home.card.ledger.status': 'Ledger'",
    "'proof.home.card.whitepaper.status': 'Whitepaper'",
    "'proof.home.card.sec.status': 'Safety Gate'",
    "'proof.home.card.web3.status': 'Web3 Boundary'",
    "'proof.home.card.cta': 'Inspect evidence'",
    "'proof.home.tag': 'Snapshot de Prueba'",
    "'proof.home.title': 'La confianza se diseña dentro del organismo.'",
    "'proof.home.card.ledger.status': 'Ledger'",
    "'proof.home.card.whitepaper.status': 'Whitepaper'",
    "'proof.home.card.sec.status': 'Compuerta de Seguridad'",
    "'proof.home.card.web3.status': 'Límite Web3'",
    "'proof.home.card.cta': 'Inspecciona evidencia'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing proof snapshot snippet ${snippet}`);
  }
});

test('proof page is a bilingual evidence ledger with structured trust artifacts', async () => {
  const source = await readFile(new URL('../proof/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');

  for (const snippet of [
    'data-i18n="proofPage.hero.kicker"',
    'data-i18n="proofPage.hero.title"',
    'id="proof-register"',
    'aria-labelledby="proof-register-title"',
    'class="proof-metrics"',
    'class="proof-row proof-artifact-row"',
    'data-i18n="proofPage.artifact.21.title"',
	    'data-i18n="proofPage.artifact.22.title"',
	    'data-i18n="proofPage.artifact.23.title"',
	    'data-i18n="proofPage.artifact.24.title"',
	    'data-i18n="proofPage.artifact.25.title"',
	    'data-i18n="proofPage.artifact.26.title"',
	    'data-i18n="proofPage.artifact.27.title"',
	    'href="/transmissions/25-the-homepage-learned-to-pulse"',
	    'href="/transmissions/26-property-sales-intelligence-cell"',
	    'href="/transmissions/27-the-quotation-cell"',
	    'data-i18n="proofPage.cycle.claim.title"',
    'data-i18n="proofPage.cycle.boundary.title"',
    'data-i18n="proofPage.safety.money.title"',
    'data-i18n="proofPage.conversion.title"',
    '"@type":"ItemList"',
    '"@id":"https://www.unwindcode.ai/proof/#artifact-list"',
    '"@type":"DefinedTerm"',
    '"name":"Public Proof Ledger"',
    '"name":"Proof Loop"',
    '"inLanguage":["en","es"]',
  ]) {
    assert.ok(source.includes(snippet), `proof page missing evidence-ledger snippet ${snippet}`);
  }

	  assert.equal(source.split('class="proof-row proof-artifact-row"').length - 1, 7, 'proof page should expose seven artifact rows');

  for (const snippet of [
    "'proofPage.register.kicker': 'Evidence register'",
    "'proofPage.register.title': 'Start with public artifacts, then inspect the boundary they prove.'",
	    "'proofPage.artifact.21.type': 'Whitepaper'",
	    "'proofPage.artifact.22.type': 'Financial safety'",
	    "'proofPage.artifact.25.type': 'Interface proof'",
	    "'proofPage.artifact.26.type': 'Bounded sales cell'",
	    "'proofPage.artifact.27.type': 'Transaction readiness'",
	    "'proofPage.cycle.title': 'A claim is not trusted until it leaves a trail.'",
    "'proofPage.safety.money.title': 'Money'",
    "'proofPage.conversion.primary': 'Build with proof'",
    "'proofPage.register.kicker': 'Registro de evidencia'",
    "'proofPage.register.title': 'Empieza con artefactos públicos, luego inspecciona el límite que prueban.'",
	    "'proofPage.artifact.21.type': 'Whitepaper'",
	    "'proofPage.artifact.22.type': 'Seguridad financiera'",
	    "'proofPage.artifact.25.type': 'Prueba de interfaz'",
	    "'proofPage.artifact.26.type': 'Célula de ventas acotada'",
	    "'proofPage.artifact.27.type': 'Preparación transaccional'",
	    "'proofPage.cycle.title': 'Una afirmación no se confía hasta que deja rastro.'",
    "'proofPage.safety.money.title': 'Dinero'",
    "'proofPage.conversion.primary': 'Construir con prueba'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing proof ledger snippet ${snippet}`);
  }

  for (const snippet of [
	    'Proof Ledger Evidence Model',
	    'maps seven public artifacts to status, trust question, safety boundary, and inspection route',
	  ]) {
    assert.ok(llms.includes(snippet), `llms.txt missing proof ledger snippet ${snippet}`);
  }

  for (const snippet of [
	    '"proof_artifacts"',
	    '"id": "transmission_21"',
	    '"id": "transmission_25"',
	    '"id": "transmission_26"',
	    '"id": "transmission_27"',
	    '"type": "safety_gate"',
    '"trust_question": "Can a high-risk organism refuse or pause itself?"',
  ]) {
    assert.ok(services.includes(snippet), `ai-services missing proof artifact snippet ${snippet}`);
  }
});

test('proof page exposes a trust diligence console for visitor-specific evidence paths', async () => {
  const source = await readFile(new URL('../proof/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/trust-diligence-console.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'class="lab-section trust-diligence-section"',
    'aria-labelledby="trust-diligence-title"',
    'id="trust-diligence-title"',
    'data-asset-id="trust-diligence-console"',
    'assets/visuals/trust-diligence-console.svg',
    'class="trust-diligence-board"',
    'class="trust-diligence-selector"',
    'name="trust-diligence"',
    'id="diligence-builder"',
    'id="diligence-investor"',
    'id="diligence-user"',
    'id="diligence-protocol"',
    'id="diligence-collaborator"',
    'data-i18n="proofPage.diligence.investor.boundary"',
    'data-i18n="proofPage.diligence.protocol.evidence"',
    'href="/organisms/financial-organisms"',
    'href="/build-with-us"',
    '"@id":"https://www.unwindcode.ai/proof/#trust-diligence-console-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/trust-diligence-console.svg"',
  ]) {
    assert.ok(source.includes(snippet), `proof page missing trust diligence snippet ${snippet}`);
  }

  for (const snippet of [
    "'proofPage.diligence.kicker': 'Trust diligence console'",
    "'proofPage.diligence.title': 'Different visitors inspect different proof before they trust the organism.'",
    "'proofPage.diligence.builder.status': 'Architecture proof'",
    "'proofPage.diligence.investor.boundary': 'No financial promises, hidden metrics, private deal claims, or live Web3 authority are implied.'",
    "'proofPage.diligence.protocol.evidence': 'Web3 trust-layer map, simulation console, Monad Hand, SEC Gate, and unsigned packet posture.'",
    "'proofPage.diligence.collab.next': 'Open Build With Us'",
    "'proofPage.diligence.kicker': 'Consola de diligencia de confianza'",
    "'proofPage.diligence.title': 'Distintos visitantes inspeccionan distinta prueba antes de confiar en el organismo.'",
    "'proofPage.diligence.builder.status': 'Prueba de arquitectura'",
    "'proofPage.diligence.investor.boundary': 'No se implican promesas financieras, métricas ocultas, claims privados de deals ni autoridad Web3 en vivo.'",
    "'proofPage.diligence.protocol.evidence': 'Mapa de confianza Web3, consola de simulación, Monad Hand, SEC Gate y postura de paquetes sin firma.'",
    "'proofPage.diligence.collab.next': 'Abrir Build With Us'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing trust diligence snippet ${snippet}`);
  }

  for (const snippet of [
    '.trust-diligence-section',
    '.trust-diligence-selector',
    '#diligence-builder:focus-visible',
    '.trust-diligence-panel',
    '.trust-diligence-asset',
    '@media (max-width: 640px)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing trust diligence snippet ${snippet}`);
  }

  const asset = manifest.assets.find(item => item.id === 'trust-diligence-console');
  assert.ok(asset, 'asset manifest missing trust diligence console');
  assert.equal(asset.file, 'assets/visuals/trust-diligence-console.svg');
  assert.equal(asset.route, '/proof');
  assert.equal(asset.surface, '#trust-diligence-title');
  assert.match(asset.accessibility, /native radio controls/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.match(svg, /viewBox="0 0 1080 720"/);
  assert.match(svg, /role="presentation"/);
  assert.match(svg, /aria-hidden="true"/);
  assert.match(svg, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(svg, /<script\b/i);
  assert.doesNotMatch(svg, /<foreignObject\b/i);
  assert.doesNotMatch(svg, /<text\b/i);

  assert.ok(llms.includes('Trust Diligence Console'), 'llms.txt missing trust diligence console');
  assert.ok(llms.includes('routes builders, investors, users, protocols, and collaborators'), 'llms.txt missing trust diligence audience routing');
  assert.ok(services.includes('"id": "trust_diligence_console"'), 'ai-services missing trust diligence console');
  assert.ok(services.includes('evidence path, authority boundary, and next action'), 'ai-services missing trust diligence purpose');
});

test('proof page exposes an asset governance ledger for immersive proof surfaces', async () => {
  const source = await readFile(new URL('../proof/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/asset-governance-ledger.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'class="lab-section asset-governance-section"',
    'aria-labelledby="asset-governance-title"',
    'id="asset-governance-title"',
    'data-asset-id="asset-governance-ledger"',
    'assets/visuals/asset-governance-ledger.svg',
    'class="asset-governance-board"',
    'class="asset-governance-cards"',
    'class="asset-governance-card"',
    'href="/assets/asset-manifest.json"',
    'href="/build-with-us"',
    'data-i18n="proofPage.assets.purpose.title"',
    'data-i18n="proofPage.assets.text.title"',
    'data-i18n="proofPage.assets.motion.title"',
    'data-i18n="proofPage.assets.discovery.title"',
    '"@id":"https://www.unwindcode.ai/proof/#asset-governance-ledger-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/asset-governance-ledger.svg"',
  ]) {
    assert.ok(source.includes(snippet), `proof page missing asset governance snippet ${snippet}`);
  }

  for (const snippet of [
    "'proofPage.assets.kicker': 'Asset governance ledger'",
    "'proofPage.assets.title': 'The visuals are governed proof surfaces, not decoration.'",
    "'proofPage.assets.purpose.title': 'Every visual must earn its place.'",
    "'proofPage.assets.text.title': 'Meaning stays inspectable outside the image.'",
    "'proofPage.assets.motion.title': 'Immersion stays lightweight and respectful.'",
    "'proofPage.assets.discovery.title': 'Crawlers and future agents can find the asset contract.'",
    "'proofPage.assets.kicker': 'Ledger de gobernanza de assets'",
    "'proofPage.assets.title': 'Los visuales son superficies de prueba gobernadas, no decoracion.'",
    "'proofPage.assets.purpose.title': 'Cada visual debe ganarse su lugar.'",
    "'proofPage.assets.text.title': 'El significado queda inspeccionable fuera de la imagen.'",
    "'proofPage.assets.motion.title': 'La inmersion queda liviana y respetuosa.'",
    "'proofPage.assets.discovery.title': 'Crawlers y agentes futuros pueden encontrar el contrato del asset.'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing asset governance snippet ${snippet}`);
  }

  for (const snippet of [
    '.asset-governance-section',
    '.asset-governance-board',
    '.asset-governance-cards',
    '.asset-governance-card',
    '.asset-governance-asset',
    '@media (max-width: 640px)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing asset governance snippet ${snippet}`);
  }

  const asset = manifest.assets.find(item => item.id === 'asset-governance-ledger');
  assert.ok(asset, 'asset manifest missing asset governance ledger');
  assert.equal(asset.file, 'assets/visuals/asset-governance-ledger.svg');
  assert.equal(asset.route, '/proof');
  assert.equal(asset.surface, '#asset-governance-title');
  assert.match(asset.accessibility, /semantic bilingual cards/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.match(svg, /viewBox="0 0 1080 720"/);
  assert.match(svg, /role="presentation"/);
  assert.match(svg, /aria-hidden="true"/);
  assert.match(svg, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(svg, /<script\b/i);
  assert.doesNotMatch(svg, /<foreignObject\b/i);
  assert.doesNotMatch(svg, /<text\b/i);

  assert.ok(llms.includes('Asset Governance Ledger'), 'llms.txt missing asset governance ledger');
  assert.ok(llms.includes('visuals pass purpose, text, motion, and discovery governance'), 'llms.txt missing asset governance purpose');
  assert.ok(services.includes('"id": "asset_governance_ledger"'), 'ai-services missing asset governance ledger');
  assert.ok(services.includes('purpose, text, motion, and discovery governance'), 'ai-services missing asset governance purpose');
});

test('proof page exposes a governed authority gate console for high-risk actions', async () => {
  const source = await readFile(new URL('../proof/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/authority-gate-console.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'class="lab-section authority-gate-section"',
    'aria-labelledby="authority-gate-title"',
    'id="authority-gate-title"',
    'data-asset-id="authority-gate-console"',
    'assets/visuals/authority-gate-console.svg',
    'class="authority-gate-board"',
    'class="authority-gate-selector"',
    'name="authority-gate"',
    'id="gate-code"',
    'id="gate-files"',
    'id="gate-money"',
    'id="gate-public"',
    'id="gate-web3"',
    'data-i18n="proofPage.gate.kicker"',
    'data-i18n="proofPage.gate.money.authority"',
    'data-i18n="proofPage.gate.web3.response"',
    'href="/transmissions/23-the-sec-gate-an-organism-that-locks-its-own-hands"',
    'href="/build-with-us"',
    '"@type":"ImageObject"',
    '"@id":"https://www.unwindcode.ai/proof/#authority-gate-console-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/authority-gate-console.svg"',
  ]) {
    assert.ok(source.includes(snippet), `proof page missing authority gate snippet ${snippet}`);
  }

  for (const snippet of [
    "'proofPage.gate.kicker': 'Authority gate console'",
    "'proofPage.gate.title': 'The organism must prove why it should act before it receives authority.'",
    "'proofPage.gate.code.status': 'Sandbox'",
    "'proofPage.gate.money.authority': 'Money moves only after explicit operator consent.'",
    "'proofPage.gate.web3.response': 'Use read-only data, simulate outcomes, and produce unsigned packets only.'",
    "'proofPage.gate.kicker': 'Consola de autoridad'",
    "'proofPage.gate.title': 'El organismo debe probar por qué debe actuar antes de recibir autoridad.'",
    "'proofPage.gate.code.status': 'Sandbox'",
    "'proofPage.gate.money.authority': 'El dinero se mueve solo después de consentimiento explícito del operador.'",
    "'proofPage.gate.web3.response': 'Usa datos read-only, simula resultados y produce solo paquetes sin firma.'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing authority gate snippet ${snippet}`);
  }

  for (const snippet of [
    '.authority-gate-section',
    '.authority-gate-selector',
    '#gate-code:focus-visible',
    '.authority-gate-panel',
    '.authority-gate-asset',
    '@media (max-width: 640px)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing authority gate snippet ${snippet}`);
  }

  const asset = manifest.assets.find(item => item.id === 'authority-gate-console');
  assert.ok(asset, 'asset manifest missing authority gate console');
  assert.equal(asset.file, 'assets/visuals/authority-gate-console.svg');
  assert.equal(asset.route, '/proof');
  assert.equal(asset.surface, '#authority-gate-title');
  assert.match(asset.accessibility, /native radio controls/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.match(svg, /viewBox="0 0 1080 720"/);
  assert.match(svg, /role="presentation"/);
  assert.match(svg, /aria-hidden="true"/);
  assert.match(svg, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(svg, /<script\b/i);
  assert.doesNotMatch(svg, /<foreignObject\b/i);
  assert.doesNotMatch(svg, /<text\b/i);

  assert.ok(llms.includes('Authority Gate Console'), 'llms.txt missing authority gate console');
  assert.ok(services.includes('"id": "authority_gate_console"'), 'ai-services missing authority gate console');
  assert.ok(services.includes('generated code, filesystem writes, money movement, public publishing, and Web3 broadcast'), 'ai-services missing authority gate purpose');
});

test('philosophy page turns the prime directive into bilingual operating doctrine', async () => {
  const source = await readFile(new URL('../philosophy/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/operating-doctrine-compass.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'data-i18n="philPage.hero.kicker"',
    'data-i18n="philPage.hero.title"',
    'class="lab-section doctrine-compass-section"',
    'aria-labelledby="doctrine-compass-title"',
    'id="doctrine-compass-title"',
    'data-asset-id="operating-doctrine-compass"',
    'assets/visuals/operating-doctrine-compass.svg',
    'class="doctrine-compass-board"',
    'class="doctrine-compass-selector"',
    'id="doctrine-lane-clarity"',
    'id="doctrine-lane-authority"',
    'id="doctrine-lane-money"',
    'id="doctrine-lane-proof"',
    'id="doctrine-lane-light"',
    'data-i18n="philPage.compass.money.boundary"',
    'data-i18n="philPage.compass.light.constraint"',
    'href="/proof/#authority-gate-title"',
    'id="operating-doctrine"',
    'aria-labelledby="operating-doctrine-title"',
    'data-i18n="philPage.fact.authority.label"',
    'data-i18n="philPage.fact.web3.label"',
    'data-i18n="philPage.principle.light.title"',
    'class="doctrine-table"',
    'data-i18n="philPage.translation.fo.constraint"',
    'href="/organisms/financial-organisms"',
    'id="philosophy-next-title"',
    '"@type":"DefinedTermSet"',
    '"@id":"https://www.unwindcode.ai/philosophy/#operating-doctrine"',
    '"name":"Unwind Code Operating Doctrine"',
    '"@id":"https://www.unwindcode.ai/philosophy/#operating-doctrine-compass-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/operating-doctrine-compass.svg"',
    '"name":"Money as armor"',
    '"name":"Human authority"',
    '"inLanguage":["en","es"]',
  ]) {
    assert.ok(source.includes(snippet), `philosophy page missing doctrine snippet ${snippet}`);
  }

  for (const snippet of [
    "'philPage.hero.kicker': 'Operating doctrine'",
    "'philPage.compass.kicker': 'Doctrine compass'",
    "'philPage.compass.title': 'Inspect the rule before the organism is allowed to move.'",
    "'philPage.compass.authority.tab': 'Authority'",
    "'philPage.compass.money.boundary': 'No private keys, no hidden broadcast, no live money movement by default.'",
    "'philPage.compass.proofLane.title': 'Proof before claims keeps belief from outrunning evidence.'",
    "'philPage.compass.light.constraint': 'Automation earns value by lowering suffering and increasing clarity, not by replacing care or judgment.'",
    "'philPage.doctrine.title': 'A philosophy only matters if it changes what the system is allowed to do.'",
    "'philPage.fact.authority.label': 'Authority'",
    "'philPage.fact.web3.desc': 'On-chain intelligence begins as read-only simulation, unsigned review packets, and no hidden wallet authority.'",
    "'philPage.principle.light.title': 'Preserve the light'",
    "'philPage.translation.title': 'How philosophy changes the product path.'",
    "'philPage.next.primary': 'Inspect proof'",
    "'philPage.hero.kicker': 'Doctrina operativa'",
    "'philPage.compass.kicker': 'Brújula de doctrina'",
    "'philPage.compass.title': 'Inspecciona la regla antes de permitir que el organismo se mueva.'",
    "'philPage.compass.authority.tab': 'Autoridad'",
    "'philPage.compass.money.boundary': 'Sin llaves privadas, sin broadcast oculto, sin movimiento de dinero en vivo por defecto.'",
    "'philPage.compass.proofLane.title': 'Prueba antes de claims evita que la creencia corra más rápido que la evidencia.'",
    "'philPage.compass.light.constraint': 'La automatización gana valor al bajar sufrimiento y aumentar claridad, no al reemplazar cuidado o juicio.'",
    "'philPage.doctrine.title': 'Una filosofía solo importa si cambia lo que el sistema tiene permitido hacer.'",
    "'philPage.fact.authority.label': 'Autoridad'",
    "'philPage.fact.web3.desc': 'La inteligencia on-chain empieza como simulación read-only, paquetes sin firma y sin autoridad oculta de wallet.'",
    "'philPage.principle.light.title': 'Preserva la luz'",
    "'philPage.translation.title': 'Cómo la filosofía cambia la ruta de producto.'",
    "'philPage.next.primary': 'Inspeccionar prueba'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing philosophy doctrine snippet ${snippet}`);
  }

  for (const snippet of [
    '.doctrine-compass-board',
    '.doctrine-compass-tabs label:hover',
    '#doctrine-lane-money:checked ~ .doctrine-compass-panels .doctrine-panel-money',
    '#doctrine-lane-clarity:focus-visible ~ .doctrine-compass-tabs label[for="doctrine-lane-clarity"]',
    '.doctrine-compass-asset',
    'pointer-events: none;',
    '@keyframes doctrine-compass-drift',
    'grid-template-columns: repeat(2, minmax(0, 1fr))',
    '@media (max-width: 640px)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing operating doctrine compass snippet ${snippet}`);
  }

  const asset = manifest.assets.find(item => item.id === 'operating-doctrine-compass');
  assert.ok(asset, 'asset manifest missing operating doctrine compass');
  assert.equal(asset.file, 'assets/visuals/operating-doctrine-compass.svg');
  assert.equal(asset.route, '/philosophy');
  assert.equal(asset.surface, '#doctrine-compass-title');
  assert.match(asset.accessibility, /native radio controls/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'Operating doctrine compass SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'Operating doctrine compass SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'Operating doctrine compass SVG should not embed UI text');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'Operating doctrine compass SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'Operating doctrine compass SVG should be presentational');

  for (const snippet of [
    'Operating Doctrine',
    'Operating Doctrine Compass',
    'prime directive becomes product constraints',
    'clarity, human authority, money as armor, proof before claims, and preserve the light',
  ]) {
    assert.ok(llms.includes(snippet), `llms.txt missing philosophy doctrine snippet ${snippet}`);
  }

  for (const snippet of [
    '"name": "Operating Doctrine"',
    '"name": "Money as armor"',
    '"operating_doctrine"',
    '"id": "operating_doctrine_compass"',
    '"name": "Operating Doctrine Compass"',
    'clarity, human authority, money as armor, proof before claims, and preserve the light',
    '"principle": "Preserve the light"',
  ]) {
    assert.ok(services.includes(snippet), `ai-services missing philosophy doctrine snippet ${snippet}`);
  }
});

test('vision page turns the long-range thesis into a bilingual proof roadmap', async () => {
  const source = await readFile(new URL('../vision/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/vision-roadmap-observatory.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'data-i18n="visPage.hero.kicker"',
    'data-i18n="visPage.hero.title"',
    'class="lab-section vision-observatory-section"',
    'aria-labelledby="vision-observatory-title"',
    'id="vision-observatory-title"',
    'data-asset-id="vision-roadmap-observatory"',
    'assets/visuals/vision-roadmap-observatory.svg',
    'class="vision-observatory-board"',
    'class="vision-observatory-selector"',
    'id="vision-lane-proof"',
    'id="vision-lane-product"',
    'id="vision-lane-web3"',
    'id="vision-lane-culture"',
    'data-i18n="visPage.observatory.web3.boundary"',
    'data-i18n="visPage.observatory.culture.proof"',
    'href="/organisms/financial-organisms"',
    'href="/build-with-us"',
    'id="vision-roadmap"',
    'aria-labelledby="vision-roadmap-title"',
    'class="vision-timeline"',
    'class="vision-stage"',
    'data-i18n="visPage.stage.mirror.title"',
    'data-i18n="visPage.stage.visual.title"',
    'data-i18n="visPage.stage.financial.title"',
    'data-i18n="visPage.stage.brain.title"',
    'data-i18n="visPage.stage.culture.title"',
    'data-i18n="visPage.stage.machine.title"',
    'id="vision-invariant-title"',
    'data-i18n="visPage.fact.authority.label"',
    'data-i18n="visPage.fact.simulation.label"',
    'data-i18n="visPage.fact.identity.label"',
    'id="vision-next-title"',
    '"@type":"ItemList"',
    '"@id":"https://www.unwindcode.ai/vision/#vision-roadmap"',
    '"name":"Vision roadmap"',
    '"name":"Intelligence that evolves"',
    '"name":"Culture-bearing intelligence"',
    '"@id":"https://www.unwindcode.ai/vision/#vision-roadmap-observatory-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/vision-roadmap-observatory.svg"',
    '"inLanguage":["en","es"]',
  ]) {
    assert.ok(source.includes(snippet), `vision page missing proof-roadmap snippet ${snippet}`);
  }

  assert.equal(source.match(/<li class="vision-stage/g)?.length ?? 0, 7, 'vision page should expose seven roadmap stages');

  for (const snippet of [
    "'visPage.observatory.kicker': 'Roadmap observatory'",
    "'visPage.observatory.title': 'Inspect the future by proof lane, not by hype cycle.'",
    "'visPage.observatory.proofLane.tab': 'Public proof'",
    "'visPage.observatory.product.tab': 'Product organisms'",
    "'visPage.observatory.web3.tab': 'Web3 value'",
    "'visPage.observatory.web3.proof': 'The lane must prove no private keys, no hidden broadcast, no live money motion, and clear approval checkpoints.'",
    "'visPage.observatory.web3.boundary': 'Wallet signing, transaction broadcast, and treasury action remain unavailable by default.'",
    "'visPage.observatory.culture.title': 'Culture-bearing intelligence and machine coordination stay governed by identity, memory, and proof.'",
    "'visPage.roadmap.kicker': 'From now to next civilization'",
    "'visPage.roadmap.title': 'The roadmap is not a promise of autonomy. It is a sequence of proof gates.'",
    "'visPage.stage.culture.title': 'Uncuba.ai and culture-bearing intelligence'",
    "'visPage.stage.machine.title': 'Governed machine coordination'",
    "'visPage.invariants.title': 'The system can become more capable without becoming unaccountable.'",
    "'visPage.fact.simulation.label': 'Simulation'",
    "'visPage.next.primary': 'Inspect proof'",
    "'visPage.observatory.kicker': 'Observatorio del roadmap'",
    "'visPage.observatory.title': 'Inspecciona el futuro por ruta de prueba, no por ciclo de hype.'",
    "'visPage.observatory.proofLane.tab': 'Prueba pública'",
    "'visPage.observatory.product.tab': 'Organismos producto'",
    "'visPage.observatory.web3.tab': 'Valor Web3'",
    "'visPage.observatory.web3.proof': 'La ruta debe probar que no hay llaves privadas, broadcast oculto, movimiento de dinero en vivo y que existen checkpoints claros de aprobación.'",
    "'visPage.observatory.web3.boundary': 'Firma de wallet, broadcast de transacciones y acción de tesorería no están disponibles por defecto.'",
    "'visPage.observatory.culture.title': 'La inteligencia con cultura y la coordinación máquina-a-máquina siguen gobernadas por identidad, memoria y prueba.'",
    "'visPage.roadmap.kicker': 'De ahora a la siguiente civilización'",
    "'visPage.roadmap.title': 'El roadmap no es una promesa de autonomía. Es una secuencia de compuertas de prueba.'",
    "'visPage.stage.culture.title': 'Uncuba.ai e inteligencia con cultura'",
    "'visPage.stage.machine.title': 'Coordinación máquina-a-máquina gobernada'",
    "'visPage.invariants.title': 'El sistema puede volverse más capaz sin volverse irresponsable.'",
    "'visPage.fact.simulation.label': 'Simulación'",
    "'visPage.next.primary': 'Inspeccionar prueba'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing vision roadmap snippet ${snippet}`);
  }

  for (const snippet of [
    '.vision-observatory-board',
    '.vision-observatory-tabs label:hover',
    '#vision-lane-proof:focus-visible ~ .vision-observatory-tabs label[for="vision-lane-proof"]',
    '#vision-lane-web3:checked ~ .vision-observatory-panels .vision-panel-web3',
    '.vision-observatory-asset',
    'pointer-events: none;',
    '@keyframes vision-observatory-drift',
    'grid-template-columns: repeat(2, minmax(0, 1fr))',
    '@media (max-width: 640px)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing vision observatory snippet ${snippet}`);
  }

  const asset = manifest.assets.find(item => item.id === 'vision-roadmap-observatory');
  assert.ok(asset, 'asset manifest missing vision roadmap observatory');
  assert.equal(asset.file, 'assets/visuals/vision-roadmap-observatory.svg');
  assert.equal(asset.route, '/vision');
  assert.equal(asset.surface, '#vision-observatory-title');
  assert.match(asset.accessibility, /native radio controls/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'Vision observatory SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'Vision observatory SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'Vision observatory SVG should not embed UI text');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'Vision observatory SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'Vision observatory SVG should be presentational');

  for (const snippet of [
    'Vision Roadmap',
    'Vision Roadmap Observatory',
    'proof-first architecture, Infinity Mirror, Visual Cortex, Financial Organisms',
    'public proof, product organisms, Web3 value, and culture horizon lanes',
    'human authority, public proof, Web3 simulation before motion',
  ]) {
    assert.ok(llms.includes(snippet), `llms.txt missing vision roadmap snippet ${snippet}`);
  }

  for (const snippet of [
    '"name": "Intelligence that evolves"',
    '"name": "Culture-bearing intelligence"',
    '"vision_roadmap"',
    '"id": "vision_roadmap_observatory"',
    '"name": "Vision Roadmap Observatory"',
    'public proof, product organisms, Web3 value, and culture horizon lanes',
    '"stage": "2028"',
    '"name": "Governed machine coordination"',
  ]) {
    assert.ok(services.includes(snippet), `ai-services missing vision roadmap snippet ${snippet}`);
  }
});

test('transmissions archive is a bilingual proof library with reader lanes', async () => {
  const source = await readFile(new URL('../transmissions/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');

  assert.equal(source.includes('onclick='), false, 'transmissions archive should not use inline click handlers');
  assert.equal(source.includes('style='), false, 'transmissions archive should not use inline styles');
  assert.equal(source.match(/<a href="\/transmissions\/[^"]+" class="tx-card"/g)?.length ?? 0, 32, 'transmissions archive should preserve 32 transmission cards');
  assert.equal(source.match(/class="tx-path-card/g)?.length ?? 0, 5, 'transmissions archive should expose five reader lanes');

  for (const snippet of [
    'data-i18n="txPage.hero.kicker"',
    'data-i18n="txPage.hero.title"',
    'id="proof-reading-paths"',
    'aria-labelledby="tx-reading-title"',
    'data-i18n="txPage.path.whitepaper.title"',
    'data-i18n="txPage.path.safety.title"',
    'data-i18n="txPage.path.product.title"',
    'data-i18n="txPage.path.web3.title"',
    'data-i18n="txPage.path.organisms.title"',
    'id="tx-featured-title"',
    'id="archive"',
    'class="tx-library-filters"',
    'data-i18n="txPage.next.title"',
    '"@type":"Blog"',
    '"@type":"BlogPosting"',
    '"@type":"ItemList"',
    '"@id":"https://www.unwindcode.ai/transmissions/#transmission-list"',
    '"numberOfItems":32',
    '"@type":"DefinedTerm"',
    '"name":"Transmission"',
    '"inLanguage":["en","es"]',
  ]) {
    assert.ok(source.includes(snippet), `transmissions archive missing proof-library snippet ${snippet}`);
  }

  for (const snippet of [
    "'txPage.hero.kicker': 'Proof library'",
    "'txPage.hero.title': 'Read the organism while it is being built.'",
    "'txPage.path.safety.title': 'Inspect refusal before power.'",
    "'txPage.path.web3.title': 'Follow clarity before financial motion.'",
    "'txPage.featured.title': 'The Quotation Cell'",
    "'txPage.topic.domainCell': 'Domain Cell'",
    "'txPage.date.june': 'June 2026'",
    "'txPage.next.primary': 'Build with us'",
    "'txPage.hero.kicker': 'Biblioteca de prueba'",
    "'txPage.hero.title': 'Lee el organismo mientras se construye.'",
    "'txPage.path.safety.title': 'Inspecciona rechazo antes de poder.'",
    "'txPage.path.web3.title': 'Sigue claridad antes de movimiento financiero.'",
    "'txPage.featured.title': 'La célula de cotización'",
    "'txPage.topic.domainCell': 'Célula de Dominio'",
    "'txPage.date.june': 'Junio 2026'",
    "'txPage.next.primary': 'Construir con nosotros'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing transmissions archive snippet ${snippet}`);
  }

  for (const snippet of [
    'Transmission Library',
    '31 dispatches as a proof library',
    'Transmission 25 documents the homepage Organism Pulse Field',
    'whitepaper, safety gate, product form, Web3 boundary',
  ]) {
    assert.ok(llms.includes(snippet), `llms.txt missing transmission library snippet ${snippet}`);
  }

  for (const snippet of [
    '"name": "Transmission"',
    '"transmission_library"',
    '"total_transmissions": 31',
    '"id": "transmission_25"',
    '"id": "transmission_26"',
    '"id": "transmission_27"',
    '"lane": "safety_gate"',
    '"lane": "organisms_not_apps"',
  ]) {
    assert.ok(services.includes(snippet), `ai-services missing transmission library snippet ${snippet}`);
  }
});

test('transmission 25 documents the homepage organism pulse release', async () => {
  const source = await readFile(new URL('../transmissions/25-the-homepage-learned-to-pulse.html', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const sitemap = await readFile(new URL('../sitemap.xml', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));

  assert.equal(source.includes('onclick='), false, 'Transmission 25 should not use inline click handlers');
  assert.equal(source.includes('style='), false, 'Transmission 25 should not use inline styles');

  for (const snippet of [
    'Transmission 25: The Homepage Learned to Pulse',
    'rel="canonical" href="https://www.unwindcode.ai/transmissions/25-the-homepage-learned-to-pulse"',
    '<meta property="og:type" content="article" />',
    '"@type":"Article"',
    '"datePublished":"2026-06-05"',
    '"mainEntityOfPage":"https://www.unwindcode.ai/transmissions/25-the-homepage-learned-to-pulse"',
    'class="tx-release-console"',
    'assets/visuals/organism-pulse-field.svg',
    'id="social-proof-packet"',
    'class="tx-social-packet-grid"',
    'class="tx-social-slide tx-social-slide-featured"',
    'class="tx-social-slide tx-social-slide-support"',
    '/social/transmission-25-homepage-pulse-carousel/previews/slide-01-preview.png',
    '/social/transmission-25-homepage-pulse-carousel/ready-to-upload/01-homepage-learned-to-pulse.png',
    '/social/transmission-25-homepage-pulse-carousel/downloads/transmission-25-homepage-pulse-carousel.zip',
    '/social/transmission-25-homepage-pulse-carousel/carousel#slide-1',
    '/social/transmission-25-homepage-pulse-carousel/caption.md',
    'Download packet',
    'download',
    'The public meaning lives in HTML, schema, translations, tests, and the asset manifest.',
    'money, files, public posts, and Web3 broadcast stay approval-gated',
    'href="/proof"',
    'href="/build-with-us"',
  ]) {
    assert.ok(source.includes(snippet), `Transmission 25 missing release snippet ${snippet}`);
  }

  for (const snippet of [
    '.tx-release-hero',
    '.tx-release-console',
    '.tx-release-step-list',
    '.tx-release-proof-grid',
    '.tx-social-packet-section',
    '.tx-social-packet-grid',
    '.tx-social-slide',
    '.tx-social-slide-featured',
    '.tx-social-slide-support',
    'grid-template-columns: minmax(0, 1fr) minmax(104px, 0.32fr)',
    'grid-template-rows: repeat(3, minmax(0, 1fr))',
    'aspect-ratio: 1 / 1',
    'grid-row: 1 / span 3',
    'height: 100%',
    'object-fit: contain',
    'grid-template-columns: repeat(2, minmax(0, 1fr))',
    'grid-column: auto',
    '.tx-social-packet-actions',
    '@media (max-width: 640px)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing Transmission 25 snippet ${snippet}`);
  }

  assert.ok(sitemap.includes('https://www.unwindcode.ai/transmissions/25-the-homepage-learned-to-pulse'), 'sitemap missing Transmission 25');
  assert.ok(sitemap.includes('https://www.unwindcode.ai/social/transmission-25-homepage-pulse-carousel/carousel'), 'sitemap missing Transmission 25 carousel');
  assert.ok(llms.includes('Transmission 25: https://www.unwindcode.ai/transmissions/25-the-homepage-learned-to-pulse'), 'llms missing Transmission 25');
  assert.ok(llms.includes('Transmission 25 social carousel: https://www.unwindcode.ai/social/transmission-25-homepage-pulse-carousel/carousel#slide-1'), 'llms missing Transmission 25 social carousel');
  assert.ok(llms.includes('https://www.unwindcode.ai/social/transmission-25-homepage-pulse-carousel/downloads/transmission-25-homepage-pulse-carousel.zip'), 'llms missing Transmission 25 carousel ZIP');
  assert.ok(services.includes('"id": "transmission_25"'), 'ai-services missing Transmission 25 proof artifact');
  assert.ok(services.includes('"id": "transmission_25_social_carousel"'), 'ai-services missing Transmission 25 social carousel');
  assert.ok(services.includes('"download_packet": "https://www.unwindcode.ai/social/transmission-25-homepage-pulse-carousel/downloads/transmission-25-homepage-pulse-carousel.zip"'), 'ai-services missing Transmission 25 carousel ZIP');

  const asset = manifest.assets.find(item => item.id === 'transmission-25-social-carousel');
  assert.ok(asset, 'asset manifest missing Transmission 25 social carousel');
  assert.equal(asset.file, 'social/transmission-25-homepage-pulse-carousel/ready-to-upload/01-homepage-learned-to-pulse.png');
  assert.equal(asset.download_packet, 'social/transmission-25-homepage-pulse-carousel/downloads/transmission-25-homepage-pulse-carousel.zip');
  assert.equal(asset.surface, '#social-proof-packet');
  assert.equal(asset.performance.loading, 'lazy');
});

test('post-gate transmissions expose complete Instagram carousel packets from the website journey', async () => {
  const archive = await readFile(new URL('../transmissions/index.html', import.meta.url), 'utf8');
  const sitemap = await readFile(new URL('../sitemap.xml', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = JSON.parse(await readFile(new URL('../ai-services.json', import.meta.url), 'utf8'));
  const servicesText = JSON.stringify(services);
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const effectiveFrom = services.transmission_library?.social_packet_standard?.effective_from_transmission ?? 25;
  const currentDeskPackets = services.transmission_library?.social_packet_desk?.current_packets ?? [];
  // Post-merge governance: legacy release pages 25 and 27 keep their public packet
  // sections; every later transmission keeps posting assets internal creator material.
  const PUBLICLY_SURFACED_PACKET_NUMBERS = new Set([25, 27]);
  const publicRoutes = new Map();

  for (const match of archive.matchAll(/href="\/transmissions\/(\d{2})-([^".]+)"/g)) {
    const number = Number(match[1]);
    const route = `/transmissions/${match[1]}-${match[2]}`;
    if (number >= effectiveFrom) {
      publicRoutes.set(number, route);
    }
  }

  assert.ok(publicRoutes.size > 0, 'archive should expose post-gate transmissions');

  const postGateRoutes = [...publicRoutes.entries()].sort(([a], [b]) => a - b);
  const latestPostGateRoutes = postGateRoutes.slice(-3).map(([number]) => number);

  for (const [number, route] of postGateRoutes) {
    const id = `transmission-${number}-social-carousel`;
    const aiId = `transmission_${number}_social_carousel`;
    const asset = manifest.assets.find(item => item.id === id);

    assert.ok(asset, `asset manifest missing ${id}`);
    assert.equal(asset.route, route, `${id} should point at its transmission page`);
    assert.equal(asset.surface, '#social-proof-packet', `${id} should surface on the page packet section`);
    assert.equal(asset.format, 'image/png', `${id} should be an upload-ready PNG packet`);
    const publiclySurfaced = PUBLICLY_SURFACED_PACKET_NUMBERS.has(number);
    assert.equal(
      asset.status,
      publiclySurfaced ? 'production' : 'internal',
      `${id} should be production when surfaced and internal creator material otherwise`,
    );
    assert.ok(asset.file.includes('/ready-to-upload/'), `${id} should point to an upload-ready frame`);
    assert.ok(asset.download_packet?.endsWith('.zip'), `${id} should expose a ZIP packet`);

    const packetDir = asset.file.replace(/\/ready-to-upload\/[^/]+$/, '');
    const carouselPath = `${packetDir}/carousel.html`;
    const captionPath = `${packetDir}/caption.md`;
    const readmePath = `${packetDir}/README.md`;
    const carouselUrl = `https://www.unwindcode.ai/${packetDir}/carousel`;
    const downloadUrl = `https://www.unwindcode.ai/${asset.download_packet}`;
    const transmissionPage = await readFile(new URL(`..${route}.html`, import.meta.url), 'utf8');
    const uploadFiles = (await readdir(new URL(`../${packetDir}/ready-to-upload/`, import.meta.url)))
      .filter(file => file.endsWith('.png'))
      .sort();
    const previewFiles = (await readdir(new URL(`../${packetDir}/previews/`, import.meta.url)))
      .filter(file => file.endsWith('.png'))
      .sort();
    const exportFiles = (await readdir(new URL(`../${packetDir}/exports/`, import.meta.url)))
      .filter(file => file.endsWith('.png'))
      .sort();

    await access(new URL(`../${asset.file}`, import.meta.url));
    await access(new URL(`../${asset.download_packet}`, import.meta.url));
    await access(new URL(`../${carouselPath}`, import.meta.url));
    await access(new URL(`../${captionPath}`, import.meta.url));
    await access(new URL(`../${readmePath}`, import.meta.url));

    assert.ok(uploadFiles.length >= 4, `${id} should have at least four upload-ready PNGs`);
    assert.ok(previewFiles.length >= 4, `${id} should have at least four 540px previews`);
    assert.ok(exportFiles.length >= 4, `${id} should have at least four rendered exports`);

    if (publiclySurfaced) {
      assert.ok(transmissionPage.includes('id="social-proof-packet"'), `${route} missing visible packet section`);
      assert.ok(transmissionPage.includes(`/${packetDir}/carousel#slide-1`), `${route} missing open carousel action`);
      assert.ok(transmissionPage.includes(`/${asset.download_packet}`), `${route} missing ZIP download action`);
      assert.ok(transmissionPage.includes(`/${captionPath}`), `${route} missing caption action`);

      for (const file of uploadFiles.slice(0, 4)) {
        assert.ok(transmissionPage.includes(`/${packetDir}/ready-to-upload/${file}`), `${route} missing upload frame ${file}`);
      }

      for (const file of previewFiles.slice(0, 4)) {
        assert.ok(transmissionPage.includes(`/${packetDir}/previews/${file}`), `${route} missing preview frame ${file}`);
      }
    } else {
      assert.equal(transmissionPage.includes('id="social-proof-packet"'), false, `${route} must keep posting assets internal`);
      assert.equal(/\/social\/transmission-[^"']+/i.test(transmissionPage), false, `${route} must not link internal posting assets`);
    }

    assert.ok(llms.includes(`Transmission ${number} social carousel: ${carouselUrl}#slide-1`), `llms missing Transmission ${number} carousel`);
    assert.ok(llms.includes(downloadUrl), `llms missing Transmission ${number} ZIP`);
    assert.ok(sitemap.includes(carouselUrl), `sitemap missing Transmission ${number} carousel`);
    assert.ok(servicesText.includes(`"id":"${aiId}"`) || servicesText.includes(`"id": "${aiId}"`), `ai-services missing ${aiId}`);
    assert.ok(servicesText.includes(downloadUrl), `ai-services missing ${aiId} ZIP`);

    if (latestPostGateRoutes.includes(number)) {
      assert.ok(currentDeskPackets.includes(aiId), `Social Packet Desk metadata missing ${aiId}`);
    }
  }
});

test('transmissions page exposes a governed transmission atlas map', async () => {
  const source = await readFile(new URL('../transmissions/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/transmission-atlas-map.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'class="lab-section transmission-atlas-section"',
    'aria-labelledby="transmission-atlas-title"',
    'id="transmission-atlas-title"',
    'data-asset-id="transmission-atlas-map"',
    'assets/visuals/transmission-atlas-map.svg',
    'class="transmission-atlas-board"',
    'class="transmission-atlas-node"',
    'data-i18n="txPage.atlas.kicker"',
    'data-i18n="txPage.atlas.title"',
    'data-i18n="txPage.atlas.field.title"',
    'data-i18n="txPage.atlas.route.desc"',
    'href="/proof"',
    'href="/build-with-us"',
    '"@type":"ImageObject"',
    '"@id":"https://www.unwindcode.ai/transmissions/#transmission-atlas-map-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/transmission-atlas-map.svg"',
  ]) {
    assert.ok(source.includes(snippet), `transmissions page missing atlas snippet ${snippet}`);
  }

  for (const snippet of [
    "'txPage.atlas.kicker': 'Transmission atlas'",
    "'txPage.atlas.title': 'The archive becomes proof when each dispatch lands on the organism map.'",
    "'txPage.atlas.field.title': 'Field note'",
    "'txPage.atlas.arch.title': 'Architecture proof'",
    "'txPage.atlas.web3.title': 'Web3 boundary'",
    "'txPage.atlas.route.title': 'Collaboration route'",
    "'txPage.social.kicker': 'Social packet desk'",
    "'txPage.social.title': 'Every approved release now leaves a post-ready proof packet.'",
    "'txPage.social.rule.manual': 'Manual posting gate'",
    "'txPage.social.t27.title': 'The Quotation Cell'",
    "'txPage.social.action.download': 'Download ZIP'",
    "'txPage.atlas.kicker': 'Atlas de transmisiones'",
    "'txPage.atlas.title': 'El archivo se vuelve prueba cuando cada despacho aterriza en el mapa del organismo.'",
    "'txPage.atlas.field.title': 'Nota de campo'",
    "'txPage.atlas.arch.title': 'Prueba de arquitectura'",
    "'txPage.atlas.web3.title': 'Límite Web3'",
    "'txPage.atlas.route.title': 'Ruta de colaboración'",
    "'txPage.social.kicker': 'Mesa de paquetes sociales'",
    "'txPage.social.title': 'Cada release aprobado ahora deja un paquete de prueba listo para publicar.'",
    "'txPage.social.rule.manual': 'Compuerta manual'",
    "'txPage.social.t27.title': 'La célula de cotización'",
    "'txPage.social.action.download': 'Descargar ZIP'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing transmission atlas snippet ${snippet}`);
  }

  assert.ok(css.includes('.transmission-atlas-board'), 'CSS missing transmission atlas board');
  assert.ok(css.includes('.transmission-atlas-node summary:focus-visible'), 'CSS missing transmission atlas keyboard focus state');
  assert.ok(css.includes('.transmission-atlas-asset'), 'CSS missing transmission atlas asset rules');
  assert.ok(css.includes('.tx-social-desk'), 'CSS missing transmission social packet desk');
  assert.ok(css.includes('.tx-social-desk-preview:focus-visible'), 'CSS missing social packet desk focus state');
  assert.ok(css.includes('.tx-social-desk-grid'), 'CSS missing social packet desk grid');
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'CSS missing reduced-motion media query');

  const asset = manifest.assets.find(item => item.id === 'transmission-atlas-map');
  assert.ok(asset, 'asset manifest missing transmission atlas map');
  assert.equal(asset.file, 'assets/visuals/transmission-atlas-map.svg');
  assert.equal(asset.route, '/transmissions');
  assert.equal(asset.surface, '#transmission-atlas-title');
  assert.match(asset.accessibility, /details\/summary/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'transmission atlas SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'transmission atlas SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'transmission atlas SVG should not embed UI text');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'transmission atlas SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'transmission atlas SVG should be presentational');

  assert.ok(llms.includes('Transmission Atlas Map'), 'llms.txt missing transmission atlas map');
  assert.ok(llms.includes('Social Packet Desk: https://www.unwindcode.ai/transmissions/#social-packet-desk'), 'llms.txt missing social packet desk');
  assert.ok(services.includes('"id": "transmission_atlas_map"'), 'ai-services missing transmission atlas asset');
  assert.ok(services.includes('"social_packet_desk"'), 'ai-services missing social packet desk');
  assert.ok(services.includes('"url": "https://www.unwindcode.ai/transmissions/#social-packet-desk"'), 'ai-services missing social packet desk URL');
});

test('homepage transmission teasers are semantic links without inline handlers', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');

  assert.equal(source.includes('onclick='), false, 'homepage should not use inline click handlers');
  assert.equal(source.includes('style='), false, 'homepage should not use inline styles for transmission teasers');

  for (const snippet of [
    '<a class="blog-card" href="/transmissions/27-the-quotation-cell">',
    '<a class="blog-card" href="/transmissions/23-the-sec-gate-an-organism-that-locks-its-own-hands">',
    '<a class="blog-card" href="/transmissions/21-the-unwind-brain-checkpoint-white-paper">',
    '<span class="blog-read" data-i18n="blog.read">Read Transmission</span>',
    '<div class="blog-archive-action">',
    'data-i18n="blog.archive.cta"',
  ]) {
    assert.ok(source.includes(snippet), `homepage missing semantic transmission snippet ${snippet}`);
  }

  for (const snippet of [
    "'blog.read': 'Read Transmission'",
    "'blog.archive.cta': 'Explore All Transmissions'",
    "'blog.read': 'Lee la Transmisión'",
    "'blog.archive.cta': 'Explora Todas las Transmisiones'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing transmission snippet ${snippet}`);
  }
});

test('build-with-us page routes every visitor type to a concrete next action', async () => {
  const source = await readFile(new URL('../build-with-us/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');

  for (const snippet of [
    'id="collaboration-lanes"',
    'aria-labelledby="collaboration-lanes-title"',
    'data-i18n="build.lanes.tag"',
    'data-i18n="build.lanes.title"',
    'data-i18n="build.lanes.desc"',
    'data-i18n="build.lanes.builder.title"',
    'data-i18n="build.lanes.investor.title"',
    'data-i18n="build.lanes.user.title"',
    'data-i18n="build.lanes.protocol.title"',
    'data-i18n="build.lanes.collaborator.title"',
    'href="/architecture"',
    'href="/proof"',
    'href="/organisms/infinity-mirror"',
    'href="/organisms/financial-organisms"',
    'href="/#cta"',
    'id="build-brief"',
    'aria-labelledby="build-brief-title"',
    'data-i18n="build.brief.goal"',
    'data-i18n="build.brief.boundary"',
    'data-i18n="build.brief.proof"',
    'data-i18n="build.brief.cta"',
    'data-i18n="build.schema.service"',
    '"@type":"Service"',
    '"name":"AI organism architecture collaboration"',
  ]) {
    assert.ok(source.includes(snippet), `build-with-us missing conversion snippet ${snippet}`);
  }

  for (const snippet of [
    "'build.lanes.tag': 'Choose Your Lane'",
    "'build.lanes.title': 'Different visitors need different proof.'",
    "'build.lanes.builder.title': 'Builders'",
    "'build.lanes.investor.title': 'Investors'",
    "'build.lanes.user.title': 'Users'",
    "'build.lanes.protocol.title': 'Protocols'",
    "'build.lanes.collaborator.title': 'Collaborators'",
    "'build.brief.title': 'What to send first.'",
    "'build.brief.goal': 'The outcome you want the organism to create.'",
    "'build.brief.boundary': 'The authority boundary it must never cross without approval.'",
    "'build.brief.proof': 'The evidence you would need before trusting it.'",
    "'build.lanes.tag': 'Elige tu Ruta'",
    "'build.lanes.title': 'Cada visitante necesita una prueba distinta.'",
    "'build.lanes.investor.title': 'Inversionistas'",
    "'build.lanes.user.title': 'Usuarios'",
    "'build.lanes.protocol.title': 'Protocolos'",
    "'build.lanes.collaborator.title': 'Colaboradores'",
    "'build.brief.title': 'Qué enviar primero.'",
    "'build.brief.goal': 'El resultado que quieres que el organismo cree.'",
    "'build.brief.boundary': 'El límite de autoridad que nunca debe cruzar sin aprobación.'",
    "'build.brief.proof': 'La evidencia que necesitarías antes de confiar en él.'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing build-with-us conversion snippet ${snippet}`);
  }
});

test('build-with-us page exposes an engagement fit selector with proof bars', async () => {
  const source = await readFile(new URL('../build-with-us/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/engagement-fit-compass.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'id="engagement-fit"',
    'aria-labelledby="engagement-fit-title"',
    'id="engagement-fit-title"',
    'class="engagement-fit-board"',
    'data-asset-id="engagement-fit-compass"',
    'assets/visuals/engagement-fit-compass.svg',
    '"@id":"https://www.unwindcode.ai/build-with-us/#engagement-fit-compass-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/engagement-fit-compass.svg"',
    'class="engagement-fit-selector"',
    'name="engagement-fit"',
    'id="engage-architecture"',
    'id="engage-prototype"',
    'id="engage-proof"',
    'id="engage-web3"',
    'id="engage-product"',
    'data-i18n="build.modes.tag"',
    'data-i18n="build.modes.meta.deliverable"',
    'data-i18n="build.modes.meta.proof"',
    'data-i18n="build.modes.meta.boundary"',
    'data-i18n="build.modes.web3.proof"',
    'href="/architecture"',
    'href="/proof"',
    'href="/organisms/financial-organisms"',
    'href="/#cta"',
  ]) {
    assert.ok(source.includes(snippet), `build-with-us missing engagement fit snippet ${snippet}`);
  }

  for (const snippet of [
    "'build.modes.tag': 'Engagement fit'",
    "'build.modes.title': 'Choose the smallest useful engagement.'",
    "'build.modes.meta.deliverable': 'Deliverable'",
    "'build.modes.meta.proof': 'Proof bar'",
    "'build.modes.arch.status': 'Fastest clarity'",
    "'build.modes.web3.proof': 'The lane proves no private keys, no hidden broadcast, no money motion by default.'",
    "'build.modes.product.cta': 'Map the product organism'",
    "'build.modes.tag': 'Encaje de colaboración'",
    "'build.modes.title': 'Elige la colaboración útil más pequeña.'",
    "'build.modes.meta.deliverable': 'Entregable'",
    "'build.modes.meta.proof': 'Barra de prueba'",
    "'build.modes.arch.status': 'Claridad rápida'",
    "'build.modes.web3.proof': 'La ruta prueba sin llaves privadas, sin broadcast oculto y sin movimiento de dinero por defecto.'",
    "'build.modes.product.cta': 'Mapea el organismo producto'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing engagement fit snippet ${snippet}`);
  }

  for (const snippet of [
    '.engagement-fit-section',
    '.engagement-fit-asset',
    '.engagement-fit-selector',
    '#engage-architecture:focus-visible',
    '.engagement-fit-panel',
    '.engagement-fit-panel dl',
    '@media (max-width: 640px)',
  ]) {
    assert.ok(css.includes(snippet), `CSS missing engagement fit snippet ${snippet}`);
  }

  assert.ok(llms.includes('Engagement Fit selector'), 'llms.txt missing engagement fit summary');
  assert.ok(llms.includes('Engagement Fit Compass'), 'llms.txt missing engagement fit compass');
  assert.ok(llms.includes('architecture review, prototype organism, proof-loop audit, Web3 simulation lane, and product organism'), 'llms.txt missing engagement mode list');
  assert.ok(services.includes('"engagement_modes"'), 'ai-services missing engagement modes');
  assert.ok(services.includes('"id": "engagement_fit_compass"'), 'ai-services missing engagement fit compass asset');
  assert.ok(services.includes('"id": "web3_simulation_lane"'), 'ai-services missing Web3 simulation engagement');
  assert.ok(services.includes('"proof_bar": "The lane proves no private keys, no hidden broadcast, no money motion by default."'), 'ai-services missing Web3 proof bar');

  const asset = manifest.assets.find(item => item.id === 'engagement-fit-compass');
  assert.ok(asset, 'asset manifest missing engagement fit compass');
  assert.equal(asset.file, 'assets/visuals/engagement-fit-compass.svg');
  assert.equal(asset.route, '/build-with-us');
  assert.equal(asset.surface, '#engagement-fit-title');
  assert.match(asset.accessibility, /native radio controls/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'engagement fit compass SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'engagement fit compass SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'engagement fit compass SVG should not embed UI text');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'engagement fit compass SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'engagement fit compass SVG should be presentational');
});

test('build-with-us page exposes a governed collaboration packet map', async () => {
  const source = await readFile(new URL('../build-with-us/index.html', import.meta.url), 'utf8');
  const i18n = await readFile(new URL('../i18n.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('../style.css', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const services = await readFile(new URL('../ai-services.json', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const svg = await readFile(new URL('../assets/visuals/collaboration-packet-map.svg', import.meta.url), 'utf8');

  for (const snippet of [
    'class="lab-section collaboration-packet-section"',
    'aria-labelledby="collaboration-packet-title"',
    'id="collaboration-packet-title"',
    'data-asset-id="collaboration-packet-map"',
    'assets/visuals/collaboration-packet-map.svg',
    'class="collaboration-packet-board"',
    'class="collaboration-packet-node"',
    'data-i18n="build.packet.kicker"',
    'data-i18n="build.packet.title"',
    'data-i18n="build.packet.signalNode.title"',
    'data-i18n="build.packet.sprint.desc"',
    'href="/proof"',
    'href="/#cta"',
    '"@type":"ImageObject"',
    '"@id":"https://www.unwindcode.ai/build-with-us/#collaboration-packet-map-asset"',
    '"contentUrl":"https://www.unwindcode.ai/assets/visuals/collaboration-packet-map.svg"',
  ]) {
    assert.ok(source.includes(snippet), `build-with-us missing collaboration packet snippet ${snippet}`);
  }

  for (const snippet of [
    "'build.packet.kicker': 'Collaboration packet'",
    "'build.packet.title': 'A serious inquiry becomes a bounded packet before it becomes work.'",
    "'build.packet.signalNode.title': 'Visitor signal'",
    "'build.packet.boundary.title': 'Authority boundary'",
    "'build.packet.sprint.title': 'First sprint packet'",
    "'build.packet.kicker': 'Paquete de colaboración'",
    "'build.packet.title': 'Una consulta seria se convierte en un paquete acotado antes de convertirse en trabajo.'",
    "'build.packet.signalNode.title': 'Señal del visitante'",
    "'build.packet.boundary.title': 'Límite de autoridad'",
    "'build.packet.sprint.title': 'Paquete de primer sprint'",
  ]) {
    assert.ok(i18n.includes(snippet), `i18n missing collaboration packet snippet ${snippet}`);
  }

  assert.ok(css.includes('.collaboration-packet-board'), 'CSS missing collaboration packet board');
  assert.ok(css.includes('.collaboration-packet-node summary:focus-visible'), 'CSS missing collaboration packet keyboard focus state');
  assert.ok(css.includes('.collaboration-packet-asset'), 'CSS missing collaboration packet asset rules');
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'CSS missing reduced-motion media query');

  const asset = manifest.assets.find(item => item.id === 'collaboration-packet-map');
  assert.ok(asset, 'asset manifest missing collaboration packet map');
  assert.equal(asset.file, 'assets/visuals/collaboration-packet-map.svg');
  assert.equal(asset.route, '/build-with-us');
  assert.equal(asset.surface, '#collaboration-packet-title');
  assert.match(asset.accessibility, /details\/summary/);
  assert.match(asset.text_policy, /No embedded UI text/);
  assert.match(asset.motion_policy, /prefers-reduced-motion/);
  assert.deepEqual(asset.performance.dependencies, []);

  assert.equal(/<script/i.test(svg), false, 'collaboration packet SVG should not contain scripts');
  assert.equal(/<foreignObject/i.test(svg), false, 'collaboration packet SVG should not contain foreignObject');
  assert.equal(/<text/i.test(svg), false, 'collaboration packet SVG should not embed UI text');
  assert.ok(svg.includes('prefers-reduced-motion: reduce'), 'collaboration packet SVG should include reduced-motion guard');
  assert.ok(svg.includes('role="presentation"'), 'collaboration packet SVG should be presentational');

  assert.ok(llms.includes('Collaboration Packet Map'), 'llms.txt missing collaboration packet map');
  assert.ok(services.includes('"id": "collaboration_packet_map"'), 'ai-services missing collaboration packet asset');
});
