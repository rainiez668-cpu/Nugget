import { expect, test } from "@playwright/test";

test("landing, analysis, save, and library flow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Find golden ideas/i })).toBeVisible();

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
