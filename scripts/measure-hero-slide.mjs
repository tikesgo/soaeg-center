import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseUrl = "http://127.0.0.1:8765/index.html";

function readMetrics(page) {
  return page.evaluate(() => {
    const viewport = document.querySelector(".hero-slider__viewport");
    const img = document.querySelector(".hero-slider__slide.is-active img");
    const vp = viewport?.getBoundingClientRect();
    const im = img?.getBoundingClientRect();
    const styles = img ? getComputedStyle(img) : null;
    return {
      viewportCss: vp ? { width: Math.round(vp.width), height: Math.round(vp.height) } : null,
      imgCss: im ? { width: Math.round(im.width), height: Math.round(im.height) } : null,
      objectFit: styles?.objectFit ?? null,
      natural: img ? { width: img.naturalWidth, height: img.naturalHeight } : null,
      dpr: window.devicePixelRatio,
    };
  });
}

const browser = await chromium.launch();

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await desktop.goto(baseUrl, { waitUntil: "networkidle" });
const desktopMetrics = await readMetrics(desktop);

const desktopRetina = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await desktopRetina.goto(baseUrl, { waitUntil: "networkidle" });
const desktopRetinaMetrics = await readMetrics(desktopRetina);

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
await mobile.goto(baseUrl, { waitUntil: "networkidle" });
const mobileMetrics = await readMetrics(mobile);

console.log(JSON.stringify({ desktop: desktopMetrics, desktopRetina: desktopRetinaMetrics, mobile: mobileMetrics }, null, 2));
await browser.close();
