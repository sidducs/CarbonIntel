function EmptyState({ title = "No Data Available", description, icon, action }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 text-center space-y-4 max-w-xl mx-auto">
      <div className="inline-flex p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-400 dark:text-slate-550 border border-slate-100 dark:border-slate-800 shadow-xs">
        {icon || (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16 4h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293H10.586a1 1 0 01-.707-.293L7.464 15.293a1 1 0 00-.707-.293H4" />
          </svg>
        )}
      </div>
      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-slate-800 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="pt-2">
          {action}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
