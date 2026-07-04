import { prisma } from "@/lib/prisma";
import { AddContactButton } from "../address-book/ContactForms";

export const dynamic = "force-dynamic";

export default async function CRM() {
  const [customers, invoices] = await Promise.all([
    prisma.contact.findMany({ where: { contactType: "Customer" }, orderBy: { name: "asc" } }),
    prisma.salesInvoice.findMany({ include: { contact: true, farm: true }, orderBy: { date: "desc" } }),
  ]);

  const customerRevenue = customers.map((c) => ({
    ...c,
    revenue: invoices.filter((i) => i.contactId === c.id).reduce((a, i) => a + i.totalAmount, 0),
    invoiceCount: invoices.filter((i) => i.contactId === c.id).length,
    lastInvoice: invoices.filter((i) => i.contactId === c.id)[0],
  })).sort((a, b) => b.revenue - a.revenue);

  const totalRevenue = customerRevenue.reduce((a, c) => a + c.revenue, 0);
  const walkInRevenue = invoices.filter((i) => !i.contactId).reduce((a, i) => a + i.totalAmount, 0);

  return (
    <div>
      <div className="page-header">
        <h2>Customer Relationship Management</h2>
        <p>Track wholesale accounts, customer revenue, and recent interactions.</p>
      </div>

      <div className="stat-row">
        <div className="stat-block"><div className="stat-label">Customers</div><div className="stat-value">{customers.length}</div></div>
        <div className="stat-block"><div className="stat-label">Account Revenue</div><div className="stat-value">${(totalRevenue / 1000).toFixed(0)}k</div></div>
        <div className="stat-block"><div className="stat-label">Walk-in Revenue</div><div className="stat-value">${(walkInRevenue / 1000).toFixed(0)}k</div></div>
        <div className="stat-block"><div className="stat-label">Total Invoices</div><div className="stat-value">{invoices.length}</div></div>
      </div>

      {/* Top customers */}
      <div className="card">
        <div className="card-header">
          <h3>Wholesale Customer Accounts</h3>
          <AddContactButton />
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Country</th>
                <th>Phone</th>
                <th>Invoices</th>
                <th>Total Revenue</th>
                <th>Last Invoice</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {customerRevenue.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.country}</td>
                  <td>{c.phone ?? "—"}</td>
                  <td>{c.invoiceCount}</td>
                  <td><strong>${c.revenue.toLocaleString()}</strong></td>
                  <td>
                    {c.lastInvoice
                      ? new Date(c.lastInvoice.date).toLocaleDateString("en-ZW")
                      : <span style={{ color: "var(--text-secondary)" }}>No invoices</span>}
                  </td>
                  <td><span className={`badge ${c.status === "Active" ? "badge-green" : "badge-gray"}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="card">
        <div className="card-header">
          <h3>Recent Customer Transactions</h3>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Farm</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.slice(0, 10).map((inv) => (
                <tr key={inv.id}>
                  <td><strong>{inv.invoiceNumber}</strong></td>
                  <td>{inv.contact?.name ?? <em style={{ color: "var(--text-secondary)" }}>Walk-in</em>}</td>
                  <td><span className="farm-tag">{inv.farm.name.split(" ")[0]}</span></td>
                  <td>{new Date(inv.date).toLocaleDateString("en-ZW")}</td>
                  <td>${inv.totalAmount.toLocaleString()}</td>
                  <td><span className={`badge ${inv.status === "Paid" ? "badge-green" : inv.status === "AwaitingPayment" ? "badge-orange" : "badge-gray"}`}>{inv.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
