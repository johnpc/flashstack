import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useNewDeckForm } from './useNewDeckForm';

describe('useNewDeckForm', () => {
  it('disables submit until a topic is entered', () => {
    const { result } = renderHook(() => useNewDeckForm(vi.fn().mockResolvedValue('id')));
    expect(result.current.canSubmit).toBe(false);
    act(() => result.current.setTopic('Greek Gods'));
    expect(result.current.canSubmit).toBe(true);
  });

  it('creates the deck and clears the topic on submit', async () => {
    const create = vi.fn().mockResolvedValue('id');
    const { result } = renderHook(() => useNewDeckForm(create));
    act(() => {
      result.current.setTopic('Greek Gods');
      result.current.setCategorySlug('mythology');
    });
    await act(async () => result.current.submit());
    expect(create).toHaveBeenCalledWith({ topic: 'Greek Gods', categorySlug: 'mythology' });
    await waitFor(() => expect(result.current.topic).toBe(''));
  });

  it('does nothing when the topic is blank', async () => {
    const create = vi.fn();
    const { result } = renderHook(() => useNewDeckForm(create));
    act(() => result.current.setTopic('   '));
    await act(async () => result.current.submit());
    expect(create).not.toHaveBeenCalled();
  });
});
