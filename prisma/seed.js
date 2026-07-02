const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Pricabe Enterprises ERP...');

  // Clear all tables in reverse dependency order
  await prisma.productionOrder.deleteMany();
  await prisma.bOMLine.deleteMany();
  await prisma.billOfMaterials.deleteMany();
  await prisma.interFarmLoan.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.bankTransaction.deleteMany();
  await prisma.bankAccount.deleteMany();
  await prisma.fuelTransaction.deleteMany();
  await prisma.fuelTank.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.invoiceLine.deleteMany();
  await prisma.salesInvoice.deleteMany();
  await prisma.pOLine.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.fixedAsset.deleteMany();
  await prisma.payrollLine.deleteMany();
  await prisma.payroll.deleteMany();
  await prisma.cost.deleteMany();
  await prisma.livestockEvent.deleteMany();
  await prisma.livestockBatch.deleteMany();
  await prisma.cropCycle.deleteMany();
  await prisma.crop.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.farm.deleteMany();

  // ─── FARMS ───────────────────────────────────────────────────────────
  const farmData = [
    { name: 'Kwekwe Main Farm', location: 'Kwekwe, Head Office', description: 'Primary operations hub and head office' },
    { name: 'Kwekwe 2 (Mvuma Road)', location: 'Kwekwe, Mvuma Road', description: 'Secondary Kwekwe farm on Mvuma Road' },
    { name: 'Mazoe Farm', location: 'Mashonaland Central', description: 'Horticulture focus — potatoes and green mealies' },
    { name: 'Bikita Farm', location: 'Masvingo Province', description: 'Grain crops and piggery operations' },
    { name: 'Chiredzi Farm', location: 'Lowveld, Masvingo', description: 'Large-scale sugar cane production' },
    { name: 'Tynwald Hub', location: 'Tynwald, Harare', description: 'Retail, bakery, butchery and processing hub' },
  ];
  const farms = [];
  for (const f of farmData) {
    farms.push(await prisma.farm.create({ data: f }));
  }
  const [kwekweMain, kwekwe2, mazoe, bikita, chiredzi, tynwald] = farms;

  // ─── CROPS ───────────────────────────────────────────────────────────
  const cropsByFarm = [
    { farmId: kwekweMain.id, crops: [{ name: 'Maize', hectares: 500 }, { name: 'Wheat', hectares: 300 }, { name: 'Soya Beans', hectares: 200 }] },
    { farmId: kwekwe2.id, crops: [{ name: 'Maize', hectares: 200 }, { name: 'Barley', hectares: 150 }] },
    { farmId: mazoe.id, crops: [{ name: 'Potatoes', hectares: 150 }, { name: 'Green Mealies', hectares: 80 }] },
    { farmId: bikita.id, crops: [{ name: 'Barley', hectares: 120 }, { name: 'Sorghum', hectares: 90 }] },
    { farmId: chiredzi.id, crops: [{ name: 'Sugar Cane', hectares: 800 }] },
  ];
  const allCrops = {};
  for (const { farmId, crops } of cropsByFarm) {
    allCrops[farmId] = [];
    for (const c of crops) {
      allCrops[farmId].push(await prisma.crop.create({ data: { ...c, farmId } }));
    }
  }

  // ─── CROP CYCLES ─────────────────────────────────────────────────────
  const now = new Date();
  const cycleData = [
    { farmId: kwekweMain.id, cropName: 'Maize', season: '2025/2026', stage: 'Harvesting', hectares: 500, yieldTonnes: 2800, plantDaysAgo: 180, harvestDaysAgo: 10 },
    { farmId: kwekweMain.id, cropName: 'Wheat', season: '2025/2026', stage: 'Growing', hectares: 300, plantDaysAgo: 60 },
    { farmId: kwekweMain.id, cropName: 'Soya Beans', season: '2025/2026', stage: 'Planting', hectares: 200, plantDaysAgo: 5 },
    { farmId: kwekwe2.id, cropName: 'Maize', season: '2025/2026', stage: 'Complete', hectares: 200, yieldTonnes: 1050, plantDaysAgo: 200, harvestDaysAgo: 30 },
    { farmId: kwekwe2.id, cropName: 'Barley', season: '2025/2026', stage: 'Growing', hectares: 150, plantDaysAgo: 45 },
    { farmId: mazoe.id, cropName: 'Potatoes', season: '2025/2026', stage: 'Growing', hectares: 150, plantDaysAgo: 55 },
    { farmId: bikita.id, cropName: 'Barley', season: '2025/2026', stage: 'Planting', hectares: 120, plantDaysAgo: 3 },
    { farmId: chiredzi.id, cropName: 'Sugar Cane', season: '2025/2026', stage: 'Growing', hectares: 800, plantDaysAgo: 90 },
  ];
  const cycles = [];
  for (const c of cycleData) {
    const farmCrops = allCrops[c.farmId] || [];
    const crop = farmCrops.find(cr => cr.name === c.cropName);
    if (!crop) continue;
    const plantDate = new Date(now.getTime() - c.plantDaysAgo * 86400000);
    const harvestDate = c.harvestDaysAgo ? new Date(now.getTime() - c.harvestDaysAgo * 86400000) : null;
    const expectedHarvestDate = new Date(plantDate.getTime() + 150 * 86400000);
    cycles.push(await prisma.cropCycle.create({
      data: {
        farmId: c.farmId, cropId: crop.id, season: c.season, stage: c.stage,
        hectaresPlanted: c.hectares, yieldTonnes: c.yieldTonnes || null,
        plantingDate: plantDate, expectedHarvestDate, actualHarvestDate: harvestDate
      }
    }));
  }

  // ─── LIVESTOCK BATCHES ────────────────────────────────────────────────
  const livestockData = [
    { farmId: kwekweMain.id, species: 'Cattle', batchCode: 'KW-CATT-001', purpose: 'Breeding', headCount: 150 },
    { farmId: kwekweMain.id, species: 'Goats', batchCode: 'KW-GOAT-001', purpose: 'Breeding', headCount: 80 },
    { farmId: kwekwe2.id, species: 'Cattle', batchCode: 'KW2-CATT-001', purpose: 'Fattening', headCount: 200 },
    { farmId: kwekwe2.id, species: 'Sheep', batchCode: 'KW2-SHP-001', purpose: 'Breeding', headCount: 120 },
    { farmId: bikita.id, species: 'Pigs', batchCode: 'BK-PIG-001', purpose: 'Fattening', headCount: 300 },
    { farmId: chiredzi.id, species: 'Cattle', batchCode: 'CHR-CATT-001', purpose: 'Fattening', headCount: 85 },
  ];
  const batches = [];
  for (const b of livestockData) {
    batches.push(await prisma.livestockBatch.create({ data: b }));
  }

  // Livestock events
  const eventTypes = ['Birth', 'Death', 'Purchase', 'Sale'];
  for (const batch of batches) {
    for (let i = 0; i < 4; i++) {
      const et = eventTypes[i % eventTypes.length];
      await prisma.livestockEvent.create({
        data: {
          batchId: batch.id,
          eventType: et,
          quantity: Math.floor(Math.random() * 10) + 1,
          unitValue: et === 'Purchase' || et === 'Sale' ? Math.floor(Math.random() * 500) + 300 : null,
          notes: `${et} event recorded`,
          date: new Date(now.getTime() - Math.random() * 8640000000)
        }
      });
    }
  }

  // ─── STAFF ───────────────────────────────────────────────────────────
  const roles = {
    farm: ['Farm Manager', 'Agronomist', 'Tractor Driver', 'General Hand', 'Security Guard', 'Irrigation Officer'],
    office: ['Finance Officer', 'HR Officer', 'Admin Clerk'],
    retail: ['Butcher', 'Cashier', 'Baker', 'Bar Attendant', 'Fuel Attendant'],
  };
  const names = [
    'Tendai Moyo', 'Farai Ncube', 'Simba Dube', 'Rudo Mutasa', 'Tatenda Chikwanda',
    'Bongani Sibanda', 'Chipo Mhuru', 'Admire Nyoni', 'Kudakwashe Mpofu', 'Nyasha Banda',
    'Tafadzwa Gumbo', 'Munyaradzi Chirwa', 'Patience Ndlovu', 'Blessing Majoni', 'Gift Zimba',
    'Tarisai Makoni', 'Innocent Khumalo', 'Sandra Phiri', 'Charles Mutowo', 'Alice Machingura',
    'Prosper Chigumbu', 'Melody Sithole', 'Liberty Nkomo', 'Portia Zvenyika', 'Moses Madya',
    'Felistas Makusha', 'Courage Dewa', 'Edna Mutambirwa', 'Lovemore Hungwe', 'Ruth Mapfunde',
    'Tino Chivanda', 'Brighton Masiiwa', 'Nokuthula Mhlanga', 'Emmerson Marara', 'Sekai Chauya',
    'Dakarai Ziki', 'Privilege Madondo', 'Viola Marume', 'Conrad Chingono', 'Precious Nhari',
    'Victor Mwale', 'Florence Gwenzi', 'Takudzwa Matemba', 'Sheila Mafios', 'Ambrose Chari',
    'Winnie Murapi', 'Arnold Makahamadze', 'Joy Mushore', 'Namatai Mutevedzi', 'Elton Gwata',
  ];
  const allStaff = [];
  let nameIdx = 0;
  const farmStaffConfig = [
    { farm: kwekweMain, count: 12, roleSet: 'farm', salaryRange: [350, 900] },
    { farm: kwekwe2, count: 8, roleSet: 'farm', salaryRange: [300, 700] },
    { farm: mazoe, count: 7, roleSet: 'farm', salaryRange: [300, 650] },
    { farm: bikita, count: 7, roleSet: 'farm', salaryRange: [300, 650] },
    { farm: chiredzi, count: 8, roleSet: 'farm', salaryRange: [350, 750] },
    { farm: tynwald, count: 8, roleSet: 'retail', salaryRange: [400, 800] },
  ];
  // Add 3 head office staff to kwekweMain
  for (const r of roles.office) {
    const s = await prisma.staff.create({
      data: { name: names[nameIdx++ % names.length], role: r, employeeType: 'Permanent', salary: 900 + Math.random() * 300, farmId: kwekweMain.id, costAllocation: 'Farm' }
    });
    allStaff.push(s);
  }
  for (const { farm, count, roleSet, salaryRange } of farmStaffConfig) {
    const rList = roles[roleSet];
    for (let i = 0; i < count; i++) {
      const role = rList[i % rList.length];
      const salary = Math.floor(Math.random() * (salaryRange[1] - salaryRange[0]) + salaryRange[0]);
      const empType = i < count * 0.7 ? 'Permanent' : 'Contract';
      const s = await prisma.staff.create({
        data: { name: names[nameIdx++ % names.length], role, employeeType: empType, salary, farmId: farm.id, costAllocation: 'Farm', employeeCode: `EMP-${String(nameIdx).padStart(3,'0')}` }
      });
      allStaff.push(s);
    }
  }

  // ─── WAREHOUSES ──────────────────────────────────────────────────────
  const warehouseData = [
    { name: 'Kwekwe Main - Warehouse A', farmId: kwekweMain.id },
    { name: 'Kwekwe Main - Warehouse B', farmId: kwekweMain.id },
    { name: 'Kwekwe 2 - Warehouse', farmId: kwekwe2.id },
    { name: 'Mazoe - Cold Store', farmId: mazoe.id },
    { name: 'Bikita - Grain Store', farmId: bikita.id },
    { name: 'Chiredzi - Cane Store', farmId: chiredzi.id },
    { name: 'Tynwald - Retail Store', farmId: tynwald.id },
    { name: 'Tynwald - Bakery Store', farmId: tynwald.id },
  ];
  const warehouses = [];
  for (const w of warehouseData) {
    warehouses.push(await prisma.warehouse.create({ data: w }));
  }
  const [wKwMain, wKwMainB, wKw2, wMaz, wBik, wChr, wTyn, wTynBak] = warehouses;

  // ─── INVENTORY ITEMS ─────────────────────────────────────────────────
  const inventoryItems = [
    { itemCode: 'FERT-AN', name: 'Ammonium Nitrate 50kg', category: 'AgriculturalInput', unit: 'Bags', reorderLevel: 100, currentStock: 450, unitCost: 28, warehouseId: wKwMain.id },
    { itemCode: 'FERT-URE', name: 'Urea 50kg', category: 'AgriculturalInput', unit: 'Bags', reorderLevel: 80, currentStock: 220, unitCost: 32, warehouseId: wKwMain.id },
    { itemCode: 'SEED-MZ', name: 'SC719 Maize Seed 25kg', category: 'AgriculturalInput', unit: 'Bags', reorderLevel: 150, currentStock: 120, unitCost: 18, warehouseId: wKwMainB.id },
    { itemCode: 'SEED-WT', name: 'Wheat Seed 50kg', category: 'AgriculturalInput', unit: 'Bags', reorderLevel: 60, currentStock: 85, unitCost: 22, warehouseId: wKwMainB.id },
    { itemCode: 'SEED-SB', name: 'Soya Bean Seed 25kg', category: 'AgriculturalInput', unit: 'Bags', reorderLevel: 50, currentStock: 65, unitCost: 25, warehouseId: wKwMainB.id },
    { itemCode: 'SEED-BR', name: 'Barley Seed 50kg', category: 'AgriculturalInput', unit: 'Bags', reorderLevel: 40, currentStock: 30, unitCost: 20, warehouseId: wKw2.id },
    { itemCode: 'CHEM-HERB', name: 'Glyphosate Herbicide 20L', category: 'AgriculturalInput', unit: 'Drums', reorderLevel: 20, currentStock: 15, unitCost: 65, warehouseId: wBik.id },
    { itemCode: 'CHEM-PEST', name: 'Chlorpyrifos Pesticide 5L', category: 'AgriculturalInput', unit: 'Cans', reorderLevel: 30, currentStock: 42, unitCost: 28, warehouseId: wKwMain.id },
    { itemCode: 'FEED-CATT', name: 'Cattle Feed (Bulk)', category: 'LivestockFeed', unit: 'Kg', reorderLevel: 5000, currentStock: 12000, unitCost: 0.45, warehouseId: wKwMain.id },
    { itemCode: 'FEED-PIG', name: 'Pig Grower Meal', category: 'LivestockFeed', unit: 'Bags', reorderLevel: 200, currentStock: 380, unitCost: 22, warehouseId: wBik.id },
    { itemCode: 'FUEL-D', name: 'Diesel (Bulk)', category: 'Fuel', unit: 'Litres', reorderLevel: 2000, currentStock: 4500, unitCost: 1.38, warehouseId: wKwMain.id },
    { itemCode: 'FUEL-P', name: 'Petrol (Bulk)', category: 'Fuel', unit: 'Litres', reorderLevel: 1000, currentStock: 2200, unitCost: 1.42, warehouseId: wTyn.id },
    { itemCode: 'MEAT-BEEF', name: 'Beef Carcass (Dressed)', category: 'FinishedGoods', unit: 'Kg', reorderLevel: 100, currentStock: 350, unitCost: 4.20, warehouseId: wTyn.id },
    { itemCode: 'BAKERY-BR', name: 'Bread Loaf 800g', category: 'FinishedGoods', unit: 'Units', reorderLevel: 200, currentStock: 180, unitCost: 0.65, warehouseId: wTyn.id },
    { itemCode: 'FLOUR-WH', name: 'Wheat Flour 50kg', category: 'RawMaterial', unit: 'Bags', reorderLevel: 100, currentStock: 240, unitCost: 24, warehouseId: wTynBak.id },
    { itemCode: 'SUGAR-WH', name: 'White Sugar 50kg', category: 'RawMaterial', unit: 'Bags', reorderLevel: 30, currentStock: 45, unitCost: 35, warehouseId: wTynBak.id },
    { itemCode: 'MAIZE-H', name: 'Harvested Maize (Bulk)', category: 'Crop', unit: 'Tonnes', reorderLevel: 0, currentStock: 850, unitCost: 280, warehouseId: wKwMainB.id },
  ];
  const items = [];
  for (const item of inventoryItems) {
    items.push(await prisma.inventoryItem.create({ data: item }));
  }

  // ─── FUEL TANKS ──────────────────────────────────────────────────────
  const fuelTankData = [
    { farmId: kwekweMain.id, tankCode: 'KW-TANK-D1', fuelType: 'Diesel', capacityLitres: 10000, currentLitres: 4500 },
    { farmId: kwekwe2.id, tankCode: 'KW2-TANK-D1', fuelType: 'Diesel', capacityLitres: 5000, currentLitres: 2100 },
    { farmId: mazoe.id, tankCode: 'MAZ-TANK-D1', fuelType: 'Diesel', capacityLitres: 5000, currentLitres: 3200 },
    { farmId: tynwald.id, tankCode: 'TYN-TANK-D1', fuelType: 'Diesel', capacityLitres: 20000, currentLitres: 14000 },
    { farmId: tynwald.id, tankCode: 'TYN-TANK-P1', fuelType: 'Petrol', capacityLitres: 15000, currentLitres: 9500 },
  ];
  const fuelTanks = [];
  for (const ft of fuelTankData) {
    fuelTanks.push(await prisma.fuelTank.create({ data: ft }));
  }

  // ─── CONTACTS ────────────────────────────────────────────────────────
  const contactData = [
    { name: 'Agricura Zimbabwe', contactType: 'Supplier', phone: '+263 242 700 000', email: 'sales@agricura.co.zw', address: 'Harare Industrial Sites' },
    { name: 'ZFC Limited', contactType: 'Supplier', phone: '+263 242 756 000', email: 'procurement@zfc.co.zw', address: '2 Lorraine Drive, Harare' },
    { name: 'SeedCo Zimbabwe', contactType: 'Supplier', phone: '+263 242 800 000', email: 'info@seedco.co.zw', address: 'Stapleford, Harare' },
    { name: 'Puma Energy Zimbabwe', contactType: 'Supplier', phone: '+263 242 302 000', email: 'zim@pumaenergy.com', address: 'Msasa, Harare' },
    { name: 'National Foods Ltd', contactType: 'Customer', phone: '+263 242 750 000', email: 'procurement@natfoods.co.zw', address: 'Willowvale, Harare' },
    { name: 'Grain Marketing Board', contactType: 'Customer', phone: '+263 242 661 000', email: 'grains@gmb.co.zw', address: 'Nazombe Silo, Harare' },
    { name: 'OK Zimbabwe Ltd', contactType: 'Customer', phone: '+263 242 630 000', email: 'buying@ok.co.zw', address: 'Harare CBD' },
    { name: 'CBZ Bank', contactType: 'Bank', phone: '+263 242 748 050', email: 'corporate@cbz.co.zw', address: 'CBZ Centre, Harare' },
    { name: 'FBC Bank', contactType: 'Bank', phone: '+263 242 700 800', email: 'business@fbc.co.zw', address: 'FBC Centre, Harare' },
    { name: 'Irvines Zimbabwe', contactType: 'Customer', phone: '+263 242 860 000', email: 'procurement@irvines.co.zw', address: 'Msasa, Harare' },
    { name: 'Willowton Group', contactType: 'Supplier', phone: '+27 33 327 0000', email: 'zim@willowton.co.za', address: 'Pietermaritzburg, SA', country: 'South Africa' },
  ];
  const contacts = [];
  for (const c of contactData) {
    contacts.push(await prisma.contact.create({ data: c }));
  }
  const [agricura, zfc, seedco, puma, natFoods, gmb, ok, cbz, fbc, irvines, willowton] = contacts;

  // ─── PURCHASE ORDERS ─────────────────────────────────────────────────
  const poData = [
    { poNumber: 'PO-2026-001', contactId: agricura.id, farmId: kwekweMain.id, status: 'Delivered', totalAmount: 12450, date: new Date('2026-05-10'), lines: [{ description: 'Glyphosate Herbicide 20L x 120 drums', quantity: 120, unitPrice: 65, totalPrice: 7800 }, { description: 'Chlorpyrifos Pesticide 5L x 168 cans', quantity: 168, unitPrice: 28, totalPrice: 4704 }] },
    { poNumber: 'PO-2026-002', contactId: zfc.id, farmId: kwekweMain.id, status: 'PendingApproval', totalAmount: 45000, date: new Date('2026-06-01'), lines: [{ description: 'Ammonium Nitrate 50kg x 900 bags', quantity: 900, unitPrice: 28, totalPrice: 25200 }, { description: 'Urea 50kg x 600 bags', quantity: 600, unitPrice: 32, totalPrice: 19200 }] },
    { poNumber: 'PO-2026-003', contactId: puma.id, farmId: kwekweMain.id, status: 'InTransit', totalAmount: 8280, date: new Date('2026-06-15'), lines: [{ description: 'Diesel Bulk x 6000L', quantity: 6000, unitPrice: 1.38, totalPrice: 8280 }] },
    { poNumber: 'PO-2026-004', contactId: seedco.id, farmId: kwekwe2.id, status: 'Approved', totalAmount: 7200, date: new Date('2026-06-10'), lines: [{ description: 'Barley Seed 50kg x 360 bags', quantity: 360, unitPrice: 20, totalPrice: 7200 }] },
    { poNumber: 'PO-2026-005', contactId: willowton.id, farmId: tynwald.id, status: 'Draft', totalAmount: 5880, date: new Date('2026-06-28'), lines: [{ description: 'Wheat Flour 50kg x 245 bags (Bakery)', quantity: 245, unitPrice: 24, totalPrice: 5880 }] },
    { poNumber: 'PO-2026-006', contactId: agricura.id, farmId: bikita.id, status: 'Delivered', totalAmount: 3850, date: new Date('2026-05-20'), lines: [{ description: 'Pig Grower Meal x 175 bags', quantity: 175, unitPrice: 22, totalPrice: 3850 }] },
  ];
  for (const po of poData) {
    const { lines, ...poFields } = po;
    const createdPO = await prisma.purchaseOrder.create({ data: poFields });
    for (const line of lines) {
      await prisma.pOLine.create({ data: { ...line, poId: createdPO.id } });
    }
  }

  // ─── SALES INVOICES ──────────────────────────────────────────────────
  const invoiceData = [
    { invoiceNumber: 'INV-10293', contactId: null, farmId: tynwald.id, outlet: 'Butchery', status: 'Paid', totalAmount: 245.50, date: new Date('2026-06-30'), lines: [{ description: 'Beef Mince 5kg', quantity: 5, unitPrice: 5.50, totalPrice: 27.50 }, { description: 'T-Bone Steak 1kg', quantity: 8, unitPrice: 8.00, totalPrice: 64.00 }, { description: 'Pork Ribs 2kg', quantity: 12, unitPrice: 4.50, totalPrice: 54.00 }, { description: 'Mixed Cuts 3kg', quantity: 20, unitPrice: 5.00, totalPrice: 100.00 }] },
    { invoiceNumber: 'INV-10294', contactId: natFoods.id, farmId: kwekweMain.id, outlet: 'Wholesale', status: 'AwaitingPayment', totalAmount: 78400, date: new Date('2026-06-25'), lines: [{ description: 'Wheat Grain (280 tonnes @ $280/t)', quantity: 280, unitPrice: 280, totalPrice: 78400 }] },
    { invoiceNumber: 'INV-10295', contactId: null, farmId: tynwald.id, outlet: 'FuelStation', status: 'Paid', totalAmount: 180.60, date: new Date('2026-06-30'), lines: [{ description: 'Diesel 120L', quantity: 120, unitPrice: 1.38, totalPrice: 165.60 }, { description: 'Petrol 10L', quantity: 10, unitPrice: 1.50, totalPrice: 15.00 }] },
    { invoiceNumber: 'INV-10296', contactId: gmb.id, farmId: kwekweMain.id, outlet: 'Wholesale', status: 'AwaitingPayment', totalAmount: 238000, date: new Date('2026-06-20'), lines: [{ description: 'Maize Grain (850 tonnes @ $280/t)', quantity: 850, unitPrice: 280, totalPrice: 238000 }] },
    { invoiceNumber: 'INV-10297', contactId: null, farmId: tynwald.id, outlet: 'Bakery', status: 'Paid', totalAmount: 648, date: new Date('2026-06-29'), lines: [{ description: 'Bread Loaf 800g x 720', quantity: 720, unitPrice: 0.90, totalPrice: 648 }] },
    { invoiceNumber: 'INV-10298', contactId: null, farmId: tynwald.id, outlet: 'Bar', status: 'Paid', totalAmount: 890, date: new Date('2026-06-28'), lines: [{ description: 'Beverages & Bar Sales', quantity: 1, unitPrice: 890, totalPrice: 890 }] },
    { invoiceNumber: 'INV-10299', contactId: ok.id, farmId: kwekwe2.id, outlet: 'Wholesale', status: 'Sent', totalAmount: 25200, date: new Date('2026-06-15'), lines: [{ description: 'Maize 90 tonnes', quantity: 90, unitPrice: 280, totalPrice: 25200 }] },
    { invoiceNumber: 'INV-10300', contactId: irvines.id, farmId: bikita.id, outlet: 'Wholesale', status: 'Paid', totalAmount: 15000, date: new Date('2026-06-10'), lines: [{ description: 'Sorghum Grain 60t @ $250/t', quantity: 60, unitPrice: 250, totalPrice: 15000 }] },
  ];
  for (const inv of invoiceData) {
    const { lines, ...invFields } = inv;
    const createdInv = await prisma.salesInvoice.create({ data: invFields });
    for (const line of lines) {
      await prisma.invoiceLine.create({ data: { ...line, invoiceId: createdInv.id } });
    }
  }

  // ─── COSTS ───────────────────────────────────────────────────────────
  const categories = ['Fuel', 'Seed', 'Fertilizer', 'Labour', 'Chemicals', 'Veterinary', 'Maintenance', 'Electricity', 'Irrigation', 'Transport'];
  const businessUnits = ['Butchery', 'Bar', 'FuelStation', 'Bakery', 'Retail'];
  const costDescriptions = {
    Fuel: ['Diesel for tractors', 'Generator fuel', 'Diesel for irrigation pumps', 'Vehicle fuel'],
    Seed: ['Maize seed purchase', 'Wheat seed purchase', 'Soya bean seed purchase', 'Barley seed purchase'],
    Fertilizer: ['Ammonium nitrate application', 'Urea top dressing', 'Compound D basal dressing'],
    Labour: ['Monthly farm wages', 'Contract labour - land prep', 'Contract labour - harvesting', 'Casual workers - weeding'],
    Chemicals: ['Herbicide application', 'Pesticide spraying', 'Fungicide treatment'],
    Veterinary: ['Cattle dipping', 'Vaccination programme', 'Veterinary fees', 'Animal feed supplement'],
    Maintenance: ['Tractor service', 'Irrigation pipe repair', 'Borehole pump overhaul', 'Workshop repairs'],
    Electricity: ['ZESA electricity bill', 'Electricity - irrigation', 'Electricity - cold storage'],
    Irrigation: ['Pivot irrigation costs', 'Drip line maintenance', 'Water abstraction fees'],
    Transport: ['Grain transport to GMB', 'Livestock transport', 'Input delivery'],
  };

  for (const farm of farms) {
    const farmCrops = allCrops[farm.id] || [];
    const farmBatches = batches.filter(b => b.farmId === farm.id);
    for (let i = 0; i < 30; i++) {
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const descs = costDescriptions[cat];
      const desc = descs[Math.floor(Math.random() * descs.length)];
      const isShared = Math.random() > 0.55;
      const isCrop = !isShared && farmCrops.length > 0 && Math.random() > 0.4;
      const isLivestock = !isShared && !isCrop && farmBatches.length > 0 && Math.random() > 0.5;
      const isBusinessUnit = !isShared && !isCrop && !isLivestock && farm.id === tynwald.id;
      const randomCrop = isCrop ? farmCrops[Math.floor(Math.random() * farmCrops.length)] : null;
      const randomBatch = isLivestock ? farmBatches[Math.floor(Math.random() * farmBatches.length)] : null;
      const randomUnit = isBusinessUnit ? businessUnits[Math.floor(Math.random() * businessUnits.length)] : null;
      const dateDaysAgo = Math.floor(Math.random() * 180);
      await prisma.cost.create({
        data: {
          amount: Math.floor(Math.random() * 4500) + 100,
          description: desc,
          category: cat,
          farmId: farm.id,
          cropId: randomCrop?.id || null,
          livestockBatchId: randomBatch?.id || null,
          businessUnit: randomUnit,
          date: new Date(now.getTime() - dateDaysAgo * 86400000),
        }
      });
    }
  }

  // ─── FIXED ASSETS ────────────────────────────────────────────────────
  const assetData = [
    { assetTag: 'TRAC-001', name: 'John Deere 5075E Tractor', category: 'Machinery', farmId: kwekweMain.id, purchaseDate: new Date('2022-03-15'), purchaseCost: 45000, usefulLifeYears: 10, residualValue: 4500, status: 'Operational' },
    { assetTag: 'TRAC-002', name: 'Massey Ferguson 290 Tractor', category: 'Machinery', farmId: mazoe.id, purchaseDate: new Date('2019-08-20'), purchaseCost: 22000, usefulLifeYears: 10, residualValue: 2200, status: 'InMaintenance' },
    { assetTag: 'TRAC-003', name: 'Case IH JX75 Tractor', category: 'Machinery', farmId: kwekwe2.id, purchaseDate: new Date('2023-01-10'), purchaseCost: 38000, usefulLifeYears: 10, residualValue: 3800, status: 'Operational' },
    { assetTag: 'VEH-001', name: 'Toyota Hilux GD6 (Manager)', category: 'Vehicle', farmId: kwekweMain.id, purchaseDate: new Date('2023-05-01'), purchaseCost: 42000, usefulLifeYears: 5, residualValue: 10000, status: 'Operational' },
    { assetTag: 'VEH-002', name: 'Isuzu NPR Truck (10-ton)', category: 'Vehicle', farmId: kwekweMain.id, purchaseDate: new Date('2021-09-12'), purchaseCost: 55000, usefulLifeYears: 8, residualValue: 8000, status: 'Operational' },
    { assetTag: 'VEH-003', name: 'Toyota Land Cruiser 79 Series', category: 'Vehicle', farmId: chiredzi.id, purchaseDate: new Date('2022-11-30'), purchaseCost: 62000, usefulLifeYears: 8, residualValue: 12000, status: 'InMaintenance' },
    { assetTag: 'MILL-001', name: 'Hammer Mill - Grain Processing', category: 'Machinery', farmId: tynwald.id, purchaseDate: new Date('2020-06-01'), purchaseCost: 125000, usefulLifeYears: 15, residualValue: 15000, status: 'Operational' },
    { assetTag: 'IRRIG-001', name: 'Centre Pivot Irrigation System', category: 'Equipment', farmId: chiredzi.id, purchaseDate: new Date('2021-02-14'), purchaseCost: 85000, usefulLifeYears: 20, residualValue: 10000, status: 'Operational' },
    { assetTag: 'IRRIG-002', name: 'Drip Irrigation System - Mazoe', category: 'Equipment', farmId: mazoe.id, purchaseDate: new Date('2022-07-20'), purchaseCost: 32000, usefulLifeYears: 15, residualValue: 3000, status: 'Operational' },
    { assetTag: 'BAKERY-001', name: 'Industrial Deck Oven', category: 'Equipment', farmId: tynwald.id, purchaseDate: new Date('2023-04-01'), purchaseCost: 18000, usefulLifeYears: 10, residualValue: 2000, status: 'Operational' },
    { assetTag: 'COLD-001', name: 'Cold Room Unit - Butchery', category: 'Equipment', farmId: tynwald.id, purchaseDate: new Date('2023-02-15'), purchaseCost: 25000, usefulLifeYears: 12, residualValue: 3000, status: 'Operational' },
    { assetTag: 'PUMP-001', name: 'Submersible Borehole Pump', category: 'Equipment', farmId: bikita.id, purchaseDate: new Date('2020-09-01'), purchaseCost: 8500, usefulLifeYears: 8, residualValue: 500, status: 'Operational' },
  ];
  for (const a of assetData) {
    await prisma.fixedAsset.create({ data: a });
  }

  // ─── BANK ACCOUNTS ───────────────────────────────────────────────────
  const bankData = [
    { farmId: kwekweMain.id, bankName: 'CBZ Bank', accountNumber: 'CBZ-0012345600', currency: 'USD', balance: 85000 },
    { farmId: kwekweMain.id, bankName: 'FBC Bank', accountNumber: 'FBC-0087654300', currency: 'USD', balance: 22500 },
    { farmId: tynwald.id, bankName: 'CBZ Bank', accountNumber: 'CBZ-0098765400', currency: 'USD', balance: 14200 },
    { farmId: kwekwe2.id, bankName: 'CBZ Bank', accountNumber: 'CBZ-0056781200', currency: 'USD', balance: 8900 },
  ];
  const bankAccounts = [];
  for (const b of bankData) {
    bankAccounts.push(await prisma.bankAccount.create({ data: b }));
  }

  // Bank transactions (recent)
  const txDescriptions = ['Supplier payment - ZFC', 'Customer receipt - National Foods', 'Payroll disbursement', 'Fuel delivery payment', 'Sale proceeds - Maize', 'ZESA electricity bill', 'NSSA remittance', 'ZIMRA PAYE remittance'];
  for (const acct of bankAccounts) {
    for (let i = 0; i < 8; i++) {
      const isReceipt = Math.random() > 0.45;
      await prisma.bankTransaction.create({
        data: {
          accountId: acct.id,
          txType: isReceipt ? 'Receipt' : 'Payment',
          amount: Math.floor(Math.random() * 25000) + 500,
          description: txDescriptions[Math.floor(Math.random() * txDescriptions.length)],
          date: new Date(now.getTime() - Math.random() * 5184000000)
        }
      });
    }
  }

  // ─── INTER-FARM LOANS ────────────────────────────────────────────────
  await prisma.interFarmLoan.create({ data: { lenderFarmId: kwekweMain.id, borrowerFarmId: bikita.id, amount: 25000, outstanding: 18000, purpose: 'Piggery expansion capital', dueDate: new Date('2026-12-31'), status: 'Active' } });
  await prisma.interFarmLoan.create({ data: { lenderFarmId: kwekweMain.id, borrowerFarmId: mazoe.id, amount: 15000, outstanding: 0, purpose: 'Irrigation system installation', status: 'Repaid' } });
  await prisma.interFarmLoan.create({ data: { lenderFarmId: tynwald.id, borrowerFarmId: kwekwe2.id, amount: 12000, outstanding: 8500, purpose: 'Planting inputs - 2025/26 season', dueDate: new Date('2026-09-30'), status: 'Active' } });

  // ─── BUDGETS ─────────────────────────────────────────────────────────
  const budgetCats = ['Labour', 'Seed', 'Fertilizer', 'Fuel', 'Chemicals', 'Maintenance'];
  for (const farm of farms) {
    for (const cat of budgetCats) {
      const budget = Math.floor(Math.random() * 40000) + 5000;
      await prisma.budget.create({ data: { farmId: farm.id, year: 2026, category: cat, budgetAmount: budget, actualAmount: Math.floor(budget * (0.4 + Math.random() * 0.5)) } });
    }
  }

  // ─── PAYROLL (last 3 months) ──────────────────────────────────────────
  const payrollMonths = ['2026-04', '2026-05', '2026-06'];
  for (const month of payrollMonths) {
    let totalGross = 0, totalPaye = 0, totalNssa = 0, totalNet = 0;
    const lineData = [];
    for (const emp of allStaff) {
      const gross = emp.salary;
      const nssa = Math.min(gross * 0.045, 57.33);
      // Zimbabwe PAYE simplified brackets (USD)
      let paye = 0;
      if (gross > 100) {
        if (gross <= 300) paye = (gross - 100) * 0.20;
        else if (gross <= 700) paye = 40 + (gross - 300) * 0.25;
        else if (gross <= 1000) paye = 140 + (gross - 700) * 0.30;
        else paye = 230 + (gross - 1000) * 0.35;
      }
      const net = gross - paye - nssa;
      totalGross += gross; totalPaye += paye; totalNssa += nssa; totalNet += net;
      lineData.push({ staffId: emp.id, grossSalary: gross, paye: Math.round(paye * 100) / 100, nssa: Math.round(nssa * 100) / 100, netSalary: Math.round(net * 100) / 100, month });
    }
    const payroll = await prisma.payroll.create({ data: { month, totalGross: Math.round(totalGross * 100) / 100, totalPaye: Math.round(totalPaye * 100) / 100, totalNssa: Math.round(totalNssa * 100) / 100, totalNet: Math.round(totalNet * 100) / 100 } });
    for (const line of lineData) {
      await prisma.payrollLine.create({ data: { ...line, payrollId: payroll.id } });
    }
  }

  // ─── BOM (BAKERY) ────────────────────────────────────────────────────
  const flourItem = items.find(i => i.itemCode === 'FLOUR-WH');
  const sugarItem = items.find(i => i.itemCode === 'SUGAR-WH');
  if (flourItem && sugarItem) {
    const bom = await prisma.billOfMaterials.create({ data: { productName: 'Bread Loaf 800g', unit: 'Loaf', batchSize: 100 } });
    await prisma.bOMLine.create({ data: { bomId: bom.id, itemId: flourItem.id, quantity: 60, unit: 'Kg' } });
    await prisma.bOMLine.create({ data: { bomId: bom.id, itemId: sugarItem.id, quantity: 1.5, unit: 'Kg' } });

    await prisma.productionOrder.create({ data: { bomId: bom.id, quantity: 500, status: 'Complete', date: new Date('2026-06-28'), costPerUnit: 0.65 } });
    await prisma.productionOrder.create({ data: { bomId: bom.id, quantity: 720, status: 'Complete', date: new Date('2026-06-29'), costPerUnit: 0.65 } });
    await prisma.productionOrder.create({ data: { bomId: bom.id, quantity: 800, status: 'InProgress', date: new Date('2026-07-01'), costPerUnit: null } });
  }

  console.log('✅ Pricabe Enterprises ERP seed complete!');
  console.log(`   - ${farms.length} farms/locations`);
  console.log(`   - ${Object.values(allCrops).flat().length} crop fields`);
  console.log(`   - ${cycles.length} crop cycles`);
  console.log(`   - ${batches.length} livestock batches`);
  console.log(`   - ${allStaff.length} staff members`);
  console.log(`   - ${warehouses.length} warehouses, ${inventoryItems.length} stock items`);
  console.log(`   - ${assetData.length} fixed assets`);
  console.log(`   - 3 months of payroll data`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
