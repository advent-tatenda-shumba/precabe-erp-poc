export default function AddressBook() {
  return (
    <div>
      <div className="page-header">
        <h2>Address Book</h2>
        <p>Global directory for Suppliers, Clients, and Partners.</p>
      </div>

      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <h3>Contacts Directory</h3>
          <button className="btn">+ New Contact</button>
        </div>
        
        <table className="table">
          <thead>
            <tr>
              <th>Name / Company</th>
              <th>Type</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Agricura Zimbabwe</strong></td>
              <td>Supplier (Chemicals)</td>
              <td>+263 242 700 000</td>
              <td>sales@agricura.co.zw</td>
              <td><span style={{color: 'green'}}>Active</span></td>
            </tr>
            <tr>
              <td><strong>National Foods Ltd</strong></td>
              <td>Wholesale Client</td>
              <td>+263 242 750 000</td>
              <td>procurement@natfoods.co.zw</td>
              <td><span style={{color: 'green'}}>Active</span></td>
            </tr>
            <tr>
              <td><strong>SeedCo Zimbabwe</strong></td>
              <td>Supplier (Seeds)</td>
              <td>+263 242 800 000</td>
              <td>info@seedco.co.zw</td>
              <td><span style={{color: 'green'}}>Active</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
