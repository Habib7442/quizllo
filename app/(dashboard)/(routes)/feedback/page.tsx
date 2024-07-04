"use client";
import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { Loader, Star } from "lucide-react";
import { saveFeedback } from "@/utils/firebase";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const Feedback = () => {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStarClick = (star: number) => {
    setStars(star);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const feedbackData = {
        stars,
        comment,
        displayName: user.displayName,
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL || '',
        timestamp: new Date().toISOString(),
      };

      await saveFeedback(feedbackData);
      setStars(0);
      setComment("");
      toast.success("Feedback submitted successfully!");
      setLoading(false);
    } else {
      toast.error("You must be logged in to submit feedback.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center p-4">
      <h2 className="text-center mt-2 font-bold text-purple text-3xl mb-4">
        Give Your Feedback
      </h2>
      <div className="bg-slate-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="star-rating flex justify-center cursor-pointer space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => handleStarClick(star)}
                className={`w-8 h-8 ${
                  star <= stars ? "text-yellow-500" : "text-gray-400"
                }`}
              />
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your feedback here..."
            required
            className="border border-gray-300 rounded-md p-2 w-full h-32 focus:outline-none focus:border-blue-500"
          ></textarea>
          <Button
            variant="outline"
            type="submit"
            className="bg-blue-300 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            {loading ? <Loader className="animate-spin" /> : "Submit Feedback"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
