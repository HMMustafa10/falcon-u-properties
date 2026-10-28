import React, { useState, useEffect } from 'react';
import {
  Building2, Users, Wrench, ShieldCheck, FileText,
  Plus, Trash2, Edit, CheckCircle, AlertTriangle,
  Search, Filter, Download, Mail, Phone, Upload,
  Key, Calendar, CreditCard, ShieldAlert, X,
  ArrowLeft, Clock, Gauge, FileImage, UserCheck,
  Building, Briefcase, Lock, LogIn, UserPlus, LogOut,
  ChevronDown, Home, Shield, FileCheck, Layers, Eye
} from 'lucide-react';

// Default Initial Portfolio Data (UK Housing Compliant v21)
const initialProperties = [
  {
    id: 'P1',
    address: '12 Falcon Way, London E1 6AN',
    type: 'Flat', // Flat, House, HMO, Commercial
    rentAmount: 1450,
    depositAmount: 1450,
    depositSupplier: 'DPS (Deposit Protection Service)',
    depositCertNo: 'DPS-992014-UK',
    contractType: 'AST Agreement (Company to Tenant)',
    rentDueDate: 1,
    councilTaxBand: 'Band C',
    specs: {
      garden: 'Shared Garden',
      parking: 'Permit Parking',
      loft: 'No',
      basement: 'No',
      furnishing: 'Fully Furnished',
      notes: 'Recently refurbished kitchen. Double glazing throughout.'
    },
    insurance: {
      provider: 'Aviva Landlord Direct',
      policyNumber: 'AV-992011-UK',
      annualPremium: 420,
      expiryDate: '2026-12-01',
      documentName: 'Aviva_Landlord_Policy_2026.pdf'
    },
    certificates: {
      gasCertExpiry: '2026-11-15',
      gasCertDoc: 'Gas_CP12_Cert_2026.pdf',
      eicrExpiry: '2027-03-20',
      eicrDoc: 'EICR_Electrical_Cert.pdf',
      epcExpiry: '2028-06-10',
      epcRating: 'Rating C',
      epcDoc: 'EPC_Energy_Performance.pdf',
      selectiveLicenseNo: 'SEL-LON-2024-88',
      selectiveLicenseExpiry: '2029-01-15',
      selectiveLicenseDoc: 'Selective_License_E1.pdf'
    },
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
      notes: 'Tenant requested rent increase discussion in Q4. Excellent communication.',
      familyMembers: [
        { name: 'Fatima Mustafa', relation: 'Spouse', visaStatus: 'Skilled Worker Dependant', visaExpiry: '2026-11-10', shareCode: 'DEF456GHI' }
      ],
      documents: [
        { id: 'D1', name: 'Tenancy_Agreement.pdf', type: 'pdf', url: '#' },
        { id: 'D2', name: 'Gas_Safety_Cert.pdf', type: 'pdf', url: '#' }
      ]
    }
  },
  {
    id: 'P2',
    address: '45 Station Road, Ilford IG1 4BT',
    type: 'HMO',
    rentAmount: 2400,
    depositAmount: 2400,
    depositSupplier: 'MyDeposits UK Vault',
    depositCertNo: 'MYDEP-8871-IG',
    contractType: 'Individual Room ASTs',
    rentDueDate: 5,
    councilTaxBand: 'Band D',
    specs: {
      garden: 'Private Rear Garden',
      parking: 'Driveway (2 Cars)',
      loft: 'Yes (Converted)',
      basement: 'No',
      furnishing: 'Fully Furnished',
      notes: 'Licensed 5-Bed HMO with fire doors & emergency lighting.'
    },
    insurance: {
      provider: 'Direct Line Commercial',
      policyNumber: 'DL-HMO-55219',
      annualPremium: 680,
      expiryDate: '2026-10-20', // Expiring soon
      documentName: 'DirectLine_HMO_Policy.pdf'
    },
    certificates: {
      gasCertExpiry: '2026-10-28', // Expired / Due
      gasCertDoc: 'Gas_CP12_2025.pdf',
      eicrExpiry: '2026-11-05',
      eicrDoc: 'EICR_Cert_2026.pdf',
      epcExpiry: '2029-01-15',
      epcRating: 'Rating B',
      epcDoc: 'EPC_Rating_B.pdf',
      selectiveLicenseNo: 'HMO-REDBRIDGE-0091',
      selectiveLicenseExpiry: '2028-05-10',
      selectiveLicenseDoc: 'Redbridge_HMO_License.pdf'
    },
    utilities: { gas: 'E.ON Next', electricity: 'EDF Energy', water: 'Thames Water' },
    meterReadings: [],
    commercialDetails: null,
    activeTenant: {
      id: 'T102',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      phone: '+44 7700 900112',
      passportNumber: 'GB987654321',
      origin: 'United Kingdom',
      jobStatus: 'NHS Nurse',
      moveInDate: '2023-06-01',
      rentStatus: 'Paid',
      daysOverdue: 0,
      visaStatus: 'UK Citizen / Indefinite Leave',
      shareCode: 'N/A',
      visaExpiry: '2099-12-31',
      notes: 'Long term reliable tenant.',
      familyMembers: [],
      documents: [{ id: 'D3', name: 'Right_To_Rent_Check.pdf', type: 'pdf', url: '#' }]
    }
  },
  {
    id: 'P3',
    address: '88 Commercial Road, London E1 1RD',
    type: 'Commercial',
    rentAmount: 3200,
    depositAmount: 6400,
    depositSupplier: 'MyDeposits Commercial Vault',
    depositCertNo: 'COMM-DEP-110',
    contractType: 'Full Repairing & Insuring (FRI) Lease',
    rentDueDate: 1,
    councilTaxBand: 'N/A (Business Rates)',
    specs: {
      garden: 'No',
      parking: 'Secure Loading Bay',
      loft: 'No',
      basement: 'Yes (Storage Vault)',
      furnishing: 'Unfurnished',
      notes: 'Ground floor retail unit with lower ground storage vault.'
    },
    insurance: {
      provider: 'AXA Insurance UK',
      policyNumber: 'AX-77210-COMM',
      annualPremium: 1100,
      expiryDate: '2027-05-15',
      documentName: 'AXA_Commercial_Property_Policy.pdf'
    },
    certificates: {
      gasCertExpiry: '2027-01-10',
      gasCertDoc: 'Gas_Cert_Comm.pdf',
      eicrExpiry: '2028-02-14',
      eicrDoc: 'EICR_Comm_Inspection.pdf',
      epcExpiry: '2029-08-20',
      epcRating: 'Rating B',
      epcDoc: 'EPC_Comm_B.pdf',
      selectiveLicenseNo: 'COMM-LEASE-E1-88',
      selectiveLicenseExpiry: '2032-01-01',
      selectiveLicenseDoc: 'FRI_Lease_Deed.pdf'
    },
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
      id: 'T103',
      name: 'John Miller (Business Director)',
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
      notes: 'Commercial lease renewal option scheduled for 2031.',
      familyMembers: [],
      documents: [{ id: 'D4', name: 'Commercial_Lease_Agreement.pdf', type: 'pdf', url: '#' }]
    }
  },
  {
    id: 'P4',
    address: '102 High Street, Barking IG11 8TN',
    type: 'House',
    rentAmount: 1850,
    depositAmount: 1850,
    depositSupplier: 'DPS (Deposit Protection Service)',
    depositCertNo: 'DPS-441092-IG',
    contractType: 'AST Agreement',
    rentDueDate: 1,
    councilTaxBand: 'Band D',
    specs: {
      garden: 'Private Large Rear Garden',
      parking: 'Garage & Off-Street',
      loft: 'Yes (Storage)',
      basement: 'No',
      furnishing: 'Part Furnished',
      notes: 'Vacant unit ready for tenancy. Cleaning completed.'
    },
    insurance: {
      provider: 'RSA Insurance Group',
      policyNumber: 'RSA-882109-UK',
      annualPremium: 390,
      expiryDate: '2026-10-15', // Expired
      documentName: 'RSA_Policy_2025.pdf'
    },
    certificates: {
      gasCertExpiry: '2027-04-10',
      gasCertDoc: 'CP12_Barking.pdf',
      eicrExpiry: '2028-09-01',
      eicrDoc: 'EICR_Barking.pdf',
      epcExpiry: '2030-02-18',
      epcRating: 'Rating C',
      epcDoc: 'EPC_Barking.pdf',
      selectiveLicenseNo: 'SEL-BARKING-991',
      selectiveLicenseExpiry: '2029-06-30',
      selectiveLicenseDoc: 'Barking_License.pdf'
    },
    utilities: { gas: 'British Gas', electricity: 'British Gas', water: 'Essex & Suffolk Water' },
    meterReadings: [],
    commercialDetails: null,
    activeTenant: null // Vacant property
  }
];

