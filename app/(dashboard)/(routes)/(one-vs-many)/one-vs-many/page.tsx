"use client";
import { Button } from "@/components/ui/button";
import { Copy, Loader2Icon, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { CustomDropdown } from "@/components/CustomDropdown";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const OneVsManyDashboard = () => {
  const [quizLoading, setQuizLoading] = useState(false);
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [topic, setTopic] = useState("");
  const [response, setResponse] = useState([]);
  const [roomCode, setRoomCode] = useState<string>("");

  const db = getFirestore();
  const auth = getAuth();
  const router = useRouter();

  const generateRoomCode = () => {
    const code = uuidv4().slice(0, 5);
    setRoomCode(code);
    return code;
  };

  const generateQuiz = async () => {
    try {
      if (!topic) {
        toast.error("Please provide topic of quiz");
        return;
      }
      setQuizLoading(true);
      const roomCode = generateRoomCode();
      const response = await axios.post("/api/quiz", {
        prompt: `You are an expert quiz generator. Generate ${numQuestions} number of questions with difficulty level ${difficulty} on the topic ${topic}. Follow these strict guidelines:

        1. Start each question with "Q: " followed by the question text.
        2. List 4 options for each question, starting each option with a), b), c), or d).
        3. Provide the correct answer after the options, starting with "A: " followed by the correct option letter.
        4. Provide a brief explanation for the correct answer, starting with "E: " followed by the explanation text.
        5. Separate each question with a blank line.
        6. Do not repeat same question, each question should be different.

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

      const quizData = response.data.response;
      console.log(quizData);

      // Save quiz data to Firestore
      const quizDoc = doc(collection(db, "onevsmany"), roomCode);
      await setDoc(quizDoc, {
        roomCode,
        quizData,
        createdAt: new Date(),
      });

      toast.success(
        "Quiz generated successfully. Share the room code to join."
      );
      setTopic("");
    } catch (error) {
      console.log(error);
    } finally {
      setQuizLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center gap-8">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-4 py-10 px-10 text-xl">
            Create <PlusCircle />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create quiz</DialogTitle>
            <DialogDescription>
              Create quiz with the help of AI.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Code
              </Label>
              <Input id="link" value={roomCode} placeholder="Joining code will be displayed here" readOnly />
              {/* <Button variant="outline" onClick={generateRoomCode}>Generate code</Button> */}
            </div>
          </div>
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
            placeholder="Provide topic for generating quiz"
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
              <Loader2Icon className="animate-spin text-center" />
            ) : (
              "Generate"
            )}
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-4 py-10 px-10 text-xl">
            Join <PlusCircle />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join Quiz</DialogTitle>
            <DialogDescription>
              Enter the code and join the quiz
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Code
              </Label>
              <Input
                id="link"
                placeholder="Enter joining code"
                onChange={(e) => setRoomCode(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={() => router.push(`/joinQuiz/${roomCode}`)}
              >
                Join Quiz
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OneVsManyDashboard;
