"""Bounded policy sensitivity over exported real content. No application state or services.

node tools/arcana/economy-study-a89.mjs > docs/arcana/priority-increment-2026-10-19/economy-input.json
python3 tools/arcana/economy-study-a89.py > docs/arcana/priority-increment-2026-10-19/economy-results.json

Outcomes are assumed Bernoulli scenarios, NOT CombatEngine simulations or human behaviour.
"""
from pathlib import Path
import hashlib
import json
import math
import random
import statistics
import sys

ROOT = Path(__file__).resolve().parents[2]
DOC = ROOT / "docs/arcana/priority-increment-2026-10-19"
SAMPLES = 1000
HORIZON_RUNS = 350
POLICIES = ("A", "B3", "B5", "B8", "C60", "C100", "C150", "D10", "D15")
CONTEXTS = {
    "favourable_no_prep": {"route": "balanced", "duel_win": .85, "boss_win": .70, "abandon": .05, "beans": False, "forge": False},
    "adverse_prepared": {"route": "balanced", "duel_win": .50, "boss_win": .35, "abandon": .20, "beans": True, "forge": True},
    "chest_priority": {"route": "chest-priority", "duel_win": .85, "boss_win": .70, "abandon": .05, "beans": False, "forge": False},
}


def stream(seed, label):
    return random.Random(int.from_bytes(hashlib.sha256(f"a89:{seed}:{label}".encode()).digest()[:8], "big"))


def quantile(values, p):
    values = sorted(values)
    return values[max(0, math.ceil(len(values) * p) - 1)] if values else None


def quantiles(values):
    return {key: quantile(values, p) for key, p in (("p50", .5), ("p90", .9), ("p95", .95))}


def completion_quantiles(rows, field):
    # Censored runs have +infinity completion cost. Never report a completer-only tail as population P95.
    values = [row[field] if row["complete"] else math.inf for row in rows]
    return {key: None if not math.isfinite(value) else value for key, value in quantiles(values).items()}


def exact_from_missing(n, missing):
    p = [1.] + [0.] * missing
    out = {}
    for step in range(2001):
        for key, target in (("p50", .5), ("p90", .9), ("p95", .95)):
            if key not in out and p[-1] >= target:
                out[key] = step
        if len(out) == 3:
            return out
        q = [0.] * (missing + 1)
        for found, value in enumerate(p):
            q[found] += value * (n - missing + found) / n
            if found < missing:
                q[found + 1] += value * (missing - found) / n
        p = q
        assert math.isclose(sum(p), 1, abs_tol=1e-10)
    raise ValueError("Exact bound exceeded")


def spend_surplus(regular, protected, ratio):
    excess = sum(max(0, count - protected[index]) for index, count in enumerate(regular))
    if excess < ratio:
        return False
    remaining = ratio
    for index in sorted(range(len(regular)), key=lambda i: (-regular[i], i)):
        spend = min(remaining, max(0, regular[index] - protected[index]))
        regular[index] -= spend
        remaining -= spend
    assert remaining == 0 and all(count >= keep for count, keep in zip(regular, protected))
    return True


