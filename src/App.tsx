import React, { useState } from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Breadcrumbs } from './components/layout/Breadcrumbs';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { NotificationsDrawer } from './components/layout/NotificationsDrawer';

// Division 1: Office Management Workspaces
import { OfficeDashboard } from './components/office/OfficeDashboard';
import { PMOWorkspace } from './components/office/PMOWorkspace';
import { EstimationCommercialWorkspace } from './components/office/EstimationCommercialWorkspace';
import { ProcurementWorkspace } from './components/office/ProcurementWorkspace';
import { FinanceAccountsWorkspace } from './components/office/FinanceAccountsWorkspace';
import { HRAdminWorkspace } from './components/office/HRAdminWorkspace';
import { ContractsWorkspace } from './components/office/ContractsWorkspace';
import { VendorSupplierWorkspace } from './components/office/VendorSupplierWorkspace';
import { DocumentManagementWorkspace } from './components/office/DocumentManagementWorkspace';
import { AssetManagementWorkspace } from './components/office/AssetManagementWorkspace';
import { ReportsAnalyticsWorkspace } from './components/office/ReportsAnalyticsWorkspace';

// Division 2: Site Management
import { SiteManagementWorkspace } from './components/site/SiteManagementWorkspace';
import { SiteOperationsWorkspace } from './components/site/SiteOperationsWorkspace';
import { EngineeringTechnicalWorkspace } from './components/site/EngineeringTechnicalWorkspace';
import { QAQCWorkspace } from './components/site/QAQCWorkspace';
import { HSEWorkspace } from './components/site/HSEWorkspace';

// Division 3: CRM
import { CRMWorkspace } from './components/crm/CRMWorkspace';

// Division 4: AI Tools & Intelligence
import { AIToolsWorkspace } from './components/ai/AIToolsWorkspace';

const MainAppContent: React.FC = () => {
  const { activeDivision, activeOfficeSubmodule, activeSiteSubmodule, theme } = useERP();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Render appropriate workspace based on selected division & submodule
  const renderWorkspace = () => {
    switch (activeDivision) {
      case 'office':
        switch (activeOfficeSubmodule) {
          case 'dashboard':
            return <OfficeDashboard />;
          case 'pmo':
            return <PMOWorkspace />;
          case 'commercial':
            return <EstimationCommercialWorkspace />;
          case 'procurement':
            return <ProcurementWorkspace />;
          case 'finance':
            return <FinanceAccountsWorkspace />;
          case 'hr':
            return <HRAdminWorkspace />;
          case 'contracts':
            return <ContractsWorkspace />;
          case 'vendors':
            return <VendorSupplierWorkspace />;
          case 'documents':
            return <DocumentManagementWorkspace />;
          case 'assets':
            return <AssetManagementWorkspace />;
          case 'reports':
            return <ReportsAnalyticsWorkspace />;
          default:
            return <OfficeDashboard />;
        }

      case 'site':
        switch (activeSiteSubmodule) {
          case 'site-operations':
          case 'site-dashboard':
            return <SiteOperationsWorkspace />;
          case 'engineering':
            return <EngineeringTechnicalWorkspace />;
          case 'qaqc':
            return <QAQCWorkspace />;
          case 'hse':
            return <HSEWorkspace />;
          case 'dpr':
          case 'equipment':
          case 'inspections':
          case 'subcontractors':
            return <SiteManagementWorkspace />;
          default:
            return <SiteOperationsWorkspace />;
        }

      case 'crm':
        return <CRMWorkspace />;

      case 'ai':
        return <AIToolsWorkspace />;

      default:
        return <OfficeDashboard />;
    }
  };

  return (
    <div
      className={`h-full flex flex-col font-sans overflow-hidden transition-colors duration-200 ${
        theme === 'light'
          ? 'theme-light bg-[#F5F0E8] text-[#27332F]'
          : 'theme-dark bg-[#091217] text-slate-100'
      }`}
    >
      {/* Universal Top Header */}
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
      />

      {/* Main Workspace Frame with Collapsible Multi-Level Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div
          className={`flex-1 flex flex-col min-w-0 overflow-hidden ${
            theme === 'light' ? 'bg-[#F5F0E8]' : 'bg-[#091217]'
          }`}
        >
          <Breadcrumbs />
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 custom-scrollbar">
            {renderWorkspace()}
          </main>
        </div>
      </div>

      {/* Global Modals & Drawers */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationsDrawer isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <ERPProvider>
      <MainAppContent />
    </ERPProvider>
  );
}
