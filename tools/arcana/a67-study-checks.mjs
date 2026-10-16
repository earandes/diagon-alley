/** Sanity contracts for the calibration, separate from app acceptance. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { data, frozen, plans, root, unit, combat } from './a67-study.mjs';
const baseline = JSON.parse(fs.readFileSync(frozen + '/trial-v1.json'));
assert.equal(baseline.catalog.wizards.length, 30);
assert.equal(baseline.toadTable.entries.length, 29);
assert.equal(new Set(baseline.toadTable.entries.map((e) => e.wizardId)).size, 29);
assert.ok(!baseline.toadTable.entries.some((e) => e.wizardId === 'apprentice'));
assert.ok(baseline.toadTable.entries.every((e) => e.weight === 1));
const before = crypto
  .createHash('sha256')
  .update(fs.readFileSync(frozen + '/trial-v1.json'))
  .digest('hex');
for (const variant of ['discovery', 'tactical', 'mastery']) {
  const ps = plans(variant),
    boss = ps.find((p) => p.kind === 'boss');
  assert.equal(boss.opponents.length, { discovery: 3, tactical: 4, mastery: 5 }[variant]);
  for (const p of ps) {
    if (p.kind === 'duel' || p.kind === 'boss') {
      assert.deepEqual(p.reward, p.kind === 'duel' ? baseline.duelReward : baseline.bossReward);
      for (const u of p.opponents)
        if (u.wizardId !== 'rival') {
          const s = baseline.catalog.wizards.find((w) => w.id === u.wizardId).stats;
          assert.equal(u.hp, s.maxHp);
          assert.equal(u.power, s.power);
          assert.equal(u.speed, s.speed);
        }
    }
  }
}
const commonPlans = [
  ['apprentice', 'merlin', 'flamel', 'circe', 'morgana'],
  ['apprentice', 'merlin', 'paracelso', 'morgana', 'mist-seer'],
];
for (const ids of commonPlans) {
  assert.ok(ids.every((id) => data.catalog.wizards.find((w) => w.id === id).rarity === 'common'));
  const player = ids.map((id, i) =>
    unit(
      id,
      i ? 'copy:' + i : 'starter:apprentice',
      i ? {} : { wandPowerBonus: 2, broomInitiative: 3 },
    ),
  );
  assert.equal(
    combat(player, plans('mastery').find((p) => p.kind === 'boss').opponents).outcome,
    'player',
  );
}
assert.equal(
  crypto
    .createHash('sha256')
    .update(fs.readFileSync(frozen + '/trial-v1.json'))
    .digest('hex'),
  before,
);
console.log(
  JSON.stringify({
    checked: [
      '30catalog/29eligible/uniform/unique',
      'profiles3/4/5',
      'unchangedRewards',
      'unchangedMasterStats',
      'twoAllCommonMasteryPlans',
      'frozenReferenceUnchanged',
    ],
    status: 'passed',
  }),
);
