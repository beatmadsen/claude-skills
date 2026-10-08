import { escape } from "../lib/text.js";
import { facts, picture } from "./fragments.js";

function heading(task, index) {
  const title = escape(task.title);
  const id = escape(task.id);
  const recommendation = index === 0 ? "Recommended first" : "Then, if supported";
  return `<div class="card-top"><span class="step">0${index + 1}</span><span>${recommendation}</span></div>
    <h2><a href="#${id}">${title}</a></h2>`;
}

function preview(task) {
  return facts([
    { label: "Try", text: task.try },
    { label: "Learn", text: task.learn },
    { label: "Unlock", text: task.unlock }
  ]);
}

function footer(task) {
  const owner = escape(task.owner);
  const state = escape(task.state);
  return `<footer><span>${owner}</span><span>${state}</span></footer>`;
}

export function card(task, index) {
  const title = heading(task, index);
  const image = picture(task.image);
  const body = preview(task);
  const status = footer(task);
  const id = escape(task.id);
  return `<article id="${id}" class="experiment">${title}${image}${body}${status}</article>`;
}
