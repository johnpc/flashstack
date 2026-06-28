import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Link } from 'react-router-dom';
import { useShelves } from './useShelves';
import { TabBar } from '../shell/TabBar';
import { EditorLink } from '../admin/EditorLink';
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
        <EditorLink />
        {isLoading ? (
          <p className="fs-muted">Loading shelves…</p>
        ) : (
          <ul className="discover__shelves" aria-label="Categories">
            {(shelves ?? []).map((shelf) => (
              <li key={shelf.slug} data-testid="shelf">
                <Link to={`/discover/${shelf.slug}`} className="discover__shelf">
                  <span className="fs-kicker">{shelf.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <TabBar active="Discover" />
      </IonContent>
    </IonPage>
  );
}
