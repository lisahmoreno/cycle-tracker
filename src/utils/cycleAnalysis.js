import { CYCLE_PHASES, SYMPTOMS } from './constants'

// Group symptoms by cycle phase
export function getSymptomsByPhase(entries) {
  const result = {}

  // Initialize phases
  CYCLE_PHASES.forEach(phase => {
    result[phase.id] = {
      phase: phase,
      symptoms: {},
      totalDays: 0,
    }
  })

  // Count symptoms per phase
  entries.forEach(entry => {
    if (!entry.cyclePhase || !entry.symptoms?.length) return

    const phaseData = result[entry.cyclePhase]
    if (!phaseData) return

    phaseData.totalDays++

    entry.symptoms.forEach(symptomId => {
      if (symptomId === 'keine' || symptomId === 'sonstiges') return
      phaseData.symptoms[symptomId] = (phaseData.symptoms[symptomId] || 0) + 1
    })
  })

  // Convert to sorted arrays and add labels
  return CYCLE_PHASES.map(phase => {
    const phaseData = result[phase.id]
    const symptomArray = Object.entries(phaseData.symptoms)
      .map(([id, count]) => ({
        id,
        label: SYMPTOMS.find(s => s.id === id)?.label || id,
        count,
        percentage: phaseData.totalDays > 0
          ? Math.round((count / phaseData.totalDays) * 100)
          : 0,
      }))
      .sort((a, b) => b.count - a.count)

    return {
      ...phase,
      totalDays: phaseData.totalDays,
      symptoms: symptomArray,
    }
  })
}

// Get average stress/energy over time
export function getTimeSeriesData(entries) {
  return entries
    .filter(e => e.date)
    .map(entry => ({
      date: entry.date,
      energy: entry.energyLevel || 0,
      stressAvg: entry.stressMorning && entry.stressMidday && entry.stressEvening
        ? Math.round((entry.stressMorning + entry.stressMidday + entry.stressEvening) / 3)
        : 0,
      sleepHours: entry.sleepHours || 0,
      sleepQuality: entry.sleepQuality || 0,
      phase: entry.cyclePhase,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

// Get summary statistics
export function getSummaryStats(entries) {
  if (!entries.length) return null

  const validEntries = entries.filter(e => e.energyLevel)

  const avgEnergy = validEntries.reduce((sum, e) => sum + (e.energyLevel || 0), 0) / validEntries.length
  const avgSleep = validEntries.reduce((sum, e) => sum + (e.sleepHours || 0), 0) / validEntries.length

  const stressEntries = entries.filter(e => e.stressMorning && e.stressMidday && e.stressEvening)
  const avgStress = stressEntries.length > 0
    ? stressEntries.reduce((sum, e) =>
        sum + (e.stressMorning + e.stressMidday + e.stressEvening) / 3, 0
      ) / stressEntries.length
    : 0

  return {
    totalEntries: entries.length,
    avgEnergy: avgEnergy.toFixed(1),
    avgStress: avgStress.toFixed(1),
    avgSleep: avgSleep.toFixed(1),
  }
}
