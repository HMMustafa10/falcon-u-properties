import React, { useState, useEffect, useRef } from 'react';
import { Building2, Plus, Pencil, Trash2, X, LogOut, ChevronDown, Download, Send, ArrowLeft } from 'lucide-react';

/* ---------- helpers ---------- */
const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().slice(0, 10);
const ym = (d = new Date()) => d.toISOString().slice(0, 7);
const gbp = n => '£' + Number(n || 0).toLocaleString('en-GB');
const days = d => Math.ceil((new Date(d) - new Date()) / 864e5);
const status = d => { const n = days(d); return n < 0 ? 'Expired' : n <= 60 ? 'Expiring Soon' : 'Valid'; };
const F = (k, l, t = 'text', o) => ({ k, l, t, o });
const TYPES = ['Flat', 'House', 'HMO', 'Commercial', 'Hotel / Airbnb / Booking.com'];
const CERTS = ['Gas Safety (CP12)', 'EICR', 'EPC', 'Selective Licence', 'HMO Licence', 'Fire Risk Assessment', 'PAT Test', 'Legionella', 'Smoke & CO Alarms', 'DPS Deposit Certificate', 'Other'];
const EXP_CATS = ['Repairs', 'Maintenance', 'Insurance', 'Mortgage', 'Utilities', 'Council Tax', 'Agent Fees', 'Cleaning', 'Legal', 'Licence/Compliance', 'Furnishing', 'Other'];
const pill = s => ({ Valid: 'bg-green-100 text-green-800', Paid: 'bg-green-100 text-green-800', Closed: 'bg-green-100 text-green-800', 'Expiring Soon': 'bg-amber-100 text-amber-800', Expired: 'bg-red-100 text-red-800', Unpaid: 'bg-red-100 text-red-800', Open: 'bg-red-100 text-red-800' }[s] || 'bg-slate-100 text-slate-700');

/* ---------- seed data ---------- */
const mkProp = (id, address, type, rent, extra = {}) => ({
  id, address, type, rent, deposit: rent, depositScheme: 'DPS', contractParty: '', contractType: 'AST', councilTax: 'Band C', furnishing: 'Furnished', garden: 'No', parking: 'None',
  certs: [], insurance: [], mortgage: [], suppliers: [], meters: [], docs: [], income: [], tenant: null, ...extra
});
const seed = () => ({
  props: [
    mkProp('P1', '12 Falcon Way, London E1 6AN', 'Flat', 1450, {
      contractParty: 'Falcon U Properties Ltd & Muhammad Mustafa', depositScheme: 'DPS', garden: 'Private', parking: '1 Space',
      certs: [{ id: 'c1', type: 'Gas Safety (CP12)', ref: 'GAS-88219', expiry: '2026-11-15' }, { id: 'c2', type: 'EICR', ref: 'EICR-99120', expiry: '2027-03-20' }, { id: 'c3', type: 'EPC', ref: 'EPC-11204', expiry: '2028-06-10' }],
      insurance: [{ id: 'i1', provider: 'Aviva Landlord Policy', policy: 'AV-992011', premium: 450, start: '2025-12-02', expiry: '2026-12-01' }],
      mortgage: [{ id: 'm1', lender: 'Nationwide BS', account: 'MT-4411', monthly: 720, rate: '4.1%', endDate: '2028-04-01', notes: '' }],
      suppliers: [{ id: 's1', kind: 'Gas', name: 'British Gas', account: '', phone: '', notes: '' }, { id: 's2', kind: 'Electricity', name: 'Octopus Energy', account: '', phone: '', notes: '' }, { id: 's3', kind: 'Water', name: 'Thames Water', account: '', phone: '', notes: '' }],
      meters: [{ id: 'r1', utility: 'Electricity', kind: 'Opening', reading: '14230 kWh', date: '2024-01-15' }],
      docs: [{ id: 'd1', name: 'Tenancy_Agreement_AST.pdf', category: 'Agreement' }],
      tenant: { name: 'Muhammad Mustafa', email: 'mustafa@example.com', phone: '+44 7700 900077', passport: 'GB123456789', origin: 'United Kingdom', job: 'Engineer (Full-Time)', moveIn: '2024-01-15', rentDay: 1, visaStatus: 'UK Citizen', visaCategory: '', shareCode: '', visaExpiry: '', proof: '', notes: 'Discuss rent review in Q4.', family: [{ id: 'f1', name: 'Fatima Mustafa', relation: 'Spouse', visaStatus: 'Skilled Worker Dependant', visaExpiry: '2026-11-10', shareCode: 'DEF456GHI' }] }
    }),
    mkProp('P2', '88 Commercial Road, London E1 1RD', 'Commercial', 3200, {
      deposit: 6400, depositScheme: 'MyDeposits', contractParty: 'Falcon U Properties Ltd & Falcon Express Ltd', contractType: 'FRI Lease', councilTax: 'Business Rates', furnishing: 'Unfurnished',
      certs: [{ id: 'c5', type: 'Gas Safety (CP12)', ref: 'CGAS-9912', expiry: '2027-01-10' }],
      insurance: [{ id: 'i2', provider: 'AXA Commercial', policy: 'AX-77210', premium: 1250, start: '2026-05-16', expiry: '2027-05-15' }],
      tenant: { name: 'John Miller (Director)', email: 'john@falconexpress.co.uk', phone: '+44 20 7946 0912', passport: 'US987654321', origin: 'United States', job: 'Company Director', moveIn: '2022-01-01', rentDay: 1, visaStatus: 'Tier 1 Investor', visaCategory: 'Investor', shareCode: 'COMM-9912', visaExpiry: '2099-12-31', proof: '', notes: '10-year lease.', family: [] }
    }),
    mkProp('P3', 'Flat 3, 29 Selborne Road, Ilford IG1 3AH', 'Hotel / Airbnb / Booking.com', 0, { furnishing: 'Fully Furnished', income: [{ id: 'h1', month: ym(), amount: 1850, notes: 'Airbnb + Booking.com' }] }),
    mkProp('P4', 'Flat 4, 29 Selborne Road, Ilford IG1 3AH', 'Hotel / Airbnb / Booking.com', 0, { furnishing: 'Fully Furnished', income: [{ id: 'h2', month: ym(), amount: 1600, notes: 'Airbnb + Booking.com' }] })
  ],
  users: [
    { id: 'u1', name: 'Landlord Admin', username: 'landlord', password: 'landlord123', role: 'landlord', props: [] },
    { id: 'u2', name: 'Agent One', username: 'agent1', password: 'agent123', role: 'agent', props: ['P1', 'P3'] },
    { id: 'u3', name: 'Muhammad Mustafa', username: 'tenant1', password: 'tenant123', role: 'tenant', props: ['P1'] }
  ],
  contractors: [
    { id: 'k1', name: 'John’s Gas & Heating', trade: 'Gas Engineer', company: 'Apex Heating Ltd', phone: '+44 7911 123456', email: 'gas@apexheating.co.uk', notes: 'Gas Safe #55412' },
    { id: 'k2', name: 'Bright Spark Electric', trade: 'Electrician', company: 'Current Solutions Ltd', phone: '+44 7911 654321', email: 'info@brightspark.co.uk', notes: 'NICEIC' }
  ],
  archive: [{ id: 'a1', address: '12 Falcon Way, London E1 6AN', name: 'David Smith', moveIn: '2021-01-01', moveOut: '2023-12-31', reason: 'End of AST' }],
  tickets: [{ id: 't1', propId: 'P1', category: 'Plumbing', desc: 'Kitchen sink dripping.', priority: 'Medium', status: 'Open', date: today() }],
  expenses: [{ id: 'e1', propId: 'P1', date: today(), category: 'Repairs', amount: 120, supplier: 'FlowRight Plumbing', notes: 'Tap washer' }],
  payments: [],
  settings: { phone: '02071835494', email: 'info@falconuproperties.co.uk', hours: 'Mon–Fri 9:30 AM – 5:00 PM', gas: '0800 111999', power: '105', address: '' }
});

