# NurseAI QuizCraft 🧬

**AI-Powered Next Generation NCLEX (NGN) Question Generator**

Built for nurse educators, by a nurse educator. Generate clinically accurate, Bloom's-aligned NGN-style exam questions in seconds using Google Gemini AI.

---

## ✨ Features

- **5 NGN Question Types:**
  - 📝 **Multiple Choice** — Standard 4-option MCQ with rationale
  - 📋 **Case Study** — Scenario-based questions with patient data
  - 🎀 **Bow-Tie (Trend)** — NGN-style 3-column analysis (conditions, actions, outcomes)
  - 🔤 **Cloze (Fill-in-the-Blank)** — Dropdown fill-in-the-blank questions
  - 📊 **Matrix (Matching)** — Grid matching exercises
- **Toggle Answer Key** — Show/hide correct answers and rationales
- **Copy All** — One-click export to clipboard
- **Powered by Gemini AI** — Fast, free-tier friendly (`gemini-2.5-flash-lite`)

---

## 🚀 Live Demo

👉 **[nurseai-quizcraft.vercel.app](https://nurseai-quizcraft.vercel.app)**

---

## 🛠️ Tech Stack

| Technology | Version |
|------------|---------|
| Next.js | 15.2.9 |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | 4 |
| Google Gemini AI | `@google/generative-ai` |
| Deployment | Vercel |

---

## 🧪 Local Development

```bash
# 1. Clone the repo
git clone https://github.com/RibaldzZ/nurseai-quizcraft.git
cd nurseai-quizcraft

# 2. Install dependencies
npm install

# 3. Add your Gemini API key
#    Create a .env.local file with:
#    GEMINI_API_KEY=your_key_here
#    Get a free key: https://aistudio.google.com/app/apikey

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage

1. Enter a **nursing topic** (e.g., "Fluid & Electrolytes", "Cardiac Nursing", "Pharmacology")
2. Select a **question type** (Multiple Choice, Case Study, Bow-Tie, Cloze, Matrix)
3. Choose **difficulty** (Easy, Moderate, Difficult)
4. Pick **number of questions** (1–5)
5. Click **"Generate Questions"**
6. Use **"Show Answer Key"** to reveal answers and rationales
7. Click **"Copy All"** to export to your clipboard

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── page.tsx                 ← Main UI (form + results)
│   ├── layout.tsx               ← App shell
│   └── api/generate/route.ts    ← API endpoint
├── components/
│   └── QuestionCard.tsx         ← Question renderer (all 5 types)
└── lib/
    ├── gemini.ts                ← AI client + prompt builder + normalizer
    └── types.ts                 ← TypeScript type definitions
```

---

## 📚 Documentation

Full documentation is available in the parent directory:
- `NurseAI_QuizCraft_Documentation.docx` — 7-section Word document (ready to print/present)
- `DEPLOYMENT_GUIDE.md` — Step-by-step deployment instructions

---

## ⚠️ Clinical Disclaimer

AI-generated questions should always be reviewed for clinical accuracy before use in assessments. This tool is designed to **augment** educator workflows, not replace professional judgment.

---

## 👩‍⚕️ About

Built with ❤️ for nurse educators who deserve better tools.  
Clinical reasoning + AI = smarter, faster question generation.
