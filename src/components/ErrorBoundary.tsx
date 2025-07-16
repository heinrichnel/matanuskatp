import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Optional: Send to external service (e.g., Sentry, LogRocket)
    console.error('🔴 ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center px-4">
          <h1 className="text-3xl font-bold text-red-700 mb-3">Something went wrong.</h1>
          <p className="text-red-600 mb-6">{this.state.error?.message ?? 'Unexpected application error.'}</p>
          <button
            onClick={this.handleReload}
            className="px-5 py-2 rounded bg-red-700 text-white hover:bg-red-800 transition"
          >
            🔄 Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
