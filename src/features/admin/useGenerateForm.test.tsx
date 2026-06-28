import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useGenerateForm } from './useGenerateForm';

describe('useGenerateForm', () => {
  it('submits the full request and clears the topic', async () => {
    const generate = vi.fn().mockResolvedValue({});
    const { result } = renderHook(() => useGenerateForm(generate));
    act(() => {
      result.current.setTopic('Greek Gods');
      result.current.setCategorySlug('mythology');
      result.current.setVoiceLanguage('en-US');
      result.current.setCardCount(15);
    });
    await act(async () => result.current.submit());
    expect(generate).toHaveBeenCalledWith({
      topic: 'Greek Gods',
      categorySlug: 'mythology',
      voiceLanguage: 'en-US',
      cardCount: 15,
    });
    await waitFor(() => expect(result.current.topic).toBe(''));
  });

  it('does nothing when the topic is blank', async () => {
    const generate = vi.fn();
    const { result } = renderHook(() => useGenerateForm(generate));
    await act(async () => result.current.submit());
    expect(generate).not.toHaveBeenCalled();
  });
});
