import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`;
}

/**
 * Formats a date string or Date object
 * @param dateInput - Date string or Date object to format
 * @param formatString - Format string (e.g., 'MMM dd', 'yyyy-MM-dd', etc.)
 * @returns Formatted date string
 */
export const formatDate = (
  dateInput: string | Date, 
  formatString: string = 'yyyy-MM-dd'
): string => {
  // If input is a string, parse it first
  const date = typeof dateInput === 'string' 
    ? parseISO(dateInput) 
    : dateInput;
  
  return format(date, formatString);
};

/**
 * Converts a date to a relative time description
 * @param dateInput - Date string or Date object
 * @returns Relative time string (e.g., "2 days ago", "1 month ago")
 */
export const formatRelativeDate = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' 
    ? parseISO(dateInput) 
    : dateInput;
  
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 3600 * 24)
  );

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  
  return format(date, 'MMM dd, yyyy');
};