import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

function archivedTransmissionRoutes(source) {
  const routes = new Map();
  for (const match of source.matchAll(/href="\/transmissions\/(\d{2})-([^"]+\.html)"/g)) {
    const number = Number(match[1]);
    routes.set(number, `/transmissions/${match[1]}-${match[2]}`);
  }
  return [...routes.entries()].sort((a, b) => a[0] - b[0]);
}

const requiredPaths = [
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
  '../build-with-us/index.html',
  '../transmissions/25-the-homepage-learned-to-pulse.html',
  '../transmissions/27-the-quotation-cell.html',
  '../assets/visuals/organism-pulse-field.svg',
  '../assets/visuals/organism-ecosystem-map.svg',
  '../assets/visuals/organism-difference-lens.svg',
  '../assets/visuals/organism-readiness-radar.svg',
  '../assets/visuals/architecture-proof-runway.svg',
  '../assets/visuals/homepage-doctrine-gateway.svg',
  '../assets/visuals/visitor-pathway-map.svg',
  '../assets/visuals/organism-fit-matrix.svg',
  '../assets/visuals/organism-identity-constellation.svg',
  '../assets/visuals/organism-interface-specimens.svg',
  '../assets/visuals/research-organism-field.svg',
  '../assets/visuals/infinity-mirror-reflection-loop.svg',
  '../assets/visuals/infinity-mirror-portal.svg',
  '../assets/visuals/visual-cortex-pipeline-map.svg',
  '../assets/visuals/brain-cell-lifecycle-map.svg',
  '../assets/visuals/organism-stack-glyphs.svg',
  '../assets/visuals/cognitive-flow-map.svg',
  '../assets/visuals/memory-continuity-map.svg',
  '../assets/visuals/web3-trust-layer-map.svg',
  '../assets/visuals/collaboration-packet-map.svg',
  '../assets/visuals/engagement-fit-compass.svg',
  '../assets/visuals/transmission-atlas-map.svg',
  '../assets/visuals/authority-gate-console.svg',
  '../assets/visuals/trust-diligence-console.svg',
  '../assets/visuals/asset-governance-ledger.svg',
  '../assets/social/unwindcode-lab-preview.svg',
  '../social/transmission-25-homepage-pulse-carousel/carousel.html',
  '../social/transmission-25-homepage-pulse-carousel/caption.md',
  '../social/transmission-25-homepage-pulse-carousel/previews/slide-01-preview.png',
  '../social/transmission-25-homepage-pulse-carousel/ready-to-upload/01-homepage-learned-to-pulse.png',
  '../social/transmission-25-homepage-pulse-carousel/downloads/transmission-25-homepage-pulse-carousel.zip',
  '../social/transmission-26-property-sales-intelligence-cell/carousel.html',
  '../social/transmission-26-property-sales-intelligence-cell/caption.md',
  '../social/transmission-26-property-sales-intelligence-cell/previews/slide-01-preview.png',
  '../social/transmission-26-property-sales-intelligence-cell/ready-to-upload/01-property-sales-intelligence-cell.png',
  '../social/transmission-26-property-sales-intelligence-cell/downloads/transmission-26-property-sales-intelligence-cell.zip',
  '../social/transmission-27-quotation-cell/carousel.html',
  '../social/transmission-27-quotation-cell/caption.md',
  '../social/transmission-27-quotation-cell/previews/slide-01-preview.png',
  '../social/transmission-27-quotation-cell/ready-to-upload/01-quotation-cell.png',
  '../social/transmission-27-quotation-cell/downloads/transmission-27-quotation-cell.zip',
  '../assets/asset-manifest.json',
  '../sitemap.xml',
  '../llms.txt',
  '../ai-services.json',
];

test('required public lab pages and AI discovery files exist', async () => {
  for (const relativePath of requiredPaths) {
    await access(new URL(relativePath, import.meta.url));
  }
});

