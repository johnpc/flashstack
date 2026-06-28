import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { Link, useParams } from 'react-router-dom';
import { useStudy } from './useStudy';
import { StudyCard } from './StudyCard';
import './study.css';

/** Play screen: walk the deck's study queue, self-grading each card. */
export function Study() {
  const { id } = useParams<{ id: string }>();
  const s = useStudy(id);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/decks/${id}`} />
          </IonButtons>
          <IonTitle>Study</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {!s.isAuthenticated ? (
          <p className="fs-muted" data-testid="study-signed-out">
            <Link to="/signin">Sign in</Link> to study this deck.
          </p>
        ) : s.isLoading ? (
          <p className="fs-muted">Loading…</p>
        ) : s.current ? (
          <>
            <p className="fs-muted study__progress" data-testid="study-progress">
              {s.position.index + 1} / {s.position.total}
            </p>
            <StudyCard
              card={s.current.card}
              revealed={s.revealed}
              onReveal={s.reveal}
              onGrade={s.grade}
            />
          </>
        ) : (
          <div data-testid="study-done">
            <p className="fs-heading">All caught up! 🎉</p>
            <p className="fs-muted">No cards due right now. Come back later.</p>
            <Link to={`/decks/${id}`} className="study__back-link">
              Back to deck
            </Link>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}
