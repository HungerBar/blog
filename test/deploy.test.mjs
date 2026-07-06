import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

test("pnpm workspace config declares the root package for Cloudflare installs", () => {
  const workspace = readFileSync("pnpm-workspace.yaml", "utf8");

  assert.match(workspace, /^packages:\n/m);
  assert.match(workspace, /^  - \.$/m);
});

test("wrangler config deploys the built static assets without Astro auto-configuration", () => {
  assert.equal(existsSync("wrangler.jsonc"), true);

  const config = readFileSync("wrangler.jsonc", "utf8");
  assert.match(config, /"compatibility_date": "2026-07-03"/);
  assert.match(config, /"assets": \{/);
  assert.match(config, /"directory": "\.\/dist"/);
});

test("Astro is configured for the GitHub Pages user site", () => {
  const config = readFileSync("astro.config.mjs", "utf8");

  assert.match(config, /site: "https:\/\/hungerbar\.github\.io"/);
  assert.doesNotMatch(config, /base:/);
});

test("GitHub Pages workflow builds and deploys the Astro site", () => {
  assert.equal(existsSync(".github/workflows/deploy.yml"), true);

  const workflow = readFileSync(".github/workflows/deploy.yml", "utf8");
  assert.doesNotMatch(workflow, /uses: withastro\/action@v6/);
  assert.match(workflow, /uses: actions\/configure-pages@v5/);
  assert.match(workflow, /uses: pnpm\/action-setup@v4/);
  assert.match(workflow, /uses: actions\/setup-node@v6/);
  assert.match(workflow, /run: pnpm install --frozen-lockfile/);
  assert.match(workflow, /run: pnpm build/);
  assert.match(workflow, /uses: actions\/upload-pages-artifact@v4/);
  assert.match(workflow, /path: \.\/dist/);
  assert.match(workflow, /uses: actions\/deploy-pages@v5/);
  assert.match(workflow, /pages: write/);
  assert.match(workflow, /id-token: write/);
});
