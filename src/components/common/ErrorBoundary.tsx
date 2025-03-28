import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Optional: Log error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex min-h-[300px] flex-col items-center justify-center rounded-lg bg-red-50 p-6'>
          <h2 className='mb-4 text-2xl font-bold text-red-600'>
            Something went wrong
          </h2>
          <p className='mb-4 text-red-500'>
            An unexpected error occurred while rendering the component.
          </p>
          {this.state.error && (
            <details className='mb-4 w-full max-w-md rounded-md bg-red-100 p-4'>
              <summary className='cursor-pointer text-red-700'>
                Error Details
              </summary>
              <pre className='overflow-x-auto text-xs text-red-800'>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
          <button
            onClick={this.handleRetry}
            className='rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600'
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
