import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentPhotoService } from '../services/incidentPhotoService';

export const PHOTO_QUERY_KEY = 'incident-photos';

export function useIncidentPhotos(incidentId: string) {
  return useQuery({
    queryKey: [PHOTO_QUERY_KEY, incidentId],
    queryFn: () => incidentPhotoService.getIncidentPhotos(incidentId),
    enabled: !!incidentId,
  });
}

export function useUploadPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (incidentId: string) => incidentPhotoService.uploadIncidentPhoto(incidentId),
    onSuccess: (_, incidentId) => {
      queryClient.invalidateQueries({ queryKey: [PHOTO_QUERY_KEY, incidentId] });
    },
  });
}
