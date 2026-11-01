/**
 * Comprehensive Dubai & UAE Construction ERP Data Types
 * Covers all 4 Primary Divisions:
 * 1. Office Management (PMO, QS/Commercial, Procurement, Finance, HR, Contracts, Vendors, Assets, Docs, Reports)
 * 2. Site Management (Operations, Engineering, QA/QC, HSE, DPR, Workforce, Machinery, Inspections)
 * 3. CRM (Leads, Clients, Opportunities, Tenders, Proposals, Inquiries, Snags)
 * 4. AI Tools & Intelligence (ERPAssistant, ContractAnalyzer, BOQAnalyzer, CostPredictor, ProcurementCopilot)
 */

export type PrimaryDivision = 'office' | 'site' | 'crm' | 'ai';

export type OfficeSubmodule =
  | 'dashboard'
  | 'pmo'
  | 'commercial'
  | 'procurement'
  | 'finance'
  | 'hr'
  | 'contracts'
  | 'vendors'
  | 'documents'
  | 'assets'
  | 'reports';

export type SiteSubmodule =
  | 'site-dashboard'
  | 'site-operations'
  | 'engineering'
  | 'qaqc'
  | 'hse'
  | 'dpr'
  | 'labour-workforce'
  | 'equipment'
  | 'materials'
  | 'expenses'
  | 'inspections'
  | 'subcontractors';

export type CRMSubmodule =
  | 'crm-dashboard'
  | 'dashboard'
  | 'leads'
  | 'followups'
  | 'inventory'
  | 'quotations'
  | 'bookings'
  | 'customers'
  | 'collections'
  | 'handover'
  | 'service'
  | 'reports'
  | 'clients'
  | 'pipeline'
  | 'proposals'
  | 'activities'
  | 'support';

export type AISubmodule =
  | 'ai-dashboard'
  | 'erp-assistant'
  | 'contract-analyzer'
  | 'boq-analyzer'
  | 'cost-estimator'
  | 'risk-analyzer'
  | 'procurement-assistant'
  | 'lead-scoring';

export type UserRole =
  | 'Chief Commercial Officer'
  | 'Project Director'
  | 'Project Manager'
  | 'Senior QS / Estimator'
  | 'Procurement Manager'
  | 'Finance Director'
  | 'HR Director'
  | 'Site Engineer'
  | 'QA/QC Manager'
  | 'HSE Officer';

export interface ERPUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
  department: string;
}

export interface UAEProject {
  id: string;
  code: string;
  name: string;
  location: string;
  emirate: 'Dubai' | 'Sharjah' | 'Abu Dhabi' | 'Ajman' | 'Ras Al Khaimah' | 'Fujairah' | 'Umm Al Quwain';
  client: string;
  consultant: string;
  type: string;
  areaSqFt: number;
  areaSqM: number;
  floors: number;
  basements: number;
  startDate: string;
  targetFinishDate: string;
  durationMonths: number;
  currentMonth: number;
  contractBaselineAED: number;
  actualCostAED: number;
  certifiedWorkAED: number;
  paidAED: number;
  retentionAED: number;
  status: 'In Progress' | 'Tendering' | 'Handover' | 'Suspended';
  scheduleMode: 'PRIMAVERA' | 'BENCHMARK';
  contractType: 'FIDIC Red Book Lump Sum' | 'Item Rate Schedule' | 'Cost Plus Fee';
  currency: string;
}

// PMO & Controls
export interface WBSActivity {
  id: number;
  projectId: string;
  wbs: string;
  name: string;
  startMonth: number;
  finishMonth: number;
  weight: number;
  progress: number;
  predecessor: string;
  critical?: number;
  durWd?: number;
}

export interface ContractMilestone {
  id: number;
  projectId: string;
  name: string;
  targetMonth: number;
  actualMonth: number;
  status: 'On-Track' | 'At-Risk' | 'Delayed' | 'Completed';
  notes?: string;
}

// Commercial & Estimation
export interface MasterBOQItem {
  id: number;
  projectId: string;
  discipline: string;
  category: string;
  description: string;
  unit: string;
  qty: number;
  rate: number;
  drawingRef: string;
  actualQty?: number;
  actualRate?: number;
}

export interface TenderBid {
  ref: string;
  projectId: string;
  deadline: string;
  emd: number;
  winProb: number;
  clientBudget: number;
  bidValue: number;
  status: 'In Progress' | 'Submitted' | 'Awarded' | 'Rejected';
  lead: string;
}

export interface VariationOrder {
  id: number;
  projectId: string;
  ref: string;
  description: string;
  claimed: number;
  approved: number;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  date: string;
}

export interface IPCClaim {
  id: number;
  projectId: string;
  billNo: string;
  date: string;
  gross: number;
  retention: number;
  advRec: number;
  vat: number;
  net: number;
  status: 'Submitted' | 'Under Review' | 'Certified' | 'Paid';
  contractor: string;
}

// Procurement
export interface MaterialRequisition {
  id: string;
  projectId: string;
  date: string;
  mainCategory: string;
  subCategory: string;
  itemSpec: string;
  wbs: string;
  targetSite: string;
  reqQty: number;
  unit: string;
  yardStock: number;
  status: 'Draft' | 'Pending QA Check' | 'Approved PM' | 'PO Issued' | 'Fulfilled';
}

export interface PurchaseOrder {
  id: string;
  projectId: string;
  date: string;
  supplier: string;
  trn: string;
  items: string;
  subtotal: number;
  vatAmount: number;
  totalWithVat: number;
  deliverySite: string;
  deliveryStatus: 'Pending Delivery' | 'Partial Delivery' | 'Delivered' | 'Quarantined';
}

