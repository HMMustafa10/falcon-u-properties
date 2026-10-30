import React, { useState, useEffect } from 'react';
import {
  Building2, Users, Wrench, ShieldCheck, FileText,
  Plus, Trash2, Edit, CheckCircle, AlertTriangle,
  Search, Filter, Download, Mail, Phone, Upload,
  Key, Calendar, CreditCard, ShieldAlert, X,
  ArrowLeft, Clock, Gauge, FileImage, UserCheck,
  Building, Briefcase, Lock, LogIn, UserPlus, LogOut,
  ChevronDown, HelpCircle, Eye, Send, FileSpreadsheet
} from 'lucide-react';

// Initial Master Dataset
const initialProperties = [
  {
    id: 'P1',
    address: '12 Falcon Way, London E1 6AN',
    type: 'Flat',
    rentAmount: 1450,
    depositAmount: 1450,
    depositSupplier: 'DPS (Deposit Protection Service)',
    contractParty: 'Falcon U Properties Ltd & Muhammad Mustafa',
    contractType: 'Assured Shorthold Tenancy (AST)',
    rentDueDate: 1,
    councilTaxBand: 'Band C',
    amenities: { garden: 'Yes (Private)', parking: '1 Space', loft: 'No', basement: 'No', furnishing: 'Fully Furnished' },
    insurance: {
      provider: 'Aviva Landlord Policy',
      policyNumber: 'AV-992011',
      premiumPaid: 450,
      expiryDate: '2026-12-01',
      status: 'Active'
    },
    certificates: [
      { id: 'C1', type: 'Gas Safety (CP12)', refNo: 'GAS-88219', expiryDate: '2026-11-15', status: 'Expiring Soon' },
      { id: 'C2', type: 'EICR Electrical Safety', refNo: 'EICR-99120', expiryDate: '2027-03-20', status: 'Valid' },
      { id: 'C3', type: 'EPC Certificate', refNo: 'EPC-11204', expiryDate: '2028-06-10', status: 'Valid' },
      { id: 'C4', type: 'Selective Licensing', refNo: 'LIC-7721', expiryDate: '2029-01-01', status: 'Valid' }
    ],
    utilities: { gas: 'British Gas', electricity: 'Octopus Energy', water: 'Thames Water' },
    meterReadings: [
      { id: 'M1', type: 'Opening', utility: 'Electricity', reading: '14230 kWh', date: '2024-01-15' },
      { id: 'M2', type: 'Opening', utility: 'Gas', reading: '08120 m³', date: '2024-01-15' }
    ],
    documents: [
      { id: 'D1', name: 'Tenancy_Agreement_AST.pdf', type: 'pdf', url: '#' },
      { id: 'D2', name: 'Gas_Safety_Certificate.pdf', type: 'pdf', url: '#' }
    ],
    activeTenant: {
      id: 'T101',
      name: 'Muhammad Mustafa',
      email: 'mustafa@example.com',
      phone: '+44 7700 900077',
      passportNumber: 'GB123456789',
      origin: 'United Kingdom',
      jobStatus: 'Employed (Full-Time Engineer)',
      moveInDate: '2024-01-15',
      rentStatus: 'Unpaid',
      daysOverdue: 5,
      visaStatus: 'UK Citizen',
      shareCode: 'N/A',
      visaExpiry: '2099-12-31',
      notes: 'Tenant discussed potential rent increase adjustment in Q4.',
      familyMembers: [
        { name: 'Fatima Mustafa', relation: 'Spouse', visaStatus: 'Skilled Worker Dependant', visaExpiry: '2026-11-10', shareCode: 'DEF456GHI' }
      ]
    }
  },
  {
    id: 'P2',
    address: '88 Commercial Road, London E1 1RD',
    type: 'Commercial',
    rentAmount: 3200,
    depositAmount: 6400,
    depositSupplier: 'MyDeposits Vault',
    contractParty: 'Falcon U Properties Ltd & Falcon Express Ltd',
    contractType: 'Full Repairing & Insuring (FRI) Lease',
    rentDueDate: 1,
    councilTaxBand: 'N/A (Business Rates)',
    amenities: { garden: 'No', parking: '2 Loading Bays', loft: 'No', basement: 'Yes (Storage Vault)', furnishing: 'Unfurnished' },
    insurance: {
      provider: 'AXA Commercial Property',
      policyNumber: 'AX-77210',
      premiumPaid: 1250,
      expiryDate: '2027-05-15',
      status: 'Active'
    },
    certificates: [
      { id: 'C5', type: 'Commercial Gas CP12', refNo: 'CGAS-9912', expiryDate: '2027-01-10', status: 'Valid' },
      { id: 'C6', type: 'Commercial EICR (5-Year)', refNo: 'CEICR-4410', expiryDate: '2028-02-14', status: 'Valid' }
    ],
    utilities: { gas: 'Commercial Gas Ltd', electricity: 'E.ON Commercial', water: 'Thames Water' },
    meterReadings: [
      { id: 'M3', type: 'Opening', utility: 'Electricity', reading: '99410 kWh', date: '2022-01-01' }
    ],
    documents: [
      { id: 'D3', name: 'Commercial_Lease_Agreement.pdf', type: 'pdf', url: '#' }
    ],
    activeTenant: {
      id: 'T102',
      name: 'John Miller (Director)',
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
      notes: '10-Year commercial lease agreement.',
      familyMembers: []
    }
  }
];

