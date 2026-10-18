import { bondText } from './bond-messages';
import { HOUSES } from '../domain/collection/traits';
import type { ClassificationFilter } from '../domain/collection/classification';
import type { Language } from '../domain/collection/wizards';
import { HouseInsignia, houseName } from './HouseInsignia';
import { BondEmblem, bondName } from './BondEmblem';
import { Artwork } from './Artwork';
export function ClassificationChoices({
  value,
  onChange,
  language,
  includeHouses = true,
}: {
  value: ClassificationFilter;
  onChange: (value: ClassificationFilter) => void;
  language: Language;
  includeHouses?: boolean;
}) {
  const groups: readonly ClassificationFilter[] = [
    'all',
    ...(includeHouses ? HOUSES : []),
    'order',
    'death',
    'army',
    'creatures',
  ];
  return (
    <div
      className="classification-choices"
      role="group"
      aria-label={bondText(language, 'classification')}
    >
      {groups.map((id) => {
        const house = HOUSES.find((h) => h === id);
        return (
          <button type="button" key={id} aria-pressed={id === value} onClick={() => onChange(id)}>
            {house ? (
              <HouseInsignia house={house} />
            ) : id === 'all' || id === 'army' ? (
              <Artwork asset="ui.collection" language={language} decorative />
            ) : (
              <BondEmblem group={id as 'order' | 'death' | 'creatures'} language={language} />
            )}
            <span>
              {house
                ? houseName(house, language)
                : id === 'all'
                  ? bondText(language, 'all')
                  : bondName(id as 'order' | 'death' | 'army' | 'creatures', language)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
