import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NewDeckForm } from './NewDeckForm';

describe('NewDeckForm', () => {
  it('disables create until a topic is typed, then submits topic + category', async () => {
    const onCreate = vi.fn().mockResolvedValue('id');
    render(<NewDeckForm onCreate={onCreate} />);
    const btn = screen.getByRole('button', { name: 'Create' });
    expect(btn).toBeDisabled();

    fireEvent.change(screen.getByLabelText('New deck topic'), { target: { value: 'Greek Gods' } });
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'mythology' } });
    expect(btn).toBeEnabled();
    fireEvent.click(btn);
    expect(onCreate).toHaveBeenCalledWith({ topic: 'Greek Gods', categorySlug: 'mythology' });
  });
});
