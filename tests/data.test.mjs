import test from 'node:test';
import assert from 'node:assert/strict';
import { STAFF, DAYS_IN_MONTH, statusAt, formatStatus } from '../src/data.js';

const EXPECTED = [
  ["นาย นลิทัศน์ นากรณ์","OOOOODDDDOODDDDOOOODDOOOONNNNNN"],
  ["นายกิตติ ยอดนนท์","DDOODDDOOOODDOODDOOOONNNNNOODDO"],
  ["นายครีมคนัย ศิริมาศย์","OODDDDOODDDOODDOODDOODDDDDOOOOO"],
  ["นายสถิตย์ พันธ์แดง","OODDDOODDDDDOOODDDDOOOOOOODDDDO"],
  ["นายวัชระ ภูเกิด","NNNNOOOONNNOOOOONNNNNOOOODDDOOD"],
  ["นายพัชร สันต์พิสิ","OOOONNNNOOONNNNOOODDDDOOODDOODD"],
  ["นายเสถียร มาสา","DDOOONNNNOOONNNNOOODDDOOODDDOON"],
  ["นายอิศเรศ เวียงอินทร์","NNNNNOOOONNNOOONNNNOOOODDOODDOO"],
  ["นายกฤติศ โพธิ์ไทรย์","DDOOOODDDOODODDOOOONNNNNNOOODDO"],
  ["นายกิตติศักดิ์ วัชรรังสิมันต์","DDOODDDDOOOOODDOOODDDDDOOONNNNO"]
];

test('locks exact October 2569 employee schedules', () => {
  assert.equal(DAYS_IN_MONTH, 31);
  assert.deepEqual(STAFF.map(x => [x.name, x.s]), EXPECTED);
  for (const person of STAFF) {
    assert.equal(person.s.length, 31);
    assert.match(person.s, /^[DNO]{31}$/);
  }
  assert.equal(formatStatus('O'), 'OFF');
  assert.equal(statusAt(0, 1), 'O');
});
