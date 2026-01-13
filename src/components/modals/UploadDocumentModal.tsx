import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileText, Check } from "lucide-react";
import { useApp, CategoryType } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const categoryOptions = [
  { value: "finance", label: "כספים ונזילות" },
  { value: "insurance", label: "ביטוחים" },
  { value: "investments", label: "השקעות" },
  { value: "assets", label: "נכסים ונדל״ן" },
  { value: "documents", label: "מסמכים" },
];

const UploadDocumentModal = () => {
  const { isUploadModalOpen, setIsUploadModalOpen, addDocument } = useApp();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<CategoryType | "">("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // Auto-detect category based on filename
    const name = file.name.toLowerCase();
    if (name.includes("ביטוח") || name.includes("פוליסה")) {
      setCategory("insurance");
    } else if (name.includes("דרכון") || name.includes("תעודה")) {
      setCategory("documents");
    } else if (name.includes("חוזה") || name.includes("נכס")) {
      setCategory("assets");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !category) {
      toast({
        title: "שגיאה",
        description: "נא לבחור קובץ וקטגוריה",
        variant: "destructive",
      });
      return;
    }

    try {
      await addDocument({
        name: selectedFile.name.replace(/\.[^/.]+$/, ""),
        type: selectedFile.name.split('.').pop()?.toUpperCase() || "FILE",
        category: category as CategoryType,
        uploadDate: new Date().toISOString().split('T')[0],
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        file: selectedFile, // העברת הקובץ בפועל
      });

      toast({
        title: "הועלה בהצלחה! ✓",
        description: `${selectedFile.name} נוסף לקטגוריית ${categoryOptions.find(c => c.value === category)?.label}`,
      });

      setSelectedFile(null);
      setCategory("");
      setIsUploadModalOpen(false);
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: error.message || "לא ניתן להעלות את הקובץ. נא לנסות שוב.",
        variant: "destructive",
      });
    }
  };

  return (
    <AnimatePresence>
      {isUploadModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card rounded-2xl shadow-strong p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">העלאת מסמך</h2>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging 
                  ? "border-primary bg-primary/10" 
                  : selectedFile 
                    ? "border-primary bg-primary/5" 
                    : "border-muted-foreground/30 hover:border-primary/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
              
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-foreground">גרור קובץ לכאן</p>
                  <p className="text-sm text-muted-foreground">או לחץ לבחירת קובץ</p>
                  <p className="text-xs text-muted-foreground">PDF, JPG, PNG, DOC</p>
                </div>
              )}
            </div>

            <div className="space-y-2 mt-4">
              <Label>קטגוריה *</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as CategoryType)}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר קטגוריה למסמך" />
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

            <Button onClick={handleSubmit} className="w-full mt-6" disabled={!selectedFile || !category}>
              <FileText className="h-4 w-4 ml-2" />
              העלה מסמך
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadDocumentModal;
