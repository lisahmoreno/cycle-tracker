import { useState, useEffect } from 'react'
import { DEFAULT_ENTRY } from '../utils/constants'

const STORAGE_KEY = 'lifestyle-tagebuch-entries'

export function useStorage() {
  const [entries, setEntries] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setEntries(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load entries:', e)
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever entries change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
      } catch (e) {
        console.error('Failed to save entries:', e)
      }
    }
  }, [entries, isLoaded])

  // Get entry for a specific date
  const getEntry = (dateStr) => {
    return { ...DEFAULT_ENTRY, ...entries[dateStr], date: dateStr }
  }

  // Save entry for a specific date
  const saveEntry = (dateStr, data) => {
    setEntries(prev => ({
      ...prev,
      [dateStr]: { ...data, date: dateStr }
    }))
  }

  // Get all entries as array
  const getAllEntries = () => {
    return Object.values(entries).sort((a, b) =>
      new Date(a.date) - new Date(b.date)
    )
  }

  // Export all data as JSON
  const exportData = () => {
    // Get fresh data from localStorage to ensure we have the latest
    const freshData = localStorage.getItem(STORAGE_KEY)
    const dataToExport = freshData ? JSON.parse(freshData) : entries

    const dataStr = JSON.stringify(dataToExport, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lifestyle-tagebuch-${new Date().toISOString().split('T')[0]}.json`
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Import data from JSON
  const importData = (jsonStr) => {
    try {
      const data = JSON.parse(jsonStr)
      setEntries(data)
      return true
    } catch (e) {
      console.error('Failed to import:', e)
      return false
    }
  }

  return {
    entries,
    isLoaded,
    getEntry,
    saveEntry,
    getAllEntries,
    exportData,
    importData,
  }
}
