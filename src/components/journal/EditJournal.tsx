'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import {
  getJournalById,
  updateJournal,
  processAI,
  JournalEntryData
} from '@/actions/journal';
import { successNotify, errorNotify } from '@/helpers/toastifyHlp';
import { PROMPTS } from '@/app/api/ai/prompts';
import Loader from '../common/Loader';
import { Switch } from '@/components/ui/switch';

interface AIResponse {
  result: string;
}

function EditJournal() {
  const router = useRouter();
  const { id } = useParams();

  // State to control AI processing
  const [isAIEnabled, setIsAIEnabled] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch
  } = useForm<JournalEntryData>({
    defaultValues: {
      title: '',
      content: '',
      category: '',
      sentiment: '',
      summary: '',
      suggestions: ''
    }
  });

  const content = watch('content');

  const [suggestionCache, setSuggestionCache] = useState<
    Record<string, string>
  >({});

  const { data: journal, isLoading: isFetching } = useQuery({
    queryKey: ['journal', id],
    queryFn: async () => {
      if (!id) throw new Error('Journal ID is missing');
      return getJournalById(id);
    },
    onSuccess: (data) => {
      setValue('title', data.title);
      setValue('content', data.content);
      setValue('category', data.category);
      setValue('sentiment', data.sentiment);
      setValue('summary', data.summary);
      setValue('suggestions', data.suggestions);
    },
    onError: (error) => {
      console.error('Failed to fetch journal:', error);
      errorNotify('Failed to load journal details.');
    },
    enabled: !!id
  });

  const { mutate: fetchAIResult, isLoading: isProcessingAI } = useMutation(
    async ({
      promptKey,
      content
    }: {
      promptKey: keyof typeof PROMPTS;
      content: string;
    }) => {
      return processAI<AIResponse>(promptKey, content);
    },
    {
      onSuccess: (data, variables) => {
        const { promptKey, content } = variables;

        if (promptKey === 'category') {
          setValue('category', data.result);
          setSuggestionCache((prev) => ({ ...prev, [content]: data.result }));
        } else if (promptKey === 'sentiment') {
          setValue('sentiment', data.result);
        } else if (promptKey === 'summary') {
          setValue('summary', data.result);
        } else if (promptKey === 'suggestions') {
          setValue('suggestions', data.result);
        }
      },
      onError: (error) => console.error('AI processing failed:', error)
    }
  );

  useEffect(() => {
    // Only process AI if AI is enabled and content exists
    if (!isAIEnabled || !content) return;

    const delay = setTimeout(() => {
      // Use cached category if available
      if (suggestionCache[content]) {
        setValue('category', suggestionCache[content]);
      } else {
        fetchAIResult({ content, promptKey: 'category' });
      }

      fetchAIResult({ content, promptKey: 'sentiment' });
      fetchAIResult({ content, promptKey: 'summary' });
      fetchAIResult({ content, promptKey: 'suggestions' });
    }, 2500);

    return () => clearTimeout(delay);
  }, [content, isAIEnabled]);

  const { mutate: updateJournalEntry, isLoading } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: JournalEntryData }) =>
      updateJournal(id, data),
    onSuccess: () => {
      // successNotify('Journal updated successfully');
      router.push('/dashboard/journal');
    },
    onError: (error) => {
      console.error('Failed to update journal:', error);
      errorNotify('Failed to update journal. Please try again.');
    }
  });

  const submitJournal = (data: JournalEntryData) => {
    if (!id) return;
    updateJournalEntry({ id, data });
  };

  // Handler for switch to enable/disable AI
  const handleAIToggle = () => {
    setIsAIEnabled(!isAIEnabled);

    // Clear AI-generated fields when disabled
    if (!isAIEnabled) {
      setValue('category', '');
      setValue('sentiment', '');
      setValue('summary', '');
      setValue('suggestions', '');
    }
  };

  if (isLoading || isFetching)
    return <Loader wrapperCls='h-[calc(100vh-112px)]' />;

  return (
    <form
      onSubmit={handleSubmit(submitJournal)}
      className='mx-auto my-2 max-w-xl rounded-md p-8'
    >
      {/* Category */}
      <div className='mb-4'>
        <label htmlFor='create-Category' className='text-sm font-medium'>
          Category{' '}
          {isProcessingAI && (
            <span className='text-xs text-gray-500'>(Auto-suggesting...)</span>
          )}
        </label>
        <select
          id='edit-Category'
          {...register('category', { required: 'Category is required' })}
          className='w-full rounded-md border p-2'
        >
          <option value=''>Select a category</option>
          <option value='Personal'>Personal</option>
          <option value='Work'>Work</option>
          <option value='Travel'>Travel</option>
          <option value='Health'>Health</option>
          <option value='Other'>Other</option>
        </select>
        {errors.category && (
          <p className='mt-0.5 text-[13px] font-medium text-red-400'>
            {errors.category.message}
          </p>
        )}
      </div>

      {/* Title */}
      <div className='mb-4'>
        <label htmlFor='edit-Title' className='text-sm font-medium'>
          Title
        </label>
        <input
          id='edit-Title'
          type='text'
          {...register('title', { required: 'Title is required' })}
          className='w-full rounded-md border p-2'
        />
        {errors.title && (
          <p className='mt-0.5 text-[13px] font-medium text-red-400'>
            {errors.title.message}
          </p>
        )}
      </div>

      <div className='mb-4'>
        <label htmlFor='edit-Content' className='text-sm font-medium'>
          Content
        </label>
        <textarea
          id='edit-Content'
          rows={6}
          placeholder='Update your thoughts...'
          {...register('content', { required: 'Content is required' })}
          className='w-full rounded-md border p-2'
        />
        {errors.content && (
          <p className='mt-0.5 text-[13px] font-medium text-red-400'>
            {errors.content.message}
          </p>
        )}
      </div>

      <button
        type='submit'
        disabled={isLoading}
        className='rounded-xl bg-blue-600 px-6 py-2 text-sm text-white disabled:opacity-60'
      >
        Update Entry
      </button>

      <div className='mt-5 mb-5 flex items-center'>
        <label className='mr-2 text-sm text-blue-800'>
          Enable AI Suggestions
        </label>
        <Switch
          checked={isAIEnabled}
          onCheckedChange={handleAIToggle}
          className='h-6 w-10 rounded-full bg-gray-200 data-[state=checked]:bg-blue-500'
        />
      </div>

      {/* AI Generated Fields - Only visible when AI is enabled */}
      {isAIEnabled && (
        <div>
          <div className='mb-4'>
            <label className='text-sm font-medium'>
              Journal Entry Sentiment
            </label>
            <input
              type='text'
              readOnly
              {...register('sentiment')}
              className='w-full rounded-md border bg-gray-100 p-2'
            />
          </div>

          <div className='mb-4'>
            <label htmlFor='entry-suggestion' className='text-sm font-medium'>
              Entry Suggestion
            </label>
            <textarea
              id='entry-suggestion'
              rows={7}
              readOnly
              {...register('suggestions')}
              className='w-full rounded-md border bg-gray-100 p-2'
            />
          </div>

          <div className='mb-4'>
            <label className='text-sm font-medium'>Summary</label>
            <textarea
              rows={4}
              readOnly
              {...register('summary')}
              className='w-full rounded-md border bg-gray-100 p-2'
            />
          </div>
        </div>
      )}
    </form>
  );
}

export default EditJournal;
