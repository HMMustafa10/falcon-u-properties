import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Wrench, ShieldCheck, FileText, 
  Plus, Trash2, Edit, CheckCircle, AlertTriangle, 
  Search, Filter, Download, ArrowUpRight, DollarSign 
} from 'lucide-react';

// Default Mock Data
const defaultProperties = [
  { id: 1, name: 'Unit 101 - Falcon Tower', tenant: 'John Doe', rent: 1200, status: 'Occupied', compliance: 'Valid' },
  { id: 2, name: 'Unit 102 - Falcon Tower', tenant: 'Jane Smith', rent: 1350, status: 'Occupied', compliance: 'Pending' },
  { id: 3, name: 'Unit 201 - Falcon Plaza', tenant: 'Vacant', rent: 1100, status: 'Vacant', compliance: 'Valid' }
];

const defaultArchivedTenants = [
  { id: 101, name: 'Alex Johnson', previousUnit: 'Unit 101', movedOut: '2023-12-01' }
];

const defaultContractors = [
  { id: 1, name: 'Apex Plumbing Solutions', trade: 'Plumbing', phone: '07123456789' },
  { id: 2, name: 'Current Electrical Ltd', trade: 'Electrical', phone: '07987654321' }
];

export default function App() {
  // Persistent LocalStorage State
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('falcon_u_properties_v17');
    return saved ? JSON.parse(saved) : defaultProperties;
  });

  const [archivedTenantsVault, setArchivedTenantsVault] = useState(() => {
    const saved = localStorage.getItem('falcon_u_archived_tenants_v17');
    return saved ? JSON.parse(saved) : defaultArchivedTenants;
  });

  const [contractors, setContractors] = useState(() => {
    const saved = localStorage.getItem('falcon_u_contractors_v17');
    return saved ? JSON.parse(saved) : defaultContractors;
  });

  useEffect(() => {
    localStorage.setItem('falcon_u_properties_v17', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('falcon_u_archived_tenants_v17', JSON.stringify(archivedTenantsVault));
  }, [archivedTenantsVault]);

  useEffect(() => {
    localStorage.setItem('falcon_u_contractors_v17', JSON.stringify(contractors));
  }, [contractors]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <header className="mb-8 flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            Falcon U Properties Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Portfolio & Compliance Management Portal</p>
        </div>
      </header>

      <main className="grid gap-6">
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gray-600" />
            Active Portfolio ({properties.length})
          </h2>
          <div className="divide-y divide-gray-100">
            {properties.map((prop) => (
              <div key={prop.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{prop.name}</p>
                  <p className="text-sm text-gray-500">Tenant: {prop.tenant}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">£{prop.rent} / mo</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${prop.status === 'Occupied' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {prop.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}