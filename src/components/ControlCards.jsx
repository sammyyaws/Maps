function ControlCards({
  
 onDropPin,
  position,
  path,
  selectedLocation,
  runBFS,
  runDFS,

  panelOpen,
  onTogglePanel,
  
}) {
  const coordStr =
    position?.length === 2
      ? `${position[0].toFixed(5)}, ${position[1].toFixed(5)}`
      : '—'

  return (
    <section className="flex flex-col rounded-t-[1.75rem] bg-white shadow-[0_-8px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80">
      <button
        type="button"
        onClick={onTogglePanel}
        className="flex w-full shrink-0 flex-col items-center border-b border-slate-100 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-600"
        aria-expanded={panelOpen}
      >
        <span className="mb-1 h-1 w-10 rounded-full bg-slate-200" aria-hidden />
        {panelOpen ? 'Hide' : 'Show'}
      </button>

      <div
        className={`min-h-0 overflow-hidden transition-all duration-300 ease-out ${
          panelOpen ? 'max-h-[min(42vh,480px)] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="max-h-[min(42vh,480px)] overflow-y-auto px-4 pb-4 pt-1">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onDropPin}
              className="min-h-[48px] rounded-2xl bg-[var(--mapout-green)] py-3.5 text-center text-[15px] font-semibold text-white shadow-md shadow-[#00a86b]/25 transition hover:bg-[var(--mapout-green-hover)] active:scale-[0.99]"
            >
              Drop pin here
            </button>

            <button
              type="button"
             
              className="min-h-[48px] rounded-2xl border border-slate-200/90 bg-white py-3.5 text-center text-[15px] font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
            >
              Clear GPS trail
            </button>
          </div>

          <div
            className="rounded-2xl px-4 py-4 ring-1 ring-[var(--mapout-route-border)]"
            style={{ background: 'var(--mapout-route-box)' }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-violet-800">
              Shortest-style routes
            </p>
            <p className="mt-2 text-sm leading-relaxed text-violet-950/85">
              Tap pins in order, then optimize for the shortest visit order (straight-line
              segments). Use the server button if your API exposes{' '}
              <code className="rounded-md bg-white/80 px-1.5 py-0.5 text-xs font-mono text-violet-900 ring-1 ring-violet-200/80">
                POST /shortest-path
              </code>
              .
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
            onClick={runBFS}            
            disabled={selectedLocation.length < 2}
                title="Shortest possible path between your stops (client-side)"
                className="mapout-btn-shortest min-h-[48px] rounded-2xl px-3 py-2.5 text-center text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
              >BFS TRAVERSAL
              </button>
              <button
                type="button"
            onClick={runDFS}          
             disabled={selectedLocation.length < 2}
                className="min-h-[48px] rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-center text-sm font-semibold text-slate-800 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                DFS TRAVERSAL
              </button>
              <button
                type="button"
                
                disabled={selectedLocation.length < 2 }
                className="min-h-[48px] rounded-2xl bg-slate-500 px-3 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                 Find shortest path
              </button>
            </div>
            
           
          </div>
        </div>
        </div>
      </div>

      <footer className="flex shrink-0 flex-wrap items-start justify-between gap-3 border-t border-slate-100 bg-slate-50/80 px-4 py-3 text-xs">
        <div>
          <p className="font-bold uppercase tracking-wide text-[var(--mapout-green)]">
            Live GPS
          </p>
          <p className="mt-1 font-mono text-[13px] text-slate-800">{coordStr}</p>
          <p className="mt-0.5 text-slate-600">Trail points: {path.length}</p>
        </div>
        <div className="max-w-[min(100%,220px)] text-right">
          <p className="font-bold uppercase tracking-wide text-slate-700">
            Stops ({selectedLocation.length})
          </p>
          <p className="mt-1 leading-snug text-slate-600">
            Tap a saved pin to add stops (max 4).
          </p>
        </div>
      </footer>
    </section>
  )
}

export default ControlCards
