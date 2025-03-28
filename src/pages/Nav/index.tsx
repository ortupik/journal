'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function Nav() {
  const { status } = useSession();
  const router = useRouter();

  return (
    <nav className='df sticky top-0 z-1 gap-4 bg-white px-6 py-2 shadow'>
      <Link href='/' className='mr-auto font-bold'>
        Shamiri Journal
      </Link>

      {status !== 'loading' &&
        (status === 'unauthenticated' ? (
          <>
            <Link
              href='/signup'
              className='text-sm font-medium hover:text-blue-600'
            >
              Sign up
            </Link>

            <Link
              href='/login'
              className='rounded-md bg-slate-900 px-4 py-1 text-sm text-white transition-colors hover:bg-slate-700'
            >
              Log in
            </Link>
          </>
        ) : (
          <>
            <Link
              href='/my-journals'
              className='text-sm font-medium hover:text-blue-600'
            >
              Journal Entries
            </Link>
            <Link
              href='/create-journal'
              className='text-sm font-medium hover:text-blue-600'
            >
              Create Entry
            </Link>
            <Link
              href='/summary'
              className='text-sm font-medium hover:text-blue-600'
            >
              Summary
            </Link>
            <button
              className='bg-slate-900 text-sm text-white transition-colors hover:bg-slate-700'
              onClick={() =>
                signOut({ redirect: false }).then(() => {
                  router.push('/login');
                })
              }
            >
              Sign out
            </button>
          </>
        ))}
    </nav>
  );
}

export default Nav;
