# Geolocation System

The geolocation system uses `@capacitor/geolocation` to provide precise incident location data for field reports.

## 🛰 Capacitor Geolocation Integration

We use the native Capacitor plugin to ensure reliability and cross-platform compatibility (Android and iOS).

### `useGeolocation` Hook
A reusable custom hook that abstracts the complexity of GPS coordinate fetching:

- **Permission Management**: Automatically checks and requests permissions using `Geolocation.requestPermissions()`.
- **State Handling**: Tracks `latitude`, `longitude`, `isLoading`, and `error` states.
- **Formatted Preview**: Provides a `formattedCoords` helper (e.g., `"-34.60, -58.38"`) for UI display.

## 🛠 Usage in Components

In the `CreateIncidentPage`, the system allows:
1. **Manual Override**: Users can still type a human-readable location (e.g., "Basement").
2. **GPS Capture**: Tapping "Use current location" fetches exact coordinates.
3. **Data Integrity**: Coordinates are stored as optional `number` fields (`latitude`, `longitude`) in the database, separate from the text-based `location` description.

## 📍 Nearby Incidents (Dashboard)
The Dashboard uses the **Haversine formula** to calculate the distance between the user's current position and existing incidents in real-time, displaying a "Near You" indicator for incidents within 5km.
