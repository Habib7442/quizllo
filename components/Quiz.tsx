"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

type QuizProps = {
  questions: Question[];
  loading: boolean;
};

const Quiz = ({ questions, loading }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (isTimerRunning) {
      const timer = setTimeout(() => {
        if (timeLeft > 0) {
          setTimeLeft(timeLeft - 1);
        } else {
          handleNextQuestion();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isTimerRunning]);

  useEffect(() => {
    if (questions.length > 0 && !isTimerRunning) {
      setIsTimerRunning(true);
      setTimeLeft(15);
    }
  }, [questions, currentQuestion]);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    const answer = selectedOption || "";
    const updatedUserAnswers = [...userAnswers, answer];

    if (selectedOption === questions[currentQuestion]?.answer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setUserAnswers(updatedUserAnswers);
      setSelectedOption(null);
      setTimeLeft(15); // Reset timer for next question
    } else {
      setUserAnswers(updatedUserAnswers);
      setShowScore(true);
      // Pass the data to the analytics page
      const data = {
        score,
        totalQuestions: questions.length,
        userAnswers: updatedUserAnswers, // Use updatedUserAnswers here
        questions,
      };
      const query = new URLSearchParams({
        data: JSON.stringify(data),
      }).toString();
      router.push(`/analytics?${query}`);
    }
  };

  if (questions && questions.length === 0) {
    return (
      <div className="w-full h-[70vh] flex justify-center items-center">
        {loading ? (
          <Loader className="animate-spin" />
        ) : (
          <h1 className="text-center text-2xl font-bold text-purple">
            Please Generate Quiz
          </h1>
        )}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-2">
      <div className="shadow-md rounded-lg p-6 max-w-lg w-full border border-blue-300">
        {showScore ? (
          <div className="text-center flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
            <p className="text-lg">
              You scored {score} out of {questions.length}
            </p>
            <Button variant="outline" asChild className="w-full mt-5">
              <Link href="/analytics">Go to analytics</Link>
            </Button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="text-lg font-medium mb-2">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <div
                className="text-xl font-semibold"
                style={{ userSelect: "none" }}
              >
                {questions[currentQuestion]?.question}
              </div>
            </div>
            <div className="grid gap-4 mb-6">
              {questions[currentQuestion]?.options.map(
                (option: any, index: any) => (
                  <Button
                    variant="outline"
                    key={index}
                    className={`px-4 py-2 rounded-md border ${
                      selectedOption === option
                        ? "bg-teal-500 text-white"
                        : "bg-transparent text-purple-300"
                    } hover:bg-gray-800`}
                    onClick={() => handleOptionClick(option)}
                    style={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    {option}
                  </Button>
                )
              )}
            </div>
            <div className="text-center mb-4">
              Time left: {timeLeft} seconds
            </div>
            <button
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              onClick={handleNextQuestion}
              disabled={!selectedOption}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
