import { useState } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Wallet, 
  Shield, 
  TrendingUp, 
  Home, 
  FileText, 
  MessageSquare,
  Users,
  Settings,
  HelpCircle
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import SharingModal from "@/components/modals/SharingModal";

const menuItems = [
  { icon: LayoutDashboard, label: "דאשבורד", id: "dashboard" },
  { icon: Wallet, label: "כספים ונזילות", id: "finance" },
  { icon: Shield, label: "ביטוחים", id: "insurance" },
  { icon: TrendingUp, label: "השקעות", id: "investments" },
  { icon: Home, label: "נכסים ונדל״ן", id: "assets" },
  { icon: FileText, label: "מסמכים", id: "documents" },
];

const bottomItems = [
  { icon: MessageSquare, label: "צ'אט חכם", id: "chat" },
  { icon: Users, label: "שיתוף והרשאות", id: "sharing" },
  { icon: Settings, label: "הגדרות", id: "settings" },
  { icon: HelpCircle, label: "עזרה", id: "help" },
];

const Sidebar = () => {
  const { activeSection, setActiveSection, setIsChatOpen, setIsSettingsOpen } = useApp();
  const [isSharingOpen, setIsSharingOpen] = useState(false);

  const handleItemClick = (id: string) => {
    if (id === "chat") {
      setIsChatOpen(true);
    } else if (id === "settings") {
      setIsSettingsOpen(true);
    } else if (id === "sharing") {
      setIsSharingOpen(true);
    } else {
      setActiveSection(id);
    }
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="hidden lg:flex flex-col fixed right-0 top-0 h-screen w-64 bg-card border-l border-border pt-24 pb-6 px-4"
    >
      <nav className="flex-1 space-y-2">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => handleItemClick(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeSection === item.id
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}
      </nav>

      <div className="border-t border-border pt-4 mt-4 space-y-2">
        {bottomItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
            onClick={() => handleItemClick(item.id)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}
      </div>
      
      <SharingModal />
    </motion.aside>
  );
};

export default Sidebar;
