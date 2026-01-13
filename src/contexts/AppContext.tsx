import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react";
import { Wallet, Shield, TrendingUp, Home, FileText, LucideIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFinancialItems } from "@/hooks/useFinancialItems";
import { useAlerts } from "@/hooks/useAlerts";
import { useDocuments } from "@/hooks/useDocuments";

export interface FinancialItem {
  id: string;
  name: string;
  institution: string;
  productType: string;
  value: number;
  lastUpdated: string;
  expiryDate?: string;
  status: "active" | "frozen" | "expired";
  category: CategoryType;
  subcategory?: string; // תת-קטגוריה: ביטוח חיים, ביטוח רפואי לילד, ביטוח רכב, וכו'
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "urgent" | "warning" | "info";
  category: "insurance" | "document" | "subscription" | "investment" | "finance";
  read: boolean;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  category: CategoryType;
  uploadDate: string;
  size: string;
}

export type CategoryType = "finance" | "insurance" | "investments" | "assets" | "documents";

export interface Category {
  id: CategoryType;
  title: string;
  value: number;
  itemCount: number;
  icon: LucideIcon;
  colorClass: string;
}

interface AppContextType {
  // Navigation
  activeSection: string;
  setActiveSection: (section: string) => void;
  
  // Data
  items: FinancialItem[];
  addItem: (item: Omit<FinancialItem, "id">) => void;
  
  alerts: Alert[];
  markAlertAsRead: (id: string) => void;
  unreadAlertsCount: number;
  
  documents: Document[];
  addDocument: (doc: Omit<Document, "id">) => void;
  
  categories: Category[];
  
  // Modals
  isAddItemModalOpen: boolean;
  setIsAddItemModalOpen: (open: boolean) => void;
  
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: FinancialItem[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  
  // Supabase hooks - all data comes from Supabase only
  const { items: supabaseItems, addItem: addItemToSupabase, isLoading: itemsLoading, error: itemsError } = useFinancialItems(user?.id);
  const { alerts: supabaseAlerts, markAsRead: markAlertAsReadInSupabase, isLoading: alertsLoading, error: alertsError } = useAlerts(user?.id);
  const { documents: supabaseDocuments, addDocument: addDocumentToSupabase, isLoading: documentsLoading, error: documentsError } = useDocuments(user?.id);
  
  // All data comes from Supabase - no local fallback
  const items = supabaseItems || [];
  const alerts = supabaseAlerts || [];
  const documents = supabaseDocuments || [];
  
  // Modals
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Search
  const [searchQuery, setSearchQuery] = useState("");
  
  const searchResults = items.filter(item => 
    searchQuery && (
      item.name.includes(searchQuery) || 
      item.institution.includes(searchQuery) ||
      item.productType.includes(searchQuery)
    )
  );

  const addItem = async (item: Omit<FinancialItem, "id">) => {
    if (!user) {
      throw new Error('נא להתחבר כדי להוסיף פריט');
    }
    try {
      await addItemToSupabase(item);
    } catch (error: any) {
      console.error('Error adding item to Supabase:', error);
      throw new Error(`שגיאה בהוספת הפריט: ${error.message || 'שגיאה לא ידועה'}`);
    }
  };

  const markAlertAsRead = async (id: string) => {
    if (!user) {
      throw new Error('נא להתחבר כדי לעדכן התראות');
    }
    try {
      await markAlertAsReadInSupabase(id);
    } catch (error: any) {
      console.error('Error marking alert as read:', error);
      throw new Error(`שגיאה בעדכון ההתראה: ${error.message || 'שגיאה לא ידועה'}`);
    }
  };

  const addDocument = async (doc: Omit<Document, "id"> & { file?: File }) => {
    if (!user) {
      throw new Error('נא להתחבר כדי להעלות מסמך');
    }
    try {
      await addDocumentToSupabase(doc);
    } catch (error: any) {
      console.error('Error adding document to Supabase:', error);
      throw new Error(`שגיאה בהעלאת המסמך: ${error.message || 'שגיאה לא ידועה'}`);
    }
  };

  const unreadAlertsCount = alerts.filter(a => !a.read).length;

  // Calculate categories from items
  const categories: Category[] = useMemo(() => [
    { 
      id: "finance", 
      title: "כספים ונזילות", 
      value: items.filter(i => i.category === "finance").reduce((sum, i) => sum + i.value, 0),
      itemCount: items.filter(i => i.category === "finance").length,
      icon: Wallet, 
      colorClass: "bg-finance" 
    },
    { 
      id: "insurance", 
      title: "ביטוחים", 
      value: items.filter(i => i.category === "insurance").reduce((sum, i) => sum + i.value, 0),
      itemCount: items.filter(i => i.category === "insurance").length,
      icon: Shield, 
      colorClass: "bg-insurance" 
    },
    { 
      id: "investments", 
      title: "השקעות", 
      value: items.filter(i => i.category === "investments").reduce((sum, i) => sum + i.value, 0),
      itemCount: items.filter(i => i.category === "investments").length,
      icon: TrendingUp, 
      colorClass: "bg-investments" 
    },
    { 
      id: "assets", 
      title: "נכסים ונדל״ן", 
      value: items.filter(i => i.category === "assets").reduce((sum, i) => sum + i.value, 0),
      itemCount: items.filter(i => i.category === "assets").length,
      icon: Home, 
      colorClass: "bg-assets" 
    },
    { 
      id: "documents", 
      title: "מסמכים", 
      value: 0,
      itemCount: documents.length,
      icon: FileText, 
      colorClass: "bg-documents" 
    },
  ], [items, documents]);

  return (
    <AppContext.Provider value={{
      activeSection,
      setActiveSection,
      items,
      addItem,
      alerts,
      markAlertAsRead,
      unreadAlertsCount,
      documents,
      addDocument,
      categories,
      isAddItemModalOpen,
      setIsAddItemModalOpen,
      isUploadModalOpen,
      setIsUploadModalOpen,
      isSearchModalOpen,
      setIsSearchModalOpen,
      isNotificationsOpen,
      setIsNotificationsOpen,
      isSettingsOpen,
      setIsSettingsOpen,
      isChatOpen,
      setIsChatOpen,
      isMobileMenuOpen,
      setIsMobileMenuOpen,
      searchQuery,
      setSearchQuery,
      searchResults,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
