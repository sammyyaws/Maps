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
 const[selectLocation,setSelectLocation]=useState([])
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
setSelectLocation((prev)=>{
if(prev.find(l=>l.name===loc.name)) return prev;
if(prev.length==2) return [loc];

return [...prev,loc];
})
}


  return (
    <div className='flex flex-col w-full min-h-screen'>

      {/* Header */}
      <div className="flex bg-emerald-600 items-center justify-center w-full shadow-md md:h-16 h-10">
        <div className='text-white font-bold md:text-2xl text-xl'>MAPOUT</div>
      </div>

      {/* Map */}
      <div className=' flex w-full border-2 border-white shadow-2xl'>
        <MapView path={path} position={position} handleSetSelectedLocation={handleSetSelectedLocation} savedLocations={savedLocations} />
      </div>

      {/* Controls */}
      <div className='flex flex-row w-full p-4'>
       <div className='flex'><ControlCards handleClick={handleNameCard} /></div> 
        <div className='flex'>
  <h3>Selected Locations:</h3>
  {selectLocation.map((loc, i) => (
    <div key={i}>{loc.name}</div>
  ))}
</div>
      </div>
      {showNameCard&&(<NameCard handleSaveLocation={handleSaveLocation}  showNameCard={setShowNameCard}/>)}

    </div>
  )
}

export default App                                                                      