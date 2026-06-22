import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled runtime exception:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-md space-y-6">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Something went wrong</h1>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                CarbonIntel encountered an unexpected runtime error. Your local configuration is safe.
              </p>
              {this.state.error && (
                <pre className="text-[10px] bg-slate-50 text-slate-600 dark:bg-slate-900/60 dark:text-slate-400 p-3 rounded-lg overflow-x-auto text-left font-mono max-h-32 border border-slate-100 dark:border-slate-800/60">
                  {this.state.error.toString()}
                </pre>
              )}
            </div>

            <button
              type="button"
              onClick={this.handleReset}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
