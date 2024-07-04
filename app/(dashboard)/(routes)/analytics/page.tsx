"use client";
import React, { Suspense, useRef } from "react";
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsContent = () => {
  const searchParams = useSearchParams();
  const dataString = searchParams.get("data");
  const contentRef = useRef<HTMLDivElement>(null);

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

  const generatePDF = async () => {
    const input = contentRef.current;

    if (input) {
      const canvas = await html2canvas(input, {
        backgroundColor: "#000000",
        scale: 2,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Calculate the number of pages needed
      const pageHeight = pdf.internal.pageSize.getHeight();
      const totalPages = Math.ceil(pdfHeight / pageHeight);

      // Add each page to the PDF
      for (let i = 0; i < totalPages; i++) {
        const pageCanvas = await html2canvas(input, {
          backgroundColor: "#000000", // Ensure each page has a black background
          scale: 2,
          y: -i * pageHeight * 2,
        });

        const pageImgData = pageCanvas.toDataURL("image/png");

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(pageImgData, "PNG", 0, 0, pdfWidth, pageHeight);
      }

      pdf.save("analytics.pdf");
    } else {
      console.error("Element not found");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-black text-white">
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
      <div ref={contentRef}>
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
              <span className="font-semibold">Correct answer:</span> {q.answer}
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
      <div className="text-center mt-8">
        <button
          onClick={generatePDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save as PDF
        </button>
      </div>
    </div>
  );
};

const Analytics = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen text-gray-500">
          Loading...
        </div>
      }
    >
      <AnalyticsContent />
    </Suspense>
  );
};

export default Analytics;
