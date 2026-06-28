import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

/**
 * Flashstack backend composition. Grows per slice — the AI deck-generation
 * pipeline (Step Functions + Bedrock + Polly Lambdas and their IAM grants) is
 * wired here in a later slice, mirroring stoop's ingestion wiring.
 *
 * @see https://docs.amplify.aws/react/build-a-backend/
 */
defineBackend({
  auth,
  data,
  storage,
});
