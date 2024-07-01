"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Suspense } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const searchParams = useSearchParams();
  const dataString = searchParams.get("data");

  if (!dataString) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        No data available
      </div>
    );
  }

  const data = JSON.parse(dataString);

  const { score, totalQuestions, userAnswers, questions } = data;

  const correctAnswers = questions.map((q: any) => q.answer);
  const labels = questions.map((_: any, index: number) => `Q${index + 1}`);

  const chartData = {
    labels,
    datasets: [
      {
        label: "User Answers",
        data: userAnswers.map((answer: string, index: number) =>
          answer === correctAnswers[index] ? 1 : 0
        ),
        backgroundColor: userAnswers.map((answer: string, index: number) =>
          answer === correctAnswers[index]
            ? "rgba(75, 192, 192, 0.6)"
            : "rgba(255, 99, 132, 0.6)"
        ),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Quiz Performance",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <Suspense>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-center">Quiz Analytics</h1>
        <div className="text-xl mb-4 text-center">
          Your score: <span className="font-semibold">{score}</span> out of{" "}
          <span className="font-semibold">{totalQuestions}</span>
        </div>
        <div className="mb-8">
          <Bar
            data={chartData}
            options={options}
            className="w-full h-96 sm:h-64 mx-auto"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Question Analysis</h2>
          {questions.map((q: any, index: number) => (
            <div
              key={index}
              className="mb-4 p-4 border border-blue-400 rounded-lg shadow-sm"
            >
              <p className="font-semibold text-lg text-purple">{q.question}</p>
              <p className="mt-2">
                <span className="font-semibold">Your answer:</span>{" "}
                {userAnswers[index]}
              </p>
              <p className="mt-1">
                <span className="font-semibold">Correct answer:</span>{" "}
                {q.answer}
              </p>
              {q.explanation && (
                <p className="mt-1 text-teal-600">
                  <span className="font-semibold">Explanation:</span>{" "}
                  {q.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Suspense>
  );
};

export default Analytics;
