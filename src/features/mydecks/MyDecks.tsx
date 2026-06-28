import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Link } from 'react-router-dom';
import { useMyDecks } from './useMyDecks';
import { TabBar } from '../shell/TabBar';
import './mydecks.css';

/** "My Decks" — the signed-in user's saved decks. Renders only. */
export function MyDecks() {
  const { decks, isLoading, isAuthenticated } = useMyDecks();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Decks</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {!isAuthenticated ? (
          <p className="fs-muted" data-testid="signed-out">
            <Link to="/signin">Sign in</Link> to save decks and study them.
          </p>
        ) : isLoading ? (
          <p className="fs-muted">Loading your decks…</p>
        ) : decks.length === 0 ? (
          <p className="fs-muted" data-testid="empty-my-decks">
            No saved decks yet — find one in Discover.
          </p>
        ) : (
          <ul className="my-decks" aria-label="Saved decks">
            {decks.map((deck) => (
              <li key={deck.id} data-testid="my-deck">
                <Link to={`/decks/${deck.deckId}`} className="my-decks__row">
                  <span className="fs-heading my-decks__topic">{deck.topic}</span>
                  <span className="fs-muted">{deck.cardCount ?? 0} cards</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <TabBar active="My Decks" />
      </IonContent>
    </IonPage>
  );
}
