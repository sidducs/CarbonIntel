import { fetchWithRetry } from "./fetchHelper";

/**
 * Fetch daily historical weather variables from NASA POWER API
 * Parameters:
 * - T2M: Temperature at 2 Meters (°C)
 * - PRECTOTCORR: Precipitation Corrected (mm/day)
 * - RH2M: Relative Humidity at 2 Meters (%)
 * 
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {string} startDate YYYY-MM-DD
 * @param {string} endDate YYYY-MM-DD
 * @returns {Promise<{summary: {avgTemperature: number, avgRainfall: number, avgHumidity: number, totalDays: number}, records: Array<{date: string, temperature: number|null, rainfall: number|null, humidity: number|null}>, latitude: number, longitude: number}>}
 */
export async function getHistoricalWeather(latitude, longitude, startDate, endDate) {
  // Convert startDate and endDate from YYYY-MM-DD to YYYYMMDD
  const start = startDate.replace(/-/g, "");
  const end = endDate.replace(/-/g, "");

  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOTCORR,RH2M&community=AG&longitude=${longitude}&latitude=${latitude}&start=${start}&end=${end}&format=JSON`;

  try {
    const res = await fetchWithRetry(url);
    if (!res.ok) {
      throw new Error(`NASA POWER API returned HTTP status ${res.status}`);
    }

    const data = await res.json();
    const parameters = data.properties?.parameter;
    if (!parameters) {
      throw new Error("No weather parameters found in the NASA POWER response.");
    }

    const tempMap = parameters.T2M || {};
    const rainMap = parameters.PRECTOTCORR || {};
    const humMap = parameters.RH2M || {};

    const dates = Object.keys(tempMap);
    let totalTemp = 0;
    let totalRain = 0;
    let totalHum = 0;
    let validTempCount = 0;
    let validRainCount = 0;
    let validHumCount = 0;

    const dailyRecords = dates.map((dateStr) => {
      // NASA POWER uses -999 or -999.0 to signify missing values
      const tempVal = tempMap[dateStr];
      const rainVal = rainMap[dateStr];
      const humVal = humMap[dateStr];

      const temp = (tempVal !== undefined && tempVal !== -999) ? tempVal : null;
      const rain = (rainVal !== undefined && rainVal !== -999) ? rainVal : null;
      const hum = (humVal !== undefined && humVal !== -999) ? humVal : null;

      if (temp !== null) {
        totalTemp += temp;
        validTempCount++;
      }
      if (rain !== null) {
        totalRain += rain;
        validRainCount++;
      }
      if (hum !== null) {
        totalHum += hum;
        validHumCount++;
      }

      // Format date string from YYYYMMDD to YYYY-MM-DD
      const formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;

      return {
        date: formattedDate,
        temperature: temp,
        rainfall: rain,
        humidity: hum
      };
    });

    // Sort records chronologically
    dailyRecords.sort((a, b) => a.date.localeCompare(b.date));

    return {
      summary: {
        avgTemperature: validTempCount > 0 ? Number((totalTemp / validTempCount).toFixed(2)) : 0,
        avgRainfall: validRainCount > 0 ? Number((totalRain / validRainCount).toFixed(2)) : 0,
        avgHumidity: validHumCount > 0 ? Number((totalHum / validHumCount).toFixed(2)) : 0,
        totalDays: dailyRecords.length
      },
      records: dailyRecords,
      latitude,
      longitude
    };
  } catch (err) {
    console.error("NASA POWER fetch failed:", err);
    throw new Error(err.message || "Unable to retrieve historical weather information.");
  }
}

/**
 * Generate and download historical weather as CSV
 * @param {{records: Array<any>, latitude: number, longitude: number}} historicalData 
 * @param {string} locationName 
 */
export function downloadWeatherCSV(historicalData, locationName = "Farm") {
  if (!historicalData || !historicalData.records || historicalData.records.length === 0) {
    console.error("No historical weather records available to download.");
    return;
  }

  const headers = ["Date", "Latitude", "Longitude", "Temperature_C", "Rainfall_mm", "Humidity_pct"];
  const rows = historicalData.records.map((r) => [
    r.date,
    historicalData.latitude,
    historicalData.longitude,
    r.temperature !== null ? r.temperature : "",
    r.rainfall !== null ? r.rainfall : "",
    r.humidity !== null ? r.humidity : ""
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  // Format location name to be safe for filenames
  const safeName = locationName.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "location";
  link.setAttribute("href", url);
  link.setAttribute("download", `historical_weather_${safeName}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
