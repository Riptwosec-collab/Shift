/* December 2026 (ธันวาคม 2569) — cell-for-cell transcription from the user's
   996×376 reference roster screenshot (2026-11-20).
   Row order matches src/data.js / October / November.
   Keep unnumbered N exactly where visible; do NOT silently assign N1/N2.
   Yellow/red source H backgrounds are annotations, not inferred leave codes. */
export const DECEMBER_2026_DUTY_POSITIONS=Object.freeze([
  Object.freeze("N1 N2 H H H H H H D1 D2 D3 H H D1 D2 D3 D4 D4 H H D4 D3 D2 D1 H H H H N1 N2 N1".split(' ')),
  Object.freeze("N N1 N2 H H H N1 N2 N1 N2 H H H D2 D3 D4 H H H D2 D3 D4 H H D1 D2 D1 H H H H".split(' ')),
  Object.freeze("D1 D2 D3 D4 H H H D1 D2 D3 D4 H H H H D1 D2 D3 H H D1 D2 D3 H H H H D1 D2 D3 H".split(' ')),
  Object.freeze("H D1 D2 H H H D1 D2 D3 H H H H N1 N2 N1 H H H H N1 N2 N1 N2 N1 H H H D1 D2 D1".split(' ')),
  Object.freeze("D2 D3 H H H D1 D2 D3 H H H N1 N2 N1 H H H N1 N2 N1 H H H D1 D2 H H D2 D3 D4 D2".split(' ')),
  Object.freeze("D4 H H N1 N2 N H H H D1 D2 D1 D2 H H H D1 D2 D1 H H H D1 D2 D3 H H N2 N2 H H".split(' ')),
  Object.freeze("H H N1 N2 N1 N2 N H H H N1 N2 N1 H H H N1 N2 N1 N2 H H H H D4 D1 D2 D3 H H H".split(' ')),
  Object.freeze("H H D4 D3 D1 D2 H N1 N2 N1 N2 H H H N1 N2 N1 H H H H D1 D2 D3 H H H D4 D1 D2 H".split(' ')),
  Object.freeze("H D4 D1 D2 H H H D1 D2 D3 D4 H H D4 D1 D2 D3 H H H N2 N1 N2 H H N2 N1 N2 H H H".split(' ')),
  Object.freeze("D3 H H D1 D2 H H H H H H D2 D1 D3 D4 H H D1 D2 D1 D2 H H N2 N1 N2 N1 H H N1 N2".split(' ')),
]);
export const DECEMBER_2026_SOURCE_HIGHLIGHTS=Object.freeze([
  Object.freeze({yellow:Object.freeze([4,5,6,7]),red:Object.freeze([])}),
  Object.freeze({yellow:Object.freeze([]),red:Object.freeze([31])}),
  Object.freeze({yellow:Object.freeze([25]),red:Object.freeze([7,31])}),
  Object.freeze({yellow:Object.freeze([10,11,12]),red:Object.freeze([])}),
  Object.freeze({yellow:Object.freeze([]),red:Object.freeze([])}),
  Object.freeze({yellow:Object.freeze([]),red:Object.freeze([7,31])}),
  Object.freeze({yellow:Object.freeze([]),red:Object.freeze([31])}),
  Object.freeze({yellow:Object.freeze([]),red:Object.freeze([7,31])}),
  Object.freeze({yellow:Object.freeze([]),red:Object.freeze([7,31])}),
  Object.freeze({yellow:Object.freeze([6,7,8,9,10,11]),red:Object.freeze([])}),
]);
export const DECEMBER_2026_DUTY_META=Object.freeze({
 year:2026,month:12,days:31,staffCount:10,
 source:'user-supplied December 2569 roster image',
 unnumberedNightCells:Object.freeze([[1,1],[5,6],[6,7]]),
 notes:'Unnumbered N cells retained; background-highlighted H cells keep original source annotations.'
});
