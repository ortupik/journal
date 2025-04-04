import { ScrollArea } from '@/components/ui/scroll-area';
import Summary from '@/components/journal/SummaryView';

function Page() {
  return (
    <ScrollArea className='h-[calc(100dvh-50px)]'>
      {' '}
      <Summary />
    </ScrollArea>
  );
}

export default Page;