export interface GRNInspection {
  id: string;
  projectId: string;
  poRef: string;
  date: string;
  item: string;
  deliveredQty: number;
  acceptedQty: number;
  rejectedQty: number;
  requiresLabTesting: boolean;
  labTestStatus: 'Passed' | 'Under Quarantine' | 'Failed (NCR)';
  stockPosted: boolean;
}

export interface SubcontractWorkOrder {
  id: string;
  projectId: string;
  subcontractor: string;
  trn: string;
  trade: string;
  title: string;
  orderValueAED: number;
  certifiedToDateAED: number;
  status: 'Active' | 'Under Review' | 'Completed';
  retentionPct: number;
  advanceRecoveryPct: number;
}

export interface JointMeasurementSheet {
  id: string;
  projectId: string;
  subcontractor: string;
  location: string;
  workDescription: string;
  qty: string;
  date: string;
  verifiedBy: string;
  status: 'Pending Verification' | 'Signoff Complete';
}

// Finance
export interface DigitalMBEntry {
  id: string;
  projectId: string;
  date: string;
  location: string;
  itemDescription: string;
  nos: number;
  length: number;
  width: number;
  height: number;
  calculatedQty: number;
  unit: string;
  inspectionRef: string;
}

export interface ExtraItemVariation {
  id: string;
  projectId: string;
  description: string;
  materialCost: number;
  labourCost: number;
  plantCost: number;
  overheadProfitPct: number;
  approvedRate: number;
  status: 'Approved Consultant' | 'Under Review' | 'Submitted';
}

export interface StatutoryVATRecord {
  id: string;
  period: string;
  category: string;
  outputTax: number;
  inputTaxCredit: number;
  netPayable: number;
  filingStatus: 'Draft' | 'Filed & Paid' | 'Pending Review';
}

// HR & Workforce
export interface HREmployee {
  id: string;
  empCode: string;
  name: string;
  designation: string;
  department: string;
  nationality: string;
  passportNo: string;
  eidNumber: string;
  eidExpiry: string;
  visaType: string;
  visaExpiry: string;
  laborCardNo: string;
  laborCardExpiry: string;
  basicSalary: number;
  allowances: number;
  yearsOfService: number;
  accruedEOSB: number;
  campBlock: string;
  status: 'Active' | 'On Leave' | 'Visa Processing' | 'Terminated';
}

export interface CampFacility {
  id: string;
  name: string;
  location: string;
  capacity: number;
  occupancy: number;
  sanitationAudit: 'Passed MoHRE Audit' | 'Minor Remarks' | 'Action Pending';
  transportAllocation: string;
}

export interface SiteAsset {
  id: string;
  code: string;
  description: string;
  category: 'IT & Laptops' | 'Survey Equipment' | 'Site Pickups & DG Sets' | 'Heavy Machinery' | 'Safety & Radios';
  assignedTo: string;
  condition: 'Excellent' | 'Good' | 'Requires Service';
  maintenanceDueDate: string;
  valueAED: number;
}

// Site Management DPR, QA/QC, HSE, Engineering
export interface DailyProgressReport {
  id: string;
  projectId: string;
  date: string;
  shift: 'Day' | 'Night';
  weather: 'Clear (34°C)' | 'Hot (41°C) - Midday Break Active' | 'Dusty' | 'Humid';
  manpowerDirect: number;
  manpowerSubcontractor: number;
  majorActivities: string[];
  equipmentOperating: string[];
  materialConsumed: string[];
  delaysOrBottlenecks: string;
  supervisorSignature: string;
  approvedByPM: boolean;
}

export interface QAQCInspectionItem {
  id: string;
  projectId: string;
  refNo: string;
  type: 'WIR (Work Inspection Request)' | 'MIR (Material Inspection Request)' | 'NCR';
  location: string;
  description: string;
  consultantStatus: 'Approved' | 'Approved with Comments' | 'Revise & Resubmit' | 'Rejected';
  inspectionDate: string;
}

export interface HSEIncidentOrPTW {
  id: string;
  projectId: string;
  type: 'PTW (Permit to Work)' | 'Toolbox Talk' | 'Safety Audit' | 'Near Miss / Incident';
  title: string;
  location: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Active / Permitted' | 'Closed' | 'Under Investigation';
  assignedOfficer: string;
  date: string;
}

export interface EngineeringDrawingRFI {
  id: string;
  projectId: string;
  type: 'Shop Drawing' | 'RFI' | 'Technical Submittal' | 'As-Built';
  refNo: string;
  title: string;
  discipline: 'Structural' | 'Architectural' | 'MEP' | 'Façade';
  revision: string;
  status: 'Approved' | 'Under Review' | 'Revise & Resubmit';
  submissionDate: string;
}

// CRM
export interface CRMLeadOpportunity {
  id: string;
  clientName: string;
  projectName: string;
  estimatedBudgetAED: number;
  stage: 'Inquiry' | 'Tendering / QS' | 'Bid Submitted' | 'Negotiation' | 'Awarded' | 'Lost';
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  winProbability: number;
  source: 'Developer Tender' | 'Consultant Invite' | 'Referral' | 'Direct Commercial';
  expectedAwardDate: string;
}

// AI Engine
export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  content: string;
  divisionContext?: PrimaryDivision;
  citations?: string[];
  confidence?: 'High' | 'Medium' | 'Tentative';
}
