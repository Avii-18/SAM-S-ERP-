import React, { useState, useEffect, useRef } from 'react';
import { useERP } from '../../context/ERPContext';
import { CRMSubmodule } from '../../types/erp';
import {
  Users,
  Building2,
  CalendarCheck,
  Building,
  FileSpreadsheet,
  FileSignature,
  Contact,
  Receipt,
  KeyRound,
  Wrench,
  BarChart3,
  Bot,
  Plus,
  Phone,
  Search,
  Filter,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sun,
  ShieldCheck,
  X,
  FileCheck,
  Layers,
  ChevronRight,
  TrendingUp,
  Volume2,
  VolumeX,
  ArrowUpRight,
} from 'lucide-react';
import Chart from 'chart.js/auto';

// ================= DATA INTERFACES =================
interface SharjahLead {
  id: string;
  name: string;
  mobile: string;
  email: string;
  project: string;
  budget: number;
  unitPref: string;
  source: string;
  stage: 'New' | 'Qualified' | 'Visit Scheduled' | 'Negotiation' | 'Converted';
  executive: string;
  priority: 'High' | 'Medium' | 'Low';
  nextAction: string;
  date: string;
}

interface InventoryUnit {
  unitNo: string;
  tower: string;
  floor: string;
  type: string;
  area: number;
  rate: number;
  totalAED: number;
  status: 'Available' | 'On Hold' | 'Booked' | 'Handover';
  parking: string;
}

interface QuotationItem {
  id: string;
  date: string;
  customer: string;
  unit: string;
  basePrice: number;
  baladiyaFee: number;
  totalTax: number;
  discount: number;
  status: 'Draft' | 'Sent to Client' | 'Pending Approval' | 'Converted to SPA';
}

interface BookingItem {
  id: string;
  date: string;
  customer: string;
  coApplicant: string;
  unit: string;
  agreementVal: number;
  bookingPaid: number;
  draftStatus: string;
  accountsApproved: boolean;
}

interface CollectionItem {
  ref: string;
  customer: string;
  unit: string;
  milestone: string;
  amount: number;
  mode: string;
  receiptFile: string;
  verified: boolean;
  date: string;
}

interface HandoverItem {
  unit: string;
  customer: string;
  baladiya: string;
  sewa: string;
  civDef: string;
  status: string;
}

interface ServiceTicket {
  id: string;
  customer: string;
  unit: string;
  category: string;
  desc: string;
  staff: string;
  status: 'New' | 'In Progress' | 'Resolved' | 'Closed';
  date: string;
}

interface FollowUpTask {
  id: string;
  leadName: string;
  type: string;
  time: string;
  notes: string;
  status: 'Scheduled' | 'Completed';
  executive: string;
}

// Initial Data matching Sharjah Real Estate CRM template
const INITIAL_LEADS: SharjahLead[] = [
  { id: 'LD-2001', name: 'Rashid Al-Nuaimi', mobile: '+971 50 442 1109', email: 'rashid.n@gmail.com', project: 'Aljada', budget: 1450000, unitPref: '3 BHK Townhouse', source: 'Property Finder', stage: 'Qualified', executive: 'Tariq Al-Suwaidi', priority: 'High', nextAction: 'Schedule Site Visit at Aljada Discovery Centre', date: '2026-10-28' },
  { id: 'LD-2002', name: 'Mariam Al-Qasimi', mobile: '+971 55 881 2290', email: 'mariam.q@outlook.ae', project: 'Maryam Island', budget: 950000, unitPref: '2 BHK Apartment', source: 'Bayut', stage: 'New', executive: 'Unassigned', priority: 'Medium', nextAction: 'AI Bilingual Call Pending', date: '2026-10-30' },
  { id: 'LD-2003', name: 'John Henderson', mobile: '+971 52 331 9904', email: 'john.h@dubaiholdings.ae', project: 'Tilal City', budget: 2200000, unitPref: '4 BHK Villa', source: 'Broker / Agent', stage: 'Negotiation', executive: 'Fatima Al-Marzooqi', priority: 'High', nextAction: 'Finalize 2% payment plan discount', date: '2026-10-25' },
  { id: 'LD-2004', name: 'Amina Al-Mazrouei', mobile: '+971 56 112 4433', email: 'amina.m@sharjah.gov.ae', project: 'Al Majaz Tower', budget: 780000, unitPref: '1 BHK Apartment', source: 'Walk-in', stage: 'Visit Scheduled', executive: 'Zaid Al-Ali', priority: 'High', nextAction: 'Corniche showroom visit at 4 PM', date: '2026-10-29' },
  { id: 'LD-2005', name: 'Mohammed Al-Zahabi', mobile: '+971 50 776 2201', email: 'm.zahabi@investuae.com', project: 'Aljada', budget: 3200000, unitPref: '4 BHK Penthouse', source: 'Meta Ads', stage: 'New', executive: 'Tariq Al-Suwaidi', priority: 'High', nextAction: 'Send VIP brochure & payment options', date: '2026-10-31' },
];

const INITIAL_INVENTORY: InventoryUnit[] = [
  { unitNo: 'A-101', tower: 'Aljada Blvd', floor: 'Floor 1', type: '2 BHK Apartment', area: 1250, rate: 950, totalAED: 1187500, status: 'Available', parking: 'Bay #B-01' },
  { unitNo: 'A-102', tower: 'Aljada Blvd', floor: 'Floor 1', type: '2 BHK Apartment', area: 1250, rate: 950, totalAED: 1187500, status: 'Booked', parking: 'Bay #B-02' },
  { unitNo: 'A-201', tower: 'Aljada Blvd', floor: 'Floor 2', type: '3 BHK Townhouse', area: 1950, rate: 1100, totalAED: 2145000, status: 'Available', parking: 'Bay #B-05' },
  { unitNo: 'A-202', tower: 'Aljada Blvd', floor: 'Floor 2', type: '3 BHK Townhouse', area: 1950, rate: 1100, totalAED: 2145000, status: 'On Hold', parking: 'Bay #B-06' },
  { unitNo: 'A-301', tower: 'Aljada Blvd', floor: 'Floor 3', type: '4 BHK Penthouse', area: 3200, rate: 1400, totalAED: 4480000, status: 'Handover', parking: 'Bay #B-10' },
  { unitNo: 'A-302', tower: 'Aljada Blvd', floor: 'Floor 3', type: '3 BHK Townhouse', area: 2100, rate: 1150, totalAED: 2415000, status: 'Available', parking: 'Bay #B-11' },
  { unitNo: 'T-101', tower: 'Tilal Heights', floor: 'Floor 1', type: '3 BHK Villa', area: 2600, rate: 850, totalAED: 2210000, status: 'Available', parking: 'Double Garage' },
  { unitNo: 'T-102', tower: 'Tilal Heights', floor: 'Floor 1', type: '4 BHK Villa', area: 3400, rate: 880, totalAED: 2992000, status: 'Booked', parking: 'Double Garage' },
  { unitNo: 'T-201', tower: 'Tilal Heights', floor: 'Floor 2', type: '4 BHK Villa', area: 3400, rate: 880, totalAED: 2992000, status: 'Available', parking: 'Double Garage' },
  { unitNo: 'RET-01', tower: 'Maryam Waterfront', floor: 'Ground Floor', type: 'Retail Shop', area: 850, rate: 2200, totalAED: 1870000, status: 'Available', parking: 'Visitor Bay #V-01' },
  { unitNo: 'RET-02', tower: 'Maryam Waterfront', floor: 'Ground Floor', type: 'Cafe / F&B Unit', area: 1100, rate: 2400, totalAED: 2640000, status: 'On Hold', parking: 'Visitor Bay #V-02' },
];

const INITIAL_QUOTATIONS: QuotationItem[] = [
  { id: 'QT-901', date: '2026-10-26', customer: 'John Henderson', unit: 'A-201', basePrice: 2145000, baladiyaFee: 85800, totalTax: 2230800, discount: 45000, status: 'Pending Approval' },
  { id: 'QT-902', date: '2026-10-29', customer: 'Rashid Al-Nuaimi', unit: 'A-101', basePrice: 1187500, baladiyaFee: 47500, totalTax: 1235000, discount: 20000, status: 'Sent to Client' },
  { id: 'QT-903', date: '2026-10-31', customer: 'Amina Al-Mazrouei', unit: 'RET-01', basePrice: 1870000, baladiyaFee: 74800, totalTax: 1944800, discount: 0, status: 'Draft' },
];

const INITIAL_BOOKINGS: BookingItem[] = [
  { id: 'BK-701', date: '2026-10-18', customer: 'Rashid Al-Nuaimi', coApplicant: 'Fatima Al-Nuaimi', unit: 'A-102', agreementVal: 1187500, bookingPaid: 118750, draftStatus: 'Ready for Baladiya Registration', accountsApproved: true },
  { id: 'BK-702', date: '2026-10-22', customer: 'John Henderson', coApplicant: '--', unit: 'A-301', agreementVal: 4480000, bookingPaid: 450000, draftStatus: 'Under Legal Review', accountsApproved: true },
  { id: 'BK-703', date: '2026-10-30', customer: 'Saeed Al-Tayer', coApplicant: 'Noura Al-Tayer', unit: 'T-102', agreementVal: 2992000, bookingPaid: 299200, draftStatus: 'Executed & Registered', accountsApproved: true },
];

const INITIAL_COLLECTIONS: CollectionItem[] = [
  { ref: 'DEM-401', customer: 'Rashid Al-Nuaimi', unit: 'A-102', milestone: 'Booking Deposit (10%)', amount: 118750, mode: 'UAE Bank Transfer (IBAN)', receiptFile: 'adcb_slip_701.pdf', verified: true, date: '2026-10-19' },
  { ref: 'DEM-402', customer: 'John Henderson', unit: 'A-301', milestone: 'SPA Signing (10%)', amount: 450000, mode: 'Manager Cheque', receiptFile: 'cheque_img.jpg', verified: false, date: '2026-10-23' },
  { ref: 'DEM-403', customer: 'Saeed Al-Tayer', unit: 'T-102', milestone: 'Foundation Milestone (10%)', amount: 299200, mode: 'ENBD Direct Wire', receiptFile: 'enbd_swift_receipt.pdf', verified: true, date: '2026-10-30' },
];

const INITIAL_HANDOVERS: HandoverItem[] = [
  { unit: 'A-301', customer: 'John Henderson', baladiya: 'Certificate Issued', sewa: 'Meter Connected', civDef: 'Approved', status: 'Ready for Key Handover' },
  { unit: 'A-102', customer: 'Rashid Al-Nuaimi', baladiya: 'Inspection Scheduled', sewa: 'Application Submitted', civDef: 'Approved', status: 'Fitout Stage' },
  { unit: 'T-102', customer: 'Saeed Al-Tayer', baladiya: 'Certificate Issued', sewa: 'Meter Connected', civDef: 'Approved', status: 'Keys Delivered' },
];

const INITIAL_SERVICES: ServiceTicket[] = [
  { id: 'TCK-501', customer: 'Rashid Al-Nuaimi', unit: 'A-102', category: 'AC Ducts & Cooling (SEWA)', desc: 'Living room chiller thermostat calibration needed', staff: 'Hassan MEP Tech', status: 'In Progress', date: '2026-10-29' },
  { id: 'TCK-502', customer: 'John Henderson', unit: 'A-301', category: 'Civil Snag / Paint Touchup', desc: 'Balcony balustrade seal touchup following summer inspection', staff: 'Zubair Finishes', status: 'New', date: '2026-10-30' },
];

const INITIAL_FOLLOWUPS: FollowUpTask[] = [
  { id: 'TSK-101', leadName: 'Rashid Al-Nuaimi', type: 'Site Visit Confirmation', time: '10:30 AM', notes: 'Aljada Discovery Center walkthrough with Tariq', status: 'Scheduled', executive: 'Tariq Al-Suwaidi' },
  { id: 'TSK-102', leadName: 'Mariam Al-Qasimi', type: 'AI Telecaller Follow-up', time: '02:00 PM', notes: 'Discuss Maryam Island 2 BHK waterfront payment terms', status: 'Scheduled', executive: 'AI Bilingual Telecaller' },
  { id: 'TSK-103', leadName: 'John Henderson', type: 'SPA Contract Signing', time: '04:30 PM', notes: 'Verify Manager Cheque and Baladiya NOC docs', status: 'Scheduled', executive: 'Fatima Al-Marzooqi' },
];

