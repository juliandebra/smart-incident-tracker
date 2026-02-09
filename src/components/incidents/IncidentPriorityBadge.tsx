import { IonBadge } from '@ionic/react';
import type { IncidentPriority } from '../../models/incident.model';
import { PRIORITY_LABELS, PRIORITY_COLORS } from '../../utils/constants';

interface IncidentPriorityBadgeProps {
  priority: IncidentPriority;
}

export function IncidentPriorityBadge({ priority }: IncidentPriorityBadgeProps) {
  return (
    <IonBadge color={PRIORITY_COLORS[priority]}>
      {PRIORITY_LABELS[priority]}
    </IonBadge>
  );
}
