//projject repo link https://github.com/sammyyaws/Maps.git



import { useState, useEffect,  } from 'react'
import MapView from './components/MapView'
import ControlCards from './components/ControlCards'
import './config/leaflet'
import NameCard from './NameCard'
import { sendNodeToBackend,createEdge} from './Api'
import { getBFS } from "./Api"
import { getDFS } from "./Api"  


function App() {
  //state for traversals
  const [activeNode, setActiveNode] = useState(null)
const [visitedNodes, setVisitedNodes] = useState([])
  const [position, setPosition] = useState(null)
  const [path, setPath] = useState([])
  
 const [savedLocations, setSavedLocations] = useState(() => {
  const stored = localStorage.getItem("savedLocations")
  return stored ? JSON.parse(stored) : []
})
  const [geoError, setGeoError] = useState(() => {
    if (typeof navigator !== 'undefined' && !navigator.geolocation) {
      return 'Geolocation is not supported by this browser.'
    }
    return null
  })
  const [retryCount, setRetryCount] = useState(0)
  const [showNameCard, setShowNameCard] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState([])
 
  const [panelOpen, setPanelOpen] = useState(true)
  
const runTraversal = async (startId, type) => {
  const res = type === "bfs" ? await getBFS(startId) : await getDFS(startId)

  const order = type === "bfs" ? res.bfs_order : res.dfs_order

  setVisitedNodes([])
  setActiveNode(null)

  const visited = []

  for (const nodeId of order) {
    setActiveNode(nodeId)

    visited.push(nodeId)
    setVisitedNodes([...visited])

    await new Promise((r) => setTimeout(r, 600))
  }

  setActiveNode(null)
}




  // start of getting gps with use effect
  useEffect(() => {
    if (!navigator.geolocation) {
      return
    }
   
    
    

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude]
        setPosition(newPos)
        setPath((prev) => [...prev, newPos])
        setGeoError(null)
      },
      (err) => {
        if (err.code === 1)
          setGeoError(
            'Permission denied. Please allow location access in your browser settings.'
          )
        else if (err.code === 2)
          setGeoError('Location unavailable. Try again from a place with better signal.')
        else if (err.code === 3) setGeoError('Location request timed out. Try again.')
        else setGeoError(err.message || 'Unknown geolocation error')
        console.error(err)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [retryCount])
//end of getting gps




// save location part
  const handleSaveLocation = async (name) => {
  if (!position) return

  const newLocation = {
    name,
    coords: position,
  }

  try {
    const backendNode = await sendNodeToBackend(newLocation)

    const locationWithId = {
      ...newLocation,
      backendId: backendNode.id,
    }

    const updated = [...savedLocations, locationWithId]

    setSavedLocations(updated)
    localStorage.setItem("savedLocations", JSON.stringify(updated))

  } catch (err) {
    console.error("Failed to save node:", err)
  }
}

const handleSetSelectedLocation = async (loc) => {
  const isAlreadySelected = selectedLocation.some(
    (l) => l.backendId === loc.backendId
  )
  if (isAlreadySelected) return

  if (selectedLocation.length > 0) {
    const last = selectedLocation[selectedLocation.length - 1]

    if (last.backendId && loc.backendId) {
      await createEdge(last.backendId, loc.backendId, 1)
    }
  }

  setSelectedLocation((prev) => [...prev, loc])
}

  

  if (geoError) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <p className="mb-4 max-w-md text-lg font-semibold text-red-600">{geoError}</p>
        <button
          type="button"
          onClick={() => setRetryCount((prev) => prev + 1)}
          className="rounded-2xl bg-[var(--mapout-green)] px-6 py-3 font-semibold text-white shadow-md transition hover:brightness-105"
        >
          Retry location
        </button>
      </div>
    )
  }

  if (!position) {
    return (
      <div
        className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 bg-gradient-to-b from-[var(--mapout-green-soft)] to-white p-8 text-center"
      >
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-[#b8e8d4] border-t-[var(--mapout-green)]"
          aria-hidden
        />
        <p className="text-base font-semibold text-slate-800">Getting your location…</p>
        <p className="max-w-xs text-sm text-slate-600">MapOut needs GPS for the live trail.</p>
      </div>
    )
  }

  return (
    <div className="flex h-[100dvh] min-h-0 flex-col bg-slate-100">
      <div className="relative min-h-0 flex-1">
        <MapView
          path={path}
          position={position}
          handleSetSelectedLocation={handleSetSelectedLocation}
          savedLocations={savedLocations}
          selectedLocation={selectedLocation}
         activeNode={activeNode}
  visitedNodes={visitedNodes}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] flex justify-start p-4">
          <div className="pointer-events-auto max-w-[min(100%,20rem)] rounded-2xl bg-white/95 p-4 shadow-lg ring-1 ring-slate-200/80 backdrop-blur-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--mapout-green)]">
              MapOut
            </p>
            <h1 className="mt-1 text-xl font-bold leading-tight text-slate-900">
              KNUST campus
            </h1>
            <p className="mt-1 text-sm text-slate-600">Trails, pins & routes</p>
          </div>
        </div>
      </div>

      <ControlCards
        onDropPin={() => setShowNameCard(true)}
        runBFS={() => runTraversal(activeNode, "bfs")}
        runDFS={() => runTraversal(activeNode, "dfs")}
        position={position}
        path={path}
        selectedLocation={selectedLocation}
        panelOpen={panelOpen}
        onTogglePanel={() => setPanelOpen((o) => !o)}
       
        
      />

      {showNameCard && (
        <NameCard handleSaveLocation={handleSaveLocation} showNameCard={setShowNameCard} />
      )}
    </div>
  )
}

export default App
