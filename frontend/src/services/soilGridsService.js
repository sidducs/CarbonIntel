/**
 * ISRIC SoilGrids REST API Integration Service
 * Fetches Soil Organic Carbon (SOC), pH, and Nitrogen based on latitude/longitude.
 * Implements client-side memory caching to avoid redundant API requests.
 */

// Memory cache for soil lookups (cache key format: "lat.toFixed(3),lng.toFixed(3)")
const soilCache = new Map();

/**
 * Fetch soil parameters from ISRIC SoilGrids API
 * @param {number} lat Latitude
 * @param {number} lng Longitude
 * @returns {Promise<{SOC: number, pH: number, N_Content: number, P_Content: number, K_Content: number}>}
 */
export async function fetchSoilData(lat, lng) {
  if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) {
    throw new Error("Invalid coordinates provided.");
  }

  // Create a cache key with 3 decimal places (~110m grid resolution)
  const cacheKey = `${Number(lat).toFixed(3)},${Number(lng).toFixed(3)}`;
  if (soilCache.has(cacheKey)) {
    console.log(`[SoilGrids] Cache hit for coordinates: ${cacheKey}`);
    return soilCache.get(cacheKey);
  }

  // Properties to query: soc (Soil Organic Carbon), phh2o (pH), nitrogen (Nitrogen)
  // Depth: 0-5cm (topsoil layer)
  const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lat=${lat}&lon=${lng}&property=soc&property=phh2o&property=nitrogen&depth=0-5cm&value=mean`;

  try {
    console.log(`[SoilGrids] Fetching soil data from API: ${url}`);
    
    // Set a timeout for the API call to ensure responsiveness
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);

    if (!res.ok) {
      throw new Error(`SoilGrids API error: status ${res.status}`);
    }

    const data = await res.json();
    
    // Parse SoilGrids geojson properties layers
    const layers = data?.properties?.layers;
    if (!layers || !Array.isArray(layers) || layers.length === 0) {
      throw new Error("No soil data returned for these coordinates.");
    }

    // Initialize values
    let rawSoc = null;
    let rawPh = null;
    let rawNitrogen = null;

    layers.forEach(layer => {
      const name = layer.name;
      const value = layer.depths?.[0]?.values?.mean;
      
      if (value !== undefined && value !== null) {
        if (name === "soc") {
          rawSoc = value;
        } else if (name === "phh2o") {
          rawPh = value;
        } else if (name === "nitrogen") {
          rawNitrogen = value;
        }
      }
    });

    // Check if we got at least SOC and pH
    if (rawSoc === null || rawPh === null) {
      throw new Error("Essential soil parameters (SOC, pH) missing in API response.");
    }

    // Conversions:
    // 1. soc is in dg/kg. Dividing by 10 gives g/kg. Dividing by 10 again gives % SOC.
    //    Therefore, SOC % = rawSoc / 100
    //    Typical range constraints: 0.5 - 5.0 %
    const SOC = Math.min(5.0, Math.max(0.5, Math.round((rawSoc / 100) * 100) / 100));

    // 2. phh2o is in pH x 10. Dividing by 10 gives conventional pH.
    //    Typical range constraints: 4.5 - 8.5
    const pH = Math.min(8.5, Math.max(4.5, Math.round((rawPh / 10) * 10) / 10));

    // 3. nitrogen is in cg/kg. We map total nitrogen cg/kg to available N Content (kg/ha)
    //    Using a realistic calibration factor (cg/kg * 0.6) and clamping to model range (10 - 200 kg/ha).
    let N_Content = 100.0; // Default fallback
    if (rawNitrogen !== null) {
      N_Content = Math.min(200, Math.max(10, Math.round(rawNitrogen * 0.6)));
    }

    // 4. P_Content and K_Content are not mapped by SoilGrids, use standard regional baselines
    //    P_Content range: 5 - 100, baseline = 20.0
    //    K_Content range: 10 - 150, baseline = 80.0
    const P_Content = 20.0;
    const K_Content = 80.0;

    const result = {
      SOC,
      pH,
      N_Content,
      P_Content,
      K_Content
    };

    // Cache the result
    soilCache.set(cacheKey, result);
    return result;

  } catch (err) {
    console.error(`[SoilGrids] Request failed for (${lat}, ${lng}):`, err);
    throw err;
  }
}
