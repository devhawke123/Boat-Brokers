import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Plus, Trash2 } from 'lucide-react'
import type { Notice } from '../../seller-portal/components/ToastNotice'
import { fetchAvailabilitySlots, fetchBoats } from '../../lib/api'
import {
  createAvailabilitySlot,
  deleteAvailabilitySlot,
  fetchBookings,
  updateBookingStatus,
} from '../lib/api'
import {
  availabilityFieldErrors,
  availabilityWeekRanges,
  dateKey,
  defaultEndAfter,
  durationHoursFromRange,
  mergeAvailabilityRanges,
  monthDays,
  overlaps,
  slotDayCount,
  slotEndOptions,
  slotLastDate,
  slotOccursOn,
  slotStarts,
  toCalendarBooking,
  toCalendarSlot,
  ukDateTimeToIso,
  ukToday,
  viewingBadge,
  viewingDisplayLabel,
  viewingKind,
  type CalendarBooking,
  type CalendarSlot,
} from '../lib/availability'
import {
  availabilityBoatOptions,
  normaliseSlotBoatIds,
  slotBoatLabel,
  type AvailabilityBoatOption,
} from '../lib/availabilityBoats'
import { InventoryNoticeContext } from '../context/InventoryNoticeContext'
import { AccountButton, AccountField } from './AdminAccountSettings'
import AdminSelectField from './AdminSelectField'
import { BoatPicture } from './BoatPicture'
import { AdminActionButton } from './AdminInteraction'
import AdminRecordOverlay from './AdminRecordOverlay'
import AvailabilityBoatPicker, { SlotBoatScope } from './AvailabilityBoatPicker'
import '../styles/admin-leads.css'
import '../styles/admin-availability.css'

