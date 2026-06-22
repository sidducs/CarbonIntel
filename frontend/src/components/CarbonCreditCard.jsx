function CarbonCreditCard({ carbonFootprint, loading }) {
  const hasValue = carbonFootprint !== null && carbonFootprint !== undefined;

  // 1. Loading State (Skeleton Loader)
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between min-h-[220px] animate-pulse">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-2 w-16 bg-slate-100 dark:bg-slate-700/80 rounded" />
            </div>
          </div>
          <div className="space-y-2 mt-2">
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-6 w-24 bg-slate-100 dark:bg-slate-700/50 rounded" />
          </div>
        </div>
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-700/80">
          <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-700/50 rounded" />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-slate-550 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Carbon Credit Potential</h3>
              <p className="text-slate-450 dark:text-slate-500 text-[10px] font-medium uppercase tracking-wider">Revenue Estimator</p>
            </div>
          </div>

          {/* Empty State Message */}
          <p className="text-slate-500 dark:text-slate-450 text-sm leading-relaxed font-medium mt-2">
            Potential carbon credits will be calculated after assessment.
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
  // Calculate carbon credit metrics
  let credits = 0;
  const numVal = parseFloat(carbonFootprint);
  if (!isNaN(numVal) && numVal < 800) {
    credits = parseFloat(((800 - numVal) / 1000).toFixed(2));
  }
  const revenue = credits * 1500;

  // Determine opportunity classification
  const getOpportunityConfig = (c) => {
    if (c === 0) {
      return {
        label: "No Opportunity",
        badge: "bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-450 border-rose-200 dark:border-rose-900/30",
        indicator: "bg-rose-500",
      };
    } else if (c <= 0.50) {
      return {
        label: "Moderate Opportunity",
        badge: "bg-amber-50 dark:bg-amber-950/20 text-amber-850 dark:text-amber-400 border-amber-200 dark:border-amber-900/30",
        indicator: "bg-amber-500",
      };
    } else {
      return {
        label: "High Opportunity",
        badge: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30",
        indicator: "bg-emerald-500",
      };
    }
  };

  const config = getOpportunityConfig(credits);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between min-h-[220px] relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-emerald-100 dark:hover:border-emerald-900/40">
      {/* Background decoration bubble */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/30 dark:bg-blue-900/10 rounded-full -mr-8 -mt-8 opacity-50 pointer-events-none" />

      <div>
        {/* Header Block */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-700 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-slate-550 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Carbon Credit Potential</h3>
            <p className="text-slate-350 dark:text-slate-500 text-[10px] font-medium uppercase tracking-wider">Revenue Estimator</p>
          </div>
        </div>

        {/* Double Metric layout */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <p className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Estimated Credits</p>
            <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
              {credits.toFixed(2)} <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Cr</span>
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Potential Revenue</p>
            <p className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-450 tracking-tight">
              ₹{revenue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Footer / Badge & Explanation */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 space-y-2">
        <div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border ${config.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.indicator}`} />
            {config.label}
          </span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed font-medium">
          Estimated based on current carbon footprint.
        </p>
      </div>
    </div>
  );
}

export default CarbonCreditCard;
