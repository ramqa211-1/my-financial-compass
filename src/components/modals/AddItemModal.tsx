import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { useApp, CategoryType } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const categoryOptions = [
  { value: "finance", label: "כספים ונזילות" },
  { value: "insurance", label: "ביטוחים" },
  { value: "investments", label: "השקעות" },
  { value: "assets", label: "נכסים ונדל״ן" },
];

const AddItemModal = () => {
  const { isAddItemModalOpen, setIsAddItemModalOpen, addItem } = useApp();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    institution: "",
    productType: "",
    value: "",
    category: "" as CategoryType | "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.institution || !formData.category) {
      toast({
        title: "שגיאה",
        description: "נא למלא את כל השדות החובה",
        variant: "destructive",
      });
      return;
    }

    addItem({
      name: formData.name,
      institution: formData.institution,
      productType: formData.productType || "כללי",
      value: parseFloat(formData.value) || 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: "active",
      category: formData.category as CategoryType,
    });

    toast({
      title: "נוסף בהצלחה! ✓",
      description: `${formData.name} נוסף לקטגוריית ${categoryOptions.find(c => c.value === formData.category)?.label}`,
    });

    setFormData({ name: "", institution: "", productType: "", value: "", category: "" });
    setIsAddItemModalOpen(false);
  };

  return (
    <AnimatePresence>
      {isAddItemModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={() => setIsAddItemModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card rounded-2xl shadow-strong p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">הוסף פריט חדש</h2>
              <button 
                onClick={() => setIsAddItemModalOpen(false)}
                className="p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">שם הפריט *</Label>
                <Input
                  id="name"
                  placeholder="לדוגמה: חשבון עו״ש"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">קטגוריה *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as CategoryType }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר קטגוריה" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">מוסד / גוף *</Label>
                <Input
                  id="institution"
                  placeholder="לדוגמה: בנק לאומי"
                  value={formData.institution}
                  onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productType">סוג מוצר</Label>
                <Input
                  id="productType"
                  placeholder="לדוגמה: חשבון בנק"
                  value={formData.productType}
                  onChange={(e) => setFormData(prev => ({ ...prev, productType: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">ערך (₪)</Label>
                <Input
                  id="value"
                  type="number"
                  placeholder="0"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                />
              </div>

              <Button type="submit" className="w-full mt-6">
                <Plus className="h-4 w-4 ml-2" />
                הוסף פריט
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddItemModal;
