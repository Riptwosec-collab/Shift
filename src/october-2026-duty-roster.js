/* Authoritative October 2026 duty positions transcribed from the user-supplied October table.
   Exactly 10 staff rows (same order as src/data.js), 31 days each.
   H = holiday/off, D1-D4 = day posts, N1-N2 = night posts.
   November screenshot is deliberately NOT included. */
export const OCTOBER_2026_DUTY_POSITIONS=Object.freeze([
 'H H H H H D1 D2 D3 D4 H H D1 D2 D3 D4 H H H H D1 D2 H H H H N2 N1 N2 N1 N2 N1',
 'D4 D3 H H D3 D2 D4 H H H H D2 D1 H H D1 D2 H H H H N1 N2 N1 N2 N1 H H D1 D2 H',
 'H H D1 D2 D2 D3 H H D1 D2 D1 H H D2 D2 H H D1 D2 H H D3 D1 D2 D1 D4 H H H H H',
 'H H D2 D1 D4 H H D1 D2 D1 D2 D3 H H H D2 D1 D2 D3 H H H H H H H D1 D2 D3 D4 H',
 'N2 N1 N2 N1 H H H H N2 N1 N2 H H H H H N2 N1 N2 N1 N2 H H H H D1 D2 D3 H H D1',
 'H H H H N2 N1 N2 N1 H H H N1 N1 N2 N1 H H H D1 D2 D3 D4 H H H D2 D3 H H D3 D2',
 'D3 D4 H H H N2 N1 N2 N1 H H H N2 N1 N2 N1 H H H D4 D4 D1 H H H D3 D4 D1 H H N2',
 'N1 N2 N1 N2 N1 H H H H N2 N1 N2 H H H N2 N1 N2 N1 H H H H D1 D2 H H D4 D2 H H',
 'D2 D1 H H H H D1 D2 D3 H H D4 H D1 D3 H H H H N2 N1 N2 N1 N2 N1 H H H D4 D1 H',
 'D1 D2 H H D1 D4 D3 D4 H H H H H D4 D1 H H H D4 D3 D1 D2 D2 H H H N2 N1 N2 N1 H',
].map(line=>Object.freeze(line.split(' '))));
export const OCTOBER_2026_DUTY_META=Object.freeze({year:2026,month:10,staffCount:10,days:31,source:'user-supplied October 2569 roster image'});
