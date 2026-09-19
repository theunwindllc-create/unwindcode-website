import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const modulePath = process.env.ATLAS_PUPPETEER_PATH;
if (!modulePath)
  throw new Error(
    "Set ATLAS_PUPPETEER_PATH to an installed puppeteer-core module.",
  );
const { default: puppeteer } = await import(pathToFileURL(modulePath));
const origin = process.env.ATLAS_PREVIEW_URL || "http://localhost:4199";
const output = new URL("../artifacts/living-atlas-qa/", import.meta.url);
await mkdir(output, { recursive: true });
const browser = await puppeteer.launch({
  executablePath:
    process.env.ATLAS_CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: [
    "--no-sandbox",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
const checks = [],
  errors = [],
  missing = [];
const pass = (name, detail = true) => {
  checks.push({ name, detail });
  console.log("PASS", name, JSON.stringify(detail));
};
try {
  const page = await browser.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400) missing.push({ url: r.url(), status: r.status() });
  });
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await page.goto(origin, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.title(), "Unwind Code — Intelligence That Evolves");
  const initialBytes = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .reduce((sum, r) => sum + r.transferSize, 0),
  );
  pass("Initial resource transfer bytes (local uncompressed)", initialBytes);
  await page.click("#motion-toggle");
  await page.screenshot({ path: new URL("desktop-hero.png", output).pathname });
  await page.$eval("#systems", (el) =>
    el.scrollIntoView({ behavior: "instant", block: "start" }),
  );
  await page.waitForFunction(() =>
    document.querySelector("[data-infinity]").classList.contains("webgl-ready"),
  );
  await page.screenshot({
    path: new URL("desktop-system.png", output).pathname,
  });
  pass("Native 3D initializes");
  for (const group of await page.$$("[data-tabs]")) {
    const tabs = await group.$$("[role=tab]");
    for (const tab of tabs) {
      await tab.click();
      const ok = await tab.evaluate(
        (el) =>
          el.getAttribute("aria-selected") === "true" &&
          !document.getElementById(el.getAttribute("aria-controls")).hidden,
      );
      assert.ok(ok);
    }
    await tabs[0].focus();
    await page.keyboard.press("End");
    assert.equal(
      await tabs
        .at(-1)
        .evaluate(
          (el) =>
            document.activeElement === el &&
            el.getAttribute("aria-selected") === "true",
        ),
      true,
    );
    await page.keyboard.press("Home");
  }
  pass("All loop, organ, memory and visitor tabs; End/Home keyboard controls");
  const links = await page.$$eval("a[href]", (nodes) => [
    ...new Set(nodes.map((n) => n.getAttribute("href"))),
  ]);
  const fragments = links.filter((href) => href.startsWith("#"));
  for (const href of fragments)
    assert.ok(await page.$(href), `Missing ${href}`);
  for (const href of links.filter((href) => href.startsWith("/"))) {
    const response = await fetch(new URL(href, origin));
    assert.equal(response.status, 200, href);
  }
  pass("All landing-page destinations and fragments resolve", links.length);
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = "eager";
    await Promise.all(
      [...document.images].map((img) => img.decode().catch(() => {})),
    );
  });
  assert.equal(
    await page.$$eval(
      "img",
      (nodes) => nodes.filter((n) => n.naturalWidth === 0).length,
    ),
    0,
  );
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  // Keep the full overview under software-renderer texture limits.
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 0.5 });
  await page.screenshot({
    path: new URL("desktop-full.png", output).pathname,
    fullPage: true,
  });
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  for (const id of [
    "organisms",
    "anatomy",
    "memory",
    "philosophy",
    "transmissions",
    "paths",
    "final",
  ]) {
    await page.$eval("#" + id, (el) =>
      el.scrollIntoView({ behavior: "instant", block: "start" }),
    );
    await page.screenshot({
      path: new URL("desktop-" + id + ".png", output).pathname,
    });
  }
  pass("All responsive imagery loads");
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    for (const lang of ["en", "es"]) {
      if ((await page.$eval("html", (el) => el.lang)) !== lang) {
        await page.$eval("#lang-toggle", (el) => el.click());
      }
      const overflow = await page.evaluate(() => ({
        page: document.documentElement.scrollWidth,
        viewport: innerWidth,
      }));
      if (overflow.page > overflow.viewport + 1)
        console.log(
          "Overflow nodes",
          await page.$$eval("body *", (els) =>
            els
              .map((el) => ({
                tag: el.tagName,
                cls: el.className,
                id: el.id,
                x: el.getBoundingClientRect().x,
                right: el.getBoundingClientRect().right,
              }))
              .filter((el) => el.right > innerWidth + 1),
          ),
        );
      assert.ok(
        overflow.page <= overflow.viewport + 1,
        `Overflow ${width}/${lang}: ${JSON.stringify(overflow)}`,
      );
      if (lang === "es")
        assert.equal(
          await page.$$eval(
            "[data-es]",
            (nodes) =>
              nodes.filter((el) => el.textContent !== el.dataset.es).length,
          ),
          0,
        );
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: "instant" }),
      );
      await page.screenshot({
        path: new URL(`${width}-${lang}.png`, output).pathname,
      });
    }
  }
  pass(
    "No horizontal overflow at 320, 390, 768, 1440px in EN and ES; all marked translations applied",
  );
  await page.reload({ waitUntil: "networkidle0" });
  assert.equal(await page.$eval("html", (el) => el.lang), "es");
  pass("Spanish preference persists");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.$eval("#lang-toggle", (el) => el.click());
  await page.click("#menu-toggle");
  assert.equal(await page.$eval("#mobile-menu", (el) => el.open), true);
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () => !document.querySelector("#mobile-menu").open,
  );
  assert.equal(
    await page.$eval("#menu-toggle", (el) => document.activeElement === el),
    true,
  );
  await page.click("#menu-toggle");
  await page.click('#mobile-menu a[href="#systems"]');
  await page.waitForFunction(() => document.activeElement.id === "systems");
  pass(
    "Mobile menu closes with Escape and returns focus; section links move focus correctly",
  );
  await page.$eval("#systems", (el) =>
    el.scrollIntoView({ behavior: "instant" }),
  );
  await page.screenshot({
    path: new URL("mobile-system.png", output).pathname,
  });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.waitForFunction(
    () =>
      document.querySelector("#motion-toggle").disabled &&
      document.documentElement.classList.contains("motion-paused"),
  );
  assert.equal(
    await page.$eval("html", (el) => el.classList.contains("motion-paused")),
    true,
  );
  assert.equal(await page.$eval("#motion-toggle", (el) => el.disabled), true);
  pass("Reduced-motion preference stops motion and locks pause control");
  await page.evaluate(() =>
    document
      .querySelector(".infinity-canvas")
      .getContext("webgl")
      .getExtension("WEBGL_lose_context")
      .loseContext(),
  );
  await page.waitForFunction(
    () =>
      !document
        .querySelector("[data-infinity]")
        .classList.contains("webgl-ready"),
  );
  assert.equal(
    await page.$eval(
      ".infinity-fallback",
      (el) => getComputedStyle(el).opacity,
    ),
    ".75".replace(/^\./, "0."),
  );
  pass("WebGL context loss reveals static vector fallback");
  const noJS = await browser.newPage();
  await noJS.setJavaScriptEnabled(false);
  await noJS.setViewport({ width: 390, height: 844 });
  await noJS.goto(origin, { waitUntil: "networkidle0" });
  assert.equal(
    await noJS.$$eval(
      "[role=tabpanel]",
      (els) =>
        els.filter((el) => getComputedStyle(el).display === "none").length,
    ),
    0,
  );
  assert.ok(await noJS.$eval(".hero-image", (el) => el.naturalWidth > 0));
  pass("No-JavaScript: artwork and all panel content remain available");
  assert.deepEqual(errors, []);
  assert.deepEqual(missing, []);
  pass("No uncaught browser errors or failed page assets");
  await writeFile(
    new URL("report.json", output),
    JSON.stringify({ origin, checks, errors, missing }, null, 2),
  );
} finally {
  await browser.close();
}
