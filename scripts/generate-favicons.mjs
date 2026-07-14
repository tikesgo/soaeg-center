/**
 * Generate favicon PNG set from images/favicon/favicon-source.svg
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "images", "favicon");
const SVG = readFileSync(join(OUT_DIR, "favicon-source.svg"), "utf8");
const SVG_DATA = `data:image/svg+xml;base64,${Buffer.from(SVG).toString("base64")}`;

const SIZES = [
  { name: "favicon-512.png", size: 512 },
  { name: "favicon-192.png", size: 192 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "favicon-32.png", size: 32 },
  { name: "favicon-16.png", size: 16 },
];

async function renderPng(page, size) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<!doctype html><html><head><style>
      html,body{margin:0;padding:0;background:transparent}
      img{width:${size}px;height:${size}px;display:block}
    </style></head><body><img src="${SVG_DATA}" alt=""></body></html>`,
    { waitUntil: "load" }
  );
  return await page.locator("img").screenshot({ omitBackground: true });
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const { name, size } of SIZES) {
    const buf = await renderPng(page, size);
    writeFileSync(join(OUT_DIR, name), buf);
    console.log("wrote", name, `${size}x${size}`);
  }

  await browser.close();

  const ico = spawnSync(
    "python",
    [join(ROOT, "scripts", "write-favicon-ico.py")],
    { stdio: "inherit", cwd: ROOT }
  );
  if (ico.status !== 0) {
    process.exit(ico.status ?? 1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
