"""A67 exact coupon distribution + reproducible Monte Carlo; no player data."""
import json, math, random, statistics
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
FOLDER = ROOT / 'docs/arcana/progression-increment-2026-10-16'
DATA = json.loads((FOLDER / 'evidence/reference/trial-v1.json').read_text())
RNG = random.Random(67016)
SAMPLES = 50000

def percentile(v, p):
    s = sorted(v)
    return s[min(len(s) - 1, int((len(s) - 1) * p))]

def summary(v):
    return {'min': min(v), 'p10': percentile(v, 0.1), 'p50': percentile(v, 0.5), 'p90': percentile(v, 0.9), 'p95': percentile(v, 0.95), 'p99': percentile(v, 0.99), 'max': max(v), 'mean': statistics.fmean(v)}

def exact(n, target, quantiles=(0.5, 0.9, 0.95, 0.99)):
    """Propagate coupon occupancy probabilities; no Monte Carlo error in quantiles."""
    dp = [1.0] + [0.0] * n
    found = {}
    cdf = {}
    expectation = n * sum((1 / k for k in range(n - target + 1, n + 1)))
    for t in range(1, 5001):
        nxt = [0.0] * (n + 1)
        for k, v in enumerate(dp):
            nxt[k] += v * k / n
            if k < n:
                nxt[k + 1] += v * (n - k) / n
        dp = nxt
        prob = sum(dp[target:])
        cdf[t] = prob
        for q in quantiles:
            if q not in found and prob >= q:
                found[q] = t
        if len(found) == len(quantiles) and t >= 500:
            break
    return {'expectedDraws': expectation, 'quantiles': {str(q): v for q, v in found.items()}, 'cdf': {str(t): cdf[t] for t in [10, 20, 40, 80, 100, 120, 160, 181, 200, 300, 500] if t in cdf}}

def simulate(n, targets):
    """Independent coupon trajectories, with explicit seed and fixed sample count."""
    rows = {t: [] for t in targets}
    snapshots = {t: [] for t in [5, 20, 40, 80, 120, 200]}
    for _ in range(SAMPLES):
        seen = set()
        draws = 0
        recorded = set()
        while len(seen) < n or draws < 200:
            draws += 1
            seen.add(RNG.randrange(n))
            for target in targets:
                if len(seen) >= target and target not in recorded:
                    rows[target].append(draws)
                    recorded.add(target)
            if draws in snapshots:
                snapshots[draws].append(len(seen))
    return {'targets': {str(t): {'draws': summary(v), 'duplicatesAtTarget': summary([d - t for d in v]), 'exact': exact(n, t)} for t, v in rows.items()}, 'snapshots': {str(t): {'unique': summary(v), 'duplicates': summary([t - k for k in v]), 'missingSpecificExact': (1 - 1 / n) ** t} for t, v in snapshots.items()}}

