import AddJournal from '@/components/journal/AddJournal';
import { ScrollArea } from '@/components/ui/scroll-area';

function Page() {
  return (
    <ScrollArea className='h-[calc(100dvh-50px)]'>
      <AddJournal />
    </ScrollArea>
  );
}

export default Page;
