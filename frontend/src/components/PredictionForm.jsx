import React, { useState } from "react";
import { districtSoilDefaults } from "../services/districtSoilDefaults";
import { initialDefaults } from "../utils/constants";
import { useFormPersistence, loadPersistedForm } from "../hooks/useFormPersistence";
import { useDistrictAutofill } from "../hooks/useDistrictAutofill";
import { usePredictionForm } from "../hooks/usePredictionForm";

import CropSection from "./prediction/CropSection";
import DistrictSelector from "./prediction/DistrictSelector";
import SoilSection from "./prediction/SoilSection";
import FertilizerSection from "./prediction/FertilizerSection";
import WeatherSection from "./prediction/WeatherSection";
import FormActions from "./prediction/FormActions";
import ValidationMessages from "./prediction/ValidationMessages";
import ResultsSection from "./prediction/ResultsSection";
import { findNearestLab } from "../services/soilLabsService";

function PredictionForm({ onSubmit, onReset, loading, apiError, clearApiError, result }) {
  // Initialize state synchronously using loadPersistedForm
  const [formData, setFormData] = useState(() => loadPersistedForm(initialDefaults));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Sync state changes to localStorage
  useFormPersistence(formData);

  // Hook for District averages autofill and SoilGrids API lookups
  const {
    soilLoading,
    soilStatus,
    setSoilStatus,
    fetchedSoilGrids,
    setFetchedSoilGrids,
    autofillNotification,
    setAutofillNotification,
    handleDistrictChange,
    handleLocationSoilFetch,
  } = useDistrictAutofill(formData, setFormData, setErrors);

  // Hook for form actions, real-time validations, weather APIs, suggestions, and progressive disclosure modes
  const {
    locationMode,
    handleLocationModeChange,
    showSuccessBanner,
    setShowSuccessBanner,
    weatherLoading,
    weatherStatus,
    searchQuery,
    setSearchQuery,
    suggestions,
    searchLoading,
    showDropdown,
    setShowDropdown,
    activeIndex,
    handleChange,
    handleBlur,
    handleSelectSuggestion,
    handleKeyDown,
    handleBlurSearch,
    handleFetchWeather,
    handleFetchWeatherCoords,
    triggerReverseGeocoding,
    handleReset,
    handleResetLocation,
    handleSubmit,
    isFormValid,
    getInputClass,
  } = usePredictionForm({
    formData,
    setFormData,
    errors,
    setErrors,
    touched,
    setTouched,
    handleLocationSoilFetch,
    onSubmit,
    onReset,
    clearApiError,
    setFetchedSoilGrids,
    setSoilStatus,
  });

  // Helper function to render active source badge for SOC, pH, N, P, K
  const getSoilFieldBadge = (fieldName) => {
    const val = String(formData[fieldName]);

    // Check district default match
    if (formData.selectedDistrict && districtSoilDefaults[formData.selectedDistrict]) {
      const defaultVal = String(districtSoilDefaults[formData.selectedDistrict][fieldName]);
      if (val === defaultVal) {
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 dark:bg-amber-955/40 text-amber-800 dark:text-amber-400 border border-amber-200/50 dark:border-amber-850/30">
            District Dataset
          </span>
        );
      }
    }

    // Check SoilGrids default match
    if (fetchedSoilGrids) {
      const defaultVal = String(fetchedSoilGrids[fieldName]);
      if (val === defaultVal) {
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 dark:bg-blue-955/40 text-blue-800 dark:text-blue-400 border border-blue-200/50 dark:border-blue-850/30">
            ISRIC SoilGrids
          </span>
        );
      }
    }

    return null;
  };

  // Derived selector flag for single-page progressive disclosure
  const isLocationSelected =
    (locationMode === "district" && !!formData.selectedDistrict) ||
    (locationMode === "search" && !!formData.Location) ||
    (locationMode === "map" && !!formData.ReadableAddress && formData.ReadableAddress !== initialDefaults.ReadableAddress) ||
    (locationMode === "manual");

  const nearestLab = isLocationSelected && locationMode !== "manual"
    ? findNearestLab(Number(formData.Latitude), Number(formData.Longitude))
    : null;

  // Configuration for the location methods
  const locationMethods = [
    { id: "district", label: "Karnataka District", icon: "🏢" },
    { id: "search", label: "Search Address", icon: "🔍" },
    { id: "map", label: "Select on Map", icon: "🗺️" },
    { id: "manual", label: "Manual Input", icon: "✍️" }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-350">
      <div className="p-6 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-450" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          Farm Sustainability Assessment
        </h2>
        <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold">Progressive Flow</span>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
        {/* Status Messages and Banners */}
        <ValidationMessages
          showSuccessBanner={showSuccessBanner}
          setShowSuccessBanner={setShowSuccessBanner}
          apiError={apiError}
          clearApiError={clearApiError}
          autofillNotification={autofillNotification}
          setAutofillNotification={setAutofillNotification}
          soilLoading={soilLoading}
          soilStatus={soilStatus}
          setSoilStatus={setSoilStatus}
        />

        {/* SECTION 1: Location & Data Source selector */}
        <div className="bg-slate-50/40 dark:bg-slate-900/10 p-5 rounded-2xl border border-slate-150 dark:border-slate-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
              <span>📍</span> Location & Data Source
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Select input method</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {locationMethods.map((method) => {
              const active = locationMode === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => handleLocationModeChange(method.id)}
                  className={`py-3 px-2 text-center rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    active
                      ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500 text-emerald-800 dark:text-emerald-400 font-extrabold shadow-sm"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-350 dark:hover:border-slate-700"
                  }`}
                >
                  <span className="text-lg">{method.icon}</span>
                  <span>{method.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            {locationMode === "district" && (
              <div className="max-w-md">
                <DistrictSelector
                  selectedDistrict={formData.selectedDistrict}
                  onChange={handleDistrictChange}
                />
              </div>
            )}

            {locationMode === "search" && (
              <div className="max-w-md relative">
                <label htmlFor="Location" className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 block">
                  Search Address
                </label>
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
                      className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                    {searchLoading && (
                      <div className="absolute right-3 top-3">
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
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-150 dark:disabled:bg-slate-800 text-white disabled:text-slate-450 dark:disabled:text-slate-655 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50 whitespace-nowrap"
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
                        className={`w-full text-left px-3.5 py-2.5 text-xs transition duration-155 flex items-center gap-2 cursor-pointer ${
                          index === activeIndex
                            ? "bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold"
                            : "hover:bg-slate-55 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
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
            )}

            {locationMode === "map" && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  Select Location on Interactive Map
                </label>
                <WeatherSection
                  formData={formData}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  getInputClass={getInputClass}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  suggestions={suggestions}
                  searchLoading={searchLoading}
                  showDropdown={showDropdown}
                  setShowDropdown={setShowDropdown}
                  activeIndex={activeIndex}
                  handleKeyDown={handleKeyDown}
                  handleBlurSearch={handleBlurSearch}
                  handleFetchWeather={handleFetchWeather}
                  handleSelectSuggestion={handleSelectSuggestion}
                  handleFetchWeatherCoords={handleFetchWeatherCoords}
                  weatherLoading={weatherLoading}
                  handleResetLocation={handleResetLocation}
                  triggerReverseGeocoding={triggerReverseGeocoding}
                  weatherStatus={weatherStatus}
                  fieldsOnly={false}
                />
              </div>
            )}

            {locationMode === "manual" && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-xs text-emerald-800 dark:text-emerald-450 font-bold flex items-center gap-2">
                <span>✍️</span>
                <span>Manual Mode Active: Fill in all the soil properties, climate conditions, and crop details below manually.</span>
              </div>
            )}
          </div>
        </div>

        {/* PROGRESSIVE DISCLOSURE LAYER */}
        {isLocationSelected ? (
          <div className="space-y-6 animate-slide-down">
            {/* SECTION 2: Environmental Data */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                <span>🌱</span> Environmental Data
              </h3>

              <div className="space-y-4">
                {/* Soil Parameter Inputs */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest mb-3">Soil Metrics</h4>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <SoilSection
                      formData={formData}
                      errors={errors}
                      touched={touched}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      getInputClass={getInputClass}
                      getSoilFieldBadge={getSoilFieldBadge}
                    />
                  </div>
                </div>

                {/* Nearest Soil Testing Lab Info */}
                {nearestLab && (
                  <div className="bg-emerald-500/5 dark:bg-emerald-500/[0.03] p-4 rounded-xl border border-emerald-500/10 dark:border-emerald-500/5 space-y-2 animate-slide-down">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-450 uppercase tracking-wider flex items-center gap-1">
                        <span>🧪</span> Recommended Soil Testing Facility
                      </span>
                      <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-full border border-slate-200/50 dark:border-slate-800/50">
                        AIKosh Verified
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-200 block">{nearestLab.name}</span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] block mt-0.5">
                          📍 {nearestLab.district}, {nearestLab.state} • <span className="font-black text-emerald-600 dark:text-emerald-450">{nearestLab.distance.toFixed(1)} km away</span>
                        </span>
                      </div>
                      <div className="sm:text-right flex flex-col justify-end">
                        <span className="text-slate-500 dark:text-slate-450 text-[10px] block">
                          🕒 Timings: {nearestLab.timing_from && nearestLab.timing_to && nearestLab.timing_from.trim() && nearestLab.timing_to.trim() ? `${nearestLab.timing_from.trim()} - ${nearestLab.timing_to.trim()}` : "Not Specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Weather Parameter Inputs */}
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4">
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest mb-3">Climatological Profile</h4>
                  <WeatherSection
                    formData={formData}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    getInputClass={getInputClass}
                    fieldsOnly={true}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Farm Information */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                <span>🌾</span> Farm Information
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <CropSection
                  value={formData.Crop_Type}
                  onChange={handleChange}
                />

                <FertilizerSection
                  formData={formData}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  getInputClass={getInputClass}
                />
              </div>
            </div>

            {/* SECTION 4: Assessment button */}
            <FormActions
              loading={loading}
              isFormValid={isFormValid}
              handleReset={handleReset}
            />
          </div>
        ) : (
          <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/20 dark:bg-slate-900/5">
            <span className="text-3xl block mb-2">👉</span>
            <p className="text-xs font-bold text-slate-650 dark:text-slate-400">
              Please select a Karnataka District, Search an Address, or Select on Map to initialize environmental metrics.
            </p>
            <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-1">
              CarbonIntel will automatically fetch hyper-local soil parameters and NASA climatological baselines.
            </p>
          </div>
        )}

        {/* SECTION 5: Results */}
        {result && (
          <ResultsSection
            result={result}
            formData={formData}
          />
        )}
      </form>
    </div>
  );
}

export default PredictionForm;
