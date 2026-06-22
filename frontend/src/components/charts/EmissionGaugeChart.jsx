import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useTheme } from "../../context/ThemeContext";

function EmissionGaugeChart({ carbonFootprint, loading }) {
  const { theme } = useTheme();
  const hasValue = carbonFootprint !== null && carbonFootprint !== undefined;

  // 1. Loading State (Skeleton Loader)
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between min-h-[260px] animate-pulse">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-2 w-16 bg-slate-150 dark:bg-slate-700/80 rounded" />
            </div>
          </div>
          <div className="h-28 bg-slate-150 dark:bg-slate-700/50 rounded-xl flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-600 border-t-slate-400 dark:border-t-slate-300 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Empty State (Before Prediction)
  if (!hasValue) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed shadow-sm p-6 flex flex-col justify-between min-h-[260px] transition-all duration-300 hover:border-slate-350 dark:hover:border-slate-700">
        <div>
          {/* Header Block */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H18a5 5 0 01-9.562-2H9.18A9 9 0 0011 3.055z" />
              </svg>
            </div>
            <div>
              <h3 className="text-slate-550 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Emission Intensity Gauge</h3>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-medium uppercase tracking-wider">Live Carbon Index</p>
            </div>
          </div>

          {/* Empty State Message */}
          <p className="text-slate-500 dark:text-slate-450 text-sm leading-relaxed font-medium mt-2">
            Run an assessment to visualize emissions.
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
  const numVal = parseFloat(carbonFootprint);
  let statusLabel;
  let statusColor;
  let statusIndicator;
  
  if (isNaN(numVal)) {
    statusLabel = "Unknown";
    statusColor = "text-slate-500 dark:text-slate-400";
    statusIndicator = "bg-slate-400";
  } else if (numVal < 400) {
    statusLabel = "Sustainable";
    statusColor = "text-emerald-600 dark:text-emerald-400";
    statusIndicator = "bg-emerald-500";
  } else if (numVal <= 1200) {
    statusLabel = "Moderate Impact";
    statusColor = "text-amber-600 dark:text-amber-400";
    statusIndicator = "bg-amber-500";
  } else {
    statusLabel = "High Emission";
    statusColor = "text-rose-600 dark:text-rose-400";
    statusIndicator = "bg-rose-500";
  }

  // Chart configuration parameters
  const totalGaugeRange = 2000;
  
  // Clamping value for pointer (handles negative carbon offset and excessive emissions)
  const clampedVal = Math.max(0, Math.min(totalGaugeRange, numVal));
  
  // Sectors data (Green, Yellow, Red)
  const sectorsData = [
    { value: 400, color: "#10b981" }, // Sustainable: 0 - 400 (Green)
    { value: 800, color: "#f59e0b" }, // Moderate: 400 - 1200 (Yellow)
    { value: 800, color: "#f43f5e" }  // High: 1200 - 2000 (Red)
  ];

  // needle / pointer data
  const needleWidth = 30; // Width of pointer base
  const slice1 = Math.max(0, clampedVal - needleWidth / 2);
  const slice2 = needleWidth;
  const slice3 = Math.max(0, totalGaugeRange - clampedVal - needleWidth / 2);

  const needleColor = theme === "dark" ? "#94a3b8" : "#334155";

  const needleData = [
    { value: slice1, color: "transparent" },
    { value: slice2, color: needleColor },
    { value: slice3, color: "transparent" }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:border-emerald-100 dark:hover:border-emerald-900/40 relative overflow-hidden">
      {/* Header Block */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-450 border border-emerald-100/50 dark:border-emerald-900/30">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-slate-800 dark:text-white font-extrabold text-sm tracking-tight">Emission Intensity Gauge</h3>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">Live Carbon Index vs Thresholds</p>
        </div>
      </div>

      {/* Recharts responsive container */}
      <div className="relative w-full h-[150px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            {/* Background color ring sectors */}
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={sectorsData}
              cx="50%"
              cy="95%"
              innerRadius="75%"
              outerRadius="95%"
              stroke="none"
            >
              {sectorsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>

            {/* Pointer / Needle overlay */}
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={needleData}
              cx="50%"
              cy="95%"
              innerRadius="0%"
              outerRadius="80%"
              stroke="none"
              isAnimationActive={true}
              animationDuration={850}
            >
              {needleData.map((entry, index) => (
                <Cell key={`needle-cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Dynamic value tag overlay (aligned to bottom center of gauge) */}
        <div className="absolute bottom-1 text-center">
          <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            {numVal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })}
          </p>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider -mt-0.5">kg CO₂e/ha</p>
        </div>
      </div>

      {/* Status & Threshold Legend */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Current Status</span>
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${statusColor}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusIndicator}`} />
            {statusLabel}
          </span>
        </div>
        
        {/* Threshold Markers Legend */}
        <div className="grid grid-cols-3 gap-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase text-center mt-0.5">
          <div className="flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>&lt; 400</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>400 - 1200</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>&gt; 1200</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmissionGaugeChart;
