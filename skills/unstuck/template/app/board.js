import { card } from "./views/cards.js";
import { shell } from "./layout/shell.js";
import { workspace, widerPlan } from "./layout/workspace.js";
import { validate } from "./lib/validate.js";
import { taskById } from "./lib/queue.js";

function experiments(plan) {
  const find = taskById.bind(null, plan.tasks);
  const tasks = plan.next.map(find);
  const cards = tasks.map(card);
  const content = cards.join("");
  return `<div class="section-heading"><h2>Your next three moves</h2>
    <span>Small experiments. A result either way.</span></div><section class="cards">${content}</section>`;
}

export function board(plan) {
  validate(plan);
  const top = shell(plan);
  const cards = experiments(plan);
  const focus = workspace(plan);
  const rest = widerPlan(plan);
  return `${top}${cards}${focus}${rest}`;
}
