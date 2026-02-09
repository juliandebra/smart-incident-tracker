import { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import type { AppUser } from '../models/user.model';

interface AuthState {
  user: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Silent technical login if no session exists
        const currentUser = await authService.ensureSession();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
