import React, { useState, useEffect } from 'react'
import Upload from './components/Upload'
import Canvas from './components/Canvas'
import AnnotationsTable from './components/AnnotationsTable'

// Load local storage
function loadBoxes() {
  const saved = localStorage.getItem('boxes')
  return saved ? JSON.parse(saved) : []
}
function loadImage() {
  return localStorage.getItem('floorImage') || null
}

export default function App() {
  const [boxes, setBoxes] = useState(loadBoxes)
  const [imageSrc, setImageSrc] = useState(loadImage)

  //Get boxes
  useEffect(() => {
    localStorage.setItem('boxes', JSON.stringify(boxes))
  }, [boxes])

  //Get image
  useEffect(() => {
    if (imageSrc) {
      localStorage.setItem('floorImage', imageSrc)
    }
  }, [imageSrc])

  //Reset
  function resetAnnotations() {
    localStorage.removeItem('boxes')
    localStorage.removeItem('floorImage')
    setBoxes([])
    setImageSrc(null)
  }

  return (
    <div className="
      container
      mx-auto
      text-center
      min-h-screen
      bg-gray-900
      text-gray-100
      font-sans
      antialiased
      p-6
      flex
      flex-col
      items-center
    ">
      <h1 className="text-4xl font-bold mb-6">Floor Plan Annotation</h1>

      <div className="flex space-x-4 mb-6">
        <Upload onImageLoad={setImageSrc} />
        <button
          onClick={resetAnnotations}
          className="
            px-4 py-2
            bg-red-600 hover:bg-red-700
            text-white
            rounded
            focus:outline-none focus:ring-2 focus:ring-red-400
          "
        >
          Reset
        </button>
      </div>

      <Canvas
        imageSrc={imageSrc}
        boxes={boxes}
        setBoxes={setBoxes}
      />

      <AnnotationsTable
        boxes={boxes}
        setBoxes={setBoxes}
      />
    </div>
  )
}