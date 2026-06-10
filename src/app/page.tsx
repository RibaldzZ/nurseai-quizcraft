"use client";

import { useState, useEffect, useRef } from "react";
import QuestionCard from "@/components/QuestionCard";
import type { GeneratedQuestion, FormData, QuestionType, Difficulty } from "@/lib/types";

const questionTypes: { value: QuestionType; label: string; icon: string; desc: string; color: string }[] = [
  { value: "multiple-choice", label: "Multiple Choice", icon: "📝", desc: "Standard 4-option MCQ", color: "blue" },
  { value: "case-study", label: "Case Study", icon: "📋", desc: "Scenario-based with patient data", color: "amber" },
  { value: "bow-tie", label: "Bow-Tie (Trend)", icon: "🎀", desc: "NGN-style 3-column analysis", color: "purple" },
  { value: "cloze", label: "Cloze (Fill-in)", icon: "🔤", desc: "Dropdown fill-in-the-blank", color: "teal" },
  { value: "matrix", label: "Matrix (Matching)", icon: "📊", desc: "Grid matching exercise", color: "pink" },
];

const difficulties: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "difficult", label: "Difficult" },
];

const topicSuggestions = [
  "Fluid & Electrolytes", "Cardiac Nursing", "Pharmacology",
  "Maternity", "Pediatrics", "Mental Health", "Med-Surg", "Leadership",
];

const typeColorMap: Record<string, string> = {
  "multiple-choice": "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
  "case-study": "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
  "bow-tie": "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300",
  "cloze": "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-300",
  "matrix": "border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-800 dark:bg-pink-950 dark:text-pink-300",
};

const typeIconBg: Record<string, string> = {
  "multiple-choice": "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
  "case-study": "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300",
  "bow-tie": "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
  "cloze": "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300",
  "matrix": "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300",
};

