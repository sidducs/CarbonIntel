import { fetchWithRetry } from "./fetchHelper";

/**
 * Get current browser coordinates using the HTML5 Geolocation API
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.error("Browser Geolocation Error:", error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("Location permission denied. Please allow access."));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("Location information is unavailable."));
            break;
          case error.TIMEOUT:
            reject(new Error("Request to get user location timed out."));
            break;
          default:
            reject(new Error("Unable to detect location."));
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  });
}

/**
 * Search locations (forward geocoding / autocomplete suggestions) via Nominatim
 * @param {string} query 
 * @returns {Promise<Array<{latitude: number, longitude: number, village: string, taluk: string, district: string, state: string, country: string, postal_code: string, displayName: string}>>}
 */
export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];

  // Query Nominatim search endpoint with addressdetails=1
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;

  try {
    const res = await fetchWithRetry(url, {
      headers: {
        "Accept-Language": "en",
        "User-Agent": "CarbonIntel-Sustainability-Assessment-App"
      }
    });

    if (!res.ok) {
      throw new Error("Geocoding service returned an invalid response.");
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((item) => {
      const address = item.address || {};
      
      // Parse priority agricultural fields
      const village = address.village || address.suburb || address.town || address.city || address.municipality || "";
      const taluk = address.subdistrict || address.county || "";
      const district = address.district || address.state_district || address.county || "";
      const state = address.state || "";
      const country = address.country || "";
      const postal_code = address.postcode || "";

      // Format display name as: Village, Taluk, District, State, Country
      const parts = [];
      if (village) parts.push(village);
      if (taluk && taluk !== village) parts.push(taluk);
      if (district && district !== taluk && district !== village) parts.push(district);
      if (state) parts.push(state);
      if (country) parts.push(country);

      const displayName = parts.join(", ") || item.display_name || "Unknown Location";

      return {
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        village,
        taluk,
        district,
        state,
        country,
        postal_code,
        displayName
      };
    });
  } catch (err) {
    console.error("Geocoding autocomplete search error:", err);
    return [];
  }
}

/**
 * Convert latitude and longitude into address info via Nominatim (OSM)
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<{latitude: number, longitude: number, village: string, taluk: string, district: string, state: string, country: string, postal_code: string, displayName: string}>}
 */
export async function reverseGeocode(latitude, longitude) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
  
  try {
    const res = await fetchWithRetry(url, {
      headers: {
        "Accept-Language": "en",
        "User-Agent": "CarbonIntel-Sustainability-Assessment-App"
      }
    });
    
    if (!res.ok) {
      throw new Error("Reverse geocoding service returned an invalid response.");
    }
    
    const data = await res.json();
    if (!data.address) {
      throw new Error("Address details could not be found for these coordinates.");
    }
    
    const address = data.address;
    
    // Parse priority agricultural fields
    const village = address.village || address.suburb || address.town || address.city || address.municipality || "";
    const taluk = address.subdistrict || address.county || "";
    const district = address.district || address.state_district || address.county || "";
    const state = address.state || "";
    const country = address.country || "";
    const postal_code = address.postcode || "";
    
    // Format display name as: Village, Taluk, District, State, Country
    const parts = [];
    if (village) parts.push(village);
    if (taluk && taluk !== village) parts.push(taluk);
    if (district && district !== taluk && district !== village) parts.push(district);
    if (state) parts.push(state);
    if (country) parts.push(country);
    
    return {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      village,
      taluk,
      district,
      state,
      country,
      postal_code,
      displayName: parts.join(", ") || data.display_name || "Unknown Location"
    };
  } catch (err) {
    console.error("Reverse geocoding error:", err);
    throw err;
  }
}
