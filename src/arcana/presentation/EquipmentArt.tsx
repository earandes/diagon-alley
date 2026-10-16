import type { EquipmentBlueprint } from '../domain/economy/commerce';
import type { Equipment } from '../domain/economy/equipment';
import type { Language } from '../domain/collection/wizards';
import { Artwork } from './Artwork';
import { useSelectionMotion } from './useSelectionMotion';
import { useReducedMotion } from './useReducedMotion';
export function EquipmentArt({
  item,
  language,
  selectionMotion = true,
}: {
  item: Equipment | EquipmentBlueprint;
  language: Language;
  selectionMotion?: boolean;
}) {
  const { reduced } = useReducedMotion();
  const motion = useSelectionMotion(JSON.stringify(item), reduced || !selectionMotion, 160);
  return (
    <div className="equipment-art" aria-hidden="true" ref={motion}>
      <Artwork
        asset={item.kind === 'wand' ? `product.wand-${item.wood}` : `product.broom-${item.model}`}
        language={language}
        decorative
      />
      {item.kind === 'wand' && item.core && (
        <Artwork
          asset={`product.core-${item.core}`}
          language={language}
          className="core-art"
          decorative
        />
      )}
    </div>
  );
}
