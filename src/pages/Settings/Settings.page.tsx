import { IonPage, IonContent, IonList, IonItem, IonLabel, IonIcon, IonToggle } from '@ionic/react';
import { personCircleOutline, notificationsOutline, colorPaletteOutline, informationCircleOutline } from 'ionicons/icons';
import { PageHeader } from '../../components/layout/PageHeader';
import { useAuth } from '../../hooks/useAuth';

export function SettingsPage() {
  const { user } = useAuth();

  return (
    <IonPage>
      <PageHeader title="Settings" />

      <IonContent className="ion-padding">
        <IonList inset>
          <IonItem>
            <IonIcon icon={personCircleOutline} slot="start" />
            <IonLabel>
              <h2>{user?.name || 'Guest'}</h2>
              <p>{user?.email || 'Not logged in'}</p>
            </IonLabel>
          </IonItem>
        </IonList>

        <IonList inset>
          <IonItem>
            <IonIcon icon={notificationsOutline} slot="start" />
            <IonLabel>Push Notifications</IonLabel>
            <IonToggle slot="end" />
          </IonItem>

          <IonItem>
            <IonIcon icon={colorPaletteOutline} slot="start" />
            <IonLabel>Dark Mode</IonLabel>
            <IonToggle slot="end" />
          </IonItem>
        </IonList>

        <IonList inset>
          <IonItem>
            <IonIcon icon={informationCircleOutline} slot="start" />
            <IonLabel>
              <h2>About</h2>
              <p>Smart Incident Tracker v0.0.1</p>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
}
