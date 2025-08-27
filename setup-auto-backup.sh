#!/bin/bash

# Crontab Kurulum Scripti - Her 2 dakikada backup

echo "🔧 Otomatik Backup Sistemi Kuruluyor..."

# Auto backup script'ini VPS'e kopyala
chmod +x /opt/canta-management/auto-backup.sh

# Mevcut crontab'ı yedekle
crontab -l > /opt/canta-management/crontab_backup.txt 2>/dev/null || echo "# Yeni crontab" > /opt/canta-management/crontab_backup.txt

# Yeni crontab oluştur
cat > /opt/canta-management/new_crontab.txt << EOF
# Otomatik Database Backup - Her 2 dakikada bir
*/2 * * * * /opt/canta-management/auto-backup.sh >> /opt/canta-management/backup.log 2>&1

# SSL sertifika yenileme (mevcut)
0 12 * * * certbot renew --quiet && systemctl reload nginx

# Günlük manuel backup (güvenlik)
0 2 * * * cp /opt/canta-management/data/production.db /opt/canta-management/backups/daily_\$(date +\%Y\%m\%d).db
EOF

# Crontab'ı aktifleştir
crontab /opt/canta-management/new_crontab.txt

echo "✅ Crontab kuruldu - Her 2 dakikada backup alınacak!"
echo "📋 Log dosyası: /opt/canta-management/backup.log"
echo "📁 Backup klasörü: /opt/canta-management/backups/"

# İlk backup'ı manuel al
/opt/canta-management/auto-backup.sh

echo "🎉 Sistem hazır!"
