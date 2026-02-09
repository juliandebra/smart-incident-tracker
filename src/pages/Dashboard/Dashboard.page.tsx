import { useMemo } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonIcon,
  IonChip,
  IonNote,
  IonRefresher,
  IonRefresherContent
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { 
  alertCircle, 
  timeOutline, 
  locationOutline,
  flashOutline,
  checkmarkCircleOutline,
  constructOutline
} from 'ionicons/icons';
import { PageHeader } from '../../components/layout/PageHeader';
import { IncidentPriorityBadge } from '../../components/incidents/IncidentPriorityBadge';
import { useIncidents } from '../../hooks/useIncidents';
import { useGeolocation } from '../../hooks/useGeolocation';
import { formatRelativeTime } from '../../utils/date';
import type { Incident } from '../../models/incident.model';

// Calculate distance between two coordinates in km (Haversine)
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function DashboardPage() {
  const history = useHistory();
  const { data: incidents, refetch } = useIncidents();
  const geo = useGeolocation();

  const handleRefresh = async (event: CustomEvent) => {
    await refetch();
    event.detail.complete();
  };

  // Derived statistics
  const stats = useMemo(() => {
    if (!incidents) return { 
      total: 0, open: 0, inProgress: 0, resolved: 0, 
      criticalCount: 0, nearbyCount: 0, recentIncidents: [] as Incident[]
    };

    const open = incidents.filter(i => i.status === 'open');
    const inProgress = incidents.filter(i => i.status === 'in_progress');
    const resolved = incidents.filter(i => i.status === 'resolved');
    const critical = open.filter(i => i.priority === 'high');
    
    // Calculate nearby incidents (within 5km)
    let nearbyCount = 0;
    if (geo.latitude && geo.longitude) {
      nearbyCount = incidents.filter(i => {
        if (!i.latitude || !i.longitude) return false;
        return getDistanceKm(geo.latitude!, geo.longitude!, i.latitude, i.longitude) <= 5;
      }).length;
    }

    // Recent incidents (last 3, sorted by created_at)
    const recentIncidents = [...incidents]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3);

    return {
      total: incidents.length,
      open: open.length,
      inProgress: inProgress.length,
      resolved: resolved.length,
      criticalCount: critical.length,
      nearbyCount,
      recentIncidents,
    };
  }, [incidents, geo.latitude, geo.longitude]);

  const criticalIncidents = useMemo(() => 
    incidents?.filter(i => i.status === 'open' && i.priority === 'high') || [],
  [incidents]);

  return (
    <IonPage>
      <PageHeader title="Dashboard" />

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="p-4 space-y-4">
          {/* Critical Alerts Section */}
          {criticalIncidents.length > 0 && (
            <IonCard color="danger">
              <IonCardHeader>
                <IonCardTitle className="flex items-center gap-2 text-lg">
                  <IonIcon icon={alertCircle} />
                  Urgent Attention Required
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList lines="none" className="bg-transparent">
                  {criticalIncidents.map(incident => (
                    <IonItem 
                      key={incident.id} 
                      button 
                      detail 
                      className="--background: transparent"
                      onClick={() => history.push(`/app/incidents/${incident.id}`)}
                    >
                      <IonIcon icon={flashOutline} slot="start" />
                      <IonLabel>
                        <h3 className="font-medium">{incident.title}</h3>
                        <p className="text-xs opacity-80">
                          {formatRelativeTime(incident.created_at)}
                        </p>
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </IonCardContent>
            </IonCard>
          )}

          {/* Status Overview Cards */}
          <div className="grid grid-cols-3 gap-3">
            <IonCard className="m-0">
              <IonCardContent className="text-center py-4">
                <IonIcon icon={alertCircle} color="danger" className="text-2xl" />
                <p className="text-2xl font-bold mt-1">{stats.open}</p>
                <p className="text-xs text-gray-500">Open</p>
              </IonCardContent>
            </IonCard>

            <IonCard className="m-0">
              <IonCardContent className="text-center py-4">
                <IonIcon icon={constructOutline} color="warning" className="text-2xl" />
                <p className="text-2xl font-bold mt-1">{stats.inProgress}</p>
                <p className="text-xs text-gray-500">In Progress</p>
              </IonCardContent>
            </IonCard>

            <IonCard className="m-0">
              <IonCardContent className="text-center py-4">
                <IonIcon icon={checkmarkCircleOutline} color="success" className="text-2xl" />
                <p className="text-2xl font-bold mt-1">{stats.resolved}</p>
                <p className="text-xs text-gray-500">Resolved</p>
              </IonCardContent>
            </IonCard>
          </div>

          {/* Contextual Info Chips */}
          <div className="flex flex-wrap gap-2">
            {stats.criticalCount > 0 && (
              <IonChip color="danger">
                <IonIcon icon={flashOutline} />
                <IonLabel>{stats.criticalCount} Critical</IonLabel>
              </IonChip>
            )}
            {stats.nearbyCount > 0 && geo.latitude && (
              <IonChip color="primary">
                <IonIcon icon={locationOutline} />
                <IonLabel>{stats.nearbyCount} Near You</IonLabel>
              </IonChip>
            )}
            {!geo.latitude && (
              <IonChip 
                color="medium" 
                outline 
                onClick={() => geo.getCurrentPosition()}
              >
                <IonIcon icon={locationOutline} />
                <IonLabel>Enable Location</IonLabel>
              </IonChip>
            )}
          </div>

          {/* Recent Activity Section */}
          <IonCard className="m-0">
            <IonCardHeader>
              <IonCardTitle className="flex items-center gap-2 text-base">
                <IonIcon icon={timeOutline} />
                Recent Activity
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="p-0">
              <IonList>
                {stats.recentIncidents.map(incident => (
                  <IonItem 
                    key={incident.id} 
                    button 
                    detail
                    onClick={() => history.push(`/app/incidents/${incident.id}`)}
                  >
                    <IonLabel>
                      <h3 className="text-sm font-medium">{incident.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <IonBadge 
                          color={
                            incident.status === 'open' ? 'danger' : 
                            incident.status === 'in_progress' ? 'warning' : 'success'
                          }
                        >
                          {incident.status.replace('_', ' ')}
                        </IonBadge>
                        <IncidentPriorityBadge priority={incident.priority} />
                      </div>
                    </IonLabel>
                    <IonNote slot="end" className="text-xs">
                      {formatRelativeTime(incident.created_at)}
                    </IonNote>
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}
