import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AddItemModal from "@/components/modals/AddItemModal";
import UploadDocumentModal from "@/components/modals/UploadDocumentModal";
import SearchModal from "@/components/modals/SearchModal";
import NotificationsPanel from "@/components/modals/NotificationsPanel";
import SettingsModal from "@/components/modals/SettingsModal";
import ChatPanel from "@/components/modals/ChatPanel";
import MobileMenu from "@/components/modals/MobileMenu";
import SharingModal from "@/components/modals/SharingModal";
import { useApp } from "@/contexts/AppContext";
import DashboardPage from "./sections/DashboardPage";
import InsurancePage from "./sections/InsurancePage";
import FinancePage from "./sections/FinancePage";
import InvestmentsPage from "./sections/InvestmentsPage";
import AssetsPage from "./sections/AssetsPage";
import DocumentsPage from "./sections/DocumentsPage";

const Index = () => {
  const { activeSection } = useApp();
  
  const renderSection = () => {
    switch(activeSection) {
      case 'dashboard':
        return <DashboardPage />;
      case 'insurance':
        return <InsurancePage />;
      case 'finance':
        return <FinancePage />;
      case 'investments':
        return <InvestmentsPage />;
      case 'assets':
        return <AssetsPage />;
      case 'documents':
        return <DocumentsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      {/* Modals */}
      <AddItemModal />
      <UploadDocumentModal />
      <SearchModal />
      <NotificationsPanel />
      <SettingsModal />
      <ChatPanel />
      <MobileMenu />
      <SharingModal />
      
      {renderSection()}
    </div>
  );
};

export default Index;
