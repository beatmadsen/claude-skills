import { context, preserved } from "../views/context.js";
import { history } from "../views/history.js";

export function workspace(plan) {
  const keep = preserved(plan);
  return `<div class="workspace"><section id="focus" class="focus" tabindex="-1" aria-live="polite"></section>${keep}</div>`;
}

export function widerPlan(plan) {
  const broader = context(plan);
  const previous = history(plan);
  return `<details id="wider-plan"><summary>The wider plan <span>Context, evidence and alternative routes</span></summary>
    ${broader}${previous}</details><footer class="page-footer">A useful next move, without committing to the whole journey.</footer>`;
}
