/* November 2026 duty roster transcribed from the user-supplied image.
   Staff index matches src/data.js. H = OFF, D1–D4 and N1–N2 are numbered duties.
   Screenshot has an apparent source conflict on Nov 30: two N1 and no N2.
   Preserve the visible source cells; flag the discrepancy instead of fabricating a correction. */
export const NOVEMBER_2026_DUTY_POSITIONS=Object.freeze([
  Object.freeze("H H H H N1 N2 N1 N2 H H H D4 D1 H H D1 D2 D3 D4 D3 H H D4 D1 H H H N1 N2 N1".split(' ')),
  Object.freeze("H H H D1 D3 D4 H H H H N2 N1 N2 H H D2 D3 D4 H H N1 N2 N1 N2 N1 H H H N1 N1".split(' ')),
  Object.freeze("H D1 D2 D3 H H H D2 D1 D4 H H D3 D2 D1 D3 H H D1 D2 H H D2 D3 D4 D2 H H H H".split(' ')),
  Object.freeze("H H N2 N1 N2 N1 H H N1 N2 N1 N2 H H H D4 D1 D2 D3 H H H H N1 N2 N1 N2 H H H".split(' ')),
  Object.freeze("D2 D3 D4 H H D1 D2 D1 H H H D1 D2 H H H H N1 N2 N1 H H H D2 D1 D3 D4 H H D2".split(' ')),
  Object.freeze("D1 H H H D2 D2 D1 H H H D2 D3 D4 H H H N1 N2 N1 N2 H H H D4 D3 D1 D1 H H D3".split(' ')),
  Object.freeze("N1 N2 N1 N2 H H H H D3 D2 D1 D2 H H H H D4 D1 H H D2 D1 D1 H H N2 N1 N2 H H".split(' ')),
  Object.freeze("N2 N1 H H H H N2 N1 N2 N1 H H N1 N2 N1 N2 H H D2 D1 H H H H D2 D4 D2 D1 H H".split(' ')),
  Object.freeze("H D4 D1 D2 D4 D3 H H D4 D1 D3 H H D1 D2 H H H H H N2 N1 N2 H H H D3 D2 D1 D1".split(' ')),
  Object.freeze("H D2 D3 D4 D1 H H H D2 D3 D4 H H N1 N2 N1 N2 H H D4 D1 D2 D3 H H H H H D2 D4".split(' ')),
]);
export const NOVEMBER_2026_DUTY_META=Object.freeze({year:2026,month:11,days:30,staffCount:10,source:'user-provided November 2569 roster image',hasUnverifiedNov30NightPosition:true});
