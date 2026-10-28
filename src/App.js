import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 1. Initial Sample UK Portfolio (20 Units) with Water & Full Suppliers
  const defaultProperties = Array.from({ length: 20 }, (_, index) => {
    const id = index + 1;
    const cities = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool', 'Bristol', 'Sheffield'];
    const streets = ['High Street', 'Station Road', 'Park Lane', 'Victoria Road', 'Church Street', 'London Road', 'Main Street'];
    const categories = ['Residential House', 'Residential Flat', 'Commercial', 'HMO'];
    const dpsSchemes = ['Deposit Protection Service (DPS)', 'MyDeposits', 'Tenancy Deposit Scheme (TDS)'];
    const city = cities[index % cities.length];
    const street = streets[index % streets.length];
    const category = categories[index % categories.length];
    const dpsCompany = dpsSchemes[index % dpsSchemes.length];
    const isRented = index % 4 !== 0;
    const isCommercial = category === 'Commercial';
    const baseRent = isCommercial ? 2500 + (index * 150) : 900 + (index * 110);
    const isUkCitizen = index % 2 === 0;
    const isUrgent7Days = index % 5 === 0;

    return {
      id: id,
      address: `${10 + id} ${street}, ${category.includes('Flat') ? 'Flat ' + (id % 5 + 1) + ', ' : ''}${city}, UK`,
      propertyCategory: category,
      monthlyRent: baseRent,
      proposedRent: baseRent + 120,
      rentIncreasePercent: Math.round((120 / baseRent) * 100 * 10) / 10,
      status: isRented ? 'Rented' : 'Vacant',
      councilTaxBand: isCommercial ? 'N/A Commercial' : `Band ${['A', 'B', 'C', 'D'][index % 4]}`,
      binCollectionDay: `Every ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][index % 5]}`,
      tenancyStartDate: `2024-0${(id % 8) + 1}-01`,
      rentDueDate: '1st of every month',
      rentStatus: isRented ? (index % 3 === 0 ? 'Overdue' : 'Paid') : 'N/A',
      daysOverdue: (isRented && index % 3 === 0) ? (index * 2 + 3) : 0,
      // Banking & Legal Contract Details
      contractParties: `Falcon U Properties Ltd & Tenant ${id}`,
      rentPaymentBankAccount: `Barclays Bank PLC | Acc: 88904412 | Sort: 20-45-11 | Ref: UNIT-${id}`,
      // Gas & Electric Meter Readings
      meterReadings: {
        startGasMeter: `${1200 + (id * 45)} m³`,
        startGasPhoto: `gas_movein_${id}.jpg`,
        startElectricMeter: `${4500 + (id * 120)} kWh`,
        startElectricPhoto: `elec_movein_${id}.jpg`,
        closingGasMeter: isRented ? 'Pending Move-Out' : `${1450 + (id * 45)} m³`,
        closingGasPhoto: isRented ? 'N/A' : `gas_moveout_${id}.jpg`,
        closingElectricMeter: isRented ? 'Pending Move-Out' : `${5100 + (id * 120)} kWh`,
        closingElectricPhoto: isRented ? 'N/A' : `elec_moveout_${id}.jpg`
      },
      monthsUntilRentReview: (index % 3 === 0) ? 2 : (index % 3 === 1 ? 3 : 6),
      daysUntilCertExpiry: isUrgent7Days ? 4 : (id * 12 + 10),
      daysUntilInsuranceExpiry: isUrgent7Days ? 5 : (id * 15 + 8),
      managingAgent: id % 2 !== 0 ? 'Agent Alpha (London & North)' : 'Agent Beta (Midlands & South)',
      commercialDetails: isCommercial ? {
        leaseAgreementDoc: `Commercial_Lease_Agreement_${id}.pdf`,
        leaseStartYear: 2022,
        leaseTermYears: 10,
        leaseRemainingYears: 6,
        businessRatesValuation: `£${12000 + (id * 500)} / year`,
        businessRatesReference: `BRN-COMM-8890-${id}`
      } : null,
      // Utility Suppliers (Gas, Electricity & Water)
      utilitySuppliers: {
        gasSupplier: isCommercial ? 'British Gas Commercial' : 'Octopus Energy',
        gasAccountNumber: `GAS-ACC-${9900 + id}`,
        electricSupplier: isCommercial ? 'E.ON Next Business' : 'EDF Energy',
        electricAccountNumber: `ELEC-ACC-${7700 + id}`,
        waterSupplier: isCommercial ? 'Castle Water Commercial' : 'Thames Water',
        waterAccountNumber: `WTR-ACC-${5500 + id}`
      },
      primaryTenant: isRented ? {
        id: `T20${id}`,
        name: `Tenant ${id} (${['David', 'Sarah', 'Michael', 'Emma', 'James', 'Priya'][index % 6]} Smith)`,
        phone: `+44 7700 90${100 + id}`,
        email: `tenant${id}@example.co.uk`,
        jobStatus: index % 3 === 0 ? 'Employed (Software Engineer)' : (index % 3 === 1 ? 'Business Owner' : 'Student'),
        isUkPassportHolder: isUkCitizen,
        passportNumber: isUkCitizen ? `GB-PASS-${88000 + id}` : `FOREIGN-PASS-${99000 + id}`,
        passportExpiryDate: `2031-0${(id % 8) + 1}-20`,
        countryOfOrigin: isUkCitizen ? 'United Kingdom' : ['India', 'Nigeria', 'Canada', 'Australia', 'Pakistan'][id % 5],
        visaCategory: isUkCitizen ? 'UK Citizen' : (index % 3 === 0 ? 'Student Visa' : 'Skilled Worker / Job Visa'),
        visaExpiryDate: isUkCitizen ? 'N/A' : (isUrgent7Days ? '2026-10-31' : `2026-11-${10 + (id % 15)}`),
        daysUntilVisaExpiry: isUkCitizen ? 999 : (isUrgent7Days ? 5 : (id * 10 + 20)),
        rightToRentCode: isUkCitizen ? 'UK-CITIZEN-VERIFIED' : `RTR-SHARE-${88000 + id}`,
        depositAmount: Math.round(baseRent * 1.15),
        dpsCompany: dpsCompany,
        dpsReference: `DPS-9988-${id}`,
        totalOccupantsLivingInHouse: 3,
        householdMembers: [
          {
            name: `Spouse of Tenant ${id}`,
            relationship: 'Spouse',
            jobStatus: 'Employed (Accountant)',
            visaCategory: isUkCitizen ? 'UK Citizen' : 'Dependent Visa',
            visaExpiryDate: isUkCitizen ? 'N/A' : `2026-11-${12 + (id % 15)}`,
            rightToRentCode: isUkCitizen ? 'UK-CITIZEN' : `DEP-RTR-${7700 + id}`
          },
          {
            name: `Child of Tenant ${id}`,
            relationship: 'Child / Student',
            jobStatus: 'Student',
            visaCategory: isUkCitizen ? 'UK Citizen' : 'Dependent Visa',
            visaExpiryDate: isUkCitizen ? 'N/A' : `2026-11-${12 + (id % 15)}`,
            rightToRentCode: isUkCitizen ? 'UK-CITIZEN' : `DEP-RTR-${8800 + id}`
          }
        ]
      } : null,
      insuranceDetails: {
        provider: 'Aviva Direct Commercial',
        policyNumber: `POL-UK-8829-${id}`,
        amountPaid: 380 + (id * 15),
        dueDate: isUrgent7Days ? '2026-10-30' : `2026-11-${10 + (id % 18)}`,
        docName: `Insurance_Policy_2026_${id}.pdf`
      },
      documents: {
        tenancyAgreementDoc: `Tenancy_Agreement_Unit_${id}.pdf`,
        depositCertificateDoc: `DPS_Certificate_${id}.pdf`,
        selectiveLicenseNo: `SEL-LIC-2024-${100 + id}`,
        selectiveLicenseDoc: `Selective_License_Certificate_${id}.pdf`,
        gasCertExpiry: isUrgent7Days ? '2026-10-30' : `2026-11-${(id % 20) + 1}`,
        gasCertDoc: `Gas_Safety_CP12_${id}.pdf`,
        eicrExpiry: `2030-0${(id % 6) + 1}-15`,
        eicrDoc: `EICR_Certificate_${id}.pdf`,
        epcRating: ['A', 'B', 'C', 'D'][id % 4],
        epcExpiry: `2032-1${id % 2}-20`,
        epcDoc: `EPC_Report_${id}.pdf`
      },
      tickets: [
        { id: 101, category: 'Water Leak', description: 'Minor drip under kitchen sink pipe junction.', status: 'Open', dateSubmitted: '2026-10-22', mediaUrl: 'kitchen_leak.jpg' }
      ]
    };
  });

  // Pre-Loaded Historic Tenants Archive Vault (Up to 100)
  const defaultArchivedTenants = [
    { propertyAddress: '12 High Street, London', tenantName: 'Robert Vance', email: 'robert.vance@example.com', phone: '+44 7700 90101', rentPaid: '£1,100/mo', tenancyStartDate: '2022-01-01', visaStatus: 'UK Citizen', rightToRentCode: 'UK-CITIZEN-VERIFIED', archivedDate: '2024-01-15' },
    { propertyAddress: '15 Station Road, Manchester', tenantName: 'Elena Rostova', email: 'elena.r@example.com', phone: '+44 7700 90102', rentPaid: '£1,000/mo', tenancyStartDate: '2021-06-01', visaStatus: 'Skilled Worker Visa', rightToRentCode: 'RTR-HIST-9921', archivedDate: '2023-11-20' },
    { propertyAddress: '88 Park Lane, Birmingham', tenantName: 'Tariq Al-Mansoor', email: 'tariq.m@example.com', phone: '+44 7700 90103', rentPaid: '£1,350/mo', tenancyStartDate: '2020-03-01', visaStatus: 'Student Visa', rightToRentCode: 'RTR-HIST-4412', archivedDate: '2022-08-10' },
    { propertyAddress: '42 Victoria Road, Leeds', tenantName: 'Chen Wei', email: 'chen.wei@example.com', phone: '+44 7700 90104', rentPaid: '£950/mo', tenancyStartDate: '2023-02-01', visaStatus: 'Graduate Visa', rightToRentCode: 'RTR-HIST-8831', archivedDate: '2024-05-01' },
    { propertyAddress: '19 Church Street, Liverpool', tenantName: 'Sophie Bennett', email: 'sophie.b@example.com', phone: '+44 7700 90105', rentPaid: '£1,200/mo', tenancyStartDate: '2019-09-01', visaStatus: 'UK Citizen', rightToRentCode: 'UK-CITIZEN-VERIFIED', archivedDate: '2021-09-15' }
  ];

  // Default Contractor Directory with Full Address Details
  const defaultContractors = [
    { id: 1, trade: 'Gas Engineer', company: 'FlameSafe Heating Ltd', person: 'Mark Evans', phone: '020 8912 3456', email: 'mark@flamesafe.co.uk', address: '14 Industrial Way, London, E1 4PT' },
    { id: 2, trade: 'Electrician', company: 'SparkPro Electrical Services', person: 'John Miller', phone: '07700 900111', email: 'john@sparkpro.co.uk', address: '88 Voltage Road, Manchester, M1 2AB' },
    { id: 3, trade: 'Plumber', company: 'AquaFlow Plumbing Response', person: 'David Hughes', phone: '020 7946 0912', email: 'info@aquaflow.co.uk', address: '5 Pipe Street, Birmingham, B2 4QA' },
    { id: 4, trade: 'Builder & General', company: 'Apex Construction Ltd', person: 'Steve Turner', phone: '07700 900222', email: 'steve@apexconstruct.co.uk', address: '101 Builder Lane, Leeds, LS1 5DD' },
    { id: 5, trade: 'Painter & Decorator', company: 'Prime Finish Decorators', person: 'Liam O’Connor', phone: '07700 900333', email: 'liam@primefinish.co.uk', address: '22 Brush Avenue, Liverpool, L3 8EN' },
    { id: 6, trade: 'Cleaner', company: 'Sparkle Clean Commercial', person: 'Elena Gomez', phone: '020 7946 0555', email: 'clean@sparkle.co.uk', address: '77 Clean Way, Bristol, BS1 3XY' },
    { id: 7, trade: 'Carpenter', company: 'Woodcraft Joinery Solutions', person: 'Paul Walker', phone: '07700 900444', email: 'paul@woodcraft.co.uk', address: '12 Timber Close, Sheffield, S1 4AB' }
  ];

  // Persistent LocalStorage State
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('falcon_u_properties_v16');
    return saved ? JSON.parse(saved) : defaultProperties;
  });
  const [archivedTenantsVault, setArchivedTenantsVault] = useState(() => {
    const saved = localStorage.getItem('falcon_u_archived_tenants_v16');
    return saved ? JSON.parse(saved) : defaultArchivedTenants;
  });
  const [contractors, setContractors] = useState(() => {
    const saved = localStorage.getItem('falcon_u_contractors_v16');
    return saved ? JSON.parse(saved) : defaultContractors;
  });

  useEffect(() => {
    localStorage.setItem('falcon_u_properties_v16', JSON.stringify(properties));
  }, [properties]);
  useEffect(() => {
    localStorage.setItem('falcon_u_archived_tenants_v16', JSON.stringify(archivedTenantsVault));
  }, [archivedTenantsVault]);
  useEffect(() => {
    localStorage.setItem('falcon_u_contractors_v16', JSON.stringify(contractors));
  }, [contractors]);

  // Roles & View Navigation
  const [userRole, setUserRole] = useState('Landlord');
  const [selectedAgent, setSelectedAgent] = useState('Agent Alpha (London & North)');
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedPropertyId, setSelectedPropertyId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Contractor Add/Edit Modal State
  const [showContractorModal, setShowContractorModal] = useState(false);
  const [editingContractorId, setEditingContractorId] = useState(null);
  const [newTrade, setNewTrade] = useState('Plumber');
  const [newCompany, setNewCompany] = useState('');
  const [newPerson, setNewPerson] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newContractorAddress, setNewContractorAddress] = useState('');

  // Editing Tenant Modal State (Includes Sharecode & Visa Updates)
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [editTenantName, setEditTenantName] = useState('');
  const [editTenantEmail, setEditTenantEmail] = useState('');
  const [editTenantPhone, setEditTenantPhone] = useState('');
  const [editTenancyStart, setEditTenancyStart] = useState('');
  const [editVisaCategory, setEditVisaCategory] = useState('');
  const [editVisaExpiry, setEditVisaExpiry] = useState('');
  const [editShareCode, setEditShareCode] = useState('');

  // Household Member Add Form (Tenant Portal)
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRel, setNewMemberRel] = useState('Spouse');
  const [newMemberJob, setNewMemberJob] = useState('Employed');
  const [newMemberVisa, setNewMemberVisa] = useState('Skilled Worker Visa');
  const [newMemberExpiry, setNewMemberExpiry] = useState('');
  const [newMemberCode, setNewMemberCode] = useState('');

  // Add New Property Form State
  const [newPropAddress, setNewPropAddress] = useState('');
  const [newPropCategory, setNewPropCategory] = useState('Residential Flat');
  const [newPropRent, setNewPropRent] = useState('');

  // Ticket Form State
  const [ticketCategory, setTicketCategory] = useState('Water Leak');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketMedia, setTicketMedia] = useState('');

  // Closing Meter Readings State
  const [closingGasInput, setClosingGasInput] = useState('');
  const [closingGasPhotoInput, setClosingGasPhotoInput] = useState('');
  const [closingElecInput, setClosingElecInput] = useState('');
  const [closingElecPhotoInput, setClosingElecPhotoInput] = useState('');

  // Handlers
  const handleDownloadDoc = (docName) => alert(`Downloading Document: ${docName}`);
  const handleUploadDoc = (docType) => {
    const fileName = prompt(`Enter file name for ${docType}:`, `${docType.replace(/\s+/g, '_')}_Uploaded.pdf`);
    if (fileName) alert(`Document "${fileName}" attached successfully!`);
  };

  // Contractor Add / Edit Handler
  const handleOpenAddContractor = () => {
    setEditingContractorId(null);
    setNewTrade('Plumber');
    setNewCompany('');
    setNewPerson('');
    setNewPhone('');
    setNewEmail('');
    setNewContractorAddress('');
    setShowContractorModal(true);
  };

  const handleOpenEditContractor = (c) => {
    setEditingContractorId(c.id);
    setNewTrade(c.trade);
    setNewCompany(c.company);
    setNewPerson(c.person);
    setNewPhone(c.phone);
    setNewEmail(c.email);
    setNewContractorAddress(c.address || '');
    setShowContractorModal(true);
  };

  const handleSaveContractor = (e) => {
    e.preventDefault();
    if (!newCompany || !newPerson || !newPhone) return alert('Please enter company name, contact person, and phone number.');
    if (editingContractorId) {
      setContractors(contractors.map(c => c.id === editingContractorId ? {
        ...c,
        trade: newTrade,
        company: newCompany,
        person: newPerson,
        phone: newPhone,
        email: newEmail || 'N/A',
        address: newContractorAddress || 'N/A'
      } : c));
      alert('Contractor details updated successfully!');
    } else {
      const newEntry = {
        id: Date.now(),
        trade: newTrade,
        company: newCompany,
        person: newPerson,
        phone: newPhone,
        email: newEmail || 'N/A',
        address: newContractorAddress || 'N/A'
      };
      setContractors([...contractors, newEntry]);
      alert('New contractor added successfully!');
    }
    setShowContractorModal(false);
  };

  // Property & Tenant Edits
  const handleOpenEditTenantModal = (p) => {
    if (!p.primaryTenant) return alert('No active tenant assigned to edit.');
    setEditingPropertyId(p.id);
    setEditTenantName(p.primaryTenant.name);
    setEditTenantEmail(p.primaryTenant.email);
    setEditTenantPhone(p.primaryTenant.phone);
    setEditTenancyStart(p.tenancyStartDate);
    setEditVisaCategory(p.primaryTenant.visaCategory);
    setEditVisaExpiry(p.primaryTenant.visaExpiryDate);
    setEditShareCode(p.primaryTenant.rightToRentCode);
  };

  const handleSaveTenantEdits = (e) => {
    e.preventDefault();
    setProperties(properties.map(p => {
      if (p.id === editingPropertyId && p.primaryTenant) {
        return {
          ...p,
          tenancyStartDate: editTenancyStart,
          primaryTenant: {
            ...p.primaryTenant,
            name: editTenantName,
            email: editTenantEmail,
            phone: editTenantPhone,
            visaCategory: editVisaCategory,
            visaExpiryDate: editVisaExpiry,
            rightToRentCode: editShareCode
          }
        };
      }
      return p;
    }));
    setEditingPropertyId(null);
    alert('Tenant details, visa category, and sharecode updated successfully!');
  };

  const handleAddProperty = (e) => {
    e.preventDefault();
    if (!newPropAddress || !newPropRent) return alert('Please enter address and monthly rent.');
    const newId = Date.now();
    const newEntry = {
      id: newId,
      address: newPropAddress,
      propertyCategory: newPropCategory,
      monthlyRent: parseFloat(newPropRent),
      proposedRent: parseFloat(newPropRent) + 100,
      rentIncreasePercent: 5.0,
      status: 'Vacant',
      councilTaxBand: 'Band B',
      binCollectionDay: 'Every Tuesday',
      tenancyStartDate: 'N/A',
      rentDueDate: '1st of every month',
      rentStatus: 'N/A',
      daysOverdue: 0,
      contractParties: `Falcon U Properties Ltd & Tenant`,
      rentPaymentBankAccount: `Barclays Bank PLC | Acc: 88904412 | Sort: 20-45-11 | Ref: UNIT-${newId}`,
      meterReadings: { startGasMeter: '0 m³', startGasPhoto: 'N/A', startElectricMeter: '0 kWh', startElectricPhoto: 'N/A', closingGasMeter: 'N/A', closingGasPhoto: 'N/A', closingElectricMeter: 'N/A', closingElectricPhoto: 'N/A' },
      monthsUntilRentReview: 12,
      daysUntilCertExpiry: 365,
      daysUntilInsuranceExpiry: 365,
      managingAgent: 'Agent Alpha (London & North)',
      utilitySuppliers: { gasSupplier: 'British Gas', gasAccountNumber: 'GAS-NEW', electricSupplier: 'EDF Energy', electricAccountNumber: 'ELEC-NEW', waterSupplier: 'Thames Water', waterAccountNumber: 'WTR-NEW' },
      primaryTenant: null,
      insuranceDetails: { provider: 'Aviva Direct', policyNumber: 'POL-NEW', amountPaid: 400, dueDate: '2027-01-01', docName: 'Insurance_Policy.pdf' },
      documents: { tenancyAgreementDoc: 'AST_Agreement.pdf', depositCertificateDoc: 'DPS_Cert.pdf', selectiveLicenseNo: 'SEL-NEW', selectiveLicenseDoc: 'Selective_License.pdf', gasCertExpiry: '2027-01-01', gasCertDoc: 'Gas_CP12.pdf', eicrExpiry: '2030-01-01', eicrDoc: 'EICR.pdf', epcRating: 'C', epcExpiry: '2032-01-01', epcDoc: 'EPC.pdf' },
      tickets: []
    };
    setProperties([newEntry, ...properties]);
    setNewPropAddress(''); setNewPropRent('');
    setCurrentView('dashboard');
    alert('Property added to active portfolio!');
  };

  const handleAddHouseholdMember = (e, propId) => {
    e.preventDefault();
    if (!newMemberName || !newMemberExpiry) return alert('Please enter member name and visa expiry date.');
    const newMember = { name: newMemberName, relationship: newMemberRel, jobStatus: newMemberJob, visaCategory: newMemberVisa, visaExpiryDate: newMemberExpiry, rightToRentCode: newMemberCode || 'RTR-PENDING' };
    setProperties(properties.map(p => {
      if (p.id === propId && p.primaryTenant) {
        return {
          ...p,
          primaryTenant: {
            ...p.primaryTenant,
            totalOccupantsLivingInHouse: p.primaryTenant.totalOccupantsLivingInHouse + 1,
            householdMembers: [...(p.primaryTenant.householdMembers || []), newMember]
          }
        };
      }
      return p;
    }));
    setNewMemberName(''); setNewMemberExpiry(''); setNewMemberCode('');
    alert('Household member added to tenancy roster!');
  };

  const handleUpdateClosingMeters = (e, propId) => {
    e.preventDefault();
    if (!closingGasInput || !closingElecInput) return alert('Please enter both closing gas and electricity readings.');
    setProperties(properties.map(p => {
      if (p.id === propId) {
        return {
          ...p,
          meterReadings: {
            ...p.meterReadings,
            closingGasMeter: `${closingGasInput} m³`,
            closingGasPhoto: closingGasPhotoInput || 'Uploaded_Gas_Closing.jpg',
            closingElectricMeter: `${closingElecInput} kWh`,
            closingElectricPhoto: closingElecPhotoInput || 'Uploaded_Elec_Closing.jpg'
          }
        };
      }
      return p;
    }));
    setClosingGasInput(''); setClosingElecInput('');
    alert('Closing meter readings updated successfully!');
  };

  const handleCreateTicket = (e, propId) => {
    e.preventDefault();
    if (!ticketDescription) return alert('Please describe the issue.');
    const newTicket = { id: Date.now(), category: ticketCategory, description: ticketDescription, status: 'Open', dateSubmitted: new Date().toISOString().split('T')[0], mediaUrl: ticketMedia || 'No file attached' };
    setProperties(properties.map(p => {
      if (p.id === propId) { return { ...p, tickets: [newTicket, ...(p.tickets || [])] }; }
      return p;
    }));
    setTicketDescription(''); setTicketMedia('');
    alert('Maintenance ticket submitted successfully!');
  };

  const handleDeleteProperty = (id) => {
    const propToDelete = properties.find(p => p.id === id);
    if (!propToDelete) return;
    if (window.confirm(`Delete ${propToDelete.address}? Historic tenant details will be preserved in the 100-tenant history vault.`)) {
      if (propToDelete.primaryTenant) {
        const archivedRecord = {
          propertyAddress: propToDelete.address,
          tenantName: propToDelete.primaryTenant.name,
          email: propToDelete.primaryTenant.email,
          phone: propToDelete.primaryTenant.phone,
          rentPaid: `£${propToDelete.monthlyRent}/month`,
          tenancyStartDate: propToDelete.tenancyStartDate,
          visaStatus: propToDelete.primaryTenant.visaCategory,
          rightToRentCode: propToDelete.primaryTenant.rightToRentCode,
          archivedDate: new Date().toISOString().split('T')[0]
        };
        setArchivedTenantsVault([archivedRecord, ...archivedTenantsVault].slice(0, 100));
      }
      setProperties(properties.filter(p => p.id !== id));
      setCurrentView('dashboard');
      alert('Property deleted and tenant records archived!');
    }
  };

  const handleSendEmailReminder = (email, tenantName, subject) => {
    alert(`Automated Email Sent to ${tenantName} (${email}):\nSubject: ${subject}`);
  };

  const visibleProperties = properties.filter(p => {
    if (userRole === 'Landlord') return true;
    if (userRole === 'Agent') return p.managingAgent === selectedAgent;
    if (userRole === 'Tenant') return p.id === selectedPropertyId;
    return true;
  });

  const selectedProperty = properties.find(p => p.id === selectedPropertyId) || properties[0];

  return (
    <div style={{ fontFamily: `'Segoe UI', Roboto, Arial, sans-serif`, backgroundColor: '#fafaf9', minHeight: '100vh', color: '#1c1917', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      
      <div>
        {/* Header */}
        <header style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #fef9c3 100%)',
          borderBottom: '4px solid #d4af37',
          padding: '25px 20px',
          textAlign: 'center',
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.06)'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '44px',
            fontWeight: '900',
            fontFamily: `Georgia, serif`,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 50%, #996515 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(1px 2px 4px rgba(0, 0, 0, 0.25))'
          }}>
            Falcon U Properties
          </h1>
          <p style={{ color: '#0369a1', margin: '4px 0 15px 0', fontSize: '15px', fontWeight: '600' }}>
            Enterprise Portfolio & Tenancy Management System
          </p>
          <div style={{ display: 'inline-flex', background: '#ffffff', padding: '4px', borderRadius: '8px', border: '1px solid #cbd5e0' }}>
            <button onClick={() => { setUserRole('Landlord'); setCurrentView('dashboard'); }} style={roleButtonStyle(userRole === 'Landlord')}>
              👑 Landlord Admin
            </button>
            <button onClick={() => { setUserRole('Agent'); setCurrentView('dashboard'); }} style={roleButtonStyle(userRole === 'Agent')}>
              👔 Managing Agent
            </button>
            <button onClick={() => { setUserRole('Tenant'); setSelectedPropertyId(1); setCurrentView('property_portal'); }} style={roleButtonStyle(userRole === 'Tenant')}>
              🔑 Tenant Portal
            </button>
          </div>
          {userRole === 'Agent' && (
            <div style={{ marginTop: '10px', fontSize: '13px' }}>
              <label style={{ color: '#0369a1', fontWeight: 'bold', marginRight: '8px' }}>Managing Agent Account:</label>
              <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #7dd3fc' }}>
                <option value="Agent Alpha (London & North)">Agent Alpha (London & North)</option>
                <option value="Agent Beta (Midlands & South)">Agent Beta (Midlands & South)</option>
              </select>
            </div>
          )}
        </header>

        {/* Navigation */}
        <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e7e5e4', padding: '12px 20px', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
          {currentView !== 'dashboard' && userRole !== 'Tenant' && (
            <button onClick={() => setCurrentView('dashboard')} style={homeButtonStyle}>← Home Dashboard</button>
          )}
          {userRole !== 'Tenant' ? (
            <>
              <button onClick={() => setCurrentView('dashboard')} style={navButtonStyle(currentView === 'dashboard')}>🏠 Home Dashboard</button>
              <button onClick={() => setCurrentView('contractors')} style={navButtonStyle(currentView === 'contractors')}>👷 Contractor Directory</button>
              <button onClick={() => setCurrentView('cert_renewals')} style={navButtonStyle(currentView === 'cert_renewals')}>📜 Certificates Due</button>
              <button onClick={() => setCurrentView('insurance_renewals')} style={navButtonStyle(currentView === 'insurance_renewals')}>🛡️ Insurance Due</button>
              <button onClick={() => setCurrentView('visa_expiries')} style={navButtonStyle(currentView === 'visa_expiries')}>🛂 Visa Expiries</button>
              <button onClick={() => setCurrentView('rent_due')} style={navButtonStyle(currentView === 'rent_due')}>💰 Rent Due & Reminders</button>
              <button onClick={() => setCurrentView('rent_increments')} style={navButtonStyle(currentView === 'rent_increments')}>📈 Rent Increments</button>
              {userRole === 'Landlord' && (
                <>
                  <button onClick={() => setCurrentView('add_property')} style={navButtonStyle(currentView === 'add_property')}>+ Add Property</button>
                  <button onClick={() => setCurrentView('tenant_archive')} style={navButtonStyle(currentView === 'tenant_archive')}>📜 Archived Vault (100 Max)</button>
                </>
              )}
            </>
          ) : (
            <span style={{ fontSize: '13px', color: '#0369a1', fontWeight: 'bold' }}>🔑 Assigned Tenant Portal Access</span>
          )}
        </nav>

        <div style={{ maxWidth: '1400px', margin: '25px auto', padding: '0 20px' }}>
          {/* VIEW 1: DASHBOARD */}
          {currentView === 'dashboard' && userRole !== 'Tenant' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                <div onClick={() => setCurrentView('cert_renewals')} style={alertCardStyle}>
                  <span style={labelStyle}>Certificates Renewal</span>
                  <h4 style={{ margin: '5px 0 0 0', color: '#dc2626' }}>📜 7-Day Red Warning Active →</h4>
                </div>
                <div onClick={() => setCurrentView('insurance_renewals')} style={alertCardStyle}>
                  <span style={labelStyle}>Insurance Renewal Due</span>
                  <h4 style={{ margin: '5px 0 0 0', color: '#dc2626' }}>🛡️ View Policy Expiries →</h4>
                </div>
                <div onClick={() => setCurrentView('visa_expiries')} style={alertCardStyle}>
                  <span style={labelStyle}>Tenants Visa Expiries</span>
                  <h4 style={{ margin: '5px 0 0 0', color: '#7c3aed' }}>🛂 Check Expiries & Sharecodes →</h4>
                </div>
                <div onClick={() => setCurrentView('rent_due')} style={alertCardStyle}>
                  <span style={labelStyle}>Rent Collection</span>
                  <h4 style={{ margin: '5px 0 0 0', color: '#15803d' }}>💰 View Due Rent & Email Reminders →</h4>
                </div>
                <div onClick={() => setCurrentView('contractors')} style={alertCardStyle}>
                  <span style={labelStyle}>Suppliers Directory</span>
                  <h4 style={{ margin: '5px 0 0 0', color: '#0369a1' }}>👷 Plumbers, Electricians & Trades →</h4>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', color: '#0369a1', fontFamily: `Georgia, serif` }}>
                  🏠 Portfolio Units ({visibleProperties.length})
                </h3>
                <input
                  type="text"
                  placeholder="Search address or tenant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d6d3d1', width: '280px', backgroundColor: '#ffffff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {visibleProperties.filter(p => p.address.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                  <div key={p.id} style={propertyCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#854d0e', textTransform: 'uppercase' }}>{p.propertyCategory}</span>
                      <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', backgroundColor: p.status === 'Rented' ? '#dcfce7' : '#fef3c7', color: p.status === 'Rented' ? '#15803d' : '#b45309' }}>
                        {p.status}
                      </span>
                    </div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1c1917' }}>{p.address}</h4>
                    <p style={{ margin: '3px 0', fontSize: '13px', color: '#44403c' }}><strong>Tenant:</strong> {p.primaryTenant ? p.primaryTenant.name : 'Vacant'}</p>
                    <p style={{ margin: '3px 0', fontSize: '14px', color: '#0369a1', fontWeight: 'bold' }}>£{p.monthlyRent} / month</p>
                    {p.daysUntilCertExpiry <= 7 && (
                      <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', margin: '8px 0', border: '1px solid #fecaca' }}>
                        🚨 URGENT: Certificate Expiry Due in {p.daysUntilCertExpiry} Days!
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                      <button onClick={() => { setSelectedPropertyId(p.id); setCurrentView('property_portal'); }} style={{ ...skyButtonStyle, flex: '1' }}>📂 Portal</button>
                      <button onClick={() => handleOpenEditTenantModal(p)} style={{ ...outlineButtonStyle, flex: '1' }}>✏️ Edit Details</button>
                      {userRole === 'Landlord' && (
                        <button onClick={() => handleDeleteProperty(p.id)} style={{ ...redButtonStyle, fontSize: '11px' }}>🗑️</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 2: ADD PROPERTY */}
          {currentView === 'add_property' && userRole === 'Landlord' && (
            <div style={whiteCardStyle}>
              <h3 style={sectionHeaderStyle}>+ Add New Property Unit to Portfolio</h3>
              <form onSubmit={handleAddProperty} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                <div>
                  <label style={labelStyle}>Property Address *</label>
                  <input type="text" placeholder="e.g. 104 High Street, London" value={newPropAddress} onChange={(e) => setNewPropAddress(e.target.value)} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Property Category</label>
                  <select value={newPropCategory} onChange={(e) => setNewPropCategory(e.target.value)} style={inputStyle}>
                    <option value="Residential Flat">Residential Flat</option>
                    <option value="Residential House">Residential House</option>
                    <option value="Commercial">Commercial</option>
                    <option value="HMO">HMO</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Monthly Rent (£) *</label>
                  <input type="number" placeholder="e.g. 1400" value={newPropRent} onChange={(e) => setNewPropRent(e.target.value)} required style={inputStyle} />
                </div>
                <div style={{ display: 'flex', alignItems: 'end' }}>
                  <button type="submit" style={goldButtonStyle}>Save Property Unit</button>
                </div>
              </form>
            </div>
          )}

          {/* VIEW 3: CONTRACTOR DIRECTORY */}
          {currentView === 'contractors' && userRole !== 'Tenant' && (
            <div style={whiteCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={sectionHeaderStyle}>👷 Supplier & Builder Contact Directory</h3>
                <button onClick={handleOpenAddContractor} style={goldButtonStyle}>+ Add New Contractor</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '15px' }}>
                {contractors.map(c => (
                  <div key={c.id} style={{ border: '1px solid #cbd5e0', padding: '15px', borderRadius: '8px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#0369a1', textTransform: 'uppercase' }}>{c.trade}</span>
                      <h4 style={{ margin: '4px 0', fontSize: '16px', color: '#1c1917' }}>{c.company}</h4>
                      <p style={{ margin: '2px 0', fontSize: '13px' }}><strong>Contact Person:</strong> {c.person}</p>
                      <p style={{ margin: '2px 0', fontSize: '13px' }}><strong>Phone:</strong> <a href={`tel:${c.phone}`} style={{ color: '#0284c7', fontWeight: 'bold' }}>{c.phone}</a></p>
                      <p style={{ margin: '2px 0', fontSize: '13px' }}><strong>Email:</strong> {c.email}</p>
                      <p style={{ margin: '2px 0', fontSize: '13px' }}><strong>Address:</strong> {c.address || 'N/A'}</p>
                    </div>
                    <button onClick={() => handleOpenEditContractor(c)} style={{ ...outlineButtonStyle, marginTop: '10px' }}>✏️ Edit Contractor Details</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 4: CERTIFICATES DUE */}
          {currentView === 'cert_renewals' && userRole !== 'Tenant' && (
            <div style={whiteCardStyle}>
              <h3 style={sectionHeaderStyle}>📜 Certificates Renewal Schedule (7-Day Red Alerts)</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f4', borderBottom: '2px solid #e7e5e4' }}>
                    <th style={{ padding: '10px' }}>Property Address</th>
                    <th style={{ padding: '10px' }}>Certificate Type</th>
                    <th style={{ padding: '10px' }}>Expiry Due Date</th>
                    <th style={{ padding: '10px' }}>Days Remaining</th>
                    <th style={{ padding: '10px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleProperties.map(p => {
                    const isUrgent = p.daysUntilCertExpiry <= 7;
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid #e7e5e4', backgroundColor: isUrgent ? '#fef2f2' : 'transparent' }}>
                        <td style={{ padding: '10px' }}><strong>{p.address}</strong></td>
                        <td style={{ padding: '10px' }}>Gas Safety (CP12) / EICR</td>
                        <td style={{ padding: '10px', color: isUrgent ? '#dc2626' : '#1c1917', fontWeight: isUrgent ? 'bold' : 'normal' }}>{p.documents.gasCertExpiry}</td>
                        <td style={{ padding: '10px', color: isUrgent ? '#dc2626' : '#1c1917', fontWeight: 'bold' }}>
                          {isUrgent ? `🚨 ${p.daysUntilCertExpiry} Days (URGENT)` : `${p.daysUntilCertExpiry} Days`}
                        </td>
                        <td style={{ padding: '10px' }}>
                          <button onClick={() => alert(`Certificate inspection booked for ${p.address}`)} style={isUrgent ? redButtonStyle : skyButtonStyle}>Book Inspection</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW 5: INSURANCE RENEWALS */}
          {currentView === 'insurance_renewals' && userRole !== 'Tenant' && (
            <div style={whiteCardStyle}>
              <h3 style={sectionHeaderStyle}>🛡️ Insurance Renewal Schedule</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f4', borderBottom: '2px solid #e7e5e4' }}>
                    <th style={{ padding: '10px' }}>Property Address</th>
                    <th style={{ padding: '10px' }}>Provider & Policy No</th>
                    <th style={{ padding: '10px' }}>Annual Amount</th>
                    <th style={{ padding: '10px' }}>Renewal Due Date</th>
                    <th style={{ padding: '10px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleProperties.map(p => {
                    const isUrgent = p.daysUntilInsuranceExpiry <= 7;
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid #e7e5e4', backgroundColor: isUrgent ? '#fef2f2' : 'transparent' }}>
                        <td style={{ padding: '10px' }}><strong>{p.address}</strong></td>
                        <td style={{ padding: '10px' }}>{p.insuranceDetails.provider}<br/><span style={{ fontSize: '12px', color: '#64748b' }}>{p.insuranceDetails.policyNumber}</span></td>
                        <td style={{ padding: '10px' }}>£{p.insuranceDetails.amountPaid}</td>
                        <td style={{ padding: '10px', color: isUrgent ? '#dc2626' : '#1c1917', fontWeight: 'bold' }}>
                          {isUrgent ? `🚨 ${p.insuranceDetails.dueDate} (URGENT)` : p.insuranceDetails.dueDate}
                        </td>
                        <td style={{ padding: '10px' }}>
                          <button onClick={() => alert(`Insurance policy renewal opened for ${p.address}`)} style={isUrgent ? redButtonStyle : skyButtonStyle}>Renew Policy</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW 6: RENT DUE */}
          {currentView === 'rent_due' && userRole !== 'Tenant' && (
            <div style={whiteCardStyle}>
              <h3 style={sectionHeaderStyle}>💰 Rent Collection & Automated Email Reminders</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f4', borderBottom: '2px solid #e7e5e4' }}>
                    <th style={{ padding: '10px' }}>Property Address</th>
                    <th style={{ padding: '10px' }}>Tenant Name</th>
                    <th style={{ padding: '10px' }}>Monthly Rent</th>
                    <th style={{ padding: '10px' }}>Rent Due Date</th>
                    <th style={{ padding: '10px' }}>Payment Status</th>
                    <th style={{ padding: '10px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleProperties.filter(p => p.primaryTenant).map(p => {
                    const isOverdue = p.rentStatus === 'Overdue';
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid #e7e5e4', backgroundColor: isOverdue ? '#fef2f2' : 'transparent' }}>
                        <td style={{ padding: '10px' }}><strong>{p.address}</strong></td>
                        <td style={{ padding: '10px' }}>{p.primaryTenant.name}<br/><span style={{ fontSize: '12px', color: '#64748b' }}>{p.primaryTenant.email}</span></td>
                        <td style={{ padding: '10px' }}>£{p.monthlyRent}</td>
                        <td style={{ padding: '10px' }}>{p.rentDueDate}</td>
                        <td style={{ padding: '10px', color: isOverdue ? '#dc2626' : '#15803d', fontWeight: 'bold' }}>
                          {isOverdue ? `🚨 Overdue (${p.daysOverdue} Days)` : 'Paid'}
                        </td>
                        <td style={{ padding: '10px' }}>
                          <button onClick={() => handleSendEmailReminder(p.primaryTenant.email, p.primaryTenant.name, 'Overdue Rent Payment Notice')} style={isOverdue ? redButtonStyle : skyButtonStyle}>
                            ✉️ Send Email Reminder
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW 7: RENT INCREMENTS */}
          {currentView === 'rent_increments' && userRole !== 'Tenant' && (
            <div style={whiteCardStyle}>
              <h3 style={sectionHeaderStyle}>📈 Rent Increment Review & Section 13 Email Notices</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f4', borderBottom: '2px solid #e7e5e4' }}>
                    <th style={{ padding: '10px' }}>Property Address</th>
                    <th style={{ padding: '10px' }}>Tenancy Start Date</th>
                    <th style={{ padding: '10px' }}>Current Rent</th>
                    <th style={{ padding: '10px' }}>Proposed Rent (£)</th>
                    <th style={{ padding: '10px' }}>Increase (%)</th>
                    <th style={{ padding: '10px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleProperties.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #e7e5e4' }}>
                      <td style={{ padding: '10px' }}><strong>{p.address}</strong></td>
                      <td style={{ padding: '10px' }}>{p.tenancyStartDate}</td>
                      <td style={{ padding: '10px' }}>£{p.monthlyRent}</td>
                      <td style={{ padding: '10px' }}>£{p.proposedRent}</td>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: '#0369a1' }}>+{p.rentIncreasePercent}%</td>
                      <td style={{ padding: '10px' }}>
                        <button onClick={() => handleSendEmailReminder(p.primaryTenant ? p.primaryTenant.email : 'N/A', p.primaryTenant ? p.primaryTenant.name : 'Tenant', 'Section 13 Rent Increase Notice')} style={skyButtonStyle}>
                          ✉️ Issue Increment Email
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW 8: VISA EXPIRIES */}
          {currentView === 'visa_expiries' && userRole !== 'Tenant' && (
            <div style={whiteCardStyle}>
              <h3 style={sectionHeaderStyle}>🛂 Tenants & Household Family Visa Expiry Monitor</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f4', borderBottom: '2px solid #e7e5e4' }}>
                    <th style={{ padding: '10px' }}>Property Address</th>
                    <th style={{ padding: '10px' }}>Tenant Name</th>
                    <th style={{ padding: '10px' }}>Visa Category</th>
                    <th style={{ padding: '10px' }}>Right to Rent Sharecode</th>
                    <th style={{ padding: '10px' }}>Visa Expiry Date</th>
                    <th style={{ padding: '10px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleProperties.filter(p => p.primaryTenant && !p.primaryTenant.isUkPassportHolder).map(p => {
                    const t = p.primaryTenant;
                    const isUrgent = t.daysUntilVisaExpiry <= 7;
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid #e7e5e4', backgroundColor: isUrgent ? '#fef2f2' : 'transparent' }}>
                        <td style={{ padding: '10px' }}><strong>{p.address}</strong></td>
                        <td style={{ padding: '10px' }}>{t.name}</td>
                        <td style={{ padding: '10px' }}>{t.visaCategory}</td>
                        <td style={{ padding: '10px' }}><code>{t.rightToRentCode}</code></td>
                        <td style={{ padding: '10px', color: isUrgent ? '#dc2626' : '#1c1917', fontWeight: 'bold' }}>
                          {isUrgent ? `🚨 ${t.visaExpiryDate} (URGENT)` : t.visaExpiryDate}
                        </td>
                        <td style={{ padding: '10px' }}>
                          <button onClick={() => handleSendEmailReminder(t.email, t.name, 'Right to Rent Sharecode Update Reminder')} style={isUrgent ? redButtonStyle : skyButtonStyle}>
                            ✉️ Send Sharecode Reminder
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW 9: ARCHIVED VAULT (100 MAX) */}
          {currentView === 'tenant_archive' && userRole === 'Landlord' && (
            <div style={whiteCardStyle}>
              <h3 style={sectionHeaderStyle}>📜 Historic Tenants Archive Vault (Up to 100 Records Preserved)</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', marginTop: '10px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f4', borderBottom: '2px solid #e7e5e4' }}>
                    <th style={{ padding: '10px' }}>Former Property Address</th>
                    <th style={{ padding: '10px' }}>Tenant Name</th>
                    <th style={{ padding: '10px' }}>Contact Details</th>
                    <th style={{ padding: '10px' }}>Visa Category & Sharecode</th>
                    <th style={{ padding: '10px' }}>Tenancy Start Date</th>
                    <th style={{ padding: '10px' }}>Archived Date</th>
                  </tr>
                </thead>
                <tbody>
                  {archivedTenantsVault.map((rec, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e7e5e4' }}>
                      <td style={{ padding: '10px' }}><strong>{rec.propertyAddress}</strong></td>
                      <td style={{ padding: '10px' }}>{rec.tenantName}</td>
                      <td style={{ padding: '10px' }}>{rec.phone}<br/><span style={{ fontSize: '12px', color: '#64748b' }}>{rec.email}</span></td>
                      <td style={{ padding: '10px' }}>{rec.visaStatus}<br/><code>{rec.rightToRentCode}</code></td>
                      <td style={{ padding: '10px' }}>{rec.tenancyStartDate}</td>
                      <td style={{ padding: '10px', color: '#0369a1' }}>{rec.archivedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW 10: PROPERTY PORTAL */}
          {currentView === 'property_portal' && (
            <div style={whiteCardStyle}>
              {userRole !== 'Tenant' && (
                <button onClick={() => setCurrentView('dashboard')} style={{ ...homeButtonStyle, marginBottom: '20px' }}>← Back to Home Dashboard</button>
              )}

              {/* Emergency Hazard Banner */}
              <div style={{ backgroundColor: '#fef2f2', border: '2px solid #fca5a5', padding: '15px 20px', borderRadius: '8px', marginBottom: '25px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#991b1b', fontSize: '16px' }}>🚨 Emergency Hazard Contacts</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px', fontSize: '13px' }}>
                  <div>🔥 <strong>Gas Smell Leak Hotline:</strong> <a href="tel:0800111999" style={{ color: '#dc2626', fontWeight: 'bold' }}>0800 111 999</a> (National Gas Emergency)</div>
                  <div>⚡ <strong>Live Electrical Fault / Outage:</strong> <a href="tel:105" style={{ color: '#dc2626', fontWeight: 'bold' }}>105</a> (Emergency Power Line)</div>
                </div>
              </div>

              <div style={{ borderBottom: '2px solid #e7e5e4', paddingBottom: '15px', marginBottom: '20px' }}>
                <h2 style={{ color: '#0369a1', margin: 0, fontFamily: `Georgia, serif` }}>{selectedProperty.address}</h2>
                <p style={{ color: '#0284c7', fontWeight: 'bold', margin: '5px 0 0 0' }}>Category: {selectedProperty.propertyCategory} | Status: {selectedProperty.status} | Managing Agent: {selectedProperty.managingAgent}</p>
              </div>

              {/* Tenancy & Banking Contract Details */}
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '15px', borderRadius: '8px', marginBottom: '25px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#166534', fontFamily: `Georgia, serif` }}>📜 Tenancy Contract & Rent Account</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px', fontSize: '13px' }}>
                  <p style={{ margin: 0 }}><strong>Agreement Executed Between:</strong> {selectedProperty.contractParties}</p>
                  <p style={{ margin: 0 }}><strong>Rent Due Date:</strong> {selectedProperty.rentDueDate}</p>
                  <p style={{ margin: 0 }}><strong>Tenancy Start Date:</strong> {selectedProperty.tenancyStartDate}</p>
                  <p style={{ margin: 0 }}><strong>Rent Payment Bank Details:</strong> <span style={{ color: '#15803d', fontWeight: 'bold' }}>{selectedProperty.rentPaymentBankAccount}</span></p>
                </div>
              </div>

              {/* Commercial Specifications */}
              {selectedProperty.commercialDetails && (
                <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', padding: '18px', borderRadius: '8px', marginBottom: '25px' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#0369a1', fontFamily: `Georgia, serif` }}>🏬 Commercial Lease Specifications</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '14px' }}>
                    <p style={{ margin: 0 }}><strong>Lease Start Year:</strong> {selectedProperty.commercialDetails.leaseStartYear}</p>
                    <p style={{ margin: 0 }}><strong>Total Lease Term:</strong> {selectedProperty.commercialDetails.leaseTermYears} Years</p>
                    <p style={{ margin: 0 }}><strong>Remaining Lease:</strong> <span style={{ color: '#0284c7', fontWeight: 'bold' }}>{selectedProperty.commercialDetails.leaseRemainingYears} Years</span></p>
                    <p style={{ margin: 0 }}><strong>Business Rates Valuation:</strong> {selectedProperty.commercialDetails.businessRatesValuation}</p>
                    <p style={{ margin: 0 }}><strong>Business Rates Ref:</strong> {selectedProperty.commercialDetails.businessRatesReference}</p>
                  </div>
                </div>
              )}

              {/* Household Roster Profile */}
              {selectedProperty.primaryTenant && (
                <div style={{ border: '1px solid #bae6fd', padding: '20px', borderRadius: '8px', marginBottom: '25px', backgroundColor: '#f0f9ff' }}>
                  <h3 style={{ margin: '0 0 12px 0', color: '#0369a1', fontFamily: `Georgia, serif` }}>👤 Tenancy & Household Roster Profile</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', fontSize: '14px', marginBottom: '15px' }}>
                    <p style={{ margin: 0 }}><strong>Primary Tenant:</strong> {selectedProperty.primaryTenant.name}</p>
                    <p style={{ margin: 0 }}><strong>Phone:</strong> {selectedProperty.primaryTenant.phone}</p>
                    <p style={{ margin: 0 }}><strong>Email:</strong> {selectedProperty.primaryTenant.email}</p>
                    <p style={{ margin: 0 }}><strong>Job Status:</strong> {selectedProperty.primaryTenant.jobStatus}</p>
                    <p style={{ margin: 0 }}><strong>Country of Origin:</strong> {selectedProperty.primaryTenant.countryOfOrigin}</p>
                    <p style={{ margin: 0 }}><strong>Passport No:</strong> {selectedProperty.primaryTenant.passportNumber}</p>
                    <p style={{ margin: 0 }}><strong>Visa Category:</strong> {selectedProperty.primaryTenant.visaCategory}</p>
                    <p style={{ margin: 0 }}><strong>Visa Expiry Date:</strong> <strong style={{ color: '#dc2626' }}>{selectedProperty.primaryTenant.visaExpiryDate}</strong></p>
                    <p style={{ margin: 0 }}><strong>Right to Rent Sharecode:</strong> <code>{selectedProperty.primaryTenant.rightToRentCode}</code></p>
                    <p style={{ margin: 0 }}><strong>Deposit Paid:</strong> £{selectedProperty.primaryTenant.depositAmount} ({selectedProperty.primaryTenant.dpsCompany})</p>
                  </div>

                  <h4 style={{ margin: '15px 0 10px 0', color: '#0369a1' }}>Registered Household Members ({selectedProperty.primaryTenant.totalOccupantsLivingInHouse} Persons)</h4>
                  {selectedProperty.primaryTenant.householdMembers.map((fam, i) => (
                    <div key={i} style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '6px', border: '1px solid #bae6fd', marginBottom: '8px', fontSize: '13px' }}>
                      <strong>{fam.name}</strong> ({fam.relationship}) | Job: {fam.jobStatus} | Visa: {fam.visaCategory} | Expiry: <span style={{ color: '#dc2626', fontWeight: 'bold' }}>{fam.visaExpiryDate}</span> | Sharecode: <code>{fam.rightToRentCode}</code>
                    </div>
                  ))}

                  {/* Tenant Self-Service Form */}
                  <form onSubmit={(e) => handleAddHouseholdMember(e, selectedProperty.id)} style={{ marginTop: '15px', background: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                    <input type="text" placeholder="Member Name" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} style={inputStyle} />
                    <input type="text" placeholder="Relationship" value={newMemberRel} onChange={(e) => setNewMemberRel(e.target.value)} style={inputStyle} />
                    <input type="text" placeholder="Job Status" value={newMemberJob} onChange={(e) => setNewMemberJob(e.target.value)} style={inputStyle} />
                    <input type="text" placeholder="Visa Category" value={newMemberVisa} onChange={(e) => setNewMemberVisa(e.target.value)} style={inputStyle} />
                    <input type="date" value={newMemberExpiry} onChange={(e) => setNewMemberExpiry(e.target.value)} style={inputStyle} />
                    <input type="text" placeholder="Sharecode" value={newMemberCode} onChange={(e) => setNewMemberCode(e.target.value)} style={inputStyle} />
                    <button type="submit" style={skyButtonStyle}>+ Add Member</button>
                  </form>
                </div>
              )}

              {/* Utility Suppliers */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e0', padding: '15px', borderRadius: '8px', marginBottom: '25px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#0369a1', fontFamily: `Georgia, serif` }}>⚡ Utility Suppliers (Residential & Commercial)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', fontSize: '13px' }}>
                  <p style={{ margin: 0 }}><strong>Gas Supplier:</strong> {selectedProperty.utilitySuppliers.gasSupplier} ({selectedProperty.utilitySuppliers.gasAccountNumber})</p>
                  <p style={{ margin: 0 }}><strong>Electricity Supplier:</strong> {selectedProperty.utilitySuppliers.electricSupplier} ({selectedProperty.utilitySuppliers.electricAccountNumber})</p>
                  <p style={{ margin: 0 }}><strong>Water Supplier:</strong> {selectedProperty.utilitySuppliers.waterSupplier} ({selectedProperty.utilitySuppliers.waterAccountNumber})</p>
                </div>
              </div>

              {/* Meter Readings */}
              <div style={{ border: '1px solid #cbd5e0', padding: '18px', borderRadius: '8px', marginBottom: '25px', backgroundColor: '#ffffff' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#0369a1', fontFamily: `Georgia, serif` }}>📊 Gas & Electricity Meter Readings</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px', fontSize: '13px', marginBottom: '15px' }}>
                  <div style={{ background: '#fafafa', padding: '12px', borderRadius: '6px', border: '1px solid #e7e5e4' }}>
                    <h5 style={{ margin: '0 0 6px 0', color: '#1c1917' }}>Move-In Start Meter Readings</h5>
                    <p style={{ margin: '2px 0' }}><strong>Gas Meter:</strong> {selectedProperty.meterReadings.startGasMeter} (Photo: {selectedProperty.meterReadings.startGasPhoto})</p>
                    <p style={{ margin: '2px 0' }}><strong>Electric Meter:</strong> {selectedProperty.meterReadings.startElectricMeter} (Photo: {selectedProperty.meterReadings.startElectricPhoto})</p>
                  </div>
                  <div style={{ background: '#fafafa', padding: '12px', borderRadius: '6px', border: '1px solid #e7e5e4' }}>
                    <h5 style={{ margin: '0 0 6px 0', color: '#1c1917' }}>Move-Out Closing Meter Readings</h5>
                    <p style={{ margin: '2px 0' }}><strong>Gas Closing:</strong> {selectedProperty.meterReadings.closingGasMeter} (Photo: {selectedProperty.meterReadings.closingGasPhoto})</p>
                    <p style={{ margin: '2px 0' }}><strong>Electric Closing:</strong> {selectedProperty.meterReadings.closingElectricMeter} (Photo: {selectedProperty.meterReadings.closingElectricPhoto})</p>
                  </div>
                </div>

                <form onSubmit={(e) => handleUpdateClosingMeters(e, selectedProperty.id)} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                  <input type="text" placeholder="Closing Gas Reading" value={closingGasInput} onChange={(e) => setClosingGasInput(e.target.value)} style={inputStyle} />
                  <input type="text" placeholder="Gas Photo Ref" value={closingGasPhotoInput} onChange={(e) => setClosingGasPhotoInput(e.target.value)} style={inputStyle} />
                  <input type="text" placeholder="Closing Elec Reading" value={closingElecInput} onChange={(e) => setClosingElecInput(e.target.value)} style={inputStyle} />
                  <input type="text" placeholder="Elec Photo Ref" value={closingElecPhotoInput} onChange={(e) => setClosingElecPhotoInput(e.target.value)} style={inputStyle} />
                  <button type="submit" style={skyButtonStyle}>Submit Closing Readings</button>
                </form>
              </div>

              {/* Maintenance Ticketing */}
              <div style={{ border: '1px solid #cbd5e0', padding: '20px', borderRadius: '8px', marginBottom: '25px', backgroundColor: '#ffffff' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#0369a1', fontFamily: `Georgia, serif` }}>🛠️ Report Maintenance Issue</h3>
                <form onSubmit={(e) => handleCreateTicket(e, selectedProperty.id)} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '15px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={labelStyle}>Category</label>
                      <select value={ticketCategory} onChange={(e) => setTicketCategory(e.target.value)} style={inputStyle}>
                        <option value="Water Leak">💧 Water Leak</option>
                        <option value="Heating / Gas">🔥 Heating / Gas</option>
                        <option value="Electrical">⚡ Electrical</option>
                        <option value="Appliance">🍳 Appliance</option>
                        <option value="Other">🔒 Other Repairs</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Upload Video / Photo Attachment Reference</label>
                      <input type="text" placeholder="e.g. leak_video_proof.mp4" value={ticketMedia} onChange={(e) => setTicketMedia(e.target.value)} style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Detailed Issue Description (Multi-line up to 100+ words)</label>
                    <textarea
                      rows="4"
                      placeholder="Describe the problem clearly in detail..."
                      value={ticketDescription}
                      onChange={(e) => setTicketDescription(e.target.value)}
                      style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }}
                    />
                  </div>
                  <button type="submit" style={{ ...skyButtonStyle, width: '200px' }}>Submit Issue Ticket</button>
                </form>

                <h4 style={{ margin: '15px 0 10px 0', color: '#1c1917' }}>Logged Maintenance Tickets ({selectedProperty.tickets ? selectedProperty.tickets.length : 0})</h4>
                {selectedProperty.tickets && selectedProperty.tickets.length > 0 ? (
                  selectedProperty.tickets.map(t => (
                    <div key={t.id} style={{ background: '#fafafa', padding: '12px', borderRadius: '6px', border: '1px solid #d6d3d1', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>{t.category}</strong>
                        <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', backgroundColor: t.status === 'Resolved' ? '#dcfce7' : '#fee2e2', color: t.status === 'Resolved' ? '#15803d' : '#991b1b' }}>{t.status}</span>
                      </div>
                      <p style={{ margin: '4px 0', fontSize: '13px' }}>{t.description}</p>
                      <p style={{ margin: '0', fontSize: '11px', color: '#78716c' }}>Submitted on: {t.dateSubmitted} | Attachment: {t.mediaUrl}</p>
                    </div>
                  ))
                ) : <p style={{ fontSize: '13px', color: '#78716c' }}>No maintenance issues currently logged for this property.</p>}
              </div>

              {/* Compliance Documents */}
              <div>
                <h3 style={sectionHeaderStyle}>📄 Property Compliance & Official Certificates Portal</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                  <div style={{ border: '1px solid #e7e5e4', padding: '18px', borderRadius: '8px', backgroundColor: '#ffffff' }}>
                    <h4 style={{ margin: '0 0 12px 0', color: '#0369a1' }}>Agreements & Selective Licensing</h4>
                    
                    <div style={docRowStyle}>
                      <div>
                        <strong>Tenancy Agreement Contract</strong>
                        <p style={subTextStyle}>{selectedProperty.documents.tenancyAgreementDoc}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleDownloadDoc(selectedProperty.documents.tenancyAgreementDoc)} style={outlineButtonStyle}>Download</button>
                        {userRole !== 'Tenant' && <button onClick={() => handleUploadDoc('Tenancy Agreement')} style={skyButtonStyle}>Upload</button>}
                      </div>
                    </div>
                    <div style={docRowStyle}>
                      <div>
                        <strong>DPS Deposit Protection Certificate</strong>
                        <p style={subTextStyle}>{selectedProperty.documents.depositCertificateDoc}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleDownloadDoc(selectedProperty.documents.depositCertificateDoc)} style={outlineButtonStyle}>Download</button>
                        {userRole !== 'Tenant' && <button onClick={() => handleUploadDoc('Deposit Certificate')} style={skyButtonStyle}>Upload</button>}
                      </div>
                    </div>
                    <div style={docRowStyle}>
                      <div>
                        <strong>Selective License Certificate</strong>
                        <p style={subTextStyle}>Lic No: {selectedProperty.documents.selectiveLicenseNo}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleDownloadDoc(selectedProperty.documents.selectiveLicenseDoc)} style={outlineButtonStyle}>Download</button>
                        {userRole !== 'Tenant' && <button onClick={() => handleUploadDoc('Selective License')} style={skyButtonStyle}>Upload</button>}
                      </div>
                    </div>
                  </div>

                  <div style={{ border: '1px solid #e7e5e4', padding: '18px', borderRadius: '8px', backgroundColor: '#ffffff' }}>
                    <h4 style={{ margin: '0 0 12px 0', color: '#0369a1' }}>Safety Compliance Certificates</h4>
                    
                    <div style={docRowStyle}>
                      <div>
                        <strong>Gas Safety Certificate (CP12)</strong>
                        <p style={{ ...subTextStyle, color: '#dc2626', fontWeight: 'bold' }}>Expiry: {selectedProperty.documents.gasCertExpiry}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleDownloadDoc(selectedProperty.documents.gasCertDoc)} style={outlineButtonStyle}>Download</button>
                        {userRole !== 'Tenant' && <button onClick={() => handleUploadDoc('Gas Certificate')} style={skyButtonStyle}>Upload</button>}
                      </div>
                    </div>
                    <div style={docRowStyle}>
                      <div>
                        <strong>EICR Electrical Report</strong>
                        <p style={subTextStyle}>Expiry: {selectedProperty.documents.eicrExpiry}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleDownloadDoc(selectedProperty.documents.eicrDoc)} style={outlineButtonStyle}>Download</button>
                        {userRole !== 'Tenant' && <button onClick={() => handleUploadDoc('EICR Certificate')} style={skyButtonStyle}>Upload</button>}
                      </div>
                    </div>
                    <div style={docRowStyle}>
                      <div>
                        <strong>Energy Performance (EPC)</strong>
                        <p style={subTextStyle}>Rating: {selectedProperty.documents.epcRating} | Exp: {selectedProperty.documents.epcExpiry}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleDownloadDoc(selectedProperty.documents.epcDoc)} style={outlineButtonStyle}>Download</button>
                        {userRole !== 'Tenant' && <button onClick={() => handleUploadDoc('EPC Certificate')} style={skyButtonStyle}>Upload</button>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* MODAL: ADD / EDIT CONTRACTOR */}
      {showContractorModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ margin: '0 0 15px 0', color: '#0369a1' }}>{editingContractorId ? '✏️ Edit Contractor Details' : '+ Add New Supplier / Contractor'}</h3>
            <form onSubmit={handleSaveContractor} style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Trade / Category</label>
                <select value={newTrade} onChange={(e) => setNewTrade(e.target.value)} style={inputStyle}>
                  <option value="Plumber">Plumber</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Gas Engineer">Gas Engineer</option>
                  <option value="Builder & General">Builder & General</option>
                  <option value="Painter & Decorator">Painter & Decorator</option>
                  <option value="Cleaner">Cleaner</option>
                  <option value="Carpenter">Carpenter</option>
                </select>
              </div>
              <input type="text" placeholder="Company Name *" value={newCompany} onChange={(e) => setNewCompany(e.target.value)} required style={inputStyle} />
              <input type="text" placeholder="Contact Person Name *" value={newPerson} onChange={(e) => setNewPerson(e.target.value)} required style={inputStyle} />
              <input type="text" placeholder="Phone Number *" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} required style={inputStyle} />
              <input type="email" placeholder="Email Address" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} style={inputStyle} />
              <input type="text" placeholder="Full Address (Street, City, Postcode)" value={newContractorAddress} onChange={(e) => setNewContractorAddress(e.target.value)} style={inputStyle} />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ ...skyButtonStyle, flex: '1' }}>Save Contractor</button>
                <button type="button" onClick={() => setShowContractorModal(false)} style={{ ...outlineButtonStyle, flex: '1' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT TENANT & VISA SHARECODE */}
      {editingPropertyId && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ margin: '0 0 15px 0', color: '#0369a1' }}>✏️ Edit Tenant, Visa & Sharecode</h3>
            <form onSubmit={handleSaveTenantEdits} style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Tenant Full Name</label>
                <input type="text" value={editTenantName} onChange={(e) => setEditTenantName(e.target.value)} required style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={editTenantEmail} onChange={(e) => setEditTenantEmail(e.target.value)} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input type="text" value={editTenantPhone} onChange={(e) => setEditTenantPhone(e.target.value)} required style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Tenancy Start Date</label>
                <input type="date" value={editTenancyStart} onChange={(e) => setEditTenancyStart(e.target.value)} required style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={labelStyle}>Visa Category</label>
                  <input type="text" value={editVisaCategory} onChange={(e) => setEditVisaCategory(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Visa Expiry Date</label>
                  <input type="date" value={editVisaExpiry} onChange={(e) => setEditVisaExpiry(e.target.value)} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Right to Rent Sharecode</label>
                <input type="text" value={editShareCode} onChange={(e) => setEditShareCode(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ ...skyButtonStyle, flex: '1' }}>Save Edits</button>
                <button type="button" onClick={() => setEditingPropertyId(null)} style={{ ...outlineButtonStyle, flex: '1' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Universal Executive Footer */}
      <footer style={{
        backgroundColor: '#0369a1',
        borderTop: '3px solid #0284c7',
        color: '#f0f9ff',
        padding: '20px 30px',
        textAlign: 'center',
        marginTop: '40px',
        fontSize: '13px'
      }}>
        <p style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: '#ffffff', fontSize: '16px', fontFamily: `Georgia, serif` }}>Falcon U Properties Management</p>
        <p style={{ margin: '3px 0' }}>
          📞 <strong>Helpline:</strong> <a href="tel:02071835494" style={{ color: '#bae6fd', textDecoration: 'none', fontWeight: 'bold' }}>02071835494</a> | ✉️ <strong>Email:</strong> <span style={{ color: '#ffffff' }}>support@falconuproperties.com</span>
        </p>
        <p style={{ margin: '3px 0', color: '#e0f2fe' }}>Office Hours: Monday – Friday: 9:30 AM – 5:00 PM (Closed on Bank Holidays)</p>
        <p style={{ margin: '10px 0 0 0', fontSize: '11px', color: '#bae6fd' }}>© {new Date().getFullYear()} Falcon U Properties. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// Styling Declarations
const whiteCardStyle = { backgroundColor: '#ffffff', padding: '24px', borderRadius: '10px', border: '1px solid #e7e5e4', boxShadow: '0 2px 4px rgba(0,0,0,0.03)', marginBottom: '20px' };
const propertyCardStyle = { backgroundColor: '#ffffff', padding: '20px', borderRadius: '10px', border: '1px solid #e7e5e4', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' };
const alertCardStyle = { backgroundColor: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e0', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' };
const labelStyle = { fontSize: '11px', color: '#1c1917', fontWeight: 'bold', textTransform: 'uppercase' };
const sectionHeaderStyle = { margin: '0 0 15px 0', fontSize: '18px', color: '#0369a1', fontFamily: `Georgia, serif`, borderBottom: '2px solid #e7e5e4', paddingBottom: '8px' };
const skyButtonStyle = { backgroundColor: '#0369a1', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' };
const goldButtonStyle = { backgroundColor: '#b8860b', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' };
const redButtonStyle = { backgroundColor: '#dc2626', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' };
const homeButtonStyle = { backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' };
const outlineButtonStyle = { backgroundColor: '#ffffff', color: '#0369a1', border: '1px solid #bae6fd', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '13px', boxSizing: 'border-box' };
const docRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f5f5f4' };
const subTextStyle = { margin: '2px 0 0 0', fontSize: '12px', color: '#78716c' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: '#ffffff', padding: '25px', borderRadius: '10px', width: '90%', maxWidth: '500px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' };

const roleButtonStyle = (isActive) => ({
  padding: '6px 16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '13px',
  backgroundColor: isActive ? '#0369a1' : 'transparent',
  color: isActive ? '#ffffff' : '#0369a1'
});

const navButtonStyle = (isActive) => ({
  backgroundColor: isActive ? '#0369a1' : '#ffffff',
  color: isActive ? '#ffffff' : '#44403c',
  border: '1px solid #cbd5e0',
  padding: '8px 14px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 'bold'
});

export default App;