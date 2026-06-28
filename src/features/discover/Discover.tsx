import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useShelves } from './useShelves';
import { TabBar } from '../shell/TabBar';
import './discover.css';

/** Discover tab — browse flashcard decks by category shelf. Renders only. */
export function Discover() {
  const { data: shelves, isLoading } = useShelves();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Discover</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1 className="fs-heading discover__title">Find a deck</h1>
        {isLoading ? (
          <p className="fs-muted">Loading shelves…</p>
        ) : (
          <ul className="discover__shelves" aria-label="Categories">
            {(shelves ?? []).map((shelf) => (
              <li key={shelf.slug} className="discover__shelf" data-testid="shelf">
                <span className="fs-kicker">{shelf.title}</span>
              </li>
            ))}
          </ul>
        )}
        <TabBar active="Discover" />
      </IonContent>
    </IonPage>
  );
}
