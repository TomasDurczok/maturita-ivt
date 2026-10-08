export type EventKind = 'point' | 'period'
export type EventSide = 'nahoru' | 'dolu'

export interface TimelineEvent {
  id: string
  trackId: string
  kind: EventKind
  yearFrom: number
  yearTo: number | null
  title: string
  description: string
  notes: string
  color: string
  side: EventSide
  hideStartYear: boolean
  hideEndYear: boolean
}

export interface Track {
  id: string
  name: string
  yearFrom: number
  yearTo: number
  showNotes: boolean
  transparent: boolean
}

export interface Timeline {
  id: string
  name: string
  yearFrom: number
  yearTo: number
  tracks: Track[]
  events: TimelineEvent[]
}

export const PIXELS_PER_YEAR = 10

export const DEFAULT_COLORS = [
  '#778899',
  '#FF8C00',
  '#00BFFF',
  '#DC143C',
  '#32CD32',
  '#FF69B4',
  '#0000CD',
  '#A0522D',
]

export function createId(): string {
  return crypto.randomUUID()
}

export function createEmptyTimeline(name = 'Nová časová osa'): Timeline {
  return {
    id: createId(),
    name,
    yearFrom: 1500,
    yearTo: 1980,
    tracks: [],
    events: [],
  }
}

export function createTrack(name: string, yearFrom: number, yearTo: number): Track {
  return {
    id: createId(),
    name,
    yearFrom,
    yearTo,
    showNotes: true,
    transparent: false,
  }
}

export function createEvent(
  trackId: string,
  year: number,
  kind: EventKind = 'point',
): TimelineEvent {
  return {
    id: createId(),
    trackId,
    kind,
    yearFrom: year,
    yearTo: kind === 'period' ? year + 10 : null,
    title: '',
    description: '',
    notes: '',
    color: DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)],
    side: kind === 'period' ? 'nahoru' : 'dolu',
    hideStartYear: false,
    hideEndYear: false,
  }
}
