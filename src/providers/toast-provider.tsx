'use client';

import React, { createContext, useContext, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ToastContextType = {
  showSuccessToast: (message: string, callback?: () => void) => void;
  showErrorToast: (message: string, callback?: () => void) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const showSuccessToast = (message: string, callback?: () => void) => {
    toast.success(message, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
      hideProgressBar: true,
      onClose: callback
    });
  };

  const showErrorToast = (message: string, callback?: () => void) => {
    toast.error(message || 'Something went wrong, try again later', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
      hideProgressBar: true,
      onClose: callback
    });
  };

  return (
    <ToastContext.Provider value={{ showSuccessToast, showErrorToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Usage in your layout:
// <ToastProvider>
//   <YourApp />
// </ToastProvider>

// Usage in components:
// const { showSuccessToast } = useToast();
// showSuccessToast('Success!', () => router.push('/new-route'));
