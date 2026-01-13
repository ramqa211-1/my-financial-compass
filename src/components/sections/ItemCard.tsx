import { motion } from "framer-motion";
import { Calendar, Building2, AlertCircle } from "lucide-react";
import { FinancialItem } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ItemCardProps {
  item: FinancialItem;
  index: number;
}

const ItemCard = ({ item, index }: ItemCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const getDaysUntilExpiry = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  const isExpired = daysUntilExpiry !== null && daysUntilExpiry <= 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'frozen':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
      case 'expired':
        return 'bg-red-500/10 text-red-600 dark:text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'פעיל';
      case 'frozen':
        return 'מוקפא';
      case 'expired':
        return 'פג תוקף';
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">{item.name}</h3>
              {item.subcategory && (
                <p className="text-sm text-muted-foreground mb-2">{item.subcategory}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{item.institution}</span>
              </div>
            </div>
            <Badge className={getStatusColor(item.status)}>
              {getStatusLabel(item.status)}
            </Badge>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">ערך</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(item.value)}</p>
            </div>
            {item.productType && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">סוג מוצר</p>
                <p className="text-sm font-medium text-foreground">{item.productType}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>עודכן: {formatDate(item.lastUpdated)}</span>
            </div>
            {item.expiryDate && (
              <div className="flex items-center gap-2">
                {isExpiringSoon && (
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                )}
                {isExpired && (
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                )}
                <span className={`text-sm font-medium ${
                  isExpired 
                    ? 'text-red-600 dark:text-red-400' 
                    : isExpiringSoon 
                    ? 'text-yellow-600 dark:text-yellow-400' 
                    : 'text-muted-foreground'
                }`}>
                  {isExpired 
                    ? 'פג תוקף' 
                    : isExpiringSoon 
                    ? `פג בעוד ${daysUntilExpiry} ימים` 
                    : `תפוגה: ${formatDate(item.expiryDate)}`}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ItemCard;
