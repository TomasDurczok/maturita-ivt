import { useState } from 'react'
import { AddTimelineModal } from './components/AddTimelineModal'
import { AddTrackModal } from './components/AddTrackModal'
import { EventModal } from './components/EventModal'
import { TimelineCanvas } from './components/TimelineCanvas'
import { TimelineMenu } from './components/TimelineMenu'
import { TrackSettingsModal } from './components/TrackSettingsModal'
import { useTimelineStore } from './hooks/useTimelineStore'
import type { TimelineEvent, Track } from './types'
import './App.css'

type ModalState =
  | { type: 'none' }
  | { type: 'addTimeline' }
  | { type: 'addTrack' }
  | { type: 'event'; event: TimelineEvent }
  | { type: 'track'; track: Track }

function App() {
  const store = useTimelineStore()
  const [modal, setModal] = useState<ModalState>({ type: 'none' })
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null)
  const [filterTrackId, setFilterTrackId] = useState('vse')

  const handleAddTimeline = () => setModal({ type: 'addTimeline' })

  const handleCreateTimeline = (name: string, yearFrom: number, yearTo: number) => {
    const tl = store.addTimeline(name)
    store.updateTimeline(tl.id, (t) => ({ ...t, yearFrom, yearTo }))
  }

  const handleAddTrack = () => {
    if (!store.activeTimeline) {
      handleAddTimeline()
      return
    }
    setModal({ type: 'addTrack' })
  }

  const handleCreateTrack = (name: string, yearFrom: number, yearTo: number) => {
    const track = store.addTrack(name, yearFrom, yearTo)
    if (track) setActiveTrackId(track.id)
  }

  const handleTrackAreaClick = (trackId: string, year: number) => {
    const event = store.addEventAtYear(trackId, year, 'point')
    if (event) setModal({ type: 'event', event })
  }

  const visibleTrackIds =
    filterTrackId === 'vse' || !store.activeTimeline
      ? null
      : [filterTrackId]

  return (
    <div className="app">
      <TimelineMenu
        timeline={store.activeTimeline}
        timelines={store.timelines}
        activeTrackId={activeTrackId}
        onSelectTrack={setActiveTrackId}
        onAddTrack={handleAddTrack}
        onAddTimeline={handleAddTimeline}
        onSelectTimeline={(id) => {
          store.setActiveTimelineId(id)
          setFilterTrackId('vse')
        }}
      />

      {store.activeTimeline ? (
        <div className="app__workspace">
          <h1>{store.activeTimeline.name}</h1>
          <select
            className="app__filter"
            value={filterTrackId}
            onChange={(e) => setFilterTrackId(e.target.value)}
          >
            <option value="vse">Zobrazit vše (všechny státy)</option>
            {store.activeTimeline.tracks.map((track) => (
              <option key={track.id} value={track.id}>
                {track.name}
              </option>
            ))}
          </select>

          <TimelineCanvas
            timeline={store.activeTimeline}
            visibleTrackIds={visibleTrackIds}
            activeTrackId={activeTrackId}
            onTrackClick={(track) => {
              setActiveTrackId(track.id)
              setModal({ type: 'track', track })
            }}
            onTrackAreaClick={handleTrackAreaClick}
            onEventClick={(event) => setModal({ type: 'event', event })}
          />

          <p className="app__hint">
            Klik na šedou osu = nová událost. Klik na událost nebo období = úprava. Klik na název
            státu = nastavení osy.
          </p>
        </div>
      ) : (
        <div className="app__welcome">
          <h1>Kontextová časová osa</h1>
          <p>Nástroj pro učitele — tvorba a úprava časových os</p>
          <p className="app__welcome-hint">
            Najeďte myší na <strong>NABÍDKA</strong> vlevo nahoře a vytvořte časovou osu.
          </p>
          <button type="button" className="app__welcome-btn" onClick={handleAddTimeline}>
            + Vytvořit první časovou osu
          </button>
        </div>
      )}

      {modal.type === 'addTimeline' && (
        <AddTimelineModal
          onAdd={handleCreateTimeline}
          onClose={() => setModal({ type: 'none' })}
        />
      )}

      {modal.type === 'addTrack' && store.activeTimeline && (
        <AddTrackModal
          timeline={store.activeTimeline}
          onAdd={handleCreateTrack}
          onClose={() => setModal({ type: 'none' })}
        />
      )}

      {modal.type === 'event' && store.activeTimeline && (
        <EventModal
          event={modal.event}
          timeline={store.activeTimeline}
          onSave={(patch) => {
            store.updateEvent(modal.event.id, patch)
            setModal({ type: 'none' })
          }}
          onDelete={() => {
            store.removeEvent(modal.event.id)
            setModal({ type: 'none' })
          }}
          onClose={() => {
            if (!modal.event.title.trim()) {
              store.removeEvent(modal.event.id)
            }
            setModal({ type: 'none' })
          }}
        />
      )}

      {modal.type === 'track' && store.activeTimeline && (
        <TrackSettingsModal
          track={modal.track}
          timeline={store.activeTimeline}
          onSave={(patch) => store.updateTrack(modal.track.id, patch)}
          onDelete={() => {
            store.removeTrack(modal.track.id)
            setActiveTrackId(null)
            setModal({ type: 'none' })
          }}
          onClose={() => setModal({ type: 'none' })}
        />
      )}
    </div>
  )
}

export default App
