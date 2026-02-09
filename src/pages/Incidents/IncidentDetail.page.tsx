import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonChip, IonLabel } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { locationOutline, timeOutline, personOutline } from 'ionicons/icons';
import { PageHeader } from '../../components/layout/PageHeader';
import { IncidentStatusBadge } from '../../components/incidents/IncidentStatusBadge';
import { IncidentPriorityBadge } from '../../components/incidents/IncidentPriorityBadge';
import { Loader } from '../../components/ui/Loader';
import { useIncidentById } from '../../hooks/useIncidents';
import { formatDateTime } from '../../utils/date';

export function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: incident, isLoading } = useIncidentById(id);

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
              </IonCardContent>
            </IonCard>
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
