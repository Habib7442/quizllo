"use client";
import React, { useEffect, useState } from "react";
import { fetchDocumentsByCollectionName } from "@/utils/firebase"; // Adjust the import path as necessary
import Quiz from "@/components/Quiz";
import { Loader } from "lucide-react";

interface FetchQuizByCategoryProps {
  params: {
    collectionId: string;
  };
}

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  imageUrl?: string; // optional field
  userId: string;
}

const FetchQuizByCategory: React.FC<FetchQuizByCategoryProps> = ({
  params,
}) => {
  const { collectionId } = params;
  const [documents, setDocuments] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await fetchDocumentsByCollectionName(
          collectionId
        );
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Question[];
        setDocuments(docs);
      } catch (err) {
        setError("Error fetching documents");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionId]);

  if (loading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader className="animate-spin" />
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Quiz
        questions={documents}
        loading={loading}
        collectionName={collectionId}
      />
    </div>
  );
};

export default FetchQuizByCategory;
