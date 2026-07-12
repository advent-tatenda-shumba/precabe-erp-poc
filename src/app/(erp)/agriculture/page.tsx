import { prisma } from "@/lib/prisma";
import { NewCropCycleButton, LogActivityButton } from "./AgricultureForms";

export const dynamic = "force-dynamic";

function stageBadge(stage: string) {
  const map: Record<string, string> = {
    Planting: "badge-blue",
    Growing: "badge-green",
    Harvesting: "badge-orange",
    Complete: "badge-gray",
  };
  return map[stage] ?? "badge-gray";
}

export default async function Agriculture() {
  const cycles = await prisma.cropCycle.findMany({
    include: { farm: true, crop: true, costs: true },
    orderBy: { plantingDate: "desc" },
  });
  
  const farms = await prisma.farm.findMany({ select: { id: true, name: true } });
  const crops = await prisma.crop.findMany({ select: { id: true, name: true, farmId: true } });
  const agriculturalInputs = await prisma.inventoryItem.findMany({
    where: { category: "Agricultural Inputs", currentStock: { gt: 0 } },
    select: { id: true, name: true, currentStock: true, unit: true }
  });

  const totalHectares = cycles.reduce((a, c) => a + c.hectaresPlanted, 0);
  const activeCycles = cycles.filter((c) => c.stage !== "Complete").length;
  const completedCycles = cycles.filter((c) => c.stage === "Complete");
  const totalYield = completedCycles.reduce((a, c) => a + (c.yieldTonnes ?? 0), 0);

  return (
    <div>
      <div className="page-header">
        <h2>Agriculture Management</h2>
        <p>Track crop cycles from planting through harvest across all farms.</p>
      </div>

      {/* Summary */}
      <div className="stat-row">
        <div className="stat-block">
          <div className="stat-label">Total Cycles</div>
          <div className="stat-value">{cycles.length}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Active Cycles</div>
          <div className="stat-value" style={{ color: "var(--accent-color)" }}>{activeCycles}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Total Hectares</div>
          <div className="stat-value">{totalHectares.toLocaleString()}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Total Yield</div>
          <div className="stat-value">{totalYield.toLocaleString()}t</div>
        </div>
      </div>

      {/* Active Crop Cycles */}
      <div className="card">
        <div className="card-header">
          <h3>Active Crop Cycles</h3>
          <NewCropCycleButton farms={farms} crops={crops} />
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Farm</th>
                <th>Crop</th>
                <th>Season</th>
                <th>Hectares</th>
                <th>Planted</th>
                <th>Expected Harvest</th>
                <th>Stage</th>
                <th>Costs (USD)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cycles
                .filter((c) => c.stage !== "Complete")
                .map((cycle) => {
                  const totalCosts = cycle.costs.reduce((a, c) => a + c.amount, 0);
                  return (
                    <tr key={cycle.id}>
                      <td><span className="farm-tag">{cycle.farm.name.split(" ")[0]}</span></td>
                      <td><strong>{cycle.crop.name}</strong></td>
                      <td>{cycle.season}</td>
                      <td>{cycle.hectaresPlanted}</td>
                      <td>{new Date(cycle.plantingDate).toLocaleDateString("en-ZW")}</td>
                      <td>{cycle.expectedHarvestDate ? new Date(cycle.expectedHarvestDate).toLocaleDateString("en-ZW") : "—"}</td>
                      <td>
                        <span className={`badge ${stageBadge(cycle.stage)}`}>{cycle.stage}</span>
                      </td>
                      <td>${totalCosts.toLocaleString()}</td>
                      <td>
                        <LogActivityButton cycleId={cycle.id} inventoryItems={agriculturalInputs} />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completed Cycles — Yield Analysis */}
      {completedCycles.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3>Completed Cycles — Yield & Profitability</h3>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Farm</th>
                  <th>Crop</th>
                  <th>Season</th>
                  <th>Hectares</th>
                  <th>Yield (t)</th>
                  <th>t / ha</th>
                  <th>Total Cost</th>
                  <th>Cost / ha</th>
                  <th>Cost / tonne</th>
                </tr>
              </thead>
              <tbody>
                {completedCycles.map((cycle) => {
                  const totalCosts = cycle.costs.reduce((a, c) => a + c.amount, 0);
                  const yield_ = cycle.yieldTonnes ?? 0;
                  const yieldPerHa = yield_ / cycle.hectaresPlanted;
                  const costPerHa = totalCosts / cycle.hectaresPlanted;
                  const costPerTonne = yield_ > 0 ? totalCosts / yield_ : 0;
                  return (
                    <tr key={cycle.id}>
                      <td><span className="farm-tag">{cycle.farm.name.split(" ")[0]}</span></td>
                      <td><strong>{cycle.crop.name}</strong></td>
                      <td>{cycle.season}</td>
                      <td>{cycle.hectaresPlanted}</td>
                      <td><strong>{yield_.toLocaleString()}</strong></td>
                      <td>{yieldPerHa.toFixed(2)}</td>
                      <td>${totalCosts.toLocaleString()}</td>
                      <td>${costPerHa.toFixed(2)}</td>
                      <td>${costPerTonne.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
