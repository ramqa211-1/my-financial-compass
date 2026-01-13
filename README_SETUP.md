# הוראות הגדרה - המרכז הפיננסי

## הגדרת Supabase

1. היכנס לדאשבורד: https://supabase.com/dashboard/project/izlvawbrctdirjbbdqmj
2. לך ל-Settings > API והעתק:
   - Project URL → `VITE_SUPABASE_URL`
   - anon/public key → `VITE_SUPABASE_ANON_KEY`
3. צור קובץ `.env.local` עם:
   ```
   VITE_SUPABASE_URL=your_url_here
   VITE_SUPABASE_ANON_KEY=your_key_here
   ```
4. הפעל את `supabase/schema.sql` ב-SQL Editor
5. הפעל את `supabase/rls_policies.sql` ב-SQL Editor

## הגדרת Google OAuth

1. צור פרויקט ב-Google Cloud Console
2. הפעל Google+ API
3. צור OAuth 2.0 Client ID
4. הוסף Redirect URI: `https://izlvawbrctdirjbbdqmj.supabase.co/auth/v1/callback`
5. ב-Supabase Dashboard: Authentication > Providers > Google
   - הוסף Client ID ו-Client Secret
   - שמור

## הגדרת GREEN API (WhatsApp)

1. היכנס ל-GREEN API Dashboard
2. קבל Instance ID ו-API Token
3. הוסף ל-`.env.local`:
   ```
   VITE_GREEN_API_INSTANCE_ID=your_instance_id
   VITE_GREEN_API_TOKEN=your_token
   ```
4. הגדר Webhook URL ב-GREEN API Dashboard:
   - URL: `https://your-domain.com/api/webhooks/whatsapp`
   - (דורש Supabase Edge Function או Express server)

## הרצת הפרויקט

```bash
npm install
npm run dev
```

האפליקציה תרוץ על http://localhost:8080

## הערות

- האפליקציה עובדת גם ללא התחברות (עם נתונים מקומיים)
- לאחר התחברות, הנתונים נשמרים ב-Supabase
- WhatsApp integration דורש הגדרת webhook server

