const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function test() {
  const prisma = new PrismaClient();
  const email = 'admin@pricabe.co.zw';
  const password = 'password123';
  const user = await prisma.user.findUnique({ where: { email } });
  console.log('User found:', user ? user.email : 'null');
  if (user) {
    const valid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', valid);
  }
  await prisma.$disconnect();
}
test();
