'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

import { createJournal, processAI, JournalEntryData } from '@/actions/journal';
import { successNotify, errorNotify } from '@/helpers/toastifyHlp';
import { PROMPTS } from '@/app/api/ai/prompts';
import Loader from '../common/Loader';
import { Switch } from '@/components/ui/switch';
import { useDebounce } from '@/hooks/use-debounce'; // Import the debounce hook

// Dynamically import Tiptap to ensure it only runs on the client side
const TiptapEditor = dynamic(() => import('./TipTapEditor'), {
  ssr: false,
  loading: () => (
    <div className='h-48 rounded-md border border-gray-300 p-4'>
      Loading editor...
    </div>
  )
});

interface AIResponse {
  result: string;
}

interface AIStatus {
  category: 'waiting' | 'processing' | 'success' | 'failure';
  sentiment: 'waiting' | 'processing' | 'success' | 'failure';
  summary: 'waiting' | 'processing' | 'success' | 'failure';
  suggestions: 'waiting' | 'processing' | 'success' | 'failure';
}

const statusColors = {
  waiting: 'text-gray-500',
  processing: 'text-blue-500',
  success: 'text-green-500',
  failure: 'text-red-500'
};

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
  const [isGeneratingManually, setIsGeneratingManually] = useState(false);
  const [aiStatus, setAiStatus] = useState<AIStatus>({
    category: 'waiting',
    sentiment: 'waiting',
    summary: 'waiting',
    suggestions: 'waiting'
  });

  const router = useRouter();
  const content = watch('content');
  const debouncedContent = useDebounce(content, 20000); // Debounce the content with a 500ms delay

  let categories = ['Personal', 'Work', 'Travel', 'Health', 'Other'];

  // Cache AI-generated suggestions to prevent redundant API calls
  const [suggestionCache, setSuggestionCache] = useState<
    Record<string, string>
  >({});

  // Mutation to fetch AI-generated suggestions for journal fields
  const {
    mutate: fetchAIResult,
    isLoading: isProcessingAI,
    isIdle: isAIIIdle
  } = useMutation(
    async ({
      promptKey,
      content
    }: {
      promptKey: keyof typeof PROMPTS;
      content: string;
    }) => {
      setAiStatus((prev) => ({ ...prev, [promptKey]: 'processing' }));
      return processAI<AIResponse>(promptKey, content);
    },
    {
      onSuccess: (data, variables) => {
        const { promptKey, content } = variables;
        setAiStatus((prev) => ({ ...prev, [promptKey]: 'success' }));

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
        setIsGeneratingManually(false);
      },
      onError: (error, variables) => {
        console.error(
          `AI processing failed for ${variables.promptKey}:`,
          error
        );
        setAiStatus((prev) => ({ ...prev, [variables.promptKey]: 'failure' }));
        setIsGeneratingManually(false);
      }
    }
  );

  const triggerAISuggestions = useCallback(() => {
    setIsGeneratingManually(true);
    if (!content) {
      setAiStatus({
        category: 'processing',
        sentiment: 'processing',
        summary: 'processing',
        suggestions: 'processing'
      });
      fetchAIResult({ content: '', promptKey: 'category' });
      fetchAIResult({ content: '', promptKey: 'sentiment' });
      fetchAIResult({ content: '', promptKey: 'summary' });
      fetchAIResult({ content: '', promptKey: 'suggestions' });
      return;
    }

    if (suggestionCache[content]) {
      setValue('category', suggestionCache[content]);
      setAiStatus((prev) => ({ ...prev, category: 'success' }));
    } else {
      fetchAIResult({ content, promptKey: 'category' });
    }

    fetchAIResult({ content, promptKey: 'sentiment' });
    fetchAIResult({ content, promptKey: 'summary' });
    fetchAIResult({ content, promptKey: 'suggestions' });
  }, [
    content,
    fetchAIResult,
    setValue,
    suggestionCache,
    setIsGeneratingManually,
    setAiStatus
  ]);

  useEffect(() => {
    // Only process AI on debounced content if AI is enabled and not generating manually
    if (
      isAIEnabled &&
      debouncedContent &&
      !isGeneratingManually &&
      !isProcessingAI
    ) {
      if (suggestionCache[debouncedContent]) {
        setValue('category', suggestionCache[debouncedContent]);
        setAiStatus((prev) => ({ ...prev, category: 'success' }));
      } else {
        fetchAIResult({ content: debouncedContent, promptKey: 'category' });
      }

      fetchAIResult({ content: debouncedContent, promptKey: 'sentiment' });
      fetchAIResult({ content: debouncedContent, promptKey: 'summary' });
      fetchAIResult({ content: debouncedContent, promptKey: 'suggestions' });
    } else if (!isAIEnabled) {
      setAiStatus({
        category: 'waiting',
        sentiment: 'waiting',
        summary: 'waiting',
        suggestions: 'waiting'
      });
    }
  }, [
    debouncedContent,
    isAIEnabled,
    fetchAIResult,
    setValue,
    suggestionCache,
    isProcessingAI,
    isGeneratingManually
  ]);

  const { mutate: createJournalEntry, isLoading: isCreatingJournal } =
    useMutation({
      mutationFn: createJournal,
      onSuccess: () => {
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

  const handleAIToggle = () => {
    setIsAIEnabled(!isAIEnabled);
    setIsGeneratingManually(false); // Reset manual generation flag
    if (!isAIEnabled) {
      setValue('category', '');
      setValue('sentiment', '');
      setValue('summary', '');
      setValue('suggestions', '');
      setAiStatus({
        category: 'waiting',
        sentiment: 'waiting',
        summary: 'waiting',
        suggestions: 'waiting'
      });
    }
  };

  const handleContentChange = (html: string) => {
    setValue('content', html);
    setIsGeneratingManually(false); // Reset manual generation flag on content change
  };

  if (isCreatingJournal) return <Loader wrapperCls='h-[calc(100vh-112px)]' />;

  return (
    <div className='mx-auto my-3 max-w-screen-lg'>
      <h2 className='mb-4 text-center text-xl font-semibold text-gray-800'>
        {' '}
        New Journal Entry
      </h2>
      <form
        onSubmit={handleSubmit(submitJournal)}
        className='rounded-md bg-white p-6 shadow-md'
      >
        <div className='md:grid md:grid-cols-2 md:gap-6'>
          <div className='space-y-4'>
            <div className='mb-4 md:mb-3'>
              <label
                htmlFor='create-Category'
                className='mb-2 block text-sm font-semibold text-gray-700'
              >
                Category{' '}
                {isAIEnabled && (
                  <span
                    className={`text-xs ${statusColors[aiStatus.category]}`}
                  >
                    {aiStatus.category === 'processing' &&
                      '(Auto-suggesting...)'}
                    {aiStatus.category === 'success' && '(AI Suggested)'}
                    {aiStatus.category === 'failure' && '(AI Failed)'}
                    {aiStatus.category === 'waiting' && '(AI Ready)'}
                  </span>
                )}
              </label>
              <select
                id='create-Category'
                {...register('category', {
                  required: 'Please select a category.'
                })}
                className='w-full rounded-md border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-blue-500'
                disabled={
                  isAIEnabled &&
                  !isGeneratingManually &&
                  !aiStatus.category === 'failure'
                }
              >
                <option value=''>Select a category</option>
                <option value='Personal'>Personal</option>
                <option value='Work'>Work</option>
                <option value='Travel'>Travel</option>
                <option value='Health'>Health</option>
                <option value='Other'>Other</option>
              </select>
              {errors.category && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className='mb-4 md:mb-3'>
              <label
                htmlFor='create-Title'
                className='mb-2 block text-sm font-semibold text-gray-700'
              >
                Title
              </label>
              <input
                id='create-Title'
                type='text'
                {...register('title', { required: 'Please enter a title.' })}
                className='w-full rounded-md border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-blue-500'
              />
              {errors.title && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className='mb-4 md:mb-3'>
              <label
                htmlFor='create-Content'
                className='mb-2 block text-sm font-semibold text-gray-700'
              >
                Content
              </label>
              <input
                type='hidden'
                {...register('content', {
                  required: 'Please write something in the content field.'
                })}
              />
              <TiptapEditor
                initialContent={content}
                onChange={handleContentChange}
                className='min-h-48 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              />
              {errors.content && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.content.message}
                </p>
              )}
            </div>
          </div>

          <div className='flex flex-col justify-between md:col-span-1'>
            <div className='mb-2 flex items-center justify-end'>
              <label className='mr-2 text-sm text-gray-700'>Enable AI</label>
              <Switch
                checked={isAIEnabled}
                onCheckedChange={handleAIToggle}
                className='h-6 w-10 rounded-full bg-gray-200 data-[state=checked]:bg-blue-500'
              />
            </div>
            <div className='mb-4 flex justify-end'>
              <button
                type='button'
                onClick={triggerAISuggestions}
                disabled={isProcessingAI}
                className={`rounded-md px-4 py-2 text-sm font-semibold text-white focus:ring-2 focus:ring-pink-500 focus:ring-offset-1 focus:outline-none disabled:opacity-60 ${
                  isAIEnabled
                    ? 'bg-pink-500 hover:bg-pink-600'
                    : 'cursor-not-allowed bg-gray-300'
                }`}
              >
                Generate AI Suggestions
              </button>
            </div>
            {isAIEnabled && (
              <div className='space-y-4'>
                <div className='mb-4 md:mb-3'>
                  <label
                    htmlFor='entry-suggestion'
                    className='mb-2 block text-sm font-semibold text-gray-700'
                  >
                    AI Suggestion{' '}
                    <span
                      className={`text-xs ${statusColors[aiStatus.suggestions]}`}
                    >
                      {aiStatus.suggestions === 'processing' &&
                        '(Generating...)'}
                      {aiStatus.suggestions === 'success' && '(Generated)'}
                      {aiStatus.suggestions === 'failure' && '(Failed)'}
                      {aiStatus.suggestions === 'waiting' && '(Ready)'}
                    </span>
                  </label>
                  <textarea
                    id='entry-suggestion'
                    rows={4}
                    readOnly
                    {...register('suggestions')}
                    className='w-full rounded-md border border-gray-300 bg-gray-100 p-2.5'
                    placeholder='AI-powered suggestions based on your content will appear here.'
                  />
                </div>

                <div className='mb-4 md:mb-3'>
                  <label className='mb-2 block text-sm font-semibold text-gray-700'>
                    Sentiment Analysis{' '}
                    <span
                      className={`text-xs ${statusColors[aiStatus.sentiment]}`}
                    >
                      {aiStatus.sentiment === 'processing' && '(Analyzing...)'}
                      {aiStatus.sentiment === 'success' && '(Analyzed)'}
                      {aiStatus.sentiment === 'failure' && '(Failed)'}
                      {aiStatus.sentiment === 'waiting' && '(Ready)'}
                    </span>
                  </label>
                  <input
                    type='text'
                    readOnly
                    {...register('sentiment')}
                    className='w-full rounded-md border border-gray-300 bg-gray-100 p-2.5'
                    placeholder='The overall sentiment of your entry will be analyzed here.'
                  />
                </div>

                <div className='mb-4 md:mb-3'>
                  <label className='mb-2 block text-sm font-semibold text-gray-700'>
                    Summary{' '}
                    <span
                      className={`text-xs ${statusColors[aiStatus.summary]}`}
                    >
                      {aiStatus.summary === 'processing' && '(Summarizing...)'}
                      {aiStatus.summary === 'success' && '(Summarized)'}
                      {aiStatus.summary === 'failure' && '(Failed)'}
                      {aiStatus.summary === 'waiting' && '(Ready)'}
                    </span>
                  </label>
                  <textarea
                    rows={5}
                    readOnly
                    {...register('summary')}
                    className='w-full rounded-md border border-gray-300 bg-gray-100 p-2.5'
                    placeholder='A concise summary of your journal entry will be generated here.'
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='mt-6'>
          <button
            type='submit'
            className='w-xs rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none disabled:opacity-60'
          >
            Save Journal Entry
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddJournal;
