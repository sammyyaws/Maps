import { useState } from 'react'

function NameCard({ handleSaveLocation, showNameCard }) {
  const [locationName, setLocationName] = useState('')

  const handleSave = () => {
    handleSaveLocation(locationName)
    setLocationName('')
    showNameCard(false)
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pin-name-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <h3 id="pin-name-title" className="text-lg font-bold text-slate-900">
          Name this pin
        </h3>
        <p className="mt-1 text-sm text-slate-600">Saved at your current GPS position.</p>

        <input
          type="text"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          placeholder="e.g. Library gate"
          className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-3 text-slate-900 outline-none ring-0 transition focus:border-[var(--mapout-green)] focus:ring-2 focus:ring-emerald-500/25"
          autoFocus
        />

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 rounded-xl bg-[var(--mapout-green)] py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
          >
            Save pin
          </button>

          <button
            type="button"
            onClick={() => showNameCard(false)}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default NameCard
