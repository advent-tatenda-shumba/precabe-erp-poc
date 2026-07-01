export default function FixedAssets() {
  return (
    <div>
      <div className="page-header">
        <h2>Fixed Assets Register</h2>
        <p>Track depreciation, maintenance, and allocation of major equipment and vehicles.</p>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Total Asset Value</h3>
          <h1 style={{color: 'var(--accent-color)', fontSize: '2.5rem', margin: '1rem 0'}}>$1.2M</h1>
          <p>Across all 5 locations</p>
        </div>
        <div className="card">
          <h3>Pending Maintenance</h3>
          <h1 style={{color: 'orange', fontSize: '2.5rem', margin: '1rem 0'}}>3</h1>
          <p>Vehicles require immediate service</p>
        </div>
      </div>

      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <h3>Asset Ledger</h3>
          <button className="btn">+ Register Asset</button>
        </div>
        
        <table className="table">
          <thead>
            <tr>
              <th>Asset Tag</th>
              <th>Description</th>
              <th>Assigned Location</th>
              <th>Current Value (USD)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>TRAC-001</td>
              <td>John Deere 5075E Tractor</td>
              <td>Kwekwe Main Farm</td>
              <td>$35,000.00</td>
              <td><span style={{color: 'green'}}>Operational</span></td>
            </tr>
            <tr>
              <td>TRAC-002</td>
              <td>Massey Ferguson 290</td>
              <td>Mazoe Farm</td>
              <td>$18,500.00</td>
              <td><span style={{color: 'orange'}}>In Maintenance</span></td>
            </tr>
            <tr>
              <td>VEH-001</td>
              <td>Toyota Hilux GD6 (Manager)</td>
              <td>Head Office</td>
              <td>$42,000.00</td>
              <td><span style={{color: 'green'}}>Operational</span></td>
            </tr>
            <tr>
              <td>MILL-001</td>
              <td>Maize Milling Machine</td>
              <td>Tynwald Processing Hub</td>
              <td>$125,000.00</td>
              <td><span style={{color: 'green'}}>Operational</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
