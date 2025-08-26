# VPS Deployment Rehberi

## VPS Bilgileri
- **IP**: 37.148.213.90
- **Kullanıcı**: root
- **Şifre**: VkOlEi7IOu1Vd8#
- **Panel Şifresi**: Zh9#Zu4Av2lOw1#
- **Sistem**: Ubuntu 20.04

## Adım 1: SSH Bağlantısı
Windows PowerShell'de şu komutu çalıştırın:
```bash
ssh root@37.148.213.90
```
Şifre: `VkOlEi7IOu1Vd8#`

Host key onayı istendiğinde `yes` yazın.

## Adım 2: Sunucu Güncellemesi
```bash
apt update && apt upgrade -y
```

## Adım 3: Node.js Kurulumu
```bash
# Node.js 20.x kurulumu
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# Versiyonları kontrol et
node --version
npm --version
```

## Adım 4: PM2 Kurulumu
```bash
npm install -g pm2
```

## Adım 5: Nginx Kurulumu
```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

## Adım 6: MySQL Kurulumu
```bash
apt install -y mysql-server
mysql_secure_installation
```

MySQL setup sırasında:
- Root şifre: `canta_db_2025!`
- Remove anonymous users: Y
- Disallow root login remotely: N
- Remove test database: Y
- Reload privilege tables: Y

## Adım 7: Veritabanı Oluşturma
```bash
mysql -u root -p
```
Şifre: `canta_db_2025!`

MySQL'de:
```sql
CREATE DATABASE canta_management;
CREATE USER 'canta_user'@'localhost' IDENTIFIED BY 'canta_pass_2025!';
GRANT ALL PRIVILEGES ON canta_management.* TO 'canta_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Adım 8: Git Kurulumu
```bash
apt install -y git
```

## Adım 9: Proje Klonlama
Projemizi sunucuya göndermek için önce GitHub'a push edeceğiz.

## Sonraki Adımlar
Bu adımları tamamladıktan sonra bana bildirin, deployment scriptini çalıştıracağız.
