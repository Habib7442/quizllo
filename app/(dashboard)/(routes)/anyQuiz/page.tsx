"use client";
import { CustomDropdown } from "@/components/CustomDropdown";
import Quiz from "@/components/Quiz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const AnyQuiz = () => {
  const [loading, setLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [topic, setTopic] = useState("");
  const [response, setResponse] = useState([]);

  const generateQuiz = async () => {
    try {
      if (!topic) {
        toast.error("Please provide topic of quiz");
        return;
      }
      setQuizLoading(true);
      const response = await axios.post("/api/quiz", {
        prompt: `You are an expert quiz generator. Generate ${numQuestions} number of questions with difficulty level ${difficulty} on the topic ${topic}. Follow these strict guidelines:

        1. Start each question with "Q: " followed by the question text.
        2. List 4 options for each question, starting each option with a), b), c), or d).
        3. Provide the correct answer after the options, starting with "A: " followed by the correct option letter.
        4. Provide a brief explanation for the correct answer, starting with "E: " followed by the explanation text.
        5. Separate each question with a blank line.

        Example format:

        Q: What is the capital of France?
        a) London
        b) Berlin
        c) Paris
        d) Madrid
        A: c
        E: Paris is the capital and largest city of France, as well as its cultural and economic center.

        Q: Who wrote "Romeo and Juliet"?
        a) Charles Dickens
        b) William Shakespeare
        c) Jane Austen
        d) Mark Twain
        A: b
        E: William Shakespeare, an English playwright and poet of the late 16th and early 17th centuries, is widely regarded as the author of "Romeo and Juliet" and many other famous plays.

        Generate the quiz now.`,
      });

      // console.log(response.data, "ress");
      setResponse(response.data.response);
      setTopic("");
    } catch (error) {
      console.log(error);
    } finally {
      setQuizLoading(false);
    }
  };
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4">
      <h1 className="text-center mt-2 font-bold text-blue-200 text-3xl">
        Take Quiz on any topic
      </h1>
      <div className="w-full lg:w-[60vw]">
        <div className="flex flex-row justify-evenly items-center mt-4 gap-4">
          <CustomDropdown
            title="Select difficulty"
            data={["easy", "medium", "hard"]}
            onSelect={(value) => setDifficulty(value.toString())}
          />

          <CustomDropdown
            title="Select no. of questions"
            data={[5, 10, 15, 20]}
            onSelect={(value) => setNumQuestions(Number(value))}
          />
          <Button
            onClick={generateQuiz}
            variant="outline"
            className="w-full hidden lg:block lg:w-auto"
          >
            {quizLoading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              "Generate"
            )}
          </Button>
        </div>
        <Input
          placeholder="Provide topic"
          className="mt-4 w-full"
          onChange={(e) => setTopic(e.target.value)}
          required
        />
        <Button
            onClick={generateQuiz}
            variant="outline"
            className="w-full lg:w-auto lg:hidden block mt-2"
          >
            {quizLoading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              "Generate"
            )}
          </Button>
        <Quiz questions={response} loading={quizLoading} />
      </div>
    </div>
  );
};

export default AnyQuiz;
