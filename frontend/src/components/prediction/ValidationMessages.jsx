import React from "react";

export default function ValidationMessages({
  showSuccessBanner,
  setShowSuccessBanner,
  apiError,
  clearApiError,
  autofillNotification,
  setAutofillNotification,
  soilLoading,
  soilStatus,
  setSoilStatus,
}) {
  return (
    <>
      {/* Success Alert Banner */}
      {showSuccessBanner && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-450 rounded-xl text-sm flex items-start justify-between gap-3 animate-fade-in">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-bold">Assessment Generated</p>
              <p className="text-xs text-emerald-700/90 dark:text-emerald-400/80 mt-0.5">
                Prediction generated successfully based on current variables.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSuccessBanner(false)}
            className="text-emerald-500 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* API Error Alert Banner */}
      {apiError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-800 dark:text-rose-450 rounded-xl text-sm flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-bold">Submission Failed</p>
              <p className="text-xs text-rose-700/95 dark:text-rose-400/80 mt-0.5">{apiError}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearApiError}
            className="text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-350"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Autofill Notification Banner */}
      {autofillNotification && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-450 rounded-xl text-sm flex items-start justify-between gap-3 animate-fade-in">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-bold">Smart Soil Autofill</p>
              <p className="text-xs text-emerald-750/90 dark:text-emerald-400/80 mt-0.5">{autofillNotification}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAutofillNotification("")}
            className="text-emerald-500 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Soil Loading Banner */}
      {soilLoading && (
        <div className="p-4 bg-blue-50 dark:bg-blue-955/20 border border-blue-100 dark:border-blue-900/30 text-blue-800 dark:text-blue-400 rounded-xl text-sm flex items-center gap-3 animate-pulse">
          <svg className="animate-spin h-5 w-5 text-blue-600 dark:text-blue-450" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="font-bold">Fetching soil information...</p>
        </div>
      )}

      {/* Soil Status / Error Banner */}
      {soilStatus && (
        <div
          className={`p-4 rounded-xl text-sm flex items-start justify-between gap-3 ${
            soilStatus.type === "error"
              ? "bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-800 dark:text-rose-455"
              : "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-450"
          }`}
        >
          <div className="flex items-start gap-2">
            {soilStatus.type === "error" ? (
              <svg className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-455" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <div>
              <p className="font-bold">{soilStatus.type === "error" ? "Soil Data Unavailable" : "Soil Data Populated"}</p>
              <p className="text-xs mt-0.5">{soilStatus.message}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSoilStatus(null)}
            className={`hover:opacity-80 ${soilStatus.type === "error" ? "text-rose-500" : "text-emerald-500"}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
