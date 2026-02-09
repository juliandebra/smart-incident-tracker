import { useState } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonTextarea, 
  IonSelect, 
  IonSelectOption,
  IonButton,
  IonList,
  IonIcon,
  IonNote,
  IonSpinner,
  IonText
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { locationOutline, closeCircleOutline } from 'ionicons/icons';
import { PageHeader } from '../../components/layout/PageHeader';
import { useCreateIncident } from '../../hooks/useCreateIncident';
import { useGeolocation } from '../../hooks/useGeolocation';
import { APP_ROUTES } from '../../utils/constants';
import type { IncidentPriority } from '../../models/incident.model';

export function CreateIncidentPage() {
  const history = useHistory();
  const createMutation = useCreateIncident();
  const geo = useGeolocation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<IncidentPriority>('medium');
  const [location, setLocation] = useState('');

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;

    await createMutation.mutateAsync({
      title: title.trim(),
      description: description.trim(),
      priority,
      location: location.trim() || undefined,
      latitude: geo.latitude || undefined,
      longitude: geo.longitude || undefined,
    });

    history.push(APP_ROUTES.INCIDENTS);
  };

  const handleUseLocation = async () => {
    await geo.getCurrentPosition();
  };

  const isValid = title.trim() && description.trim();

  return (
    <IonPage>
      <PageHeader title="Create Incident" />

      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonInput
              label="Title"
              labelPlacement="stacked"
              placeholder="Brief incident title"
              value={title}
              onIonInput={(e) => setTitle(e.detail.value || '')}
            />
          </IonItem>

          <IonItem>
            <IonTextarea
              label="Description"
              labelPlacement="stacked"
              placeholder="Describe the incident in detail"
              rows={4}
              value={description}
              onIonInput={(e) => setDescription(e.detail.value || '')}
            />
          </IonItem>

          <IonItem>
            <IonSelect
              label="Priority"
              labelPlacement="stacked"
              value={priority}
              onIonChange={(e) => setPriority(e.detail.value)}
            >
              <IonSelectOption value="low">Low</IonSelectOption>
              <IonSelectOption value="medium">Medium</IonSelectOption>
              <IonSelectOption value="high">High</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonInput
              label="Location (optional)"
              labelPlacement="stacked"
              placeholder="Where did this occur?"
              value={location}
              onIonInput={(e) => setLocation(e.detail.value || '')}
            />
          </IonItem>

          {/* Geolocation Section */}
          <IonItem lines="none" className="mt-2">
            <IonLabel>
              <h3 className="text-sm font-medium">GPS Coordinates</h3>
              {geo.formattedCoords ? (
                <div className="flex items-center gap-2 mt-1">
                  <IonNote color="primary" className="text-xs">
                    📍 {geo.formattedCoords}
                  </IonNote>
                  <IonButton 
                    fill="clear" 
                    size="small" 
                    onClick={geo.clearPosition}
                  >
                    <IonIcon icon={closeCircleOutline} slot="icon-only" />
                  </IonButton>
                </div>
              ) : geo.error ? (
                <IonText color="danger" className="text-xs block mt-1">
                  {geo.error}
                </IonText>
              ) : (
                <IonNote className="text-xs">
                  Capture your current GPS position
                </IonNote>
              )}
            </IonLabel>
            <IonButton 
              slot="end" 
              fill="outline" 
              size="small"
              onClick={handleUseLocation}
              disabled={geo.isLoading}
            >
              {geo.isLoading ? (
                <IonSpinner name="dots" />
              ) : (
                <>
                  <IonIcon icon={locationOutline} slot="start" />
                  Use Location
                </>
              )}
            </IonButton>
          </IonItem>
        </IonList>

        <div className="mt-6 px-4">
          <IonButton 
            expand="block" 
            onClick={handleSubmit}
            disabled={!isValid || createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create Incident'}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
