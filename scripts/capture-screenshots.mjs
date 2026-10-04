import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "artifacts", "screenshots");
const baseUrl = process.env.NUGGET_URL ?? "http://127.0.0.1:3100";
const serverPort = new URL(baseUrl).port || "3100";
let server;

async function isHealthyNuggetServer() {
  const response = await fetch(`${baseUrl}/production?competition=real-leather-student-2026`);
  if (!response.ok) return false;

  const html = await response.text();
  if (!html.includes("竞赛文件中心")) return false;

  const stylesheets = [...html.matchAll(/href="([^\"]+\.css[^\"]*)"/g)];
  if (stylesheets.length === 0) return false;

  const stylesheetResponses = await Promise.all(
    stylesheets.map(([, href]) => fetch(new URL(href, baseUrl))),
  );
  return stylesheetResponses.every((stylesheet) => stylesheet.ok);
}

async function waitForServer(timeout = 90000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try {
      if (await isHealthyNuggetServer()) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 750));
  }
  throw new Error(`Nugget did not start correctly at ${baseUrl}`);
}

async function launchServer() {
  try {
    if (await isHealthyNuggetServer()) return;
  } catch {}

  server = spawn(
    process.execPath,
    [path.join(root, "node_modules", "next", "dist", "bin", "next"), "dev", "-p", serverPort],
    {
      cwd: root,
      stdio: "pipe",
      windowsHide: true,
      env: { ...process.env, AI_PROVIDER: "mock" },
    },
  );
  server.stdout.on("data", (chunk) => process.stdout.write(chunk));
  server.stderr.on("data", (chunk) => process.stderr.write(chunk));
  await waitForServer();
}

async function main() {
  await mkdir(output, { recursive: true });
  await launchServer();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: true,
    locale: "zh-CN",
  });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  await page.route("**/api/generate-assets", async (route) => {
    const request = route.request().postDataJSON();
    const samples = [
      "/generation-samples/fashion/hero.png",
      "/generation-samples/fashion/variations.png",
      "/generation-samples/fashion/detail.png",
    ];
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        provider: "mock",
        assets: (request.prompts ?? []).map((_, index) => samples[index % samples.length]),
      }),
    });
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(output, "01-landing.png"), fullPage: true });

  await page.goto(`${baseUrl}/discover`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(output, "09-global-radar.png"), fullPage: true });

  await page.goto(`${baseUrl}/production?competition=real-leather-student-2026`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(output, "11-production-studio.png"), fullPage: true });
  await page.getByTestId("analyze-competition-files").click();
  await page.getByTestId("workflow-eligibility").waitFor();
  await page.screenshot({ path: path.join(output, "12-board-composer.png"), fullPage: true });
  await page.getByTestId("confirm-eligibility").click();
  await page.getByTestId("workflow-deliverables").waitFor();
  await page.getByTestId("confirm-deliverables").click();
  await page.getByTestId("workflow-concept").waitFor();
  await page.getByTestId("approve-concept").click();
  await page.getByTestId("workflow-assets").waitFor();
  await page.getByTestId("generate-assets").click();
  await page.getByTestId("generated-assets").waitFor({ timeout: 120000 });
  await page.screenshot({ path: path.join(output, "13-generated-visuals.png"), fullPage: true });
  await page.getByTestId("approve-assets").click();
  await page.getByTestId("workflow-layout").waitFor();
  await page.screenshot({ path: path.join(output, "14-auto-layout.png"), fullPage: true });
  await page.getByTestId("approve-layout").click();
  await page.getByTestId("workflow-review").waitFor();
  await page.getByTestId("workflow-review").getByRole("checkbox").check();
  await page.getByTestId("submit-competition").click();
  await page.getByTestId("workflow-review").getByRole("heading", { name: "模拟提交成功" }).waitFor();
  await page.screenshot({ path: path.join(output, "15-submission-receipt.png"), fullPage: true });

  await page.goto(`${baseUrl}/studio`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(output, "02-studio-empty.png"), fullPage: true });
  await page.getByTestId("sample-brief").click();
  await page.getByTestId("analyze-button").click();
  await page.getByTestId("analysis-results").waitFor({ state: "visible", timeout: 30000 });
  await page.locator("#results").evaluate((element) => element.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(output, "03-studio-analyzed.png"), fullPage: false });

  await page.addStyleTag({
    content: "header { position: static !important; } #results > div:first-child { position: relative !important; top: auto !important; }",
  });
  await page.getByTestId("concept-directions").scrollIntoViewIfNeeded();
  await page.getByTestId("concept-directions").screenshot({
    path: path.join(output, "04-concepts.png"),
  });

  await page.getByTestId("save-project").click();
  await page.goto(`${baseUrl}/library`, { waitUntil: "networkidle" });
  await page.getByTestId("project-grid").waitFor({ state: "visible" });
  await page.screenshot({ path: path.join(output, "05-library.png"), fullPage: true });

  await page.getByTestId("reopen-project").click();
  await page.getByTestId("analysis-results").waitFor({ state: "visible" });
  await page.goto(`${baseUrl}/about`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(output, "06-settings.png"), fullPage: true });

  const mobile = await context.newPage();
  await mobile.setViewportSize({ width: 390, height: 844 });
  await mobile.goto(baseUrl, { waitUntil: "networkidle" });
  await mobile.screenshot({ path: path.join(output, "07-mobile-landing.png"), fullPage: true });
  await mobile.goto(`${baseUrl}/demo`, { waitUntil: "networkidle" });
  await mobile.getByTestId("analysis-results").waitFor({ state: "visible", timeout: 30000 });
  await mobile.getByTestId("analysis-results").scrollIntoViewIfNeeded();
  await mobile.screenshot({ path: path.join(output, "08-mobile-studio-result.png"), fullPage: false });

  await browser.close();
  console.log(`Saved 14 screenshots to ${output}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    if (server) server.kill();
  });
