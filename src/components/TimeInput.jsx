import React from 'react'

export default function TimeInput({ label, value, onChange }) {
  return (
    <div className="flex-1">
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-diary-accent rounded-lg text-center text-lg"
      />
    </div>
  )
}
