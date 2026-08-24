'use client';

import { ErrorBoundary } from './ErrorBoundary';

export function ClientErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      showDetails={process.env.NODE_ENV === 'development'}
      onError={(error, errorInfo) => {
        console.error('[GlobalError]', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
