import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon } from '@ionic/react';
import { locationOutline, timeOutline } from 'ionicons/icons';
import type { Incident } from '../../models/incident.model';
import { IncidentStatusBadge } from './IncidentStatusBadge';
import { IncidentPriorityBadge } from './IncidentPriorityBadge';
import { formatRelativeTime } from '../../utils/date';

interface IncidentCardProps {
  incident: Incident;
  onClick?: () => void;
}

export function IncidentCard({ incident, onClick }: IncidentCardProps) {
  return (
    <IonCard button onClick={onClick}>
      <IonCardHeader>
        <div className="flex items-start justify-between gap-2">
          <IonCardTitle className="text-base">{incident.title}</IonCardTitle>
          <div className="flex gap-1 flex-shrink-0">
            <IncidentPriorityBadge priority={incident.priority} />
            <IncidentStatusBadge status={incident.status} />
          </div>
        </div>
      </IonCardHeader>
      <IonCardContent>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {incident.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {incident.location && (
            <span className="flex items-center gap-1">
              <IonIcon icon={locationOutline} />
              {incident.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <IonIcon icon={timeOutline} />
            {formatRelativeTime(incident.created_at)}
          </span>
        </div>
      </IonCardContent>
    </IonCard>
  );
}
