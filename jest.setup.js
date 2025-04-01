// jest.setup.js
jest.setTimeout(30000);

// Mock Next.js modules
jest.mock('next/headers', () => ({
  headers: jest.fn(() => new Map())
}));

// Optional: add global mocks for commonly used modules
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn()
}));

// This helps with NextResponse and other Next.js server components
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  return {
    ...originalModule,
    NextResponse: {
      ...originalModule.NextResponse,
      json: jest.fn((data, options = {}) => {
        return {
          json: () => Promise.resolve(data),
          status: options.status || 200,
          headers: new Map()
        };
      })
    }
  };
});
