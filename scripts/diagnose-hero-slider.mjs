import { chromium } from "playwright";

const baseUrl = "http://127.0.0.1:8765/index.html";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(baseUrl, { waitUntil: "networkidle" });

const report = await page.evaluate(() => {
  const viewport = document.querySelector(".hero-slider__viewport");
  const slide = document.querySelector(".hero-slider__slide.is-active");
  const img = slide?.querySelector("img");

  const read = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    return {
      clientWidth: el.clientWidth,
      clientHeight: el.clientHeight,
      computedWidth: cs.width,
      computedHeight: cs.height,
      objectFit: cs.objectFit,
      objectPosition: cs.objectPosition,
      transform: cs.transform,
    };
  };

  return {
    viewport: read(viewport),
    slide: read(slide),
    img: read(img),
    imgMatchesViewportHeight:
      img && viewport
        ? Math.abs(img.clientHeight - viewport.clientHeight) < 1
        : null,
    imgTallerThanViewport:
      img && viewport ? img.clientHeight > viewport.clientHeight : null,
  };
});

console.log("=== Hero slider render sizes (after fix) ===");
console.log(JSON.stringify(report, null, 2));

await browser.close();
