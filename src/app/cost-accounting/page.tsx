import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export default async function CostAccounting() {
  const farms = await prisma.farm.findMany({
    include: { crops: true, costs: true, staff: true },
  });

  return (
    <div>
      <div className="page-header">
        <h2>Cost Accounting (Per Farm & Crop)</h2>
        <p>Analyze profitability, shared cost allocation, and cost per hectare.</p>
      </div>

      {farms.map(farm => {
        const totalSharedCosts = farm.costs.filter(c => !c.cropId).reduce((a, b) => a + b.amount, 0);
        
        return (
          <div key={farm.id} className="card">
            <h3>{farm.name} <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>({farm.location})</span></h3>
            
            <div style={{display: 'flex', gap: '2rem', marginTop: '1rem'}}>
              <div style={{flex: 1}}>
                <h4 style={{marginBottom: '10px'}}>Crop Level Profitability</h4>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Crop</th>
                      <th>Hectares</th>
                      <th>Direct Costs</th>
                      <th>Allocated Shared Cost</th>
                      <th>Total Cost / Ha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {farm.crops.map(crop => {
                      const directCosts = farm.costs.filter(c => c.cropId === crop.id).reduce((a, b) => a + b.amount, 0);
                      // Simple allocation: Shared costs spread by hectare ratio
                      const totalHectares = farm.crops.reduce((acc, c) => acc + c.hectares, 0);
                      const allocated = (crop.hectares / totalHectares) * totalSharedCosts || 0;
                      
                      return (
                        <tr key={crop.id}>
                          <td>{crop.name}</td>
                          <td>{crop.hectares}</td>
                          <td>${directCosts.toFixed(2)}</td>
                          <td>${allocated.toFixed(2)}</td>
                          <td><strong>${((directCosts + allocated) / crop.hectares).toFixed(2)}</strong></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{width: '300px', background: '#f8fafc', padding: '1rem', borderRadius: '8px'}}>
                <h4>Unallocated Shared Costs</h4>
                <h2 style={{color: 'var(--accent-color)', margin: '10px 0'}}>${totalSharedCosts.toFixed(2)}</h2>
                <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Fuel, General Labor, Electricity</p>
                <button className="btn" style={{marginTop: '1rem', width: '100%'}}>Run Allocation Engine</button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
}
