import React, { useState, useEffect, useRef } from 'react';
import {
  Building2, Plus, Pencil, Trash2, X, LogOut, ChevronDown, Download, Send, ArrowLeft, KeyRound, Eye, EyeOff, ShieldCheck, Mail, Phone, Clock, FileSpreadsheet, AlertTriangle, FileText
} from 'lucide-react';

/* ---------- Helper Functions ---------- */
const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().slice(0, 10);
const ym = (d = new Date()) => d.toISOString().slice(0, 7);
const gbp = n => '£' + Number(n || 0).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const days = d => Math.ceil((new Date(d) - new Date()) / 864e5);
const status = d => {
  if (!d) return 'Valid';
  const n = days(d);
  return n < 0 ? 'Expired' : n <= 60 ? 'Expiring Soon' : 'Valid';
};

const F = (k, l, t = 'text', o) => ({ k, l, t, o });

const TYPES = ['Flat', 'House', 'HMO', 'Commercial', 'Hotel / Airbnb / Booking.com'];
const CERTS = ['Gas Safety (CP12)', 'EICR', 'EPC', 'Selective Licence', 'HMO Licence', 'Fire Risk Assessment', 'PAT Test', 'Legionella', 'Smoke & CO Alarms', 'DPS Deposit Certificate', 'Other'];
const EXP_CATS = ['Repairs', 'Maintenance', 'Insurance', 'Mortgage', 'Utilities', 'Council Tax', 'Agent Fees', 'Cleaning', 'Legal', 'Licence/Compliance', 'Furnishing', 'Other'];

const pill = s => ({
  Valid: 'bg-green-100 text-green-800 border-green-200',
  Paid: 'bg-green-100 text-green-800 border-green-200',
  Closed: 'bg-green-100 text-green-800 border-green-200',
  'Expiring Soon': 'bg-amber-100 text-amber-800 border-amber-200',
  Expired: 'bg-red-100 text-red-800 border-red-200',
  Unpaid: 'bg-red-100 text-red-800 border-red-200',
  Open: 'bg-red-100 text-red-800 border-red-200'
}[s] || 'bg-slate-100 text-slate-700 border-slate-200');

