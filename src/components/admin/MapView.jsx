import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ✅ Tạo custom icons
const createCustomIcon = (emoji, color) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${emoji}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

const ICONS = {
  // Team icons
  teamAvailable: createCustomIcon('🚑', '#10B981'), // Green
  teamBusy: createCustomIcon('🚑', '#EF4444'), // Red

  // Case icons
  casePending: createCustomIcon('⚠️', '#F59E0B'), // Orange/Yellow
  caseAccepted: createCustomIcon('🔄', '#F97316'), // Orange
  caseReady: createCustomIcon('🚨', '#8B5CF6'), // Purple
};

const MapComponent = ({ center, zoom, markers }) => {
  const getMarkerIcon = (marker) => {
    console.log(`Marker type: ${marker.type}, status: ${marker.status}`);
    if (marker.type === 'team') {
      return marker.status === 'available'
        ? ICONS.teamAvailable
        : ICONS.teamBusy;
    } else if (marker.type === 'case') {
      switch (marker.status) {
        case 'pending':
          return ICONS.casePending;
        case 'accepted':
          return ICONS.caseAccepted;
        case 'ready':
          return ICONS.caseReady;
        default:
          return ICONS.casePending;
      }
    }
    return ICONS.teamAvailable;
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {markers.map((marker, index) => (
        <Marker
          key={`${marker.type}-${index}`}
          position={marker.position}
          icon={getMarkerIcon(marker)}
        >
          <Popup>
            <div>
              <strong>
                {marker.type === 'team' ? 'Rescue Team' : 'SOS Case'}
              </strong>
              <br />
              {marker.popup}
              {marker.type === 'team' && marker.teamName && marker.status && (
                <>
                  <br />
                  <strong>Team:</strong> {marker.teamName}
                  <br />
                  <strong>Status:</strong> {marker.status}
                </>
              )}
              {marker.type === 'case' && marker.caseId && (
                <>
                  <br />
                  <strong>Case ID:</strong> {marker.caseId}
                </>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
