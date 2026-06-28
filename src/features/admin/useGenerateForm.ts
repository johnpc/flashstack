import { useCallback, useState } from 'react';
import type { GenerateDeckInput } from './generateApi';

/** Form state for the AI generate-deck request. Submits via the injected fn. */
export function useGenerateForm(generate: (i: GenerateDeckInput) => Promise<unknown>) {
  const [topic, setTopic] = useState('');
  const [categorySlug, setCategorySlug] = useState('languages');
  const [voiceLanguage, setVoiceLanguage] = useState('en-US');
  const [cardCount, setCardCount] = useState(10);
  const [busy, setBusy] = useState(false);

  const submit = useCallback(async () => {
    if (!topic.trim()) return;
    setBusy(true);
    try {
      await generate({ topic: topic.trim(), categorySlug, voiceLanguage, cardCount });
      setTopic('');
    } finally {
      setBusy(false);
    }
  }, [topic, categorySlug, voiceLanguage, cardCount, generate]);

  return {
    topic,
    setTopic,
    categorySlug,
    setCategorySlug,
    voiceLanguage,
    setVoiceLanguage,
    cardCount,
    setCardCount,
    busy,
    submit,
    canSubmit: topic.trim().length > 0 && !busy,
  };
}
