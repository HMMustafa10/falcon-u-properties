import React, { useState, useEffect } from 'react';
import {
  Building2, Users, Wrench, ShieldCheck, FileText,
  Plus, Trash2, Edit, CheckCircle, AlertTriangle,
  Search, Filter, Download, Mail, Phone, Upload,
  Key, Calendar, CreditCard, ShieldAlert, X,
  ArrowLeft, Clock, Gauge, FileImage, UserCheck,
  Building, Briefcase, Lock, LogIn, UserPlus, LogOut
} from 'lucide-react';

// Default Initial Portfolio Data
const initialProperties = [
  {
    id: 'P1',
    address: '12 Falcon Way, London E1 6AN',
    type: 'Flat',
    rentAmount: 1450,
    depositAmount: 1450,
    depositSupplier: 'DPS (Deposit Protection Service)',
    contractType: 'AST Agreement (Company to Tenant)',
    rentDueDate: 1,
    insuranceDetails: 'Aviva Landlord Policy #AV-992011 (Exp: 2026-12-01)',
    gasCertExpiry: '2026-11-15',
    eicrExpiry: '2027-03-20',
    epcExpiry: '2028-06-10',
    insuranceExpiry: '2026-12-01',
    utilities: { gas: 'British Gas', electricity: 'Octopus Energy', water: 'Thames Water' },
    meterReadings: [
      { id: 'M1', type: 'Opening', utility: 'Electricity', reading: '14230 kWh', date: '2024-01-15' }
    ],
    commercialDetails: null,
    activeTenant: {
      id: 'T101',
      name: 'Muhammad Mustafa',
      email: 'mustafa@example.com',
      phone: '+44 7700 900077',
      passportNumber: 'GB123456789',
      origin: 'United Kingdom',
      jobStatus: 'Employed (Full-Time)',
      moveInDate: '2024-01-15',
      rentStatus: 'Unpaid',
      daysOverdue: 5,
      visaStatus: 'UK Citizen',
      shareCode: 'N/A',
      visaExpiry: '2099-12-31',
      notes: 'Tenant mentioned possible rent increase discussion in Q4.',
      familyMembers: [
        { name: 'Fatima Mustafa', relation: 'Spouse', visaStatus: 'Skilled Worker Dependant', visaExpiry: '2026-11-10', shareCode: 'DEF456GHI' }
      ],
      documents: [
        { id: 'D1', name: 'Tenancy_Agreement.pdf', type: 'pdf', url: '#' },
        { id: 'D2', name: 'Gas_Safety_Cert.jpg', type: 'image', url: '#' }
      ]
    }
  },
  {
    id: 'P2',
    address: '88 Commercial Road, London E1 1RD',
    type: 'Commercial',
    rentAmount: 3200,
    depositAmount: 6400,
    depositSupplier: 'MyDeposits Commercial Vault',
    contractType: 'Full Repairing & Insuring (FRI) Lease',
    rentDueDate: 1,
    insuranceDetails: 'AXA Commercial Property #AX-77210 (Exp: 2027-05-15)',
    gasCertExpiry: '2027-01-10',
    eicrExpiry: '2028-02-14',
    epcExpiry: '2029-08-20',
    insuranceExpiry: '2027-05-15',
    utilities: { gas: 'Commercial Gas Ltd', electricity: 'E.ON Commercial', water: 'Thames Commercial' },
    meterReadings: [],
    commercialDetails: {
      businessName: 'Falcon Express Dry Cleaners Ltd',
      businessRegNo: '12345678',
      leaseStart: '2022-01-01',
      leaseEnd: '2032-01-01',
      remainingDuration: '5 Years 2 Months'
    },
    activeTenant: {
      id: 'T102',
      name: 'John Miller',
      email: 'john@falconexpress.co.uk',
      phone: '+44 20 7946 0912',
      passportNumber: 'US987654321',
      origin: 'United States',
      jobStatus: 'Company Director',
      moveInDate: '2022-01-01',
      rentStatus: 'Paid',
      daysOverdue: 0,
      visaStatus: 'Tier 1 Investor',
      shareCode: 'COMM-9912',
      visaExpiry: '2099-12-31',
      notes: 'Commercial lease renewal option in 2031.',
      familyMembers: [],
      documents: [{ id: 'D3', name: 'Commercial_Lease_Agreement.pdf', type: 'pdf', url: '#' }]
    }
  }
];

