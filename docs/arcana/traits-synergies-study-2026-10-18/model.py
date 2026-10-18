"""Read-only exact combinatorial study; no game simulation or application changes.
Run from repository root: python3 docs/arcana/traits-synergies-study-2026-10-18/model.py
"""
import hashlib
import itertools
import json
import math
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
SOURCE = ROOT / 'src/arcana/content/trial-v1.json'
PACK = ROOT / 'src/arcana/presentation/content-packs/diagon-alley/characters.json'
content = json.loads(SOURCE.read_text())
names = json.loads(PACK.read_text())
# Proposal metadata, not an assertion that these are implemented combat traits.
groups = {
    'Gryffindor': 'apprentice merlin morgana circe ember-keeper rune-weaver copper-sage ash-wanderer shadow-scribe dew-alchemist night-forger moss-guardian cinder-dancer wind-reader'.split(),
    'Ravenclaw': 'mist-seer dawn-oracle crystal-watch comet-scholar'.split(),
    'Hufflepuff': 'moon-herbalist storm-caller star-binder aurora-sage'.split(),
    'Slytherin': 'paracelso obsidian-seer echo-mage veil-walker'.split(),
    'Beauxbatons': 'flamel sun-priestess'.split(),
    'Sin casa verificada en este estudio': 'root-speaker silver-sentinel'.split(),
}
teachers = set('merlin morgana paracelso moon-herbalist ash-wanderer dawn-oracle crystal-watch night-forger'.split())
aurors = set('storm-caller root-speaker silver-sentinel'.split())
house = {identifier: group for group, identifiers in groups.items() for identifier in identifiers}
catalog = content['catalog']['wizards']
assert len(house) == len(catalog) == 30
assert set(house) == {w['id'] for w in catalog}
entries = content['toadTable']['entries']
assert len(entries) == 29 and all(e['weight'] == 1 for e in entries)
assert 'apprentice' not in {e['wizardId'] for e in entries}
rows = [{
    'id': w['id'], 'name': names[w['id']]['name']['es'],
    'current_affinity': content['affinities'][w['id']], 'rarity': w['rarity'],
    'proposed_house_metadata': house[w['id']],
    'proposed_teacher_metadata': w['id'] in teachers,
    'proposed_auror_metadata': w['id'] in aurors,
} for w in catalog]

def discovery_quantiles(eligible, required):
    # Uniform 29-card table, repeats retained; only distinct target identities matter.
    distribution = [1.] + [0.] * required
    quantiles = {}
    for opening in range(1, 10001):
        next_distribution = [0.] * (required + 1)
        for found, probability in enumerate(distribution):
            if found == required:
                next_distribution[found] += probability
            else:
                discover = (eligible - found) / 29
                next_distribution[found] += probability * (1 - discover)
                next_distribution[found + 1] += probability * discover
        distribution = next_distribution
        for q in (.5, .9, .95):
            if str(q) not in quantiles and distribution[required] >= q:
                quantiles[str(q)] = opening
        if len(quantiles) == 3:
            return quantiles
    raise AssertionError('Quantiles not reached')

# Known simple case: one target out of 29 is geometric.
assert discovery_quantiles(1, 1)['0.5'] == math.ceil(math.log(.5) / math.log(28 / 29))
family_access = {}
for group in ('Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'):
    eligible = len(groups[group]) - int(group == 'Gryffindor')
    required = 3 - int(group == 'Gryffindor')
    family_access[group] = discovery_quantiles(eligible, required)

compositions = 0
house_active = 0
teacher_active = 0
both_active = 0
for team in itertools.combinations(house, 5):
    compositions += 1
    h = any(sum(house[identifier] == group for identifier in team) >= 3
            for group in ('Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'))
    t = sum(identifier in teachers for identifier in team) >= 3
    house_active += int(h)
    teacher_active += int(t)
    both_active += int(h and t)
assert compositions == math.comb(30, 5)

variants = []
for p in (.001, .005, .01):
    variants.append({
        'hypothetical_probability_per_opening': p,
        'first_variant_openings_median': math.ceil(math.log(.5) / math.log(1-p)),
        'first_variant_openings_p90': math.ceil(math.log(.1) / math.log(1-p)),
        'first_variant_openings_p95': math.ceil(math.log(.05) / math.log(1-p)),
        'probability_none_after_100': (1-p)**100,
        'specific_identity_variant_probability': p/29,
        'mean_openings_all_29_variants_if_independent_uniform': 29*sum(1/k for k in range(1,30))/p,
    })
result = {
    'scope': 'Exact hypothetical combinatorics, not combat balance, human behaviour or duration',
    'content_sha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    'pack_sha256': hashlib.sha256(PACK.read_bytes()).hexdigest(),
    'catalog': rows,
    'group_counts': {k: len(v) for k,v in groups.items()},
    'teachers': len(teachers), 'aurors': len(aurors),
    'three_distinct_members_openings_quantiles_starter_included': family_access,
    'all_unique_identity_five_member_teams': compositions,
    'teams_house_active': house_active, 'teams_teachers_active': teacher_active,
    'teams_house_and_teachers_active': both_active,
    'hypothetical_variant_scenarios': variants,
}
(HERE / 'model-results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
lines = ['# Catálogo contrastado y clasificación propuesta', '',
         '18 octubre 2026. Metadatos de propuesta, no tipos implementados. Casas contrastadas con las fuentes del informe. «Sin casa verificada» describe el alcance de investigación, no prueba de inexistencia.', '',
         '| ID estable | Personaje | Afinidad actual | Casa / escuela propuesta | Otros metadatos propuestos |',
         '|---|---|---|---|---|']
for row in rows:
    tags = []
    if row['proposed_teacher_metadata']: tags.append('Profesor/a')
    if row['proposed_auror_metadata']: tags.append('Auror')
    lines.append(f"| {row['id']} | {row['name']} | {row['current_affinity']} | {row['proposed_house_metadata']} | {' · '.join(tags) or '—'} |")
lines.extend(['', 'No se etiqueta al auténtico Moody como el docente que vemos actuar bajo su apariencia: era Barty Crouch Jr. Neville se toma en su representación estudiantil, no se le suma su futura profesión. Snape no se reduce a «malo». Flamel y Fleur no reciben una casa de Hogwarts inventada.', '',
              'Estas etiquetas no son exhaustivas biografías. Hagrid no se convierte en animal ni Hermione en muggle por su ascendencia. Naturaleza, oficio, casa y afiliaciones históricas necesitan ejes separados.'])
(HERE / 'CATALOG.md').write_text('\n'.join(lines) + '\n')
print(json.dumps({k: v for k,v in result.items() if k != 'catalog'}, ensure_ascii=False, indent=2))
