import type { ApiAvailabilitySlot } from '../../lib/api'
import type { ApiAdminBooking } from './api'
import { bookingStatusLabel } from './statusLabels'

// Calendar helpers ported from boat-brokers/src/lib/availability.js (+ calendar
// lane allocation). Dates are 'YYYY-MM-DD' keys and times are 'HH:mm', both
// interpreted in UK time. Live slots are single-day 2-hour windows (no boat
// scope / multi-day ranges on the API).

export type DateRangeSlot = { date: string; endDate?: string; start?: string; end?: string; id?: string | number }

export type CalendarSlot = {
  id: number
  date: string
  endDate?: string
  start: string
  end: string
  available: boolean
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

export const SLOT_DURATION_HOURS = 2

// Even-hour starts matching the live CreateSlotForm (clean 2-hour boundaries).
export const slotStarts = Array.from({ length: 12 }, (_, index) => String(index * 2).padStart(2, '0') + ':00')

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

export function slotEndTwoHours(start: string) {
  const hour = Number(start.slice(0, 2)) + SLOT_DURATION_HOURS
  return hour >= 24 ? '24:00' : String(hour).padStart(2, '0') + start.slice(2)
}

export function availabilityFieldErrors(
  { date, start }: { date: string; start: string },
  today = ukToday(),
  now = new Date(),
) {
  const errors: Record<string, string> = {}
  if (!validDate(date)) errors.date = 'Choose a start date.'
  else if (date < today) errors.date = 'Choose today or a future date.'
  if (!slotStarts.includes(start)) errors.start = 'Choose a start time.'
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
    start: start.time,
    end: end.date > start.date ? '24:00' : end.time,
    available: slot.available,
  }
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
