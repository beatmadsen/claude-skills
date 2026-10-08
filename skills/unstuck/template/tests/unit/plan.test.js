import { test } from "node:test";
import assert from "node:assert/strict";
import sample from "../../data/plan.json" with { type: "json" };
import { board } from "../../app/board.js";

test("should reject repeated next steps rather than display duplicate cards", () => {
  const plan = { ...sample, next: ["U1", "U1", "U3"] };
  assert.throws(() => board(plan), /three distinct/);
});

test("should reject a dependency that has no task record", () => {
  const task = { ...sample.tasks[0], dependsOn: ["missing"] };
  const plan = { ...sample, tasks: [task, sample.tasks[1], sample.tasks[2]] };
  assert.throws(() => board(plan), /Unknown dependency/);
});
