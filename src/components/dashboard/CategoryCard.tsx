import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  value: number;
  itemCount: number;
  icon: LucideIcon;
  colorClass: string;
  index: number;
}

const CategoryCard = ({ title, value, itemCount, icon: Icon, colorClass, index }: CategoryCardProps) => {
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
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl bg-card p-6 shadow-soft hover:shadow-medium transition-shadow cursor-pointer"
    >
      {/* Icon background */}
      <div className={`absolute -left-4 -top-4 h-24 w-24 rounded-full opacity-10 ${colorClass}`} />
      
      <div className="relative z-10">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${colorClass}`}>
          <Icon className="h-6 w-6 text-card" />
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-2xl font-bold text-foreground mb-2">{formatCurrency(value)}</p>
        <p className="text-sm text-muted-foreground">{itemCount} פריטים</p>
      </div>
      
      {/* Hover indicator */}
      <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-300 rounded-full" 
        style={{ background: `var(--gradient-primary)` }} 
      />
    </motion.div>
  );
};

export default CategoryCard;
