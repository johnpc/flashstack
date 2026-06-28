import { describe, it, expect } from 'vitest';
import { cardImageKey, cardAudioKey, imagePrompt } from './mediaKeys';

describe('mediaKeys', () => {
  it('builds image + audio keys under the deck media prefix', () => {
    expect(cardImageKey('d1', 'c1')).toBe('media/decks/d1/c1.png');
    expect(cardAudioKey('d1', 'c1')).toBe('media/decks/d1/c1.mp3');
  });

  it('builds an image prompt with the front, topic, and a no-text constraint', () => {
    const p = imagePrompt('Hola', 'Spanish Phrases');
    expect(p).toContain('Hola');
    expect(p).toContain('Spanish Phrases');
    expect(p).toMatch(/no text/i);
  });
});
