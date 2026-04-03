import React from 'react'

function OutputCard({ position, path, savedLocations, selectedLocation, backendStatus,  }) {
  return (
     <aside className="bg-white rounded-2xl shadow-lg p-5 w-full max-w-xs border border-slate-200">
      <div className="mb-4 border-b pb-2 border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-1">Output controls</h2>
        <p className="text-xs text-slate-500">
          GPS result output will be shown here.
        </p>
      </div>
      
      <div className="mb-4 bg-slate-50 rounded-lg p-3 border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">GPS & pins</h3>
        <p className="text-xs text-slate-700">Current position: {position ? `${position[0].toFixed(6)}, ${position[1].toFixed(6)}` : 'N/A'}</p>
        <p className="text-xs text-slate-700">Saved locations: {savedLocations.length}</p>
        <p className="text-xs text-slate-700">Selected nodes: {selectedLocation.length}</p>
      </div>

      <div className="mb-4 bg-slate-50 rounded-lg p-3 border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Selected path</h3>
        {selectedLocation.length > 0 ? (
          <ol className="list-decimal list-inside text-sm text-slate-700">
            {selectedLocation.map((loc, idx) => (
              <li key={`${loc.name}-${idx}`}>
                {loc.name} ({loc.coords[0].toFixed(6)}, {loc.coords[1].toFixed(6)})
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-xs text-slate-500">Select points on the map to start building a route.</p>
        )}
      </div>

      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Live path tracker</h3>
        <p className="text-xs text-slate-700">Tracked path points: {path.length}</p>
        {backendStatus && <p className="text-xs text-slate-700 mt-2">Backend: {backendStatus}</p>}
      </div>
    </aside>
  )
}

export default OutputCard
