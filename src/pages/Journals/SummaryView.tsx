'use client';

import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { getAllJournals } from '@/actions/journal';
import Loader from '../common/Loader';
import ErrorBoundary from '../common/ErrorBoundary';
import { ScrollArea } from '@/components/ui/scroll-area';

// Date Range Picker Component
import DateRangePicker from '../common/DateRangePicker';

// Visualization Components
import CategoryDistribution from './charts/CategoryDistribution';
import WordCountTrends from './charts/WordCountTrends';
import TimeOfDayAnalysis from './charts/TimeOfDayAnalysis';
import WordCloudChart from './charts/WordCloudChart';
import EntryFrequencyHeatmap from './charts/EntryFrequencyHeatmap';
import AvgEntryLength from './charts/AvgEntryLength';
import MoodDistribution from './charts/MoodDistribution';

// Enhanced Type Definitions
interface JournalEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  updatedAt: string;
  sentiment?: string; // Optional mood tracking
}

interface DateRange {
  start: Date;
  end: Date;
}

// Utility Functions for Data Processing
const processJournalData = (entries: JournalEntry[], dateRange?: DateRange) => {
  const filteredEntries = dateRange
    ? entries.filter((entry) =>
        isWithinInterval(parseISO(entry.updatedAt), dateRange)
      )
    : entries;

  return {
    categoryDistribution: calculateCategoryDistribution(filteredEntries),
    wordTrends: calculateWordTrends(filteredEntries),
    timeOfDayData: calculateTimeOfDayData(filteredEntries),
    wordCloudData: calculateWordCloudData(filteredEntries),
    avgEntryLengthData: calculateAvgEntryLength(filteredEntries),
    entryFrequencyArray: calculateEntryFrequency(filteredEntries),
    moodDistribution: calculateMoodDistribution(filteredEntries)
  };
};

// Detailed Data Processing Functions
const calculateCategoryDistribution = (entries: JournalEntry[]) =>
  entries.reduce(
    (acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

const calculateWordTrends = (entries: JournalEntry[]) =>
  entries.map((entry) => ({
    date: format(parseISO(entry.updatedAt), 'yyyy-MM-dd'),
    words: entry.content.split(/\s+/).length
  }));

const calculateTimeOfDayData = (entries: JournalEntry[]) =>
  Object.entries(
    entries.reduce(
      (acc, entry) => {
        const hour = parseISO(entry.updatedAt).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>
    )
  ).map(([hour, count]) => ({
    hour: Number(hour),
    count
  }));

const calculateWordCloudData = (entries: JournalEntry[]) => {
  const wordCounts = entries
    .flatMap((entry) => entry.content.toLowerCase().split(/\s+/))
    .filter((word) => word.length > 2) // Filter out short words
    .reduce(
      (acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

  return Object.entries(wordCounts)
    .map(([text, value]) => ({ text, value: Number(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 50); // Limit to top 50 words
};

const calculateAvgEntryLength = (entries: JournalEntry[]) =>
  Object.entries(
    entries.reduce<Record<string, { totalWords: number; count: number }>>(
      (acc, entry) => {
        const wordCount = entry.content.split(/\s+/).length;
        if (!acc[entry.category]) {
          acc[entry.category] = { totalWords: 0, count: 0 };
        }
        acc[entry.category].totalWords += wordCount;
        acc[entry.category].count += 1;
        return acc;
      },
      {}
    )
  ).map(([category, { totalWords, count }]) => ({
    category,
    avgWords: count ? totalWords / count : 0
  }));

const calculateEntryFrequency = (entries: JournalEntry[]) => {
  const entryFrequencyData = entries.reduce<Record<string, number>>(
    (acc, entry) => {
      const date = format(parseISO(entry.updatedAt), 'yyyy-MM-dd');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {}
  );

  return Object.entries(entryFrequencyData)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const calculateMoodDistribution = (entries: JournalEntry[]) => {
  return entries.reduce<Record<string, number>>((acc, entry) => {
    if (entry.sentiment) {
      acc[entry.sentiment] = (acc[entry.sentiment] || 0) + 1;
    }
    return acc;
  }, {});
};

// Main Summary View Component
const SummaryView: React.FC = () => {
  // State for date range selection
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Fetch journal entries
  const {
    data: journalData,
    isLoading,
    error
  } = useQuery<JournalEntry[]>({
    queryKey: ['journals', dateRange],
    queryFn: getAllJournals
  });

  // Memoized data processing with date range support
  const processedData = useMemo(() => {
    if (!journalData) return null;
    return processJournalData(journalData, dateRange);
  }, [journalData, dateRange]);

  // Handle date range change
  const handleDateRangeChange = useCallback((range: DateRange) => {
    setDateRange(range);
  }, []);

  // Render loading state
  if (isLoading) return <Loader wrapperCls='h-[calc(100vh-112px)]' />;

  // Handle error state
  if (error)
    return (
      <div className='p-4 text-red-500'>Error loading journal entries</div>
    );

  // No entries found
  if (!processedData)
    return <div className='p-4 text-gray-500'>No journal entries found.</div>;

  console.log(processedData.moodDistribution);

  return (
    <ScrollArea className='h-[calc(100dvh - 100px)]'>
      <ErrorBoundary>
        <div className='mb-4 space-y-4 p-4'>
          <DateRangePicker
            onDateRangeChange={handleDateRangeChange}
            initialRange={dateRange}
          />

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2'>
            <CategoryDistribution data={processedData.categoryDistribution} />
            <WordCountTrends data={processedData.wordTrends} />
            <TimeOfDayAnalysis data={processedData.timeOfDayData} />
            <EntryFrequencyHeatmap data={processedData.entryFrequencyArray} />
            <AvgEntryLength data={processedData.avgEntryLengthData} />
            {Object.keys(processedData.moodDistribution).length > 0 && (
              <div>
                <MoodDistribution data={processedData.moodDistribution} />
              </div>
            )}
            <WordCloudChart data={processedData.wordCloudData} />
          </div>
        </div>
      </ErrorBoundary>
    </ScrollArea>
  );
};

export default SummaryView;
