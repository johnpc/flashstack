/** Clears all models and seeds the Category reference data (Discover shelves). */
import { client, EDITOR_WRITE, clearOneModel } from './seedClient';
import { seedCategories } from './fixtures/categories';

/** Wipe every model. Cards reference Decks, so clear Cards first. */
export async function clearAll(): Promise<void> {
  await clearOneModel(client.models.Card);
  await clearOneModel(client.models.Deck);
  await clearOneModel(client.models.Category);
}

/** Seed the Discover shelf categories. Returns the count created. */
export async function seedReferenceData(): Promise<number> {
  let created = 0;
  for (const category of seedCategories) {
    const { errors } = await client.models.Category.create(
      {
        name: category.name,
        slug: category.slug,
        label: category.label,
        sortOrder: category.sortOrder,
      },
      EDITOR_WRITE,
    );
    if (errors) throw new Error(`Category ${category.name}: ${JSON.stringify(errors)}`);
    created += 1;
  }
  console.log(`Seeded ${created} categories.`);
  return created;
}
