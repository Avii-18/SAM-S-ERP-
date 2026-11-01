import {
  UAEProject,
  WBSActivity,
  ContractMilestone,
  MasterBOQItem,
  TenderBid,
  VariationOrder,
  IPCClaim,
  MaterialRequisition,
  PurchaseOrder,
  GRNInspection,
  SubcontractWorkOrder,
  JointMeasurementSheet,
  DigitalMBEntry,
  ExtraItemVariation,
  StatutoryVATRecord,
  HREmployee,
  CampFacility,
  SiteAsset,
  DailyProgressReport,
  QAQCInspectionItem,
  HSEIncidentOrPTW,
  EngineeringDrawingRFI,
  CRMLeadOpportunity,
  ERPUser,
} from '../types/erp';

export const CURRENT_USER: ERPUser = {
  id: 'usr-001',
  name: 'Ahmed Al Mansoori',
  role: 'Project Director',
  email: 'ahmed.mansoori@samssolution.ae',
  avatar: 'AM',
  department: 'Executive Administration & PMO',
};

export const INITIAL_PROJECTS: UAEProject[] = [
  {
    id: 'PRJ-DXB-MARINA-01',
    code: 'PRJ-DXB-01',
    name: 'Dubai Marina Tower',
    location: 'Dubai Marina, Waterfront Walk, Dubai, UAE',
    emirate: 'Dubai',
    client: 'EMAAR',
    consultant: 'Dar Al-Handasah Consultants',
    type: 'Luxury Residential Waterfront Tower (3B+G+48)',
    areaSqFt: 620000,
    areaSqM: 57599,
    floors: 49,
    basements: 3,
    startDate: '2025-01-15',
    targetFinishDate: '2025-12-30',
    durationMonths: 24,
    currentMonth: 10,
    contractBaselineAED: 84000000,
    actualCostAED: 52000000,
    certifiedWorkAED: 65520000,
    paidAED: 58900000,
    retentionAED: 6552000,
    status: 'In Progress',
    scheduleMode: 'PRIMAVERA',
    contractType: 'FIDIC Red Book Lump Sum',
    currency: 'AED',
  },
  {
    id: 'PRJ-DXB-BB-02',
    code: 'PRJ-DXB-02',
    name: 'Business Bay Complex',
    location: 'Business Bay, Marasi Drive, Dubai, UAE',
    emirate: 'Dubai',
    client: 'Damac',
    consultant: 'KEO International Consultants',
    type: 'Mixed-Use Commercial & Luxury Suites (2B+G+34)',
    areaSqFt: 480000,
    areaSqM: 44593,
    floors: 35,
    basements: 2,
    startDate: '2025-02-01',
    targetFinishDate: '2025-11-30',
    durationMonths: 22,
    currentMonth: 9,
    contractBaselineAED: 62500000,
    actualCostAED: 38200000,
    certifiedWorkAED: 40625000,
    paidAED: 35000000,
    retentionAED: 4062500,
    status: 'In Progress',
    scheduleMode: 'BENCHMARK',
    contractType: 'FIDIC Red Book Lump Sum',
    currency: 'AED',
  },
  {
    id: 'PRJ-DXB-JVC-03',
    code: 'PRJ-DXB-03',
    name: 'JVC Residential',
    location: 'Jumeirah Village Circle (JVC) District 12, Dubai, UAE',
    emirate: 'Dubai',
    client: 'Nakheel',
    consultant: 'National Engineering Bureau (NEB)',
    type: 'Contemporary Mid-Rise Luxury Residences (G+8)',
    areaSqFt: 290000,
    areaSqM: 26941,
    floors: 9,
    basements: 1,
    startDate: '2025-03-01',
    targetFinishDate: '2025-12-15',
    durationMonths: 18,
    currentMonth: 8,
    contractBaselineAED: 34000000,
    actualCostAED: 24600000,
    certifiedWorkAED: 27880000,
    paidAED: 25100000,
    retentionAED: 2788000,
    status: 'In Progress',
    scheduleMode: 'PRIMAVERA',
    contractType: 'FIDIC Red Book Lump Sum',
    currency: 'AED',
  },
  {
    id: 'PRJ-SHJ-ALJADA-200',
    code: 'PRJ-SHJ-01',
    name: 'Aljada Residential Towers (Block C - Sharjah)',
    location: 'Aljada, University City Rd, Sharjah, UAE',
    emirate: 'Sharjah',
    client: 'Arada Developments LLC',
    consultant: 'Khatib & Alami Engineering Consultants',
    type: 'Residential High-Rise Tower (B+G+20)',
    areaSqFt: 350000,
    areaSqM: 32516,
    floors: 21,
    basements: 1,
    startDate: '2026-02-01',
    targetFinishDate: '2028-01-31',
    durationMonths: 24,
    currentMonth: 9,
    contractBaselineAED: 24500000,
    actualCostAED: 8650000,
    certifiedWorkAED: 9800000,
    paidAED: 7850000,
    retentionAED: 980000,
    status: 'In Progress',
    scheduleMode: 'BENCHMARK',
    contractType: 'FIDIC Red Book Lump Sum',
    currency: 'AED',
  },
  {
    id: 'PRJ-MUWAILEH-02',
    code: 'PRJ-SHJ-03',
    name: 'Muwaileh Commercial & Medical Complex',
    location: 'Muwaileh Commercial District, Sharjah, UAE',
    emirate: 'Sharjah',
    client: 'Sharjah Holding / Alef Group',
    consultant: 'National Engineering Bureau (NEB)',
    type: 'Commercial & Retail (G+4)',
    areaSqFt: 140000,
    areaSqM: 13006,
    floors: 5,
    basements: 0,
    startDate: '2026-06-01',
    targetFinishDate: '2027-08-01',
    durationMonths: 14,
    currentMonth: 5,
    contractBaselineAED: 14200000,
    actualCostAED: 4900000,
    certifiedWorkAED: 5680000,
    paidAED: 4544000,
    retentionAED: 568000,
    status: 'In Progress',
    scheduleMode: 'BENCHMARK',
    contractType: 'Item Rate Schedule',
    currency: 'AED',
  },
  {
    id: 'PRJ-SAJAA-HUB',
    code: 'YARD-SHJ-04',
    name: "Saja'a Central Logistics, Formwork & Batching Hub",
    location: "Saja'a Industrial Zone, Sharjah, UAE",
    emirate: 'Sharjah',
    client: 'Internal Enterprise Operations',
    consultant: 'Internal Engineering Services',
    type: 'Central Industrial Yard & Labour Camp',
    areaSqFt: 220000,
    areaSqM: 20438,
    floors: 2,
    basements: 0,
    startDate: '2025-01-01',
    targetFinishDate: '2030-12-31',
    durationMonths: 72,
    currentMonth: 22,
    contractBaselineAED: 8500000,
    actualCostAED: 6200000,
    certifiedWorkAED: 7200000,
    paidAED: 7000000,
    retentionAED: 0,
    status: 'In Progress',
    scheduleMode: 'BENCHMARK',
    contractType: 'Cost Plus Fee',
    currency: 'AED',
  },
];