const initialContractors = [
  { id: 'C1', name: 'John’s Gas & Heating', trade: 'Gas Engineer', company: 'Apex Heating Ltd', phone: '+44 7911 123456', email: 'gas@apexheating.co.uk', address: 'London E1', notes: 'Gas Safe Reg #55412. Available 24/7.' },
  { id: 'C2', name: 'Bright Spark Electric', trade: 'Electricity', company: 'Current Solutions Ltd', phone: '+44 7911 654321', email: 'info@brightspark.co.uk', address: 'Ilford IG1', notes: 'NICEIC Registered contractor.' },
  { id: 'C3', name: 'FlowRight Plumbing', trade: 'Plumbing', company: 'FlowRight Services', phone: '+44 7911 987654', email: 'plumb@flowright.co.uk', address: 'Barking IG11', notes: 'Emergency response within 2 hours.' }
];

const initialTickets = [
  { id: 'TK1', propertyId: 'P1', propertyAddress: '12 Falcon Way, London E1 6AN', tenantName: 'Muhammad Mustafa', issueCategory: 'Plumbing', issueDescription: 'Kitchen sink dripping water continuously.', date: '2026-10-25', status: 'Open', priority: 'Medium' }
];

const initialArchivedTenants = [
  { id: 'AT1', propertyAddress: '12 Falcon Way, London E1 6AN', name: 'David Smith', moveInDate: '2021-01-01', moveOutDate: '2023-12-31', reason: 'End of Tenancy - Deposit Returned' }
];

