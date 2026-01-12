import { motion } from "framer-motion";
import { Bell, Settings, User, Menu } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface HeaderProps {
  userName: string;
}

const Header = ({ userName }: HeaderProps) => {
  const { setIsNotificationsOpen, setIsSettingsOpen, setIsMobileMenuOpen, unreadAlertsCount } = useApp();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6 text-foreground" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-xl font-bold text-card">₪</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">המרכז הפיננסי</h1>
                <p className="text-xs text-muted-foreground">ניהול חכם של הכסף שלך</p>
              </div>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                  {unreadAlertsCount}
                </span>
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
            </motion.button>

            <div className="hidden sm:flex items-center gap-3 mr-2 pr-4 border-r border-border">
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">חשבון אישי</p>
              </div>
              <div className="w-10 h-10 rounded-full gradient-secondary flex items-center justify-center">
                <User className="h-5 w-5 text-secondary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
