import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Cloudflare direct deploy uses a strict allowlist for the PWA shell',()=>{
  const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
  const wrangler=fs.readFileSync('wrangler.jsonc','utf8');
  const build=fs.readFileSync('scripts/build.mjs','utf8');
  const assetsIgnore=fs.readFileSync('.assetsignore','utf8');
  assert.match(pkg.scripts.deploy,/npm run build/);
  assert.match(pkg.scripts.deploy,/wrangler deploy/);
  assert.match(wrangler,/"directory"\s*:\s*"\.\/"/);
  assert.doesNotMatch(wrangler,/"directory"\s*:\s*"\.\/dist"/);
  assert.match(assetsIgnore,/^\*$/m);
  assert.match(assetsIgnore,/^!index\.html$/m);
  assert.match(build,/writeFileSync\('index\.html'/);
});
