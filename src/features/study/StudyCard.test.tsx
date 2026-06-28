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
  imagePath: 'media/decks/d1/c1.png',
} as CardRecord;

describe('StudyCard', () => {
  beforeEach(() => {
    media.url = null;
  });

  it('shows the front and a reveal button before reveal', () => {
    render(<StudyCard card={card} revealed={false} onReveal={vi.fn()} onGrade={vi.fn()} />);
    expect(screen.getByText('Hola')).toBeInTheDocument();
    expect(screen.queryByTestId('study-answer')).not.toBeInTheDocument();
  });

  it('calls onReveal when Show answer is clicked', () => {
    const onReveal = vi.fn();
    render(<StudyCard card={card} revealed={false} onReveal={onReveal} onGrade={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Show answer' }));
    expect(onReveal).toHaveBeenCalled();
  });

  it('shows the back, hint, example and grade buttons once revealed', () => {
    render(<StudyCard card={card} revealed onReveal={vi.fn()} onGrade={vi.fn()} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('greeting')).toBeInTheDocument();
    expect(screen.getByTestId('grade-1')).toBeInTheDocument();
    expect(screen.getByTestId('grade-5')).toBeInTheDocument();
  });

  it('grades with the chosen value', () => {
    const onGrade = vi.fn();
    render(<StudyCard card={card} revealed onReveal={vi.fn()} onGrade={onGrade} />);
    fireEvent.click(screen.getByTestId('grade-4'));
    expect(onGrade).toHaveBeenCalledWith(4);
  });

  it('shows the card image once its URL resolves', () => {
    media.url = 'https://s3/c1.png';
    const { container } = render(
      <StudyCard card={card} revealed onReveal={vi.fn()} onGrade={vi.fn()} />,
    );
    expect(container.querySelector('.study-card__img')).toHaveAttribute('src', 'https://s3/c1.png');
  });
});
