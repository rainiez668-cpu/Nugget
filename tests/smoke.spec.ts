import { expect, test } from "@playwright/test";

test("landing, analysis, save, and library flow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Find the right competition/i })).toBeVisible();

  await page.goto("/studio");
  await page.getByTestId("sample-brief").click();
  await page.getByTestId("analyze-button").click();
  await expect(page.getByTestId("analysis-results")).toBeVisible({ timeout: 30000 });

  const markdownDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Markdown" }).first().click();
  await expect((await markdownDownload).suggestedFilename()).toMatch(/\.md$/);

  const jsonDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "JSON" }).first().click();
  await expect((await jsonDownload).suggestedFilename()).toMatch(/\.json$/);

  await page.getByTestId("save-project").click();
  await page.goto("/library");
  await expect(page.getByTestId("project-grid")).toBeVisible();
  await page.getByTestId("reopen-project").click();
  await expect(page.getByTestId("analysis-results")).toBeVisible({ timeout: 30000 });

  await page.goto("/library");
  await page.getByRole("button", { name: /Delete RE:FORM/i }).click();
  await expect(page.getByText("Nothing on the shelf yet.")).toBeVisible();
});

test("discover radar filters competitions and sends a brief to Studio", async ({ page }) => {
  await page.goto("/discover");
  await expect(page.getByTestId("competition-grid")).toBeVisible();
  await page.getByRole("button", { name: "只看免费比赛" }).click();
  await expect(page.getByTestId("competition-grid").getByText("免费报名").first()).toBeVisible();

  await page.getByTestId("view-pohang-museum-2026").click();
  await expect(page.getByRole("complementary").getByRole("heading", { name: "韩国浦项博物馆国际设计竞赛" })).toBeVisible();
  await page.getByRole("button", { name: /分析完整 Brief/ }).click();
  await expect(page.getByTestId("analysis-results")).toBeVisible();
  await expect(page.getByText(/International Design Competition for Pohang Museum/).first()).toBeVisible();
});

test("production studio reviews a concept and builds a submission preview", async ({ page }) => {
  await page.goto("/production?competition=pohang-museum-2026");
  await expect(page.getByRole("heading", { name: "Tidal Archive · 潮汐档案" })).toBeVisible();
  await page.getByRole("button", { name: "批准当前方案方向" }).click();
  await page.getByRole("button", { name: /展板排版/ }).click();
  await expect(page.getByRole("heading", { name: "A1竞赛展板预览" })).toBeVisible();
  await page.getByRole("button", { name: "生成提交包" }).click();
  await expect(page.getByRole("heading", { name: "提交包" })).toBeVisible();
  await expect(page.getByText("预览包已生成，等待你的最终批准。")).toBeVisible();
});
