import React from 'react'

export default function SliderInput({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
  showValue = true,
  lowLabel,
  highLabel,
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="font-medium text-gray-700">{label}</label>
        {showValue && (
          <span className="text-2xl font-bold text-gray-800">{value}</span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full"
      />
      {(lowLabel || highLabel) && (
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{lowLabel || min}</span>
          <span>{highLabel || max}</span>
        </div>
      )}
    </div>
  )
}
