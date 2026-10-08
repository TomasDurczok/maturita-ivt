import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Timeline, Track } from '../types'
import './Modal.css'

interface TrackSettingsModalProps {
  track: Track
  timeline: Timeline
  onSave: (patch: Partial<Track>) => void
  onDelete: () => void
  onClose: () => void
}

export function TrackSettingsModal({
  track,
  timeline,
  onSave,
  onDelete,
  onClose,
}: TrackSettingsModalProps) {
  const [draft, setDraft] = useState(track)

  useEffect(() => {
    setDraft(track)
  }, [track])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSave(draft)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--track" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <span className="modal__indicator modal__indicator--purple" />
          <h2>{draft.name || 'Osa'}</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Zavřít">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal__body">
          <label className="field">
            <span>Název osy</span>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Např. ČESKO, NĚMECKO, POLITIKA…"
            />
          </label>

          <div className="field-row">
            <label className="field">
              <span>Od roku</span>
              <input
                type="number"
                value={draft.yearFrom}
                onChange={(e) => setDraft({ ...draft, yearFrom: Number(e.target.value) })}
                min={timeline.yearFrom}
                max={timeline.yearTo}
              />
            </label>
            <label className="field">
              <span>Do roku</span>
              <input
                type="number"
                value={draft.yearTo}
                onChange={(e) => setDraft({ ...draft, yearTo: Number(e.target.value) })}
                min={timeline.yearFrom}
                max={timeline.yearTo}
              />
            </label>
          </div>

          <fieldset className="toggle-group">
            <legend>Nastavení zobrazení</legend>
            <label className="toggle">
              <input
                type="checkbox"
                checked={draft.showNotes}
                onChange={(e) => setDraft({ ...draft, showNotes: e.target.checked })}
              />
              Ukázat poznámky
            </label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={draft.transparent}
                onChange={(e) => setDraft({ ...draft, transparent: e.target.checked })}
              />
              Zobrazit transparentně
            </label>
          </fieldset>

          <div className="modal__actions">
            <button type="button" className="btn btn--danger" onClick={onDelete}>
              Smazat osu
            </button>
            <div className="modal__actions-right">
              <button type="button" className="btn btn--secondary" onClick={onClose}>
                Zrušit
              </button>
              <button type="submit" className="btn btn--primary">
                Uložit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
