import React, { useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths,
  getDay,
  isToday,
} from 'date-fns'
import { de } from 'date-fns/locale'
import { CYCLE_PHASES } from '../utils/constants'

export default function CalendarPage({ entries, onSelectDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Pad start of month to align with weekday
  const startPadding = getDay(monthStart)
  const paddedDays = [...Array(startPadding === 0 ? 6 : startPadding - 1).fill(null), ...days]

  const getEntryForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return entries[dateStr]
  }

  const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

  return (
    <div className="px-4 py-6 pb-24 max-w-lg mx-auto">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-full hover:bg-diary-accent transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h1 className="text-xl font-bold text-gray-800">
          {format(currentMonth, 'MMMM yyyy', { locale: de })}
        </h1>

        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-full hover:bg-diary-accent transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {paddedDays.map((day, index) => {
          if (!day) {
            return <div key={`pad-${index}`} className="aspect-square" />
          }

          const entry = getEntryForDate(day)
          const phase = entry?.cyclePhase
          const phaseColor = CYCLE_PHASES.find(p => p.id === phase)?.color
          const hasEntry = !!entry?.energyLevel

          return (
            <button
              key={format(day, 'yyyy-MM-dd')}
              onClick={() => onSelectDate(format(day, 'yyyy-MM-dd'))}
              className={`
                aspect-square rounded-xl flex flex-col items-center justify-center
                transition-all relative
                ${isToday(day) ? 'ring-2 ring-gray-800' : ''}
                ${hasEntry ? 'bg-white shadow-sm' : 'bg-diary-accent/50'}
              `}
            >
              <span className={`text-sm ${isToday(day) ? 'font-bold' : ''}`}>
                {format(day, 'd')}
              </span>

              {phaseColor && (
                <div
                  className="w-2 h-2 rounded-full mt-1"
                  style={{ backgroundColor: phaseColor }}
                />
              )}

              {hasEntry && !phaseColor && (
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1" />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        {CYCLE_PHASES.map(phase => (
          <div key={phase.id} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: phase.color }}
            />
            <span className="text-xs text-gray-600">{phase.label}</span>
          </div>
        ))}
      </div>

      {/* Stats for month */}
      <div className="mt-6 text-center text-sm text-gray-500">
        {Object.keys(entries).filter(d => d.startsWith(format(currentMonth, 'yyyy-MM'))).length} Einträge in diesem Monat
      </div>
    </div>
  )
}
