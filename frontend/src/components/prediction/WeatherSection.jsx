import React from "react";
import FarmLocationMap from "../FarmLocationMap";
import HistoricalWeatherCard from "../HistoricalWeatherCard";

export default function WeatherSection({
  formData,
  errors,
  touched,
  handleChange,
  handleBlur,
  getInputClass,
  searchQuery,
  setSearchQuery,
  suggestions,
  searchLoading,
  showDropdown,
  setShowDropdown,
  activeIndex,
  handleKeyDown,
  handleBlurSearch,
  handleFetchWeather,
  handleSelectSuggestion,
  handleFetchWeatherCoords,
  weatherLoading,
  handleResetLocation,
  triggerReverseGeocoding,
  weatherStatus,
  fieldsOnly = false,
}) {
  if (fieldsOnly) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label htmlFor="Temperature" className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 flex items-center justify-between">
            <span>Temperature (°C)</span>
          </label>
          <input
            id="Temperature"
            type="number"
            step="0.1"
            name="Temperature"
            value={formData.Temperature}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="10 - 38"
            aria-invalid={touched.Temperature && !!errors.Temperature}
            aria-describedby={errors.Temperature ? "error-Temperature" : undefined}
            className={getInputClass("Temperature")}
          />
          {touched.Temperature && errors.Temperature && (
            <span id="error-Temperature" className="text-[10px] text-rose-600 dark:text-rose-455 font-bold mt-1">
              {errors.Temperature}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="Rainfall" className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 flex items-center justify-between">
            <span>Cumulative Rainfall (mm)</span>
          </label>
          <input
            id="Rainfall"
            type="number"
            step="0.1"
            name="Rainfall"
            value={formData.Rainfall}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="200 - 2000"
            aria-invalid={touched.Rainfall && !!errors.Rainfall}
            aria-describedby={errors.Rainfall ? "error-Rainfall" : undefined}
            className={getInputClass("Rainfall")}
          />
          {touched.Rainfall && errors.Rainfall && (
            <span id="error-Rainfall" className="text-[10px] text-rose-600 dark:text-rose-455 font-bold mt-1">
              {errors.Rainfall}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="Humidity" className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 flex items-center justify-between">
            <span>Relative Humidity (%)</span>
          </label>
          <input
            id="Humidity"
            type="number"
            step="0.1"
            name="Humidity"
            value={formData.Humidity}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="30 - 90"
            aria-invalid={touched.Humidity && !!errors.Humidity}
            aria-describedby={errors.Humidity ? "error-Humidity" : undefined}
            className={getInputClass("Humidity")}
          />
          {touched.Humidity && errors.Humidity && (
            <span id="error-Humidity" className="text-[10px] text-rose-600 dark:text-rose-455 font-bold mt-1">
              {errors.Humidity}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Location Input and Fetch Weather Button */}
        <div className="relative w-full">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                name="Location"
                id="Location"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={handleBlurSearch}
                onKeyDown={handleKeyDown}
                placeholder="Search village, taluk, district, state or PIN code"
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {searchLoading && (
                <div className="absolute right-2.5 top-2">
                  <svg className="animate-spin h-3.5 w-3.5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleFetchWeather}
              disabled={weatherLoading || !searchQuery.trim()}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-850 text-white disabled:text-slate-400 dark:disabled:text-slate-650 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 whitespace-nowrap"
            >
              {weatherLoading ? "Fetching..." : "Search"}
            </button>
          </div>

          {/* Suggestions Dropdown overlay */}
          {showDropdown && searchQuery.trim().length >= 2 && (
            <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
              {searchLoading && suggestions.length === 0 && (
                <div className="p-3 text-xs text-slate-400 dark:text-slate-500 italic animate-pulse">
                  Searching locations...
                </div>
              )}
              {!searchLoading && suggestions.length === 0 && (
                <div className="p-3 text-xs text-slate-400 dark:text-slate-500 italic">
                  No results found
                </div>
              )}
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onMouseDown={() => handleSelectSuggestion(suggestion)}
                  className={`w-full text-left px-3.5 py-2.5 text-xs transition duration-150 flex items-center gap-2 cursor-pointer ${
                    index === activeIndex
                      ? "bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="truncate">{suggestion.displayName}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Map Selector */}
      <FarmLocationMap
        lat={formData.Latitude ? Number(formData.Latitude) : 12.9716}
        lng={formData.Longitude ? Number(formData.Longitude) : 77.5946}
        readableAddress={formData.ReadableAddress}
        onChangeLocation={triggerReverseGeocoding}
        onFetchWeather={handleFetchWeatherCoords}
        weatherLoading={weatherLoading}
        onResetLocation={handleResetLocation}
      />

      {/* Success / Error States */}
      {weatherStatus && (
        <div className={`p-3 rounded-lg text-xs font-semibold ${
          weatherStatus.type === "success"
            ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/30"
            : "bg-rose-50 text-rose-800 dark:bg-rose-950/20 dark:text-rose-455 border border-rose-100 dark:border-rose-900/30"
        }`}>
          {weatherStatus.message}
        </div>
      )}

      {/* Historical Weather Data Module */}
      <HistoricalWeatherCard
        latitude={formData.Latitude ? Number(formData.Latitude) : 12.9716}
        longitude={formData.Longitude ? Number(formData.Longitude) : 77.5946}
        locationName={formData.ReadableAddress || formData.Location}
      />
    </div>
  );
}
