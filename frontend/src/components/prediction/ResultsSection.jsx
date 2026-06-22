import React from "react";
import SmartRecommendations from "../SmartRecommendations";
import ExportReportButton from "../ExportReportButton";

export default function ResultsSection({ result, formData }) {
  if (!result) return null;

  const numCF = parseFloat(result.carbon_footprint);
  let credits = 0;
  if (!isNaN(numCF) && numCF < 800) {
    credits = parseFloat(((800 - numCF) / 1000).toFixed(2));
  }

  return (
    <div className="border-t border-slate-150 dark:border-slate-700/80 pt-8 space-y-6 animate-fade-in">
      <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-450" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Assessment Results
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Carbon Footprint Card */}
        <div className="p-5 bg-emerald-50/10 dark:bg-emerald-950/10 border border-emerald-100/80 dark:border-emerald-900/30 rounded-2xl transition-all hover:shadow-md">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">Carbon Footprint</span>
          <p className="text-2xl font-black text-emerald-900 dark:text-emerald-100 mt-2">
            {numCF.toFixed(1)} <span className="text-xs font-normal text-slate-500">kg CO2/ha</span>
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2.5">Annual greenhouse gas emissions per hectare.</p>
        </div>

        {/* Sustainability Rating Card */}
        <div className="p-5 bg-blue-50/10 dark:bg-blue-950/10 border border-blue-100/80 dark:border-blue-900/30 rounded-2xl transition-all hover:shadow-md">
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block">Sustainability Rating</span>
          <div className="mt-2.5">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              result.sustainability === "High" || result.sustainability === "Gold"
                ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border border-emerald-250/30"
                : result.sustainability === "Medium" || result.sustainability === "Silver"
                ? "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-250/30"
                : "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-400 border border-rose-250/30"
            }`}>
              {result.sustainability}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-3">Evaluated ecological rating based on inputs.</p>
        </div>

        {/* Carbon Credits Card */}
        <div className="p-5 bg-amber-50/10 dark:bg-amber-950/10 border border-amber-100/80 dark:border-amber-900/30 rounded-2xl transition-all hover:shadow-md">
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block">Carbon Credits</span>
          <p className="text-2xl font-black text-amber-900 dark:text-amber-100 mt-2">
            {credits.toFixed(2)} <span className="text-xs font-normal text-slate-500">tCO2e</span>
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2.5">Offset potential based on benchmark emissions.</p>
        </div>
      </div>

      {/* Actionable Recommendations */}
      <SmartRecommendations
        formData={formData}
        carbonFootprint={result.carbon_footprint}
        sustainability={result.sustainability}
      />

      {/* Export Report Card */}
      <div className="flex justify-end p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl">
        <ExportReportButton
          carbonFootprint={result.carbon_footprint}
          sustainability={result.sustainability}
          formData={formData}
        />
      </div>
    </div>
  );
}
