"""A65 diagnostic stock-flow projection. No application state or economy changes."""
import json
from pathlib import Path
from game_design_skills_suite.prob_and_economy_sim import simulate_economy

root = Path(__file__).resolve().parents[2]
model = json.loads((root / "docs/arcana/tactical-increment-2026-10-16/evidence/tactical-model.json").read_text())
comparison = next(c for c in model["comparisons"] if c["options"] == {"beans": False, "repeated": True})
rows = []
for content in ["legacy", "current"]:
    for row in comparison[content]:
        if row["collection"] != "starter" or row["condition"] != 1:
            continue
        source = row["earnedCrowns"]["mean"]
        for basket in [0, 10, 15]:
            history = simulate_economy(initial=50, source_base=source, growth=0, sink_base=basket, rounds=90)
            rows.append({"content": content, "policy": row["policy"], "fixed_income_per_attempt_assumed": source,
                         "desired_spend_per_attempt": basket, "attempts": 90, "wallet_clamped": history[-1]["end"],
                         "unfunded_basket": max(0, 90 * basket - (50 + 90 * source))})
print(json.dumps({"scope": "Diagnostic sensitivity using Game Design Skills Suite stock-flow helper, not a human forecast",
                  "scenarios": rows,
                  "limits": ["Income held at the path-uniform repeat scenario mean including losses, not a measured player average.",
                             "90 attempts have no duration or calendar assumption. No one-run/day or energy/time forecast.",
                             "Assumes same starting kit and no carried bean stock; collections, forging and vault are excluded.",
                             "Desired baskets are sensitivities, not automatically executed purchases. No prices, rewards or saves altered."]},
                 ensure_ascii=False, indent=2))