/* ---------- generic UI ---------- */
const Btn = ({ c = 'bg-slate-900 text-white', ...p }) => <button {...p} className={`${c} px-3 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1 ${p.className || ''}`} />;
const Card = ({ title, action, children }) => (
  <section className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
    {(title || action) && <div className="flex justify-between items-center border-b pb-2"><h3 className="font-semibold text-slate-900 text-sm">{title}</h3>{action}</div>}
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
      <form onSubmit={e => { e.preventDefault(); onSubmit(v); }} className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 space-y-3 text-xs">
        <div className="flex justify-between items-center"><h3 className="font-bold text-sm">{title}</h3><button type="button" onClick={onClose}><X className="w-4 h-4" /></button></div>
        {fields.map(f => (
          <label key={f.k} className="block"><span className="font-semibold text-slate-700">{f.l}</span>
            {f.t === 'select' ? <select value={v[f.k] ?? ''} onChange={e => set(f.k, e.target.value)} className="w-full border rounded p-2 mt-1 bg-white">{f.o.map(o => <option key={o}>{o}</option>)}</select>
              : f.t === 'textarea' ? <textarea rows={3} value={v[f.k] ?? ''} onChange={e => set(f.k, e.target.value)} className="w-full border rounded p-2 mt-1" />
              : f.t === 'file' ? <div><input type="file" onChange={e => file(f.k, e.target.files[0])} className="w-full mt-1" />{v[f.k] && <span className="text-slate-500">Attached: {v[f.k]}{!v[f.k + 'Data'] && ' (name only – file over 400KB not stored in browser)'}</span>}</div>
              : <input type={f.t} step={f.t === 'number' ? '0.01' : undefined} value={v[f.k] ?? ''} onChange={e => set(f.k, e.target.value)} className="w-full border rounded p-2 mt-1" />}
          </label>
        ))}
        <div className="flex justify-end gap-2 pt-2"><Btn type="button" c="border bg-white text-slate-700" onClick={onClose}>Cancel</Btn><Btn c="bg-amber-500 text-slate-950">Save</Btn></div>
      </form>
    </div>
  );
}

