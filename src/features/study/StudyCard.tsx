import { useMediaUrl } from '../../lib/useMediaUrl';
import type { CardRecord } from '../../lib/dataClient';

/** Grade scale shown after the answer is revealed (SM-2 0–5, labelled). */
const GRADES = [
  { value: 1, label: 'Again', kind: 'incorrect' },
  { value: 3, label: 'Hard', kind: 'neutral' },
  { value: 4, label: 'Good', kind: 'neutral' },
  { value: 5, label: 'Easy', kind: 'correct' },
] as const;

interface StudyCardProps {
  card: CardRecord;
  revealed: boolean;
  onReveal: () => void;
  onGrade: (value: number) => void;
}

/** One flashcard: shows the front, reveals the back + media, then grade buttons. */
export function StudyCard({ card, revealed, onReveal, onGrade }: StudyCardProps) {
  const imageUrl = useMediaUrl(revealed ? card.imagePath : null);
  return (
    <div className="study-card" data-testid="study-card">
      <p className="fs-card-face study-card__front">{card.front}</p>
      {!revealed ? (
        <button type="button" className="study-card__reveal" onClick={onReveal}>
          Show answer
        </button>
      ) : (
        <div className="study-card__answer" data-testid="study-answer">
          <p className="fs-card-face study-card__back">{card.back}</p>
          {card.hint && <p className="fs-muted study-card__hint">{card.hint}</p>}
          {card.example && <p className="study-card__example">{card.example}</p>}
          {imageUrl && <img className="study-card__img" src={imageUrl} alt="" />}
          <div className="study-card__grades">
            {GRADES.map((g) => (
              <button
                key={g.value}
                type="button"
                className={`study-card__grade study-card__grade--${g.kind}`}
                data-testid={`grade-${g.value}`}
                onClick={() => onGrade(g.value)}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
