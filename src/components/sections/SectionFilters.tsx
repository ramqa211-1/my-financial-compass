import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FinancialItem } from "@/contexts/AppContext";

interface SectionFiltersProps {
  items: FinancialItem[];
  onFilterChange: (filteredItems: FinancialItem[]) => void;
}

const SectionFilters = ({ items, onFilterChange }: SectionFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [institutionFilter, setInstitutionFilter] = useState<string>("all");
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>("all");

  // Get unique values for filters
  const institutions = Array.from(new Set(items.map(item => item.institution)));
  const subcategories = Array.from(new Set(items.map(item => item.subcategory).filter(Boolean)));

  // Apply filters
  useEffect(() => {
    let filtered = [...items];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.productType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.subcategory && item.subcategory.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Institution filter
    if (institutionFilter !== "all") {
      filtered = filtered.filter(item => item.institution === institutionFilter);
    }

    // Subcategory filter
    if (subcategoryFilter !== "all") {
      filtered = filtered.filter(item => item.subcategory === subcategoryFilter);
    }

    onFilterChange(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, institutionFilter, subcategoryFilter, items]);

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חפש פריטים..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="סטטוס" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הסטטוסים</SelectItem>
            <SelectItem value="active">פעיל</SelectItem>
            <SelectItem value="frozen">מוקפא</SelectItem>
            <SelectItem value="expired">פג תוקף</SelectItem>
          </SelectContent>
        </Select>

        {/* Institution Filter */}
        {institutions.length > 0 && (
          <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="מוסד" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל המוסדות</SelectItem>
              {institutions.map(inst => (
                <SelectItem key={inst} value={inst}>{inst}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Subcategory Filter */}
        {subcategories.length > 0 && (
          <Select value={subcategoryFilter} onValueChange={setSubcategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="תת-קטגוריה" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל התת-קטגוריות</SelectItem>
              {subcategories.map(sub => (
                <SelectItem key={sub} value={sub}>{sub}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};

export default SectionFilters;
