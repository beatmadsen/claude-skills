import { board } from "./board.js";
import { escape } from "./lib/text.js";
import { select, followSameFragment } from "./selection.js";

async function open() {
  const response = await fetch("data/plan.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Plan request failed (${response.status}). Check data/plan.json.`);
  }
  const plan = await response.json();
  mount(plan);
}

function mount(plan) {
  const main = document.querySelector("main");
  main.innerHTML = board(plan);
  window.addEventListener("hashchange", refresh.bind(null, plan));
  document.addEventListener("click", followSameFragment);
  select(plan);
}

function refresh(plan) {
  try {
    select(plan);
  } catch (error) {
    showError(error);
  }
}

function showError(error) {
  console.error("Cannot open the experiment plan", error);
  const message = escape(error.message);
  const main = document.querySelector("main");
  main.innerHTML = `<section class="error" role="alert"><h1>The plan could not be opened.</h1>
    <p>${message}</p><p>Check data/plan.json and serve this directory over HTTP, then reload.</p>
    <a href="./">Return to the plan</a></section>`;
}

open().catch(showError);
