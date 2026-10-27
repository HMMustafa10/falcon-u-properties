import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Tab & Role Navigation
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'contractors', 'certificates', 'insurance', 'visa', 'rent', 'increments', 'addProperty', 'archived'
  const [role, setRole] = useState('Landlord Admin'); // 'Landlord Admin', 'Managing Agent', 'Tenant Portal'
  const [searchTerm, setSearchTerm] = useState('');

  // Live Database States
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [contractors, setContractors] = useState([]);

  // Forms State
  const [newPropName, setNewPropName] = useState('');
  const [newPropAddress, setNewPropAddress] = useState('');
  const [newPropUnits, setNewPropUnits] = useState(1);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchData();

      const channel = supabase
        .channel('full-portfolio-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => fetchData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tenants' }, () => fetchData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'contractors' }, () => fetchData())
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session]);

  const fetchData = async () => {
    const { data: props } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
    if (props) setProperties(props);

    const { data: tens } = await supabase.from('tenants').select('*').order('created_at', { ascending: false });
    if (tens) setTenants(tens);

    const { data: conts } = await supabase.from('contractors').select('*').order('created_at', { ascending: false });
    if (conts) setContractors(conts);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
    setIsSubmitting(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    if (!newPropName) return;
    const { error } = await supabase.from('properties').insert([
      { name: newPropName, address: newPropAddress, units_count: parseInt(newPropUnits) || 1 }
    ]);
    if (!error) {
      setNewPropName('');
      setNewPropAddress('');
      setNewPropUnits(1);
      setActiveTab('dashboard');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8fafc', color: '#64748b' }}>
        <h2>Loading Falcon U Properties...</h2>
      </div>
    );
  }

  // --- LOGIN SCREEN ---
  if (!session) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
        <div style={{ width: '100%', maxWidth: '420px', padding: '40px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fef3c7', color: '#b45309', fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>
              F
            </div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px' }}>FALCON U PROPERTIES</h1>
            <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Enterprise Portfolio & Tenancy System</p>
          </div>

          {authError && (
            <div style={{ padding: '12px 16px', backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#991b1b', fontSize: '13px', borderRadius: '4px', marginBottom: '20px' }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="office@falconuproperties.co.uk"
                required 
                style={{ width: '100%', padding: '11px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required 
                style={{ width: '100%', padding: '11px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{ width: '100%', padding: '12px', backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filter properties by search term
  const filteredProperties = properties.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- FULL DASHBOARD INTERFACE ---
  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: '#fefce8', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* Top Bar with User Info & Logout */}
      <div style={{ backgroundColor: '#0f172a', padding: '10px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '13px' }}>
        <div>Falcon U Cloud Engine • Real-time Sync Active</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>User: <strong style={{ color: '#fff' }}>{session.user.email}</strong></span>
          <button onClick={handleLogout} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
            Log Out
          </button>
        </div>
      </div>

      {/* Main Title Section */}
      <div style={{ textAlign: 'center', padding: '25px 20px 15px 20px' }}>
        <h1 style={{ color: '#b45309', margin: 0, fontSize: '36px', letterSpacing: '1px', fontWeight: '800' }}>FALCON U PROPERTIES</h1>
        <p style={{ color: '#0284c7', margin: '5px 0 0 0', fontWeight: '600', fontSize: '15px' }}>Enterprise Portfolio & Tenancy Management System</p>
      </div>

      {/* Role Switcher Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        {['Landlord Admin', 'Managing Agent', 'Tenant Portal'].map(r => (
          <button 
            key={r}
            onClick={() => setRole(r)}
            style={{ 
              padding: '6px 16px', 
              borderRadius: '4px', 
              border: 'none', 
              fontWeight: '600', 
              fontSize: '13px', 
              cursor: 'pointer',
              backgroundColor: role === r ? '#0284c7' : '#cbd5e1',
              color: role === r ? '#ffffff' : '#334155'
            }}
          >
            {r === 'Landlord Admin' ? '🛡️ Landlord Admin' : r === 'Managing Agent' ? '💼 Managing Agent' : '🔑 Tenant Portal'}
          </button>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 25px auto', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', padding: '0 10px' }}>
        {[
          { id: 'dashboard', label: '🏠 Home Dashboard' },
          { id: 'contractors', label: `🛠️ Contractor Directory (${contractors.length})` },
          { id: 'certificates', label: '📜 Certificates Due' },
          { id: 'insurance', label: '🛡️ Insurance Due' },
          { id: 'visa', label: '🛂 Visa Expiries' },
          { id: 'rent', label: '💰 Rent Due & Reminders' },
          { id: 'increments', label: '📈 Rent Increments' },
          { id: 'addProperty', label: '+ Add Property' },
          { id: 'archived', label: '📦 Archived Vault' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              backgroundColor: activeTab === tab.id ? '#0284c7' : '#ffffff',
              color: activeTab === tab.id ? '#ffffff' : '#334155',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>

        {/* TAB 1: HOME DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            {/* 5 Quick Action Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '15px', marginBottom: '30px' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', borderLeft: '5px solid #ef4444', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>CERTIFICATES RENEWAL</span>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#dc2626', marginTop: '6px' }}>🚨 7-Day Red Warning Active</div>
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', borderLeft: '5px solid #0284c7', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>INSURANCE RENEWAL DUE</span>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0284c7', marginTop: '6px' }}>🛡️ View Policy Expiries →</div>
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', borderLeft: '5px solid #0284c7', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>TENANTS VISA EXPIRIES</span>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0284c7', marginTop: '6px' }}>🛂 Check Expiries & Sharecodes →</div>
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', borderLeft: '5px solid #16a34a', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>RENT COLLECTION</span>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#16a34a', marginTop: '6px' }}>💰 View Due Rent & Email Reminders →</div>
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', borderLeft: '5px solid #d97706', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>SUPPLIERS DIRECTORY</span>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#d97706', marginTop: '6px' }}>🛠️ Plumbers, Electricians & Trades →</div>
              </div>
            </div>

            {/* Portfolio Grid Header & Search Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#0f172a', fontSize: '22px' }}>
                🏠 Portfolio Units ({filteredProperties.length})
              </h2>
              <input 
                type="text" 
                placeholder="Search address or tenant..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '280px', fontSize: '13px' }}
              />
            </div>

            {/* Property Cards Grid */}
            {filteredProperties.length === 0 ? (
              <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', textAlign: 'center', color: '#64748b' }}>
                No properties created yet. Click <strong>+ Add Property</strong> above to create your first unit!
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                {filteredProperties.map((p) => (
                  <div key={p.id} style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '18px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>RESIDENTIAL PROPERTY</span>
                      <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
                        {p.units_count || 1} Unit(s)
                      </span>
                    </div>

                    <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#0f172a' }}>{p.name}</h3>
                    <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#64748b' }}>{p.address || 'No address specified'}</p>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
                      <button style={{ flex: 1, backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '6px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
                        🔑 Portal
                      </button>
                      <button style={{ flex: 1, backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '6px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
                        ✏️ Edit Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: ADD PROPERTY */}
        {activeTab === 'addProperty' && (
          <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', maxWidth: '600px', margin: '0 auto', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0, color: '#0f172a' }}>Add New Property to Portfolio</h2>
            <form onSubmit={handleCreateProperty}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>Property Name / Identifier</label>
                <input 
                  type="text" 
                  value={newPropName} 
                  onChange={(e) => setNewPropName(e.target.value)} 
                  placeholder="e.g. 11 High Street, London" 
                  required 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>Full Address</label>
                <input 
                  type="text" 
                  value={newPropAddress} 
                  onChange={(e) => setNewPropAddress(e.target.value)} 
                  placeholder="Street, City, Postcode" 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>Number of Units</label>
                <input 
                  type="number" 
                  value={newPropUnits} 
                  onChange={(e) => setNewPropUnits(e.target.value)} 
                  min="1" 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>
              <button type="submit" style={{ backgroundColor: '#16a34a', color: '#fff', padding: '12px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>
                Save Property to Cloud
              </button>
            </form>
          </div>
        )}

        {/* OTHER TABS PLACEHOLDERS */}
        {['contractors', 'certificates', 'insurance', 'visa', 'rent', 'increments', 'archived'].includes(activeTab) && (
          <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textTransform: 'capitalize', color: '#0f172a' }}>{activeTab} Management Module</h2>
            <p style={{ color: '#64748b' }}>Connected live to Supabase PostgreSQL database table `public.{activeTab}`.</p>
          </div>
        )}

      </div>
    </div>
  );
}