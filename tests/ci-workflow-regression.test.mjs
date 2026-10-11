import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(path,'utf8');
test('main Cloudflare deploy validates source and icons before checking credentials',()=>{
 const wf=read('.github/workflows/deploy-cloudflare.yml');
 const indexOf=name=>wf.indexOf('      - name: '+name);
 const steps=['Build PWA and icon assets','Verify generated HTML','Test','Verify icon assets','Check Cloudflare credentials','Deploy to Cloudflare Workers'];
 for(const s of steps)assert.ok(indexOf(s)>0,s);
 for(let i=1;i<steps.length;i++)assert.ok(indexOf(steps[i])>indexOf(steps[i-1]),'wrong order '+steps[i]);
 assert.ok(wf.includes('branches: [main]'));
 assert.ok(wf.includes('CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}'));
 assert.ok(wf.includes('CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}'));
 assert.ok(!wf.includes('    env:\n      CLOUDFLARE_API_TOKEN'));
 assert.ok(wf.includes('npx wrangler deploy'));
});
test('release branch CI cancels redundant work but keeps all build, test and release gates',()=>{
 for(const path of ['.github/workflows/v64-ci.yml','.github/workflows/v65-ci.yml']){
  const wf=read(path);
  for(const marker of ['cancel-in-progress: true','contents: read','paths-ignore:','run: npm run build','git diff --exit-code -- index.html','run: npm test','workflow_dispatch:','timeout-minutes:'])assert.ok(wf.includes(marker),path+': '+marker);
  assert.ok(!wf.includes('branches: [main]'),path+' must not deploy');
 }
});
