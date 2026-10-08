import { ensure, taskById, dependencies } from "./queue.js";

function nextSteps(plan) {
  const unique = new Set(plan.next);
  ensure(plan.next.length === 3 && unique.size === 3, "The queue needs three distinct next steps.");
  plan.next.forEach(taskById.bind(null, plan.tasks));
}

export function validate(plan) {
  const ids = plan.tasks.map((task) => task.id);
  const unique = new Set(ids);
  ensure(ids.length === unique.size, "Task IDs must be unique.");
  nextSteps(plan);
  plan.tasks.forEach(dependencies.bind(null, plan.tasks));
}
