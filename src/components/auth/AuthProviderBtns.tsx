'use client';

import { signIn } from 'next-auth/react';

function AuthProviderBtns() {
  return (
    <div className='dc gap-6'>
      <button
        className='df bg-slate-200 py-2'
        onClick={() =>
          signIn('google', { callbackUrl: 'http://localhost:3000' })
        }
      >
        <img className='h-6 w-6' src='./img/google.webp' alt='' />
        Google
      </button>

      <button
        className='df bg-slate-200 py-2'
        onClick={() =>
          signIn('github', { callbackUrl: 'http://localhost:3000' })
        }
      >
        <img className='h-6 w-6' src='./img/github.png' alt='' />
        Github
      </button>
    </div>
  );
}

export default AuthProviderBtns;
