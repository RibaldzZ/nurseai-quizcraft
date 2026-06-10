import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GenerateRequest, GeneratedQuestion } from "./types";

const apiKey = process.env.GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(apiKey);

// Build the prompt based on question type
function buildPrompt(params: GenerateRequest): string {
  const { topic, questionType, difficulty, count } = params;

  const jsonSchema = getSchemaForType(questionType);

  return `You are an expert nursing educator creating Next Generation NCLEX (NGN) style questions.

TOPIC: ${topic}
QUESTION TYPE: ${questionType}
DIFFICULTY: ${difficulty}
NUMBER OF QUESTIONS: ${count}

CRITICAL REQUIREMENTS:
1. Questions must be clinically accurate and reflect current evidence-based practice
2. Use realistic patient scenarios with appropriate vital signs, lab values, and assessment data
3. Distractors (wrong answers) should be plausible but clearly incorrect
4. Rationales should explain WHY the correct answer is right and WHY others are wrong
5. Map to Bloom's Taxonomy: use "analyze" and "apply" level thinking
6. Follow NGN formatting conventions
7. For options arrays, ALWAYS use the format: [{"letter": "A", "text": "option text"}, ...]

You MUST return a valid JSON object exactly matching this TypeScript schema:

${jsonSchema}

IMPORTANT:
- Return ONLY valid JSON. No markdown formatting, no code blocks, no \`\`\`json markers, just raw JSON.
- "options" must ALWAYS be an array of objects with "letter" and "text" properties
- Do NOT include any text before or after the JSON`;
}

function getSchemaForType(type: string): string {
  const schemas: Record<string, string> = {
    "multiple-choice": `{
  "questions": [
    {
      "type": "multiple-choice",
      "stem": "Question text here",
      "options": [
        {"letter": "A", "text": "First option"},
        {"letter": "B", "text": "Second option"},
        {"letter": "C", "text": "Third option"},
        {"letter": "D", "text": "Fourth option"}
      ],
      "correctAnswer": "B",
      "rationale": "Explanation of why B is correct and others are wrong"
    }
  ]
}`,
    "case-study": `{
  "questions": [
    {
      "type": "case-study",
      "scenario": "Clinical scenario with patient history, vitals, presentation",
      "question": "What is the nurse's priority action?",
      "options": [
        {"letter": "A", "text": "First option"},
        {"letter": "B", "text": "Second option"},
        {"letter": "C", "text": "Third option"},
        {"letter": "D", "text": "Fourth option"}
      ],
      "correctAnswer": "C",
      "rationale": "Explanation of why C is correct"
    }
  ]
}`,
    "bow-tie": `{
  "questions": [
    {
      "type": "bow-tie",
      "scenario": "Clinical scenario here",
      "allLeft": ["Condition/risk 1", "Condition/risk 2", "Condition/risk 3", "Condition/risk 4"],
      "correctLeft": ["Condition/risk 1", "Condition/risk 3"],
      "allCenter": ["Action 1", "Action 2", "Action 3", "Action 4"],
      "correctCenter": "Action 2",
      "allRight": ["Outcome 1", "Outcome 2", "Outcome 3", "Outcome 4"],
      "correctRight": ["Outcome 1", "Outcome 4"],
      "rationale": "Explanation here"
    }
  ]
}`,
    "cloze": `{
  "questions": [
    {
      "type": "cloze",
      "text": "The patient with {{blank1}} is at risk for {{blank2}}. The nurse should monitor {{blank3}}.",
      "blanks": [
        {"id": "1", "answer": "correct answer", "options": ["option1", "option2", "option3", "correct answer"]},
        {"id": "2", "answer": "correct answer", "options": ["option1", "option2", "correct answer", "option4"]},
        {"id": "3", "answer": "correct answer", "options": ["option1", "correct answer", "option3", "option4"]}
      ],
      "rationale": "Explanation here"
    }
  ]
}`,
    "matrix": `{
  "questions": [
    {
      "type": "matrix",
      "stem": "Match each condition to the correct intervention:",
      "rows": ["Condition A", "Condition B", "Condition C"],
      "columns": ["Intervention 1", "Intervention 2", "Intervention 3"],
      "correctMatches": [
        {"row": "Condition A", "column": "Intervention 2"},
        {"row": "Condition B", "column": "Intervention 1"},
        {"row": "Condition C", "column": "Intervention 3"}
      ],
      "rationale": "Explanation here"
    }
  ]
}`,
  };

  return schemas[type] || schemas["multiple-choice"];
}

/** Normalize AI response to match expected types */
function normalizeQuestions(questions: Record<string, unknown>[]): Record<string, unknown>[] {
  return questions.map((q) => {
    const normalized: Record<string, unknown> = { ...q };

    // Ensure options arrays are properly formed
    if (normalized.options && typeof normalized.options === "string") {
      try { normalized.options = JSON.parse(normalized.options as string); }
      catch { normalized.options = []; }
    }
    if (normalized.options && !Array.isArray(normalized.options)) {
      normalized.options = [];
    }

    // Ensure correctLeft/correctRight/allLeft/allCenter/allRight are arrays for bow-tie
    const arrayFields = ["correctLeft", "correctRight", "allLeft", "allCenter", "allRight"];
    for (const field of arrayFields) {
      const val = normalized[field];
      if (val && typeof val === "string") {
        try { normalized[field] = JSON.parse(val); }
        catch { normalized[field] = []; }
      }
      if (val && !Array.isArray(val)) {
        normalized[field] = [val];
      }
    }

    // Normalize cloze blanks
    if (normalized.blanks && typeof normalized.blanks === "string") {
      try { normalized.blanks = JSON.parse(normalized.blanks as string); } catch { normalized.blanks = []; }
    }

    // Normalize correctMatches for matrix
    if (normalized.correctMatches && typeof normalized.correctMatches === "string") {
      try { normalized.correctMatches = JSON.parse(normalized.correctMatches as string); } catch { normalized.correctMatches = []; }
    }

    return normalized;
  });
}

export async function generateQuestions(params: GenerateRequest): Promise<GeneratedQuestion[]> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
  });

  const prompt = buildPrompt(params);
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  // Clean the response - remove markdown code blocks if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    // Remove the first ``` line and last ``` line
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/, "");
  }

  try {
    const parsed = JSON.parse(cleaned);
    if (parsed.questions && Array.isArray(parsed.questions)) {
      return normalizeQuestions(parsed.questions) as unknown as GeneratedQuestion[];
    }
    throw new Error("Response did not contain questions array");
  } catch {
    throw new Error(
      `Failed to parse AI response as JSON. Raw response: ${text.substring(0, 500)}...`
    );
  }
}
