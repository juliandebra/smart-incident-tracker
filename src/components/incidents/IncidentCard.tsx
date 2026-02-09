import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon } from '@ionic/react';
import { locationOutline, timeOutline } from 'ionicons/icons';
import type { Incident } from '../../models/incident.model';
import { IncidentStatusBadge } from './IncidentStatusBadge';
import { IncidentPriorityBadge } from './IncidentPriorityBadge';
import { formatRelativeTime } from '../../utils/date';

interface IncidentCardProps {
  incident: Incident;
  onClick?: () => void;
  variant?: 'list' | 'grid';
}

export function IncidentCard({ incident, onClick, variant = 'list' }: IncidentCardProps) {
  const isGrid = variant === 'grid';

  return (
    <IonCard button onClick={onClick} className={`${isGrid ? 'm-0 h-full' : ''}`}>
      <IonCardHeader className={`${isGrid ? 'p-3' : ''}`}>
        <div className={`flex items-start justify-between gap-2 ${isGrid ? 'flex-col' : 'mb-1'}`}>
          <IonCardTitle className={`${isGrid ? 'text-sm font-bold line-clamp-2' : 'text-base'}`}>
            {incident.title}
          </IonCardTitle>
          <div className="flex gap-1 flex-shrink-0">
            <IncidentPriorityBadge priority={incident.priority} />
            {!isGrid && <IncidentStatusBadge status={incident.status} />}
          </div>
        </div>
      </IonCardHeader>
      <IonCardContent className={`${isGrid ? 'p-3 pt-0' : ''}`}>
        {!isGrid && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {incident.description}
          </p>
        )}
        <div className={`flex ${isGrid ? 'flex-col gap-1' : 'items-center gap-4'} text-xs text-gray-500`}>
          {incident.location && (
            <span className="flex items-center gap-1 truncate">
              <IonIcon icon={locationOutline} />
              {incident.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <IonIcon icon={timeOutline} />
            {formatRelativeTime(incident.created_at)}
          </span>
          {isGrid && (
            <div className="mt-2">
              <IncidentStatusBadge status={incident.status} />
            </div>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
}

