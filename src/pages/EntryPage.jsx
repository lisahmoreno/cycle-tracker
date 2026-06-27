import React, { useState, useEffect, useRef } from 'react'
import DailyEntry from '../components/DailyEntry'
import { format, addDays, subDays, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'

export default function EntryPage({ getEntry, saveEntry }) {
  const [currentDate, setCurrentDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [entry, setEntry] = useState(null)
  const [saveStatus, setSaveStatus] = useState('saved') // 'saving' | 'saved'
  const saveTimeoutRef = useRef(null)
  const statusTimeoutRef = useRef(null)

  // Load entry when date changes
  useEffect(() => {
    setEntry(getEntry(currentDate))
    setSaveStatus('saved')
  }, [currentDate, getEntry])

  // Debounced auto-save when entry changes
  useEffect(() => {
    if (entry) {
      setSaveStatus('saving')
      // Clear any pending save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current)
      }
      // Save after 500ms of no changes
      saveTimeoutRef.current = setTimeout(() => {
        saveEntry(currentDate, entry)
        setSaveStatus('saved')
        // Hide the "saved" message after 2 seconds
        statusTimeoutRef.current = setTimeout(() => {
          setSaveStatus('saved')
        }, 2000)
      }, 500)
    }
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current)
      }
    }
  }, [entry, currentDate, saveEntry])

  const goToDate = (date) => {
    setCurrentDate(format(date, 'yyyy-MM-dd'))
  }

  const formattedDate = format(parseISO(currentDate), 'EEEE, d. MMMM yyyy', { locale: de })

  if (!entry) return null

  return (
    <div className="pb-20">
      {/* Date Navigation */}
      <div className="sticky top-0 bg-diary-bg z-10 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <button
            onClick={() => goToDate(subDays(parseISO(currentDate), 1))}
            className="p-2 rounded-full hover:bg-diary-accent transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="text-center">
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="sr-only"
              id="date-picker"
            />
            <label
              htmlFor="date-picker"
              className="block font-semibold text-gray-800 cursor-pointer"
            >
              {formattedDate}
            </label>
            <div className="flex items-center justify-center gap-1 text-xs">
              {currentDate === format(new Date(), 'yyyy-MM-dd') && (
                <span className="text-gray-500">Heute</span>
              )}
              {saveStatus === 'saving' ? (
                <span className="text-amber-600">Speichert...</span>
              ) : (
                <span className="text-green-600">Gespeichert</span>
              )}
            </div>
          </div>

          <button
            onClick={() => goToDate(addDays(parseISO(currentDate), 1))}
            className="p-2 rounded-full hover:bg-diary-accent transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Entry Form */}
      <div className="px-4 max-w-lg mx-auto">
        <DailyEntry
          entry={entry}
          onChange={setEntry}
        />
      </div>
    </div>
  )
}
