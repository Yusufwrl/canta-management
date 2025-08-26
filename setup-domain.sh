#!/bin/bash

# Domain Setup Script for Canta Management
# Bu script'i domain aldıktan sonra VPS'te çalıştırın

echo "🌐 Canta Management - Domain Setup"
echo "=================================="

# Domain adını kullanıcıdan al
read -p "Domain adınızı girin (örn: cantamdunyasi.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo "❌ Domain adı boş olamaz!"
    exit 1
fi

echo "🔍 Domain: $DOMAIN işlemi başlatılıyor..."

# 1. Certbot kurulumu (eğer yoksa)
echo "📦 Certbot kuruluyor..."
apt update
apt install -y certbot python3-certbot-nginx

# 2. Nginx konfigürasyonunu kopyala
echo "⚙️ Nginx konfigürasyonu hazırlanıyor..."
cp /opt/canta-management/nginx.domain.conf /etc/nginx/sites-available/$DOMAIN

# 3. Domain adını değiştir
sed -i "s/DOMAIN_NAME/$DOMAIN/g" /etc/nginx/sites-available/$DOMAIN

# 4. Geçici HTTP konfigürasyonu (SSL için)
cat > /etc/nginx/sites-available/$DOMAIN-temp << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# 5. Geçici konfigürasyonu aktifleştir
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-enabled/$DOMAIN
ln -s /etc/nginx/sites-available/$DOMAIN-temp /etc/nginx/sites-enabled/$DOMAIN-temp

# 6. Nginx'i yeniden başlat
echo "🔄 Nginx yeniden başlatılıyor..."
nginx -t && systemctl reload nginx

# 7. SSL sertifikası al
echo "🔐 SSL sertifikası alınıyor..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# 8. Gerçek konfigürasyonu aktifleştir
echo "✅ Final konfigürasyon aktifleştiriliyor..."
rm -f /etc/nginx/sites-enabled/$DOMAIN-temp
ln -s /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN

# 9. Nginx son test ve yeniden başlatma
nginx -t && systemctl reload nginx

# 10. PM2 uygulamasını güncelle
echo "🚀 Uygulama güncellemesi..."
cd /opt/canta-management
git pull origin main
pm2 restart canta-management

# 11. SSL otomatik yenileme
echo "🔄 SSL otomatik yenileme ayarlanıyor..."
(crontab -l 2>/dev/null; echo "0 12 * * * certbot renew --quiet && systemctl reload nginx") | crontab -

echo ""
echo "🎉 Domain kurulumu tamamlandı!"
echo "=================================="
echo "✅ Site: https://$DOMAIN"
echo "✅ Admin Panel: https://$DOMAIN"
echo "✅ SSL: Aktif ve otomatik yenileme ayarlandı"
echo "✅ Güvenlik: HTTPS yönlendirmesi aktif"
echo ""
echo "🔗 Sitenizi test edin: https://$DOMAIN"
echo ""
