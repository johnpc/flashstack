/**
 * Pure helpers for card media S3 keys + the image prompt. Card media lives
 * under media/decks/<deckId>/ (the prefix the storage policy grants), keyed by
 * card id so each card owns one stable image and one audio object.
 */
export function cardImageKey(deckId: string, cardId: string): string {
  return `media/decks/${deckId}/${cardId}.png`;
}

export function cardAudioKey(deckId: string, cardId: string): string {
  return `media/decks/${deckId}/${cardId}.mp3`;
}

/** Text-to-image prompt for a card's illustration (front + topic context). */
export function imagePrompt(front: string, topic: string): string {
  return [
    `A clean, simple, friendly illustration representing "${front}"`,
    `in the context of ${topic}.`,
    'Flat vector style, soft colors, centered subject, no text, no words, no letters.',
  ].join(' ');
}
