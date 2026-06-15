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

test("student workflow parses rules, confirms eligibility, and unlocks generation", async ({ page }) => {
  await page.goto("/production?competition=real-leather-student-2026");
  await expect(page.getByRole("heading", { name: "竞赛文件中心" })).toBeVisible();
  await page.getByRole("button", { name: "读取全部文件并分析" }).click();
  await expect(page.getByRole("heading", { name: "你到底能不能参加？" })).toBeVisible();
  await expect(page.getByText("符合学生优先条件")).toBeVisible();
  await page.getByRole("button", { name: "确认资格并继续" }).click();
  await expect(page.getByRole("heading", { name: "必须提交什么？" })).toBeVisible();
  await expect(page.getByText(/至少3张、最多5张/)).toBeVisible();
  await page.getByRole("button", { name: "我已审阅提交成果" }).click();
  await expect(page.getByRole("heading", { name: "方案生成" })).toBeVisible();
  await expect(page.getByText("流程节点已解锁")).toBeVisible();
});

test("professional competition blocks a student from production", async ({ page }) => {
  await page.goto("/production?competition=pohang-museum-2026");
  await page.getByRole("button", { name: "读取全部文件并分析" }).click();
  await expect(page.getByText("学生不可独立参加")).toBeVisible();
  await expect(page.getByRole("button", { name: "确认资格并继续" })).toBeDisabled();
});
