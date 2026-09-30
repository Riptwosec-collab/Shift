import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Cloudflare deploy publishes only dist assets',()=>{
  const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
  const wrangler=fs.readFileSync('wrangler.jsonc','utf8');
  const build=fs.readFileSync('scripts/build.mjs','utf8');
  const ignore=fs.readFileSync('.gitignore','utf8');
  assert.match(pkg.scripts.deploy,/npm run build/);
  assert.match(pkg.scripts.deploy,/wrangler deploy/);
  assert.match(pkg.scripts.preview,/npm run build/);
  assert.match(wrangler,/"directory"\s*:\s*"\.\/dist"/);
  assert.doesNotMatch(wrangler,/"directory"\s*:\s*"\."/);
  assert.match(build,/dist/);
  assert.match(build,/index\.html/);
  assert.match(ignore,/node_modules\//);
  assert.match(ignore,/\.wrangler\//);
  assert.match(ignore,/dist\//);
});
