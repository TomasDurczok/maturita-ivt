import type { EventKind, EventSide, Timeline, TimelineEvent, Track } from '../types'

const YEAR_FROM = 1500
const YEAR_TO = 1980

function track(id: string, name: string): Track {
  return {
    id,
    name,
    yearFrom: YEAR_FROM,
    yearTo: YEAR_TO,
    showNotes: true,
    transparent: false,
  }
}

function period(
  trackId: string,
  id: string,
  yearFrom: number,
  yearTo: number,
  title: string,
  color: string,
  extra?: Partial<TimelineEvent>,
): TimelineEvent {
  return {
    id,
    trackId,
    kind: 'period',
    yearFrom,
    yearTo,
    title,
    description: '',
    notes: '',
    color,
    side: 'nahoru',
    hideStartYear: false,
    hideEndYear: false,
    ...extra,
  }
}

function point(
  trackId: string,
  id: string,
  year: number,
  title: string,
  side: EventSide,
): TimelineEvent {
  return {
    id,
    trackId,
    kind: 'point' as EventKind,
    yearFrom: year,
    yearTo: null,
    title,
    description: '',
    notes: '',
    color: '#444444',
    side,
    hideStartYear: false,
    hideEndYear: false,
  }
}

const CZ = 'track-ceske-zeme'
const DE = 'track-nemecko'
const FR = 'track-francie'
const GB = 'track-britanie'
const S = 'track-jizni-evropa'
const E = 'track-vychodni-evropa'
const W = 'track-zbytek-sveta'
const SCI = 'track-veda'

const CONT = { hideStartYear: true }

