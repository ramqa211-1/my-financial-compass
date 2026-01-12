import { motion } from "framer-motion";
import { AlertCircle, Calendar, FileText, Shield, Clock } from "lucide-react";

interface Alert {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "urgent" | "warning" | "info";
  category: "insurance" | "document" | "subscription" | "investment" | "finance";
  read?: boolean;
}

interface AlertsTimelineProps {
  alerts: Alert[];
}

const AlertsTimeline = ({ alerts }: AlertsTimelineProps) => {
  const getIcon = (category: string) => {
    switch (category) {
      case "insurance":
        return Shield;
      case "document":
        return FileText;
      case "subscription":
        return Calendar;
      default:
        return Clock;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "urgent":
        return "bg-destructive/10 border-destructive/30 text-destructive";
      case "warning":
        return "bg-accent/20 border-accent/40 text-accent-foreground";
      default:
        return "bg-primary/10 border-primary/30 text-primary";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl bg-card p-6 shadow-soft"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">התראות קרובות</h3>
        <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {alerts.length} התראות
        </span>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, index) => {
          const Icon = getIcon(alert.category);
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              className={`relative flex gap-4 p-4 rounded-xl border ${getTypeStyles(alert.type)} transition-all hover:scale-[1.02]`}
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-soft">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-foreground truncate">{alert.title}</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.date}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
              </div>

              {alert.type === "urgent" && (
                <div className="absolute top-2 left-2">
                  <AlertCircle className="h-4 w-4 text-destructive animate-pulse" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AlertsTimeline;
