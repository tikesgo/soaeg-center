import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseUrl = "http://127.0.0.1:8765/index.html";
const outDir = path.join(__dirname, "..", "images");

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.locator(".consult-form--hero").waitFor({ state: "visible" });
await page.screenshot({
  path: path.join(outDir, "screenshot-hero-restored-pc.png"),
  fullPage: true,
});
await browser.close();
console.log("saved screenshot-hero-restored-pc.png");
