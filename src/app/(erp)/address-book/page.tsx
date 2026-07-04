import { prisma } from "@/lib/prisma";
import { AddContactButton } from "./ContactForms";

export const dynamic = "force-dynamic";

const typeIcon: Record<string, string> = {
  Supplier: "", Customer: "", Bank: "", Partner: "", 
};

export default async function AddressBook() {
  const contacts = await prisma.contact.findMany({ orderBy: [{ contactType: "asc" }, { name: "asc" }] });

  const byType = ["Supplier", "Customer", "Bank", "Partner"].map((t) => ({
    type: t,
    items: contacts.filter((c) => c.contactType === t),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="page-header">
        <h2>Address Book</h2>
        <p>Global directory for suppliers, customers, banks and partners.</p>
      </div>

      <div className="stat-row">
        {byType.map((g) => (
          <div key={g.type} className="stat-block">
            <div className="stat-label">{typeIcon[g.type]} {g.type}s</div>
            <div className="stat-value">{g.items.length}</div>
          </div>
        ))}
      </div>

      {byType.map(({ type, items }) => (
        <div key={type} className="card">
          <div className="card-header">
            <h3>{typeIcon[type]} {type}s</h3>
            <AddContactButton />
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name / Company</th>
                  <th>Country</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.country}</td>
                    <td>{c.phone ?? "—"}</td>
                    <td style={{ fontSize: "0.82rem" }}>{c.email ?? "—"}</td>
                    <td style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{c.address ?? "—"}</td>
                    <td>
                      <span className={`badge ${c.status === "Active" ? "badge-green" : "badge-gray"}`}>{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
