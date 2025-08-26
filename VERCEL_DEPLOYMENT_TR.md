# Vercel ile Ücretsiz Deployment Rehberi

## Adım 1: GitHub Repository Oluşturma

1. GitHub'da yeni repository oluşturun
2. Kodları GitHub'a yükleyin:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/KULLANICI_ADI/canta-management.git
git branch -M main
git push -u origin main
```

## Adım 2: Supabase Database Kurulumu (Ücretsiz PostgreSQL)

1. [supabase.com](https://supabase.com) adresine gidin
2. GitHub ile giriş yapın
3. "New Project" butonuna tıklayın
4. Project ismini `canta-management` yapın
5. Database şifresini kaydedin
6. "Create new project" butonuna tıklayın
7. Project dashboard'da "Settings" > "Database" bölümüne gidin
8. Connection string'i kopyalayın

## Adım 3: Vercel'de Deployment

1. [vercel.com](https://vercel.com) adresine gidin
2. GitHub ile giriş yapın
3. "New Project" butonuna tıklayın
4. GitHub repository'nizi seçin
5. Environment Variables ekleyin:

```
DATABASE_URL=postgresql://postgres:[ŞİFRE]@db.[PROJECT_REF].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[ŞİFRE]@db.[PROJECT_REF].supabase.co:5432/postgres
NEXTAUTH_SECRET=rasgele-güvenli-şifre-buraya
NEXTAUTH_URL=https://your-app-name.vercel.app
```

6. "Deploy" butonuna tıklayın

## Adım 4: Database Migration

Deployment tamamlandıktan sonra:

1. Vercel dashboard'da projenize gidin
2. "Functions" tabında "View Function Logs" tıklayın
3. Terminal açın ve migration komutunu çalıştırın:

```bash
npx prisma db push --schema=prisma/schema.vercel.prisma
```

## Adım 5: Domain Ayarları (Opsiyonel)

1. Vercel dashboard'da "Domains" tabına gidin
2. Kendi domain'inizi ekleyin
3. DNS ayarlarını Vercel'in verdiği değerlere güncelleyin

## Avantajları:

- ✅ Tamamen ücretsiz
- ✅ SSL sertifikası otomatik
- ✅ Global CDN
- ✅ Türkiye'den çok hızlı (3-5ms ping)
- ✅ Otomatik scaling
- ✅ GitHub entegrasyonu
- ✅ Kolay güncelleme

## Limitler:

- Bandwidth: 100GB/ay (çok yeterli)
- Function execution: 100GB-saat/ay
- Database: 500MB (Supabase free tier)

## Troubleshooting:

Eğer build hatası alırsanız:
1. `package.json`'da build script'ini kontrol edin
2. Environment variables'ları doğru girdiğinizden emin olun
3. Prisma schema dosyasının doğru olduğunu kontrol edin

## Güncelleme:

Kodda değişiklik yaptığınızda:
```bash
git add .
git commit -m "Update message"
git push
```

Vercel otomatik olarak yeni versiyonu deploy edecektir.