export function createNovovekTimeline(): Timeline {
  return {
    id: 'timeline-novovek',
    name: 'Kontextová časová osa českých dějin novověku',
    yearFrom: YEAR_FROM,
    yearTo: YEAR_TO,
    tracks: [
      track(CZ, 'České země'),
      track(DE, 'Německo'),
      track(FR, 'Francie'),
      track(GB, 'Británie'),
      track(S, 'Jižní Evropa'),
      track(E, 'Východní Evropa'),
      track(W, 'Zbytek světa'),
      track(SCI, 'Věda a technika'),
    ],
    events: [
      period(CZ, 'p-ferdinand1a', 1526, 1564, 'Ferdinand I.', '#778899'),
      period(CZ, 'p-maxmilian2', 1564, 1576, 'Maxmilián II.', '#FF8C00', CONT),
      period(CZ, 'p-rudolf2', 1576, 1612, 'Rudolf II.', '#00BFFF', CONT),
      period(CZ, 'p-matyas1', 1612, 1619, 'Matyáš I.', '#DC143C', CONT),
      period(CZ, 'p-ferdinand2', 1619, 1637, 'Ferdinand II.', '#32CD32', CONT),
      period(CZ, 'p-ferdinand3', 1637, 1657, 'Ferdinand III.', '#FFFF00', CONT),
      period(CZ, 'p-leopold1', 1657, 1705, 'Leopold I.', '#FF69B4', CONT),
      period(CZ, 'p-josef1', 1705, 1711, 'Josef I.', '#0000CD', CONT),
      period(CZ, 'p-karel4', 1711, 1740, 'Karel IV.', '#778899', CONT),
      period(CZ, 'p-mt', 1740, 1780, 'Marie Terezie', '#FF8C00', CONT),
      period(CZ, 'p-josef2', 1780, 1790, 'Josef II.', '#A0522D', CONT),
      period(CZ, 'p-leopold2', 1790, 1792, 'Leopold II.', '#DC143C', CONT),
      period(CZ, 'p-frantisek1', 1792, 1835, 'František I.', '#32CD32', CONT),
      period(CZ, 'p-ferdinand1b', 1835, 1848, 'Ferdinand I.', '#DC143C', CONT),
      period(CZ, 'p-fj1', 1848, 1916, 'František Josef I.', '#FF8C00', CONT),
      period(CZ, 'p-karel1', 1916, 1918, 'Karel I.', '#0000CD', CONT),

      point(CZ, 'e-1529', 1529, 'Turci u\nVídně', 'dolu'),
      point(CZ, 'e-1547', 1547, 'první stavovský\nodboj', 'dolu'),
      point(CZ, 'e-1556', 1556, 'rakouští Habsburkové\nzískávají císařskou korunu', 'nahoru'),
      point(CZ, 'e-1561', 1561, 'znovuobsazení\npražského arcibiskupství', 'dolu'),
      point(CZ, 'e-1575', 1575, 'vydání\nČeské konfese', 'dolu'),
      point(CZ, 'e-1583', 1583, 'přesídlení\ndo Prahy', 'dolu'),
      point(CZ, 'e-1609', 1609, 'Majestát\nRudolfa II.', 'dolu'),
      point(CZ, 'e-1618', 1618, 'pražská\ndefenestrace', 'dolu'),
      point(CZ, 'e-1620', 1620, 'Bitva na Bílé hoře', 'nahoru'),
      point(CZ, 'e-1627', 1627, 'obnovené\nzřízení\nzemské', 'dolu'),
      point(CZ, 'e-1634', 1634, 'vražda\nAlbrechta\nz Valdštejna', 'dolu'),
      point(CZ, 'e-1642', 1642, 'švédský vpád\ndo Čech', 'nahoru'),
      point(CZ, 'e-1648', 1648, 'Vestfálský\nmír', 'dolu'),
      point(CZ, 'e-1654', 1654, 'Berní rula', 'dolu'),
      point(CZ, 'e-1679', 1679, 'morová epidemie\nv Českých zemích', 'nahoru'),
      point(CZ, 'e-1680', 1680, 'první\nrobotní\npatent', 'dolu'),
      point(CZ, 'e-1697', 1697, 'Turci vytlačeni\nz Uher na Balkán', 'dolu'),
      point(CZ, 'e-1713', 1713, 'Pragmatická sankce', 'dolu'),
      point(CZ, 'e-1729', 1729, 'kanonizace\nSv. Jana Nepomuckého', 'dolu'),
      point(CZ, 'e-1745', 1745, 'František\nLotrinský\ncísařem', 'dolu'),
      point(CZ, 'e-1757', 1757, 'první sčítání\nlidu,\ntereziánský\nkatastr', 'dolu'),
      point(CZ, 'e-1765', 1765, 'Josef II.\ncísařem', 'dolu'),
      point(CZ, 'e-1772', 1772, 'první dělení\nPolska', 'dolu'),
      point(CZ, 'e-1776', 1776, 'školská\nreforma', 'nahoru'),
      point(CZ, 'e-1780', 1780, 'třetí dělení\nPolska', 'dolu'),
      point(CZ, 'e-1811', 1811, 'Všeobecný\nobčanský\nzákoník', 'dolu'),
      point(CZ, 'e-1815', 1815, 'Vídeňský\nkongres', 'nahoru'),
      point(CZ, 'e-1836', 1836, 'vysoké pece\nve Vítkovicích', 'dolu'),
      point(CZ, 'e-1847', 1847, 'severní\nFerdinandova\ndráha', 'dolu'),
      point(CZ, 'e-1848', 1848, 'zrušení\npoddanství', 'nahoru'),
      point(CZ, 'e-1851', 1851, 'Silvestrovské\npatenty', 'dolu'),
      point(CZ, 'e-1861', 1861, 'Únorová\nústava', 'dolu'),
      point(CZ, 'e-1867', 1867, 'Prosincová\nústava', 'dolu'),
      point(CZ, 'e-1871', 1871, 'Fund. články', 'nahoru'),
      point(CZ, 'e-1878', 1878, 'severní\nFerdinandova\ndráha', 'dolu'),
      point(CZ, 'e-1890', 1890, 'punktace', 'dolu'),
      point(CZ, 'e-1899', 1899, 'Agrární\nstrana', 'dolu'),
      point(CZ, 'e-1907', 1907, 'první\nvšeobecné\nvolby', 'dolu'),
      point(CZ, 'e-1918', 1918, 'vznik\nČeskoslovenska', 'dolu'),

      period(DE, 'p-reformace', 1517, 1555, 'Německá reformace', '#28a745'),
      point(DE, 'e-1517', 1517, '95 tezí Martina Luthera', 'dolu'),

      period(FR, 'p-hugenoti', 1562, 1598, 'Hugenotské války', '#dc3545', { side: 'dolu' }),
      point(FR, 'e-1572', 1572, 'Bartolomějská noc', 'nahoru'),

      point(SCI, 'e-1543', 1543, 'Koperník: O obězích nebeských sfér', 'nahoru'),
    ],
  }
}