test('production transmission social carousel packets stay upload-ready and discoverable', async () => {
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const services = JSON.parse(await readFile(new URL('../ai-services.json', import.meta.url), 'utf8'));
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const sitemap = await readFile(new URL('../sitemap.xml', import.meta.url), 'utf8');
  const servicesSource = JSON.stringify(services);
  const canonicalBase = 'https://www.unwindcode.ai/';
  const carouselAssets = manifest.assets
    .filter(asset => /^transmission-\d+-social-carousel$/.test(asset.id) && asset.status === 'production')
    .sort((a, b) => a.id.localeCompare(b.id));

  assert.ok(carouselAssets.length >= 2, 'expected production transmission social carousel assets');
  assert.match(services.transmission_library.publication_rule, /not treated as approved and posted/);
  assert.match(services.transmission_library.publication_rule, /social proof packet/);
  assert.equal(services.transmission_library.social_packet_standard.required_for, 'approved_or_posted_main_site_transmissions');
  assert.equal(services.transmission_library.social_packet_standard.default_slide_count, 4);
  assert.equal(services.transmission_library.social_packet_standard.effective_from_transmission, 25);
  assert.match(services.transmission_library.social_packet_standard.posting_gate, /do not auto-post/);
  assert.ok(llms.includes('Publication rule: once a transmission is approved for the main website'), 'llms missing social packet publication rule');
  assert.ok(llms.includes('This gate is enforced for Transmission 25 and later'), 'llms missing social packet enforcement floor');

  for (const asset of carouselAssets) {
    const [, number] = asset.id.match(/^transmission-(\d+)-social-carousel$/);
    assert.equal(asset.surface, '#social-proof-packet', `${asset.id} should point to the page packet section`);
    assert.equal(asset.format, 'image/png', `${asset.id} should expose upload-ready PNGs`);
    assert.equal(asset.performance.loading, 'lazy', `${asset.id} should lazy-load page previews`);
    assert.deepEqual(asset.performance.dependencies, [], `${asset.id} should not need runtime dependencies`);
    assert.match(asset.file, new RegExp(`^social/transmission-${number}-[^/]+/ready-to-upload/01-`));
    assert.match(asset.download_packet, new RegExp(`^social/transmission-${number}-[^/]+/downloads/transmission-${number}-[^/]+\\.zip$`));

    const packetRoot = asset.file.replace(/\/ready-to-upload\/[^/]+$/, '');
    const pagePath = `..${asset.route}`;
    const carouselPath = `../${packetRoot}/carousel.html`;
    const captionPath = `../${packetRoot}/caption.md`;
    const readmePath = `../${packetRoot}/README.md`;
    const downloadPath = `../${asset.download_packet}`;
    const carouselUrl = `${canonicalBase}${packetRoot}/carousel.html#slide-1`;
    const downloadUrl = `${canonicalBase}${asset.download_packet}`;

    for (const relativePath of [pagePath, carouselPath, captionPath, readmePath, downloadPath, `../${asset.file}`]) {
      await access(new URL(relativePath, import.meta.url));
    }

    const readyFiles = (await readdir(new URL(`../${packetRoot}/ready-to-upload/`, import.meta.url)))
      .filter(file => file.endsWith('.png'))
      .sort();
    const previewFiles = (await readdir(new URL(`../${packetRoot}/previews/`, import.meta.url)))
      .filter(file => file.endsWith('.png'))
      .sort();
    const exportFiles = (await readdir(new URL(`../${packetRoot}/exports/`, import.meta.url)))
      .filter(file => file.endsWith('.png'))
      .sort();

    assert.equal(readyFiles.length, 4, `${asset.id} should have four upload-ready IG frames`);
    assert.equal(previewFiles.length, 4, `${asset.id} should have four lightweight page previews`);
    assert.equal(exportFiles.length, 4, `${asset.id} should have four source exports`);

    for (const index of [1, 2, 3, 4]) {
      const padded = String(index).padStart(2, '0');
      assert.ok(readyFiles.some(file => file.startsWith(`${padded}-`)), `${asset.id} missing ready frame ${padded}`);
      assert.ok(previewFiles.includes(`slide-${padded}-preview.png`), `${asset.id} missing preview ${padded}`);
      assert.ok(exportFiles.includes(`slide-${padded}.png`), `${asset.id} missing export ${padded}`);
    }

    const page = await readFile(new URL(pagePath, import.meta.url), 'utf8');
    assert.ok(page.includes('id="social-proof-packet"'), `${asset.route} missing visible social packet section`);
    assert.ok(page.includes(`/${packetRoot}/carousel.html#slide-1`), `${asset.route} missing carousel action`);
    assert.ok(page.includes(`/${asset.download_packet}`), `${asset.route} missing download packet action`);
    assert.ok(page.includes(`/${packetRoot}/caption.md`), `${asset.route} missing caption packet action`);
    assert.ok(page.includes(`/${packetRoot}/previews/slide-01-preview.png`), `${asset.route} missing preview thumbnails`);
    assert.ok(page.includes(`/${packetRoot}/ready-to-upload/01-`), `${asset.route} missing upload PNG download link`);
    assert.ok(page.includes('loading="lazy"'), `${asset.route} should lazy-load carousel previews`);

    assert.ok(llms.includes(carouselUrl), `llms missing ${carouselUrl}`);
    assert.ok(llms.includes(downloadUrl), `llms missing ${downloadUrl}`);
    assert.ok(sitemap.includes(`${canonicalBase}${packetRoot}/carousel.html`), `sitemap missing ${packetRoot}/carousel.html`);
    assert.ok(servicesSource.includes(`"id":"transmission_${number}_social_carousel"`), `ai-services missing transmission_${number}_social_carousel`);
    assert.ok(servicesSource.includes(downloadUrl), `ai-services missing ${downloadUrl}`);
  }
});

