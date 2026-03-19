import L from "leaflet"
import { useEffect, useState } from "react";
import { MapContainer, TileLayer,Popup,useMap,Polyline,Marker,CircleMarker } from 'react-leaflet';









function MapView() {
  const [position,setPosition]=useState(null)
  const[path,setPath]=useState([])

useEffect(()=>{
  if(!navigator.geolocation){
    alert("turn on your location in settings");
    return;
  }
//watch live location
  const watchId=navigator.geolocation.watchPosition(
    (pos)=>{
      const newPos=[pos.coords.latitude,pos.coords.longitude];
      setPosition(newPos);
      setPath((prev)=>[...prev,newPos])
    }, (err) => {
    if (err.code === 1) alert("Please allow location access on your phone");
    else console.error(err);
  },{
      enableHighAccuracy:true,
      maximumAge:0,
      timeout:5000
    }
  );
  return ()=>navigator.geolocation.clearWatch(watchId)

},[])

 if (!position) {
    return <div>Getting your location...</div>;
  }

  return (<>
    <MapContainer
      center={position} // Example: Kumasi area
      zoom={19}
      style={{ height: "60vh", width: "100%", }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
  
      {/**path */}
      <Polyline positions={path} pathOptions={{weight:5}}/>
      {/* The circle at the tip */}
{position && (
  <CircleMarker
    center={position}
    radius={6}       // size of the circle
    fillOpacity={1}  
  />
)}
    </MapContainer>

    </>
  );
}

export default MapView;