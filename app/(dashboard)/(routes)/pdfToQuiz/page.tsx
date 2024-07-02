"use client";
import { storage } from "@/utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import React, { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { FaUpload } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";
import { CustomDropdown } from "@/components/CustomDropdown";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import MagicButton from "@/components/ui/MagicButton";
import Quiz from "@/components/Quiz";
import toast from "react-hot-toast";
import axios from "axios";

import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/core/lib/styles/index.css";

const PdfToQuiz = () => {
  const [pdfUpload, setPdfUpload] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [pdfSnapshotUrl, setPdfSnapshotUrl] = useState<string>(
    "" || "/pdf.pdf"
  );
  const [loading, setLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [response, setResponse] = useState([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const uploadPdf = () => {
    if (pdfUpload === null) return;
    setLoading(true);
    const bucketName = "silken-dogfish-425903-h6.appspot.com";
    const fileName = pdfUpload.name;
    const filePath = `pdf-to-quiz/${fileName}`;
    const gcsUri = `gs://${bucketName}/${filePath}`;
    const pdfRef = ref(storage, filePath);
    const metadata = {
      contentType: "application/pdf",
      cacheControl: "public,max-age=3600",
    };

    uploadBytes(pdfRef, pdfUpload, metadata)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setPdfSnapshotUrl(url);
          setPdfUrl(gcsUri);
          toast.success("PDF uploaded successfully");
          setLoading(false);
          // generateQuiz(gcsUri);
        });
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        toast.error("Failed to upload PDF");
      });
  };

  const handlePdfChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();

      if (pageCount > 10) {
        toast.error(
          "The PDF has more than 10 pages. Please upload a smaller file."
        );
      } else {
        setPdfUpload(file);
      }
    }
  };

  const handlePdfClick = () => {
    fileInputRef.current?.click();
  };

  const generateQuiz = async (gcsUri: string) => {
    try {
      setQuizLoading(true);
      const response = await axios.post("/api/pdftoquiz", {
        prompt: `You are an expert quiz generator. Generate ${numQuestions} number of questions from the pdf attached with difficulty level ${difficulty}. Follow these strict guidelines:

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
        gcsUri: gcsUri,
      });

      // console.log(response.data, "ress");
      setResponse(response.data.response);
    } catch (error) {
      console.log(error);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleGenerateQuiz = () => {
    if (pdfUpload) {
      const bucketName = "silken-dogfish-425903-h6.appspot.com";
      const fileName = pdfUpload.name;
      const filePath = `pdf-to-quiz/${fileName}`;
      const gcsUri = `gs://${bucketName}/${filePath}`;

      generateQuiz(gcsUri);
    }
  };

  return (
    <>
      <h1 className="text-center mt-2 font-bold text-blue-200 text-3xl">
        PDF to Quiz
      </h1>
      <div className="w-full h-full flex flex-col lg:flex-row p-4">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <div className="left w-full lg:w-1/2 h-auto lg:h-screen">
            <div className="flex flex-col lg:flex-row justify-center items-center gap-4 mb-4">
              <div
                onClick={handlePdfClick}
                className="w-full lg:w-1/2 border mt-5 border-blue-400 rounded-lg text-center flex justify-center items-center cursor-pointer"
              >
                <span className="text-gray-100 py-2.5 flex gap-4 justify-center items-center">
                  Select PDF <FaPlusCircle />
                </span>
              </div>

              <MagicButton
                title={loading ? "Uploading" : "Upload PDF"}
                icon={<FaUpload />}
                position="right"
                handleClick={uploadPdf}
                otherClasses={!pdfUpload ? "hidden" : "block mb-[20px]"}
              />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePdfChange}
              className="hidden"
              accept="application/pdf"
            />

            <div className="h-64 lg:h-72 overflow-y-auto">
              <Viewer
                fileUrl={pdfSnapshotUrl}
                theme="dark"
                plugins={[defaultLayoutPluginInstance]}
              />
            </div>
          </div>
        </Worker>

        <div className="right w-full lg:w-1/2 h-auto lg:h-full flex flex-col justify-center items-center">
          <div className="flex flex-row justify-evenly items-center mt-4 gap-4">
            <CustomDropdown
              title="Select difficulty"
              data={["easy", "medium", "hard"]}
              onSelect={(value) => setDifficulty(value.toString())}
            />

            <CustomDropdown
              title="Select no. of questions"
              data={[5, 10, 15]}
              onSelect={(value) => setNumQuestions(Number(value))}
            />
            <Button
              onClick={handleGenerateQuiz}
              className="w-full hidden lg:block"
              variant="outline"
            >
              {quizLoading ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                "Generate"
              )}
            </Button>
          </div>
          <Button
            onClick={handleGenerateQuiz}
            className="mt-2 w-full lg:hidden"
            variant="outline"
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
    </>
  );
};

export default PdfToQuiz;
