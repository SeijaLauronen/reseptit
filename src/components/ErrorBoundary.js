import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert">
    <p>Jotain meni vikaan:</p>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Yritä uudelleen</button>
  </div>
);

const MyErrorBoundary = ({ children }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    {children}
  </ErrorBoundary>
);

export default MyErrorBoundary;
