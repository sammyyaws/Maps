import { useCallback } from 'react'
import { useMap } from 'react-leaflet'

export default function MapControls({ position, gpsLive }) {
  const map = useMap()

  const zoomIn = useCallback(() => map.zoomIn(), [map])
  const zoomOut = useCallback(() => map.zoomOut(), [map])
  const locate = useCallback(() => {
    if (position?.length === 2) {
      map.setView(position, Math.max(map.getZoom(), 17), { animate: true })
    }
  }, [map, position])

  const toggleFullscreen = useCallback(() => {
    const el = map.getContainer()
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {})
    } else {
      document.exitFullscreen?.()
    }
  }, [map])

  return (
    <div className="pointer-events-none absolute top-4 right-4 z-[1000] flex flex-col items-end gap-3">
      <div
        className={`pointer-events-auto rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-md ${
          gpsLive
            ? 'bg-[var(--mapout-green)] text-white'
            : 'bg-white/90 text-slate-600 ring-1 ring-slate-200'
        }`}
        aria-live="polite"
      >
        {gpsLive ? 'GPS live' : 'GPS idle'}
      </div>
      <div className="pointer-events-auto flex flex-col gap-2 rounded-2xl bg-white/95 p-2 shadow-lg ring-1 ring-slate-200/80 backdrop-blur-sm">
        <MapCtrlButton label="Zoom in" onClick={zoomIn}>
          +
        </MapCtrlButton>
        <MapCtrlButton label="Zoom out" onClick={zoomOut}>
          −
        </MapCtrlButton>
        <MapCtrlButton label="Center on GPS" onClick={locate}>
          <span className="text-lg leading-none">⊙</span>
        </MapCtrlButton>
        <MapCtrlButton label="Fullscreen" onClick={toggleFullscreen}>
          <span className="text-sm">⛶</span>
        </MapCtrlButton>
      </div>
    </div>
  )
}

function MapCtrlButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 active:scale-95"
    >
      {children}
    </button>
  )
}
