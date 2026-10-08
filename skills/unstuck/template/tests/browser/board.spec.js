import { test, expect } from "@playwright/test";

test("should show the three queued experiments when the plan opens", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator(".experiment h2");
  await expect(cards).toHaveText([
    "Find the visual mismatch",
    "Compare one design choice",
    "Try it on a second screen"
  ]);
});
