import labs from "./soilLabs.json";

// Haversine formula to compute great-circle distance between two points in km
function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find the nearest official soil testing laboratory based on user coordinates.
 * @param {number} lat Latitude of the farm
 * @param {number} lng Longitude of the farm
 * @returns {Object|null} Nearest lab metadata with distance in kilometers
 */
export function findNearestLab(lat, lng) {
  if (!lat || !lng) return null;
  
  let nearestLab = null;
  let minDistance = Infinity;

  for (const lab of labs) {
    const dist = getHaversineDistance(lat, lng, lab.latitude, lab.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      nearestLab = { ...lab, distance: dist };
    }
  }

  return nearestLab;
}
