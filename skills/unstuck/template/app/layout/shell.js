import { escape } from "../lib/text.js";

function header(plan) {
  const title = escape(plan.title);
  const route = escape(plan.route);
  const approval = escape(plan.approval);
  const scope = escape(plan.approvalScope);
  return `<header class="intro"><div class="eyebrow">A way back into the project</div>
    <h1>${title}</h1><p class="route">${route}</p>
    <div class="approval"><span>${approval}</span><small>${scope}</small></div></header>`;
}

function navigation(plan) {
  const project = escape(plan.project);
  const example = plan.example ? '<span class="example">Example plan / replace before use</span>' : "";
  return `<nav class="topbar" aria-label="Project"><a class="brand" href="./">unstuck<span> / ${project}</span></a>
    ${example}<a href="#wider-plan">The wider plan</a></nav>`;
}

export function shell(plan) {
  const nav = navigation(plan);
  const intro = header(plan);
  return nav + intro;
}
