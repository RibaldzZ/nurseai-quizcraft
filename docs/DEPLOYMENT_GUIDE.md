# 🚀 NurseAI QuizCraft — Deployment Guide

## Prerequisites
1. A **Google Gemini API Key** (free) → https://aistudio.google.com/app/apikey
2. A **GitHub account** (free) → https://github.com
3. A **Vercel account** (free) → https://vercel.com

---

## Step 1: Push to GitHub

```bash
cd "C:\Users\ribaldz\Desktop\NursingAI_Project\nurseai-quizcraft"

# Initialize git
git init
git add .
git commit -m "Initial commit — NurseAI QuizCraft"

# Create a repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/nurseai-quizcraft.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy on Vercel

1. Go to https://vercel.com
2. Sign up with **"Continue with GitHub"**
3. Click **"Add New" → "Project"**
4. Import your `nurseai-quizcraft` GitHub repo
5. In **Environment Variables**, add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** `your_actual_gemini_api_key`
6. Click **"Deploy"** ✅

## Step 3: All done!

Your app will be live at: `https://nurseai-quizcraft.vercel.app`
(You can customize the domain in Vercel dashboard)

---

## 🧪 Local Development

```bash
# Navigate to project
cd "C:\Users\ribaldz\Desktop\NursingAI_Project\nurseai-quizcraft"

# Install dependencies (already done)
npm install

# Add your API key to .env.local
# Open .env.local and paste your key

# Run locally
npm run dev
# → App runs at http://localhost:3000
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| **"Next.js outdated"** | Update with `npm install next@latest` or match the repo version |
| **"429 Too Many Requests"** | Your free API quota is exhausted. Wait 1 min or use a **fresh API key** from a new Google AI project |
| **"503 Service Unavailable"** | Model is overloaded. Switch to a different model in `src/lib/gemini.ts` (e.g., `gemini-2.5-flash-lite`) |
| **"question.options.map is not a function"** | AI returned malformed JSON. The app now includes a **response normalizer** to handle this automatically |
| **"GEMINI_API_KEY is not set"** | Add the env variable in Vercel dashboard or `.env.local` |
| **Build fails on Vercel** | Check ESLint errors with `npm run build` locally first |
| **AI returns gibberish** | Verify your API key is valid and has Gemini API enabled at https://aistudio.google.com |

---

## 💡 Tips

- **Free tier quota** is shared across some models. If you hit limits, create a **new Google AI project** for a fresh quota
- `gemini-2.5-flash-lite` is the most stable free-tier model for this app
- Always review AI-generated content for clinical accuracy before use
