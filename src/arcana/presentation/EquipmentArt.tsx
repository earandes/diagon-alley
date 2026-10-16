import type { EquipmentBlueprint } from '../domain/economy/commerce';
import type { Equipment } from '../domain/economy/equipment';
import type { Language } from '../domain/collection/wizards';
import { Artwork } from './Artwork';
export function EquipmentArt({
  item,
  language,
}: {
  item: Equipment | EquipmentBlueprint;
  language: Language;
}) {
  return (
    <div className="equipment-art" aria-hidden="true">
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
