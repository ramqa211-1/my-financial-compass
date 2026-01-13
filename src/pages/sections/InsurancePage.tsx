import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { useApp, FinancialItem } from "@/contexts/AppContext";
import SectionHeader from "@/components/sections/SectionHeader";
import SectionFilters from "@/components/sections/SectionFilters";
import ItemCard from "@/components/sections/ItemCard";
import ItemsTable from "@/components/sections/ItemsTable";
import SectionStats from "@/components/sections/SectionStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const InsurancePage = () => {
  const { items, categories } = useApp();
  const [filteredItems, setFilteredItems] = useState<FinancialItem[]>([]);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const insuranceItems = items.filter(item => item.category === "insurance");
  const insuranceCategory = categories.find(c => c.id === "insurance");
  const totalValue = insuranceCategory?.value || 0;
  const itemCount = insuranceItems.length;

  // Initialize filtered items
  useEffect(() => {
    setFilteredItems(insuranceItems);
  }, [insuranceItems]);

  return (
    <main className="lg:mr-64 pt-6 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="ביטוחים"
          icon={Shield}
          totalValue={totalValue}
          itemCount={itemCount}
        />

        <SectionFilters
          items={insuranceItems}
          onFilterChange={setFilteredItems}
        />

        <SectionStats items={insuranceItems} category="insurance" />

        <div className="mt-8">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "cards" | "table")}>
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="cards">תצוגת כרטיסים</TabsTrigger>
                <TabsTrigger value="table">תצוגת טבלה</TabsTrigger>
              </TabsList>
              <p className="text-sm text-muted-foreground">
                מציג {filteredItems.length} מתוך {itemCount} פריטים
              </p>
            </div>

            <TabsContent value="cards" className="mt-6">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  אין פריטים להצגה
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item, index) => (
                    <ItemCard key={item.id} item={item} index={index} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="table" className="mt-6">
              <ItemsTable items={filteredItems} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
};

export default InsurancePage;
