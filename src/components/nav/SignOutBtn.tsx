'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function SignOutBtn() {
  const router = useRouter();

  return (
    <button
      className='rounded-md bg-slate-900 px-4 py-2 text-sm text-white transition-colors hover:bg-slate-700'
      onClick={() =>
        signOut({ redirect: false }).then(() => {
          router.push('/login');
        })
      }
    >
      Sign out
    </button>
  );
}

export default SignOutBtn;
