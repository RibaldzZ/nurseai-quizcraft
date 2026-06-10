"use client";

import { useState } from "react";
import type {
  MCQQuestion,
  CaseStudyQuestion,
  BowTieQuestion,
  ClozeQuestion,
  MatrixQuestion,
  QuestionCardProps,
} from "@/lib/types";

function MCQView({ question, reveal }: { question: MCQQuestion; reveal: boolean }) {
  return (
    <div>
      <p className="text-base font-medium text-zinc-900 mb-3">{question.stem}</p>
      <div className="space-y-2">
        {question.options.map((opt) => {
          const isCorrect = opt.letter === question.correctAnswer;
          return (
            <div
              key={opt.letter}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                reveal && isCorrect
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-zinc-200 bg-white"
              }`}
            >
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  reveal && isCorrect
                    ? "bg-emerald-500 text-white"
                    : "bg-zinc-100 text-zinc-700"
                }`}
              >
                {opt.letter}
              </span>
              <span className="text-zinc-800 pt-1">{opt.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CaseStudyView({ question, reveal }: { question: CaseStudyQuestion; reveal: boolean }) {
  return (
    <div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm font-semibold text-blue-800 mb-1">📋 Scenario</p>
        <p className="text-zinc-800">{question.scenario}</p>
      </div>
      <p className="text-base font-medium text-zinc-900 mb-3">{question.question}</p>
      <div className="space-y-2">
        {question.options.map((opt) => {
          const isCorrect = opt.letter === question.correctAnswer;
          return (
            <div
              key={opt.letter}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                reveal && isCorrect
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-zinc-200 bg-white"
              }`}
            >
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  reveal && isCorrect
                    ? "bg-emerald-500 text-white"
                    : "bg-zinc-100 text-zinc-700"
                }`}
              >
                {opt.letter}
              </span>
              <span className="text-zinc-800 pt-1">{opt.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BowTieView({ question, reveal }: { question: BowTieQuestion; reveal: boolean }) {
  return (
    <div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm font-semibold text-blue-800 mb-1">📋 Scenario</p>
        <p className="text-zinc-800">{question.scenario}</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {/* Left Column */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <p className="text-xs font-bold text-orange-700 uppercase mb-2">
            Conditions / Risks
          </p>
          <p className="text-[10px] text-orange-600 mb-2">(Select all that apply)</p>
          <div className="space-y-1.5">
            {question.allLeft.map((item, i) => {
              const isSelected = question.correctLeft.includes(item);
              return (
                <div
                  key={i}
                  className={`p-2 rounded text-xs border ${
                    reveal && isSelected
                      ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                      : reveal && !isSelected
                      ? "border-zinc-200 bg-white/50 text-zinc-500"
                      : "border-zinc-200 bg-white/50 text-zinc-700"
                  }`}
                >
                  {reveal && isSelected && "✓ "}
                  {item}
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Column */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <p className="text-xs font-bold text-purple-700 uppercase mb-2">
            Priority Action
          </p>
          <p className="text-[10px] text-purple-600 mb-2">(Select one)</p>
          <div className="space-y-1.5">
            {question.allCenter.map((item, i) => {
              const isCorrect = item === question.correctCenter;
              return (
                <div
                  key={i}
                  className={`p-2 rounded text-xs border ${
                    reveal && isCorrect
                      ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                      : reveal && !isCorrect
                      ? "border-zinc-200 bg-white/50 text-zinc-500"
                      : "border-zinc-200 bg-white/50 text-zinc-700"
                  }`}
                >
                  {reveal && isCorrect ? "✓ " : "○ "}
                  {item}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
          <p className="text-xs font-bold text-teal-700 uppercase mb-2">
            Expected Outcomes
          </p>
          <p className="text-[10px] text-teal-600 mb-2">(Select all that apply)</p>
          <div className="space-y-1.5">
            {question.allRight.map((item, i) => {
              const isSelected = question.correctRight.includes(item);
              return (
                <div
                  key={i}
                  className={`p-2 rounded text-xs border ${
                    reveal && isSelected
                      ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                      : reveal && !isSelected
                      ? "border-zinc-200 bg-white/50 text-zinc-500"
                      : "border-zinc-200 bg-white/50 text-zinc-700"
                  }`}
                >
                  {reveal && isSelected && "✓ "}
                  {item}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ClozeView({ question, reveal }: { question: ClozeQuestion; reveal: boolean }) {
  // Split the text by blank markers and render
  const parts = question.text.split(/(\{\{blank\d+\}\})/);

  return (
    <div>
      <p className="text-base font-medium text-zinc-900 mb-3 leading-relaxed">
        {parts.map((part, i) => {
          const match = part.match(/\{\{blank(\d+)\}\}/);
          if (match) {
            const blankId = match[0];
            const blankNum = match[1];
            const blank = question.blanks.find((b) => `{{${b.id}}}` === blankId || b.id === blankNum);
            if (reveal && blank) {
              return (
                <span
                  key={i}
                  className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold border border-emerald-300"
                >
                  {blank.answer}
                </span>
              );
            }
            return (
              <span
                key={i}
                className="bg-zinc-100 text-zinc-400 px-3 py-0.5 rounded border border-dashed border-zinc-300"
              >
                [{blankNum}]
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </p>
      {question.blanks.map((blank, idx) => (
        <div key={idx} className="mb-2 p-3 bg-zinc-50 rounded-lg border border-zinc-200">
          <p className="text-xs font-semibold text-zinc-500 mb-1">
            Blank {blank.id} {blank.options ? "— choose one:" : ":"}
          </p>
          <div className="flex flex-wrap gap-2">
            {(blank.options || [blank.answer]).map((opt, oi) => {
              const isCorrect = reveal && opt === blank.answer;
              return (
                <span
                  key={oi}
                  className={`text-xs px-2 py-1 rounded border ${
                    reveal && isCorrect
                      ? "bg-emerald-100 border-emerald-300 text-emerald-800 font-semibold"
                      : "bg-white border-zinc-200 text-zinc-600"
                  }`}
                >
                  {isCorrect && reveal ? "✓ " : ""}
                  {opt}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function MatrixView({ question, reveal }: { question: MatrixQuestion; reveal: boolean }) {
  return (
    <div>
      <p className="text-base font-medium text-zinc-900 mb-3">{question.stem}</p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-600">
                &nbsp;
              </th>
              {question.columns.map((col, i) => (
                <th
                  key={i}
                  className="p-2 bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-600 text-center"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {question.rows.map((row, ri) => {
              const correctCol = question.correctMatches.find((m) => m.row === row)?.column;
              return (
                <tr key={ri}>
                  <td className="p-2 border border-zinc-200 text-sm text-zinc-800 font-medium">
                    {row}
                  </td>
                  {question.columns.map((col, ci) => {
                    const isMatch = correctCol === col;
                    return (
                      <td
                        key={ci}
                        className={`p-2 border border-zinc-200 text-center text-sm ${
                          reveal && isMatch
                            ? "bg-emerald-50 text-emerald-700 font-semibold"
                            : "text-zinc-400"
                        }`}
                      >
                        {reveal && isMatch ? "✓" : ""}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function QuestionCard({ question, index }: QuestionCardProps) {
  const [reveal, setReveal] = useState(false);

  const typeLabels: Record<string, string> = {
    "multiple-choice": "Multiple Choice",
    "case-study": "Case Study",
    "bow-tie": "Bow-Tie (Trend)",
    cloze: "Cloze (Fill-in-the-Blank)",
    matrix: "Matrix (Matching)",
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-zinc-50 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-sm font-medium text-zinc-700">
            {typeLabels[question.type] || question.type}
          </span>
        </div>
        <button
          onClick={() => setReveal(!reveal)}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
            reveal
              ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
              : "bg-zinc-50 text-zinc-600 border-zinc-300 hover:bg-zinc-100"
          }`}
        >
          {reveal ? "🔍 Hide Answer Key" : "🔍 Show Answer Key"}
        </button>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        {question.type === "multiple-choice" && <MCQView question={question as MCQQuestion} reveal={reveal} />}
        {question.type === "case-study" && <CaseStudyView question={question as CaseStudyQuestion} reveal={reveal} />}
        {question.type === "bow-tie" && <BowTieView question={question as BowTieQuestion} reveal={reveal} />}
        {question.type === "cloze" && <ClozeView question={question as ClozeQuestion} reveal={reveal} />}
        {question.type === "matrix" && <MatrixView question={question as MatrixQuestion} reveal={reveal} />}
      </div>

      {/* Rationale (visible when revealed) */}
      {reveal && question.rationale && (
        <div className="px-5 py-3 bg-amber-50 border-t border-amber-200">
          <p className="text-xs font-semibold text-amber-800 mb-1">📚 Rationale</p>
          <p className="text-sm text-amber-900">{question.rationale}</p>
        </div>
      )}
    </div>
  );
}
