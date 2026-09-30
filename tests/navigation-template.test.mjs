import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('desktop and mobile navigation are rendered as static buttons',()=>{
  const template=fs.readFileSync('src/template.html','utf8');
  assert.doesNotMatch(template, /<nav>\$\{/);
  assert.doesNotMatch(template, /<nav class="mobile-nav">\$\{/);
  for (const view of ['overview','daily','person','month','analytics']) {
    assert.match(template,new RegExp(`data-view="${view}"`));
  }
  assert.match(template,/<nav><button data-view="overview" class="active">Overview<\/button>/);
  assert.match(template,/<nav class="mobile-nav"><button data-view="overview" class="active">Home<\/button>/);
});
