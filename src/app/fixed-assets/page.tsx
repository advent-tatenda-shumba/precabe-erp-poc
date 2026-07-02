import { prisma } from "@/lib/prisma";
import { RegisterAssetButton } from "./AssetForms";

export const dynamic = "force-dynamic";

function calcDepreciation(asset: {
  purchaseCost: number;
  residualValue: number;
  usefulLifeYears: number;
  purchaseDate: Date;
}) {
  const annualDep = (asset.purchaseCost - asset.residualValue) / asset.usefulLifeYears;
  const yearsOwned = (Date.now() - new Date(asset.purchaseDate).getTime()) / (365.25 * 24 * 3600 * 1000);
  const accumulated = Math.min(annualDep * yearsOwned, asset.purchaseCost - asset.residualValue);
  const bookValue = asset.purchaseCost - accumulated;
  return { annualDep, accumulated, bookValue };
}

const categoryIcon: Record<string, string> = {
  Vehicle: "🚗", Machinery: "⚙️", Equipment: "🔧", Land: "🏞️", Building: "🏠",
};

export default async function FixedAssets() {
  const assets = await prisma.fixedAsset.findMany({
    include: { farm: true },
    orderBy: [{ category: "asc" }, { assetTag: "asc" }],
  });
  const farms = await prisma.farm.findMany({ select: { id: true, name: true } });

  const totalCost = assets.reduce((a, x) => a + x.purchaseCost, 0);
  const totalBookValue = assets.reduce((a, x) => a + calcDepreciation(x).bookValue, 0);
  const maintenance = assets.filter((a) => a.status === "InMaintenance").length;

  const byCategory = [...new Set(assets.map((a) => a.category))].map((cat) => ({
    cat, items: assets.filter((a) => a.category === cat),
  }));

  return (
    <div>
      <div className="page-header">
        <h2>Fixed Assets Register</h2>
        <p>Track all major assets with straight-line depreciation, status, and farm allocation.</p>
      </div>

      <div className="stat-row">
        <div className="stat-block">
          <div className="stat-label">Total Assets</div>
          <div className="stat-value">{assets.length}</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Purchase Cost</div>
          <div className="stat-value">${(totalCost / 1000).toFixed(0)}k</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Net Book Value</div>
          <div className="stat-value">${(totalBookValue / 1000).toFixed(0)}k</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">In Maintenance</div>
          <div className="stat-value" style={{ color: maintenance > 0 ? "var(--warning)" : "inherit" }}>{maintenance}</div>
        </div>
      </div>

      {byCategory.map(({ cat, items }) => (
        <div key={cat} className="card">
          <div className="card-header">
            <h3>{categoryIcon[cat] ?? "📦"} {cat}</h3>
            <RegisterAssetButton farms={farms} />
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Asset Tag</th>
                  <th>Description</th>
                  <th>Farm</th>
                  <th>Purchase Date</th>
                  <th>Cost (USD)</th>
                  <th>Annual Dep.</th>
                  <th>Accumulated Dep.</th>
                  <th>Book Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((asset) => {
                  const { annualDep, accumulated, bookValue } = calcDepreciation(asset);
                  const depPct = Math.round((accumulated / (asset.purchaseCost - asset.residualValue)) * 100);
                  return (
                    <tr key={asset.id}>
                      <td><code style={{ fontSize: "0.78rem" }}>{asset.assetTag}</code></td>
                      <td><strong>{asset.name}</strong></td>
                      <td><span className="farm-tag">{asset.farm.name.split(" ")[0]}</span></td>
                      <td>{new Date(asset.purchaseDate).toLocaleDateString("en-ZW")}</td>
                      <td>${asset.purchaseCost.toLocaleString()}</td>
                      <td>${annualDep.toFixed(0)}/yr</td>
                      <td>
                        ${accumulated.toFixed(0)}
                        <div className="progress-bar-wrap" style={{ marginTop: "4px", width: "80px" }}>
                          <div className={`progress-bar-fill ${depPct > 75 ? "red" : depPct > 50 ? "orange" : "green"}`} style={{ width: `${depPct}%` }} />
                        </div>
                      </td>
                      <td><strong>${bookValue.toFixed(0)}</strong></td>
                      <td>
                        <span className={`badge ${asset.status === "Operational" ? "badge-green" : asset.status === "InMaintenance" ? "badge-orange" : "badge-red"}`}>
                          {asset.status === "InMaintenance" ? "In Maintenance" : asset.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
