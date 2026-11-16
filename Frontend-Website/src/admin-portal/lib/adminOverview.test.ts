/// <reference types="node" />
import test from 'node:test'
import assert from 'node:assert/strict'
import { overviewBreakdowns, overviewSnapshot, saleStageLabel, toOverviewBoat, toOverviewBooking, toOverviewSlots } from './adminOverview.ts'
import type { OverviewBoat, OverviewBooking, OverviewPost, OverviewRecords } from './adminOverview.ts'
import type { ApiBoatListing } from '../../seller-portal/lib/api.ts'
import type { ApiAdminBooking } from './api.ts'

// Run with: node --test src/admin-portal/lib/adminOverview.test.ts

const empty: OverviewRecords = { boats: [], leads: [], buyers: [], sellers: [], sales: [], blogPosts: [], bookings: [], availabilitySlots: [] }
const boat = (id: string, approval: OverviewBoat['approval'], archived = false): OverviewBoat => ({ id, name: id, type: 'Boat', price: null, image: null, approval, archived, published: approval === 'Approved' && !archived })
const viewing = (id: string, date: string, status: OverviewBooking['status'], start = '10:00', end = '11:00'): OverviewBooking => ({ id, date, start, end, status })
const post = (id: number, date: string): OverviewPost => ({ id, title: String(id), author: 'A', date, readTime: '3 min', image: null })

test('overview handles empty collections without invented sales or bookings', () => {
  const result = overviewSnapshot(empty, '2026-11-13')
  assert.equal(result.sales.length, 0)
  assert.equal(result.upcoming.length, 0)
  assert.equal(result.review.length, 0)
})

test('overview keeps ongoing multi-day availability until its final daily window has ended', () => {
  const availabilitySlots = [{ date: '2026-11-10', endDate: '2026-11-20', start: '09:00', end: '17:00' }]
  assert.equal(overviewSnapshot({ ...empty, availabilitySlots }, '2026-11-13', '18:00').openSlots.length, 1)
  assert.equal(overviewSnapshot({ ...empty, availabilitySlots }, '2026-11-20', '18:00').openSlots.length, 0)
})

test('overview hides archived boats and groups review work from live approval labels', () => {
  const boats = [boat('a', 'Awaiting review'), boat('b', 'Changes required'), boat('c', 'Approved'), boat('d', 'Approved', true)]
  const result = overviewSnapshot({ ...empty, boats, leads: [{ status: 'New', source: '' }, { status: 'Lost', source: '' }] }, '2026-11-13')
  assert.equal(result.boats.length, 3)
  assert.equal(result.review.length, 1)
  assert.equal(result.changes.length, 1)
  assert.equal(result.published.length, 1)
  assert.equal(result.newLeads.length, 1)
})

test('overview separates pending and booked requests, excludes elapsed slots, and sorts posts without mutation', () => {
  const blogPosts = [post(1, '2026-11-01'), post(2, '2026-11-12')]
  const bookings = [viewing('past', '2026-11-12', 'Approved'), viewing('elapsed', '2026-11-13', 'Approved', '08:00', '09:00'), viewing('booked', '2026-11-14', 'Approved'), viewing('pending', '2026-11-15', 'Pending'), viewing('rejected', '2026-11-16', 'Rejected')]
  const availabilitySlots = [{ date: '2026-11-13', start: '08:00', end: '09:00' }, { date: '2026-11-14', start: '09:00', end: '12:00' }]
  const result = overviewSnapshot({ ...empty, bookings, blogPosts, availabilitySlots }, '2026-11-13', '10:00')
  assert.deepEqual(result.upcoming.map(item => item.id), ['booked'])
  assert.deepEqual(result.pending.map(item => item.id), ['pending'])
  assert.equal(result.openSlots.length, 1)
  assert.equal(result.latestPosts[0].id, 2)
  assert.equal(blogPosts[0].id, 1)
})

test('chart groups account for every boat and lead, retain zeros, and handle empty data', () => {
  const boats = [boat('0', 'Awaiting review'), boat('1', 'Approved'), boat('2', 'Changes required')]
  const leads = [{ source: 'Website' }, { source: 'Website' }, { source: 'Referral' }, { source: '' }]
  const grouped = overviewBreakdowns(boats, leads)
  assert.equal(grouped.approvals.reduce((sum, item) => sum + item.count, 0), boats.length)
  assert.equal(grouped.sources.reduce((sum, item) => sum + item.count, 0), leads.length)
  assert.deepEqual(grouped.sources[0], { label: 'Website', count: 2 })
  assert.ok(grouped.sources.some(item => item.label === 'Not recorded'))
  assert.equal(overviewBreakdowns([], []).approvals.length, 3)
  assert.deepEqual(overviewBreakdowns([], []).sources, [])
})

test('adapters map API records to the prototype labels', () => {
  const listing = { id: 7, status: 'REJECTED', boat: { name: 'Harbour Light', price: 1000, imageUrl: null, isDeleted: false, boatType: 'Narrowboat' } } as unknown as ApiBoatListing
  assert.deepEqual(toOverviewBoat(listing), { id: '7', name: 'Harbour Light', type: 'Narrowboat', price: 1000, image: null, approval: 'Changes required', archived: false, published: false })
  assert.equal(saleStageLabel('Current'), 'In progress')
  // November is GMT (UTC+0); July is BST (UTC+1).
  const winter = { id: 1, status: 'PENDING', slot: { id: 1, startsAt: '2026-11-15T10:00:00Z', endsAt: '2026-11-15T12:00:00Z' } } as unknown as ApiAdminBooking
  assert.deepEqual(toOverviewBooking(winter), { id: '1', date: '2026-11-15', start: '10:00', end: '12:00', status: 'Pending' })
  const summer = toOverviewSlots([{ id: 2, startsAt: '2026-07-15T22:30:00Z', endsAt: '2026-07-15T23:30:00Z', available: true }, { id: 3, startsAt: '2026-07-16T09:00:00Z', endsAt: '2026-07-16T10:00:00Z', available: false }])
  // Held (unavailable) slots are excluded; a window crossing midnight ends at 24:00.
  assert.deepEqual(summer, [{ date: '2026-07-15', start: '23:30', end: '24:00' }])
})