export const INITIAL_WBS_ACTIVITIES: WBSActivity[] = [
  { id: 101, projectId: 'PRJ-SHJ-ALJADA-200', wbs: '1.0', name: 'Design, Municipality Approvals & Mobilisation', startMonth: 1, finishMonth: 3, weight: 4.5, progress: 100, predecessor: '-' },
  { id: 102, projectId: 'PRJ-SHJ-ALJADA-200', wbs: '2.0', name: 'Enabling Works, Secant Piles Shoring & Bulk Excavation', startMonth: 2, finishMonth: 5, weight: 6.5, progress: 100, predecessor: '1.0' },
  { id: 103, projectId: 'PRJ-SHJ-ALJADA-200', wbs: '3.0', name: 'Piling Foundation & Raft Concrete Pouring (SRC C40/50)', startMonth: 4, finishMonth: 7, weight: 11.0, progress: 100, predecessor: '2.0' },
  { id: 104, projectId: 'PRJ-SHJ-ALJADA-200', wbs: '4.0', name: 'Basement Retaining Walls, Waterstops & Substructure to GF Slab', startMonth: 6, finishMonth: 9, weight: 7.5, progress: 100, predecessor: '3.0' },
  { id: 105, projectId: 'PRJ-SHJ-ALJADA-200', wbs: '5.0', name: 'Superstructure RCC Framing (Podium + Floors 1 to 20)', startMonth: 8, finishMonth: 17, weight: 28.0, progress: 42, predecessor: '4.0', critical: 1 },
  { id: 106, projectId: 'PRJ-SHJ-ALJADA-200', wbs: '6.0', name: 'Façade Double Glazed Curtain Wall & Weatherproofing', startMonth: 13, finishMonth: 20, weight: 10.0, progress: 0, predecessor: '5.0' },
  { id: 107, projectId: 'PRJ-SHJ-ALJADA-200', wbs: '7.0', name: 'MEP Services: Chilled Water HVAC, Fire Fighting & Life Safety', startMonth: 10, finishMonth: 21, weight: 16.0, progress: 12, predecessor: '5.0' },
  { id: 108, projectId: 'PRJ-SHJ-ALJADA-200', wbs: '8.0', name: 'Internal Architectural Finishes, Screed & Porcelain Tiling', startMonth: 14, finishMonth: 22, weight: 11.5, progress: 0, predecessor: '7.0' },
  { id: 109, projectId: 'PRJ-SHJ-ALJADA-200', wbs: '9.0', name: 'External Works, Utility Substation & SEWA Permanent Power Energisation', startMonth: 18, finishMonth: 23, weight: 3.5, progress: 0, predecessor: '6.0' },
  { id: 110, projectId: 'PRJ-SHJ-ALJADA-200', wbs: '10.0', name: 'Civil Defence & Municipality Final Inspections & Completion Certificate (CCC)', startMonth: 22, finishMonth: 24, weight: 1.5, progress: 0, predecessor: '7.0, 9.0' },
];

