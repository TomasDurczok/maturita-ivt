import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Timeline, TimelineEvent } from '../types'
import './Modal.css'

interface EventModalProps {
  event: TimelineEvent
  timeline: Timeline
  onSave: (patch: Partial<TimelineEvent>) => void
  onDelete: () => void
  onClose: () => void
}

export function EventModal({ event, timeline, onSave, onDelete, onClose }: EventModalProps) {
  const [draft, setDraft] = useState(event)

  useEffect(() => {
    setDraft(event)
  }, [event])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSave({
      ...draft,
      yearTo: draft.kind === 'period' ? draft.yearTo ?? draft.yearFrom : null,
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--event" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <span className="modal__indicator modal__indicator--orange" />
          <h2>UDÁLOST</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Zavřít">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal__body">
          <label className="field">
            <span>Typ</span>
            <select
              value={draft.kind}
              onChange={(e) => {
                const kind = e.target.value as TimelineEvent['kind']
                setDraft({
                  ...draft,
                  kind,
                  yearTo: kind === 'period' ? draft.yearTo ?? draft.yearFrom + 10 : null,
                  side: kind === 'period' ? draft.side : draft.side,
                })
              }}
            >
              <option value="point">Bodová událost (rok + čára)</option>
              <option value="period">Období (barevný blok)</option>
            </select>
          </label>

          <label className="field">
            <span>Název</span>
            <textarea
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              rows={3}
              placeholder="Např. Bitva na Bílé hoře"
            />
          </label>

          <div className="field-row">
            <label className="field">
              <span>{draft.kind === 'period' ? 'Rok od' : 'Rok'}</span>
              <input
                type="number"
                value={draft.yearFrom}
                onChange={(e) => setDraft({ ...draft, yearFrom: Number(e.target.value) })}
                min={timeline.yearFrom}
                max={timeline.yearTo}
              />
            </label>
            {draft.kind === 'period' && (
              <label className="field">
                <span>Rok do</span>
                <input
                  type="number"
                  value={draft.yearTo ?? ''}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      yearTo: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  min={timeline.yearFrom}
                  max={timeline.yearTo}
                />
              </label>
            )}
          </div>

          <label className="field">
            <span>Popisek na ose</span>
            <select
              value={draft.side}
              onChange={(e) => setDraft({ ...draft, side: e.target.value as TimelineEvent['side'] })}
            >
              <option value="nahoru">Nad osou</option>
              <option value="dolu">Pod osou</option>
            </select>
          </label>

          {draft.kind === 'period' && (
            <>
              <label className="field">
                <span>Barva období</span>
                <input
                  type="color"
                  value={draft.color}
                  onChange={(e) => setDraft({ ...draft, color: e.target.value })}
                />
              </label>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={draft.hideStartYear}
                  onChange={(e) => setDraft({ ...draft, hideStartYear: e.target.checked })}
                />
                Skrýt počáteční rok
              </label>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={draft.hideEndYear}
                  onChange={(e) => setDraft({ ...draft, hideEndYear: e.target.checked })}
                />
                Skrýt koncový rok
              </label>
            </>
          )}

          <label className="field">
            <span>Popis</span>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              rows={4}
              placeholder="Podrobný popis…"
            />
          </label>

          <label className="field">
            <span>Poznámky (pro učitele)</span>
            <textarea
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              rows={2}
            />
          </label>

          <div className="modal__actions">
            <button type="button" className="btn btn--danger" onClick={onDelete}>
              Smazat
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
