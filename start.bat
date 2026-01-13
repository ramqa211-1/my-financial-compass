@echo off
echo ========================================
echo   המרכז הפיננסי - הפעלת המערכת
echo ========================================
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo [אזהרה] קובץ .env.local לא נמצא!
    echo אנא צור את הקובץ עם ה-credentials של Supabase
    echo ראה README_SETUP.md להוראות
    echo.
    pause
)

echo [1/2] בודק תלויות...
call npm install

echo.
echo [2/2] מפעיל שרת פיתוח...
echo המערכת תרוץ על: http://localhost:8080
echo.
echo לחץ Ctrl+C כדי לעצור
echo.

call npm run dev

pause





