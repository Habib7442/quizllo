"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import Quiz from "@/components/Quiz";

const JoinQuiz = ({ params }: any) => {
  const { roomCode } = params;
  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const db = getFirestore();
  const auth = getAuth();
  const router = useRouter();

  console.log(quizData?.quizData);

  useEffect(() => {
    fetchQuizData();
  }, []);

  const fetchQuizData = async () => {
    try {
      const quizDoc = await getDoc(doc(db, "onevsmany", roomCode));
      if (quizDoc.exists()) {
        setQuizData(quizDoc.data());
      } else {
        toast.error("Invalid room code");
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      toast.error("An error occurred while fetching the quiz data.");
    }
  };

  const joinQuiz = async () => {
    if (!quizData) {
      toast.error("No quiz data available.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in to join a quiz.");
      return;
    }

    const userId = user.uid;

    try {
      setLoading(true);
      const userJoinDocRef = doc(
        db,
        "onevsmany",
        roomCode,
        "joinedUsers",
        userId
      );
      const userJoinDoc = await getDoc(userJoinDocRef);

      if (userJoinDoc.exists()) {
        toast.error("You have already joined this quiz.");
        setLoading(false);
        return;
      }

      await setDoc(userJoinDocRef, {
        joinedAt: new Date(),
        userId: userId,
      });

      await updateDoc(doc(db, "onevsmany", roomCode), {
        [`joinedUsers.${userId}`]: true,
      });

      toast.success("You have successfully joined the quiz!");
      // Navigate to the quiz page or display quiz questions
    } catch (error) {
      console.error("Error joining quiz:", error);
      toast.error("An error occurred while joining the quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      {quizData ? (
        <div className="w-full h-screen flex justify-center items-center mt-14 mb-6">
          <Quiz
            questions={quizData?.quizData}
            collectionName={roomCode}
            loading={loading}
          />
        </div>
      ) : (
        <p>Loading quiz data...</p>
      )}
    </div>
  );
};

export default JoinQuiz;