const initialContractors = [
  { id: 'C1', name: 'John’s Gas & Heating', trade: 'Gas Engineer', company: 'Apex Heating Ltd', phone: '+44 7911 123456', email: 'gas@apexheating.co.uk', address: 'London E1', notes: 'Gas Safe Reg #55412. Available 24/7.' },
  { id: 'C2', name: 'Bright Spark Electric', trade: 'Electricity', company: 'Current Solutions Ltd', phone: '+44 7911 654321', email: 'info@brightspark.co.uk', address: 'Ilford IG1', notes: 'NICEIC Registered contractor.' }
];

const initialTickets = [
  { id: 'TK1', propertyId: 'P1', propertyAddress: '12 Falcon Way, London E1 6AN', tenantName: 'Muhammad Mustafa', issueCategory: 'Plumbing', issueDescription: 'Kitchen sink dripping water continuously.', date: '2026-10-25', status: 'Open', priority: 'Medium' }
];

export default function App() {
  // Persistence state v20
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('falcon_u_properties_v20');
    return saved ? JSON.parse(saved) : initialProperties;
  });

  const [contractors, setContractors] = useState(() => {
    const saved = localStorage.getItem('falcon_u_contractors_v20');
    return saved ? JSON.parse(saved) : initialContractors;
  });

  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('falcon_u_tickets_v20');
    return saved ? JSON.parse(saved) : initialTickets;
  });

  // Auth & Account State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('falcon_u_user_v20');
    return saved ? JSON.parse(saved) : null; // null means logged out
  });
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', role: 'landlord' });

  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filterModal, setFilterModal] = useState(null);

  // Modals & Editing Forms
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isEditingTenant, setIsEditingTenant] = useState(false);
  const [tenantFormData, setTenantFormData] = useState(null);

  const [editingContractor, setEditingContractor] = useState(null);
  const [showAddContractor, setShowAddContractor] = useState(false);
  const [contractorForm, setContractorForm] = useState({ name: '', company: '', trade: 'Gas Engineer', phone: '', email: '', address: '', notes: '' });

  const [showMeterModal, setShowMeterModal] = useState(null);
  const [meterForm, setMeterForm] = useState({ type: 'Opening', utility: 'Electricity', reading: '' });

  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({ issueCategory: 'Plumbing', issueDescription: '' });

  // LocalStorage Sync
  useEffect(() => { localStorage.setItem('falcon_u_properties_v20', JSON.stringify(properties)); }, [properties]);
  useEffect(() => { localStorage.setItem('falcon_u_contractors_v20', JSON.stringify(contractors)); }, [contractors]);
  useEffect(() => { localStorage.setItem('falcon_u_tickets_v20', JSON.stringify(tickets)); }, [tickets]);
  useEffect(() => { localStorage.setItem('falcon_u_user_v20', JSON.stringify(currentUser)); }, [currentUser]);

  // Derived Alerts
  const rentDueList = properties.filter(p => p.activeTenant && p.activeTenant.rentStatus === 'Unpaid');
  const visaDueList = properties.filter(p => {
    if (!p.activeTenant) return false;
    const diffDays = Math.ceil((new Date(p.activeTenant.visaExpiry) - new Date()) / (1000 * 60 * 60 * 24));
    return diffDays <= 60;
  });
  const certDueList = properties.filter(p => {
    const checkCert = (d) => Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24)) <= 45;
    return checkCert(p.gasCertExpiry) || checkCert(p.eicrExpiry) || checkCert(p.epcExpiry);
  });
  const openTickets = tickets.filter(t => t.status === 'Open');

  // Toggle Rent Paid Action (Removes tenant from Overdue Reminder List)
  const handleMarkRentPaid = (propertyId) => {
    setProperties(properties.map(p => {
      if (p.id === propertyId && p.activeTenant) {
        return {
          ...p,
          activeTenant: { ...p.activeTenant, rentStatus: 'Paid', daysOverdue: 0 }
        };
      }
      return p;
    }));
  };

  // Login / Registration Handler
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authMode === 'register') {
      const userObj = { name: authForm.name, email: authForm.email, role: authForm.role };
      setCurrentUser(userObj);
    } else {
      // Demo Login
      const userObj = { name: authForm.email.split('@')[0], email: authForm.email, role: authForm.role };
      setCurrentUser(userObj);
    }
    setAuthForm({ name: '', email: '', password: '', role: 'landlord' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('falcon_u_user_v20');
  };

  // If user is not logged in, render Login/Register Auth Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-amber-100 text-amber-600 mb-1">
              <Building2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">FALCON U PROPERTIES</h1>
            <p className="text-xs font-semibold text-slate-500">Sign in to access your Property & Compliance Portal</p>
          </div>

          {/* Form Switcher Tabs */}
          <div className="flex border-b text-sm font-bold">
            <button onClick={() => setAuthMode('login')} className={`flex-1 py-2 text-center border-b-2 ${authMode === 'login' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400'}`}>Log In</button>
            <button onClick={() => setAuthMode('register')} className={`flex-1 py-2 text-center border-b-2 ${authMode === 'register' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400'}`}>Create Account</button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs font-medium">
            {authMode === 'register' && (
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                <input required type="text" placeholder="e.g. John Smith" value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} className="w-full border p-2.5 rounded-lg text-xs" />
              </div>
            )}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Email Address</label>
              <input required type="email" placeholder="name@example.com" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} className="w-full border p-2.5 rounded-lg text-xs" />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Password</label>
              <input required type="password" placeholder="••••••••" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} className="w-full border p-2.5 rounded-lg text-xs" />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Account Role / Portal Access</label>
              <select value={authForm.role} onChange={e => setAuthForm({...authForm, role: e.target.value})} className="w-full border p-2.5 rounded-lg text-xs bg-slate-50">
                <option value="landlord">👑 Landlord Portal (Full Portfolio Access)</option>
                <option value="agent">🏢 Agent Portal (Managed Properties Access)</option>
                <option value="tenant">👤 Tenant Portal (Self-Service View)</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg text-xs tracking-wide shadow-md transition">
              {authMode === 'login' ? 'SIGN IN TO PORTAL' : 'CREATE NEW ACCOUNT'}
            </button>
          </form>

          {/* Emergency Contacts Footer */}
          <div className="border-t pt-4 text-center text-[11px] text-slate-400 space-y-1">
            <p>Office Phone: 02071835494 (Mon–Fri 9:30 AM – 5:00 PM)</p>
            <p className="text-red-500 font-bold">24/7 Gas Emergency: 0800 111999 | Elec: 105</p>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED-IN PORTAL INTERFACE
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-16">
      {/* Top Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-2xl font-bold tracking-wide">FALCON U PROPERTIES</h1>
              <p className="text-xs text-amber-400">Enterprise Real Estate Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <p className="font-bold text-white">{currentUser.name}</p>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">{currentUser.role} Portal</span>
            </div>
            <button onClick={handleLogout} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Sub Navigation Bar & Emergency Line */}
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center text-xs bg-slate-950/80">
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-1 rounded font-semibold flex items-center gap-1 ${activeTab === 'dashboard' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}>
              <Building className="w-3.5 h-3.5" /> Dashboard
            </button>
            <button onClick={() => setActiveTab('suppliers')} className={`px-3 py-1 rounded font-semibold flex items-center gap-1 ${activeTab === 'suppliers' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}>
              <Wrench className="w-3.5 h-3.5" /> Suppliers Directory
            </button>
            <button onClick={() => setActiveTab('tickets')} className={`px-3 py-1 rounded font-semibold flex items-center gap-1 ${activeTab === 'tickets' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}>
              <AlertTriangle className="w-3.5 h-3.5" /> Ticket Center ({openTickets.length})
            </button>
          </div>

          <div className="hidden md:flex items-center gap-6 text-slate-300">
            <span>📞 Office: <strong>02071835494</strong> (Mon–Fri 9:30am–5:00pm)</span>
            <span className="text-red-400 font-bold">🚨 Emergency Gas: 0800 111999 | Elec: 105</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 mt-6">
        {activeTab !== 'dashboard' && (
          <button onClick={() => setActiveTab('dashboard')} className="mb-4 bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition">
            <ArrowLeft className="w-4 h-4" /> Go Back to Main Dashboard Home
          </button>
        )}

        {/* Alert Ribbons */}
        {currentUser.role !== 'tenant' && activeTab === 'dashboard' && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div onClick={() => setFilterModal('rentDue')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-red-400">
              <span className="text-xs font-bold text-slate-500 uppercase">Rent Due Alert</span>
              <p className="text-2xl font-extrabold text-red-600 mt-1">{rentDueList.length}</p>
              <span className="text-xs text-slate-400">Click to view & mark rent paid</span>
            </div>
            <div onClick={() => setFilterModal('certDue')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-amber-400">
              <span className="text-xs font-bold text-slate-500 uppercase">Certificates Due</span>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">{certDueList.length}</p>
              <span className="text-xs text-slate-400">Gas, EICR & EPC</span>
            </div>
            <div onClick={() => setFilterModal('visaDue')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-blue-400">
              <span className="text-xs font-bold text-slate-500 uppercase">Visa Expiry Due</span>
              <p className="text-2xl font-extrabold text-blue-600 mt-1">{visaDueList.length}</p>
              <span className="text-xs text-slate-400">Right to Rent checks</span>
            </div>
            <div onClick={() => setActiveTab('tickets')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-orange-400">
              <span className="text-xs font-bold text-slate-500 uppercase">Open Complaints/Tickets</span>
              <p className="text-2xl font-extrabold text-orange-600 mt-1">{openTickets.length}</p>
              <span className="text-xs text-slate-400">Maintenance requests</span>
            </div>
          </section>
        )}

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">
              {currentUser.role === 'tenant' ? 'My Assigned Property Tenancy' : `Active Portfolio (${properties.length} Properties)`}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {properties
                .filter(p => currentUser.role !== 'tenant' || (p.activeTenant && p.activeTenant.email === currentUser.email))
                .map(prop => (
                  <div key={prop.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
                    <div className="flex justify-between items-start border-b pb-3">
                      <div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{prop.type} Property</span>
                        <h3 className="font-bold text-slate-900 text-lg mt-1">{prop.address}</h3>
                        <p className="text-xs text-slate-500">Rent: £{prop.rentAmount}/mo | Deposit: £{prop.depositAmount} ({prop.depositSupplier})</p>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${prop.activeTenant ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                        {prop.activeTenant ? 'Occupied' : 'Vacant'}
                      </span>
                    </div>

                    {prop.activeTenant && (
                      <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-xs border">
                        <div className="flex justify-between items-center border-b pb-2">
                          <p className="font-bold text-slate-900 text-sm">{prop.activeTenant.name}</p>

                          {/* Quick Mark Rent Paid Toggle */}
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded font-bold ${prop.activeTenant.rentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {prop.activeTenant.rentStatus}
                            </span>
                            {currentUser.role !== 'tenant' && prop.activeTenant.rentStatus === 'Unpaid' && (
                              <button onClick={() => handleMarkRentPaid(prop.id)} className="bg-green-600 hover:bg-green-700 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                                ✓ Mark Paid
                              </button>
                            )}
                          </div>
                        </div>
                        <p><strong>Passport No:</strong> {prop.activeTenant.passportNumber} | <strong>Origin:</strong> {prop.activeTenant.origin}</p>
                        <p><strong>Sharecode:</strong> {prop.activeTenant.shareCode} (Exp: {prop.activeTenant.visaExpiry})</p>
                      </div>
                    )}

                    {/* Meter Readings */}
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-bold text-slate-700 flex items-center gap-1"><Gauge className="w-3.5 h-3.5" /> Meter Readings:</p>
                        <button onClick={() => setShowMeterModal(prop)} className="text-xs bg-slate-900 text-white px-2 py-1 rounded font-bold">+ Add Reading</button>
                      </div>
                      {prop.meterReadings.length === 0 ? <p className="text-xs text-slate-400 italic">No meter readings recorded.</p> : (
                        <div className="space-y-1">
                          {prop.meterReadings.map(m => (
                            <div key={m.id} className="text-xs flex justify-between bg-slate-50 p-1.5 rounded border">
                              <span><strong>{m.type} ({m.utility}):</strong> {m.reading}</span>
                              <span className="text-slate-400">{m.date}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* SUPPLIERS TAB */}
        {activeTab === 'suppliers' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Suppliers, Builders & Trade Directory</h2>
                <p className="text-xs text-slate-500">Gas Engineers, Plumbers, Electricians, and Builders</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contractors.map(c => (
                <div key={c.id} className="p-4 border rounded-xl bg-slate-50 space-y-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">{c.trade}</span>
                  <h3 className="font-bold text-slate-900">{c.name}</h3>
                  <p className="text-xs text-slate-600"><strong>Phone:</strong> {c.phone}</p>
                  <p className="text-xs text-slate-600"><strong>Email:</strong> {c.email}</p>
                  {c.notes && <p className="text-xs text-slate-500 bg-white p-2 rounded border"><strong>Notes:</strong> {c.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TICKETS TAB */}
        {activeTab === 'tickets' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-bold text-slate-900">Tenant Maintenance Ticket Center</h2>
              <button onClick={() => setShowNewTicketModal(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1">
                <Plus className="w-4 h-4" /> Open New Ticket
              </button>
            </div>
            <div className="space-y-3">
              {tickets.map(t => (
                <div key={t.id} className="p-4 border rounded-xl bg-slate-50 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-900">{t.issueCategory}</span>
                    <p className="font-bold text-slate-900 text-sm mt-1">{t.issueDescription}</p>
                    <p className="text-xs text-slate-500">{t.propertyAddress} ({t.date})</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded font-bold ${t.status === 'Open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FILTER MODALS (RENT DUE) */}
      {filterModal === 'rentDue' && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Rent Overdue List & Payment Controls</h3>
              <button onClick={() => setFilterModal(null)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>

            <div className="space-y-3">
              {rentDueList.length === 0 ? <p className="text-sm text-slate-500">All properties have rent fully paid!</p> : (
                rentDueList.map(p => (
                  <div key={p.id} className="p-4 border border-red-200 bg-red-50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900">{p.address}</p>
                      <p className="text-xs text-red-700">Tenant: <strong>{p.activeTenant.name}</strong> | Overdue: <strong>{p.activeTenant.daysOverdue} Days</strong></p>
                      <p className="text-xs text-slate-600">Monthly Rent: £{p.rentAmount}</p>
                    </div>
                    <button onClick={() => handleMarkRentPaid(p.id)} className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-3 py-2 rounded flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Mark Rent Paid
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-12 bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <p className="font-bold text-white text-sm">Falcon U Properties Management</p>
            <p>Office Phone: 02071835494 | Operating Hours: Mon–Fri 9:30 AM – 5:00 PM</p>
          </div>
          <div className="text-right">
            <p className="text-red-400 font-bold">Emergency Gas Leak: 0800 111999</p>
            <p className="text-red-400 font-bold">Emergency Power Failure: 105</p>
          </div>
        </div>
      </footer>
    </div>
  );
}