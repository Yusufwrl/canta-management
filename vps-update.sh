#!/bin/bash

echo "🔄 Çanta Management System - VPS Update Script"
echo "==============================================="

# VPS'te proje klasörüne git
cd /var/www/canta-management

echo "🔽 Git'ten son değişiklikleri çekiliyor..."
git pull origin main

echo "📦 Node modules güncelleniyor..."
npm install

echo "🏗️ Prisma güncelleniyor..."
npx prisma generate
npx prisma db push

echo "🔨 Proje yeniden build ediliyor..."
npm run build

echo "🔒 Klasör izinleri ayarlanıyor..."
chown -R www-data:www-data /opt/canta-management
chmod -R 755 /opt/canta-management

echo "🚀 PM2 restart ediliyor..."
pm2 restart canta-management

echo "🌐 Nginx reload ediliyor..."
systemctl reload nginx

echo ""
echo "✅ Güncelleme tamamlandı!"
echo "========================"
echo "Durum kontrolü:"
echo "pm2 status"
echo "pm2 logs canta-management --lines 50"
