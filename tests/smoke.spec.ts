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

  await page.getByTestId("view-real-leather-student-2026").click();
  await expect(page.getByRole("complementary").getByRole("heading", { name: "Real Leather 2026国际学生设计竞赛" })).toBeVisible();
  await page.getByRole("button", { name: /分析完整 Brief/ }).click();
  await expect(page.getByTestId("analysis-results")).toBeVisible();
  await expect(page.getByText(/Real Leather. Stay Different./).first()).toBeVisible();
});

test("student workflow completes generation, review, and simulated submission", async ({ page }) => {
  await page.goto("/production?competition=real-leather-student-2026");
  await expect(page.getByRole("heading", { name: "竞赛文件中心" })).toBeVisible();
  await page.getByRole("button", { name: "读取全部文件并分析" }).click();
  await expect(page.getByRole("heading", { name: "你到底能不能参加？" })).toBeVisible();
  await expect(page.getByText("符合学生优先条件")).toBeVisible();
  await page.getByRole("button", { name: "确认资格并继续" }).click();
  await expect(page.getByRole("heading", { name: "必须提交什么？" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "官方允许 3–5 张" })).toBeVisible();
  await page.getByRole("button", { name: "+" }).click();
  await page.getByRole("button", { name: "确认成果矩阵与数量" }).click();
  await expect(page.getByRole("heading", { name: "选择一个方案方向" })).toBeVisible();
  await page.getByRole("button", { name: /批准 Second Life/ }).click();
  await page.getByRole("button", { name: "生成 4 张竞赛视觉" }).click();
  await expect(page.getByText(/演示AI样板|OpenAI真实生成/)).toBeVisible({ timeout: 120000 });
  await expect(page.getByText("V04 · 爆炸与装配")).toBeVisible();
  await page.getByRole("button", { name: "批准视觉并排版" }).click();
  await expect(page.getByRole("heading", { name: "选择版式方向" })).toBeVisible();
  await page.getByRole("button", { name: /编辑冲击/ }).click();
  await expect(page.getByText("满版视觉 + 巨型标题")).toBeVisible();
  await page.getByRole("button", { name: "批准排版与文字" }).click();
  await expect(page.getByRole("heading", { name: "最终审阅与提交" })).toBeVisible();

  const packageDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "下载提交包清单" }).click();
  await expect((await packageDownload).suggestedFilename()).toMatch(/submission-package\.md$/);

  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "模拟提交到竞赛网站" }).click();
  await expect(page.getByRole("heading", { name: "模拟提交成功" })).toBeVisible();
  await expect(page.getByText(/^NUG-\d{4}-/)).toBeVisible();
});

test("professional competition blocks a student from production", async ({ page }) => {
  await page.goto("/production?competition=pohang-museum-2026");
  await page.getByRole("button", { name: "读取全部文件并分析" }).click();
  await expect(page.getByText("学生不可独立参加")).toBeVisible();
  await expect(page.getByRole("button", { name: "确认资格并继续" })).toBeDisabled();
});
