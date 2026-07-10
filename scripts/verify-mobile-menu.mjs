import { chromium, devices } from "playwright";

const BASE = "http://127.0.0.1:8788";
const PAGES = [
  "/index.html",
  "/faq/",
  "/policy/",
  "/guide/",
  "/mobile-payment-cashout/",
  "/cases/008/",
  "/limit/",
];

const iphone = devices["iPhone 13"];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ ...iphone });
const page = await context.newPage();

const consoleErrors = [];
page.on("pageerror", (error) => consoleErrors.push(error.message));
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});

let failed = false;

for (const path of PAGES) {
  const errors = [];
  consoleErrors.length = 0;

  const response = await page.goto(BASE + path, { waitUntil: "networkidle" });
  if (!response || !response.ok()) {
    failed = true;
    console.log(`[FAIL] ${path} - HTTP ${response ? response.status() : "no response"}`);
    continue;
  }

  for (const scriptName of ["channel-config.js", "channel-talk-loader.js", "main.js"]) {
    const ok = await page.evaluate((name) => {
      return Array.from(document.scripts).some((s) => s.src.includes(name));
    }, scriptName);
    if (!ok) errors.push(`missing ${scriptName}`);
  }

  const hasMobileNav = await page.locator("[data-mobile-nav]").count();
  if (!hasMobileNav) errors.push("missing data-mobile-nav");

  const toggle = page.locator("[data-menu-toggle]");
  await toggle.click();
  const expandedOpen = await toggle.getAttribute("aria-expanded");
  const openClass = await page.locator("[data-mobile-nav]").evaluate((el) => el.classList.contains("is-open"));
  if (expandedOpen !== "true" || !openClass) errors.push("menu did not open");

  await toggle.click();
  const expandedClosed = await toggle.getAttribute("aria-expanded");
  const closedClass = await page.locator("[data-mobile-nav]").evaluate((el) => el.classList.contains("is-open"));
  if (expandedClosed !== "false" || closedClass) errors.push("menu did not close");

  await toggle.click();
  await page.locator("[data-mobile-nav] a").first().click();
  const closedAfterLink = await page.locator("[data-mobile-nav]").evaluate((el) => el.classList.contains("is-open"));
  if (closedAfterLink) errors.push("menu did not close after link click");

  const js404 = consoleErrors.filter((msg) => /404|Failed to load resource/i.test(msg));
  if (js404.length) errors.push(`console 404: ${js404.join(" | ")}`);

  if (errors.length) {
    failed = true;
    console.log(`[FAIL] ${path} - ${errors.join("; ")}`);
  } else {
    console.log(`[PASS] ${path}`);
  }
}

await browser.close();
process.exit(failed ? 1 : 0);
