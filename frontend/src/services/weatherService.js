/**
 * Weather Integration Service
 * Utilizes NASA POWER Climatology API as primary provider and Open-Meteo Forecast as secondary fallback.
 */

import { fetchWithRetry } from "./fetchHelper";

const weatherCache = new Map();

/**
 * Convert location name to latitude/longitude coordinates
 * @param {string} location Name of the city/region (e.g. "Bengaluru")
 * @returns {Promise<{latitude: number, longitude: number, name: string}>}
 */
export async function getCoordinates(location) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
  
  try {
    const res = await fetchWithRetry(url);
    if (!res.ok) {
      throw new Error("Geocoding service returned an invalid response.");
    }
    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      throw new Error("Location not found. Please try a different city name.");
    }
    
    return {
      latitude: data.results[0].latitude,
      longitude: data.results[0].longitude,
      name: data.results[0].name
    };
  } catch (err) {
    console.error("Geocoding error:", err);
    throw err;
  }
}

/**
 * Fetch weather climatology parameters for given coordinates.
 * Queries NASA POWER Climatology API and falls back to Open-Meteo if needed.
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<{temperature: number, humidity: number, rainfall: number, source: string}>}
 */
export async function getWeather(latitude, longitude) {
  // Use 3 decimal places for coordinate cache key (approx. 110m precision)
  const cacheKey = `${Number(latitude).toFixed(3)},${Number(longitude).toFixed(3)}`;
  if (weatherCache.has(cacheKey)) {
    console.log("[WeatherService] Returning cached climatology/weather data.");
    return weatherCache.get(cacheKey);
  }

  // Primary: NASA POWER Climatology
  const nasaUrl = `https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M,RH2M,PRECTOTCORR&community=AG&longitude=${longitude}&latitude=${latitude}&format=JSON`;
  
  try {
    console.log(`[WeatherService] Fetching NASA POWER climatology: ${nasaUrl}`);
    const res = await fetchWithRetry(nasaUrl, { timeout: 8000 });
    if (!res.ok) {
      throw new Error(`NASA POWER service returned status ${res.status}`);
    }
    const data = await res.json();
    const params = data?.properties?.parameter;
    
    if (params?.T2M?.ANN !== undefined && params?.RH2M?.ANN !== undefined && params?.PRECTOTCORR?.ANN !== undefined) {
      const temp = params.T2M.ANN;
      const hum = params.RH2M.ANN;
      const rainDaily = params.PRECTOTCORR.ANN;
      const annualRain = rainDaily * 365; // Convert daily precipitation rate to annual cumulative rainfall
      
      const clampedTemp = Math.min(38, Math.max(10, Math.round(temp * 10) / 10));
      const clampedHum = Math.min(90, Math.max(30, Math.round(hum)));
      const clampedRain = Math.min(2000, Math.max(200, Math.round(annualRain)));
      
      const result = {
        temperature: clampedTemp,
        humidity: clampedHum,
        rainfall: clampedRain,
        source: "NASA POWER Climatology"
      };
      
      weatherCache.set(cacheKey, result);
      return result;
    } else {
      throw new Error("Invalid parameters structure in NASA POWER response");
    }
  } catch (err) {
    console.warn("[WeatherService] NASA POWER failed, falling back to Open-Meteo forecast:", err);
    
    // Secondary Fallback: Open-Meteo Forecast
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,rain&daily=precipitation_sum&timezone=auto`;
    
    try {
      const res = await fetchWithRetry(openMeteoUrl, { timeout: 8000 });
      if (!res.ok) {
        throw new Error("Open-Meteo forecast service returned an invalid response.");
      }
      const data = await res.json();
      
      const temp = data.current?.temperature_2m;
      const hum = data.current?.relative_humidity_2m;
      const currentRain = data.current?.rain; // hourly rain
      const dailySumRain = data.daily?.precipitation_sum?.[0] || 0;
      
      // Heuristic fallback for annual cumulative rainfall based on latitude zone
      const absLat = Math.abs(latitude);
      let estimatedAnnualRainfall = 800; // Temperate baseline
      
      if (absLat < 10) {
        estimatedAnnualRainfall = 1600; // Tropical wet
      } else if (absLat >= 10 && absLat < 23.5) {
        estimatedAnnualRainfall = 1100; // Tropical wet-dry
      } else if (absLat >= 23.5 && absLat < 35) {
        estimatedAnnualRainfall = 450;  // Arid / Subtropical dry
      } else if (absLat >= 35 && absLat < 50) {
        estimatedAnnualRainfall = 850;  // Temperate wet
      } else {
        estimatedAnnualRainfall = 550;  // Subpolar
      }
      
      // Modulate based on daily/hourly precipitation modifiers
      if (dailySumRain > 0) {
        estimatedAnnualRainfall = Math.min(2000, Math.max(200, estimatedAnnualRainfall + (dailySumRain * 12)));
      } else if (currentRain > 0) {
        estimatedAnnualRainfall = Math.min(2000, Math.max(200, estimatedAnnualRainfall + (currentRain * 24)));
      }
      
      const clampedTemp = temp !== undefined ? Math.min(38, Math.max(10, Math.round(temp * 10) / 10)) : null;
      const clampedHum = hum !== undefined ? Math.min(90, Math.max(30, Math.round(hum))) : null;
      const clampedRain = Math.round(estimatedAnnualRainfall);
      
      const result = {
        temperature: clampedTemp,
        humidity: clampedHum,
        rainfall: clampedRain,
        source: "Open-Meteo Forecast (Estimated Climatology)"
      };
      
      weatherCache.set(cacheKey, result);
      return result;
    } catch (fallbackErr) {
      console.error("[WeatherService] Both weather service providers failed:", fallbackErr);
      throw new Error("Unable to fetch weather data from any source.");
    }
  }
}
