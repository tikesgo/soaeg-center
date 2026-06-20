import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseUrl = "http://127.0.0.1:8765/index.html";
const outDir = path.join(__dirname, "..", "images");

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await desktop.goto(baseUrl, { waitUntil: "networkidle" });
await desktop.locator(".hero-slider").waitFor({ state: "visible" });
await desktop.screenshot({
  path: path.join(outDir, "screenshot-hero-final-pc.png"),
  fullPage: false,
});
console.log("saved screenshot-hero-final-pc.png");

const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  isMobile: true,
});
await mobile.goto(baseUrl, { waitUntil: "networkidle" });
await mobile.locator(".hero-slider").waitFor({ state: "visible" });
await mobile.screenshot({
  path: path.join(outDir, "screenshot-hero-final-mobile.png"),
  fullPage: false,
});
console.log("saved screenshot-hero-final-mobile.png");

await browser.close();
