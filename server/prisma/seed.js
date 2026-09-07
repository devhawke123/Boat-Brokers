const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const IMAGES_ROOT = path.resolve(__dirname, '..', '..', 'boat brokers product images');
const BOATS_JSON = path.resolve(__dirname, 'seed-data', 'boats.json');
const SELLER_EMAIL = 'dev@bluehawke.com';

function naturalNumber(filename) {
  const m = filename.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function buildImageFolderIndex() {
  const index = new Map();
  if (!fs.existsSync(IMAGES_ROOT)) return index;
  for (const entry of fs.readdirSync(IMAGES_ROOT, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      index.set(entry.name.trim().toLowerCase(), entry.name);
    }
  }
  return index;
}

function findImagesRecursive(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findImagesRecursive(full));
    } else if (/\.jpe?g$/i.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

function listImagesForFolder(folderName) {
  const dir = path.join(IMAGES_ROOT, folderName);
  const files = findImagesRecursive(dir).sort(
    (a, b) => naturalNumber(path.basename(a)) - naturalNumber(path.basename(b))
  );
  return files.map((f) => path.relative(path.resolve(__dirname, '..', '..'), f).split(path.sep).join('/'));
}

async function main() {
  const boats = JSON.parse(fs.readFileSync(BOATS_JSON, 'utf8'));
  const folderIndex = buildImageFolderIndex();

  const seller = await prisma.seller.upsert({
    where: { email: SELLER_EMAIL },
    update: {},
    create: {
      name: 'Boat Brokers',
      email: SELLER_EMAIL,
    },
  });

  await prisma.boatImage.deleteMany({});
  await prisma.boat.deleteMany({});

  let matchedFolders = 0;
  let totalImages = 0;
  const unmatched = [];

  for (const raw of boats) {
    const { name, cost, overview, boatType, ...rest } = raw;

    const folderName = folderIndex.get(name.trim().toLowerCase());
    let images = [];
    if (folderName) {
      images = listImagesForFolder(folderName);
      matchedFolders++;
      totalImages += images.length;
    } else {
      unmatched.push(name);
    }

    const boat = await prisma.boat.create({
      data: {
        name,
        cost,
        overview: overview || null,
        boatType: boatType || null,
        location: null,
        boatName: name,
        imageUrl: images[0] || null,
        seller: { connect: { id: seller.id } },
        ...rest,
        images: {
          create: images.map((imgPath, i) => ({ path: imgPath, position: i })),
        },
      },
    });

    console.log(`Seeded: ${boat.name} (${images.length} images)`);
  }

  console.log(`\nDone. ${boats.length} boats seeded, ${matchedFolders} matched an image folder, ${totalImages} images linked.`);
  if (unmatched.length) {
    console.log('No image folder found for:', unmatched.join(', '));
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
