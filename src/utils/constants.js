// Cycle phases
export const CYCLE_PHASES = [
  { id: 'menstruation', label: 'Menstruation', color: '#ef4444' },
  { id: 'follikel', label: 'Follikel', color: '#f97316' },
  { id: 'ovulation', label: 'Ovulation', color: '#22c55e' },
  { id: 'luteal', label: 'Luteal', color: '#8b5cf6' },
]

// Sleep quality options
export const SLEEP_QUALITY = [
  { value: 1, label: 'Sehr schlecht' },
  { value: 2, label: 'Eher schlecht' },
  { value: 3, label: 'Okay' },
  { value: 4, label: 'Gut' },
  { value: 5, label: 'Sehr gut' },
]

// Movement types
export const MOVEMENT_TYPES = [
  { id: 'spaziergang', label: 'Spaziergang' },
  { id: 'krafttraining', label: 'Krafttraining' },
  { id: 'yoga', label: 'Yoga/Stretching' },
  { id: 'ausdauer', label: 'Ausdauer' },
  { id: 'alltag', label: 'Alltag/keine' },
  { id: 'sonstiges', label: 'Sonstiges' },
]

// Movement feeling
export const MOVEMENT_FEELINGS = [
  { id: 'energieraubend', label: 'Energieraubend', emoji: '😮‍💨' },
  { id: 'neutral', label: 'Neutral', emoji: '😐' },
  { id: 'energiegebend', label: 'Energiegebend', emoji: '⚡' },
]

// Regeneration activities
export const REGENERATION_OPTIONS = [
  { id: 'pausen', label: 'Pausen' },
  { id: 'atem', label: 'Atem / bewusste Entspannung' },
  { id: 'zeit', label: 'Zeit für mich' },
  { id: 'natur', label: 'Natur / frische Luft' },
  { id: 'sozial', label: 'Soziale Verbindung' },
  { id: 'nichts', label: 'Nichts davon' },
  { id: 'sonstiges', label: 'Sonstiges' },
]

// Symptoms
export const SYMPTOMS = [
  { id: 'erschoepfung', label: 'Erschöpfung' },
  { id: 'reizbarkeit', label: 'Reizbarkeit' },
  { id: 'konzentration', label: 'Konzentrationsschwierigkeiten' },
  { id: 'pms', label: 'PMS-Symptome' },
  { id: 'unruhe', label: 'Innere Unruhe' },
  { id: 'keine', label: 'Keine besonderen Symptome' },
  { id: 'sonstiges', label: 'Sonstiges' },
]

// Default entry template
export const DEFAULT_ENTRY = {
  cycleDay: null,
  cyclePhase: null,
  energyLevel: 5,
  stressMorning: 5,
  stressMidday: 5,
  stressEvening: 5,
  mainStressor: '',
  sleepHours: 8,
  sleepFrom: '23:00',
  sleepTo: '07:00',
  sleepQuality: 3,
  sleepRestless: false,
  movementTypes: [],
  movementDuration: 0,
  movementFeeling: null,
  movementOther: '',
  regeneration: [],
  regenerationOther: '',
  symptoms: [],
  symptomsOther: '',
  reflection: '',
}
