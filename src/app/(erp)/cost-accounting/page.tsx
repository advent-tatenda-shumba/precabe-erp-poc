import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CostAccounting() {
  const farms = await prisma.farm.findMany({
    include: {
      crops: true,
      costs: true,
      livestock: { include: { costs: true } },
      staff: true,
    },
    orderBy: { id: "asc" },
  });

  const grandTotal = farms.reduce((a, f) => a + f.costs.reduce((x, c) => x + c.amount, 0), 0);
  const businessUnits = ["Butchery", "Bar", "FuelStation", "Bakery", "Retail"];

  return (
    <div>
      <div className="page-header">
        <h2>Cost Accounting</h2>
        <p>Multi-dimensional cost analysis — per farm, crop, livestock batch, and business unit.</p>
      </div>

      <div className="stat-row">
        <div className="stat-block">
          <div className="stat-label">Total Costs</div>
          <div className="stat-value">${grandTotal.toLocaleString()}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Farms</div>
          <div className="stat-value">{farms.length}</div>
        </div>
      </div>

      {farms.map((farm) => {
        const sharedCosts = farm.costs.filter((c) => !c.cropId && !c.livestockBatchId && !c.businessUnit);
        const totalShared = sharedCosts.reduce((a, c) => a + c.amount, 0);
        const totalHectares = farm.crops.reduce((a, c) => a + c.hectares, 0);
        const farmTotal = farm.costs.reduce((a, c) => a + c.amount, 0);

        const buCosts = businessUnits.map((bu) => ({
          name: bu,
          amount: farm.costs.filter((c) => c.businessUnit === bu).reduce((a, c) => a + c.amount, 0),
        })).filter((b) => b.amount > 0);

        return (
          <div key={farm.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <h3>{farm.name}</h3>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{farm.location}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--accent-color)" }}>${farmTotal.toLocaleString()}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Total Farm Costs</div>
              </div>
            </div>

            {/* Crop costs */}
            {farm.crops.length > 0 && (
              <>
                <h4 style={{ marginBottom: "0.75rem", fontSize: "0.9rem" }}> Crop-Level Profitability</h4>
                <div className="table-responsive" style={{ marginBottom: "1rem" }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Crop</th>
                        <th>Hectares</th>
                        <th>Direct Costs</th>
                        <th>Allocated Shared</th>
                        <th>Total Cost</th>
                        <th>Cost / Ha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {farm.crops.map((crop) => {
                        const direct = farm.costs.filter((c) => c.cropId === crop.id).reduce((a, c) => a + c.amount, 0);
                        const allocated = totalHectares > 0 ? (crop.hectares / totalHectares) * totalShared : 0;
                        const total = direct + allocated;
                        const perHa = crop.hectares > 0 ? total / crop.hectares : 0;
                        return (
                          <tr key={crop.id}>
                            <td><strong>{crop.name}</strong></td>
                            <td>{crop.hectares}</td>
                            <td>${direct.toLocaleString()}</td>
                            <td>${allocated.toFixed(0)}</td>
                            <td><strong>${total.toFixed(0)}</strong></td>
                            <td><strong>${perHa.toFixed(2)}</strong></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Livestock costs */}
            {farm.livestock.length > 0 && (
              <>
                <h4 style={{ marginBottom: "0.75rem", fontSize: "0.9rem" }}> Livestock Costs</h4>
                <div className="table-responsive" style={{ marginBottom: "1rem" }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Batch</th>
                        <th>Species</th>
                        <th>Head Count</th>
                        <th>Total Costs</th>
                        <th>Cost / Head</th>
                      </tr>
                    </thead>
                    <tbody>
                      {farm.livestock.map((b) => {
                        const total = b.costs.reduce((a, c) => a + c.amount, 0);
                        return (
                          <tr key={b.id}>
                            <td><strong>{b.batchCode}</strong></td>
                            <td>{b.species}</td>
                            <td>{b.headCount}</td>
                            <td>${total.toLocaleString()}</td>
                            <td>${b.headCount > 0 ? (total / b.headCount).toFixed(2) : "0.00"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Business unit costs */}
            {buCosts.length > 0 && (
              <>
                <h4 style={{ marginBottom: "0.75rem", fontSize: "0.9rem" }}> Business Unit Costs</h4>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                  {buCosts.map((b) => (
                    <div key={b.name} style={{ background: "var(--accent-light)", borderRadius: 10, padding: "0.75rem 1rem", minWidth: 120 }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--accent-color)", fontWeight: 700 }}>{b.name}</div>
                      <div style={{ fontSize: "1rem", fontWeight: 800 }}>${b.amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Shared costs summary */}
            <div style={{ background: "var(--input-bg)", borderRadius: 10, padding: "0.75rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 600 }}>Shared / Unallocated Overhead</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Fuel, Maintenance, Electricity, Labour</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--warning)" }}>${totalShared.toLocaleString()}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
