import React from "react";

export default function SoilSection({
  formData,
  errors,
  touched,
  handleChange,
  handleBlur,
  getInputClass,
  getSoilFieldBadge,
}) {
  return (
    <>
      <div className="flex flex-col relative">
        <label htmlFor="SOC" className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 flex items-center justify-between">
          <span>Soil Organic Carbon (SOC %)</span>
          {getSoilFieldBadge("SOC")}
        </label>
        <input
          id="SOC"
          type="number"
          step="0.01"
          name="SOC"
          value={formData.SOC}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="0.5 - 5.0"
          aria-invalid={touched.SOC && !!errors.SOC}
          aria-describedby={errors.SOC ? "error-SOC" : undefined}
          className={getInputClass("SOC")}
        />
        {touched.SOC && errors.SOC && (
          <span id="error-SOC" className="text-[10px] text-rose-600 dark:text-rose-450 font-bold mt-1">
            {errors.SOC}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="pH" className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 flex items-center justify-between">
          <span>pH Level</span>
          {getSoilFieldBadge("pH")}
        </label>
        <input
          id="pH"
          type="number"
          step="0.1"
          name="pH"
          value={formData.pH}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="4.5 - 8.5"
          aria-invalid={touched.pH && !!errors.pH}
          aria-describedby={errors.pH ? "error-pH" : undefined}
          className={getInputClass("pH")}
        />
        {touched.pH && errors.pH && (
          <span id="error-pH" className="text-[10px] text-rose-600 dark:text-rose-450 font-bold mt-1">
            {errors.pH}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="N_Content" className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 flex items-center justify-between">
          <span>N Content (kg/ha)</span>
          {getSoilFieldBadge("N_Content")}
        </label>
        <input
          id="N_Content"
          type="number"
          step="0.1"
          name="N_Content"
          value={formData.N_Content}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="10 - 200"
          aria-invalid={touched.N_Content && !!errors.N_Content}
          aria-describedby={errors.N_Content ? "error-N_Content" : undefined}
          className={getInputClass("N_Content")}
        />
        {touched.N_Content && errors.N_Content && (
          <span id="error-N_Content" className="text-[10px] text-rose-600 dark:text-rose-450 font-bold mt-1">
            {errors.N_Content}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="P_Content" className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 flex items-center justify-between">
          <span>P Content (kg/ha)</span>
          {getSoilFieldBadge("P_Content")}
        </label>
        <input
          id="P_Content"
          type="number"
          step="0.1"
          name="P_Content"
          value={formData.P_Content}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="5 - 100"
          aria-invalid={touched.P_Content && !!errors.P_Content}
          aria-describedby={errors.P_Content ? "error-P_Content" : undefined}
          className={getInputClass("P_Content")}
        />
        {touched.P_Content && errors.P_Content && (
          <span id="error-P_Content" className="text-[10px] text-rose-600 dark:text-rose-450 font-bold mt-1">
            {errors.P_Content}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="K_Content" className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 flex items-center justify-between">
          <span>K Content (kg/ha)</span>
          {getSoilFieldBadge("K_Content")}
        </label>
        <input
          id="K_Content"
          type="number"
          step="0.1"
          name="K_Content"
          value={formData.K_Content}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="10 - 150"
          aria-invalid={touched.K_Content && !!errors.K_Content}
          aria-describedby={errors.K_Content ? "error-K_Content" : undefined}
          className={getInputClass("K_Content")}
        />
        {touched.K_Content && errors.K_Content && (
          <span id="error-K_Content" className="text-[10px] text-rose-600 dark:text-rose-400 font-bold mt-1">
            {errors.K_Content}
          </span>
        )}
      </div>
    </>
  );
}
