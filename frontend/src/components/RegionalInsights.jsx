import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "../context/ThemeContext";

function RegionalInsights({ formData, carbonFootprint, sustainability }) {
  const { theme } = useTheme();
  const hasValue = carbonFootprint !== null && carbonFootprint !== undefined && formData !== null && formData !== undefined;

  // Empty state: Only show after prediction exists
  if (!hasValue) {
    return null;
  }

  const temp = parseFloat(formData.Temperature || 0);
  const rain = parseFloat(formData.Rainfall || 0);
  const soc = parseFloat(formData.SOC || 0);
  const ph = parseFloat(formData.pH || 0);
  const fertAmt = parseFloat(formData.Fertilizer_Amount || 0);

  const climateRisks = [];
  const soilRisks = [];
  const opportunities = [];
  const actions = [];

  // Diagnostics & Rules
  // 1. Temperature
  if (temp > 32) {
    climateRisks.push({
      title: "Heat Stress Alert",
      text: `Elevated temperature (${temp}°C) increases evapotranspiration rates and soil moisture stress.`,
      severity: "High"
    });
    actions.push({
      title: "Crop Shade & Mulching",
      text: "Implement crop residue mulching or agroforestry shade canopies to cool the topsoil.",
      severity: "High"
    });
  } else {
    opportunities.push({
      title: "Optimal Growth Temp",
      text: `Stable temperature (${temp}°C) supports robust crop vegetative growth.`,
      severity: "Low"
    });
  }

  // 2. Rainfall
  if (rain < 400) {
    climateRisks.push({
      title: "Severe Water Scarcity",
      text: `Low annual rainfall (${rain} mm) threatens aquifer levels and crop cell turgor.`,
      severity: "High"
    });
    actions.push({
      title: "Micro-Irrigation Deployment",
      text: "Switch to precision drip systems to optimize crop water efficiency.",
      severity: "High"
    });
  } else if (rain > 1500) {
    climateRisks.push({
      title: "Nutrient Leaching Risk",
      text: `Heavy rainfall (${rain} mm) risks nutrient runoff, soil erosion, and leaching.`,
      severity: "Medium"
    });
    actions.push({
      title: "Soil Erosion Control",
      text: "Establish contour bunds or planting barriers to retain fertilizer and topsoil.",
      severity: "Medium"
    });
  } else {
    opportunities.push({
      title: "Balanced Water Regime",
      text: `Moderate annual rainfall (${rain} mm) supplies adequate natural hydration.`,
      severity: "Low"
    });
  }

  // 3. SOC
  if (soc < 1.0) {
    soilRisks.push({
      title: "Critical Soil Degradation",
      text: `Extremely low Soil Organic Carbon (${soc}%) indicates severe topsoil carbon depletion.`,
      severity: "Critical"
    });
    actions.push({
      title: "Organic Amendment Overhaul",
      text: "Apply biochar, farmyard manure, or leaf compost immediately to build organic matter.",
      severity: "Critical"
    });
  } else if (soc < 2.0) {
    soilRisks.push({
      title: "Soil Carbon Depletion",
      text: `Sub-optimal SOC (${soc}%) limits soil structure stability and moisture retention.`,
      severity: "Medium"
    });
    actions.push({
      title: "Cover Cropping",
      text: "Introduce leguminous cover crops (e.g. vetch or clover) in the off-season.",
      severity: "Medium"
    });
  } else {
    opportunities.push({
      title: "Healthy Soil Structure",
      text: `SOC level is rich (${soc}%), ensuring optimal biological microbial activity.`,
      severity: "Low"
    });
  }

  // 4. pH
  if (ph < 5.5) {
    soilRisks.push({
      title: "Soil Acidity Concern",
      text: `Acidic soil pH (${ph}) locks up key macro-nutrients (P, Ca, Mg) and hinders absorption.`,
      severity: "High"
    });
    actions.push({
      title: "Liming Application",
      text: "Apply calcium carbonate (lime) to buffer soil acidity and restore root uptake capacity.",
      severity: "High"
    });
  } else if (ph > 7.5) {
    soilRisks.push({
      title: "Soil Alkalinity Concern",
      text: `Alkaline soil pH (${ph}) restricts iron, zinc, and manganese bioavailability.`,
      severity: "Medium"
    });
    actions.push({
      title: "Sulfur Amendments",
      text: "Incorporate elemental sulfur or gypsum to lower alkaline pH levels toward 6.5.",
      severity: "Medium"
    });
  } else {
    opportunities.push({
      title: "Neutral pH Window",
      text: `Soil pH (${ph}) is in the optimal neutral range for complete fertilizer uptake.`,
      severity: "Low"
    });
  }

  // 5. Environmental Opportunities (general)
  if (sustainability === "High") {
    opportunities.push({
      title: "Carbon Offset Potential",
      text: "High ESG rating places this farm in the top tier for premium voluntary offset markets.",
      severity: "Low"
    });
  }

  if (fertAmt < 150) {
    opportunities.push({
      title: "Low Nitrogen Leaching",
      text: "Low chemical load minimizes nitrous oxide release and downstream pollution.",
      severity: "Low"
    });
  }

  // Severity count calculations for Pie Chart
  const severities = ["Critical", "High", "Medium", "Low"];
  const severityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };

  // Helper count function
  const countItem = (item) => {
    if (item.severity && severities.includes(item.severity)) {
      severityCounts[item.severity]++;
    }
  };

  climateRisks.forEach(countItem);
  soilRisks.forEach(countItem);
  opportunities.forEach(countItem);
  actions.forEach(countItem);

  const pieData = [
    { name: "Critical", value: severityCounts.Critical, color: "#ef4444" }, // Red
    { name: "High", value: severityCounts.High, color: "#f97316" }, // Orange
    { name: "Medium", value: severityCounts.Medium, color: "#eab308" }, // Yellow
    { name: "Low", value: severityCounts.Low, color: "#10b981" } // Green
  ].filter((d) => d.value > 0);

  const getSeverityBadge = (s) => {
    if (s === "Critical") return "bg-rose-50 dark:bg-rose-955/20 text-rose-800 dark:text-rose-455 border-rose-250 dark:border-rose-900/30";
    if (s === "High") return "bg-orange-50 dark:bg-orange-950/20 text-orange-850 dark:text-orange-400 border-orange-200 dark:border-orange-900/30";
    if (s === "Medium") return "bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border-amber-250 dark:border-amber-900/30";
    return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-150 dark:border-emerald-900/30";
  };

  const getSeverityDot = (s) => {
    if (s === "Critical") return "bg-rose-500";
    if (s === "High") return "bg-orange-500";
    if (s === "Medium") return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-6 hover:shadow-lg transition-all duration-300 hover:border-emerald-100 dark:hover:border-emerald-900/40">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-455 border border-emerald-100/50 dark:border-emerald-900/30">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-slate-800 dark:text-white font-extrabold text-sm tracking-tight">Regional Sustainability Insights</h3>
            <p className="text-slate-450 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Climate and soil risk intelligence</p>
          </div>
        </div>
      </div>

      {/* Grid: Charts + Data list */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Side: PieChart distribution (4 cols) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-3.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-750 rounded-xl space-y-3">
          <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider text-center block">Risk severity share</span>
          <div className="w-[120px] h-[120px] relative">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-400 dark:text-slate-500 text-center">
                All Systems Nominal
              </div>
            )}
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[9px] font-extrabold text-slate-550 dark:text-slate-400 w-full justify-center">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getSeverityDot(d.name)}`} />
                <span>{d.name}: {d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Detailed Sections (8 cols) */}
        <div className="md:col-span-8 space-y-4 text-xs">
          {/* Section 1: Climate Risks */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700/80 pb-1">Climate Risks</h4>
            {climateRisks.length > 0 ? (
              <div className="space-y-2">
                {climateRisks.map((r, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 p-2 border border-slate-100 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-800/40">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100">{r.title}</p>
                      <p className="text-slate-550 dark:text-slate-400 text-[11px] leading-relaxed mt-0.5">{r.text}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0 ${getSeverityBadge(r.severity)}`}>
                      {r.severity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-450 dark:text-slate-500 italic text-[11px]">No immediate climate anomalies detected.</p>
            )}
          </div>

          {/* Section 2: Soil Health Risks */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700/80 pb-1">Soil Health Risks</h4>
            {soilRisks.length > 0 ? (
              <div className="space-y-2">
                {soilRisks.map((r, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 p-2 border border-slate-100 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-800/40">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100">{r.title}</p>
                      <p className="text-slate-550 dark:text-slate-400 text-[11px] leading-relaxed mt-0.5">{r.text}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0 ${getSeverityBadge(r.severity)}`}>
                      {r.severity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-450 dark:text-slate-500 italic text-[11px]">Soil chemical profiles remain stable.</p>
            )}
          </div>

          {/* Section 3: Environmental Opportunities */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700/80 pb-1">Environmental Opportunities</h4>
            {opportunities.length > 0 ? (
              <div className="space-y-2">
                {opportunities.map((r, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 p-2 border border-slate-100 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-800/40">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100">{r.title}</p>
                      <p className="text-slate-550 dark:text-slate-400 text-[11px] leading-relaxed mt-0.5">{r.text}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0 ${getSeverityBadge(r.severity)}`}>
                      {r.severity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-455 dark:text-slate-500 italic text-[11px]">No specific carbon sink opportunities identified.</p>
            )}
          </div>

          {/* Section 4: Priority Actions */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700/80 pb-1">Priority Actions</h4>
            {actions.length > 0 ? (
              <div className="space-y-2">
                {actions.map((r, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 p-2 border border-slate-100 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-800/40">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100">{r.title}</p>
                      <p className="text-slate-550 dark:text-slate-400 text-[11px] leading-relaxed mt-0.5">{r.text}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0 ${getSeverityBadge(r.severity)}`}>
                      {r.severity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-455 dark:text-slate-500 italic text-[11px]">Standard conservation tillage is recommended.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg shadow-md text-white text-[10px] font-bold">
        <p style={{ color: item.color }}>{item.name}</p>
        <p className="mt-0.5">{item.value} points/insights</p>
      </div>
    );
  }
  return null;
};

export default RegionalInsights;
