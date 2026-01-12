import { motion } from "framer-motion";
import { Plus, Upload, MessageSquare, Search } from "lucide-react";

const actions = [
  {
    icon: Plus,
    label: "הוסף פריט",
    description: "הוסף נכס או ביטוח חדש",
    gradient: "from-primary to-primary/80",
  },
  {
    icon: Upload,
    label: "העלה מסמך",
    description: "העלה PDF או תמונה",
    gradient: "from-secondary to-secondary/80",
  },
  {
    icon: MessageSquare,
    label: "שאל את הבוט",
    description: "צ'אט חכם עם ה-AI",
    gradient: "from-accent to-accent/80",
  },
  {
    icon: Search,
    label: "חיפוש מתקדם",
    description: "חפש בכל הנתונים",
    gradient: "from-assets to-assets/80",
  },
];

const QuickActions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl bg-card p-6 shadow-soft"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">פעולות מהירות</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`group relative overflow-hidden rounded-xl p-4 text-right bg-gradient-to-br ${action.gradient} text-card transition-all hover:shadow-medium`}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-card/0 group-hover:bg-card/10 transition-colors" />
            <div className="relative z-10">
              <action.icon className="h-6 w-6 mb-2" />
              <p className="font-semibold text-sm">{action.label}</p>
              <p className="text-xs opacity-80">{action.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;
