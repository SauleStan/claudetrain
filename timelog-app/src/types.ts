export interface Project {
  id: string
  name: string
}

export interface LogEntry {
  id: string
  date: string       // YYYY-MM-DD
  projectId: string
  hours: number
}

export interface DayInfo {
  date: string
  num: number
  letter: string     // W, T, F, S, S, M, T…
  isToday: boolean
  isWeekend: boolean
}

export type View = 'month' | 'week'
