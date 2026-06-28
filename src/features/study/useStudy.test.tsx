import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';

const api = vi.hoisted(() => ({ fetchStudyData: vi.fn(), gradeCard: vi.fn() }));
const auth = vi.hoisted(() => ({ status: 'authenticated' as string }));
vi.mock('./studyApi', () => api);
vi.mock('../auth/useAuth', () => ({ useAuth: () => ({ status: auth.status }) }));

import { useStudy } from './useStudy';

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

const twoNewCards = {
  cards: [
    { id: 'c1', deckId: 'd1', ord: 0, front: 'a', back: 'A' },
    { id: 'c2', deckId: 'd1', ord: 1, front: 'b', back: 'B' },
  ],
  reviews: [],
};

describe('useStudy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.status = 'authenticated';
    api.gradeCard.mockResolvedValue(undefined);
  });

  it('does not load when signed out', () => {
    auth.status = 'unauthenticated';
    const { result } = renderHook(() => useStudy('d1'), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
    expect(api.fetchStudyData).not.toHaveBeenCalled();
  });

  it('exposes the first queued card and its position', async () => {
    api.fetchStudyData.mockResolvedValue(twoNewCards);
    const { result } = renderHook(() => useStudy('d1'), { wrapper });
    await waitFor(() => expect(result.current.current?.card.id).toBe('c1'));
    expect(result.current.position).toEqual({ index: 0, total: 2 });
  });

  it('grades a card, advances, and finishes the queue', async () => {
    api.fetchStudyData.mockResolvedValue({ ...twoNewCards, cards: [twoNewCards.cards[0]] });
    const { result } = renderHook(() => useStudy('d1'), { wrapper });
    await waitFor(() => expect(result.current.current?.card.id).toBe('c1'));
    await act(async () => result.current.grade(5));
    expect(api.gradeCard).toHaveBeenCalledWith('d1', 'c1', null, 5);
    await waitFor(() => expect(result.current.done).toBe(true));
  });

  it('reveals the answer', async () => {
    api.fetchStudyData.mockResolvedValue(twoNewCards);
    const { result } = renderHook(() => useStudy('d1'), { wrapper });
    await waitFor(() => expect(result.current.current).toBeTruthy());
    act(() => result.current.reveal());
    expect(result.current.revealed).toBe(true);
  });
});
