"""Exact bounded acquisition scenarios; no game state, network or economy edits.

Run: python3 docs/arcana/product-roadmap-2026-10-19/commerce_analysis.py
Outputs JSON. Pool of eight is hypothetical, not a configured shop product.
"""
from pathlib import Path
import hashlib
import json
import math
from collection_analysis import occupancy, quantiles


def geometric(p):
    return {label: math.ceil(math.log1p(-target) / math.log1p(-p))
            for label, target in (("p50", .5), ("p90", .9), ("p95", .95))}


def main():
    root = Path(__file__).resolve().parents[3]
    paths = [root / p for p in (
        "src/arcana/content/trial-v1.json", "src/arcana/content/creatures-v1.json",
        "src/arcana/infrastructure/content/trial-configuration.ts",
        "src/arcana/content/equipment-v2.json")]
    base, creatures = [json.loads(p.read_text()) for p in paths[:2]]
    tickets = base["toadTable"]["entries"] + [
        {"wizardId": w["id"], "weight": 1} for w in creatures["wizards"]]
    n = len(tickets)
    assert n == 33 and len({e["wizardId"] for e in tickets}) == n
    assert all(e["weight"] == 1 for e in tickets)
    bean_entries = base["campaign"]["combatRules"]["beans"]["entries"]
    assert len(bean_entries) == 4 and all(e["weight"] == 1 for e in bean_entries)
    assert occupancy(1, 1) == [0., 1.]
    assert math.isclose(occupancy(2, 3)[2], .75)
    assert geometric(.5) == {"p50": 1, "p90": 4, "p95": 5}
    assert math.isclose(sum(4 / i for i in range(1, 5)), 25 / 3)
    assert math.isclose(sum(occupancy(4, 16)), 1)
    result = {
        "kind": "exact mathematical scenarios, not measured player behaviour",
        "inputs": [{"file": str(p.relative_to(root)),
                    "sha256": hashlib.sha256(p.read_bytes()).hexdigest()} for p in paths],
        "marginal_new_identity": [
            {"owned_random_identities": k, "missing": n-k,
             "next_opening_new_probability": (n-k)/n,
             "mean_openings_to_next_new": n/(n-k)} for k in (0, 16, 25, 30, 32)],
        "one_selected_missing_identity": [
            {"uniform_pool_size": size, "status": "current" if size == n else "hypothetical",
             "probability": 1/size, "mean_openings": size,
             "openings": geometric(1/size),
             "probability_still_missing_after_50_openings": (1-1/size)**50}
            for size in (n, 8)],
        "catalogue_dilution": [
            {"random_identities": size, "status": "current" if size == n else "hypothetical +12",
             "mean_openings_to_all": sum(size/i for i in range(1, size+1)),
             "openings": quantiles(size, size)} for size in (n, n+12)],
        "four_uniform_flavours": {
            "unit": "independent committed activations, not purchases, wins or battles",
            "mean_activations_to_all": sum(4/i for i in range(1, 5)),
            "activations": quantiles(4, 4),
            "probability_of_adverse_flavour_per_activation": .5,
            "caveat": "Two adverse flavours by rules, not a 50% defeat probability"},
        "vault": {
            "current_entries": len(base["commerce"]["vault"]["entries"]),
            "assumption": "one campaign first-boss key, no other key grant in reviewed current content",
            "probability_own_both_exclusive_vault_gear_from_that_one_key": 0,
            "caveat": "A choice of one bundle still does not make both obtainable"},
        "checks": "known n=1/n=2 occupancy, geometric p=.5, flavour expectation, mass; input assertions",
        "limits": ["No new product configured", "No changed weights, prices or rewards",
                   "No conversion to hours, crowns, runs or calendar",
                   "No income, route, defeat or resource-spending policy",
                   "Themed pool overlaps/eligibility and directed acquisition not implemented",
                   "No human play or retention evidence"]}
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
