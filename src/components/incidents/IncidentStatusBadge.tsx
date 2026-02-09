import { IonBadge } from '@ionic/react';
import type { IncidentStatus } from '../../models/incident.model';
import { STATUS_LABELS, STATUS_COLORS } from '../../utils/constants';

interface IncidentStatusBadgeProps {
  status: IncidentStatus;
}

export function IncidentStatusBadge({ status }: IncidentStatusBadgeProps) {
  return (
    <IonBadge color={STATUS_COLORS[status]}>
      {STATUS_LABELS[status]}
    </IonBadge>
  );
}
