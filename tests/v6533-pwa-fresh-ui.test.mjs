import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
test('month shows v6.5.33, assignment count and D?/N? warning',()=>{
 const js=read('src/v6532-duty-posts.js'),html=read('index.html');
 assert.ok(js.includes("dataset.shiftPositionsUi='v6.5.33'"));
 assert.ok(js.includes("note.id='shiftRoleStatus'"));
 assert.ok(js.includes("Duty UI v6.5.33"));
 assert.ok(js.includes('D? / N? = ยังไม่กำหนดตำแหน่งจริง'));
 assert.ok(html.includes(js));
 assert.ok(html.includes(read('src/v6532-duty-posts.css')));
});
test('PWA uses network-first HTML navigation with safe offline fallback',()=>{
 const sw=read('sw.js');
 assert.ok(sw.includes("const fresh=await safeFetch(request,'html')"));
 assert.ok(sw.includes("const fallback=await cachedShell(cache)"));
 assert.ok(!sw.includes("const cached=await cachedShell(cache);\n  const refresh="));
 assert.ok(sw.includes("CACHE_NAME='shift-shell-v6.5.20-r15'"));
});
