import { motion } from "framer-motion";
import { Plus, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";

interface SectionHeaderProps {
  title: string;
  icon: LucideIcon;
  totalValue: number;
  itemCount: number;
  onAddClick?: () => void;
}

const SectionHeader = ({ title, icon: Icon, totalValue, itemCount, onAddClick }: SectionHeaderProps) => {
  const { setIsAddItemModalOpen } = useApp();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddClick = () => {
    if (onAddClick) {
      onAddClick();
    } else {
      setIsAddItemModalOpen(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">{title}</h1>
            <p className="text-muted-foreground">
              {itemCount} פריטים • סכום כולל: {formatCurrency(totalValue)}
            </p>
          </div>
        </div>
        <Button onClick={handleAddClick} className="gap-2">
          <Plus className="h-4 w-4" />
          הוסף פריט חדש
        </Button>
      </div>
    </motion.div>
  );
};

export default SectionHeader;
