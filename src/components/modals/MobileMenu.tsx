import { motion, AnimatePresence } from "framer-motion";
import { X, LayoutDashboard, Wallet, Shield, TrendingUp, Home, FileText, MessageSquare, Users, Settings, HelpCircle } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

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

const MobileMenu = () => {
  const { isMobileMenuOpen, setIsMobileMenuOpen, activeSection, setActiveSection, setIsChatOpen, setIsSettingsOpen } = useApp();

  const handleItemClick = (id: string) => {
    if (id === "chat") {
      setIsChatOpen(true);
    } else if (id === "settings") {
      setIsSettingsOpen(true);
    } else {
      setActiveSection(id);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-card border-l border-border p-6 lg:hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-foreground">תפריט</h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
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

            <div className="border-t border-border pt-4 mt-6 space-y-2">
              {bottomItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleItemClick(item.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
