import { useQuery } from '@tanstack/react-query';
import { incidentService } from '../services/incident.service';

export const INCIDENTS_QUERY_KEY = ['incidents'];

export function useIncidents() {
  return useQuery({
    queryKey: INCIDENTS_QUERY_KEY,
    queryFn: () => incidentService.getIncidents(),
  });
}

export function useIncidentById(id: string) {
  return useQuery({
    queryKey: [...INCIDENTS_QUERY_KEY, id],
    queryFn: () => incidentService.getIncidentById(id),
    enabled: !!id,
  });
}
