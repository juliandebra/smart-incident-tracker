export type IncidentStatus = 'open' | 'in_progress' | 'resolved';

export type IncidentPriority = 'low' | 'medium' | 'high';

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  location?: string;
  latitude?: number;
  longitude?: number;
  assignee_id?: string;
  reporter_id: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface CreateIncidentPayload {
  title: string;
  description: string;
  priority: IncidentPriority;
  location?: string;
  latitude?: number;
  longitude?: number;
}


export interface UpdateIncidentPayload {
  title?: string;
  description?: string;
  status?: IncidentStatus;
  priority?: IncidentPriority;
  location?: string;
  latitude?: number;
  longitude?: number;
  assignee_id?: string;
}

export interface IncidentPhoto {
  id: string;
  incident_id: string;
  file_path: string;
  created_at: string;
  url?: string;
}

