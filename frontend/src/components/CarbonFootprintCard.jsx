function CarbonFootprintCard({ carbonFootprint, loading }) {
  const hasValue = carbonFootprint !== null && carbonFootprint !== undefined;

  // 1. Loading State (Skeleton Loader)
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between min-h-[220px] animate-pulse">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-150 dark:bg-slate-700 rounded-xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-2 w-16 bg-slate-150 dark:bg-slate-700/80 rounded" />
            </div>
          </div>
          <div className="h-10 w-36 bg-slate-200 dark:bg-slate-700 rounded-lg mt-2" />
        </div>
        <div className="space-y-2 pt-4 border-t border-slate-50 dark:border-slate-700/80">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5A2.5 2.5 0 0019 9.5V8a2 2 0 00-2-2h-3.172a2 2 0 00-1.414.586l-.828.828A2 2 0 0011 8H9a2 2 0 00-2 2v.5" />
              </svg>
            </div>
            <div>
              <h3 className="text-slate-550 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Carbon Footprint</h3>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-medium uppercase tracking-wider">Emissions Index</p>
            </div>
          </div>

          {/* Empty State Message */}
          <p className="text-slate-500 dark:text-slate-450 text-sm leading-relaxed font-medium mt-2">
            Run an assessment to view predicted emissions.
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
  const getCategoryConfig = (val) => {
    const numVal = parseFloat(val);
    if (isNaN(numVal)) {
      return {
        label: "Unknown",
        badge: "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800",
        indicator: "bg-slate-400",
        desc: "Invalid emission measurement detected.",
      };
    }
    if (numVal < 400) {
      return {
        label: "Low Emission",
        badge: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30",
        indicator: "bg-emerald-500",
        desc: "Excellent environmental performance. Farm emissions are well below sustainable thresholds.",
      };
    } else if (numVal <= 1200) {
      return {
        label: "Moderate Emission",
        badge: "bg-amber-50 dark:bg-amber-950/20 text-amber-850 dark:text-amber-400 border-amber-200 dark:border-amber-900/30",
        indicator: "bg-amber-500",
        desc: "Moderate ecological impact. Opportunities exist to optimize nitrogen and soil organic carbon.",
      };
    } else {
      return {
        label: "High Emission",
        badge: "bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-450 border-rose-200 dark:border-rose-900/30",
        indicator: "bg-rose-500",
        desc: "High greenhouse gas density. Immediate intervention in input intensities is recommended.",
      };
    }
  };

  const config = getCategoryConfig(carbonFootprint);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between min-h-[220px] relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-emerald-100 dark:hover:border-emerald-900/40">
      {/* Background decoration bubble */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/30 dark:bg-emerald-900/10 rounded-full -mr-8 -mt-8 opacity-50 pointer-events-none" />

      <div>
        {/* Header Block */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5A2.5 2.5 0 0019 9.5V8a2 2 0 00-2-2h-3.172a2 2 0 00-1.414.586l-.828.828A2 2 0 0011 8H9a2 2 0 00-2 2v.5" />
            </svg>
          </div>
          <div>
            <h3 className="text-slate-550 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Carbon Footprint</h3>
            <p className="text-slate-350 dark:text-slate-500 text-[10px] font-medium uppercase tracking-wider">Emissions Index</p>
          </div>
        </div>

        {/* Primary Value */}
        <div className="flex items-baseline mb-2">
          <span className="text-4xl sm:text-5xl font-black text-slate-800 dark:text-white tracking-tight">
            {parseFloat(carbonFootprint).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </span>
          <span className="text-slate-400 dark:text-slate-500 font-bold ml-1.5 text-xs">kg CO₂e/ha</span>
        </div>
      </div>

      {/* Footer / Badge & Description */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 space-y-2">
        <div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border ${config.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.indicator}`} />
            {config.label}
          </span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed font-medium">
          {config.desc}
        </p>
      </div>
    </div>
  );
}

export default CarbonFootprintCard;
