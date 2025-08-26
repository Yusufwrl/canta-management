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

# Nginx ve MySQL kurulumu
echo "🌐 Nginx ve MySQL kuruluyor..."
apt install -y nginx mysql-server git

# Nginx başlat
systemctl start nginx
systemctl enable nginx

# MySQL güvenlik ayarları
echo "🔒 MySQL güvenlik ayarları yapılıyor..."
echo "Root şifre: canta_db_2025!"
echo "Tüm sorulara Y cevabı verin!"
mysql_secure_installation

# Veritabanı oluşturma
echo "💾 Veritabanı oluşturuluyor..."
mysql -u root -p -e "
CREATE DATABASE canta_management;
CREATE USER 'canta_user'@'localhost' IDENTIFIED BY 'canta_pass_2025!';
GRANT ALL PRIVILEGES ON canta_management.* TO 'canta_user'@'localhost';
FLUSH PRIVILEGES;
"

# Projeyi indirme
echo "📥 Proje indiriliyor..."
cd /var/www
git clone https://github.com/Yusufwrl/canta-management.git
cd canta-management

# Environment dosyası oluşturma
echo "⚙️ Environment dosyası oluşturuluyor..."
cat > .env << EOF
DATABASE_URL="mysql://canta_user:canta_pass_2025!@localhost:3306/canta_management"
NEXTAUTH_SECRET="super_secret_key_2025"
NEXTAUTH_URL="http://37.148.213.90"
NODE_ENV="production"
EOF

# Paket kurulumu ve build
echo "📦 Paketler kuruluyor..."
npm install

echo "🏗️ Prisma ayarları..."
npx prisma generate
npx prisma db push

echo "🔨 Proje build ediliyor..."
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
echo "systemctl status mysql"
echo ""
echo "Log dosyalarını görüntülemek için:"
echo "pm2 logs"
echo "tail -f /var/log/nginx/error.log"
