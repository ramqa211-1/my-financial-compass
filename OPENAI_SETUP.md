# הגדרת OpenAI API לצ'אט החכם

## הוספת API Key

1. קבל API Key מ-OpenAI:
   - היכנס ל: https://platform.openai.com/api-keys
   - צור API Key חדש

2. הוסף את ה-Key לקובץ `.env` או `.env.local`:
   ```
   VITE_OPENAI_API_KEY=sk-your-api-key-here
   ```

3. הפעל מחדש את שרת הפיתוח:
   ```bash
   npm run dev
   ```

## מודל בשימוש

המערכת משתמשת ב-**GPT-4o-mini** - המודל הזול ביותר של OpenAI:
- עלות: ~$0.15 לכל מיליון tokens input
- מהיר ויעיל
- מתאים לשאילתות פיננסיות פשוטות

## איך זה עובד

1. **RAG (Retrieval Augmented Generation)**: המערכת שולחת את כל הנתונים הפיננסיים שלך ל-OpenAI יחד עם השאלה
2. **מניעת Hallucinations**: ה-AI מקבל הוראה ברורה לענות רק על בסיס הנתונים שסופקו
3. **Fallback**: אם OpenAI לא זמין, המערכת משתמשת במערכת keywords בסיסית

## הערות אבטחה

⚠️ **חשוב**: ה-API Key נשלח מהדפדפן (client-side). 
- זה בסדר לפיתוח
- ל-production, מומלץ להשתמש ב-backend proxy

## עלויות משוערות

- שאילתה ממוצעת: ~500 tokens
- 1000 שאילתות ≈ $0.075
- חודש עם 10,000 שאילתות ≈ $0.75

---

**המערכת תעבוד גם בלי OpenAI** - היא תשתמש במערכת keywords בסיסית.





