import { useState, useEffect } from 'react';
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonIcon, IonToggle } from '@ionic/react';
import { personCircleOutline, notificationsOutline, colorPaletteOutline, informationCircleOutline } from 'ionicons/icons';
import { PageHeader } from '../../components/layout/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { settingsService, AppTheme } from '../../services/settings.service';
import { notificationService } from '../../services/notification.service';
import { useTheme } from '../../hooks/useTheme';

export function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    setNotificationsEnabled(settingsService.isNotificationsEnabled());
  }, []);

  const handleNotificationsToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await notificationService.requestPermissions();
      if (granted) {
        settingsService.setNotificationsEnabled(true);
        setNotificationsEnabled(true);
      }
    } else {
      settingsService.setNotificationsEnabled(false);
      setNotificationsEnabled(false);
    }
  };

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
            <IonToggle 
              slot="end" 
              checked={notificationsEnabled}
              onIonChange={(e) => handleNotificationsToggle(e.detail.checked)}
            />
          </IonItem>

          <IonItem>
            <IonIcon icon={colorPaletteOutline} slot="start" />
            <IonLabel>Dark Mode</IonLabel>
            <IonToggle 
              slot="end" 
              checked={theme === 'dark'}
              onIonChange={(e) => setTheme(e.detail.checked ? 'dark' : 'light')}
            />
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

