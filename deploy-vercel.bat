@echo off
echo Starting Vercel deployment process...

echo.
echo Step 1: Installing dependencies...
npm install

echo.
echo Step 2: Building for production...
npm run build

echo.
echo Step 3: Checking if git is initialized...
if not exist .git (
    echo Initializing git repository...
    git init
    git add .
    git commit -m "Initial commit for Vercel deployment"
) else (
    echo Git repository already exists
    echo Adding and committing changes...
    git add .
    git commit -m "Updates for Vercel deployment"
)

echo.
echo Step 4: Ready for Vercel deployment!
echo.
echo Next steps:
echo 1. Push to GitHub: git remote add origin [YOUR_GITHUB_URL]
echo 2. git branch -M main
echo 3. git push -u origin main
echo 4. Connect to Vercel at vercel.com
echo 5. Import from GitHub
echo 6. Add environment variables
echo 7. Deploy!
echo.
echo For detailed instructions, see VERCEL_DEPLOYMENT_TR.md
pause
