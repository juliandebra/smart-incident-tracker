import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonChip, IonLabel, IonButton, IonGrid, IonRow, IonCol, IonImg, IonSpinner } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { locationOutline, timeOutline, personOutline, cameraOutline } from 'ionicons/icons';
import { PageHeader } from '../../components/layout/PageHeader';
import { IncidentStatusBadge } from '../../components/incidents/IncidentStatusBadge';
import { IncidentPriorityBadge } from '../../components/incidents/IncidentPriorityBadge';
import { Loader } from '../../components/ui/Loader';
import { useIncidentById } from '../../hooks/useIncidents';
import { useIncidentPhotos, useUploadPhoto } from '../../hooks/useIncidentPhotos';
import { IncidentMap } from '../../components/incidents/IncidentMap';
import { formatDateTime } from '../../utils/date';

export function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: incident, isLoading: isLoadingIncident } = useIncidentById(id);
  const { data: photos, isLoading: isLoadingPhotos } = useIncidentPhotos(id);
  const { mutate: uploadPhoto, isPending: isUploading } = useUploadPhoto();

  const handleAddPhoto = () => {
    uploadPhoto(id, {
      onError: (error: any) => {
        alert(`Error uploading photo: ${error.message}`);
      }
    });
  };

  const isLoading = isLoadingIncident || isLoadingPhotos;

  return (
    <IonPage>
      <PageHeader title="Incident Detail" showBackButton />

      <IonContent className="ion-padding">
        {isLoading ? (
          <Loader message="Loading incident..." />
        ) : incident ? (
          <div className="space-y-4">
            <IonCard>
              <IonCardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <IonCardTitle>{incident.title}</IonCardTitle>
                </div>
                <div className="flex gap-2">
                  <IncidentPriorityBadge priority={incident.priority} />
                  <IncidentStatusBadge status={incident.status} />
                </div>
              </IonCardHeader>
              <IonCardContent>
                <p className="text-gray-600 mb-4">{incident.description}</p>

                <div className="space-y-3">
                  {incident.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <IonIcon icon={locationOutline} className="text-gray-400" />
                      <span>{incident.location}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <IonIcon icon={timeOutline} className="text-gray-400" />
                    <span>Created: {formatDateTime(incident.created_at)}</span>
                  </div>

                  {incident.assignee_id && (
                    <div className="flex items-center gap-2 text-sm">
                      <IonIcon icon={personOutline} className="text-gray-400" />
                      <IonChip>
                        <IonLabel>Assigned</IonLabel>
                      </IonChip>
                    </div>
                  )}
                </div>

                {/* Map Section for Detail */}
                {incident.latitude && incident.longitude && (
                  <div className="mt-4 border-t pt-4">
                    <IncidentMap 
                      latitude={incident.latitude} 
                      longitude={incident.longitude} 
                      height="200px"
                    />
                  </div>
                )}
              </IonCardContent>
            </IonCard>


            {/* Photos Section */}
            <div className="px-4 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold m-0">Photographic Evidence</h2>
                <IonButton 
                  size="small" 
                  fill="outline" 
                  onClick={handleAddPhoto}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <IonSpinner name="crescent" className="mr-2 h-4 w-4" />
                  ) : (
                    <IonIcon icon={cameraOutline} slot="start" />
                  )}
                  {isUploading ? 'Uploading...' : 'Add Photo'}
                </IonButton>
              </div>

              {photos && photos.length > 0 ? (
                <IonGrid fixed className="p-0">
                  <IonRow>
                    {photos.map((photo) => (
                      <IonCol size="6" sizeSm="4" sizeMd="3" key={photo.id}>
                        <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 shadow-sm">
                          <IonImg 
                            src={photo.url} 
                            alt={`Evidence ${photo.id}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
              ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                  <p className="text-gray-400 text-sm">No photos associated with this incident.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Incident not found</p>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}

