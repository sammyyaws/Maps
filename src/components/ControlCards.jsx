function ControlCards({ handleClick }) {
  return (
    <aside className="bg-white rounded-2xl shadow-lg p-5 w-full max-w-xs border border-slate-200">
      <div className="mb-4 border-b pb-2 border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-1">Graph controls</h2>
        <p className="text-xs text-slate-500">
          GPS draws a trail. Pin your location, tap pins to build a route. Click the map for manual nodes.
        </p>
      </div>
      <div className="mb-4 bg-slate-50 rounded-lg p-3 border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">GPS & pins</h3>
        <div className="flex flex-col gap-2 mb-2">
          <button
            type="button"
            className="w-full rounded-md border border-slate-300 bg-white text-slate-700 font-semibold py-2 hover:bg-slate-100 transition"
            onClick={handleClick}
          >
            Pin current GPS
          </button>
          <button
            type="button"
            className="w-full rounded-md border border-slate-300 bg-white text-slate-700 font-semibold py-2 hover:bg-slate-100 transition"
        
          >
            Clear GPS path
          </button>
          <button
            type="button"
            className="w-full rounded-md bg-blue-600 text-white font-semibold py-2 hover:bg-blue-700 transition"
          
          >
            Zoom to GPS path
          </button>
        </div>
           </div>
    </aside>
  );
}

export default ControlCards;