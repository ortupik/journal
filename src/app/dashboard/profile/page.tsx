'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  getCurrentUser,
  updateUserName,
  updateUserEmail,
  updateUserPassword
} from '@/actions/user';
import { toast } from 'react-hot-toast';
import endPoints from '@/app/api/utils/endPoints'; // Import endPoints

type Tab = 'general' | 'email' | 'password';

interface FormErrors {
  name?: string;
  newEmail?: string;
  oldPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [currentTab, setCurrentTab] = useState<Tab>('general');
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      // router.push('/login');
      // return;
    }

    setLoading(true);
    getCurrentUser()
      .then((user) => {
        setName(user.name);
        setEmail(user.email);
        setNewEmail(user.email);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile information.');
        setLoading(false);
      });
  }, [status, router]);

  const handleTabChange = (tab: Tab) => {
    setCurrentTab(tab);
    setFormErrors({}); // Clear errors when switching tabs
  };

  // General Tab Handlers
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setFormErrors((prevErrors) => ({ ...prevErrors, name: undefined }));
  };

  const handleUpdateName = async () => {
    setLoading(true);
    setFormErrors({});
    if (!name?.trim()) {
      setFormErrors({ name: 'Name is required.' });
      setLoading(false);
      return;
    }
    try {
      await updateUserName({ name });
      toast.success('Name updated successfully!');
    } catch (err: any) {
      console.error('Error updating name:', err);
      toast.error(err?.message || 'Failed to update name.');
      if (err?.message?.toLowerCase().includes('name')) {
        setFormErrors({ name: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  // Email Tab Handlers
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmail(e.target.value);
    setFormErrors((prevErrors) => ({ ...prevErrors, newEmail: undefined }));
  };

  const handleUpdateEmail = async () => {
    setLoading(true);
    setFormErrors({});
    if (!newEmail.trim()) {
      setFormErrors({ newEmail: 'Email is required.' });
      setLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(newEmail)) {
      setFormErrors({ newEmail: 'Invalid email format.' });
      setLoading(false);
      return;
    }
    try {
      await updateUserEmail({ email: newEmail });
      setEmail(newEmail);
      toast.success('Email updated successfully!');
    } catch (err: any) {
      console.error('Error updating email:', err);
      toast.error(err?.message || 'Failed to update email.');
      if (err?.message?.toLowerCase().includes('email')) {
        setFormErrors({ newEmail: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  };

  const handleUpdatePassword = async () => {
    setLoading(true);
    setFormErrors({});
    const { oldPassword, newPassword, confirmNewPassword } = passwordData;

    if (!oldPassword.trim()) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        oldPassword: 'Current password is required.'
      }));
    }
    if (!newPassword.trim()) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        newPassword: 'New password is required.'
      }));
    }
    if (!confirmNewPassword.trim()) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        confirmNewPassword: 'Confirm new password is required.'
      }));
    }

    if (newPassword !== confirmNewPassword) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        confirmNewPassword: 'New passwords do not match.'
      }));
    }

    if (Object.keys(formErrors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      await updateUserPassword({ oldPassword, newPassword });
      toast.success('Password updated successfully!');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (err: any) {
      console.error('Error updating password:', err);
      toast.error(err || 'Failed to update password.');
      setFormErrors({ newPassword: 'Password is not strong enough' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className='p-6'>Loading profile information...</div>;
  }

  if (error) {
    return <div className='p-6 text-red-500'>{error}</div>;
  }

  return (
    <div className='p-6'>
      <h1 className='mb-4 text-2xl font-semibold'>Your Profile</h1>

      <div className='rounded-lg bg-white shadow'>
        <div className='flex border-b'>
          <button
            className={`px-6 py-3 ${
              currentTab === 'general'
                ? 'border-b-2 border-blue-500 font-semibold'
                : 'text-gray-600 hover:text-blue-500'
            }`}
            onClick={() => handleTabChange('general')}
          >
            General
          </button>
          <button
            className={`px-6 py-3 ${
              currentTab === 'email'
                ? 'border-b-2 border-blue-500 font-semibold'
                : 'text-gray-600 hover:text-blue-500'
            }`}
            onClick={() => handleTabChange('email')}
          >
            Update Email
          </button>
          <button
            className={`px-6 py-3 ${
              currentTab === 'password'
                ? 'border-b-2 border-blue-500 font-semibold'
                : 'text-gray-600 hover:text-blue-500'
            }`}
            onClick={() => handleTabChange('password')}
          >
            Update Password
          </button>
        </div>

        <div className='p-6'>
          {currentTab === 'general' && (
            <div>
              <h2 className='mb-4 text-xl font-semibold'>General Settings</h2>
              <div className='mb-4'>
                <label
                  htmlFor='name'
                  className='mb-2 block text-sm font-bold text-gray-700'
                >
                  Name:
                </label>
                <input
                  type='text'
                  id='name'
                  value={name || ''}
                  onChange={handleNameChange}
                  className={`focus:shadow-outline w-xs appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none ${
                    formErrors.name ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.name && (
                  <p className='mt-1 text-sm text-red-500'>{formErrors.name}</p>
                )}
              </div>
              <button
                onClick={handleUpdateName}
                className='focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none'
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Name'}
              </button>
            </div>
          )}

          {currentTab === 'email' && (
            <div>
              <h2 className='mb-4 text-xl font-semibold'>Update Email</h2>
              <p className='mb-2'>Current Email: {email}</p>
              <div className='mb-4'>
                <label
                  htmlFor='newEmail'
                  className='mb-2 block text-sm font-bold text-gray-700'
                >
                  New Email:
                </label>
                <input
                  type='email'
                  id='newEmail'
                  value={newEmail}
                  onChange={handleEmailChange}
                  className={`focus:shadow-outline w-xs appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none ${
                    formErrors.newEmail ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.newEmail && (
                  <p className='mt-1 text-sm text-red-500'>
                    {formErrors.newEmail}
                  </p>
                )}
              </div>
              <button
                onClick={handleUpdateEmail}
                className='focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none'
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Email'}
              </button>
            </div>
          )}

          {currentTab === 'password' && (
            <div>
              <h2 className='mb-4 text-xl font-semibold'>Update Password</h2>
              <div className='mb-4'>
                <label
                  htmlFor='oldPassword'
                  className='mb-2 block text-sm font-bold text-gray-700'
                >
                  Current Password:
                </label>
                <input
                  type='password'
                  id='oldPassword'
                  name='oldPassword'
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className={`focus:shadow-outline w-xs appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none ${
                    formErrors.oldPassword ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.oldPassword && (
                  <p className='mt-1 text-sm text-red-500'>
                    {formErrors.oldPassword}
                  </p>
                )}
              </div>
              <div className='mb-4'>
                <label
                  htmlFor='newPassword'
                  className='mb-2 block text-sm font-bold text-gray-700'
                >
                  New Password:
                </label>
                <input
                  type='password'
                  id='newPassword'
                  name='newPassword'
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={`focus:shadow-outline w-xs appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none ${
                    formErrors.newPassword ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.newPassword && (
                  <p className='mt-1 text-sm text-red-500'>
                    {formErrors.newPassword}
                  </p>
                )}
              </div>
              <div className='mb-4'>
                <label
                  htmlFor='confirmNewPassword'
                  className='mb-2 block text-sm font-bold text-gray-700'
                >
                  Confirm New Password:
                </label>
                <input
                  type='password'
                  id='confirmNewPassword'
                  name='confirmNewPassword'
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  className={`focus:shadow-outline w-xs appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none ${
                    formErrors.confirmNewPassword ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.confirmNewPassword && (
                  <p className='mt-1 text-sm text-red-500'>
                    {formErrors.confirmNewPassword}
                  </p>
                )}
              </div>
              <button
                onClick={handleUpdatePassword}
                className='focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none'
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
