import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useTheme } from "../context/ThemeContext";

// Reusable Optimization Logic for Multi-Farm or AI modules
function generateOptimizedScenarios(formData, carbonFootprint, sustainability) {
  if (!formData || carbonFootprint === null || carbonFootprint === undefined) {
    return [];
  }

  const currentCF = parseFloat(carbonFootprint);

  // Helper to calculate credits
  const calculateCredits = (cfVal) => {
    if (cfVal < 800) {
      return parseFloat(((800 - cfVal) / 1000).toFixed(2));
    }
    return 0.0;
  };

  // 1. Conservative Improvement (-10% Fertilizer)
  const cfCons = Math.max(50, Math.round(currentCF * 0.9));
  const pctCons = Math.round(((currentCF - cfCons) / (currentCF || 1)) * 100);
  let susCons = sustainability;
  if (sustainability === "Low" && pctCons > 5) susCons = "Medium";

  // 2. Balanced Sustainability (-20% Fertilizer, +1% SOC)
  // Each 1% SOC sequester equivalent to ~150 kg CO2e/ha
  const cfBal = Math.max(50, Math.round(currentCF * 0.8 - 150));
  const pctBal = Math.round(((currentCF - cfBal) / (currentCF || 1)) * 100);
  let susBal = "Medium";
  if (sustainability === "High" || pctBal > 25) susBal = "High";

  // 3. Maximum Sustainability (-30% Fertilizer, +2% SOC, Balanced pH)
  const cfMax = Math.max(25, Math.round(currentCF * 0.7 - 300));
  const pctMax = Math.round(((currentCF - cfMax) / (currentCF || 1)) * 100);
  const susMax = "High";

  return [
    {
      id: "current",
      name: "Current State",
      carbonFootprint: Math.round(currentCF),
      reductionPct: 0,
      sustainability: sustainability,
      carbonCredits: calculateCredits(currentCF),
      changes: ["Baseline parameters"],
      isRecommended: false
    },
    {
      id: "conservative",
      name: "Conservative Improvement",
      carbonFootprint: cfCons,
      reductionPct: pctCons,
      sustainability: susCons,
      carbonCredits: calculateCredits(cfCons),
      changes: ["Fertilizer -10%"],
      isRecommended: false
    },
    {
      id: "balanced",
      name: "Balanced Sustainability",
      carbonFootprint: cfBal,
      reductionPct: pctBal,
      sustainability: susBal,
      carbonCredits: calculateCredits(cfBal),
      changes: ["Fertilizer -20%", "SOC +1%"],
      isRecommended: true
    },
    {
      id: "maximum",
      name: "Maximum Sustainability",
      carbonFootprint: cfMax,
      reductionPct: pctMax,
      sustainability: susMax,
      carbonCredits: calculateCredits(cfMax),
      changes: ["Fertilizer -30%", "SOC +2%", "pH Balanced"],
      isRecommended: false
    }
  ];
}

function OptimizationEngine({ formData, carbonFootprint, sustainability }) {
  const { theme } = useTheme();
  const hasValue = carbonFootprint !== null && carbonFootprint !== undefined && formData !== null && formData !== undefined;

  // Empty state: Only show after prediction exists
  if (!hasValue) {
    return null;
  }

  const scenarios = generateOptimizedScenarios(formData, carbonFootprint, sustainability);
  if (scenarios.length === 0) return null;

  // Recommended scenario logic (Balanced is selected as it represents realistic operational gains)
  const recommendedScenario = scenarios.find((s) => s.isRecommended);

  // Prepare Recharts bar data
  const chartData = scenarios.map((s) => ({
    name: s.name === "Current State" ? "Current" : s.name.split(" ")[0],
    footprint: s.carbonFootprint,
    fullName: s.name
  }));

  const getSusBadge = (sus) => {
    if (sus === "High") return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-150 dark:border-emerald-900/30";
    if (sus === "Medium") return "bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900/30";
    return "bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-455 border-rose-200 dark:border-rose-900/30";
  };

  const tickColor = theme === "dark" ? "#64748b" : "#94a3b8";
  const baselineBarColor = theme === "dark" ? "#475569" : "#64748b";
  const othersBarColor = theme === "dark" ? "#334155" : "#94a3b8";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-6 hover:shadow-lg transition-all duration-300 hover:border-emerald-100 dark:hover:border-emerald-900/40">
      {/* Header Block */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700/80 pb-4">
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-455 border border-emerald-100/50 dark:border-emerald-900/30">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-slate-800 dark:text-white font-extrabold text-sm tracking-tight">Optimization Scenarios</h3>
          <p className="text-slate-450 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Footprint mitigation alternatives</p>
        </div>
      </div>

      {/* Main split grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Scenario cards list (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {scenarios.map((s) => (
            <div
              key={s.id}
              className={`p-4 rounded-xl border transition-all duration-200 text-xs relative ${
                s.isRecommended
                  ? "border-emerald-500 bg-emerald-50/10 dark:bg-emerald-955/10 shadow-xs"
                  : s.id === "current"
                  ? "border-slate-150 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/20"
                  : "border-slate-100 dark:border-slate-750 bg-white dark:bg-slate-800/40 hover:border-slate-250 dark:hover:border-slate-600"
              }`}
            >
              {s.isRecommended && (
                <span className="absolute right-3 top-3 px-2 py-0.5 rounded bg-emerald-500 text-white font-black text-[9px] uppercase tracking-wider">
                  Recommended Scenario
                </span>
              )}

              <div className="space-y-2.5">
                <div>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-[12px]">{s.name}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {s.changes.map((c, i) => (
                      <span key={i} className="inline-block px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold text-[9px]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 border-t border-dashed border-slate-100 dark:border-slate-700/60">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Footprint</span>
                    <span className="font-extrabold text-slate-700 dark:text-slate-200">{s.carbonFootprint.toLocaleString()} kg/ha</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Reduction</span>
                    <span className={`font-black ${s.reductionPct > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"}`}>
                      {s.reductionPct > 0 ? `-${s.reductionPct}%` : "0%"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Sustainability</span>
                    <span className={`inline-block px-1.5 py-0.2 rounded border text-[9px] font-bold ${getSusBadge(s.sustainability)}`}>
                      {s.sustainability}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Credits</span>
                    <span className="font-extrabold text-slate-700 dark:text-slate-200">{s.carbonCredits} Credits</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Recharts Bar Chart (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-4 p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-750 rounded-xl">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider block">Carbon footprint comparisons</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-normal">
              {recommendedScenario.name} provides the optimal balance of carbon reduction (-{recommendedScenario.reductionPct}%) with practical input revisions.
            </p>
          </div>

          <div className="w-full h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} barSize={24}>
                <XAxis dataKey="name" tickStyle={{ fontSize: 9, fontWeight: "bold", fill: tickColor }} axisLine={false} tickLine={false} />
                <YAxis tickStyle={{ fontSize: 8, fontWeight: "bold", fill: tickColor }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="footprint" radius={[4, 4, 0, 0]}>
                  {scenarios.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.isRecommended
                          ? "#10b981" // Emerald for Recommended
                          : entry.id === "current"
                          ? baselineBarColor
                          : othersBarColor
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg shadow-md text-white text-[10px] font-bold">
        <p className="text-slate-350">{item.fullName}</p>
        <p className="text-emerald-400 mt-0.5">{item.footprint.toLocaleString()} kg CO₂e/ha</p>
      </div>
    );
  }
  return null;
};

export default OptimizationEngine;
