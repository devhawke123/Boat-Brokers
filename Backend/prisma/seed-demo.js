// One-shot dummy-data seed for exercising the admin + seller portals end to
// end: a few more sellers, boats/listings in every status, comments, buyers,
// leads, sales, and availability slots/bookings. Safe to re-run — everything
// is upserted or checked for existence by a stable key first.
const { PrismaClient } = require('@prisma/client');
const { randomBytes, scryptSync } = require('crypto');

const prisma = new PrismaClient();
const KEY_LENGTH = 64;

function hashPassword(plain) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(plain, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
}

async function upsertSeller({ sellerId, name, email, status, phone, location }) {
  return prisma.seller.upsert({
    where: { email },
    update: { status },
    create: {
      sellerId,
      name,
      email,
      password: hashPassword('password123'),
      phone,
      location,
      status,
    },
  });
}

async function upsertBuyer({ buyerId, firstName, surname, email, phone, source, status }) {
  const existing = await prisma.buyer.findFirst({ where: { email } });
  if (existing) return prisma.buyer.update({ where: { id: existing.id }, data: { status } });
  return prisma.buyer.create({ data: { buyerId, firstName, surname, email, phone, source, status } });
}

async function upsertLead({ leadId, firstName, surname, email, phone, address, source, status, notes }) {
  const existing = await prisma.lead.findFirst({ where: { email } });
  if (existing) return existing;
  return prisma.lead.create({ data: { leadId, firstName, surname, email, phone, address, source, status, notes } });
}

async function createDemoBoat(seller, name, price, isSold = false, isUnderOffer = false) {
  const existing = await prisma.boat.findFirst({ where: { name, sellerId: seller.id } });
  if (existing) return existing;
  return prisma.boat.create({
    data: {
      name,
      cost: price ? `£${price.toLocaleString('en-GB')}` : '',
      price,
      isSold,
      isUnderOffer,
      sellerId: seller.id,
      builder: 'Demo Boatyard',
      // Must match the storefront's default fallback/filter value exactly
      // (see Frontend-Website/src/data/boats.ts) — plural, not singular —
      // or these boats get silently filtered out of the default view.
      boatType: 'Narrowboats',
      overview: `A lovely demo listing for ${name}, seeded for testing the admin dashboard.`,
    },
  });
}

async function createListingIfMissing(boat, seller, status) {
  const existing = await prisma.boatListing.findFirst({ where: { boatId: boat.id } });
  if (existing) return existing;
  return prisma.boatListing.create({
    data: { boatId: boat.id, sellerId: seller.id, status, sellTimeline: 'Within 3 months', contactTime: 'Evenings' },
  });
}

async function addCommentIfMissing(listing, content, author, fromSeller) {
  const existing = await prisma.listingComment.findFirst({ where: { listingId: listing.id, content } });
  if (existing) return existing;
  return prisma.listingComment.create({ data: { listingId: listing.id, content, author, fromSeller } });
}

