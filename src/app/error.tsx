'use client';

import { AlertTriangle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Something went wrong</h2>
        <p className="text-gray-500 mb-2 max-w-md">
          An unexpected error occurred while loading this page.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-400 mb-6 font-mono">Error: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
