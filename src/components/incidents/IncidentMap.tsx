import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Fix for default marker icons in Leaflet with bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface IncidentMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  height?: string;
  className?: string;
  interactive?: boolean;
}

// Helper component to update map view when coordinates change
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export function IncidentMap({ 
  latitude, 
  longitude, 
  zoom = 15, 
  height = '200px', 
  className = '',
  interactive = true 
}: IncidentMapProps) {
  const position: [number, number] = [latitude, longitude];

  return (
    <div 
      className={`rounded-lg overflow-hidden shadow-inner border border-gray-200 ${className}`} 
      style={{ height, width: '100%', zIndex: 0 }}
    >
      <MapContainer 
        center={position} 
        zoom={zoom} 
        scrollWheelZoom={interactive}
        dragging={interactive}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            Incident Location
          </Popup>
        </Marker>
        <ChangeView center={position} zoom={zoom} />
      </MapContainer>
    </div>
  );
}
