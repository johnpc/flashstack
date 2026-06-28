/**
 * Thin isolation wrappers over Bedrock — the only impure AI units. Mocked in
 * handler tests; all logic (prompt/parse) lives in the pure modules.
 *
 * Claude Opus 4.8 for card text (our "Claude for all AI" default); Stability
 * stable-image-core for card illustrations (active low-cost text-to-image).
 */
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

export const TEXT_MODEL_ID = 'us.anthropic.claude-opus-4-8';
export const IMAGE_MODEL_ID = 'stability.stable-image-core-v1:1';

const client = new BedrockRuntimeClient({});

/** Invoke Claude with a prepared Anthropic body; return decoded JSON. */
export async function invokeText(body: string): Promise<unknown> {
  const res = await client.send(
    new InvokeModelCommand({
      modelId: TEXT_MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body,
    }),
  );
  return JSON.parse(new TextDecoder().decode(res.body));
}

/** Generate a square PNG illustration from a prompt; return raw image bytes. */
export async function generateImage(prompt: string): Promise<Uint8Array> {
  const res = await client.send(
    new InvokeModelCommand({
      modelId: IMAGE_MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({ prompt, aspect_ratio: '1:1', output_format: 'png' }),
    }),
  );
  const body = JSON.parse(new TextDecoder().decode(res.body)) as {
    images?: string[];
    finish_reasons?: (string | null)[];
  };
  const reason = body.finish_reasons?.[0];
  if (reason) throw new Error(`image generation did not complete: ${reason}`);
  const b64 = body.images?.[0];
  if (!b64) throw new Error('Stability response missing image');
  return Buffer.from(b64, 'base64');
}
