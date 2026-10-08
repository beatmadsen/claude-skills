export async function servePlan(page, plan) {
  await page.route("**/data/plan.json", (route) => route.fulfill({ json: plan }));
}
