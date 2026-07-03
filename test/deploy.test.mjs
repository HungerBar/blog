import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("pnpm workspace config declares the root package for Cloudflare installs", () => {
  const workspace = readFileSync("pnpm-workspace.yaml", "utf8");

  assert.match(workspace, /^packages:\n/m);
  assert.match(workspace, /^  - \.$/m);
});
