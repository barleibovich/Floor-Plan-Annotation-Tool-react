import React, { useRef, useEffect, useState } from 'react'

export default function Canvas({ imageSrc, boxes, setBoxes }) {
  const canvasRef = useRef(null)
  const [floorImage, setFloorImage] = useState(null)

  //Load floor image if exists
  useEffect(() => {
    if (!imageSrc) {
      setFloorImage(null)
      return
    }
    const img = new Image()
    img.onload = () => setFloorImage(img)
    img.src = imageSrc
  }, [imageSrc])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    //Init state for drawing & hover
    let isDrawing = false
    let startX = 0, startY = 0
    let hoveredBoxIndex = null

    //Draw boxes
    function drawBoxes() {
      //Clear image
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      //Build image
      if (floorImage) {
        ctx.drawImage(floorImage, 0, 0, canvas.width, canvas.height)
      }
      //Color the box
      boxes.forEach((box, i) => {
        ctx.strokeStyle = i === hoveredBoxIndex ? 'blue' : 'red'
        ctx.lineWidth   = i === hoveredBoxIndex ? 2 : 1
        ctx.strokeRect(box.x, box.y, box.width, box.height)

        ctx.fillStyle = 'black'
        ctx.font      = '14px Arial'
        ctx.fillText(box.label, box.x + 5, box.y - 15)
      })
    }

    //Init canvas size
    if (floorImage) {
      canvas.width  = floorImage.width
      canvas.height = floorImage.height
    }
    drawBoxes()

    //Handle mouse down
    function onMouseDown(e) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      //Check if clicked on existing box
      for (let i = boxes.length - 1; i >= 0; i--) {
        const b = boxes[i]
        if (
          x >= b.x && x <= b.x + b.width &&
          y >= b.y && y <= b.y + b.height
        ) {
          const confirmDelete = window.confirm(`You clicked on "${b.label}". Delete it?`)
          if (confirmDelete) {
            // Clear box by index
            setBoxes(prev => prev.filter((_, idx) => idx !== i))
          }
          return
        }
      }

      startX = x; startY = y
      isDrawing = true
    }

    // Handle mouse move
    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (isDrawing) {
        drawBoxes()
        //Draw temporary box
        const w = x - startX, h = y - startY
        ctx.fillStyle   = 'rgba(0, 0, 255, 0.2)'
        ctx.fillRect(startX, startY, w, h)
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.6)'
        ctx.setLineDash([4, 4])
        ctx.strokeRect(startX, startY, w, h)
        ctx.setLineDash([])
        return
      }

      //Get box index if hover over
      hoveredBoxIndex = boxes.findIndex(b =>
        x >= b.x && x <= b.x + b.width &&
        y >= b.y && y <= b.y + b.height
      )
      drawBoxes()
    }

    // Handle mouse up
    function onMouseUp(e) {
      if (!isDrawing) return
      isDrawing = false

      const rect = canvas.getBoundingClientRect()
      let x = startX, y = startY
      let width  = e.clientX - rect.left - x
      let height = e.clientY - rect.top  - y

      // Normalize negative dims
      if (width < 0)  { x += width;  width  = -width }
      if (height < 0) { y += height; height = -height }

      const newBox = { x, y, width, height }
      // Check if overlaps
      if (boxes.some(b =>
        newBox.x < b.x + b.width &&
        newBox.x + newBox.width > b.x &&
        newBox.y < b.y + b.height &&
        newBox.y + newBox.height > b.y
      )) {
        window.alert('Cannot create a box that overlaps with an existing box.')
        drawBoxes()
        return
      }

      //Add new box
      const label = window.prompt('Enter label for this box:')
      if (label) {
        setBoxes(prev => [...prev, { ...newBox, label }])
      }
    }

    // Register event listeners
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseup', onMouseUp)

    // Cleanup event listeners
    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseup', onMouseUp)
    }
  }, [boxes, floorImage, setBoxes])

  return (
    <canvas
      ref={canvasRef}
      className="border-2 border-gray-300 shadow-md mt-6 bg-white cursor-crosshair"
    />
  )
}
