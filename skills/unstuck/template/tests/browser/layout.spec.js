import { test, expect } from "@playwright/test";
import { openNarrow, chooseExperiment } from "../support/navigation.js";

test("should bring a reselected experiment into view on a narrow screen", async ({ page }) => {
  await openNarrow(page);
  await chooseExperiment(page, "Find the visual mismatch");
  await chooseExperiment(page, "Find the visual mismatch");
  const heading = page.locator("#focus h2");
  const result = expect(heading);
  await result.toBeInViewport();
});

test("should keep the narrow page within the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".experiment")).toHaveCount(3);
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBe(390);
});
