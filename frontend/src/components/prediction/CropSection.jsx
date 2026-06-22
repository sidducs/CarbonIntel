import React from "react";

export default function CropSection({ value, onChange }) {
  return (
    <div className="flex flex-col">
      <label htmlFor="Crop_Type" className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
        Crop Type
      </label>
      <select
        id="Crop_Type"
        name="Crop_Type"
        value={value}
        onChange={onChange}
        className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <option value="Rice" className="dark:bg-slate-900">Rice</option>
        <option value="Corn" className="dark:bg-slate-900">Corn</option>
        <option value="Wheat" className="dark:bg-slate-900">Wheat</option>
        <option value="Soybeans" className="dark:bg-slate-900">Soybeans</option>
        <option value="Vegetables" className="dark:bg-slate-900">Vegetables</option>
      </select>
    </div>
  );
}
