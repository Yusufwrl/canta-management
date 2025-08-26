#!/bin/bash

echo "🚀 Çanta Management System - VPS Deployment Script"
echo "=================================================="

# Sistem güncellemesi
echo "📦 Sistem güncelleniyor..."
apt update && apt upgrade -y

# Node.js 20.x kurulumu
echo "🟢 Node.js kuruluyor..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# Versiyonları kontrol et
echo "✅ Node.js versiyonu:"
node --version
echo "✅ NPM versiyonu:"
npm --version

# PM2 kurulumu
echo "⚙️ PM2 kuruluyor..."
npm install -g pm2

# Nginx kurulumu
echo "🌐 Nginx kuruluyor..."
apt install -y nginx git

# Nginx başlat
systemctl start nginx
systemctl enable nginx

# Proje klasörlerini oluştur (SQLite için)
echo "📁 Proje klasörleri oluşturuluyor..."
mkdir -p /opt/canta-management
mkdir -p /opt/canta-management/data
mkdir -p /opt/canta-management/uploads
chmod 755 /opt/canta-management
chmod 755 /opt/canta-management/data
chmod 755 /opt/canta-management/uploads

# Projeyi indirme
echo "📥 Proje indiriliyor..."
cd /var/www
git clone https://github.com/YusufWrl/canta-management.git
cd canta-management

# Environment dosyası oluşturma (SQLite için)
echo "⚙️ Environment dosyası oluşturuluyor..."
cat > .env << EOF
DATABASE_URL="file:/opt/canta-management/data/production.db"
NEXTAUTH_SECRET="canta-management-vps-production-secret-2025"
NEXTAUTH_URL="http://37.148.213.90"
NODE_ENV="production"
UPLOAD_DIR="/opt/canta-management/uploads"
EOF

# Paket kurulumu ve build
echo "📦 Paketler kuruluyor..."
npm install

echo "🏗️ Prisma ayarları..."
npx prisma generate
npx prisma db push

# Veritabanına izinleri ayarla
echo "� Veritabanı izinleri ayarlanıyor..."
chown -R www-data:www-data /opt/canta-management
chmod -R 755 /opt/canta-management

echo "�🔨 Proje build ediliyor..."
npm run build

# PM2 ile çalıştırma
echo "🚀 Uygulama başlatılıyor..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Nginx konfigürasyonu
echo "🌐 Nginx ayarları yapılıyor..."
cp nginx.conf /etc/nginx/sites-available/canta-management
ln -s /etc/nginx/sites-available/canta-management /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# Firewall ayarları
echo "🔥 Firewall ayarları..."
ufw allow 22
ufw allow 80
ufw allow 443
echo "y" | ufw enable

echo ""
echo "🎉 DEPLOYMENT TAMAMLANDI! 🎉"
echo "================================"
echo "Siteniz şu adreslerde erişilebilir:"
echo "🌐 http://37.148.213.90"
echo "🌐 http://xcloud97842"
echo ""
echo "Servislerin durumunu kontrol etmek için:"
echo "pm2 status"
echo "systemctl status nginx"
echo ""
echo "Log dosyalarını görüntülemek için:"
echo "pm2 logs"
echo "tail -f /var/log/nginx/error.log"
echo ""
echo "Veritabanı konumu: /opt/canta-management/data/production.db"