const initialContractors = [
  { id: 'C1', name: 'John’s Gas & Heating', trade: 'Gas Engineer', company: 'Apex Heating Ltd', phone: '+44 7911 123456', email: 'gas@apexheating.co.uk', address: 'London E1', notes: 'Gas Safe Reg #55412.' },
  { id: 'C2', name: 'Bright Spark Electric', trade: 'Electricity', company: 'Current Solutions Ltd', phone: '+44 7911 654321', email: 'info@brightspark.co.uk', address: 'Ilford IG1', notes: 'NICEIC Registered.' },
  { id: 'C3', name: 'FlowRight Plumbing', trade: 'Plumbing', company: 'FlowRight Ltd', phone: '+44 7911 987654', email: 'plumb@flowright.co.uk', address: 'Barking IG11', notes: 'Emergency pipe repair specialist.' }
];

const initialArchivedTenants = [
  { id: 'AT1', propertyAddress: '12 Falcon Way, London E1 6AN', name: 'David Smith', moveInDate: '2021-01-01', moveOutDate: '2023-12-31', reason: 'End of AST Tenancy Period' }
];

const initialTickets = [
  { id: 'TK1', propertyId: 'P1', propertyAddress: '12 Falcon Way, London E1 6AN', tenantName: 'Muhammad Mustafa', issueCategory: 'Plumbing', issueDescription: 'Kitchen sink dripping water.', date: '2026-10-25', status: 'Open', priority: 'Medium' }
];

