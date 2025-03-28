import Link from 'next/link';

import AuthProvider from '@/components/auth/AuthProviderBtns';
import Form from './Form';

function page() {
  return (
    <div className='dc min-h-screen bg-slate-100'>
      <div className='rounded-2xl bg-white p-6 shadow-xl md:w-96'>
        <h1 className='mb-4 text-center text-2xl font-medium'>
          Create account
        </h1>

        <Form />

        <div className='or-dash relative mb-6 text-center text-sm text-gray-500'>
          Or
        </div>

        <AuthProvider />

        <div className='mt-6 text-center text-sm'>
          Already have an account,{' '}
          <Link href='/login' className='text-blue-500 hover:text-blue-700'>
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default page;