/* Reusable add / edit / delete list */
function CrudList({ title, items, fields, onAdd, onEdit, onDel, canEdit = true, canDel = true, line, badge, empty = 'Nothing recorded yet.' }) {
  const [form, setForm] = useState(null);
  return (
    <Card title={`${title} (${items.length})`} action={canEdit && onAdd && <Btn onClick={() => setForm({})}><Plus className="w-3 h-3" />Add</Btn>}>
      {items.length === 0 && <p className="text-xs text-slate-400 italic">{empty}</p>}
      <div className="space-y-1.5">
        {items.map(it => (
          <div key={it.id} className="flex justify-between items-center gap-2 bg-slate-50 border rounded p-2 text-xs">
            <div className="min-w-0">{line(it)}</div>
            <div className="flex items-center gap-1 shrink-0">
              {badge && badge(it)}
              {it.data && <a href={it.data} download={it.name} className="p-1 text-slate-600"><Download className="w-3.5 h-3.5" /></a>}
              {canEdit && onEdit && <button onClick={() => setForm(it)} className="p-1 text-amber-600"><Pencil className="w-3.5 h-3.5" /></button>}
              {canDel && onDel && <button onClick={() => window.confirm('Delete this record?') && onDel(it.id)} className="p-1 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>}
            </div>
          </div>
        ))}
      </div>
      {form && <FormModal title={form.id ? `Edit ${title}` : `Add ${title}`} fields={fields} initial={form} onClose={() => setForm(null)} onSubmit={v => { form.id ? onEdit(v) : onAdd(v); setForm(null); }} />}
    </Card>
  );
}

/* ---------- main app ---------- */
export default function App() {
  const [db, setDb] = useState(() => { try { const s = localStorage.getItem('falcon_u_db_v30'); return s ? JSON.parse(s) : seed(); } catch { return seed(); } });
  const [me, setMe] = useState(() => { try { return JSON.parse(sessionStorage.getItem('falcon_u_me')); } catch { return null; } });
  const [view, setView] = useState('dash');
  const [propId, setPropId] = useState(null);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [typeF, setTypeF] = useState('All');
  const [month, setMonth] = useState(ym());
  const [login, setLogin] = useState({ u: '', p: '', role: 'landlord', signup: false, err: '' });
  const [modal, setModal] = useState(null);
  const [assign, setAssign] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => { try { localStorage.setItem('falcon_u_db_v30', JSON.stringify(db)); } catch { } }, [db]);
  useEffect(() => { try { sessionStorage.setItem('falcon_u_me', JSON.stringify(me)); } catch { } }, [me]);
  useEffect(() => {
    const h = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false); };
    document.addEventListener('mousedown', h); document.addEventListener('touchstart', h);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('touchstart', h); };
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

  /* ----- login ----- */
  if (!me) {
    const roles = [['landlord', '👑 Landlord'], ['agent', '🏢 Agent'], ['tenant', '👤 Tenant']];
    const lr = login.role;
    const setL = patch => setLogin(l => ({ ...l, err: '', ...patch }));
    const go = e => {
      e.preventDefault();
      const un = login.u.trim().toLowerCase();
      if (login.signup && lr !== 'landlord') {
        if (un.length < 3 || login.p.length < 4) return setL({ err: 'Enter a valid Login ID (3+ chars) and password (4+ chars).' });
        if (db.users.some(x => x.username.toLowerCase() === un)) return setL({ err: 'That Login ID is already taken.' });
        const nu = { id: uid(), name: un, username: un, password: login.p, role: lr, props: [] };
        upd('users', a => [...a, nu]); setMe(nu); setView('dash'); return;
      }
      const u = db.users.find(x => x.username.toLowerCase() === un && x.password === login.p);
      if (!u) return setL({ err: 'Incorrect Login ID or password.' });
      if (u.role !== lr) return setL({ err: `This is a ${u.role} account. Select "${u.role}" above to sign in.` });
      setMe(u); setView('dash');
    };
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <form onSubmit={go} className="bg-white rounded-xl p-8 w-full max-w-sm space-y-4">
          <div className="flex items-center gap-2"><Building2 className="w-8 h-8 text-amber-500" /><div><h1 className="font-bold text-lg">Falcon U Properties</h1><p className="text-xs text-slate-500">Property management portal</p></div></div>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
            {roles.map(([k, l]) => <button type="button" key={k} onClick={() => setL({ role: k, signup: k === 'landlord' ? false : login.signup })} className={`py-2 rounded-md text-xs font-bold ${lr === k ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>{l}</button>)}
          </div>
          <p className="text-sm font-semibold">{login.signup && lr !== 'landlord' ? `Create ${lr} account` : `Sign in as ${lr}`}</p>
          <input autoFocus placeholder="Login ID / Username" value={login.u} onChange={e => setL({ u: e.target.value })} className="w-full border rounded p-2.5 text-sm" />
          <input type="password" placeholder="Password" value={login.p} onChange={e => setL({ p: e.target.value })} className="w-full border rounded p-2.5 text-sm" />
          {login.err && <p className="text-xs text-red-600">{login.err}</p>}
          <button className="w-full bg-amber-500 text-slate-950 font-bold rounded p-2.5 text-sm">{login.signup && lr !== 'landlord' ? 'Create account' : 'Sign in'}</button>
          {lr !== 'landlord'
            ? <button type="button" onClick={() => setL({ signup: !login.signup })} className="w-full text-xs text-slate-600 underline">{login.signup ? 'Already have an account? Sign in' : `New ${lr}? Create an account`}</button>
            : <p className="text-[11px] text-slate-400">Landlord accounts are created by the business owner only.</p>}
          <p className="text-[11px] text-slate-400">Demo: landlord / landlord123 · agent1 / agent123 · tenant1 / tenant123</p>
        </form>
      </div>
    );
  }

  /* ----- permissions & data scope ----- */
  const role = me.role;
  const L = role === 'landlord', A = role === 'agent', T = role === 'tenant';
  const mine = db.users.find(u => u.id === me.id) || me;
  const props = L ? db.props : db.props.filter(p => mine.props.includes(p.id));
  const ids = props.map(p => p.id);
  const pName = id => db.props.find(p => p.id === id)?.address || 'Unknown';
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
  const insAlerts = props.filter(p => { const l = [...p.insurance].sort((a, b) => b.expiry.localeCompare(a.expiry))[0]; return !l || days(l.expiry) <= 60; });
  const openTk = db.tickets.filter(t => ids.includes(t.propId) && t.status === 'Open');
  const markPaid = p => addTo('payments', { propId: p.id, month: cm, amount: p.rent, date: today() });
  const openProp = id => { setPropId(id); setView('prop'); };

  const nav = [['dash', '🏠 Dashboard'], ['rent', '🚨 Rent & Reminders'], ['expenses', '💷 Expenses'], ['certs', '📜 Certificates'], ['insurance', '🛡️ Insurance'], ['tickets', '🔧 Maintenance Tickets'], ...(!T ? [['suppliers', '🛠️ Suppliers & Contractors'], ['archive', '📁 Previous Tenants']] : []), ...(L ? [['users', '👥 Users & Logins'], ['settings', '⚙️ Contact Settings']] : [])]
    .filter(([k]) => !T || ['dash', 'tickets'].includes(k));

  /* ----- field sets ----- */
  const propFields = [F('address', 'Address'), F('type', 'Property type', 'select', TYPES), F('rent', 'Monthly rent (£)', 'number'), F('deposit', 'Deposit (£)', 'number'), F('depositScheme', 'Deposit scheme'), F('contractParty', 'Contract between'), F('contractType', 'Contract type'), F('councilTax', 'Council tax band'), F('furnishing', 'Furnishing'), F('garden', 'Garden'), F('parking', 'Parking')];
  const tenFields = [F('name', 'Full name'), F('email', 'Email', 'email'), F('phone', 'Phone'), F('passport', 'Passport number'), F('origin', 'Country of origin'), F('job', 'Job status'), F('moveIn', 'Move-in date', 'date'), F('rentDay', 'Rent due day of month', 'number'), F('visaStatus', 'Visa / immigration status'), F('visaCategory', 'Visa category'), F('shareCode', 'Right to Rent share code'), F('visaExpiry', 'Visa expiry', 'date'), F('proof', 'Visa / Right to Rent proof', 'file'), F('notes', 'Private notes (landlord/agent)', 'textarea')];
  const visaFields = tenFields.filter(f => ['visaStatus', 'visaCategory', 'shareCode', 'visaExpiry', 'proof'].includes(f.k));
  const tkFields = (full) => [...(full ? [F('propId', 'Property', 'select', ids)] : []), F('category', 'Category', 'select', ['Plumbing', 'Electrical', 'Gas/Heating', 'Structural', 'Appliances', 'Pest', 'Other']), F('desc', 'Description', 'textarea'), F('priority', 'Priority', 'select', ['Low', 'Medium', 'High', 'Urgent']), ...(!T ? [F('status', 'Status', 'select', ['Open', 'Closed'])] : [])];

  /* ----- views ----- */
  const Tickets = ({ list, fixedProp }) => (
    <CrudList title="Maintenance tickets" items={list} canEdit canDel={L}
      fields={tkFields(!fixedProp)}
      onAdd={i => addTo('tickets', { status: 'Open', priority: 'Medium', category: 'Plumbing', date: today(), propId: fixedProp || ids[0], ...i })}
      onEdit={i => editIn('tickets', i)} onDel={id => delFrom('tickets', id)}
      line={t => <div><p className="font-semibold">{t.category}: {t.desc}</p><p className="text-slate-500">{pName(t.propId)} · {t.date} · {t.priority}</p></div>}
      badge={t => <><span className={`px-2 py-0.5 rounded font-bold ${pill(t.status)}`}>{t.status}</span><Btn c="border bg-white text-slate-700" onClick={() => editIn('tickets', { ...t, status: t.status === 'Open' ? 'Closed' : 'Open' })}>{t.status === 'Open' ? 'Close' : 'Reopen'}</Btn></>} />
  );

  const PropertyView = () => {
    const p = db.props.find(x => x.id === propId);
    if (!p || !ids.includes(p.id)) return <p className="p-4 text-xs">Property not found.</p>;
    const t = p.tenant, hotel = p.type.startsWith('Hotel');
    const endTenancy = () => {
      if (!window.confirm('End this tenancy and move the tenant to the archive?')) return;
      addTo('archive', { address: p.address, name: t.name, moveIn: t.moveIn, moveOut: today(), reason: 'Tenancy ended by ' + me.name });
      setProp(p.id, { tenant: null });
    };
    const removeTenant = () => { if (window.confirm('Permanently delete this tenant record? (Landlord only)')) setProp(p.id, { tenant: null }); };
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <div><h2 className="text-xl font-bold">{p.address}</h2><p className="text-xs text-slate-500">{p.type} · {p.councilTax} · {p.furnishing} · Garden: {p.garden} · Parking: {p.parking}</p>
            <p className="text-xs text-slate-600 mt-1">Rent {gbp(p.rent)}/mo · Deposit {gbp(p.deposit)} ({p.depositScheme}) · {p.contractParty} ({p.contractType})</p></div>
          {!T && <div className="flex gap-2"><Btn c="bg-amber-500 text-slate-950" onClick={() => setModal({ title: 'Edit property', fields: propFields, initial: p, submit: v => setProp(p.id, { ...v, rent: Number(v.rent), deposit: Number(v.deposit) }) })}><Pencil className="w-3 h-3" />Edit property</Btn>
            {L && <Btn c="bg-red-600 text-white" onClick={() => { if (window.confirm('Delete this property and all its records?')) { upd('props', a => a.filter(x => x.id !== p.id)); setView('dash'); } }}><Trash2 className="w-3 h-3" />Delete</Btn>}</div>}
        </div>

        {!hotel && (
          <Card title="Tenant" action={<div className="flex gap-2">
            {!T && <Btn c="bg-amber-500 text-slate-950" onClick={() => setModal({ title: t ? 'Edit tenant' : 'Add tenant', fields: tenFields, initial: t || { rentDay: 1, moveIn: today(), visaStatus: 'UK Citizen', family: [] }, submit: v => setProp(p.id, { tenant: { family: [], ...v } }) })}><Pencil className="w-3 h-3" />{t ? 'Edit' : 'Add tenant'}</Btn>}
            {T && t && <Btn c="bg-amber-500 text-slate-950" onClick={() => setModal({ title: 'Update visa / Right to Rent details', fields: visaFields, initial: t, submit: v => setProp(p.id, { tenant: { ...t, ...v } }) })}><Pencil className="w-3 h-3" />Update visa details</Btn>}
            {!T && t && <Btn c="bg-slate-700 text-white" onClick={endTenancy}>End tenancy</Btn>}
            {L && t && <Btn c="bg-red-600 text-white" onClick={removeTenant}><Trash2 className="w-3 h-3" />Delete tenant</Btn>}</div>}>
            {t ? <div className="grid md:grid-cols-2 gap-x-6 gap-y-1 text-xs">
              <p><b>Name:</b> {t.name}</p><p><b>Email:</b> {t.email}</p><p><b>Phone:</b> {t.phone}</p><p><b>Moved in:</b> {t.moveIn}</p>
              <p><b>Job:</b> {t.job}</p><p><b>Origin:</b> {t.origin}</p>
              {!T && <p><b>Passport:</b> {t.passport}</p>}
              <p><b>Visa:</b> {t.visaStatus} {t.visaCategory && `(${t.visaCategory})`}</p><p><b>Share code:</b> {t.shareCode || '—'}</p>
              <p><b>Visa expiry:</b> {t.visaExpiry || '—'} {t.visaExpiry && <span className={`px-1.5 rounded ${pill(status(t.visaExpiry))}`}>{status(t.visaExpiry)}</span>}</p>
              <p><b>Proof:</b> {t.proof || 'Not uploaded'}</p>
              <p><b>This month's rent:</b> <span className={`px-1.5 rounded font-bold ${pill(paid(p) ? 'Paid' : 'Unpaid')}`}>{paid(p) ? 'Paid' : 'Unpaid'}</span> {!T && !paid(p) && <button onClick={() => markPaid(p)} className="ml-1 text-green-700 font-bold underline">Mark paid</button>}</p>
              {!T && t.notes && <p className="md:col-span-2 bg-slate-50 p-2 rounded border"><b>Note:</b> {t.notes}</p>}
            </div> : <p className="text-xs text-slate-400 italic">No tenant assigned (vacant).</p>}
          </Card>
        )}
        {t && !hotel && <CrudList title="Dependants / family" items={t.family || []} canEdit={!T || true} canDel={!T} fields={[F('name', 'Name'), F('relation', 'Relation'), F('visaStatus', 'Visa status'), F('visaExpiry', 'Visa expiry', 'date'), F('shareCode', 'Share code')]}
          onAdd={i => setProp(p.id, { tenant: { ...t, family: [...(t.family || []), { ...i, id: uid() }] } })} onEdit={i => setProp(p.id, { tenant: { ...t, family: t.family.map(x => x.id === i.id ? i : x) } })} onDel={id => setProp(p.id, { tenant: { ...t, family: t.family.filter(x => x.id !== id) } })}
          line={f => <span><b>{f.name}</b> ({f.relation}) · {f.visaStatus} · exp {f.visaExpiry || '—'} · {f.shareCode}</span>} badge={f => f.visaExpiry && <span className={`px-2 py-0.5 rounded ${pill(status(f.visaExpiry))}`}>{status(f.visaExpiry)}</span>} />}

        {hotel && <CrudList title="Monthly income (Airbnb / Booking.com)" {...sub(p, 'income')} canEdit={!T} canDel={!T} fields={[F('month', 'Month', 'month'), F('amount', 'Income (£)', 'number'), F('notes', 'Notes')]}
          line={i => <span><b>{i.month}</b> · {gbp(i.amount)} · {i.notes}</span>} />}

        <CrudList title="Documents" {...sub(p, 'docs')} canEdit={!T} canDel={!T} fields={[F('name', 'Document name'), F('category', 'Category', 'select', ['Agreement', 'Certificate', 'DPS / Deposit', 'Inventory', 'Insurance', 'Mortgage', 'Licence', 'ID / Right to Rent', 'Other']), F('data', 'Upload file (optional)', 'file')]}
          line={d => <span><b>{d.name}</b> · {d.category}</span>} />
        {!T && <>
          <CrudList title="Certificates & compliance" {...sub(p, 'certs')} fields={[F('type', 'Type', 'select', CERTS), F('ref', 'Reference number'), F('expiry', 'Expiry date', 'date')]} canDel
            line={c => <span><b>{c.type}</b> · Ref {c.ref} · exp {c.expiry}</span>} badge={c => <span className={`px-2 py-0.5 rounded font-bold ${pill(status(c.expiry))}`}>{status(c.expiry)}</span>} />
          <CrudList title="Insurance history (keep 5 years)" {...sub(p, 'insurance')} fields={[F('provider', 'Provider'), F('policy', 'Policy number'), F('premium', 'Premium (£)', 'number'), F('start', 'Start date', 'date'), F('expiry', 'Expiry date', 'date')]}
            line={i => <span><b>{i.provider}</b> · {i.policy} · {gbp(i.premium)} · {i.start} → {i.expiry}</span>} badge={i => <span className={`px-2 py-0.5 rounded font-bold ${pill(status(i.expiry))}`}>{status(i.expiry)}</span>} />
          <CrudList title="Mortgage details" {...sub(p, 'mortgage')} fields={[F('lender', 'Lender / provider'), F('account', 'Account number'), F('monthly', 'Monthly payment (£)', 'number'), F('rate', 'Interest rate'), F('endDate', 'Deal end date', 'date'), F('notes', 'Notes')]}
            line={m => <span><b>{m.lender}</b> · {m.account} · {gbp(m.monthly)}/mo · {m.rate} · ends {m.endDate}</span>} />
          <CrudList title="Utility suppliers" {...sub(p, 'suppliers')} fields={[F('kind', 'Type', 'select', ['Gas', 'Electricity', 'Water', 'Broadband', 'Council Tax', 'Managing Agent', 'Other']), F('name', 'Supplier'), F('account', 'Account number'), F('phone', 'Phone'), F('notes', 'Notes')]}
            line={s => <span><b>{s.kind}:</b> {s.name} · {s.account} · {s.phone}</span>} />
          <CrudList title="Meter readings" {...sub(p, 'meters')} fields={[F('utility', 'Utility', 'select', ['Electricity', 'Gas', 'Water']), F('kind', 'Reading type', 'select', ['Opening', 'Closing', 'Routine']), F('reading', 'Reading'), F('date', 'Date', 'date')]}
            line={m => <span><b>{m.kind} {m.utility}:</b> {m.reading} · {m.date}</span>} />
          <CrudList title="Property expenses" items={db.expenses.filter(e => e.propId === p.id)} fields={[F('date', 'Date', 'date'), F('category', 'Category', 'select', EXP_CATS), F('amount', 'Amount (£)', 'number'), F('supplier', 'Supplier'), F('notes', 'Notes')]}
            onAdd={i => addTo('expenses', { ...i, propId: p.id })} onEdit={i => editIn('expenses', i)} onDel={id => delFrom('expenses', id)} canDel
            line={e => <span>{e.date} · <b>{e.category}</b> · {gbp(e.amount)} · {e.supplier} {e.notes}</span>} />
        </>}
        <Tickets list={db.tickets.filter(x => x.propId === p.id)} fixedProp={p.id} />
      </div>
    );
  };

  const Dash = () => {
    const list = props.filter(p => (typeF === 'All' || p.type === typeF) && (p.address + (p.tenant?.name || '')).toLowerCase().includes(search.toLowerCase()));
    const stat = (l, v, s, go, c) => <div onClick={() => setView(go)} className="bg-white border rounded-lg p-4 cursor-pointer hover:border-amber-400"><p className="text-xs text-slate-500">{l}</p><p className={`text-2xl font-bold mt-1 ${c}`}>{v}</p><p className="text-[11px] text-slate-400">{s}</p></div>;
    return (
      <div className="space-y-5">
        {!T && <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stat('Total earnings this month', gbp(rentIn + hotelIn), `Rent ${gbp(rentIn)} + hotel/Airbnb ${gbp(hotelIn)}`, 'rent', 'text-green-700')}
            {stat('Expenses this month', gbp(expMonth), 'Click to view details', 'expenses', 'text-red-700')}
            {stat('Net this month', gbp(rentIn + hotelIn - expMonth), 'Earnings minus expenses', 'expenses', 'text-slate-900')}
            {stat('Rent overdue', props.filter(overdue).length, 'Click to chase', 'rent', 'text-red-600')}
            {stat('Certificates due', certAlerts.length, 'Expiring or expired', 'certs', 'text-amber-600')}
            {stat('Insurance renewals', insAlerts.length, 'Due within 60 days', 'insurance', 'text-blue-600')}
            {stat('Open tickets', openTk.length, 'Maintenance', 'tickets', 'text-orange-600')}
            {stat('Properties', props.length, 'In your portfolio', 'dash', 'text-slate-900')}
          </div>
          <div className="flex flex-wrap gap-2">
            <input placeholder="Search address or tenant…" value={search} onChange={e => setSearch(e.target.value)} className="border rounded p-2 text-xs w-64 bg-white" />
            <select value={typeF} onChange={e => setTypeF(e.target.value)} className="border rounded p-2 text-xs bg-white"><option>All</option>{TYPES.map(t => <option key={t}>{t}</option>)}</select>
            {!T && <Btn c="bg-amber-500 text-slate-950" onClick={() => setModal({ title: 'Add property', fields: propFields, initial: { type: 'Flat', rent: 1000, deposit: 1000, depositScheme: 'DPS', contractType: 'AST', councilTax: 'Band B', furnishing: 'Unfurnished', garden: 'No', parking: 'None' }, submit: addProp })}><Plus className="w-3 h-3" />Add property</Btn>}
          </div></>}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map(p => (
            <div key={p.id} onClick={() => openProp(p.id)} className="bg-white border rounded-lg p-4 cursor-pointer hover:border-amber-400 space-y-1">
              <div className="flex justify-between items-center"><span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded">{p.type}</span><span className={`text-[11px] px-2 py-0.5 rounded font-bold ${p.tenant ? (paid(p) ? pill('Paid') : pill('Unpaid')) : 'bg-slate-100 text-slate-500'}`}>{p.tenant ? (paid(p) ? 'Rent Paid' : 'Rent Unpaid') : 'Vacant'}</span></div>
              <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{p.address}</h3>
              <p className="text-xs text-slate-600">{p.type.startsWith('Hotel') ? 'Hotel / Short stay' : `Rent: ${gbp(p.rent)}/mo`}</p>
              {p.tenant ? <p className="text-xs text-slate-500 border-t pt-1 mt-1">Tenant: <b>{p.tenant.name}</b></p> : <p className="text-xs text-slate-400 italic border-t pt-1 mt-1">Vacant</p>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const RentView = () => (
    <div className="space-y-4">
      <Card title="Overdue rent payments">
        {props.filter(overdue).length === 0 ? <p className="text-xs text-slate-400 italic">No rent overdue.</p> : (
          <div className="space-y-2">
            {props.filter(overdue).map(p => (
              <div key={p.id} className="flex justify-between items-center bg-red-50 border border-red-200 rounded p-3 text-xs">
                <div><p className="font-bold text-slate-900">{p.address}</p><p className="text-slate-600">Tenant: {p.tenant.name} ({p.tenant.email}) · Rent: {gbp(p.rent)} due day {p.tenant.rentDay}</p></div>
                <div className="flex gap-2">
                  <a href={`mailto:${p.tenant.email}?subject=OVERDUE%20RENT%20NOTICE%20-%20${encodeURIComponent(p.address)}&body=Dear%20${encodeURIComponent(p.tenant.name)},%0A%0AOur%20records%20show%20that%20your%20rent%20payment%20of%20${encodeURIComponent(gbp(p.rent))}%20for%20${encodeURIComponent(p.address)}%20is%20overdue.%0A%0APlease%20arrange%20payment%20as%20soon%20as%20possible.%0A%0AFalcon%20U%20Properties`} className="bg-slate-900 text-white px-2.5 py-1 rounded text-xs font-semibold inline-flex items-center gap-1"><Send className="w-3 h-3" />Send email</a>
                  <Btn c="bg-green-700 text-white" onClick={() => markPaid(p)}>Mark paid</Btn>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <CrudList title="Recorded payments this month" items={db.payments.filter(x => x.month === cm && ids.includes(x.propId))} canEdit={false} canDel={L} onDel={id => delFrom('payments', id)}
        line={p => <span><b>{pName(p.propId)}</b> · Paid {gbp(p.amount)} on {p.date}</span>} />
    </div>
  );

  const ExpensesView = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs"><span>Month:</span><input type="month" value={month} onChange={e => setMonth(e.target.value)} className="border rounded p-1 bg-white" /></div>
      <CrudList title={`Expenses for ${month}`} items={db.expenses.filter(e => ids.includes(e.propId) && e.date.slice(0, 7) === month)} canDel
        fields={[F('propId', 'Property', 'select', ids), F('date', 'Date', 'date'), F('category', 'Category', 'select', EXP_CATS), F('amount', 'Amount (£)', 'number'), F('supplier', 'Supplier'), F('notes', 'Notes')]}
        onAdd={i => addTo('expenses', i)} onEdit={i => editIn('expenses', i)} onDel={id => delFrom('expenses', id)}
        line={e => <span><b>{pName(e.propId)}</b> · {e.date} · {e.category} · {gbp(e.amount)} · {e.supplier} {e.notes}</span>} />
    </div>
  );

  const CertsView = () => (
    <Card title="Certificates & compliance across portfolio">
      <div className="space-y-2">
        {allCerts.map(c => (
          <div key={c.id} className="flex justify-between items-center bg-slate-50 border rounded p-2 text-xs">
            <div><p className="font-bold">{c.type} (Ref: {c.ref})</p><p className="text-slate-500">{pName(c.propId)} · Expiry: {c.expiry}</p></div>
            <span className={`px-2 py-0.5 rounded font-bold ${pill(status(c.expiry))}`}>{status(c.expiry)}</span>
          </div>
        ))}
      </div>
    </Card>
  );

  const InsuranceView = () => (
    <Card title="Insurance policies">
      <div className="space-y-2">
        {props.map(p => {
          const l = [...p.insurance].sort((a, b) => b.expiry.localeCompare(a.expiry))[0];
          return (
            <div key={p.id} className="flex justify-between items-center bg-slate-50 border rounded p-2 text-xs">
              <div><p className="font-bold">{p.address}</p><p className="text-slate-500">{l ? `${l.provider} (${l.policy}) · ${gbp(l.premium)} · Expiry: ${l.expiry}` : 'No insurance policy on record'}</p></div>
              <Btn c="border bg-white text-slate-700" onClick={() => openProp(p.id)}>View details</Btn>
            </div>
          );
        })}
      </div>
    </Card>
  );

  const UsersView = () => (
    <CrudList title="Portal users & logins" items={db.users} canDel fields={[F('username', 'Login ID / Username'), F('password', 'Password'), F('role', 'Role', 'select', ['landlord', 'agent', 'tenant'])]}
      onAdd={u => addTo('users', { ...u, name: u.username })} onEdit={u => editIn('users', u)} onDel={id => delFrom('users', id)}
      line={u => <span><b>{u.username}</b> · Role: <b>{u.role}</b> · Pass: {u.password} · Properties assigned: {u.role === 'landlord' ? 'ALL' : u.props.length}</span>}
      badge={u => u.role === 'agent' && <Btn c="border bg-white text-slate-700" onClick={() => setAssign(u)}>Assign properties</Btn>} />
  );

  const AssignModal = () => (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-5 space-y-3 text-xs">
        <h3 className="font-bold text-sm">Assign properties to {assign.username}</h3>
        <div className="space-y-1.5 max-h-60 overflow-y-auto">
          {db.props.map(p => {
            const has = assign.props.includes(p.id);
            return (
              <label key={p.id} className="flex items-center gap-2 p-1.5 border rounded">
                <input type="checkbox" checked={has} onChange={() => {
                  const nu = { ...assign, props: has ? assign.props.filter(x => x !== p.id) : [...assign.props, p.id] };
                  setAssign(nu); editIn('users', nu);
                }} />
                <span>{p.address} ({p.type})</span>
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
      <Card title="Contact details & business settings">
        <form onSubmit={e => { e.preventDefault(); setModal(null); }} className="space-y-3 text-xs">
          <label className="block"><span className="font-semibold text-slate-700">Office phone</span><input value={s.phone} onChange={e => upd('settings', x => ({ ...x, phone: e.target.value }))} className="w-full border rounded p-2 mt-1" /></label>
          <label className="block"><span className="font-semibold text-slate-700">Business email</span><input value={s.email} onChange={e => upd('settings', x => ({ ...x, email: e.target.value }))} className="w-full border rounded p-2 mt-1" /></label>
          <label className="block"><span className="font-semibold text-slate-700">Working hours</span><input value={s.hours} onChange={e => upd('settings', x => ({ ...x, hours: e.target.value }))} className="w-full border rounded p-2 mt-1" /></label>
          <label className="block"><span className="font-semibold text-slate-700">24/7 Emergency Gas Leak phone</span><input value={s.gas} onChange={e => upd('settings', x => ({ ...x, gas: e.target.value }))} className="w-full border rounded p-2 mt-1" /></label>
          <label className="block"><span className="font-semibold text-slate-700">24/7 Emergency Power Failure phone</span><input value={s.power} onChange={e => upd('settings', x => ({ ...x, power: e.target.value }))} className="w-full border rounded p-2 mt-1" /></label>
          <p className="text-green-700 font-semibold">Settings update automatically as you type.</p>
        </form>
      </Card>
    );
  };

  /* ----- render layout ----- */
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-16">
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-amber-400" />
            <div><h1 className="text-xl font-bold tracking-wide">FALCON U PROPERTIES</h1><p className="text-xs text-amber-400">Enterprise Real Estate & Compliance Portal</p></div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="text-right"><p className="font-bold text-white">{me.username}</p><span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">{me.role} portal</span></div>
            <button onClick={() => setMe(null)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold"><LogOut className="w-3.5 h-3.5" />Sign out</button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center text-xs bg-slate-950/90">
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenu(!menu)} className="bg-amber-500 text-slate-950 font-bold px-4 py-1.5 rounded-lg flex items-center gap-2 shadow">
              Navigation & Modules <ChevronDown className="w-4 h-4" />
            </button>
            {menu && (
              <div className="absolute top-full left-0 mt-1 bg-slate-900 text-white border border-slate-700 rounded-lg shadow-2xl w-64 z-50 py-2 text-xs">
                {nav.map(([k, l]) => <button key={k} onClick={() => { setView(k); setMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-800 font-bold">{l}</button>)}
              </div>
            )}
          </div>
          <div className="text-slate-300 text-xs hidden md:block">Business Email: <b>{db.settings.email}</b></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-6">
        {view !== 'dash' && (
          <button onClick={() => setView('dash')} className="mb-4 bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" /> Go Back to Main Dashboard Home
          </button>
        )}

        {view === 'dash' && <Dash />}
        {view === 'prop' && <PropertyView />}
        {view === 'rent' && <RentView />}
        {view === 'expenses' && <ExpensesView />}
        {view === 'certs' && <CertsView />}
        {view === 'insurance' && <InsuranceView />}
        {view === 'tickets' && <Tickets list={db.tickets.filter(x => ids.includes(x.propId))} />}
        {view === 'suppliers' && <CrudList title="Suppliers & contractors" items={db.contractors} canDel fields={[F('name', 'Name'), F('trade', 'Trade / specialty'), F('company', 'Company'), F('phone', 'Phone'), F('email', 'Email'), F('notes', 'Notes')]} onAdd={c => addTo('contractors', c)} onEdit={c => editIn('contractors', c)} onDel={id => delFrom('contractors', id)} line={c => <span><b>{c.name}</b> ({c.trade}) · {c.company} · {c.phone} · {c.email} {c.notes}</span>} />}
        {view === 'archive' && <CrudList title="Archived tenants" items={db.archive} canEdit={false} canDel fields={[]} onDel={id => delFrom('archive', id)} line={a => <span><b>{a.name}</b> · {a.address} · Moved in {a.moveIn} · Left {a.moveOut} · Reason: {a.reason}</span>} />}
        {view === 'users' && <UsersView />}
        {view === 'settings' && <SettingsView />}
      </main>

      {modal && <FormModal title={modal.title} fields={modal.fields} initial={modal.initial} onClose={() => setModal(null)} onSubmit={v => { modal.submit(v); setModal(null); }} />}
      {assign && <AssignModal />}

      <footer className="mt-12 bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="font-bold text-white text-sm">Falcon U Properties Management</p>
            <p>Office Phone: {db.settings.phone} | Operating Hours: {db.settings.hours}</p>
            <p>Email: {db.settings.email}</p>
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