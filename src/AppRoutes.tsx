import { Redirect, Route } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import { Discover } from './features/discover/Discover';
import { CategoryDecks } from './features/discover/CategoryDecks';
import { DeckDetail } from './features/deck/DeckDetail';
import { Study } from './features/study/Study';
import { MyDecks } from './features/mydecks/MyDecks';
import { SignIn } from './features/auth/SignIn';
import { SignUp } from './features/auth/SignUp';

/** App routes. Tabs + screens grow per slice; Discover is the launch surface. */
export function AppRoutes() {
  return (
    <IonRouterOutlet>
      <Route exact path="/discover">
        <Discover />
      </Route>
      <Route exact path="/discover/:slug">
        <CategoryDecks />
      </Route>
      <Route exact path="/decks/:id">
        <DeckDetail />
      </Route>
      <Route exact path="/decks/:id/study">
        <Study />
      </Route>
      <Route exact path="/my-decks">
        <MyDecks />
      </Route>
      <Route exact path="/signin">
        <SignIn />
      </Route>
      <Route exact path="/signup">
        <SignUp />
      </Route>
      <Route exact path="/">
        <Redirect to="/discover" />
      </Route>
    </IonRouterOutlet>
  );
}
