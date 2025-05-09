import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  AttributionControl,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PropTypes from 'prop-types';

delete L.Icon.Default.prototype._getIconUrl;

const createIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

const MapComponent = ({ center, zoom, markers }) => {
  const mapStyles = {
    streets: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
      name: 'OpenStreetMap Streets',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution:
        '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      name: 'Satellite',
    },
    dark: {
      url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
      attribution:
        '&copy; Stadia Maps, &copy; OpenMapTiles &copy; OpenStreetMap contributors',
      name: 'Dark Mode',
    },
    terrain: {
      url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png',
      attribution:
        'Map tiles by Stamen Design, CC BY 3.0 — Map data &copy; OpenStreetMap',
      name: 'Terrain',
    },
  };

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        <LayersControl position="topright">
          {Object.entries(mapStyles).map(([key, style]) => (
            <LayersControl.BaseLayer
              key={key}
              checked={key === 'streets'}
              name={style.name}
            >
              <TileLayer url={style.url} attribution={style.attribution} />
            </LayersControl.BaseLayer>
          ))}
        </LayersControl>

        <AttributionControl position="bottomright" prefix={false} />

        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            icon={createIcon(marker.color)}
          >
            <Popup>
              <div className="p-2">
                <div className="font-semibold mb-2">{marker.popup}</div>
                <div className="text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Status:</span>{' '}
                    <span className={`text-${marker.color}-500`}>
                      {marker.status}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

MapComponent.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoom: PropTypes.number.isRequired,
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      position: PropTypes.arrayOf(PropTypes.number).isRequired,
      popup: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default MapComponent;
