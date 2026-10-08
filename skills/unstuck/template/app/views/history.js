import { escape } from "../lib/text.js";

function entry(task) {
  const id = escape(task.id);
  const result = escape(task.result);
  return `<li><a href="#${id}">${id}</a>: ${result}</li>`;
}

export function history(plan) {
  const previous = plan.tasks.filter((task) => !plan.next.includes(task.id));
  const entries = previous.map(entry);
  return `<details><summary>Previous experiments (${previous.length})</summary><ul>${entries.join("")}</ul></details>`;
}
