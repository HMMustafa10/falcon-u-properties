import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Building, Home, Shield, FileCheck, Users, Wrench, DollarSign, Calendar, 
  Search, Plus, Archive, LogOut, CheckCircle, AlertTriangle, Clock, Mail, 
  Phone, UserCheck, Calculator, ExternalLink, ChevronRight, Filter, Download,
  Trash2, Edit, RefreshCw
} from 'lucide-react';

// Supabase Initialization with Fallback
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Initial Mock Data
const INITIAL_PROPERTIES = [
  {
    id: '1',
    address: '14 High Street, Suite 4A, London',
    tenant: 'Marcus Vance',
    email: 'marcus.v@example.com',
    phone: '+44 7700 900077',
    rent: 2450,
    rentDueDay: 1,
    rentStatus: 'Paid',
    leaseStart: '2023-09-01',
    leaseEnd: '2025-08-31',
    gasSafetyDate: '2025-01-15',
    epcRating: 'B',
    epcExpiry: '2028-11-10',
    eicrExpiry: '2026-04-20',
    insuranceExpiry: '2025-03-30',
    visaExpiry: '2026-06-15',
    sharecode: 'W98-234-911',
    archived: false,
    notes: 'Standing order set up on 1st of every month.'
  },
  {
    id: '2',
    address: '22 Kensington Court, Apt 12, London',
    tenant: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    phone: '+44 7700 900123',
    rent: 3800,
    rentDueDay: 5,
    rentStatus: 'Overdue',
    leaseStart: '2024-01-15',
    leaseEnd: '2026-01-14',
    gasSafetyDate: '2024-11-05', // Due soon/Overdue warning
    epcRating: 'C',
    epcExpiry: '2027-02-14',
    eicrExpiry: '2025-10-12',
    insuranceExpiry: '2024-11-20',
    visaExpiry: '2024-12-01', // Visa warning
    sharecode: 'UK-773-902-X',
    archived: false,
    notes: 'Needs gas safety certificate renewal ASAP.'
  },
  {
    id: '3',
    address: '5 Park Lane, Flat 2B, Mayfair',
    tenant: 'David & Sarah Chen',
    email: 'david.chen@example.com',
    phone: '+44 7700 900456',
    rent: 5200,
    rentDueDay: 1,
    rentStatus: 'Paid',
    leaseStart: '2022-04-01',
    leaseEnd: '2025-03-31',
    gasSafetyDate: '2025-06-18',
    epcRating: 'A',
    epcExpiry: '2032-05-01',
    eicrExpiry: '2027-08-19',
    insuranceExpiry: '2025-09-15',
    visaExpiry: '2027-01-01',
    sharecode: 'UK-110-884-P',
    archived: false,
    notes: 'Rent review scheduled for March 2025.'
  }
];

const INITIAL_CONTRACTORS = [
  { id: '1', name: 'Apex Plumbing Services', trade: 'Plumber', phone: '+44 20 7946 0912', email: 'service@apexplumbing.co.uk', rating: '5.0' },
  { id: '2', name: 'SparkSafe Electrical Ltd', trade: 'Electrician', phone: '+44 20 7946 0843', email: 'help@sparksafe.co.uk', rating: '4.9' },
  { id: '3', name: 'British Gas Certified Engineers', trade: 'Gas Safety / Heating', phone: '+44 20 7946 0111', email: 'dispatch@bg-engineers.co.uk', rating: '4.8' },
  { id: '4', name: 'ProClean Tenancy Specialists', trade: 'Cleaner / Decorator', phone: '+44 20 7946 0777', email: 'info@procleanuk.com', rating: '4.7' }
];

