import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=(p)=>fs.readFileSync(p,'utf8');
const source=read('src/v731-november-access.js');
const styles=read('src/v731-november-access.css');
function resolve(today,search='',stored='10'){
 const document={readyState:'loading',addEventListener(){}};
 return new Function('document','today','search','stored',source+
 '\nreturn shift731InitialMonth(today,search,stored);')(document,today,search,stored);
}
test('November 2026 is the landing screen even when old browser storage remembers October',()=>{
 assert.deepEqual(resolve({year:2026,month:11,day:12},'','10'),{month:'11',openMonth:true});
 assert.deepEqual(resolve({year:2026,month:11,day:30},'','10'),{month:'11',openMonth:true});
 assert.deepEqual(resolve({year:2026,month:11,day:12},'?view=overview','10'),{month:'11',openMonth:false});
});
test('URL can explicitly open either source month without losing the legacy October view',()=>{
 assert.deepEqual(resolve({year:2026,month:11,day:12},'?month=10','11'),{month:'10',openMonth:true});
 assert.deepEqual(resolve({year:2026,month:10,day:12},'?month=11','10'),{month:'11',openMonth:true});
 assert.deepEqual(resolve({year:2026,month:10,day:12},'','10'),{month:'10',openMonth:false});
 assert.deepEqual(resolve({year:2026,month:12,day:1},'?view=month','11'),{month:'11',openMonth:true});
});
test('November shortcut is visible in desktop tabs, mobile nav and header',()=>{
 for(const marker of ['.nav-tabs','.command-actions','mobileNav','data-shift731-open-nov',
 'พฤศจิกายน 2569','shift731Open','shiftNovChangeMonth','shift72Mode','showView'])
  assert.ok(source.includes(marker),marker);
 assert.ok(styles.includes('command-bar .shift731-header-btn'));
 assert.ok(styles.includes('.mobile-nav .shift731-mobile-btn'));
 assert.ok(styles.includes('max-width:430px'));
 assert.ok(styles.includes('prefers-reduced-motion'));
});
test('V7.3 boot is bundled in checked-in standalone PWA and does not mutate roster data',()=>{
 const build=read('scripts/build.mjs'),html=read('index.html');
 assert.ok(build.includes("'v731-november-access.js'"));
 assert.ok(build.includes("v731-november-access.css"));
 assert.ok(html.includes(source));
 assert.ok(html.includes(styles));
 const match=html.match(/data-shift-release="(\d+\.\d+)"/);
 assert.ok(match,'release identifier is missing');
 assert.ok(Number(match[1])>=7.3,'November navigation requires release v7.3+');
 assert.match(html,/data-app-version="6\.5\.20"/);
 assert.match(html,/id="v731-november-access-style"/);
 assert.doesNotMatch(source,/NOVEMBER_2026_DUTY_POSITIONS\s*\[/);
 assert.doesNotMatch(source,/fetch\(|XMLHttpRequest|location\.reload\(/);
});
