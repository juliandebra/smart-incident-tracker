import { useState, useCallback } from 'react';
import { Geolocation, Position } from '@capacitor/geolocation';

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean | null;
}

export interface UseGeolocationReturn extends GeolocationState {
  getCurrentPosition: () => Promise<void>;
  clearPosition: () => void;
  formattedCoords: string | null;
}

export function useGeolocation(): UseGeolocationReturn {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    isLoading: false,
    error: null,
    hasPermission: null,
  });

  const getCurrentPosition = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check permissions first
      const permissions = await Geolocation.checkPermissions();
      
      if (permissions.location === 'denied') {
        // Try to request permissions
        const requested = await Geolocation.requestPermissions();
        if (requested.location === 'denied') {
          setState(prev => ({
            ...prev,
            isLoading: false,
            hasPermission: false,
            error: 'Location permission denied. Please enable it in settings.',
          }));
          return;
        }
      }

      setState(prev => ({ ...prev, hasPermission: true }));

      // Get current position
      const position: Position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        isLoading: false,
        error: null,
        hasPermission: true,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  const clearPosition = useCallback(() => {
    setState({
      latitude: null,
      longitude: null,
      isLoading: false,
      error: null,
      hasPermission: state.hasPermission,
    });
  }, [state.hasPermission]);

  const formattedCoords = state.latitude && state.longitude
    ? `${state.latitude.toFixed(4)}, ${state.longitude.toFixed(4)}`
    : null;

  return {
    ...state,
    getCurrentPosition,
    clearPosition,
    formattedCoords,
  };
}
