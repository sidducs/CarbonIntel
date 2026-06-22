import React from "react";

export default function FormActions({ loading, isFormValid, handleReset }) {
  return (
    <div className="border-t border-slate-100 dark:border-slate-700/80 pt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
      <button
        type="button"
        onClick={handleReset}
        className="w-full sm:w-auto px-6 py-3 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-350 rounded-xl font-bold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer text-sm"
      >
        Reset Form
      </button>
      <button
        type="submit"
        disabled={loading || !isFormValid()}
        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed text-sm"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Predicting...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Evaluate Carbon Footprint
          </>
        )}
      </button>
    </div>
  );
}
