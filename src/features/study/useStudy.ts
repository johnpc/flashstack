import { useCallback, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchStudyData, gradeCard } from './studyApi';
import { buildStudyQueue } from './buildStudyQueue';
import { useAuth } from '../auth/useAuth';

/** Drives a study session: load cards + reviews, walk the queue, self-grade. */
export function useStudy(deckId: string | undefined) {
  const { status } = useAuth();
  const enabled = status === 'authenticated' && !!deckId;
  const queryClient = useQueryClient();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  // Which face is the prompt: 'front' (recall the back) or 'back' (recall front).
  const [direction, setDirection] = useState<'front' | 'back'>('front');

  const { data, isLoading } = useQuery({
    queryKey: ['study', deckId],
    queryFn: () => fetchStudyData(deckId as string),
    enabled,
  });

  // Build the queue once per load so grading mid-session doesn't reshuffle the
  // cards out from under the user (the next due date only matters next session).
  const queue = useMemo(
    () => (data ? buildStudyQueue(data.cards, data.reviews, new Date()) : []),
    [data],
  );
  const current = queue[index] ?? null;
  const done = !isLoading && queue.length > 0 && index >= queue.length;

  const grade = useCallback(
    async (value: number) => {
      if (!current || !deckId) return;
      await gradeCard(deckId, current.card.id, current.review, value);
      setRevealed(false);
      setIndex((i) => i + 1);
    },
    [current, deckId],
  );

  const reset = useCallback(async () => {
    setIndex(0);
    setRevealed(false);
    await queryClient.invalidateQueries({ queryKey: ['study', deckId] });
  }, [queryClient, deckId]);

  // Flipping direction restarts the session from the first card on the new face.
  const toggleDirection = useCallback(() => {
    setDirection((d) => (d === 'front' ? 'back' : 'front'));
    setIndex(0);
    setRevealed(false);
  }, []);

  return {
    isAuthenticated: status === 'authenticated',
    isLoading: enabled && isLoading,
    current,
    revealed,
    reveal: () => setRevealed(true),
    grade,
    done,
    reset,
    direction,
    toggleDirection,
    position: { index, total: queue.length },
  };
}
