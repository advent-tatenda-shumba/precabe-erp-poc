import { prisma } from "@/lib/prisma";
import { NewInvoiceButton } from "./SalesForms";

export const dynamic = "force-dynamic";

const invStatusConfig: Record<string, { cls: string }> = {
  Draft:          { cls: "badge-gray" },
  Sent:           { cls: "badge-blue" },
  Paid:           { cls: "badge-green" },
  AwaitingPayment:{ cls: "badge-orange" },
  Overdue:        { cls: "badge-red" },
};

const outletIcon: Record<string, string> = {
  Butchery: "", Retail: "", Bar: "", FuelStation: "", Wholesale: "", Bakery: "", Farm: "",
};

export default async function Sales() {
  const [invoices, farms, contacts] = await Promise.all([
    prisma.salesInvoice.findMany({
      include: { contact: true, farm: true, lines: true },
      orderBy: { date: "desc" },
    }),
    prisma.farm.findMany(),
    prisma.contact.findMany({ where: { contactType: "Customer" }, orderBy: { name: "asc" } }),
  ]);

  const totalRevenue = invoices.reduce((a, i) => a + i.totalAmount, 0);
  const paidRevenue = invoices.filter(i => i.status === "Paid").reduce((a, i) => a + i.totalAmount, 0);
  const outstanding = invoices.filter(i => i.status === "AwaitingPayment").reduce((a, i) => a + i.totalAmount, 0);

  const outletBreakdown: Record<string, number> = {};
  for (const inv of invoices) {
    outletBreakdown[inv.outlet] = (outletBreakdown[inv.outlet] ?? 0) + inv.totalAmount;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Sales & Revenue</h2>
        <p>Track wholesale, retail, POS, and farm gate sales across all outlets.</p>
      </div>

      {/* Summary */}
      <div className="stat-row">
        <div className="stat-block">
          <div className="stat-label">Total Invoiced</div>
          <div className="stat-value">${(totalRevenue / 1000).toFixed(0)}k</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Collected</div>
          <div className="stat-value" style={{ color: "var(--success)" }}>${(paidRevenue / 1000).toFixed(0)}k</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Outstanding</div>
          <div className="stat-value" style={{ color: "var(--warning)" }}>${(outstanding / 1000).toFixed(0)}k</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Invoices</div>
          <div className="stat-value">{invoices.length}</div>
        </div>
      </div>

      {/* Outlet Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {Object.entries(outletBreakdown).map(([outlet, amount]) => (
          <div key={outlet} className="card" style={{ marginBottom: 0, textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{outletIcon[outlet] ?? ""}</div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>{outlet}</div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-color)' }}>${amount.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Invoice Table */}
      <div className="card">
        <div className="card-header">
          <h3>Recent Invoices</h3>
          <NewInvoiceButton contacts={contacts} farms={farms} />
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Farm</th>
                <th>Outlet</th>
                <th>Date</th>
                <th>Amount (USD)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const cfg = invStatusConfig[inv.status] ?? { cls: "badge-gray" };
                return (
                  <tr key={inv.id}>
                    <td><strong>{inv.invoiceNumber}</strong></td>
                    <td>{inv.contact?.name ?? <span style={{ color: "var(--text-secondary)" }}>Walk-in</span>}</td>
                    <td><span className="farm-tag">{inv.farm.name.split(" ")[0]}</span></td>
                    <td>{outletIcon[inv.outlet]} {inv.outlet}</td>
                    <td>{new Date(inv.date).toLocaleDateString("en-ZW")}</td>
                    <td><strong>${inv.totalAmount.toLocaleString()}</strong></td>
                    <td><span className={`badge ${cfg.cls}`}>{inv.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
