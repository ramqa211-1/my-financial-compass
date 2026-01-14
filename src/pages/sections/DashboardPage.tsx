import NetWorthWidget from "@/components/dashboard/NetWorthWidget";
import CategoryCard from "@/components/dashboard/CategoryCard";
import AssetDistributionChart from "@/components/dashboard/AssetDistributionChart";
import AlertsTimeline from "@/components/dashboard/AlertsTimeline";
import QuickActions from "@/components/dashboard/QuickActions";
import { useApp } from "@/contexts/AppContext";

const DashboardPage = () => {
  const { categories, alerts, items } = useApp();
  
  const totalNetWorth = categories.reduce((sum, cat) => sum + cat.value, 0);
  
  const assetDistribution = [
    { name: "נכסים ונדל״ן", value: categories.find(c => c.id === "assets")?.value || 0, color: "hsl(330, 70%, 60%)" },
    { name: "השקעות", value: categories.find(c => c.id === "investments")?.value || 0, color: "hsl(48, 95%, 60%)" },
    { name: "כספים ונזילות", value: categories.find(c => c.id === "finance")?.value || 0, color: "hsl(168, 70%, 65%)" },
    { name: "ביטוחים (ערך)", value: categories.find(c => c.id === "insurance")?.value || 0, color: "hsl(245, 58%, 60%)" },
  ];

  // Calculate change (simulated) - מטפל במצב שבו אין פריטים
  const previousNetWorth = totalNetWorth * 0.97;
  const changeAmount = totalNetWorth - previousNetWorth;
  const changePercent = previousNetWorth > 0 ? (changeAmount / previousNetWorth) * 100 : 0;

  return (
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
              changePercent={changePercent} 
              changeAmount={changeAmount}
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
  );
};

export default DashboardPage;
