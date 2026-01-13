import { FinancialItem } from "@/contexts/AppContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Building2 } from "lucide-react";

interface ItemsTableProps {
  items: FinancialItem[];
}

const ItemsTable = ({ items }: ItemsTableProps) => {
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

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        אין פריטים להצגה
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>שם הפריט</TableHead>
            <TableHead>מוסד</TableHead>
            <TableHead>סוג מוצר</TableHead>
            <TableHead>תת-קטגוריה</TableHead>
            <TableHead className="text-left">ערך</TableHead>
            <TableHead>סטטוס</TableHead>
            <TableHead>תאריך עדכון</TableHead>
            <TableHead>תאריך תפוגה</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {item.institution}
                </div>
              </TableCell>
              <TableCell>{item.productType}</TableCell>
              <TableCell>{item.subcategory || '-'}</TableCell>
              <TableCell className="text-left font-semibold">{formatCurrency(item.value)}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(item.status)}>
                  {getStatusLabel(item.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {formatDate(item.lastUpdated)}
                </div>
              </TableCell>
              <TableCell>
                {item.expiryDate ? formatDate(item.expiryDate) : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ItemsTable;
