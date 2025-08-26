# Hosting Kurulum Rehberi - Türk Hosting Firmaları

## 🇹🇷 ÖNERİLEN: Turhost.com

### 1. Paket Seçimi
- **Paket**: Business SSD Hosting (30 TL/ay)
- **Özellikler**: 
  - 5 GB SSD
  - Node.js desteği
  - PostgreSQL veritabanı
  - SSL sertifikası
  - Türkiye data center

### 2. Kurulum Adımları

#### A. Hosting Satın Alma
1. Turhost.com'a git
2. "Business SSD Hosting" seç
3. Domain adı seç (.com.tr önerilen)
4. Ödemeyi tamamla

#### B. Dosyaları Yükleme
1. cPanel'e giriş yap
2. File Manager'ı aç
3. public_html klasörüne gidin
4. Bu projedeki tüm dosyaları yükleyin

#### C. Veritabanı Kurulumu
1. cPanel'de "PostgreSQL Databases" aç
2. Yeni veritabanı oluştur: `canta_management`
3. Kullanıcı oluştur ve veritabanına bağla
4. .env dosyasında DATABASE_URL'i güncelle

#### D. Node.js Aktivasyonu
1. cPanel'de "Node.js" bölümüne git
2. Uygulamayı oluştur
3. Node.js versiyonu: 18+
4. Startup file: server.js

### 3. Production Build
```bash
npm run build
npm start
```

## 🔧 Alternatif: Natro.com

### Paket: SSD Pro (25 TL/ay)
- 3 GB SSD
- Node.js + MongoDB
- Ücretsiz SSL
- İstanbul data center

### Kurulum aynı adımlar, sadece:
- MongoDB kullanılacaksa DATABASE_URL'i değiştir
- cPanel yerine Plesk panel

## 📱 Mobil Optimizasyon

### Responsive Test
- Chrome DevTools
- Mobil cihazlarda test
- Touch events

### Performance
- Google PageSpeed Insights
- GTmetrix testi
- Mobil hız optimizasyonu

## 🛡️ Güvenlik

### SSL Sertifikası
- Let's Encrypt (ücretsiz)
- Hosting firması tarafından sağlanır

### Güvenlik Headers
- HTTPS yönlendirmesi
- XSS protection
- CSRF koruması

## 📊 Monitoring

### Analitik
- Google Analytics
- Search Console
- Hotjar (kullanıcı davranışı)

### Uptime Monitoring
- UptimeRobot (ücretsiz)
- Pingdom
- New Relic

## 💾 Backup

### Otomatik Yedekleme
- Hosting firması günlük backup
- Manuel export (weekly)
- Database dump

## ⚡ Performance Tips

### Caching
- Browser caching
- CDN kullanımı
- Database query optimization

### Images
- WebP format
- Lazy loading
- Compression

## 🎯 Domain Önerileri

### .com.tr (Türkiye)
- cantayonetim.com.tr
- butikcantas.com.tr
- cantamarket.com.tr

### .com (Global)
- cantamanager.com
- bagshopmanager.com
- boutiquebags.com

## 💰 Maliyet Analizi

### Turhost (Önerilen)
- Hosting: 30 TL/ay
- Domain: 50 TL/yıl
- SSL: Ücretsiz
- **Toplam**: ~410 TL/yıl

### Natro
- Hosting: 25 TL/ay
- Domain: 40 TL/yıl
- SSL: Ücretsiz
- **Toplam**: ~340 TL/yıl

## 🚀 Deployment Checklist

- [ ] Production build test
- [ ] Environment variables set
- [ ] Database migration
- [ ] SSL certificate active
- [ ] Domain DNS configured
- [ ] Mobile responsive test
- [ ] Performance test
- [ ] Security scan
- [ ] Backup configured
- [ ] Monitoring setup
