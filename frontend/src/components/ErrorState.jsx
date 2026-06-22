function ErrorState({ message = "An unexpected error occurred.", onRetry }) {
  return (
    <div className="bg-rose-50/50 dark:bg-rose-950/10 rounded-2xl border border-rose-150 dark:border-rose-900/30 p-8 text-center space-y-4 max-w-xl mx-auto">
      <div className="inline-flex p-3 bg-rose-100 dark:bg-rose-950/40 rounded-2xl text-rose-600 dark:text-rose-400">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-rose-900 dark:text-rose-455">
          Operation Failed
        </h3>
        <p className="text-sm text-rose-700/80 dark:text-rose-400">
          {message}
        </p>
      </div>
      {onRetry && (
        <div className="pt-2">
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          >
            Retry Request
          </button>
        </div>
      )}
    </div>
  );
}

export default ErrorState;
