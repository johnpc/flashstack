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
 * Slice 1 (Discover shelves): Category only.
 */
const schema = a.schema({
  // Discover shelves — the source of truth for which category slugs surface as
  // browsable rows on the Discover tab, their labels, and their order. Decks
  // carry a denormalized `categorySlug` matching one of these (added next slice).
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
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});
