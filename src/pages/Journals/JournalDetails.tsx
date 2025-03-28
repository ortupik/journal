"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Loader from "../Common/Loader";

type JournalDetailsProps = {
  id: string;
  title: string;
  content: string;
  category: string;
  summary: string;
  sentiment: string;
  updatedAt: string;
};

// Category colors
const categoryColors: { [key: string]: string } = {
  Personal: "bg-teal-200 text-teal-800",
  Work: "bg-blue-200 text-blue-800",
  Travel: "bg-yellow-200 text-yellow-800",
  Health: "bg-red-200 text-red-800",
  Finance: "bg-green-200 text-green-800",
  Other: "bg-purple-200 text-purple-800",
};

// Sentiment colors (randomized shades)
const sentimentColorShades = {
  Positive: ["bg-green-100 text-green-700", "bg-green-200 text-green-800", "bg-teal-100 text-teal-700"],
  Neutral: ["bg-gray-100 text-gray-700", "bg-gray-200 text-gray-800", "bg-slate-100 text-slate-700"],
  Negative: ["bg-red-100 text-red-700", "bg-red-200 text-red-800", "bg-rose-100 text-rose-700"],
};

// Function to get a random sentiment color
const getRandomSentimentColor = (sentiment: string) => {
  const shades = sentimentColorShades[sentiment as keyof typeof sentimentColorShades];
  return shades ? shades[Math.floor(Math.random() * shades.length)] : "bg-gray-100 text-gray-700";
};

function JournalDetails() {
  const router = useRouter();
  const { id }  = useParams();
  const [journal, setJournal] = useState<JournalDetailsProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchJournal() {
      try {
        const response = await fetch(`/api/journal/${id}`);
        const data = await response.json();
        if (response.ok) {
          setJournal(data);
        } else {
          console.error("Failed to fetch journal details:", data.error);
          setIsError(true);
        }
      } catch (error) {
        console.error("Error fetching journal details:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) fetchJournal();
  }, [id]);

  if (isLoading) return <Loader wrapperCls="h-[calc(100vh-112px)]" />;
  if (isError || !journal) return <p className="text-center text-red-500">Journal not found!</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg border">
      <h1 className="text-2xl font-bold">{journal.title}</h1>
      <p className="text-gray-500 text-sm mt-1">
        {new Date(journal.updatedAt).toLocaleDateString()}
      </p>

      {/* Category & Sentiment Badges */}
      <div className="flex items-center gap-2 mt-3">
        <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[journal.category] || "bg-gray-200 text-gray-800"}`}>
          {journal.category}
        </span>

        <span className={`text-xs px-2 py-1 rounded-full ${getRandomSentimentColor(journal.sentiment)}`}>
          {journal.sentiment}
        </span>
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold text-gray-700">Summary:</h3>
        <p className="text-gray-800 text-sm mt-1">{journal.summary}</p>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-gray-700">Full Entry:</h3>
        <p className="text-gray-900 mt-2">{journal.content}</p>
      </div>

      <div className="mt-6 flex justify-between">
        <Link
          href="/dashboard/my-journals"
          className="text-gray-600 hover:text-blue-500 px-4 py-2 rounded-md border border-gray-300 hover:border-blue-500 transition text-sm"
        >
          ← Back to Journals
        </Link>

        <Link
          href={`/dashboard/edit-journal/${journal.id}`}
          className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md transition text-sm"
        >
          Edit Journal
        </Link>
      </div>
    </div>
  );
}

export default JournalDetails;
