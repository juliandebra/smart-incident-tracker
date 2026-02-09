import type { IncidentStatus, IncidentPriority } from '../models/incident.model';

export const APP_ROUTES = {
  INCIDENTS: '/app/incidents',
  INCIDENT_DETAIL: '/app/incidents/:id',
  CREATE: '/app/create',
  DASHBOARD: '/app/dashboard',
  SETTINGS: '/app/settings',
} as const;

export const STATUS_LABELS: Record<IncidentStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

export const PRIORITY_LABELS: Record<IncidentPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const STATUS_COLORS: Record<IncidentStatus, string> = {
  open: 'danger',
  in_progress: 'warning',
  resolved: 'success',
};

export const PRIORITY_COLORS: Record<IncidentPriority, string> = {
  low: 'medium',
  medium: 'warning',
  high: 'danger',
};
