import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { supabase } from './supabase.client';
import { IncidentPhoto } from '../models/incident.model';

const BUCKET_NAME = 'incident-photos';

export const incidentPhotoService = {
  async takePhoto() {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt, // Ask user for camera or gallery
    });
  },

  async uploadIncidentPhoto(incidentId: string): Promise<IncidentPhoto> {
    const photo = await this.takePhoto();
    
    if (!photo.base64String) {
      throw new Error('Failed to get photo data');
    }

    return await this.uploadPhotoData(incidentId, photo.base64String);
  },

  async uploadPhotoData(incidentId: string, base64String: string): Promise<IncidentPhoto> {
    const timestamp = new Date().getTime();
    const filePath = `incidents/${incidentId}/${timestamp}.jpg`;
    
    // Convert base64 to Blob
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    // 1. Upload to Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // 2. Register in DB
    const { data, error: dbError } = await supabase
      .from('incident_photos')
      .insert({
        incident_id: incidentId,
        file_path: filePath
      })
      .select()
      .single();

    if (dbError) {
      // Cleanup storage if DB insert fails
      await supabase.storage.from(BUCKET_NAME).remove([filePath]);
      throw new Error(`Database registration failed: ${dbError.message}`);
    }

    return data as IncidentPhoto;
  },


  async getIncidentPhotos(incidentId: string): Promise<IncidentPhoto[]> {
    const { data, error } = await supabase
      .from('incident_photos')
      .select('*')
      .eq('incident_id', incidentId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch photos: ${error.message}`);
    }

    const photos = data as IncidentPhoto[];

    // Generate signed URLs for each photo
    const photosWithUrls = await Promise.all(
      photos.map(async (photo) => {
        const { data: signedData, error: signedError } = await supabase.storage
          .from(BUCKET_NAME)
          .createSignedUrl(photo.file_path, 3600); // 1 hour expiry

        if (signedError) {
          console.error(`Error generating signed URL for ${photo.file_path}:`, signedError);
          return photo;
        }

        return {
          ...photo,
          url: signedData.signedUrl
        };
      })
    );

    return photosWithUrls;
  }
};
