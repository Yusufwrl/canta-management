#!/bin/bash

echo "🚀 Production Build Başlatılıyor..."

# 1. Dependencies install
echo "📦 Dependencies yükleniyor..."
npm install

# 2. Prisma generate
echo "🗄️ Database schema oluşturuluyor..."
npx prisma generate

# 3. Build process
echo "🔨 Production build oluşturuluyor..."
npm run build

# 4. Database migration (if needed)
echo "📊 Database migration..."
npx prisma db push

echo "✅ Build tamamlandı!"
echo "🌐 Hosting'e yüklemek için .next klasörünü ve diğer dosyaları upload edin"
