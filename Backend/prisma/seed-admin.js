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
  const plainPassword = 'admin';
  const hashedPassword = hashPassword(plainPassword);

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@example.com' },
    update: { password: hashedPassword },
    create: {
      adminId: 'ADM-000001',
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      phone: null,
      avatarUrl: null,
    },
  });

  console.log('Admin ready:', admin);
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
