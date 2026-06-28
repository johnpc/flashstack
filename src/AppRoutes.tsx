import { Redirect, Route } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import { Discover } from './features/discover/Discover';

/** App routes. Tabs + screens grow per slice; Discover is the launch surface. */
export function AppRoutes() {
  return (
    <IonRouterOutlet>
      <Route exact path="/discover">
        <Discover />
      </Route>
      <Route exact path="/">
        <Redirect to="/discover" />
      </Route>
    </IonRouterOutlet>
  );
}
