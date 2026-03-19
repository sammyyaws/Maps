import { useState } from "react";

function NameCard({ handleSaveLocation, showNameCard }) {
  const [locationName, setLocationName] = useState("");

  const handleSave = () => {
    handleSaveLocation(locationName);
    setLocationName("");
    showNameCard(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
  <div className="bg-white p-4 rounded-lg shadow-lg w-64">
    
    <h3 className="font-semibold mb-2">Name this location</h3>

    <input
      type="text"
      value={locationName}
      onChange={(e) => setLocationName(e.target.value)}
      placeholder="e.g. Home, School"
      className="border p-2 w-full mb-3 rounded"
    />

    <div className="flex gap-2">
      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-3 py-1 rounded w-full"
      >
        Save
      </button>

      <button
        onClick={() => showNameCard(false)}
        className="bg-gray-400 text-white px-3 py-1 rounded w-full"
      >
        Cancel
      </button>
    </div>

  </div>
</div>
  );
}

export default NameCard;