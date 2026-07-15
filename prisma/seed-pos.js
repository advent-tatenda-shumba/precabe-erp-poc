const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding POS data...");
  const farm = await prisma.farm.findFirst();
  if (!farm) {
    console.log("No farm found. Please run main seed first.");
    return;
  }

  // Create a Shop Warehouse if not exists
  let warehouse = await prisma.warehouse.findFirst({
    where: { name: "Retail Shop", farmId: farm.id }
  });

  if (!warehouse) {
    warehouse = await prisma.warehouse.create({
      data: {
        name: "Retail Shop",
        farmId: farm.id
      }
    });
  }

  const items = [
    { name: "Schweppes Tonic 330ml", code: "5449000046390", price: 0.50, stock: 15 },
    { name: "Chelsea cookies 150g", code: "6009537014072", price: 0.50, stock: 20 },
    { name: "Nutmelo Smooth Peanut Butter 1L", code: "724376227259", price: 1.25, stock: 10 },
    { name: "Babysoft (2ply Tissue)", code: "6001019000252", price: 0.50, stock: 50 },
    { name: "Cudberry dairy milk chocolate", code: "6001065601069", price: 0.75, stock: 30 },
    { name: "Citro Pineapple 1L", code: "6009698816218", price: 0.75, stock: 6 },
    { name: "doritos bbq", code: "6009710725290", price: 0.75, stock: 24 },
    { name: "Carex Condoms Multi Pleasure", code: "9556564707295", price: 1.00, stock: 40 },
    { name: "Kiara Lavender Pine Gel 500g", code: "6009711220008", price: 2.00, stock: 12 },
    { name: "Fanta Grape 440ml", code: "5449000664723", price: 0.50, stock: 18 },
    { name: "Ingrams Herbal 450ml", code: "6009523606816", price: 1.50, stock: 20 },
    { name: "Dendairy Vanilla Yogurt 150g", code: "6009698812678", price: 0.30, stock: 93 },
    { name: "Joe biscuits chocolate creams", code: "6009711329688", price: 0.25, stock: 45 },
    { name: "African Taste Peanut Butter 1L", code: "724376227260", price: 1.25, stock: 5 },
    { name: "Huggies wipes", code: "5029053550039", price: 1.00, stock: 30 },
    { name: "Bull Brand 300g", code: "6001330000146", price: 1.00, stock: 34 },
    { name: "Fruiticana pineapple", code: "6009709826618", price: 0.50, stock: 12 },
    { name: "Wavies (Tomato Sauce) 100g", code: "745178884303", price: 1.25, stock: 8 },
    { name: "Amazon butter cookies 222g", code: "6009711324652", price: 0.25, stock: 15 },
    { name: "Life full cream milk 1L", code: "6009709826619", price: 0.75, stock: 5 },
    { name: "Ekono Spaghetti 400g", code: "6009711220009", price: 0.30, stock: 42 }
  ];

  for (const item of items) {
    await prisma.inventoryItem.upsert({
      where: { itemCode: item.code },
      update: {
        currentStock: item.stock,
        unitCost: item.price // Note: PosClient multiplies unitCost by 2 to get retail price. So a cost of 0.50 becomes $1.00
      },
      create: {
        itemCode: item.code,
        name: item.name,
        category: "Retail",
        unit: "Item",
        currentStock: item.stock,
        unitCost: item.price,
        warehouseId: warehouse.id
      }
    });
  }

  console.log("Retail POS Data seeded successfully.");

  // Create Bar Store Warehouse if not exists
  let barWarehouse = await prisma.warehouse.findFirst({
    where: { name: "Bar Store", farmId: farm.id }
  });

  if (!barWarehouse) {
    barWarehouse = await prisma.warehouse.create({
      data: {
        name: "Bar Store",
        farmId: farm.id
      }
    });
  }

  const barItems = [
    { name: "Castle Lite 330ml", code: "BAR-001", price: 1.00, stock: 120 },
    { name: "Zambezi Lager 330ml", code: "BAR-002", price: 1.00, stock: 95 },
    { name: "Heineken 330ml", code: "BAR-003", price: 1.50, stock: 60 },
    { name: "Jameson Irish Whiskey 750ml", code: "BAR-004", price: 15.00, stock: 12 },
    { name: "Glenfiddich 12yr 750ml", code: "BAR-005", price: 30.00, stock: 5 },
    { name: "Gordon's London Dry Gin 750ml", code: "BAR-006", price: 8.00, stock: 18 },
    { name: "Smirnoff Vodka 750ml", code: "BAR-007", price: 7.00, stock: 24 },
    { name: "Jagermeister 750ml", code: "BAR-008", price: 12.00, stock: 15 },
    { name: "Four Cousins Sweet Red 750ml", code: "BAR-009", price: 4.50, stock: 30 },
    { name: "Savanna Dry Cider 330ml", code: "BAR-010", price: 1.25, stock: 80 },
    { name: "Hunter's Gold Cider 330ml", code: "BAR-011", price: 1.25, stock: 85 },
    { name: "Red Bull Energy 250ml", code: "BAR-012", price: 1.50, stock: 40 },
    { name: "Coca-Cola Mixer 330ml", code: "BAR-013", price: 0.50, stock: 150 },
    { name: "Tonic Water Mixer 330ml", code: "BAR-014", price: 0.50, stock: 120 },
    { name: "Amarula Cream Liqueur 750ml", code: "BAR-015", price: 10.00, stock: 9 }
  ];

  for (const item of barItems) {
    await prisma.inventoryItem.upsert({
      where: { itemCode: item.code },
      update: {
        currentStock: item.stock,
        unitCost: item.price
      },
      create: {
        itemCode: item.code,
        name: item.name,
        category: "Beverage",
        unit: "Item",
        currentStock: item.stock,
        unitCost: item.price,
        warehouseId: barWarehouse.id
      }
    });
  }

  console.log("Bar Data seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
