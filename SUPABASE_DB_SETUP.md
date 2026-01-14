# הוראות ליצירת הטבלאות ב-Supabase

## שלב 1: פתיחת SQL Editor ב-Supabase

1. כנס ל-Supabase Dashboard: https://supabase.com/dashboard
2. בחר את הפרויקט שלך
3. בתפריט הצד, לחץ על **SQL Editor**

## שלב 2: הרצת Schema הראשי

1. לחץ על **"New Query"**
2. העתק והדבק את התוכן המלא מקובץ `supabase/schema.sql`
3. לחץ על **Run** (או Ctrl+Enter)

## שלב 3: הגדרת RLS Policies

1. צור שאילתה חדשה
2. העתק והדבק את התוכן מקובץ `supabase/rls_policies.sql`
3. לחץ על **Run**

## שלב 4: וידוא שהטבלאות נוצרו

בודק אם הטבלאות נוצרו:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';
```

אמור לראות:
- financial_items
- alerts
- documents
- user_permissions
- pending_invitations

## שלב 5: בדיקת RLS

וודא שהמדיניות פעילה:

```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

כל השורות אמורות להיות `true` בעמודה `rowsecurity`.

## שלב 6 (אופציונלי): הוספת נתונים לדוגמא

```sql
-- הוסף פריט לדוגמא (החלף YOUR_USER_ID ב-UUID שלך)
INSERT INTO financial_items (user_id, name, institution, category, value, status)
VALUES (
  auth.uid(), -- זה ישתמש אוטומטית ב-ID שלך
  'חשבון בנק',
  'בנק הפועלים',
  'finance',
  10000,
  'active'
);
```

## פתרון בעיות

אם קיבלת שגיאה "could not find the table":
1. וודא שהרצת את `schema.sql` בהצלחה
2. רענן את הדף
3. בדוק שאתה מחובר למסד הנתונים הנכון

אם קיבלת שגיאת הרשאות:
1. וודא שהרצת את `rls_policies.sql`
2. בדוק ב-SQL Editor:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'financial_items';
   ```

## קבלת ה-User ID שלך

```sql
SELECT auth.uid();
```

זה יחזיר את ה-UUID שלך.
