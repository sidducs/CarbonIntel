import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { useTheme } from "../../context/ThemeContext";

function SustainabilityScoreChart({ carbonFootprint, loading }) {
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
            <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-650 border-t-slate-400 dark:border-t-slate-300 animate-spin" />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-slate-550 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Sustainability Score</h3>
              <p className="text-slate-450 dark:text-slate-550 text-[10px] font-medium uppercase tracking-wider">Eco Rating</p>
            </div>
          </div>

          {/* Empty State Message */}
          <p className="text-slate-500 dark:text-slate-450 text-sm leading-relaxed font-medium mt-2">
            Run an assessment to calculate sustainability score.
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
  
  // Calculate Sustainability Score
  const rawScore = 100 - (numVal / 20);
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  // Scoring Logic & Colors
  let scoreClass = "Low";
  let scoreColor = "#f43f5e"; // Rose-500
  let textColor = "text-rose-600 dark:text-rose-400";
  let indicatorColor = "bg-rose-500";

  if (score >= 80) {
    scoreClass = "High";
    scoreColor = "#10b981"; // Emerald-500
    textColor = "text-emerald-600 dark:text-emerald-400";
    indicatorColor = "bg-emerald-500";
  } else if (score >= 50) {
    scoreClass = "Medium";
    scoreColor = "#f59e0b"; // Amber-500
    textColor = "text-amber-600 dark:text-amber-400";
    indicatorColor = "bg-amber-500";
  }

  const chartData = [
    {
      name: "Sustainability",
      value: score,
      fill: scoreColor
    }
  ];

  const radialBgColor = theme === "dark" ? "#334155" : "#f1f5f9";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:border-emerald-100 dark:hover:border-emerald-900/40 relative overflow-hidden">
      {/* Header Block */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-450 border border-emerald-100/50 dark:border-emerald-900/30">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h3 className="text-slate-800 dark:text-white font-extrabold text-sm tracking-tight">Sustainability Score</h3>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">Overall environmental performance assessment</p>
        </div>
      </div>

      {/* Progress Chart Container */}
      <div className="relative w-full h-[150px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="75%"
            outerRadius="95%"
            barSize={12}
            data={chartData}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: radialBgColor }}
              clockWise
              dataKey="value"
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center overlay of score value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-slate-800 dark:text-white leading-none">{score}</span>
          <span className="text-[9px] uppercase font-black text-slate-450 dark:text-slate-500 tracking-wider mt-1">Score</span>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Performance Rating</span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${textColor} border-slate-150 dark:border-slate-700/60`}>
            <span className={`w-1.5 h-1.5 rounded-full ${indicatorColor}`} />
            {scoreClass} Sustainability
          </span>
        </div>

        {/* Scoring Scale Guide */}
        <div className="grid grid-cols-3 gap-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase text-center mt-0.5">
          <div className="flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>80 - 100</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>50 - 79</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>0 - 49</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SustainabilityScoreChart;
