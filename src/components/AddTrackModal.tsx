import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Timeline } from '../types'
import './Modal.css'

interface AddTrackModalProps {
  timeline: Timeline
  onAdd: (name: string, yearFrom: number, yearTo: number) => void
  onClose: () => void
}

export function AddTrackModal({ timeline, onAdd, onClose }: AddTrackModalProps) {
  const [name, setName] = useState('')
  const [yearFrom, setYearFrom] = useState(timeline.yearFrom)
  const [yearTo, setYearTo] = useState(timeline.yearTo)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name.trim(), yearFrom, yearTo)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <span className="modal__indicator modal__indicator--purple" />
          <h2>Nová osa</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Zavřít">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal__body">
          <label className="field">
            <span>Název osy</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Např. ČESKO, EVROPA, POLITIKA…"
              autoFocus
            />
          </label>

          <div className="field-row">
            <label className="field">
              <span>Od roku</span>
              <input
                type="number"
                value={yearFrom}
                onChange={(e) => setYearFrom(Number(e.target.value))}
              />
            </label>
            <label className="field">
              <span>Do roku</span>
              <input
                type="number"
                value={yearTo}
                onChange={(e) => setYearTo(Number(e.target.value))}
              />
            </label>
          </div>

          <div className="modal__actions">
            <div className="modal__actions-right">
              <button type="button" className="btn btn--secondary" onClick={onClose}>
                Zrušit
              </button>
              <button type="submit" className="btn btn--primary" disabled={!name.trim()}>
                Vytvořit osu
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
