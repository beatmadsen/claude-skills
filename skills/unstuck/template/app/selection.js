import { detail } from "./views/detail.js";
import { taskById } from "./lib/queue.js";

function taskFor(plan) {
  const hash = location.hash.slice(1);
  const id = !hash || hash === "wider-plan" || hash === "focus" ? plan.next[0] : hash;
  return taskById(plan.tasks, id);
}

export function select(plan) {
  const task = taskFor(plan);
  const region = document.querySelector("#focus");
  region.innerHTML = detail(task);
  region.dataset.task = task.id;
  reveal();
  revealFocus();
}

function reveal() {
  const wider = document.querySelector("#wider-plan");
  if (location.hash === "#wider-plan") {
    wider.open = true;
    wider.scrollIntoView();
  }
}

function revealFocus() {
  const hash = location.hash;
  if (hash && hash !== "#wider-plan") {
    const region = document.querySelector("#focus");
    region.scrollIntoView();
    region.focus({ preventScroll: true });
  }
}

export function followSameFragment(event) {
  const anchor = event.target.closest('a[href^="#"]');
  if (anchor && anchor.hash === location.hash) {
    event.preventDefault();
    reveal();
    revealFocus();
  }
}
