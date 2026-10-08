export function ensure(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function taskById(tasks, id) {
  const found = tasks.find((task) => task.id === id);
  ensure(Boolean(found), `Unknown dependency or next task: ${id}`);
  return found;
}

export function dependencies(tasks, task) {
  ensure(/^[A-Za-z][A-Za-z0-9_-]*$/.test(task.id), "Task IDs must be simple identifiers.");
  ensure(task.id !== "wider-plan" && task.id !== "focus", "Task ID conflicts with navigation.");
  ensure(!task.dependsOn.includes(task.id), "A task cannot depend on itself.");
  task.dependsOn.forEach(taskById.bind(null, tasks));
}
