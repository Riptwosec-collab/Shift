import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(p,'utf8');
const js=read('src/v6532-duty-posts.js');
const staff=[
 {name:'D staff A',s:'D'.repeat(31)},
 {name:'D staff B',s:'D'.repeat(31)},
 {name:'N staff A',s:'N'.repeat(31)},
 {name:'OFF staff A',s:'O'.repeat(31)}
];
function env(){
 const values=new Map(),ctx={staff,statusAt:(i,d)=>staff[i].s[d-1],
 localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)}};
 vm.createContext(ctx);vm.runInContext(js,ctx);
 return {execute:code=>vm.runInContext(code,ctx),values};
}
test('numbered D1–D4/N1–N2 are never invented for coarse D/N/O source',()=>{
 const {execute}=env();
 assert.equal(execute('shiftRoleOf(0,10)'),'D?');
 assert.equal(execute('shiftRoleOf(2,10)'),'N?');
 assert.equal(execute('shiftRoleOf(3,10)'),'OFF');
});
test('assign only matching day/night employees and prevent duplicate slots',()=>{
 const {execute}=env();
 assert.equal(execute("shiftAssignRole(10,'D1','D staff A')"),true);
 assert.equal(execute("shiftAssignRole(10,'N1','D staff B')"),false);
 assert.equal(execute("shiftAssignRole(10,'N1','N staff A')"),true);
 assert.equal(execute("shiftRoleOf(0,10)"),'D1');
 assert.equal(execute("shiftRoleOf(2,10)"),'N1');
 assert.equal(execute("shiftAssignRole(10,'D2','D staff A')"),true);
 assert.equal(execute("shiftRoleOf(0,10)"),'D2');
 assert.equal(execute("shiftAssignments[10].D1"),undefined);
 assert.equal(execute("shiftRoleOf(0,11)"),'D?');
 assert.equal(execute("shiftAssignRole(32,'D1','D staff A')"),false);
});
test('import validation rejects fake or duplicated assignments and invalid dates',()=>{
 const {execute}=env();
 const raw=execute("shiftSanitizeRoles({'10':{'D1':'D staff A','D2':'D staff A','N1':'D staff B','N2':'N staff A'},'32':{'D1':'D staff B'}})");
 assert.deepEqual(JSON.parse(JSON.stringify(raw)),{'10':{'D1':'D staff A','N2':'N staff A'}});
});
test('all schedule views use explicit roles from a single shared lookup',()=>{
 for(const selector of ['#heatmapTable','#overviewMonthMatrix','#v6517MobileMatrix','.shift-week-cell','.person-row','.v6515-person'])assert.ok(js.includes(selector),selector);
 const html=read('index.html'),css=read('src/v6532-duty-posts.css'),build=read('scripts/build.mjs');
 assert.ok(html.includes(js)&&html.includes(css));
 assert.ok(build.includes("'v6532-duty-posts.js'"));
 assert.ok(build.includes('v6532-duty-posts.css'));
 assert.ok(read('sw.js').includes("CACHE_NAME='shift-shell-v6.5.20-r14'"));
});
