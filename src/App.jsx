import React, { useState } from 'react'
import Navigation from './components/Navigation'
import EntryPage from './pages/EntryPage'
import TrendsPage from './pages/TrendsPage'
import CalendarPage from './pages/CalendarPage'
import { useStorage } from './hooks/useStorage'

export default function App() {
  const [currentTab, setCurrentTab] = useState('entry')
  const { entries, isLoaded, getEntry, saveEntry, getAllEntries, exportData } = useStorage()

  // For navigating from calendar to entry
  const handleSelectDate = (dateStr) => {
    // This is a simplified approach - in production you'd use proper routing
    window.selectedDate = dateStr
    setCurrentTab('entry')
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Laden...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-diary-bg">
      {/* Header */}
      <header className="bg-diary-bg px-4 py-4 sticky top-0 z-20">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">Lifestyle-Tagebuch</h1>
          <button
            onClick={exportData}
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
            title="Daten exportieren"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {currentTab === 'entry' && (
          <EntryPage
            getEntry={getEntry}
            saveEntry={saveEntry}
          />
        )}
        {currentTab === 'trends' && (
          <TrendsPage entries={getAllEntries()} />
        )}
        {currentTab === 'calendar' && (
          <CalendarPage
            entries={entries}
            onSelectDate={handleSelectDate}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <Navigation
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />
    </div>
  )
}
