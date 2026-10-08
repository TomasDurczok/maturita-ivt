import { useMemo } from 'react'
import type { Timeline, TimelineEvent, Track } from '../types'
import { PIXELS_PER_YEAR } from '../types'
import './TimelineCanvas.css'

interface TimelineCanvasProps {
  timeline: Timeline
  visibleTrackIds: string[] | null
  activeTrackId: string | null
  onTrackClick: (track: Track) => void
  onTrackAreaClick: (trackId: string, year: number) => void
  onEventClick: (event: TimelineEvent) => void
}

const TICK_INTERVAL = 50

function yearToX(year: number, yearFrom: number): number {
  return (year - yearFrom) * PIXELS_PER_YEAR
}

function xToYear(x: number, yearFrom: number, yearTo: number): number {
  const year = yearFrom + x / PIXELS_PER_YEAR
  return Math.round(Math.max(yearFrom, Math.min(yearTo, year)))
}

export function TimelineCanvas({
  timeline,
  visibleTrackIds,
  activeTrackId,
  onTrackClick,
  onTrackAreaClick,
  onEventClick,
}: TimelineCanvasProps) {
  const axisWidth = Math.max((timeline.yearTo - timeline.yearFrom) * PIXELS_PER_YEAR, 400)

  const ticks = useMemo(() => {
    const result: number[] = []
    const start = Math.ceil(timeline.yearFrom / TICK_INTERVAL) * TICK_INTERVAL
    for (let y = start; y <= timeline.yearTo; y += TICK_INTERVAL) {
      result.push(y)
    }
    return result
  }, [timeline.yearFrom, timeline.yearTo])

  const tracks = visibleTrackIds
    ? timeline.tracks.filter((t) => visibleTrackIds.includes(t.id))
    : timeline.tracks

  const handleLaneClick = (trackId: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const year = xToYear(x, timeline.yearFrom, timeline.yearTo)
    onTrackAreaClick(trackId, year)
  }

  return (
    <div className="osa-kontejner">
      <div className="timeline-canvas__ruler" style={{ width: axisWidth }}>
        {ticks.map((year) => (
          <div key={year} className="timeline-canvas__tick" style={{ left: yearToX(year, timeline.yearFrom) }}>
            {year}
          </div>
        ))}
      </div>

      {tracks.length === 0 ? (
        <div className="timeline-canvas__empty">
          <p>Zatím nemáte žádnou osu.</p>
          <p className="timeline-canvas__hint">
            V nabídce NABÍDKA otevřete časovou osu a pod ní klikněte na „+ Přidat osu“.
          </p>
        </div>
      ) : (
        tracks.map((track) => {
          const events = timeline.events.filter((e) => e.trackId === track.id)
          const periods = events.filter((e) => e.kind === 'period')
          const points = events.filter((e) => e.kind === 'point')
          const isActive = activeTrackId === track.id

          return (
            <div
              key={track.id}
              className={`radek-statu ${isActive ? 'radek-statu--active' : ''}`}
            >
              <button
                type="button"
                className="nazev-statu"
                onClick={() => onTrackClick(track)}
                title="Kliknutím upravíte nastavení osy"
              >
                {track.name}
              </button>

              <div
                className="dlouha-cara"
                style={{ width: axisWidth, opacity: track.transparent ? 0.45 : 1 }}
                onClick={(e) => handleLaneClick(track.id, e)}
                role="presentation"
              >
                {ticks.map((year) => (
                  <div
                    key={`g-${year}`}
                    className="timeline-canvas__gridline"
                    style={{ left: yearToX(year, timeline.yearFrom) }}
                  />
                ))}

                {periods.map((event) => {
                  const end = event.yearTo ?? event.yearFrom
                  let width = (end - event.yearFrom) * PIXELS_PER_YEAR
                  if (width === 0) width = 15
                  const left = yearToX(event.yearFrom, timeline.yearFrom)
                  return (
                    <button
                      key={event.id}
                      type="button"
                      className={`obdobi text-${event.side}${event.hideStartYear ? ' bez-leveho' : ''}${event.hideEndYear ? ' bez-praveho' : ''}`}
                      style={{
                        left,
                        width,
                        backgroundColor: event.color,
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                      title={event.title || 'Období'}
                    >
                      <span className={`popisek ${event.side}`}>{event.title || 'Období'}</span>
                      {!event.hideStartYear && (
                        <span
                          className={`rok-stitek rok-od-stitek${end === event.yearFrom ? ' rok-stitek--center' : ''}`}
                        >
                          {event.yearFrom}
                        </span>
                      )}
                      {!event.hideEndYear && end !== event.yearFrom && (
                        <span className="rok-stitek rok-do-stitek">{end}</span>
                      )}
                    </button>
                  )
                })}

                {points.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    className={`udalost-bod ${event.side}`}
                    style={{ left: yearToX(event.yearFrom, timeline.yearFrom) }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEventClick(event)
                    }}
                    title={`${event.yearFrom}: ${event.title.replace(/\n/g, ' ')}`}
                  >
                    <span className="popisek-bodu">
                      <span className="roky">{event.yearFrom}</span>
                      <br />
                      {event.title.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < event.title.split('\n').length - 1 ? <br /> : null}
                        </span>
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
