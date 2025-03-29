'use client';

import Link from 'next/link';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

type JournalProps = {
  id: string;
  title: string;
  content: string;
  category: string;
  summary: string;
  sentiment: string;
  date: string;
  wrapperCls?: string;
  onDeleteBtnClk: () => void;
  onCardClk: () => void;
};

const categoryColors: { [key: string]: string } = {
  Personal: 'bg-orange-100 text-orange-800',
  Work: 'bg-blue-100 text-blue-800',
  Travel: 'bg-yellow-100 text-yellow-800',
  Health: 'bg-red-100 text-red-800',
  Other: 'bg-purple-100 text-purple-800'
};

const sentimentColors: { [key: string]: string } = {
  Positive: 'bg-green-100 text-green-800 border border-green-300',
  Neutral: 'bg-gray-100 text-gray-800 border border-gray-300',
  Negative: 'bg-red-100 text-red-800 border border-red-300'
};

function JournalCard({
  id,
  title,
  content,
  category,
  summary,
  sentiment,
  date,
  onDeleteBtnClk = () => {},
  onCardClk = () => {},
  wrapperCls = 'my-6 max-w-2xl mx-auto p-6 rounded-xl border border-gray-300 shadow-md hover:shadow-lg transition cursor-pointer'
}: JournalProps) {
  return (
    <div className={wrapperCls} onClick={onCardClk}>
      <div className='mb-2 flex items-center justify-between'>
        <p
          className={`rounded-full px-3 py-1 text-xs font-medium ${categoryColors[category] || 'bg-gray-100 text-gray-700'}`}
        >
          {category}
        </p>
        <p
          className={`rounded-full px-3 py-1 text-xs font-medium ${sentimentColors[sentiment] || 'bg-gray-100 text-gray-700'}`}
        >
          {sentiment}
        </p>
      </div>

      <p className='text-xs text-gray-500'>
        {new Date(date).toLocaleDateString()}
      </p>
      <h2 className='mt-1 text-lg font-semibold text-gray-900'>{title}</h2>

      <p
        className='mt-2 text-sm text-gray-700'
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <div className='mt-4 flex justify-end gap-2'>
        <Link
          href={`/dashboard/journal/edit/${id}`}
          className='flex items-center rounded-md border border-blue-300 px-3 py-1 text-xs text-blue-600 transition hover:bg-blue-100'
          onClick={(e) => e.stopPropagation()}
        >
          <PencilSquareIcon className='mr-1 h-4 w-4 text-blue-500' />
          Edit
        </Link>

        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent parent click
            onDeleteBtnClk();
          }}
          className='flex items-center rounded-md border border-red-300 px-3 py-1 text-xs text-red-600 transition hover:bg-red-100'
        >
          <TrashIcon className='mr-1 h-4 w-4 text-red-500' />
          Delete
        </button>
      </div>
    </div>
  );
}

export default JournalCard;