export default function App() {
  // Persistence state v21
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('falcon_u_properties_v21');
    return saved ? JSON.parse(saved) : initialProperties;
  });

  const [contractors, setContractors] = useState(() => {
    const saved = localStorage.getItem('falcon_u_contractors_v21');
    return saved ? JSON.parse(saved) : initialContractors;
  });

  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('falcon_u_tickets_v21');
    return saved ? JSON.parse(saved) : initialTickets;
  });

  const [archivedTenants, setArchivedTenants] = useState(() => {
    const saved = localStorage.getItem('falcon_u_archived_v21');
    return saved ? JSON.parse(saved) : initialArchivedTenants;
  });

  // Auth & Account State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('falcon_u_user_v21');
    return saved ? JSON.parse(saved) : null;
  });
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', role: 'landlord' });

  // Navigation Dropdown & Tab Engine
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); 
  // Tab Views: 'dashboard', 'insurance', 'certificates', 'rent', 'specs', 'vacant', 'suppliers', 'tickets', 'archived'

  // Sub-filters for Engines
  const [certSubFilter, setCertSubFilter] = useState('all'); // 'all', 'expiring', 'expired'
  const [certCategoryFilter, setCertCategoryFilter] = useState('all'); // 'all', 'gas', 'eicr', 'epc', 'selective', 'deposit'

  // Modals & Editing
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
  useEffect(() => { localStorage.setItem('falcon_u_properties_v21', JSON.stringify(properties)); }, [properties]);
  useEffect(() => { localStorage.setItem('falcon_u_contractors_v21', JSON.stringify(contractors)); }, [contractors]);
  useEffect(() => { localStorage.setItem('falcon_u_tickets_v21', JSON.stringify(tickets)); }, [tickets]);
  useEffect(() => { localStorage.setItem('falcon_u_archived_v21', JSON.stringify(archivedTenants)); }, [archivedTenants]);
  useEffect(() => { localStorage.setItem('falcon_u_user_v21', JSON.stringify(currentUser)); }, [currentUser]);

  // Derived Calculations
  const rentDueList = properties.filter(p => p.activeTenant && p.activeTenant.rentStatus === 'Unpaid');
  const vacantList = properties.filter(p => !p.activeTenant);
  const openTickets = tickets.filter(t => t.status === 'Open');

  const checkCertDays = (expiryStr) => {
    if (!expiryStr) return 999;
    const diffTime = new Date(expiryStr) - new Date();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const certDueList = properties.filter(p => {
    const c = p.certificates;
    return checkCertDays(c.gasCertExpiry) <= 45 || checkCertDays(c.eicrExpiry) <= 45 || checkCertDays(c.epcExpiry) <= 45 || checkCertDays(c.selectiveLicenseExpiry) <= 45;
  });

  const insuranceDueList = properties.filter(p => checkCertDays(p.insurance.expiryDate) <= 45);

  // Toggle Rent Paid Action
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
    const userObj = { name: authForm.name || authForm.email.split('@')[0], email: authForm.email, role: authForm.role };
    setCurrentUser(userObj);
    setAuthForm({ name: '', email: '', password: '', role: 'landlord' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('falcon_u_user_v21');
  };

  // Contractor Handler
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

  // Save Tenant Modifications
  const handleSaveTenant = () => {
    setProperties(properties.map(p => p.id === selectedProperty.id ? { ...p, activeTenant: tenantFormData } : p));
    setIsEditingTenant(false);
  };

  // Add Meter Reading
  const handleAddMeterReading = (e) => {
    e.preventDefault();
    const newEntry = { id: 'M' + Date.now(), ...meterForm, date: new Date().toISOString().split('T')[0] };
    setProperties(properties.map(p => p.id === showMeterModal.id ? { ...p, meterReadings: [...p.meterReadings, newEntry] } : p));
    setShowMeterModal(null);
    setMeterForm({ type: 'Opening', utility: 'Electricity', reading: '' });
  };

  // Create Ticket
  const handleCreateTicket = (e) => {
    e.preventDefault();
    const userProperty = properties.find(p => p.activeTenant && p.activeTenant.email === currentUser.email) || properties[0];
    const newTicketObj = {
      id: 'TK' + Date.now(),
      propertyId: userProperty.id,
      propertyAddress: userProperty.address,
      tenantName: currentUser.name,
      issueCategory: ticketForm.issueCategory,
      issueDescription: ticketForm.issueDescription,
      date: new Date().toISOString().split('T')[0],
      status: 'Open',
      priority: 'Medium'
    };
    setTickets([...tickets, newTicketObj]);
    setShowNewTicketModal(false);
    setTicketForm({ issueCategory: 'Plumbing', issueDescription: '' });
  };

  // Auth Guard Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-amber-100 text-amber-600 mb-1">
              <Building2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">FALCON U PROPERTIES</h1>
            <p className="text-xs font-semibold text-slate-500">Enterprise Portfolio & UK Compliance Portal</p>
          </div>

          <div className="flex border-b text-sm font-bold">
            <button onClick={() => setAuthMode('login')} className={`flex-1 py-2 text-center border-b-2 ${authMode === 'login' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400'}`}>Log In</button>
            <button onClick={() => setAuthMode('register')} className={`flex-1 py-2 text-center border-b-2 ${authMode === 'register' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400'}`}>Register</button>
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
              <label className="block text-slate-700 font-bold mb-1">Portal Access Role</label>
              <select value={authForm.role} onChange={e => setAuthForm({...authForm, role: e.target.value})} className="w-full border p-2.5 rounded-lg text-xs bg-slate-50">
                <option value="landlord">👑 Landlord Portal (Full Portfolio & Legal Admin)</option>
                <option value="agent">🏢 Agent Portal (Managed Properties View)</option>
                <option value="tenant">👤 Tenant Portal (Self-Service View)</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg text-xs tracking-wide shadow-md transition">
              {authMode === 'login' ? 'SIGN IN TO PORTAL' : 'CREATE NEW ACCOUNT'}
            </button>
          </form>

          <div className="border-t pt-4 text-center text-[11px] text-slate-400 space-y-1">
            <p>Office Phone: 02071835494 (Mon–Fri 9:30 AM – 5:00 PM)</p>
            <p className="text-red-500 font-bold">24/7 Gas Emergency: 0800 111999 | Power: 105</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-16">
      {/* Top Main Bar */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center border-b border-slate-800">
          
          {/* Top Left Menu Dropdown */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setNavMenuOpen(!navMenuOpen)} 
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3 py-2 rounded-lg flex items-center gap-2 shadow transition"
              >
                <Layers className="w-4 h-4" /> Menu Options <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Navigation Dropdown Menu */}
              {navMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 z-50 py-2 text-xs font-semibold">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 border-b">Main Navigation</div>
                  <button onClick={() => { setActiveTab('dashboard'); setNavMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center gap-2">
                    <Home className="w-4 h-4 text-slate-600" /> Main Dashboard Home
                  </button>

                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 border-b mt-2">Compliance & Finance Engines</div>
                  <button onClick={() => { setActiveTab('insurance'); setNavMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-600" /> Insurance Engine ({insuranceDueList.length} Due)
                  </button>
                  <button onClick={() => { setActiveTab('certificates'); setNavMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-amber-600" /> Compliance & Certificates ({certDueList.length} Due)
                  </button>
                  <button onClick={() => { setActiveTab('rent'); setNavMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-red-600" /> Rent & Arrears Engine ({rentDueList.length} Overdue)
                  </button>

                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 border-b mt-2">Property Specs & Operations</div>
                  <button onClick={() => { setActiveTab('specs'); setNavMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-600" /> UK Specs & Council Tax Bands
                  </button>
                  <button onClick={() => { setActiveTab('vacant'); setNavMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-green-600" /> Vacant Properties ({vacantList.length})
                  </button>
                  <button onClick={() => { setActiveTab('suppliers'); setNavMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-slate-600" /> Suppliers & Builders Directory
                  </button>
                  <button onClick={() => { setActiveTab('tickets'); setNavMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" /> Maintenance Tickets ({openTickets.length})
                  </button>
                  <button onClick={() => { setActiveTab('archived'); setNavMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" /> Tenant Vault (History)
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Building2 className="w-7 h-7 text-amber-400" />
              <div>
                <h1 className="text-xl font-bold tracking-wide leading-none">FALCON U PROPERTIES</h1>
                <p className="text-[10px] text-amber-400">Enterprise Portfolio & UK Compliance Portal</p>
              </div>
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

        {/* Permanent Office & Emergency Contacts */}
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center text-xs bg-slate-950/90 text-slate-300 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <span>📞 Business Office: <strong>02071835494</strong> (Mon–Fri 9:30 AM – 5:00 PM excl. Bank Holidays)</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-red-400 font-bold">🚨 Gas Emergency: 0800 111999</span>
            <span className="text-red-400 font-bold">🚨 Power Outage: 105</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 mt-6">
        
        {/* Universal Back Button for Secondary Views */}
        {activeTab !== 'dashboard' && (
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className="mb-6 bg-white border border-slate-300 text-slate-800 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-amber-600" /> ← Back to Main Dashboard Home
          </button>
        )}

        {/* Top Summary Alert KPIs (Landlord/Agent Dashboard) */}
        {currentUser.role !== 'tenant' && activeTab === 'dashboard' && (
          <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div onClick={() => setActiveTab('rent')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-red-400 transition">
              <span className="text-xs font-bold text-slate-500 uppercase">Rent Due Alert</span>
              <p className="text-2xl font-extrabold text-red-600 mt-1">{rentDueList.length}</p>
              <span className="text-xs text-slate-400">Click to view & mark paid</span>
            </div>
            <div onClick={() => setActiveTab('certificates')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-amber-400 transition">
              <span className="text-xs font-bold text-slate-500 uppercase">Certificates Due</span>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">{certDueList.length}</p>
              <span className="text-xs text-slate-400">Gas CP12, EICR & EPC</span>
            </div>
            <div onClick={() => setActiveTab('insurance')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-purple-400 transition">
              <span className="text-xs font-bold text-slate-500 uppercase">Insurance Renewals</span>
              <p className="text-2xl font-extrabold text-purple-600 mt-1">{insuranceDueList.length}</p>
              <span className="text-xs text-slate-400">Landlord policies</span>
            </div>
            <div onClick={() => setActiveTab('vacant')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-green-400 transition">
              <span className="text-xs font-bold text-slate-500 uppercase">Vacant Properties</span>
              <p className="text-2xl font-extrabold text-green-600 mt-1">{vacantList.length}</p>
              <span className="text-xs text-slate-400">Ready for tenancy</span>
            </div>
            <div onClick={() => setActiveTab('tickets')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-orange-400 transition">
              <span className="text-xs font-bold text-slate-500 uppercase">Open Complaints</span>
              <p className="text-2xl font-extrabold text-orange-600 mt-1">{openTickets.length}</p>
              <span className="text-xs text-slate-400">Maintenance tickets</span>
            </div>
          </section>
        )}

        {/* ENGINE 1: MAIN DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">
              {currentUser.role === 'tenant' ? 'My Assigned Property Portal' : `Active Portfolio (${properties.length} Units)`}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {properties
                .filter(p => currentUser.role !== 'tenant' || (p.activeTenant && p.activeTenant.email === currentUser.email))
                .map(prop => (
                  <div key={prop.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
                    <div className="flex justify-between items-start border-b pb-3">
                      <div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{prop.type} Property | {prop.councilTaxBand}</span>
                        <h3 className="font-bold text-slate-900 text-lg mt-1">{prop.address}</h3>
                        <p className="text-xs text-slate-500">Rent: £{prop.rentAmount}/mo | Deposit: £{prop.depositAmount} ({prop.depositSupplier})</p>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${prop.activeTenant ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {prop.activeTenant ? 'Occupied' : 'Vacant'}
                      </span>
                    </div>

                    {prop.activeTenant ? (
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
                                ✓ Mark Rent Paid
                              </button>
                            )}
                          </div>
                        </div>
                        <p><strong>Passport No:</strong> {prop.activeTenant.passportNumber} | <strong>Origin:</strong> {prop.activeTenant.origin}</p>
                        <p><strong>Job Status:</strong> {prop.activeTenant.jobStatus}</p>
                        <p><strong>Sharecode / Visa:</strong> {prop.activeTenant.shareCode} (Exp: {prop.activeTenant.visaExpiry})</p>
                      </div>
                    ) : (
                      <div className="bg-amber-50/50 p-4 rounded-lg text-center border border-amber-200">
                        <p className="text-xs font-bold text-amber-900">Property Currently Vacant</p>
                        <p className="text-[11px] text-slate-500">Ready for tenancy onboarding.</p>
                      </div>
                    )}

                    {/* Meter Readings View */}
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

        {/* ENGINE 2: INSURANCE ENGINE */}
        {activeTab === 'insurance' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold text-slate-900">Landlord Insurance Policies Engine</h2>
              <p className="text-xs text-slate-500">Manage property insurance providers, annual premiums, policy numbers, and renewal expiries</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="p-3 border">Property Address</th>
                    <th className="p-3 border">Insurance Provider</th>
                    <th className="p-3 border">Policy Number</th>
                    <th className="p-3 border">Annual Premium Paid</th>
                    <th className="p-3 border">Renewal / Expiry Date</th>
                    <th className="p-3 border">Status</th>
                    <th className="p-3 border">Document</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map(p => {
                    const daysLeft = checkCertDays(p.insurance.expiryDate);
                    return (
                      <tr key={p.id} className="border-b hover:bg-slate-50">
                        <td className="p-3 border font-bold text-slate-900">{p.address}</td>
                        <td className="p-3 border">{p.insurance.provider}</td>
                        <td className="p-3 border font-mono">{p.insurance.policyNumber}</td>
                        <td className="p-3 border font-bold">£{p.insurance.annualPremium} / yr</td>
                        <td className="p-3 border">{p.insurance.expiryDate}</td>
                        <td className="p-3 border">
                          {daysLeft < 0 ? (
                            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold">EXPIRED</span>
                          ) : daysLeft <= 45 ? (
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Due in {daysLeft} Days</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 font-bold">Valid ({daysLeft} d)</span>
                          )}
                        </td>
                        <td className="p-3 border">
                          <a href="#" className="text-blue-600 hover:underline flex items-center gap-1 font-bold">
                            <Download className="w-3.5 h-3.5" /> {p.insurance.documentName}
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ENGINE 3: COMPLIANCE & CERTIFICATES ENGINE */}
        {activeTab === 'certificates' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <div className="flex flex-wrap justify-between items-center border-b pb-4 gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">UK Compliance & Safety Certificates Engine</h2>
                <p className="text-xs text-slate-500">Gas Safety CP12, EICR Electrical, EPC Ratings, HMO/Selective Licensing, Deposit Protection</p>
              </div>

              {/* Certificate Filter Tabs */}
              <div className="flex gap-2 text-xs font-bold">
                <button onClick={() => setCertSubFilter('all')} className={`px-3 py-1.5 rounded ${certSubFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>All Certificates</button>
                <button onClick={() => setCertSubFilter('expiring')} className={`px-3 py-1.5 rounded ${certSubFilter === 'expiring' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-700'}`}>Expiring Soon (45 Days)</button>
                <button onClick={() => setCertSubFilter('expired')} className={`px-3 py-1.5 rounded ${certSubFilter === 'expired' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'}`}>Expired Certificates</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="p-3 border">Property Address</th>
                    <th className="p-3 border">Gas Safety CP12</th>
                    <th className="p-3 border">EICR Electrical</th>
                    <th className="p-3 border">EPC Rating & Expiry</th>
                    <th className="p-3 border">Selective / HMO License</th>
                    <th className="p-3 border">Deposit Protection</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map(p => {
                    const c = p.certificates;
                    return (
                      <tr key={p.id} className="border-b hover:bg-slate-50">
                        <td className="p-3 border font-bold text-slate-900">{p.address}</td>
                        <td className="p-3 border">
                          <p className="font-semibold">{c.gasCertExpiry}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${checkCertDays(c.gasCertExpiry) <= 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {checkCertDays(c.gasCertExpiry) <= 0 ? 'Expired' : 'Valid'}
                          </span>
                        </td>
                        <td className="p-3 border">
                          <p className="font-semibold">{c.eicrExpiry}</p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-green-100 text-green-800">Valid</span>
                        </td>
                        <td className="p-3 border">
                          <p className="font-bold text-blue-700">{c.epcRating}</p>
                          <p className="text-slate-500">{c.epcExpiry}</p>
                        </td>
                        <td className="p-3 border">
                          <p className="font-mono text-[11px]">{c.selectiveLicenseNo}</p>
                          <p className="text-slate-500">{c.selectiveLicenseExpiry}</p>
                        </td>
                        <td className="p-3 border">
                          <p className="font-semibold">{p.depositSupplier}</p>
                          <p className="font-mono text-slate-500">{p.depositCertNo}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ENGINE 4: RENT & ARREARS ENGINE */}
        {activeTab === 'rent' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold text-slate-900">Rent Collection & Overdue Arrears Engine</h2>
              <p className="text-xs text-slate-500">Track tenant rent status, days overdue, and instantly update payment records</p>
            </div>

            <div className="space-y-4">
              {rentDueList.length === 0 ? (
                <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-bold text-green-900">All Rent Balances Fully Paid!</p>
                  <p className="text-xs text-green-700">No overdue rent reminders queued.</p>
                </div>
              ) : (
                rentDueList.map(p => (
                  <div key={p.id} className="p-4 border border-red-200 bg-red-50 rounded-xl flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{p.address}</p>
                      <p className="text-xs text-red-800">Tenant: <strong>{p.activeTenant.name}</strong> | Overdue: <strong>{p.activeTenant.daysOverdue} Days</strong></p>
                      <p className="text-xs text-slate-600">Monthly Rent: £{p.rentAmount} | Due Date: {p.rentDueDate}st of every month</p>
                    </div>

                    <div className="flex gap-2">
                      <a href={`mailto:${p.activeTenant.email}?subject=Falcon%20U%20Properties:%20Overdue%20Rent%20Notice&body=Dear%20${p.activeTenant.name},`} className="bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" /> Email Notice
                      </a>
                      <button onClick={() => handleMarkRentPaid(p.id)} className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1 shadow">
                        ✓ Mark Rent Paid
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ENGINE 5: UK SPECS & COUNCIL TAX ENGINE */}
        {activeTab === 'specs' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold text-slate-900">UK Housing Specs & Amenities Breakdown</h2>
              <p className="text-xs text-slate-500">Council Tax Bands (A-H), Garden, Parking, Loft, Basement, and Furnishing status</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map(p => (
                <div key={p.id} className="p-5 border rounded-xl bg-slate-50 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900">{p.address}</h3>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-900">{p.councilTaxBand}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <p><strong>Type:</strong> {p.type}</p>
                    <p><strong>Furnishing:</strong> {p.specs.furnishing}</p>
                    <p><strong>Garden:</strong> {p.specs.garden}</p>
                    <p><strong>Parking:</strong> {p.specs.parking}</p>
                    <p><strong>Loft Access:</strong> {p.specs.loft}</p>
                    <p><strong>Basement:</strong> {p.specs.basement}</p>
                  </div>

                  {p.specs.notes && (
                    <p className="text-xs bg-white p-2.5 rounded border border-slate-200 text-slate-600">
                      <strong>Notes:</strong> {p.specs.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ENGINE 6: VACANT PROPERTIES ENGINE */}
        {activeTab === 'vacant' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold text-slate-900">Vacant Properties Overview ({vacantList.length})</h2>
              <p className="text-xs text-slate-500">Properties available for immediate tenant onboarding</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vacantList.map(p => (
                <div key={p.id} className="p-5 border border-amber-200 bg-amber-50/50 rounded-xl space-y-3">
                  <h3 className="font-bold text-slate-900 text-base">{p.address}</h3>
                  <p className="text-xs text-slate-600"><strong>Target Rent:</strong> £{p.rentAmount} / month | <strong>Deposit:</strong> £{p.depositAmount}</p>
                  <p className="text-xs text-slate-600"><strong>Specs:</strong> {p.type} | {p.councilTaxBand} | {p.specs.furnishing}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ENGINE 7: SUPPLIERS DIRECTORY */}
        {activeTab === 'suppliers' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Suppliers, Builders & Trade Directory</h2>
                <p className="text-xs text-slate-500">Gas Engineers, Plumbers, Electricians, Carpenters, and Builders</p>
              </div>
              {currentUser.role !== 'tenant' && (
                <button onClick={() => setShowAddContractor(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add New Supplier
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contractors.map(c => (
                <div key={c.id} className="p-4 border rounded-xl bg-slate-50 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">{c.trade}</span>
                    {currentUser.role !== 'tenant' && (
                      <button onClick={() => setContractors(contractors.filter(item => item.id !== c.id))} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900">{c.name}</h3>
                  <p className="text-xs text-slate-600"><strong>Company:</strong> {c.company}</p>
                  <p className="text-xs text-slate-600"><strong>Phone:</strong> {c.phone}</p>
                  <p className="text-xs text-slate-600"><strong>Email:</strong> {c.email}</p>
                  {c.notes && <p className="text-xs text-slate-500 bg-white p-2 rounded border"><strong>Notes:</strong> {c.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ENGINE 8: MAINTENANCE TICKETS */}
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

        {/* ENGINE 9: ARCHIVED TENANTS */}
        {activeTab === 'archived' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold text-slate-900">Historical Tenant Vault</h2>
              <p className="text-xs text-slate-500">Historical records of previous tenancies across Falcon U Properties</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
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
                      <td className="p-3 border font-bold text-slate-900">{at.propertyAddress}</td>
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

      {/* FOOTER */}
      <footer className="mt-12 bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="font-bold text-white text-sm">Falcon U Properties Management Portal</p>
            <p>Office Phone: 02071835494 | Mon–Fri 9:30 AM – 5:00 PM (Excl. Bank Holidays)</p>
          </div>
          <div className="text-right">
            <p className="text-red-400 font-bold">Emergency Gas Leak: 0800 111999</p>
            <p className="text-red-400 font-bold">Emergency Power Failure: 105</p>
          </div>
        </div>
      </footer>

      {/* MODAL: ADD METER READING */}
      {showMeterModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddMeterReading} className="bg-white rounded-xl max-w-md w-full p-6 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Record Meter Reading: {showMeterModal.address}</h3>
            <select value={meterForm.type} onChange={e => setMeterForm({...meterForm, type: e.target.value})} className="w-full border p-2 rounded">
              <option value="Opening">Opening Reading (Move-In)</option>
              <option value="Closing">Closing Reading (Move-Out)</option>
              <option value="Periodic Check">Periodic Inspection Check</option>
            </select>
            <select value={meterForm.utility} onChange={e => setMeterForm({...meterForm, utility: e.target.value})} className="w-full border p-2 rounded">
              <option value="Gas">Gas</option>
              <option value="Electricity">Electricity</option>
              <option value="Water">Water</option>
            </select>
            <input required type="text" placeholder="Reading Units (e.g. 14200 kWh)" value={meterForm.reading} onChange={e => setMeterForm({...meterForm, reading: e.target.value})} className="w-full border p-2 rounded" />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowMeterModal(null)} className="px-3 py-1 border rounded">Cancel</button>
              <button type="submit" className="bg-slate-900 text-white px-3 py-1 rounded font-bold">Save Reading</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: CREATE TICKET */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateTicket} className="bg-white rounded-xl max-w-md w-full p-6 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Report Maintenance / Ticket Issue</h3>
            <select value={ticketForm.issueCategory} onChange={e => setTicketForm({...ticketForm, issueCategory: e.target.value})} className="w-full border p-2 rounded">
              <option value="Plumbing">Water Leakage / Sink / Plumber</option>
              <option value="Gas / Boiler">Boiler / Heating / Gas Safety</option>
              <option value="Electricity">Electrical / Power Outage</option>
              <option value="Appliance">Washing Machine / Kitchen Appliance</option>
              <option value="Other">Other Maintenance Reason</option>
            </select>
            <textarea required rows="4" placeholder="Describe the issue in detail..." value={ticketForm.issueDescription} onChange={e => setTicketForm({...ticketForm, issueDescription: e.target.value})} className="w-full border p-2 rounded" />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowNewTicketModal(false)} className="px-3 py-1 border rounded">Cancel</button>
              <button type="submit" className="bg-slate-900 text-white px-3 py-1 rounded font-bold">Submit Ticket</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}