test('posted transmissions after the social packet gate cannot bypass the IG carousel packet', async () => {
  const archive = await readFile(new URL('../transmissions/index.html', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../assets/asset-manifest.json', import.meta.url), 'utf8'));
  const services = JSON.parse(await readFile(new URL('../ai-services.json', import.meta.url), 'utf8'));
  const llms = await readFile(new URL('../llms.txt', import.meta.url), 'utf8');
  const sitemap = await readFile(new URL('../sitemap.xml', import.meta.url), 'utf8');
  const servicesSource = JSON.stringify(services);
  const canonicalBase = 'https://www.unwindcode.ai/';
  const effectiveFrom = services.transmission_library.social_packet_standard.effective_from_transmission;
  const manifestById = new Map(manifest.assets.map(asset => [asset.id, asset]));
  const postedRoutes = archivedTransmissionRoutes(archive)
    .filter(([number]) => number >= effectiveFrom);

  assert.ok(postedRoutes.length >= 3, 'expected post-gate public transmissions in the archive');

  for (const [number, route] of postedRoutes) {
    const padded = String(number).padStart(2, '0');
    const assetId = `transmission-${number}-social-carousel`;
    const aiServicesId = `transmission_${number}_social_carousel`;
    const asset = manifestById.get(assetId);

    assert.ok(asset, `${route} is posted after the social packet gate but missing ${assetId}`);
    assert.equal(asset.route, route, `${assetId} should point back to its transmission page`);
    assert.equal(asset.surface, '#social-proof-packet', `${assetId} should declare the page packet surface`);
    assert.equal(asset.status, 'production', `${assetId} should be production once the transmission is posted`);

    const packetRoot = asset.file.replace(/\/ready-to-upload\/[^/]+$/, '');
    const page = await readFile(new URL(`..${route}`, import.meta.url), 'utf8');
    const carouselUrl = `${canonicalBase}${packetRoot}/carousel.html#slide-1`;
    const downloadUrl = `${canonicalBase}${asset.download_packet}`;

    assert.ok(page.includes('id="social-proof-packet"'), `${route} missing visible social proof packet`);
    assert.ok(page.includes(`/${packetRoot}/carousel.html#slide-1`), `${route} missing carousel opener`);
    assert.ok(page.includes(`/${asset.download_packet}`), `${route} missing packet ZIP link`);
    assert.ok(page.includes(`/${packetRoot}/caption.md`), `${route} missing caption packet link`);
    assert.ok(page.includes(`/${packetRoot}/previews/slide-01-preview.png`), `${route} missing first preview`);
    assert.ok(page.includes(`/${packetRoot}/ready-to-upload/01-`), `${route} missing upload-ready frame link`);
    assert.ok(sitemap.includes(`${canonicalBase}${route.slice(1)}`), `sitemap missing posted ${route}`);
    assert.ok(sitemap.includes(`${canonicalBase}${packetRoot}/carousel.html`), `sitemap missing carousel for Transmission ${padded}`);
    assert.ok(llms.includes(`Transmission ${number} social carousel: ${carouselUrl}`), `llms missing carousel for Transmission ${padded}`);
    assert.ok(llms.includes(downloadUrl), `llms missing download packet for Transmission ${padded}`);
    assert.ok(servicesSource.includes(`"id":"${aiServicesId}"`), `ai-services missing ${aiServicesId}`);
    assert.ok(servicesSource.includes(downloadUrl), `ai-services missing download packet for Transmission ${padded}`);
  }
});

test('vite config recursively discovers durable HTML pages', async () => {
  const source = await readFile(new URL('../vite.config.js', import.meta.url), 'utf8');

  assert.match(source, /discoverHtmlEntries/);
  assert.match(source, /pageEntries/);
  assert.match(source, /walk\(rootDir\)/);
  assert.match(source, /item\.name === 'index\.html'/);
  assert.match(source, /transmissionEntries/);
  assert.match(source, /copySocialPreviewAssets/);
  assert.match(source, /'assets', 'social'/);
  assert.match(source, /'assets', 'visuals'/);
  assert.match(source, /'dist\/assets\/social'/);
  assert.match(source, /'dist\/assets\/visuals'/);
  assert.match(source, /resolve\(__dirname, 'social'\)/);
  assert.match(source, /'dist\/social'/);
  assert.match(source, /'sitemap\.xml'/);
  assert.match(source, /'dist\/sitemap\.xml'/);
  assert.match(source, /'llms\.txt'/);
  assert.match(source, /'dist\/llms\.txt'/);
  assert.match(source, /'ai-services\.json'/);
  assert.match(source, /'dist\/ai-services\.json'/);
  assert.match(source, /'assets', 'asset-manifest\.json'/);
  assert.match(source, /'dist\/assets\/asset-manifest\.json'/);
  assert.match(source, /'\.vercel'/);
  assert.match(source, /'tmp'/);
  assert.match(source, /'social 2'/);
});
