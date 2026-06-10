# 🧬 NurseAI QuizCraft — v2 Roadmap

> Ideas for the next version — collected June 2026

---

## 🎨 UI / UX Polish

### 1. Professional Healthcare Color Palette
- [ ] Deep teal/navy gradient header (trust + calm)
- [ ] Color-coded question cards per type
  - Blue → Multiple Choice
  - Orange → Case Study
  - Purple → Bow-Tie
  - Teal → Cloze
  - Pink → Matrix
- [ ] Warm amber/gold for rationales (highlighter feel)

### 2. Question Type Cards (Visual Selector)
- [ ] Replace `<select>` dropdown with icon + label cards
- [ ] Each type shows: icon, name, short description
- [ ] Nurses are visual learners — icons are more intuitive

### 3. Empty State Illustration
- [ ] Nurse character or clipboard icon
- [ ] Subtle animation on page load
- [ ] Tagline: *"Ready to create your next exam?"*

### 4. Micro-interactions & Feedback
- [ ] Progress bar on generation ("Generating 2/3...")
- [ ] Staggered card animations (slide in one by one)
- [ ] Toast notification: ✅ "Copied 3 questions to clipboard"
- [ ] Smooth slide-down animation for answer key / rationale

### 5. Print-Friendly Mode
- [ ] "🖨️ Print All" button
- [ ] Clean layout without colors/buttons
- [ ] Questions + answer key formatted for paper

### 6. Dark Mode
- [ ] Toggle for dark/light mode
- [ ] Great for nurses working late shifts
- [ ] Uses Tailwind `dark:` variant

### 7. Quick Topic Suggestions
- [ ] One-click suggestion chips below topic input
- [ ] Examples: Fluid & Electrolytes, Cardiac, Pharmacology, Maternity, etc.
- [ ] Saves typing time

---

## 👩‍⚕️ Nurse Educator–Specific

### 8. Client Branding (White-Label)
- [ ] School/program name in header instead of "by RibaldzZ"
- [ ] Custom logo upload
- [ ] Brand colors

### 9. Export Options
- [ ] PDF export (formatted for exams)
- [ ] Word document export
- [ ] QTI format for LMS import (Canvas, Blackboard)

### 10. Question Bank
- [ ] Save generated questions to a bank
- [ ] Tag by topic, difficulty, date
- [ ] Search and filter saved questions

---

## ⚙️ Technical

### 11. Better Error Handling
- [ ] Friendlier error messages (not raw API errors)
- [ ] Retry button on quota exceeded
- [ ] Offline detection

### 12. Performance
- [ ] Streaming responses (questions appear one by one)
- [ ] Cached prompts for common topics

---

## 💼 Business

### 13. Coffee Pricing Strategy ☕
- [ ] Client name on app → **latte-sized upgrade**
- [ ] Full white-label with custom branding → **frappuccino with extra espresso**

---

> *Want to suggest a feature? Open an issue on GitHub or ask RibaldzZ!*
