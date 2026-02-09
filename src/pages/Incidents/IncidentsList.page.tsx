import { IonPage, IonContent, IonButton, IonIcon, IonRefresher, IonRefresherContent } from '@ionic/react';
import { addOutline, folderOpenOutline } from 'ionicons/icons';
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
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {isLoading ? (
          <Loader message="Loading incidents..." />
        ) : incidents && incidents.length > 0 ? (
          <div className="space-y-2">
            {incidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onClick={() => handleIncidentClick(incident.id)}
              />
            ))}
          </div>
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
