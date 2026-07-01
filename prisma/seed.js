const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding massive amount of data...");

  // Clear existing data
  await prisma.cost.deleteMany();
  await prisma.payroll.deleteMany();
  await prisma.crop.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.farm.deleteMany();

  // Create Farms
  const farmsData = [
    { name: 'Kwekwe Main Farm', location: 'Head Office', crops: [{name: 'Maize', hectares: 500}, {name: 'Wheat', hectares: 300}, {name: 'Soya Beans', hectares: 200}] },
    { name: 'Mazoe Farm', location: 'Mashonaland Central', crops: [{name: 'Potatoes', hectares: 150}, {name: 'Green Mealies', hectares: 80}] },
    { name: 'Bikita Farm', location: 'Masvingo Province', crops: [{name: 'Barley', hectares: 120}, {name: 'Sorghum', hectares: 90}] },
    { name: 'Chiredzi Farm', location: 'Lowveld', crops: [{name: 'Sugar Cane', hectares: 800}] },
    { name: 'Tynwald Retail Hub', location: 'Harare', crops: [] }
  ];

  for (const f of farmsData) {
    const farm = await prisma.farm.create({
      data: {
        name: f.name,
        location: f.location,
        crops: { create: f.crops }
      },
      include: { crops: true }
    });

    // Add Staff to each farm
    const roles = ['Farm Manager', 'Agronomist', 'Tractor Driver', 'General Hand', 'Security'];
    for (let i = 0; i < 10; i++) {
      await prisma.staff.create({
        data: {
          name: `Employee ${f.name.split(' ')[0]} ${i+1}`,
          role: roles[i % roles.length],
          salary: Math.floor(Math.random() * 800) + 300,
          farmId: farm.id
        }
      });
    }

    // Add Costs to each farm
    for (let i = 0; i < 20; i++) {
      const isShared = Math.random() > 0.5;
      const randomCrop = farm.crops.length > 0 ? farm.crops[Math.floor(Math.random() * farm.crops.length)] : null;
      
      await prisma.cost.create({
        data: {
          amount: Math.floor(Math.random() * 5000) + 100,
          description: isShared ? 'Shared Overhead (Fuel/Maintenance)' : `Direct input for ${randomCrop?.name || 'Farm'}`,
          farmId: farm.id,
          cropId: (isShared || !randomCrop) ? null : randomCrop.id,
          date: new Date(new Date().getTime() - Math.random() * 10000000000)
        }
      });
    }
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
