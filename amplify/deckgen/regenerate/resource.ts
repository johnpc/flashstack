/**
 * The regenerateCardMedia Lambda (custom-mutation resolver) — regenerates one
 * card's image or audio synchronously (a single Bedrock/Polly call, under the
 * resolver timeout). backend.ts grants Bedrock + Polly + S3 + Card read/write.
 */
import { defineFunction } from '@aws-amplify/backend';

export const regenerateMedia = defineFunction({
  name: 'deckgen-regenerate',
  entry: './handler.ts',
  timeoutSeconds: 60,
  memoryMB: 512,
  // Custom-mutation resolver → data stack (avoids the circular dependency).
  resourceGroupName: 'data',
});
