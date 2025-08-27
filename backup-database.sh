#!/bin/bash

# VPS Database Backup Script
# Her gün otomatik çalışacak

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/canta-management/backups"
DB_FILE="/opt/canta-management/data/production.db"

# Backup klasörü oluştur
mkdir -p $BACKUP_DIR

# Database backup al
cp $DB_FILE $BACKUP_DIR/production_backup_$DATE.db

# 30 günden eski backupları sil
find $BACKUP_DIR -name "*.db" -mtime +30 -delete

echo "✅ Database backup completed: production_backup_$DATE.db"
