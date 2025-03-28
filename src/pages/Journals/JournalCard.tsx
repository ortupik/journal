"use client";

import Link from "next/link";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";

type JournalProps = {
  id: string;
  title: string;
  content: string;
  category: string;
  summary: string;
  sentiment: string;
  date: string;
  wrapperCls?: string;
  onDeleteBtnClk: () => void;
  onCardClk: () => void;
};

const categoryColors: { [key: string]: string } = {
  Personal: "bg-orange-100 text-orange-800",
  Work: "bg-blue-100 text-blue-800",
  Travel: "bg-yellow-100 text-yellow-800",
  Health: "bg-red-100 text-red-800",
  Other: "bg-purple-100 text-purple-800",
};

const sentimentColors: { [key: string]: string } = {
  Positive: "bg-green-100 text-green-800 border border-green-300",
  Neutral: "bg-gray-100 text-gray-800 border border-gray-300",
  Negative: "bg-red-100 text-red-800 border border-red-300",
};

function JournalCard({
  id,
  title,
  content,
  category,
  summary,
  sentiment,
  date,
  onDeleteBtnClk = () => {},
  onCardClk = () => {},
  wrapperCls = "my-6 max-w-2xl mx-auto p-6 rounded-xl border border-gray-300 shadow-md hover:shadow-lg transition cursor-pointer",
}: JournalProps) {
  return (
    <div className={wrapperCls} onClick={onCardClk}>
      <div className="flex justify-between items-center mb-2">
        <p className={`text-xs px-3 py-1 rounded-full font-medium ${categoryColors[category] || "bg-gray-100 text-gray-700"}`}>
          {category}
        </p>
        <p className={`text-xs px-3 py-1 rounded-full font-medium ${sentimentColors[sentiment] || "bg-gray-100 text-gray-700"}`}>
          {sentiment}
        </p>
      </div>

      <p className="text-xs text-gray-500">{new Date(date).toLocaleDateString()}</p>
      <h2 className="font-semibold text-lg text-gray-900 mt-1">{title}</h2>

      <p className="text-gray-700 text-sm mt-2">{summary}</p>

      <div className="flex justify-end gap-2 mt-4">
        <Link
          href={`/dashboard/edit-journal/${id}`}
          className="flex items-center text-xs px-3 py-1 border rounded-md text-blue-600 border-blue-300 hover:bg-blue-100 transition"
          onClick={(e) => e.stopPropagation()} 
        >
          <PencilSquareIcon className="w-4 h-4 text-blue-500 mr-1" />
          Edit
        </Link>

        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent parent click
            onDeleteBtnClk();
          }}
          className="flex items-center text-xs px-3 py-1 border rounded-md text-red-600 border-red-300 hover:bg-red-100 transition"
        >
          <TrashIcon className="w-4 h-4 text-red-500 mr-1" />
          Delete
        </button>
      </div>
    </div>
  );
}

export default JournalCard;
