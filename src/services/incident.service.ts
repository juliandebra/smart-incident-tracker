import { supabase } from './supabase.client';
import { authService } from './auth.service';
import type { Incident, CreateIncidentPayload, UpdateIncidentPayload } from '../models/incident.model';

const TABLE_NAME = 'incidents';

// Mock data for development without Supabase
const MOCK_INCIDENTS: Incident[] = [
  {
    id: '1',
    title: 'Server down in Building A',
    description: 'Main server is unresponsive since 10:00 AM',
    status: 'open',
    priority: 'high',
    location: 'Building A, Room 101',
    latitude: -34.6037,
    longitude: -58.3816,
    reporter_id: 'user-1',
    created_at: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Network connectivity issues',
    description: 'Intermittent WiFi connection on floor 3',
    status: 'in_progress',
    priority: 'medium',
    location: 'Building B, Floor 3',
    latitude: -34.6050,
    longitude: -58.3800,
    reporter_id: 'user-1',
    assignee_id: 'user-2',
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Printer not working',
    description: 'Paper jam in main office printer',
    status: 'resolved',
    priority: 'low',
    location: 'Main Office',
    latitude: -34.6020,
    longitude: -58.3850,
    reporter_id: 'user-2',
    assignee_id: 'user-3',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    resolved_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '4',
    title: 'Emergency: Fire alarm malfunction',
    description: 'Fire alarm system showing false positives in west wing',
    status: 'open',
    priority: 'high',
    location: 'West Wing, All Floors',
    latitude: -34.6045,
    longitude: -58.3830,
    reporter_id: 'user-3',
    created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    updated_at: new Date().toISOString(),
  },
];

const isSupabaseConfigured = () => {
  return import.meta.env.VITE_SUPABASE_URL && 
         import.meta.env.VITE_SUPABASE_ANON_KEY &&
         !import.meta.env.VITE_SUPABASE_URL.includes('placeholder');
};

export const incidentService = {
  async getIncidents(): Promise<Incident[]> {
    if (!isSupabaseConfigured()) {
      return MOCK_INCIDENTS;
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getIncidentById(id: string): Promise<Incident | null> {
    if (!isSupabaseConfigured()) {
      return MOCK_INCIDENTS.find(i => i.id === id) || null;
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createIncident(payload: CreateIncidentPayload): Promise<Incident> {
    const user = await authService.ensureSession();
    
    if (!isSupabaseConfigured()) {
      const newIncident: Incident = {
        id: crypto.randomUUID(),
        ...payload,
        status: 'open',
        reporter_id: user?.id || 'mock-user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      MOCK_INCIDENTS.unshift(newIncident);
      return newIncident;
    }

    if (!user) throw new Error('Authentication required to create incidents.');

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({
        ...payload,
        status: 'open',
        reporter_id: user.id, // Ensure real reporter_id for RLS
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateIncident(id: string, payload: UpdateIncidentPayload): Promise<Incident> {
    if (!isSupabaseConfigured()) {
      const idx = MOCK_INCIDENTS.findIndex(i => i.id === id);
      if (idx === -1) throw new Error('Incident not found');
      MOCK_INCIDENTS[idx] = { 
        ...MOCK_INCIDENTS[idx], 
        ...payload, 
        updated_at: new Date().toISOString() 
      };
      return MOCK_INCIDENTS[idx];
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteIncident(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      const idx = MOCK_INCIDENTS.findIndex(i => i.id === id);
      if (idx !== -1) MOCK_INCIDENTS.splice(idx, 1);
      return;
    }

    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
