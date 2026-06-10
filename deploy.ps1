# 🚀 NurseAI QuizCraft — Auto Deploy Script
# Run this in PowerShell after you create your GitHub account

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  NurseAI QuizCraft - Auto Deploy" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check we're in the right folder
if (-not (Test-Path "package.json")) {
    Write-Host "❌ ERROR: Run this script from the nurseai-quizcraft folder!" -ForegroundColor Red
    Write-Host "   cd C:\Users\ribaldz\Desktop\NursingAI_Project\nurseai-quizcraft" -ForegroundColor Yellow
    exit 1
}

# Step 2: Initialize git
Write-Host "[1/4] Initializing git repository..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "  ⏭️  Git already initialized, skipping..." -ForegroundColor Gray
} else {
    git init
    Write-Host "  ✅ Git initialized!" -ForegroundColor Green
}

# Step 3: Create .gitignore (to keep API key safe)
Write-Host "[2/4] Setting up .gitignore..." -ForegroundColor Yellow
$gitignore = @"
# dependencies
node_modules/
.pnp
.pnp.js

# testing
coverage/

# next.js
.next/
out/

# production
build/

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/
"@

Set-Content -Path ".gitignore" -Value $gitignore -NoNewline
Write-Host "  ✅ .gitignore created (your API key is safe!)" -ForegroundColor Green

# Step 4: Git add and commit
Write-Host "[3/4] Staging and committing files..." -ForegroundColor Yellow
git add .
git commit -m "Initial commit - NurseAI QuizCraft"
Write-Host "  ✅ Files committed!" -ForegroundColor Green

# Step 5: GitHub setup instructions
Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  ✅ DONE! Now for the manual steps:" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "=== STEP 1: Create a GitHub repo ===" -ForegroundColor Green
Write-Host "  1. Go to: https://github.com/new" -ForegroundColor White
Write-Host "  2. Login with your YouTube email" -ForegroundColor White
Write-Host "  3. Repo name: nurseai-quizcraft" -ForegroundColor White
Write-Host "  4. Keep it PUBLIC (free)" -ForegroundColor White
Write-Host "  5. Click 'Create repository'" -ForegroundColor White
Write-Host "     (DO NOT check any boxes)" -ForegroundColor Yellow
Write-Host ""
Write-Host "=== STEP 2: Push to GitHub ===" -ForegroundColor Green
Write-Host "  After creating the repo, GitHub will show you commands." -ForegroundColor White
Write-Host "  Run these two commands in THIS terminal:" -ForegroundColor White
Write-Host ""
Write-Host "  git remote add origin https://github.com/YOUR_USERNAME/nurseai-quizcraft.git" -ForegroundColor Yellow
Write-Host "  git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "  (Replace YOUR_USERNAME with your GitHub username)" -ForegroundColor Gray
Write-Host ""
Write-Host "=== STEP 3: Deploy to Vercel ===" -ForegroundColor Green
Write-Host "  1. Go to: https://vercel.com" -ForegroundColor White
Write-Host "  2. Login with GitHub (use your new account)" -ForegroundColor White
Write-Host "  3. Click 'Add New' → 'Project'" -ForegroundColor White
Write-Host "  4. Import 'nurseai-quizcraft'" -ForegroundColor White
Write-Host "  5. Add env variable:" -ForegroundColor White
Write-Host "     Name: GEMINI_API_KEY" -ForegroundColor Yellow
Write-Host "     Value: (paste your Gemini key)" -ForegroundColor Yellow
Write-Host "  6. Click 'Deploy' 🚀" -ForegroundColor White
Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  Need help? Just ask me!" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