export const INITIAL_MILESTONES: ContractMilestone[] = [
  { id: 201, projectId: 'PRJ-SHJ-ALJADA-200', name: 'Building Permit & Civil Defence Design NOC Obtained', targetMonth: 2, actualMonth: 2, status: 'Completed', notes: 'Approved by Sharjah Municipality' },
  { id: 202, projectId: 'PRJ-SHJ-ALJADA-200', name: 'Shoring & Mass Excavation Signed Off', targetMonth: 5, actualMonth: 5, status: 'Completed', notes: 'Soil compaction certified' },
  { id: 203, projectId: 'PRJ-SHJ-ALJADA-200', name: 'Foundation Raft Complete (3,200 m³ Continuous Pour)', targetMonth: 7, actualMonth: 7, status: 'Completed', notes: 'Cube testing 28-day passed 52 MPa' },
  { id: 204, projectId: 'PRJ-SHJ-ALJADA-200', name: 'Basement & Ground Floor Transfer Slab Complete', targetMonth: 9, actualMonth: 9, status: 'Completed', notes: 'Post-tensioning stressing approved' },
  { id: 205, projectId: 'PRJ-SHJ-ALJADA-200', name: 'Superstructure Mid-Rise Gate (Floor 10 RCC Cast)', targetMonth: 13, actualMonth: 13, status: 'On-Track', notes: '4-day floor cycle with Mivan aluminium formwork' },
  { id: 206, projectId: 'PRJ-SHJ-ALJADA-200', name: 'Superstructure Roof Slab Top-Out (Level 21)', targetMonth: 17, actualMonth: 17, status: 'On-Track' },
  { id: 207, projectId: 'PRJ-SHJ-ALJADA-200', name: 'Façade Weathertight Enclosure Gate', targetMonth: 20, actualMonth: 21, status: 'At-Risk', notes: 'Aluminium extrusion delivery lead time' },
  { id: 208, projectId: 'PRJ-SHJ-ALJADA-200', name: 'SEWA Permanent Substation Energisation', targetMonth: 22, actualMonth: 22, status: 'On-Track' },
  { id: 209, projectId: 'PRJ-SHJ-ALJADA-200', name: 'Civil Defence Final Fire & Life Safety Certificate', targetMonth: 23, actualMonth: 23, status: 'On-Track' },
  { id: 210, projectId: 'PRJ-SHJ-ALJADA-200', name: 'Municipality Final CCC & Handover to Arada', targetMonth: 24, actualMonth: 24, status: 'On-Track' },
];

export const INITIAL_BOQ_ITEMS: MasterBOQItem[] = [
  { id: 1, projectId: 'PRJ-SHJ-ALJADA-200', discipline: 'Civil & Structural', category: 'Earthwork', description: 'Bulk excavation in all types of strata down to founding level and approved disposal', unit: 'Cu.m', qty: 24500, rate: 32, drawingRef: 'STR-01', actualQty: 24500, actualRate: 32 },
  { id: 2, projectId: 'PRJ-SHJ-ALJADA-200', discipline: 'Civil & Structural', category: 'Concrete Works', description: 'C40/50 SRC Reinforced Concrete in Raft, Core Walls & Columns', unit: 'Cu.m', qty: 14200, rate: 380, drawingRef: 'STR-04', actualQty: 6800, actualRate: 380 },
  { id: 3, projectId: 'PRJ-SHJ-ALJADA-200', discipline: 'Civil & Structural', category: 'Steel Structure', description: 'Deformed High Yield Rebar Steel Grade 500B (BS 4449), cut, bend & fix', unit: 'Kg', qty: 1850000, rate: 3.65, drawingRef: 'STR-06', actualQty: 890000, actualRate: 3.65 },
  { id: 4, projectId: 'PRJ-SHJ-ALJADA-200', discipline: 'Civil & Structural', category: 'Concrete Works', description: 'Mivan Aluminium system formwork to structural walls and suspended slab decks', unit: 'Sq.m', qty: 68000, rate: 68, drawingRef: 'STR-08', actualQty: 31000, actualRate: 68 },
  { id: 5, projectId: 'PRJ-SHJ-ALJADA-200', discipline: 'Architectural Finishes', category: 'Masonry', description: 'Hollow Concrete Blocks 200mm (12.5N) for partition walls and shaft enclosures', unit: 'Sq.m', qty: 28500, rate: 95, drawingRef: 'ARC-02', actualQty: 8200, actualRate: 95 },
  { id: 6, projectId: 'PRJ-SHJ-ALJADA-200', discipline: 'Architectural Finishes', category: 'Openings', description: 'Double glazed unitized aluminium curtain wall façade (6mm toughened + 12mm air + 6mm low-e)', unit: 'Sq.m', qty: 8400, rate: 1650, drawingRef: 'ARC-07', actualQty: 0, actualRate: 1650 },
  { id: 7, projectId: 'PRJ-SHJ-ALJADA-200', discipline: 'MEP Services', category: 'MEP', description: 'Chilled Water HVAC Central Plant, Air Handling Units & insulated ductwork', unit: 'Lot', qty: 1, rate: 3850000, drawingRef: 'MEP-01', actualQty: 0.25, actualRate: 3850000 },
  { id: 8, projectId: 'PRJ-SHJ-ALJADA-200', discipline: 'MEP Services', category: 'MEP', description: 'Civil Defence approved Fire Fighting sprinkler network, wet risers & fire alarm panels', unit: 'Lot', qty: 1, rate: 1950000, drawingRef: 'MEP-06', actualQty: 0.30, actualRate: 1950000 },
  { id: 9, projectId: 'PRJ-SHJ-ALJADA-200', discipline: 'Misc & External', category: 'Preliminaries', description: 'Authority approvals (Sharjah Municipality, Civil Defence, SEWA) and site testing lab', unit: 'Lot', qty: 1, rate: 450000, drawingRef: 'GEN-01', actualQty: 1, actualRate: 450000 },
  { id: 10, projectId: 'PRJ-SHJ-ALJADA-200', discipline: 'Misc & External', category: 'Preliminaries', description: 'Contractor site overheads, HSE equipment, scaffolding and tower crane operations', unit: 'Lot', qty: 1, rate: 1850000, drawingRef: 'GEN-02', actualQty: 0.38, actualRate: 1850000 },
];

