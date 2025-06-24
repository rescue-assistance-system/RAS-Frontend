import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
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

const MapComponent = forwardRef(
  (
    { center, zoom, markers, highlightedMarker, onMarkerClick, onShareMarker },
    ref,
  ) => {
    const mapRef = useRef();
    const markersRef = useRef({});

    useImperativeHandle(ref, () => ({
      getMap: () => mapRef.current,
    }));

    // Effect để handle highlighted marker
    useEffect(() => {
      if (highlightedMarker && mapRef.current) {
        const map = mapRef.current;

        // Fly to the highlighted marker position
        map.flyTo(highlightedMarker.position, 15, {
          duration: 2, // Animation duration in seconds
        });

        // Auto-open popup cho highlighted marker
        setTimeout(() => {
          const markerKey = `${highlightedMarker.type}-${highlightedMarker.id}`;
          const markerInstance = markersRef.current[markerKey];
          if (markerInstance) {
            markerInstance.openPopup();
          }
        }, 2500); // Delay để animation hoàn thành
      }
    }, [highlightedMarker]);

    const getMarkerIcon = (marker) => {
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

    // Get display name based on marker type
    const getDisplayName = (marker) => {
      if (marker.type === 'case') {
        console.log('Case Marker:', marker);
        return (
          marker.sender ||
          marker.name ||
          marker.user_name ||
          `Case ${marker.caseId || marker.id}`
        );
      } else if (marker.type === 'team') {
        console.log('Team Marker:', marker);
        return (
          marker.popup ||
          marker.teamName ||
          marker.name ||
          `Team ${marker.teamId || marker.id}`
        );
      }
      return marker.name || marker.id;
    };

    // Get additional info to display
    const getAdditionalInfo = (marker) => {
      const info = [];

      if (marker.type === 'case') {
        if (marker.phone) info.push(`Phone: ${marker.phone}`);
        if (marker.location) info.push(`Location: ${marker.location}`);
        if (marker.emergency_type) info.push(`Type: ${marker.emergency_type}`);
      } else if (marker.type === 'team') {
        if (marker.contact) info.push(`Contact: ${marker.contact}`);
        if (marker.specialization)
          info.push(`Specialization: ${marker.specialization}`);
        if (marker.members_count) info.push(`Members: ${marker.members_count}`);
      }

      return info;
    };

    // Check if marker is highlighted
    const isHighlighted = (marker) => {
      return (
        highlightedMarker &&
        highlightedMarker.id === marker.id &&
        highlightedMarker.type === marker.type
      );
    };

    return (
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        key={`${center[0]}-${center[1]}-${zoom}`} // Force re-render when center/zoom changes
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {markers.map((marker, index) => {
          const displayName = getDisplayName(marker);
          const additionalInfo = getAdditionalInfo(marker);
          const markerKey = `${marker.type}-${marker.id || index}`;
          const highlighted = isHighlighted(marker);

          return (
            <Marker
              key={markerKey}
              position={marker.position}
              icon={getMarkerIcon(marker)}
              ref={(markerInstance) => {
                if (markerInstance) {
                  markersRef.current[markerKey] = markerInstance;
                }
              }}
              zIndexOffset={highlighted ? 1000 : 0} // Bring highlighted marker to front
            >
              <Popup>
                <div
                  className={`p-3 min-w-48 ${highlighted ? 'border-2 border-blue-500 bg-blue-50' : ''}`}
                >
                  <h3 className="font-bold text-lg mb-2">
                    {marker.type === 'case' ? 'Emergency Case' : 'Rescue Team'}
                    {highlighted && (
                      <span className="ml-2 text-blue-600">📍</span>
                    )}
                  </h3>

                  <p className="text-sm mb-2">
                    <strong>Name:</strong> {displayName}
                  </p>

                  {marker.type === 'case' && (marker.caseId || marker.id) && (
                    <p className="text-sm mb-2">
                      <strong>Created At:</strong> {marker.createdAt || marker.id}
                    </p>
                  )}

                  {marker.type === 'team' && (marker.teamId || marker.id) && (
                    <p className="text-sm mb-2">
                      <strong>Team ID:</strong> {marker.teamId || marker.id}
                    </p>
                  )}

                  {additionalInfo.map((info, idx) => (
                    <p key={idx} className="text-sm mb-1">
                      <strong>{info}</strong>
                    </p>
                  ))}

                  {marker.description && (
                    <p className="text-sm mb-2">
                      <strong>Description:</strong> {marker.description}
                    </p>
                  )}

                  {marker.status && (
                    <p className="text-sm mb-2">
                      <strong>Status:</strong>
                      <span
                        className={`ml-1 px-2 py-1 rounded text-xs ${
                          marker.status === 'available'
                            ? 'bg-green-100 text-green-800'
                            : marker.status === 'busy'
                              ? 'bg-red-100 text-red-800'
                              : marker.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : marker.status === 'accepted'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {marker.status}
                      </span>
                    </p>
                  )}

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => onShareMarker && onShareMarker(marker)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 flex items-center gap-1"
                    >
                      <span>📤</span> Share
                    </button>
                    {marker.type === 'case' && (
                      <button
                        onClick={() => onMarkerClick && onMarkerClick(marker)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Details
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    );
  },
);

MapComponent.displayName = 'MapComponent';

export default MapComponent;
