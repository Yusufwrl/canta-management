# 🚀 VPS Deployment Talimatları

## 📋 Önemli Bilgiler
Aşağıdaki bilgileri saklayın:

### VPS Erişim Bilgileri
- **IP**: 37.148.213.90
- **Kullanıcı**: root
- **SSH Şifresi**: VkOlEi7IOu1Vd8#
- **Panel Şifresi**: Zh9#Zu4Av2lOw1#

### Veritabanı Bilgileri
- **MySQL Root Şifresi**: canta_db_2025!
- **Veritabanı Adı**: canta_management
- **Kullanıcı**: canta_user
- **Şifre**: canta_pass_2025!

---

## 🔄 Adım 1: GitHub Repository Oluşturma

1. GitHub'a gidin: https://github.com/new
2. Repository name: `canta-management`
3. Description: `Çanta Yönetim Sistemi`
4. Public/Private seçin (önerim: Private)
5. **Create repository** tıklayın

### Proje GitHub'a Yükleme
```bash
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/canta-management.git
git push -u origin main
```

---

## 🖥️ Adım 2: VPS Sunucu Kurulumu

### SSH Bağlantısı
```bash
ssh root@37.148.213.90
```
**Şifre**: `VkOlEi7IOu1Vd8#`

### Sistem Güncellemesi
```bash
apt update && apt upgrade -y
```

### Node.js 20.x Kurulumu
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs
node --version
npm --version
```

### PM2 Process Manager
```bash
npm install -g pm2
```

### Nginx Web Server
```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

### MySQL Veritabanı
```bash
apt install -y mysql-server
mysql_secure_installation
```

**MySQL Kurulum Ayarları:**
- Root password: `canta_db_2025!`
- Remove anonymous users: `Y`
- Disallow root login remotely: `N`
- Remove test database: `Y`
- Reload privilege tables: `Y`

### Veritabanı Oluşturma
```bash
mysql -u root -p
```
Şifre: `canta_db_2025!`

MySQL'de şu komutları çalıştırın:
```sql
CREATE DATABASE canta_management;
CREATE USER 'canta_user'@'localhost' IDENTIFIED BY 'canta_pass_2025!';
GRANT ALL PRIVILEGES ON canta_management.* TO 'canta_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 📂 Adım 3: Proje Deployment

### Git ve Proje İndirme
```bash
apt install -y git
cd /var/www
git clone https://github.com/KULLANICI_ADINIZ/canta-management.git
cd canta-management
```

### Environment Dosyası
```bash
cp .env.example .env
nano .env
```

.env dosyasına şunları yazın:
```
DATABASE_URL="mysql://canta_user:canta_pass_2025!@localhost:3306/canta_management"
NEXTAUTH_SECRET="super_secret_key_2025"
NEXTAUTH_URL="http://37.148.213.90"
NODE_ENV="production"
```

### Paket Kurulumu ve Build
```bash
npm install
npx prisma generate
npx prisma db push
npm run build
```

### PM2 ile Çalıştırma
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Nginx Konfigürasyonu
```bash
cp nginx.conf /etc/nginx/sites-available/canta-management
ln -s /etc/nginx/sites-available/canta-management /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

---

## 🌐 Adım 4: Test ve Kontrol

### Servis Durumları
```bash
pm2 status
systemctl status nginx
systemctl status mysql
```

### Log Kontrolleri
```bash
pm2 logs
tail -f /var/log/nginx/error.log
```

### Firewall (İsteğe bağlı)
```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

---

## ✅ Sonuç
Tüm adımlar tamamlandığında siteniz şu adreslerden erişilebilir olacak:
- http://37.148.213.90
- http://xcloud97842 (sunucu hostname'i)

---

## 🔧 Sorun Giderme

### Yaygın Hatalar
1. **Port 3000 erişim sorunu**: Nginx konfigürasyonunu kontrol edin
2. **Veritabanı bağlantı hatası**: .env dosyasını kontrol edin
3. **Build hatası**: `npm install` tekrar çalıştırın

### Faydalı Komutlar
```bash
# PM2 restart
pm2 restart all

# Nginx restart
systemctl restart nginx

# MySQL restart
systemctl restart mysql

# Logları görüntüleme
pm2 logs --lines 100
```

---

## 📞 Destek
Herhangi bir sorun yaşarsanız, aşağıdaki adımları takip edin:
1. Hata mesajını kaydedin
2. İlgili log dosyalarını kontrol edin
3. Yardım için bana ulaşın

**Not**: Tüm şifreler ve erişim bilgilerini güvenli bir yerde saklayın!