export const INITIAL_TENDERS: TenderBid[] = [
  { ref: 'TND-2026-SHJ-01', projectId: 'PRJ-SHJ-ALJADA-200', deadline: '2025-12-15', emd: 1125000, winProb: 100, clientBudget: 26000000, bidValue: 24500000, status: 'Awarded', lead: 'Sarah Jenkins, Chief QS' },
  { ref: 'TND-2026-DXB-88', projectId: 'PRJ-DXB-MARINA-01', deadline: '2026-03-01', emd: 2500000, winProb: 100, clientBudget: 62000000, bidValue: 58000000, status: 'Awarded', lead: 'Tariq Al-Mansoori' },
  { ref: 'TND-2026-DCC-09', projectId: 'PRJ-MUWAILEH-02', deadline: '2026-05-10', emd: 700000, winProb: 100, clientBudget: 15500000, bidValue: 14200000, status: 'Awarded', lead: 'Kareem Nabil, QS' },
];

export const INITIAL_VARIATIONS: VariationOrder[] = [
  { id: 1, projectId: 'PRJ-SHJ-ALJADA-200', ref: 'VO-01', description: 'Addition of Post-Tensioned Beams at Transfer Slab (Level 02)', claimed: 420000, approved: 385000, status: 'Approved', date: '2026-05-14' },
  { id: 2, projectId: 'PRJ-SHJ-ALJADA-200', ref: 'VO-02', description: 'Upgrade Entrance Lobby Italian Marble Cladding & Structural Steel Canopy', claimed: 295000, approved: 260000, status: 'Approved', date: '2026-07-20' },
  { id: 3, projectId: 'PRJ-SHJ-ALJADA-200', ref: 'VO-03', description: 'Additional Basement Drainage Sump Pump & Dewatering Extensions', claimed: 145000, approved: 0, status: 'Submitted', date: '2026-09-11' },
];

export const INITIAL_IPC_CLAIMS: IPCClaim[] = [
  { id: 1, projectId: 'PRJ-SHJ-ALJADA-200', billNo: 'IPC-01', date: '2026-04-30', gross: 2800000, retention: 280000, advRec: 280000, vat: 112000, net: 2352000, status: 'Paid', contractor: 'Al-Bahar Structural LLC' },
  { id: 2, projectId: 'PRJ-SHJ-ALJADA-200', billNo: 'IPC-02', date: '2026-06-30', gross: 3400000, retention: 340000, advRec: 340000, vat: 136000, net: 2856000, status: 'Paid', contractor: 'Al-Bahar Structural LLC' },
  { id: 3, projectId: 'PRJ-SHJ-ALJADA-200', billNo: 'IPC-03', date: '2026-08-31', gross: 3600000, retention: 360000, advRec: 360000, vat: 144000, net: 3024000, status: 'Paid', contractor: 'Al-Bahar Structural LLC' },
  { id: 4, projectId: 'PRJ-SHJ-ALJADA-200', billNo: 'IPC-04', date: '2026-10-31', gross: 2450000, retention: 245000, advRec: 245000, vat: 98000, net: 2058000, status: 'Under Review', contractor: 'Al-Bahar Structural LLC' },
];

