import { useState } from "react";
import { districtSoilDefaults } from "../services/districtSoilDefaults";
import { fetchSoilData } from "../services/soilGridsService";
import { getWeather } from "../services/weatherService";
import { constraints } from "../utils/constants";

// Static center coordinates for the Karnataka districts to bypass error-prone runtime geocoding
const districtCoordinates = {
  "Bagalkot": { lat: 16.1817, lng: 75.6958 },
  "Bangalore Rural": { lat: 13.2500, lng: 77.5000 },
  "Bangalore Urban": { lat: 12.9716, lng: 77.5946 },
  "Belagavi": { lat: 15.8497, lng: 74.4977 },
  "Ballari": { lat: 15.1394, lng: 76.9214 },
  "Bidar": { lat: 17.9104, lng: 77.5199 },
  "Chamarajanagar": { lat: 11.9261, lng: 76.9402 },
  "Chikkaballapur": { lat: 13.4354, lng: 77.7277 },
  "Chikkamagaluru": { lat: 13.3161, lng: 75.7858 },
  "Chitradurga": { lat: 14.2251, lng: 76.3980 },
  "Dakshina Kannada": { lat: 12.7850, lng: 75.2479 },
  "Davanagere": { lat: 14.4644, lng: 75.9218 },
  "Dharwad": { lat: 15.4589, lng: 75.0078 },
  "Gadag": { lat: 15.4246, lng: 75.6264 },
  "Kalaburagi": { lat: 17.3297, lng: 76.8343 },
  "Hassan": { lat: 13.0072, lng: 76.1026 },
  "Haveri": { lat: 14.7937, lng: 75.4022 },
  "Kodagu": { lat: 12.3375, lng: 75.8069 },
  "Kolar": { lat: 13.1367, lng: 78.1292 },
  "Koppal": { lat: 15.3467, lng: 76.1553 },
  "Mandya": { lat: 12.5218, lng: 76.8973 },
  "Mysuru": { lat: 12.2958, lng: 76.6394 },
  "Raichur": { lat: 16.2120, lng: 77.3556 },
  "Ramanagara": { lat: 12.7150, lng: 77.2813 },
  "Shivamogga": { lat: 13.9299, lng: 75.5681 },
  "Tumakuru": { lat: 13.3392, lng: 77.1140 },
  "Udupi": { lat: 13.3409, lng: 74.7421 },
  "Uttara Kannada": { lat: 14.6196, lng: 74.8354 },
  "Vijayanagara": { lat: 15.2680, lng: 76.3909 },
  "Yadgir": { lat: 16.7645, lng: 77.1309 }
};

// Helper to clamp real-world metrics to ML model input validation boundaries
const clampValue = (name, value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return "";
  const rule = constraints[name];
  if (!rule) return String(value);
  const clamped = Math.min(rule.max, Math.max(rule.min, num));
  return String(clamped);
};

