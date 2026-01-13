import { motion } from "framer-motion";
import { FinancialItem } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface SectionStatsProps {
  items: FinancialItem[];
  category: string;
}

const SectionStats = ({ items, category }: SectionStatsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate stats by subcategory
  const subcategoryStats = items.reduce((acc, item) => {
    const subcat = item.subcategory || 'אחר';
    if (!acc[subcat]) {
      acc[subcat] = { count: 0, value: 0 };
    }
    acc[subcat].count += 1;
    acc[subcat].value += item.value;
    return acc;
  }, {} as Record<string, { count: number; value: number }>);

  const chartData = Object.entries(subcategoryStats).map(([name, data], index) => {
    const colors = [
      'hsl(330, 70%, 60%)',
      'hsl(48, 95%, 60%)',
      'hsl(168, 70%, 65%)',
      'hsl(245, 58%, 60%)',
      'hsl(142, 76%, 36%)',
      'hsl(0, 84%, 60%)',
    ];
    return {
      name,
      value: data.value,
      count: data.count,
      color: colors[index % colors.length],
    };
  });

  const totalValue = items.reduce((sum, item) => sum + item.value, 0);
  const activeCount = items.filter(item => item.status === 'active').length;
  const expiringSoonCount = items.filter(item => {
    if (!item.expiryDate) return false;
    const expiry = new Date(item.expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  }).length;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card rounded-xl p-3 shadow-medium border border-border">
          <p className="font-semibold text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">{formatCurrency(data.value)}</p>
          <p className="text-sm text-muted-foreground">{data.count} פריטים</p>
          <p className="text-sm font-medium text-primary">
            {((data.value / totalValue) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">סה״כ ערך</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalValue)}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">פריטים פעילים</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{activeCount}</p>
              <p className="text-xs text-muted-foreground">מתוך {items.length} פריטים</p>
            </CardContent>
          </Card>
        </motion.div>

        {expiringSoonCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">פגים בקרוב</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{expiringSoonCount}</p>
                <p className="text-xs text-muted-foreground">תוך 30 יום</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Distribution Chart */}
      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl bg-card p-6 shadow-soft"
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">התפלגות לפי תת-קטגוריה</h3>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1000}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full md:w-1/2 space-y-3">
              {chartData.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-foreground">{item.name}</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">{formatCurrency(item.value)}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.count} פריטים • {((item.value / totalValue) * 100).toFixed(1)}%
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SectionStats;
