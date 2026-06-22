import { useState } from "react";
import { getHistoricalWeather, downloadWeatherCSV } from "../services/weatherHistoryService";

function HistoricalWeatherCard({ latitude, longitude, locationName }) {
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const handleFetch = async () => {
    if (!latitude || !longitude) {
      setError("Please select a location on the map first.");
      return;
    }

    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date cannot be after end date.");
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const data = await getHistoricalWeather(latitude, longitude, startDate, endDate);
      setWeatherData(data);
    } catch (err) {
      setError(err.message || "Failed to retrieve historical climate records.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!weatherData) return;
    downloadWeatherCSV(weatherData, locationName || "Farm Location");
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs space-y-6">
      <div>
        <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Historical Climate Archives
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Access research-grade historical meteorology data (NASA POWER API) for coordinate analysis.
        </p>
      </div>

      {/* Date Range Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="history-start-date" className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
            Start Date
          </label>
          <input
            type="date"
            id="history-start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="history-end-date" className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
            End Date
          </label>
          <input
            type="date"
            id="history-end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="text-[11px] text-slate-400 dark:text-slate-500">
          📍 Target: <span className="font-bold text-slate-600 dark:text-slate-355">{latitude?.toFixed(4)}° N, {longitude?.toFixed(4)}° E</span>
        </div>
        <button
          type="button"
          onClick={handleFetch}
          disabled={loading}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 dark:disabled:bg-slate-900 text-white disabled:text-slate-400 dark:disabled:text-slate-600 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 flex items-center gap-1.5"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-3 w-3 text-current" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Retrieving...
            </>
          ) : (
            "Fetch Historical Data"
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 rounded-xl text-xs border border-rose-100 dark:border-rose-900/30">
          {error}
        </div>
      )}

      {/* Metrics Summary Displays */}
      {weatherData && (
        <div className="space-y-4 border-t border-slate-100 dark:border-slate-700/80 pt-5 animate-fadeIn">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Metric 1: Temp */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                Avg Temp
              </span>
              <span className="text-base font-black text-slate-800 dark:text-slate-150">
                {weatherData.summary.avgTemperature}°C
              </span>
            </div>

            {/* Metric 2: Rainfall */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                Avg Rainfall
              </span>
              <span className="text-base font-black text-slate-800 dark:text-slate-150">
                {weatherData.summary.avgRainfall} mm
              </span>
            </div>

            {/* Metric 3: Humidity */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                Avg Humidity
              </span>
              <span className="text-base font-black text-slate-800 dark:text-slate-150">
                {weatherData.summary.avgHumidity}%
              </span>
            </div>

            {/* Metric 4: Total Days */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                Days Checked
              </span>
              <span className="text-base font-black text-slate-800 dark:text-slate-150">
                {weatherData.summary.totalDays} days
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleExport}
              className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV Dataset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoricalWeatherCard;
