import React from 'react'

export default function AnnotationsTable({ boxes, setBoxes }) {
  //Rebuild table & deleteBox logic
  if (boxes.length === 0) {
    return <p className="mt-4">אין תיבות להצגה</p>
  }

  return (
    <table className="w-full border border-collapse mt-6 bg-white">
      <thead>
        <tr className="bg-gray-800 text-white">
          <th className="p-2 border">Label</th>
          <th className="p-2 border">X</th>
          <th className="p-2 border">Y</th>
          <th className="p-2 border">Width</th>
          <th className="p-2 border">Height</th>
          <th className="p-2 border">Delete</th>
        </tr>
      </thead>
      <tbody>
        {boxes.map((b, i) => (
          <tr key={i}>
            <td className="p-2 border">{b.label}</td>
            <td className="p-2 border">{Math.round(b.x)}</td>
            <td className="p-2 border">{Math.round(b.y)}</td>
            <td className="p-2 border">{Math.round(b.width)}</td>
            <td className="p-2 border">{Math.round(b.height)}</td>
            <td className="p-2 border">
              <button
                onClick={() => setBoxes(prev => prev.filter((_, idx) => idx !== i))}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
