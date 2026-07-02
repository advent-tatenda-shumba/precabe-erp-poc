import { prisma } from "@/lib/prisma";
import { NewBatchButton, LogEventButton } from "./LivestockForms";

export const dynamic = "force-dynamic";

const speciesIcon: Record<string, string> = {
  Cattle: "🐄", Goats: "🐐", Sheep: "🐑", Pigs: "🐷",
};

export default async function Livestock() {
  const batches = await prisma.livestockBatch.findMany({
    include: { farm: true, events: { orderBy: { date: "desc" }, take: 10 }, costs: true },
    orderBy: { farmId: "asc" },
  });
  
  const farms = await prisma.farm.findMany({ select: { id: true, name: true } });

  const totalHeads = batches.reduce((a, b) => a + b.headCount, 0);
  const totalLivestockCosts = batches.reduce((a, b) => a + b.costs.reduce((x, c) => x + c.amount, 0), 0);

  const speciesCount: Record<string, number> = {};
  for (const b of batches) {
    speciesCount[b.species] = (speciesCount[b.species] ?? 0) + b.headCount;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Livestock Management</h2>
        <p>Herd/batch tracking — births, deaths, purchases, sales, and cost accumulation per group.</p>
      </div>

      {/* Summary */}
      <div className="stat-row">
        <div className="stat-block">
          <div className="stat-label">Total Head</div>
          <div className="stat-value">{totalHeads.toLocaleString()}</div>
        </div>
        {Object.entries(speciesCount).map(([sp, count]) => (
          <div key={sp} className="stat-block">
            <div className="stat-label">{speciesIcon[sp]} {sp}</div>
            <div className="stat-value">{count}</div>
          </div>
        ))}
        <div className="stat-block">
          <div className="stat-label">Total Costs</div>
          <div className="stat-value" style={{ color: "var(--warning)" }}>${totalLivestockCosts.toLocaleString()}</div>
        </div>
      </div>

      {/* Batches */}
      <div className="card">
        <div className="card-header">
          <h3>Livestock Batches</h3>
          <NewBatchButton farms={farms} />
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Batch Code</th>
                <th>Farm</th>
                <th>Species</th>
                <th>Purpose</th>
                <th>Head Count</th>
                <th>Total Costs</th>
                <th>Cost / Head</th>
                <th>Recent Events</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => {
                const batchCosts = batch.costs.reduce((a, c) => a + c.amount, 0);
                const costPerHead = batch.headCount > 0 ? batchCosts / batch.headCount : 0;
                const lastEvent = batch.events[0];
                return (
                  <tr key={batch.id}>
                    <td><strong>{batch.batchCode}</strong></td>
                    <td><span className="farm-tag">{batch.farm.name.split(" ")[0]}</span></td>
                    <td>{speciesIcon[batch.species]} {batch.species}</td>
                    <td>
                      <span className={`badge ${batch.purpose === "Fattening" ? "badge-orange" : "badge-green"}`}>
                        {batch.purpose}
                      </span>
                    </td>
                    <td><strong>{batch.headCount}</strong></td>
                    <td>${batchCosts.toLocaleString()}</td>
                    <td>${costPerHead.toFixed(2)}</td>
                    <td>
                      {lastEvent ? (
                        <span className={`badge ${lastEvent.eventType === "Birth" ? "badge-green" : lastEvent.eventType === "Death" ? "badge-red" : lastEvent.eventType === "Sale" ? "badge-blue" : "badge-orange"}`}>
                          {lastEvent.eventType}: {lastEvent.quantity}
                        </span>
                      ) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Events */}
      <div className="card">
        <div className="card-header">
          <h3>Herd Event Log</h3>
          <LogEventButton batches={batches} />
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Batch</th>
                <th>Farm</th>
                <th>Event</th>
                <th>Quantity</th>
                <th>Unit Value</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {batches.flatMap((b) =>
                b.events.map((ev) => ({ ...ev, batch: b }))
              )
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 20)
                .map((ev) => (
                  <tr key={ev.id}>
                    <td>{new Date(ev.date).toLocaleDateString("en-ZW")}</td>
                    <td><strong>{ev.batch.batchCode}</strong></td>
                    <td><span className="farm-tag">{ev.batch.farm.name.split(" ")[0]}</span></td>
                    <td>
                      <span className={`badge ${ev.eventType === "Birth" ? "badge-green" : ev.eventType === "Death" ? "badge-red" : ev.eventType === "Sale" ? "badge-blue" : "badge-orange"}`}>
                        {ev.eventType}
                      </span>
                    </td>
                    <td>{ev.quantity} head</td>
                    <td>{ev.unitValue ? `$${ev.unitValue.toFixed(2)}` : "—"}</td>
                    <td style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>{ev.notes ?? "—"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
