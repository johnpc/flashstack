/**
 * The deck-gen worker Lambda — async-invoked by the starter. Does the long job:
 * Claude generates the cards, then per card an image (Bedrock) + audio (Polly)
 * are produced to S3 and the Card row is written; finally the Deck/GenerationRun
 * are flipped to DRAFT_READY. Long timeout + modest memory (holds media bytes).
 * backend.ts grants Bedrock + Polly + S3 + table writes.
 */
import { defineFunction } from '@aws-amplify/backend';

export const deckgenWorker = defineFunction({
  name: 'deckgen-worker',
  entry: './handler.ts',
  timeoutSeconds: 900, // up to 15 min: a large deck × (image + audio) per card
  memoryMB: 1024,
  // Co-locate with the starter (data stack) so the starter→worker invoke grant
  // and the worker's table writes don't span stacks (circular-dependency fix).
  resourceGroupName: 'data',
});
