export function escape(value) {
  const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return value.replace(/[&<>"']/g, (character) => entities[character]);
}

export function safeHref(value) {
  if (!/^(https?:\/\/|[a-zA-Z0-9_-]+[/.#])/.test(value) || /[\\\s]/.test(value)) {
    throw new Error(`Unsupported link: ${value}`);
  }
  return value;
}

export function link(item) {
  const href = safeHref(item.href);
  const attribute = escape(href);
  const label = escape(item.label);
  return `<a href="${attribute}" target="_blank" rel="noreferrer">${label} <span aria-hidden="true">/</span></a>`;
}
