import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
    // Log to error reporting service (e.g., Sentry)
    if (import.meta.env.VITE_SENTRY_DSN) {
      // Sentry.captureException(error, { extra: errorInfo });
    }

    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
          <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center space-y-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-center">
              <AlertTriangle className="text-red-600" size={64} />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              We're sorry for the inconvenience. An unexpected error occurred while rendering this
              component.
            </p>

            {import.meta.env.VITE_ENVIRONMENT === 'development' && this.state.error && (
              <div className="text-left bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-auto">
                <p className="text-red-600 font-medium text-sm">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <details className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    <summary className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-100">
                      Stack Trace
                    </summary>
                    <pre className="mt-1 whitespace-pre-wrap break-words">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
              <button
                onClick={this.handleReset}
                className="btn btn-secondary flex items-center justify-center space-x-2"
              >
                <RefreshCw size={20} />
                <span>Try Again</span>
              </button>

              <button
                onClick={this.handleReload}
                className="btn btn-primary flex items-center justify-center space-x-2"
              >
                <RefreshCw size={20} />
                <span>Reload Page</span>
              </button>

              <Link
                to="/"
                className="btn btn-secondary flex items-center justify-center space-x-2"
              >
                <Home size={20} />
                <span>Go Home</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
