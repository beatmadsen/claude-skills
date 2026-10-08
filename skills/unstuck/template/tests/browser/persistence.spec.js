import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("should keep task selection when the page is reopened", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Compare one design choice" }).click();
  await page.reload();
  await expect(page.locator("#focus h2")).toHaveText("Compare one design choice");
});

test("should open the wider plan through its navigation link", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "The wider plan", exact: true }).click();
  await expect(page.getByRole("heading", { name: "The setback", exact: true })).toBeVisible();
});

test("should leave the saved queue unchanged when browsing experiments", async ({ page }) => {
  const file = new URL("../../data/plan.json", import.meta.url);
  const before = await readFile(file, "utf8");
  await page.goto("/#U3");
  await expect(page.locator("#focus h2")).toHaveText("Try it on a second screen");
  const after = await readFile(file, "utf8");
  expect(after).toBe(before);
});
