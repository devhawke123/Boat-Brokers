// One-off: flags the four boats that used to be hardcoded on the home page as
// Featured, so the live Featured Boats section looks the same on first deploy.
// After this, admins manage the flag from the Boats page in the admin portal.
//
// Dry run by default — it only prints what it would change:
//   node prisma/set-featured.js
// Apply:
//   node prisma/set-featured.js --confirm
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const FEATURED_NAMES = ['Sentinel', 'Beryl', 'Sunflower', 'Miss Sassy Lady'];

async function main() {
  const confirm = process.argv.includes('--confirm');
  const boats = await prisma.boat.findMany({
    where: { name: { in: FEATURED_NAMES }, isDeleted: false },
    select: { id: true, name: true, isFeatured: true },
  });

  const found = new Set(boats.map((b) => b.name));
  for (const name of FEATURED_NAMES) {
    if (!found.has(name)) console.warn(`Not found: "${name}"`);
  }
  for (const boat of boats) {
    console.log(`${confirm ? 'Featuring' : 'Would feature'} #${boat.id} ${boat.name}${boat.isFeatured ? ' (already featured)' : ''}`);
  }

  if (confirm && boats.length > 0) {
    await prisma.boat.updateMany({ where: { id: { in: boats.map((b) => b.id) } }, data: { isFeatured: true } });
    console.log('Done.');
  } else if (!confirm) {
    console.log('Dry run — re-run with --confirm to apply.');
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
