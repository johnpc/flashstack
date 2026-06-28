import type { NewDeck } from './adminDeckApi';
import { useNewDeckForm } from './useNewDeckForm';

const CATEGORIES = ['languages', 'mythology', 'scripture', 'science', 'history'];

/** Inline form to create a new DRAFT deck. Renders only; logic in the hook. */
export function NewDeckForm({ onCreate }: { onCreate: (d: NewDeck) => Promise<string> }) {
  const f = useNewDeckForm(onCreate);
  return (
    <div className="new-deck" data-testid="new-deck-form">
      <input
        className="new-deck__input"
        placeholder="New deck topic…"
        aria-label="New deck topic"
        value={f.topic}
        onChange={(e) => f.setTopic(e.target.value)}
      />
      <select
        className="new-deck__select"
        aria-label="Category"
        value={f.categorySlug}
        onChange={(e) => f.setCategorySlug(e.target.value)}
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button type="button" className="new-deck__btn" disabled={!f.canSubmit} onClick={f.submit}>
        {f.busy ? 'Creating…' : 'Create'}
      </button>
    </div>
  );
}
