import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageSquare, Bot, User } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

// Simulated AI responses based on keywords
const getAIResponse = (query: string, items: any[]): string => {
  const q = query.toLowerCase();
  
  if (q.includes("ביטוח רכב") || q.includes("רכב")) {
    const carInsurance = items.find(i => i.productType?.includes("רכב"));
    if (carInsurance) {
      return `ביטוח הרכב שלך הוא דרך ${carInsurance.institution}, בעלות שנתית של ₪${carInsurance.value.toLocaleString()}. תאריך החידוש הקרוב: 26/01/2026.`;
    }
    return "לא מצאתי מידע על ביטוח רכב במערכת.";
  }
  
  if (q.includes("דרכון") || q.includes("תוקף")) {
    return "הדרכון שלך יפוג ב-12/04/2026. מומלץ להתחיל בתהליך החידוש לפחות 3 חודשים מראש.";
  }
  
  if (q.includes("פנסיה") || q.includes("קרן השתלמות")) {
    const pension = items.find(i => i.category === "investments");
    if (pension) {
      const total = items.filter(i => i.category === "investments").reduce((s, i) => s + i.value, 0);
      return `סך ההשקעות לטווח ארוך שלך: ₪${total.toLocaleString()}. זה כולל פנסיה וקרן השתלמות.`;
    }
    return "לא מצאתי מידע על חסכונות פנסיוניים.";
  }
  
  if (q.includes("כמה") && (q.includes("ביטוח") || q.includes("משלם"))) {
    const insuranceTotal = items.filter(i => i.category === "insurance").reduce((s, i) => s + i.value, 0);
    return `סך ההוצאות השנתיות על ביטוחים: ₪${insuranceTotal.toLocaleString()}.`;
  }
  
  if (q.includes("הון") || q.includes("שווי") || q.includes("כסף")) {
    const total = items.reduce((s, i) => s + i.value, 0);
    return `סך ההון העצמי הכולל שלך: ₪${total.toLocaleString()}.`;
  }
  
  return "אני יכול לעזור לך עם מידע על הנכסים, הביטוחים וההשקעות שלך. נסה לשאול שאלה ספציפית כמו 'כמה אני משלם על ביטוחים?' או 'מתי פג תוקף הדרכון?'";
};

const ChatPanel = () => {
  const { isChatOpen, setIsChatOpen, items } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "שלום! אני הבוט החכם שלך 🤖 אני יכול לעזור לך למצוא מידע על הנכסים והביטוחים שלך. מה תרצה לדעת?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simulate AI response delay
    setTimeout(() => {
      const response = getAIResponse(input, items);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    }, 800);
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-4 left-4 z-50 bg-card rounded-2xl shadow-strong w-96 max-w-[calc(100vw-2rem)] h-[500px] max-h-[70vh] flex flex-col overflow-hidden"
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
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatPanel;
