# 🚀 התחלה מהירה - המרכז הפיננסי

## הפעלה מהירה

### שיטה 1: סקריפט אוטומטי (מומלץ)
**Windows:**
```bash
# לחץ כפול על הקובץ או הרץ:
start.bat
```

**PowerShell:**
```powershell
.\start.ps1
```

### שיטה 2: npm
```bash
npm run dev
```

### שיטה 3: npm start
```bash
npm start
```

---

## לפני ההפעלה הראשונה

### 1. התקנת תלויות (פעם אחת)
```bash
npm install
```

### 2. הגדרת Supabase (אופציונלי - המערכת עובדת גם בלי)
1. היכנס ל: https://supabase.com/dashboard/project/izlvawbrctdirjbbdqmj
2. לך ל-Settings > API
3. העתק:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`
4. עדכן את `.env.local`

**הערה:** המערכת תעבוד גם ללא Supabase עם נתונים מקומיים!

### 3. הגדרת OpenAI API (אופציונלי - לצ'אט חכם)
1. קבל API Key מ: https://platform.openai.com/api-keys
2. הוסף ל-`.env.local`:
   ```
   VITE_OPENAI_API_KEY=sk-your-key-here
   ```

**הערה:** המערכת תעבוד גם בלי OpenAI - היא תשתמש במערכת keywords בסיסית.

---

## גישה למערכת

לאחר ההפעלה, פתח בדפדפן:
```
http://localhost:8080
```

---

## פקודות שימושיות

```bash
# הפעלת שרת פיתוח
npm run dev

# בניית גרסת production
npm run build

# תצוגה מקדימה של build
npm run preview

# בדיקת קוד
npm run lint

# התקנת תלויות
npm install
```

---

## פתרון בעיות

### השרת לא מתחיל?
1. בדוק ש-port 8080 פנוי
2. הרץ `npm install` שוב
3. בדוק שיש לך Node.js מותקן (גרסה 18+)

### שגיאות Supabase?
- המערכת תעבוד גם בלי Supabase
- אם תרצה להשתמש ב-Supabase, ודא ש-`.env.local` מוגדר נכון

---

## מבנה הפרויקט

```
my-financial-compass/
├── start.bat          # סקריפט הרצה ל-Windows
├── start.ps1          # סקריפט הרצה ל-PowerShell
├── .env.local         # משתני סביבה (לא ב-git)
├── src/               # קוד המקור
│   ├── components/    # רכיבי React
│   ├── hooks/         # Custom hooks
│   ├── lib/           # ספריות (Supabase, GREEN API)
│   └── contexts/      # Context providers
└── supabase/          # SQL schemas
```

---

**בהצלחה! 🎉**

