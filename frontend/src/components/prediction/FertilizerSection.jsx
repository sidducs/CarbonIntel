import React from "react";

export default function FertilizerSection({
  formData,
  errors,
  touched,
  handleChange,
  handleBlur,
  getInputClass,
}) {
  return (
    <>
      <div className="flex flex-col">
        <label htmlFor="Fertilizer_Type" className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
          Fertilizer Type
        </label>
        <select
          id="Fertilizer_Type"
          name="Fertilizer_Type"
          value={formData.Fertilizer_Type}
          onChange={handleChange}
          className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="Urea" className="dark:bg-slate-900">Urea</option>
          <option value="Ammonium Nitrate" className="dark:bg-slate-900">Ammonium Nitrate</option>
          <option value="NPK_15-15-15" className="dark:bg-slate-900">NPK 15-15-15</option>
          <option value="Organic" className="dark:bg-slate-900">Organic</option>
          <option value="None" className="dark:bg-slate-900">None</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="Fertilizer_Amount" className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
          Fertilizer Amount (kg/ha)
        </label>
        <input
          id="Fertilizer_Amount"
          type="number"
          step="0.1"
          name="Fertilizer_Amount"
          value={formData.Fertilizer_Amount}
          disabled={formData.Fertilizer_Type === "None"}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="0 - 500"
          aria-invalid={touched.Fertilizer_Amount && !!errors.Fertilizer_Amount}
          aria-describedby={errors.Fertilizer_Amount ? "error-Fertilizer_Amount" : undefined}
          className={getInputClass("Fertilizer_Amount")}
        />
        {touched.Fertilizer_Amount && errors.Fertilizer_Amount && (
          <span id="error-Fertilizer_Amount" className="text-[10px] text-rose-600 dark:text-rose-450 font-bold mt-1">
            {errors.Fertilizer_Amount}
          </span>
        )}
      </div>
    </>
  );
}
