export default function Purchasing() {
  return (
    <div>
      <div className="page-header">
        <h2>Purchasing</h2>
        <p>Manage supplier orders and procurement.</p>
      </div>
      <div className="card">
        <h3>Recent Purchase Orders</h3>
        <table className="table" style={{marginTop: '1rem'}}>
          <thead>
            <tr>
              <th>PO Number</th>
              <th>Supplier</th>
              <th>Total Amount (USD)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PO-2026-001</td>
              <td>Agricura Zimbabwe</td>
              <td>$12,450.00</td>
              <td><span style={{color: 'green'}}>Delivered</span></td>
            </tr>
            <tr>
              <td>PO-2026-002</td>
              <td>ZFC Limited</td>
              <td>$45,000.00</td>
              <td><span style={{color: 'orange'}}>Pending Approval</span></td>
            </tr>
            <tr>
              <td>PO-2026-003</td>
              <td>Puma Energy</td>
              <td>$8,200.00</td>
              <td><span style={{color: 'blue'}}>In Transit</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
