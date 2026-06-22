import PageLayout from "../components/PageLayout";

function About() {
  return (
    <PageLayout
      title="Framework & Methodology"
      subtitle="This project uses empirical greenhouse gas (GHG) emission models aligned with IPCC guidelines. The target values are calculated using agricultural emission factors, and predictions are generated using an optimized XGBoost ML pipeline."
      breadcrumbs={[
        { label: "Dashboard", path: "/dashboard" },
        { label: "About" },
        { label: "Methodology" }
      ]}
    >
      <div className="space-y-12">
        {/* Master Formula Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 dark:bg-emerald-950/40 rounded-lg text-emerald-700 dark:text-emerald-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </span>
            Net Carbon Footprint Equation
          </h2>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800 overflow-x-auto text-slate-850 dark:text-slate-200 font-mono text-xs sm:text-sm md:text-base whitespace-nowrap leading-relaxed">
            Carbon_Footprint = E_crop_baseline + E_fertilizer + E_weather + E_soil - Carbon_Sink + Noise
          </div>
          <p className="mt-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Net emissions represent the summation of crop biological activities, inputs manufacturing/nitrous-oxide volatilization, local climatic stress, and soil biochemical components, offset by the carbon sequestration capacity of the soil.
          </p>
        </div>

        {/* Breakdown Subsections Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1: Crop Baseline */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              1. Crop Baseline Emissions (E_crop_baseline)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Varies by crop type to account for physiological characteristics (e.g., anaerobic methane production in flooded rice paddies):
            </p>
            <ul className="text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
              <li>Rice : 800.0 kg CO₂e/ha</li>
              <li>Corn : 350.0 kg CO₂e/ha</li>
              <li>Vegetables : 300.0 kg CO₂e/ha</li>
              <li>Wheat : 250.0 kg CO₂e/ha</li>
              <li>Soybeans : 100.0 kg CO₂e/ha</li>
            </ul>
          </div>

          {/* Card 2: Fertilizer Application */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              2. Fertilizer Emissions (E_fertilizer)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Measures synthetic & organic fertilizer manufacturing footprint and subsequent soil N₂O volatilization emissions:
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              E_fertilizer = Fertilizer_Amount * Factor
            </div>
            <ul className="text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-350 space-y-1 pl-2">
              <li>• Ammonium Nitrate: 2.9</li>
              <li>• Urea: 2.3</li>
              <li>• NPK 15-15-15: 1.5</li>
              <li>• Organic: 0.4</li>
              <li>• None: 0.0</li>
            </ul>
          </div>

          {/* Card 3: Weather Profile */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              3. Climatic Weather Impacts (E_weather)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Factors in direct temperature-driven carbon respiration, humidity effects, and rain-induced leaching / runoff:
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              E_weather = (Temp * 6.0) + (Rainfall / 100 * 8.0) + (Humidity * 2.5)
            </div>
          </div>

          {/* Card 4: Soil Emissions */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              4. Soil Nitrogen & pH Volatility (E_soil)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Accounts for N₂O soil gas emissions from native nitrogen reservoirs, phosphorus/potassium mobilization, and pH deviations:
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              E_soil = (N_Content * 0.45) + (P_Content * 0.15) + (K_Content * 0.10) + ((pH - 6.5)² * 12.0)
            </div>
          </div>

          {/* Card 5: Sequestration Offset */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4 md:col-span-2">
            <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-450 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              5. Soil Organic Carbon Sequestration (Carbon_Sink)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Highlights carbon captured in soil organic matter. Higher Soil Organic Carbon (SOC) levels actively sequester carbon, acting as a net deduction from total emissions:
            </p>
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/40 font-mono text-xs sm:text-sm text-emerald-800 dark:text-emerald-300">
              Carbon_Sink = SOC * 150.0 (kg CO₂e/ha offset)
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 italic">
              *Note: A farm with low synthetic fertilizer inputs and high SOC levels can register a negative net footprint, representing a carbon sink field.*
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default About;