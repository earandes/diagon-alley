"""Modelo exacto de ocupacion del catalogo A87, no de jugadores o economia.

python3 docs/arcana/product-roadmap-2026-10-19/collection_analysis.py
Solo lee contenido del proyecto; escribe JSON en stdout. Sin red/dependencias.
"""

from pathlib import Path
import hashlib
import json
import math


def occupancy(n: int, steps: int) -> list[float]:
    p = [1.0] + [0.0] * n
    for _ in range(steps):
        q = [0.0] * (n + 1)
        for k, value in enumerate(p):
            q[k] += value * k / n
            if k < n:
                q[k + 1] += value * (n - k) / n
        p = q
    return p


def quantiles(n: int, required: int) -> dict:
    p = [1.0] + [0.0] * n
    found = {}
    for step in range(10_001):
        cdf = math.fsum(p[required:])
        for name, target in (("p50", 0.5), ("p90", 0.9), ("p95", 0.95)):
            if name not in found and cdf >= target:
                found[name] = step
        if len(found) == 3:
            return found
        q = [0.0] * (n + 1)
        for k, value in enumerate(p):
            q[k] += value * k / n
            if k < n:
                q[k + 1] += value * (n - k) / n
        p = q
        assert math.isclose(math.fsum(p), 1, abs_tol=1e-10)
    raise ValueError("Quantiles exceed declared computation bound")


def main() -> None:
    # Independently known simple cases; not application tests or player evidence.
    assert occupancy(1, 1) == [0.0, 1.0]
    assert math.isclose(occupancy(2, 2)[2], 0.5)
    assert math.isclose(occupancy(2, 3)[2], 0.75)
    assert math.isclose(occupancy(2, 10)[2], 1 - 2 * 0.5**10)
    assert math.isclose(math.fsum(3 / i for i in range(1, 4)), 5.5)
    root = Path(__file__).resolve().parents[3]
    base_file = root / "src/arcana/content/trial-v1.json"
    creatures_file = root / "src/arcana/content/creatures-v1.json"
    assembler_file = root / "src/arcana/infrastructure/content/trial-configuration.ts"
    base = json.loads(base_file.read_text())
    creatures = json.loads(creatures_file.read_text())
    # Mirrors the declared A87 ticket composition, not future arbitrary tables.
    entries = base["toadTable"]["entries"] + [
        {"wizardId": w["id"], "weight": 1} for w in creatures["wizards"]
    ]
    ids = [e["wizardId"] for e in entries]
    catalog_ids = {w["id"] for w in base["catalog"]["wizards"] + creatures["wizards"]}
    if len(ids) != len(set(ids)) or any(e["weight"] != 1 for e in entries):
        raise ValueError("This occupancy model requires distinct uniform tickets")
    initial = catalog_ids - set(ids)
    if len(initial) != 1 or not set(ids) <= catalog_ids:
        raise ValueError("Expected one guaranteed identity outside the draw")
    n, total = len(ids), len(catalog_ids)
    expectation = math.fsum(n / i for i in range(1, n + 1))
    results = []
    for share in (0.5, 0.75, 0.9, 1.0):
        target = math.ceil(total * share)
        results.append({
            "target_share": share,
            "total_distinct_target": target,
            "random_distinct_required": target - len(initial),
            "openings": quantiles(n, target - len(initial)),
        })
    print(json.dumps({
        "kind": "exact mathematical model, not measured human play",
        "profile_assumption": "A87/current assembler: base tickets plus four creature tickets",
        "inputs": [{"file": str(f.relative_to(root)), "sha256": hashlib.sha256(f.read_bytes()).hexdigest()}
                   for f in (base_file, creatures_file, assembler_file)],
        "guaranteed_identity_ids": sorted(initial),
        "total_identities": total,
        "uniform_tickets": n,
        "probability_per_ticket_identity": 1 / n,
        "completion_milestones": results,
        "mean_openings_to_all": expectation,
        "mean_duplicates_at_completion": expectation - n,
        "first_any_enchanted_assuming_independent_one_percent": {
            name: math.ceil(math.log(1 - target) / math.log(0.99))
            for name, target in (("p50", 0.5), ("p90", 0.9), ("p95", 0.95))
        },
        "checks": "five known mathematical cases and probability mass conservation",
        "limits": ["No hours or calendar forecast", "No income, costs or route policy model",
                   "No duplicate exchange or pity", "No user testing", "No production services accessed"],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