class Clock:
    """Same cap/cursor semantics as the exported Essence contract, in declared hypothetical action time."""
    def __init__(self, essence, slow):
        self.points = essence["capacity"]
        self.capacity = essence["capacity"]
        self.cost = essence["combatCost"]
        self.interval = essence["intervalMs"] / 1000
        self.cursor = self.now = self.wait = self.active = 0
        self.slow = slow

    def action(self, low, high):
        duration = high if self.slow else low
        self.active += duration
        self.now += duration

    def regenerate(self):
        periods = int((self.now - self.cursor) // self.interval)
        self.points = min(self.capacity, self.points + periods)
        self.cursor = self.now if self.points == self.capacity else self.cursor + periods * self.interval

    def combat(self):
        self.regenerate()
        if self.points < self.cost:
            delay = (self.cost - self.points) * self.interval - (self.now - self.cursor)
            self.wait += delay
            self.now += delay
            self.regenerate()
        self.points -= self.cost
        self.action(12, 35)


def simulate(data, owned, context, policy, seed):
    cfg = CONTEXTS[context]
    ids = data["_ids"]
    n = len(ids)
    cohort = stream(seed, f"cohort:{owned}")
    initial = cohort.sample(range(n), owned - 1)
    regular = [int(index in initial) for index in range(n)]
    enchanted = [0] * n
    protected = regular.copy()
    # Two existing duplicates reserved/equipped: conservative protection, not arbitrary 'all repeats disposable'.
    if owned > 1:
        for index in initial[:2]:
            regular[index] += 1
            protected[index] += 1
    general_rng, finish_rng, route_rng = [stream(seed, label) for label in ("identity", "finish", "route")]
    outcome_rng, vault_rng, theme_rng = [stream(seed, label) for label in ("outcome", "vault", "theme")]
    bank = [row for row in data["paths"] if row["owned"] == owned and row["policy"] == cfg["route"]]
    all_levels = {node["levelId"] for row in data["paths"] for node in row["path"] if node["levelId"]}
    victories = set() if owned == 1 else all_levels.copy()
    crowns = data["starterInventory"]["crowns"]
    bean_stock = frogs = 0
    ledger = {key: 0 for key in ("runs", "nodes", "combats", "wins", "losses", "draws", "abandoned", "openings", "duplicate_draws", "exchanges", "directed", "themed", "forge_spent", "bean_spent", "acquisition_spent", "crowns_earned", "vaults", "beans_consumed", "prep_unaffordable", "longest_dry_spell")}
    clocks = [Clock(data["essence"], False), Clock(data["essence"], True)]
    frog_price = next(p["crowns"] for p in data["shop"]["products"] if p["kind"] == "cacao-toad")
    bean_price = next(p["crowns"] for p in data["shop"]["products"] if p["kind"] == "random-beans")
    pool = data["_pool"]
    assert len(pool) == 8
    finish_p = data["table"]["finish"]["enchanted"] / data["table"]["finish"]["total"]
    dry = 0
    forged = 0
    won_key = owned > 1  # Earlier cohorts are declared to have exhausted unique boss/vault rights.
    missing_set = {index for index in range(n) if regular[index] + enchanted[index] == 0}

    def missing():
        return sorted(missing_set)

    def action(low, high):
        for clock in clocks:
            clock.action(low, high)

    def receive(reward):
        nonlocal crowns, bean_stock, frogs
        crowns += reward["crowns"]
        ledger["crowns_earned"] += reward["crowns"]
        bean_stock += reward["products"].count("random-beans")
        frogs += reward["products"].count("cacao-toad")

    def open_frog(themed=False):
        nonlocal dry
        # Separate general quantile stream advances even for a thematic draw; no future values used in policy.
        ticket = general_rng.randrange(n)
        chosen = theme_rng.choice(pool) if themed else ticket
        is_duplicate = regular[chosen] + enchanted[chosen] > 0
        ledger["duplicate_draws"] += int(is_duplicate)
        dry = dry + 1 if is_duplicate else 0
        ledger["longest_dry_spell"] = max(ledger["longest_dry_spell"], dry)
        if finish_rng.random() < finish_p:
            enchanted[chosen] += 1
        else:
            regular[chosen] += 1
        protected[chosen] = max(protected[chosen], 1 if regular[chosen] else 0)
        missing_set.discard(chosen)
        ledger["openings"] += 1
        action(5, 12)

    def acquire():
        nonlocal crowns, frogs, dry
        while missing():
            targets = missing()
            if policy.startswith("B") and spend_surplus(regular, protected, int(policy[1:])):
                regular[targets[0]] += 1
                protected[targets[0]] = 1
                missing_set.discard(targets[0])
                dry = 0
                ledger["exchanges"] += 1
                action(6, 15)
                continue
            if frogs:
                frogs -= 1
                open_frog()
                continue
            if policy.startswith("C") and len(targets) <= 3 and ledger["directed"] < 3:
                cost = int(policy[1:])
                if crowns < cost:
                    break  # A deliberate saving policy, not credit or an automatic award.
                crowns -= cost
                ledger["acquisition_spent"] += cost
                ledger["directed"] += 1
                regular[targets[0]] += 1
                protected[targets[0]] = 1
                missing_set.discard(targets[0])
                dry = 0
                action(6, 15)
                continue
            themed_cost = int(policy[1:]) if policy.startswith("D") else 0
            pool_missing = sum(index in targets for index in pool)
            themed = themed_cost > 0 and pool_missing / len(pool) / themed_cost > len(targets) / n / frog_price
            cost = themed_cost if themed else frog_price
            if crowns < cost:
                break
            crowns -= cost
            ledger["acquisition_spent"] += cost
            ledger["themed"] += int(themed)
            open_frog(themed)

    acquire()
    while missing() and ledger["runs"] < HORIZON_RUNS:
        ledger["runs"] += 1
        action(12, 35)
        if cfg["forge"] and forged < 3:
            cost = (15, 20, 25)[forged]  # Exported recipes checked below; representative spending, no win-rate effect asserted.
            if crowns >= cost:
                crowns -= cost
                ledger["forge_spent"] += cost
                forged += 1
                action(8, 20)
            else:
                ledger["prep_unaffordable"] += 1
        path = bank[route_rng.randrange(len(bank))]["path"]
        for node in path:
            if outcome_rng.random() < cfg["abandon"]:
                ledger["abandoned"] += 1
                # Leaving the page preserves the active run. Resume this exact node; no reroute or extra chest.
            ledger["nodes"] += 1
            if node["kind"] == "chest":
                receive(node["firstReward"])
                action(6, 18)
            elif node["kind"] in ("duel", "boss"):
                ledger["combats"] += 1
                if cfg["beans"]:
                    if bean_stock:
                        bean_stock -= 1
                        ledger["beans_consumed"] += 1
                    elif crowns >= bean_price:
                        crowns -= bean_price
                        ledger["bean_spent"] += bean_price
                        ledger["beans_consumed"] += 1
                    else:
                        ledger["prep_unaffordable"] += 1
                for clock in clocks:
                    clock.combat()
                probability = cfg["boss_win" if node["kind"] == "boss" else "duel_win"]
                outcome = outcome_rng.random()
                if outcome >= probability:
                    ledger["draws" if outcome < probability + .03 else "losses"] += 1
                    break
                ledger["wins"] += 1
                first = node["levelId"] not in victories
                reward = node["firstReward"] if first else node["repeatReward"]
                victories.add(node["levelId"])
                receive(reward)
                if reward["goldKeys"] and not won_key:
                    won_key = True
                    total = sum(entry["weight"] for entry in data["vault"]["entries"])
                    ticket = vault_rng.randrange(total)
                    for entry in data["vault"]["entries"]:
                        ticket -= entry["weight"]
                        if ticket < 0:
                            receive(entry["loot"])
                            break
                    ledger["vaults"] += 1
                    action(10, 25)
            else:
                # Current modern encounters are deterministic HP/MP trades, no assumed crown reward.
                action(6, 18)
        acquire()
    assert all(count >= keep for count, keep in zip(regular, protected))
    assert min(regular + enchanted) >= 0 and crowns >= 0
    assert ledger["vaults"] <= 1
    schedules = {}
    for label, clock in zip(("fast", "slow"), clocks):
        one_session_days = max(1, math.ceil(clock.active / 900), math.ceil(ledger["combats"] / 10))
        two_session_days = max(1, math.ceil(clock.active / 1800), math.ceil(ledger["combats"] / 20))
        week, slot = divmod(one_session_days - 1, 3)
        schedules[f"calendar_lower_bound_daily15_{label}"] = one_session_days
        schedules[f"calendar_lower_bound_twice_daily15_{label}"] = two_session_days
        schedules[f"calendar_lower_bound_mon_wed_sat15_{label}"] = week * 7 + (0, 2, 5)[slot] + 1
    return {**ledger, **schedules, "complete": not missing(), "missing": len(missing()), "remaining_crowns": crowns,
            "available_beans": bean_stock, "enchanted_preserved": sum(enchanted), "protected_regular": sum(protected),
            "active_seconds_fast": clocks[0].active, "active_seconds_slow": clocks[1].active,
            "continuous_wait_seconds_fast": clocks[0].wait, "continuous_wait_seconds_slow": clocks[1].wait,
            "remaining_regular_duplicates": sum(max(0, count - 1) for count in regular)}


def self_test():
    assert exact_from_missing(1, 1) == {"p50": 1, "p90": 1, "p95": 1}
    assert exact_from_missing(2, 2) == {"p50": 2, "p90": 5, "p95": 6}
    assert exact_from_missing(33, 33) == {"p50": 128, "p90": 188, "p95": 211}
    regular, protected = [5, 2, 1], [2, 1, 1]
    assert spend_surplus(regular, protected, 3)
    assert regular == [2, 2, 1]
    assert not spend_surplus(regular, protected, 2)
    clock = Clock({"capacity": 50, "combatCost": 5, "intervalMs": 720000}, False)
    for _ in range(10):
        clock.combat()
    assert clock.wait == 0
    clock.combat()
    assert clock.wait == 3480 and clock.points == 0
    assert stream(9, "one").random() == stream(9, "one").random()
    assert stream(9, "one").random() != stream(9, "two").random()


def main():
    self_test()
    if "--self-test" in sys.argv:
        print("A89 economic model: exact occupancy, protected copies, Essence and stream checks passed")
        return
    data = json.loads((DOC / "economy-input.json").read_text())
    for entry in data["inputs"]:
        assert hashlib.sha256((ROOT / entry["file"]).read_bytes()).hexdigest() == entry["sha256"], entry["file"]
    ids = [entry["wizardId"] for entry in data["table"]["entries"]]
    assert len(ids) == 33 and len(set(ids)) == 33 and all(entry["weight"] == 1 for entry in data["table"]["entries"])
    assert data["starterId"] not in ids
    assert data["activeRunRestartCheck"]["passed"]
    assert all(path["path"][-1]["kind"] == "boss" for path in data["paths"])
    data["_ids"] = ids
    data["_pool"] = [index for index, identity in enumerate(ids) if next(w for w in data["catalog"] if w["id"] == identity).get("traits", {}).get("house") in ("ravenclaw", "hufflepuff")]
    equipment = json.loads((ROOT / "src/arcana/content/trial-v1.json").read_text())["commerce"]["forge"]["recipes"]
    assert {entry["crowns"] for entry in equipment} == {15, 20, 25}
    scenarios = []
    for owned in (1, 17, 31):
        for context in CONTEXTS:
            baseline = None
            for policy in POLICIES:
                rows = [simulate(data, owned, context, policy, seed) for seed in range(SAMPLES)]
                completed = [row for row in rows if row["complete"]]
                if policy == "A":
                    baseline = rows
                probability = len(completed) / SAMPLES
                means = {key: statistics.fmean(row[key] for row in rows) for key in ("runs", "openings", "combats", "wins", "losses", "draws", "crowns_earned", "acquisition_spent", "forge_spent", "bean_spent", "duplicate_draws", "exchanges", "directed", "themed", "beans_consumed", "vaults", "abandoned", "prep_unaffordable", "enchanted_preserved", "missing")}
                scenarios.append({
                    "owned_identities_at_start": owned, "context": context, "policy": policy,
                    "sample_size": SAMPLES, "completed": len(completed), "censored": SAMPLES - len(completed),
                    "completion_probability_at_horizon": probability,
                    "completion_monte_carlo_standard_error": math.sqrt(probability * (1-probability) / SAMPLES),
                    "completion_costs_unconditional": {key: completion_quantiles(rows, key) for key in ("runs", "openings", "acquisition_spent", "combats", "active_seconds_fast", "active_seconds_slow", "continuous_wait_seconds_fast", "continuous_wait_seconds_slow", "calendar_lower_bound_daily15_fast", "calendar_lower_bound_daily15_slow", "calendar_lower_bound_twice_daily15_fast", "calendar_lower_bound_twice_daily15_slow", "calendar_lower_bound_mon_wed_sat15_fast", "calendar_lower_bound_mon_wed_sat15_slow")},
                    "observed_within_horizon": {key: quantiles([row[key] for row in rows]) for key in ("longest_dry_spell", "remaining_regular_duplicates", "missing", "available_beans")},
                    "means_within_horizon_not_completion_estimates": means,
                    "paired_with_A": {
                        "both_complete": sum(row["complete"] and base["complete"] for row, base in zip(rows, baseline)),
                        "fewer_openings_when_both_complete": sum(row["openings"] < base["openings"] for row, base in zip(rows, baseline) if row["complete"] and base["complete"]),
                        "more_runs_when_both_complete": sum(row["runs"] > base["runs"] for row, base in zip(rows, baseline) if row["complete"] and base["complete"]),
                    },
                    "selected_seed_extremes": {"max_observed_runs": max(row["runs"] for row in rows), "max_observed_openings": max(row["openings"] for row in rows)},
                })
    output = {
        "kind": "A89 reproducible economic-policy sensitivities; not combat simulation, telemetry or human validation",
        "input_sha256": hashlib.sha256((DOC / "economy-input.json").read_bytes()).hexdigest(),
        "model_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        "seeds": {"first": 0, "last": SAMPLES - 1, "derivation": "sha256 a89:seed:label; separate cohort/identity/finish/route/outcome/vault/theme streams"},
        "horizon_runs": HORIZON_RUNS, "contexts_assumed_not_measured": CONTEXTS,
        "outcome_assumptions": "Win probability is unconditional per attempted battle; draw probability .03, remaining mass defeat. Abandon is a per-node interruption/resume hazard, not a reset or an expedition-level percentage. Neither is measured from players. Permanent departure has no completion forecast: active run and inventory remain pending.",
        "monte_carlo_tail_precision": {"samples_per_scenario": SAMPLES, "standard_error_of_cdf_near_95pct": math.sqrt(.95*.05/SAMPLES), "caveat": "CDF sampling uncertainty is not an interval in openings, nor uncertainty about real player outcomes"},
        "policy_definitions": {"A": "Current uniform frog, no exchange", "B3/B5/B8": "Hypothetical manual exact-ratio surplus exchange; last regular/equipped-reserve copies and all enchanted excluded; any card identity family, no rarity bound, optimistic supply scenario", "C60/C100/C150": "Hypothetical explicit known-identity purchase; save for at most three missing goals in the last three; prices are sensitivity inputs, not chosen rules", "D10/D15": "Hypothetical eight-identity Ravenclaw+Hufflepuff pool; choose only if immediate new-identity chance per crown exceeds general frog; other identities stay general"},
        "cohorts": {"1": "Starter only, no prior first victories, crowns50/Essence50", "17": "Random16 draw identities+starter, two extra protected regular copies; first victories/vault already exhausted; crowns50/Essence50 not historical earnings", "31": "Random30 draw identities+starter, same protection/rights assumptions; crowns50/Essence50"},
        "exact_baseline_openings_only": [{"owned_identities": owned, "quantiles": exact_from_missing(33, 34-owned), "mean": sum(33/i for i in range(1, 35-owned))} for owned in (1, 17, 31)],
        "time_assumptions_seconds_not_human_measurements": {"run_preparation": [12, 35], "noncombat_node": [6, 18], "battle": [12, 35], "frog": [5, 12], "forge": [8, 20], "directed_or_exchange": [6, 15], "vault": [10, 25], "calendar": "LOWER BOUNDS only: one daily15min session, two daily15min sessions12h apart, or Mon/Wed/Sat15min sessions starting Monday. Max10 battles per session from capacity50, no carry credit beyond cap. Uses max(active-budget sessions, energy-budget sessions), not simulated scheduling/observed retention. Actual days can be higher."},
        "checks": "Known occupancy n1/n2/current33, probability mass, exact last-copy/reserve protection, Essence first10/11thcombat, deterministic independent streams, current content hashes, uniform tickets, recipe prices, one vault maximum, balances nonnegative",
        "limits": ["No application rules changed", "Outcomes are assumed, not derived from character condition or equipment effects", "No battle log generated; no proof of viable strategy or fun", "64 real generated paths per cohort/policy; planned route itself does not adjust for later collection growth", "Modern encounters treated as no-economic-effect HP/MP trades or pass", "No incremental power/XP/repair, no new unique keys", "C/D prices and exchange family limits await product decisions", "Quantiles with insufficient completion coverage are null; no completer-only P95", "1000 seeds per scenario; tail percentile estimates have finite Monte Carlo uncertainty", "Time ranges are assumed and omit offline interruption/account flow; no universal hours/calendar promise", "Chest-priority still reaches a closure or defeat and spends combat Essence; active-run restart is rejected by the real use case", "Permanent abandonment is not assigned a fabricated human rate; no collection completion is forecast for someone who never resumes"],
        "scenarios": scenarios,
    }
    print(json.dumps(output, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
