import { useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentService } from '../services/incident.service';
import { INCIDENTS_QUERY_KEY } from './useIncidents';
import type { CreateIncidentPayload } from '../models/incident.model';

export function useCreateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateIncidentPayload) => 
      incidentService.createIncident(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INCIDENTS_QUERY_KEY });
    },
  });
}
