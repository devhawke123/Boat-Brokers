// Calendar helpers ported from boat-brokers/src/lib/availability.js. Only the
// pieces the Overview month preview needs; dates are 'YYYY-MM-DD' keys and
// times are 'HH:mm', both interpreted in UK time.

export type DateRangeSlot = { date: string; endDate?: string }

export const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

const ukDateFormat = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' })
const ukTimeFormat = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })

export const ukToday = (now = new Date()) => ukDateFormat.format(now)
export const ukTime = (now = new Date()) => ukTimeFormat.format(now)

// UK-time date key and clock time for an ISO timestamp from the API.
export function ukParts(iso: string): { date: string; time: string } {
  const instant = new Date(iso)
  return { date: ukToday(instant), time: ukTime(instant) }
}

export function monthDays(year: number, month: number): Date[] {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  const count = Math.ceil((offset + new Date(year, month + 1, 0).getDate()) / 7) * 7
  return Array.from({ length: count }, (_, index) => new Date(year, month, index - offset + 1))
}

export const slotLastDate = (slot: DateRangeSlot) => slot.endDate || slot.date
export const slotOccursOn = (slot: DateRangeSlot, date: string) => slot.date <= date && slotLastDate(slot) >= date
