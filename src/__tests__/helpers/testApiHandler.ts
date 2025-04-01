import { NextRequest } from 'next/server';
import { headers } from 'next/headers';

// Helper function to create test request objects
export function createTestRequest(method: string, body?: any): NextRequest {
  const url = 'http://localhost:3000';
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return new NextRequest(url, options);
}

// Mock Next.js headers
jest.mock('next/headers', () => ({
  headers: jest.fn(() => new Map())
}));

// Mock server session
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn()
}));