/* ---------- CSV Export Generator ---------- */
const downloadCSV = (filename, headers, rows) => {
  const processCell = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = 'data:text/csv;charset=utf-8,' 
    + [headers.map(processCell).join(','), ...rows.map(row => row.map(processCell).join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}_${today()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/* ---------- Enhanced Metallic Gold Falcon Logo Component ---------- */
const FalconLogo = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="35%" stopColor="#F59E0B" />
        <stop offset="70%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
      <linearGradient id="goldBright" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="50%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
    
    {/* Falcon Wings & Body Outline */}
    <path d="M 80 150 C 130 60, 220 30, 270 90 C 230 100, 180 130, 150 170 C 200 150, 280 140, 310 180 C 260 190, 200 210, 160 250 C 210 230, 250 235, 270 260 C 210 270, 130 260, 80 150 Z" fill="url(#goldGrad)" />
    <path d="M 120 120 Q 200 70 240 110 Q 180 130 140 160 Z" fill="url(#goldBright)" />
    <path d="M 140 180 Q 220 160 260 195 Q 200 205 160 225 Z" fill="url(#goldBright)" />
    
    {/* Head & Beak */}
    <path d="M 270 90 Q 300 70 320 95 Q 310 105 295 110 C 285 100, 275 95, 270 90 Z" fill="url(#goldBright)" />
    <circle cx="285" cy="92" r="4" fill="#0F172A" />

    {/* Skyline Buildings */}
    <rect x="290" y="150" width="22" height="90" fill="url(#goldGrad)" rx="2" />
    <rect x="317" y="110" width="28" height="130" fill="url(#goldBright)" rx="2" />
    <rect x="350" y="135" width="24" height="105" fill="url(#goldGrad)" rx="2" />
    <rect x="379" y="170" width="20" height="70" fill="url(#goldBright)" rx="2" />
    
    {/* Windows */}
    <rect x="323" y="120" width="6" height="8" fill="#0F172A" />
    <rect x="333" y="120" width="6" height="8" fill="#0F172A" />
    <rect x="323" y="135" width="6" height="8" fill="#0F172A" />
    <rect x="333" y="135" width="6" height="8" fill="#0F172A" />
    <rect x="323" y="150" width="6" height="8" fill="#0F172A" />
    <rect x="333" y="150" width="6" height="8" fill="#0F172A" />
    
    {/* Roof & Base Arch */}
    <path d="M 270 240 L 317 210 L 364 240 Z" fill="url(#goldBright)" />
    <path d="M 50 250 Q 250 210 450 250 L 450 258 Q 250 218 50 258 Z" fill="url(#goldGrad)" />
    <rect x="60" y="262" width="380" height="6" fill="url(#goldBright)" rx="2" />
  </svg>
);

/* ---------- Seed Data Generator ---------- */
const mkProp = (id, address, type, rent, extra = {}) => ({
  id, address, type, rent, deposit: rent, depositScheme: 'DPS', contractParty: '', contractType: 'AST', councilTax: 'Band C', furnishing: 'Furnished', garden: 'No', parking: 'None',
  certs: [], insurance: [], mortgage: [], suppliers: [], meters: [], docs: [], income: [], tenant: null, ...extra
});

const seed = () => ({
  props: [
    mkProp('P1', '12 Falcon Way, London E1 6AN', 'Flat', 1450, {
      contractParty: 'Falcon Properties & Muhammad Mustafa', depositScheme: 'DPS', garden: 'Private', parking: '1 Space',
      certs: [
        { id: 'c1', type: 'Gas Safety (CP12)', ref: 'GAS-88219', expiry: '2026-11-15' },
        { id: 'c2', type: 'EICR', ref: 'EICR-99120', expiry: '2027-03-20' },
        { id: 'c3', type: 'EPC', ref: 'EPC-11204', expiry: '2028-06-10' }
      ],
      insurance: [
        { id: 'i1', provider: 'Aviva Landlord Policy', policy: 'AV-992011', premium: 450, start: '2025-12-02', expiry: '2026-12-01' }
      ],
      mortgage: [
        { id: 'm1', lender: 'Nationwide BS', account: 'MT-4411', monthly: 720, rate: '4.1%', endDate: '2028-04-01', notes: 'Fixed rate deal' }
      ],
      suppliers: [
        { id: 's1', kind: 'Gas', name: 'British Gas', account: 'BG-99120', phone: '0333 202 9802', notes: 'Direct debit' },
        { id: 's2', kind: 'Electricity', name: 'Octopus Energy', account: 'OCT-4412', phone: '0808 164 1088', notes: 'Smart meter' },
        { id: 's3', kind: 'Water', name: 'Thames Water', account: 'TW-8821', phone: '0800 980 8800', notes: '' }
      ],
      meters: [
        { id: 'r1', utility: 'Electricity', kind: 'Opening', reading: '14230 kWh', date: '2024-01-15' }
      ],
      docs: [
        { id: 'd1', name: 'Tenancy_Agreement_AST.pdf', category: 'Agreement' }
      ],
      tenant: {
        name: 'Muhammad Mustafa', email: 'mustafa@example.com', phone: '+44 7700 900077', passport: 'GB123456789', origin: 'United Kingdom', job: 'Engineer (Full-Time)', moveIn: '2024-01-15', rentDay: 1, visaStatus: 'UK Citizen', visaCategory: '', shareCode: '', visaExpiry: '', proof: '', notes: 'Discuss rent review in Q4.', family: [
          { id: 'f1', name: 'Fatima Mustafa', relation: 'Spouse', visaStatus: 'Skilled Worker Dependant', visaExpiry: '2026-11-10', shareCode: 'DEF456GHI' }
        ]
      }
    }),
    mkProp('P2', '88 Commercial Road, London E1 1RD', 'Commercial', 3200, {
      deposit: 6400, depositScheme: 'MyDeposits', contractParty: 'Falcon Properties & Falcon Express Ltd', contractType: 'FRI Lease', councilTax: 'Business Rates', furnishing: 'Unfurnished',
      certs: [{ id: 'c5', type: 'Gas Safety (CP12)', ref: 'CGAS-9912', expiry: '2027-01-10' }],
      insurance: [{ id: 'i2', provider: 'AXA Commercial', policy: 'AX-77210', premium: 1250, start: '2026-05-16', expiry: '2027-05-15' }],
      tenant: { name: 'John Miller (Director)', email: 'john@falconexpress.co.uk', phone: '+44 20 7946 0912', passport: 'US987654321', origin: 'United States', job: 'Company Director', moveIn: '2022-01-01', rentDay: 1, visaStatus: 'Tier 1 Investor', visaCategory: 'Investor', shareCode: 'COMM-9912', visaExpiry: '2099-12-31', proof: '', notes: '10-year FRI lease.', family: [] }
    }),
    mkProp('P3', 'Flat 3, 29 Selborne Road, Ilford IG1 3AH', 'Hotel / Airbnb / Booking.com', 0, { furnishing: 'Fully Furnished', income: [{ id: 'h1', month: ym(), amount: 1850, notes: 'Airbnb + Booking.com payout' }] }),
    mkProp('P4', 'Flat 4, 29 Selborne Road, Ilford IG1 3AH', 'Hotel / Airbnb / Booking.com', 0, { furnishing: 'Fully Furnished', income: [{ id: 'h2', month: ym(), amount: 1600, notes: 'Airbnb + Booking.com payout' }] })
  ],
  users: [
    { id: 'u0', name: 'MJ Kingsway', username: 'mj@kingswaypartners.com', password: 'Password123!', role: 'landlord', props: [] },
    { id: 'u1', name: 'Landlord Admin', username: 'landlord@falconproperties.co.uk', password: 'landlord123', role: 'landlord', props: [] },
    { id: 'u2', name: 'Agent One', username: 'agent1@falconproperties.co.uk', password: 'agent123', role: 'agent', props: ['P1', 'P3'] },
    { id: 'u3', name: 'Muhammad Mustafa', username: 'mustafa@example.com', password: 'tenant123', role: 'tenant', props: ['P1'] }
  ],
  contractors: [
    { id: 'k1', name: 'John’s Gas & Heating', trade: 'Gas Engineer', company: 'Apex Heating Ltd', phone: '+44 7911 123456', email: 'gas@apexheating.co.uk', notes: 'Gas Safe #55412' },
    { id: 'k2', name: 'Bright Spark Electric', trade: 'Electrician', company: 'Current Solutions Ltd', phone: '+44 7911 654321', email: 'info@brightspark.co.uk', notes: 'NICEIC' }
  ],
  archive: [{ id: 'a1', address: '12 Falcon Way, London E1 6AN', name: 'David Smith', moveIn: '2021-01-01', moveOut: '2023-12-31', reason: 'End of AST' }],
  tickets: [{ id: 't1', propId: 'P1', category: 'Plumbing', desc: 'Kitchen sink dripping.', priority: 'Medium', status: 'Open', date: today() }],
  expenses: [{ id: 'e1', propId: 'P1', date: today(), category: 'Repairs', amount: 120, supplier: 'FlowRight Plumbing', notes: 'Tap washer' }],
  payments: [],
  settings: { phone: '02071835494', email: 'info@falconproperties.co.uk', hours: 'Mon–Fri 9:30 AM – 5:00 PM', gas: '0800 111999', power: '105', address: 'London, United Kingdom' }
});

/* ---------- UI Components ---------- */
const Btn = ({ c = 'bg-slate-900 text-white hover:bg-slate-800', ...p }) => (
  <button {...p} className={`${c} px-3 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1 transition-colors ${p.className || ''}`} />
);

const Card = ({ title, action, children }) => (
  <section className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 shadow-sm">
    {(title || action) && (
      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
        <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
        {action}
      </div>
    )}
    {children}
  </section>
);

function FormModal({ title, fields, initial = {}, onSubmit, onClose }) {
  const [v, setV] = useState(initial);
  const set = (k, x) => setV(s => ({ ...s, [k]: x }));

  const file = (k, f) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setV(s => ({ ...s, [k]: f.name, [k + 'Data']: f.size < 400000 ? r.result : '' }));
    r.readAsDataURL(f);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <form onSubmit={e => { e.preventDefault(); onSubmit(v); }} className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4 text-xs shadow-2xl">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-sm text-slate-900">{title}</h3>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-3">
          {fields.map(f => (
            <label key={f.k} className="block space-y-1">
              <span className="font-semibold text-slate-700">{f.l}</span>
              {f.t === 'select' ? (
                <select value={v[f.k] ?? ''} onChange={e => set(f.k, e.target.value)} className="w-full border rounded-lg p-2 bg-white text-slate-800 border-slate-300">
                  {f.o.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : f.t === 'textarea' ? (
                <textarea rows={3} value={v[f.k] ?? ''} onChange={e => set(f.k, e.target.value)} className="w-full border rounded-lg p-2 text-slate-800 border-slate-300" />
              ) : f.t === 'file' ? (
                <div>
                  <input type="file" onChange={e => file(f.k, e.target.files[0])} className="w-full text-slate-600" />
                  {v[f.k] && <span className="text-[11px] text-amber-600 mt-1 block">Attached: {v[f.k]}</span>}
                </div>
              ) : (
                <input type={f.t} step={f.t === 'number' ? '0.01' : undefined} value={v[f.k] ?? ''} onChange={e => set(f.k, e.target.value)} className="w-full border rounded-lg p-2 text-slate-800 border-slate-300" />
              )}
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2 border-t pt-3">
          <Btn type="button" c="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50" onClick={onClose}>Cancel</Btn>
          <Btn c="bg-amber-500 hover:bg-amber-600 text-slate-950">Save Changes</Btn>
        </div>
      </form>
    </div>
  );
}

function CrudList({ title, items, fields, onAdd, onEdit, onDel, canEdit = true, canDel = true, line, badge, empty = 'Nothing recorded yet.', exportCsv }) {
  const [form, setForm] = useState(null);
  return (
    <Card 
      title={`${title} (${items.length})`} 
      action={
        <div className="flex gap-2">
          {exportCsv && (
            <Btn c="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={exportCsv}>
              <FileSpreadsheet className="w-3.5 h-3.5" /> Export CSV
            </Btn>
          )}
          {canEdit && onAdd && <Btn onClick={() => setForm({})}><Plus className="w-3 h-3" />Add New</Btn>}
        </div>
      }
    >
      {items.length === 0 && <p className="text-xs text-slate-400 italic">{empty}</p>}
      <div className="space-y-2">
        {items.map(it => (
          <div key={it.id} className="flex justify-between items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs">
            <div className="min-w-0 flex-1">{line(it)}</div>
            <div className="flex items-center gap-1.5 shrink-0">
              {badge && badge(it)}
              {(it.data || it.proof) && (
                <a href={it.data || it.proof} download={it.name || 'document'} className="p-1 text-slate-600 hover:text-slate-900" title="Download Document">
                  <Download className="w-3.5 h-3.5" />
                </a>
              )}
              {canEdit && onEdit && (
                <button onClick={() => setForm(it)} className="p-1 text-amber-600 hover:text-amber-700" title="Edit">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
              {canDel && onDel && (
                <button onClick={() => window.confirm('Delete this record?') && onDel(it.id)} className="p-1 text-red-600 hover:text-red-700" title="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {form && (
        <FormModal title={form.id ? `Edit ${title}` : `Add New ${title}`} fields={fields} initial={form} onClose={() => setForm(null)} onSubmit={v => { form.id ? onEdit(v) : onAdd(v); setForm(null); }} />
      )}
    </Card>
  );
}

/* ---------- Secure OTP Password Reset Modal ---------- */
function ResetModal({ users, onUpdate, onClose }) {
  const [step, setStep] = useState(1); // 1 = Request Code, 2 = Verify OTP & Reset
  const [email, setEmail] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Step 1: Request Security Code
  const handleRequestOtp = e => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.username.trim().toLowerCase() === cleanEmail);

    if (!user) {
      setMsg({ type: 'err', text: 'No registered account found with that email address.' });
      return;
    }

    // Generate a secure 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setStep(2);
    setMsg({
      type: 'info',
      text: `Security verification OTP generated for ${cleanEmail}. Your 6-Digit Code is: [ ${code} ]`
    });
  };

  // Step 2: Verify Code and Save New Password
  const handleVerifyAndReset = e => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (userOtp.trim() !== generatedOtp) {
      setMsg({ type: 'err', text: 'Invalid Security OTP code. Please check and try again.' });
      return;
    }

    if (newPass.length < 6) {
      setMsg({ type: 'err', text: 'Password must be at least 6 characters long for high security.' });
      return;
    }

    onUpdate(cleanEmail, newPass);
    setMsg({ type: 'success', text: 'Password verified and reset successfully! Updating session...' });
    setTimeout(() => onClose(cleanEmail), 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4 text-xs shadow-2xl">
        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900">Secure Password Reset</h3>
          </div>
          <button type="button" onClick={() => onClose()}><X className="w-4 h-4 text-slate-400" /></button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <p className="text-slate-600">Enter your registered email address. A 6-digit security OTP code will be generated for email verification.</p>

            <label className="block space-y-1">
              <span className="font-semibold text-slate-700">Registered Email Address</span>
              <div className="relative">
                <input
                  autoFocus
                  required
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border rounded-lg p-2.5 pl-9 bg-slate-50 focus:bg-white text-slate-800"
                />
                <Mail className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
              </div>
            </label>

            {msg.text && (
              <p className={`p-2.5 rounded-lg border font-medium ${msg.type === 'err' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                {msg.text}
              </p>
            )}

            <div className="flex justify-end gap-2 border-t pt-3">
              <Btn type="button" c="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50" onClick={() => onClose()}>Cancel</Btn>
              <Btn c="bg-amber-500 hover:bg-amber-600 text-slate-950">Send Security OTP</Btn>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndReset} className="space-y-4">
            <p className="text-slate-600">Verification OTP issued for <strong>{email}</strong>. Enter the OTP code and set your new password.</p>

            {msg.text && (
              <div className={`p-2.5 rounded-lg border font-medium text-xs ${msg.type === 'err' ? 'bg-red-50 text-red-700 border-red-200' : msg.type === 'info' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                {msg.text}
              </div>
            )}

            <label className="block space-y-1">
              <span className="font-semibold text-slate-700">Enter 6-Digit Security OTP</span>
              <input
                autoFocus
                required
                maxLength={6}
                type="text"
                placeholder="6-digit OTP code"
                value={userOtp}
                onChange={e => setUserOtp(e.target.value)}
                className="w-full border rounded-lg p-2.5 font-mono text-center text-sm font-bold tracking-widest bg-slate-50 focus:bg-white text-slate-900 border-amber-300"
              />
            </label>

            <label className="block space-y-1">
              <span className="font-semibold text-slate-700">New Password (min 6 chars)</span>
              <div className="relative">
                <input
                  required
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter new strong password"
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  className="w-full border rounded-lg p-2.5 pr-10 bg-slate-50 focus:bg-white text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </label>

            <div className="flex justify-between items-center border-t pt-3">
              <button type="button" onClick={() => setStep(1)} className="text-xs text-slate-500 underline">← Re-enter Email</button>
              <div className="flex gap-2">
                <Btn type="button" c="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50" onClick={() => onClose()}>Cancel</Btn>
                <Btn c="bg-amber-500 hover:bg-amber-600 text-slate-950">Verify OTP & Save Password</Btn>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ---------- Main Application ---------- */
export default function App() {
  const [db, setDb] = useState(() => {
    try {
      const s = localStorage.getItem('falcon_db_v36');
      return s ? JSON.parse(s) : seed();
    } catch {
      return seed();
    }
  });

  const [me, setMe] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('falcon_me'));
    } catch {
      return null;
    }
  });

  const [view, setView] = useState('dash');
  const [propId, setPropId] = useState(null);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [typeF, setTypeF] = useState('All');
  const [month, setMonth] = useState(ym());
  const [login, setLogin] = useState({ u: '', p: '', role: 'landlord', signup: false, err: '' });
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [modal, setModal] = useState(null);
  const [assign, setAssign] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem('falcon_db_v36', JSON.stringify(db)); } catch { }
  }, [db]);

  useEffect(() => {
    try { sessionStorage.setItem('falcon_me', JSON.stringify(me)); } catch { }
  }, [me]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  const upd = (key, fn) => setDb(d => ({ ...d, [key]: fn(d[key]) }));
  const setProp = (id, patch) => upd('props', ps => ps.map(p => p.id === id ? { ...p, ...patch } : p));
  const addTo = (key, i) => upd(key, a => [...a, { ...i, id: uid() }]);
  const editIn = (key, i) => upd(key, a => a.map(x => x.id === i.id ? i : x));
  const delFrom = (key, id) => upd(key, a => a.filter(x => x.id !== id));

  const sub = (p, key) => ({
    items: p[key] || [],
    onAdd: i => setProp(p.id, { [key]: [...(p[key] || []), { ...i, id: uid() }] }),
    onEdit: i => setProp(p.id, { [key]: p[key].map(x => x.id === i.id ? i : x) }),
    onDel: id => setProp(p.id, { [key]: p[key].filter(x => x.id !== id) })
  });

  const updatePassword = (cleanEmail, newPass) => {
    upd('users', us => us.map(u => u.username.trim().toLowerCase() === cleanEmail ? { ...u, password: newPass } : u));
  };

  /* ----- Authentication Handler ----- */
  if (!me) {
    const roles = [['landlord', '👑 Landlord'], ['agent', '🏢 Agent'], ['tenant', '👤 Tenant']];
    const lr = login.role;
    const setL = patch => setLogin(l => ({ ...l, err: '', ...patch }));

    const handleAuth = e => {
      e.preventDefault();
      const un = login.u.trim().toLowerCase();

      if (login.signup && lr !== 'landlord') {
        if (!un || !un.includes('@') || login.p.length < 4) {
          return setL({ err: 'Please enter a valid Email address and password (min 4 chars).' });
        }
        if (db.users.some(x => x.username.trim().toLowerCase() === un)) {
          return setL({ err: 'That Email address is already registered.' });
        }
        const nu = { id: uid(), name: un, username: un, password: login.p, role: lr, props: [] };
        upd('users', a => [...a, nu]);
        setMe(nu);
        setView('dash');
        return;
      }

      const u = db.users.find(x => x.username.trim().toLowerCase() === un && x.password === login.p);
      if (!u) {
        return setL({ err: 'Incorrect Email address or password.' });
      }
      if (u.role !== lr) {
        return setL({ err: `Account exists as "${u.role}". Select "${u.role}" above to log in.` });
      }
      setMe(u);
      setView('dash');
    };

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-6">
          {/* Company Branding & Logo Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <FalconLogo className="w-48 h-28 drop-shadow-[0_10px_20px_rgba(245,158,11,0.2)]" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-wider">FALCON PROPERTIES</h1>
            <p className="text-amber-400 font-semibold text-xs tracking-widest uppercase">Building A Better Tomorrow</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6 items-start">
            {/* Professional Company Info Card */}
            <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4 shadow-xl">
              <div>
                <h2 className="text-base font-bold text-amber-400">About Falcon Properties</h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Falcon Properties is an enterprise real estate management firm delivering premier residential, commercial, and short-stay property operations across the United Kingdom.
                </p>
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-2.5 text-xs text-slate-300">
                <p className="font-bold text-white mb-1">Corporate Contact Directory:</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Office: {db.settings.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Email: {db.settings.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Hours: {db.settings.hours}</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3 text-[11px] text-red-400 space-y-1">
                <p className="font-bold text-red-300 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> 24/7 Emergency Support Lines
                </p>
                <p>Gas Leak Emergency: <strong>{db.settings.gas}</strong></p>
                <p>Power Outage Line: <strong>{db.settings.power}</strong></p>
              </div>
            </div>

            {/* Login Window */}
            <form onSubmit={handleAuth} className="md:col-span-3 bg-white rounded-2xl p-8 space-y-4 shadow-2xl border border-slate-100">
              <div className="border-b pb-3">
                <h2 className="font-bold text-lg text-slate-900">Portal Security Sign In</h2>
                <p className="text-xs text-slate-500">Access your property management workspace</p>
              </div>

              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                {roles.map(([k, l]) => (
                  <button
                    type="button"
                    key={k}
                    onClick={() => setL({ role: k, signup: k === 'landlord' ? false : login.signup })}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${lr === k ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <p className="text-xs font-bold text-slate-700">
                {login.signup && lr !== 'landlord' ? `Create new ${lr} account` : `Sign in as ${lr}`}
              </p>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                <input
                  autoFocus
                  type="email"
                  placeholder="Enter your registered email"
                  value={login.u}
                  onChange={e => setL({ u: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-slate-50 focus:bg-white text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <input
                    type={showLoginPass ? 'text' : 'password'}
                    placeholder="Enter your security password"
                    value={login.p}
                    onChange={e => setL({ p: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 pr-10 text-xs bg-slate-50 focus:bg-white text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPass(!showLoginPass)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    title={showLoginPass ? "Hide password" : "View password"}
                  >
                    {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {login.err && <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">{login.err}</p>}

              <button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg p-2.5 text-xs transition-colors shadow">
                {login.signup && lr !== 'landlord' ? 'Create Account' : 'Sign In'}
              </button>

              <div className="flex flex-col gap-1.5 text-center border-t pt-3 text-xs">
                {lr !== 'landlord' && (
                  <button type="button" onClick={() => setL({ signup: !login.signup })} className="text-slate-600 underline hover:text-slate-900">
                    {login.signup ? 'Already registered? Sign in' : `New ${lr}? Create an account`}
                  </button>
                )}
                <button type="button" onClick={() => setResetModal(true)} className="text-amber-600 font-bold underline hover:text-amber-700">
                  Forgot / Reset Password?
                </button>
              </div>
            </form>
          </div>
        </div>

        {resetModal && (
          <ResetModal
            users={db.users}
            onUpdate={updatePassword}
            onClose={resetEmail => {
              setResetModal(false);
              if (resetEmail) {
                setLogin(l => ({ ...l, u: resetEmail, p: '', err: '' }));
              }
            }}
          />
        )}
      </div>
    );
  }

  /* ----- Role Scoping ----- */
  const role = me.role;
  const L = role === 'landlord';
  const A = role === 'agent';
  const T = role === 'tenant';

  const mine = db.users.find(u => u.id === me.id) || me;
  const props = L ? db.props : db.props.filter(p => mine.props.includes(p.id));
  const ids = props.map(p => p.id);
  const pName = id => db.props.find(p => p.id === id)?.address || 'Unknown Property';

  const cm = ym();
  const addProp = v => {
    const id = 'P' + uid();
    upd('props', a => [...a, { ...mkProp(id, '', '', 0), ...v, id, rent: Number(v.rent), deposit: Number(v.deposit) }]);
    if (A) upd('users', us => us.map(u => u.id === me.id ? { ...u, props: [...u.props, id] } : u));
  };

  const paid = p => db.payments.some(x => x.propId === p.id && x.month === cm);
  const overdue = p => p.tenant && p.type !== 'Hotel / Airbnb / Booking.com' && !paid(p) && new Date().getDate() > (p.tenant.rentDay || 1);

  const rentIn = db.payments.filter(x => x.month === cm && ids.includes(x.propId)).reduce((s, x) => s + Number(x.amount), 0);
  const hotelIn = props.flatMap(p => p.income).filter(i => i.month === cm).reduce((s, i) => s + Number(i.amount), 0);
  const expMonth = db.expenses.filter(e => ids.includes(e.propId) && e.date.slice(0, 7) === cm).reduce((s, e) => s + Number(e.amount), 0);

  const allCerts = props.flatMap(p => p.certs.map(c => ({ ...c, propId: p.id })));
  const certAlerts = allCerts.filter(c => status(c.expiry) !== 'Valid');
  const insAlerts = props.filter(p => {
    const l = [...p.insurance].sort((a, b) => b.expiry.localeCompare(a.expiry))[0];
    return !l || days(l.expiry) <= 60;
  });

  const openTk = db.tickets.filter(t => ids.includes(t.propId) && t.status === 'Open');
  const markPaid = p => addTo('payments', { propId: p.id, month: cm, amount: p.rent, date: today() });
  const openProp = id => { setPropId(id); setView('prop'); };

  /* ----- Global Master CSV Export ----- */
  const exportMasterCSV = () => {
    const headers = ['Property ID', 'Address', 'Category', 'Tenant Name', 'Monthly Rent', 'Deposit', 'Status'];
    const rows = props.map(p => [
      p.id,
      p.address,
      p.type,
      p.tenant?.name || 'Vacant',
      p.rent,
      p.deposit,
      p.tenant ? (paid(p) ? 'Paid' : 'Unpaid') : 'Vacant'
    ]);
    downloadCSV('Falcon_Properties_Portfolio_Report', headers, rows);
  };

  const nav = [
    ['dash', '🏠 Dashboard'],
    ['rent', '🚨 Rent Overdue & Reminders'],
    ['expenses', '💷 Property Expenses Engine'],
    ['certs', '📜 Certificates & Compliance Vault'],
    ['insurance', '🛡️ Insurance Policies'],
    ['tickets', '🔧 Maintenance Ticket Center'],
    ...(!T ? [['suppliers', '🛠️ Suppliers & Trades'], ['archive', '📁 Archived Tenants']] : []),
    ...(L ? [['users', '👥 Users, Roles & Permissions'], ['settings', '⚙️ Contact Settings']] : [])
  ].filter(([k]) => !T || ['dash', 'tickets'].includes(k));

  const propFields = [
    F('address', 'Property Address'),
    F('type', 'Property Category', 'select', TYPES),
    F('rent', 'Monthly Rent (£)', 'number'),
    F('deposit', 'Deposit Held (£)', 'number'),
    F('depositScheme', 'Deposit Scheme / Supplier'),
    F('contractParty', 'Contract Agreement Parties'),
    F('contractType', 'Agreement Type (e.g. AST / Commercial FRI)'),
    F('councilTax', 'Council Tax Band'),
    F('furnishing', 'Furnishing Status'),
    F('garden', 'Garden Access'),
    F('parking', 'Parking Facilities')
  ];

  const tenFields = [
    F('name', 'Full Tenant Name'),
    F('email', 'Email Address', 'email'),
    F('phone', 'Phone Number'),
    F('passport', 'Passport Number'),
    F('origin', 'Country of Origin'),
    F('job', 'Employment / Job Status'),
    F('moveIn', 'Move-In Date', 'date'),
    F('rentDay', 'Rent Due Day of Month', 'number'),
    F('visaStatus', 'Visa / Immigration Status'),
    F('visaCategory', 'Visa Category'),
    F('shareCode', 'Right to Rent Share Code'),
    F('visaExpiry', 'Visa Expiry Date', 'date'),
    F('proof', 'Visa / Right to Rent Proof Document', 'file'),
    F('notes', 'Note to Self (Private)', 'textarea')
  ];

  const certFields = [
    F('type', 'Certificate Type', 'select', CERTS),
    F('ref', 'Reference / Certificate Number'),
    F('expiry', 'Expiry Date', 'date'),
    F('data', 'Upload Certificate Document (PDF/Image)', 'file')
  ];

  const visaFields = tenFields.filter(f => ['visaStatus', 'visaCategory', 'shareCode', 'visaExpiry', 'proof'].includes(f.k));
  const tkFields = (full) => [
    ...(full ? [F('propId', 'Select Property', 'select', ids)] : []),
    F('category', 'Category', 'select', ['Plumbing', 'Electrical', 'Gas/Heating', 'Structural', 'Appliances', 'Pest Control', 'Other']),
    F('desc', 'Detailed Description', 'textarea'),
    F('priority', 'Priority', 'select', ['Low', 'Medium', 'High', 'Urgent']),
    ...(!T ? [F('status', 'Ticket Status', 'select', ['Open', 'Closed'])] : [])
  ];

  const Tickets = ({ list, fixedProp }) => (
    <CrudList
      title="Maintenance Tickets"
      items={list}
      canEdit
      canDel={L}
      fields={tkFields(!fixedProp)}
      onAdd={i => addTo('tickets', { status: 'Open', priority: 'Medium', category: 'Plumbing', date: today(), propId: fixedProp || ids[0], ...i })}
      onEdit={i => editIn('tickets', i)}
      onDel={id => delFrom('tickets', id)}
      exportCsv={() => downloadCSV('Maintenance_Tickets_Report', ['Ticket ID', 'Property', 'Category', 'Description', 'Priority', 'Status', 'Date'], list.map(t => [t.id, pName(t.propId), t.category, t.desc, t.priority, t.status, t.date]))}
      line={t => (
        <div>
          <p className="font-bold text-slate-900">{t.category}: {t.desc}</p>
          <p className="text-slate-500">{pName(t.propId)} · Logged: {t.date} · Priority: {t.priority}</p>
        </div>
      )}
      badge={t => (
        <div className="flex items-center gap-1">
          <span className={`px-2 py-0.5 rounded font-bold border ${pill(t.status)}`}>{t.status}</span>
          <Btn c="border border-slate-300 bg-white text-slate-700 hover:bg-slate-100" onClick={() => editIn('tickets', { ...t, status: t.status === 'Open' ? 'Closed' : 'Open' })}>
            {t.status === 'Open' ? 'Close Ticket' : 'Reopen Ticket'}
          </Btn>
        </div>
      )}
    />
  );

  const PropertyView = () => {
    const p = db.props.find(x => x.id === propId);
    if (!p || !ids.includes(p.id)) return <p className="p-4 text-xs text-slate-500">Property unit not found or access restricted.</p>;

    const t = p.tenant;
    const hotel = p.type.startsWith('Hotel');

    const endTenancy = () => {
      if (!window.confirm('End this tenancy and transfer tenant record to the archive?')) return;
      addTo('archive', { address: p.address, name: t.name, moveIn: t.moveIn, moveOut: today(), reason: 'Tenancy completed by ' + me.username });
      setProp(p.id, { tenant: null });
    };

    const removeTenant = () => {
      if (window.confirm('Permanently delete this tenant record? (Landlord authorization required)')) {
        setProp(p.id, { tenant: null });
      }
    };

    return (
      <div className="space-y-5">
        <div className="flex flex-wrap justify-between items-start gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">{p.type} | {p.councilTax}</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">{p.address}</h2>
            <p className="text-xs text-slate-500 mt-1">Furnishing: {p.furnishing} | Garden: {p.garden} | Parking: {p.parking}</p>
            <p className="text-xs text-slate-700 font-medium mt-1">Rent: {gbp(p.rent)}/mo | Deposit: {gbp(p.deposit)} ({p.depositScheme}) | Agreement: {p.contractParty} ({p.contractType})</p>
          </div>

          {!T && (
            <div className="flex gap-2">
              <Btn c="bg-amber-500 hover:bg-amber-600 text-slate-950 shadow" onClick={() => setModal({ title: 'Edit Property Details', fields: propFields, initial: p, submit: v => setProp(p.id, { ...v, rent: Number(v.rent), deposit: Number(v.deposit) }) })}>
                <Pencil className="w-3.5 h-3.5" /> Edit Property Unit
              </Btn>
              {L && (
                <Btn c="bg-red-600 hover:bg-red-700 text-white shadow" onClick={() => { if (window.confirm('Delete this property unit permanently?')) { upd('props', a => a.filter(x => x.id !== p.id)); setView('dash'); } }}>
                  <Trash2 className="w-3.5 h-3.5" /> Delete Property
                </Btn>
              )}
            </div>
          )}
        </div>

        {!hotel && (
          <Card title="Active Tenant Profile" action={
            <div className="flex gap-2">
              {!T && (
                <Btn c="bg-amber-500 hover:bg-amber-600 text-slate-950" onClick={() => setModal({ title: t ? 'Edit Tenant Profile' : 'Assign New Tenant', fields: tenFields, initial: t || { rentDay: 1, moveIn: today(), visaStatus: 'UK Citizen', family: [] }, submit: v => setProp(p.id, { tenant: { family: [], ...v } }) })}>
                  <Pencil className="w-3.5 h-3.5" /> {t ? 'Edit Tenant' : 'Assign Tenant'}
                </Btn>
              )}
              {T && t && (
                <Btn c="bg-amber-500 hover:bg-amber-600 text-slate-950" onClick={() => setModal({ title: 'Update Right to Rent & Visa Information', fields: visaFields, initial: t, submit: v => setProp(p.id, { tenant: { ...t, ...v } }) })}>
                  <Pencil className="w-3.5 h-3.5" /> Update Visa / Share Code
                </Btn>
              )}
              {!T && t && <Btn c="bg-slate-800 hover:bg-slate-900 text-white" onClick={endTenancy}>End Tenancy & Archive</Btn>}
              {L && t && <Btn c="bg-red-600 hover:bg-red-700 text-white" onClick={removeTenant}><Trash2 className="w-3.5 h-3.5" /> Delete Tenant</Btn>}
            </div>
          }>
            {t ? (
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                <p><strong>Full Name:</strong> {t.name}</p>
                <p><strong>Email Address:</strong> {t.email}</p>
                <p><strong>Phone Number:</strong> {t.phone}</p>
                <p><strong>Move-In Date:</strong> {t.moveIn}</p>
                <p><strong>Employment Status:</strong> {t.job}</p>
                <p><strong>Country of Origin:</strong> {t.origin}</p>
                {!T && <p><strong>Passport Number:</strong> {t.passport}</p>}
                <p><strong>Visa / Right to Rent Status:</strong> {t.visaStatus} {t.visaCategory && `(${t.visaCategory})`}</p>
                <p><strong>Share Code:</strong> {t.shareCode || 'N/A'}</p>
                <p><strong>Visa Expiry Date:</strong> {t.visaExpiry || 'N/A'} {t.visaExpiry && <span className={`px-2 py-0.5 rounded font-bold border ml-1 ${pill(status(t.visaExpiry))}`}>{status(t.visaExpiry)}</span>}</p>
                <p><strong>Proof Document:</strong> {t.proof || 'Not uploaded'}</p>
                <p><strong>Current Month Rent:</strong> <span className={`px-2 py-0.5 rounded font-bold border ${pill(paid(p) ? 'Paid' : 'Unpaid')}`}>{paid(p) ? 'Paid' : 'Unpaid'}</span> {!T && !paid(p) && <button onClick={() => markPaid(p)} className="ml-2 text-green-700 font-bold underline">Mark Paid</button>}</p>
                {!T && t.notes && <p className="md:col-span-2 bg-slate-50 p-2.5 rounded-lg border text-slate-700 mt-1"><strong>Note to Self:</strong> {t.notes}</p>}
              </div>
            ) : <p className="text-xs text-slate-400 italic">No active tenant currently assigned to this unit.</p>}
          </Card>
        )}

        {t && !hotel && (
          <CrudList
            title="Dependants & Family Members"
            items={t.family || []}
            canEdit={!T || true}
            canDel={!T}
            fields={[F('name', 'Name'), F('relation', 'Relation'), F('visaStatus', 'Visa Status'), F('visaExpiry', 'Visa Expiry', 'date'), F('shareCode', 'Share Code')]}
            onAdd={i => setProp(p.id, { tenant: { ...t, family: [...(t.family || []), { ...i, id: uid() }] } })}
            onEdit={i => setProp(p.id, { tenant: { ...t, family: t.family.map(x => x.id === i.id ? i : x) } })}
            onDel={id => setProp(p.id, { tenant: { ...t, family: t.family.filter(x => x.id !== id) } })}
            line={f => <span><strong>{f.name}</strong> ({f.relation}) · Status: {f.visaStatus} · Expiry: {f.visaExpiry || 'N/A'} · Share Code: {f.shareCode || 'N/A'}</span>}
            badge={f => f.visaExpiry && <span className={`px-2 py-0.5 rounded font-bold border ${pill(status(f.visaExpiry))}`}>{status(f.visaExpiry)}</span>}
          />
        )}

        {hotel && (
          <CrudList
            title="Monthly Hotel & Short-Stay Income (Airbnb / Booking.com)"
            {...sub(p, 'income')}
            canEdit={!T}
            canDel={!T}
            fields={[F('month', 'Month', 'month'), F('amount', 'Payout Income (£)', 'number'), F('notes', 'Platform / Notes')]}
            line={i => <span><strong>{i.month}:</strong> Earned <strong>{gbp(i.amount)}</strong> — {i.notes}</span>}
          />
        )}

        <CrudList
          title="Tenancy Documents & Agreements Vault"
          {...sub(p, 'docs')}
          canEdit={!T}
          canDel={!T}
          fields={[F('name', 'Document Name'), F('category', 'Category', 'select', ['Agreement', 'Certificate', 'DPS / Deposit', 'Inventory', 'Insurance', 'Mortgage', 'Licence', 'ID / Right to Rent', 'Other']), F('data', 'Upload Document File', 'file')]}
          line={d => <span><strong>{d.name}</strong> ({d.category})</span>}
        />

        {!T && (
          <>
            <CrudList
              title="UK Certificates & Compliance Engine"
              {...sub(p, 'certs')}
              canDel
              fields={certFields}
              line={c => <span><strong>{c.type}</strong> (Ref: {c.ref}) — Expiry Date: {c.expiry} {c.data && '📄 [Document Attached]'}</span>}
              badge={c => <span className={`px-2 py-0.5 rounded font-bold border ${pill(status(c.expiry))}`}>{status(c.expiry)}</span>}
            />

            <CrudList
              title="5-Year Insurance Policy Register"
              {...sub(p, 'insurance')}
              fields={[F('provider', 'Insurance Provider'), F('policy', 'Policy Number'), F('premium', 'Annual Premium (£)', 'number'), F('start', 'Start Date', 'date'), F('expiry', 'Expiry Date', 'date'), F('data', 'Upload Policy Document', 'file')]}
              line={i => <span><strong>{i.provider}</strong> (Policy: {i.policy}) — Premium: {gbp(i.premium)} | Period: {i.start} to {i.expiry}</span>}
              badge={i => <span className={`px-2 py-0.5 rounded font-bold border ${pill(status(i.expiry))}`}>{status(i.expiry)}</span>}
            />

            <CrudList
              title="Mortgage Lender & Provider Details"
              {...sub(p, 'mortgage')}
              fields={[F('lender', 'Mortgage Lender'), F('account', 'Account / Policy Number'), F('monthly', 'Monthly Payment (£)', 'number'), F('rate', 'Interest Rate'), F('endDate', 'Deal End Date', 'date'), F('notes', 'Notes')]}
              line={m => <span><strong>{m.lender}</strong> (Account: {m.account}) — Monthly: {gbp(m.monthly)} | Rate: {m.rate} | Fixed Term Ends: {m.endDate}</span>}
            />

            <CrudList
              title="Utility Suppliers & Service Accounts"
              {...sub(p, 'suppliers')}
              fields={[F('kind', 'Utility Category', 'select', ['Gas', 'Electricity', 'Water', 'Broadband', 'Council Tax', 'Managing Agent', 'Other']), F('name', 'Supplier Name'), F('account', 'Account Number'), F('phone', 'Support Phone'), F('notes', 'Notes')]}
              line={s => <span><strong>{s.kind}:</strong> {s.name} (Account: {s.account}) | Phone: {s.phone}</span>}
            />

            <CrudList
              title="Meter Reading Logs"
              {...sub(p, 'meters')}
              fields={[F('utility', 'Utility Type', 'select', ['Electricity', 'Gas', 'Water']), F('kind', 'Reading Type', 'select', ['Opening', 'Closing', 'Routine']), F('reading', 'Value / Reading Units'), F('date', 'Date Taken', 'date')]}
              line={m => <span><strong>{m.kind} {m.utility} Reading:</strong> {m.reading} on {m.date}</span>}
            />

            <CrudList
              title="Property Expense Records (5-Year Archival)"
              items={db.expenses.filter(e => e.propId === p.id)}
              fields={[F('date', 'Expense Date', 'date'), F('category', 'Category', 'select', EXP_CATS), F('amount', 'Amount Paid (£)', 'number'), F('supplier', 'Supplier / Contractor'), F('notes', 'Notes / Invoice Details'), F('data', 'Upload Receipt / Invoice', 'file')]}
              onAdd={i => addTo('expenses', { ...i, propId: p.id })}
              onEdit={i => editIn('expenses', i)}
              onDel={id => delFrom('expenses', id)}
              canDel
              line={e => <span><strong>{e.date}:</strong> {e.category} — <strong>{gbp(e.amount)}</strong> paid to {e.supplier} {e.notes && `(${e.notes})`}</span>}
            />
          </>
        )}

        <Tickets list={db.tickets.filter(x => x.propId === p.id)} fixedProp={p.id} />
      </div>
    );
  };

  const Dash = () => {
    const list = props.filter(p => (typeF === 'All' || p.type === typeF) && (p.address + (p.tenant?.name || '')).toLowerCase().includes(search.toLowerCase()));

    const stat = (l, v, s, go, c) => (
      <div onClick={() => setView(go)} className="bg-white border border-slate-200 rounded-xl p-4 cursor-pointer hover:border-amber-400 transition-all shadow-sm">
        <p className="text-xs font-bold text-slate-500 uppercase">{l}</p>
        <p className={`text-2xl font-extrabold mt-1 ${c}`}>{v}</p>
        <p className="text-[11px] text-slate-400 mt-1">{s}</p>
      </div>
    );

    return (
      <div className="space-y-6">
        {!T && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stat('Total Monthly Earnings', gbp(rentIn + hotelIn), `Rents ${gbp(rentIn)} + Short-stay ${gbp(hotelIn)}`, 'rent', 'text-green-700')}
              {stat('Monthly Expenses', gbp(expMonth), 'Click to view itemized records', 'expenses', 'text-red-700')}
              {stat('Net Earnings This Month', gbp(rentIn + hotelIn - expMonth), 'Total income minus expenses', 'expenses', 'text-slate-900')}
              {stat('Rent Overdue Alerts', props.filter(overdue).length, 'Click to issue email reminders', 'rent', 'text-red-600')}
              {stat('Certificates Due', certAlerts.length, 'CP12, EICR & EPC expiring/expired', 'certs', 'text-amber-600')}
              {stat('Insurance Renewals', insAlerts.length, 'Policies due within 60 days', 'insurance', 'text-blue-600')}
              {stat('Open Maintenance Tickets', openTk.length, 'Active tenant complaints', 'tickets', 'text-orange-600')}
              {stat('Managed Units', props.length, 'Total units in active portfolio', 'dash', 'text-slate-900')}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex flex-wrap gap-2">
                <input
                  placeholder="Search address or tenant..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="border border-slate-300 rounded-lg p-2 text-xs w-64 bg-slate-50 focus:bg-white text-slate-800"
                />
                <select value={typeF} onChange={e => setTypeF(e.target.value)} className="border border-slate-300 rounded-lg p-2 text-xs bg-slate-50">
                  <option value="All">All Categories</option>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {!T && (
                <Btn c="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow" onClick={() => setModal({ title: 'Add New Property Unit', fields: propFields, initial: { type: 'Flat', rent: 1200, deposit: 1200, depositScheme: 'DPS', contractType: 'AST', councilTax: 'Band B', furnishing: 'Unfurnished', garden: 'No', parking: 'None' }, submit: addProp })}>
                  <Plus className="w-4 h-4" /> Add Property Unit
                </Btn>
              )}
            </div>
          </>
        )}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map(p => (
            <div key={p.id} onClick={() => openProp(p.id)} className="bg-white border border-slate-200 rounded-xl p-5 cursor-pointer hover:border-amber-400 transition-all shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded">{p.type}</span>
                <span className={`text-[11px] px-2.5 py-0.5 rounded font-bold border ${p.tenant ? (paid(p) ? pill('Paid') : pill('Unpaid')) : 'bg-slate-100 text-slate-500'}`}>
                  {p.tenant ? (paid(p) ? 'Rent Paid' : 'Rent Unpaid') : 'Vacant'}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 line-clamp-1">{p.address}</h3>
              <p className="text-xs text-slate-600">{p.type.startsWith('Hotel') ? 'Short-Stay / Hotel Unit' : `Monthly Rent: ${gbp(p.rent)}`}</p>

              {p.tenant ? (
                <p className="text-xs text-slate-500 border-t border-slate-100 pt-2 mt-2">Active Tenant: <strong>{p.tenant.name}</strong></p>
              ) : (
                <p className="text-xs text-slate-400 italic border-t border-slate-100 pt-2 mt-2">Currently Vacant</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const RentView = () => {
    const rentPayments = db.payments.filter(x => ids.includes(x.propId));
    
    return (
      <div className="space-y-6">
        <Card title="Rent Overdue Accounts & Email Reminders">
          {props.filter(overdue).length === 0 ? (
            <p className="text-xs text-slate-500 italic">No rent accounts are currently overdue.</p>
          ) : (
            <div className="space-y-3">
              {props.filter(overdue).map(p => (
                <div key={p.id} className="flex flex-wrap justify-between items-center bg-red-50 border border-red-200 rounded-xl p-4 text-xs gap-3">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{p.address}</p>
                    <p className="text-red-800">Tenant: <strong>{p.tenant.name}</strong> ({p.tenant.email}) | Monthly Rent: <strong>{gbp(p.rent)}</strong> (Due Day: {p.tenant.rentDay})</p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`mailto:${p.tenant.email}?subject=RENT%20OVERDUE%20REMINDER%20-%20${encodeURIComponent(p.address)}&body=Dear%20${encodeURIComponent(p.tenant.name)},%0A%0AOur%20records%20show%20that%20your%20rent%20payment%20of%20${encodeURIComponent(gbp(p.rent))}%20for%20${encodeURIComponent(p.address)}%20is%20overdue.%0A%0APlease%20arrange%20payment%20immediately.%0A%0AFalcon%20Properties`}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 shadow"
                    >
                      <Send className="w-3.5 h-3.5" /> Send Email Reminder
                    </a>
                    <Btn c="bg-green-600 hover:bg-green-700 text-white shadow" onClick={() => markPaid(p)}>✓ Mark Rent Paid</Btn>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <CrudList
          title="Recorded Rent Payments History"
          items={rentPayments}
          canEdit={false}
          canDel={L}
          onDel={id => delFrom('payments', id)}
          exportCsv={() => downloadCSV('Rental_Income_Report_2026', ['Payment ID', 'Property', 'Month', 'Amount (£)', 'Date Paid'], rentPayments.map(p => [p.id, pName(p.propId), p.month, p.amount, p.date]))}
          line={p => <span><strong>{pName(p.propId)}:</strong> Received payment of <strong>{gbp(p.amount)}</strong> on {p.date} (Month: {p.month})</span>}
        />
      </div>
    );
  };

  const ExpensesView = () => {
    const monthlyExpenses = db.expenses.filter(e => ids.includes(e.propId) && e.date.slice(0, 7) === month);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="font-bold text-slate-700">Filter Expense Records by Month:</span>
          <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="border border-slate-300 rounded-lg p-1.5 bg-slate-50 text-xs font-bold text-slate-800" />
        </div>

        <CrudList
          title={`Itemized Property Expenses (${month})`}
          items={monthlyExpenses}
          canDel
          fields={[F('propId', 'Select Property Unit', 'select', ids), F('date', 'Expense Date', 'date'), F('category', 'Expense Category', 'select', EXP_CATS), F('amount', 'Amount Paid (£)', 'number'), F('supplier', 'Supplier / Payee'), F('notes', 'Notes / Invoice Details'), F('data', 'Upload Receipt / Document', 'file')]}
          onAdd={i => addTo('expenses', i)}
          onEdit={i => editIn('expenses', i)}
          onDel={id => delFrom('expenses', id)}
          exportCsv={() => downloadCSV(`Property_Expenses_Report_${month}`, ['Expense ID', 'Property', 'Date', 'Category', 'Amount (£)', 'Supplier', 'Notes'], monthlyExpenses.map(e => [e.id, pName(e.propId), e.date, e.category, e.amount, e.supplier, e.notes]))}
          line={e => <span><strong>{pName(e.propId)}:</strong> {e.date} | {e.category} — <strong>{gbp(e.amount)}</strong> paid to {e.supplier} {e.notes && `(${e.notes})`}</span>}
        />
      </div>
    );
  };

  const CertsView = () => (
    <Card 
      title="UK Certificates & Compliance Vault (Global View)" 
      action={
        <div className="flex gap-2">
          <Btn c="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => downloadCSV('Certificates_Compliance_Report', ['Certificate ID', 'Property', 'Type', 'Reference', 'Expiry Date', 'Status'], allCerts.map(c => [c.id, pName(c.propId), c.type, c.ref, c.expiry, status(c.expiry)]))}>
            <FileSpreadsheet className="w-3.5 h-3.5" /> Export CSV
          </Btn>
          {!T && (
            <Btn onClick={() => setModal({
              title: 'Add New Certificate',
              fields: [F('propId', 'Select Property Unit', 'select', ids), ...certFields],
              initial: { type: 'Gas Safety (CP12)', expiry: today(), propId: ids[0] },
              submit: v => {
                const pid = v.propId;
                const certObj = { id: uid(), type: v.type, ref: v.ref, expiry: v.expiry, data: v.data };
                const targetProp = db.props.find(p => p.id === pid);
                if (targetProp) {
                  setProp(pid, { certs: [...targetProp.certs, certObj] });
                }
              }
            })}>
              <Plus className="w-3.5 h-3.5" /> Add Certificate
            </Btn>
          )}
        </div>
      }
    >
      <div className="space-y-2">
        {allCerts.map(c => (
          <div key={c.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
            <div>
              <p className="font-bold text-slate-900">{c.type} (Ref: {c.ref})</p>
              <p className="text-slate-500">{pName(c.propId)} | Expiry Date: {c.expiry} {c.data && '📄 [Document Attached]'}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded font-bold border ${pill(status(c.expiry))}`}>{status(c.expiry)}</span>
              {c.data && (
                <a href={c.data} download={c.type} className="p-1 text-slate-600 hover:text-slate-900" title="Download Certificate">
                  <Download className="w-3.5 h-3.5" />
                </a>
              )}
              {!T && (
                <button
                  onClick={() => setModal({
                    title: 'Edit Certificate Record',
                    fields: certFields,
                    initial: c,
                    submit: v => {
                      const p = db.props.find(x => x.id === c.propId);
                      if (p) {
                        setProp(p.id, { certs: p.certs.map(x => x.id === c.id ? { ...x, ...v } : x) });
                      }
                    }
                  })}
                  className="p-1 text-amber-600 hover:text-amber-700"
                  title="Edit Certificate"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
              {!T && (
                <button
                  onClick={() => {
                    if (window.confirm('Delete this certificate?')) {
                      const p = db.props.find(x => x.id === c.propId);
                      if (p) {
                        setProp(p.id, { certs: p.certs.filter(x => x.id !== c.id) });
                      }
                    }
                  }}
                  className="p-1 text-red-600 hover:text-red-700"
                  title="Delete Certificate"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  const InsuranceView = () => {
    const insuranceList = props.flatMap(p => p.insurance.map(i => ({ ...i, propId: p.id, propAddress: p.address })));

    return (
      <Card 
        title="Insurance Policies Register"
        action={
          <Btn c="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => downloadCSV('Insurance_Policies_Report', ['Policy ID', 'Property', 'Provider', 'Policy Ref', 'Premium (£)', 'Start Date', 'Expiry Date'], insuranceList.map(i => [i.id, i.propAddress, i.provider, i.policy, i.premium, i.start, i.expiry]))}>
            <FileSpreadsheet className="w-3.5 h-3.5" /> Export CSV
          </Btn>
        }
      >
        <div className="space-y-2">
          {props.map(p => {
            const l = [...p.insurance].sort((a, b) => b.expiry.localeCompare(a.expiry))[0];
            return (
              <div key={p.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
                <div>
                  <p className="font-bold text-slate-900">{p.address}</p>
                  <p className="text-slate-500">{l ? `${l.provider} (Policy: ${l.policy}) — Premium: ${gbp(l.premium)} | Expiry: ${l.expiry}` : 'No insurance policy recorded'}</p>
                </div>
                <Btn c="border border-slate-300 bg-white text-slate-700 hover:bg-slate-100" onClick={() => openProp(p.id)}>View Details & Edit Policies</Btn>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  const UsersView = () => (
    <CrudList
      title="Portal Users, Roles & Permissions Management"
      items={db.users}
      canDel
      fields={[F('username', 'Email Address / Login ID'), F('password', 'Password'), F('role', 'Role', 'select', ['landlord', 'agent', 'tenant'])]}
      onAdd={u => addTo('users', { ...u, name: u.username, props: u.props || [] })}
      onEdit={u => editIn('users', u)}
      onDel={id => delFrom('users', id)}
      exportCsv={() => downloadCSV('Users_Permissions_Report', ['User ID', 'Username', 'Role', 'Assigned Properties'], db.users.map(u => [u.id, u.username, u.role, u.role === 'landlord' ? 'ALL ACCESS' : (u.props?.length || 0)]))}
      line={u => (
        <span>
          <strong>{u.username}</strong> — Role: <strong className="uppercase">{u.role}</strong> | Password: {u.password} | Assigned Properties: {u.role === 'landlord' ? 'ALL ACCESS' : (u.props?.length || 0)}
        </span>
      )}
      badge={u => u.role === 'agent' && (
        <Btn c="border border-slate-300 bg-white text-slate-700 hover:bg-slate-100" onClick={() => setAssign(u)}>Assign Property Units</Btn>
      )}
    />
  );

  const AssignModal = () => (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4 text-xs shadow-2xl">
        <h3 className="font-bold text-sm text-slate-900">Assign Property Units to {assign.username}</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto border p-2 rounded-lg bg-slate-50">
          {db.props.map(p => {
            const has = (assign.props || []).includes(p.id);
            return (
              <label key={p.id} className="flex items-center gap-2 p-2 border rounded-lg bg-white cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={has}
                  onChange={() => {
                    const currentProps = assign.props || [];
                    const nu = { ...assign, props: has ? currentProps.filter(x => x !== p.id) : [...currentProps, p.id] };
                    setAssign(nu);
                    editIn('users', nu);
                  }}
                />
                <span className="font-medium text-slate-800">{p.address} ({p.type})</span>
              </label>
            );
          })}
        </div>
        <div className="flex justify-end"><Btn onClick={() => setAssign(null)}>Done</Btn></div>
      </div>
    </div>
  );

  const SettingsView = () => {
    const s = db.settings;
    return (
      <Card title="Contact Information & Business Settings">
        <form onSubmit={e => { e.preventDefault(); setModal(null); }} className="space-y-3 text-xs">
          <label className="block space-y-1">
            <span className="font-semibold text-slate-700">Office Telephone Number</span>
            <input value={s.phone} onChange={e => upd('settings', x => ({ ...x, phone: e.target.value }))} className="w-full border rounded-lg p-2 bg-white text-slate-800" />
          </label>
          <label className="block space-y-1">
            <span className="font-semibold text-slate-700">Business Support Email</span>
            <input value={s.email} onChange={e => upd('settings', x => ({ ...x, email: e.target.value }))} className="w-full border rounded-lg p-2 bg-white text-slate-800" />
          </label>
          <label className="block space-y-1">
            <span className="font-semibold text-slate-700">Working Hours</span>
            <input value={s.hours} onChange={e => upd('settings', x => ({ ...x, hours: e.target.value }))} className="w-full border rounded-lg p-2 bg-white text-slate-800" />
          </label>
          <label className="block space-y-1">
            <span className="font-semibold text-slate-700">24/7 Emergency Gas Leak Line</span>
            <input value={s.gas} onChange={e => upd('settings', x => ({ ...x, gas: e.target.value }))} className="w-full border rounded-lg p-2 bg-white text-slate-800" />
          </label>
          <label className="block space-y-1">
            <span className="font-semibold text-slate-700">24/7 Emergency Power Outage Line</span>
            <input value={s.power} onChange={e => upd('settings', x => ({ ...x, power: e.target.value }))} className="w-full border rounded-lg p-2 bg-white text-slate-800" />
          </label>
          <p className="text-green-700 font-semibold mt-2">✓ All settings update automatically across the portal.</p>
        </form>
      </Card>
    );
  };

  /* ----- Master Layout ----- */
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-16">
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-3">
            <FalconLogo className="w-10 h-10 shrink-0" />
            <div>
              <h1 className="text-xl font-bold tracking-wide">FALCON PROPERTIES</h1>
              <p className="text-xs text-amber-400 font-semibold">Enterprise Real Estate & Compliance Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Btn c="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow hidden sm:inline-flex" onClick={exportMasterCSV}>
              <FileSpreadsheet className="w-3.5 h-3.5" /> Export Portfolio CSV
            </Btn>
            <div className="text-right">
              <p className="font-bold text-white">{me.username}</p>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">{me.role} Portal</span>
            </div>
            <button onClick={() => setMe(null)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold transition-colors border border-slate-700">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center text-xs bg-slate-950/90">
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenu(!menu)} className="bg-amber-500 text-slate-950 font-bold px-4 py-1.5 rounded-lg flex items-center gap-2 shadow hover:bg-amber-600 transition-colors">
              Navigation & Modules Menu <ChevronDown className="w-4 h-4" />
            </button>

            {menu && (
              <div className="absolute top-full left-0 mt-1 bg-slate-900 text-white border border-slate-700 rounded-xl shadow-2xl w-64 z-50 py-2 text-xs">
                {nav.map(([k, l]) => (
                  <button
                    key={k}
                    onClick={() => { setView(k); setMenu(false); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-800 font-bold text-slate-200 hover:text-amber-400 transition-colors"
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="text-slate-300 text-xs hidden md:block">
            Support Email: <strong>{db.settings.email}</strong>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-6">
        {view !== 'dash' && (
          <button onClick={() => setView('dash')} className="mb-4 bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-50 shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Return to Main Dashboard
          </button>
        )}

        {view === 'dash' && <Dash />}
        {view === 'prop' && <PropertyView />}
        {view === 'rent' && <RentView />}
        {view === 'expenses' && <ExpensesView />}
        {view === 'certs' && <CertsView />}
        {view === 'insurance' && <InsuranceView />}
        {view === 'tickets' && <Tickets list={db.tickets.filter(x => ids.includes(x.propId))} />}
        {view === 'suppliers' && (
          <CrudList
            title="Suppliers, Builders & Trades Directory"
            items={db.contractors}
            canDel
            fields={[F('name', 'Name'), F('trade', 'Trade / Specialty'), F('company', 'Company'), F('phone', 'Phone Number'), F('email', 'Email Address'), F('notes', 'Notes')]}
            onAdd={c => addTo('contractors', c)}
            onEdit={c => editIn('contractors', c)}
            onDel={id => delFrom('contractors', id)}
            exportCsv={() => downloadCSV('Suppliers_Contractors_Report', ['ID', 'Name', 'Trade', 'Company', 'Phone', 'Email', 'Notes'], db.contractors.map(c => [c.id, c.name, c.trade, c.company, c.phone, c.email, c.notes]))}
            line={c => <span><strong>{c.name}</strong> ({c.trade}) — {c.company} | Phone: {c.phone} | Email: {c.email} {c.notes && `(${c.notes})`}</span>}
          />
        )}
        {view === 'archive' && (
          <CrudList
            title="Archived Tenants History"
            items={db.archive}
            canEdit={false}
            canDel
            fields={[]}
            onDel={id => delFrom('archive', id)}
            exportCsv={() => downloadCSV('Archived_Tenants_Report', ['ID', 'Address', 'Tenant Name', 'Move-In Date', 'Move-Out Date', 'Reason'], db.archive.map(a => [a.id, a.address, a.name, a.moveIn, a.moveOut, a.reason]))}
            line={a => <span><strong>{a.name}</strong> — {a.address} | Moved In: {a.moveIn} | Left: {a.moveOut} | Reason: {a.reason}</span>}
          />
        )}
        {view === 'users' && <UsersView />}
        {view === 'settings' && <SettingsView />}
      </main>

      {modal && <FormModal title={modal.title} fields={modal.fields} initial={modal.initial} onClose={() => setModal(null)} onSubmit={v => { modal.submit(v); setModal(null); }} />}
      {assign && <AssignModal />}

      <footer className="mt-12 bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="font-bold text-white text-sm">Falcon Properties Management</p>
            <p>Office Phone: {db.settings.phone} | Operating Hours: {db.settings.hours}</p>
            <p>Support Email: {db.settings.email}</p>
          </div>
          <div className="text-right">
            <p className="text-red-400 font-bold">24/7 Gas Leak Emergency: {db.settings.gas}</p>
            <p className="text-red-400 font-bold">24/7 Power Outage Line: {db.settings.power}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}