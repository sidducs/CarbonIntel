function SustainabilityCard({ sustainability, loading }) {
  const hasValue = sustainability !== null && sustainability !== undefined;

  // 1. Loading State (Skeleton Loader)
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between min-h-[220px] animate-pulse">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-28 bg-slate-250 dark:bg-slate-700 rounded" />
              <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700/80 rounded" />
            </div>
          </div>
          <div className="h-10 w-36 bg-slate-200 dark:bg-slate-700 rounded-lg mt-2" />
        </div>
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-700/80">
          <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div className="h-3 w-full bg-slate-150 dark:bg-slate-700/50 rounded" />
        </div>
      </div>
    );
  }

  // 2. Empty State (Before Prediction)
  if (!hasValue) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed shadow-sm p-6 flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:border-slate-350 dark:hover:border-slate-700">
        <div>
          {/* Header Block */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-slate-550 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Sustainability Level</h3>
              <p className="text-slate-450 dark:text-slate-500 text-[10px] font-medium uppercase tracking-wider">Eco Rating</p>
            </div>
          </div>

          {/* Empty State Message */}
          <p className="text-slate-500 dark:text-slate-450 text-sm leading-relaxed font-medium mt-2">
            Sustainability insights will appear after evaluation.
          </p>
        </div>

        {/* Footer Area for layout alignment */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          <span>Awaiting evaluation</span>
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-ping" />
        </div>
      </div>
    );
  }

  // 3. Results State (After Prediction)
  const getLevelConfig = (level) => {
    if (!level) return null;
    const normalized = String(level).trim().toLowerCase();

    switch (normalized) {
      case "high":
        return {
          badge: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30",
          indicator: "bg-emerald-500",
          desc: "Maintain current sustainable practices.",
          icon: (
            <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
        };
      case "medium":
        return {
          badge: "bg-amber-50 dark:bg-amber-950/20 text-amber-850 dark:text-amber-400 border-amber-200 dark:border-amber-900/30",
          indicator: "bg-amber-500",
          desc: "Opportunity for emission reduction.",
          icon: (
            <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
        };
      case "low":
        return {
          badge: "bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-455 border-rose-200 dark:border-rose-900/30",
          indicator: "bg-rose-500",
          desc: "Consider reducing fertilizer intensity.",
          icon: (
            <svg className="w-6 h-6 text-rose-600 dark:text-rose-450" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
      default:
        return {
          badge: "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800",
          indicator: "bg-slate-400",
          desc: "Unknown sustainability eco rating.",
          icon: (
            <svg className="w-6 h-6 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
    }
  };

  const config = getLevelConfig(sustainability);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between min-h-[220px] relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-emerald-100 dark:hover:border-emerald-900/40">
      {/* Background decoration bubble */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/30 dark:bg-emerald-900/10 rounded-full -mr-8 -mt-8 opacity-50 pointer-events-none" />

      <div>
        {/* Header Block */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100/50 dark:border-emerald-900/30">
            {config.icon}
          </div>
          <div>
            <h3 className="text-slate-550 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Sustainability Level</h3>
            <p className="text-slate-355 dark:text-slate-550 text-[10px] font-medium uppercase tracking-wider">Eco Rating</p>
          </div>
        </div>

        {/* Primary Value */}
        <div className="flex items-baseline mb-2">
          <span className="text-4xl sm:text-5xl font-black text-slate-800 dark:text-white tracking-tight">
            {sustainability}
          </span>
          <span className="text-slate-400 dark:text-slate-500 font-bold ml-1.5 text-xs">Rating</span>
        </div>
      </div>

      {/* Footer / Badge & Recommendation */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 space-y-2">
        <div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border ${config.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.indicator}`} />
            {sustainability} sustainability
          </span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed font-medium">
          {config.desc}
        </p>
      </div>
    </div>
  );
}

export default SustainabilityCard;