export const INITIAL_MATERIAL_REQUISITIONS: MaterialRequisition[] = [
  { id: 'MR-SHJ-2026-101', projectId: 'PRJ-SHJ-ALJADA-200', date: '2026-10-25', mainCategory: 'Civil & Structural', subCategory: 'C-02 Concrete', itemSpec: 'Ready Mix Concrete C40/50 (SRC Sulphate Resisting)', wbs: 'WBS-CONC-001', targetSite: 'Aljada Site 01', reqQty: 450, unit: 'Cu.m', yardStock: 0, status: 'Approved PM' },
  { id: 'MR-SHJ-2026-102', projectId: 'PRJ-SHJ-ALJADA-200', date: '2026-10-28', mainCategory: 'Civil & Structural', subCategory: 'C-05 Steel', itemSpec: 'High Yield Rebar 20mm (Grade 500B BS 4449)', wbs: 'WBS-STEL-002', targetSite: 'Aljada Site 01', reqQty: 45, unit: 'MT', yardStock: 120, status: 'Approved PM' },
  { id: 'MR-SHJ-2026-103', projectId: 'PRJ-SHJ-ALJADA-200', date: '2026-10-29', mainCategory: 'Waterproofing Systems', subCategory: 'WP-01 Basement', itemSpec: '4mm Torch-On APP Bituminous Membrane (Polyester reinforced)', wbs: 'WBS-WPRF-001', targetSite: 'Aljada Site 01', reqQty: 1200, unit: 'Sq.m', yardStock: 0, status: 'Pending QA Check' },
  { id: 'MR-SHJ-2026-104', projectId: 'PRJ-SHJ-ALJADA-200', date: '2026-10-30', mainCategory: 'Aluminium Formwork (Mivan)', subCategory: 'Formwork Accessories', itemSpec: 'Aluminium Wall Tie Rods & PVC Cones/Sleeves', wbs: 'WBS-FORM-004', targetSite: 'Aljada Site 01', reqQty: 5000, unit: 'Pcs', yardStock: 8500, status: 'Fulfilled' },
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: 'PO-UAE-2026-088', projectId: 'PRJ-SHJ-ALJADA-200', date: '2026-10-26', supplier: 'Sharjah National Concrete Co. WLL', trn: '100293847500003', items: '450 m³ Ready Mix Concrete C40/50 SRC', subtotal: 171000, vatAmount: 8550, totalWithVat: 179550, deliverySite: 'Aljada Site 01', deliveryStatus: 'Partial Delivery' },
  { id: 'PO-UAE-2026-089', projectId: 'PRJ-SHJ-ALJADA-200', date: '2026-10-27', supplier: 'Emirates Steel Arkan PJSC', trn: '100982310100003', items: '45 MT High Yield Steel Rebar 20mm Grade 500B', subtotal: 126000, vatAmount: 6300, totalWithVat: 132300, deliverySite: "Saja'a Central Yard", deliveryStatus: 'Delivered' },
  { id: 'PO-UAE-2026-090', projectId: 'PRJ-SHJ-ALJADA-200', date: '2026-10-28', supplier: 'National Waterproofing Industries LLC', trn: '100492817300003', items: '1200 m² 4mm APP Torch-On Membrane', subtotal: 69600, vatAmount: 3480, totalWithVat: 73080, deliverySite: 'Aljada Site 01', deliveryStatus: 'Pending Delivery' },
];

export const INITIAL_GRN_INSPECTIONS: GRNInspection[] = [
  { id: 'GRN-ALJ-2026-044', projectId: 'PRJ-SHJ-ALJADA-200', poRef: 'PO-UAE-2026-088', date: '2026-10-27', item: 'Ready Mix Concrete C40/50 SRC (15 Transit Mixers)', deliveredQty: 120, acceptedQty: 120, rejectedQty: 0, requiresLabTesting: true, labTestStatus: 'Passed', stockPosted: true },
  { id: 'LOT-STEL-UAE-902', projectId: 'PRJ-SHJ-ALJADA-200', poRef: 'PO-UAE-2026-089', date: '2026-10-28', item: 'Emirates Steel Rebar 20mm (Grade 500B)', deliveredQty: 25, acceptedQty: 25, rejectedQty: 0, requiresLabTesting: true, labTestStatus: 'Under Quarantine', stockPosted: false },
  { id: 'GRN-MUW-2026-012', projectId: 'PRJ-MUWAILEH-02', poRef: 'PO-UAE-2026-077', date: '2026-10-29', item: 'Hollow Blocks 200mm (National Blocks)', deliveredQty: 8000, acceptedQty: 7880, rejectedQty: 120, requiresLabTesting: false, labTestStatus: 'Passed', stockPosted: true },
];

export const INITIAL_WORK_ORDERS: SubcontractWorkOrder[] = [
  { id: 'WO-FIDIC-2026-004', projectId: 'PRJ-SHJ-ALJADA-200', subcontractor: 'Al-Bahar Structural Subcontracting LLC', trn: '100382910400003', trade: 'Civil & Structure', title: 'Tower RCC Concrete Framing & Mivan Formwork Operations', orderValueAED: 8500000, certifiedToDateAED: 3820000, status: 'Active', retentionPct: 10, advanceRecoveryPct: 10 },
  { id: 'WO-FIDIC-2026-005', projectId: 'PRJ-SHJ-ALJADA-200', subcontractor: 'Gulf Mechanical & Electrical Co. WLL', trn: '100481920500003', trade: 'MEP Services', title: 'HVAC Chilled Water, Fire Fighting & Electrical 1st Fix', orderValueAED: 5200000, certifiedToDateAED: 890000, status: 'Active', retentionPct: 10, advanceRecoveryPct: 10 },
  { id: 'WO-FIDIC-2026-006', projectId: 'PRJ-SHJ-ALJADA-200', subcontractor: 'Al-Madar Aluminium & Glass Industries', trn: '100582910600003', trade: 'Façade Glazing', title: 'Double Glazed Curtain Wall & Balcony Balustrades', orderValueAED: 4100000, certifiedToDateAED: 0, status: 'Active', retentionPct: 10, advanceRecoveryPct: 10 },
];

export const INITIAL_JMS_ENTRIES: JointMeasurementSheet[] = [
  { id: 'JMS-ALJ-2026-022', projectId: 'PRJ-SHJ-ALJADA-200', subcontractor: 'Al-Bahar Structural Subcontracting LLC', location: 'Tower A - Level 08 Slab (Axis C1-C8)', workDescription: 'Reinforced Concrete Suspended Slab Pour (Grade C40/50)', qty: '420 m²', date: '2026-10-22', verifiedBy: 'Eng. Khalid (Khatib & Alami PMC)', status: 'Signoff Complete' },
  { id: 'JMS-ALJ-2026-023', projectId: 'PRJ-SHJ-ALJADA-200', subcontractor: 'Al-Bahar Structural Subcontracting LLC', location: 'Tower A - Level 09 Columns & Shear Walls', workDescription: 'High Yield Rebar Fixing (20mm & 25mm)', qty: '28.5 MT', date: '2026-10-29', verifiedBy: 'Eng. Tariq (Main Contractor)', status: 'Signoff Complete' },
];

