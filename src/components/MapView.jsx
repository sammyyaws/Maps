import { MapContainer, TileLayer, Polyline, Marker, CircleMarker,Popup} from 'react-leaflet';

function MapView({ path, position, savedLocations, handleSetSelectedLocation, selectedLocation}) {

  return (
    <MapContainer
      center={position}
      zoom={19}
      style={{ height: "40vh", width: "98%",}}
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

{selectedLocation.length >= 2 && (
  <Polyline
    positions={selectedLocation.map(loc => loc.coords)}
    pathOptions={{ color: "red", weight: 4 }}
  />
)}

      

      {/* saved  locations marker*/}
  {savedLocations?.map((loc, i) => {
  const isSelected = selectedLocation?.some(l => l.name === loc.name);

  return (
    <Marker
      key={i}
      position={loc.coords}
      eventHandlers={{
        click: () => handleSetSelectedLocation(loc)
      }}
    >
      <Popup>{loc.name}</Popup>

      {/* Highlight selected nodes */}
      {isSelected && (
        <CircleMarker
          center={loc.coords}
          radius={10}
          pathOptions={{ color: "red" }}
        />
      )}
    </Marker>
  );
})}

    </MapContainer>
  );
}

export default MapView;