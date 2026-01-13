Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  המרכז הפיננסי - הפעלת המערכת" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "[אזהרה] קובץ .env.local לא נמצא!" -ForegroundColor Yellow
    Write-Host "אנא צור את הקובץ עם ה-credentials של Supabase" -ForegroundColor Yellow
    Write-Host "ראה README_SETUP.md להוראות" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "לחץ Enter להמשך בכל זאת"
}

Write-Host "[1/2] בודק תלויות..." -ForegroundColor Green
npm install

Write-Host ""
Write-Host "[2/2] מפעיל שרת פיתוח..." -ForegroundColor Green
Write-Host "המערכת תרוץ על: http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "לחץ Ctrl+C כדי לעצור" -ForegroundColor Yellow
Write-Host ""

npm run dev





