import { useCallback, useState } from 'react';
import type { NewDeck } from './adminDeckApi';

/** Form state for creating a deck. Submits via the injected create fn. */
export function useNewDeckForm(create: (d: NewDeck) => Promise<string>) {
  const [topic, setTopic] = useState('');
  const [categorySlug, setCategorySlug] = useState('languages');
  const [busy, setBusy] = useState(false);

  const submit = useCallback(async () => {
    if (!topic.trim()) return;
    setBusy(true);
    try {
      await create({ topic: topic.trim(), categorySlug });
      setTopic('');
    } finally {
      setBusy(false);
    }
  }, [topic, categorySlug, create]);

  const canSubmit = topic.trim().length > 0 && !busy;
  return { topic, setTopic, categorySlug, setCategorySlug, busy, submit, canSubmit };
}
