#!/usr/bin/env python3
"""Read-only A52 sensitivity analysis. No database, cookies or game-state writes."""
import hashlib
import json
import random
from pathlib import Path
from statistics import mean
from game_design_skills_suite.prob_and_economy_sim import simulate_economy

ROOT = Path(__file__).resolve().parents[2]
source = ROOT / 'src/arcana/content/trial-v1.json'
config = json.loads(source.read_text())
entries = config['toadTable']['entries']
ids = [entry['wizardId'] for entry in entries]
rarities = {w['id']: w['rarity'] for w in config['catalog']['wizards']}
price = next(p['crowns'] for p in config['shop']['products'] if p['kind'] == 'cacao-toad')
seed = 52
trials = 3000
budgets = [5, 10, 20, 40, 80]
rows = []
for scenario in ['current', 'common-weight-x2-proposal']:
    rng = random.Random(seed)
    weights = [e['weight'] * (2 if scenario != 'current' and rarities[e['wizardId']] == 'common' else 1) for e in entries]
    results = {draws: [] for draws in budgets}
    for _ in range(trials):
        draws = rng.choices(ids, weights=weights, k=max(budgets))
        for count in budgets:
            found = len(set(draws[:count]))
            results[count].append((found, count - found))
    for count, observations in results.items():
        unique = sorted(o[0] for o in observations)
        rows.append({'scenario': scenario, 'opens': count,
            'mean_new_identities': round(mean(unique), 2),
            'p10_identities': unique[int(trials * .1)], 'p90_identities': unique[int(trials * .9)],
            'mean_duplicates': round(mean(o[1] for o in observations), 2),
            'crowns_at_current_price': count * price})
# Deliberately simple daily budget: one already-cleared duel source and one desired toad/day.
# Workshop module saturates at zero, so report insufficient desired basket explicitly.
repeat = int(config['duelReward']['crowns'] * .1)
economies = []
for duels in [1, 3, 6]:
    for candidate_price in [price, price * .8, price * 1.2]:
        source_per_day = repeat * duels
        flow = simulate_economy(initial=50, source_base=source_per_day, growth=0,
            sink_base=candidate_price, rounds=90)
        economies.append({'assumed_repeat_duels_per_day': duels, 'target_toads_per_day': 1,
            'price': candidate_price, 'daily_crowns_source': source_per_day,
            'day90_clamped_wallet': flow[-1]['end'],
            'desired_basket_shortfall': max(0, candidate_price * 90 - (50 + source_per_day * 90))})
report = {'input_sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
    'catalog_version': config['catalog']['version'], 'table_version': config['toadTable']['version'],
    'seed': seed, 'trials_per_scenario': trials, 'current_toad_price': price,
    'current_candidate_count': len(ids), 'current_weights': [e['weight'] for e in entries],
    'collection': rows, 'daily_budget_sensitivity': economies,
    'limits': ['Hypotheses, not player observations or approved changes.',
        'Collection counts exclude the starter; initial owned collectible set assumed empty.',
        'Daily budget assumes the same already-cleared duel reward, no other sources/sinks.',
        'No combat wins, route availability, time, health or energy are simulated.',
        'Zero-clamped budget is a desired spending model, not actual authorized purchases.',
        'No pity, exchange, reroll, refunds or account changes are applied.']}
print(json.dumps(report, ensure_ascii=False, indent=2))
