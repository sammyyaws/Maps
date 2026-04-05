import { useState, useEffect, useMemo, useCallback } from 'react'
import MapView from './components/MapView'
import ControlCards from './components/ControlCards'
import './config/leaflet'
import NameCard from './NameCard'

function nearestNeighborOrder(locations) {
  if (locations.length <= 1) return locations
  const remaining = locations.map((l) => ({ ...l }))
  const ordered = [remaining.shift()]
  while (remaining.length) {
    const last = ordered[ordered.length - 1].coords
    let bestIdx = 0
    let bestD = Infinity
    remaining.forEach((p, i) => {
      const d = (p.coords[0] - last[0]) ** 2 + (p.coords[1] - last[1]) ** 2
      if (d < bestD) {
        bestD = d
        bestIdx = i
      }
    })
    ordered.push(remaining.splice(bestIdx, 1)[0])
  }
  return ordered
}

function App() {
  const [position, setPosition] = useState(null)
  const [path, setPath] = useState([])
  const [savedLocations, setSavedLocations] = useState([])
  const [geoError, setGeoError] = useState(() => {
    if (typeof navigator !== 'undefined' && !navigator.geolocation) {
      return 'Geolocation is not supported by this browser.'
    }
    return null
  })
  const [retryCount, setRetryCount] = useState(0)
  const [showNameCard, setShowNameCard] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState([])
  const [backendUrl] = useState('http://127.0.0.1:8000')
  const [backendStatus, setBackendStatus] = useState(null)
  const [panelOpen, setPanelOpen] = useState(true)
  const [routeMode, setRouteMode] = useState('tap')
  const [serverOrderedLocations, setServerOrderedLocations] = useState(null)
  const [serverBusy, setServerBusy] = useState(false)

  const sendNodeToBackend = async (loc) => {
    const payload = {
      name: loc.name || 'Unnamed',
      latitude: loc.coords[0],
      longitude: loc.coords[1],
    }
    const response = await fetch(`${backendUrl}/nodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      const t = await response.text()
      throw new Error(t || `HTTP ${response.status}`)
    }
    return response.json()
  }

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

  const handleSaveLocation = (name) => {
    if (!position) {
      alert(
        'Location not ready yet. Wait a moment and ensure geolocation permission is granted.'
      )
      return
    }
    const newLocation = {
      name,
      coords: position,
    }
    setSavedLocations((prev) => [...prev, newLocation])
  }

  const handleSetSelectedLocation = async (loc) => {
    const isAlreadySelected = selectedLocation.some((l) => l.name === loc.name)
    if (isAlreadySelected) return

    let backendId = null
    try {
      const backendNode = await sendNodeToBackend(loc)
      backendId = backendNode?.id ?? null
    } catch (e) {
      console.warn('Backend node skipped:', e)
      setBackendStatus(`Nodes API offline — pins still work locally.`)
    }

    const newLoc = {
      ...loc,
      backendId,
    }

    const next =
      selectedLocation.length === 4 ? [newLoc] : [...selectedLocation, newLoc]

    setSelectedLocation(next)
    setRouteMode('tap')
    setServerOrderedLocations(null)
  }

  const routeLinePositions = useMemo(() => {
    if (selectedLocation.length < 2) return null
    let order = selectedLocation
    if (routeMode === 'shortest') {
      order = nearestNeighborOrder(selectedLocation)
    } else if (routeMode === 'server' && serverOrderedLocations?.length) {
      order = serverOrderedLocations
    }
    return order.map((l) => l.coords)
  }, [selectedLocation, routeMode, serverOrderedLocations])

  const onClearTrail = useCallback(() => setPath([]), [])
  const onShortestVisit = useCallback(() => {
    setRouteMode('shortest')
    setServerOrderedLocations(null)
  }, [])
  const onTapOrderOnly = useCallback(() => {
    setRouteMode('tap')
    setServerOrderedLocations(null)
  }, [])

  const onServerShortest = useCallback(async () => {
    if (selectedLocation.length < 2) return
    setServerBusy(true)
    setBackendStatus(null)
    try {
      const res = await fetch(`${backendUrl}/shortest-path`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stops: selectedLocation.map((l) => ({
            name: l.name,
            lat: l.coords[0],
            lng: l.coords[1],
          })),
        }),
      })
      const raw = await res.text()
      let data = {}
      try {
        data = raw ? JSON.parse(raw) : {}
      } catch {
        throw new Error('Server did not return JSON.')
      }
      if (!res.ok) throw new Error(data.detail || raw || `HTTP ${res.status}`)

      let ordered = null
      if (Array.isArray(data.order)) {
        const byName = Object.fromEntries(selectedLocation.map((l) => [l.name, l]))
        ordered = data.order.map((n) => byName[n]).filter(Boolean)
      } else if (Array.isArray(data.ordered_stops)) {
        ordered = data.ordered_stops
      } else if (Array.isArray(data.path) && data.path[0]?.lat !== undefined) {
        ordered = data.path.map((p, i) => ({
          name: `stop-${i}`,
          coords: [p.lat, p.lng ?? p.lon],
        }))
      }

      if (ordered?.length >= 2) {
        setServerOrderedLocations(ordered)
        setRouteMode('server')
        setBackendStatus('Server path applied.')
      } else {
        setBackendStatus('Server replied but no usable order/path field found.')
      }
    } catch (e) {
      setBackendStatus(e.message || 'Server shortest path failed.')
    } finally {
      setServerBusy(false)
    }
  }, [backendUrl, selectedLocation])

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
          routeLinePositions={routeLinePositions}
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
        onClearTrail={onClearTrail}
        onShortestVisit={onShortestVisit}
        onTapOrderOnly={onTapOrderOnly}
        onServerShortest={onServerShortest}
        position={position}
        path={path}
        selectedLocation={selectedLocation}
        backendStatus={backendStatus}
        panelOpen={panelOpen}
        onTogglePanel={() => setPanelOpen((o) => !o)}
        routeMode={routeMode}
        serverBusy={serverBusy}
      />

      {showNameCard && (
        <NameCard handleSaveLocation={handleSaveLocation} showNameCard={setShowNameCard} />
      )}
    </div>
  )
}

export default App
