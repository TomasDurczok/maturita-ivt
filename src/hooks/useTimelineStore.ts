import { useCallback, useEffect, useState } from 'react'
import { createNovovekTimeline } from '../data/novovek'
import {
  createEmptyTimeline,
  createEvent,
  createId,
  createTrack,
} from '../types'
import type { EventKind, Timeline, TimelineEvent, Track } from '../types'

const STORAGE_KEY = 'dejepis-timeline-data-v2'

function loadTimelines(): Timeline[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Timeline[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    /* ignore */
  }
  return [createNovovekTimeline()]
}

function saveTimelines(timelines: Timeline[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(timelines))
}

export function useTimelineStore() {
  const [timelines, setTimelines] = useState<Timeline[]>(() => loadTimelines())
  const [activeTimelineId, setActiveTimelineId] = useState<string | null>(() => {
    const loaded = loadTimelines()
    return loaded[0]?.id ?? null
  })

  useEffect(() => {
    saveTimelines(timelines)
  }, [timelines])

  const activeTimeline = timelines.find((t) => t.id === activeTimelineId) ?? null

  const updateTimeline = useCallback((id: string, updater: (t: Timeline) => Timeline) => {
    setTimelines((prev) => prev.map((t) => (t.id === id ? updater(t) : t)))
  }, [])

  const addTimeline = useCallback((name?: string) => {
    const timeline = createEmptyTimeline(name)
    setTimelines((prev) => [...prev, timeline])
    setActiveTimelineId(timeline.id)
    return timeline
  }, [])

  const addTrack = useCallback(
    (name: string, yearFrom?: number, yearTo?: number) => {
      if (!activeTimelineId) return null
      const tl = timelines.find((t) => t.id === activeTimelineId)
      if (!tl) return null
      const track = createTrack(name, yearFrom ?? tl.yearFrom, yearTo ?? tl.yearTo)
      updateTimeline(activeTimelineId, (t) => ({
        ...t,
        tracks: [...t.tracks, track],
      }))
      return track
    },
    [activeTimelineId, timelines, updateTimeline],
  )

  const updateTrack = useCallback(
    (trackId: string, patch: Partial<Track>) => {
      if (!activeTimelineId) return
      updateTimeline(activeTimelineId, (t) => ({
        ...t,
        tracks: t.tracks.map((tr) => (tr.id === trackId ? { ...tr, ...patch } : tr)),
      }))
    },
    [activeTimelineId, updateTimeline],
  )

  const removeTrack = useCallback(
    (trackId: string) => {
      if (!activeTimelineId) return
      updateTimeline(activeTimelineId, (t) => ({
        ...t,
        tracks: t.tracks.filter((tr) => tr.id !== trackId),
        events: t.events.filter((e) => e.trackId !== trackId),
      }))
    },
    [activeTimelineId, updateTimeline],
  )

  const addEventAtYear = useCallback(
    (trackId: string, year: number, kind: EventKind = 'point') => {
      if (!activeTimelineId) return null
      const event = createEvent(trackId, year, kind)
      updateTimeline(activeTimelineId, (t) => ({
        ...t,
        events: [...t.events, event],
      }))
      return event
    },
    [activeTimelineId, updateTimeline],
  )

  const updateEvent = useCallback(
    (eventId: string, patch: Partial<TimelineEvent>) => {
      if (!activeTimelineId) return
      updateTimeline(activeTimelineId, (t) => ({
        ...t,
        events: t.events.map((e) => (e.id === eventId ? { ...e, ...patch } : e)),
      }))
    },
    [activeTimelineId, updateTimeline],
  )

  const removeEvent = useCallback(
    (eventId: string) => {
      if (!activeTimelineId) return
      updateTimeline(activeTimelineId, (t) => ({
        ...t,
        events: t.events.filter((e) => e.id !== eventId),
      }))
    },
    [activeTimelineId, updateTimeline],
  )

  const duplicateTimeline = useCallback(
    (id: string) => {
      const source = timelines.find((t) => t.id === id)
      if (!source) return
      const copy: Timeline = {
        ...source,
        id: createId(),
        name: `${source.name} (kopie)`,
        tracks: source.tracks.map((tr) => ({ ...tr, id: createId() })),
        events: [],
      }
      const trackIdMap = new Map(source.tracks.map((tr, i) => [tr.id, copy.tracks[i].id]))
      copy.events = source.events.map((e) => ({
        ...e,
        id: createId(),
        trackId: trackIdMap.get(e.trackId) ?? e.trackId,
      }))
      setTimelines((prev) => [...prev, copy])
      setActiveTimelineId(copy.id)
    },
    [timelines],
  )

  return {
    timelines,
    activeTimeline,
    activeTimelineId,
    setActiveTimelineId,
    addTimeline,
    addTrack,
    updateTrack,
    removeTrack,
    addEventAtYear,
    updateEvent,
    removeEvent,
    updateTimeline,
    duplicateTimeline,
  }
}
