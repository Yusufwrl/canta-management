@echo off
echo VPS'e baglaniyor ve guncelleme yapiliyor...
echo.

ssh root@37.148.213.90 "
echo '🔄 VPS güncelleme başlıyor...'
cd /var/www/canta-management

echo '🔽 Git güncellemesi...'
git pull origin main

echo '📦 NPM paketleri...'
npm install

echo '🏗️ Prisma setup...'
npx prisma generate
npx prisma db push

echo '🔨 Build işlemi...'
npm run build

echo '🔒 İzinler ayarlanıyor...'
chown -R www-data:www-data /opt/canta-management
chmod -R 755 /opt/canta-management

echo '🚀 PM2 restart...'
pm2 restart canta-management

echo '🌐 Nginx reload...'
systemctl reload nginx

echo '✅ Güncelleme tamamlandı!'
echo 'Site: http://37.148.213.90'
pm2 status
"

pause
