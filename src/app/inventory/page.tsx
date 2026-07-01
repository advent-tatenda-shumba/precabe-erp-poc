export default function Inventory() {
  return (
    <div>
      <div className="page-header">
        <h2>Inventory Management</h2>
        <p>Manage multi-location warehouses and track stock movements.</p>
      </div>
      <div className="card">
        <h3>Current Stock Levels</h3>
        <table className="table" style={{marginTop: '1rem'}}>
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Description</th>
              <th>Location</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>FERT-01</td>
              <td>Ammonium Nitrate 50kg</td>
              <td>Kwekwe Main - Warehouse A</td>
              <td>450 Bags</td>
              <td><span style={{color: 'green'}}>Optimal</span></td>
            </tr>
            <tr>
              <td>SEED-MZ</td>
              <td>SC719 Maize Seed 25kg</td>
              <td>Kwekwe Main - Warehouse B</td>
              <td>120 Bags</td>
              <td><span style={{color: 'orange'}}>Low Stock</span></td>
            </tr>
            <tr>
              <td>FUEL-D</td>
              <td>Diesel (Bulk)</td>
              <td>Mazoe Farm - Tank 1</td>
              <td>4,500 L</td>
              <td><span style={{color: 'green'}}>Optimal</span></td>
            </tr>
            <tr>
              <td>CHEM-HERB</td>
              <td>Glyphosate 20L</td>
              <td>Bikita Farm</td>
              <td>15 Drums</td>
              <td><span style={{color: 'red'}}>Critical</span></td>
            </tr>
            <tr>
              <td>FEED-B1</td>
              <td>Broiler Starter</td>
              <td>Tynwald Warehouse</td>
              <td>800 Bags</td>
              <td><span style={{color: 'green'}}>Optimal</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
