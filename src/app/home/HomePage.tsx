"use client";

import Link from "next/link";
import { ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import Nav from "@/pages/Nav";
import { ScrollArea } from '@/components/ui/scroll-area';


export default function HomePage() {
  return (
    <ScrollArea className='h-[calc(100dvh)]'>
    <div className="min-h-screen flex flex-col">
      <Nav />

      <header className="bg-blue-500 text-white text-center py-20 flex flex-col items-center">
        <div className="max-w-4xl px-6 text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Personal Journal</h1>
            <p className="text-lg mb-6">
            Capture your thoughts, organize your ideas, and stay productive.
            </p>
            <Link href="/signup">
            <button className="bg-white text-blue-600 px-6 py-3 font-semibold rounded-md shadow-md hover:bg-gray-200 flex items-center gap-2 mx-auto">
                Get Started
                <ArrowRightIcon className="w-5 h-5" />
            </button>
            </Link>
        </div>
        </header>


      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Why Choose JournalApp?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CheckCircleIcon className="text-blue-500 w-10 h-10 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
              <p className="text-gray-600">Write journals effortlessly with a simple interface.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CheckCircleIcon className="text-blue-500 w-10 h-10 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Stay Organized</h3>
              <p className="text-gray-600">Categorize your journals and find them easily.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CheckCircleIcon className="text-blue-500 w-10 h-10 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Access Anywhere</h3>
              <p className="text-gray-600">Your journals are securely stored and accessible anytime.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-6 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} JournalApp. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link>
          <Link href="/terms" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link>
        </div>
      </footer>
    </div>
    </ScrollArea>
  );
}
