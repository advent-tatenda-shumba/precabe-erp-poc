/**
 * Seed default ERP user accounts.
 * Run with:  node prisma/seed-users.js
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const HASH = await bcrypt.hash("password123", 10);

  const users = [
    {
      name: "Jenny Howard",
      email: "j.howard@pricabe.co.zw",
      password: HASH,
      role: "Super Admin",
    },
    {
      name: "Admin User",
      email: "admin@pricabe.co.zw",
      password: HASH,
      role: "Admin",
    },
    {
      name: "Farm Manager",
      email: "manager@pricabe.co.zw",
      password: HASH,
      role: "Farm Manager",
    },
    {
      name: "Finance Officer",
      email: "finance@pricabe.co.zw",
      password: HASH,
      role: "Finance",
    },
    {
      name: "Viewer Account",
      email: "viewer@pricabe.co.zw",
      password: HASH,
      role: "Viewer",
    },
  ];

  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (!existing) {
      await prisma.user.create({ data: u });
      console.log(`  ✓ Created: ${u.name} (${u.email})`);
    } else {
      console.log(`  – Skipped (exists): ${u.email}`);
    }
  }

  console.log("\nAll done! Password for all accounts: password123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
