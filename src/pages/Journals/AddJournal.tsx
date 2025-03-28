"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { createJournal, processAI, JournalEntryData } from "@/actions/journal";
import { successNotify, errorNotify } from "@/helpers/toastifyHlp";
import { PROMPTS } from "@/app/api/ai/prompts";
import Loader from "../common/Loader";

// ✅ Define the structure for AI API responses
interface AIResponse {
  result: string;
}


function AddJournal() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<JournalEntryData>({
    defaultValues: {
      title: "",
      content: "",
      category: "",
      sentiment: "",
      summary: "",
      suggestions: ""
    },
  });

  const router = useRouter();
  const content = watch("content");

  let categories = ["Personal", "Work", "Travel", "Health", "Other"];

  // ✅ Cache AI-generated suggestions to prevent redundant API calls
  const [suggestionCache, setSuggestionCache] = useState<Record<string, string>>({});

  // ✅ Mutation to fetch AI-generated suggestions for journal fields
  const { mutate: fetchAIResult, isLoading: isProcessingAI } = useMutation(
    async ({ promptKey, content }: { promptKey: keyof typeof PROMPTS; content: string }) => {
      return processAI<AIResponse>(promptKey, content);
    },
    {
      onSuccess: (data, variables) => {
        const { promptKey, content } = variables;

        if (promptKey === "category") {
          if(categories.includes(data.result)){
            setValue("category", data.result);
            setSuggestionCache((prev) => ({ ...prev, [content]: data.result }));
          }else{
            setValue("category", "Personal");
          }
          
        } else if (promptKey === "sentiment") {
          setValue("sentiment", data.result);
        } else if (promptKey === "summary") {
          setValue("summary", data.result);
        }else if(promptKey === "suggestions"){
          setValue("suggestions", data.result);
        }
      },
      onError: (error) => console.error("AI processing failed:", error),
    }
  );

  // ✅ Automatically fetch AI-generated suggestions when the content changes
  useEffect(() => {
    if (!content) return;

    const delay = setTimeout(() => {
      if (suggestionCache[content]) {
        setValue("category", suggestionCache[content]);
      } else {
        fetchAIResult({ content, promptKey: "category" });
      }

      fetchAIResult({ content, promptKey: "sentiment" });
      fetchAIResult({ content, promptKey: "summary" });
      fetchAIResult({ content, promptKey: "suggestions" });
    }, 500);

    return () => clearTimeout(delay);
  }, [content]);

  // ✅ Mutation for creating a new journal entry
  const { mutate: createJournalEntry, isLoading } = useMutation({
    mutationFn: createJournal,
    onSuccess: () => {
      successNotify("Your journal entry has been successfully created!");
      router.push("/dashboard/my-journals");
    },
    onError: (error) => {
      console.error("Failed to create journal:", error);
      errorNotify("Oops! Something went wrong while creating your journal. Please try again.");
    },
  });

  const submitJournal = (data: JournalEntryData) => {
    createJournalEntry(data);
  };

  if (isLoading ) return <Loader wrapperCls="h-[calc(100vh-112px)]" />;


  return (
    <form onSubmit={handleSubmit(submitJournal)} className="bg-white my-8 p-8 max-w-lg mx-auto rounded-md">
      <div className="mb-4">
        <label htmlFor="create-Category" className="text-sm font-medium">
          Category {isProcessingAI && <span className="text-xs text-gray-500">(Auto-suggesting...)</span>}
        </label>
        <select
          id="create-Category"
          {...register("category", { required: "Please select a category." })}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select a category</option>
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
          <option value="Travel">Travel</option>
          <option value="Health">Health</option>
          <option value="Other">Other</option>
        </select>
        {errors.category && <p className="mt-0.5 text-[13px] font-medium text-red-400">{errors.category.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="create-Title" className="text-sm font-medium">Title</label>
        <input
          id="create-Title"
          type="text"
          {...register("title", { required: "Please enter a title." })}
          className="w-full p-2 border rounded-md"
        />
        {errors.title && <p className="mt-0.5 text-[13px] font-medium text-red-400">{errors.title.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="create-Content" className="text-sm font-medium">Content</label>
        <textarea
          id="create-Content"
          rows={6}
          placeholder="What's on your mind?"
          {...register("content", { required: "Please write something in the content field." })}
          className="w-full p-2 border rounded-md"
        />
        {errors.content && <p className="mt-0.5 text-[13px] font-medium text-red-400">{errors.content.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="entry-suggestion" className="text-sm font-medium">Entry Suggestion</label>
        <textarea id="entry-suggestion" rows={4} readOnly {...register("suggestions")} className="w-full p-2 border rounded-md bg-gray-100" />
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium">Sentiment Analysis</label>
        <input type="text" readOnly {...register("sentiment")} className="w-full p-2 border rounded-md bg-gray-100" />
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium">Summary</label>
        <textarea rows={5} readOnly {...register("summary")} className="w-full p-2 border rounded-md bg-gray-100" />
      </div>

      <button type="submit" disabled={isLoading} className="text-sm bg-teal-600 text-white py-2 px-6 rounded-xl disabled:opacity-60">
        Create Journal
      </button>
    </form>
  );
}

export default AddJournal;