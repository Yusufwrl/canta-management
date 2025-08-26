# Çanta Yönetim Sistemi

Butik çanta mağazası için geliştirilmiş kapsamlı yönetim sistemi.

## Özellikler

- 📦 **Ürün Yönetimi**: Ürün ekleme, düzenleme, silme ve stok takibi
- 🏷️ **Kategori Yönetimi**: Ürün kategorilerini organize etme
- 💰 **Gelir-Gider Takibi**: Mali işlemlerin kaydedilmesi ve raporlanması
- 📊 **Dashboard**: Genel durum ve istatistiklerin görüntülenmesi
- 🖼️ **Resim Yönetimi**: Ürün resimlerinin yüklenmesi ve optimizasyonu
- 🔍 **Hızlı Arama**: Ürün kodu ile hızlı arama

## Teknolojiler

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS
- **Veritabanı**: SQLite + Prisma ORM
- **İkonlar**: Lucide React
- **Form Validasyonu**: Native HTML5 + Custom hooks

## Kurulum

1. **Projeyi klonlayın**
   ```bash
   git clone <repository-url>
   cd canta-management
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Ortam değişkenlerini ayarlayın**
   ```bash
   cp .env.example .env
   ```

4. **Veritabanını başlatın**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Geliştirme sunucusunu başlatın**
   ```bash
   npm run dev
   ```

## Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── categories/        # Kategori sayfaları
│   ├── products/          # Ürün sayfaları
│   ├── transactions/      # Gelir-gider sayfaları
│   └── layout.tsx         # Ana layout
├── components/            # React bileşenleri
│   ├── ui/               # Genel UI bileşenleri
│   └── Sidebar.tsx       # Navigasyon sidebar
├── lib/                  # Yardımcı kütüphaneler
│   ├── prisma.ts         # Veritabanı bağlantısı
│   └── utils.ts          # Yardımcı fonksiyonlar
└── types/                # TypeScript tip tanımları
    └── index.ts
```

## Kullanım

### Ürün Ekleme
1. Sidebar'dan "Ürün Ekle" seçeneğine tıklayın
2. Ürün bilgilerini doldurun
3. Ürün resimlerini yükleyin
4. "Kaydet" butonuna tıklayın

### Kategori Yönetimi
1. "Kategoriler" sayfasına gidin
2. "Yeni Kategori" butonuna tıklayın
3. Kategori bilgilerini girin
4. Kaydedin

### Gelir-Gider Takibi
1. "Gelir-Gider" sayfasına gidin
2. "Yeni İşlem" butonuna tıklayın
3. İşlem tipini seçin (Gelir/Gider)
4. Tutarı ve açıklamayı girin
5. Kaydedin

## API Endpoints

- `GET /api/products` - Tüm ürünleri listele
- `POST /api/products` - Yeni ürün ekle
- `GET /api/transactions` - Tüm işlemleri listele
- `POST /api/transactions` - Yeni işlem ekle
- `POST /api/upload` - Dosya yükle

## Geliştirme

### Yeni Özellik Ekleme
1. İlgili tip tanımlarını `src/types/index.ts` dosyasına ekleyin
2. API endpoint'lerini `src/app/api/` klasörüne ekleyin
3. UI bileşenlerini geliştirin
4. Gerekli testleri yazın

### Veritabanı Değişiklikleri
1. `prisma/schema.prisma` dosyasını düzenleyin
2. Migration oluşturun: `npx prisma db push`
3. Client'ı güncelleyin: `npx prisma generate`

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
