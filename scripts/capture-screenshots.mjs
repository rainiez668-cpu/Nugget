import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "artifacts", "screenshots");
const baseUrl = process.env.NUGGET_URL ?? "http://127.0.0.1:3000";
let server;

async function waitForServer(url, timeout = 90000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 750));
  }
  throw new Error(`Nugget did not start at ${url}`);
}

async function launchServer() {
  try {
    const response = await fetch(baseUrl);
    if (response.ok) return;
  } catch {}

  server = spawn(
    process.execPath,
    [path.join(root, "node_modules", "next", "dist", "bin", "next"), "dev", "-p", "3000"],
    {
      cwd: root,
      stdio: "pipe",
      windowsHide: true,
      env: { ...process.env, AI_PROVIDER: "mock" },
    },
  );
  server.stdout.on("data", (chunk) => process.stdout.write(chunk));
  server.stderr.on("data", (chunk) => process.stderr.write(chunk));
  await waitForServer(baseUrl);
}

async function main() {
  await mkdir(output, { recursive: true });
  await launchServer();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: true,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(output, "01-landing.png"), fullPage: true });

  await page.goto(`${baseUrl}/discover`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(output, "09-global-radar.png"), fullPage: true });

  await page.goto(`${baseUrl}/production?competition=real-leather-student-2026`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(output, "11-production-studio.png"), fullPage: true });
  await page.getByRole("button", { name: "读取全部文件并分析" }).click();
  await page.getByRole("heading", { name: "你到底能不能参加？" }).waitFor();
  await page.screenshot({ path: path.join(output, "12-board-composer.png"), fullPage: true });
  await page.getByRole("button", { name: "确认资格并继续" }).click();
  await page.getByRole("button", { name: "确认成果矩阵与数量" }).click();
  await page.getByRole("button", { name: /批准 Second Life/ }).click();
  await page.getByRole("button", { name: "生成 3 张竞赛视觉" }).click();
  await page.getByText(/演示AI样板|OpenAI真实生成/).waitFor({ timeout: 120000 });
  await page.screenshot({ path: path.join(output, "13-generated-visuals.png"), fullPage: true });
  await page.getByRole("button", { name: "批准视觉并排版" }).click();
  await page.screenshot({ path: path.join(output, "14-auto-layout.png"), fullPage: true });
  await page.getByRole("button", { name: "批准排版与文字" }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "模拟提交到竞赛网站" }).click();
  await page.getByRole("heading", { name: "模拟提交成功" }).waitFor();
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
