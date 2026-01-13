import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Wallet, Shield, TrendingUp, Home, FileText } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Input } from "@/components/ui/input";

const categoryIcons = {
  finance: Wallet,
  insurance: Shield,
  investments: TrendingUp,
  assets: Home,
  documents: FileText,
};

const SearchModal = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, searchQuery, setSearchQuery, searchResults, items } = useApp();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const displayItems = searchQuery ? searchResults : items.slice(0, 5);

  return (
    <AnimatePresence>
      {isSearchModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-background/80 backdrop-blur-sm p-4"
          onClick={() => { setIsSearchModalOpen(false); setSearchQuery(""); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="bg-card rounded-2xl shadow-strong w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  autoFocus
                  placeholder="חפש נכסים, ביטוחים, מסמכים..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {displayItems.length > 0 ? (
                <div className="p-2">
                  {!searchQuery && (
                    <p className="text-xs text-muted-foreground px-3 py-2">פריטים אחרונים</p>
                  )}
                  {displayItems.map((item) => {
                    const Icon = categoryIcons[item.category];
                    return (
                      <motion.button
                        key={item.id}
                        whileHover={{ backgroundColor: "hsl(var(--muted))" }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-right transition-colors"
                        onClick={() => { setIsSearchModalOpen(false); setSearchQuery(""); }}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          item.category === 'finance' ? 'bg-finance' :
                          item.category === 'insurance' ? 'bg-insurance' :
                          item.category === 'investments' ? 'bg-investments' :
                          item.category === 'assets' ? 'bg-assets' :
                          'bg-documents'
                        }`}>
                          <Icon className="h-5 w-5 text-card" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.institution}</p>
                        </div>
                        <p className="text-sm font-medium text-foreground">{formatCurrency(item.value)}</p>
                      </motion.button>
                    );
                  })}
                </div>
              ) : searchQuery ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">לא נמצאו תוצאות עבור "{searchQuery}"</p>
                </div>
              ) : null}
            </div>

            {/* Keyboard shortcut hint */}
            <div className="p-3 border-t border-border bg-muted/50">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>ESC לסגירה</span>
                <span>↑↓ לניווט</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
