"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import { collection, getDocs, getFirestore } from "firebase/firestore";

export function Testimonials() {
  const [feedback, setFeedback] = useState<any[]>([]);

  const fetchFeedback = async () => {
    const db = getFirestore();
    const feedbackCollection = collection(db, "feedback");
    try {
      const querySnapshot = await getDocs(feedbackCollection);
      const feedbackList = querySnapshot.docs.map((doc) => doc.data());
      setFeedback(feedbackList);
      return feedbackList;
    } catch (error) {
      console.error("Error fetching feedback: ", error);
      return [];
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    <div className=" rounded-md flex flex-col antialiased bg-white dark:bg-black-100 items-center justify-center relative overflow-hidden">
      <div className="h-screen w-full dark:bg-black-100 bg-white dark:bg-grid-white/[0.1] bg-grid-black/[0.1] bg-[length:20px_20px] absolute left-0 top-0 flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>
      <InfiniteMovingCards
        items={feedback.map((item) => ({
          quote: item.comment,
          name: item.displayName,
          title: item.email,
          stars: item.stars,
          img: item.photoURL
        }))}
        direction="right"
        speed="fast"
      />
    </div>
  );
}
