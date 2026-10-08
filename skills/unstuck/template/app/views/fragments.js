import { escape, safeHref } from "../lib/text.js";

export function fact(item) {
  const label = escape(item.label);
  const text = escape(item.text);
  return `<div class="fact"><dt>${label}</dt><dd>${text}</dd></div>`;
}

export function facts(items) {
  const rows = items.map(fact);
  return `<dl>${rows.join("")}</dl>`;
}

export function picture(image) {
  const src = safeHref(image.src);
  const attribute = escape(src);
  const alt = escape(image.alt);
  const label = escape(image.label);
  return `<figure><img src="${attribute}" alt="${alt}"><figcaption>${label}</figcaption></figure>`;
}

export function item(text) {
  const value = escape(text);
  return `<li>${value}</li>`;
}

export function list(items) {
  const rows = items.map(item);
  return `<ul>${rows.join("")}</ul>`;
}
