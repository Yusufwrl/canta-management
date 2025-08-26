#!/bin/bash

# VPS Deployment Script
# Bu script VPS'te çalıştırılacak

echo "🚀 Canta Management VPS Deployment başlıyor..."

# 1. Sistem güncellemeleri
sudo apt update && sudo apt upgrade -y

# 2. Node.js kurulumu (Node.js 18.x)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. PM2 kurulumu
sudo npm install pm2@latest -g

# 4. MySQL kurulumu
sudo apt install mysql-server -y
sudo systemctl start mysql
sudo systemctl enable mysql

# 5. Nginx kurulumu
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# 6. Proje dizinini oluştur
sudo mkdir -p /var/www/canta-management
sudo chown -R $USER:$USER /var/www/canta-management

# 7. Proje dosyalarını buraya kopyala (manuel)
echo "📁 Proje dosyalarını /var/www/canta-management dizinine kopyalayın"

# 8. Dependencies yükle
cd /var/www/canta-management
npm install --production

# 9. Prisma setup (MySQL için)
npx prisma generate
npx prisma db push

# 10. Build oluştur
npm run build

# 11. PM2 ile başlat
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

echo "✅ Deployment tamamlandı!"
echo "🌐 Site: http://YOUR_VPS_IP:3000"
