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
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonThumbnail
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { locationOutline, closeCircleOutline, cameraOutline, trashOutline } from 'ionicons/icons';
import { PageHeader } from '../../components/layout/PageHeader';
import { useCreateIncident } from '../../hooks/useCreateIncident';
import { useGeolocation } from '../../hooks/useGeolocation';
import { incidentPhotoService } from '../../services/incidentPhotoService';
import { IncidentMap } from '../../components/incidents/IncidentMap';
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
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]); // Array of Base64 strings
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);

  const handleAddPhoto = async () => {
    try {
      setIsPhotoLoading(true);
      const photo = await incidentPhotoService.takePhoto();
      if (photo.base64String) {
        setSelectedPhotos(prev => [...prev, photo.base64String!]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    } finally {
      setIsPhotoLoading(false);
    }
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;

    try {
      const incident = await createMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        priority,
        location: location.trim() || undefined,
        latitude: geo.latitude || undefined,
        longitude: geo.longitude || undefined,
      });

      // If we have photos, upload them now
      if (selectedPhotos.length > 0) {
        setIsUploadingPhotos(true);
        // Upload one by one to avoid overwhelming memory/connection
        for (const photoBase64 of selectedPhotos) {
          await incidentPhotoService.uploadPhotoData(incident.result.id, photoBase64);
        }
      }

      history.push(APP_ROUTES.INCIDENTS);
    } catch (error: any) {
      alert(`Error creating incident: ${error.message}`);
    } finally {
      setIsUploadingPhotos(false);
    }
  };

  const handleUseLocation = async () => {
    await geo.getCurrentPosition();
  };

  const isValid = title.trim() && description.trim();
  const isPending = createMutation.isPending || isUploadingPhotos;

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

          {/* Map Section for Creation */}
          {geo.latitude && geo.longitude && (
            <div className="px-4 mt-2 mb-4">
              <IncidentMap 
                latitude={geo.latitude} 
                longitude={geo.longitude} 
                height="180px"
              />
            </div>
          )}


          {/* Photos Section */}
          <div className="mt-4 px-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium m-0">Photographic Evidence</h3>
              <IonButton 
                size="small" 
                fill="outline" 
                onClick={handleAddPhoto}
                disabled={isPhotoLoading || isUploadingPhotos}
              >
                {isPhotoLoading ? (
                  <IonSpinner name="crescent" className="h-4 w-4 mr-2" />
                ) : (
                  <IonIcon icon={cameraOutline} slot="start" />
                )}
                {selectedPhotos.length > 0 ? 'Add another' : 'Add photo'}
              </IonButton>
            </div>

            {selectedPhotos.length > 0 && (
              <IonGrid className="p-0">
                <IonRow>
                  {selectedPhotos.map((photo, index) => (
                    <IonCol size="4" key={index}>
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 shadow-sm border border-gray-200">
                        <IonImg 
                          src={`data:image/jpeg;base64,${photo}`} 
                          className="w-full h-full object-cover"
                        />
                        <IonButton
                          className="absolute -top-1 -right-1"
                          color="danger"
                          size="small"
                          fill="clear"
                          onClick={() => removePhoto(index)}
                        >
                          <IonIcon icon={trashOutline} slot="icon-only" className="text-lg bg-white rounded-full" />
                        </IonButton>
                      </div>
                    </IonCol>
                  ))}
                </IonRow>
              </IonGrid>
            )}
            
            {selectedPhotos.length === 0 && (
              <IonNote className="text-xs italic">Optional: you can add photos now or later.</IonNote>
            )}
          </div>
        </IonList>

        <div className="mt-8 px-4 pb-8">
          <IonButton 
            expand="block" 
            onClick={handleSubmit}
            disabled={!isValid || isPending}
          >
            {isUploadingPhotos ? (
              <>
                <IonSpinner name="crescent" className="h-5 w-5 mr-3" />
                Uploading photos...
              </>
            ) : createMutation.isPending ? (
              'Creating Incident...'
            ) : (
              'Create Incident'
            )}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}

