import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
} from '@ionic/react';
import { Link } from 'react-router-dom';
import { useAdminDecks } from './useAdminDecks';
import { useGenerateDeck } from './useGenerateDeck';
import { NewDeckForm } from './NewDeckForm';
import { GenerateDeckForm } from './GenerateDeckForm';
import { GenerationRuns } from './GenerationRuns';
import './admin.css';

/** Admin: list every deck (any status), create new ones, publish/delete. */
export function ManageDecks() {
  const { decks, isLoading, create, setPublished, remove } = useAdminDecks();
  const gen = useGenerateDeck();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/discover" />
          </IonButtons>
          <IonTitle>Manage decks</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <GenerateDeckForm onGenerate={gen.generate} />
        <GenerationRuns runs={gen.runs} />
        <NewDeckForm onCreate={create} />
        {isLoading ? (
          <p className="fs-muted">Loading…</p>
        ) : (
          <ul className="admin-decks" aria-label="All decks">
            {decks.map((d) => (
              <li key={d.id} className="admin-decks__row" data-testid="admin-deck">
                <Link to={`/admin/decks/${d.id}`} className="admin-decks__topic fs-heading">
                  {d.topic}
                </Link>
                <span className="admin-decks__status" data-testid="deck-status">
                  {d.status}
                </span>
                <div className="admin-decks__actions">
                  <button
                    type="button"
                    onClick={() => setPublished({ id: d.id, published: d.status !== 'PUBLISHED' })}
                  >
                    {d.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button type="button" className="admin-decks__del" onClick={() => remove(d.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </IonContent>
    </IonPage>
  );
}
