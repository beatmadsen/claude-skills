import { escape, link } from "../lib/text.js";
import { list } from "./fragments.js";

function section(title, items) {
  const heading = escape(title);
  const body = list(items);
  return `<section><h3>${heading}</h3>${body}</section>`;
}

export function context(plan) {
  const goal = section("The experience to preserve", [plan.goal]);
  const obstacle = section("The setback", [plan.obstacle]);
  const assumptions = section("What we still need to establish", plan.assumptions);
  const alternatives = section("Other routes worth keeping", plan.alternatives);
  const evidence = plan.evidence.map(link);
  return `<div class="context-grid">${goal}${obstacle}${assumptions}${alternatives}</div>
    <nav aria-label="Plan evidence" class="evidence">${evidence.join("")}</nav>`;
}

export function preserved(plan) {
  const items = list(plan.preserved);
  return `<aside class="preserved"><span class="eyebrow">What comes with us</span>
    <h2>Keep the useful parts.</h2>${items}
    <p>These three steps test a route forward. They are not a countdown to a finished product.</p></aside>`;
}
