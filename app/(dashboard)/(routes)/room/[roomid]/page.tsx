"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { collection, addDoc, query, onSnapshot } from "firebase/firestore";
import { db } from "@/utils/firebase";

const Room = ({ params }: any) => {
  const router = useRouter();
  const { roomId } = params;
  const [socket, setSocket] = useState(null);
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.emit("join_room", roomId);

    return () => newSocket.close();
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      const q = query(collection(db, `rooms/${roomId}/questions`));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedQuestions: any = [];
        querySnapshot.forEach((doc) => {
          fetchedQuestions.push(doc.data());
        });
        setQuestions(fetchedQuestions);
      });

      return () => unsubscribe();
    }
  }, [roomId]);

  const submitQuestion = async () => {
    if (question) {
      const questionData = { text: question, createdAt: new Date() };
      await addDoc(collection(db, `rooms/${roomId}/questions`), questionData);

      socket.emit("new_question", roomId, questionData);
      setQuestion("");
    }
  };

  return (
    <div>
      <h1>Room: {roomId}</h1>
      <div>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter a question"
        />
        <button onClick={submitQuestion}>Submit Question</button>
      </div>
      <div>
        {questions.map((q, index) => (
          <div key={index}>
            <p>{q.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Room;
