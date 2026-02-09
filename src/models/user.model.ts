export type UserRole = 'admin' | 'technician' | 'viewer';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}
