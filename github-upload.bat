@echo off
echo GitHub'a kod yukleme scripti
echo.

echo ADIM 1: Git repository baslatiliyor...
git init

echo.
echo ADIM 2: Dosyalar ekleniyor...
git add .

echo.
echo ADIM 3: Commit yapiliyor...
git commit -m "Canta management system - ready for deployment"

echo.
echo ADIM 4: Ana branch ayarlaniyor...
git branch -M main

echo.
echo BURAYA GITHUB URL'NIZI YAZIN:
echo Ornek: git remote add origin https://github.com/KULLANICIADI/canta-management.git
echo.
set /p github_url="GitHub repository URL'nizi girin: "

echo.
echo ADIM 5: GitHub baglantisi ekleniyor...
git remote add origin %github_url%

echo.
echo ADIM 6: Kod GitHub'a yukleniyor...
git push -u origin main

echo.
echo BASARILI! Kod GitHub'a yuklendi.
echo Simdi Vercel'e gecebilirsiniz.
pause
