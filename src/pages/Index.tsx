import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import NetWorthWidget from "@/components/dashboard/NetWorthWidget";
import CategoryCard from "@/components/dashboard/CategoryCard";
import AssetDistributionChart from "@/components/dashboard/AssetDistributionChart";
import AlertsTimeline from "@/components/dashboard/AlertsTimeline";
import QuickActions from "@/components/dashboard/QuickActions";
import { Wallet, Shield, TrendingUp, Home, FileText } from "lucide-react";

// Mock data
const categories = [
  { title: "כספים ונזילות", value: 245000, itemCount: 5, icon: Wallet, colorClass: "bg-finance" },
  { title: "ביטוחים", value: 18500, itemCount: 7, icon: Shield, colorClass: "bg-insurance" },
  { title: "השקעות", value: 892000, itemCount: 4, icon: TrendingUp, colorClass: "bg-investments" },
  { title: "נכסים ונדל״ן", value: 1850000, itemCount: 2, icon: Home, colorClass: "bg-assets" },
  { title: "מסמכים", value: 0, itemCount: 12, icon: FileText, colorClass: "bg-documents" },
];

const assetDistribution = [
  { name: "נכסים ונדל״ן", value: 1850000, color: "hsl(330, 70%, 60%)" },
  { name: "השקעות", value: 892000, color: "hsl(48, 95%, 60%)" },
  { name: "כספים ונזילות", value: 245000, color: "hsl(168, 70%, 65%)" },
  { name: "ביטוחים (ערך)", value: 120000, color: "hsl(245, 58%, 60%)" },
];

const alerts = [
  {
    id: "1",
    title: "חידוש ביטוח רכב",
    description: "הפוליסה של טויוטה קורולה פגה בעוד 14 יום",
    date: "26/01/2026",
    type: "urgent" as const,
    category: "insurance" as const,
  },
  {
    id: "2",
    title: "תוקף דרכון",
    description: "הדרכון שלך יפוג בעוד 3 חודשים",
    date: "12/04/2026",
    type: "warning" as const,
    category: "document" as const,
  },
  {
    id: "3",
    title: "חידוש מנוי נטפליקס",
    description: "חיוב אוטומטי של ₪59.90",
    date: "01/02/2026",
    type: "info" as const,
    category: "subscription" as const,
  },
  {
    id: "4",
    title: "דו״ח רבעוני קרן השתלמות",
    description: "דו״ח Q4 2025 זמין לצפייה",
    date: "15/01/2026",
    type: "info" as const,
    category: "investment" as const,
  },
];

const Index = () => {
  const totalNetWorth = categories.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header userName="ישראל ישראלי" />
      <Sidebar />
      
      <main className="lg:mr-64 pt-6 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              שלום, ישראל 👋
            </h2>
            <p className="text-muted-foreground">
              הנה סיכום המצב הפיננסי שלך להיום
            </p>
          </div>

          {/* Net Worth & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <NetWorthWidget 
                totalNetWorth={totalNetWorth} 
                changePercent={3.2} 
                changeAmount={98500}
              />
            </div>
            <QuickActions />
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.title}
                title={category.title}
                value={category.value}
                itemCount={category.itemCount}
                icon={category.icon}
                colorClass={category.colorClass}
                index={index}
              />
            ))}
          </div>

          {/* Charts & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AssetDistributionChart data={assetDistribution} />
            <AlertsTimeline alerts={alerts} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
