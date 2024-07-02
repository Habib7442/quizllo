export const maxDuration = 20;
import {
  VertexAI,
  Part,
  GenerateContentRequest,
  GenerateContentResult,
} from "@google-cloud/vertexai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";


export async function POST(req: any) {
  try {
    const body = await req.json();
    const { prompt, gcsUri } = body;

    console.log(prompt);

    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

    if (!credentialsJson) {
      throw new Error("Service account credentials are not set");
    }

    // Write the service account JSON to a temporary file
    const tempFilePath = path.join("/tmp", "service-account.json");
    fs.writeFileSync(tempFilePath, credentialsJson);

    // Set the GOOGLE_APPLICATION_CREDENTIALS environment variable to the temporary file path
    process.env.GOOGLE_APPLICATION_CREDENTIALS = tempFilePath;
    const vertexAI = new VertexAI({
      project: process.env.VERTEX_AI_PROJECT_ID,
      location: "us-central1",
    });

    const generativeModel = vertexAI.getGenerativeModel({
      model: "gemini-1.5-flash-001",
    });

    const filePart: Part = {
      fileData: {
        fileUri: gcsUri,
        mimeType: "application/pdf",
      },
    };

    const textPart: Part = {
      text: prompt,
    };

    const request: GenerateContentRequest = {
      contents: [{ role: "user", parts: [filePart, textPart] }],
    };

    const result: GenerateContentResult = await generativeModel.generateContent(
      request
    );

    if (
      !result ||
      !result.response.candidates ||
      result.response.candidates.length === 0
    ) {
      throw new Error("No candidates found in the response");
    }

    const botMessage = result.response.candidates[0].content.parts[0].text;

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
