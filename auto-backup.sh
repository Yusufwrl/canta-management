#!/bin/bash

# Otomatik Database Backup - Her 2 dakikada bir
# VPS'te /opt/canta-management/ klasöründe çalışacak

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
SOURCE_DB="/opt/canta-management/data/production.db"
BACKUP_DIR="/opt/canta-management/backups/auto"

# Backup klasörü oluştur
mkdir -p "$BACKUP_DIR"

# Database backup al (sadece değişiklik varsa)
if [ -f "$SOURCE_DB" ]; then
    # Son backup ile karşılaştır
    LAST_BACKUP=$(ls -t "$BACKUP_DIR"/*.db 2>/dev/null | head -1)
    
    if [ ! -f "$LAST_BACKUP" ] || ! cmp -s "$SOURCE_DB" "$LAST_BACKUP"; then
        # Farklıysa backup al
        cp "$SOURCE_DB" "$BACKUP_DIR/db_${TIMESTAMP}.db"
        echo "[$(date)] ✅ Database backup alındı: db_${TIMESTAMP}.db"
        
        # 1 saatten eski auto backup'ları sil (disk alanı için)
        find "$BACKUP_DIR" -name "db_*.db" -mmin +60 -delete
    else
        echo "[$(date)] ℹ️ Database değişmemiş, backup atlandı"
    fi
else
    echo "[$(date)] ❌ Database dosyası bulunamadı: $SOURCE_DB"
fi
