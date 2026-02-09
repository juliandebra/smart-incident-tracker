import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import { 
  listOutline, 
  addCircleOutline, 
  statsChartOutline, 
  settingsOutline 
} from 'ionicons/icons';


import { APP_ROUTES } from '../../utils/constants';
import { IncidentsListPage } from '../../pages/Incidents/IncidentsList.page';
import { IncidentDetailPage } from '../../pages/Incidents/IncidentDetail.page';
import { CreateIncidentPage } from '../../pages/CreateIncident/CreateIncident.page';
import { DashboardPage } from '../../pages/Dashboard/Dashboard.page';
import { SettingsPage } from '../../pages/Settings/Settings.page';

export function TabsLayout() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path={APP_ROUTES.INCIDENTS}>
          <IncidentsListPage />
        </Route>
        <Route exact path={APP_ROUTES.INCIDENT_DETAIL}>
          <IncidentDetailPage />
        </Route>
        <Route exact path={APP_ROUTES.CREATE}>
          <CreateIncidentPage />
        </Route>
        <Route exact path={APP_ROUTES.DASHBOARD}>
          <DashboardPage />
        </Route>
        <Route exact path={APP_ROUTES.SETTINGS}>
          <SettingsPage />
        </Route>
        <Route exact path="/app">
          <Redirect to={APP_ROUTES.INCIDENTS} />
        </Route>
        <Route exact path="/">
          <Redirect to={APP_ROUTES.INCIDENTS} />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="incidents" href={APP_ROUTES.INCIDENTS}>
          <IonIcon aria-hidden="true" icon={listOutline} />
          <IonLabel>Incidents</IonLabel>
        </IonTabButton>
        <IonTabButton tab="create" href={APP_ROUTES.CREATE}>
          <IonIcon aria-hidden="true" icon={addCircleOutline} />
          <IonLabel>Create</IonLabel>
        </IonTabButton>
        <IonTabButton tab="dashboard" href={APP_ROUTES.DASHBOARD}>
          <IonIcon aria-hidden="true" icon={statsChartOutline} />
          <IonLabel>Dashboard</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href={APP_ROUTES.SETTINGS}>
          <IonIcon aria-hidden="true" icon={settingsOutline} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
