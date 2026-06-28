import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const media = vi.hoisted(() => ({ url: null as string | null }));
vi.mock('../../lib/useMediaUrl', () => ({ useMediaUrl: () => media.url }));

import { StudyCard } from './StudyCard';
import type { CardRecord } from '../../lib/dataClient';

const card = {
  id: 'c1',
  deckId: 'd1',
  ord: 0,
  front: 'Hola',
  back: 'Hello',
  hint: 'greeting',
  example: '¡Hola!',
  imagePath: 'media/decks/d1/c1.webp',
} as CardRecord;

const base = { onReveal: vi.fn(), onGrade: vi.fn(), direction: 'front' as const };

describe('StudyCard', () => {
  beforeEach(() => {
    media.url = null;
  });

  it('shows the front as prompt (direction=front) before reveal', () => {
    render(<StudyCard card={card} revealed={false} {...base} />);
    expect(screen.getByText('Hola')).toBeInTheDocument();
    expect(screen.queryByTestId('study-answer')).not.toBeInTheDocument();
  });

  it('prompts with the back when direction=back', () => {
    render(<StudyCard card={card} revealed={false} {...base} direction="back" />);
    expect(screen.getByText('Hello')).toBeInTheDocument(); // back is the prompt
    expect(screen.queryByText('Hola')).not.toBeInTheDocument();
  });

  it('reveals the opposite face as the answer', () => {
    render(<StudyCard card={card} revealed {...base} direction="back" />);
    // prompt=back (Hello), answer=front (Hola)
    expect(screen.getByTestId('study-answer')).toHaveTextContent('Hola');
  });

  it('calls onReveal when Show answer is clicked', () => {
    const onReveal = vi.fn();
    render(<StudyCard card={card} revealed={false} {...base} onReveal={onReveal} />);
    fireEvent.click(screen.getByRole('button', { name: 'Show answer' }));
    expect(onReveal).toHaveBeenCalled();
  });

  it('grades with the chosen value', () => {
    const onGrade = vi.fn();
    render(<StudyCard card={card} revealed {...base} onGrade={onGrade} />);
    fireEvent.click(screen.getByTestId('grade-4'));
    expect(onGrade).toHaveBeenCalledWith(4);
  });

  it('shows the card image on the prompt face (both faces), not just on reveal', () => {
    media.url = 'https://s3/c1.webp';
    const { container } = render(<StudyCard card={card} revealed={false} {...base} />);
    expect(container.querySelector('.study-card__img')).toHaveAttribute(
      'src',
      'https://s3/c1.webp',
    );
  });
});
