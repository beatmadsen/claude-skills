export async function openNarrow(page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
}

export async function chooseExperiment(page, name) {
  const link = page.getByRole("link", { name });
  await link.click();
}