export const INITIAL_DIGITAL_MB: DigitalMBEntry[] = [
  { id: 'MB-001', projectId: 'PRJ-SHJ-ALJADA-200', date: '2026-10-20', location: 'Tower A - Level 08 Slab', itemDescription: 'C40/50 SRC Concrete in Suspended Slab', nos: 1, length: 32.5, width: 22.0, height: 0.32, calculatedQty: 228.8, unit: 'm³', inspectionRef: 'WIR-CONC-082' },
  { id: 'MB-002', projectId: 'PRJ-SHJ-ALJADA-200', date: '2026-10-25', location: 'Tower A - Level 08 Shear Core Walls', itemDescription: 'Reinforcement Steel Grade 500B (20mm & 16mm)', nos: 64, length: 3.4, width: 1.0, height: 1.0, calculatedQty: 14.8, unit: 'MT', inspectionRef: 'WIR-STEL-084' },
];

export const INITIAL_EXTRA_ITEMS: ExtraItemVariation[] = [
  { id: 'VAR-001', projectId: 'PRJ-SHJ-ALJADA-200', description: 'Additional Basement Hydrophilic Grout Injection behind Secant Piles', materialCost: 14000, labourCost: 6500, plantCost: 2500, overheadProfitPct: 20, approvedRate: 27600, status: 'Approved Consultant' },
  { id: 'VAR-002', projectId: 'PRJ-SHJ-ALJADA-200', description: 'Upgraded Heavy-Duty Fire Dampers for Civil Defence Compliance Revision', materialCost: 22000, labourCost: 8000, plantCost: 1500, overheadProfitPct: 20, approvedRate: 37800, status: 'Under Review' },
];

export const INITIAL_VAT_RECORDS: StatutoryVATRecord[] = [
  { id: 'VAT-Q1-2026', period: 'Q1 2026 (Jan - Mar)', category: 'UAE 5% Federal VAT', outputTax: 140000, inputTaxCredit: 58000, netPayable: 82000, filingStatus: 'Filed & Paid' },
  { id: 'VAT-Q2-2026', period: 'Q2 2026 (Apr - Jun)', category: 'UAE 5% Federal VAT', outputTax: 170000, inputTaxCredit: 74000, netPayable: 96000, filingStatus: 'Filed & Paid' },
  { id: 'VAT-Q3-2026', period: 'Q3 2026 (Jul - Sep)', category: 'UAE 5% Federal VAT', outputTax: 180000, inputTaxCredit: 82000, netPayable: 98000, filingStatus: 'Filed & Paid' },
  { id: 'VAT-Q4-2026', period: 'Q4 2026 (Oct - Dec)', category: 'UAE 5% Federal VAT', outputTax: 122500, inputTaxCredit: 51200, netPayable: 71300, filingStatus: 'Draft' },
];

export const INITIAL_HR_EMPLOYEES: HREmployee[] = [
  { id: 'EMP-001', empCode: 'AE-1001', name: 'Amil Solanki', designation: 'Project Manager Operations', department: 'Project Management', nationality: 'Indian', passportNo: 'Z9876543', eidNumber: '784-1985-1234567-1', eidExpiry: '2026-11-20', visaType: 'Employment (Sharjah)', visaExpiry: '2026-11-20', laborCardNo: 'LC-778811', laborCardExpiry: '2026-11-20', basicSalary: 14000, allowances: 8000, yearsOfService: 3.5, accruedEOSB: 49000, campBlock: 'Executive Staff Villa - Muwaileh', status: 'Active' },
  { id: 'EMP-002', empCode: 'AE-1002', name: 'Tariq Mansoor', designation: 'Senior HSE Safety Officer', department: 'HSE', nationality: 'Pakistani', passportNo: 'P4455661', eidNumber: '784-1990-2345678-2', eidExpiry: '2026-10-15', visaType: 'Employment (Sharjah)', visaExpiry: '2026-10-15', laborCardNo: 'LC-778812', laborCardExpiry: '2026-10-15', basicSalary: 9000, allowances: 5000, yearsOfService: 2.2, accruedEOSB: 19800, campBlock: "Saja'a Staff Block B", status: 'Active' },
  { id: 'EMP-003', empCode: 'AE-1003', name: 'Siddharth Rao', designation: 'Senior QA/QC Engineer', department: 'Quality', nationality: 'Indian', passportNo: 'K8877112', eidNumber: '784-1988-3456789-3', eidExpiry: '2026-12-05', visaType: 'Employment (Sharjah)', visaExpiry: '2026-12-05', laborCardNo: 'LC-778813', laborCardExpiry: '2026-12-05', basicSalary: 8500, allowances: 4500, yearsOfService: 1.8, accruedEOSB: 15300, campBlock: "Saja'a Staff Block B", status: 'Active' },
  { id: 'EMP-004', empCode: 'AE-1004', name: 'Mahmoud Al-Sayed', designation: 'Public Relations Officer (PRO)', department: 'HR & Government Relations', nationality: 'Egyptian', passportNo: 'E9988112', eidNumber: '784-1982-4567890-4', eidExpiry: '2027-04-10', visaType: 'Employment (Sharjah)', visaExpiry: '2027-04-10', laborCardNo: 'LC-778814', laborCardExpiry: '2027-04-10', basicSalary: 7500, allowances: 3500, yearsOfService: 4.5, accruedEOSB: 33750, campBlock: 'Resident Staff Flat', status: 'Active' },
  { id: 'EMP-005', empCode: 'AE-1005', name: 'Rajesh Kumar', designation: 'General Steel Foreman', department: 'Site Operations', nationality: 'Indian', passportNo: 'Z3322114', eidNumber: '784-1989-5678901-5', eidExpiry: '2026-11-10', visaType: 'Employment (Sharjah)', visaExpiry: '2026-11-10', laborCardNo: 'LC-778815', laborCardExpiry: '2026-11-10', basicSalary: 4500, allowances: 1500, yearsOfService: 5.0, accruedEOSB: 22500, campBlock: "Saja'a Labour Camp Block A", status: 'Active' },
];

