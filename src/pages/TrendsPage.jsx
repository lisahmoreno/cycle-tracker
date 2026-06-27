import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from 'recharts'
import { getSymptomsByPhase, getTimeSeriesData, getSummaryStats } from '../utils/cycleAnalysis'
import { CYCLE_PHASES } from '../utils/constants'

export default function TrendsPage({ entries }) {
  const symptomsByPhase = getSymptomsByPhase(entries)
  const timeSeriesData = getTimeSeriesData(entries)
  const stats = getSummaryStats(entries)

  if (entries.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <div className="max-w-lg mx-auto">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Noch keine Daten</h2>
          <p className="text-gray-500">
            Fülle ein paar Tagebuch-Einträge aus, um Trends zu sehen.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 pb-24 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Deine Trends</h1>

      {/* Summary Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-gray-800">{stats.avgEnergy}</div>
            <div className="text-xs text-gray-500">Ø Energie</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-gray-800">{stats.avgStress}</div>
            <div className="text-xs text-gray-500">Ø Stress</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-gray-800">{stats.avgSleep}h</div>
            <div className="text-xs text-gray-500">Ø Schlaf</div>
          </div>
        </div>
      )}

      {/* Symptoms by Cycle Phase - PRIMARY FEATURE */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Symptome nach Zyklusphase
        </h2>
        <div className="space-y-4">
          {symptomsByPhase.map(phase => (
            <div key={phase.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: phase.color }}
                />
                <span className="font-medium text-gray-800">{phase.label}</span>
                <span className="text-sm text-gray-500">
                  ({phase.totalDays} {phase.totalDays === 1 ? 'Tag' : 'Tage'})
                </span>
              </div>

              {phase.symptoms.length > 0 ? (
                <div className="space-y-2">
                  {phase.symptoms.slice(0, 5).map(symptom => (
                    <div key={symptom.id} className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{symptom.label}</span>
                          <span className="text-gray-500">{symptom.percentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${symptom.percentage}%`,
                              backgroundColor: phase.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Noch keine Symptome erfasst
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Energy & Stress Over Time */}
      {timeSeriesData.length > 1 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Energie & Stress im Zeitverlauf
          </h2>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(d) => d.slice(5)}
                />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                <Tooltip
                  labelFormatter={(d) => d}
                  contentStyle={{ fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="energy"
                  name="Energie"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="stressAvg"
                  name="Stress (Ø)"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Data count */}
      <p className="text-center text-sm text-gray-400">
        Basierend auf {entries.length} {entries.length === 1 ? 'Eintrag' : 'Einträgen'}
      </p>
    </div>
  )
}
