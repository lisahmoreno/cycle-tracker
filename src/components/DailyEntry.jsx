import React from 'react'
import FormSection from './FormSection'
import SliderInput from './SliderInput'
import MultiSelect from './MultiSelect'
import TimeInput from './TimeInput'
import {
  CYCLE_PHASES,
  SLEEP_QUALITY,
  MOVEMENT_TYPES,
  MOVEMENT_FEELINGS,
  REGENERATION_OPTIONS,
  SYMPTOMS,
} from '../utils/constants'

// Calculate sleep hours from time strings (handles overnight sleep)
function calculateSleepHours(fromTime, toTime) {
  const [fromH, fromM] = fromTime.split(':').map(Number)
  const [toH, toM] = toTime.split(':').map(Number)

  let fromMinutes = fromH * 60 + fromM
  let toMinutes = toH * 60 + toM

  // If "to" is earlier than "from", assume overnight sleep
  if (toMinutes <= fromMinutes) {
    toMinutes += 24 * 60
  }

  const diffMinutes = toMinutes - fromMinutes
  const hours = Math.round(diffMinutes / 30) / 2 // Round to nearest 0.5
  return hours
}

export default function DailyEntry({ entry, onChange }) {
  const update = (field, value) => {
    onChange({ ...entry, [field]: value })
  }

  return (
    <div className="space-y-1">
      {/* Section 1: Basis-Check-in */}
      <FormSection number={1} title="Basis-Check-in">
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">
            Zyklustag (optional)
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={entry.cycleDay ?? ''}
            onChange={(e) => {
              const val = e.target.value
              if (val === '') {
                update('cycleDay', null)
              } else {
                const num = parseInt(val, 10)
                if (!isNaN(num) && num >= 1 && num <= 40) {
                  update('cycleDay', num)
                }
              }
            }}
            placeholder="z.B. 14"
            className="w-24 px-3 py-3 bg-diary-accent rounded-lg text-center text-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">Zyklusphase</label>
          <div className="grid grid-cols-2 gap-2">
            {CYCLE_PHASES.map(phase => (
              <button
                key={phase.id}
                type="button"
                onClick={() => update('cyclePhase', entry.cyclePhase === phase.id ? null : phase.id)}
                className={`px-4 py-3 rounded-xl border-2 transition-all font-medium
                  ${entry.cyclePhase === phase.id
                    ? 'text-white border-transparent'
                    : 'border-gray-300 text-gray-700 bg-white'}`}
                style={entry.cyclePhase === phase.id ? { backgroundColor: phase.color } : {}}
              >
                {phase.label}
              </button>
            ))}
          </div>
        </div>

        <SliderInput
          label="Energielevel heute"
          value={entry.energyLevel}
          onChange={(v) => update('energyLevel', v)}
          lowLabel="niedrig"
          highLabel="sehr hoch"
        />
      </FormSection>

      {/* Section 2: Stresslevel */}
      <FormSection number={2} title="Stresslevel über den Tag">
        <SliderInput
          label="Morgens"
          value={entry.stressMorning}
          onChange={(v) => update('stressMorning', v)}
          lowLabel="niedrig"
          highLabel="sehr hoch"
        />
        <SliderInput
          label="Mittags"
          value={entry.stressMidday}
          onChange={(v) => update('stressMidday', v)}
          lowLabel="niedrig"
          highLabel="sehr hoch"
        />
        <SliderInput
          label="Abends"
          value={entry.stressEvening}
          onChange={(v) => update('stressEvening', v)}
          lowLabel="niedrig"
          highLabel="sehr hoch"
        />
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Haupt-Stressor heute (optional)
          </label>
          <input
            type="text"
            value={entry.mainStressor || ''}
            onChange={(e) => update('mainStressor', e.target.value)}
            placeholder="z.B. Arbeit, Familie..."
            className="w-full px-3 py-2 bg-diary-accent rounded-lg"
          />
        </div>
      </FormSection>

      {/* Section 3: Schlaf */}
      <FormSection number={3} title="Schlaf">
        <div className="flex gap-4 mb-4">
          <TimeInput
            label="von"
            value={entry.sleepFrom}
            onChange={(v) => {
              update('sleepFrom', v)
              // Auto-calculate sleep hours
              if (v && entry.sleepTo) {
                const hours = calculateSleepHours(v, entry.sleepTo)
                update('sleepHours', hours)
              }
            }}
          />
          <TimeInput
            label="bis"
            value={entry.sleepTo}
            onChange={(v) => {
              update('sleepTo', v)
              // Auto-calculate sleep hours
              if (entry.sleepFrom && v) {
                const hours = calculateSleepHours(entry.sleepFrom, v)
                update('sleepHours', hours)
              }
            }}
          />
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Schlafdauer:</span>
            <span className="text-xl font-semibold text-gray-800">
              {entry.sleepHours ? `${entry.sleepHours} Stunden` : '–'}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">Schlafqualität</label>
          <div className="flex gap-1">
            {SLEEP_QUALITY.map(q => (
              <button
                key={q.value}
                type="button"
                onClick={() => update('sleepQuality', q.value)}
                className={`flex-1 py-2 px-1 text-xs rounded-lg transition-all
                  ${entry.sleepQuality === q.value
                    ? 'bg-gray-800 text-white'
                    : 'bg-diary-accent text-gray-700'}`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={entry.sleepRestless || false}
            onChange={(e) => update('sleepRestless', e.target.checked)}
            className="w-5 h-5 rounded"
          />
          <span className="text-gray-700">Aufgewacht / unruhig geschlafen</span>
        </label>
      </FormSection>

      {/* Section 4: Bewegung */}
      <FormSection number={4} title="Bewegung">
        <MultiSelect
          label="Art der Bewegung"
          options={MOVEMENT_TYPES}
          selected={entry.movementTypes || []}
          onChange={(v) => update('movementTypes', v)}
        />
        {(entry.movementTypes || []).includes('sonstiges') && (
          <input
            type="text"
            value={entry.movementOther || ''}
            onChange={(e) => update('movementOther', e.target.value)}
            placeholder="Welche Bewegung?"
            className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg mt-2 mb-4"
          />
        )}

        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">Dauer</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={entry.movementDuration || ''}
              onChange={(e) => {
                const val = e.target.value
                if (val === '') {
                  update('movementDuration', 0)
                } else {
                  const num = parseInt(val, 10)
                  if (!isNaN(num) && num >= 0 && num <= 300) {
                    update('movementDuration', num)
                  }
                }
              }}
              placeholder="0"
              className="w-20 px-3 py-2 bg-diary-accent rounded-lg text-center text-lg"
            />
            <span className="text-gray-600">Minuten</span>
          </div>
        </div>

        <MultiSelect
          label="Hat sich die Bewegung heute eher... angefühlt"
          options={MOVEMENT_FEELINGS}
          selected={entry.movementFeeling ? [entry.movementFeeling] : []}
          onChange={(v) => update('movementFeeling', v[0] || null)}
          single
        />
      </FormSection>

      {/* Section 5: Nervensystem & Regeneration */}
      <FormSection number={5} title="Nervensystem & Regeneration">
        <p className="text-sm text-gray-600 mb-3">
          Was hat heute bewusst zur Beruhigung beigetragen? (Mehrfachauswahl möglich)
        </p>
        <MultiSelect
          options={REGENERATION_OPTIONS}
          selected={entry.regeneration || []}
          onChange={(v) => update('regeneration', v)}
        />
        {(entry.regeneration || []).includes('sonstiges') && (
          <input
            type="text"
            value={entry.regenerationOther || ''}
            onChange={(e) => update('regenerationOther', e.target.value)}
            placeholder="Was hat dir gutgetan?"
            className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg mt-2"
          />
        )}
      </FormSection>

      {/* Section 6: Körperliche & emotionale Signale */}
      <FormSection number={6} title="Körperliche & emotionale Signale">
        <p className="text-sm text-gray-600 mb-3">
          Heute besonders wahrnehmbar:
        </p>
        <MultiSelect
          options={SYMPTOMS}
          selected={entry.symptoms || []}
          onChange={(v) => update('symptoms', v)}
        />
        {(entry.symptoms || []).includes('sonstiges') && (
          <input
            type="text"
            value={entry.symptomsOther || ''}
            onChange={(e) => update('symptomsOther', e.target.value)}
            placeholder="Welche Symptome?"
            className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg mt-2"
          />
        )}
      </FormSection>

      {/* Section 7: Mini-Reflexion */}
      <FormSection number={7} title="Mini-Reflexion">
        <p className="text-sm text-gray-600 mb-3">
          Was hat mein Körper mir heute gezeigt? (1 Satz genügt)
        </p>
        <textarea
          value={entry.reflection || ''}
          onChange={(e) => update('reflection', e.target.value)}
          placeholder="z.B. Ich war heute müder als sonst..."
          rows={3}
          className="w-full px-3 py-2 bg-diary-accent rounded-lg resize-none"
        />
      </FormSection>
    </div>
  )
}
