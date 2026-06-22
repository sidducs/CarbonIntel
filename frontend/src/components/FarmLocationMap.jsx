import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getCurrentLocation } from "../services/geocodingService";

// Fix Leaflet marker icon issues in React/Vite environments using a custom SVG marker
const markerSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="color: #059669; width: 32px; height: 32px;">
    <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.702 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
  </svg>
`;

const markerIcon = new L.DivIcon({
  html: markerSvg,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  className: "custom-leaflet-marker"
});

// Component to handle map actions (clicking, dragging, centering)
function MapEvents({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

// Component to handle programatic re-centering
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function FarmLocationMap({ lat, lng, readableAddress, onChangeLocation, onFetchWeather, weatherLoading, onResetLocation }) {
  // Default center is Bengaluru: [12.9716, 77.5946]
  const defaultCenter = [12.9716, 77.5946];
  const [zoom, setZoom] = useState(11);
  const [locStatus, setLocStatus] = useState(null); // { type: "loading" | "success" | "error", message: string }

  const currentCenter = useMemo(() => {
    if (lat && lng) return [lat, lng];
    return defaultCenter;
  }, [lat, lng]);

  const handleLocationSelect = (newLat, newLng) => {
    onChangeLocation(Number(newLat.toFixed(6)), Number(newLng.toFixed(6)));
  };

  const handleResetView = () => {
    if (onResetLocation) {
      onResetLocation();
    } else {
      handleLocationSelect(defaultCenter[0], defaultCenter[1]);
    }
    setZoom(11);
  };

  const handleUseMyLocation = async () => {
    setLocStatus({ type: "loading", message: "Detecting Location..." });
    try {
      const coords = await getCurrentLocation();
      handleLocationSelect(coords.latitude, coords.longitude);
      setLocStatus({ type: "success", message: "Location Found" });
      setTimeout(() => setLocStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setLocStatus({ type: "error", message: "Unable to detect location" });
      setTimeout(() => setLocStatus(null), 4000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Selected Farm Location</span>
            {locStatus && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase ${
                locStatus.type === "loading"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 animate-pulse"
                  : locStatus.type === "success"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400"
              }`}>
                {locStatus.message}
              </span>
            )}
          </div>
          <span className="text-sm font-black text-slate-900 dark:text-white block mt-0.5">
            📍 {readableAddress || "Bengaluru, Karnataka, India"}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-505 mt-0.5 block">
            Coordinates: {lat.toFixed(5)}° N, {lng.toFixed(5)}° E
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={locStatus?.type === "loading"}
            className="px-3 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-800 dark:text-slate-100 rounded-lg text-xs font-bold transition cursor-pointer focus:outline-none flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Use My Location
          </button>

          {lat && lng && onFetchWeather && (
            <button
              type="button"
              onClick={onFetchWeather}
              disabled={weatherLoading}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 dark:disabled:text-slate-600 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer focus:outline-none flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              {weatherLoading ? "Fetching Weather..." : "Fetch Weather"}
            </button>
          )}

          <button
            type="button"
            onClick={handleResetView}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 rounded-lg text-xs font-bold transition cursor-pointer focus:outline-none"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner z-10 relative">
        <MapContainer
          center={currentCenter}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ChangeView center={currentCenter} zoom={zoom} />
          
          <MapEvents onLocationSelect={handleLocationSelect} />

          <Marker
            position={currentCenter}
            icon={markerIcon}
            draggable={true}
            eventHandlers={{
              dragend(e) {
                const marker = e.target;
                const position = marker.getLatLng();
                handleLocationSelect(position.lat, position.lng);
              }
            }}
          />
        </MapContainer>
      </div>

      {/* Future-Ready Architecture slots */}
      <div className="text-[10px] text-slate-400 dark:text-slate-500 italic flex items-center justify-between">
        <span>Map layer support: OpenStreetMap Standard</span>
        <span>Future modules: Soil APIs • Satellite Indexes • Farm Boundaries</span>
      </div>
    </div>
  );
}

export default FarmLocationMap;