export function useDistrictAutofill(formData, setFormData, setErrors) {
  const [soilLoading, setSoilLoading] = useState(false);
  const [soilStatus, setSoilStatus] = useState(null);
  const [fetchedSoilGrids, setFetchedSoilGrids] = useState(null);
  const [autofillNotification, setAutofillNotification] = useState("");

  const handleDistrictChange = async (e) => {
    const dist = e.target.value;
    setFetchedSoilGrids(null);
    setSoilStatus(null);
    
    if (!dist) {
      setFormData((prev) => ({
        ...prev,
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
      return;
    }

    if (districtSoilDefaults[dist]) {
      const defaults = districtSoilDefaults[dist];
      setFormData((prev) => ({
        ...prev,
        selectedDistrict: dist,
        SOC: clampValue("SOC", defaults.SOC),
        N_Content: clampValue("N_Content", defaults.N_Content),
        P_Content: clampValue("P_Content", defaults.P_Content),
        K_Content: clampValue("K_Content", defaults.K_Content),
        pH: clampValue("pH", defaults.pH),
      }));

      setAutofillNotification(`Soil values populated using ${dist} averages.`);
      setTimeout(() => {
        setAutofillNotification("");
      }, 4000);
    }

    setErrors((prev) => ({
      ...prev,
      SOC: "",
      N_Content: "",
      P_Content: "",
      K_Content: "",
      pH: "",
      Temperature: "",
      Rainfall: "",
      Humidity: "",
    }));

    // Automatically fetch weather climatology for the district using static mapping coordinates
    setSoilLoading(true);
    try {
      const coords = districtCoordinates[dist];
      if (coords) {
        const weatherData = await getWeather(coords.lat, coords.lng);
        setFormData((prev) => ({
          ...prev,
          Latitude: coords.lat,
          Longitude: coords.lng,
          ReadableAddress: `${dist}, Karnataka, India`,
          Temperature: weatherData.temperature !== null ? String(Math.min(38, Math.max(10, Math.round(weatherData.temperature)))) : prev.Temperature,
          Humidity: weatherData.humidity !== null ? String(Math.min(90, Math.max(30, Math.round(weatherData.humidity)))) : prev.Humidity,
          Rainfall: weatherData.rainfall !== null ? String(Math.min(2000, Math.max(200, Math.round(weatherData.rainfall)))) : prev.Rainfall
        }));
      }
    } catch (err) {
      console.error("Failed to fetch weather for selected district:", err);
    } finally {
      setSoilLoading(false);
    }
  };

  const handleLocationSoilFetch = async (lat, lng, districtName) => {
    setSoilStatus(null);

    // Step 1: Check district coverage
    let matchedDistrict = "";
    if (districtName) {
      const cleanDist = districtName.replace(/\s*district\s*/i, "").trim();
      const keys = Object.keys(districtSoilDefaults);
      const match = keys.find((k) => k.toLowerCase() === cleanDist.toLowerCase());
      if (match) {
        matchedDistrict = match;
      }
    }

    if (matchedDistrict) {
      console.log(`[HybridSoil] District match found: ${matchedDistrict}. Using local averages.`);
      const defaults = districtSoilDefaults[matchedDistrict];
      setFetchedSoilGrids(null);
      setFormData((prev) => ({
        ...prev,
        selectedDistrict: matchedDistrict,
        SOC: clampValue("SOC", defaults.SOC),
        N_Content: clampValue("N_Content", defaults.N_Content),
        P_Content: clampValue("P_Content", defaults.P_Content),
        K_Content: clampValue("K_Content", defaults.K_Content),
        pH: clampValue("pH", defaults.pH),
      }));
      setErrors((prev) => ({
        ...prev,
        SOC: "",
        N_Content: "",
        P_Content: "",
        K_Content: "",
        pH: "",
      }));

      setAutofillNotification(`Soil values populated using ${matchedDistrict} averages.`);
      setTimeout(() => {
        setAutofillNotification("");
      }, 4000);
      return;
    }

    // Step 2: Query SoilGrids API
    setSoilLoading(true);
    try {
      const soilData = await fetchSoilData(lat, lng);
      setFetchedSoilGrids(soilData);

      setFormData((prev) => ({
        ...prev,
        selectedDistrict: "",
        SOC: clampValue("SOC", soilData.SOC),
        N_Content: clampValue("N_Content", soilData.N_Content),
        P_Content: clampValue("P_Content", soilData.P_Content),
        K_Content: clampValue("K_Content", soilData.K_Content),
        pH: clampValue("pH", soilData.pH),
      }));

      setErrors((prev) => ({
        ...prev,
        SOC: "",
        N_Content: "",
        P_Content: "",
        K_Content: "",
        pH: "",
      }));

      setSoilStatus({
        type: "success",
        message: "Soil values populated using ISRIC SoilGrids global data.",
      });
      setTimeout(() => setSoilStatus(null), 4000);
    } catch (err) {
      setSoilStatus({
        type: "error",
        message: "Soil data unavailable. Please enter values manually.",
      });
    } finally {
      setSoilLoading(false);
    }
  };

  return {
    soilLoading,
    soilStatus,
    setSoilStatus,
    fetchedSoilGrids,
    setFetchedSoilGrids,
    autofillNotification,
    setAutofillNotification,
    handleDistrictChange,
    handleLocationSoilFetch,
  };
}
