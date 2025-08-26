@echo off
echo 🚀 Production Build Başlatılıyor...

REM 1. Dependencies install
echo 📦 Dependencies yükleniyor...
call npm install

REM 2. Prisma generate
echo 🗄️ Database schema oluşturuluyor...
call npx prisma generate

REM 3. Build process
echo 🔨 Production build oluşturuluyor...
call npm run build

REM 4. Database migration (if needed)
echo 📊 Database migration...
call npx prisma db push

echo ✅ Build tamamlandı!
echo 🌐 Hosting'e yüklemek için .next klasörünü ve diğer dosyaları upload edin
pause
