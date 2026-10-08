import { useState } from 'react'
import type { FormEvent } from 'react'
import './Modal.css'

interface AddTimelineModalProps {
  onAdd: (name: string, yearFrom: number, yearTo: number) => void
  onClose: () => void
}

export function AddTimelineModal({ onAdd, onClose }: AddTimelineModalProps) {
  const [name, setName] = useState('Nová časová osa')
  const [yearFrom, setYearFrom] = useState(1500)
  const [yearTo, setYearTo] = useState(1980)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onAdd(name.trim() || 'Nová časová osa', yearFrom, yearTo)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>Nová časová osa</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Zavřít">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal__body">
          <label className="field">
            <span>Název</span>
            <input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
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
              <button type="submit" className="btn btn--primary">
                Vytvořit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
