import { ScrollArea } from '@/components/ui/scroll-area';
import EditJournal from '@/pages/Journals/EditJournal';

function Page() {
  return (
    <ScrollArea className='h-[calc(100dvh-50px)]'>
      <EditJournal />
    </ScrollArea>
  );
}

export default Page;
