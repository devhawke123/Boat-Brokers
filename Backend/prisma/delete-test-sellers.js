// One-off cleanup: permanently deletes every seller EXCEPT the Boat Brokers
// company account, skipping any seller that still owns boats (Boat.sellerId has
// no cascade, so those would block the delete anyway). Run delete-test-boats.js
// first so the test sellers no longer own anything.
//
// Dry run by default — it only prints what it would remove:
//   node prisma/delete-test-sellers.js
// Actually delete:
//   node prisma/delete-test-sellers.js --confirm
//
// Listings and sales tied to a deleted seller go with it via onDelete: Cascade,
// and the seller's avatar file under uploads/ is removed from disk too.
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const KEEP_SELLER_NAMES = ['boat brokers'];

const uploadsRoot = path.resolve(__dirname, '..', 'uploads');

function resolveUpload(storedPath) {
  if (!storedPath || !storedPath.startsWith('/uploads/')) return null;
  const abs = path.resolve(uploadsRoot, storedPath.slice('/uploads/'.length));
  return abs.startsWith(uploadsRoot + path.sep) ? abs : null;
}

async function main() {
  const confirm = process.argv.includes('--confirm');

  const sellers = await prisma.seller.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      _count: { select: { boats: true, listings: true, sales: true } },
    },
    orderBy: { id: 'asc' },
  });

  const kept = sellers.filter((s) => KEEP_SELLER_NAMES.includes(s.name.trim().toLowerCase()));
  const candidates = sellers.filter((s) => !kept.includes(s));
  const withBoats = candidates.filter((s) => s._count.boats > 0);
  const removable = candidates.filter((s) => s._count.boats === 0);

  console.log(`Keeping (${kept.length}):`);
  for (const s of kept) console.log(`  #${s.id} "${s.name}" <${s.email}> | boats: ${s._count.boats}`);

  console.log(`\nSkipping — still own boats (${withBoats.length}):`);
  for (const s of withBoats) console.log(`  #${s.id} "${s.name}" <${s.email}> | boats: ${s._count.boats}`);

  console.log(`\nWill delete (${removable.length}):`);
  for (const s of removable) {
    console.log(
      `  #${s.id} "${s.name}" <${s.email}> | listings: ${s._count.listings}, sales: ${s._count.sales}`,
    );
  }

  if (kept.length === 0) {
    console.log('\nNo "Boat Brokers" seller found — refusing to continue, check KEEP_SELLER_NAMES.');
    process.exitCode = 1;
    return;
  }

  if (!confirm) {
    console.log('\nDry run — nothing deleted. Re-run with --confirm to delete the sellers listed under "Will delete".');
    return;
  }

  const result = await prisma.seller.deleteMany({ where: { id: { in: removable.map((s) => s.id) } } });
  console.log(`\nDeleted ${result.count} sellers.`);

  let removed = 0;
  for (const s of removable) {
    const abs = resolveUpload(s.avatarUrl);
    if (!abs) continue;
    try {
      fs.unlinkSync(abs);
      removed += 1;
    } catch (e) {
      if (e.code !== 'ENOENT') console.log(`Could not remove ${abs}: ${e.message}`);
    }
  }
  console.log(`Removed ${removed} avatar files.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
