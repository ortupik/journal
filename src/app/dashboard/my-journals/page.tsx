"use client"; 

import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import MyJournals from '@/pages/Journals/MyJournals';


// Placeholder components since original imports are not supported
const PageContainer = ({ children }) => (
  <div className="container mx-auto px-4 max-w-4xl">
    {children}
  </div>
);




export default function OverViewLayout() {
  const router = useRouter();

  const handleAddJournal = () => {
    router.push('/dashboard/create-journal');
  };
  return (
    <PageContainer>
      <div className="sticky top-0 z-20 bg-white shadow-sm">
        <h2 className='text-2xl text-center font-bold tracking-tight py-4'>
          Hi, Welcome back 👋
        </h2>
        <div className="flex justify-center pb-2">
          <Button 
            onClick={handleAddJournal} 
            className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-5 w-5" />
            Add Journal
          </Button>
        </div>
      </div>
      
      <ScrollArea className='h-[calc(100dvh-200px)]'>
        <div className='w-full'>
          <MyJournals />
        </div>
      </ScrollArea>
    </PageContainer>
  );
}