export default function App() {
  // Navigation & Role States
  const [role, setRole] = useState('Landlord Admin'); // Landlord Admin, Managing Agent, Tenant Portal
  const [activeTab, setActiveTab] = useState('Home Dashboard');
  const [userEmail] = useState('mj@kingswaypartners.com');

  // Data States
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [contractors, setContractors] = useState(INITIAL_CONTRACTORS);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [isAddContractorOpen, setIsAddContractorOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [reminderToast, setReminderToast] = useState(null);

  // Form State for New Property
  const [newProp, setNewProp] = useState({
    address: '', tenant: '', email: '', phone: '', rent: '', rentDueDay: 1,
    leaseStart: '', leaseEnd: '', gasSafetyDate: '', epcRating: 'B',
    epcExpiry: '', eicrExpiry: '', insuranceExpiry: '', visaExpiry: '', sharecode: ''
  });

  // Form State for New Contractor
  const [newContractor, setNewContractor] = useState({ name: '', trade: 'Plumber', phone: '', email: '', rating: '5.0' });

  // Load from Supabase on Mount if configured
  useEffect(() => {
    if (supabase) {
      fetchPropertiesFromSupabase();
    }
  }, []);

  const fetchPropertiesFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from('properties').select('*');
      if (data && data.length > 0 && !error) {
        setProperties(data);
      }
    } catch (err) {
      console.log('Using local state fallback:', err);
    }
  };

  // Quick Action Handler for Modals
  const handleAddProperty = (e) => {
    e.preventDefault();
    const created = { ...newProp, id: Date.now().toString(), rent: Number(newProp.rent), rentStatus: 'Paid', archived: false };
    setProperties([created, ...properties]);
    setIsAddPropertyOpen(false);
    setNewProp({
      address: '', tenant: '', email: '', phone: '', rent: '', rentDueDay: 1,
      leaseStart: '', leaseEnd: '', gasSafetyDate: '', epcRating: 'B',
      epcExpiry: '', eicrExpiry: '', insuranceExpiry: '', visaExpiry: '', sharecode: ''
    });
    showToast('New property created successfully!');
  };

  const handleAddContractor = (e) => {
    e.preventDefault();
    setContractors([{ ...newContractor, id: Date.now().toString() }, ...contractors]);
    setIsAddContractorOpen(false);
    setNewContractor({ name: '', trade: 'Plumber', phone: '', email: '', rating: '5.0' });
    showToast('Contractor added to directory!');
  };

  const showToast = (msg) => {
    setReminderToast(msg);
    setTimeout(() => setReminderToast(null), 4000);
  };

  const toggleArchive = (id) => {
    setProperties(properties.map(p => p.id === id ? { ...p, archived: !p.archived } : p));
  };

  const toggleRentStatus = (id) => {
    setProperties(properties.map(p => p.id === id ? { ...p, rentStatus: p.rentStatus === 'Paid' ? 'Overdue' : 'Paid' } : p));
  };

  // Filter Properties by search query & archive status
  const visibleProperties = properties.filter(p => {
    const isArchivedView = activeTab === 'Archived Vault';
    if (isArchivedView !== p.archived) return false;
    
    return (
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tenant.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Section 13 Notice Rent Increment Calculator Logic
  const calculateIncrement = (currentRent, percentage) => {
    const val = Number(currentRent) || 0;
    const inc = val * (Number(percentage) / 100);
    return { newRent: (val + inc).toFixed(2), addition: inc.toFixed(2) };
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 font-sans pb-12">
      
      {/* 1. TOP BAR */}
      <header className="bg-slate-900 text-slate-300 text-xs py-2 px-6 flex justify-between items-center shadow-inner">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium tracking-wide">Falcon U Cloud Engine • Real-time Sync Active</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>User: <strong className="text-white">{userEmail}</strong></span>
          <button 
            onClick={() => showToast('Log out action initiated')}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1 rounded transition text-xs flex items-center space-x-1"
          >
            <LogOut className="w-3.5 h-3.5 mr-1" /> Log Out
          </button>
        </div>
      </header>

      {/* TOAST NOTIFICATION */}
      {reminderToast && (
        <div className="fixed bottom-4 right-4 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 z-50 border border-amber-500">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm">{reminderToast}</span>
        </div>
      )}

      {/* 2. HEADER TITLE & ROLE SWITCHER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#964B00] tracking-tight">
            FALCON U PROPERTIES
          </h1>
          <p className="text-sky-600 font-medium text-base sm:text-lg mt-1">
            Enterprise Portfolio & Tenancy Management System
          </p>
        </div>

        {/* ROLE SWITCHER */}
        <div className="flex justify-center space-x-2 mb-8">
          {['Landlord Admin', 'Managing Agent', 'Tenant Portal'].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm ${
                role === r 
                  ? 'bg-sky-600 text-white ring-2 ring-sky-600 ring-offset-2' 
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {r === 'Landlord Admin' && <Shield className="w-4 h-4 inline mr-1.5" />}
              {r === 'Managing Agent' && <Building className="w-4 h-4 inline mr-1.5" />}
              {r === 'Tenant Portal' && <Home className="w-4 h-4 inline mr-1.5" />}
              {r}
            </button>
          ))}
        </div>

        {/* 3. SUB-NAVIGATION TABS */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 bg-slate-100 p-2 rounded-xl border border-slate-200">
          {[
            { id: 'Home Dashboard', label: 'Home Dashboard', icon: Home },
            { id: 'Contractor Directory', label: `Contractor Directory (${contractors.length})`, icon: Wrench },
            { id: 'Certificates Due', label: 'Certificates Due', icon: FileCheck },
            { id: 'Insurance Due', label: 'Insurance Due', icon: Shield },
            { id: 'Visa Expiries', label: 'Visa Expiries', icon: UserCheck },
            { id: 'Rent Due & Reminders', label: 'Rent Due & Reminders', icon: DollarSign },
            { id: 'Rent Increments', label: 'Rent Increments', icon: Calculator },
            { id: '+ Add Property', label: '+ Add Property', icon: Plus, isAction: true },
            { id: 'Archived Vault', label: 'Archived Vault', icon: Archive }
          ].map((tab) => {
            const Icon = tab.icon;
            if (tab.isAction) {
              return (
                <button
                  key={tab.id}
                  onClick={() => setIsAddPropertyOpen(true)}
                  className="bg-white hover:bg-emerald-50 text-emerald-700 font-semibold px-4 py-2 rounded-lg text-sm border border-emerald-300 shadow-sm transition flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> + Add Property
                </button>
              );
            }
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center ${
                  activeTab === tab.id 
                    ? 'bg-sky-600 text-white shadow' 
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 mr-1.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 4. SUMMARY METRIC CARDS (Always visible on Home Dashboard) */}
        {activeTab === 'Home Dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <div 
              onClick={() => setActiveTab('Certificates Due')}
              className="bg-white p-4 rounded-xl border-l-4 border-l-red-500 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">CERTIFICATES RENEWAL</h4>
              <p className="text-sm font-bold text-red-600 mt-2 flex items-center">
                🚨 7-Day Red Warning Active
              </p>
            </div>

            <div 
              onClick={() => setActiveTab('Insurance Due')}
              className="bg-white p-4 rounded-xl border-l-4 border-l-sky-500 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">INSURANCE RENEWAL DUE</h4>
              <p className="text-sm font-bold text-sky-600 mt-2 flex items-center">
                🛡️ View Policy Expiries →
              </p>
            </div>

            <div 
              onClick={() => setActiveTab('Visa Expiries')}
              className="bg-white p-4 rounded-xl border-l-4 border-l-emerald-500 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">TENANTS VISA EXPIRIES</h4>
              <p className="text-sm font-bold text-emerald-600 mt-2 flex items-center">
                🛂 Check Expiries & Sharecodes →
              </p>
            </div>

            <div 
              onClick={() => setActiveTab('Rent Due & Reminders')}
              className="bg-white p-4 rounded-xl border-l-4 border-l-amber-500 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">RENT COLLECTION</h4>
              <p className="text-sm font-bold text-amber-600 mt-2 flex items-center">
                💰 View Due Rent & Email Reminders →
              </p>
            </div>

            <div 
              onClick={() => setActiveTab('Contractor Directory')}
              className="bg-white p-4 rounded-xl border-l-4 border-l-amber-600 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">SUPPLIERS DIRECTORY</h4>
              <p className="text-sm font-bold text-amber-700 mt-2 flex items-center">
                🛠️ Plumbers, Electricians & Trades →
              </p>
            </div>
          </div>
        )}

        {/* 5. DYNAMIC TAB CONTENT */}

        {/* HOME DASHBOARD & ARCHIVED VAULT */}
        {(activeTab === 'Home Dashboard' || activeTab === 'Archived Vault') && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center">
                <Home className="w-5 h-5 mr-2 text-amber-700" />
                {activeTab === 'Archived Vault' ? 'Archived Properties' : `Portfolio Units (${visibleProperties.length})`}
              </h2>
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search address or tenant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {visibleProperties.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
                <Building className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-600 font-medium">
                  {activeTab === 'Archived Vault' ? 'No archived properties found.' : 'No properties created yet. Click + Add Property above to create your first unit!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleProperties.map((prop) => (
                  <div key={prop.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden">
                    <div className="bg-slate-800 text-white p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-base leading-snug">{prop.address}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          prop.rentStatus === 'Paid' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-red-500/20 text-red-300 border border-red-400/30'
                        }`}>
                          {prop.rentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">Tenant: <strong>{prop.tenant}</strong></p>
                    </div>

                    <div className="p-4 space-y-3 text-sm">
                      <div className="flex justify-between text-slate-600">
                        <span>Monthly Rent:</span>
                        <span className="font-bold text-slate-900">£{prop.rent.toLocaleString()}/mo</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Gas Safety (CP12):</span>
                        <span className="font-medium text-slate-800">{prop.gasSafetyDate}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>EPC Rating:</span>
                        <span className="font-bold text-emerald-600">Grade {prop.epcRating}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Right to Rent Sharecode:</span>
                        <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-800">{prop.sharecode || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 border-t border-slate-100 flex justify-between items-center">
                      <button 
                        onClick={() => setSelectedProperty(prop)}
                        className="text-sky-600 hover:text-sky-800 text-xs font-bold flex items-center"
                      >
                        View Details <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                      <button 
                        onClick={() => toggleArchive(prop.id)}
                        className="text-slate-400 hover:text-slate-600 text-xs font-medium flex items-center"
                      >
                        <Archive className="w-3.5 h-3.5 mr-1" />
                        {prop.archived ? 'Unarchive' : 'Archive'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CONTRACTOR DIRECTORY TAB */}
        {activeTab === 'Contractor Directory' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Suppliers & Contractors Directory</h2>
                <p className="text-xs text-slate-500">Approved emergency plumbers, gas engineers, electricians, and handymen.</p>
              </div>
              <button 
                onClick={() => setIsAddContractorOpen(true)}
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition flex items-center"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add Contractor
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contractors.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-slate-200 hover:border-sky-300 transition flex justify-between items-center bg-slate-50/50">
                  <div>
                    <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">{c.trade}</span>
                    <h4 className="font-bold text-slate-900 mt-2">{c.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Rating: ⭐ {c.rating}</p>
                    <div className="text-xs text-slate-600 mt-2 space-y-1">
                      <p className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1 text-slate-400" /> {c.phone}</p>
                      <p className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1 text-slate-400" /> {c.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <a href={`tel:${c.phone}`} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center justify-center">
                      <Phone className="w-3 h-3 mr-1" /> Call
                    </a>
                    <a href={`mailto:${c.email}`} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center justify-center">
                      <Mail className="w-3 h-3 mr-1" /> Email
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATES DUE TAB */}
        {activeTab === 'Certificates Due' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Gas Safety, EPC & EICR Compliance Tracker</h2>
            <p className="text-xs text-slate-500 mb-6">Monitors mandatory statutory safety certifications across your real estate portfolio.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-700 uppercase text-xs">
                  <tr>
                    <th className="p-3 rounded-l-lg">Property Address</th>
                    <th className="p-3">Gas Safety (CP12)</th>
                    <th className="p-3">EPC Rating / Expiry</th>
                    <th className="p-3">EICR Electrical</th>
                    <th className="p-3 rounded-r-lg">Action Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {properties.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">{p.address}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 flex items-center w-fit">
                          <AlertTriangle className="w-3 h-3 mr-1" /> {p.gasSafetyDate}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-emerald-600">Grade {p.epcRating}</span> (exp: {p.epcExpiry})
                      </td>
                      <td className="p-3 text-slate-700">{p.eicrExpiry}</td>
                      <td className="p-3">
                        <button 
                          onClick={() => showToast(`Inspection reminder email dispatched to contractor for ${p.address}`)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
                        >
                          Book Engineer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INSURANCE DUE TAB */}
        {activeTab === 'Insurance Due' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Landlord Buildings & Indemnity Insurance Tracker</h2>
            <p className="text-xs text-slate-500 mb-6">Ensure policy continuity for mortgage compliance and asset risk protection.</p>

            <div className="space-y-4">
              {properties.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-slate-200 flex justify-between items-center bg-sky-50/30">
                  <div>
                    <h4 className="font-bold text-slate-900">{p.address}</h4>
                    <p className="text-xs text-slate-500 mt-1">Policy Expiry: <strong className="text-slate-800">{p.insuranceExpiry}</strong></p>
                  </div>
                  <button 
                    onClick={() => showToast(`Insurance renewal alert logged for ${p.address}`)}
                    className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-4 py-2 rounded-lg"
                  >
                    Request Broker Quote
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISA EXPIRIES TAB */}
        {activeTab === 'Visa Expiries' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-2">UK Home Office Right-to-Rent & Visa Tracker</h2>
            <p className="text-xs text-slate-500 mb-6">Maintain legal compliance under UK immigration law for non-UK passport holders.</p>

            <div className="space-y-4">
              {properties.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center bg-emerald-50/20 gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900">{p.tenant} ({p.address})</h4>
                    <div className="flex items-center space-x-4 mt-2 text-xs">
                      <span>Sharecode: <strong className="font-mono bg-white px-2 py-0.5 border border-slate-200 rounded">{p.sharecode || 'N/A'}</strong></span>
                      <span>Visa Expiry Date: <strong className="text-red-600">{p.visaExpiry}</strong></span>
                    </div>
                  </div>
                  <button 
                    onClick={() => showToast(`Direct sharecode re-verification email sent to ${p.tenant}`)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg w-fit"
                  >
                    Verify Sharecode Online
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RENT DUE & REMINDERS TAB */}
        {activeTab === 'Rent Due & Reminders' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Rent Collection & Automated Reminders</h2>
            <p className="text-xs text-slate-500 mb-6">Track ledger payment states and dispatch instant digital payment reminders.</p>

            <div className="space-y-4">
              {properties.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-900">{p.address}</h4>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded ${p.rentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {p.rentStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">Tenant: {p.tenant} • Due Day: {p.rentDueDay}st of month • Rent: £{p.rent}/mo</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => toggleRentStatus(p.id)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-3 py-2 rounded-lg"
                    >
                      Toggle Status
                    </button>
                    <button 
                      onClick={() => showToast(`Automated rent reminder email sent to ${p.email}`)}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center"
                    >
                      <Mail className="w-3.5 h-3.5 mr-1" /> Send Reminder Email
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RENT INCREMENTS TAB */}
        {activeTab === 'Rent Increments' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Section 13 Rent Review Calculator</h2>
            <p className="text-xs text-slate-500 mb-6">Calculate legally compliant rent adjustments for AST tenancy renewals.</p>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); showToast('Section 13 notice generated!'); }}>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Property</label>
                <select className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white">
                  {properties.map(p => <option key={p.id}>{p.address} - Current Rent: £{p.rent}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Proposed Increase (%)</label>
                  <input type="number" defaultValue="5" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Effective Date</label>
                  <input type="date" defaultValue="2025-04-01" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm" />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500">Calculated Adjustment:</p>
                <p className="text-lg font-bold text-slate-900 mt-1">+£122.50 / month (New Rent: £2,572.50)</p>
              </div>

              <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg text-sm transition">
                Generate Form 4 Section 13 Notice PDF
              </button>
            </form>
          </div>
        )}

      </div>

      {/* MODAL: ADD PROPERTY */}
      {isAddPropertyOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Add New Portfolio Unit</h3>
              <button onClick={() => setIsAddPropertyOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddProperty} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Property Address *</label>
                <input required type="text" placeholder="e.g. 10 Downing St, London" value={newProp.address} onChange={e => setNewProp({...newProp, address: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tenant Full Name *</label>
                  <input required type="text" placeholder="John Doe" value={newProp.tenant} onChange={e => setNewProp({...newProp, tenant: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Rent (£) *</label>
                  <input required type="number" placeholder="2500" value={newProp.rent} onChange={e => setNewProp({...newProp, rent: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tenant Email</label>
                  <input type="email" placeholder="tenant@example.com" value={newProp.email} onChange={e => setNewProp({...newProp, email: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gas Safety (CP12) Date</label>
                  <input type="date" value={newProp.gasSafetyDate} onChange={e => setNewProp({...newProp, gasSafetyDate: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Visa Expiry Date</label>
                  <input type="date" value={newProp.visaExpiry} onChange={e => setNewProp({...newProp, visaExpiry: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Right-to-Rent Sharecode</label>
                  <input type="text" placeholder="UK-990-123-X" value={newProp.sharecode} onChange={e => setNewProp({...newProp, sharecode: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button type="button" onClick={() => setIsAddPropertyOpen(false)} className="px-4 py-2 border rounded-lg text-xs font-bold text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold">Save Property</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CONTRACTOR */}
      {isAddContractorOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Add Supplier / Contractor</h3>
              <button onClick={() => setIsAddContractorOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddContractor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company / Name</label>
                <input required type="text" placeholder="London Emergency Gas" value={newContractor.name} onChange={e => setNewContractor({...newContractor, name: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Trade Category</label>
                <select value={newContractor.trade} onChange={e => setNewContractor({...newContractor, trade: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm bg-white">
                  <option>Plumber</option>
                  <option>Electrician</option>
                  <option>Gas Safety / Heating</option>
                  <option>Cleaner / Decorator</option>
                  <option>General Handyman</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input required type="text" placeholder="+44 20 7000 0000" value={newContractor.phone} onChange={e => setNewContractor({...newContractor, phone: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input required type="email" placeholder="contact@trade.co.uk" value={newContractor.email} onChange={e => setNewContractor({...newContractor, email: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button type="button" onClick={() => setIsAddContractorOpen(false)} className="px-4 py-2 border rounded-lg text-xs font-bold text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold">Save Contractor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW PROPERTY DETAILS */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
            <div className="flex justify-between items-start mb-4 border-b pb-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedProperty.address}</h3>
                <span className="text-xs text-sky-600 font-semibold">Tenant: {selectedProperty.tenant}</span>
              </div>
              <button onClick={() => setSelectedProperty(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-xs text-slate-500 block">Rent Amount</span>
                <span className="font-bold text-slate-900">£{selectedProperty.rent}/month</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-xs text-slate-500 block">Payment Status</span>
                <span className={`font-bold ${selectedProperty.rentStatus === 'Paid' ? 'text-emerald-600' : 'text-red-600'}`}>{selectedProperty.rentStatus}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-xs text-slate-500 block">Gas Safety (CP12)</span>
                <span className="font-medium text-slate-800">{selectedProperty.gasSafetyDate || 'Pending'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-xs text-slate-500 block">Right-to-Rent Sharecode</span>
                <span className="font-mono text-slate-800">{selectedProperty.sharecode || 'N/A'}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={() => setSelectedProperty(null)} className="bg-slate-800 text-white px-5 py-2 rounded-lg text-xs font-bold">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}