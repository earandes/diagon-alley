import data from '../../content/equipment-v2.json';
import { forgeCatalogSnapshot, type ForgeCatalog } from '../../domain/economy/commerce';
/** Recipes are new purchases only. Existing inventory and vault blueprints are never reinterpreted. */
export function specializedForge(previous: ForgeCatalog): ForgeCatalog {
  return forgeCatalogSnapshot({
    version: data.version,
    recipes: previous.recipes.map((recipe) => ({ ...recipe, ...data.cores[recipe.core] })),
  });
}
