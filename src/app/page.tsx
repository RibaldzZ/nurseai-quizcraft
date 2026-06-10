"use client";

import { useState } from "react";
import QuestionCard from "@/components/QuestionCard";
import type { GeneratedQuestion, FormData, QuestionType, Difficulty } from "@/lib/types";

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
  const [copied, setCopied] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const questionTypes: { value: QuestionType; label: string; icon: string; desc: string }[] = [
    { value: "multiple-choice", label: "Multiple Choice", icon: "📝", desc: "Standard 4-option MCQ" },
    { value: "case-study", label: "Case Study", icon: "📋", desc: "Scenario-based with patient data" },
    { value: "bow-tie", label: "Bow-Tie (Trend)", icon: "🎀", desc: "NGN-style 3-column analysis" },
    { value: "cloze", label: "Cloze (Fill-in)", icon: "🔤", desc: "Dropdown fill-in-the-blank" },
    { value: "matrix", label: "Matrix (Matching)", icon: "📊", desc: "Grid matching exercise" },
  ];

  const difficulties: { value: Difficulty; label: string }[] = [
    { value: "easy", label: "Easy" },
    { value: "moderate", label: "Moderate" },
    { value: "difficult", label: "Difficult" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setLoading(true);
    setError("");
    setQuestions([]);
    setCopied(false);

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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">🧬</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">NurseAI QuizCraft</h1>
              <p className="text-xs text-zinc-500">AI-Powered NGN Question Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">by NursingAI</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-2">
            Create NGN Exam Questions in Seconds
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto">
            Generate clinically accurate, Bloom&apos;s-aligned NCLEX-style questions.
            Built for nurse educators, powered by Google Gemini AI.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Topic */}
            <div>
              <label htmlFor="topic" className="block text-sm font-semibold text-zinc-700 mb-1.5">
                Topic / Subject
              </label>
              <input
                id="topic"
                type="text"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                placeholder="e.g., Fluid & Electrolytes, Cardiac Nursing, Pharmacology, Maternity..."
                className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
              />
            </div>

            {/* Question Type + Difficulty + Count */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Question Type */}
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
                  Question Type
                </label>
                <div className="relative">
                  <select
                    value={form.questionType}
                    onChange={(e) => setForm({ ...form, questionType: e.target.value as QuestionType })}
                    className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm appearance-none"
                  >
                    {questionTypes.map((qt) => (
                      <option key={qt.value} value={qt.value}>
                        {qt.icon} {qt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
                  Difficulty
                </label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value as Difficulty })}
                  className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm appearance-none"
                >
                  {difficulties.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Count */}
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
                  Number of Questions
                </label>
                <select
                  value={form.count}
                  onChange={(e) => setForm({ ...form, count: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm appearance-none"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} question{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected type description */}
            <div className="text-xs text-zinc-500 bg-zinc-50 rounded-lg px-3 py-2 border border-zinc-200">
              {questionTypes.find((qt) => qt.value === form.questionType)?.desc}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all text-sm ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating with Gemini AI...
                </span>
              ) : (
                "🚀 Generate Questions"
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {questions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-zinc-900">
                Generated Questions ({questions.length})
              </h3>
              <button
                onClick={handleCopyAll}
                className="text-sm px-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-50 transition font-medium flex items-center gap-1.5"
              >
                {copied ? "✅ Copied!" : "📋 Copy All"}
              </button>
            </div>
            <div className="space-y-4">
              {questions.map((q, i) => (
                <QuestionCard key={i} question={q} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state when no questions yet */}
        {!hasGenerated && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🧑‍🏫</div>
            <h3 className="text-lg font-semibold text-zinc-600 mb-2">Ready to create questions?</h3>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              Enter a nursing topic above, choose your question type, and let AI do the heavy lifting.
              Perfect for exams, reviews, and practice tests.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-zinc-400 border-t border-zinc-200 pt-6">
          <p>NurseAI QuizCraft v1.0 — Powered by Google Gemini AI</p>
          <p className="mt-1">
            Always review AI-generated content for clinical accuracy before use in assessments.
          </p>
        </div>
      </main>
    </div>
  );
}
