# Git yeniden başlatıldıktan sonra çalıştırılacak komutlar

# 1. Git repository'yi başlat
git init

# 2. Git kullanıcı bilgilerini ayarla (isteğe bağlı)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 3. .gitignore dosyasını kontrol et
# .env
# node_modules/
# .next/
# dist/
# build/

# 4. Dosyaları git'e ekle
git add .

# 5. İlk commit
git commit -m "Initial commit - Canta Management System"

# 6. GitHub repository oluştur ve bağla
# GitHub'da yeni repo oluşturun: canta-management
# Sonra:
# git branch -M main
# git remote add origin https://github.com/USERNAME/canta-management.git
# git push -u origin main