async function main() {
  // --- Sellers (Boat Sellers module) ---
  const sellerAlice = await upsertSeller({
    sellerId: 'SEL-DEMO-001',
    name: 'Alice Fenwick',
    email: 'alice.fenwick@example.com',
    status: 'NEW',
    phone: '07700 900111',
    location: 'Birmingham',
  });
  const sellerBen = await upsertSeller({
    sellerId: 'SEL-DEMO-002',
    name: 'Ben Okafor',
    email: 'ben.okafor@example.com',
    status: 'CONTACTED',
    phone: '07700 900222',
    location: 'Coventry',
  });
  const sellerClara = await upsertSeller({
    sellerId: 'SEL-DEMO-003',
    name: 'Clara Voss',
    email: 'clara.voss@example.com',
    status: 'LISTED',
    phone: '07700 900333',
    location: 'Worcester',
  });
  const sellerDan = await upsertSeller({
    sellerId: 'SEL-DEMO-004',
    name: 'Dan Whitfield',
    email: 'dan.whitfield@example.com',
    status: 'LOST',
    phone: '07700 900444',
    location: 'Stratford-upon-Avon',
  });

  // --- Boats + Listings across every status (Listings module) ---
  const boatPending1 = await createDemoBoat(sellerAlice, 'MERRY WANDERER', 32500);
  const listingPending1 = await createListingIfMissing(boatPending1, sellerAlice, 'PENDING');
  await addCommentIfMissing(listingPending1, 'Can you confirm the engine hours?', 'Admin', false);

  const boatPending2 = await createDemoBoat(sellerBen, 'RIVER SONG', 45000);
  await createListingIfMissing(boatPending2, sellerBen, 'PENDING');

  const boatApproved1 = await createDemoBoat(sellerBen, 'CANAL DREAMER', 58900);
  const listingApproved1 = await createListingIfMissing(boatApproved1, sellerBen, 'APPROVED');
  await addCommentIfMissing(listingApproved1, 'Looks great, approved for listing.', 'Admin', false);
  await addCommentIfMissing(listingApproved1, 'Thank you! Photos updated.', 'Ben Okafor', true);

  const boatApproved2 = await createDemoBoat(sellerClara, 'WILLOW BREEZE', 74950, false, true);
  await createListingIfMissing(boatApproved2, sellerClara, 'APPROVED');

  const boatRejected1 = await createDemoBoat(sellerDan, 'OLD TROUT', 15000);
  const listingRejected1 = await createListingIfMissing(boatRejected1, sellerDan, 'REJECTED');
  await addCommentIfMissing(listingRejected1, 'Photos are too low-res, please resubmit.', 'Admin', false);

  // --- Buyers (Boat Buyers module) ---
  const buyerEmma = await upsertBuyer({
    buyerId: 'BYR-DEMO-001',
    firstName: 'Emma',
    surname: 'Harding',
    email: 'emma.harding@example.com',
    phone: '07711 111111',
    source: 'Manual',
    status: 'NEW',
  });
  const buyerFrank = await upsertBuyer({
    buyerId: 'BYR-DEMO-002',
    firstName: 'Frank',
    surname: 'Delgado',
    email: 'frank.delgado@example.com',
    phone: '07722 222222',
    source: 'Manual',
    status: 'CONTACTED',
  });
  const buyerGrace = await upsertBuyer({
    buyerId: 'BYR-DEMO-003',
    firstName: 'Grace',
    surname: 'Lindqvist',
    email: 'grace.lindqvist@example.com',
    phone: '07733 333333',
    source: 'Booking',
    status: 'VIEWING_BOOKED',
  });
  const buyerHenry = await upsertBuyer({
    buyerId: 'BYR-DEMO-004',
    firstName: 'Henry',
    surname: 'Osei',
    email: 'henry.osei@example.com',
    phone: '07744 444444',
    source: 'Manual',
    status: 'WON',
  });
  await upsertBuyer({
    buyerId: 'BYR-DEMO-005',
    firstName: 'Isla',
    surname: 'Petrov',
    email: 'isla.petrov@example.com',
    phone: '07755 555555',
    source: 'Manual',
    status: 'LOST',
  });

  // --- Leads (vendor-side inquiry pipeline) ---
  await upsertLead({
    leadId: 'LEAD-DEMO-001',
    firstName: 'Jack',
    surname: 'Mercer',
    email: 'jack.mercer@example.com',
    phone: '07766 111222',
    address: '12 Towpath Lane, Birmingham',
    source: 'Referral',
    status: 'NEW',
    notes: 'Interested in selling a 45ft widebeam next spring.',
  });
  await upsertLead({
    leadId: 'LEAD-DEMO-002',
    firstName: 'Karen',
    surname: 'Ibrahim',
    email: 'karen.ibrahim@example.com',
    phone: '07766 222333',
    address: '4 Lock Cottages, Worcester',
    source: 'Website',
    status: 'CONTACTED',
    notes: 'Called back, sending valuation info.',
  });
  await upsertLead({
    leadId: 'LEAD-DEMO-003',
    firstName: 'Liam',
    surname: 'Novak',
    email: 'liam.novak@example.com',
    phone: '07766 333444',
    address: null,
    source: 'Apollo Duck',
    status: 'LISTED',
    notes: 'Boat now live as CANAL DREAMER.',
  });
  await upsertLead({
    leadId: 'LEAD-DEMO-004',
    firstName: 'Maya',
    surname: 'Chen',
    email: 'maya.chen@example.com',
    phone: '07766 444555',
    address: null,
    source: 'Other',
    status: 'LOST',
    notes: 'Decided to sell privately.',
  });

  // --- Sales (manual deal log) ---
  const existingSale1 = await prisma.sale.findFirst({ where: { boatId: boatApproved1.id } });
  if (!existingSale1) {
    await prisma.sale.create({
      data: {
        boatId: boatApproved1.id,
        sellerId: sellerBen.id,
        buyerId: buyerHenry.id,
        soldPrice: 58900,
        deposit: 2945,
        commission: 2945,
        status: 'COMPLETED',
      },
    });
  }
  const existingSale2 = await prisma.sale.findFirst({ where: { boatId: boatApproved2.id } });
  if (!existingSale2) {
    await prisma.sale.create({
      data: {
        boatId: boatApproved2.id,
        sellerId: sellerClara.id,
        buyerId: buyerFrank.id,
        soldPrice: 74950,
        deposit: 3750,
        commission: 3750,
        status: 'CURRENT',
      },
    });
  }

  // --- Availability slots + bookings ---
  async function createSlotIfMissing(startsAt) {
    const existing = await prisma.availabilitySlot.findFirst({ where: { startsAt } });
    if (existing) return existing;
    const endsAt = new Date(startsAt.getTime() + 2 * 60 * 60 * 1000);
    return prisma.availabilitySlot.create({ data: { startsAt, endsAt } });
  }

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const slotOpen1 = await createSlotIfMissing(new Date(now + 2 * day));
  const slotOpen2 = await createSlotIfMissing(new Date(now + 3 * day));
  const slotPending = await createSlotIfMissing(new Date(now + 4 * day));
  const slotApproved = await createSlotIfMissing(new Date(now + 5 * day));
  void slotOpen1;
  void slotOpen2;

  const existingPendingBooking = await prisma.booking.findFirst({ where: { slotId: slotPending.id } });
  if (!existingPendingBooking) {
    await prisma.booking.create({
      data: { slotId: slotPending.id, boatId: boatPending1.id, buyerId: buyerEmma.id, status: 'PENDING' },
    });
  }
  const existingApprovedBooking = await prisma.booking.findFirst({ where: { slotId: slotApproved.id } });
  if (!existingApprovedBooking) {
    await prisma.booking.create({
      data: { slotId: slotApproved.id, boatId: boatApproved1.id, buyerId: buyerGrace.id, status: 'APPROVED' },
    });
  }

  console.log('Demo data ready:');
  console.log('- Sellers: Alice Fenwick, Ben Okafor, Clara Voss, Dan Whitfield (+ existing)');
  console.log('- Boats/Listings: 1 pending (no comments), 1 pending (w/ comment), 1 approved (w/ comments),');
  console.log('  1 approved+under-offer, 1 rejected (w/ comment)');
  console.log('- Buyers: Emma (New), Frank (Contacted), Grace (Viewing Booked), Henry (Won), Isla (Lost)');
  console.log('- Leads: Jack (New), Karen (Contacted), Liam (Listed), Maya (Lost)');
  console.log('- Sales: 1 Completed, 1 Current');
  console.log('- Availability: 2 open slots, 1 pending booking, 1 approved booking');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
