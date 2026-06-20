import { chromium, devices } from "playwright";
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
await desktop.locator(".hero__image").waitFor({ state: "visible" });
await desktop.screenshot({
  path: path.join(outDir, "screenshot-hero-pc.png"),
  fullPage: true,
});

const mobile = await browser.newPage({ ...devices["iPhone 13"] });
await mobile.goto(baseUrl, { waitUntil: "networkidle" });
await mobile.locator(".hero__image").waitFor({ state: "visible" });
await mobile.screenshot({
  path: path.join(outDir, "screenshot-hero-mobile.png"),
  fullPage: true,
});

await browser.close();
console.log("saved screenshot-hero-pc.png and screenshot-hero-mobile.png");