export const INITIAL_CAMPS: CampFacility[] = [
  { id: 'CAMP-01', name: "Saja'a Industrial Block A - Main Worker Accommodation", location: "Saja'a Industrial Zone, Sharjah", capacity: 250, occupancy: 205, sanitationAudit: 'Passed MoHRE Audit', transportAllocation: '5x 60-Seater AC Buses to Aljada & Muwaileh' },
  { id: 'CAMP-02', name: "Saja'a Block B - Engineers & Supervisors Living Facility", location: "Saja'a Industrial Zone, Sharjah", capacity: 50, occupancy: 38, sanitationAudit: 'Passed MoHRE Audit', transportAllocation: '4x Toyota Hilux Double Cab Pickups' },
];

export const INITIAL_SITE_ASSETS: SiteAsset[] = [
  { id: 'AST-01', code: 'AST-TC-01', description: 'Potain 12-Ton Tower Crane (55m Jib)', category: 'Heavy Machinery', assignedTo: 'Plant & Equipment Dept', condition: 'Excellent', maintenanceDueDate: '2026-12-15', valueAED: 1250000 },
  { id: 'AST-02', code: 'AST-TS-01', description: 'Leica Total Station TS07 Robotic with Prism Set', category: 'Survey Equipment', assignedTo: 'Chief Surveyor', condition: 'Excellent', maintenanceDueDate: '2026-11-30', valueAED: 48000 },
  { id: 'AST-03', code: 'AST-DG-01', description: 'CAT 250 kVA Soundproof Site Diesel Generator', category: 'Site Pickups & DG Sets', assignedTo: 'Site Electrical Services', condition: 'Good', maintenanceDueDate: '2026-11-15', valueAED: 85000 },
  { id: 'AST-04', code: 'AST-PU-01', description: 'Toyota Hilux 4x4 Double Cab Site Logistics Pickup', category: 'Site Pickups & DG Sets', assignedTo: 'Site Logistics Pool', condition: 'Good', maintenanceDueDate: '2026-11-05', valueAED: 92000 },
  { id: 'AST-05', code: 'AST-LAP-01', description: 'Dell Precision i7 CAD/BIM Workstation Laptop', category: 'IT & Laptops', assignedTo: 'Amil Solanki (PM)', condition: 'Excellent', maintenanceDueDate: '2027-01-10', valueAED: 9500 },
];

export const INITIAL_DPR_LOGS: DailyProgressReport[] = [
  {
    id: 'DPR-2026-10-30',
    projectId: 'PRJ-SHJ-ALJADA-200',
    date: '2026-10-30',
    shift: 'Day',
    weather: 'Clear (34°C)',
    manpowerDirect: 48,
    manpowerSubcontractor: 154,
    majorActivities: [
      'Level 09 Core Wall Formwork shuttering alignment verified by QA/QC',
      'Tower B Level 08 slab electrical conduits casting inspection',
      'Basement 01 MEP chilled water header pressure testing at 12 bar',
      'Ground floor masonry internal shaft blockwork up to 2.4m height',
    ],
    equipmentOperating: ['Tower Crane #1 (Potain 12T)', 'Concrete Boom Pump (42m)', '2x Site Pickups', 'Generator 250kVA'],
    materialConsumed: ['45 m³ Ready Mix C40/50', '8.5 MT Rebar 20mm', '1,200 Hollow Blocks 200mm', '150kg Tie Wire'],
    delaysOrBottlenecks: 'SEWA temporary cable connection inspection rescheduled to Tuesday.',
    supervisorSignature: 'Rajesh Kumar (Foreman) & Amil Solanki (PM)',
    approvedByPM: true,
  },
];

