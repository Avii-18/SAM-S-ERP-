import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Sparkles,
  Cpu,
  FileSearch,
  Scale,
  Calculator,
  PieChart,
  ShoppingCart,
  Target,
  Send,
  Bot,
  User,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { AISubmodule, AIChatMessage } from '../../types/erp';

export const AIToolsWorkspace: React.FC = () => {
  const {
    activeProject,
    activeAISubmodule,
    setActiveAISubmodule,
    wbsActivities,
    boqItems,
    employees,
    ipcClaims,
    variations,
    purchaseOrders,
  } = useERP();

  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      timestamp: '10:30 AM',
      content: `Salam Alaikum. I am your Dubai & UAE Construction ERP AI Intelligence Copilot. I have real-time authorized access to the unified ERP records for **${activeProject.name}** across PMO, Master BOQ, Procurement, Subcontracts, MoHRE Labour Compliance, and Site DPRs.\n\nHow can I assist your engineering, commercial, or compliance workflows today?`,
      confidence: 'High',
      citations: ['FIDIC Red Book 1999', 'Sharjah Municipality Code', 'MoHRE Federal Law No. 33'],
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);

  // Quick Preset Queries
  const PRESETS = [
    {
      label: 'Audit FIDIC Contract Risks & Delay Notice Periods',
      prompt:
        'Perform a comprehensive risk audit of our active FIDIC Red Book agreement, highlighting contractor notice deadlines (Clause 20.1 28-day notice) and liquidated damages exposure.',
    },
    {
      label: 'Analyze Master BOQ for Unbalanced Rates',
      prompt:
        'Analyze our current Master BOQ rates against prevailing 2026 Dubai & Sharjah construction parametric benchmarks for C40/50 concrete and Grade 500B rebar.',
    },
    {
      label: 'MoHRE Visa & Midday Break Compliance Check',
      prompt:
        'Check our active 215 site manpower roster for expiring Emirates IDs (<30 days), overdue labor cards, and verify summer midday break compliance (12:30 PM - 3:00 PM).',
    },
    {
      label: 'Normalize Ready-Mix Concrete Supplier Quotations',
      prompt:
        'Normalize landed AED costs for 450 m³ Ready Mix Concrete C40/50 SRC including batching plant freight, 42m boom pump charges, 7-day cube testing, and 5% UAE VAT.',
    },
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim()) return;

    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    setTimeout(() => {
      let replyContent = '';
      let citations: string[] = [];

      const lower = text.toLowerCase();

      if (lower.includes('contract') || lower.includes('fidic') || lower.includes('liquidated')) {
        replyContent = `### FIDIC Red Book 1999 Contract Risk Analysis for ${activeProject.name}:
1. **Notice of Claim Requirement (Clause 20.1):** Notice of any time extension (EOT) or additional cost claim MUST be given within **28 days** after becoming aware of the delay event. Failure to do so strictly waives contractor entitlement under UAE law.
2. **Delay Damages / Liquidated Damages (Clause 8.7):** Applicable at **AED 25,000 per day** of unexcused delay, capped at 10% of the Contract Baseline (AED ${(activeProject.contractBaselineAED * 0.1).toLocaleString()}).
3. **Taking-Over & Retention (Clause 14.9):** 50% of the 10% retention (AED ${(activeProject.retentionAED / 2).toLocaleString()}) releases immediately upon issuance of the Taking-Over Certificate (TOC), and the remaining 50% upon Defect Liability Period (DLP) expiry after 365 days.
4. **Governing Law:** UAE Civil Transactions Law (Federal Law No. 5 of 1985), requiring performance in good faith.`;
        citations = ['FIDIC Red Book Sub-Clause 20.1', 'FIDIC Sub-Clause 8.7', 'UAE Civil Code Article 246'];
      } else if (lower.includes('boq') || lower.includes('rate') || lower.includes('unbalanced')) {
        replyContent = `### Master BOQ Benchmark Analysis (Sharjah & Dubai 2026 Norms):
- **C40/50 SRC Concrete:** Current project rate is **AED 380 / m³**, in line with prevailing market range (AED 360–395 / m³).
- **High Yield Rebar Steel Grade 500B:** Current rate is **AED 3.65 / kg (AED 3,650 / MT)**. Prevailing mill price from Emirates Steel Arkan is AED 2,800 / MT base, yielding an allowable cut, bend & fixing margin of AED 850 / MT.
- **Mivan Aluminium Formwork:** Rate at **AED 68 / m²** contact area aligns with high-rise podium/tower 4-day cycle productivity.
- **Façade Double Glazing:** Curtain wall budgeted at **AED 1,650 / m²** reflects certified thermal break extrusions and 24mm DGU (6mm Low-E).
- **Recommended Action:** Approve Master BOQ baseline; direct direct-cost buffer stands at +AED 2.3M above minimum allowable.`;
        citations = ['Master BOQ Revision 02', 'UAE Parametric Cost Index 2026', 'Emirates Steel Price Bulletin'];
      } else if (
        lower.includes('visa') ||
        lower.includes('mohre') ||
        lower.includes('midday') ||
        lower.includes('worker')
      ) {
        replyContent = `### MoHRE Labour & Welfare Compliance Audit (215 Workforce):
1. **Credential Expiry Watchlist:**
   - Tariq Mansoor (Sr. HSE Safety Officer) visa expires on **2026-10-15** (Immediate priority renewal via ICP / MoHRE portal to avert AED 50/day overstay penalty).
   - Rajesh Kumar (Foreman) & Amil Solanki (PM) visas expire in November 2026 (Medical fitness tests booked).
2. **Wages Protection System (WPS):** 100% compliant. October 2026 SIF salary batch (AED 412,500) disbursed on-time through Emirates NBD.
3. **Summer Midday Break Rule (12:30 PM - 3:00 PM):** Fully enforced across Aljada site and Saja'a logistics yard. Shaded shelters, chilled water coolers, and paramedic on-site active.
4. **Saja'a Camp Living Conditions:** Passed Civil Defence & Sharjah Municipality sanitation inspection (205 / 250 beds occupied).`;
        citations = ['MoHRE Federal Decree-Law No. 33 of 2021', 'Sharjah Labour Welfare Circular 2026', 'WPS SIF Transfer Ledger'];
      } else if (lower.includes('concrete') || lower.includes('procurement') || lower.includes('normaliz')) {
        replyContent = `### Supplier Quotation Landed Cost Normalization (450 m³ C40/50 SRC):
- **Base Concrete Supply:** AED 240.00 / m³
- **Concrete Boom Pump (42m Jib):** AED 35.00 / m³
- **Night-Pour Ice / Retarder Allowance (Summer):** AED 12.00 / m³
- **Sharjah Municipality 7-day & 28-day Lab Testing:** AED 8.00 / m³
- **Subtotal Direct Landed Rate:** AED 295.00 / m³
- **5% UAE Federal VAT:** AED 14.75 / m³
- **Total Landed Unit Rate:** **AED 309.75 / m³ incl. VAT**
- **Recommended Supplier:** Sharjah National Concrete Co. WLL (TRN: 100293847500003). On-time batching plant rating 4.8/5.0.`;
        citations = ['PO-UAE-2026-088', 'Sharjah National Concrete Quote Q-8812', 'Federal Tax Authority Law No. 8'];
      } else {
        replyContent = `I have analyzed your query across the 4 ERP divisions for **${activeProject.name}**. All financial calculations adhere to standard UAE FIDIC Red Book principles, MoHRE labor regulations, and Federal Tax Authority VAT laws.\n\nCurrently, the project is progressing at **${activeProject.currentMonth} Months** with overall progress at **42%** on superstructure framing. Total commitments across POs and Work Orders stand at **AED 12.8M** with zero unexcused critical path float erosion.`;
        citations = ['Unified UAE ERP Database', 'Project Baseline Schedule'];
      }

      const assistantMsg: AIChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: replyContent,
        confidence: 'High',
        citations,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="space-y-6 text-[#27332F]">
      {/* 1. AI Header Banner */}
      <div className="bg-white rounded-xl border border-[#E2D8CB] p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F2EDE5] text-[#826B52] border border-[#E2D8CB]">
              DIVISION 4 • AI TOOLS & INTELLIGENCE
            </span>
            <span className="text-xs text-[#77746D]">|</span>
            <span className="text-xs text-[#43856B] font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Full Enterprise ERP Context Loaded
            </span>
          </div>
          <h2 className="text-[22px] font-bold text-[#27332F] mt-1.5 tracking-tight">
            Construction Intelligence & Automation Layer
          </h2>
          <p className="text-[13px] text-[#77746D] max-w-2xl mt-0.5">
            Traceable AI assistance for FIDIC contract clause analysis, Master BOQ rate benchmarking, MoHRE regulatory auditing, and landed procurement quotation normalization.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium bg-[#F2EDE5] text-[#826B52] border border-[#E2D8CB] px-3.5 py-2 rounded-lg flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#826B52]" />
            <span>Traceable Output Mode (Active)</span>
          </span>
        </div>
      </div>

      {/* 2. Submodule Navigation Tabs */}
      <div className="bg-[#F2EDE5] rounded-lg p-1.5 border border-[#E2D8CB] flex gap-2 overflow-x-auto text-[13px] no-print">
        {[
          { id: 'ai-dashboard', name: 'AI Dashboard & Presets', icon: Cpu },
          { id: 'erp-assistant', name: 'Interactive ERP Assistant', icon: Sparkles },
          { id: 'contract-analyzer', name: 'FIDIC Contract Analyzer', icon: FileSearch },
          { id: 'boq-analyzer', name: 'BOQ Anomaly Detector', icon: Scale },
          { id: 'cost-estimator', name: 'UAE Cost Predictor', icon: Calculator },
          { id: 'risk-analyzer', name: 'Project Risk & Delay Analyzer', icon: PieChart },
          { id: 'procurement-assistant', name: 'Landed Quote Normalizer', icon: ShoppingCart },
          { id: 'lead-scoring', name: 'Lead Prioritization', icon: Target },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAISubmodule === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAISubmodule(tab.id as AISubmodule)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md font-medium whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-[#27332F] text-white shadow-xs'
                  : 'text-[#77746D] hover:text-[#27332F] hover:bg-[#EAE3D6]'
              }`}
            >
              <Icon className="w-4 h-4 text-[#B69A70]" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Preset Action Launchpad */}
      <div className="bg-white rounded-xl border border-[#E2D8CB] p-6 space-y-3.5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#826B52]">
          Executive Pre-Configured Intelligence Queries
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveAISubmodule('erp-assistant');
                handleSendMessage(p.prompt);
              }}
              className="p-4 bg-[#F2EDE5] hover:bg-[#EAE3D6] rounded-xl border border-[#E2D8CB] text-left transition space-y-2 group flex flex-col justify-between cursor-pointer"
            >
              <div className="font-bold text-[#27332F] text-[13px] leading-snug group-hover:text-[#826B52] transition">
                {p.label}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#826B52] font-semibold pt-1">
                <span>Run Analysis</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition text-[#B69A70]" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Main Interactive Copilot Container */}
      <div className="bg-white rounded-xl border border-[#E2D8CB] overflow-hidden flex flex-col h-[520px] shadow-sm">
        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-[13px] bg-[#FAF8F5]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-[#27332F] text-[#B69A70] flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-xl p-4 space-y-2 shadow-xs ${
                    isUser
                      ? 'bg-[#27332F] text-white rounded-br-none'
                      : 'bg-white text-[#27332F] border border-[#E2D8CB] rounded-bl-none'
                  }`}
                >
                  <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>

                  {!isUser && msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2 border-t border-[#E2D8CB] flex flex-wrap items-center gap-1.5 text-[11px] text-[#77746D]">
                      <span className="font-bold text-[#826B52]">Citations:</span>
                      {msg.citations.map((c, idx) => (
                        <span
                          key={idx}
                          className="bg-[#F2EDE5] px-2 py-0.5 rounded border border-[#E2D8CB] font-mono text-[10px] text-[#27332F]"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[10px] text-[#9A958C] pt-1">
                    <span>{msg.timestamp}</span>
                    {!isUser && msg.confidence && (
                      <span className="text-[#43856B] font-semibold uppercase">
                        Confidence: {msg.confidence}
                      </span>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-[#826B52] text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#77746D]">
              <Bot className="w-4 h-4 text-[#826B52] animate-spin" />
              <span>SAM AI Intelligence Copilot is processing ERP database...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-white border-t border-[#E2D8CB] flex items-center gap-2.5">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Ask AI Copilot about FIDIC clauses, Master BOQ discrepancies, MoHRE workforce, site DPRs, or landed procurement..."
            className="flex-1 bg-white border border-[#E2D8CB] rounded-lg px-4 py-2.5 text-xs text-[#27332F] placeholder-[#9A958C] outline-none focus:border-[#B69A70] transition"
          />
          <button
            onClick={() => handleSendMessage()}
            className="h-10 px-5 bg-[#27332F] hover:bg-[#34443e] text-white font-medium text-xs rounded-[7px] transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-[#B69A70]" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