def calendar_schedule(attempt_rows, attempts_per_day, opening_batches, low=True):
    """Daily visits in integer seconds. Capacity50, one point per720seconds, cost5 per combat; wait only when necessary."""
    time = 0
    cursor = 0
    points = 50
    wait = 0
    action = 20 if low else 45
    battle = 30 if low else 90
    closure = 45 if low else 120

    def regen(now):
        nonlocal cursor, points
        intervals = (now - cursor) // 720
        points = min(50, points + intervals)
        cursor = now if points == 50 else cursor + intervals * 720
    for index, row in enumerate(attempt_rows):
        if index and index % attempts_per_day == 0:
            time = max(time, index // attempts_per_day * 86400)
            regen(time)
        time += opening_batches[index] * (3 if low else 10)
        regen(time)
        visits = row[7]
        positions = set(row[8])
        for event in range(1, visits + 1):
            time += action
            regen(time)
            if event in positions:
                if points < 5:
                    need = (5 - points) * 720 - (time - cursor)
                    assert need > 0
                    time += need
                    wait += need
                    regen(time)
                assert points >= 5
                points -= 5
                time += battle
                regen(time)
        time += closure
        regen(time)
    time += opening_batches[-1] * (3 if low else 10)
    regen(time)
    return {'elapsedMinutes': time / 60, 'additionalEnergyWaitMinutes': wait / 60, 'calendarDays': time // 86400 + 1}

def timing_and_finance():
    """Fixed formation cohorts, paired independent RNG streams, first-victory rights and one vault. Daily schedules include openings and energy waits."""
    bank = json.loads((FOLDER / 'evidence/route-bank.json').read_text())['bank']
    outcomes = []
    for variant in ['baseline', 'discovery', 'tactical', 'mastery']:
        for collection in ['initial', 'intermediate', 'broad']:
            source = next((b['rows'] for b in bank if b['variant'] == variant and b['collection'] == collection and (b['policy'] == 'alchemy')))
            for basket in ['collection-only', 'forge-once-25', 'bean-each-attempt']:
                records = []
                for trial in range(5000):
                    route_rng = random.Random(67016000 + trial)
                    card_rng = random.Random(67116000 + trial)
                    vault_rng = random.Random(67216000 + trial)
                    eligible_ids = [e['wizardId'] for e in DATA['toadTable']['entries']]
                    known = {'initial': [], 'intermediate': ['circe', 'ember-keeper'], 'broad': ['merlin', 'flamel', 'circe', 'morgana']}[collection]
                    seen = {eligible_ids.index(i) for i in known}
                    draws = 0
                    cash = 50
                    claimed = 0
                    attempt = 0
                    energy = 0
                    losses = 0
                    vaultDone = False
                    free = 0
                    firstWin = None
                    forgePaid = False
                    attempt_rows = []
                    opening_batches = []
                    last_batch_draws = 0
                    while len(seen) < 29 and attempt < 1500:
                        while cash >= 10:
                            cash -= 10
                            draws += 1
                            seen.add(card_rng.randrange(29))
                            if len(seen) == 29:
                                break
                        opening_batches.append(draws - last_batch_draws)
                        last_batch_draws = draws
                        if len(seen) == 29:
                            break
                        attempt += 1
                        r = source[int(route_rng.random() * len(source))]
                        attempt_rows.append(r)
                        mask = r[2]
                        cash += r[3]
                        energy += r[4]
                        if r[1] in ['lost', 'draw']:
                            losses += 1
                        new = mask & ~claimed
                        for i in range(5):
                            if new & 1 << i:
                                cash += 45 if i == 4 else 18
                                if i == 4:
                                    free += 1
                                    if firstWin is None:
                                        firstWin = attempt
                                    if not vaultDone:
                                        vaultDone = True
                                        if vault_rng.randrange(2) == 0:
                                            cash += 50
                                            free += 2
                                        else:
                                            cash += 75
                        claimed |= mask
                        while free and len(seen) < 29:
                            free -= 1
                            draws += 1
                            seen.add(card_rng.randrange(29))
                        if basket == 'forge-once-25' and (not forgePaid) and (cash >= 25):
                            cash -= 25
                            forgePaid = True
                        if basket == 'bean-each-attempt' and cash >= 5:
                            cash -= 5
                    if len(opening_batches) < len(attempt_rows) + 1:
                        opening_batches.append(draws - last_batch_draws)
                    visits = sum((r[7] for r in attempt_rows))
                    combats = energy / 5
                    lo = (visits * 20 + combats * 30 + attempt * 45 + draws * 3) / 60
                    hi = (visits * 45 + combats * 90 + attempt * 120 + draws * 10) / 60
                    initial_rows = attempt_rows[:firstWin] if firstWin else []
                    firstLo = (sum((r[7] for r in initial_rows)) * 20 + sum((r[4] / 5 for r in initial_rows)) * 30 + len(initial_rows) * 45) / 60 if firstWin else None
                    firstHi = (sum((r[7] for r in initial_rows)) * 45 + sum((r[4] / 5 for r in initial_rows)) * 90 + len(initial_rows) * 120) / 60 if firstWin else None
                    two = calendar_schedule(attempt_rows, 2, opening_batches)
                    five = calendar_schedule(attempt_rows, 5, opening_batches)
                    regenMinutes = max(0, (energy - 50) * 12)
                    records.append({'attempts': attempt, 'openings': draws, 'lossesOrDraws': losses, 'energy': energy, 'activeMinutesLow': lo, 'activeMinutesHigh': hi, 'resourceElapsedMinutesLowerBound': regenMinutes, 'additionalWaitMinutesAtFastActiveAssumption': max(0, regenMinutes - lo), 'daysAt2AttemptsPerDay': two['calendarDays'], 'daysAt5AttemptsPerDay': five['calendarDays'], 'energyWaitMinutes2PerDay': two['additionalEnergyWaitMinutes'], 'energyWaitMinutes5PerDay': five['additionalEnergyWaitMinutes'], 'firstRegionAttempt': firstWin, 'firstRegionActiveLow': firstLo, 'firstRegionActiveHigh': firstHi, 'vaultRedeemed': int(vaultDone)})
                outcomes.append({'variant': variant, 'collectionFixture': collection, 'policy': 'alchemy; path-uniform; static formation retained even after acquisitions', 'basket': basket, 'samples': 5000, 'initialEligibleIdentities': len(known), 'priorAcquisitionCostsExcluded': collection != 'initial', **{key: (summary([r[key] for r in records if r[key] is not None]) if any(r[key] is not None for r in records) else None) for key in records[0]}, 'censoredAt1500': sum((r['attempts'] >= 1500 for r in records))})
    return outcomes

def main():
    """Validate known exact cases, then write deterministic analysis evidence; never touches a player account."""
    entries = DATA['toadTable']['entries']
    assert len(entries) == 29 and all((e['weight'] == 1 for e in entries))
    assert exact(1, 1)['quantiles']['0.5'] == 1
    assert abs(exact(2, 2)['expectedDraws'] - 3) < 1e-12
    assert abs(exact(2, 2)['cdf']['10'] - (1 - 2 * 0.5 ** 10)) < 1e-12
    result = {'seed': 67016, 'samples': SAMPLES, 'definitions': {'catalog': 30, 'guaranteedStarter': 1, 'toadCandidates': 29, 'sameWeightPerIdentity': 1, 'flavours': 4, 'catalogMilestonesEligible': {'50percentOf30': 14, '75percentOf30': 22, '90percentOf30': 26, '100percentOf30': 29}}, 'characters': simulate(29, [14, 22, 26, 29]), 'flavours': simulate(4, [4]), 'finance': timing_and_finance(), 'limits': ['Uniform legal paths are diagnostic weighting, not human route choice.', 'Fixed formation cohort is not a granted collection; acquired copies not selected.', 'No new economic rule implemented. Bean basket is opportunity cost only and does not claim item benefit.', 'Sessions and action durations are explicit unmeasured assumptions; resourceElapsed is a lower bound; daily schedules include cap and energy waits during the visit. Mobile/desktop automation is not human timing.', 'First claims keyed by 4 duel level IDs and 1 boss; paid vault once only. No repeat keys.', 'Encounters passed; actual new trades can alter survival but not produce currency.', 'No finite opening count guarantees full collection.']}
    (FOLDER / 'evidence/completion-model.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({'characters': result['characters']['targets']['29'], 'flavours': result['flavours']['targets']['4'], 'financeRows': len(result['finance'])}))
if __name__ == '__main__':
    main()
