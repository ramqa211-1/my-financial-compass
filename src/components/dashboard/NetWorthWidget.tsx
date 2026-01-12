import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface NetWorthWidgetProps {
  totalNetWorth: number;
  changePercent: number;
  changeAmount: number;
}

const NetWorthWidget = ({ totalNetWorth, changePercent, changeAmount }: NetWorthWidgetProps) => {
  const isPositive = changePercent >= 0;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-card p-8 shadow-medium"
    >
      {/* Background decoration */}
      <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/10" />
      <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-accent/20" />
      
      <div className="relative z-10">
        <p className="text-sm font-medium text-muted-foreground mb-2">הון עצמי כולל</p>
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {formatCurrency(totalNetWorth)}
        </motion.h2>
        
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full ${
            isPositive 
              ? 'bg-primary/15 text-primary' 
              : 'bg-destructive/15 text-destructive'
          }`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {isPositive ? '+' : ''}{changePercent.toFixed(1)}%
          </span>
          <span className="text-sm text-muted-foreground">
            {isPositive ? '+' : ''}{formatCurrency(changeAmount)} החודש
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default NetWorthWidget;
