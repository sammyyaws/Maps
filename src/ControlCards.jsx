function ControlCards({handleClick}) {
  return (
    <div className=" bg-white p-4 rounded-lg shadow-lg w-60">
      
      <h2 className="font-bold mb-2">Controls</h2>

      <button onClick={handleClick}
        className="bg-green-600 text-white px-3 py-1 rounded mb-2 w-full"
      >
        Pin Location
      </button>

      <button
        className="bg-red-600 text-white px-3 py-1 rounded mb-2 w-full"
      >
        Clear Path
      </button>

      <button
        className="bg-blue-600 text-white px-3 py-1 rounded w-full"
      >
        Zoom to Path
      </button>

     

    </div>
  );
}

export default ControlCards;