import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageSquare, Bot, User, Loader2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAIResponseWithOpenAI } from "@/services/openaiService";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

// Fallback AI responses based on keywords (used when OpenAI is not available)
const getAIResponse = async (query: string, items: any[], alerts: any[], documents: any[]): Promise<string> => {
  const q = query.toLowerCase();
  
  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL');
  };
  
  // Car insurance query
  if (q.includes("ביטוח רכב") || q.includes("רכב")) {
    const carInsurance = items.find(i => 
      i.productType?.toLowerCase().includes("רכב") || 
      i.name?.toLowerCase().includes("רכב") ||
      (i.category === "insurance" && (i.name?.toLowerCase().includes("רכב") || i.productType?.toLowerCase().includes("רכב")))
    );
    if (carInsurance) {
      const expiryInfo = carInsurance.expiryDate 
        ? ` תאריך חידוש: ${formatDate(carInsurance.expiryDate)}.`
        : '';
      return `ביטוח הרכב שלך הוא דרך ${carInsurance.institution}, בעלות שנתית של ${formatCurrency(carInsurance.value)}.${expiryInfo}`;
    }
    return "לא מצאתי מידע על ביטוח רכב במערכת שלך. אם יש לך ביטוח רכב, אנא הוסף אותו למערכת.";
  }
  
  // Passport query - check documents
  if (q.includes("דרכון") || q.includes("תוקף")) {
    const passport = documents.find(d => 
      d.name?.toLowerCase().includes("דרכון") || 
      d.category === "documents"
    );
    if (passport) {
      // Check alerts for passport expiry
      const passportAlert = alerts.find(a => 
        a.category === "document" && 
        a.title?.toLowerCase().includes("דרכון")
      );
      if (passportAlert) {
        return `לפי ההתראות במערכת: ${passportAlert.description}. ${passportAlert.date ? `תאריך: ${passportAlert.date}` : ''}`;
      }
      return `יש לך מסמך דרכון במערכת (${passport.name}). לפרטים נוספים על תאריך פקיעה, אנא בדוק את המסמך או הוסף התראה.`;
    }
    return "לא מצאתי מידע על דרכון במערכת שלך. אם יש לך דרכון, אנא העלה את המסמך או הוסף התראה על תאריך פקיעה.";
  }
  
  // Pension/Investments query
  if (q.includes("פנסיה") || q.includes("קרן השתלמות") || q.includes("השקעות")) {
    const investments = items.filter(i => i.category === "investments");
    if (investments.length > 0) {
      const total = investments.reduce((s, i) => s + i.value, 0);
      const details = investments.map(i => `${i.name} (${i.institution}): ${formatCurrency(i.value)}`).join('\n');
      return `סך ההשקעות לטווח ארוך שלך: ${formatCurrency(total)}.\n\nפירוט:\n${details}`;
    }
    return "לא מצאתי מידע על השקעות לטווח ארוך במערכת שלך.";
  }
  
  // Insurance total query
  if (q.includes("כמה") && (q.includes("ביטוח") || q.includes("משלם") || q.includes("ביטוחים"))) {
    const insuranceItems = items.filter(i => i.category === "insurance");
    if (insuranceItems.length > 0) {
      const total = insuranceItems.reduce((s, i) => s + i.value, 0);
      const details = insuranceItems.map(i => `${i.name} (${i.institution}): ${formatCurrency(i.value)}`).join('\n');
      return `סך ההוצאות השנתיות על ביטוחים: ${formatCurrency(total)}.\n\nפירוט:\n${details}`;
    }
    return "לא מצאתי מידע על ביטוחים במערכת שלך.";
  }
  
  // Net worth query
  if (q.includes("הון") || q.includes("שווי") || q.includes("כסף") || q.includes("נכסים")) {
    if (items.length > 0) {
      const total = items.reduce((s, i) => s + i.value, 0);
      const byCategory = items.reduce((acc, i) => {
        acc[i.category] = (acc[i.category] || 0) + i.value;
        return acc;
      }, {} as Record<string, number>);
      
      const breakdown = Object.entries(byCategory)
        .map(([cat, val]) => {
          const catNames: Record<string, string> = {
            finance: 'כספים ונזילות',
            insurance: 'ביטוחים',
            investments: 'השקעות',
            assets: 'נכסים ונדל"ן',
          };
          return `${catNames[cat] || cat}: ${formatCurrency(val)}`;
        })
        .join('\n');
      
      return `סך ההון העצמי הכולל שלך: ${formatCurrency(total)}.\n\nפירוט לפי קטגוריות:\n${breakdown}`;
    }
    return "לא מצאתי מידע על נכסים במערכת שלך.";
  }
  
  // Expiry dates query
  if (q.includes("מתי") && (q.includes("פג") || q.includes("חידוש") || q.includes("תוקף"))) {
    const itemsWithExpiry = items.filter(i => i.expiryDate);
    const alertsAboutExpiry = alerts.filter(a => a.type === "urgent" || a.type === "warning");
    
    if (itemsWithExpiry.length > 0 || alertsAboutExpiry.length > 0) {
      let response = "תאריכי פקיעה/חידוש קרובים:\n\n";
      
      if (alertsAboutExpiry.length > 0) {
        response += "התראות:\n";
        alertsAboutExpiry.forEach(a => {
          response += `• ${a.title}: ${a.description} (${a.date})\n`;
        });
        response += "\n";
      }
      
      if (itemsWithExpiry.length > 0) {
        response += "פריטים עם תאריך פקיעה:\n";
        itemsWithExpiry.forEach(i => {
          response += `• ${i.name}: ${formatDate(i.expiryDate!)}\n`;
        });
      }
      
      return response;
    }
    return "לא מצאתי פריטים עם תאריכי פקיעה קרובים במערכת שלך.";
  }
  
  // Default response - only based on available data
  const itemCount = items.length;
  const alertCount = alerts.filter(a => !a.read).length;
  
  if (itemCount === 0) {
    return "אין לי מידע במערכת שלך כרגע. אנא הוסף פריטים, ביטוחים או השקעות כדי שאוכל לעזור לך.";
  }
  
  return `אני יכול לעזור לך עם מידע על ${itemCount} פריטים במערכת שלך${alertCount > 0 ? ` ו-${alertCount} התראות לא נקראו` : ''}.\n\nנסה לשאול שאלות כמו:\n• "כמה אני משלם על ביטוחים?"\n• "מה ההון העצמי שלי?"\n• "מתי פג תוקף הדרכון?"\n• "מה ההשקעות שלי?"`;
};

