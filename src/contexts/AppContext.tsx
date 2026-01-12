import { createContext, useContext, useState, ReactNode } from "react";
import { Wallet, Shield, TrendingUp, Home, FileText, LucideIcon } from "lucide-react";

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

// Initial data
const initialItems: FinancialItem[] = [
  { id: "1", name: "חשבון עו״ש", institution: "בנק לאומי", productType: "חשבון בנק", value: 45000, lastUpdated: "2026-01-10", status: "active", category: "finance" },
  { id: "2", name: "חסכון לכל מטרה", institution: "בנק הפועלים", productType: "חסכון", value: 120000, lastUpdated: "2026-01-05", status: "active", category: "finance" },
  { id: "3", name: "ביטוח רכב מקיף", institution: "הראל", productType: "ביטוח רכב", value: 4500, lastUpdated: "2025-12-01", expiryDate: "2026-01-26", status: "active", category: "insurance" },
  { id: "4", name: "ביטוח בריאות", institution: "כלל", productType: "בריאות", value: 6000, lastUpdated: "2025-11-15", status: "active", category: "insurance" },
  { id: "5", name: "קרן השתלמות", institution: "מיטב דש", productType: "קרן השתלמות", value: 450000, lastUpdated: "2026-01-01", status: "active", category: "investments" },
  { id: "6", name: "פנסיה", institution: "הפניקס", productType: "פנסיה", value: 350000, lastUpdated: "2026-01-01", status: "active", category: "investments" },
  { id: "7", name: "דירה בתל אביב", institution: "בבעלות", productType: "נדל״ן", value: 1850000, lastUpdated: "2025-06-01", status: "active", category: "assets" },
];

const initialAlerts: Alert[] = [
  { id: "1", title: "חידוש ביטוח רכב", description: "הפוליסה של טויוטה קורולה פגה בעוד 14 יום", date: "26/01/2026", type: "urgent", category: "insurance", read: false },
  { id: "2", title: "תוקף דרכון", description: "הדרכון שלך יפוג בעוד 3 חודשים", date: "12/04/2026", type: "warning", category: "document", read: false },
  { id: "3", title: "חידוש מנוי נטפליקס", description: "חיוב אוטומטי של ₪59.90", date: "01/02/2026", type: "info", category: "subscription", read: true },
  { id: "4", title: "דו״ח רבעוני קרן השתלמות", description: "דו״ח Q4 2025 זמין לצפייה", date: "15/01/2026", type: "info", category: "investment", read: false },
];

const initialDocuments: Document[] = [
  { id: "1", name: "דרכון ישראלי", type: "PDF", category: "documents", uploadDate: "2025-01-15", size: "2.4 MB" },
  { id: "2", name: "פוליסת ביטוח רכב", type: "PDF", category: "insurance", uploadDate: "2025-12-01", size: "1.8 MB" },
  { id: "3", name: "חוזה שכירות", type: "PDF", category: "assets", uploadDate: "2025-06-10", size: "3.2 MB" },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [items, setItems] = useState<FinancialItem[]>(initialItems);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  
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

  const addItem = (item: Omit<FinancialItem, "id">) => {
    const newItem = { ...item, id: Date.now().toString() };
    setItems(prev => [...prev, newItem]);
  };

  const markAlertAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const addDocument = (doc: Omit<Document, "id">) => {
    const newDoc = { ...doc, id: Date.now().toString() };
    setDocuments(prev => [...prev, newDoc]);
  };

  const unreadAlertsCount = alerts.filter(a => !a.read).length;

  // Calculate categories from items
  const categories: Category[] = [
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
  ];

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
