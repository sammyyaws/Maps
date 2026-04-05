import { useMemo } from 'react'
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  CircleMarker,
  Popup,
} from 'react-leaflet'
import L from 'leaflet'
import MapControls from './MapControls'

const pinIcon = L.divIcon({
  className: 'mapout-pin-icon',
  html: `
    <div class="mapout-pin-wrap" aria-hidden="true">
      <svg viewBox="0 0 24 36" width="32" height="40" xmlns="http://www.w3.org/2000/svg">
        <path fill="#2563eb" d="M12 0C7.03 0 3 4.03 3 9c0 7.5 9 18 9 18s9-10.5 9-18c0-4.97-4.03-9-9-9z"/>
        <circle cx="12" cy="9" r="4" fill="#fff"/>
      </svg>
      <span class="mapout-pin-dot"></span>
    </div>
  `,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -36],
})

function MapView({
  path,
  position,
  savedLocations,
  handleSetSelectedLocation,
  selectedLocation,
  routeLinePositions,
}) {
  const trailPositions = useMemo(() => {
    if (!path?.length) return []
    return path
  }, [path])

  return (
    <MapContainer
      center={position}
      zoom={17}
      className="mapout-leaflet z-0 h-full w-full min-h-0"
      zoomControl={false}
      preferCanvas
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapControls position={position} gpsLive={Boolean(position)} />

      {trailPositions.length > 1 && (
        <Polyline
          positions={trailPositions}
          pathOptions={{
            weight: 4,
            color: '#00a86b',
            opacity: 0.9,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      )}

      {position && (
        <CircleMarker
          center={position}
          radius={7}
          pathOptions={{
            color: '#00a86b',
            fillColor: '#5ee4b8',
            fillOpacity: 0.95,
            weight: 2,
          }}
        />
      )}

      {routeLinePositions?.length >= 2 && (
        <Polyline
          positions={routeLinePositions}
          pathOptions={{
            color: '#7c3aed',
            weight: 5,
            opacity: 0.92,
            dashArray: '10 8',
            lineCap: 'round',
          }}
        />
      )}

      {selectedLocation?.map((loc) => (
        <CircleMarker
          key={`ring-${loc.name}`}
          center={loc.coords}
          radius={14}
          pathOptions={{
            color: '#a855f7',
            fillOpacity: 0,
            weight: 3,
          }}
        />
      ))}

      {savedLocations?.map((loc, i) => (
        <Marker
          key={`${loc.name}-${i}`}
          position={loc.coords}
          icon={pinIcon}
          eventHandlers={{
            click: () => handleSetSelectedLocation(loc),
          }}
        >
          <Popup className="mapout-popup">{loc.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapView
