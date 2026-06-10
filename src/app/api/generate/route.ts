import { NextRequest, NextResponse } from "next/server";
import { generateQuestions } from "@/lib/gemini";
import type { GenerateRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();

    // Validate required fields
    if (!body.topic || !body.topic.trim()) {
      return NextResponse.json(
        { questions: [], error: "Please provide a topic" },
        { status: 400 }
      );
    }

    if (!body.questionType) {
      return NextResponse.json(
        { questions: [], error: "Please select a question type" },
        { status: 400 }
      );
    }

    // Validate count
    const count = Math.min(Math.max(1, body.count || 1), 5);
    body.count = count;

    const questions = await generateQuestions(body);

    return NextResponse.json({ questions });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Generate API Error:", message);
    return NextResponse.json(
      { questions: [], error: message },
      { status: 500 }
    );
  }
}
