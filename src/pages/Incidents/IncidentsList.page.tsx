import { useState } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonButton, 
  IonIcon, 
  IonRefresher, 
  IonRefresherContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSegment,
  IonSegmentButton,
  IonLabel
} from '@ionic/react';
import { addOutline, folderOpenOutline, gridOutline, listOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { IncidentCard } from '../../components/incidents/IncidentCard';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { useIncidents } from '../../hooks/useIncidents';
import { APP_ROUTES } from '../../utils/constants';

export function IncidentsListPage() {
  const history = useHistory();
  const { data: incidents, isLoading, refetch } = useIncidents();
  const [viewType, setViewType] = useState<'list' | 'grid'>('list');

  const handleRefresh = async (event: CustomEvent) => {
    await refetch();
    event.detail.complete();
  };

  const handleIncidentClick = (id: string) => {
    history.push(`/app/incidents/${id}`);
  };

  return (
    <IonPage>
      <PageHeader title="Incidents">
        <IonButton fill="clear" routerLink={APP_ROUTES.CREATE}>
          <IonIcon slot="icon-only" icon={addOutline} />
        </IonButton>
      </PageHeader>

      <IonContent className="ion-padding">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-xl font-bold m-0 italic text-gray-800">My Reports</h2>
          <IonSegment 
            value={viewType} 
            onIonChange={(e) => setViewType(e.detail.value as any)}
            className="w-auto"
            style={{ '--background': 'transparent' }}
          >
            <IonSegmentButton value="list" className="min-h-0 py-1">
              <IonIcon icon={listOutline} />
            </IonSegmentButton>
            <IonSegmentButton value="grid" className="min-h-0 py-1">
              <IonIcon icon={gridOutline} />
            </IonSegmentButton>
          </IonSegment>
        </div>

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {isLoading ? (
          <Loader message="Loading incidents..." />
        ) : incidents && incidents.length > 0 ? (
          viewType === 'list' ? (
            <div className="space-y-2">
              {incidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  variant="list"
                  onClick={() => handleIncidentClick(incident.id)}
                />
              ))}
            </div>
          ) : (
            <IonGrid className="p-0">
              <IonRow className="gap-y-3">
                {incidents.map((incident) => (
                  <IonCol size="6" key={incident.id} className="p-1">
                    <IncidentCard
                      incident={incident}
                      variant="grid"
                      onClick={() => handleIncidentClick(incident.id)}
                    />
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          )
        ) : (
          <EmptyState
            icon={folderOpenOutline}
            title="No incidents yet"
            description="Create your first incident to get started"
          />
        )}
      </IonContent>
    </IonPage>
  );
}

