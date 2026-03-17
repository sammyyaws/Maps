import { useState } from 'react'
import MapView from './components/MapView'

function App() {


  return (
    <>
    <div className='flex flex-col w-full min-h-screen'>
      <div className="flex bg-emerald-600 items-center justify-center w-full shadow-md md:h-16 h-8">
      <div className='text-white font-bold md:text-2xl text-xl'>MAPOUT</div>
      </div>
      {/**map layer */}
      <div className='flex items-center justify-center border-2 mx-6  border-white shadow-md shadow-black flex-col w-1/2 h-2/3'>
    <MapView/></div>
    </div>
    </>
  )
}

export default App
