import { VertexAI } from "@google-cloud/vertexai";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  try {
    const body = await req.json();
    const { prompt } = body;

    console.log(prompt);

    const vertexAI = new VertexAI({
      project: process.env.VERTEX_AI_PROJECT_ID,
      location: "us-central1",
    });

    const generativeModel = vertexAI.getGenerativeModel({
      model: "gemini-1.5-flash-001",
    });

    const textPart = {
      text: prompt,
    };

    const request = {
      contents: [{ role: "user", parts: [textPart] }],
    };

    const result = await generativeModel.generateContent(request);
    const response = await result.response;

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No candidates found in the response");
    }

    const botMessage = response.candidates[0].content.parts[0].text;

    console.log(botMessage);

    if (!botMessage) {
      throw new Error("Bot message is undefined");
    }

    const questions = processQuizData(botMessage);

    console.log(questions);

    return NextResponse.json({ response: questions });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

function processQuizData(data: string): Array<{
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}> {
  const questions: Array<{
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  }> = [];

  const questionBlocks = data.split("\n\n");

  for (const block of questionBlocks) {
    const lines = block.split("\n");
    if (lines.length >= 7) {
      // Q + 4 options + A + E
      const question = lines[0].replace("Q: ", "").trim();
      const options = lines
        .slice(1, 5)
        .map((line) => line.replace(/^[a-d]\)\s*/, "").trim());
      const answerLetter = lines[5].replace("A: ", "").trim();
      const answerIndex = answerLetter.charCodeAt(0) - "a".charCodeAt(0);
      const answer = options[answerIndex];
      const explanation = lines[6].replace("E: ", "").trim();

      questions.push({ question, options, answer, explanation });
    }
  }

  return questions;
}
