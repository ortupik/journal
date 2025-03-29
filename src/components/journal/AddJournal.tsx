'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import { createJournal, processAI, JournalEntryData } from '@/actions/journal';
import { successNotify, errorNotify } from '@/helpers/toastifyHlp';
import { PROMPTS } from '@/app/api/ai/prompts';
import Loader from '../common/Loader';
import { Switch } from '@/components/ui/switch';

interface AIResponse {
  result: string;
}

function AddJournal() {
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

  // State to control AI processing
  const [isAIEnabled, setIsAIEnabled] = useState(false);

  const router = useRouter();
  const content = watch('content');

  let categories = ['Personal', 'Work', 'Travel', 'Health', 'Other'];

  // Cache AI-generated suggestions to prevent redundant API calls
  const [suggestionCache, setSuggestionCache] = useState<
    Record<string, string>
  >({});

  // Mutation to fetch AI-generated suggestions for journal fields
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
          if (categories.includes(data.result)) {
            setValue('category', data.result);
            setSuggestionCache((prev) => ({ ...prev, [content]: data.result }));
          } else {
            setValue('category', 'Personal');
          }
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

  // Automatically fetch AI-generated suggestions when the content changes
  useEffect(() => {
    // Only process AI if AI is enabled and content exists
    if (!isAIEnabled || !content) return;

    const delay = setTimeout(() => {
      if (suggestionCache[content]) {
        setValue('category', suggestionCache[content]);
      } else {
        fetchAIResult({ content, promptKey: 'category' });
      }

      fetchAIResult({ content, promptKey: 'sentiment' });
      fetchAIResult({ content, promptKey: 'summary' });
      fetchAIResult({ content, promptKey: 'suggestions' });
    }, 500);

    return () => clearTimeout(delay);
  }, [content, isAIEnabled]);

  // Mutation for creating a new journal entry
  const { mutate: createJournalEntry, isLoading } = useMutation({
    mutationFn: createJournal,
    onSuccess: () => {
      // successNotify('Your journal entry has been successfully created!');
      router.push('/dashboard/journal');
    },
    onError: (error) => {
      console.error('Failed to create journal:', error);
      errorNotify(
        'Oops! Something went wrong while creating your journal. Please try again.'
      );
    }
  });

  const submitJournal = (data: JournalEntryData) => {
    createJournalEntry(data);
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

  if (isLoading) return <Loader wrapperCls='h-[calc(100vh-112px)]' />;

  return (
    <form
      onSubmit={handleSubmit(submitJournal)}
      className='mx-auto my-8 max-w-lg rounded-md bg-white p-8'
    >
      <div className='mb-4'>
        <label htmlFor='create-Category' className='text-sm font-medium'>
          Category{' '}
          {isProcessingAI && (
            <span className='text-xs text-gray-500'>(Auto-suggesting...)</span>
          )}
        </label>
        <select
          id='create-Category'
          {...register('category', { required: 'Please select a category.' })}
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

      <div className='mb-4'>
        <label htmlFor='create-Title' className='text-sm font-medium'>
          Title
        </label>
        <input
          id='create-Title'
          type='text'
          {...register('title', { required: 'Please enter a title.' })}
          className='w-full rounded-md border p-2'
        />
        {errors.title && (
          <p className='mt-0.5 text-[13px] font-medium text-red-400'>
            {errors.title.message}
          </p>
        )}
      </div>

      <div className='mb-4'>
        <label htmlFor='create-Content' className='text-sm font-medium'>
          Content
        </label>
        <textarea
          id='create-Content'
          rows={6}
          placeholder="What's on your mind?"
          {...register('content', {
            required: 'Please write something in the content field.'
          })}
          className='w-full rounded-md border p-2'
        />
        {errors.content && (
          <p className='mt-0.5 text-[13px] font-medium text-red-400'>
            {errors.content.message}
          </p>
        )}
      </div>

      {/* AI Toggle Switch */}
      <div className='mb-4 flex items-center'>
        <label className='mr-2 text-sm'>Enable AI Suggestions</label>
        <Switch
          checked={isAIEnabled}
          onCheckedChange={handleAIToggle}
          className='h-6 w-10 rounded-full bg-gray-200 data-[state=checked]:bg-blue-500'
        />
      </div>

      {/* AI Generated Fields - Only visible when AI is enabled */}
      {isAIEnabled && (
        <>
          <div className='mb-4'>
            <label htmlFor='entry-suggestion' className='text-sm font-medium'>
              Entry Suggestion
            </label>
            <textarea
              id='entry-suggestion'
              rows={4}
              readOnly
              {...register('suggestions')}
              className='w-full rounded-md border bg-gray-100 p-2'
            />
          </div>

          <div className='mb-4'>
            <label className='text-sm font-medium'>Sentiment Analysis</label>
            <input
              type='text'
              readOnly
              {...register('sentiment')}
              className='w-full rounded-md border bg-gray-100 p-2'
            />
          </div>

          <div className='mb-4'>
            <label className='text-sm font-medium'>Summary</label>
            <textarea
              rows={5}
              readOnly
              {...register('summary')}
              className='w-full rounded-md border bg-gray-100 p-2'
            />
          </div>
        </>
      )}

      <button
        type='submit'
        disabled={isLoading}
        className='rounded-xl bg-teal-600 px-6 py-2 text-sm text-white disabled:opacity-60'
      >
        Create Journal
      </button>
    </form>
  );
}

export default AddJournal;
