import { prisma } from "../lib/prisma";
import { toBoatIdsColumn } from "../lib/slotBoats";

// A slot is "active"-booked (unavailable) while it has a PENDING or APPROVED
// booking. A REJECTED booking doesn't block the slot — it frees back up.
const ACTIVE_BOOKING_STATUSES = ["PENDING", "APPROVED"] as const;

const ukDateFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/London",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const ukTimeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function ukDateKey(instant: Date) {
  return ukDateFormat.format(instant);
}

export function ukClock(instant: Date) {
  return ukTimeFormat.format(instant);
}

// Wall-clock Europe/London date+time → UTC Date (same approach as the admin UI).
export function ukDateTimeToUtc(date: string, time: string): Date {
  const utcGuess = Date.parse(`${date}T${time}:00.000Z`);
  const shownDate = ukDateKey(new Date(utcGuess));
  const shownTime = ukClock(new Date(utcGuess));
  const shownMs = Date.parse(`${shownDate}T${shownTime}:00.000Z`);
  const wantMs = Date.parse(`${date}T${time}:00.000Z`);
  return new Date(utcGuess + (wantMs - shownMs));
}

function addUkDays(date: string, days: number) {
  const next = new Date(`${date}T12:00:00.000Z`);
  next.setUTCDate(next.getUTCDate() + days);
  return ukDateKey(next);
}

function eachUkDate(from: string, to: string): string[] {
  const dates: string[] = [];
  for (let cursor = from; cursor <= to; cursor = addUkDays(cursor, 1)) {
    dates.push(cursor);
  }
  return dates;
}

export type DailyWindow = { startsAt: Date; endsAt: Date };

// Expand a stored slot into concrete daily windows (UK wall-clock preserved).
export function expandSlotWindows(startsAt: Date, endsAt: Date, repeatsUntil: Date | null): DailyWindow[] {
  const startDate = ukDateKey(startsAt);
  const startTime = ukClock(startsAt);
  const durationMs = endsAt.getTime() - startsAt.getTime();
  const lastDate = repeatsUntil ? ukDateKey(repeatsUntil) : startDate;
  return eachUkDate(startDate, lastDate).map((date) => {
    const dayStart = ukDateTimeToUtc(date, startTime);
    return { startsAt: dayStart, endsAt: new Date(dayStart.getTime() + durationMs) };
  });
}

export function findAllSlots() {
  return prisma.availabilitySlot.findMany({
    orderBy: { startsAt: "asc" },
    include: { bookings: { where: { status: { in: [...ACTIVE_BOOKING_STATUSES] } } } },
  });
}

export function findSlotById(id: number) {
  return prisma.availabilitySlot.findUnique({
    where: { id },
    include: { bookings: { where: { status: { in: [...ACTIVE_BOOKING_STATUSES] } } } },
  });
}

export function createSlot(startsAt: Date, endsAt: Date, boatIds: number[] = [], repeatsUntil: Date | null = null) {
  return prisma.availabilitySlot.create({
    data: { startsAt, endsAt, boatIds: toBoatIdsColumn(boatIds), repeatsUntil },
  });
}

function windowsOverlap(a: DailyWindow, b: DailyWindow) {
  return a.startsAt < b.endsAt && a.endsAt > b.startsAt;
}

// Any existing slot whose daily windows collide with the candidate windows.
export async function findOverlappingSlot(windows: DailyWindow[]) {
  if (!windows.length) return null;
  const rangeStart = windows[0].startsAt;
  const rangeEnd = windows[windows.length - 1].endsAt;
  // Pull candidates whose stored range could possibly touch — first day start
  // before our last end, and (repeatsUntil or endsAt) after our first start.
  const candidates = await prisma.availabilitySlot.findMany({
    where: {
      startsAt: { lt: rangeEnd },
      OR: [
        { repeatsUntil: { gt: rangeStart } },
        { repeatsUntil: null, endsAt: { gt: rangeStart } },
      ],
    },
  });
  for (const candidate of candidates) {
    const existing = expandSlotWindows(candidate.startsAt, candidate.endsAt, candidate.repeatsUntil);
    if (existing.some((left) => windows.some((right) => windowsOverlap(left, right)))) {
      return candidate;
    }
  }
  return null;
}

export function deleteSlot(id: number) {
  return prisma.availabilitySlot.delete({ where: { id } });
}
