import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "images");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`http://127.0.0.1:8765/index.html?v=${Date.now()}`, {
  waitUntil: "networkidle",
});

for (const dot of [0, 1]) {
  await page.locator(`[data-hero-dot="${dot}"]`).click();
  await page.waitForTimeout(400);
  await page.locator(".hero-slider__viewport").screenshot({
    path: path.join(outDir, `screenshot-hero-slide${dot + 1}-verify.png`),
  });
}

await browser.close();
