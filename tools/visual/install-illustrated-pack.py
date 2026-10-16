"""Install the inspected A58 illustration family without changing game authority."""
from pathlib import Path
import hashlib
import json
import shutil
import sys

ROOT = Path(__file__).resolve().parents[2]
PRODUCTION = ROOT / "design/diagon-alley/illustrated-v2"
PACK = ROOT / "src/arcana/presentation/content-packs/diagon-alley"
EVIDENCE = ROOT / "docs/arcana/illustrated-assets-2026-10-15"


def read(path):
    return json.loads(path.read_text())


def save(path, value):
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")
    temporary.replace(path)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    index = read(PRODUCTION / "exports-index.json")
    ids = set(read(PACK / "characters.json"))
    expected = {f"character.{id}.{role}" for id in ids for role in ("figure", "portrait", "thumbnail")}
    if set(index) != expected:
        raise ValueError(f"Incomplete family: {len(index)}/{len(expected)} roles; nothing installed")
    exports = (PRODUCTION / "exports").resolve()
    staged = []
    for key, item in index.items():
        source = (ROOT / item["productionFile"]).resolve()
        if not source.is_relative_to(exports) or not source.is_file():
            raise ValueError(f"Invalid production file: {key}")
        if item["width"] <= 0 or item["height"] <= 0 or set(item["alt"]) != {"es", "en"}:
            raise ValueError(f"Invalid export metadata: {key}")
        _, id, role = key.split(".")
        entry = {field: item[field] for field in ("width", "height", "alpha", "pivot", "alt")}
        entry["path"] = f"art/character-illustrated-v2/{id}/{role}.webp"
        staged.append((key, source, entry))
    if "--check" in sys.argv:
        print(f"Illustrated family ready: {len(ids)} characters, {len(staged)} roles; no files changed")
        return

    EVIDENCE.mkdir(parents=True, exist_ok=True)
    backup = EVIDENCE / "assets-before-install.json"
    if not backup.exists():
        shutil.copy2(PACK / "assets.json", backup)
    assets = read(PACK / "assets.json")
    manifest = []
    for key, source, entry in staged:
        target = PACK / entry["path"]
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)
        assets[key] = entry
        manifest.append({"id": key, **entry, "source": str(source.relative_to(ROOT)), "sha256": digest(target), "bytes": target.stat().st_size})
    # Generic visual aliases must resolve to the same illustrated HP family too.
    aliases = {"arcanist-1": "echo-mage", "arcanist-2": "paracelso", "arcanist-3": "obsidian-seer", "boss": "veil-walker"}
    for alias, character in aliases.items():
        assets[f"rival.{alias}.figure"] = dict(assets[f"character.{character}.figure"])
    save(PACK / "assets.json", assets)
    metadata = read(PACK / "pack.json")
    metadata["version"] = 2
    save(PACK / "pack.json", metadata)
    messages = read(PACK / "messages.json")
    messages["gameArtworkStatus"] = {"es": "Ilustración de producción local · balance en evaluación", "en": "Locally produced illustrations · balance under evaluation"}
    save(PACK / "messages.json", messages)
    save(PRODUCTION / "runtime-manifest.json", {"assets": manifest, "aliases": aliases, "characters": len(ids), "runtimeBytes": sum(item["bytes"] for item in manifest), "authorityChanges": False})
    print(f"Installed {len(staged)} illustrated roles and {len(aliases)} visual aliases. Game IDs and authority untouched.")


if __name__ == "__main__":
    main()
