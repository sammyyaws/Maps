import { useState, useEffect } from 'react'
import MapView from './components/MapView'
import ControlCards from './ControlCards'
import "./config/leaflet"
import NameCard from './NameCard'

function App() {
  const [position, setPosition] = useState(null)
  const [path, setPath] = useState([])
  const [savedLocations, setSavedLocations] = useState([])
 const [showNameCard,setShowNameCard]=useState(false)
 const[selectedLocation,setSelectedLocation]=useState([])
  //GPS tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("turn on your location in settings");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        setPosition(newPos);
        setPath((prev) => [...prev, newPos])
      },
      (err) => {
        if (err.code === 1) alert("Please allow location access on your phone");
        else console.error(err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  //  location saving FUNCTION
 const handleSaveLocation = (name) => {
if (!position) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-lg font-semibold">
        Getting your location...
      </div>
    </div>
  );
}
  const newLocation = {
    name,
    coords: position
  };

  setSavedLocations((prev) => [...prev, newLocation]);
};
  //name card
  const handleNameCard=()=>{
    setShowNameCard(true);
  }






  if (!position) {
    return <div>Getting your location...</div>;
  }

//selection of locations to be used as nodes for the backend

const handleSetSelectedLocation=(loc)=>{
setSelectedLocation((prev)=>{
if(prev.find(l=>l.name===loc.name)) return prev;
if(prev.length===4) return [loc];

return [...prev,loc];
})
}

//track status
const statusLabel = position ? 'GPS active' : 'GPS unavailable';
const statusClass = position
  ? 'bg-white/20 border-white/40 text-white'
  : 'bg-red-500/80 border-red-400 text-white';

  return (
    <div className='flex flex-col w-full min-h-screen'>

      {/* Header */}
    <header className="topbar flex items-center justify-between w-full px-6 py-3 bg-gradient-to-r from-green-900 via-green-700 to-green-600 shadow-md">
  <div className="topbar-brand flex flex-col gap-1">
    <p className="eyebrow text-xs uppercase tracking-wider text-white/80 font-semibold">Campus mapper</p>
    <h1 className="text-white font-bold text-2xl md:text-3xl leading-tight">MapOut</h1>
    <p className="text-white/90 text-sm font-medium">KNUST · GPS trails, pins & graph nodes</p>
  </div>
<span
  className={`status-chip px-4 py-2 rounded-full font-semibold text-sm backdrop-blur-md border ${statusClass}`}
  aria-live="polite"
>
  {statusLabel}
</span>
</header>

      {/* Map */}
      <div className=' flex w-full border-2 border-white shadow-2xl'>
        <MapView path={path} position={position} handleSetSelectedLocation={handleSetSelectedLocation} savedLocations={savedLocations} selectedLocation={selectedLocation}/>
      </div>

      {/* Controls */}
      <div className='flex flex-row w-full p-4'>
       <div className='flex'><ControlCards handleClick={handleNameCard} /></div> 
        <div className='flex'>
  <h3>Selected Locations:</h3>
  {selectedLocation.map((loc, i) => (
    <div key={i}>{loc.name}</div>
  ))}
</div>
      </div>
      {showNameCard&&(<NameCard handleSaveLocation={handleSaveLocation}  showNameCard={setShowNameCard}/>)}

    </div>
  )
}

export default App                                                                      