import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import {
  Plus, Pencil, Trash2, X, LogOut, ChevronDown, Download, Send, ArrowLeft, Eye, EyeOff, ShieldCheck, Mail, Phone, Clock,
  FileSpreadsheet, AlertTriangle, Smartphone, Copy, Bell, Home, UserCheck, Camera, CheckCircle
} from 'lucide-react';
import emailjs from '@emailjs/browser';

/* =====================================================================
   CONFIGURATION
   ===================================================================== */
const EMAILJS_SERVICE_ID = 'service_zswu9ed';
const EMAILJS_TEMPLATE_ID = 'template_16ftw9t';
const EMAILJS_PUBLIC_KEY = 'zURK01z_kkBRWAdA7';
const TOWER_BRIDGE_BG = 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1920&auto=format&fit=crop';
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const DB_KEY = 'falcon_db_v55';

/* =====================================================================
   HELPERS
   ===================================================================== */
const pad = n => String(n).padStart(2, '0');
const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const ym = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
const monthsAgo = n => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - n); return ym(d); };
const monthLabel = m => { const [y, mm] = m.split('-'); return new Date(Number(y), Number(mm) - 1, 1).toLocaleString('en-GB', { month: 'long', year: 'numeric' }); };
const ordinal = n => { const s = ['th', 'st', 'nd', 'rd']; const v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
const gbp = n => '£' + Number(n || 0).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const days = d => Math.ceil((new Date(d) - new Date()) / 864e5);
const isHotel = p => (p.type || '').startsWith('Hotel');
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const status = d => {
  if (!d) return 'Valid';
  const n = days(d);
  return n < 0 ? 'Expired' : n <= 60 ? 'Expiring Soon' : 'Valid';
};
const mortgageStatus = d => {
  if (!d) return 'Valid Rate';
  const n = days(d);
  return n < 0 ? 'Deal Expired' : n <= 90 ? 'Renewal Due (3 Months)' : 'Valid Rate';
};

const F = (k, l, t = 'text', o) => ({ k, l, t, o });

const TYPES = ['Flat', 'House', 'HMO', 'Commercial', 'Hotel / Airbnb / Booking.com'];
const CERTS = ['Gas Safety (CP12)', 'EICR', 'EPC', 'Selective Licence', 'HMO Licence', 'Fire Risk Assessment', 'PAT Test', 'Legionella', 'Smoke & CO Alarms', 'DPS Deposit Certificate', 'Registered Title (Deeds)', 'Registered Map', 'Planning Permission', 'Other Legal Doc'];
const EXP_CATS = ['Repairs', 'Maintenance', 'Insurance', 'Mortgage', 'Utilities', 'Council Tax', 'Business Rates', 'Agent Fees', 'Platform Fees (Airbnb/Booking)', 'Cleaning', 'Laundry / Linen', 'Legal', 'Licence/Compliance', 'Furnishing', 'Decorating', 'Other'];
const TAX_BANDS = ['Band A', 'Band B', 'Band C', 'Band D', 'Band E', 'Band F', 'Band G', 'Band H', 'Business Rates', 'Exempt / Included'];
const PLATFORMS = ['Airbnb', 'Booking.com', 'Direct Booking', 'Other'];

const pill = s => ({
  Valid: 'bg-green-100 text-green-800 border-green-200',
  'Valid Rate': 'bg-green-100 text-green-800 border-green-200',
  Paid: 'bg-green-100 text-green-800 border-green-200',
  Closed: 'bg-green-100 text-green-800 border-green-200',
  'Expiring Soon': 'bg-amber-100 text-amber-800 border-amber-200',
  'Renewal Due (3 Months)': 'bg-amber-100 text-amber-800 border-amber-200',
  Expired: 'bg-red-100 text-red-800 border-red-200',
  'Deal Expired': 'bg-red-100 text-red-800 border-red-200',
  Unpaid: 'bg-red-100 text-red-800 border-red-200',
  Open: 'bg-red-100 text-red-800 border-red-200'
}[s] || 'bg-slate-100 text-slate-700 border-slate-200');

/* ---------- CSV Export (Excel friendly, UTF-8 BOM) ---------- */
const downloadCSV = (filename, headers, rows) => {
  const cell = v => `"${String(v === null || v === undefined ? '' : v).replace(/"/g, '""')}"`;
  const csv = '\uFEFF' + [headers.map(cell).join(','), ...rows.map(r => r.map(cell).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${String(filename).replace(/[^\w\-]+/g, '_')}_${today()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// Default CSV columns generated from a form field list
const colsOf = fields => fields.filter(f => f.t !== 'file' && f.k !== 'propId').map(f => [f.l, it => it[f.k]]);

/* =====================================================================
   SEED DATA – 10 PROPERTIES + 5 YEAR HISTORY
   ===================================================================== */
const mkProp = (id, code, address, type, rent, extra = {}) => ({
  id, code: code || id, address, type, rent, deposit: rent, depositScheme: 'DPS', contractParty: '', contractType: 'AST',
  councilTax: 'Band C', furnishing: 'Furnished', garden: 'No', parking: 'None',
  certs: [], insurance: [], mortgage: [], suppliers: [], meters: [], docs: [], legalDocs: [], income: [], tenants: [], ...extra
});

const mkTen = (id, name, email, phone, moveIn, extra = {}) => ({
  id, name, email, phone, passport: '', origin: 'United Kingdom', job: '', moveIn, rentDay: 1, visaStatus: 'UK Citizen',
  visaCategory: '', shareCode: '', visaExpiry: '', proof: '', notes: '', ...extra
});

const normalizeDb = d => ({
  ...d,
  props: (d.props || []).map(p => {
    const t = p.tenants || (p.tenant ? [{ id: uid(), ...p.tenant }] : []);
    const { tenant, ...rest } = p;
    return { certs: [], insurance: [], mortgage: [], suppliers: [], meters: [], docs: [], legalDocs: [], income: [], ...rest, tenants: t };
  })
});

const seed = () => {
  const yr = new Date().getFullYear();
  const gasHist = code => [0, 1, 2, 3, 4].map(n => ({ id: `${code}_gas_${yr - n}`, type: 'Gas Safety (CP12)', ref: `GAS-${yr - n}-${code}`, expiry: `${yr - n}-11-15` }));
  const insHist = (code, provider, premium) => [0, 1, 2, 3, 4].map(n => ({ id: `${code}_ins_${yr - n}`, provider, policy: `${code}-${yr - n}`, premium: premium - n * 15, start: `${yr - n - 1}-12-02`, expiry: `${yr - n}-12-01` }));

  const hotelIncome = (code, platform, from, base) =>
    Array.from({ length: 18 - from }, (_, i) => {
      const n = i + from;
      return { id: `${code}_inc_${n}`, month: monthsAgo(n), platform, amount: base + ((n * 37) % 400), notes: `${platform} payout` };
    });

  const expenses = [];
  ['P1', 'P2', 'P5', 'P7', 'P8'].forEach((pid, pi) => {
    [0, 1, 2, 3, 4].forEach(n => {
      expenses.push({ id: `e_${pid}_${n}_m`, propId: pid, date: `${yr - n}-0${pi + 1}-14`, category: 'Maintenance', amount: 150 + pi * 40 + n * 10, supplier: 'Apex Heating Ltd', notes: 'Annual service' });
      expenses.push({ id: `e_${pid}_${n}_i`, propId: pid, date: `${yr - n - 1}-12-02`, category: 'Insurance', amount: 450 - n * 15, supplier: 'Aviva', notes: 'Annual landlord policy' });
    });
  });
  expenses.push(
    { id: 'e_p3_cur', propId: 'P3', date: today(), category: 'Cleaning', amount: 85, supplier: 'Sparkle Turnovers', notes: 'Guest turnover cleaning' },
    { id: 'e_p3_cur2', propId: 'P3', date: today(), category: 'Platform Fees (Airbnb/Booking)', amount: 210, supplier: 'Airbnb', notes: 'Host service fee' },
    { id: 'e_p4_cur', propId: 'P4', date: today(), category: 'Laundry / Linen', amount: 60, supplier: 'City Linen', notes: 'Linen service' },
    { id: 'e_p4_cur2', propId: 'P4', date: today(), category: 'Platform Fees (Airbnb/Booking)', amount: 245, supplier: 'Booking.com', notes: 'Commission' },
    { id: 'e_p1_cur', propId: 'P1', date: today(), category: 'Repairs', amount: 120, supplier: 'FlowRight Plumbing', notes: 'Tap washer' }
  );

  return {
    props: [
      mkProp('P1', 'P1 - Flat 1', '12 Falcon Way, London E1 6AN', 'Flat', 1450, {
        contractParty: 'Falcon Properties & Muhammad Mustafa', garden: 'Private', parking: '1 Space',
        certs: [...gasHist('P1'), { id: 'c_eicr1', type: 'EICR', ref: 'EICR-99120', expiry: `${yr + 1}-03-20` }, { id: 'c_epc1', type: 'EPC', ref: 'EPC-11204', expiry: `${yr + 2}-06-10` }],
        insurance: insHist('P1', 'Aviva Landlord Policy', 480),
        mortgage: [{ id: 'm1', lender: 'Nationwide Building Society', account: 'MT-441199', monthly: 720, rate: '4.25%', endDate: `${yr}-12-31`, notes: 'Renewal review 3 months prior' }],
        legalDocs: [
          { id: 'l1', type: 'Registered Title (Deeds)', ref: 'NGL-882190', notes: 'HM Land Registry Title Deeds' },
          { id: 'l2', type: 'Registered Map', ref: 'MAP-882190', notes: 'Title Plan Boundary Map' }
        ],
        suppliers: [
          { id: 's1', kind: 'Gas', name: 'British Gas', account: 'BG-99120', phone: '0333 202 9802', notes: 'Direct debit' },
          { id: 's2', kind: 'Electricity', name: 'Octopus Energy', account: 'OCT-4412', phone: '0808 164 1088', notes: 'Smart meter' }
        ],
        tenants: [mkTen('t1_1', 'Muhammad Mustafa', 'mustafa@example.com', '+44 7700 900077', '2024-01-15', { passport: 'GB123456789', job: 'Engineer (Full-Time)', notes: 'Discuss rent review in Q4.' })]
      }),
      mkProp('P2', 'P2 - Commercial Unit', '88 Commercial Road, London E1 1RD', 'Commercial', 3200, {
        deposit: 6400, depositScheme: 'MyDeposits', contractParty: 'Falcon Properties & Falcon Express Ltd', contractType: 'FRI Lease', councilTax: 'Business Rates', furnishing: 'Unfurnished',
        certs: [{ id: 'c2_1', type: 'Gas Safety (CP12)', ref: 'CGAS-12', expiry: `${yr + 1}-01-10` }],
        insurance: insHist('P2', 'AXA Commercial', 1250),
        mortgage: [{ id: 'm2', lender: 'Barclays Commercial', account: 'BC-990012', monthly: 1450, rate: '5.10%', endDate: `${yr + 1}-06-30`, notes: 'Commercial FRI mortgage' }],
        tenants: [mkTen('t2_1', 'John Miller (Director)', 'john@falconexpress.co.uk', '+44 20 7946 0912', '2022-01-01', { passport: 'US987654321', origin: 'United States', job: 'Company Director', visaStatus: 'Tier 1 Investor', visaCategory: 'Investor', shareCode: 'COMM-9912', visaExpiry: '2099-12-31', notes: '10-year FRI lease.' })]
      }),
      mkProp('P3', 'P3 - Selborne Flat 3 (Airbnb)', 'Flat 3, 29 Selborne Road, Ilford IG1 3AH', 'Hotel / Airbnb / Booking.com', 0, {
        councilTax: 'Business Rates', furnishing: 'Fully Furnished', contractType: 'Short-stay (Airbnb)',
        insurance: insHist('P3', 'Hiscox Short-Let', 620),
        certs: gasHist('P3'),
        income: hotelIncome('P3', 'Airbnb', 1, 1500)
      }),
      mkProp('P4', 'P4 - Selborne Flat 4 (Booking.com)', 'Flat 4, 29 Selborne Road, Ilford IG1 3AH', 'Hotel / Airbnb / Booking.com', 0, {
        councilTax: 'Business Rates', furnishing: 'Fully Furnished', contractType: 'Short-stay (Booking.com)',
        insurance: insHist('P4', 'Hiscox Short-Let', 620),
        certs: gasHist('P4'),
        income: hotelIncome('P4', 'Booking.com', 0, 1600)
      }),
      mkProp('P5', 'P5 - Kingsway HMO Unit 1', '45 Kingsway, London WC2B 6LE', 'HMO', 950, {
        councilTax: 'Band D',
        certs: [...gasHist('P5'), { id: 'c5_hmo', type: 'HMO Licence', ref: 'HMO-4455', expiry: `${yr + 3}-02-28` }],
        insurance: insHist('P5', 'Aviva HMO Cover', 780),
        tenants: [
          mkTen('t5_1', 'Alice Smith', 'alice@example.com', '+44 7700 900111', '2023-03-01'),
          mkTen('t5_2', 'Bob Jones', 'bob@example.com', '+44 7700 900222', '2023-05-15', { visaStatus: 'Skilled Worker', origin: 'India' })
        ]
      }),
      mkProp('P6', 'P6 - Kingsway HMO Unit 2', '45 Kingsway, London WC2B 6LE', 'HMO', 980, {
        councilTax: 'Band D',
        tenants: [mkTen('t6_1', 'Charlie Brown', 'charlie@example.com', '+44 7700 900333', '2024-02-01')]
      }),
      mkProp('P7', 'P7 - Ilford House', '14 Cranbrook Road, Ilford IG1 4LU', 'House', 2400, {
        councilTax: 'Band E',
        insurance: insHist('P7', 'Direct Line Landlord', 520),
        mortgage: [{ id: 'm7', lender: 'HSBC UK', account: 'HS-770011', monthly: 1100, rate: '3.95%', endDate: `${yr + 1}-11-30`, notes: '' }],
        tenants: [
          mkTen('t7_1', 'David Wilson', 'david@example.com', '+44 7700 900444', '2021-06-01'),
          mkTen('t7_2', 'Sarah Wilson', 'sarah@example.com', '+44 7700 900445', '2021-06-01')
        ]
      }),
      mkProp('P8', 'P8 - Stratford Flat', '88 High Street, Stratford E15 2NE', 'Flat', 1800, {
        councilTax: 'Band C',
        insurance: insHist('P8', 'Aviva Landlord Policy', 450),
        tenants: [mkTen('t8_1', 'Emma Watson', 'emma@example.com', '+44 7700 900555', '2022-09-01')]
      }),
      mkProp('P9', 'P9 - Barking Commercial', '12 Barking Road, Barking IG11 8DN', 'Commercial', 2800, {
        councilTax: 'Business Rates', contractType: 'FRI Lease', furnishing: 'Unfurnished'
      }),
      mkProp('P10', 'P10 - Redbridge Villa', '33 Eastern Avenue, Redbridge IG4 5AB', 'House', 2900, {
        councilTax: 'Band F',
        mortgage: [{ id: 'm10', lender: 'Santander UK', account: 'SAN-9922', monthly: 1350, rate: '4.10%', endDate: `${yr}-12-15`, notes: 'Rate ending soon' }],
        tenants: [mkTen('t10_1', 'Priya Patel', 'priya@example.com', '+44 7700 900666', '2023-08-01', { origin: 'India', visaStatus: 'Skilled Worker', visaExpiry: `${yr + 2}-08-01`, shareCode: 'W12 345 678' })]
      })
    ],
    users: [
      { id: 'u0', name: 'MJ Kingsway', username: 'mj@kingswaypartners.com', phone: '+447700900111', password: 'Password123!', role: 'landlord', props: [], avatar: '' },
      { id: 'u1', name: 'Landlord Admin', username: 'landlord@falconproperties.co.uk', phone: '+447700900222', password: 'landlord123', role: 'landlord', props: [], avatar: '' },
      { id: 'u2', name: 'Agent One', username: 'agent1@falconproperties.co.uk', phone: '+447700900333', password: 'agent123', role: 'agent', props: ['P1', 'P5', 'P6'], avatar: '' },
      { id: 'u3', name: 'Muhammad Mustafa', username: 'mustafa@example.com', phone: '+447700900077', password: 'tenant123', role: 'tenant', props: ['P1'], avatar: '' }
    ],
    contractors: [
      { id: 'k1', name: 'John’s Gas & Heating', trade: 'Gas Engineer', company: 'Apex Heating Ltd', phone: '+44 7911 123456', email: 'gas@apexheating.co.uk', notes: 'Gas Safe #55412' }
    ],
    archive: [],
    tickets: [{ id: 't1', propId: 'P1', category: 'Plumbing', desc: 'Kitchen sink dripping.', priority: 'Medium', status: 'Open', date: today() }],
    expenses,
    payments: [{ id: 'pay1', propId: 'P2', month: ym(), amount: 3200, date: today() }],
    settings: { phone: '02071835494', email: 'info@falconproperties.co.uk', hours: 'Mon–Fri 9:30 AM – 5:00 PM', gas: '0800 111999', power: '105', address: 'London, United Kingdom' }
  };
};

/* =====================================================================
   UI COMPONENTS
   ===================================================================== */
const FalconLogo = ({ className = 'h-14 w-auto', onClick }) => (
  <a href="#dash" onClick={onClick} className="flex items-center justify-center hover:opacity-90 transition-opacity">
    <img
      src="/falcon-logo.png"
      alt="Falcon Properties Emblem Logo"
      className={`${className} object-contain transition-transform duration-300 hover:scale-105 drop-shadow-[0_4px_12px_rgba(245,158,11,0.3)]`}
      onError={e => {
        if (!e.target.dataset.tried) { e.target.dataset.tried = 'true'; e.target.src = './falcon-logo.png'; }
      }}
    />
  </a>
);

const Btn = ({ c = 'bg-slate-900 text-white hover:bg-slate-800', ...p }) => (
  <button {...p} className={`${c} px-3 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1 transition-colors ${p.className || ''}`} />
);

const Card = ({ title, action, children }) => (
  <section className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 shadow-sm">
    {(title || action) && (
      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-100 pb-2">
        <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
        {action}
      </div>
    )}
    {children}
  </section>
);

/* ---------- Generic Form Modal (5MB file validation, select defaults) ---------- */
function FormModal({ title, fields, initial = {}, onSubmit, onClose }) {
  const [v, setV] = useState(() => {
    const init = { ...initial };
    fields.forEach(f => {
      if (f.t === 'select' && (init[f.k] === undefined || init[f.k] === '') && f.o && f.o.length) {
        init[f.k] = typeof f.o[0] === 'object' ? f.o[0].v : f.o[0];
      }
    });
    return init;
  });
  const set = (k, x) => setV(s => ({ ...s, [k]: x }));

  const handleFile = (k, f) => {
    if (!f) return;
    if (f.size > MAX_FILE_SIZE_BYTES) { alert('File size exceeds 5MB limit. Please select a file smaller than 5MB.'); return; }
    const r = new FileReader();
    r.onload = () => setV(s => ({ ...s, [k]: f.name, [k + 'Data']: r.result }));
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
                  {(f.o || []).map(o => {
                    const val = typeof o === 'object' ? o.v : o;
                    const lab = typeof o === 'object' ? o.l : o;
                    return <option key={val} value={val}>{lab}</option>;
                  })}
                </select>
              ) : f.t === 'textarea' ? (
                <textarea rows={3} value={v[f.k] ?? ''} onChange={e => set(f.k, e.target.value)} className="w-full border rounded-lg p-2 text-slate-800 border-slate-300" />
              ) : f.t === 'file' ? (
                <div>
                  <input type="file" accept="image/*,.pdf,.doc,.docx" onChange={e => handleFile(f.k, e.target.files[0])} className="w-full text-slate-600" />
                  <span className="text-[10px] text-slate-400 block mt-0.5">Maximum upload file size: 5 MB</span>
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
          <Btn c="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">Save Record</Btn>
        </div>
      </form>
    </div>
  );
}

/* ---------- Avatar Upload & Crop Modal ---------- */
function AvatarModal({ user, onSave, onClose }) {
  const [imgSrc, setImgSrc] = useState(user.avatar || '');
  const [scale, setScale] = useState(1);
  const fileInputRef = useRef(null);

  const onSelectFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > MAX_FILE_SIZE_BYTES) { alert('File size exceeds 5MB limit. Please select a smaller photo (less than 5MB).'); return; }
    const reader = new FileReader();
    reader.onload = () => setImgSrc(reader.result);
    reader.readAsDataURL(f);
  };

  const save = () => {
    if (!imgSrc) { onSave(''); onClose(); return; }
    const img = new Image();
    img.onload = () => {
      const S = 300;
      const c = document.createElement('canvas');
      c.width = S; c.height = S;
      const side = Math.min(img.width, img.height) / scale;
      c.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, S, S);
      onSave(c.toDataURL('image/jpeg', 0.85));
      onClose();
    };
    img.src = imgSrc;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4 text-xs shadow-2xl">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-sm text-slate-900">Upload & Crop Profile Picture</h3>
          <button onClick={onClose}><X className="w-4 h-4 text-slate-400" /></button>
        </div>

        <div className="flex flex-col items-center space-y-3">
          <div className="relative w-36 h-36 rounded-full border-4 border-amber-400 overflow-hidden bg-slate-100 flex items-center justify-center shadow-inner">
            {imgSrc ? (
              <img src={imgSrc} alt="Profile Preview" className="w-full h-full object-cover transition-transform" style={{ transform: `scale(${scale})` }} />
            ) : (
              <span className="text-slate-400 text-center font-bold px-2">No Image Selected</span>
            )}
          </div>

          {imgSrc && (
            <div className="w-full space-y-1">
              <span className="text-slate-600 font-semibold block text-center">Zoom / Crop Image Scale:</span>
              <input type="range" min="1" max="2.5" step="0.05" value={scale} onChange={e => setScale(parseFloat(e.target.value))} className="w-full accent-amber-500" />
            </div>
          )}

          <div className="flex gap-2 w-full pt-2">
            <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold p-2.5 rounded-lg flex items-center justify-center gap-2">
              <Camera className="w-4 h-4 text-amber-400" /> Choose / Take Photo
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={onSelectFile} />
          </div>
          <span className="text-[10px] text-slate-400">Supported formats: JPG, PNG, WEBP. Max size: 5 MB.</span>
        </div>

        <div className="flex justify-end gap-2 border-t pt-3">
          <Btn type="button" c="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50" onClick={onClose}>Cancel</Btn>
          <Btn c="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold" onClick={save}>Save Profile Picture</Btn>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable CRUD list: Add / Edit / Delete / CSV on every list ---------- */
function CrudList({
  title, items, fields, onAdd, onEdit, onDel, canEdit = true, canDel = true, canAdd = true, line, badge,
  empty = 'Nothing recorded yet.', csv, csvCols, initial, addLabel = 'Add New'
}) {
  const [form, setForm] = useState(null);

  const doCsv = () => {
    const cols = csvCols || colsOf(fields || []);
    downloadCSV(csv || title, cols.map(c => c[0]), items.map(it => cols.map(c => c[1](it))));
  };

  return (
    <Card
      title={`${title} (${items.length})`}
      action={
        <div className="flex gap-2">
          {csv && (
            <Btn c="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={doCsv}>
              <FileSpreadsheet className="w-3.5 h-3.5" /> Export CSV
            </Btn>
          )}
          {canEdit && canAdd && onAdd && <Btn onClick={() => setForm(initial || {})}><Plus className="w-3 h-3" />{addLabel}</Btn>}
        </div>
      }
    >
      {items.length === 0 && <p className="text-xs text-slate-400 italic">{empty}</p>}
      <div className="space-y-2">
        {items.map(it => {
          const fileHref = it.dataData || it.proofData;
          return (
            <div key={it.id} className="flex flex-wrap justify-between items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs">
              <div className="min-w-0 flex-1">{line(it)}</div>
              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                {badge && badge(it)}
                {fileHref && (
                  <a href={fileHref} download={it.data || it.proof || 'document'} className="p-1 text-slate-600 hover:text-slate-900" title="Download Document">
                    <Download className="w-3.5 h-3.5" />
                  </a>
                )}
                {canEdit && onEdit && (
                  <button onClick={() => setForm(it)} className="p-1 text-amber-600 hover:text-amber-700" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                )}
                {canDel && onDel && (
                  <button onClick={() => window.confirm('Delete this record?') && onDel(it.id)} className="p-1 text-red-600 hover:text-red-700" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {form && (
        <FormModal
          title={form.id ? `Edit ${title}` : `Add New ${title}`}
          fields={fields}
          initial={form}
          onClose={() => setForm(null)}
          onSubmit={v => { form.id ? onEdit(v) : onAdd(v); setForm(null); }}
        />
      )}
    </Card>
  );
}

/* ---------- Rent Reminder Email Modal (choose provider, edit template) ---------- */
const PROVIDERS = [
  { k: 'gmail', label: 'Gmail', color: 'bg-red-600 text-white' },
  { k: 'outlook', label: 'Outlook.com / Hotmail', color: 'bg-blue-600 text-white' },
  { k: 'office365', label: 'Microsoft 365 Outlook', color: 'bg-sky-700 text-white' },
  { k: 'yahoo', label: 'Yahoo Mail', color: 'bg-purple-600 text-white' },
  { k: 'proton', label: 'Proton Mail', color: 'bg-indigo-600 text-white' },
  { k: 'default', label: 'Default Mail App', color: 'bg-slate-900 text-white' }
];

function EmailReminderModal({ prop, tenantId, settings, onClose }) {
  const tenants = prop.tenants || [];
  const [sel, setSel] = useState(tenantId || (tenants.length > 1 ? 'all' : (tenants[0] || {}).id || ''));
  const [month, setMonth] = useState(ym());
  const [provider, setProvider] = useState('gmail');
  const [copied, setCopied] = useState(false);

  const recipients = sel === 'all' ? tenants : tenants.filter(t => t.id === sel);
  const names = recipients.map(t => t.name).filter(Boolean).join(' & ') || 'Tenant';
  const toEmails = recipients.map(t => t.email).filter(Boolean).join(',');
  const rentDay = Number((recipients[0] || {}).rentDay) || 1;

  const build = () => {
    const label = monthLabel(month);
    const [y, m] = month.split('-');
    const dueDate = `${ordinal(rentDay)} ${new Date(Number(y), Number(m) - 1, 1).toLocaleString('en-GB', { month: 'long' })} ${y}`;
    return {
      subject: `RENT OVERDUE REMINDER - ${prop.address} (${label})`,
      body: `Dear ${names},\n\nOur records show that your rent payment of ${gbp(prop.rent)} for ${prop.address} for ${label} (Due Date: ${dueDate}) is overdue.\n\nPlease arrange payment immediately. If you have already paid, please reply with your payment reference so we can update our records.\n\nKind regards,\nFalcon Properties Management\n------------------------------------------\nOffice Tel: ${settings?.phone || ''}\nSupport Email: ${settings?.email || ''}\nWorking Hours: ${settings?.hours || ''}\nEmergency Gas Line: ${settings?.gas || ''}\nPower Outage Line: ${settings?.power || ''}`
    };
  };

  const [subject, setSubject] = useState(() => build().subject);
  const [bodyText, setBodyText] = useState(() => build().body);

  useEffect(() => {
    const t = build();
    setSubject(t.subject);
    setBodyText(t.body);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, month]);

  const to = encodeURIComponent(toEmails);
  const su = encodeURIComponent(subject);
  const bd = encodeURIComponent(bodyText);
  const urls = {
    gmail: `https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=${to}&su=${su}&body=${bd}`,
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${su}&body=${bd}`,
    office365: `https://outlook.office.com/mail/deeplink/compose?to=${to}&subject=${su}&body=${bd}`,
    yahoo: `https://compose.mail.yahoo.com/?to=${to}&subject=${su}&body=${bd}`,
    proton: `https://mail.proton.me/compose?to=${to}&subject=${su}&body=${bd}`,
    default: `mailto:${toEmails}?subject=${su}&body=${bd}`
  };

  const send = () => {
    if (provider === 'default') window.location.href = urls.default;
    else window.open(urls[provider], '_blank', 'noopener,noreferrer');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`To: ${toEmails}\nSubject: ${subject}\n\n${bodyText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 space-y-4 text-xs shadow-2xl">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-sm text-slate-900">Send Rent Reminder Email</h3>
          <button onClick={onClose}><X className="w-4 h-4 text-slate-400" /></button>
        </div>

        <p className="text-slate-600">
          Property: <strong>{prop.code || prop.address}</strong> · Rent: <strong>{gbp(prop.rent)}</strong>
        </p>

        <div className="grid grid-cols-2 gap-2">
          <label className="block space-y-1">
            <span className="font-semibold text-slate-700">Send To</span>
            <select value={sel} onChange={e => setSel(e.target.value)} className="w-full border rounded-lg p-2 bg-white border-slate-300">
              {tenants.length === 0 && <option value="">No tenants</option>}
              {tenants.length > 1 && <option value="all">All tenants ({tenants.length})</option>}
              {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="font-semibold text-slate-700">Rent Due Month</span>
            <input type="month" value={month} onChange={e => setMonth(e.target.value || ym())} className="w-full border rounded-lg p-2 border-slate-300" />
          </label>
        </div>
        <p className="text-slate-500">Email: <strong>{toEmails || 'No email on file'}</strong></p>

        <div className="space-y-2">
          <label className="block space-y-1">
            <span className="font-semibold text-slate-700">Subject Line (editable)</span>
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 font-mono text-xs bg-slate-50 focus:bg-white text-slate-900 font-bold" />
          </label>
          <label className="block space-y-1">
            <span className="font-semibold text-slate-700">Message Body (editable)</span>
            <textarea rows={10} value={bodyText} onChange={e => setBodyText(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800 font-mono text-[11px] bg-slate-50 focus:bg-white leading-relaxed" />
          </label>
          <button type="button" onClick={() => { const t = build(); setSubject(t.subject); setBodyText(t.body); }} className="text-amber-600 font-bold underline">Reset to sample template</button>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-slate-700">Choose Email Provider</p>
          <div className="grid grid-cols-2 gap-2">
            {PROVIDERS.map(pr => (
              <button
                key={pr.k}
                type="button"
                onClick={() => setProvider(pr.k)}
                className={`p-2 rounded-lg font-bold border-2 text-left flex items-center justify-between ${provider === pr.k ? 'border-amber-500 ' + pr.color : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
              >
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{pr.label}</span>
                {provider === pr.k && <CheckCircle className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Btn c="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex-1 justify-center py-2.5" onClick={send}>
            <Send className="w-3.5 h-3.5" /> Open in {PROVIDERS.find(p => p.k === provider).label}
          </Btn>
          <Btn c="bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 py-2.5" onClick={handleCopy}>
            <Copy className="w-3.5 h-3.5" /> {copied ? '✓ Copied!' : 'Copy Text'}
          </Btn>
        </div>

        <div className="flex justify-end border-t pt-3">
          <Btn c="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50" onClick={onClose}>Close</Btn>
        </div>
      </div>
    </div>
  );
}

/* ---------- Password Reset Modal (OTP via EmailJS / SMS demo) ---------- */
function ResetModal({ users, onUpdate, onClose }) {
  const [method, setMethod] = useState('email');
  const [step, setStep] = useState(1);
  const [contactInput, setContactInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [targetUser, setTargetUser] = useState(null);

  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  const formatTime = s => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

  const handleRequestOtp = async e => {
    e.preventDefault();
    const cleanInput = contactInput.trim().toLowerCase();
    const user = method === 'email'
      ? users.find(u => u.username.trim().toLowerCase() === cleanInput)
      : users.find(u => (u.phone || '').replace(/\s+/g, '').includes(cleanInput.replace(/\s+/g, '')) && cleanInput);

    if (!user) {
      setMsg({ type: 'err', text: method === 'email' ? 'No account found with that email.' : 'No account found with that mobile number.' });
      return;
    }
    setTargetUser(user);
    setLoading(true);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setTimeLeft(120);

    if (method === 'email') {
      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { to_email: user.username, otp_code: code }, EMAILJS_PUBLIC_KEY);
        setMsg({ type: 'info', text: `OTP security code sent to ${user.username}.` });
        setStep(2);
      } catch (err) {
        setMsg({ type: 'err', text: 'Email dispatch failed. Please verify EmailJS keys or try Phone reset.' });
      } finally {
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        setLoading(false);
        setMsg({ type: 'info', text: `SMS Security Code [${code}] dispatched to phone ${user.phone || cleanInput}.` });
        setStep(2);
      }, 1000);
    }
  };

  const handleVerifyAndReset = e => {
    e.preventDefault();
    if (timeLeft <= 0) return setMsg({ type: 'err', text: 'OTP expired. Please click "Resend Code".' });
    if (userOtp.trim() !== generatedOtp) return setMsg({ type: 'err', text: 'Invalid Security OTP code. Please check and try again.' });
    if (newPass.length < 6) return setMsg({ type: 'err', text: 'Password must be at least 6 characters.' });
    onUpdate(targetUser.username.trim().toLowerCase(), newPass);
    setMsg({ type: 'success', text: 'Password reset successfully! Updating session...' });
    setTimeout(() => onClose(targetUser.username), 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4 text-xs shadow-2xl">
        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900">Password Recovery</h3>
          </div>
          <button type="button" onClick={() => onClose()}><X className="w-4 h-4 text-slate-400" /></button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl text-center">
              <button type="button" onClick={() => { setMethod('email'); setMsg({ type: '', text: '' }); }} className={`py-1.5 rounded-lg font-bold flex items-center justify-center gap-1 ${method === 'email' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>
                <Mail className="w-3.5 h-3.5" /> Email Reset
              </button>
              <button type="button" onClick={() => { setMethod('phone'); setMsg({ type: '', text: '' }); }} className={`py-1.5 rounded-lg font-bold flex items-center justify-center gap-1 ${method === 'phone' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>
                <Smartphone className="w-3.5 h-3.5" /> Phone / SMS Reset
              </button>
            </div>

            <p className="text-slate-600">
              {method === 'email' ? 'Enter your registered email address to receive a security OTP code.' : 'Enter your registered mobile phone number to receive a recovery OTP.'}
            </p>

            <label className="block space-y-1">
              <span className="font-semibold text-slate-700">{method === 'email' ? 'Registered Email Address' : 'Registered Phone Number'}</span>
              <div className="relative">
                <input
                  autoFocus required
                  type={method === 'email' ? 'email' : 'text'}
                  placeholder={method === 'email' ? 'e.g. landlord@falconproperties.co.uk' : 'e.g. +447700900111'}
                  value={contactInput}
                  onChange={e => setContactInput(e.target.value)}
                  className="w-full border rounded-lg p-2.5 pl-9 bg-slate-50 focus:bg-white text-slate-800"
                />
                {method === 'email' ? <Mail className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" /> : <Phone className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />}
              </div>
            </label>

            {msg.text && (
              <p className={`p-2.5 rounded-lg border font-medium ${msg.type === 'err' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>{msg.text}</p>
            )}

            <div className="flex justify-end gap-2 border-t pt-3">
              <Btn type="button" c="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50" onClick={() => onClose()}>Cancel</Btn>
              <Btn c="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold" disabled={loading}>{loading ? 'Processing...' : 'Send Security OTP'}</Btn>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndReset} className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-slate-600">Verification code sent via {method.toUpperCase()}.</p>
              <span className={`font-mono font-bold px-2 py-0.5 rounded border text-xs ${timeLeft > 30 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-red-50 text-red-700 border-red-200 animate-pulse'}`}>⏱ {formatTime(timeLeft)}</span>
            </div>

            {msg.text && (
              <div className={`p-2.5 rounded-lg border font-medium text-xs ${msg.type === 'err' ? 'bg-red-50 text-red-700 border-red-200' : msg.type === 'info' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>{msg.text}</div>
            )}

            <label className="block space-y-1">
              <span className="font-semibold text-slate-700">Enter 6-Digit Security OTP</span>
              <input autoFocus required maxLength={6} type="text" disabled={timeLeft <= 0} placeholder="6-digit OTP code" value={userOtp} onChange={e => setUserOtp(e.target.value)}
                className="w-full border rounded-lg p-2.5 font-mono text-center text-sm font-bold tracking-widest bg-slate-50 focus:bg-white text-slate-900 border-amber-300 disabled:bg-slate-100 disabled:text-slate-400" />
            </label>

            <label className="block space-y-1">
              <span className="font-semibold text-slate-700">New Password (min 6 chars)</span>
              <div className="relative">
                <input required type={showPass ? 'text' : 'password'} placeholder="Enter new strong password" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full border rounded-lg p-2.5 pr-10 bg-slate-50 focus:bg-white text-slate-800" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </label>

            <div className="flex justify-between items-center border-t pt-3">
              <button type="button" onClick={handleRequestOtp} className="text-xs font-bold text-amber-600 underline hover:text-amber-700">Resend Code</button>
              <div className="flex gap-2">
                <Btn type="button" c="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50" onClick={() => onClose()}>Cancel</Btn>
                <Btn c="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold" disabled={timeLeft <= 0}>Verify & Reset Password</Btn>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* =====================================================================
   MAIN APPLICATION
   ===================================================================== */
export default function App() {
  const [db, setDb] = useState(() => {
    try {
      const s = localStorage.getItem(DB_KEY);
      return s ? normalizeDb(JSON.parse(s)) : seed();
    } catch {
      return seed();
    }
  });
  const [me, setMe] = useState(() => {
    try { return JSON.parse(localStorage.getItem('falcon_me')); } catch { return null; }
  });

  const [view, setView] = useState('dash');
  const [propId, setPropId] = useState(null);
  const [menu, setMenu] = useState(false);
  const [reminderDropdown, setReminderDropdown] = useState(false);
  const [search, setSearch] = useState('');
  const [typeF, setTypeF] = useState('All');
  const [expMonth, setExpMonth] = useState('');
  const [expProp, setExpProp] = useState('All');
  const [login, setLogin] = useState({ u: '', p: '', role: 'landlord', signup: false, err: '' });
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [modal, setModal] = useState(null);
  const [assign, setAssign] = useState(null);
  const [reminderModal, setReminderModal] = useState(null);
  const [avatarModalUser, setAvatarModalUser] = useState(null);

  const menuRef = useRef(null);
  const remRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch { }
  }, [db]);

  useEffect(() => {
    try {
      if (me) localStorage.setItem('falcon_me', JSON.stringify(me));
      else localStorage.removeItem('falcon_me');
    } catch { }
  }, [me]);

  useEffect(() => {
    const handleOutsideClick = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false);
      if (remRef.current && !remRef.current.contains(e.target)) setReminderDropdown(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  /* ----- DB mutators ----- */
  const upd = (key, fn) => setDb(d => ({ ...d, [key]: fn(d[key]) }));
  const setProp = (id, patch) => upd('props', ps => ps.map(p => (p.id === id ? { ...p, ...patch } : p)));
  const addTo = (key, i) => upd(key, a => [...a, { ...i, id: uid() }]);
  const editIn = (key, i) => upd(key, a => a.map(x => (x.id === i.id ? i : x)));
  const delFrom = (key, id) => upd(key, a => a.filter(x => x.id !== id));

  // per-property nested list (inside a property page)
  const sub = (p, key) => ({
    items: p[key] || [],
    onAdd: i => setProp(p.id, { [key]: [...(p[key] || []), { ...i, id: uid() }] }),
    onEdit: i => setProp(p.id, { [key]: (p[key] || []).map(x => (x.id === i.id ? i : x)) }),
    onDel: id => setProp(p.id, { [key]: (p[key] || []).filter(x => x.id !== id) })
  });

  // portfolio-wide nested list (pick property in form)
  const aggAdd = key => v => {
    const { propId: pid, propAddress, ...r } = v;
    upd('props', ps => ps.map(p => (p.id === pid ? { ...p, [key]: [...(p[key] || []), { ...r, id: uid() }] } : p)));
  };
  const aggEdit = key => v => {
    const { propId: pid, propAddress, ...r } = v;
    upd('props', ps => ps.map(p => {
      const has = (p[key] || []).some(x => x.id === r.id);
      if (p.id === pid) return { ...p, [key]: has ? p[key].map(x => (x.id === r.id ? r : x)) : [...(p[key] || []), r] };
      return has ? { ...p, [key]: p[key].filter(x => x.id !== r.id) } : p;
    }));
  };
  const aggDel = key => id => upd('props', ps => ps.map(p => ({ ...p, [key]: (p[key] || []).filter(x => x.id !== id) })));
  const agg = key => ({ onAdd: aggAdd(key), onEdit: aggEdit(key), onDel: aggDel(key) });

  const updatePassword = (cleanEmail, newPass) => {
    upd('users', us => us.map(u => (u.username.trim().toLowerCase() === cleanEmail ? { ...u, password: newPass } : u)));
  };

  const saveAvatar = avatarData => {
    if (!me) return;
    const updatedUser = { ...me, avatar: avatarData };
    setMe(updatedUser);
    editIn('users', { ...(db.users.find(u => u.id === me.id) || me), avatar: avatarData });
  };

  /* =================== AUTH SCREEN =================== */
  if (!me) {
    const roles = [['landlord', '👑 Landlord'], ['agent', '🏢 Agent'], ['tenant', '👤 Tenant']];
    const lr = login.role;
    const setL = patch => setLogin(l => ({ ...l, err: '', ...patch }));

    const handleAuth = e => {
      e.preventDefault();
      const un = login.u.trim().toLowerCase();

      if (login.signup) {
        if (!un || !un.includes('@') || login.p.length < 4) return setL({ err: 'Please enter a valid Email address and password (min 4 chars).' });
        if (db.users.some(x => x.username.trim().toLowerCase() === un)) return setL({ err: 'That Email address is already registered.' });
        const nu = { id: uid(), name: un, username: un, password: login.p, role: lr, props: [], avatar: '' };
        upd('users', a => [...a, nu]);
        setMe(nu);
        setView('dash');
        return;
      }

      const u = db.users.find(x => x.username.trim().toLowerCase() === un && x.password === login.p);
      if (!u) return setL({ err: 'Incorrect Email address or password.' });
      if (u.role !== lr) return setL({ err: `Account exists as "${u.role}". Select "${u.role}" above to log in.` });
      setMe(u);
      setView('dash');
    };

    return (
      <div className="min-h-screen relative flex flex-col items-center justify-between p-4 sm:p-6 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${TOWER_BRIDGE_BG}')` }}>
        <div className="absolute inset-0 bg-slate-950/40" />

        <div className="relative z-10 w-full max-w-lg my-auto space-y-4">
          <div className="flex justify-center pb-2">
            <FalconLogo className="h-48 sm:h-64 w-auto" onClick={e => e.preventDefault()} />
          </div>

          <form onSubmit={handleAuth} className="bg-white/95 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl border border-white/30">
            <div className="border-b border-slate-200 pb-3 text-center sm:text-left">
              <h2 className="font-bold text-lg text-slate-900">Portal Security Sign In</h2>
              <p className="text-xs text-slate-500">Access your property workspace</p>
            </div>

            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
              {roles.map(([k, l]) => (
                <button type="button" key={k} onClick={() => setL({ role: k })} className={`py-2 rounded-lg text-xs font-bold transition-all ${lr === k ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}>{l}</button>
              ))}
            </div>

            <p className="text-xs font-bold text-slate-700">{login.signup ? `Create new ${lr} account` : `Sign in as ${lr}`}</p>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email Address</label>
              <input autoFocus type="email" placeholder="Enter your email address" value={login.u} onChange={e => setL({ u: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-slate-50 focus:bg-white text-slate-800" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <div className="relative">
                <input type={showLoginPass ? 'text' : 'password'} placeholder="Enter your password" value={login.p} onChange={e => setL({ p: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2.5 pr-10 text-xs bg-slate-50 focus:bg-white text-slate-800" />
                <button type="button" onClick={() => setShowLoginPass(!showLoginPass)} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600" title={showLoginPass ? 'Hide password' : 'View password'}>
                  {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {login.err && <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">{login.err}</p>}

            <button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg p-2.5 text-xs transition-colors shadow-lg">{login.signup ? 'Create Account' : 'Sign In'}</button>

            <div className="flex flex-col gap-1.5 text-center border-t border-slate-200 pt-3 text-xs">
              <button type="button" onClick={() => setL({ signup: !login.signup })} className="text-slate-600 underline hover:text-slate-900">
                {login.signup ? 'Already registered? Sign in' : `New ${lr}? Create an account`}
              </button>
              <button type="button" onClick={() => setResetModal(true)} className="text-amber-600 font-bold underline hover:text-amber-700">Forgot / Reset Password?</button>
            </div>
          </form>
        </div>

        <footer className="relative z-10 w-full max-w-4xl mt-8 pt-6 border-t border-slate-700/80 grid md:grid-cols-3 gap-6 text-slate-200 text-xs bg-slate-950/60 p-4 rounded-xl">
          <div>
            <h3 className="font-bold text-amber-400 text-sm mb-1">About Falcon Properties</h3>
            <p className="leading-relaxed text-slate-300">Falcon Properties is an enterprise real estate management firm delivering premier residential, commercial, and short-stay operations across London.</p>
          </div>
          <div>
            <h3 className="font-bold text-amber-400 text-sm mb-1">Corporate Contact Directory</h3>
            <p className="flex items-center gap-1.5 mt-1"><Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Office: {db.settings.phone}</p>
            <p className="flex items-center gap-1.5 mt-1"><Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Email: {db.settings.email}</p>
            <p className="flex items-center gap-1.5 mt-1"><Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Hours: {db.settings.hours}</p>
          </div>
          <div>
            <h3 className="font-bold text-red-400 text-sm mb-1 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> 24/7 Emergency Support</h3>
            <p className="text-slate-300 mt-1">Gas Leak Emergency: <strong className="text-white">{db.settings.gas}</strong></p>
            <p className="text-slate-300 mt-1">Power Outage Line: <strong className="text-white">{db.settings.power}</strong></p>
          </div>
        </footer>

        {resetModal && (
          <ResetModal
            users={db.users}
            onUpdate={updatePassword}
            onClose={resetEmail => {
              setResetModal(false);
              if (resetEmail) setLogin(l => ({ ...l, u: resetEmail, p: '', err: '' }));
            }}
          />
        )}
      </div>
    );
  }

  /* =================== ROLE SCOPING =================== */
  const role = me.role;
  const L = role === 'landlord';
  const A = role === 'agent';
  const T = role === 'tenant';

  const mine = db.users.find(u => u.id === me.id) || me;
  const props = L ? db.props : db.props.filter(p => (mine.props || []).includes(p.id));
  const ids = props.map(p => p.id);
  const pName = id => {
    const p = db.props.find(x => x.id === id);
    return p ? `${p.code || p.id} — ${p.address}` : 'Unknown Property';
  };
  const propOpts = props.map(p => ({ v: p.id, l: `${p.code || p.id} — ${p.address}` }));
  const hotelOpts = props.filter(isHotel).map(p => ({ v: p.id, l: `${p.code || p.id} — ${p.address}` }));
  const rentOpts = props.filter(p => !isHotel(p)).map(p => ({ v: p.id, l: `${p.code || p.id} — ${p.address}` }));

  /* ----- Unassigned screen ----- */
  if (!L && props.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-between p-4">
        <header className="bg-slate-900 text-white p-4 rounded-xl flex justify-between items-center shadow">
          <FalconLogo className="h-12 w-auto" onClick={e => e.preventDefault()} />
          <button onClick={() => setMe(null)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"><LogOut className="w-4 h-4" /> Sign Out</button>
        </header>
        <div className="max-w-xl mx-auto my-auto bg-white border border-slate-200 rounded-2xl p-8 space-y-5 shadow-xl text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto"><AlertTriangle className="w-8 h-8" /></div>
          <h2 className="text-xl font-extrabold text-slate-900">Property Unit Assignment Required</h2>
          <p className="text-xs text-slate-600 leading-relaxed">Welcome, <strong>{me.username}</strong>. You are logged in as a <strong>{role.toUpperCase()}</strong>, but no property units are currently assigned to your account.</p>
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-xs space-y-2 text-left">
            <p className="font-bold border-b border-amber-200 pb-1">Please Contact Your Landlord / Portfolio Admin:</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-amber-700" /> Office Telephone: <strong>{db.settings.phone}</strong></p>
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-amber-700" /> Support Email: <strong>{db.settings.email}</strong></p>
            <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-700" /> Working Hours: <strong>{db.settings.hours}</strong></p>
          </div>
          <button onClick={() => setMe(null)} className="bg-slate-900 text-white hover:bg-slate-800 px-5 py-2.5 rounded-xl font-bold text-xs shadow">Return to Login Screen</button>
        </div>
        <footer className="bg-slate-900 text-slate-400 text-xs py-4 px-6 rounded-xl text-center">Falcon Properties Management · Support Tel: {db.settings.phone}</footer>
      </div>
    );
  }

  /* =================== DERIVED DATA =================== */
  const cm = ym();
  const curYear = new Date().getFullYear();

  const addProp = v => {
    const id = 'P' + uid();
    upd('props', a => [...a, { ...mkProp(id, v.code || id, '', '', 0), ...v, id, rent: Number(v.rent), deposit: Number(v.deposit) }]);
    if (A) upd('users', us => us.map(u => (u.id === me.id ? { ...u, props: [...(u.props || []), id] } : u)));
  };

  const paid = p => db.payments.some(x => x.propId === p.id && x.month === cm);
  const overdue = p => (p.tenants || []).length > 0 && !isHotel(p) && !paid(p) && new Date().getDate() > ((p.tenants[0] || {}).rentDay || 1);
  const overdueList = props.filter(overdue);

  const rentIn = db.payments.filter(x => x.month === cm && ids.includes(x.propId)).reduce((s, x) => s + Number(x.amount), 0);
  const hotelIn = props.flatMap(p => p.income || []).filter(i => i.month === cm).reduce((s, i) => s + Number(i.amount), 0);
  const expThisMonth = db.expenses.filter(e => ids.includes(e.propId) && e.date.slice(0, 7) === cm).reduce((s, e) => s + Number(e.amount), 0);

  const withP = key => props.flatMap(p => (p[key] || []).map(x => ({ ...x, propId: p.id, propAddress: p.address })));
  const allCerts = withP('certs');
  const allInsurance = withP('insurance');
  const allMortgages = withP('mortgage');
  const allTenants = withP('tenants');
  const allIncome = props.filter(isHotel).flatMap(p => (p.income || []).map(x => ({ ...x, propId: p.id, propAddress: p.address })))
    .sort((a, b) => b.month.localeCompare(a.month));
  const allLegal = withP('legalDocs');
  const allMeters = withP('meters');
  const allUtilities = withP('suppliers');
  const scopedExpenses = db.expenses.filter(e => ids.includes(e.propId)).sort((a, b) => b.date.localeCompare(a.date));
  const scopedPayments = db.payments.filter(x => ids.includes(x.propId)).sort((a, b) => b.month.localeCompare(a.month));
  const scopedTickets = db.tickets.filter(t => ids.includes(t.propId));

  const certAlerts = allCerts.filter(c => status(c.expiry) !== 'Valid' && !['c1_x'].includes(c.id) && days(c.expiry) > -400);
  const insAlerts = props.filter(p => {
    const l = [...(p.insurance || [])].sort((a, b) => b.expiry.localeCompare(a.expiry))[0];
    return !l || days(l.expiry) <= 60;
  });
  const mortgageAlerts = allMortgages.filter(m => days(m.endDate) <= 90);
  const openTk = scopedTickets.filter(t => t.status === 'Open');

  const markPaid = p => addTo('payments', { propId: p.id, month: cm, amount: p.rent, date: today() });
  const openProp = id => { setPropId(id); setView('prop'); };

  /* ----- CSV definitions (used by each list AND by Export All) ----- */
  const PN = ['Property', it => pName(it.propId)];
  const tenCsv = [PN, ['Name', t => t.name], ['Email', t => t.email], ['Phone', t => t.phone], ['Passport', t => t.passport], ['Country', t => t.origin], ['Employment', t => t.job], ['Move In', t => t.moveIn], ['Rent Due Day', t => t.rentDay], ['Visa Status', t => t.visaStatus], ['Visa Category', t => t.visaCategory], ['Share Code', t => t.shareCode], ['Visa Expiry', t => t.visaExpiry], ['Notes', t => t.notes]];
  const certCsv = [PN, ['Type', c => c.type], ['Reference', c => c.ref], ['Expiry', c => c.expiry], ['Status', c => status(c.expiry)]];
  const insCsv = [PN, ['Provider', i => i.provider], ['Policy', i => i.policy], ['Premium (£)', i => i.premium], ['Start', i => i.start], ['Expiry', i => i.expiry], ['Status', i => status(i.expiry)]];
  const mortCsv = [PN, ['Lender', m => m.lender], ['Account', m => m.account], ['Monthly (£)', m => m.monthly], ['Rate', m => m.rate], ['Deal End', m => m.endDate], ['Status', m => mortgageStatus(m.endDate)], ['Notes', m => m.notes]];
  const incCsv = [PN, ['Month', i => i.month], ['Platform', i => i.platform], ['Amount (£)', i => i.amount], ['Notes', i => i.notes]];
  const expCsv = [PN, ['Date', e => e.date], ['Category', e => e.category], ['Amount (£)', e => e.amount], ['Supplier', e => e.supplier], ['Notes', e => e.notes]];
  const payCsv = [PN, ['Month', x => x.month], ['Amount (£)', x => x.amount], ['Date Paid', x => x.date]];
  const tkCsv = [PN, ['Date', t => t.date], ['Category', t => t.category], ['Description', t => t.desc], ['Priority', t => t.priority], ['Status', t => t.status]];
  const legalCsv = [PN, ['Type', d => d.type], ['Reference', d => d.ref], ['Description', d => d.notes]];
  const meterCsv = [PN, ['Utility', m => m.utility], ['Type', m => m.kind], ['Reading', m => m.reading], ['Date', m => m.date]];
  const utilCsv = [PN, ['Category', s => s.kind], ['Supplier', s => s.name], ['Account', s => s.account], ['Phone', s => s.phone], ['Notes', s => s.notes]];
  const contCsv = [['Name', c => c.name], ['Trade', c => c.trade], ['Company', c => c.company], ['Phone', c => c.phone], ['Email', c => c.email], ['Notes', c => c.notes]];
  const archCsv = [['Name', a => a.name], ['Email', a => a.email], ['Phone', a => a.phone], ['Address', a => a.address], ['Move In', a => a.moveIn], ['Move Out', a => a.moveOut]];
  const portCsv = [
    ['Code', p => p.code || p.id], ['Address', p => p.address], ['Category', p => p.type],
    ['Tenants', p => (p.tenants || []).map(t => t.name).join(' / ') || (isHotel(p) ? 'Short-stay' : 'Vacant')],
    ['Monthly Rent (£)', p => p.rent], ['Deposit (£)', p => p.deposit],
    ['Rent Status', p => (isHotel(p) ? ((p.income || []).some(i => i.month === cm) ? 'Income Logged' : 'Income Pending') : (p.tenants || []).length ? (paid(p) ? 'Paid' : 'Unpaid') : 'Vacant')]
  ];
  const userCsv = [['User ID', u => u.id], ['Username', u => u.username], ['Phone', u => u.phone || ''], ['Role', u => u.role], ['Assigned Properties', u => (u.role === 'landlord' ? 'ALL ACCESS' : (u.props || []).length)]];

  const csvDefs = {
    portfolio: { name: 'Falcon_Portfolio_Report', items: props, cols: portCsv },
    tenants: { name: 'Active_Tenants', items: allTenants, cols: tenCsv },
    rent: { name: 'Rent_Payments', items: scopedPayments, cols: payCsv },
    income: { name: 'ShortStay_Income_AirbnbBooking', items: allIncome, cols: incCsv },
    expenses: { name: 'Property_Expenses_5yr', items: scopedExpenses, cols: expCsv },
    certs: { name: 'Compliance_Certificates', items: allCerts, cols: certCsv },
    insurance: { name: 'Insurance_Policies', items: allInsurance, cols: insCsv },
    mortgage: { name: 'Mortgage_Register', items: allMortgages, cols: mortCsv },
    legal: { name: 'Legal_Title_Planning', items: allLegal, cols: legalCsv },
    meters: { name: 'Meter_Readings', items: allMeters, cols: meterCsv },
    utilities: { name: 'Utility_Suppliers', items: allUtilities, cols: utilCsv },
    tickets: { name: 'Maintenance_Tickets', items: scopedTickets, cols: tkCsv },
    ...(!T ? { contractors: { name: 'Suppliers_Trades', items: db.contractors, cols: contCsv }, archive: { name: 'Archived_Tenants', items: db.archive, cols: archCsv } } : {}),
    ...(L ? { users: { name: 'Users_Permissions', items: db.users, cols: userCsv } } : {})
  };
  const csvP = k => ({ csv: csvDefs[k].name, csvCols: csvDefs[k].cols });

  const exportAll = () => {
    Object.values(csvDefs).forEach((d, i) => {
      setTimeout(() => downloadCSV(d.name, d.cols.map(c => c[0]), d.items.map(it => d.cols.map(c => c[1](it)))), i * 450);
    });
  };

  /* ----- Navigation ----- */
  const nav = [
    ['dash', '🏠 Dashboard'],
    ['tenants', '👥 Active Tenants Register'],
    ['rent', '🚨 Rent Overdue, Payments & Reminders'],
    ['shortstay', '🏨 Airbnb / Booking.com Income'],
    ['expenses', '💷 Property Expenses (5-Yr Vault)'],
    ['certs', '📜 Compliance & Title Vault (5-Yr)'],
    ['insurance', '🛡️ Insurance Policies (5-Yr)'],
    ['mortgage', '🏦 Mortgage Lender Register'],
    ['tickets', '🔧 Maintenance Ticket Center'],
    ...(!T ? [['suppliers', '🛠️ Suppliers & Trades'], ['archive', '📁 Archived Tenants']] : []),
    ...(L ? [['users', '👥 Users, Roles & Property Assignments'], ['settings', '⚙️ Contact Settings']] : [])
  ].filter(([k]) => !T || ['dash', 'tickets'].includes(k));

  /* ----- Field definitions ----- */
  const propFields = [
    F('code', 'Property Name / Code (e.g. P1 - Flat 1)'),
    F('address', 'Full Property Address'),
    F('type', 'Property Category', 'select', TYPES),
    F('rent', 'Monthly Rent (£) (0 for Airbnb / Booking.com)', 'number'),
    F('deposit', 'Deposit Held (£)', 'number'),
    F('depositScheme', 'Deposit Scheme / Supplier'),
    F('contractParty', 'Contract Agreement Parties'),
    F('contractType', 'Agreement Type (e.g. AST / Commercial FRI)'),
    F('councilTax', 'Council Tax / Business Rates', 'select', TAX_BANDS),
    F('furnishing', 'Furnishing Status'),
    F('garden', 'Garden Access'),
    F('parking', 'Parking Facilities')
  ];

  const tenFields = [
    F('name', 'Full Tenant Name'), F('email', 'Email Address', 'email'), F('phone', 'Phone Number'), F('passport', 'Passport Number'),
    F('origin', 'Country of Origin'), F('job', 'Employment / Job Status'), F('moveIn', 'Move-In Date', 'date'),
    F('rentDay', 'Rent Due Day of Month', 'number'), F('visaStatus', 'Visa / Immigration Status'), F('visaCategory', 'Visa Category'),
    F('shareCode', 'Right to Rent Share Code'), F('visaExpiry', 'Visa Expiry Date', 'date'),
    F('proof', 'Visa / Right to Rent Proof Document (Max 5MB)', 'file'), F('notes', 'Note to Self (Private)', 'textarea')
  ];
  const tenantEditableFields = tenFields.filter(f => ['job', 'passport', 'visaStatus', 'visaCategory', 'shareCode', 'visaExpiry', 'proof'].includes(f.k));
  const tenInit = { rentDay: 1, moveIn: today(), visaStatus: 'UK Citizen' };

  const certFields = [F('type', 'Certificate / Document Type', 'select', CERTS), F('ref', 'Reference / Registration Number'), F('expiry', 'Expiry Date (If Applicable)', 'date'), F('data', 'Upload Document File (Max 5MB)', 'file')];
  const insuranceFields = [F('provider', 'Insurance Provider'), F('policy', 'Policy Number'), F('premium', 'Annual Premium (£)', 'number'), F('start', 'Start Date', 'date'), F('expiry', 'Expiry Date', 'date'), F('data', 'Upload Policy Document (Max 5MB)', 'file')];
  const mortgageFields = [F('lender', 'Lender / Provider Name'), F('account', 'Account / Policy Number'), F('monthly', 'Monthly Mortgage Payment (£)', 'number'), F('rate', 'Interest Rate (%)'), F('endDate', 'Interest Rate Expiry Date', 'date'), F('notes', 'Notes / Renewal Terms', 'textarea'), F('data', 'Upload Mortgage Document (Max 5MB)', 'file')];
  const legalFields = [F('type', 'Legal Document Category', 'select', ['Registered Title (Deeds)', 'Registered Map', 'Planning Permission', 'Building Control', 'Leasehold Agreement']), F('ref', 'Reference / Registration Number'), F('notes', 'Document Description'), F('data', 'Upload Title/Map/Planning Document (Max 5MB)', 'file')];
  const meterFields = [F('utility', 'Utility Type', 'select', ['Electricity', 'Gas', 'Water']), F('kind', 'Reading Type', 'select', ['Opening', 'Closing', 'Routine']), F('reading', 'Value / Reading Units'), F('date', 'Date Taken', 'date')];
  const utilFields = [F('kind', 'Utility Category', 'select', ['Gas', 'Electricity', 'Water', 'Broadband', 'Council Tax', 'Business Rates', 'Managing Agent', 'Other']), F('name', 'Supplier Name'), F('account', 'Account Number'), F('phone', 'Support Phone'), F('notes', 'Notes')];
  const incomeFields = (withProp) => [
    ...(withProp ? [F('propId', 'Select Airbnb / Booking.com Property', 'select', hotelOpts)] : []),
    F('month', 'Income Month', 'month'), F('platform', 'Platform', 'select', PLATFORMS), F('amount', 'Rent / Payout Received (£) – manual entry', 'number'), F('notes', 'Notes')
  ];
  const expenseFields = (withProp) => [
    ...(withProp ? [F('propId', 'Select Property Unit', 'select', propOpts)] : []),
    F('date', 'Expense Date', 'date'), F('category', 'Expense Category', 'select', EXP_CATS), F('amount', 'Amount Paid (£)', 'number'),
    F('supplier', 'Supplier / Payee'), F('notes', 'Notes / Invoice Details'), F('data', 'Upload Receipt (Max 5MB)', 'file')
  ];
  const expInit = pid => ({ propId: pid || ids[0], date: today(), category: 'Repairs' });
  const tkFields = full => [
    ...(full ? [F('propId', 'Select Property Unit', 'select', propOpts)] : []),
    F('category', 'Category', 'select', ['Plumbing', 'Electrical', 'Gas/Heating', 'Structural', 'Appliances', 'Pest Control', 'Other']),
    F('desc', 'Detailed Description', 'textarea'),
    F('priority', 'Priority', 'select', ['Low', 'Medium', 'High', 'Urgent']),
    ...(!T ? [F('status', 'Ticket Status', 'select', ['Open', 'Closed'])] : [])
  ];

  const moveOutBtn = (pid, t) => !T && (
    <Btn c="border border-slate-300 bg-white text-slate-700 hover:bg-slate-100" onClick={() => {
      if (!window.confirm(`Move out ${t.name} and move to archive?`)) return;
      upd('archive', a => [...a, { id: uid(), name: t.name, email: t.email, phone: t.phone, address: pName(pid), moveIn: t.moveIn, moveOut: today() }]);
      upd('props', ps => ps.map(p => (p.id === pid ? { ...p, tenants: (p.tenants || []).filter(x => x.id !== t.id) } : p)));
    }}>Move Out</Btn>
  );
  const emailBtn = (pid, t) => !T && (
    <Btn c="bg-slate-900 text-white" onClick={() => setReminderModal({ prop: db.props.find(x => x.id === pid), tenantId: t.id })}>
      <Send className="w-3 h-3" /> Email Reminder
    </Btn>
  );
  const tenantLine = t => (
    <div>
      <p><strong>{t.name}</strong> ({t.email}) | Phone: {t.phone}</p>
      <p className="text-slate-500">Move-In: {t.moveIn} | Rent Day: {t.rentDay} | Visa: {t.visaStatus} {t.visaExpiry ? `(exp ${t.visaExpiry})` : ''} | Passport: {t.passport || 'N/A'}</p>
    </div>
  );

  /* =================== VIEW RENDERERS =================== */
  const renderTickets = (list, fixedProp) => (
    <CrudList
      title="Maintenance Tickets"
      items={list}
      canDel={L}
      fields={tkFields(!fixedProp)}
      initial={{ propId: fixedProp || ids[0], category: 'Plumbing', priority: 'Medium', status: 'Open' }}
      onAdd={i => addTo('tickets', { status: 'Open', priority: 'Medium', category: 'Plumbing', date: today(), propId: fixedProp || ids[0], ...i })}
      onEdit={i => editIn('tickets', i)}
      onDel={id => delFrom('tickets', id)}
      {...csvP('tickets')}
      csvCols={csvDefs.tickets.cols}
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

  const renderProperty = () => {
    const p = db.props.find(x => x.id === propId);
    if (!p || !ids.includes(p.id)) return <p className="p-4 text-xs text-slate-500">Property unit not found or access restricted.</p>;
    const hotel = isHotel(p);
    const tenants = p.tenants || [];
    const ownEmail = (mine.username || '').trim().toLowerCase();
    const visibleTenants = T ? tenants.filter(t => (t.email || '').trim().toLowerCase() === ownEmail) : tenants;
    const pc = p.code || p.id;
    const propExp = db.expenses.filter(e => e.propId === p.id).sort((a, b) => b.date.localeCompare(a.date));

    return (
      <div className="space-y-5">
        <div className="flex flex-wrap justify-between items-start gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">{pc}</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">{p.type} | {p.councilTax || 'Business Rates'}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">{p.address}</h2>
            <p className="text-xs text-slate-500 mt-1">Furnishing: {p.furnishing} | Garden: {p.garden} | Parking: {p.parking}</p>
            <p className="text-xs text-slate-700 font-medium mt-1">
              {hotel ? 'Short-stay / Airbnb / Booking.com Operation (rent entered manually each month)' : `Rent: ${gbp(p.rent)}/mo | Deposit: ${gbp(p.deposit)} (${p.depositScheme}) | Agreement: ${p.contractParty} (${p.contractType})`}
            </p>
          </div>
          {!T && (
            <div className="flex gap-2">
              <Btn c="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow" onClick={() => setModal({ title: 'Edit Property Details & Name', fields: propFields, initial: p, submit: v => setProp(p.id, { ...v, rent: Number(v.rent), deposit: Number(v.deposit) }) })}>
                <Pencil className="w-3.5 h-3.5" /> Edit Unit Details
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
          <Card title={`Rent Status – ${monthLabel(cm)}`} action={!T && tenants.length > 0 && (
            <div className="flex gap-2">
              {!paid(p) && <Btn c="bg-green-600 hover:bg-green-700 text-white" onClick={() => markPaid(p)}><CheckCircle className="w-3.5 h-3.5" /> Mark Rent Paid</Btn>}
              <Btn c="bg-slate-900 text-white" onClick={() => setReminderModal({ prop: p })}><Send className="w-3.5 h-3.5" /> Send Rent Reminder</Btn>
            </div>
          )}>
            <p className="text-xs">Current month rent: <span className={`px-2 py-0.5 rounded font-bold border ${pill(paid(p) ? 'Paid' : 'Unpaid')}`}>{paid(p) ? 'Paid' : 'Unpaid'}</span> — {gbp(p.rent)} due on day {(tenants[0] || {}).rentDay || 1}</p>
          </Card>
        )}

        {!hotel && (
          <CrudList
            title="Active Tenants (add more than one tenant per property)"
            items={visibleTenants}
            canAdd={!T}
            canDel={!T}
            fields={T ? tenantEditableFields : tenFields}
            initial={tenInit}
            addLabel="Add Another Tenant"
            onAdd={i => setProp(p.id, { tenants: [...tenants, { ...i, id: uid() }] })}
            onEdit={i => setProp(p.id, { tenants: tenants.map(x => (x.id === i.id ? (T ? { ...x, ...i } : i) : x)) })}
            onDel={id => setProp(p.id, { tenants: tenants.filter(x => x.id !== id) })}
            csv={`${pc}_Tenants`}
            csvCols={tenCsv.slice(1).map(c => c)}
            empty="No active tenant currently assigned to this unit."
            line={tenantLine}
            badge={t => <>{emailBtn(p.id, t)}{moveOutBtn(p.id, t)}</>}
          />
        )}

        {hotel && (
          <CrudList
            title="Monthly Airbnb / Booking.com Income (manual entry)"
            {...sub(p, 'income')}
            items={[...(p.income || [])].sort((a, b) => b.month.localeCompare(a.month))}
            canEdit={!T}
            canDel={!T}
            fields={incomeFields(false)}
            initial={{ month: cm, platform: p.contractType && p.contractType.includes('Booking') ? 'Booking.com' : 'Airbnb' }}
            csv={`${pc}_Short_Stay_Income`}
            line={i => <span><strong>{monthLabel(i.month)}:</strong> {gbp(i.amount)} via {i.platform || 'N/A'} {i.notes && `— ${i.notes}`}</span>}
          />
        )}

        <CrudList title="Registered Title, Title Map & Planning Permissions Vault" {...sub(p, 'legalDocs')} canEdit={!T} canDel={!T} canAdd={!T} fields={legalFields} csv={`${pc}_Legal_Title_Planning`}
          line={d => <span><strong>{d.type}:</strong> Ref: {d.ref || 'N/A'} — {d.notes}</span>} />

        <CrudList title="Meter Reading Logs" {...sub(p, 'meters')} canDel={!T} fields={meterFields} initial={{ date: today() }} csv={`${pc}_Meter_Readings`}
          line={m => <span><strong>{m.kind} {m.utility} Reading:</strong> {m.reading} on {m.date}</span>} />

        {!T && (
          <>
            <CrudList title="UK Compliance Certificates (5-Yr History)" {...sub(p, 'certs')} fields={certFields} csv={`${pc}_Compliance`}
              line={c => <span><strong>{c.type}</strong> (Ref: {c.ref}) — Expiry Date: {c.expiry || 'N/A'}</span>}
              badge={c => <span className={`px-2 py-0.5 rounded font-bold border ${pill(status(c.expiry))}`}>{status(c.expiry)}</span>} />

            <CrudList title="5-Year Insurance Policy Register" {...sub(p, 'insurance')} fields={insuranceFields} csv={`${pc}_Insurance`}
              line={i => <span><strong>{i.provider}</strong> (Policy: {i.policy}) — Premium: {gbp(i.premium)} | Period: {i.start} to {i.expiry}</span>}
              badge={i => <span className={`px-2 py-0.5 rounded font-bold border ${pill(status(i.expiry))}`}>{status(i.expiry)}</span>} />

            <CrudList title="Mortgage Lender Register (3-Month Expiry Reminder)" {...sub(p, 'mortgage')} fields={mortgageFields} csv={`${pc}_Mortgages`}
              line={m => <span><strong>{m.lender}</strong> (Account: {m.account}) — Monthly: {gbp(m.monthly)} | Rate: {m.rate} | Fixed Term Ends: {m.endDate}</span>}
              badge={m => <span className={`px-2 py-0.5 rounded font-bold border ${pill(mortgageStatus(m.endDate))}`}>{mortgageStatus(m.endDate)}</span>} />

            <CrudList title="Utility Suppliers & Service Accounts (Gas, Elec, Council Tax)" {...sub(p, 'suppliers')} fields={utilFields} csv={`${pc}_Utility_Suppliers`}
              line={s => <span><strong>{s.kind}:</strong> {s.name} (Account: {s.account}) | Phone: {s.phone}</span>} />

            <CrudList
              title="Property Expense Records (keep 5+ years)"
              items={propExp}
              fields={expenseFields(false)}
              initial={expInit(p.id)}
              onAdd={i => addTo('expenses', { ...i, propId: p.id, amount: Number(i.amount) })}
              onEdit={i => editIn('expenses', { ...i, amount: Number(i.amount) })}
              onDel={id => delFrom('expenses', id)}
              csv={`${pc}_Expenses`}
              line={e => <span><strong>{e.date}:</strong> {e.category} — <strong>{gbp(e.amount)}</strong> paid to {e.supplier} {e.notes && `(${e.notes})`}</span>}
            />
          </>
        )}

        {renderTickets(db.tickets.filter(x => x.propId === p.id), p.id)}
      </div>
    );
  };

  const renderDash = () => {
    const list = props.filter(p =>
      (typeF === 'All' || p.type === typeF) &&
      ((p.code || p.id) + p.address + (p.tenants || []).map(t => t.name).join(' ')).toLowerCase().includes(search.toLowerCase())
    );

    const stat = (l, v, s, go, c) => (
      <a href={`#${go}`} onClick={e => { e.preventDefault(); setView(go); }} className="bg-white border border-slate-200 rounded-xl p-4 block hover:border-amber-400 transition-all shadow-sm">
        <p className="text-xs font-bold text-slate-500 uppercase">{l}</p>
        <p className={`text-2xl font-extrabold mt-1 ${c}`}>{v}</p>
        <p className="text-[11px] text-slate-400 mt-1">{s}</p>
      </a>
    );

    return (
      <div className="space-y-6">
        {!T && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stat('Total Monthly Earnings', gbp(rentIn + hotelIn), `Rents ${gbp(rentIn)} + Short-stay ${gbp(hotelIn)}`, 'rent', 'text-green-700')}
              {stat('Monthly Expenses', gbp(expThisMonth), 'Click to view itemized records', 'expenses', 'text-red-700')}
              {stat('Net Earnings This Month', gbp(rentIn + hotelIn - expThisMonth), 'Total income minus expenses', 'expenses', 'text-slate-900')}
              {stat('Rent Overdue Alerts', overdueList.length, 'Click to issue email reminders', 'rent', 'text-red-600')}
              {stat('Certificates Due', certAlerts.length, 'CP12, EICR & EPC expiring/expired', 'certs', 'text-amber-600')}
              {stat('Insurance Renewals', insAlerts.length, 'Policies due within 60 days', 'insurance', 'text-blue-600')}
              {stat('Mortgage Rate Reminders', mortgageAlerts.length, 'Rate deals expiring in 3 months', 'mortgage', 'text-amber-600')}
              {stat('Open Maintenance Tickets', openTk.length, 'Active tenant complaints', 'tickets', 'text-orange-600')}
              {stat('Active Tenants', allTenants.length, 'Across all units (multi-tenant)', 'tenants', 'text-slate-900')}
              {stat('Short-Stay Income', gbp(hotelIn), `Airbnb / Booking.com – ${monthLabel(cm)}`, 'shortstay', 'text-blue-700')}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <input placeholder="Search code, address or tenant..." value={search} onChange={e => setSearch(e.target.value)} className="border border-slate-300 rounded-lg p-2 text-xs w-full sm:w-64 bg-slate-50 focus:bg-white text-slate-800" />
                <select value={typeF} onChange={e => setTypeF(e.target.value)} className="border border-slate-300 rounded-lg p-2 text-xs bg-slate-50 w-full sm:w-auto">
                  <option value="All">All Categories</option>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex flex-wrap gap-2">
                <Btn c="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => downloadCSV(csvDefs.portfolio.name, csvDefs.portfolio.cols.map(c => c[0]), csvDefs.portfolio.items.map(it => csvDefs.portfolio.cols.map(c => c[1](it))))}>
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Portfolio CSV
                </Btn>
                <Btn c="bg-emerald-800 hover:bg-emerald-900 text-white" onClick={exportAll}>
                  <Download className="w-3.5 h-3.5" /> Export All Reports (CSV)
                </Btn>
                <Btn c="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow" onClick={() => setModal({ title: 'Add New Property Unit', fields: propFields, initial: { code: 'P' + (db.props.length + 1), type: 'Flat', rent: 1200, deposit: 1200, depositScheme: 'DPS', contractType: 'AST', councilTax: 'Band B', furnishing: 'Unfurnished', garden: 'No', parking: 'None' }, submit: addProp })}>
                  <Plus className="w-4 h-4" /> Add Property Unit
                </Btn>
              </div>
            </div>
          </>
        )}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map(p => {
            const hotel = isHotel(p);
            const monthInc = (p.income || []).find(i => i.month === cm);
            const tn = p.tenants || [];
            return (
              <a key={p.id} href={`#property-${p.id}`} onClick={e => { e.preventDefault(); openProp(p.id); }} className="bg-white border border-slate-200 rounded-xl p-5 block hover:border-amber-400 transition-all shadow-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded">{p.code || p.id}</span>
                  {hotel ? (
                    <span className={`text-[11px] px-2.5 py-0.5 rounded font-bold border ${monthInc ? pill('Paid') : pill('Expiring Soon')}`}>{monthInc ? 'Income Logged' : 'Income Pending'}</span>
                  ) : (
                    <span className={`text-[11px] px-2.5 py-0.5 rounded font-bold border ${tn.length ? (paid(p) ? pill('Paid') : pill('Unpaid')) : 'bg-slate-100 text-slate-500'}`}>{tn.length ? (paid(p) ? 'Rent Paid' : 'Rent Unpaid') : 'Vacant'}</span>
                  )}
                </div>
                <h3 className="font-bold text-base text-slate-900 line-clamp-1">{p.address}</h3>
                <p className="text-xs text-slate-600">{hotel ? p.type : `${p.type} · Monthly Rent: ${gbp(p.rent)}`}</p>
                {hotel ? (
                  <p className="text-xs text-blue-700 border-t border-slate-100 pt-2 mt-2 font-semibold">{monthInc ? `${monthLabel(cm)} Earnings: ${gbp(monthInc.amount)}` : '⚠️ Click to log current month income'}</p>
                ) : tn.length ? (
                  <p className="text-xs text-slate-500 border-t border-slate-100 pt-2 mt-2">Active Tenant{tn.length > 1 ? `s (${tn.length})` : ''}: <strong>{tn.map(t => t.name).join(', ')}</strong></p>
                ) : (
                  <p className="text-xs text-slate-400 italic border-t border-slate-100 pt-2 mt-2">Currently Vacant</p>
                )}
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  const renderRent = () => (
    <div className="space-y-5">
      <Card title={`Rent Overdue – ${monthLabel(cm)} (${overdueList.length})`}>
        {overdueList.length === 0 && <p className="text-xs text-slate-400 italic">No rent accounts overdue.</p>}
        <div className="space-y-2">
          {overdueList.map(p => (
            <div key={p.id} className="flex flex-wrap justify-between items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-xs">
              <div>
                <p className="font-bold text-slate-900">{p.code || p.id} — {p.address}</p>
                <p className="text-slate-600">Tenants: {(p.tenants || []).map(t => t.name).join(', ')} | Rent: <strong>{gbp(p.rent)}</strong> | Due day: {(p.tenants[0] || {}).rentDay || 1}</p>
              </div>
              <div className="flex gap-2">
                <Btn c="bg-slate-900 text-white" onClick={() => setReminderModal({ prop: p })}><Send className="w-3 h-3" /> Send Email Reminder</Btn>
                <Btn c="bg-green-600 hover:bg-green-700 text-white" onClick={() => markPaid(p)}><CheckCircle className="w-3 h-3" /> Mark Paid</Btn>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <CrudList
        title="Recorded Rent Payments History"
        items={scopedPayments}
        canEdit={!T}
        canDel={L}
        fields={[F('propId', 'Select Property Unit', 'select', rentOpts), F('month', 'Rent Month', 'month'), F('amount', 'Amount Received (£)', 'number'), F('date', 'Date Received', 'date')]}
        initial={{ month: cm, date: today() }}
        onAdd={i => addTo('payments', { ...i, amount: Number(i.amount) })}
        onEdit={i => editIn('payments', { ...i, amount: Number(i.amount) })}
        onDel={id => delFrom('payments', id)}
        {...csvP('rent')}
        line={p => <span><strong>{pName(p.propId)}:</strong> Received payment of <strong>{gbp(p.amount)}</strong> on {p.date} (Month: {p.month})</span>}
      />
    </div>
  );

  const renderShortStay = () => (
    <CrudList
      title="Airbnb / Booking.com Income (manual monthly entry – 5 year record)"
      items={allIncome}
      canEdit={!T}
      canDel={!T}
      fields={incomeFields(true)}
      initial={{ month: cm, platform: 'Airbnb' }}
      {...agg('income')}
      onAdd={v => aggAdd('income')({ ...v, amount: Number(v.amount) })}
      {...csvP('income')}
      line={i => <span><strong>{pName(i.propId)}:</strong> {monthLabel(i.month)} — <strong>{gbp(i.amount)}</strong> via {i.platform || 'N/A'} {i.notes && `(${i.notes})`}</span>}
    />
  );

  const renderExpenses = () => {
    let shown = scopedExpenses;
    if (expMonth) shown = shown.filter(e => e.date.slice(0, 7) === expMonth);
    if (expProp !== 'All') shown = shown.filter(e => e.propId === expProp);
    const total = shown.reduce((s, e) => s + Number(e.amount), 0);

    const base = expProp === 'All' ? scopedExpenses : scopedExpenses.filter(e => e.propId === expProp);
    const years = [0, 1, 2, 3, 4].map(n => curYear - n);
    const cell = (y, m) => base.filter(e => e.date.startsWith(`${y}-${pad(m + 1)}`)).reduce((s, e) => s + Number(e.amount), 0);

    const summaryCsv = () => downloadCSV('Expense_Summary_5yr', ['Year', ...MONTH_SHORT, 'Total (£)'], years.map(y => [y, ...MONTH_SHORT.map((_, m) => cell(y, m)), MONTH_SHORT.reduce((s, _, m) => s + cell(y, m), 0)]));

    return (
      <div className="space-y-5">
        <Card title="Expense Filters & 5-Year Monthly Summary" action={<Btn c="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={summaryCsv}><FileSpreadsheet className="w-3.5 h-3.5" /> Summary CSV</Btn>}>
          <div className="flex flex-wrap gap-3 items-end text-xs">
            <label className="space-y-1 block">
              <span className="font-semibold text-slate-700">Month</span>
              <input type="month" value={expMonth} onChange={e => setExpMonth(e.target.value)} className="border rounded-lg p-2 border-slate-300 block" />
            </label>
            <label className="space-y-1 block">
              <span className="font-semibold text-slate-700">Property</span>
              <select value={expProp} onChange={e => setExpProp(e.target.value)} className="border rounded-lg p-2 border-slate-300 bg-white block">
                <option value="All">All Properties</option>
                {propOpts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </label>
            <Btn c="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50" onClick={() => { setExpMonth(''); setExpProp('All'); }}>Clear Filters</Btn>
            <p className="ml-auto text-sm font-bold text-red-700">Showing total: {gbp(total)}</p>
          </div>
          <p className="text-[11px] text-slate-500">Records are never auto-deleted. Keep at least 5 years of expense history. Click any month total to filter.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="p-1.5 text-left border">Year</th>
                  {MONTH_SHORT.map(m => <th key={m} className="p-1.5 border">{m}</th>)}
                  <th className="p-1.5 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {years.map(y => (
                  <tr key={y}>
                    <td className="p-1.5 border font-bold">{y}</td>
                    {MONTH_SHORT.map((_, m) => {
                      const v = cell(y, m);
                      return (
                        <td key={m} className="p-1.5 border text-right">
                          {v ? <button onClick={() => setExpMonth(`${y}-${pad(m + 1)}`)} className="text-blue-700 hover:underline">{gbp(v)}</button> : <span className="text-slate-300">–</span>}
                        </td>
                      );
                    })}
                    <td className="p-1.5 border text-right font-bold">{gbp(MONTH_SHORT.reduce((s, _, m) => s + cell(y, m), 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <CrudList
          title={expMonth ? `Expenses – ${monthLabel(expMonth)}` : 'Itemized Property Expenses'}
          items={shown}
          canDel={!T}
          fields={expenseFields(true)}
          initial={{ ...expInit(expProp !== 'All' ? expProp : ids[0]), ...(expMonth ? { date: `${expMonth}-01` } : {}) }}
          onAdd={i => addTo('expenses', { ...i, amount: Number(i.amount) })}
          onEdit={i => editIn('expenses', { ...i, amount: Number(i.amount) })}
          onDel={id => delFrom('expenses', id)}
          csv={expMonth ? `Expenses_${expMonth}` : 'Property_Expenses_5yr'}
          csvCols={csvDefs.expenses.cols}
          line={e => <span><strong>{pName(e.propId)}:</strong> {e.date} | {e.category} — <strong>{gbp(e.amount)}</strong> paid to {e.supplier} {e.notes && `(${e.notes})`}</span>}
        />
      </div>
    );
  };

  const renderUsers = () => (
    <CrudList
      title="Portal Users, Roles & Property Unit Assignments"
      items={db.users}
      canDel={L}
      fields={[F('username', 'Email Address / Login ID', 'email'), F('password', 'Password'), F('phone', 'Mobile Phone Number'), F('role', 'Role', 'select', ['landlord', 'agent', 'tenant'])]}
      onAdd={u => addTo('users', { ...u, name: u.username, props: [], avatar: '' })}
      onEdit={u => editIn('users', u)}
      onDel={id => delFrom('users', id)}
      {...csvP('users')}
      line={u => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-amber-400 overflow-hidden bg-slate-200 shrink-0 flex items-center justify-center">
            {u.avatar ? <img src={u.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <span className="font-bold text-slate-600 text-[10px]">{u.username.slice(0, 2).toUpperCase()}</span>}
          </div>
          <span><strong>{u.username}</strong> — Phone: {u.phone || 'N/A'} | Role: <strong className="uppercase">{u.role}</strong></span>
        </div>
      )}
      badge={u => (u.role === 'agent' || u.role === 'tenant') && (
        <Btn c="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold" onClick={() => setAssign(u)}>
          <UserCheck className="w-3.5 h-3.5" /> Assign Units ({u.props?.length || 0})
        </Btn>
      )}
    />
  );

  const renderAssign = () => {
    const live = db.users.find(u => u.id === assign.id) || assign;
    const currentProps = live.props || [];
    return (
      <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4 text-xs shadow-2xl">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-bold text-sm text-slate-900">Assign Property Units to {live.username}</h3>
            <button onClick={() => setAssign(null)}><X className="w-4 h-4 text-slate-400" /></button>
          </div>
          <p className="text-slate-600">Select property units assigned to this account:</p>
          <div className="space-y-2 max-h-60 overflow-y-auto border p-2 rounded-lg bg-slate-50">
            {db.props.map(p => {
              const has = currentProps.includes(p.id);
              return (
                <label key={p.id} className="flex items-center gap-2 p-2 border rounded-lg bg-white cursor-pointer hover:bg-slate-100">
                  <input type="checkbox" checked={has} onChange={() => editIn('users', { ...live, props: has ? currentProps.filter(x => x !== p.id) : [...currentProps, p.id] })} />
                  <span className="font-medium text-slate-800">{p.code || p.id} ({p.address})</span>
                </label>
              );
            })}
          </div>
          <div className="flex justify-end"><Btn onClick={() => setAssign(null)}>Done</Btn></div>
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    const s = db.settings;
    const row = (k, l) => (
      <label className="block space-y-1" key={k}>
        <span className="font-semibold text-slate-700">{l}</span>
        <input value={s[k] || ''} onChange={e => upd('settings', x => ({ ...x, [k]: e.target.value }))} className="w-full border rounded-lg p-2 bg-white text-slate-800" />
      </label>
    );
    return (
      <Card title="Contact Information & Business Settings (used in email reminders)">
        <div className="space-y-3 text-xs">
          {row('phone', 'Office Telephone Number')}
          {row('email', 'Business Support Email')}
          {row('hours', 'Working Hours')}
          {row('gas', '24/7 Emergency Gas Leak Line')}
          {row('power', '24/7 Emergency Power Outage Line')}
          {row('address', 'Business Address')}
          <p className="text-green-700 font-semibold mt-2">✓ All settings update automatically across the portal and reminder emails.</p>
        </div>
      </Card>
    );
  };

  /* =================== MAIN LAYOUT =================== */
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-16 flex flex-col justify-between">
      <div>
        <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
            <div className="flex items-center gap-2 sm:gap-3">
              <FalconLogo className="h-12 sm:h-14 w-auto shrink-0" onClick={e => { e.preventDefault(); setView('dash'); }} />
              <a href="#dash" onClick={e => { e.preventDefault(); setView('dash'); }} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition-colors text-xs">
                <Home className="w-3.5 h-3.5" /><span className="hidden sm:inline">Home</span>
              </a>

              <div className="relative" ref={menuRef}>
                <button onClick={() => setMenu(!menu)} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 sm:px-4 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition-colors border border-emerald-600 text-xs">
                  <span className="hidden md:inline">Navigation & Modules</span><span className="md:hidden">Menu</span><ChevronDown className="w-4 h-4" />
                </button>
                {menu && (
                  <div className="absolute top-full left-0 mt-1 bg-emerald-950 text-white border border-emerald-700 rounded-xl shadow-2xl w-64 sm:w-72 z-50 py-2 text-xs">
                    {nav.map(([k, l]) => (
                      <a key={k} href={`#${k}`} onClick={e => { e.preventDefault(); setView(k); setMenu(false); }} className="block text-left px-4 py-2.5 hover:bg-emerald-800 font-bold text-slate-100 hover:text-amber-400 transition-colors border-b border-emerald-900/50 last:border-0">{l}</a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="hidden lg:block text-center flex-1 px-4">
              <a href="#dash" onClick={e => { e.preventDefault(); setView('dash'); }} className="text-base font-extrabold tracking-wider text-amber-400 uppercase leading-tight hover:underline inline-block">FALCON PROPERTIES</a>
              <p className="text-[10px] text-slate-300 font-medium tracking-widest uppercase">Building A Better Tomorrow</p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <a href="#tickets" onClick={e => { e.preventDefault(); setView('tickets'); }} className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors" title="Maintenance Tickets">
                <Bell className="w-4 h-4 text-amber-400" />
                {openTk.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-extrabold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">{openTk.length}</span>}
              </a>

              {!T && (
                <div className="relative" ref={remRef}>
                  <button onClick={() => setReminderDropdown(!reminderDropdown)} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition-colors" title="Rent Reminders">
                    <Send className="w-3.5 h-3.5" /><span className="hidden sm:inline">Reminders</span>
                    {overdueList.length > 0 && <span className="bg-slate-950 text-amber-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">{overdueList.length}</span>}
                  </button>
                  {reminderDropdown && (
                    <div className="absolute right-0 mt-1 bg-slate-900 text-white border border-slate-700 rounded-xl shadow-2xl w-72 z-50 p-2 space-y-1 text-xs">
                      <p className="font-bold text-amber-400 border-b border-slate-800 pb-1.5 px-2">Issue Rent Reminder Email</p>
                      {overdueList.length === 0 ? (
                        <p className="p-2 text-slate-400 italic">No rent accounts overdue.</p>
                      ) : (
                        overdueList.map(p => (
                          <button key={p.id} onClick={() => { setReminderModal({ prop: p }); setReminderDropdown(false); }} className="w-full text-left p-2 hover:bg-slate-800 rounded-lg flex justify-between items-center transition-colors">
                            <div>
                              <p className="font-bold text-slate-200">{p.code || p.id}</p>
                              <p className="text-[10px] text-slate-400">{(p.tenants || []).map(t => t.name).join(', ')}</p>
                            </div>
                            <span className="text-amber-400 font-bold">{gbp(p.rent)}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              <button onClick={() => setAvatarModalUser(mine)} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2 py-1 rounded-lg text-white transition-colors" title="Click to Upload/Crop Profile Picture">
                <div className="w-6 h-6 rounded-full border border-amber-400 overflow-hidden bg-slate-950 flex items-center justify-center shrink-0">
                  {mine.avatar ? <img src={mine.avatar} alt="User Avatar" className="w-full h-full object-cover" /> : <span className="font-bold text-amber-400 text-[9px]">{mine.username.slice(0, 2).toUpperCase()}</span>}
                </div>
                <span className="font-bold text-amber-400 uppercase text-[10px] hidden sm:inline">{role}</span>
              </button>

              <button onClick={() => setMe(null)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold transition-colors border border-slate-700">
                <LogOut className="w-3.5 h-3.5" /><span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 mt-6">
          {view !== 'dash' && (
            <a href="#dash" onClick={e => { e.preventDefault(); setView('dash'); }} className="mb-4 inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 shadow-sm">
              <ArrowLeft className="w-4 h-4" /> Return to Main Dashboard
            </a>
          )}

          {view === 'dash' && renderDash()}
          {view === 'prop' && renderProperty()}
          {view === 'rent' && renderRent()}
          {view === 'shortstay' && renderShortStay()}
          {view === 'expenses' && renderExpenses()}

          {view === 'tenants' && (
            <CrudList
              title="All Active Tenants Register"
              items={allTenants}
              canEdit={!T}
              canDel={!T}
              fields={[F('propId', 'Select Property Unit', 'select', rentOpts), ...tenFields]}
              initial={tenInit}
              addLabel="Add New Tenant"
              {...agg('tenants')}
              {...csvP('tenants')}
              line={t => <div><p className="text-[11px] text-amber-700 font-bold">{pName(t.propId)}</p>{tenantLine(t)}</div>}
              badge={t => <>{emailBtn(t.propId, t)}{moveOutBtn(t.propId, t)}</>}
            />
          )}

          {view === 'certs' && (
            <CrudList
              title="UK Certificates & Legal Compliance Vault (5-Yr History)"
              items={[...allCerts].sort((a, b) => (b.expiry || '').localeCompare(a.expiry || ''))}
              canDel={!T}
              fields={[F('propId', 'Select Property Unit', 'select', propOpts), ...certFields]}
              initial={{ type: CERTS[0] }}
              {...agg('certs')}
              {...csvP('certs')}
              line={c => <span><strong>{c.type}</strong> (Ref: {c.ref}) — {pName(c.propId)} | Expiry: {c.expiry || 'N/A'}</span>}
              badge={c => <span className={`px-2 py-0.5 rounded font-bold border ${pill(status(c.expiry))}`}>{status(c.expiry)}</span>}
            />
          )}

          {view === 'insurance' && (
            <CrudList
              title="Insurance Policies Register & 5-Year Renewal History"
              items={[...allInsurance].sort((a, b) => b.expiry.localeCompare(a.expiry))}
              canDel={!T}
              fields={[F('propId', 'Select Property Unit', 'select', propOpts), ...insuranceFields]}
              initial={{ start: today(), expiry: today() }}
              {...agg('insurance')}
              {...csvP('insurance')}
              line={i => <span><strong>{i.provider}</strong> (Policy: {i.policy}) — {i.propAddress} | Premium: {gbp(i.premium)} | Period: {i.start} to {i.expiry}</span>}
              badge={i => (
                <>
                  <span className={`px-2 py-0.5 rounded font-bold border ${pill(status(i.expiry))}`}>{status(i.expiry)}</span>
                  <Btn c="border border-slate-300 bg-white text-slate-700 hover:bg-slate-100" onClick={() => openProp(i.propId)}>View Unit</Btn>
                </>
              )}
            />
          )}

          {view === 'mortgage' && (
            <CrudList
              title="Mortgage Lender Register & 3-Month Expiry Reminders"
              items={allMortgages}
              canDel={!T}
              fields={[F('propId', 'Select Property Unit', 'select', propOpts), ...mortgageFields]}
              initial={{ endDate: today() }}
              {...agg('mortgage')}
              onAdd={v => aggAdd('mortgage')({ ...v, monthly: Number(v.monthly) })}
              {...csvP('mortgage')}
              line={m => (
                <div>
                  <p><strong>{m.lender}</strong> (Account: {m.account}) — {m.propAddress}</p>
                  <p className="text-slate-500">Monthly: {gbp(m.monthly)} | Rate: {m.rate} | Deal Ends: <strong>{m.endDate}</strong> {m.notes && `| ${m.notes}`}</p>
                </div>
              )}
              badge={m => (
                <>
                  <span className={`px-2 py-0.5 rounded font-bold border ${pill(mortgageStatus(m.endDate))}`}>{mortgageStatus(m.endDate)}</span>
                  <Btn c="border border-slate-300 bg-white text-slate-700 hover:bg-slate-100" onClick={() => openProp(m.propId)}>View Unit</Btn>
                </>
              )}
            />
          )}

          {view === 'tickets' && renderTickets(scopedTickets)}

          {view === 'suppliers' && (
            <CrudList
              title="Suppliers, Builders & Trades Directory"
              items={db.contractors}
              canDel={!T}
              fields={[F('name', 'Name'), F('trade', 'Trade / Specialty'), F('company', 'Company'), F('phone', 'Phone Number'), F('email', 'Email Address'), F('notes', 'Notes')]}
              onAdd={c => addTo('contractors', c)}
              onEdit={c => editIn('contractors', c)}
              onDel={id => delFrom('contractors', id)}
              {...csvP('contractors')}
              line={c => <span><strong>{c.name}</strong> ({c.trade}) — {c.company} | Phone: {c.phone} | {c.email}</span>}
            />
          )}

          {view === 'archive' && (
            <CrudList
              title="Archived Tenants History"
              items={db.archive}
              canDel={!T}
              fields={[F('name', 'Tenant Name'), F('email', 'Email', 'email'), F('phone', 'Phone'), F('address', 'Property Address'), F('moveIn', 'Moved In', 'date'), F('moveOut', 'Moved Out', 'date')]}
              onAdd={a => addTo('archive', a)}
              onEdit={a => editIn('archive', a)}
              onDel={id => delFrom('archive', id)}
              {...csvP('archive')}
              line={a => <span><strong>{a.name}</strong> — {a.address} | Moved In: {a.moveIn} | Left: {a.moveOut}</span>}
            />
          )}

          {view === 'users' && L && renderUsers()}
          {view === 'settings' && L && renderSettings()}
        </main>
      </div>

      {modal && <FormModal title={modal.title} fields={modal.fields} initial={modal.initial} onClose={() => setModal(null)} onSubmit={v => { modal.submit(v); setModal(null); }} />}
      {assign && renderAssign()}
      {reminderModal && reminderModal.prop && <EmailReminderModal key={reminderModal.prop.id + (reminderModal.tenantId || '')} prop={reminderModal.prop} tenantId={reminderModal.tenantId} settings={db.settings} onClose={() => setReminderModal(null)} />}
      {avatarModalUser && <AvatarModal user={avatarModalUser} onSave={saveAvatar} onClose={() => setAvatarModalUser(null)} />}

      <footer className="mt-12 bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="font-bold text-white text-sm">Falcon Properties Management</p>
            <p>Office Phone: {db.settings.phone} | Operating Hours: {db.settings.hours}</p>
            <p>Support Email: {db.settings.email}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-red-400 font-bold">24/7 Gas Leak Emergency: {db.settings.gas}</p>
            <p className="text-red-400 font-bold">24/7 Power Outage Line: {db.settings.power}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}