"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

type QuizProps = {
  questions: Question[];
  loading: boolean;
  collectionName: string;
};

const Quiz = ({ questions, loading, collectionName }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [canTakeQuiz, setCanTakeQuiz] = useState(false);

  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();

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
      setTimeLeft(20);
    }
  }, [questions, currentQuestion]);

  useEffect(() => {
    if (collectionName) {
      checkQuizEligibility();
    }
  }, [collectionName]);

  const checkQuizEligibility = async () => {
    const user = auth.currentUser;
    if (user) {
      const leaderboardRef = collection(
        db,
        "leaderboard",
        collectionName,
        "scores"
      );
      const userDocRef = doc(leaderboardRef, user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const lastQuizTimestamp = userDoc.data()?.timestamp?.toDate();
        if (lastQuizTimestamp) {
          const currentTime = new Date();
          const timeDifference =
            currentTime.getTime() - lastQuizTimestamp.getTime();
          const hoursDifference = timeDifference / (1000 * 60 * 60);

          if (hoursDifference < 48) {
            setCanTakeQuiz(false);
            return;
          }
        }
      }
    }
    setCanTakeQuiz(true);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const calculateFinalScore = (
    userAnswers: string[],
    questions: Question[]
  ) => {
    return userAnswers.reduce((score, answer, index) => {
      return answer === questions[index]?.answer ? score + 1 : score;
    }, 0);
  };

  const handleNextQuestion = async () => {
    const answer = selectedOption || "";
    const updatedUserAnswers = [...userAnswers, answer];

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setUserAnswers(updatedUserAnswers);
      setSelectedOption(null);
      setTimeLeft(20); // Reset timer for next question
    } else {
      setUserAnswers(updatedUserAnswers);
      setShowScore(true);

      const finalScore = calculateFinalScore(updatedUserAnswers, questions);
      setScore(finalScore);

      // Save user score in Firestore if collectionName is provided
      const user = auth.currentUser;
      if (collectionName && user) {
        const userScoreData = {
          name: user.displayName,
          img: user.photoURL || "",
          score: finalScore,
          totalQuestions: questions?.length,
          timestamp: serverTimestamp(),
        };
        const leaderboardRef = collection(
          db,
          "leaderboard",
          collectionName,
          "scores"
        );
        const userDocRef = doc(leaderboardRef, user.uid);
        await setDoc(userDocRef, userScoreData);
      }

      // Pass the data to the analytics page
      const data = {
        score: finalScore,
        totalQuestions: questions.length,
        userAnswers: updatedUserAnswers,
        questions,
      };
      const query = new URLSearchParams({
        data: JSON.stringify(data),
      }).toString();
      router.push(`/analytics?${query}`);
    }
  };

  if (!canTakeQuiz && collectionName) {
    return (
      <div className="w-full h-[70vh] flex justify-center items-center">
        <h1 className="text-center text-2xl font-bold text-purple">
          You have already taken this quiz. Please wait 48 hours to retake.
        </h1>
      </div>
    );
  }

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
            <p className="text-lg">Please wait redirecting...</p>
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
                (option: string, index: number) => (
                  <Button
                    variant="outline"
                    key={index}
                    className={`px-4 py-12 lg:py-4 rounded-md border text-center
              ${
                selectedOption === option
                  ? "bg-teal-500 text-white"
                  : "bg-transparent text-purple-300"
              }
              hover:bg-gray-800 transition-colors duration-300 ease-in-out`}
                    onClick={() => handleOptionClick(option)}
                    style={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
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
