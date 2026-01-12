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

const menuItems = [
  { icon: LayoutDashboard, label: "דאשבורד", active: true },
  { icon: Wallet, label: "כספים ונזילות", active: false },
  { icon: Shield, label: "ביטוחים", active: false },
  { icon: TrendingUp, label: "השקעות", active: false },
  { icon: Home, label: "נכסים ונדל״ן", active: false },
  { icon: FileText, label: "מסמכים", active: false },
];

const bottomItems = [
  { icon: MessageSquare, label: "צ'אט חכם", active: false },
  { icon: Users, label: "שיתוף והרשאות", active: false },
  { icon: Settings, label: "הגדרות", active: false },
  { icon: HelpCircle, label: "עזרה", active: false },
];

const Sidebar = () => {
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
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              item.active
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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
