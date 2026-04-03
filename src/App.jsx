import { useState, useEffect } from 'react'
import MapView from './components/MapView'
import ControlCards from './components/ControlCards'
import "./config/leaflet"
import NameCard from './NameCard'
import OutputCard from './components/OutputCard'
function App() {
  const [position, setPosition] = useState(null)
  const [path, setPath] = useState([])
  const [savedLocations, setSavedLocations] = useState([])
  const [geoError, setGeoError] = useState(() => {
    if (typeof navigator !== 'undefined' && !navigator.geolocation) {
      return 'Geolocation is not supported by this browser.';
    }
    return null;
  })
  const [retryCount, setRetryCount] = useState(0)
  const [showNameCard,setShowNameCard]=useState(false)
  const [selectedLocation,setSelectedLocation]=useState([])

 
  //GPS tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        setPosition(newPos);
        setPath((prev) => [...prev, newPos]);
        setGeoError(null);
      },
      (err) => {
        if (err.code === 1) setGeoError("Permission denied. Please allow location access in your browser settings.");
        else if (err.code === 2) setGeoError("Location unavailable. Try again from a place with better signal.");
        else if (err.code === 3) setGeoError("Location request timed out. Try again.");
        else setGeoError(err.message || "Unknown geolocation error");
        console.error(err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId)
  }, [retryCount])

  //  location saving FUNCTION
 const handleSaveLocation = (name) => {
  if (!position) {
    alert("Location not ready yet. Wait a moment and ensure geolocation permission is granted.");
    return;
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






  if (geoError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <p className="mb-3 text-lg font-semibold text-red-600">{geoError}</p>
        <button
          onClick={() => setRetryCount((prev) => prev + 1)}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Retry Location
        </button>
      </div>
    );
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
      <div className=' flex w-full border-2 justify-center  items-center border-white shadow-2xl'>
        <MapView path={path} position={position} handleSetSelectedLocation={handleSetSelectedLocation} savedLocations={savedLocations} selectedLocation={selectedLocation}/>
      </div>

      {/* Controls */}

      <div className='flex gap-3 flex-col md:flex-row w-full items-center justify-center p-4'>
       <div className='flex'><ControlCards handleClick={handleNameCard} /></div> 
        <div className='flex'>
  <OutputCard
        position={position}
        path={path}
        savedLocations={savedLocations}
        selectedLocation={selectedLocation}
       
      />
</div>
      </div>

      

      {showNameCard&&(<NameCard handleSaveLocation={handleSaveLocation}  showNameCard={setShowNameCard}/>)}

    </div>
  )
}

export default App                                                                      