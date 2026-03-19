import React from 'react'

function ControlCards() {
  return (
    <div className="absolute top-4 left-4 z-50 bg-white p-4 rounded-lg shadow-lg w-60">
  <h2 className="font-bold mb-2">Controls</h2>
  
  <button
    onClick={handleAddLocation}
    className="bg-green-600 text-white px-3 py-1 rounded mb-2 w-full"
  >
    Add Location
  </button>

  <button
    onClick={() => setPath([])}
    className="bg-red-600 text-white px-3 py-1 rounded mb-2 w-full"
  >
    Clear Path
  </button>

  <button
    onClick={() => fitMapToPath()} // you can implement this
    className="bg-blue-600 text-white px-3 py-1 rounded w-full"
  >
    Zoom to Path
  </button>

  <div className="mt-3">
    <h3 className="font-semibold text-sm mb-1">Saved Locations:</h3>
    <ul className="text-xs max-h-32 overflow-y-auto">
      {savedLocations.map((loc, i) => (
        <li key={i}>{i + 1}: {loc[0].toFixed(5)}, {loc[1].toFixed(5)}</li>
      ))}
    </ul>
  </div>
</div>
  )
}

export default ControlCards