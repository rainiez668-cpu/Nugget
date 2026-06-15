import { expect, test } from "@playwright/test";

test("landing, analysis, save, and library flow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Find the right competition/i })).toBeVisible();

  await page.goto("/studio");
  await page.getByTestId("sample-brief").click();
  await page.getByTestId("analyze-button").click();
  await expect(page.getByTestId("analysis-results")).toBeVisible();

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
  await expect(page.getByTestId("analysis-results")).toBeVisible();

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
  await page.getByRole("button", { name: /用 Nugget 分析这场比赛/ }).click();
  await expect(page.getByTestId("analysis-results")).toBeVisible();
  await expect(page.getByText(/International Design Competition for Pohang Museum/).first()).toBeVisible();
});
