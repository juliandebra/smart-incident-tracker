import { useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentService } from '../services/incident.service';
import { INCIDENTS_QUERY_KEY } from './useIncidents';
import type { CreateIncidentPayload } from '../models/incident.model';
import { settingsService } from '../services/settings.service';
import { notificationService } from '../services/notification.service';

export function useCreateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateIncidentPayload) => {
      const result = await incidentService.createIncident(payload);
      // Return both result and original payload for onSuccess
      return { result, payload };
    },
    onSuccess: ({ payload }) => {
      queryClient.invalidateQueries({ queryKey: INCIDENTS_QUERY_KEY });

      // Trigger notification for medium/high priority if enabled
      if (settingsService.isNotificationsEnabled() && 
          (payload.priority === 'medium' || payload.priority === 'high')) {
        const priorityLabel = payload.priority === 'high' ? '🔴 High' : '🟡 Medium';
        notificationService.scheduleNotification(
          `New Incident (${priorityLabel})`,
          payload.title
        );
      }
    },
  });
}

