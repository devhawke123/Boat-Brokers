import type { ApiAvailabilitySlot } from '../../lib/api'
import type { ApiAdminBooking } from './api'
import { bookingStatusLabel } from './statusLabels'

// Calendar helpers ported from boat-brokers/src/lib/availability.js (+ calendar
// lane allocation). Dates are 'YYYY-MM-DD' keys and times are 'HH:mm', both
// interpreted in UK time. Live slots support editable duration, optional boat
// scope, and multi-day daily windows via repeatsUntil.

export type DateRangeSlot = {
  date: string
  endDate?: string
  start?: string
  end?: string
  id?: string | number
  boatIds?: number[] | null
}

export type CalendarSlot = {
  id: number
  // When a multi-day create is merged for display, every member day id lives here.
  ids?: number[]
  date: string
  endDate?: string
  start: string
  end: string
  available: boolean
  boatIds: number[] | null
}

export type CalendarBooking = {
  id: string
  date: string
  start: string
  end: string
  status: 'Pending' | 'Approved' | 'Rejected'
  buyer: string
  email: string
  phone: string | null
  boatId: number
  boatName: string
  boatImage: string | null
  notes: string | null
}

// Half-hour starts from 00:00 through 23:30 (end may be 24:00).
export const slotStarts = Array.from(
  { length: 48 },
  (_, index) => String(Math.floor(index / 2)).padStart(2, '0') + (index % 2 ? ':30' : ':00'),
)

export const slotEndOptions = [...slotStarts, '24:00']

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

// Wall-clock Europe/London date+time → ISO instant for createAvailabilitySlot.
export function ukDateTimeToIso(date: string, time: string): string {
  const utcGuess = Date.parse(`${date}T${time}:00.000Z`)
  const shown = ukParts(new Date(utcGuess).toISOString())
  const shownMs = Date.parse(`${shown.date}T${shown.time}:00.000Z`)
  const wantMs = Date.parse(`${date}T${time}:00.000Z`)
  return new Date(utcGuess + (wantMs - shownMs)).toISOString()
}

export function monthDays(year: number, month: number): Date[] {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  const count = Math.ceil((offset + new Date(year, month + 1, 0).getDate()) / 7) * 7
  return Array.from({ length: count }, (_, index) => new Date(year, month, index - offset + 1))
}

export const slotLastDate = (slot: DateRangeSlot) => slot.endDate || slot.date
export const slotOccursOn = (slot: DateRangeSlot, date: string) => slot.date <= date && slotLastDate(slot) >= date

const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && dateKey(new Date(value + 'T12:00:00')) === value

export function slotDayCount(slot: DateRangeSlot) {
  if (!validDate(slot.date) || !validDate(slotLastDate(slot))) return 0
  return Math.max(0, Math.round((Date.parse(slotLastDate(slot) + 'T00:00:00Z') - Date.parse(slot.date + 'T00:00:00Z')) / 86400000) + 1)
}

function toMinutes(time: string) {
  if (time === '24:00') return 24 * 60
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function durationHoursFromRange(start: string, end: string) {
  return (toMinutes(end) - toMinutes(start)) / 60
}

export function defaultEndAfter(start: string) {
  const index = slotStarts.indexOf(start)
  if (index < 0) return ''
  return slotEndOptions[Math.min(index + 4, slotEndOptions.length - 1)]
}

export function availabilityFieldErrors(
  { date, endDate, start, end }: { date: string; endDate: string; start: string; end: string },
  today = ukToday(),
  now = new Date(),
) {
  const errors: Record<string, string> = {}
  if (!validDate(date)) errors.date = 'Choose a start date.'
  else if (date < today) errors.date = 'Choose today or a future date.'
  if (!validDate(endDate)) errors.endDate = 'Choose an end date.'
  else if (validDate(date) && endDate < date) errors.endDate = 'End date must be on or after the start date.'
  if (!slotStarts.includes(start)) errors.start = 'Choose a start time.'
  if (!slotEndOptions.includes(end)) errors.end = 'Choose an end time.'
  else if (slotStarts.includes(start) && end <= start) errors.end = 'End time must be later than the start time.'
  const clock = ukTime(now)
  if (!errors.start && date === today && start <= clock) {
    errors.start = 'This time has passed. Choose a time after ' + clock + ' (UK time), or a future date.'
  }
  return errors
}

export function overlaps(
  a: { date: string; endDate?: string; start: string; end: string },
  b: { date: string; endDate?: string; start: string; end: string },
) {
  return a.date <= slotLastDate(b) && slotLastDate(a) >= b.date && a.start < b.end && a.end > b.start
}

// Allocate inclusive week slices to stable, non-overlapping horizontal lanes.
export function availabilityWeekRanges(slots: CalendarSlot[], dates: string[], today: string) {
  const first = dates[0]
  const last = dates.at(-1)!
  const occupied: number[] = []
  const segments: {
    slot: CalendarSlot
    lane: number
    from: number
    to: number
    past: boolean
    continuesBefore: boolean
    continuesAfter: boolean
  }[] = []
  slots
    .filter((slot) => slotLastDate(slot) > slot.date && slot.date <= last && slotLastDate(slot) >= first)
    .sort((a, b) => a.date.localeCompare(b.date) || slotLastDate(b).localeCompare(slotLastDate(a)) || a.start.localeCompare(b.start) || a.id - b.id)
    .forEach((slot) => {
      const start = Math.max(0, dates.findIndex((date) => date >= slot.date))
      const end = dates.findLastIndex((date) => date <= slotLastDate(slot))
      let lane = occupied.findIndex((until) => until < start)
      if (lane < 0) lane = occupied.length
      occupied[lane] = end
      const boundary = dates.findIndex((date) => date >= today)
      const parts = boundary > start && boundary <= end ? [[start, boundary - 1], [boundary, end]] : [[start, end]]
      parts.forEach(([from, to]) =>
        segments.push({
          slot,
          lane,
          from,
          to,
          past: dates[to] < today,
          continuesBefore: slot.date < dates[from],
          continuesAfter: slotLastDate(slot) > dates[to],
        }),
      )
    })
  return { segments, lanes: occupied.length }
}

const viewingStage: Record<ApiAdminBooking['status'], CalendarBooking['status']> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
}

