/**
 * Browser verification: inner-page CTA must not navigate to index.html
 * Run: node scripts/verify-contact-cta-browser.mjs
 * Requires: npx http-server or python -m http.server on port 8765
 */
import { chromium } from "playwright";
import { createServer } from "http";
import { readFileSync, statSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const PORT = 8765;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".json": "application/json",
};

function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let path = req.url.split("?")[0];
      if (path === "/") path = "/index.html";
      if (path.endsWith("/")) path += "index.html";
      const filePath = join(ROOT, path.replace(/^\//, "").replace(/\//g, "\\"));
      try {
        const body = readFileSync(filePath);
        const ext = extname(filePath);
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        res.end(body);
      } catch {
        res.writeHead(404);
        res.end("Not found");
      }
    });
    server.listen(PORT, () => resolve(server));
  });
}

async function main() {
  const server = await startServer();
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let gtagCalls = [];

  await page.addInitScript(() => {
    window.gtag = function (cmd, name, params) {
      window.__gtagLog = window.__gtagLog || [];
      window.__gtagLog.push({ cmd, name, params });
    };
    window.ChannelIO = function () {
      window.__channelCalls = window.__channelCalls || [];
      window.__channelCalls.push(Array.from(arguments));
    };
  });

  const testUrl = `http://127.0.0.1:${PORT}/faq/index.html`;
  await page.goto(testUrl, { waitUntil: "domcontentloaded" });
  const urlBefore = page.url();

  await page.click('header .btn--accent[data-contact-modal]');
  await page.waitForTimeout(300);

  const urlAfter = page.url();
  const logs = await page.evaluate(() => window.__gtagLog || []);
  const channel = await page.evaluate(() => window.__channelCalls || []);

  console.log("URL before:", urlBefore);
  console.log("URL after:", urlAfter);
  console.log("gtag events:", JSON.stringify(logs.filter((l) => l.name === "channel_talk_click")));
  console.log("ChannelIO calls:", JSON.stringify(channel));

  const ok =
    urlBefore === urlAfter &&
    urlAfter.includes("/faq/") &&
    logs.some((l) => l.name === "channel_talk_click" && l.params?.button_location === "header") &&
    channel.some((c) => c[0] === "showMessenger");

  await browser.close();
  server.close();

  if (!ok) {
    console.error("FAIL: navigation or events incorrect");
    process.exit(1);
  }
  console.log("PASS: FAQ header CTA stays on page, GA4 + ChannelIO fired once");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
