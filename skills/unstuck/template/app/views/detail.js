import { escape, link } from "../lib/text.js";
import { facts } from "./fragments.js";

function heading(task) {
  const id = escape(task.id);
  const title = escape(task.title);
  const dependency = task.dependsOn.join(", ") || "No experiment dependencies";
  const waiting = escape(dependency);
  return `<span class="eyebrow">In focus / ${id}</span><h2>${title}</h2>
    <p class="muted">Depends on: ${waiting}</p>`;
}

function result(task) {
  const text = escape(task.result);
  const evidence = task.evidence.map(link);
  return `<section class="result"><h3>Recorded outcome</h3><p>${text}</p>
    <nav aria-label="Experiment evidence" class="evidence">${evidence.join("")}</nav></section>`;
}

export function detail(task) {
  const title = heading(task);
  const steps = facts(task.details);
  const outcomes = facts(task.outcomes);
  const recorded = result(task);
  const id = escape(task.id);
  return `${title}<div class="detail-columns"><section>${steps}</section>
    <section><h3>Whatever happens, we learn</h3>${outcomes}</section></div>${recorded}
    <div class="handoff"><span>When you're ready, tell your agent:</span>
    <code>Begin step ${id} from this plan</code><small>This page cannot start work.</small></div>`;
}
