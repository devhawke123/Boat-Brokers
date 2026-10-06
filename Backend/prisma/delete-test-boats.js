// One-off cleanup: permanently deletes the test boats/listings created while
// trying out the portals — whether they are Deleted, Pending or Rejected.
// Child rows (images, custom fields, listings and their comments, bookings,
// sales) go with the boat via onDelete: Cascade, and the uploaded image /
// brochure files under uploads/ are removed from disk too.
//
// Dry run by default — it only prints what it would remove:
//   node prisma/delete-test-boats.js
// Actually delete:
//   node prisma/delete-test-boats.js --confirm
//
// Only boats named exactly in TEST_BOAT_NAMES are touched.
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const TEST_BOAT_NAMES = [
  // soft-deleted
  'Test Boat 1',
  'Itaque ipsum est de',
  'Quo reprehenderit fu',
  'Aut et dolor aliquam',
  'Ipsa ad est aut ea',
  // pending / rejected
  'Iure veniam cupidit',
  'Occaecat aut a commo',
  'Sed sunt optio eaqu',
  'Labore fugiat quisqu',
  'Velit facilis volupt',
];

const uploadsRoot = path.resolve(__dirname, '..', 'uploads');

// Stored paths look like "/uploads/boats/abc.jpg". Resolve them under uploads/
// and refuse anything that escapes it.
function resolveUpload(storedPath) {
  if (!storedPath || !storedPath.startsWith('/uploads/')) return null;
  const abs = path.resolve(uploadsRoot, storedPath.slice('/uploads/'.length));
  return abs.startsWith(uploadsRoot + path.sep) ? abs : null;
}

async function main() {
  const confirm = process.argv.includes('--confirm');

  const boats = await prisma.boat.findMany({
    where: { name: { in: TEST_BOAT_NAMES } },
    select: {
      id: true,
      name: true,
      price: true,
      isDeleted: true,
      imageUrl: true,
      brochureUrl: true,
      images: { select: { path: true } },
      seller: { select: { name: true } },
      listings: { select: { status: true } },
      _count: { select: { bookings: true, sales: true } },
    },
  });

  console.log(`Found ${boats.length} of ${TEST_BOAT_NAMES.length} expected boats:`);
  for (const b of boats) {
    console.log(
      `  #${b.id} "${b.name}" | seller: ${b.seller.name} | price: ${b.price ?? '-'} | ` +
        `${b.isDeleted ? 'deleted' : `listing: ${b.listings.map((l) => l.status).join('/') || '-'}`} | ` +
        `images: ${b.images.length}, bookings: ${b._count.bookings}, sales: ${b._count.sales}`,
    );
  }

  const found = new Set(boats.map((b) => b.name));
  const missing = TEST_BOAT_NAMES.filter((n) => !found.has(n));
  if (missing.length) console.log(`Not found (already gone or name mismatch): ${missing.join(', ')}`);

  // Duplicate names would mean we are about to delete more than the ones on screen.
  if (boats.length > TEST_BOAT_NAMES.length) {
    console.log('\nMore boats matched than names listed (duplicate names) — check the list above. Aborting.');
    process.exitCode = 1;
    return;
  }

  const files = new Set();
  for (const b of boats) {
    for (const stored of [b.imageUrl, b.brochureUrl, ...b.images.map((i) => i.path)]) {
      const abs = resolveUpload(stored);
      if (abs) files.add(abs);
    }
  }
  console.log(`Upload files referenced: ${files.size}`);

  if (!confirm) {
    console.log('\nDry run — nothing deleted. Re-run with --confirm to delete the boats and files above.');
    return;
  }

  const result = await prisma.boat.deleteMany({ where: { id: { in: boats.map((b) => b.id) } } });
  console.log(`\nDeleted ${result.count} boats.`);

  let removed = 0;
  for (const abs of files) {
    try {
      fs.unlinkSync(abs);
      removed += 1;
    } catch (e) {
      if (e.code !== 'ENOENT') console.log(`Could not remove ${abs}: ${e.message}`);
    }
  }
  console.log(`Removed ${removed} upload files.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
