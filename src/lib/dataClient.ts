/**
 * Shared Amplify Data client (typed against the backend Schema).
 *
 * Auth mode is chosen per call by readAuthMode(): signed-in users read via
 * 'userPool' (group claims ride in the JWT — immune to identity-pool role
 * remapping for Cognito group members), while anonymous visitors read via
 * 'identityPool' (the guest role). Mirrors stoop ADR 0004 — a client/schema
 * provider mismatch returns empty results, not an error.
 */
import { generateClient } from 'aws-amplify/data';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import type { Schema } from '../../amplify/data/resource';

export const dataClient = generateClient<Schema>({ authMode: 'identityPool' });

/**
 * 'userPool' when a Cognito session exists, else 'identityPool' (guest). Reads
 * the user-pool tokens directly, not fetchAuthSession: that also fetches
 * identity-pool credentials and throws on any transient failure there, which
 * silently downgraded a signed-in user to guest reads (empty owner data).
 */
export async function readAuthMode(): Promise<'userPool' | 'identityPool'> {
  try {
    const tokens = await cognitoUserPoolsTokenProvider.getTokens();
    return tokens?.accessToken ? 'userPool' : 'identityPool';
  } catch {
    return 'identityPool';
  }
}

export type CategoryRecord = Schema['Category']['type'];
export type DeckRecord = Schema['Deck']['type'];
export type CardRecord = Schema['Card']['type'];
export type UserDeckRecord = Schema['UserDeck']['type'];
export type UserCardReviewRecord = Schema['UserCardReview']['type'];
export type GenerationRunRecord = Schema['GenerationRun']['type'];
export type UserStatRecord = Schema['UserStat']['type'];
