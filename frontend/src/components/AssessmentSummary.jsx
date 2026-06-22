function AssessmentSummary({ carbonFootprint, sustainability }) {
  const hasValue = carbonFootprint !== null && carbonFootprint !== undefined;

  // Empty state fallback
  if (!hasValue) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed p-6 min-h-[150px] flex flex-col items-center justify-center text-center">
        <svg className="w-8 h-8 text-slate-350 dark:text-slate-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">No Assessment Summary Available</p>
        <p className="text-slate-400 dark:text-slate-550 text-[11px] mt-1">Complete a prediction in the intake form to see detailed recommendations.</p>
      </div>
    );
  }

  const numVal = parseFloat(carbonFootprint);

  // 1. Emission Category & Carbon Status & Recommendation
  let categoryLabel = "Unknown";
  let categoryBadge = "bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-200 border-slate-200 dark:border-slate-800";
  let carbonStatusLabel = "Unknown";
  let carbonStatusBadge = "bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-200 border-slate-200 dark:border-slate-800";
  let recommendationText = "No recommendation available.";
  let recBorderColor = "border-slate-100 dark:border-slate-800";

  if (!isNaN(numVal)) {
    if (numVal < 400) {
      categoryLabel = "Low Emission";
      categoryBadge = "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30";
      carbonStatusLabel = "Excellent";
      carbonStatusBadge = "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-850 dark:text-emerald-400 border-emerald-250 dark:border-emerald-900/30";
      recommendationText = "Maintain current practices.";
      recBorderColor = "border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/10 dark:bg-emerald-950/5 text-slate-800 dark:text-slate-100";
    } else if (numVal <= 1200) {
      categoryLabel = "Moderate Emission";
      categoryBadge = "bg-amber-50 dark:bg-amber-950/20 text-amber-850 dark:text-amber-400 border-amber-200 dark:border-amber-900/30";
      carbonStatusLabel = "Acceptable";
      carbonStatusBadge = "bg-amber-50 dark:bg-amber-950/20 text-amber-850 dark:text-amber-400 border-amber-250 dark:border-amber-900/30";
      recommendationText = "Opportunities exist for emission reduction.";
      recBorderColor = "border-amber-200 dark:border-amber-900/30 bg-amber-50/10 dark:bg-amber-950/5 text-slate-850 dark:text-slate-100";
    } else {
      categoryLabel = "High Emission";
      categoryBadge = "bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-450 border-rose-200 dark:border-rose-900/30";
      carbonStatusLabel = "Critical";
      carbonStatusBadge = "bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-455 border-rose-250 dark:border-rose-900/30";
      recommendationText = "Reduce fertilizer intensity and improve soil carbon.";
      recBorderColor = "border-rose-200 dark:border-rose-900/30 bg-rose-50/10 dark:bg-rose-950/5 text-slate-800 dark:text-slate-100";
    }
  }

  // 2. Sustainability Rating Badge
  const normalizedSust = String(sustainability || "").trim().toLowerCase();
  let sustainabilityBadge = "bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-200 border-slate-200 dark:border-slate-800";
  let sustainabilityLabel = sustainability || "Unknown";

  if (normalizedSust === "high") {
    sustainabilityBadge = "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30";
  } else if (normalizedSust === "medium") {
    sustainabilityBadge = "bg-amber-50 dark:bg-amber-950/20 text-amber-850 dark:text-amber-400 border-amber-200 dark:border-amber-900/30";
  } else if (normalizedSust === "low") {
    sustainabilityBadge = "bg-rose-50 dark:bg-rose-950/20 text-rose-855 dark:text-rose-450 border-rose-200 dark:border-rose-900/30";
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-5 transition-all duration-300 hover:shadow-lg hover:border-emerald-100 dark:hover:border-emerald-900/40 relative overflow-hidden">
      {/* Shaded top border decoration */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-400" />
      
      {/* Header Block */}
      <div>
        <h3 className="text-slate-800 dark:text-white font-extrabold text-sm tracking-tight flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Assessment Summary
        </h3>
        <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Ecological Summary Profiles</p>
      </div>

      {/* Grid of badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3 border-t border-slate-100 dark:border-slate-700/80 pt-4">
        
        {/* Emission Category */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Emission Category</span>
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${categoryBadge}`}>
              {categoryLabel}
            </span>
          </div>
        </div>

        {/* Sustainability Rating */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Sustainability</span>
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${sustainabilityBadge}`}>
              {sustainabilityLabel}
            </span>
          </div>
        </div>

        {/* Carbon Status */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Carbon Status</span>
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${carbonStatusBadge}`}>
              {carbonStatusLabel}
            </span>
          </div>
        </div>

      </div>

      {/* Recommendation Block */}
      <div className={`border rounded-xl p-4 transition-all duration-300 ${recBorderColor}`}>
        <div className="flex items-start gap-2.5">
          <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Agronomic Recommendation</h4>
            <p className="text-slate-600 dark:text-slate-350 text-xs leading-relaxed font-semibold">
              {recommendationText}
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default AssessmentSummary;
