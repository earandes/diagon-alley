import catalog from './catalog.json';
import table from './welcome-table.json';
import { validateConfiguration } from '../domain/validation';
export const configuration = validateConfiguration({ catalog, table, assetVersion: 1 });
