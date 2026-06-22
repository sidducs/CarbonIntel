import React from "react";
import { districtSoilDefaults } from "../../services/districtSoilDefaults";

export default function DistrictSelector({ selectedDistrict, onChange }) {
  return (
    <div className="flex flex-col">
      <label htmlFor="selectedDistrict" className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
        District (Soil Autofill)
      </label>
      <select
        id="selectedDistrict"
        name="selectedDistrict"
        value={selectedDistrict || ""}
        onChange={onChange}
        className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <option value="">-- Select District (Manual Input) --</option>
        {Object.keys(districtSoilDefaults).map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </div>
  );
}
