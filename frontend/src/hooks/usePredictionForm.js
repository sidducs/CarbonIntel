import { useState, useEffect } from "react";
import { getCoordinates, getWeather } from "../services/weatherService";
import { reverseGeocode, searchLocations } from "../services/geocodingService";
import { validateField } from "../utils/validation";
import { initialDefaults } from "../utils/constants";

export function usePredictionForm({
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
}) {
  const [locationMode, setLocationMode] = useState("district");
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherStatus, setWeatherStatus] = useState(null);

  const handleLocationModeChange = (mode) => {
    setLocationMode(mode);
    setFormData((prev) => ({
      ...prev,
      Location: initialDefaults.Location,
      Latitude: initialDefaults.Latitude,
      Longitude: initialDefaults.Longitude,
      ReadableAddress: initialDefaults.ReadableAddress,
      Village: initialDefaults.Village,
      Taluk: initialDefaults.Taluk,
      District: initialDefaults.District,
      State: initialDefaults.State,
      Country: initialDefaults.Country,
      PostalCode: initialDefaults.PostalCode,
      selectedDistrict: "",
      SOC: "",
      N_Content: "",
      P_Content: "",
      K_Content: "",
      pH: "",
      Temperature: "",
      Rainfall: "",
      Humidity: "",
    }));
    setFetchedSoilGrids(null);
    setSoilStatus(null);
    setSearchQuery("");
  };

  const [searchQuery, setSearchQuery] = useState(formData.Location || "");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setSearchQuery(formData.Location || "");
  }, [formData.Location]);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const handler = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const results = await searchLocations(searchQuery);
        setSuggestions(results);
        setShowDropdown(true);
        setActiveIndex(-1);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 450);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nextData = { ...formData, [name]: value };

    if (name === "Fertilizer_Type" && value === "None") {
      nextData.Fertilizer_Amount = "0";
    }

    setFormData(nextData);
    setShowSuccessBanner(false);

    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSelectSuggestion = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      Location: suggestion.displayName,
      Latitude: suggestion.latitude,
      Longitude: suggestion.longitude,
      ReadableAddress: suggestion.displayName,
      Village: suggestion.village,
      Taluk: suggestion.taluk,
      District: suggestion.district,
      State: suggestion.state,
      Country: suggestion.country,
      PostalCode: suggestion.postal_code,
    }));

    setSearchQuery(suggestion.displayName);
    setSuggestions([]);
    setShowDropdown(false);

    handleFetchWeatherCoordsExplicit(suggestion.latitude, suggestion.longitude);
    handleLocationSoilFetch(suggestion.latitude, suggestion.longitude, suggestion.district);
  };

  const handleFetchWeatherCoordsExplicit = async (lat, lng) => {
    setWeatherLoading(true);
    setWeatherStatus(null);
    try {
      const weatherData = await getWeather(lat, lng);
      setFormData((prev) => ({
        ...prev,
        Temperature: weatherData.temperature !== null ? String(Math.min(38, Math.max(10, Math.round(weatherData.temperature)))) : prev.Temperature,
        Humidity: weatherData.humidity !== null ? String(Math.min(90, Math.max(30, Math.round(weatherData.humidity)))) : prev.Humidity,
        Rainfall: weatherData.rainfall !== null ? String(Math.min(2000, Math.max(200, Math.round(weatherData.rainfall)))) : prev.Rainfall
      }));
      setErrors((prev) => ({
        ...prev,
        Temperature: "",
        Humidity: "",
        Rainfall: "",
      }));
      setWeatherStatus({
        type: "success",
        message: `Weather populated using ${weatherData.source || "selected coordinates"}.`,
      });
      setTimeout(() => setWeatherStatus(null), 4000);
    } catch (err) {
      setWeatherStatus({
        type: "error",
        message: err.message || "Unable to fetch weather data",
      });
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        handleSelectSuggestion(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const handleBlurSearch = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 250);
  };

  const handleFetchWeather = async () => {
    const query = searchQuery.trim();
    if (!query) return;

    setShowDropdown(false);
    setSuggestions([]);
    setWeatherLoading(true);
    setWeatherStatus(null);

    try {
      const coords = await getCoordinates(query);
      const weatherData = await getWeather(coords.latitude, coords.longitude);

      let cleanName = query;
      let districtName = null;
      try {
        const addressData = await reverseGeocode(coords.latitude, coords.longitude);
        cleanName = addressData.displayName;
        districtName = addressData.district;
      } catch (err) {
        console.error("Reverse geocoding after search failed:", err);
      }

      setFormData((prev) => ({
        ...prev,
        Location: cleanName,
        Latitude: coords.latitude,
        Longitude: coords.longitude,
        ReadableAddress: cleanName,
        District: districtName || prev.District,
        Temperature: weatherData.temperature !== null ? String(Math.min(38, Math.max(10, Math.round(weatherData.temperature)))) : prev.Temperature,
        Humidity: weatherData.humidity !== null ? String(Math.min(90, Math.max(30, Math.round(weatherData.humidity)))) : prev.Humidity,
        Rainfall: weatherData.rainfall !== null ? String(Math.min(2000, Math.max(200, Math.round(weatherData.rainfall)))) : prev.Rainfall
      }));

      setSearchQuery(cleanName);

      setErrors((prev) => ({
        ...prev,
        Temperature: "",
        Humidity: "",
        Rainfall: "",
      }));

      setWeatherStatus({
        type: "success",
        message: `Weather populated using ${weatherData.source || "search query"}.`,
      });

      setTimeout(() => {
        setWeatherStatus(null);
      }, 4000);

      // Trigger soil data fetch for geocoded location
      handleLocationSoilFetch(coords.latitude, coords.longitude, districtName);

    } catch (err) {
      setWeatherStatus({
        type: "error",
        message: err.message || "Unable to fetch weather data",
      });
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleFetchWeatherCoords = async () => {
    const lat = formData.Latitude || 12.9716;
    const lng = formData.Longitude || 77.5946;
    setWeatherLoading(true);
    setWeatherStatus(null);

    try {
      const weatherData = await getWeather(lat, lng);

      setFormData((prev) => ({
        ...prev,
        Temperature: weatherData.temperature !== null ? String(Math.min(38, Math.max(10, Math.round(weatherData.temperature)))) : prev.Temperature,
        Humidity: weatherData.humidity !== null ? String(Math.min(90, Math.max(30, Math.round(weatherData.humidity)))) : prev.Humidity,
        Rainfall: weatherData.rainfall !== null ? String(Math.min(2000, Math.max(200, Math.round(weatherData.rainfall)))) : prev.Rainfall
      }));

      setErrors((prev) => ({
        ...prev,
        Temperature: "",
        Humidity: "",
        Rainfall: "",
      }));

      setWeatherStatus({
        type: "success",
        message: `Weather populated using ${weatherData.source || "coordinates"}.`,
      });

      setTimeout(() => {
        setWeatherStatus(null);
      }, 4000);
    } catch (err) {
      setWeatherStatus({
        type: "error",
        message: err.message || "Unable to fetch weather data",
      });
    } finally {
      setWeatherLoading(false);
    }
  };

  const triggerReverseGeocoding = async (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      Latitude: lat,
      Longitude: lng,
    }));

    handleFetchWeatherCoordsExplicit(lat, lng);

    try {
      const addressData = await reverseGeocode(lat, lng);
      setFormData((prev) => ({
        ...prev,
        Latitude: lat,
        Longitude: lng,
        ReadableAddress: addressData.displayName,
        District: addressData.district || prev.District,
      }));

      handleLocationSoilFetch(lat, lng, addressData.district);
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
      setFormData((prev) => ({
        ...prev,
        Latitude: lat,
        Longitude: lng,
        ReadableAddress: `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`,
      }));
      handleLocationSoilFetch(lat, lng, null);
    }
  };

  const handleReset = () => {
    try {
      localStorage.removeItem("farmForm");
    } catch (err) {
      console.error("Failed to clear farmForm from localStorage:", err);
    }
    setFormData(initialDefaults);
    setErrors({});
    setTouched({});
    setShowSuccessBanner(false);
    setFetchedSoilGrids(null);
    setSoilStatus(null);
    setLocationMode("district");
    setSearchQuery("");
    if (clearApiError) {
      clearApiError();
    }
    if (onReset) {
      onReset();
    }
  };

  const handleResetLocation = () => {
    setFormData((prev) => ({
      ...prev,
      Location: initialDefaults.Location,
      Latitude: initialDefaults.Latitude,
      Longitude: initialDefaults.Longitude,
      ReadableAddress: initialDefaults.ReadableAddress,
      Village: initialDefaults.Village,
      Taluk: initialDefaults.Taluk,
      District: initialDefaults.District,
      State: initialDefaults.State,
      Country: initialDefaults.Country,
      PostalCode: initialDefaults.PostalCode,
    }));
    setSearchQuery("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const newTouched = {};
    const ignoredFields = [
      "Location", "Latitude", "Longitude", "ReadableAddress", "Village", 
      "Taluk", "District", "State", "Country", "PostalCode", "selectedDistrict"
    ];
    Object.keys(formData).forEach((field) => {
      if (!ignoredFields.includes(field)) {
        newTouched[field] = true;
        const err = validateField(field, formData[field]);
        if (err) newErrors[field] = err;
      }
    });

    setErrors(newErrors);
    setTouched(newTouched);

    const hasValidationErrors = Object.values(newErrors).some((err) => err !== "");
    if (hasValidationErrors) return;

    const parsedPayload = {
      Crop_Type: formData.Crop_Type,
      SOC: parseFloat(formData.SOC),
      N_Content: parseFloat(formData.N_Content),
      P_Content: parseFloat(formData.P_Content),
      K_Content: parseFloat(formData.K_Content),
      pH: parseFloat(formData.pH),
      Fertilizer_Type: formData.Fertilizer_Type,
      Fertilizer_Amount: parseFloat(formData.Fertilizer_Amount),
      Temperature: parseFloat(formData.Temperature),
      Rainfall: parseFloat(formData.Rainfall),
      Humidity: parseFloat(formData.Humidity),
    };

    const success = await onSubmit(parsedPayload);
    if (success !== false) {
      setShowSuccessBanner(true);
    }
  };

  const hasErrors = Object.values(errors).some((err) => err !== "");
  const isFormValid = () => {
    const ignoredFields = [
      "Location", "Latitude", "Longitude", "ReadableAddress", "Village", 
      "Taluk", "District", "State", "Country", "PostalCode", "selectedDistrict"
    ];
    const anyEmpty = Object.keys(formData).some(
      (key) => !ignoredFields.includes(key) && formData[key] === ""
    );
    return !hasErrors && !anyEmpty;
  };

  const getInputClass = (name) => {
    const isTouched = touched[name];
    const hasError = !!errors[name];
    const baseClass = "w-full border rounded-lg p-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-slate-900/40 dark:disabled:text-slate-600";

    if (!isTouched) {
      return `${baseClass} border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100`;
    }
    if (hasError) {
      return `${baseClass} border-rose-300 dark:border-rose-800/80 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/10 dark:bg-rose-950/10 text-rose-900 dark:text-rose-200`;
    }
    return `${baseClass} border-emerald-300 dark:border-emerald-800/80 focus:border-emerald-500 focus:ring-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/10 text-slate-900 dark:text-slate-100`;
  };

  return {
    locationMode,
    setLocationMode,
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
  };
}
