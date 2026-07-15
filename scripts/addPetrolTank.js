const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const farm = await prisma.farm.findFirst({ where: { name: 'Kwekwe Main Farm' } });
  if (!farm) throw new Error("Farm not found");

  // Check if it already exists
  const existing = await prisma.fuelTank.findFirst({
    where: { tankCode: 'KW-TANK-P1' }
  });

  if (!existing) {
    await prisma.fuelTank.create({
      data: {
        farmId: farm.id,
        tankCode: 'KW-TANK-P1',
        fuelType: 'Petrol',
        capacityLitres: 5000,
        currentLitres: 0
      }
    });
    console.log("Petrol tank created!");
  } else {
    console.log("Petrol tank already exists.");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
