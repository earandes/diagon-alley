import { DemoStore, openingRequest, tokenOf } from '../../src/infrastructure/demo-store';
import { configuration } from '../../src/content/configuration';
import { parseExport } from '../../src/domain/validation';
declare global {
  interface Window {
    fixture: typeof fixture;
  }
}
const fixture = { DemoStore, openingRequest, tokenOf, configuration, parseExport };
window.fixture = fixture;
