import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  PrimaryDivision,
  OfficeSubmodule,
  SiteSubmodule,
  CRMSubmodule,
  AISubmodule,
  UAEProject,
  WBSActivity,
  ContractMilestone,
  MasterBOQItem,
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
import {
  CURRENT_USER,
  INITIAL_PROJECTS,
  INITIAL_WBS_ACTIVITIES,
  INITIAL_MILESTONES,
  INITIAL_BOQ_ITEMS,
  INITIAL_VARIATIONS,
  INITIAL_IPC_CLAIMS,
  INITIAL_MATERIAL_REQUISITIONS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_GRN_INSPECTIONS,
  INITIAL_WORK_ORDERS,
  INITIAL_JMS_ENTRIES,
  INITIAL_DIGITAL_MB,
  INITIAL_EXTRA_ITEMS,
  INITIAL_VAT_RECORDS,
  INITIAL_HR_EMPLOYEES,
  INITIAL_CAMPS,
  INITIAL_SITE_ASSETS,
  INITIAL_DPR_LOGS,
  INITIAL_QAQC_ITEMS,
  INITIAL_HSE_ITEMS,
  INITIAL_ENGINEERING_DOCS,
  INITIAL_CRM_OPPORTUNITIES,
} from '../data/initialData';

export interface ERPNotification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'alert' | 'success' | 'info';
  timestamp: string;
  division: PrimaryDivision;
  read: boolean;
}

