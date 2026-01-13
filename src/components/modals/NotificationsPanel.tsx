import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, AlertTriangle, AlertCircle, Info, Check } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const typeConfig = {
  urgent: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  warning: { icon: AlertCircle, color: "text-accent", bg: "bg-accent/10" },
  info: { icon: Info, color: "text-primary", bg: "bg-primary/10" },
};

const NotificationsPanel = () => {
  const { isNotificationsOpen, setIsNotificationsOpen, alerts, markAlertAsRead, unreadAlertsCount } = useApp();

  return (
    <AnimatePresence>
      {isNotificationsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={() => setIsNotificationsOpen(false)}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            className="fixed top-20 left-4 z-50 bg-card rounded-2xl shadow-strong w-80 max-w-[calc(100vw-2rem)] max-h-[70vh] overflow-hidden sm:left-4 sm:w-80"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-foreground" />
                <h3 className="font-semibold text-foreground">התראות</h3>
                {unreadAlertsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground text-xs font-medium">
                    {unreadAlertsCount}
                  </span>
                )}
              </div>
              <button 
                onClick={() => setIsNotificationsOpen(false)}
                className="p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {alerts.map((alert) => {
                const config = typeConfig[alert.type];
                const Icon = config.icon;
                
                return (
                  <motion.div
                    key={alert.id}
                    whileHover={{ backgroundColor: "hsl(var(--muted))" }}
                    className={`p-4 border-b border-border last:border-0 cursor-pointer transition-colors ${
                      !alert.read ? "bg-primary/5" : ""
                    }`}
                    onClick={() => markAlertAsRead(alert.id)}
                  >
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`h-4 w-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-foreground text-sm">{alert.title}</p>
                          {!alert.read && (
                            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{alert.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.date}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {alerts.length === 0 && (
              <div className="p-8 text-center">
                <Check className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">אין התראות חדשות</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationsPanel;
