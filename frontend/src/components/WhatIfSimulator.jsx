import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useTheme } from "../context/ThemeContext";

function WhatIfSimulator({ formData, carbonFootprint, loading }) {
  const { theme } = useTheme();
  const hasValue = carbonFootprint !== null && carbonFootprint !== undefined && formData !== null && formData !== undefined;

  // 1. Loading State (Skeleton Loader)
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between min-h-[350px] animate-pulse">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-2 w-16 bg-slate-150 dark:bg-slate-700/80 rounded" />
            </div>
          </div>
          <div className="h-44 bg-slate-150 dark:bg-slate-700/50 rounded-xl" />
        </div>
      </div>
    );
  }

  // 2. Empty State (Before Prediction)
  if (!hasValue) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed shadow-sm p-6 flex flex-col justify-between min-h-[350px] transition-all duration-300 hover:border-slate-350 dark:hover:border-slate-700">
        <div>
          {/* Header Block */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-slate-550 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">What-If Sustainability Simulator</h3>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-medium uppercase tracking-wider">Farm Scenario Optimizer</p>
            </div>
          </div>

          {/* Empty State Message */}
          <p className="text-slate-500 dark:text-slate-450 text-sm leading-relaxed font-medium mt-2">
            Run an assessment to explore sustainability scenarios.
          </p>
        </div>

        {/* Footer Area for layout alignment */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          <span>Awaiting evaluation</span>
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-650 animate-ping" />
        </div>
      </div>
    );
  }

  // 3. Results State (After Prediction)
  const currentCF = parseFloat(carbonFootprint);
  const fertVal = parseFloat(formData.Fertilizer_Amount || 0);

  // Estimation scenario formulas
  const calculateScenarios = () => {
    // Scenario 1: Fertilizer Reduction -20%
    const fertRed20 = currentCF - (fertVal * 0.20 * 2.2);
    // Scenario 2: Fertilizer Reduction -40%
    const fertRed40 = currentCF - (fertVal * 0.40 * 2.2);
    // Scenario 3: SOC Increase +1%
    const socInc1 = currentCF - 150;
    // Scenario 4: SOC Increase +2%
    const socInc2 = currentCF - 300;
    // Scenario 5: Combined (Fertilizer -20%, SOC +1%)
    const combined = currentCF - (fertVal * 0.20 * 2.2) - 150;

    return [
      { id: "current", name: "Current State", value: Math.round(currentCF), improvement: 0, status: "Current", badge: "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800" },
      { id: "fert20", name: "Fertilizer -20%", value: Math.round(fertRed20), improvement: calculatePct(fertRed20), status: getStatus(calculatePct(fertRed20)), badge: getBadge(calculatePct(fertRed20)) },
      { id: "fert40", name: "Fertilizer -40%", value: Math.round(fertRed40), improvement: calculatePct(fertRed40), status: getStatus(calculatePct(fertRed40)), badge: getBadge(calculatePct(fertRed40)) },
      { id: "soc1", name: "SOC +1%", value: Math.round(socInc1), improvement: calculatePct(socInc1), status: getStatus(calculatePct(socInc1)), badge: getBadge(calculatePct(socInc1)) },
      { id: "soc2", name: "SOC +2%", value: Math.round(socInc2), improvement: calculatePct(socInc2), status: getStatus(calculatePct(socInc2)), badge: getBadge(calculatePct(socInc2)) },
      { id: "combined", name: "Combined Plan", value: Math.round(combined), improvement: calculatePct(combined), status: getStatus(calculatePct(combined)), badge: getBadge(calculatePct(combined)) }
    ];
  };

  const calculatePct = (newVal) => {
    if (currentCF === 0) return 0;
    const diff = currentCF - newVal;
    return parseFloat(((diff / Math.abs(currentCF)) * 100).toFixed(1));
  };

  const getStatus = (pct) => {
    if (pct >= 15) return "Excellent";
    if (pct >= 5) return "Moderate";
    return "Low Impact";
  };

  const getBadge = (pct) => {
    if (pct >= 15) return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30";
    if (pct >= 5) return "bg-amber-50 dark:bg-amber-950/20 text-amber-850 dark:text-amber-400 border-amber-200 dark:border-amber-900/30";
    return "bg-slate-50 dark:bg-slate-900 text-slate-655 dark:text-slate-400 border-slate-250 dark:border-slate-800";
  };

  const scenarios = calculateScenarios();
  const tickColor = theme === "dark" ? "#64748b" : "#94a3b8";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-6 hover:shadow-lg transition-all duration-300 hover:border-emerald-100 dark:hover:border-emerald-900/40 relative overflow-hidden">
      {/* Header Block */}
      <div>
        <h3 className="text-slate-800 dark:text-white font-extrabold text-sm tracking-tight flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-450" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
          </svg>
          What-If Sustainability Simulator
        </h3>
        <p className="text-slate-455 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Explore how management changes may reduce emissions</p>
      </div>

      {/* Comparison Chart */}
      <div className="w-full h-[180px] border-b border-slate-100 dark:border-slate-700/80 pb-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={scenarios} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tickStyle={{ fontSize: 9, fontWeight: "bold", fill: tickColor }} axisLine={false} tickLine={false} />
            <YAxis tickStyle={{ fontSize: 9, fontWeight: "bold", fill: tickColor }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {scenarios.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.id === "current" ? "#94a3b8" : entry.improvement >= 15 ? "#10b981" : entry.improvement >= 5 ? "#f59e0b" : "#64748b"} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Scenarios Table - Responsive: transforms to card layout on small devices */}
      <div className="overflow-x-auto">
        {/* Desktop View Table */}
        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700/50 hidden sm:table text-xs">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Scenario</th>
              <th className="px-3 py-2 text-right text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Footprint (kg/ha)</th>
              <th className="px-3 py-2 text-right text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Improvement</th>
              <th className="px-3 py-2 text-center text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 font-medium text-slate-700 dark:text-slate-300">
            {scenarios.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                <td className="px-3 py-2.5 font-bold text-slate-800 dark:text-slate-100">{s.name}</td>
                <td className="px-3 py-2.5 text-right font-black">{s.value.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-right text-emerald-600 dark:text-emerald-400 font-extrabold">
                  {s.id === "current" ? "—" : `+${s.improvement}%`}
                </td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${s.badge}`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile View Stacked Cards */}
        <div className="sm:hidden space-y-3">
          {scenarios.map((s) => (
            <div key={s.id} className="border border-slate-100 dark:border-slate-800 rounded-xl p-3 flex flex-col justify-between gap-2 text-xs hover:border-slate-200 dark:hover:border-slate-700 transition-colors bg-white dark:bg-slate-900/20">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 dark:text-slate-100">{s.name}</span>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border ${s.badge}`}>
                  {s.status}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <div className="space-y-0.5">
                  <p className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Footprint</p>
                  <p className="font-black text-slate-700 dark:text-slate-300">{s.value.toLocaleString()} kg/ha</p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Improvement</p>
                  <p className="text-emerald-600 dark:text-emerald-450 font-black">
                    {s.id === "current" ? "—" : `+${s.improvement}%`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-md text-white text-[11px] font-medium space-y-1">
        <p className="font-bold text-slate-200">{item.name}</p>
        <p className="text-emerald-400 font-extrabold">{item.value.toLocaleString()} kg CO₂e/ha</p>
        {item.id !== "current" && (
          <p className="text-slate-400">Improvement: +{item.improvement}%</p>
        )}
      </div>
    );
  }
  return null;
};

export default WhatIfSimulator;
