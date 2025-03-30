'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

type FormData = { name: string; email: string; password: string };

function SignupForm() {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await axios.post('/api/auth/signup', { ...data });
      router.push('/login');
    } catch (error: any) {
      setError(
        error.response?.data?.error || 'An error occurred during signup'
      );
    }
  };

  return (
    <div className='mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-8 text-center'>
        <h1 className='text-2xl font-bold text-gray-800'>Create Account</h1>
        <p className='mt-2 text-gray-600'>Join our community today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {error && (
          <div className='rounded-md border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600'>
            {error}
          </div>
        )}

        <div className='space-y-2'>
          <label
            htmlFor='signup-name'
            className='block text-sm font-medium text-gray-700'
          >
            Full Name
          </label>
          <input
            autoFocus
            id='signup-name'
            type='text'
            placeholder='Enter your name'
            className='w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 3,
                message: 'Name should be at least 3 characters'
              }
            })}
          />
          {errors.name && (
            <div className='mt-1 text-xs text-red-600'>
              {errors.name.message}
            </div>
          )}
        </div>

        <div className='space-y-2'>
          <label
            htmlFor='signup-email'
            className='block text-sm font-medium text-gray-700'
          >
            Email Address
          </label>
          <input
            id='signup-email'
            type='email'
            placeholder='Enter your email'
            className='w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Enter a valid email'
              }
            })}
          />
          {errors.email && (
            <div className='mt-1 text-xs text-red-600'>
              {errors.email.message}
            </div>
          )}
        </div>

        <div className='space-y-2'>
          <label
            htmlFor='signup-password'
            className='block text-sm font-medium text-gray-700'
          >
            Password
          </label>
          <div className='relative'>
            <input
              id='signup-password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter your password'
              className='w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              {...register('password', {
                required: 'Password is required',
                pattern: {
                  value:
                    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                  message:
                    'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.'
                }
              })}
            />
            <button
              onClick={togglePasswordVisibility}
              className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700'
              type='button'
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
                  <path
                    fillRule='evenodd'
                    d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                    clipRule='evenodd'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z'
                    clipRule='evenodd'
                  />
                  <path d='M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z' />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <div className='mt-1 text-xs text-red-600'>
              {errors.password.message}
            </div>
          )}
        </div>

        <button
          className='w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
          type='submit'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Sign Up'}
        </button>

        <div className='text-center text-sm text-gray-600'>
          <span>Already have an account? </span>
          <Link
            href='/login'
            className='font-medium text-blue-600 hover:text-blue-800'
          >
            Sign In
          </Link>
        </div>

        <div className='relative my-6'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-300'></div>
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='bg-white px-2 text-gray-500'>Or sign up with</span>
          </div>
        </div>

        <div className='flex space-x-4'>
          <button
            type='button'
            className='flex flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          >
            <svg
              className='mr-2 h-5 w-5'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z'
                fill='#4285F4'
              />
              <path
                d='M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z'
                fill='#EA4335'
              />
              <path
                d='M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z'
                fill='#FBBC05'
              />
              <path
                d='M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z'
                fill='#34A853'
              />
            </svg>
            Google
          </button>
          <button
            type='button'
            className='flex flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
            onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
          >
            <svg
              className='mr-2 h-5 w-5'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z'
                fill='#181717'
              />
            </svg>
            GitHub
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupForm;