export const CRMWorkspace: React.FC = () => {
  const { activeCRMSubmodule, setActiveCRMSubmodule } = useERP();

  // Internal CRM states
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [leads, setLeads] = useState<SharjahLead[]>(INITIAL_LEADS);
  const [inventory, setInventory] = useState<InventoryUnit[]>(INITIAL_INVENTORY);
  const [quotations, setQuotations] = useState<QuotationItem[]>(INITIAL_QUOTATIONS);
  const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS);
  const [collections, setCollections] = useState<CollectionItem[]>(INITIAL_COLLECTIONS);
  const [handovers, setHandovers] = useState<HandoverItem[]>(INITIAL_HANDOVERS);
  const [services, setServices] = useState<ServiceTicket[]>(INITIAL_SERVICES);
  const [followups, setFollowups] = useState<FollowUpTask[]>(INITIAL_FOLLOWUPS);

  // Selected sub-items for 360 customer view and unit modal
  const [selectedCustomerBooking, setSelectedCustomerBooking] = useState<BookingItem>(bookings[0] || INITIAL_BOOKINGS[0]);
  const [selectedUnit, setSelectedUnit] = useState<InventoryUnit | null>(null);
  const [selectedTower, setSelectedTower] = useState<string>('Aljada Blvd');

  // Filter states for Leads
  const [filterStage, setFilterStage] = useState<string>('All');
  const [filterSource, setFilterSource] = useState<string>('All');
  const [filterExec, setFilterExec] = useState<string>('All');
  const [filterBudget, setFilterBudget] = useState<string>('');
  const [customerSearch, setCustomerSearch] = useState<string>('');

  // Modals
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);
  const [isCreateQuoteModalOpen, setIsCreateQuoteModalOpen] = useState(false);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [isRaiseTicketModalOpen, setIsRaiseTicketModalOpen] = useState(false);
  const [isScheduleTaskModalOpen, setIsScheduleTaskModalOpen] = useState(false);

  // AI Voice Telecaller simulation states
  const [isAITelecallerOpen, setIsAITelecallerOpen] = useState(false);
  const [telecallerLead, setTelecallerLead] = useState<SharjahLead>(leads[0]);
  const [telecallerLang, setTelecallerLang] = useState<'ar-AE' | 'en-AE'>('ar-AE');
  const [isCallActive, setIsCallActive] = useState(false);
  const [callTimer, setCallTimer] = useState<number>(0);
  const [transcript, setTranscript] = useState<Array<{ speaker: string; text: string }>>([]);
  const [aiExtracted, setAiExtracted] = useState({
    interest: '--',
    budget: '--',
    unitType: '--',
    timeline: '--',
  });
  const [isFeedReady, setIsFeedReady] = useState(false);

  // Form states for Add/Edit Lead
  const [leadFormName, setLeadFormName] = useState('');
  const [leadFormMobile, setLeadFormMobile] = useState('');
  const [leadFormProject, setLeadFormProject] = useState('Aljada');
  const [leadFormBudget, setLeadFormBudget] = useState(1450000);
  const [leadFormUnitPref, setLeadFormUnitPref] = useState('3 BHK Townhouse');
  const [leadFormSource, setLeadFormSource] = useState('Property Finder');
  const [leadFormExec, setLeadFormExec] = useState('Tariq Al-Suwaidi');

  // Form states for Payment
  const [payBookingId, setPayBookingId] = useState(bookings[0]?.id || '');
  const [payAmount, setPayAmount] = useState(150000);
  const [payMode, setPayMode] = useState('UAE Bank Transfer (IBAN)');
  const [payTxnRef, setPayTxnRef] = useState('');
  const [paySlipName, setPaySlipName] = useState('');

  // Form states for Quote
  const [quoteCustomer, setQuoteCustomer] = useState('Mariam Al-Qasimi');
  const [quoteUnit, setQuoteUnit] = useState('A-101');
  const [quoteBase, setQuoteBase] = useState(1187500);
  const [quoteDiscount, setQuoteDiscount] = useState(25000);

  // Form states for New Unit
  const [newUnitNo, setNewUnitNo] = useState('');
  const [newUnitType, setNewUnitType] = useState('2 BHK Apartment');
  const [newUnitFloor, setNewUnitFloor] = useState('Floor 4');
  const [newUnitArea, setNewUnitArea] = useState(1280);
  const [newUnitPrice, setNewUnitPrice] = useState(1250000);

  // Form states for Service Ticket
  const [ticketCustomer, setTicketCustomer] = useState('Rashid Al-Nuaimi');
  const [ticketUnit, setTicketUnit] = useState('A-102');
  const [ticketCat, setTicketCat] = useState('AC Ducts & Cooling (SEWA)');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketStaff, setTicketStaff] = useState('Hassan MEP Tech');

  // Chart ref
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Currency Formatter
  const formatAED = (num: number) => `AED ${Number(num || 0).toLocaleString('en-US')}`;

  // Map active submodules to UI tab
  const activeTab = (() => {
    if (activeCRMSubmodule === 'crm-dashboard') return 'dashboard';
    if (activeCRMSubmodule === 'clients') return 'customers';
    if (activeCRMSubmodule === 'pipeline') return 'leads';
    if (activeCRMSubmodule === 'proposals') return 'quotations';
    if (activeCRMSubmodule === 'activities') return 'followups';
    if (activeCRMSubmodule === 'support') return 'service';
    return activeCRMSubmodule || 'dashboard';
  })();

  const setTab = (tab: string) => {
    setActiveCRMSubmodule(tab as CRMSubmodule);
  };

  // Inventory Chart Effect
  useEffect(() => {
    if (activeTab === 'dashboard' && chartCanvasRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const avail = inventory.filter((i) => i.status === 'Available').length;
      const hold = inventory.filter((i) => i.status === 'On Hold').length;
      const booked = inventory.filter((i) => i.status === 'Booked' || i.status === 'Handover').length;

      chartInstanceRef.current = new Chart(chartCanvasRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Available', 'On Hold', 'Booked / Handover'],
          datasets: [
            {
              data: [avail, hold, booked],
              backgroundColor: ['#43856B', '#C18A43', '#826B52'],
              borderWidth: 2,
              borderColor: '#FFFFFF',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          cutout: '72%',
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [activeTab, inventory]);

  // Telecaller Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // AI Speech Synthesis Call Runner
  const handleStartAICall = () => {
    if (!telecallerLead) return;
    setIsCallActive(true);
    setCallTimer(0);
    setIsFeedReady(false);
    setTranscript([
      { speaker: 'System (Sharjah Telecom Gateway)', text: `Connected to ${telecallerLead.mobile} (Etisalat 5G HD Voice)...` },
    ]);

    const dialogue =
      telecallerLang === 'ar-AE'
        ? [
            {
              speaker: 'مريم (الذكاء الاصطناعي - مبيعات الشارقة)',
              text: `السلام عليكم أستاذ ${telecallerLead.name}، معاكم مريم من مشروع الجادة بالشارقة. هل أنتو مهتمين بفلل أو شقق سكنية في الشارقة؟`,
            },
            {
              speaker: telecallerLead.name,
              text: `وعليكم السلام يا مريم. نعم، أدور على تاون هاوس 3 غرف في الجادة بحدود مليون و400 ألف درهم.`,
            },
            {
              speaker: 'مريم (الذكاء الاصطناعي - مبيعات الشارقة)',
              text: `ممتاز جداً! لدينا وحدات تاون هاوس 3 غرف تبدأ من مليون و450 ألف درهم مع خطة سداد مرنة وإعفاء من رسوم بلدية الشارقة. تحب نحجز لك زيارة لموقع الجادة هذا السبت الساعة 5 مساءً؟`,
            },
            {
              speaker: telecallerLead.name,
              text: `إي نعم، ممتاز جداً السبت الساعة 5 العصر في مركز الاستكشاف.`,
            },
            {
              speaker: 'مريم (الذكاء الاصطناعي - مبيعات الشارقة)',
              text: `تم الحجز وتثبيت الموعد بنجاح! بيستقبلك مستشارنا العقاري طارق السويدي في مركز المبيعات. شكراً لك ويومك سعيد!`,
            },
          ]
        : [
            {
              speaker: 'Maryam (AI Sharjah Property Advisor)',
              text: `Good morning Mr. ${telecallerLead.name}, this is Maryam calling from Aljada Master Community in Sharjah. Are you exploring luxury townhouses or apartments today?`,
            },
            {
              speaker: telecallerLead.name,
              text: `Hello Maryam. Yes, I am looking for a 3-bedroom townhouse in Aljada with an easy developer payment plan around 1.45 Million AED.`,
            },
            {
              speaker: 'Maryam (AI Sharjah Property Advisor)',
              text: `That is ideal! We have 3-bedroom residences available with 0% interest milestones and pre-approved Sharjah Baladiya registration. May I schedule a private tour for you this Saturday at 5 PM?`,
            },
            {
              speaker: telecallerLead.name,
              text: `Yes, Saturday at 5 PM works perfectly for me and my family.`,
            },
            {
              speaker: 'Maryam (AI Sharjah Property Advisor)',
              text: `Confirmed! Your VIP site appointment is registered with our Senior Director Tariq Al-Suwaidi. An SMS confirmation with location pin has been dispatched. Thank you!`,
            },
          ];

    let step = 0;
    const executeStep = () => {
      if (step >= dialogue.length) {
        setIsCallActive(false);
        setIsFeedReady(true);
        setAiExtracted({
          interest: 'High (Townhouse Buyer)',
          budget: 'AED 1,450,000',
          unitType: '3 BHK Townhouse',
          timeline: 'Saturday 5:00 PM Site Visit',
        });
        return;
      }

      const turn = dialogue[step];
      setTranscript((prev) => [...prev, turn]);

      if ('speechSynthesis' in window && turn.speaker.includes('Maryam') || turn.speaker.includes('مريم')) {
        const utter = new SpeechSynthesisUtterance(turn.text);
        utter.lang = telecallerLang;
        utter.rate = 0.95;
        utter.pitch = 1.05;
        utter.onend = () => {
          step++;
          setTimeout(executeStep, 1000);
        };
        utter.onerror = () => {
          step++;
          setTimeout(executeStep, 1400);
        };
        window.speechSynthesis.speak(utter);
      } else {
        step++;
        setTimeout(executeStep, 1800);
      }
    };

    setTimeout(executeStep, 1200);
  };

  const handleFeedAICallToCRM = () => {
    if (!telecallerLead) return;
    setLeads((prev) =>
      prev.map((l) =>
        l.id === telecallerLead.id
          ? {
              ...l,
              stage: 'Visit Scheduled',
              budget: 1450000,
              nextAction: 'AI Booked Aljada Site Visit (Saturday 5:00 PM)',
              priority: 'High',
            }
          : l
      )
    );
    setFollowups((prev) => [
      {
        id: `TSK-${Date.now().toString().slice(-4)}`,
        leadName: telecallerLead.name,
        type: 'Aljada VIP Site Tour',
        time: 'Saturday 5:00 PM',
        notes: 'AI Bilingual Call qualification: 3 BHK Townhouse, Budget AED 1.45M',
        status: 'Scheduled',
        executive: 'Tariq Al-Suwaidi',
      },
      ...prev,
    ]);
    setIsAITelecallerOpen(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  // Lead CRUD handlers
  const handleOpenAddLead = () => {
    setEditingLeadId(null);
    setLeadFormName('');
    setLeadFormMobile('+971 50 ');
    setLeadFormProject('Aljada');
    setLeadFormBudget(1450000);
    setLeadFormUnitPref('3 BHK Townhouse');
    setLeadFormSource('Property Finder');
    setLeadFormExec('Tariq Al-Suwaidi');
    setIsAddLeadModalOpen(true);
  };

  const handleOpenEditLead = (lead: SharjahLead) => {
    setEditingLeadId(lead.id);
    setLeadFormName(lead.name);
    setLeadFormMobile(lead.mobile);
    setLeadFormProject(lead.project);
    setLeadFormBudget(lead.budget);
    setLeadFormUnitPref(lead.unitPref);
    setLeadFormSource(lead.source);
    setLeadFormExec(lead.executive);
    setIsAddLeadModalOpen(true);
  };

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLeadId) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === editingLeadId
            ? {
                ...l,
                name: leadFormName,
                mobile: leadFormMobile,
                project: leadFormProject,
                budget: Number(leadFormBudget),
                unitPref: leadFormUnitPref,
                source: leadFormSource,
                executive: leadFormExec,
              }
            : l
        )
      );
    } else {
      const newLead: SharjahLead = {
        id: `LD-${Math.floor(2000 + Math.random() * 8000)}`,
        name: leadFormName,
        mobile: leadFormMobile,
        email: `${leadFormName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        project: leadFormProject,
        budget: Number(leadFormBudget),
        unitPref: leadFormUnitPref,
        source: leadFormSource,
        stage: 'New',
        executive: leadFormExec,
        priority: 'Medium',
        nextAction: 'Initial qualification required',
        date: new Date().toISOString().split('T')[0],
      };
      setLeads((prev) => [newLead, ...prev]);
    }
    setIsAddLeadModalOpen(false);
  };

  const handleDeleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    if (filterStage !== 'All' && l.stage !== filterStage) return false;
    if (filterSource !== 'All' && l.source !== filterSource) return false;
    if (filterExec !== 'All' && l.executive !== filterExec) return false;
    if (filterBudget && l.budget < Number(filterBudget)) return false;
    return true;
  });

  // Inventory handlers
  const handleHoldUnit = (unitNo: string) => {
    setInventory((prev) =>
      prev.map((u) => (u.unitNo === unitNo ? { ...u, status: 'On Hold' } : u))
    );
    setIsUnitModalOpen(false);
  };

  const handleProceedBookingFromUnit = (unit: InventoryUnit) => {
    setIsUnitModalOpen(false);
    setNewUnitNo(unit.unitNo);
    setIsNewBookingModalOpen(true);
  };

  // Payment recording
  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const bk = bookings.find((b) => b.id === payBookingId);
    const newRecord: CollectionItem = {
      ref: `DEM-${Math.floor(400 + Math.random() * 600)}`,
      customer: bk ? bk.customer : 'Sharjah Investor',
      unit: bk ? bk.unit : 'A-101',
      milestone: 'Construction Progress Milestone',
      amount: Number(payAmount),
      mode: `${payMode} (${payTxnRef || 'Ref Verified'})`,
      receiptFile: paySlipName || 'bank_slip.pdf',
      verified: false,
      date: new Date().toISOString().split('T')[0],
    };
    setCollections((prev) => [newRecord, ...prev]);
    setIsRecordPaymentModalOpen(false);
  };

  const handleToggleVerifyPayment = (ref: string) => {
    setCollections((prev) =>
      prev.map((c) => (c.ref === ref ? { ...c, verified: !c.verified } : c))
    );
  };

  // Quotation create
  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    const baladiya = Number(quoteBase) * 0.04;
    const total = Number(quoteBase) + baladiya - Number(quoteDiscount);
    const newQ: QuotationItem = {
      id: `QT-${Math.floor(900 + Math.random() * 100)}`,
      date: new Date().toISOString().split('T')[0],
      customer: quoteCustomer,
      unit: quoteUnit,
      basePrice: Number(quoteBase),
      baladiyaFee: baladiya,
      totalTax: total,
      discount: Number(quoteDiscount),
      status: 'Sent to Client',
    };
    setQuotations((prev) => [newQ, ...prev]);
    setIsCreateQuoteModalOpen(false);
  };

  // Export report helper
  const handleExportCSV = (reportType: string) => {
    const csvContent = `data:text/csv;charset=utf-8,Report,Timestamp,Jurisdiction\n${reportType},${new Date().toISOString()},Sharjah UAE Baladiya Regulated`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sharjah_CRM_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered customer bookings for 360 view
  const filteredCustomerBookings = bookings.filter(
    (b) =>
      b.customer.toLowerCase().includes(customerSearch.toLowerCase()) ||
      b.unit.toLowerCase().includes(customerSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 text-[#27332F] pb-12">
      {/* 1. TOP HEADER BANNER (Warm Sandstone + Luxury Corporate Theme) */}
      <div className="bg-white rounded-2xl border border-[#E2D8CB] p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#27332F] text-[#B69A70] flex items-center justify-center font-bold shadow-sm shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F2EDE5] text-[#826B52] border border-[#E2D8CB]">
                SHARJAH & UAE CRM • DIVISION 3
              </span>
              <span className="text-xs text-[#77746D]">|</span>
              <span className="text-xs text-[#43856B] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Baladiya & MoHRE Regulated
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#27332F] tracking-tight mt-0.5">
              Sharjah Real Estate CRM & Executive ERP
            </h1>
          </div>
        </div>

        {/* Master Project Selector & Badges */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Sharjah Community Selector */}
          <div className="flex items-center gap-2 bg-[#F5F0E8] border border-[#E2D8CB] px-3 py-1.5 rounded-lg text-xs font-medium">
            <Building className="w-3.5 h-3.5 text-[#826B52]" />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              aria-label="Filter by Sharjah Community"
              className="bg-transparent text-[#27332F] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Sharjah Projects (Consolidated)</option>
              <option value="Aljada">Aljada Master Community (Muwaileh)</option>
              <option value="Tilal City">Tilal City Residential (Emirates Road)</option>
              <option value="Maryam Island">Maryam Island Waterfront (Al Khan)</option>
              <option value="Al Majaz Tower">Al Majaz Tower Residences (Corniche)</option>
            </select>
          </div>

          {/* MoHRE Midday Break Compliance Badge */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#C18A43]/10 border border-[#C18A43]/30 px-3 py-1.5 rounded-lg text-xs text-[#C18A43] font-medium">
            <Sun className="w-3.5 h-3.5 text-[#C18A43] animate-pulse" />
            <span>MoHRE Midday Break Active</span>
          </div>

          {/* Quick Action Button */}
          <button
            onClick={handleOpenAddLead}
            className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#B69A70]" />
            <span>Quick Action</span>
          </button>
        </div>
      </div>

      {/* 2. SUBMODULE NAVIGATION STRIP (All 11 Sharjah CRM modules) */}
      <div className="bg-white rounded-xl border border-[#E2D8CB] p-1.5 shadow-xs overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
            { id: 'leads', name: 'Leads & Enquiries', icon: Users },
            { id: 'followups', name: 'Follow-ups & Tasks', icon: CalendarCheck },
            { id: 'inventory', name: 'Unit Inventory Grid', icon: Building },
            { id: 'quotations', name: 'Cost Sheets & Quotes', icon: FileSpreadsheet },
            { id: 'bookings', name: 'Bookings & SPAs', icon: FileSignature },
            { id: 'customers', name: 'Customer 360° (EID)', icon: Contact },
            { id: 'collections', name: 'Collections & Demands', icon: Receipt },
            { id: 'handover', name: 'Baladiya & Handover', icon: KeyRound },
            { id: 'service', name: 'Maintenance & Snags', icon: Wrench },
            { id: 'reports', name: 'Sharjah MIS & Reports', icon: FileCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurr = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isCurr
                    ? 'bg-[#27332F] text-white shadow-xs'
                    : 'text-[#77746D] hover:text-[#27332F] hover:bg-[#F5F0E8]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurr ? 'text-[#B69A70]' : 'text-[#826B52]'}`} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          MODULE 1: EXECUTIVE DASHBOARD
          ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Subheader bar with AI Telecaller Launcher */}
          <div className="bg-white rounded-xl border border-[#E2D8CB] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-[#27332F] flex items-center gap-2">
                Executive Sales & Inventory Overview
                <span className="bg-[#B69A70]/15 text-[#826B52] text-[11px] px-2 py-0.5 rounded-full font-bold border border-[#B69A70]/30">
                  AED Stream
                </span>
              </h2>
              <p className="text-xs text-[#77746D]">
                Real-time metrics for Sharjah inventory, AED collections, and Baladiya / MoHRE statutory compliance.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExportCSV('Executive_Dashboard')}
                className="bg-[#F5F0E8] hover:bg-[#F2EDE5] text-[#27332F] border border-[#E2D8CB] text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5 text-[#826B52]" />
                <span>Export MIS Sheet</span>
              </button>
              <button
                onClick={() => {
                  setTelecallerLead(leads[0]);
                  setIsAITelecallerOpen(true);
                }}
                className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition shadow-sm border border-[#B69A70]/40"
              >
                <Bot className="w-3.5 h-3.5 text-[#B69A70]" />
                <span>Launch AI Arabic/English Telecaller</span>
              </button>
            </div>
          </div>

          {/* Key Metric Scorecards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
            <div className="bg-white border border-[#E2D8CB] p-4 rounded-xl shadow-xs">
              <div className="flex justify-between text-xs text-[#77746D]">
                <span>Total Enquiries</span>
                <Users className="w-4 h-4 text-[#66869A]" />
              </div>
              <div className="text-2xl font-extrabold text-[#27332F] mt-2">{leads.length + 137}</div>
              <p className="text-[10px] text-[#43856B] mt-1 font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +18% this month
              </p>
            </div>

            <div className="bg-white border border-[#E2D8CB] p-4 rounded-xl shadow-xs">
              <div className="flex justify-between text-xs text-[#77746D]">
                <span>Unassigned Leads</span>
                <Clock className="w-4 h-4 text-[#C18A43]" />
              </div>
              <div className="text-2xl font-extrabold text-[#C18A43] mt-2">
                {leads.filter((l) => l.executive === 'Unassigned').length + 6}
              </div>
              <p className="text-[10px] text-[#77746D] mt-1">Requires manager action</p>
            </div>

            <div className="bg-white border border-[#E2D8CB] p-4 rounded-xl shadow-xs">
              <div className="flex justify-between text-xs text-[#77746D]">
                <span>Confirmed Bookings</span>
                <FileSignature className="w-4 h-4 text-[#826B52]" />
              </div>
              <div className="text-2xl font-extrabold text-[#27332F] mt-2">{bookings.length + 25}</div>
              <p className="text-[10px] text-[#826B52] mt-1 font-semibold">Total AED 48.50 M Value</p>
            </div>

            <div className="bg-white border border-[#E2D8CB] p-4 rounded-xl shadow-xs">
              <div className="flex justify-between text-xs text-[#77746D]">
                <span>Collections Recd (YTD)</span>
                <Receipt className="w-4 h-4 text-[#43856B]" />
              </div>
              <div className="text-xl font-extrabold text-[#27332F] mt-2">AED 29.85 M</div>
              <p className="text-[10px] text-[#43856B] mt-1 font-semibold">84% of total demanded</p>
            </div>

            <div className="bg-white border border-[#E2D8CB] p-4 rounded-xl shadow-xs col-span-2 sm:col-span-1">
              <div className="flex justify-between text-xs text-[#77746D]">
                <span>Overdue Collections</span>
                <AlertTriangle className="w-4 h-4 text-[#B85C50]" />
              </div>
              <div className="text-xl font-extrabold text-[#B85C50] mt-2">AED 2.42 M</div>
              <p className="text-[10px] text-[#B85C50] mt-1 font-semibold">12 Pending demands</p>
            </div>
          </div>

          {/* Visual Grid: Inventory Chart, Pipeline Funnel, Statutory Notices */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Inventory Breakdown Donut */}
            <div className="bg-white border border-[#E2D8CB] p-5 rounded-xl shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-[#27332F]">Sharjah Unit Inventory Breakdown</h3>
                  <span className="text-[11px] text-[#77746D]">Aljada & Maryam Island</span>
                </div>
                <div className="h-52 relative flex items-center justify-center">
                  <canvas ref={chartCanvasRef} />
                </div>
              </div>
              <div className="grid grid-cols-3 text-center border-t border-[#E2D8CB] pt-3 mt-3 text-xs">
                <div>
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#43856B] mr-1" />
                  <span className="text-[#77746D]">Available</span>
                  <p className="font-bold text-[#27332F] mt-0.5">
                    {inventory.filter((i) => i.status === 'Available').length * 7} Units
                  </p>
                </div>
                <div>
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#C18A43] mr-1" />
                  <span className="text-[#77746D]">On Hold</span>
                  <p className="font-bold text-[#27332F] mt-0.5">
                    {inventory.filter((i) => i.status === 'On Hold').length * 3} Units
                  </p>
                </div>
                <div>
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#826B52] mr-1" />
                  <span className="text-[#77746D]">Booked/Sold</span>
                  <p className="font-bold text-[#27332F] mt-0.5">
                    {inventory.filter((i) => i.status === 'Booked' || i.status === 'Handover').length * 5} Units
                  </p>
                </div>
              </div>
            </div>

            {/* Pipeline Conversion Funnel */}
            <div className="bg-white border border-[#E2D8CB] p-5 rounded-xl shadow-xs">
              <h3 className="text-sm font-bold text-[#27332F] mb-4">Sales Pipeline Conversion Funnel</h3>
              <div className="space-y-3.5">
                {[
                  { label: 'Enquiries / New Leads', count: 142, pct: 100, barColor: 'bg-[#66869A]' },
                  { label: 'Contacted & Qualified', count: 94, pct: 66, barColor: 'bg-[#826B52]' },
                  { label: 'Site Visits Completed', count: 52, pct: 36, barColor: 'bg-[#C18A43]' },
                  { label: 'Quotation / Negotiation', count: 38, pct: 26, barColor: 'bg-[#B69A70]' },
                  { label: 'Bookings Confirmed (SPA)', count: 28, pct: 20, barColor: 'bg-[#43856B]' },
                ].map((stg) => (
                  <div key={stg.label}>
                    <div className="flex justify-between text-xs text-[#27332F] mb-1">
                      <span className="font-medium text-[#77746D]">{stg.label}</span>
                      <span className="font-bold">{stg.count}</span>
                    </div>
                    <div className="w-full bg-[#F5F0E8] h-2.5 rounded-full overflow-hidden">
                      <div className={`${stg.barColor} h-full rounded-full transition-all duration-500`} style={{ width: `${stg.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statutory & Regulatory Action Notices */}
            <div className="bg-white border border-[#E2D8CB] p-5 rounded-xl shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#27332F] mb-3">Sharjah Statutory & Action Notices</h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-[#F5F0E8] rounded-lg border border-[#E2D8CB]">
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 bg-[#C18A43]/15 text-[#C18A43] rounded-md">
                        <Sun className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <p className="font-bold text-[#27332F]">MoHRE Midday Work Ban</p>
                        <p className="text-[10px] text-[#77746D]">12:30 PM - 3:00 PM (Summer Active)</p>
                      </div>
                    </div>
                    <span className="text-[#C18A43] font-bold text-[11px]">Enforced</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#F5F0E8] rounded-lg border border-[#E2D8CB]">
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 bg-[#43856B]/15 text-[#43856B] rounded-md">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <p className="font-bold text-[#27332F]">Sharjah Civil Defense (SCD)</p>
                        <p className="text-[10px] text-[#77746D]">Fire safety NOCs approved for Towers</p>
                      </div>
                    </div>
                    <span className="text-[#43856B] font-bold text-[11px]">Cleared</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#F5F0E8] rounded-lg border border-[#E2D8CB]">
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 bg-[#66869A]/15 text-[#66869A] rounded-md">
                        <Wrench className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <p className="font-bold text-[#27332F]">SEWA Utility Connections</p>
                        <p className="text-[10px] text-[#77746D]">Water & Power meter applications</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setTab('handover')}
                      className="text-[#826B52] font-semibold text-[11px] hover:underline"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Telecaller Prompt Callout */}
              <div className="bg-[#27332F] text-white p-3.5 rounded-xl border border-[#B69A70]/30 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#B69A70] flex items-center gap-1.5">
                    <Bot className="w-4 h-4" /> AI Arabic/English Telecaller
                  </span>
                  <span className="text-[10px] bg-[#B69A70] text-[#27332F] px-2 py-0.5 rounded font-bold">Ready</span>
                </div>
                <p className="text-[11px] text-[#E2D8CB] mt-1.5 leading-relaxed">
                  Ready to auto-qualify property buyers in Khaleeji Arabic or English with speech voice synthesis.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 2: LEADS & ENQUIRIES + AI CALLER
          ========================================================================= */}
      {activeTab === 'leads' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-[#E2D8CB] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">Sharjah Leads Management & AI Telecaller</h2>
              <p className="text-xs text-[#77746D]">Capture, assign, track, and auto-qualify property enquiries in AED.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenAddLead}
                className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-[#B69A70]" />
                <span>Add Enquiry</span>
              </button>
              <button
                onClick={() => {
                  setTelecallerLead(leads[0]);
                  setIsAITelecallerOpen(true);
                }}
                className="bg-[#826B52] hover:bg-[#6e5944] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition shadow-sm"
              >
                <Bot className="w-3.5 h-3.5 text-[#B69A70]" />
                <span>AI Bilingual Call Batch</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-white p-3 rounded-xl border border-[#E2D8CB] text-xs">
            <div>
              <label className="block text-[#77746D] font-medium mb-1">Filter Stage</label>
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 text-[#27332F]"
              >
                <option value="All">All Stages</option>
                <option value="New">New Enquiries</option>
                <option value="Qualified">Qualified</option>
                <option value="Visit Scheduled">Visit Scheduled</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Converted">Converted</option>
              </select>
            </div>
            <div>
              <label className="block text-[#77746D] font-medium mb-1">Lead Source</label>
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 text-[#27332F]"
              >
                <option value="All">All Sources</option>
                <option value="Website">Website</option>
                <option value="Property Finder">Property Finder / Bayut</option>
                <option value="Meta Ads">Facebook / Insta Ads</option>
                <option value="Broker / Agent">Sharjah Broker</option>
                <option value="Walk-in">Direct Walk-in</option>
              </select>
            </div>
            <div>
              <label className="block text-[#77746D] font-medium mb-1">Assigned Executive</label>
              <select
                value={filterExec}
                onChange={(e) => setFilterExec(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 text-[#27332F]"
              >
                <option value="All">All Executives</option>
                <option value="Tariq Al-Suwaidi">Tariq Al-Suwaidi</option>
                <option value="Fatima Al-Marzooqi">Fatima Al-Marzooqi</option>
                <option value="Zaid Al-Ali">Zaid Al-Ali</option>
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>
            <div>
              <label className="block text-[#77746D] font-medium mb-1">Min Budget (AED)</label>
              <input
                type="number"
                value={filterBudget}
                onChange={(e) => setFilterBudget(e.target.value)}
                placeholder="e.g. 800000"
                className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 text-[#27332F]"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStage('All');
                  setFilterSource('All');
                  setFilterExec('All');
                  setFilterBudget('');
                }}
                className="w-full bg-[#F5F0E8] hover:bg-[#F2EDE5] border border-[#E2D8CB] text-[#27332F] font-semibold py-2 rounded-lg text-xs transition"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-white rounded-xl border border-[#E2D8CB] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#F5F0E8] text-[#77746D] uppercase tracking-wider font-bold border-b border-[#E2D8CB]">
                  <tr>
                    <th className="p-3">Lead ID & Date</th>
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Contact & Unit Pref</th>
                    <th className="p-3">Budget (AED)</th>
                    <th className="p-3">Source</th>
                    <th className="p-3">Stage</th>
                    <th className="p-3">Executive</th>
                    <th className="p-3 text-center">Actions & AI Call</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#F5F0E8]/50 transition">
                      <td className="p-3">
                        <span className="font-mono text-[#826B52] font-bold block">{lead.id}</span>
                        <span className="text-[10px] text-[#77746D]">{lead.date}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-[#27332F] block">{lead.name}</span>
                        <span className="text-[10px] text-[#826B52] font-semibold">{lead.project}</span>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-[#27332F]">{lead.mobile}</div>
                        <span className="text-[10px] bg-[#F2EDE5] text-[#826B52] px-1.5 py-0.5 rounded border border-[#E2D8CB]">
                          {lead.unitPref}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-[#27332F]">{formatAED(lead.budget)}</td>
                      <td className="p-3">
                        <span className="text-[#77746D]">{lead.source}</span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            lead.stage === 'New'
                              ? 'bg-[#66869A]/15 text-[#66869A] border-[#66869A]/30'
                              : lead.stage === 'Qualified'
                              ? 'bg-[#43856B]/15 text-[#43856B] border-[#43856B]/30'
                              : lead.stage === 'Visit Scheduled'
                              ? 'bg-[#C18A43]/15 text-[#C18A43] border-[#C18A43]/30'
                              : lead.stage === 'Negotiation'
                              ? 'bg-[#826B52]/15 text-[#826B52] border-[#826B52]/30'
                              : 'bg-[#43856B] text-white border-transparent'
                          }`}
                        >
                          {lead.stage}
                        </span>
                      </td>
                      <td className="p-3 text-[#77746D] font-medium">{lead.executive}</td>
                      <td className="p-3 text-center space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setTelecallerLead(lead);
                            setIsAITelecallerOpen(true);
                          }}
                          className="bg-[#27332F] hover:bg-[#1a2320] text-[#B69A70] font-bold text-[10px] px-2.5 py-1 rounded shadow-xs"
                        >
                          <Bot className="w-3 h-3 inline mr-1" /> AI Call
                        </button>
                        <button
                          onClick={() => handleOpenEditLead(lead)}
                          className="bg-[#F5F0E8] hover:bg-[#F2EDE5] text-[#27332F] border border-[#E2D8CB] text-[10px] px-2 py-1 rounded font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="bg-[#B85C50]/15 hover:bg-[#B85C50]/25 text-[#B85C50] text-[10px] px-2 py-1 rounded font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 3: FOLLOW-UPS & TASKS
          ========================================================================= */}
      {activeTab === 'followups' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-[#E2D8CB] p-4 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">Daily Follow-ups & Sharjah Site Tasks</h2>
              <p className="text-xs text-[#77746D]">Manage client interactions, log call outcomes, and update schedule tasks.</p>
            </div>
            <button
              onClick={() => setIsScheduleTaskModalOpen(true)}
              className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-[#B69A70]" /> Schedule New Task
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-3">
              <div className="bg-white rounded-xl border border-[#E2D8CB] p-4">
                <h3 className="text-sm font-bold text-[#27332F] mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#826B52]" /> Scheduled Follow-ups & Visits for Today
                </h3>
                <div className="space-y-2.5">
                  {followups.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-lg border border-[#E2D8CB] bg-[#F5F0E8]/50 flex justify-between items-center hover:bg-[#F2EDE5] transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#27332F] text-xs">{task.leadName}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B69A70]/20 text-[#826B52]">
                            {task.type}
                          </span>
                        </div>
                        <p className="text-xs text-[#77746D] mt-1">{task.notes}</p>
                        <p className="text-[10px] text-[#826B52] mt-0.5">Assigned to: {task.executive}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#27332F] block">{task.time}</span>
                        <button
                          onClick={() =>
                            setFollowups((prev) =>
                              prev.map((t) => (t.id === task.id ? { ...t, status: 'Completed' } : t))
                            )
                          }
                          className="mt-1 text-[10px] font-semibold text-[#43856B] bg-[#43856B]/15 hover:bg-[#43856B]/25 px-2 py-0.5 rounded"
                        >
                          {task.status === 'Completed' ? '✓ Done' : 'Mark Done'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Interaction Logger */}
            <div className="bg-white rounded-xl border border-[#E2D8CB] p-4 space-y-3">
              <h3 className="text-sm font-bold text-[#27332F]">Quick Interaction Logger</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Interaction logged and synced with Sharjah CRM lead record!');
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block text-[#77746D] font-medium mb-1">Select Lead</label>
                  <select className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 text-[#27332F]">
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.mobile}) - {l.project}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#77746D] font-medium mb-1">Interaction Type</label>
                  <select className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 text-[#27332F]">
                    <option value="Phone Call">Phone Call</option>
                    <option value="Aljada Site Visit">Aljada Site Visit Completed</option>
                    <option value="WhatsApp Sent">WhatsApp Follow-up Sent</option>
                    <option value="Price Negotiation">Price & Discount Negotiation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#77746D] font-medium mb-1">Client Feedback / Remarks</label>
                  <textarea
                    rows={3}
                    placeholder="Interested in Aljada 3BR townhouse, asked for 5% payment plan waiver..."
                    className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 text-[#27332F]"
                  />
                </div>
                <div>
                  <label className="block text-[#77746D] font-medium mb-1">Next Follow-up Date</label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 text-[#27332F]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#27332F] hover:bg-[#1a2320] text-white font-bold py-2.5 rounded-lg transition"
                >
                  Log Interaction & Update Lead
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 4: UNIT INVENTORY GRID (Interactive Floor Matrix)
          ========================================================================= */}
      {activeTab === 'inventory' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-[#E2D8CB] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">Sharjah Interactive Unit Inventory Grid</h2>
              <p className="text-xs text-[#77746D]">View real-time unit availability, AED pricing, hold status, and floor layouts.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedTower}
                onChange={(e) => setSelectedTower(e.target.value)}
                className="bg-[#F5F0E8] border border-[#E2D8CB] text-xs text-[#27332F] font-semibold rounded-lg px-3 py-2"
              >
                <option value="Aljada Blvd">Aljada Boulevard Tower A (Muwaileh)</option>
                <option value="Tilal Heights">Tilal Heights Building B</option>
                <option value="Maryam Waterfront">Maryam Island Waterfront Retail</option>
              </select>
              <button
                onClick={() => setIsAddUnitModalOpen(true)}
                className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-[#B69A70]" /> Add Floor / Unit
              </button>
            </div>
          </div>

          {/* Status Legend */}
          <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-xl border border-[#E2D8CB] text-xs">
            <span className="text-[#77746D] font-bold">Status Key:</span>
            <span className="flex items-center gap-1.5 text-[#27332F]">
              <span className="w-3 h-3 rounded bg-[#43856B]" /> Available
            </span>
            <span className="flex items-center gap-1.5 text-[#27332F]">
              <span className="w-3 h-3 rounded bg-[#C18A43]" /> On Hold
            </span>
            <span className="flex items-center gap-1.5 text-[#27332F]">
              <span className="w-3 h-3 rounded bg-[#826B52]" /> Booked / SPA
            </span>
            <span className="flex items-center gap-1.5 text-[#27332F]">
              <span className="w-3 h-3 rounded bg-[#66869A]" /> Handed Over
            </span>
          </div>

          {/* Floor Matrix Blocks */}
          <div className="space-y-4">
            {['Floor 3', 'Floor 2', 'Floor 1', 'Ground Floor'].map((floorName) => {
              const floorUnits = inventory.filter(
                (u) => u.tower === selectedTower && u.floor === floorName
              );
              if (floorUnits.length === 0) return null;
              return (
                <div key={floorName} className="bg-white border border-[#E2D8CB] rounded-xl p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-3 border-b border-[#E2D8CB] pb-2">
                    <span className="font-bold text-[#27332F] text-sm flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#826B52]" /> {floorName}
                    </span>
                    <span className="text-xs text-[#77746D]">{floorUnits.length} Units</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {floorUnits.map((u) => {
                      const bgClass =
                        u.status === 'Available'
                          ? 'bg-[#43856B]/10 border-[#43856B]/40 hover:border-[#43856B]'
                          : u.status === 'On Hold'
                          ? 'bg-[#C18A43]/10 border-[#C18A43]/40 hover:border-[#C18A43]'
                          : u.status === 'Booked'
                          ? 'bg-[#826B52]/10 border-[#826B52]/40 hover:border-[#826B52]'
                          : 'bg-[#66869A]/10 border-[#66869A]/40 hover:border-[#66869A]';
                      return (
                        <div
                          key={u.unitNo}
                          onClick={() => {
                            setSelectedUnit(u);
                            setIsUnitModalOpen(true);
                          }}
                          className={`p-3 rounded-xl border ${bgClass} cursor-pointer hover:scale-105 transition shadow-xs text-xs relative group`}
                        >
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-[#27332F] font-mono text-sm">{u.unitNo}</span>
                            <span
                              className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                u.status === 'Available'
                                  ? 'bg-[#43856B] text-white'
                                  : u.status === 'On Hold'
                                  ? 'bg-[#C18A43] text-white'
                                  : 'bg-[#826B52] text-white'
                              }`}
                            >
                              {u.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#77746D] font-medium mt-1 truncate">{u.type}</p>
                          <p className="font-extrabold text-[#27332F] mt-1">{formatAED(u.totalAED)}</p>
                          <p className="text-[10px] text-[#826B52] mt-0.5">{u.area} sqft</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 5: COST SHEETS & QUOTATIONS (With 4% Baladiya Fee)
          ========================================================================= */}
      {activeTab === 'quotations' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-[#E2D8CB] p-4 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">Sharjah Cost Sheets & Quotations</h2>
              <p className="text-xs text-[#77746D]">
                Generate commercial offers, calculate Sharjah Municipality fees (4%) & payment milestones in AED.
              </p>
            </div>
            <button
              onClick={() => setIsCreateQuoteModalOpen(true)}
              className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-[#B69A70]" /> Create Quotation
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#E2D8CB] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F0E8] text-[#77746D] uppercase font-bold border-b border-[#E2D8CB]">
                  <tr>
                    <th className="p-3">Quote ID & Date</th>
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Unit Selected</th>
                    <th className="p-3">Agreed Base Price (AED)</th>
                    <th className="p-3">Baladiya Fee (4%)</th>
                    <th className="p-3">Total Payable (incl Fee)</th>
                    <th className="p-3">Discount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                  {quotations.map((q) => (
                    <tr key={q.id} className="hover:bg-[#F5F0E8]/50 transition">
                      <td className="p-3 font-mono font-bold text-[#826B52]">{q.id}</td>
                      <td className="p-3 font-bold text-[#27332F]">{q.customer}</td>
                      <td className="p-3 font-medium">Unit {q.unit}</td>
                      <td className="p-3">{formatAED(q.basePrice)}</td>
                      <td className="p-3 text-[#826B52] font-semibold">{formatAED(q.baladiyaFee)}</td>
                      <td className="p-3 font-extrabold text-[#27332F]">{formatAED(q.totalTax)}</td>
                      <td className="p-3 text-[#B85C50] font-medium">{formatAED(q.discount)}</td>
                      <td className="p-3">
                        <span className="bg-[#B69A70]/15 text-[#826B52] border border-[#B69A70]/30 text-[10px] px-2 py-0.5 rounded font-bold">
                          {q.status}
                        </span>
                      </td>
                      <td className="p-3 text-center space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setBookings((prev) => [
                              {
                                id: `BK-${Math.floor(700 + Math.random() * 200)}`,
                                date: new Date().toISOString().split('T')[0],
                                customer: q.customer,
                                coApplicant: '--',
                                unit: q.unit,
                                agreementVal: q.totalTax,
                                bookingPaid: Math.round(q.totalTax * 0.1),
                                draftStatus: 'Ready for Baladiya Registration',
                                accountsApproved: true,
                              },
                              ...prev,
                            ]);
                            setQuotations((prev) =>
                              prev.map((item) => (item.id === q.id ? { ...item, status: 'Converted to SPA' } : item))
                            );
                            setTab('bookings');
                          }}
                          className="bg-[#27332F] text-white hover:bg-[#1a2320] px-2.5 py-1 rounded text-[10px] font-bold"
                        >
                          Convert to SPA
                        </button>
                        <button
                          onClick={() => setQuotations((prev) => prev.filter((item) => item.id !== q.id))}
                          className="bg-[#B85C50]/15 text-[#B85C50] px-2 py-1 rounded text-[10px] font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 6: BOOKINGS & SPA CONTRACTS
          ========================================================================= */}
      {activeTab === 'bookings' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-[#E2D8CB] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">Bookings & Sale Purchase Agreement (SPA) Workflow</h2>
              <p className="text-xs text-[#77746D]">
                Convert quotations to confirmed Sharjah bookings, execute SPAs, and manage documents.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExportCSV('SPA_Draft_Agreements')}
                className="bg-[#F5F0E8] hover:bg-[#F2EDE5] border border-[#E2D8CB] text-[#27332F] text-xs px-3 py-2 rounded-lg font-medium flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#826B52]" /> Export SPA Register
              </button>
              <button
                onClick={() => setIsNewBookingModalOpen(true)}
                className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-[#B69A70]" /> New Unit Booking
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2D8CB] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F0E8] text-[#77746D] uppercase font-bold border-b border-[#E2D8CB]">
                  <tr>
                    <th className="p-3">Booking ID & Date</th>
                    <th className="p-3">Customer & Co-Applicant</th>
                    <th className="p-3">Unit Number</th>
                    <th className="p-3">Agreement Value (AED)</th>
                    <th className="p-3">Booking Deposit Paid</th>
                    <th className="p-3">SPA Draft Status</th>
                    <th className="p-3">Accounts Approval</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-[#F5F0E8]/50 transition">
                      <td className="p-3 font-mono font-bold text-[#826B52]">
                        {b.id}
                        <span className="block text-[10px] text-[#77746D]">{b.date}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-[#27332F] block">{b.customer}</span>
                        <span className="text-[10px] text-[#77746D]">Co: {b.coApplicant}</span>
                      </td>
                      <td className="p-3 font-bold">Unit {b.unit}</td>
                      <td className="p-3 font-extrabold text-[#27332F]">{formatAED(b.agreementVal)}</td>
                      <td className="p-3 text-[#43856B] font-bold">{formatAED(b.bookingPaid)}</td>
                      <td className="p-3">
                        <span className="bg-[#826B52]/15 text-[#826B52] border border-[#826B52]/30 text-[10px] px-2 py-0.5 rounded font-bold">
                          {b.draftStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-[#43856B] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedCustomerBooking(b);
                            setTab('customers');
                          }}
                          className="bg-[#F5F0E8] hover:bg-[#F2EDE5] text-[#27332F] border border-[#E2D8CB] text-[10px] px-2 py-1 rounded font-semibold mr-1"
                        >
                          View 360°
                        </button>
                        <button
                          onClick={() => setBookings((prev) => prev.filter((item) => item.id !== b.id))}
                          className="bg-[#B85C50]/15 text-[#B85C50] text-[10px] px-2 py-1 rounded font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 7: CUSTOMER 360° PROFILE (Emirates ID Verified)
          ========================================================================= */}
      {activeTab === 'customers' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-[#E2D8CB] p-4 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">Customer 360° Directory (Emirates ID Verified)</h2>
              <p className="text-xs text-[#77746D]">
                View customer profile, linked Sharjah units, Emirates ID, and statutory compliance status.
              </p>
            </div>
            <button
              onClick={handleOpenAddLead}
              className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg"
            >
              + Add Customer Profile
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Customer List Sidebar */}
            <div className="bg-white rounded-xl border border-[#E2D8CB] p-4 space-y-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#77746D]" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Search name or unit..."
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] text-xs text-[#27332F] pl-8 pr-3 py-2 rounded-lg"
                />
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                {filteredCustomerBookings.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedCustomerBooking(b)}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      selectedCustomerBooking?.id === b.id
                        ? 'bg-[#27332F] text-white border-[#27332F]'
                        : 'bg-[#F5F0E8]/50 hover:bg-[#F2EDE5] border-[#E2D8CB] text-[#27332F]'
                    }`}
                  >
                    <p className="font-bold text-xs">{b.customer}</p>
                    <p
                      className={`text-[10px] mt-0.5 ${
                        selectedCustomerBooking?.id === b.id ? 'text-[#B69A70]' : 'text-[#77746D]'
                      }`}
                    >
                      Unit {b.unit} • EID: 784-1990-4829102-1
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer 360 Detail Panel */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2D8CB] p-5">
              {selectedCustomerBooking ? (
                <div className="space-y-5">
                  <div className="flex justify-between items-start border-b border-[#E2D8CB] pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#27332F]">{selectedCustomerBooking.customer}</h3>
                      <p className="text-xs text-[#77746D]">
                        Primary Buyer • Sharjah Resident • Unit {selectedCustomerBooking.unit}
                      </p>
                    </div>
                    <span className="bg-[#43856B]/15 text-[#43856B] border border-[#43856B]/30 text-xs px-3 py-1 rounded-full font-bold">
                      Emirates ID Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#F5F0E8] p-4 rounded-xl border border-[#E2D8CB] text-xs">
                    <div>
                      <span className="text-[#77746D] block">SPA Value:</span>
                      <span className="font-extrabold text-[#27332F] text-sm">
                        {formatAED(selectedCustomerBooking.agreementVal)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#77746D] block">Deposit Paid:</span>
                      <span className="font-extrabold text-[#43856B] text-sm">
                        {formatAED(selectedCustomerBooking.bookingPaid)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#77746D] block">Co-Applicant:</span>
                      <span className="font-bold text-[#27332F]">{selectedCustomerBooking.coApplicant}</span>
                    </div>
                    <div>
                      <span className="text-[#77746D] block">SPA Status:</span>
                      <span className="font-bold text-[#826B52]">{selectedCustomerBooking.draftStatus}</span>
                    </div>
                  </div>

                  {/* Document Checklist */}
                  <div className="space-y-2 text-xs">
                    <h4 className="font-bold text-[#27332F]">Sharjah Baladiya & Legal Document Checklist</h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { doc: 'Emirates ID Front & Back', status: 'Verified', ok: true },
                        { doc: 'Passport & UAE Residency Visa', status: 'Verified', ok: true },
                        { doc: 'Executed SPA Contract (Both Parties)', status: 'Executed', ok: true },
                        { doc: 'SEWA Utility Registration Form', status: 'Pending', ok: false },
                      ].map((item) => (
                        <div
                          key={item.doc}
                          className="p-2.5 bg-[#F5F0E8] rounded-lg border border-[#E2D8CB] flex justify-between items-center"
                        >
                          <span className="text-[#27332F] font-medium">{item.doc}</span>
                          <span
                            className={`font-bold text-[11px] ${
                              item.ok ? 'text-[#43856B]' : 'text-[#C18A43]'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-[#77746D] py-12">
                  <Contact className="w-10 h-10 mx-auto mb-2 text-[#826B52]" />
                  <p>Select a customer from the left list to view 360° details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 8: COLLECTIONS & DEMANDS (AED)
          ========================================================================= */}
      {activeTab === 'collections' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-[#E2D8CB] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">Collections & Milestone Demands (AED)</h2>
              <p className="text-xs text-[#77746D]">
                Milestone payment tracking in UAE Dirhams, demand notices, and bank receipt verifications.
              </p>
            </div>
            <button
              onClick={() => setIsRecordPaymentModalOpen(true)}
              className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-[#B69A70]" /> Record Payment & Attach Slip
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#E2D8CB] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F0E8] text-[#77746D] uppercase font-bold border-b border-[#E2D8CB]">
                  <tr>
                    <th className="p-3">Demand / Rec Ref</th>
                    <th className="p-3">Customer & Unit</th>
                    <th className="p-3">Milestone Stage</th>
                    <th className="p-3">Amount (AED)</th>
                    <th className="p-3">Payment Mode / Txn ID</th>
                    <th className="p-3">Receipt File</th>
                    <th className="p-3">Bank Verification</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                  {collections.map((c) => (
                    <tr key={c.ref} className="hover:bg-[#F5F0E8]/50 transition">
                      <td className="p-3 font-mono font-bold text-[#826B52]">{c.ref}</td>
                      <td className="p-3">
                        <span className="font-bold text-[#27332F] block">{c.customer}</span>
                        <span className="text-[10px] text-[#77746D]">Unit {c.unit}</span>
                      </td>
                      <td className="p-3 text-[#27332F] font-medium">{c.milestone}</td>
                      <td className="p-3 font-extrabold text-[#43856B]">{formatAED(c.amount)}</td>
                      <td className="p-3 text-[#77746D]">{c.mode}</td>
                      <td className="p-3">
                        <span className="underline text-[#826B52] font-semibold cursor-pointer">
                          {c.receiptFile}
                        </span>
                      </td>
                      <td className="p-3">
                        {c.verified ? (
                          <span className="bg-[#43856B]/15 text-[#43856B] border border-[#43856B]/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            Verified
                          </span>
                        ) : (
                          <button
                            onClick={() => handleToggleVerifyPayment(c.ref)}
                            className="bg-[#C18A43] hover:bg-[#a97534] text-white font-bold text-[10px] px-2 py-0.5 rounded"
                          >
                            Verify Now
                          </button>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setCollections((prev) => prev.filter((item) => item.ref !== c.ref))}
                          className="bg-[#B85C50]/15 text-[#B85C50] text-[10px] px-2 py-1 rounded font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 9: BALADIYA & KEY HANDOVER
          ========================================================================= */}
      {activeTab === 'handover' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-[#E2D8CB] p-4 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">
                Sharjah Municipality (Baladiya) & SEWA Key Handover
              </h2>
              <p className="text-xs text-[#77746D]">
                Verify Baladiya completion certificates, SEWA utility meters, and Civil Defense clearance before key handover.
              </p>
            </div>
            <button
              onClick={() => {
                const unitNum = prompt('Enter Unit Number for Handover:');
                if (unitNum) {
                  setHandovers((prev) => [
                    {
                      unit: unitNum,
                      customer: 'New Sharjah Owner',
                      baladiya: 'Certificate Issued',
                      sewa: 'Meter Connected',
                      civDef: 'Approved',
                      status: 'Ready for Key Handover',
                    },
                    ...prev,
                  ]);
                }
              }}
              className="bg-[#27332F] hover:bg-[#1a2320] text-white text-xs font-bold px-3 py-2 rounded-lg"
            >
              + Add Handover Unit
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#E2D8CB] overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F0E8] text-[#77746D] uppercase font-bold border-b border-[#E2D8CB]">
                <tr>
                  <th className="p-3">Unit No</th>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Baladiya Clearance</th>
                  <th className="p-3">SEWA Utility Meter</th>
                  <th className="p-3">Civil Defense Inspection</th>
                  <th className="p-3">Possession Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                {handovers.map((h, idx) => (
                  <tr key={idx} className="hover:bg-[#F5F0E8]/50 transition">
                    <td className="p-3 font-bold text-[#826B52]">{h.unit}</td>
                    <td className="p-3 font-bold">{h.customer}</td>
                    <td className="p-3">
                      <span className="bg-[#43856B]/15 text-[#43856B] px-2 py-0.5 rounded text-[10px] font-bold">
                        {h.baladiya}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="bg-[#43856B]/15 text-[#43856B] px-2 py-0.5 rounded text-[10px] font-bold">
                        {h.sewa}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="bg-[#43856B]/15 text-[#43856B] px-2 py-0.5 rounded text-[10px] font-bold">
                        {h.civDef}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-[#27332F]">{h.status}</td>
                    <td className="p-3 text-center space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => alert(`Official Key Handover NOC Certificate issued for Unit ${h.unit}!`)}
                        className="bg-[#27332F] hover:bg-[#1a2320] text-[#B69A70] font-bold px-2.5 py-1 rounded text-[10px]"
                      >
                        Issue Key NOC
                      </button>
                      <button
                        onClick={() => setHandovers((prev) => prev.filter((_, i) => i !== idx))}
                        className="bg-[#B85C50]/15 text-[#B85C50] px-2 py-1 rounded text-[10px] font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 10: MAINTENANCE & SNAGS
          ========================================================================= */}
      {activeTab === 'service' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-[#E2D8CB] p-4 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-[#27332F]">After-Sales Maintenance & Snag Tickets</h2>
              <p className="text-xs text-[#77746D]">Log customer snags, MEP maintenance requests, and assign technical staff.</p>
            </div>
            <button
              onClick={() => setIsRaiseTicketModalOpen(true)}
              className="bg-[#B85C50] hover:bg-[#9d4d42] text-white text-xs px-3.5 py-2 rounded-lg font-bold"
            >
              + Raise Service Ticket
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#E2D8CB] overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F0E8] text-[#77746D] uppercase font-bold border-b border-[#E2D8CB]">
                <tr>
                  <th className="p-3">Ticket ID</th>
                  <th className="p-3">Customer & Unit</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Assigned Staff</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D8CB] text-[#27332F]">
                {services.map((t) => (
                  <tr key={t.id} className="hover:bg-[#F5F0E8]/50 transition">
                    <td className="p-3 font-mono font-bold text-[#B85C50]">{t.id}</td>
                    <td className="p-3">
                      <span className="font-bold text-[#27332F] block">{t.customer}</span>
                      <span className="text-[10px] text-[#77746D]">Unit {t.unit}</span>
                    </td>
                    <td className="p-3 font-medium text-[#826B52]">{t.category}</td>
                    <td className="p-3 text-[#27332F]">{t.desc}</td>
                    <td className="p-3 text-[#77746D]">{t.staff}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          t.status === 'Resolved'
                            ? 'bg-[#43856B]/15 text-[#43856B]'
                            : 'bg-[#C18A43]/15 text-[#C18A43]'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() =>
                          setServices((prev) =>
                            prev.map((item) => (item.id === t.id ? { ...item, status: 'Resolved' } : item))
                          )
                        }
                        className="bg-[#43856B]/15 hover:bg-[#43856B]/25 text-[#43856B] text-[10px] px-2 py-1 rounded font-bold mr-1"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => setServices((prev) => prev.filter((item) => item.id !== t.id))}
                        className="bg-[#F5F0E8] text-[#77746D] hover:text-[#B85C50] text-[10px] px-2 py-1 rounded"
                      >
                        Close
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 11: SHARJAH MUNICIPALITY MIS & STATUTORY REPORTS
          ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-[#E2D8CB] p-4">
            <h2 className="text-base font-bold text-[#27332F]">Sharjah Real Estate MIS & Statutory Reports</h2>
            <p className="text-xs text-[#77746D]">
              Download formatted operational reports for Baladiya audits, sales performance, and broker commissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-[#E2D8CB] p-5 rounded-xl shadow-xs space-y-2.5">
              <h3 className="font-bold text-[#27332F] text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#826B52]" /> Lead Source Performance
              </h3>
              <p className="text-xs text-[#77746D]">
                Conversion breakdown of leads from Property Finder, Bayut, and Sharjah Brokers.
              </p>
              <button
                onClick={() => handleExportCSV('Lead_Source_Performance')}
                className="bg-[#F5F0E8] hover:bg-[#F2EDE5] text-[#826B52] border border-[#E2D8CB] font-bold text-xs px-3 py-2 rounded-lg w-full mt-2 transition"
              >
                Export Lead Summary CSV
              </button>
            </div>

            <div className="bg-white border border-[#E2D8CB] p-5 rounded-xl shadow-xs space-y-2.5">
              <h3 className="font-bold text-[#27332F] text-sm flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#43856B]" /> AED Collection Ageing Report
              </h3>
              <p className="text-xs text-[#77746D]">
                Outstandings grouped by 30, 60, 90+ days overdue in AED milestone tranches.
              </p>
              <button
                onClick={() => handleExportCSV('AED_Collection_Ageing')}
                className="bg-[#F5F0E8] hover:bg-[#F2EDE5] text-[#43856B] border border-[#E2D8CB] font-bold text-xs px-3 py-2 rounded-lg w-full mt-2 transition"
              >
                Export Collection Register CSV
              </button>
            </div>

            <div className="bg-white border border-[#E2D8CB] p-5 rounded-xl shadow-xs space-y-2.5">
              <h3 className="font-bold text-[#27332F] text-sm flex items-center gap-2">
                <Contact className="w-4 h-4 text-[#826B52]" /> Sharjah Broker Payouts
              </h3>
              <p className="text-xs text-[#77746D]">
                Commission eligibility register and broker ledger (AED 3% standard broker fee).
              </p>
              <button
                onClick={() => handleExportCSV('Sharjah_Broker_Payouts')}
                className="bg-[#F5F0E8] hover:bg-[#F2EDE5] text-[#826B52] border border-[#E2D8CB] font-bold text-xs px-3 py-2 rounded-lg w-full mt-2 transition"
              >
                Export Broker Ledger CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: AI BILINGUAL TELECALLER SIMULATOR (Khaleeji Arabic / UAE English)
          ========================================================================= */}
      {isAITelecallerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2D8CB] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 bg-[#27332F] text-white flex justify-between items-center border-b border-[#143e35]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#B69A70]/20 text-[#B69A70] rounded-xl border border-[#B69A70]/40">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">AI Voice Telecaller - Sharjah Property Buyer</h3>
                  <p className="text-xs text-[#B69A70]">
                    Auto-qualifies buyers in Khaleeji Arabic & English (with Voice Output)
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  setIsAITelecallerOpen(false);
                }}
                className="text-stone-300 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#F5F0E8] p-3 rounded-xl border border-[#E2D8CB]">
                <div>
                  <label className="block text-[#27332F] font-bold mb-1">Target Lead to Call</label>
                  <select
                    value={telecallerLead?.id || ''}
                    onChange={(e) => {
                      const l = leads.find((x) => x.id === e.target.value);
                      if (l) setTelecallerLead(l);
                    }}
                    className="w-full bg-white border border-[#E2D8CB] text-[#27332F] rounded-lg p-2 font-medium"
                  >
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.mobile}) - {l.project}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#27332F] font-bold mb-1">AI Voice & Accent</label>
                  <select
                    value={telecallerLang}
                    onChange={(e) => setTelecallerLang(e.target.value as 'ar-AE' | 'en-AE')}
                    className="w-full bg-white border border-[#E2D8CB] text-[#27332F] rounded-lg p-2 font-medium"
                  >
                    <option value="ar-AE">Arabic (Khaleeji / UAE Accent - اللهجة الإماراتية)</option>
                    <option value="en-AE">English (Sharjah Professional / UAE Accent)</option>
                  </select>
                </div>
              </div>

              {/* Call Stage Area */}
              <div className="bg-[#27332F] border border-[#143e35] rounded-2xl p-4 text-center space-y-3 relative text-white">
                <div className="flex justify-between items-center text-xs text-[#E2D8CB] border-b border-[#143e35] pb-2">
                  <span className="text-[#43856B] font-bold flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full bg-[#43856B] ${isCallActive ? 'animate-ping' : ''}`} />
                    {isCallActive ? 'Call In Progress...' : isFeedReady ? 'Call Completed' : 'Call Standby'}
                  </span>
                  <span className="font-mono">
                    {Math.floor(callTimer / 60)
                      .toString()
                      .padStart(2, '0')}
                    :
                    {(callTimer % 60).toString().padStart(2, '0')}
                  </span>
                </div>

                <div className="py-2 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#B69A70]/20 border-2 border-[#B69A70] flex items-center justify-center text-[#B69A70] text-2xl mb-2">
                    <Phone className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-white text-base">{telecallerLead?.name}</h4>
                  <p className="text-xs text-[#E2D8CB]">{telecallerLead?.mobile}</p>

                  {/* Animated Waveform */}
                  <div className={`flex items-center justify-center gap-1.5 h-8 mt-3 ${isCallActive ? 'opacity-100' : 'opacity-25'}`}>
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-[#B69A70] rounded-full animate-pulse"
                        style={{ height: `${8 + ((i * 5) % 24)}px`, animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Live Transcript Box */}
                <div className="bg-[#142320] border border-[#1d3530] rounded-xl p-3 text-left text-xs h-40 overflow-y-auto space-y-2 font-mono text-stone-200 custom-scrollbar">
                  {transcript.length === 0 ? (
                    <p className="text-stone-400 italic">Click "Start AI Phone Call" to initialize conversation...</p>
                  ) : (
                    transcript.map((msg, i) => (
                      <p key={i} className="leading-relaxed">
                        <span className={`font-bold ${msg.speaker.includes('Maryam') || msg.speaker.includes('مريم') ? 'text-[#B69A70]' : 'text-white'}`}>
                          {msg.speaker}:
                        </span>{' '}
                        {msg.text}
                      </p>
                    ))
                  )}
                </div>
              </div>

              {/* Extracted Intelligence Box */}
              <div className="bg-[#F5F0E8] border border-[#E2D8CB] rounded-xl p-3 space-y-2">
                <span className="font-bold text-[#826B52] block flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-[#826B52]" /> AI Extracted Intelligence:
                </span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[#27332F]">
                  <div>
                    <span className="text-[#77746D] block">Interest:</span>
                    <span className="font-bold">{aiExtracted.interest}</span>
                  </div>
                  <div>
                    <span className="text-[#77746D] block">Budget:</span>
                    <span className="font-bold">{aiExtracted.budget}</span>
                  </div>
                  <div>
                    <span className="text-[#77746D] block">Unit Type:</span>
                    <span className="font-bold">{aiExtracted.unitType}</span>
                  </div>
                  <div>
                    <span className="text-[#77746D] block">Timeline:</span>
                    <span className="font-bold">{aiExtracted.timeline}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-[#E2D8CB] flex justify-between items-center">
              <button
                disabled={isCallActive}
                onClick={handleStartAICall}
                className="bg-[#27332F] hover:bg-[#1a2320] disabled:opacity-40 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-[#B69A70]" /> Start AI Phone Call
              </button>
              <button
                disabled={!isFeedReady}
                onClick={handleFeedAICallToCRM}
                className="bg-[#43856B] hover:bg-[#366c57] disabled:opacity-40 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Auto-Feed Results to CRM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: ADD / EDIT LEAD MODAL
          ========================================================================= */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2D8CB] rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#E2D8CB] pb-3">
              <h3 className="font-bold text-[#27332F] text-base">
                {editingLeadId ? `Edit Sharjah Lead (${editingLeadId})` : 'Add New Sharjah Lead'}
              </h3>
              <button onClick={() => setIsAddLeadModalOpen(false)} className="text-[#77746D] hover:text-[#27332F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#77746D] font-bold mb-1">Customer Full Name</label>
                <input
                  type="text"
                  required
                  value={leadFormName}
                  onChange={(e) => setLeadFormName(e.target.value)}
                  placeholder="e.g. Rashid Al-Nuaimi"
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#77746D] font-bold mb-1">Mobile (+971)</label>
                  <input
                    type="text"
                    required
                    value={leadFormMobile}
                    onChange={(e) => setLeadFormMobile(e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                  />
                </div>
                <div>
                  <label className="block text-[#77746D] font-bold mb-1">Project</label>
                  <select
                    value={leadFormProject}
                    onChange={(e) => setLeadFormProject(e.target.value)}
                    className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                  >
                    <option value="Aljada">Aljada Master Community</option>
                    <option value="Tilal City">Tilal City Residential</option>
                    <option value="Maryam Island">Maryam Island Waterfront</option>
                    <option value="Al Majaz Tower">Al Majaz Tower Residences</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#77746D] font-bold mb-1">Budget (AED)</label>
                  <input
                    type="number"
                    required
                    value={leadFormBudget}
                    onChange={(e) => setLeadFormBudget(Number(e.target.value))}
                    className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                  />
                </div>
                <div>
                  <label className="block text-[#77746D] font-bold mb-1">Unit Preference</label>
                  <select
                    value={leadFormUnitPref}
                    onChange={(e) => setLeadFormUnitPref(e.target.value)}
                    className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                  >
                    <option value="1 BHK Apartment">1 BHK Apartment</option>
                    <option value="2 BHK Apartment">2 BHK Apartment</option>
                    <option value="3 BHK Townhouse">3 BHK Townhouse</option>
                    <option value="4 BHK Villa">4 BHK Villa</option>
                    <option value="Retail Shop">Retail Shop</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#77746D] font-bold mb-1">Lead Source</label>
                  <select
                    value={leadFormSource}
                    onChange={(e) => setLeadFormSource(e.target.value)}
                    className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                  >
                    <option value="Property Finder">Property Finder</option>
                    <option value="Bayut">Bayut UAE</option>
                    <option value="Meta Ads">Facebook / Insta Ads</option>
                    <option value="Broker / Agent">Sharjah Broker</option>
                    <option value="Walk-in">Direct Walk-in</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#77746D] font-bold mb-1">Assigned Executive</label>
                  <select
                    value={leadFormExec}
                    onChange={(e) => setLeadFormExec(e.target.value)}
                    className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                  >
                    <option value="Tariq Al-Suwaidi">Tariq Al-Suwaidi</option>
                    <option value="Fatima Al-Marzooqi">Fatima Al-Marzooqi</option>
                    <option value="Zaid Al-Ali">Zaid Al-Ali</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#27332F] hover:bg-[#1a2320] text-white font-bold py-2.5 rounded-lg transition mt-2 shadow-sm"
              >
                Save Lead Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: UNIT DETAIL & BOOKING MODAL
          ========================================================================= */}
      {isUnitModalOpen && selectedUnit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2D8CB] rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#E2D8CB] pb-3">
              <div>
                <h3 className="font-bold text-[#27332F] text-base">Unit {selectedUnit.unitNo} Details</h3>
                <p className="text-xs text-[#77746D]">
                  {selectedUnit.tower} • {selectedUnit.floor}
                </p>
              </div>
              <button onClick={() => setIsUnitModalOpen(false)} className="text-[#77746D] hover:text-[#27332F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#F5F0E8] p-3 rounded-xl border border-[#E2D8CB]">
              <div>
                <span className="text-[#77746D] block">Configuration:</span>
                <span className="font-bold text-[#27332F]">{selectedUnit.type}</span>
              </div>
              <div>
                <span className="text-[#77746D] block">Area:</span>
                <span className="font-bold text-[#27332F]">{selectedUnit.area} sq. ft.</span>
              </div>
              <div>
                <span className="text-[#77746D] block">Price / sq.ft:</span>
                <span className="font-bold text-[#27332F]">AED {selectedUnit.rate}</span>
              </div>
              <div>
                <span className="text-[#77746D] block">Total Price:</span>
                <span className="font-extrabold text-[#43856B] text-sm">{formatAED(selectedUnit.totalAED)}</span>
              </div>
              <div>
                <span className="text-[#77746D] block">Parking Bay:</span>
                <span className="font-bold text-[#27332F]">{selectedUnit.parking}</span>
              </div>
              <div>
                <span className="text-[#77746D] block">Current Status:</span>
                <span className="font-bold text-[#826B52]">{selectedUnit.status}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block text-[#27332F] font-bold">Quick Actions for this Unit</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleHoldUnit(selectedUnit.unitNo)}
                  className="bg-[#C18A43] hover:bg-[#a97534] text-white font-bold p-2.5 rounded-lg transition"
                >
                  Put on Hold (24 Hrs)
                </button>
                <button
                  onClick={() => handleProceedBookingFromUnit(selectedUnit)}
                  className="bg-[#27332F] hover:bg-[#1a2320] text-white font-bold p-2.5 rounded-lg transition"
                >
                  Create Direct Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: RECORD PAYMENT & ATTACH BANK RECEIPT
          ========================================================================= */}
      {isRecordPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2D8CB] rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#E2D8CB] pb-3">
              <h3 className="font-bold text-[#27332F] text-base">Record AED Payment & Upload Slip</h3>
              <button onClick={() => setIsRecordPaymentModalOpen(false)} className="text-[#77746D] hover:text-[#27332F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#77746D] font-bold mb-1">Customer / Booking Reference</label>
                <select
                  value={payBookingId}
                  onChange={(e) => setPayBookingId(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                >
                  {bookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.customer} (Unit {b.unit}) - {b.id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#77746D] font-bold mb-1">Amount Paid (AED)</label>
                  <input
                    type="number"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                  />
                </div>
                <div>
                  <label className="block text-[#77746D] font-bold mb-1">Payment Mode</label>
                  <select
                    value={payMode}
                    onChange={(e) => setPayMode(e.target.value)}
                    className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                  >
                    <option value="UAE Bank Transfer (IBAN)">UAE Bank Transfer (IBAN)</option>
                    <option value="Manager Cheque">Manager Cheque</option>
                    <option value="Credit / Debit Card">Credit / Debit Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#77746D] font-bold mb-1">Transaction Ref / Cheque No</label>
                <input
                  type="text"
                  required
                  value={payTxnRef}
                  onChange={(e) => setPayTxnRef(e.target.value)}
                  placeholder="e.g. ADCB-WIRE-994102"
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                />
              </div>

              <div>
                <label className="block text-[#77746D] font-bold mb-1">Attach Bank Advice / Slip (.pdf / .jpg)</label>
                <div className="border-2 border-dashed border-[#E2D8CB] hover:border-[#826B52] rounded-xl p-4 text-center cursor-pointer bg-[#F5F0E8]/50 relative">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setPaySlipName(e.target.files[0].name);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 mx-auto text-[#826B52] mb-1" />
                  <p className="text-[11px] text-[#27332F] font-semibold">Click or Drag & Drop Bank Slip</p>
                  {paySlipName && (
                    <p className="text-[10px] text-[#43856B] font-mono mt-1 font-bold">Attached: {paySlipName}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#27332F] hover:bg-[#1a2320] text-white font-bold py-2.5 rounded-lg transition shadow-sm mt-2"
              >
                Submit Payment for Accounts Verification
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: CREATE QUOTATION MODAL
          ========================================================================= */}
      {isCreateQuoteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2D8CB] rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#E2D8CB] pb-3">
              <h3 className="font-bold text-[#27332F] text-base">Generate Commercial Quotation</h3>
              <button onClick={() => setIsCreateQuoteModalOpen(false)} className="text-[#77746D] hover:text-[#27332F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuotation} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#77746D] font-bold mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={quoteCustomer}
                  onChange={(e) => setQuoteCustomer(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#77746D] font-bold mb-1">Unit Number</label>
                  <select
                    value={quoteUnit}
                    onChange={(e) => {
                      setQuoteUnit(e.target.value);
                      const u = inventory.find((i) => i.unitNo === e.target.value);
                      if (u) setQuoteBase(u.totalAED);
                    }}
                    className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                  >
                    {inventory.map((i) => (
                      <option key={i.unitNo} value={i.unitNo}>
                        {i.unitNo} ({i.type})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#77746D] font-bold mb-1">Base Price (AED)</label>
                  <input
                    type="number"
                    value={quoteBase}
                    onChange={(e) => setQuoteBase(Number(e.target.value))}
                    className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#77746D] font-bold mb-1">Commercial Discount (AED)</label>
                <input
                  type="number"
                  value={quoteDiscount}
                  onChange={(e) => setQuoteDiscount(Number(e.target.value))}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                />
              </div>

              {/* Real-time breakdown card */}
              <div className="bg-[#F5F0E8] p-3 rounded-xl border border-[#E2D8CB] space-y-1 text-xs">
                <div className="flex justify-between text-[#77746D]">
                  <span>Base Price:</span>
                  <span>{formatAED(quoteBase)}</span>
                </div>
                <div className="flex justify-between text-[#826B52] font-semibold">
                  <span>Sharjah Baladiya Fee (4%):</span>
                  <span>+{formatAED(quoteBase * 0.04)}</span>
                </div>
                <div className="flex justify-between text-[#B85C50]">
                  <span>Discount:</span>
                  <span>-{formatAED(quoteDiscount)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-[#27332F] border-t border-[#E2D8CB] pt-1 mt-1 text-sm">
                  <span>Total Payable:</span>
                  <span>{formatAED(quoteBase * 1.04 - quoteDiscount)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#27332F] hover:bg-[#1a2320] text-white font-bold py-2.5 rounded-lg transition mt-2 shadow-sm"
              >
                Save & Issue Quotation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 6: ADD INVENTORY UNIT MODAL
          ========================================================================= */}
      {isAddUnitModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2D8CB] rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#E2D8CB] pb-3">
              <h3 className="font-bold text-[#27332F] text-base">Add Unit to {selectedTower}</h3>
              <button onClick={() => setIsAddUnitModalOpen(false)} className="text-[#77746D] hover:text-[#27332F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setInventory((prev) => [
                  {
                    unitNo: newUnitNo,
                    tower: selectedTower,
                    floor: newUnitFloor,
                    type: newUnitType,
                    area: Number(newUnitArea),
                    rate: Math.round(Number(newUnitPrice) / Number(newUnitArea)),
                    totalAED: Number(newUnitPrice),
                    status: 'Available',
                    parking: 'Assigned Covered Bay',
                  },
                  ...prev,
                ]);
                setIsAddUnitModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#77746D] font-bold mb-1">Unit Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A-402"
                    value={newUnitNo}
                    onChange={(e) => setNewUnitNo(e.target.value)}
                    className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 text-[#27332F]"
                  />
                </div>
                <div>
                  <label className="block text-[#77746D] font-bold mb-1">Floor</label>
                  <select
                    value={newUnitFloor}
                    onChange={(e) => setNewUnitFloor(e.target.value)}
                    className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 text-[#27332F]"
                  >
                    <option value="Floor 1">Floor 1</option>
                    <option value="Floor 2">Floor 2</option>
                    <option value="Floor 3">Floor 3</option>
                    <option value="Floor 4">Floor 4</option>
                    <option value="Ground Floor">Ground Floor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#77746D] font-bold mb-1">Unit Type</label>
                  <select
                    value={newUnitType}
                    onChange={(e) => setNewUnitType(e.target.value)}
                    className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 text-[#27332F]"
                  >
                    <option value="1 BHK Apartment">1 BHK Apartment</option>
                    <option value="2 BHK Apartment">2 BHK Apartment</option>
                    <option value="3 BHK Townhouse">3 BHK Townhouse</option>
                    <option value="4 BHK Penthouse">4 BHK Penthouse</option>
                    <option value="Retail Shop">Retail Shop</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#77746D] font-bold mb-1">Area (sq. ft.)</label>
                  <input
                    type="number"
                    value={newUnitArea}
                    onChange={(e) => setNewUnitArea(Number(e.target.value))}
                    className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 text-[#27332F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#77746D] font-bold mb-1">Total Price (AED)</label>
                <input
                  type="number"
                  value={newUnitPrice}
                  onChange={(e) => setNewUnitPrice(Number(e.target.value))}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2 text-[#27332F]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#27332F] hover:bg-[#1a2320] text-white font-bold py-2.5 rounded-lg transition mt-2 shadow-sm"
              >
                Add Unit to Inventory
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 7: RAISE SERVICE / SNAG TICKET
          ========================================================================= */}
      {isRaiseTicketModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2D8CB] rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#E2D8CB] pb-3">
              <h3 className="font-bold text-[#27332F] text-base">Raise Customer Snag / MEP Ticket</h3>
              <button onClick={() => setIsRaiseTicketModalOpen(false)} className="text-[#77746D] hover:text-[#27332F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setServices((prev) => [
                  {
                    id: `TCK-${Math.floor(500 + Math.random() * 200)}`,
                    customer: ticketCustomer,
                    unit: ticketUnit,
                    category: ticketCat,
                    desc: ticketDesc,
                    staff: ticketStaff,
                    status: 'In Progress',
                    date: new Date().toISOString().split('T')[0],
                  },
                  ...prev,
                ]);
                setIsRaiseTicketModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-[#77746D] font-bold mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={ticketCustomer}
                  onChange={(e) => setTicketCustomer(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#77746D] font-bold mb-1">Unit Number</label>
                  <input
                    type="text"
                    required
                    value={ticketUnit}
                    onChange={(e) => setTicketUnit(e.target.value)}
                    className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                  />
                </div>
                <div>
                  <label className="block text-[#77746D] font-bold mb-1">Category</label>
                  <select
                    value={ticketCat}
                    onChange={(e) => setTicketCat(e.target.value)}
                    className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                  >
                    <option value="AC Ducts & Cooling (SEWA)">AC Ducts & Cooling (SEWA)</option>
                    <option value="Plumbing & Water Pressure">Plumbing & Water Pressure</option>
                    <option value="Electrical & Power Outlets">Electrical & Power Outlets</option>
                    <option value="Civil Snag / Paint Touchup">Civil Snag / Paint Touchup</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#77746D] font-bold mb-1">Issue Description</label>
                <textarea
                  rows={3}
                  required
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  placeholder="Details of the customer complaint..."
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                />
              </div>

              <div>
                <label className="block text-[#77746D] font-bold mb-1">Assigned MEP / Technical Staff</label>
                <select
                  value={ticketStaff}
                  onChange={(e) => setTicketStaff(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                >
                  <option value="Hassan MEP Tech">Hassan MEP Tech</option>
                  <option value="Zubair Finishes">Zubair Finishes</option>
                  <option value="Arif SEWA Specialist">Arif SEWA Specialist</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#B85C50] hover:bg-[#9d4d42] text-white font-bold py-2.5 rounded-lg transition mt-2 shadow-sm"
              >
                Dispatch Ticket to Field Engineer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 8: NEW UNIT BOOKING WIZARD MODAL
          ========================================================================= */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2D8CB] rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#E2D8CB] pb-3">
              <h3 className="font-bold text-[#27332F] text-base">New Unit SPA Booking</h3>
              <button onClick={() => setIsNewBookingModalOpen(false)} className="text-[#77746D] hover:text-[#27332F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const u = inventory.find((i) => i.unitNo === newUnitNo) || inventory[0];
                setBookings((prev) => [
                  {
                    id: `BK-${Math.floor(700 + Math.random() * 200)}`,
                    date: new Date().toISOString().split('T')[0],
                    customer: quoteCustomer || 'Sharjah Buyer',
                    coApplicant: '--',
                    unit: newUnitNo || u.unitNo,
                    agreementVal: u.totalAED,
                    bookingPaid: Math.round(u.totalAED * 0.1),
                    draftStatus: 'Ready for Baladiya Registration',
                    accountsApproved: true,
                  },
                  ...prev,
                ]);
                setInventory((prev) =>
                  prev.map((i) => (i.unitNo === newUnitNo ? { ...i, status: 'Booked' } : i))
                );
                setIsNewBookingModalOpen(false);
                setTab('bookings');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-[#77746D] font-bold mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  defaultValue="Rashid Al-Nuaimi"
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                />
              </div>

              <div>
                <label className="block text-[#77746D] font-bold mb-1">Select Unit to Book</label>
                <select
                  value={newUnitNo}
                  onChange={(e) => setNewUnitNo(e.target.value)}
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#27332F]"
                >
                  {inventory.map((i) => (
                    <option key={i.unitNo} value={i.unitNo}>
                      Unit {i.unitNo} ({i.type} - {formatAED(i.totalAED)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#77746D] font-bold mb-1">Booking Deposit (10%)</label>
                <input
                  type="text"
                  disabled
                  value="10% Initial Downpayment Required"
                  className="w-full bg-[#F5F0E8] border border-[#E2D8CB] rounded-lg p-2.5 text-[#77746D]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#27332F] hover:bg-[#1a2320] text-white font-bold py-2.5 rounded-lg transition mt-2 shadow-sm"
              >
                Confirm SPA Booking & Reserve Unit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
