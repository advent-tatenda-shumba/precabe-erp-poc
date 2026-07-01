export default function Sales() {
  return (
    <div>
      <div className="page-header">
        <h2>Sales & Revenue</h2>
        <p>Track retail, wholesale, and butchery POS sales.</p>
      </div>
      <div className="card">
        <h3>Recent Sales Transactions</h3>
        <table className="table" style={{marginTop: '1rem'}}>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer</th>
              <th>Point of Sale</th>
              <th>Amount (USD)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>INV-10293</td>
              <td>Walk-in Customer</td>
              <td>Kwekwe Butchery</td>
              <td>$45.50</td>
              <td><span style={{color: 'green'}}>Paid</span></td>
            </tr>
            <tr>
              <td>INV-10294</td>
              <td>National Foods Ltd</td>
              <td>Wholesale - Wheat</td>
              <td>$12,500.00</td>
              <td><span style={{color: 'orange'}}>Awaiting Payment</span></td>
            </tr>
            <tr>
              <td>INV-10295</td>
              <td>Walk-in Customer</td>
              <td>Fuel Station - Diesel</td>
              <td>$120.00</td>
              <td><span style={{color: 'green'}}>Paid</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
