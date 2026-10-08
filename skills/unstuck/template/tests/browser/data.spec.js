import { test, expect } from "@playwright/test";
import sample from "../../data/plan.json" with { type: "json" };
import { servePlan } from "../support/plan.js";

test("should show the project's heading rather than the example heading", async ({ page }) => {
  await servePlan(page, { ...sample, title: "USB performance desk" });
  await page.goto("/");
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveText("USB performance desk");
});

test("should focus the first queued step when older task records come first", async ({ page }) => {
  await servePlan(page, { ...sample, next: ["U3", "U1", "U2"] });
  await page.goto("/#wider-plan");
  const heading = page.locator("#focus h2");
  await expect(heading).toHaveText("Try it on a second screen");
});

test("should explain a missing plan instead of showing example work", async ({ page }) => {
  await page.route("**/data/plan.json", (route) => route.fulfill({ status: 404 }));
  await page.goto("/");
  const alert = page.getByRole("alert");
  await expect(alert).toContainText("Plan request failed (404)");
});
