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