import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { checkmarkDoneCircleOutline } from 'ionicons/icons';
import { Link, useParams } from 'react-router-dom';
import { useStudy } from './useStudy';
import { StudyCard } from './StudyCard';
import { EmptyState } from '../shell/EmptyState';
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
          <EmptyState
            icon={checkmarkDoneCircleOutline}
            title="All caught up!"
            message="No cards are due right now. Come back later to keep your streak going."
            testId="study-done"
          >
            <Link to={`/decks/${id}`} className="empty-state__cta">
              Back to deck
            </Link>
          </EmptyState>
        )}
      </IonContent>
    </IonPage>
  );
}
