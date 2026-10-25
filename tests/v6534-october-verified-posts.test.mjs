import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {STAFF,statusAt} from '../src/data.js';
import {OCTOBER_2026_DUTY_POSITIONS as posts,OCTOBER_2026_DUTY_META as meta} from '../src/october-2026-duty-roster.js';

const approved=new Set(['H','D1','D2','D3','D4','N1','N2']);
test('user supplied October 2569 roster contains 10 employees and 31 days, without November data',()=>{
 assert.equal(meta.year,2026);assert.equal(meta.month,10);
 assert.equal(posts.length,10);assert.equal(STAFF.length,10);
 posts.forEach(row=>{assert.equal(row.length,31);row.forEach(role=>assert.ok(approved.has(role),role))});
});
test('all 310 role assignments exactly match the existing D/N/O shift source',()=>{
 for(let i=0;i<10;i++)for(let day=1;day<=31;day++){
  const post=posts[i][day-1],coarse=statusAt(i,day);
  assert.equal(post==='H'?'O':post[0],coarse,'employee '+i+' day '+day);
 }
});
test('each October day has complete unique duty positions; 19 days have four day engineers',()=>{
 let fourDay=0;
 const totals={H:0,D1:0,D2:0,D3:0,D4:0,N1:0,N2:0};
 for(let day=1;day<=31;day++){
  const roles=posts.map(row=>row[day-1]).filter(v=>v!=='H');
  assert.equal(roles.length,new Set(roles).size,'duplicate on day '+day);
  for(const fixed of ['D1','D2','N1','N2'])assert.ok(roles.includes(fixed),'missing '+fixed+' on '+day);
  assert.equal(roles.includes('D3'),roles.includes('D4'),'unpaired D3/D4 on '+day);
  if(roles.includes('D3'))fourDay++;
  posts.forEach(row=>totals[row[day-1]]++);
 }
 assert.equal(fourDay,19);
 assert.deepEqual(totals,{H:148,D1:31,D2:31,D3:19,D4:19,N1:31,N2:31});
});
test('all roster surfaces resolve verified D1-D4 and N1-N2 immediately on a fresh device',()=>{
 const raw=fs.readFileSync('src/october-2026-duty-roster.js','utf8').replace(/^export\s+/gm,'');
 const runtime=fs.readFileSync('src/v6532-duty-posts.js','utf8');
 const data=new Map();
 const ctx=vm.createContext({staff:STAFF,statusAt,localStorage:{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)}});
 vm.runInContext(raw+'\n'+runtime,ctx);
 for(let i=0;i<10;i++)for(let day=1;day<=31;day++){
  const value=vm.runInContext('shiftRoleOf('+i+','+day+')',ctx);
  assert.equal(value,posts[i][day-1]==='H'?'OFF':posts[i][day-1],
   'verified position employee '+i+' day '+day);
 }
 assert.equal(vm.runInContext("shiftRoleOf(3,10)",ctx),'D1');
 assert.equal(vm.runInContext("shiftRoleOf(2,10)",ctx),'D2');
 assert.equal(vm.runInContext("shiftRoleOf(4,10)",ctx),'N1');
 assert.equal(vm.runInContext("shiftRoleOf(7,10)",ctx),'N2');
});
test('verified October positions are compiled into page and shared across screens',()=>{
 const build=fs.readFileSync('scripts/build.mjs','utf8'),
       html=fs.readFileSync('index.html','utf8'),
       source=fs.readFileSync('src/october-2026-duty-roster.js','utf8'),
       role=fs.readFileSync('src/v6532-duty-posts.js','utf8');
 assert.ok(build.includes("'october-2026-duty-roster.js','v6532-duty-posts.js'"));
 assert.ok(html.includes(source.replace(/^export\s+/gm,'')));
 assert.ok(html.includes(role));
 assert.ok(role.includes('shiftRolesForDay(day)'));
 assert.ok(role.includes("dataset.shiftPositionsUi='v6.5.34'"));
 assert.ok(fs.readFileSync('sw.js','utf8').includes("CACHE_NAME='shift-shell-v6.5.20-r16'"));
});
