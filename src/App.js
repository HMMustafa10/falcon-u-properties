import React, { useState } from 'react';

// Initial sample properties so dashboard isn't empty
const INITIAL_PROPERTIES = [
  {
    id: 1,
    address: "124 High Street, London E1 6AN",
    tenant: "John Doe",
    rent: 1450,
    status: "Active",
    epc: "C",
    cp12Due: "2026-11-15",
    rentDueDay: 1
  },
  {
    id: 2,
    address: "45 Station Road, Ilford IG1 4BG",
    tenant: "Sarah Smith",
    rent: 1800,
    status: "Active",
    epc: "B",
    cp12Due: "2026-12-01",
    rentDueDay: 5
  }
];

export default function App() {
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Form State for new property
  const [newProp, setNewProp] = useState({
    address: '',
    tenant: '',
    rent: '',
    epc: 'C',
    cp12Due: ''
  });

  const handleAddProperty = (e) => {
    e.preventDefault();
    if (!newProp.address || !newProp.tenant || !newProp.rent) {
      alert("Please fill in address, tenant, and rent amount.");
      return;
    }

    const createdProp = {
      id: Date.now(),
      address: newProp.address,
      tenant: newProp.tenant,
      rent: parseFloat(newProp.rent),
      status: 'Active',
      epc: newProp.epc,
      cp12Due: newProp.cp12Due || '2026-12-31',
      rentDueDay: 1
    };

    setProperties([createdProp, ...properties]);
    setNewProp({ address: '', tenant: '', rent: '', epc: 'C', cp12Due: '' });
    setShowAddModal(false);
  };

  const filteredProperties = properties.filter(p =>
    p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tenant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fcfbf7', fontFamily: 'sans-serif', color: '#1a1a1a' }}>
      {/* Top Bar */}
      <div style={{ backgroundColor: '#0f172a', color: '#fff', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
        <span>Falcon U Cloud Engine • Real-time Sync Active</span>
        <button 
          onClick={() => window.location.reload()} 
          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Log Out
        </button>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ color: '#d97706', fontSize: '32px', margin: '0 0 4px 0', letterSpacing: '1px' }}>FALCON U PROPERTIES</h1>
          <p style={{ color: '#0284c7', margin: 0, fontWeight: 'bold' }}>Enterprise Portfolio & Tenancy Management System</p>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
          <button 
            onClick={() => setActiveTab('dashboard')} 
            style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: activeTab === 'dashboard' ? '#0284c7' : '#e2e8f0', color: activeTab === 'dashboard' ? '#fff' : '#334155', cursor: 'pointer', fontWeight: 'bold' }}>
            🏠 Home Dashboard
          </button>
          <button 
            onClick={() => setShowAddModal(true)} 
            style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#16a34a', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
            + Add Property
          </button>
        </div>

        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #ef4444', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '12px' }}>CERTIFICATES RENEWAL</h4>
            <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '14px' }}>🚨 Gas Safety Checks Due</div>
          </div>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #0284c7', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '12px' }}>TOTAL PROPERTIES</h4>
            <div style={{ color: '#0f172a', fontWeight: 'bold', fontSize: '20px' }}>{properties.length} Units Active</div>
          </div>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #16a34a', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '12px' }}>MONTHLY RENT COLLECTION</h4>
            <div style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '20px' }}>£{properties.reduce((sum, p) => sum + p.rent, 0).toLocaleString()}</div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', margin: 0 }}>🏠 Portfolio Units ({filteredProperties.length})</h2>
          <input 
            type="text" 
            placeholder="Search address or tenant..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px 12px', width: '280px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
        </div>

        {/* Properties List */}
        {filteredProperties.length === 0 ? (
          <div style={{ background: '#fff', padding: '40px', textAlign: 'center', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
            No properties found matching your search.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {filteredProperties.map(prop => (
              <div key={prop.id} style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#0f172a' }}>{prop.address}</h3>
                  <div style={{ fontSize: '14px', color: '#475569' }}>
                    Tenant: <strong>{prop.tenant}</strong> | CP12 Due: <span style={{ color: '#ef4444' }}>{prop.cp12Due}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>EPC: {prop.epc}</span>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>£{prop.rent} /mo</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Property Modal */}
        {showAddModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '500px', width: '100%' }}>
              <h2 style={{ marginTop: 0 }}>Add New Property</h2>
              <form onSubmit={handleAddProperty}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Property Address</label>
                  <input type="text" required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} value={newProp.address} onChange={e => setNewProp({...newProp, address: e.target.value})} />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Tenant Name</label>
                  <input type="text" required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} value={newProp.tenant} onChange={e => setNewProp({...newProp, tenant: e.target.value})} />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Monthly Rent (£)</label>
                  <input type="number" required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} value={newProp.rent} onChange={e => setNewProp({...newProp, rent: e.target.value})} />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>CP12 Gas Due Date</label>
                  <input type="date" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} value={newProp.cp12Due} onChange={e => setNewProp({...newProp, cp12Due: e.target.value})} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '8px 16px', background: '#cbd5e1', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '8px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save Property</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}