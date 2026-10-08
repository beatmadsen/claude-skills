import { test } from "node:test";
import assert from "node:assert/strict";
import { safeHref } from "../../app/lib/text.js";

test("should reject executable evidence links", () => {
  assert.throws(() => safeHref("javascript:alert(1)"), /Unsupported link/);
});

test("should allow project-local evidence", () => {
  assert.equal(safeHref("assets/comparison.svg"), "assets/comparison.svg");
});

test("should reject network-path links", () => {
  assert.throws(() => safeHref("//outside.example/image"), /Unsupported link/);
});