export default function Home() {
  const [form, setForm] = useState<FormData>({
    topic: "",
    questionType: "multiple-choice",
    difficulty: "moderate",
    count: 3,
  });

  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });
  const [hasGenerated, setHasGenerated] = useState(false);
  const [dark, setDark] = useState(false);
  const [generatingStep, setGeneratingStep] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Dark mode
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  // Toast helper
  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 2000);
  };

  // Generate step progress
  const loadingRef = useRef(loading);
  useEffect(() => {
    loadingRef.current = loading;
    if (!loading) {
      // Reset step on next frame to avoid cascading render
      const id = setTimeout(() => setGeneratingStep(0), 0);
      return () => clearTimeout(id);
    }
    const interval = setInterval(() => {
      setGeneratingStep((s) => (s < 3 ? s + 1 : s));
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setLoading(true);
    setError("");
    setQuestions([]);
    setHasGenerated(false);
    setGeneratingStep(1);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to generate questions");
      }

      setQuestions(data.questions);
      setHasGenerated(true);
      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAll = () => {
    const text = questions
      .map((q, i) => {
        let qText = `Question ${i + 1}:\n`;
        if ("scenario" in q && q.scenario) qText += `Scenario: ${q.scenario}\n`;
        if ("stem" in q && q.stem) qText += `${q.stem}\n`;
        if ("options" in q && q.options) {
          q.options.forEach((o: { letter: string; text: string }) => {
            qText += `  ${o.letter}. ${o.text}\n`;
          });
        }
        qText += `Answer: ${"correctAnswer" in q ? q.correctAnswer : ""}\n`;
        qText += `Rationale: ${q.rationale}\n`;
        return qText;
      })
      .join("\n---\n\n");

    navigator.clipboard.writeText(text).then(() => {
      showToast(`✅ Copied ${questions.length} question${questions.length > 1 ? "s" : ""} to clipboard`);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const generatingMessages = [
    "NurseAI is creating your questions...",
    "AI is generating clinically accurate scenarios...",
    "Almost there! Formatting your questions...",
  ];

  const selectedType = questionTypes.find((qt) => qt.value === form.questionType);

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
      {/* ===== HEADER ===== */}
      <header className="bg-white dark:bg-[#0f172a] border-b border-zinc-200 dark:border-zinc-800 shadow-sm no-print transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">🧬</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">NurseAI QuizCraft</h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">AI-Powered NGN Question Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDark(!dark)}
              className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center transition text-lg"
              aria-label="Toggle dark mode"
            >
              {dark ? "☀️" : "🌙"}
            </button>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">by RibaldzZ</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* ===== HERO ===== */}
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-2">
            Create NGN Exam Questions in Seconds
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Generate clinically accurate, Bloom&apos;s-aligned NCLEX-style questions.
            Built for nurse educators, powered by Google Gemini AI.
          </p>
        </div>

        {/* ===== FORM ===== */}
        <div className="bg-white dark:bg-[#1a2332] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6 mb-6 transition-colors duration-300">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Topic */}
            <div>
              <label htmlFor="topic" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Topic / Subject
              </label>
              <input
                id="topic"
                type="text"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                placeholder="e.g., Fluid & Electrolytes, Cardiac Nursing, Pharmacology..."
                className="w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg text-[var(--foreground)] bg-white dark:bg-[#0f172a] placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition text-sm"
              />
              {/* Topic suggestions */}
              {!form.topic && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {topicSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm({ ...form, topic: s })}
                      className="text-xs px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-[var(--primary-light)] hover:border-[var(--primary)] hover:text-[var(--primary)] dark:hover:bg-[var(--primary-light)] transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Question Type — Visual Cards */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Question Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {questionTypes.map((qt) => {
                  const isSelected = form.questionType === qt.value;
                  const colors = typeColorMap[qt.value];
                  const iconColors = typeIconBg[qt.value];
                  return (
                    <button
                      key={qt.value}
                      type="button"
                      onClick={() => setForm({ ...form, questionType: qt.value })}
                      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${
                        isSelected
                          ? `${colors} shadow-sm scale-[1.02]`
                          : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${isSelected ? iconColors : "bg-zinc-100 dark:bg-zinc-800"}`}>
                        {qt.icon}
                      </span>
                      <span className="text-[11px] font-medium leading-tight">{qt.label}</span>
                      {isSelected && (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[var(--primary)] text-white rounded-full flex items-center justify-center text-[10px] shadow-sm">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty + Count row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Difficulty */}
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Difficulty
                </label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value as Difficulty })}
                  className="w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg text-[var(--foreground)] bg-white dark:bg-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition text-sm appearance-none"
                >
                  {difficulties.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>

              {/* Count */}
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Number of Questions
                </label>
                <select
                  value={form.count}
                  onChange={(e) => setForm({ ...form, count: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg text-[var(--foreground)] bg-white dark:bg-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition text-sm appearance-none"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} question{n > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded-lg px-4 py-3 animate-slide-down">
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all text-sm ${
                loading
                  ? "bg-zinc-400 dark:bg-zinc-600 cursor-not-allowed"
                  : "bg-[var(--primary)] hover:bg-[var(--primary-dark)] active:scale-[0.98] shadow-sm hover:shadow-md"
              }`}
            >
              {loading ? (
                <span className="flex flex-col items-center gap-1">
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin-slow h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {generatingMessages[Math.min(generatingStep, generatingMessages.length - 1)]}
                  </span>
                  <span className="text-[10px] opacity-70">
                    {form.count} question{form.count > 1 ? "s" : ""} • {form.difficulty} • {selectedType?.label}
                  </span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>🚀</span>
                  <span>Generate Questions</span>
                </span>
              )}
            </button>
          </form>
        </div>

        {/* ===== RESULTS ===== */}
        {questions.length > 0 && (
          <div ref={resultsRef} className="no-print">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Generated Questions ({questions.length})
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="text-sm px-3 py-1.5 bg-white dark:bg-[#1a2332] border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition font-medium flex items-center gap-1.5"
                >
                  🖨️ Print
                </button>
                <button
                  onClick={handleCopyAll}
                  className="text-sm px-3 py-1.5 bg-white dark:bg-[#1a2332] border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition font-medium flex items-center gap-1.5"
                >
                  📋 Copy All
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {questions.map((q, i) => (
                <div
                  key={i}
                  className={`animate-fade-in-up delay-${Math.min((i + 1) * 100, 500)}`}
                  style={{ animationDelay: `${(i + 1) * 100}ms` }}
                >
                  <QuestionCard question={q} index={i} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== PRINT RESULTS ===== */}
        {questions.length > 0 && (
          <div className="print-only">
            <h1 style={{ fontSize: "18pt", fontWeight: "bold", marginBottom: "12pt" }}>
              NurseAI QuizCraft — Generated Questions
            </h1>
            <p style={{ fontSize: "10pt", color: "#666", marginBottom: "20pt" }}>
              Topic: {form.topic} | Difficulty: {form.difficulty}
            </p>
            {questions.map((q, i) => (
              <div key={i} className="print-break-inside" style={{ marginBottom: "16pt", padding: "8pt", border: "1px solid #ccc", borderRadius: "4pt" }}>
                <p style={{ fontSize: "11pt", fontWeight: "bold", marginBottom: "8pt" }}>
                  Question {i + 1} ({questionTypes.find(qt => qt.value === q.type)?.label || q.type})
                </p>
                {"scenario" in q && q.scenario && <p style={{ fontSize: "10pt", fontStyle: "italic", marginBottom: "6pt" }}>Scenario: {q.scenario}</p>}
                {"stem" in q && q.stem && <p style={{ fontSize: "10pt", marginBottom: "6pt" }}>{q.stem}</p>}
                {"options" in q && q.options && Array.isArray(q.options) && (
                  <div style={{ marginLeft: "12pt", marginBottom: "6pt" }}>
                    {(q.options as {letter: string; text: string}[]).map((o, oi) => (
                      <p key={oi} style={{ fontSize: "10pt" }}>{o.letter}. {o.text}</p>
                    ))}
                  </div>
                )}
                <p style={{ fontSize: "10pt", fontWeight: "bold", color: "#0D7C66" }}>
                  Answer: {"correctAnswer" in q ? q.correctAnswer : ""}
                </p>
                {q.rationale && (
                  <p style={{ fontSize: "9pt", color: "#666", marginTop: "4pt" }}>
                    Rationale: {q.rationale}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ===== EMPTY STATE ===== */}
        {!hasGenerated && !loading && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-7xl mb-4 animate-pulse-soft">🧑‍⚕️</div>
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">Ready to create questions?</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-md mx-auto mb-6">
              Enter a nursing topic above, choose your question type, and let AI do the heavy lifting.
              Perfect for exams, reviews, and practice tests.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
              <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">📝 Multiple Choice</span>
              <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">📋 Case Study</span>
              <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">🎀 Bow-Tie</span>
              <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">🔤 Cloze</span>
              <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">📊 Matrix</span>
            </div>
          </div>
        )}

        {/* ===== FOOTER ===== */}
        <div className="mt-12 text-center text-xs text-zinc-400 dark:text-zinc-600 border-t border-zinc-200 dark:border-zinc-800 pt-6 no-print">
          <p>NurseAI QuizCraft v2.0 — Always review AI-generated content for clinical accuracy before use.</p>
        </div>
      </main>

      {/* ===== TOAST ===== */}
      {toast.visible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-toast-in">
          <div className="bg-[var(--foreground)] text-[var(--background)] px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