export function toCalendarSlot(slot: ApiAvailabilitySlot): CalendarSlot {
  const start = ukParts(slot.startsAt)
  const end = ukParts(slot.endsAt)
  return {
    id: slot.id,
    date: start.date,
    endDate: slot.repeatsUntil || undefined,
    start: start.time,
    end: end.date > start.date ? '24:00' : end.time,
    available: slot.available,
    boatIds: slot.boatIds ?? null,
  }
}

function boatScopeKey(boatIds: number[] | null) {
  return boatIds == null ? '*' : [...boatIds].sort((a, b) => a - b).join(',')
}

function nextUkDate(date: string) {
  const next = new Date(date + 'T12:00:00')
  next.setDate(next.getDate() + 1)
  return dateKey(next)
}

// Live API creates one row per day for multi-day ranges (so each day stays
// independently bookable). Merge consecutive same-window / same-boat days into
// one calendar range so the month view can draw the prototype spanning bars.
export function mergeAvailabilityRanges(slots: CalendarSlot[]): CalendarSlot[] {
  const buckets = new Map<string, CalendarSlot[]>()
  for (const slot of slots) {
    // Already a multi-day record (legacy repeatsUntil) — keep as-is.
    if (slot.endDate && slot.endDate > slot.date) {
      buckets.set('solo-' + slot.id, [slot])
      continue
    }
    const key = slot.start + '|' + slot.end + '|' + boatScopeKey(slot.boatIds)
    const list = buckets.get(key)
    if (list) list.push(slot)
    else buckets.set(key, [slot])
  }

  const merged: CalendarSlot[] = []
  for (const group of buckets.values()) {
    if (group.length === 1) {
      merged.push(group[0])
      continue
    }
    const ordered = [...group].sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id)
    let run: CalendarSlot[] = [ordered[0]]
    const flush = () => {
      if (run.length === 1) {
        merged.push(run[0])
      } else {
        merged.push({
          ...run[0],
          endDate: run[run.length - 1].date,
          ids: run.map((item) => item.id),
        })
      }
      run = []
    }
    for (let index = 1; index < ordered.length; index++) {
      const slot = ordered[index]
      const previous = run[run.length - 1]
      if (slot.date === nextUkDate(previous.date)) {
        run.push(slot)
      } else {
        flush()
        run = [slot]
      }
    }
    flush()
  }
  return merged.sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start) || a.id - b.id)
}

export function toCalendarBooking(booking: ApiAdminBooking): CalendarBooking {
  const start = ukParts(booking.slot.startsAt)
  const end = ukParts(booking.slot.endsAt)
  return {
    id: String(booking.id),
    date: start.date,
    start: start.time,
    end: end.date > start.date ? '24:00' : end.time,
    status: viewingStage[booking.status],
    buyer: [booking.buyer.firstName, booking.buyer.surname].filter(Boolean).join(' '),
    email: booking.buyer.email,
    phone: booking.buyer.phone,
    boatId: booking.boat.id,
    boatName: booking.boat.name,
    boatImage: booking.boat.imageUrl,
    notes: booking.notes,
  }
}

export function viewingDisplayLabel(status: CalendarBooking['status']) {
  if (status === 'Approved') return bookingStatusLabel.APPROVED
  if (status === 'Pending') return bookingStatusLabel.PENDING
  return bookingStatusLabel.REJECTED
}

export function viewingKind(status: CalendarBooking['status']) {
  return status === 'Approved' ? 'booked' : status.toLowerCase()
}

export function viewingBadge(status: CalendarBooking['status']) {
  return status === 'Approved' ? 'is-approved' : status === 'Rejected' ? 'is-not-published' : 'is-in-review'
}
