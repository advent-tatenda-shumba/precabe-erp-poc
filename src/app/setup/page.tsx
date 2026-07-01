export default function SetupConfig() {
  return (
    <div>
      <div className="page-header">
        <h2>Setup & Configurations</h2>
        <p>Manage system-wide settings, multi-currency rates, and access controls.</p>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Currency Exchange Rates</h3>
          <table className="table" style={{marginTop: '1rem'}}>
            <thead>
              <tr>
                <th>Currency pair</th>
                <th>Rate</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>USD / ZIG</td>
                <td>13.56</td>
                <td><span style={{color: 'green'}}>Auto (Today)</span></td>
              </tr>
              <tr>
                <td>USD / ZAR</td>
                <td>18.42</td>
                <td><span style={{color: 'green'}}>Auto (Today)</span></td>
              </tr>
            </tbody>
          </table>
          <button className="btn" style={{marginTop: '1rem'}}>Force Sync Rates</button>
        </div>

        <div className="card">
          <h3>User Roles & Permissions</h3>
          <ul style={{marginTop: '1rem', lineHeight: '2'}}>
            <li><span className="module-title">Super Admin</span> - Full Access</li>
            <li><span className="module-title">Farm Manager</span> - Operational Access</li>
            <li><span className="module-title">Finance Officer</span> - GL & Accounting Only</li>
            <li><span className="module-title">POS Cashier</span> - Retail Only</li>
          </ul>
          <button className="client-btn" style={{marginTop: '1rem'}}>Manage Roles</button>
        </div>
      </div>
    </div>
  );
}
