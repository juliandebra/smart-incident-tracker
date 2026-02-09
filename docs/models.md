# Data Models

This document outlines the core TypeScript models and their corresponding representation in the database.

## 📋 Incident Model

The `Incident` interface is the heart of the application.

```typescript
export interface Incident {
  id: string;               // UUID
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  location?: string;        // Human-readable description
  latitude?: number;        // GPS Coordinate
  longitude?: number;       // GPS Coordinate
  reporter_id: string;      // Linked to AppUser.id
  assignee_id?: string;     // Linked to AppUser.id
  created_at: string;       // ISO Timestamp
  updated_at: string;
  resolved_at?: string;
}
```

## 👤 User Model

The `AppUser` interface maps metadata from Supabase Authentication.

```typescript
export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'technician' | 'viewer';
  avatar_url?: string;
  created_at: string;
}
```

## 📤 Payload Types

To ensure type safety during mutations, we use specific payload types:
- `CreateIncidentPayload`: Required fields for new incidents.
- `UpdateIncidentPayload`: Partial fields for updates (e.g., changing status).
