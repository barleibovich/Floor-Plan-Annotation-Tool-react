import React from 'react'

export default function Upload({ onImageLoad }) {
  //Get upload btn
  function handleChange(e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => onImageLoad(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleChange}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
    />
  )
}
