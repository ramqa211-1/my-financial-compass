import OpenAI from 'openai';
import { FinancialItem, Alert, Document } from '@/contexts/AppContext';

// Initialize OpenAI client
const getOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file.');
  }
  
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // Only for client-side usage
  });
};

/**
 * Format financial data for AI context
 */
const formatFinancialData = (items: FinancialItem[], alerts: Alert[], documents: Document[]): string => {
  let context = 'נתונים פיננסיים של המשתמש:\n\n';
  
  // Financial Items
  if (items.length > 0) {
    context += 'פריטים פיננסיים:\n';
    items.forEach(item => {
      context += `- ${item.name} (${item.institution}): ${item.category}, ערך: ₪${item.value.toLocaleString()}`;
      if (item.expiryDate) {
        context += `, תאריך פקיעה: ${item.expiryDate}`;
      }
      context += '\n';
    });
    context += '\n';
  }
  
  // Alerts
  if (alerts.length > 0) {
    context += 'התראות:\n';
    alerts.filter(a => !a.read).forEach(alert => {
      context += `- ${alert.title}: ${alert.description} (${alert.date})\n`;
    });
    context += '\n';
  }
  
  // Documents
  if (documents.length > 0) {
    context += 'מסמכים:\n';
    documents.forEach(doc => {
      context += `- ${doc.name} (${doc.category})\n`;
    });
  }
  
  return context;
};

/**
 * Get AI response using OpenAI GPT-4o-mini with RAG
 */
export const getAIResponseWithOpenAI = async (
  query: string,
  items: FinancialItem[],
  alerts: Alert[],
  documents: Document[]
): Promise<string> => {
  try {
    const client = getOpenAIClient();
    const context = formatFinancialData(items, alerts, documents);
    
    const systemPrompt = `אתה עוזר פיננסי אישי חכם. אתה עוזר למשתמש לנהל את הכספים, הביטוחים וההשקעות שלו.

חוקים חשובים:
1. תשובה רק על בסיס הנתונים שסופקו לך - אל תמציא מידע
2. אם אין מידע במערכת, אמור זאת בבירור
3. תשובות בעברית, ברורות וקצרות
4. השתמש בפורמט מספרים ישראלי (₪)
5. אם יש תאריכי פקיעה, ציין אותם

נתוני המשתמש:
${context}`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini', // המודל הזול ביותר
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: query,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }
    
    return response;
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    // Fallback to basic response if API fails
    if (error.message?.includes('API key')) {
      throw new Error('OpenAI API key לא הוגדר. אנא הוסף VITE_OPENAI_API_KEY ל-.env');
    }
    
    throw new Error(`שגיאה בחיבור ל-OpenAI: ${error.message || 'שגיאה לא ידועה'}`);
  }
};

