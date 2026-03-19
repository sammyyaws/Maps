import { MapContainer, TileLayer, Polyline, Marker, CircleMarker} from 'react-leaflet';

function MapView({ path, position, savedLocations }) {

  return (
    <MapContainer
      center={position}
      zoom={19}
      style={{ height: "40vh", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* path */}
      <Polyline positions={path} pathOptions={{ weight: 5 }} />

      {/* current position */}
      {position && (
        <CircleMarker
          center={position}
          radius={6}
          fillOpacity={1}
        />
      )}

      {/* pinned locations */}
      {savedLocations?.map((loc, i) => (
         <Marker key={i} position={loc} />
      ))}

    </MapContainer>
  );
}

export default MapView;