// One-off cleanup: permanently deletes the test boats that were soft-deleted
// in the admin portal. Child rows (images, custom fields, listings, bookings,
// sales) go with them via onDelete: Cascade.
//
// Dry run by default — it only prints what it would remove:
//   node prisma/delete-test-boats.js
// Actually delete:
//   node prisma/delete-test-boats.js --confirm
//
// Only boats that are BOTH soft-deleted and named in TEST_BOAT_NAMES are touched.
// Uploaded image files under uploads/ are not removed.
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const TEST_BOAT_NAMES = [
  'Test Boat 1',
  'Itaque ipsum est de',
  'Quo reprehenderit fu',
  'Aut et dolor aliquam',
  'Ipsa ad est aut ea',
];

async function main() {
  const confirm = process.argv.includes('--confirm');

  const boats = await prisma.boat.findMany({
    where: { isDeleted: true, name: { in: TEST_BOAT_NAMES } },
    select: {
      id: true,
      name: true,
      price: true,
      seller: { select: { name: true } },
      _count: { select: { images: true, listings: true, bookings: true, sales: true } },
    },
  });

  console.log(`Found ${boats.length} of ${TEST_BOAT_NAMES.length} expected boats:`);
  for (const b of boats) {
    console.log(
      `  #${b.id} "${b.name}" | seller: ${b.seller.name} | price: ${b.price ?? '-'} | ` +
        `images: ${b._count.images}, listings: ${b._count.listings}, bookings: ${b._count.bookings}, sales: ${b._count.sales}`,
    );
  }

  const found = new Set(boats.map((b) => b.name));
  const missing = TEST_BOAT_NAMES.filter((n) => !found.has(n));
  if (missing.length) console.log(`Not found (name mismatch or not soft-deleted): ${missing.join(', ')}`);

  if (!confirm) {
    console.log('\nDry run — nothing deleted. Re-run with --confirm to delete the boats above.');
    return;
  }

  const result = await prisma.boat.deleteMany({ where: { id: { in: boats.map((b) => b.id) } } });
  console.log(`\nDeleted ${result.count} boats.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
