import { IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { chevronForward } from 'ionicons/icons';
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
        <p className="fs-muted discover__subtitle">Browse decks by category and start learning.</p>
        <EditorLink />
        {isLoading ? (
          <ul className="discover__shelves" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className="discover__shelf discover__shelf--skeleton" />
            ))}
          </ul>
        ) : (
          <ul className="discover__shelves" aria-label="Categories">
            {(shelves ?? []).map((shelf) => (
              <li key={shelf.slug} data-testid="shelf">
                <Link
                  to={`/discover/${shelf.slug}`}
                  className="discover__shelf"
                  style={{ ['--cat' as string]: `var(--fs-cat-${shelf.slug}, var(--fs-accent))` }}
                >
                  <span className="discover__dot" aria-hidden="true" />
                  <span className="discover__shelf-title">{shelf.title}</span>
                  <IonIcon className="discover__chevron" icon={chevronForward} aria-hidden="true" />
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
