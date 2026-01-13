# הוראות הגדרת Supabase

## 1. קבלת Credentials

1. היכנס לדאשבורד Supabase: https://supabase.com/dashboard/project/izlvawbrctdirjbbdqmj
2. לך ל-Settings > API
3. העתק את:
   - **Project URL** (VITE_SUPABASE_URL)
   - **anon/public key** (VITE_SUPABASE_ANON_KEY)

## 2. יצירת .env.local

צור קובץ `.env.local` בתיקיית הפרויקט עם התוכן הבא:

```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 3. יצירת Database Schema

1. היכנס ל-Supabase Dashboard
2. לך ל-SQL Editor
3. הפעל את הקובץ `supabase/schema.sql` - זה ייצור את כל הטבלאות
4. הפעל את הקובץ `supabase/rls_policies.sql` - זה יגדיר את Row Level Security

## 4. יצירת Storage Bucket למסמכים

1. לך ל-Storage ב-Supabase Dashboard
2. צור bucket חדש בשם `documents`
3. הגדר את ה-bucket כ-Public (או Private עם policies מתאימות)
4. הוסף RLS policies ל-Storage אם צריך

## 5. בדיקת החיבור

לאחר הגדרת הכל, הפעל את האפליקציה:
```bash
npm run dev
```

האפליקציה תעבוד עם נתונים מקומיים עד שתתחבר עם Google OAuth.