export const INITIAL_QAQC_ITEMS: QAQCInspectionItem[] = [
  { id: 'QA-01', projectId: 'PRJ-SHJ-ALJADA-200', refNo: 'WIR-STR-082', type: 'WIR (Work Inspection Request)', location: 'Tower A Level 08 Slab Post-Tensioning & Rebar', description: 'Pre-pour inspection of tendons, anchorages, and top mesh reinforcement', consultantStatus: 'Approved with Comments', inspectionDate: '2026-10-20' },
  { id: 'QA-02', projectId: 'PRJ-SHJ-ALJADA-200', refNo: 'MIR-CONC-044', type: 'MIR (Material Inspection Request)', location: 'Aljada Batching Plant Mix Verification', description: 'Sharjah Municipality approved lab 7-day & 28-day concrete cube compression report', consultantStatus: 'Approved', inspectionDate: '2026-10-27' },
  { id: 'QA-03', projectId: 'PRJ-SHJ-ALJADA-200', refNo: 'NCR-STR-003', type: 'NCR', location: 'Level 07 Shear Wall Grid C-3', description: 'Minor honeycombing at column base; epoxy injection and non-shrink grout repair executed', consultantStatus: 'Approved', inspectionDate: '2026-10-18' },
];

export const INITIAL_HSE_ITEMS: HSEIncidentOrPTW[] = [
  { id: 'HSE-01', projectId: 'PRJ-SHJ-ALJADA-200', type: 'PTW (Permit to Work)', title: 'Hot Works Permit: Welding of Façade Embedded Steel Anchor Plates', location: 'Tower A Perimeter Level 06-08', riskLevel: 'Medium', status: 'Active / Permitted', assignedOfficer: 'Tariq Mansoor (HSE Officer)', date: '2026-10-30' },
  { id: 'HSE-02', projectId: 'PRJ-SHJ-ALJADA-200', type: 'Toolbox Talk', title: 'Scaffolding Safety, 100% Tie-Off & MoHRE Summer Midday Break Norms', location: 'Ground Floor Assembly Yard', riskLevel: 'Low', status: 'Closed', assignedOfficer: 'Tariq Mansoor (HSE Officer)', date: '2026-10-28' },
  { id: 'HSE-03', projectId: 'PRJ-SHJ-ALJADA-200', type: 'Safety Audit', title: 'Monthly Civil Defence Fire Extinguishers & Emergency Evacuation Drill', location: 'Entire Site & Saja\'a Camp', riskLevel: 'Low', status: 'Closed', assignedOfficer: 'External Auditor', date: '2026-10-15' },
];

export const INITIAL_ENGINEERING_DOCS: EngineeringDrawingRFI[] = [
  { id: 'ENG-01', projectId: 'PRJ-SHJ-ALJADA-200', type: 'Shop Drawing', refNo: 'STR-DWG-L08-REV-03', title: 'Tower A Level 08 Slab Post-Tensioning Cable Profile & Tendon Layout', discipline: 'Structural', revision: 'Rev 03', status: 'Approved', submissionDate: '2026-10-12' },
  { id: 'ENG-02', projectId: 'PRJ-SHJ-ALJADA-200', type: 'RFI', refNo: 'RFI-MEP-018', title: 'Clarification regarding District Cooling Chilled Water connection pressure rating', discipline: 'MEP', revision: 'Rev 00', status: 'Approved', submissionDate: '2026-10-24' },
  { id: 'ENG-03', projectId: 'PRJ-SHJ-ALJADA-200', type: 'Technical Submittal', refNo: 'MAT-FCD-009', title: 'Aluminium Curtain Wall Profile System & Thermal Break Specs (Schüco / Technal)', discipline: 'Façade', revision: 'Rev 01', status: 'Under Review', submissionDate: '2026-10-28' },
];

export const INITIAL_CRM_OPPORTUNITIES: CRMLeadOpportunity[] = [
  { id: 'CRM-01', clientName: 'Arada Developments LLC', projectName: 'Aljada Phase 4 Commercial Hub', estimatedBudgetAED: 65000000, stage: 'Tendering / QS', contactPerson: 'Ziad Al-Turk (Procurement Director)', email: 'ziad.turk@arada.com', phone: '+971 6 544 8899', location: 'Sharjah', winProbability: 75, source: 'Developer Tender', expectedAwardDate: '2026-12-15' },
  { id: 'CRM-02', clientName: 'Emaar Properties PJSC', projectName: 'Dubai Creek Harbour Residential Residences', estimatedBudgetAED: 110000000, stage: 'Inquiry', contactPerson: 'Karim Haddad (VP Projects)', email: 'khaddad@emaar.ae', phone: '+971 4 367 3333', location: 'Dubai', winProbability: 40, source: 'Developer Tender', expectedAwardDate: '2027-02-28' },
  { id: 'CRM-03', clientName: 'Alef Group / Sharjah Holding', projectName: 'Al Mamsha Walk Mixed-Use Retail Phase 2', estimatedBudgetAED: 38000000, stage: 'Negotiation', contactPerson: 'Nour El-Din (Commercial Lead)', email: 'nour@alefgroup.ae', phone: '+971 6 556 7711', location: 'Sharjah', winProbability: 85, source: 'Direct Commercial', expectedAwardDate: '2026-11-20' },
  { id: 'CRM-04', clientName: 'Damac Properties', projectName: 'Damac Lagoons Townhouses Cluster G', estimatedBudgetAED: 45000000, stage: 'Bid Submitted', contactPerson: 'Rashid Al-Mulla', email: 'rashid.mulla@damacgroup.com', phone: '+971 4 373 1000', location: 'Dubai', winProbability: 55, source: 'Consultant Invite', expectedAwardDate: '2026-12-01' },
];
