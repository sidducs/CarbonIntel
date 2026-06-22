function LoadingState({ message = "Loading assessments..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-100 dark:border-emerald-950/40 rounded-full animate-spin border-t-emerald-600 dark:border-t-emerald-450" />
        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 absolute animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 8 0 4.4-3 8-10 10Z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-450 animate-pulse">
        {message}
      </p>
    </div>
  );
}

export default LoadingState;
