export default function CRM() {
  return (
    <div>
      <div className="page-header">
        <h2>Customer Relationship Management (CRM)</h2>
        <p>Track leads, customer interactions, and wholesale accounts.</p>
      </div>
      <div className="dashboard-grid">
        <div className="card">
          <h3>Active Leads</h3>
          <h1 style={{color: 'var(--accent-color)', fontSize: '3rem', margin: '1rem 0'}}>24</h1>
          <p>Potential wholesale buyers this month</p>
        </div>
        <div className="card">
          <h3>Top Wholesale Client</h3>
          <h2 style={{margin: '1rem 0'}}>National Foods Ltd</h2>
          <p>Last interaction: 2 days ago</p>
        </div>
      </div>
    </div>
  );
}
