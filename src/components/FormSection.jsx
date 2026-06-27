import React, { useState } from 'react'

export default function FormSection({ number, title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-white rounded-xl mb-3 overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-bold">
            {number}
          </span>
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  )
}
