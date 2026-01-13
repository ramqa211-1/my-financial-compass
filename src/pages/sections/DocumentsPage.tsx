import { useState, useEffect } from "react";
import { FileText, Download, Trash2, Search } from "lucide-react";
import { useApp, Document } from "@/contexts/AppContext";
import SectionHeader from "@/components/sections/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DocumentsPage = () => {
  const { documents, setIsUploadModalOpen } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(documents);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      documents: "מסמכים כלליים",
      insurance: "ביטוחים",
      assets: "נכסים",
      finance: "כספים",
      investments: "השקעות",
    };
    return labels[category] || category;
  };

  // Filter documents
  useEffect(() => {
    if (searchQuery) {
      const filtered = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getCategoryLabel(doc.category).toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDocuments(filtered);
    } else {
      setFilteredDocuments(documents);
    }
  }, [searchQuery, documents]);

  return (
    <main className="lg:mr-64 pt-6 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="מסמכים"
          icon={FileText}
          totalValue={0}
          itemCount={documents.length}
          onAddClick={() => setIsUploadModalOpen(true)}
        />

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חפש מסמכים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            אין מסמכים להצגה
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc, index) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground">{getCategoryLabel(doc.category)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">סוג:</span>
                      <span className="font-medium">{doc.type}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">גודל:</span>
                      <span className="font-medium">{doc.size}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">תאריך העלאה:</span>
                      <span className="font-medium">{formatDate(doc.uploadDate)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 ml-2" />
                      הורד
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default DocumentsPage;