export default function App() {
  // LocalStorage State v26
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('falcon_u_properties_v26');
    return saved ? JSON.parse(saved) : initialProperties;
  });

  const [contractors, setContractors] = useState(() => {
    const saved = localStorage.getItem('falcon_u_contractors_v26');
    return saved ? JSON.parse(saved) : initialContractors;
  });

  const [archivedTenants, setArchivedTenants] = useState(() => {
    const saved = localStorage.getItem('falcon_u_archived_v26');
    return saved ? JSON.parse(saved) : initialArchivedTenants;
  });

  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('falcon_u_tickets_v26');
    return saved ? JSON.parse(saved) : initialTickets;
  });

  // Role & Engine Navigation
  const [userRole, setUserRole] = useState('landlord'); // 'landlord', 'agent', 'tenant'
  const [activeEngine, setActiveEngine] = useState('dashboard'); // 'dashboard', 'rentOverdue', 'insurance', 'certificates', 'specs', 'suppliers', 'tickets', 'archived'
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [certFilter, setCertFilter] = useState('all'); // 'all', 'expiring', 'expired'

  // Modals & Editing State
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isEditingTenant, setIsEditingTenant] = useState(false);
  const [tenantFormData, setTenantFormData] = useState(null);

  const [editingInsuranceProp, setEditingInsuranceProp] = useState(null);
  const [insuranceForm, setInsuranceForm] = useState({ provider: '', policyNumber: '', premiumPaid: 0, expiryDate: '' });

  const [editingContractor, setEditingContractor] = useState(null);
  const [showAddContractor, setShowAddContractor] = useState(false);
  const [contractorForm, setContractorForm] = useState({ name: '', company: '', trade: 'Gas Engineer', phone: '', email: '', address: '', notes: '' });

  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState(null);
  const [newDocName, setNewDocName] = useState('');

  const [showMeterModal, setShowMeterModal] = useState(null);
  const [meterForm, setMeterForm] = useState({ type: 'Opening', utility: 'Electricity', reading: '' });

  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({ issueCategory: 'Plumbing', issueDescription: '' });

  const [newPropForm, setNewPropForm] = useState({
    address: '', type: 'Flat', rentAmount: 1200, depositAmount: 1200, depositSupplier: 'DPS',
    contractParty: 'Falcon U Properties Ltd & Tenant Name', contractType: 'Assured Shorthold Tenancy (AST)',
    councilTaxBand: 'Band B', furnishing: 'Unfurnished'
  });

  // LocalStorage Sync
  useEffect(() => { localStorage.setItem('falcon_u_properties_v26', JSON.stringify(properties)); }, [properties]);
  useEffect(() => { localStorage.setItem('falcon_u_contractors_v26', JSON.stringify(contractors)); }, [contractors]);
  useEffect(() => { localStorage.setItem('falcon_u_archived_v26', JSON.stringify(archivedTenants)); }, [archivedTenants]);
  useEffect(() => { localStorage.setItem('falcon_u_tickets_v26', JSON.stringify(tickets)); }, [tickets]);

  // Alert Metrics
  const rentDueList = properties.filter(p => p.activeTenant && p.activeTenant.rentStatus === 'Unpaid');
  const certDueList = properties.filter(p => p.certificates.some(c => c.status === 'Expiring Soon' || c.status === 'Expired'));
  const insuranceDueList = properties.filter(p => {
    const diffDays = Math.ceil((new Date(p.insurance.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return diffDays <= 60;
  });
  const openTickets = tickets.filter(t => t.status === 'Open');

  // Actions
  const handleMarkRentPaid = (propertyId) => {
    setProperties(properties.map(p => {
      if (p.id === propertyId && p.activeTenant) {
        return { ...p, activeTenant: { ...p.activeTenant, rentStatus: 'Paid', daysOverdue: 0 } };
      }
      return p;
    }));
  };

  const handleSaveTenant = () => {
    setProperties(properties.map(p => p.id === selectedProperty.id ? { ...p, activeTenant: tenantFormData } : p));
    setIsEditingTenant(false);
  };

  const handleDeleteTenant = (propertyId) => {
    if (window.confirm('Are you sure you want to remove and archive this tenant?')) {
      const prop = properties.find(p => p.id === propertyId);
      if (prop && prop.activeTenant) {
        setArchivedTenants([...archivedTenants, {
          id: 'AT' + Date.now(),
          propertyAddress: prop.address,
          name: prop.activeTenant.name,
          moveInDate: prop.activeTenant.moveInDate,
          moveOutDate: new Date().toISOString().split('T')[0],
          reason: 'Tenant Vacated / Account Removed'
        }]);
      }
      setProperties(properties.map(p => p.id === propertyId ? { ...p, activeTenant: null } : p));
      setIsEditingTenant(false);
    }
  };

  const handleAddFamilyMember = () => {
    setTenantFormData(prev => ({
      ...prev,
      familyMembers: [...(prev.familyMembers || []), { name: '', relation: '', visaStatus: 'Skilled Worker Dependant', visaExpiry: '2027-01-01', shareCode: '' }]
    }));
  };

  const handleSaveInsurance = (e) => {
    e.preventDefault();
    setProperties(properties.map(p => p.id === editingInsuranceProp.id ? { ...p, insurance: { ...insuranceForm, status: 'Active' } } : p));
    setEditingInsuranceProp(null);
  };

  const handleSaveContractor = (e) => {
    e.preventDefault();
    if (editingContractor) {
      setContractors(contractors.map(c => c.id === editingContractor.id ? { ...contractorForm, id: c.id } : c));
      setEditingContractor(null);
    } else {
      setContractors([...contractors, { ...contractorForm, id: 'C' + Date.now() }]);
      setShowAddContractor(false);
    }
    setContractorForm({ name: '', company: '', trade: 'Gas Engineer', phone: '', email: '', address: '', notes: '' });
  };

  const handleAddProperty = (e) => {
    e.preventDefault();
    const newProp = {
      id: 'P' + (properties.length + 1),
      address: newPropForm.address,
      type: newPropForm.type,
      rentAmount: Number(newPropForm.rentAmount),
      depositAmount: Number(newPropForm.depositAmount),
      depositSupplier: newPropForm.depositSupplier,
      contractParty: newPropForm.contractParty,
      contractType: newPropForm.contractType,
      rentDueDate: 1,
      councilTaxBand: newPropForm.councilTaxBand,
      amenities: { garden: 'No', parking: 'None', loft: 'No', basement: 'No', furnishing: newPropForm.furnishing },
      insurance: { provider: 'Pending', policyNumber: 'N/A', premiumPaid: 0, expiryDate: '2027-01-01', status: 'Active' },
      certificates: [],
      utilities: { gas: 'TBD', electricity: 'TBD', water: 'TBD' },
      meterReadings: [],
      documents: [],
      activeTenant: null
    };
    setProperties([...properties, newProp]);
    setShowAddPropertyModal(false);
  };

  const handleUploadDocument = (e) => {
    e.preventDefault();
    if (!newDocName) return;
    const docObj = { id: 'D' + Date.now(), name: newDocName, type: 'pdf', url: '#' };
    setProperties(properties.map(p => p.id === showUploadDocModal.id ? { ...p, documents: [...p.documents, docObj] } : p));
    setShowUploadDocModal(null);
    setNewDocName('');
  };

  const handleAddMeterReading = (e) => {
    e.preventDefault();
    const readingObj = { id: 'M' + Date.now(), ...meterForm, date: new Date().toISOString().split('T')[0] };
    setProperties(properties.map(p => p.id === showMeterModal.id ? { ...p, meterReadings: [...p.meterReadings, readingObj] } : p));
    setShowMeterModal(null);
    setMeterForm({ type: 'Opening', utility: 'Electricity', reading: '' });
  };

  const handleCreateTicket = (e) => {
    e.preventDefault();
    const ticketObj = {
      id: 'TK' + Date.now(),
      propertyId: 'P1',
      propertyAddress: '12 Falcon Way, London E1 6AN',
      tenantName: 'Muhammad Mustafa',
      issueCategory: ticketForm.issueCategory,
      issueDescription: ticketForm.issueDescription,
      date: new Date().toISOString().split('T')[0],
      status: 'Open',
      priority: 'Medium'
    };
    setTickets([...tickets, ticketObj]);
    setShowNewTicketModal(false);
    setTicketForm({ issueCategory: 'Plumbing', issueDescription: '' });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-16">
      {/* Top Header Bar */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-2xl font-bold tracking-wide">FALCON U PROPERTIES</h1>
              <p className="text-xs text-amber-400">Enterprise Real Estate & Compliance Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {userRole !== 'tenant' && (
              <button onClick={() => setShowAddPropertyModal(true)} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow">
                <Plus className="w-4 h-4" /> Add New Property Unit
              </button>
            )}
            <select
              value={userRole}
              onChange={(e) => { setUserRole(e.target.value); setActiveEngine('dashboard'); }}
              className="bg-slate-800 text-amber-400 border border-amber-500/40 text-xs font-bold py-1.5 px-3 rounded-lg"
            >
              <option value="landlord">👑 Landlord Portal (Full Access)</option>
              <option value="agent">🏢 Agent Portal (Managed View)</option>
              <option value="tenant">👤 Tenant Portal (Self-Service View)</option>
            </select>
          </div>
        </div>

        {/* Global Navigation Dropdown Menu */}
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center text-xs bg-slate-950/90">
          <div className="relative">
            <button onClick={() => setIsNavDropdownOpen(!isNavDropdownOpen)} className="bg-amber-500 text-slate-950 font-bold px-4 py-1.5 rounded-lg flex items-center gap-2 shadow">
              Navigation & Modules Menu <ChevronDown className="w-4 h-4" />
            </button>

            {isNavDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-slate-900 text-white border border-slate-700 rounded-lg shadow-2xl w-72 z-50 py-2">
                <button onClick={() => { setActiveEngine('dashboard'); setIsNavDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-800 font-bold text-amber-400 border-b border-slate-800">🏠 Main Dashboard Home</button>
                <button onClick={() => { setActiveEngine('rentOverdue'); setIsNavDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-800 text-red-400 font-bold">🚨 Rent Overdue & Payment Reminders ({rentDueList.length})</button>
                <button onClick={() => { setActiveEngine('insurance'); setIsNavDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-800">🛡️ Insurance Management Engine</button>
                <button onClick={() => { setActiveEngine('certificates'); setIsNavDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-800">📜 Certificates & Compliance Engine</button>
                <button onClick={() => { setActiveEngine('specs'); setIsNavDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-800">🏡 UK Property Specs & Council Tax</button>
                <button onClick={() => { setActiveEngine('suppliers'); setIsNavDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-800">🛠️ Suppliers & Builders Directory</button>
                <button onClick={() => { setActiveEngine('tickets'); setIsNavDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-800">🔧 Maintenance Ticket Center ({openTickets.length})</button>
                <button onClick={() => { setActiveEngine('archived'); setIsNavDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-800">📁 Previous Tenant Vault (History)</button>
              </div>
            )}
          </div>

          <div className="text-slate-300 font-medium">
            <span>Business Email: <strong>info@falconuproperties.co.uk</strong></span>
          </div>
        </div>
      </header>

      {/* Main Body Content */}
      <main className="max-w-7xl mx-auto px-4 mt-6">
        {activeEngine !== 'dashboard' && (
          <button onClick={() => setActiveEngine('dashboard')} className="mb-4 bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" /> Go Back to Main Dashboard Home
          </button>
        )}

        {/* Alert Metric Ribbon */}
        {userRole !== 'tenant' && activeEngine === 'dashboard' && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div onClick={() => setActiveEngine('rentOverdue')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-red-400">
              <span className="text-xs font-bold text-slate-500 uppercase">Rent Due Alert</span>
              <p className="text-2xl font-extrabold text-red-600 mt-1">{rentDueList.length}</p>
              <span className="text-xs text-slate-400">Click to view & mark paid</span>
            </div>
            <div onClick={() => setActiveEngine('certificates')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-amber-400">
              <span className="text-xs font-bold text-slate-500 uppercase">Certificates Due</span>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">{certDueList.length}</p>
              <span className="text-xs text-slate-400">Gas CP12, EICR & EPC</span>
            </div>
            <div onClick={() => setActiveEngine('insurance')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-blue-400">
              <span className="text-xs font-bold text-slate-500 uppercase">Insurance Renewals</span>
              <p className="text-2xl font-extrabold text-blue-600 mt-1">{insuranceDueList.length}</p>
              <span className="text-xs text-slate-400">Landlord policies due</span>
            </div>
            <div onClick={() => setActiveEngine('tickets')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-orange-400">
              <span className="text-xs font-bold text-slate-500 uppercase">Open Maintenance</span>
              <p className="text-2xl font-extrabold text-orange-600 mt-1">{openTickets.length}</p>
              <span className="text-xs text-slate-400">Active tenant complaints</span>
            </div>
          </section>
        )}

        {/* ENGINE 1: MAIN DASHBOARD */}
        {activeEngine === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Active Property Portfolio ({properties.length} Units)</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map(p => (
                <div key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
                  <div className="flex justify-between items-start border-b pb-3">
                    <div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{p.type} | {p.councilTaxBand}</span>
                      <h3 className="font-bold text-slate-900 text-lg mt-1">{p.address}</h3>
                      <p className="text-xs text-slate-500">Rent: £{p.rentAmount}/mo | Deposit: £{p.depositAmount} ({p.depositSupplier})</p>
                      <p className="text-xs text-slate-600 mt-1"><strong>Contract:</strong> {p.contractParty} ({p.contractType})</p>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${p.activeTenant ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                      {p.activeTenant ? 'Occupied' : 'Vacant'}
                    </span>
                  </div>

                  {/* Active Tenant Profile */}
                  {p.activeTenant ? (
                    <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-xs border">
                      <div className="flex justify-between items-center border-b pb-2">
                        <p className="font-bold text-slate-900 text-sm">{p.activeTenant.name}</p>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded font-bold ${p.activeTenant.rentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {p.activeTenant.rentStatus}
                          </span>
                          {userRole !== 'tenant' && p.activeTenant.rentStatus === 'Unpaid' && (
                            <button onClick={() => handleMarkRentPaid(p.id)} className="bg-green-600 hover:bg-green-700 text-white font-bold px-2 py-0.5 rounded text-[10px]">✓ Mark Paid</button>
                          )}
                        </div>
                      </div>
                      <p><strong>Passport:</strong> {p.activeTenant.passportNumber} | <strong>Origin:</strong> {p.activeTenant.origin}</p>
                      <p><strong>Job Status:</strong> {p.activeTenant.jobStatus} | <strong>Sharecode:</strong> {p.activeTenant.shareCode}</p>
                      {p.activeTenant.familyMembers && p.activeTenant.familyMembers.length > 0 && (
                        <div className="bg-amber-50 p-2 rounded border border-amber-200 mt-1">
                          <p className="font-bold text-amber-900">Dependants ({p.activeTenant.familyMembers.length}):</p>
                          {p.activeTenant.familyMembers.map((fam, idx) => (
                            <p key={idx} className="text-amber-800">{fam.name} ({fam.relation}) - Exp: {fam.visaExpiry}</p>
                          ))}
                        </div>
                      )}
                      {p.activeTenant.notes && <p className="bg-white p-2 rounded border text-slate-600 mt-1"><strong>Note to Self:</strong> {p.activeTenant.notes}</p>}
                    </div>
                  ) : <p className="text-xs text-slate-400 italic">No tenant assigned</p>}

                  {/* Meter Readings */}
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-bold text-slate-700 flex items-center gap-1"><Gauge className="w-3.5 h-3.5" /> Meter Readings:</p>
                      <button onClick={() => setShowMeterModal(p)} className="text-xs bg-slate-900 text-white px-2 py-1 rounded font-bold">+ Add Reading</button>
                    </div>
                    {p.meterReadings.length === 0 ? <p className="text-xs text-slate-400 italic">No meter readings recorded.</p> : (
                      <div className="space-y-1">
                        {p.meterReadings.map(m => (
                          <div key={m.id} className="text-xs flex justify-between bg-slate-50 p-1.5 rounded border">
                            <span><strong>{m.type} ({m.utility}):</strong> {m.reading}</span>
                            <span className="text-slate-400">{m.date}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Legal Documents Storage Engine */}
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-bold text-slate-700">Tenancy & Legal Documents ({p.documents.length}):</p>
                      {userRole !== 'tenant' && (
                        <button onClick={() => setShowUploadDocModal(p)} className="text-xs bg-slate-900 text-white px-2 py-1 rounded font-bold">+ Upload Doc</button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {p.documents.map(d => (
                        <a key={d.id} href={d.url} download className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded border flex items-center gap-1">
                          <Download className="w-3 h-3" /> {d.name}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Action Bar */}
                  {userRole !== 'tenant' && (
                    <div className="border-t pt-3 flex justify-between gap-2">
                      <button onClick={() => { setSelectedProperty(p); setTenantFormData(p.activeTenant || { name: '', email: '', passportNumber: '', shareCode: '', familyMembers: [], notes: '' }); setIsEditingTenant(true); }} className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold py-2 rounded flex items-center justify-center gap-1">
                        <Edit className="w-3.5 h-3.5" /> Edit Tenant, Contract & Property Details
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ENGINE 2: RENT OVERDUE ENGINE */}
        {activeEngine === 'rentOverdue' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b pb-4">Rent Overdue Management & Email Reminders</h2>
            <div className="space-y-4">
              {rentDueList.length === 0 ? <p className="text-xs text-slate-500 italic">No overdue rent accounts currently recorded.</p> : (
                rentDueList.map(p => (
                  <div key={p.id} className="p-4 border border-red-200 bg-red-50 rounded-xl flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{p.address}</p>
                      <p className="text-xs text-red-800">Tenant: <strong>{p.activeTenant.name}</strong> ({p.activeTenant.email})</p>
                      <p className="text-xs text-slate-600">Monthly Rent: <strong>£{p.rentAmount}</strong> | Days Overdue: <strong className="text-red-700">{p.activeTenant.daysOverdue} Days</strong></p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={`mailto:${p.activeTenant.email}?subject=RENT%20OVERDUE%20REMINDER%20-%20${p.address}&body=Dear%20${p.activeTenant.name},%0A%0AOur%20records%20show%20that%20your%20rent%20payment%20of%20%C2%A3${p.rentAmount}%20for%20${p.address}%20is%20overdue.%0A%0APlease%20arrange%20payment%20immediately.%0A%0AFalcon%20U%20Properties`} className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded flex items-center gap-1 shadow">
                        <Send className="w-3.5 h-3.5" /> Send Email Reminder
                      </a>
                      <button onClick={() => handleMarkRentPaid(p.id)} className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-3 py-2 rounded flex items-center gap-1 shadow">
                        <CheckCircle className="w-3.5 h-3.5" /> Mark Rent Paid
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ENGINE 3: INSURANCE ENGINE */}
        {activeEngine === 'insurance' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b pb-4">Property Insurance Management Engine</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold">
                    <th className="p-3 border">Property Address</th>
                    <th className="p-3 border">Insurance Provider</th>
                    <th className="p-3 border">Policy Number</th>
                    <th className="p-3 border">Premium Paid</th>
                    <th className="p-3 border">Expiry Date</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map(p => (
                    <tr key={p.id} className="border-b hover:bg-slate-50">
                      <td className="p-3 border font-bold">{p.address}</td>
                      <td className="p-3 border">{p.insurance.provider}</td>
                      <td className="p-3 border">{p.insurance.policyNumber}</td>
                      <td className="p-3 border font-bold">£{p.insurance.premiumPaid}</td>
                      <td className="p-3 border text-slate-700 font-semibold">{p.insurance.expiryDate}</td>
                      <td className="p-3 border">
                        <button onClick={() => { setEditingInsuranceProp(p); setInsuranceForm(p.insurance); }} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1 rounded flex items-center gap-1">
                          <Edit className="w-3.5 h-3.5" /> Edit Policy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ENGINE 4: CERTIFICATES & COMPLIANCE */}
        {activeEngine === 'certificates' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b pb-4">UK Compliance & Certificates Engine</h2>
            <div className="flex gap-2">
              <button onClick={() => setCertFilter('all')} className={`px-3 py-1.5 rounded font-bold text-xs ${certFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>All Certificates</button>
              <button onClick={() => setCertFilter('expiring')} className={`px-3 py-1.5 rounded font-bold text-xs ${certFilter === 'expiring' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100'}`}>Expiring Soon</button>
              <button onClick={() => setCertFilter('expired')} className={`px-3 py-1.5 rounded font-bold text-xs ${certFilter === 'expired' ? 'bg-red-600 text-white' : 'bg-slate-100'}`}>Expired Certificates</button>
            </div>
            <div className="space-y-2 text-xs">
              {properties.flatMap(p => p.certificates)
                .filter(c => certFilter === 'all' || (certFilter === 'expiring' && c.status === 'Expiring Soon') || (certFilter === 'expired' && c.status === 'Expired'))
                .map(c => (
                  <div key={c.id} className="p-3 border rounded bg-slate-50 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900">{c.type}</span> (Ref: {c.refNo})
                      <p className="text-slate-500">Expiry Date: {c.expiryDate}</p>
                    </div>
                    <span className={`px-2 py-1 rounded font-bold ${c.status === 'Valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{c.status}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ENGINE 5: SPECS & COUNCIL TAX */}
        {activeEngine === 'specs' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b pb-4">UK Property Specs & Council Tax Bands</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {properties.map(p => (
                <div key={p.id} className="p-4 border rounded-xl bg-slate-50 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm">{p.address}</h3>
                  <p><strong>Type:</strong> {p.type} | <strong>Council Tax:</strong> {p.councilTaxBand}</p>
                  <p><strong>Contract Parties:</strong> {p.contractParty}</p>
                  <p><strong>Agreement Type:</strong> {p.contractType}</p>
                  <p><strong>Furnishing:</strong> {p.amenities.furnishing}</p>
                  <p><strong>Garden:</strong> {p.amenities.garden} | <strong>Parking:</strong> {p.amenities.parking}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ENGINE 6: SUPPLIERS DIRECTORY */}
        {activeEngine === 'suppliers' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-bold text-slate-900">Suppliers, Builders & Trades Directory</h2>
              {userRole !== 'tenant' && (
                <button onClick={() => setShowAddContractor(true)} className="bg-slate-900 text-white px-3 py-1.5 rounded text-xs font-bold">+ Add Supplier</button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {contractors.map(c => (
                <div key={c.id} className="p-4 border rounded-xl bg-slate-50 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">{c.trade}</span>
                    <button onClick={() => { setEditingContractor(c); setContractorForm(c); }} className="text-amber-600 font-bold">Edit</button>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                  <p><strong>Company:</strong> {c.company}</p>
                  <p><strong>Phone:</strong> {c.phone}</p>
                  <p><strong>Email:</strong> {c.email}</p>
                  {c.notes && <p className="bg-white p-2 rounded border text-slate-500"><strong>Notes:</strong> {c.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ENGINE 7: MAINTENANCE TICKETS */}
        {activeEngine === 'tickets' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-bold text-slate-900">Tenant Maintenance Ticket Center</h2>
              <button onClick={() => setShowNewTicketModal(true)} className="bg-slate-900 text-white px-3 py-1.5 rounded text-xs font-bold">+ Open Ticket</button>
            </div>
            <div className="space-y-3 text-xs">
              {tickets.map(t => (
                <div key={t.id} className="p-4 border rounded-xl bg-slate-50 flex justify-between items-center">
                  <div>
                    <span className="font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-900">{t.issueCategory}</span>
                    <p className="font-bold text-slate-900 text-sm mt-1">{t.issueDescription}</p>
                    <p className="text-slate-500">{t.propertyAddress} ({t.date})</p>
                  </div>
                  <span className={`px-2 py-1 rounded font-bold ${t.status === 'Open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ENGINE 8: ARCHIVED TENANTS */}
        {activeEngine === 'archived' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b pb-4">Previous Tenant History Vault</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold">
                    <th className="p-3 border">Property Address</th>
                    <th className="p-3 border">Tenant Name</th>
                    <th className="p-3 border">Move-In Date</th>
                    <th className="p-3 border">Move-Out Date</th>
                    <th className="p-3 border">Reason / Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {archivedTenants.map(at => (
                    <tr key={at.id} className="border-b hover:bg-slate-50">
                      <td className="p-3 border font-bold">{at.propertyAddress}</td>
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

      {/* MODAL: EDIT TENANT, CONTRACT & SPECS */}
      {isEditingTenant && tenantFormData && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-3 text-xs max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">Edit Tenancy, Contract & Profile: {selectedProperty.address}</h3>
            
            <div className="bg-slate-50 p-3 rounded border space-y-2">
              <label className="font-bold text-slate-800 block">Contract Between Company & Tenant</label>
              <input type="text" placeholder="e.g. Falcon U Properties Ltd & Muhammad Mustafa" value={selectedProperty.contractParty} onChange={e => {
                const updated = properties.map(p => p.id === selectedProperty.id ? { ...p, contractParty: e.target.value } : p);
                setProperties(updated);
              }} className="w-full border p-2 rounded bg-white" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700">Full Name</label>
                <input type="text" value={tenantFormData.name} onChange={e => setTenantFormData({...tenantFormData, name: e.target.value})} className="w-full border p-2 rounded mt-1" />
              </div>
              <div>
                <label className="font-bold text-slate-700">Email Address</label>
                <input type="email" value={tenantFormData.email} onChange={e => setTenantFormData({...tenantFormData, email: e.target.value})} className="w-full border p-2 rounded mt-1" />
              </div>
              <div>
                <label className="font-bold text-slate-700">Passport Number</label>
                <input type="text" value={tenantFormData.passportNumber} onChange={e => setTenantFormData({...tenantFormData, passportNumber: e.target.value})} className="w-full border p-2 rounded mt-1" />
              </div>
              <div>
                <label className="font-bold text-slate-700">Share Code</label>
                <input type="text" value={tenantFormData.shareCode} onChange={e => setTenantFormData({...tenantFormData, shareCode: e.target.value})} className="w-full border p-2 rounded mt-1" />
              </div>
              <div>
                <label className="font-bold text-slate-700">Country of Origin</label>
                <input type="text" value={tenantFormData.origin} onChange={e => setTenantFormData({...tenantFormData, origin: e.target.value})} className="w-full border p-2 rounded mt-1" />
              </div>
              <div>
                <label className="font-bold text-slate-700">Job Status</label>
                <input type="text" value={tenantFormData.jobStatus} onChange={e => setTenantFormData({...tenantFormData, jobStatus: e.target.value})} className="w-full border p-2 rounded mt-1" />
              </div>
            </div>

            <div className="border-t pt-2">
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700">Family Members / Dependants</label>
                <button type="button" onClick={handleAddFamilyMember} className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded border">+ Add Family</button>
              </div>
              {(tenantFormData.familyMembers || []).map((fam, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-1 bg-slate-50 p-1.5 rounded border mb-1">
                  <input type="text" placeholder="Name" value={fam.name} onChange={e => { const copy = [...tenantFormData.familyMembers]; copy[idx].name = e.target.value; setTenantFormData({...tenantFormData, familyMembers: copy}); }} className="border p-1 rounded" />
                  <input type="text" placeholder="Relation" value={fam.relation} onChange={e => { const copy = [...tenantFormData.familyMembers]; copy[idx].relation = e.target.value; setTenantFormData({...tenantFormData, familyMembers: copy}); }} className="border p-1 rounded" />
                  <input type="date" value={fam.visaExpiry} onChange={e => { const copy = [...tenantFormData.familyMembers]; copy[idx].visaExpiry = e.target.value; setTenantFormData({...tenantFormData, familyMembers: copy}); }} className="border p-1 rounded" />
                </div>
              ))}
            </div>

            <div>
              <label className="font-bold text-slate-700">Note to Self (Private)</label>
              <textarea rows="3" placeholder="Add private notes about rent increases, agreement dates..." value={tenantFormData.notes} onChange={e => setTenantFormData({...tenantFormData, notes: e.target.value})} className="w-full border p-2 rounded mt-1" />
            </div>

            <div className="flex justify-between border-t pt-3">
              <button onClick={() => handleDeleteTenant(selectedProperty.id)} className="bg-red-600 text-white font-bold px-3 py-1.5 rounded">Remove Tenant & Archive</button>
              <div className="flex gap-2">
                <button onClick={() => setIsEditingTenant(false)} className="px-3 py-1.5 border rounded font-bold">Cancel</button>
                <button onClick={handleSaveTenant} className="bg-amber-500 text-slate-950 font-bold px-4 py-1.5 rounded">Save All Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT INSURANCE POLICY */}
      {editingInsuranceProp && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSaveInsurance} className="bg-white rounded-xl max-w-md w-full p-6 space-y-3 text-xs">
            <h3 className="font-bold text-sm text-slate-900">Edit Insurance: {editingInsuranceProp.address}</h3>
            <div>
              <label className="font-bold">Insurance Provider</label>
              <input required type="text" value={insuranceForm.provider} onChange={e => setInsuranceForm({...insuranceForm, provider: e.target.value})} className="w-full border p-2 rounded mt-1" />
            </div>
            <div>
              <label className="font-bold">Policy Number</label>
              <input required type="text" value={insuranceForm.policyNumber} onChange={e => setInsuranceForm({...insuranceForm, policyNumber: e.target.value})} className="w-full border p-2 rounded mt-1" />
            </div>
            <div>
              <label className="font-bold">Premium Amount (£)</label>
              <input required type="number" value={insuranceForm.premiumPaid} onChange={e => setInsuranceForm({...insuranceForm, premiumPaid: Number(e.target.value)})} className="w-full border p-2 rounded mt-1" />
            </div>
            <div>
              <label className="font-bold">Expiry Date</label>
              <input required type="date" value={insuranceForm.expiryDate} onChange={e => setInsuranceForm({...insuranceForm, expiryDate: e.target.value})} className="w-full border p-2 rounded mt-1" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingInsuranceProp(null)} className="px-3 py-1 border rounded">Cancel</button>
              <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1 rounded font-bold">Save Policy</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD PROPERTY */}
      {showAddPropertyModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddProperty} className="bg-white rounded-xl max-w-lg w-full p-6 space-y-3 text-xs">
            <h3 className="font-bold text-sm text-slate-900">Add New Property Unit</h3>
            <input required type="text" placeholder="Full Property Address" value={newPropForm.address} onChange={e => setNewPropForm({...newPropForm, address: e.target.value})} className="w-full border p-2 rounded" />
            <input required type="text" placeholder="Contract Parties (e.g. Company Ltd & Tenant)" value={newPropForm.contractParty} onChange={e => setNewPropForm({...newPropForm, contractParty: e.target.value})} className="w-full border p-2 rounded" />
            <div className="grid grid-cols-2 gap-2">
              <input required type="number" placeholder="Rent (£)" value={newPropForm.rentAmount} onChange={e => setNewPropForm({...newPropForm, rentAmount: e.target.value})} className="border p-2 rounded" />
              <input required type="number" placeholder="Deposit (£)" value={newPropForm.depositAmount} onChange={e => setNewPropForm({...newPropForm, depositAmount: e.target.value})} className="border p-2 rounded" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAddPropertyModal(false)} className="px-3 py-1 border rounded">Cancel</button>
              <button type="submit" className="bg-slate-900 text-white px-3 py-1 rounded font-bold">Create Property</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: UPLOAD DOCUMENT */}
      {showUploadDocModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleUploadDocument} className="bg-white rounded-xl max-w-md w-full p-6 space-y-3 text-xs">
            <h3 className="font-bold text-sm text-slate-900">Upload Tenancy / Legal Document</h3>
            <input required type="text" placeholder="Document Name (e.g. Tenancy_Agreement_2026.pdf)" value={newDocName} onChange={e => setNewDocName(e.target.value)} className="w-full border p-2 rounded" />
            <input type="file" className="w-full text-xs" />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowUploadDocModal(null)} className="px-3 py-1 border rounded">Cancel</button>
              <button type="submit" className="bg-slate-900 text-white px-3 py-1 rounded font-bold">Upload Document</button>
            </div>
          </form>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <p className="font-bold text-white text-sm">Falcon U Properties Management</p>
            <p>Office Phone: 02071835494 | Operating Hours: Mon–Fri 9:30 AM – 5:00 PM</p>
            <p>Email: info@falconuproperties.co.uk</p>
          </div>
          <div className="text-right">
            <p className="text-red-400 font-bold">24/7 Gas Leak Emergency: 0800 111999</p>
            <p className="text-red-400 font-bold">24/7 Power Outage Line: 105</p>
          </div>
        </div>
      </footer>
    </div>
  );
}