interface ERPContextType {
  activeDivision: PrimaryDivision;
  setActiveDivision: (div: PrimaryDivision) => void;
  activeOfficeSubmodule: OfficeSubmodule;
  setActiveOfficeSubmodule: (sub: OfficeSubmodule) => void;
  activeSiteSubmodule: SiteSubmodule;
  setActiveSiteSubmodule: (sub: SiteSubmodule) => void;
  activeCRMSubmodule: CRMSubmodule;
  setActiveCRMSubmodule: (sub: CRMSubmodule) => void;
  activeAISubmodule: AISubmodule;
  setActiveAISubmodule: (sub: AISubmodule) => void;
  activeSubPage: string;
  setActiveSubPage: (page: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (c: boolean | ((prev: boolean) => boolean)) => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark' | ((prev: 'light' | 'dark') => 'light' | 'dark')) => void;

  currentUser: ERPUser;
  setCurrentUser: (u: ERPUser) => void;

  projects: UAEProject[];
  activeProjectId: string;
  activeProject: UAEProject;
  setActiveProjectId: (id: string) => void;
  addProject: (p: UAEProject) => void;
  updateProject: (id: string, updates: Partial<UAEProject>) => void;

  wbsActivities: WBSActivity[];
  addWBSActivity: (act: WBSActivity) => void;
  updateWBSActivity: (id: number, updates: Partial<WBSActivity>) => void;
  deleteWBSActivity: (id: number) => void;

  milestones: ContractMilestone[];
  addMilestone: (m: ContractMilestone) => void;
  updateMilestone: (id: number, updates: Partial<ContractMilestone>) => void;
  deleteMilestone: (id: number) => void;

  boqItems: MasterBOQItem[];
  addBOQItem: (item: MasterBOQItem) => void;
  updateBOQItem: (id: number, updates: Partial<MasterBOQItem>) => void;
  deleteBOQItem: (id: number) => void;

  variations: VariationOrder[];
  addVariation: (v: VariationOrder) => void;
  updateVariation: (id: number, updates: Partial<VariationOrder>) => void;
  deleteVariation: (id: number) => void;

  ipcClaims: IPCClaim[];
  addIPCClaim: (c: IPCClaim) => void;
  updateIPCClaim: (id: number, updates: Partial<IPCClaim>) => void;

  materialRequisitions: MaterialRequisition[];
  addMaterialRequisition: (mr: MaterialRequisition) => void;
  updateMaterialRequisition: (id: string, updates: Partial<MaterialRequisition>) => void;

  purchaseOrders: PurchaseOrder[];
  addPurchaseOrder: (po: PurchaseOrder) => void;
  updatePurchaseOrder: (id: string, updates: Partial<PurchaseOrder>) => void;

  grnInspections: GRNInspection[];
  addGRNInspection: (grn: GRNInspection) => void;
  updateGRNInspection: (id: string, updates: Partial<GRNInspection>) => void;

  workOrders: SubcontractWorkOrder[];
  addWorkOrder: (wo: SubcontractWorkOrder) => void;
  updateWorkOrder: (id: string, updates: Partial<SubcontractWorkOrder>) => void;

  jmsEntries: JointMeasurementSheet[];
  addJMSEntry: (jms: JointMeasurementSheet) => void;

  digitalMB: DigitalMBEntry[];
  addDigitalMB: (mb: DigitalMBEntry) => void;
  deleteDigitalMB: (id: string) => void;

  extraItems: ExtraItemVariation[];
  addExtraItem: (item: ExtraItemVariation) => void;

  vatRecords: StatutoryVATRecord[];
  addVATRecord: (v: StatutoryVATRecord) => void;

  employees: HREmployee[];
  addEmployee: (e: HREmployee) => void;
  updateEmployee: (id: string, updates: Partial<HREmployee>) => void;
  deleteEmployee: (id: string) => void;

  camps: CampFacility[];
  addCamp: (c: CampFacility) => void;
  updateCamp: (id: string, updates: Partial<CampFacility>) => void;

  assets: SiteAsset[];
  addAsset: (a: SiteAsset) => void;
  updateAsset: (id: string, updates: Partial<SiteAsset>) => void;

  dprLogs: DailyProgressReport[];
  addDPRLog: (dpr: DailyProgressReport) => void;

  qaqcItems: QAQCInspectionItem[];
  addQAQCItem: (q: QAQCInspectionItem) => void;

  hseItems: HSEIncidentOrPTW[];
  addHSEItem: (h: HSEIncidentOrPTW) => void;

  engineeringDocs: EngineeringDrawingRFI[];
  addEngineeringDoc: (doc: EngineeringDrawingRFI) => void;

  crmOpportunities: CRMLeadOpportunity[];
  addCRMOpportunity: (opp: CRMLeadOpportunity) => void;
  updateCRMOpportunity: (id: string, updates: Partial<CRMLeadOpportunity>) => void;

  notifications: ERPNotification[];
  dismissNotification: (id: string) => void;
  markAllNotificationsRead: () => void;

  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;

  exportUnifiedData: () => void;
  importUnifiedData: (jsonData: string) => boolean;
  resetToDefaults: () => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'dubai_construction_erp_state_v1';

export const ERPProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeDivision, setActiveDivision] = useState<PrimaryDivision>('office');
  const [activeOfficeSubmodule, setActiveOfficeSubmodule] = useState<OfficeSubmodule>('dashboard');
  const [activeSiteSubmodule, setActiveSiteSubmodule] = useState<SiteSubmodule>('site-dashboard');
  const [activeCRMSubmodule, setActiveCRMSubmodule] = useState<CRMSubmodule>('crm-dashboard');
  const [activeAISubmodule, setActiveAISubmodule] = useState<AISubmodule>('ai-dashboard');
  const [activeSubPage, setActiveSubPage] = useState<string>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  const [currentUser, setCurrentUser] = useState<ERPUser>(CURRENT_USER);
  const [projects, setProjects] = useState<UAEProject[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>('PRJ-DXB-MARINA-01');

  const [wbsActivities, setWbsActivities] = useState<WBSActivity[]>(INITIAL_WBS_ACTIVITIES);
  const [milestones, setMilestones] = useState<ContractMilestone[]>(INITIAL_MILESTONES);
  const [boqItems, setBoqItems] = useState<MasterBOQItem[]>(INITIAL_BOQ_ITEMS);
  const [variations, setVariations] = useState<VariationOrder[]>(INITIAL_VARIATIONS);
  const [ipcClaims, setIpcClaims] = useState<IPCClaim[]>(INITIAL_IPC_CLAIMS);

  const [materialRequisitions, setMaterialRequisitions] = useState<MaterialRequisition[]>(INITIAL_MATERIAL_REQUISITIONS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [grnInspections, setGrnInspections] = useState<GRNInspection[]>(INITIAL_GRN_INSPECTIONS);
  const [workOrders, setWorkOrders] = useState<SubcontractWorkOrder[]>(INITIAL_WORK_ORDERS);
  const [jmsEntries, setJmsEntries] = useState<JointMeasurementSheet[]>(INITIAL_JMS_ENTRIES);

  const [digitalMB, setDigitalMB] = useState<DigitalMBEntry[]>(INITIAL_DIGITAL_MB);
  const [extraItems, setExtraItems] = useState<ExtraItemVariation[]>(INITIAL_EXTRA_ITEMS);
  const [vatRecords, setVatRecords] = useState<StatutoryVATRecord[]>(INITIAL_VAT_RECORDS);

  const [employees, setEmployees] = useState<HREmployee[]>(INITIAL_HR_EMPLOYEES);
  const [camps, setCamps] = useState<CampFacility[]>(INITIAL_CAMPS);
  const [assets, setAssets] = useState<SiteAsset[]>(INITIAL_SITE_ASSETS);

  const [dprLogs, setDprLogs] = useState<DailyProgressReport[]>(INITIAL_DPR_LOGS);
  const [qaqcItems, setQaqcItems] = useState<QAQCInspectionItem[]>(INITIAL_QAQC_ITEMS);
  const [hseItems, setHseItems] = useState<HSEIncidentOrPTW[]>(INITIAL_HSE_ITEMS);
  const [engineeringDocs, setEngineeringDocs] = useState<EngineeringDrawingRFI[]>(INITIAL_ENGINEERING_DOCS);

  const [crmOpportunities, setCrmOpportunities] = useState<CRMLeadOpportunity[]>(INITIAL_CRM_OPPORTUNITIES);

  const [notifications, setNotifications] = useState<ERPNotification[]>([
    {
      id: 'notif-1',
      title: 'Emirates ID & Visa Expiry Warning',
      message: 'Tariq Mansoor (Sr. HSE Officer) residency visa expires in 14 days. Renewal required under MoHRE portal.',
      type: 'warning',
      timestamp: '10 mins ago',
      division: 'office',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Concrete Batch Lab Testing Quarantine',
      message: 'Lot LOT-STEL-UAE-902 (25 MT Rebar) quarantined pending Sharjah Municipality 7-day tensile test certification.',
      type: 'alert',
      timestamp: '1 hour ago',
      division: 'site',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'IPC Payment Certificate Approval Pending',
      message: 'IPC-04 for Al-Bahar Structural (AED 2,450,000) requires Project Director and Finance review.',
      type: 'info',
      timestamp: '3 hours ago',
      division: 'office',
      read: false,
    },
    {
      id: 'notif-4',
      title: 'MoHRE Summer Midday Break Protocol',
      message: 'Summer midday break compliance is monitored across Aljada site and Saja\'a precast yard (12:30 PM - 3:00 PM).',
      type: 'info',
      timestamp: 'Today',
      division: 'site',
      read: false,
    },
  ]);

  // Load from LocalStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.projects) setProjects(parsed.projects);
        if (parsed.activeProjectId) setActiveProjectId(parsed.activeProjectId);
        if (parsed.wbsActivities) setWbsActivities(parsed.wbsActivities);
        if (parsed.milestones) setMilestones(parsed.milestones);
        if (parsed.boqItems) setBoqItems(parsed.boqItems);
        if (parsed.variations) setVariations(parsed.variations);
        if (parsed.ipcClaims) setIpcClaims(parsed.ipcClaims);
        if (parsed.materialRequisitions) setMaterialRequisitions(parsed.materialRequisitions);
        if (parsed.purchaseOrders) setPurchaseOrders(parsed.purchaseOrders);
        if (parsed.grnInspections) setGrnInspections(parsed.grnInspections);
        if (parsed.workOrders) setWorkOrders(parsed.workOrders);
        if (parsed.employees) setEmployees(parsed.employees);
        if (parsed.crmOpportunities) setCrmOpportunities(parsed.crmOpportunities);
      }
    } catch (e) {
      console.error('Failed to load ERP localStorage:', e);
    }
  }, []);

  // Save to LocalStorage on major changes
  useEffect(() => {
    try {
      const stateToPersist = {
        projects,
        activeProjectId,
        wbsActivities,
        milestones,
        boqItems,
        variations,
        ipcClaims,
        materialRequisitions,
        purchaseOrders,
        grnInspections,
        workOrders,
        employees,
        crmOpportunities,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch (e) {
      console.error('Failed to persist ERP state:', e);
    }
  }, [
    projects,
    activeProjectId,
    wbsActivities,
    milestones,
    boqItems,
    variations,
    ipcClaims,
    materialRequisitions,
    purchaseOrders,
    grnInspections,
    workOrders,
    employees,
    crmOpportunities,
  ]);

  const activeProject =
    projects.find((p) => p.id === activeProjectId) || projects[0] || INITIAL_PROJECTS[0];

  const addProject = (p: UAEProject) => {
    setProjects((prev) => [p, ...prev]);
    setActiveProjectId(p.id);
  };

  const updateProject = (id: string, updates: Partial<UAEProject>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const addWBSActivity = (act: WBSActivity) => setWbsActivities((prev) => [...prev, act]);
  const updateWBSActivity = (id: number, updates: Partial<WBSActivity>) => {
    setWbsActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };
  const deleteWBSActivity = (id: number) => setWbsActivities((prev) => prev.filter((a) => a.id !== id));

  const addMilestone = (m: ContractMilestone) => setMilestones((prev) => [...prev, m]);
  const updateMilestone = (id: number, updates: Partial<ContractMilestone>) => {
    setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };
  const deleteMilestone = (id: number) => setMilestones((prev) => prev.filter((m) => m.id !== id));

  const addBOQItem = (item: MasterBOQItem) => setBoqItems((prev) => [...prev, item]);
  const updateBOQItem = (id: number, updates: Partial<MasterBOQItem>) => {
    setBoqItems((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };
  const deleteBOQItem = (id: number) => setBoqItems((prev) => prev.filter((b) => b.id !== id));

  const addVariation = (v: VariationOrder) => setVariations((prev) => [v, ...prev]);
  const updateVariation = (id: number, updates: Partial<VariationOrder>) => {
    setVariations((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  };
  const deleteVariation = (id: number) => setVariations((prev) => prev.filter((v) => v.id !== id));

  const addIPCClaim = (c: IPCClaim) => setIpcClaims((prev) => [c, ...prev]);
  const updateIPCClaim = (id: number, updates: Partial<IPCClaim>) => {
    setIpcClaims((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const addMaterialRequisition = (mr: MaterialRequisition) =>
    setMaterialRequisitions((prev) => [mr, ...prev]);
  const updateMaterialRequisition = (id: string, updates: Partial<MaterialRequisition>) => {
    setMaterialRequisitions((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const addPurchaseOrder = (po: PurchaseOrder) => setPurchaseOrders((prev) => [po, ...prev]);
  const updatePurchaseOrder = (id: string, updates: Partial<PurchaseOrder>) => {
    setPurchaseOrders((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const addGRNInspection = (grn: GRNInspection) => setGrnInspections((prev) => [grn, ...prev]);
  const updateGRNInspection = (id: string, updates: Partial<GRNInspection>) => {
    setGrnInspections((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const addWorkOrder = (wo: SubcontractWorkOrder) => setWorkOrders((prev) => [wo, ...prev]);
  const updateWorkOrder = (id: string, updates: Partial<SubcontractWorkOrder>) => {
    setWorkOrders((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));
  };

  const addJMSEntry = (jms: JointMeasurementSheet) => setJmsEntries((prev) => [jms, ...prev]);

  const addDigitalMB = (mb: DigitalMBEntry) => setDigitalMB((prev) => [mb, ...prev]);
  const deleteDigitalMB = (id: string) => setDigitalMB((prev) => prev.filter((m) => m.id !== id));

  const addExtraItem = (item: ExtraItemVariation) => setExtraItems((prev) => [item, ...prev]);
  const addVATRecord = (v: StatutoryVATRecord) => setVatRecords((prev) => [v, ...prev]);

  const addEmployee = (e: HREmployee) => setEmployees((prev) => [e, ...prev]);
  const updateEmployee = (id: string, updates: Partial<HREmployee>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };
  const deleteEmployee = (id: string) => setEmployees((prev) => prev.filter((e) => e.id !== id));

  const addCamp = (c: CampFacility) => setCamps((prev) => [...prev, c]);
  const updateCamp = (id: string, updates: Partial<CampFacility>) => {
    setCamps((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const addAsset = (a: SiteAsset) => setAssets((prev) => [...prev, a]);
  const updateAsset = (id: string, updates: Partial<SiteAsset>) => {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const addDPRLog = (dpr: DailyProgressReport) => setDprLogs((prev) => [dpr, ...prev]);
  const addQAQCItem = (q: QAQCInspectionItem) => setQaqcItems((prev) => [q, ...prev]);
  const addHSEItem = (h: HSEIncidentOrPTW) => setHseItems((prev) => [h, ...prev]);
  const addEngineeringDoc = (doc: EngineeringDrawingRFI) => setEngineeringDocs((prev) => [doc, ...prev]);

  const addCRMOpportunity = (opp: CRMLeadOpportunity) =>
    setCrmOpportunities((prev) => [opp, ...prev]);
  const updateCRMOpportunity = (id: string, updates: Partial<CRMLeadOpportunity>) => {
    setCrmOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const exportUnifiedData = () => {
    const payload = {
      projects,
      activeProjectId,
      wbsActivities,
      milestones,
      boqItems,
      variations,
      ipcClaims,
      materialRequisitions,
      purchaseOrders,
      grnInspections,
      workOrders,
      jmsEntries,
      digitalMB,
      extraItems,
      vatRecords,
      employees,
      camps,
      assets,
      dprLogs,
      qaqcItems,
      hseItems,
      engineeringDocs,
      crmOpportunities,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `Dubai_Construction_ERP_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const importUnifiedData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.projects) setProjects(data.projects);
      if (data.activeProjectId) setActiveProjectId(data.activeProjectId);
      if (data.wbsActivities) setWbsActivities(data.wbsActivities);
      if (data.milestones) setMilestones(data.milestones);
      if (data.boqItems) setBoqItems(data.boqItems);
      if (data.variations) setVariations(data.variations);
      if (data.ipcClaims) setIpcClaims(data.ipcClaims);
      if (data.materialRequisitions) setMaterialRequisitions(data.materialRequisitions);
      if (data.purchaseOrders) setPurchaseOrders(data.purchaseOrders);
      if (data.grnInspections) setGrnInspections(data.grnInspections);
      if (data.workOrders) setWorkOrders(data.workOrders);
      if (data.employees) setEmployees(data.employees);
      if (data.crmOpportunities) setCrmOpportunities(data.crmOpportunities);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  };

  const resetToDefaults = () => {
    setProjects(INITIAL_PROJECTS);
    setActiveProjectId('PRJ-SHJ-ALJADA-200');
    setWbsActivities(INITIAL_WBS_ACTIVITIES);
    setMilestones(INITIAL_MILESTONES);
    setBoqItems(INITIAL_BOQ_ITEMS);
    setVariations(INITIAL_VARIATIONS);
    setIpcClaims(INITIAL_IPC_CLAIMS);
    setMaterialRequisitions(INITIAL_MATERIAL_REQUISITIONS);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setGrnInspections(INITIAL_GRN_INSPECTIONS);
    setWorkOrders(INITIAL_WORK_ORDERS);
    setEmployees(INITIAL_HR_EMPLOYEES);
    setCrmOpportunities(INITIAL_CRM_OPPORTUNITIES);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <ERPContext.Provider
      value={{
        activeDivision,
        setActiveDivision,
        activeOfficeSubmodule,
        setActiveOfficeSubmodule,
        activeSiteSubmodule,
        setActiveSiteSubmodule,
        activeCRMSubmodule,
        setActiveCRMSubmodule,
        activeAISubmodule,
        setActiveAISubmodule,
        activeSubPage,
        setActiveSubPage,
        sidebarCollapsed,
        setSidebarCollapsed,
        theme,
        setTheme,
        currentUser,
        setCurrentUser,
        projects,
        activeProjectId,
        activeProject,
        setActiveProjectId,
        addProject,
        updateProject,
        wbsActivities,
        addWBSActivity,
        updateWBSActivity,
        deleteWBSActivity,
        milestones,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        boqItems,
        addBOQItem,
        updateBOQItem,
        deleteBOQItem,
        variations,
        addVariation,
        updateVariation,
        deleteVariation,
        ipcClaims,
        addIPCClaim,
        updateIPCClaim,
        materialRequisitions,
        addMaterialRequisition,
        updateMaterialRequisition,
        purchaseOrders,
        addPurchaseOrder,
        updatePurchaseOrder,
        grnInspections,
        addGRNInspection,
        updateGRNInspection,
        workOrders,
        addWorkOrder,
        updateWorkOrder,
        jmsEntries,
        addJMSEntry,
        digitalMB,
        addDigitalMB,
        deleteDigitalMB,
        extraItems,
        addExtraItem,
        vatRecords,
        addVATRecord,
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        camps,
        addCamp,
        updateCamp,
        assets,
        addAsset,
        updateAsset,
        dprLogs,
        addDPRLog,
        qaqcItems,
        addQAQCItem,
        hseItems,
        addHSEItem,
        engineeringDocs,
        addEngineeringDoc,
        crmOpportunities,
        addCRMOpportunity,
        updateCRMOpportunity,
        notifications,
        dismissNotification,
        markAllNotificationsRead,
        globalSearchQuery,
        setGlobalSearchQuery,
        exportUnifiedData,
        importUnifiedData,
        resetToDefaults,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = (): ERPContextType => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};
