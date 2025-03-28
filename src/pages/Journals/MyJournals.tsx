"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { getAllJournals } from "@/actions/journal";

import DeleteModal from "./DeleteModal";
import LoadMore from "../common/LoadMore";
import JournalCard from "./JournalCard"; 
import Loader from "../common/Loader";

type JournalResponse = {
  id: string;
  title: string;
  content: string;
  category: string;
  summary: string;
  sentiment: string;
  updatedAt: string;
};

function MyJournals() {
  const [journals, setJournals] = useState<JournalResponse[]>([]);
  const [modal, setModal] = useState("");
  const router = useRouter();

  const {
    isLoading,
    hasNextPage,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["journals"],
    queryFn: getAllJournals,
    getNextPageParam: (lastPage) => lastPage.length === 10,
    onSuccess: (data) => {
       setJournals(data.pages.flat() as JournalResponse[])
    },
   
   
  },
);

  const onDeleteBtnClk = (id: string) => setModal(id);
  const closeModal = () => setModal("");

  if (isLoading) return <Loader wrapperCls="h-[calc(100vh-112px)]" />;

  return (
    <>
      {journals?.map((journal) => (
        <JournalCard
          id={journal.id}
          key={journal.id}
          title={journal.title}
          content={journal.content}
          category={journal.category}
          summary={journal.summary}
          sentiment={journal.sentiment}
          date={journal.updatedAt}
          onDeleteBtnClk={() => onDeleteBtnClk(journal.id)}
          onCardClk={() => router.push(`/dashboard/journal/${journal.id}`)}
        />
      ))}

      {!isLoading && hasNextPage && !isFetching && (
        <LoadMore fn={() => fetchNextPage({ pageParam: journals.length })} />
      )}

      {isFetching && <Loader loaderCls=" w" />}

      {modal && <DeleteModal id={modal} closeModal={closeModal} />}
    </>
  );
}

export default MyJournals;
