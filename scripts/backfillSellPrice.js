const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Backfilling sell prices...");
  const items = await prisma.inventoryItem.findMany();
  
  let updated = 0;
  for (const item of items) {
    // 20% markup over unitCost
    const newSellPrice = item.unitCost * 1.20;
    
    await prisma.inventoryItem.update({
      where: { id: item.id },
      data: { sellPrice: newSellPrice }
    });
    updated++;
  }
  
  console.log(`Successfully updated ${updated} items with 20% markup.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
