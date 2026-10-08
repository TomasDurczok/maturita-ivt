import type { Timeline } from '../types'
import './TimelineMenu.css'

interface TimelineMenuProps {
  timeline: Timeline | null
  timelines: Timeline[]
  activeTrackId: string | null
  onSelectTrack: (trackId: string) => void
  onAddTrack: () => void
  onAddTimeline: () => void
  onSelectTimeline: (id: string) => void
}

export function TimelineMenu({
  timeline,
  timelines,
  activeTrackId,
  onSelectTrack,
  onAddTrack,
  onAddTimeline,
  onSelectTimeline,
}: TimelineMenuProps) {
  return (
    <div className="timeline-menu">
      <div className="timeline-menu__trigger">NABÍDKA</div>
      <div className="timeline-menu__panel">
        <div className="timeline-menu__panel-title">NABÍDKA</div>

        <div className="timeline-menu__section">
          <div className="timeline-menu__heading">Časové osy</div>

          {timelines.length === 0 ? (
            <>
              <p className="timeline-menu__empty">
                Zatím nemáte žádnou časovou osu. Vytvořte první a pak k ní přidávejte osy regionů
                (např. ČESKO, NĚMECKO).
              </p>
              <button type="button" className="timeline-menu__add" onClick={onAddTimeline}>
                + Přidat časovou osu
              </button>
            </>
          ) : (
            <ul className="timeline-menu__list">
              {timelines.map((tl) => {
                const isOpen = timeline?.id === tl.id
                return (
                  <li key={tl.id} className="timeline-menu__timeline-item">
                    <button
                      type="button"
                      className={`timeline-menu__item timeline-menu__item--timeline ${isOpen ? 'active' : ''}`}
                      onClick={() => onSelectTimeline(tl.id)}
                    >
                      {tl.name}
                      <span className="timeline-menu__item-meta">
                        {tl.yearFrom}–{tl.yearTo}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="timeline-menu__nested">
                        <button type="button" className="timeline-menu__add timeline-menu__add--nested" onClick={onAddTrack}>
                          + Přidat osu
                        </button>

                        {tl.tracks.length === 0 ? (
                          <p className="timeline-menu__empty timeline-menu__empty--nested">
                            Klikněte výše a přidejte první osu, nebo ji vytvořte na plátně vpravo.
                          </p>
                        ) : (
                          <ul className="timeline-menu__list timeline-menu__list--tracks">
                            {tl.tracks.map((track) => (
                              <li key={track.id}>
                                <button
                                  type="button"
                                  className={`timeline-menu__item timeline-menu__item--track ${activeTrackId === track.id ? 'active' : ''}`}
                                  onClick={() => onSelectTrack(track.id)}
                                >
                                  {track.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}

          {timelines.length > 0 && (
            <button type="button" className="timeline-menu__add" onClick={onAddTimeline}>
              + Nová časová osa
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
