import React from 'react'

export default function MultiSelect({
  label,
  options,
  selected = [],
  onChange,
  single = false,
}) {
  const handleToggle = (id) => {
    if (single) {
      onChange(selected.includes(id) ? [] : [id])
    } else {
      if (selected.includes(id)) {
        onChange(selected.filter(s => s !== id))
      } else {
        onChange([...selected, id])
      }
    }
  }

  return (
    <div className="mb-4">
      {label && (
        <label className="block font-medium text-gray-700 mb-2">{label}</label>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option.id}
            type="button"
            onClick={() => handleToggle(option.id)}
            className={`checkbox-pill ${selected.includes(option.id) ? 'selected' : ''}`}
          >
            {option.emoji && <span className="mr-1">{option.emoji}</span>}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
