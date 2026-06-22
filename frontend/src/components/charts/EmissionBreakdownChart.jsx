import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useTheme } from "../../context/ThemeContext";

function EmissionBreakdownChart({ carbonFootprint, formData, loading }) {
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
          <div className="h-40 bg-slate-150 dark:bg-slate-700/50 rounded-xl flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-650 border-t-slate-400 dark:border-t-slate-300 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Empty State (Before Prediction)
  if (!hasValue) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed shadow-sm p-6 flex flex-col justify-between min-h-[300px] transition-all duration-300 hover:border-slate-350 dark:hover:border-slate-700">
        <div>
          {/* Header Block */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H18a5 5 0 01-9.562-2H9.18A9 9 0 0011 3.055z" />
              </svg>
            </div>
            <div>
              <h3 className="text-slate-550 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Emission Source Breakdown</h3>
              <p className="text-slate-450 dark:text-slate-500 text-[10px] font-medium uppercase tracking-wider">Estimated Drivers</p>
            </div>
          </div>

          {/* Empty State Message */}
          <p className="text-slate-500 dark:text-slate-450 text-sm leading-relaxed font-medium mt-2">
            Run an assessment to view emission breakdown.
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
  const absoluteFootprint = Math.abs(parseFloat(carbonFootprint) || 0);

  // Proportional breakdown calculations
  const cropBase = formData.Crop_Type === "Rice" ? 350 : formData.Crop_Type === "Maize" ? 220 : 150;
  const fertilizerBase = parseFloat(formData.Fertilizer_Amount || 0) * 2.5 + (formData.Fertilizer_Type === "Urea" ? 80 : 40);
  const weatherBase = parseFloat(formData.Rainfall || 0) * 0.25 + parseFloat(formData.Temperature || 0) * 6;
  const soilBase = parseFloat(formData.N_Content || 0) * 1.8 + parseFloat(formData.P_Content || 0) * 0.8 + parseFloat(formData.K_Content || 0) * 0.5;

  const totalBase = Math.max(1, cropBase + fertilizerBase + weatherBase + soilBase);

  const cropValue = parseFloat(((cropBase / totalBase) * absoluteFootprint).toFixed(1));
  const fertilizerValue = parseFloat(((fertilizerBase / totalBase) * absoluteFootprint).toFixed(1));
  const weatherValue = parseFloat(((weatherBase / totalBase) * absoluteFootprint).toFixed(1));
  const soilValue = parseFloat(((soilBase / totalBase) * absoluteFootprint).toFixed(1));

  const data = [
    { name: "Crop Emissions", value: cropValue, percentage: Math.round((cropBase / totalBase) * 100), fill: "#10b981" },
    { name: "Fertilizer Emissions", value: fertilizerValue, percentage: Math.round((fertilizerBase / totalBase) * 100), fill: "#3b82f6" },
    { name: "Weather Impact", value: weatherValue, percentage: Math.round((weatherBase / totalBase) * 100), fill: "#f59e0b" },
    { name: "Soil Impact", value: soilValue, percentage: Math.round((soilBase / totalBase) * 100), fill: "#ec4899" }
  ];

  // Custom inside-pie labels renderer
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[10px] font-black"
      >
        {percentage > 8 ? `${percentage}%` : ""}
      </text>
    );
  };

  const strokeColor = theme === "dark" ? "#1e293b" : "#ffffff";
  const legendColor = theme === "dark" ? "#94a3b8" : "#64748b";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:border-emerald-100 dark:hover:border-emerald-900/40 relative overflow-hidden">
      {/* Header Block */}
      <div>
        <h3 className="text-slate-800 dark:text-white font-extrabold text-sm tracking-tight flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-450" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H18a5 5 0 01-9.562-2H9.18A9 9 0 0011 3.055z" />
          </svg>
          Emission Source Breakdown
        </h3>
        <p className="text-slate-450 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Estimated contribution of major emission drivers</p>
      </div>

      {/* Chart Block */}
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              iconSize={10} 
              iconType="circle"
              wrapperStyle={{ fontSize: "10px", fontWeight: "bold", color: legendColor }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius="75%"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
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
        <p className="text-emerald-400 font-extrabold">{item.percentage}%</p>
        <p className="text-slate-400">{item.value.toLocaleString()} kg CO₂e/ha</p>
      </div>
    );
  }
  return null;
};

export default EmissionBreakdownChart;
