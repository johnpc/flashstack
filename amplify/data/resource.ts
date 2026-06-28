import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * Flashstack data schema.
 *
 * Grows one vertical slice at a time (stoop's workflow). Read models grant BOTH
 * guest (signed-out browsing) AND authenticated (identityPool + userPool)
 * identities — guest-only would return empty results once a user signs in (see
 * stoop ADR 0004). Writes are locked to the 'editors' Cognito group; the seed
 * runs as an editor and the deck-gen pipeline writes via its Lambda IAM roles
 * straight to DynamoDB (bypassing AppSync). Per-user models use owner authz.
 *
 * Slice 1 (Discover shelves): Category.
 * Slice 2 (Discover decks): Deck + Card — published decks listed under shelves.
 */
const schema = a.schema({
  // Discover shelves — the source of truth for which category slugs surface as
  // browsable rows on the Discover tab, their labels, and their order. Decks
  // carry a denormalized `categorySlug` matching one of these.
  Category: a
    .model({
      name: a.string().required(),
      slug: a.string().required(),
      label: a.string(),
      sortOrder: a.integer().default(0),
    })
    // Look up a category by its stable slug (matches the deck categorySlug).
    .secondaryIndexes((index) => [index('slug')])
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated('identityPool').to(['read']),
      allow.authenticated().to(['read']), // userPool: signed-in (incl. editors) can read
      allow.group('editors').to(['create', 'update', 'delete']),
    ]),

  // A flashcard deck. PUBLISHED decks surface in Discover under their category
  // shelf; DRAFT decks are in-progress admin generations (later slice). Card
  // fields the Discover grid needs (title, count, cover) are on the deck so the
  // shelf read is a single by-category GSI query with no per-deck card fetch.
  Deck: a
    .model({
      topic: a.string().required(), // the deck's display title, e.g. "Top 100 Spanish Phrases"
      categorySlug: a.string().required(),
      description: a.string(),
      voiceLanguage: a.string(), // BCP-47, drives Polly audio (later slice), e.g. "es-ES"
      status: a.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
      cardCount: a.integer().default(0),
      coverImagePath: a.string(), // S3 key under media/decks/, resolved via getUrl()
      publishedAt: a.datetime(),
      cards: a.hasMany('Card', 'deckId'),
    })
    // Discover read path: all decks in a category, newest first (sort client-side
    // on the bounded page). Querying the GSI beats a filtered list (full Scan).
    .secondaryIndexes((index) => [index('categorySlug')])
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated('identityPool').to(['read']),
      allow.authenticated().to(['read']),
      allow.group('editors').to(['create', 'update', 'delete']),
    ]),

  // One card in a deck. `ord` is its position; media paths are S3 keys resolved
  // via getUrl(). The study read path queries cards by deckId in `ord` order.
  Card: a
    .model({
      deckId: a.id().required(),
      deck: a.belongsTo('Deck', 'deckId'),
      ord: a.integer().required(),
      front: a.string().required(),
      back: a.string().required(),
      hint: a.string(),
      example: a.string(),
      imagePath: a.string(), // S3 key under media/decks/
      audioPath: a.string(), // S3 key under media/decks/
    })
    // Read all cards for a deck, ordered — the deck-detail + study read path.
    .secondaryIndexes((index) => [index('deckId').sortKeys(['ord'])])
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated('identityPool').to(['read']),
      allow.authenticated().to(['read']),
      allow.group('editors').to(['create', 'update', 'delete']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});
