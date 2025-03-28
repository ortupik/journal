'use client';

import Link from 'next/link';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import Nav from '@/components/nav';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function HomePage() {
  return (
    <ScrollArea className='h-[calc(100dvh)]'>
      <div className='flex min-h-screen flex-col'>
        <Nav />

        <header className='flex flex-col items-center bg-blue-500 py-20 text-center text-white'>
          <div className='max-w-4xl px-6 text-center'>
            <h1 className='mb-4 text-4xl font-bold'>
              Welcome to Personal Journal
            </h1>
            <p className='mb-6 text-lg'>
              Capture your thoughts, organize your ideas, and stay productive.
            </p>
            <Link href='/signup'>
              <button className='mx-auto flex items-center gap-2 rounded-md bg-white px-6 py-3 font-semibold text-blue-600 shadow-md hover:bg-gray-200'>
                Get Started
                <ArrowRightIcon className='h-5 w-5' />
              </button>
            </Link>
          </div>
        </header>

        <section className='bg-gray-100 px-6 py-16'>
          <div className='mx-auto max-w-4xl text-center'>
            <h2 className='mb-6 text-3xl font-bold'>Why Choose JournalApp?</h2>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <div className='rounded-lg bg-white p-6 shadow-md'>
                <CheckCircleIcon className='mx-auto mb-4 h-10 w-10 text-blue-500' />
                <h3 className='mb-2 text-xl font-semibold'>Easy to Use</h3>
                <p className='text-gray-600'>
                  Write journals effortlessly with a simple interface.
                </p>
              </div>
              <div className='rounded-lg bg-white p-6 shadow-md'>
                <CheckCircleIcon className='mx-auto mb-4 h-10 w-10 text-blue-500' />
                <h3 className='mb-2 text-xl font-semibold'>Stay Organized</h3>
                <p className='text-gray-600'>
                  Categorize your journals and find them easily.
                </p>
              </div>
              <div className='rounded-lg bg-white p-6 shadow-md'>
                <CheckCircleIcon className='mx-auto mb-4 h-10 w-10 text-blue-500' />
                <h3 className='mb-2 text-xl font-semibold'>Access Anywhere</h3>
                <p className='text-gray-600'>
                  Your journals are securely stored and accessible anytime.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className='bg-gray-800 py-6 text-center text-white'>
          <p className='text-sm'>
            &copy; {new Date().getFullYear()} JournalApp. All rights reserved.
          </p>
          <div className='mt-2 flex justify-center gap-4'>
            <Link
              href='/privacy'
              className='text-sm text-gray-400 hover:text-white'
            >
              Privacy Policy
            </Link>
            <Link
              href='/terms'
              className='text-sm text-gray-400 hover:text-white'
            >
              Terms of Service
            </Link>
          </div>
        </footer>
      </div>
    </ScrollArea>
  );
}
