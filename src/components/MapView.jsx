// src/components/MapView.jsx

import { MapContainer, TileLayer } from 'react-leaflet';

function MapView() {
  return (
    <MapContainer
      center={[6.6745, -1.5716]} // Example: Kumasi area
      zoom={13}
      style={{ height: "95vh", width: "100%", }}
      
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}

export default MapView;