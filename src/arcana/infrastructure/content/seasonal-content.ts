import definition from '../../content/halloween-2026.json';
import { seasonalEditionSnapshot } from '../../domain/seasonal/events';
/** Trial calendar: 16 Oct 00:00+02, admission ends 2 Nov 00:00+01, grace ends 3 Nov 00:00+01. */
export const seasonalEdition = seasonalEditionSnapshot(definition);
