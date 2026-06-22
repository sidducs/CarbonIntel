import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useTheme } from "../context/ThemeContext";

function BenchmarkComparison({ carbonFootprint, formData, loading }) {
  const { theme } = useTheme();
  const hasValue = carbonFootprint !== null && carbonFootprint !== undefined && formData !== null && formData !== undefined;

  // 1. Loading State (Skeleton Loader)
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between min-h-[300px] animate-pulse">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-2 w-16 bg-slate-150 dark:bg-slate-700/80 rounded" />
            </div>
          </div>
          <div className="h-40 bg-slate-150 dark:bg-slate-700/50 rounded-xl" />
        </div>
      </div>
    );
  }

  // 2. Empty State: Show nothing until prediction exists
  if (!hasValue) {
    return null;
  }

  // 3. Results State (After Prediction)
  const currentVal = parseFloat(carbonFootprint);
  const crop = formData.Crop_Type || "Rice";

  // Benchmark Lookup Table
  const benchmarks = {
    Rice: 1200,
    Corn: 800,
    Wheat: 600,
    Soybeans: 400,
    Vegetables: 700
  };

  const benchmarkVal = benchmarks[crop] || 800;

  // Calculations
  const diffVal = parseFloat((currentVal - benchmarkVal).toFixed(1));
  const pctDiff = parseFloat(((diffVal / benchmarkVal) * 100).toFixed(1));

  // Determine Performance Categories & Colors
  let rating;
  let badgeClass;
  let indicatorColor;
  let farmBarColor;

  if (isNaN(pctDiff)) {
    rating = "Average";
    badgeClass = "bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-405 border-amber-200 dark:border-amber-900/30";
    indicatorColor = "bg-amber-500";
    farmBarColor = "#f59e0b"; // Yellow
  } else if (pctDiff <= -20) {
    rating = "Excellent";
    badgeClass = "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-850 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30";
    indicatorColor = "bg-emerald-500";
    farmBarColor = "#10b981"; // Green
  } else if (pctDiff <= -5) {
    rating = "Good";
    badgeClass = "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-150 dark:border-emerald-900/30";
    indicatorColor = "bg-emerald-500";
    farmBarColor = "#10b981"; // Green
  } else if (pctDiff <= 5) {
    rating = "Average";
    badgeClass = "bg-amber-50 dark:bg-amber-950/20 text-amber-850 dark:text-amber-400 border-amber-200 dark:border-amber-900/30";
    indicatorColor = "bg-amber-500";
    farmBarColor = "#f59e0b"; // Yellow
  } else if (pctDiff <= 20) {
    rating = "Below Average";
    badgeClass = "bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-450 border-rose-150 dark:border-rose-900/30";
    indicatorColor = "bg-rose-500";
    farmBarColor = "#f43f5e"; // Red
  } else {
    rating = "Poor";
    badgeClass = "bg-rose-50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-400 border-rose-250 dark:border-rose-900/30";
    indicatorColor = "bg-rose-600";
    farmBarColor = "#e11d48"; // Darker Red
  }

  // Chart Data
  const benchmarkColor = theme === "dark" ? "#475569" : "#64748b";
  const chartData = [
    { name: "Current Farm", value: Math.max(0, Math.round(currentVal)), color: farmBarColor },
    { name: "Crop Benchmark", value: benchmarkVal, color: benchmarkColor }
  ];

  const formattedDiff = diffVal > 0 ? `+${diffVal.toLocaleString()}` : diffVal.toLocaleString();
  const formattedPct = pctDiff > 0 ? `+${pctDiff}%` : `${pctDiff}%`;
  const tickColor = theme === "dark" ? "#64748b" : "#94a3b8";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-6 hover:shadow-lg transition-all duration-300 hover:border-emerald-100 dark:hover:border-emerald-900/40 relative overflow-hidden">
      {/* Header Block */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-450 border border-emerald-100/50 dark:border-emerald-900/30">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-slate-800 dark:text-white font-extrabold text-sm tracking-tight">Industry Benchmark Comparison</h3>
          <p className="text-slate-455 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Comparing farm footprint vs crop standards</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-700/60 rounded-xl">
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">Your Farm</span>
          <span className="text-base font-black text-slate-800 dark:text-slate-100 block">{Math.round(currentVal).toLocaleString()}</span>
          <span className="text-[9px] font-medium text-slate-450 dark:text-slate-500 uppercase block">kg CO₂e/ha</span>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-700/60 rounded-xl">
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">Crop Standard</span>
          <span className="text-base font-black text-slate-800 dark:text-slate-100 block">{benchmarkVal.toLocaleString()}</span>
          <span className="text-[9px] font-medium text-slate-455 dark:text-slate-500 uppercase block">kg CO₂e/ha</span>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-700/60 rounded-xl">
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">Variance</span>
          <span className={`text-base font-black block ${pctDiff > 5 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
            {formattedDiff}
          </span>
          <span className="text-[9px] font-bold uppercase block text-slate-400 dark:text-slate-500">{formattedPct} vs standard</span>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-700/60 rounded-xl flex flex-col justify-between">
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 tracking-wider block mb-1">Rating</span>
          <div>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black border ${badgeClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${indicatorColor}`} />
              {rating}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Block */}
      <div className="w-full h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={35}>
            <XAxis dataKey="name" tickStyle={{ fontSize: 10, fontWeight: "bold", fill: tickColor }} axisLine={false} tickLine={false} />
            <YAxis tickStyle={{ fontSize: 9, fontWeight: "bold", fill: tickColor }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-md text-white text-[11px] font-medium space-y-0.5">
        <p className="font-bold text-slate-200">{item.name}</p>
        <p className="text-emerald-400 font-extrabold">{item.value.toLocaleString()} kg CO₂e/ha</p>
      </div>
    );
  }
  return null;
};

export default BenchmarkComparison;