const ChatPanel = () => {
  const { isChatOpen, setIsChatOpen, items, alerts, documents } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "שלום! אני הבוט החכם שלך 🤖 אני יכול לעזור לך למצוא מידע על הנכסים והביטוחים שלך. מה תרצה לדעת?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // Try OpenAI first if API key is available
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      let response: string;
      if (apiKey) {
        // Use OpenAI with RAG
        response = await getAIResponseWithOpenAI(userInput, items, alerts, documents);
      } else {
        // Fallback to basic keyword-based response
        response = await getAIResponse(userInput, items, alerts, documents);
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Error getting AI response:', error);
      
      // Try fallback if OpenAI fails
      try {
        const fallbackResponse = await getAIResponse(userInput, items, alerts, documents);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: fallbackResponse,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      } catch (fallbackError) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: error.message || "מצטער, אירעה שגיאה. אנא נסה שוב.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-4 left-4 z-50 bg-card rounded-2xl shadow-strong w-96 max-w-[calc(100vw-2rem)] h-[500px] max-h-[70vh] flex flex-col overflow-hidden sm:bottom-4 sm:left-4 sm:w-96 sm:h-[500px] sm:max-h-[70vh] sm:rounded-2xl"
        >
          {/* Header */}
          <div className="p-4 border-b border-border bg-gradient-to-l from-primary to-primary/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-card/20 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-card" />
                </div>
                <div>
                  <h3 className="font-semibold text-card">הצ'אט החכם</h3>
                  <p className="text-xs text-card/80">מבוסס על הנתונים שלך</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-2 rounded-xl hover:bg-card/20 transition-colors"
              >
                <X className="h-5 w-5 text-card" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === "user" ? "bg-secondary" : "bg-primary"
                }`}>
                  {message.sender === "user" ? (
                    <User className="h-4 w-4 text-secondary-foreground" />
                  ) : (
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  )}
                </div>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  message.sender === "user" 
                    ? "bg-secondary text-secondary-foreground rounded-br-md" 
                    : "bg-muted text-foreground rounded-bl-md"
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="שאל אותי משהו..."
                className="flex-1"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatPanel;
