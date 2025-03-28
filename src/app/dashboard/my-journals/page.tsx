'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import MyJournals from '@/components/journal/MyJournals';

// Placeholder components since original imports are not supported
const PageContainer: React.FC<{ children: React.ReactNode }> = ({
  children
}) => <div className='container mx-auto max-w-4xl px-4'>{children}</div>;

export default function OverViewLayout() {
  const router = useRouter();

  const handleAddJournal = () => {
    router.push('/dashboard/create-journal');
  };
  return (
    <PageContainer>
      <div className='sticky top-0'>
        <h2 className='py-4 text-center text-2xl font-bold tracking-tight'>
          Hi, Welcome back 👋
        </h2>
        <div className='flex justify-center pb-2'>
          <Button
            onClick={handleAddJournal}
            className='bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2'
          >
            <Plus className='h-5 w-5' />
            New Journal Entry
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
