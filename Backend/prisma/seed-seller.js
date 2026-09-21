const { PrismaClient } = require('@prisma/client');
const { randomBytes, scryptSync } = require('crypto');

const prisma = new PrismaClient();

const KEY_LENGTH = 64;

function hashPassword(plain) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(plain, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  const plainPassword = 'test1234';
  const hashedPassword = hashPassword(plainPassword);

  const seller = await prisma.seller.upsert({
    where: { email: 'test@gmail.com' },
    update: { password: hashedPassword },
    create: {
      sellerId: 'SEL-000002',
      name: 'Boat Brokers',
      email: 'test@gmail.com',
      password: hashedPassword,
      phone: null,
      location: null,
      avatarUrl: null,
    },
  });

  console.log('Seller ready:', seller);
  console.log('Login with password:', plainPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });