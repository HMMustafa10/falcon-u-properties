import React, { useState, useEffect } from 'react';
import {
  Building2, Users, Wrench, ShieldCheck, FileText,
  Plus, Trash2, Edit, CheckCircle, AlertTriangle,
  Search, Filter, Download, Mail, Phone, Upload,
  UserPlus, UserCheck, HelpCircle, Key, Calendar,
  CreditCard, ShieldAlert, FileSpreadsheet, X
} from 'lucide-react';

// Default Initial Mock Data
const initialProperties = [
  {
    id: 'P1',
    address: '12 Falcon Way, London E1 6AN',
    rentAmount: 1450,
    depositAmount: 1450,
    rentDueDate: 1, // 1st of every month
    gasCertExpiry: '2026-11-15',
    eicrExpiry: '2027-03-20',
    epcExpiry: '2028-06-10',
    insuranceExpiry: '2026-12-01',
    utilities: { gas: 'British Gas', electricity: 'Octopus Energy', water: 'Thames Water' },
    activeTenant: {
      id: 'T101',
      name: 'Muhammad Mustafa',
      email: 'mustafa@example.com',
      phone: '+44 7700 900077',
      moveInDate: '2024-01-15',
      rentStatus: 'Unpaid',
      daysOverdue: 5,
      familyMembers: [
        { name: 'Fatima Mustafa', relation: 'Spouse', visaStatus: 'Skilled Worker Dependant', visaExpiry: '2026-11-10', shareCode: 'DEF456GHI' }
      ],
      visaStatus: 'Skilled Worker',
      shareCode: 'ABC123XYZ',
      visaExpiry: '2026-11-10',
      documents: [
        { id: 'D1', name: 'Tenancy_Agreement.pdf', url: '#' },
        { id: 'D2', name: 'Gas_Safety_Certificate.pdf', url: '#' }
      ]
    }
  },
  {
    id: 'P2',
    address: '45 Station Road, Ilford IG1 4BT',
    rentAmount: 1600,
    depositAmount: 1600,
    rentDueDate: 5,
    gasCertExpiry: '2026-10-30',
    eicrExpiry: '2026-11-05',
    epcExpiry: '2029-01-15',
    insuranceExpiry: '2027-02-28',
    utilities: { gas: 'E.ON Next', electricity: 'EDF Energy', water: 'Thames Water' },
    activeTenant: {
      id: 'T102',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      phone: '+44 7700 900112',
      moveInDate: '2023-06-01',
      rentStatus: 'Paid',
      daysOverdue: 0,
      familyMembers: [],
      visaStatus: 'UK Citizen / Indefinite Leave',
      shareCode: 'N/A',
      visaExpiry: '2099-12-31',
      documents: [{ id: 'D3', name: 'Right_To_Rent_Check.pdf', url: '#' }]
    }
  }
];

const initialContractors = [
  { id: 'C1', name: 'John’s Gas & Heating', trade: 'Gas Engineer', company: 'Apex Heating Ltd', phone: '+44 7911 123456', email: 'gas@apexheating.co.uk', address: 'London E1' },
  { id: 'C2', name: 'Bright Spark Electric', trade: 'Electricity', company: 'Current Solutions', phone: '+44 7911 654321', email: 'info@brightspark.co.uk', address: 'Ilford IG1' },
  { id: 'C3', name: 'FlowRight Plumbing', trade: 'Plumbing', company: 'FlowRight Ltd', phone: '+44 7911 987654', email: 'plumb@flowright.co.uk', address: 'Barking IG11' }
];

const initialArchivedTenants = [
  { id: 'AT1', propertyAddress: '12 Falcon Way', name: 'David Smith', moveInDate: '2021-01-01', moveOutDate: '2023-12-31', reason: 'End of Tenancy' }
];

const initialTickets = [
  { id: 'TK1', propertyAddress: '12 Falcon Way, London E1 6AN', tenantName: 'Muhammad Mustafa', issue: 'Boiler leaking water in kitchen', date: '2026-10-25', status: 'Open', priority: 'High' }
];

export default function App() {
  // Persistence state v18
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('falcon_u_properties_v18');
    return saved ? JSON.parse(saved) : initialProperties;
  });

  const [contractors, setContractors] = useState(() => {
    const saved = localStorage.getItem('falcon_u_contractors_v18');
    return saved ? JSON.parse(saved) : initialContractors;
  });

  const [archivedTenants, setArchivedTenants] = useState(() => {
    const saved = localStorage.getItem('falcon_u_archived_v18');
    return saved ? JSON.parse(saved) : initialArchivedTenants;
  });

  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('falcon_u_tickets_v18');
    return saved ? JSON.parse(saved) : initialTickets;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [filterModal, setFilterModal] = useState(null); // 'rentDue', 'certDue', 'visaDue', 'insuranceDue', 'complaints'
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isEditingTenant, setIsEditingTenant] = useState(false);
  const [tenantFormData, setTenantFormData] = useState(null);

  // Contractor Form State
  const [showAddContractor, setShowAddContractor] = useState(false);
  const [newContractor, setNewContractor] = useState({ name: '', company: '', trade: 'Gas Engineer', phone: '', email: '', address: '' });

  // Ticket Form State
  const [showAddTicket, setShowAddTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({ propertyAddress: '', tenantName: '', issue: '', priority: 'Medium' });

  // Sync state to LocalStorage
  useEffect(() => { localStorage.setItem('falcon_u_properties_v18', JSON.stringify(properties)); }, [properties]);
  useEffect(() => { localStorage.setItem('falcon_u_contractors_v18', JSON.stringify(contractors)); }, [contractors]);
  useEffect(() => { localStorage.setItem('falcon_u_archived_v18', JSON.stringify(archivedTenants)); }, [archivedTenants]);
  useEffect(() => { localStorage.setItem('falcon_u_tickets_v18', JSON.stringify(tickets)); }, [tickets]);

  // Derived Alerts Counters
  const rentDueList = properties.filter(p => p.activeTenant && p.activeTenant.rentStatus === 'Unpaid');
  const visaDueList = properties.filter(p => {
    if (!p.activeTenant) return false;
    const exp = new Date(p.activeTenant.visaExpiry);
    const today = new Date();
    const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 60; // Due within 60 days
  });
  const certDueList = properties.filter(p => {
    const checkCert = (d) => Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24)) <= 45;
    return checkCert(p.gasCertExpiry) || checkCert(p.eicrExpiry) || checkCert(p.epcExpiry);
  });
  const insuranceDueList = properties.filter(p => Math.ceil((new Date(p.insuranceExpiry) - new Date()) / (1000 * 60 * 60 * 24)) <= 45);
  const openTicketsList = tickets.filter(t => t.status === 'Open');

  // Tenant Editing Handlers
  const handleOpenEditTenant = (property) => {
    setSelectedProperty(property);
    setTenantFormData(JSON.parse(JSON.stringify(property.activeTenant || {
      id: 'T' + Date.now(),
      name: '', email: '', phone: '', moveInDate: new Date().toISOString().split('T')[0],
      rentStatus: 'Paid', daysOverdue: 0, visaStatus: 'Skilled Worker', shareCode: '',
      visaExpiry: '2027-01-01', familyMembers: [], documents: []
    })));
    setIsEditingTenant(true);
  };

  const handleSaveTenant = () => {
    setProperties(prev => prev.map(p => {
      if (p.id === selectedProperty.id) {
        return { ...p, activeTenant: tenantFormData };
      }
      return p;
    }));
    setIsEditingTenant(false);
    setSelectedProperty(null);
  };

  const handleDeleteTenant = (propertyId) => {
    if (window.confirm('Are you sure you want to remove and archive this tenant?')) {
      const prop = properties.find(p => p.id === propertyId);
      if (prop && prop.activeTenant) {
        const archivedRecord = {
          id: 'AT' + Date.now(),
          propertyAddress: prop.address,
          name: prop.activeTenant.name,
          moveInDate: prop.activeTenant.moveInDate,
          moveOutDate: new Date().toISOString().split('T')[0],
          reason: 'Tenant Removed / Vacated'
        };
        setArchivedTenants(prev => [...prev, archivedRecord]);
      }
      setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, activeTenant: null } : p));
      setIsEditingTenant(false);
      setSelectedProperty(null);
    }
  };

  const handleAddFamilyMember = () => {
    setTenantFormData(prev => ({
      ...prev,
      familyMembers: [...prev.familyMembers, { name: '', relation: '', visaStatus: '', visaExpiry: '', shareCode: '' }]
    }));
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newDoc = { id: 'D' + Date.now(), name: file.name, url: '#' };
      setTenantFormData(prev => ({ ...prev, documents: [...prev.documents, newDoc] }));
    }
  };

  const handleAddContractor = (e) => {
    e.preventDefault();
    setContractors(prev => [...prev, { ...newContractor, id: 'C' + Date.now() }]);
    setNewContractor({ name: '', company: '', trade: 'Gas Engineer', phone: '', email: '', address: '' });
    setShowAddContractor(false);
  };

  const handleAddTicket = (e) => {
    e.preventDefault();
    setTickets(prev => [...prev, { ...newTicket, id: 'TK' + Date.now(), date: new Date().toISOString().split('T')[0], status: 'Open' }]);
    setNewTicket({ propertyAddress: '', tenantName: '', issue: '', priority: 'Medium' });
    setShowAddTicket(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-12">
      {/* Top Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-2xl font-bold tracking-wide">FALCON U PROPERTIES</h1>
              <p className="text-xs text-amber-400 font-medium">Enterprise Portfolio & Tenant Compliance Portal</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'dashboard' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700'}`}>Dashboard</button>
            <button onClick={() => setActiveTab('contractors')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'contractors' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700'}`}>Suppliers & Builders</button>
            <button onClick={() => setActiveTab('archived')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'archived' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700'}`}>Tenant Vault (History)</button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 mt-6">
        {/* Top Summary Alert Ribbon */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div onClick={() => setFilterModal('rentDue')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-red-400 transition">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase">Rent Due</span>
              <CreditCard className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-2xl font-extrabold text-red-600 mt-2">{rentDueList.length}</p>
            <span className="text-xs text-slate-400">Click to view overdue list</span>
          </div>

          <div onClick={() => setFilterModal('certDue')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-amber-400 transition">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase">Certificates Due</span>
              <ShieldAlert className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-2xl font-extrabold text-amber-600 mt-2">{certDueList.length}</p>
            <span className="text-xs text-slate-400">Gas, EICR & EPC checks</span>
          </div>

          <div onClick={() => setFilterModal('visaDue')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-blue-400 transition">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase">Visa Expiry Due</span>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-extrabold text-blue-600 mt-2">{visaDueList.length}</p>
            <span className="text-xs text-slate-400">Sharecode & Right-to-Rent</span>
          </div>

          <div onClick={() => setFilterModal('insuranceDue')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-purple-400 transition">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase">Insurance Due</span>
              <ShieldCheck className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-extrabold text-purple-600 mt-2">{insuranceDueList.length}</p>
            <span className="text-xs text-slate-400">Property coverage renewal</span>
          </div>

          <div onClick={() => setFilterModal('complaints')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-orange-400 transition">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase">Tickets & Complaints</span>
              <Wrench className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-2xl font-extrabold text-orange-600 mt-2">{openTicketsList.length}</p>
            <span className="text-xs text-slate-400">Open maintenance requests</span>
          </div>
        </section>

        {/* Tab Content: MAIN DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Active Property Portfolio ({properties.length} Units)</h2>
              <button onClick={() => {
                const newProp = {
                  id: 'P' + (properties.length + 1),
                  address: `Unit ${properties.length + 101} - New Falcon Property`,
                  rentAmount: 1500, depositAmount: 1500, rentDueDate: 1,
                  gasCertExpiry: '2027-01-01', eicrExpiry: '2027-01-01', epcExpiry: '2029-01-01', insuranceExpiry: '2027-01-01',
                  utilities: { gas: 'British Gas', electricity: 'Octopus', water: 'Thames Water' },
                  activeTenant: null
                };
                setProperties([...properties, newProp]);
              }} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add New Property Unit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((prop) => (
                <div key={prop.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{prop.address}</h3>
                        <p className="text-xs text-slate-500">Rent: £{prop.rentAmount}/mo | Deposit: £{prop.depositAmount} | Due: {prop.rentDueDate}st/mo</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${prop.activeTenant ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                        {prop.activeTenant ? 'Occupied' : 'Vacant'}
                      </span>
                    </div>

                    {/* Utilities Information */}
                    <div className="bg-slate-50 p-3 rounded-lg mb-4 text-xs space-y-1">
                      <p className="font-bold text-slate-700">Suppliers:</p>
                      <p><strong>Gas:</strong> {prop.utilities.gas} | <strong>Elec:</strong> {prop.utilities.electricity} | <strong>Water:</strong> {prop.utilities.water}</p>
                    </div>

                    {/* Active Tenant Information */}
                    {prop.activeTenant ? (
                      <div className="border-t border-slate-100 pt-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-bold text-slate-800">{prop.activeTenant.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded font-bold ${prop.activeTenant.rentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {prop.activeTenant.rentStatus === 'Paid' ? 'Rent Paid' : `Overdue (${prop.activeTenant.daysOverdue} Days)`}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500"><strong>Contact:</strong> {prop.activeTenant.email} | {prop.activeTenant.phone}</p>
                        <p className="text-xs text-slate-500"><strong>Visa:</strong> {prop.activeTenant.visaStatus} (Exp: {prop.activeTenant.visaExpiry})</p>
                        <p className="text-xs text-slate-500"><strong>Share Code:</strong> {prop.activeTenant.shareCode}</p>

                        {/* Family Members */}
                        {prop.activeTenant.familyMembers && prop.activeTenant.familyMembers.length > 0 && (
                          <div className="bg-amber-50 p-2 rounded text-xs mt-2">
                            <p className="font-bold text-amber-900">Family Members ({prop.activeTenant.familyMembers.length}):</p>
                            {prop.activeTenant.familyMembers.map((fam, idx) => (
                              <p key={idx} className="text-amber-800">{fam.name} ({fam.relation}) - Visa Exp: {fam.visaExpiry}</p>
                            ))}
                          </div>
                        )}

                        {/* Legal Documents */}
                        <div className="mt-3">
                          <p className="text-xs font-bold text-slate-700 mb-1">Uploaded Documents:</p>
                          <div className="flex flex-wrap gap-2">
                            {prop.activeTenant.documents && prop.activeTenant.documents.map(doc => (
                              <a key={doc.id} href={doc.url} download className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded flex items-center gap-1 border">
                                <Download className="w-3 h-3" /> {doc.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border-t border-slate-100 pt-3 text-center py-4">
                        <p className="text-xs text-slate-400 italic">No Active Tenant Assigned</p>
                      </div>
                    )}
                  </div>

                  {/* Property Action Bar */}
                  <div className="border-t border-slate-100 mt-4 pt-3 flex justify-between gap-2">
                    <button onClick={() => handleOpenEditTenant(prop)} className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold py-1.5 rounded text-xs flex items-center justify-center gap-1">
                      <Edit className="w-3.5 h-3.5" /> Manage / Edit Tenant
                    </button>
                    {prop.activeTenant && (
                      <a href={`mailto:${prop.activeTenant.email}?subject=Falcon%20U%20Properties%20Notice&body=Dear%20${prop.activeTenant.name},`} className="bg-slate-800 hover:bg-slate-900 text-white p-1.5 rounded text-xs flex items-center justify-center">
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: CONTRACTORS & SUPPLIERS */}
        {activeTab === 'contractors' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Contractors, Suppliers & Builders</h2>
                <p className="text-xs text-slate-500">Emergency contacts for Gas, Electrical, Plumbing, Carpentry, and Builders</p>
              </div>
              <button onClick={() => setShowAddContractor(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add New Supplier / Contractor
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contractors.map(c => (
                <div key={c.id} className="p-4 border rounded-lg bg-slate-50 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">{c.trade}</span>
                    <button onClick={() => setContractors(contractors.filter(item => item.id !== c.id))} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-bold text-slate-900">{c.name}</h3>
                  <p className="text-xs text-slate-600"><strong>Company:</strong> {c.company}</p>
                  <p className="text-xs text-slate-600"><strong>Phone:</strong> {c.phone}</p>
                  <p className="text-xs text-slate-600"><strong>Email:</strong> {c.email}</p>
                  <p className="text-xs text-slate-600"><strong>Address:</strong> {c.address}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: ARCHIVED TENANTS */}
        {activeTab === 'archived' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Previous Tenant History Vault</h2>
            <p className="text-xs text-slate-500 mb-6">Historical records of all past tenancies across Falcon U Properties</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="p-3 border">Property Address</th>
                    <th className="p-3 border">Tenant Name</th>
                    <th className="p-3 border">Move-In Date</th>
                    <th className="p-3 border">Move-Out Date</th>
                    <th className="p-3 border">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {archivedTenants.map(at => (
                    <tr key={at.id} className="border-b hover:bg-slate-50">
                      <td className="p-3 border font-medium">{at.propertyAddress}</td>
                      <td className="p-3 border">{at.name}</td>
                      <td className="p-3 border">{at.moveInDate}</td>
                      <td className="p-3 border">{at.moveOutDate}</td>
                      <td className="p-3 border text-slate-500">{at.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* FILTER MODALS (Rent Due, Cert Due, Visa Expiry, Insurance, Complaints) */}
      {filterModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {filterModal === 'rentDue' && 'Rent Overdue Details & Notifications'}
                {filterModal === 'certDue' && 'Property Certificates Due'}
                {filterModal === 'visaDue' && 'Tenant Visa & Right to Rent Expiries'}
                {filterModal === 'insuranceDue' && 'Property Insurance Renewals'}
                {filterModal === 'complaints' && 'Maintenance Tickets & Complaints'}
              </h3>
              <button onClick={() => setFilterModal(null)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>

            {/* Rent Due Modal View */}
            {filterModal === 'rentDue' && (
              <div className="space-y-4">
                {rentDueList.length === 0 ? <p className="text-sm text-slate-500">No overdue rent balances recorded.</p> : (
                  rentDueList.map(p => (
                    <div key={p.id} className="p-4 border border-red-200 bg-red-50 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900">{p.address}</p>
                        <p className="text-xs text-red-700">Tenant: <strong>{p.activeTenant.name}</strong> | Overdue: <strong>{p.activeTenant.daysOverdue} Days</strong></p>
                        <p className="text-xs text-slate-600">Monthly Rent: £{p.rentAmount}</p>
                      </div>
                      <a href={`mailto:${p.activeTenant.email}?subject=URGENT:%20Rent%20Payment%20Overdue%20Notice&body=Dear%20${p.activeTenant.name},%0A%0AOur%20records%20indicate%20that%20your%20rent%20payment%20for%20${p.address}%20is%20overdue%20by%20${p.activeTenant.daysOverdue}%20days.%20Please%20arrange%20payment%20immediately.`} className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 rounded flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" /> Send Overdue Email
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Complaints Modal View */}
            {filterModal === 'complaints' && (
              <div>
                <div className="flex justify-end mb-4">
                  <button onClick={() => setShowAddTicket(true)} className="bg-slate-900 text-white px-3 py-1.5 rounded text-xs flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Log New Ticket
                  </button>
                </div>
                <div className="space-y-3">
                  {tickets.map(t => (
                    <div key={t.id} className="p-3 border rounded-lg flex justify-between items-center bg-slate-50">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{t.issue}</p>
                        <p className="text-xs text-slate-500">{t.propertyAddress} - {t.tenantName} ({t.date})</p>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded bg-amber-100 text-amber-800">{t.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Alert Modal Fallbacks */}
            {(filterModal === 'certDue' || filterModal === 'visaDue' || filterModal === 'insuranceDue') && (
              <div className="space-y-3">
                {filterModal === 'visaDue' && visaDueList.map(p => (
                  <div key={p.id} className="p-3 border rounded bg-blue-50">
                    <p className="font-bold text-slate-900">{p.activeTenant.name} ({p.address})</p>
                    <p className="text-xs text-blue-900">Visa Expiry: {p.activeTenant.visaExpiry} | Sharecode: {p.activeTenant.shareCode}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* EDIT TENANT MODAL */}
      {isEditingTenant && tenantFormData && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Tenant Management: {selectedProperty.address}</h3>
              <button onClick={() => setIsEditingTenant(false)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <label className="text-xs font-bold text-slate-700">Tenant Name</label>
                <input type="text" value={tenantFormData.name} onChange={e => setTenantFormData({...tenantFormData, name: e.target.value})} className="w-full border p-2 rounded mt-1 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <input type="email" value={tenantFormData.email} onChange={e => setTenantFormData({...tenantFormData, email: e.target.value})} className="w-full border p-2 rounded mt-1 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Phone Number</label>
                <input type="text" value={tenantFormData.phone} onChange={e => setTenantFormData({...tenantFormData, phone: e.target.value})} className="w-full border p-2 rounded mt-1 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Rent Status</label>
                <select value={tenantFormData.rentStatus} onChange={e => setTenantFormData({...tenantFormData, rentStatus: e.target.value})} className="w-full border p-2 rounded mt-1 text-sm">
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid / Overdue</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Visa / Immigration Status</label>
                <input type="text" value={tenantFormData.visaStatus} onChange={e => setTenantFormData({...tenantFormData, visaStatus: e.target.value})} className="w-full border p-2 rounded mt-1 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Share Code</label>
                <input type="text" value={tenantFormData.shareCode} onChange={e => setTenantFormData({...tenantFormData, shareCode: e.target.value})} className="w-full border p-2 rounded mt-1 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Visa Expiry Date</label>
                <input type="date" value={tenantFormData.visaExpiry} onChange={e => setTenantFormData({...tenantFormData, visaExpiry: e.target.value})} className="w-full border p-2 rounded mt-1 text-sm" />
              </div>
            </div>

            {/* Family Details Section */}
            <div className="border-t pt-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-sm text-slate-800">Family Members / Dependants</h4>
                <button type="button" onClick={handleAddFamilyMember} className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded font-bold">+ Add Family Member</button>
              </div>
              {tenantFormData.familyMembers.map((fam, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded mb-2 text-xs">
                  <input type="text" placeholder="Name" value={fam.name} onChange={e => {
                    const copy = [...tenantFormData.familyMembers];
                    copy[idx].name = e.target.value;
                    setTenantFormData({...tenantFormData, familyMembers: copy});
                  }} className="border p-1 rounded" />
                  <input type="text" placeholder="Relation" value={fam.relation} onChange={e => {
                    const copy = [...tenantFormData.familyMembers];
                    copy[idx].relation = e.target.value;
                    setTenantFormData({...tenantFormData, familyMembers: copy});
                  }} className="border p-1 rounded" />
                  <input type="date" value={fam.visaExpiry} onChange={e => {
                    const copy = [...tenantFormData.familyMembers];
                    copy[idx].visaExpiry = e.target.value;
                    setTenantFormData({...tenantFormData, familyMembers: copy});
                  }} className="border p-1 rounded" />
                </div>
              ))}
            </div>

            {/* Document Upload */}
            <div className="border-t pt-3">
              <label className="text-xs font-bold text-slate-700 block mb-1">Upload Legal Documents (PDF/JPG)</label>
              <input type="file" onChange={handleDocumentUpload} className="text-xs" />
            </div>

            {/* Action Bar */}
            <div className="border-t pt-4 flex justify-between items-center">
              <button onClick={() => handleDeleteTenant(selectedProperty.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-2 rounded flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" /> Remove & Archive Tenant
              </button>
              <div className="flex gap-2">
                <button onClick={() => setIsEditingTenant(false)} className="bg-slate-200 text-slate-700 px-3 py-2 rounded text-xs font-bold">Cancel</button>
                <button onClick={handleSaveTenant} className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded text-xs font-bold">Save All Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD CONTRACTOR MODAL */}
      {showAddContractor && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddContractor} className="bg-white rounded-xl max-w-md w-full p-6 space-y-3 text-sm">
            <h3 className="font-bold text-lg text-slate-900 mb-2">Add New Supplier / Contractor</h3>
            <input required type="text" placeholder="Contact Name" value={newContractor.name} onChange={e => setNewContractor({...newContractor, name: e.target.value})} className="w-full border p-2 rounded" />
            <input required type="text" placeholder="Company Name" value={newContractor.company} onChange={e => setNewContractor({...newContractor, company: e.target.value})} className="w-full border p-2 rounded" />
            <select value={newContractor.trade} onChange={e => setNewContractor({...newContractor, trade: e.target.value})} className="w-full border p-2 rounded">
              <option value="Gas Engineer">Gas Engineer</option>
              <option value="Electricity">Electricity / Electrician</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Builder">General Builder</option>
              <option value="Water Supplier">Water Supplier</option>
            </select>
            <input required type="text" placeholder="Phone Number" value={newContractor.phone} onChange={e => setNewContractor({...newContractor, phone: e.target.value})} className="w-full border p-2 rounded" />
            <input required type="email" placeholder="Email Address" value={newContractor.email} onChange={e => setNewContractor({...newContractor, email: e.target.value})} className="w-full border p-2 rounded" />
            <input type="text" placeholder="Address" value={newContractor.address} onChange={e => setNewContractor({...newContractor, address: e.target.value})} className="w-full border p-2 rounded" />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAddContractor(false)} className="px-3 py-1.5 border rounded">Cancel</button>
              <button type="submit" className="bg-slate-900 text-white px-4 py-1.5 rounded font-bold">Save Contact</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}