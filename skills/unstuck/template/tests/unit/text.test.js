import { test } from "node:test";
import assert from "node:assert/strict";
import { escape } from "../../app/lib/text.js";

test("should display plan markup as literal text", () => {
  assert.equal(escape('<img title="a&b">'), "&lt;img title=&quot;a&amp;b&quot;&gt;");
});