const fullDate = (key: string) =>
  new Date(key + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const shortDate = (key: string) =>
  new Date(key + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const range = (item: { start: string; end: string }) => item.start + '–' + item.end
const datesLabel = (slot: CalendarSlot) =>
  slotDayCount(slot) > 1 ? shortDate(slot.date) + ' – ' + shortDate(slotLastDate(slot)) : fullDate(slot.date)
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const initialsOf = (name: string) =>
  name.replace(/^The\s+/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase() || '?'

function PartyIdentity({ name, children }: { name: string; children?: ReactNode }) {
  return (
    <div className="inventory-person">
      <span className="lead-avatar" aria-hidden="true">{initialsOf(name)}</span>
      <div>
        <strong>{name}</strong>
        {children}
      </div>
    </div>
  )
}

function AvailabilityForm({
  date,
  boats,
  slots,
  bookings,
  onClose,
  onAdd,
}: {
  date: string
  boats: AvailabilityBoatOption[]
  slots: CalendarSlot[]
  bookings: CalendarBooking[]
  onClose: () => void
  onAdd: (date: string, endDate: string, start: string, end: string, boatIds: number[] | null) => Promise<void>
}) {
  const [boatIds, setBoatIds] = useState<number[] | null>(null)
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [startDate, setStartDate] = useState(date)
  const [endDate, setEndDate] = useState(date)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const days = slotDayCount({ date: startDate, endDate })

  function clear(...fields: string[]) {
    setErrors((current) => Object.fromEntries(Object.entries(current).filter(([key]) => !fields.includes(key))))
  }
  function showErrors(next: Record<string, string>) {
    setErrors(next)
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [role="alert"]')?.focus())
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    if (busy) return
    const next = availabilityFieldErrors({ date: startDate, endDate, start, end })
    if (boatIds?.length === 0) next.boats = 'Choose at least one boat, or select All boats.'
    else if (boatIds?.some((id) => !boats.some((boat) => boat.id === id))) next.boats = 'A selected boat is no longer available. Update your selection.'
    if (Object.keys(next).length) {
      showErrors(next)
      return
    }
    const candidate = { date: startDate, endDate, start, end }
    const occupied = [
      ...slots.map((item) => ({ date: item.date, endDate: item.endDate, start: item.start, end: item.end, kind: 'slot' as const })),
      ...bookings
        .filter((item) => item.status !== 'Rejected')
        .map((item) => ({ date: item.date, start: item.start, end: item.end, kind: 'booking' as const })),
    ]
    const conflict = occupied.find((item) => overlaps(candidate, item))
    if (conflict) {
      const day = conflict.date > startDate ? conflict.date : startDate
      const label = shortDate(day)
      const message =
        label +
        ' already has ' +
        (conflict.kind === 'booking' ? 'a viewing' : 'availability') +
        ' at ' +
        conflict.start +
        '–' +
        conflict.end +
        '. Choose a different time or adjust your dates.'
      showErrors({ start: message })
      return
    }
    setBusy(true)
    try {
      await onAdd(startDate, endDate, start, end, normaliseSlotBoatIds(boatIds))
    } catch (problem) {
      showErrors({ form: problem instanceof Error ? problem.message : 'Availability not added.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <AdminRecordOverlay
      modal
      noClose
      title="Add availability"
      onClose={onClose}
      footer={
        <>
          <AccountButton onClick={onClose} disabled={busy}>Cancel</AccountButton>
          <AccountButton kind="primary" type="submit" form="availability-form" disabled={busy}>
            <Plus size={16} />{busy ? 'Adding…' : 'Add availability'}
          </AccountButton>
        </>
      }
    >
      <form ref={formRef} id="availability-form" className="availability-time-form" onSubmit={save} noValidate>
        <AvailabilityBoatPicker
          error={errors.boats}
          boats={boats}
          value={boatIds}
          onChange={(value) => {
            setBoatIds(value)
            clear('boats', 'form')
          }}
        />
        <div className="availability-time-pair">
          <AdminSelectField
            label="Start time"
            error={errors.start}
            name="start"
            variant="v2"
            collection
            required
            placeholder="From"
            value={start}
            options={slotStarts}
            onChange={(event) => {
              const value = event.target.value
              setStart(value)
              if (!end || end <= value) setEnd(defaultEndAfter(value))
              clear('start', 'end', 'form')
            }}
          />
          <AdminSelectField
            label="End time"
            error={errors.end}
            name="end"
            variant="v2"
            collection
            required
            placeholder="Until"
            value={end}
            options={slotEndOptions.filter((time) => !start || time > start)}
            onChange={(event) => {
              setEnd(event.target.value)
              clear('end', 'form')
            }}
          />
        </div>
        <div className="availability-time-pair">
          <AccountField
            label="Start date"
            error={errors.date}
            type="date"
            required
            min={ukToday()}
            value={startDate}
            onChange={(event) => {
              const value = event.target.value
              setStartDate(value)
              if (value > endDate) setEndDate(value)
              clear('date', 'endDate', 'start', 'form')
            }}
          />
          <AccountField
            label="End date"
            error={errors.endDate}
            type="date"
            required
            min={startDate || ukToday()}
            value={endDate}
            onChange={(event) => {
              setEndDate(event.target.value)
              clear('endDate', 'form')
            }}
          />
        </div>
        {days > 0 && (
          <div className="availability-range-summary">
            <CalendarDays size={18} aria-hidden="true" />
            <span>
              <strong>{days === 1 ? '1 day' : days + ' days'}</strong>
              {start && end
                ? ' · ' + range({ start, end }) + (days > 1 ? ' each day' : '')
                : days > 1
                  ? ' · Same time window each day'
                  : ' · Single-day availability'}
            </span>
          </div>
        )}
        {errors.form && (
          <p tabIndex={-1} className="v2-settings-error availability-form-error" role="alert">
            {errors.form}
          </p>
        )}
      </form>
    </AdminRecordOverlay>
  )
}

function AvailabilityDetails({
  slot,
  boats,
  onClose,
  onRemove,
}: {
  slot: CalendarSlot
  boats: AvailabilityBoatOption[]
  onClose: () => void
  onRemove: (ids: number[]) => Promise<void>
}) {
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const cancel = useRef<HTMLButtonElement>(null)
  const remove = useRef<HTMLButtonElement>(null)
  const days = slotDayCount(slot)
  const memberIds = slot.ids?.length ? slot.ids : [slot.id]

  async function removeSlot() {
    if (busy) return
    setBusy(true)
    try {
      await onRemove(memberIds)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AdminRecordOverlay
      modal
      title="Availability details"
      headerExtra={<p className="availability-modal-date">{datesLabel(slot)}</p>}
      onClose={onClose}
      footer={
        confirming ? (
          <>
            <AccountButton
              ref={cancel}
              disabled={busy}
              onClick={() => {
                setConfirming(false)
                requestAnimationFrame(() => remove.current?.focus())
              }}
            >
              Keep availability
            </AccountButton>
            <AccountButton kind="primary" disabled={busy} onClick={removeSlot}>
              {busy ? 'Removing…' : 'Remove availability'}
            </AccountButton>
          </>
        ) : (
          <>
            <AccountButton
              ref={remove}
              onClick={() => {
                setConfirming(true)
                requestAnimationFrame(() => cancel.current?.focus())
              }}
            >
              <Trash2 size={16} />Remove availability
            </AccountButton>
            <AccountButton onClick={onClose}>Done</AccountButton>
          </>
        )
      }
    >
      <div className="availability-day-content">
        <section className="availability-day-section availability-detail-card">
          <h3>Boats</h3>
          <SlotBoatScope slot={slot} boats={boats} />
        </section>
        <section className="availability-day-section availability-detail-card">
          <h3>{days > 1 ? 'Daily availability' : 'Time'}</h3>
          <p className="availability-detail-time">
            <Clock3 size={18} />
            {range(slot)}
          </p>
          <p className="availability-detail-dates">
            {days > 1 ? days + ' days · Same time window each day' : fullDate(slot.date)}
          </p>
        </section>
      </div>
    </AdminRecordOverlay>
  )
}

function ViewingDetails({
  booking,
  onClose,
  onDecision,
}: {
  booking: CalendarBooking
  onClose: () => void
  onDecision: (id: string, status: 'APPROVED' | 'REJECTED') => Promise<void>
}) {
  const done = useRef<HTMLButtonElement>(null)
  const previousStatus = useRef(booking.status)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    if (previousStatus.current !== booking.status) done.current?.focus({ preventScroll: true })
    previousStatus.current = booking.status
  }, [booking.status])

  async function decide(status: 'APPROVED' | 'REJECTED') {
    if (busy) return
    setBusy(true)
    try {
      await onDecision(booking.id, status)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AdminRecordOverlay
      modal
      title="Viewing details"
      titleExtra={
        <span className={'inventory-badge availability-header-status ' + viewingBadge(booking.status)}>
          {viewingDisplayLabel(booking.status)}
        </span>
      }
      headerExtra={
        <p className="availability-modal-date">
          {fullDate(booking.date)} · {range(booking)}
        </p>
      }
      onClose={onClose}
      footer={
        booking.status === 'Pending' && booking.date >= ukToday() ? (
          <>
            <AccountButton disabled={busy} onClick={() => decide('REJECTED')}>
              {busy ? 'Updating…' : 'Reject request'}
            </AccountButton>
            <AccountButton kind="primary" disabled={busy} onClick={() => decide('APPROVED')}>
              {busy ? 'Updating…' : 'Approve request'}
            </AccountButton>
          </>
        ) : (
          <AccountButton ref={done} onClick={onClose}>Done</AccountButton>
        )
      }
    >
      <div className="availability-day-content">
        <section className="availability-day-section availability-detail-card availability-person-card">
          <h3>Interested individual</h3>
          <PartyIdentity name={booking.buyer}>
            {booking.email && <span>{booking.email}</span>}
            {booking.phone && <span>{booking.phone}</span>}
          </PartyIdentity>
        </section>
        <section className="availability-day-section availability-detail-card">
          <h3>Boat of interest</h3>
          <div className="availability-boat-summary">
            <BoatPicture image={booking.boatImage} alt="" />
            <div>
              <strong>{booking.boatName}</strong>
            </div>
          </div>
        </section>
      </div>
    </AdminRecordOverlay>
  )
}

export default function AdminAvailability({
  notice,
  onNotice,
  onDismissNotice,
}: {
  notice: Notice | null
  onNotice: (notice: Notice) => void
  onDismissNotice: () => void
}) {
  const [today] = useState(ukToday)
  const [params] = useSearchParams()
  const requestedDate = params.get('date')
  const initialDate =
    requestedDate && /^\d{4}-\d{2}-\d{2}$/.test(requestedDate) && dateKey(new Date(requestedDate + 'T12:00:00')) === requestedDate
      ? requestedDate
      : today
  const [month, setMonth] = useState(() => new Date(initialDate + 'T12:00:00'))
  const [selected, setSelected] = useState<string | null>(null)
  const [openSlot, setOpenSlot] = useState<number | null>(null)
  const [viewing, setViewing] = useState<CalendarBooking | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [slots, setSlots] = useState<CalendarSlot[]>([])
  const [bookings, setBookings] = useState<CalendarBooking[]>([])
  const [boats, setBoats] = useState<AvailabilityBoatOption[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const reduced = useReducedMotion()
  const viewingParam = params.get('viewing')
  const openedViewing = useRef(false)

  const load = useCallback(() => {
    setLoading(true)
    setLoadError(null)
    return Promise.all([fetchAvailabilitySlots(), fetchBookings(), fetchBoats()])
      .then(([slotData, bookingData, boatData]) => {
        setSlots(slotData.map(toCalendarSlot))
        setBookings(bookingData.map(toCalendarBooking))
        setBoats(availabilityBoatOptions(boatData))
      })
      .catch((err: unknown) => {
        setSlots([])
        setBookings([])
        setBoats([])
        setLoadError(err instanceof Error ? err.message : 'Failed to load availability')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (openedViewing.current || loading || !viewingParam) return
    const match = bookings.find((item) => item.id === viewingParam && item.date >= today)
    if (match) {
      setViewing(match)
      openedViewing.current = true
    }
  }, [bookings, loading, viewingParam, today])

  // Raw open days (for conflict checks) vs merged ranges (for spanning bars).
  const openDays = useMemo(() => slots.filter((slot) => slot.available), [slots])
  const openSlots = useMemo(() => mergeAvailabilityRanges(openDays), [openDays])
  const days = monthDays(month.getFullYear(), month.getMonth())
  const monthLabel = month.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  async function decide(id: string, status: 'APPROVED' | 'REJECTED') {
    try {
      const updated = await updateBookingStatus(Number(id), status)
      const next = toCalendarBooking(updated)
      setBookings((current) => current.map((item) => (item.id === id ? next : item)))
      setViewing(next)
      onNotice({ type: 'success', title: status === 'APPROVED' ? 'Viewing approved' : 'Viewing rejected' })
      const slotData = await fetchAvailabilitySlots()
      setSlots(slotData.map(toCalendarSlot))
    } catch (problem) {
      onNotice({ type: 'error', title: 'Request not updated', description: problem instanceof Error ? problem.message : 'Please try again.' })
      throw problem
    }
  }

  function move(amount: number) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1))
  }

  async function add(date: string, endDate: string, start: string, end: string, boatIds: number[] | null) {
    const startsAt = ukDateTimeToIso(date, start)
    const durationHours = durationHoursFromRange(start, end)
    await createAvailabilitySlot(startsAt, durationHours, {
      endDate: endDate > date ? endDate : undefined,
      boatIds,
    })
    const slotData = await fetchAvailabilitySlots()
    const nextSlots = slotData.map(toCalendarSlot)
    setSlots(nextSlots)
    const daysAdded = slotDayCount({ date, endDate })
    const scopeLabel = slotBoatLabel({ boatIds }, boats)
    setSelected(null)
    setMonth(new Date(date + 'T12:00:00'))
    setExpanded((current) => ({ ...current, [date]: true }))
    onNotice({
      type: 'success',
      title: 'Availability added',
      description:
        (daysAdded > 1 ? shortDate(date) + ' – ' + shortDate(endDate) : fullDate(date)) +
        ' · ' +
        range({ start, end }) +
        (daysAdded > 1 ? ' each day' : '') +
        ' · ' +
        scopeLabel,
    })
  }

  async function remove(ids: number[]) {
    try {
      await Promise.all(ids.map((id) => deleteAvailabilitySlot(id)))
      const removed = new Set(ids)
      setSlots((current) => current.filter((slot) => !removed.has(slot.id)))
      setOpenSlot(null)
      onNotice({ type: 'success', title: 'Availability removed' })
    } catch (problem) {
      onNotice({ type: 'error', title: 'Availability not removed', description: problem instanceof Error ? problem.message : 'Please try again.' })
      throw problem
    }
  }

  return (
    <InventoryNoticeContext.Provider value={{ notice, onClose: onDismissNotice }}>
      <div className="leads-heading">
        <h1>Availability</h1>
        {loadError && !loading && <AccountButton onClick={() => load()}>Try again</AccountButton>}
      </div>
      {loading && !slots.length && !bookings.length ? (
        <section className="availability-calendar v2-glass-surface" aria-busy="true" aria-label="Loading availability">
          <div className="leads-empty" style={{ padding: '48px 24px' }}>
            <CalendarDays size={25} />
            <h2>Loading availability…</h2>
          </div>
        </section>
      ) : loadError && !slots.length && !bookings.length ? (
        <section className="availability-calendar v2-glass-surface" aria-label="Availability error">
          <div className="leads-empty" style={{ padding: '48px 24px' }}>
            <CalendarDays size={25} />
            <h2>Couldn’t load availability</h2>
            <p>{loadError}</p>
            <AccountButton onClick={() => load()}>Try again</AccountButton>
          </div>
        </section>
      ) : (
        <section className="availability-calendar v2-glass-surface" aria-labelledby="availability-month">
          <header className="availability-toolbar">
            <h2 id="availability-month" aria-live="polite">{monthLabel}</h2>
            <div className="availability-navigation">
              <div className="availability-month-arrows">
                <AccountButton aria-label="Previous month" onClick={() => move(-1)}>
                  <ChevronLeft size={18} />
                </AccountButton>
                <AccountButton aria-label="Next month" onClick={() => move(1)}>
                  <ChevronRight size={18} />
                </AccountButton>
              </div>
              <AccountButton onClick={() => setMonth(new Date(today + 'T12:00:00'))}>Today</AccountButton>
            </div>
          </header>
          <div className="availability-calendar-scroll" role="region" aria-label="Month calendar" tabIndex={0}>
            <div className="availability-month-table" role="table" aria-label={monthLabel}>
              <div className="availability-weekdays" role="row">
                {weekdays.map((day) => (
                  <div key={day} role="columnheader">
                    <abbr title={day}>{day.slice(0, 3)}</abbr>
                  </div>
                ))}
              </div>
              {Array.from({ length: days.length / 7 }, (_, week) => {
                const weekDays = days.slice(week * 7, week * 7 + 7)
                const { segments, lanes } = availabilityWeekRanges(
                  openSlots,
                  weekDays.map(dateKey),
                  today,
                )
                return (
                  <div className="availability-week" role="row" key={dateKey(weekDays[0])} style={{ '--range-space': lanes * 54 + 'px' } as CSSProperties}>
                    {weekDays.map((day) => {
                      const key = dateKey(day)
                      const past = key < today
                      const showAll = past || expanded[key]
                      const ranges = openSlots.filter((slot) => slotOccursOn(slot, key) && slotDayCount(slot) > 1)
                      const entries = [
                        ...openSlots
                          .filter((slot) => slotOccursOn(slot, key) && slotDayCount(slot) === 1)
                          .map((slot) => ({ ...slot, kind: 'open' as const })),
                        ...bookings
                          .filter((booking) => booking.date === key)
                          .map((booking) => ({ ...booking, kind: viewingKind(booking.status) as 'booked' | 'pending' | 'rejected' })),
                      ].sort((a, b) => a.start.localeCompare(b.start))
                      return (
                        <div
                          role="cell"
                          key={key}
                          className={
                            (day.getMonth() !== month.getMonth() ? 'is-outside ' : '') +
                            (key === today ? 'is-today ' : '') +
                            (key === requestedDate ? 'is-focused ' : '') +
                            (past ? 'is-past' : '')
                          }
                        >
                          <div className="availability-day">
                            <motion.button
                              type="button"
                              aria-disabled={past || undefined}
                              className="availability-day-target"
                              aria-label={
                                fullDate(key) +
                                ', ' +
                                (entries.length + ranges.length) +
                                ' slots and bookings. ' +
                                (past ? 'Past date. Availability cannot be changed.' : 'Manage availability')
                              }
                              aria-haspopup={past ? undefined : 'dialog'}
                              aria-current={key === today ? 'date' : undefined}
                              onClick={() =>
                                past
                                  ? onNotice({ type: 'info', title: 'Past date', description: 'Availability and viewings on past dates are read-only.' })
                                  : setSelected(key)
                              }
                              whileHover={past ? undefined : { backgroundColor: '#edf6fc99' }}
                              transition={{ duration: reduced ? 0 : 0.18 }}
                            >
                              <span className="sr-only">{fullDate(key)}</span>
                            </motion.button>
                            <span className="availability-date-number">{day.getDate()}</span>
                            <div className="availability-day-entries">
                              {entries.slice(0, showAll ? entries.length : 3).map((entry) =>
                                entry.kind === 'open' ? (
                                  <AdminActionButton
                                    key={'slot-' + entry.id}
                                    disabled={past}
                                    title={datesLabel(entry) + ' · ' + slotBoatLabel(entry, boats)}
                                    className={'availability-entry is-open' + (slotDayCount(entry) > 1 ? ' is-date-range' : '')}
                                    aria-label={
                                      'Available ' +
                                      range(entry) +
                                      ' on ' +
                                      fullDate(key) +
                                      ', ' +
                                      slotBoatLabel(entry, boats) +
                                      (slotDayCount(entry) > 1 ? ', daily ' + datesLabel(entry) : '')
                                    }
                                    onClick={() => setOpenSlot(entry.id)}
                                  >
                                    <span>
                                      {entry.start}
                                      <span className="availability-entry-end">–{entry.end}</span>
                                    </span>
                                    <span>
                                      {slotDayCount(entry) > 1 ? (
                                        <>
                                          <CalendarDays size={14} aria-hidden="true" />
                                          {slotDayCount(entry)} days
                                        </>
                                      ) : (
                                        'Available'
                                      )}
                                    </span>
                                    <SlotBoatScope slot={entry} boats={boats} compact />
                                  </AdminActionButton>
                                ) : (
                                  <AdminActionButton
                                    key={'booking-' + entry.id}
                                    disabled={past}
                                    className={'availability-entry is-' + entry.kind}
                                    aria-label={
                                      viewingDisplayLabel(entry.status) +
                                      ' viewing with ' +
                                      entry.buyer +
                                      ', ' +
                                      entry.boatName +
                                      ', ' +
                                      fullDate(key) +
                                      ' ' +
                                      range(entry)
                                    }
                                    onClick={() => setViewing(entry)}
                                  >
                                    <span>
                                      {entry.start}
                                      <span className="availability-entry-end">–{entry.end}</span>
                                    </span>
                                    <span>{entry.buyer}</span>
                                  </AdminActionButton>
                                ),
                              )}
                              {!past && entries.length > 3 && (
                                <AdminActionButton
                                  className="availability-more"
                                  aria-expanded={Boolean(expanded[key])}
                                  onClick={() => setExpanded((current) => ({ ...current, [key]: !current[key] }))}
                                >
                                  {expanded[key] ? 'Show less' : '+' + (entries.length - 3) + ' more'}
                                </AdminActionButton>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div className="availability-week-ranges" role="presentation">
                      {segments.map((segment) => {
                        const { slot, lane, from, to, past, continuesBefore, continuesAfter } = segment
                        const label = slotBoatLabel(slot, boats) + ' · ' + range(slot) + ' each day · ' + datesLabel(slot)
                        return (
                          <AdminActionButton
                            key={slot.id + '-' + from}
                            className={
                              'availability-range-bar' +
                              (continuesBefore ? ' continues-before' : '') +
                              (continuesAfter ? ' continues-after' : '') +
                              (past ? ' is-past' : '')
                            }
                            whileHover={past ? undefined : { opacity: 0.78 }}
                            whileFocus={past ? undefined : { opacity: 0.78 }}
                            whileTap={past || reduced ? undefined : { scale: 0.99 }}
                            style={{ gridColumn: from + 1 + ' / ' + (to + 2), gridRow: lane + 1 }}
                            title={label}
                            aria-label={'Available ' + label + (past ? '. Past dates are read-only.' : '')}
                            aria-disabled={past || undefined}
                            onClick={() =>
                              past
                                ? onNotice({ type: 'info', title: 'Past date', description: 'Availability and viewings on past dates are read-only.' })
                                : setOpenSlot(slot.id)
                            }
                          >
                            {continuesBefore && <ChevronLeft size={14} aria-hidden="true" />}
                            <span className="availability-range-bar-copy">
                              <SlotBoatScope slot={slot} boats={boats} compact />
                              <span>{range(slot)} daily</span>
                            </span>
                            {continuesAfter && <ChevronRight size={14} aria-hidden="true" />}
                          </AdminActionButton>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <footer className="availability-calendar-footer">
            <div className="availability-legend">
              <span><i className="is-open" />Available</span>
              <span><i className="is-booked" />Booked</span>
              <span><i className="is-pending" />Pending</span>
              <span><i className="is-rejected" />Rejected</span>
            </div>
          </footer>
        </section>
      )}
      <AnimatePresence>
        {selected && (
          <AvailabilityForm
            key={selected}
            date={selected}
            boats={boats}
            slots={openDays}
            bookings={bookings}
            onAdd={add}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {openSlot != null && openSlots.some((slot) => slot.id === openSlot || slot.ids?.includes(openSlot)) && (
          <AvailabilityDetails
            key={openSlot}
            slot={openSlots.find((slot) => slot.id === openSlot || slot.ids?.includes(openSlot))!}
            boats={boats}
            onRemove={remove}
            onClose={() => setOpenSlot(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {viewing && (
          <ViewingDetails
            key={viewing.id}
            booking={bookings.find((item) => item.id === viewing.id) || viewing}
            onDecision={decide}
            onClose={() => setViewing(null)}
          />
        )}
      </AnimatePresence>
    </InventoryNoticeContext.Provider>
  )
}
