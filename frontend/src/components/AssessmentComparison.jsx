import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useTheme } from "../context/ThemeContext";

function AssessmentComparison({ history }) {
  const { theme } = useTheme();
  const [selectedIdA, setSelectedIdA] = useState("");
  const [selectedIdB, setSelectedIdB] = useState("");
  const [activeChartTab, setActiveChartTab] = useState("footprint"); // footprint, credits, fertilizer, soc

  // Check if we have enough items
  if (!history || history.length < 2) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 hover:shadow-lg transition-all duration-300 hover:border-emerald-100 dark:hover:border-emerald-900/40">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700/80 pb-4 mb-4">
          <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div>
            <h3 className="text-slate-800 dark:text-white font-extrabold text-sm tracking-tight">Assessment Comparison</h3>
            <p className="text-slate-450 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Compare two assessments side-by-side</p>
          </div>
        </div>
        <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
          <p className="text-slate-450 dark:text-slate-500 font-bold text-xs">At least two assessments in history are required to perform a comparison.</p>
        </div>
      </div>
    );
  }

  const itemA = history.find((h) => h.id === selectedIdA);
  const itemB = history.find((h) => h.id === selectedIdB);

  // Comparison helper colors
  const compareValues = (valA, valB, lowerIsBetter = false) => {
    const a = parseFloat(valA);
    const b = parseFloat(valB);
    if (isNaN(a) || isNaN(b)) return { aClass: "text-slate-700 dark:text-slate-350", bClass: "text-slate-700 dark:text-slate-350" };

    if (a === b) {
      return {
        aClass: "text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/30",
        bClass: "text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/30"
      };
    }

    const betterStyle = "text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30 font-bold";
    const worseStyle = "text-rose-700 dark:text-rose-450 bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30 font-bold";

    if (lowerIsBetter) {
      return {
        aClass: a < b ? betterStyle : worseStyle,
        bClass: a > b ? betterStyle : worseStyle
      };
    } else {
      return {
        aClass: a > b ? betterStyle : worseStyle,
        bClass: a < b ? betterStyle : worseStyle
      };
    }
  };

  const compareSustainability = (susA, susB) => {
    const levels = { High: 3, Medium: 2, Low: 1 };
    const a = levels[susA] || 0;
    const b = levels[susB] || 0;

    if (a === b) {
      return {
        aClass: "text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/30",
        bClass: "text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/30"
      };
    }

    const betterStyle = "text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30 font-bold";
    const worseStyle = "text-rose-700 dark:text-rose-450 bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30 font-bold";

    return {
      aClass: a > b ? betterStyle : worseStyle,
      bClass: a < b ? betterStyle : worseStyle
    };
  };

  // Generate automated text summaries
  const generateSummary = () => {
    if (!itemA || !itemB) return null;

    const cfA = parseFloat(itemA.carbonFootprint);
    const cfB = parseFloat(itemB.carbonFootprint);

    const summaries = [];

    // Footprint summary
    if (cfA !== cfB) {
      const diff = Math.abs(cfA - cfB);
      const pct = Math.round((diff / (cfA || 1)) * 100);
      if (cfB < cfA) {
        summaries.push(`Assessment B improved carbon footprint by ${pct}% (${Math.round(diff).toLocaleString()} kg CO₂e/ha reduction) compared to Assessment A.`);
      } else {
        summaries.push(`Assessment B carbon footprint increased by ${pct}% (${Math.round(diff).toLocaleString()} kg CO₂e/ha increase) compared to Assessment A.`);
      }
    } else {
      summaries.push("Assessment A and Assessment B have the exact same carbon footprint level.");
    }

    // Sustainability summary
    if (itemA.sustainability !== itemB.sustainability) {
      summaries.push(`Sustainability level changed from ${itemA.sustainability} to ${itemB.sustainability}.`);
    } else {
      summaries.push(`Sustainability rating remained unchanged at ${itemA.sustainability}.`);
    }

    // Input difference insight
    const fertA = parseFloat(itemA.formData?.Fertilizer_Amount || 0);
    const fertB = parseFloat(itemB.formData?.Fertilizer_Amount || 0);
    if (fertA !== fertB) {
      const diff = Math.abs(fertA - fertB);
      if (fertB < fertA) {
        summaries.push(`Reduced chemical fertilizer by ${diff} kg/ha in Assessment B, supporting lower direct emissions.`);
      } else {
        summaries.push(`Increased chemical fertilizer by ${diff} kg/ha in Assessment B, driving higher direct emissions.`);
      }
    }

    return summaries;
  };

  const summaries = generateSummary();

  // Determine current chart data
  const getChartData = () => {
    if (!itemA || !itemB) return [];

    let valA = 0;
    let valB = 0;

    if (activeChartTab === "footprint") {
      valA = Math.round(itemA.carbonFootprint);
      valB = Math.round(itemB.carbonFootprint);
    } else if (activeChartTab === "credits") {
      valA = itemA.carbonCredits;
      valB = itemB.carbonCredits;
    } else if (activeChartTab === "fertilizer") {
      valA = parseFloat(itemA.formData?.Fertilizer_Amount || 0);
      valB = parseFloat(itemB.formData?.Fertilizer_Amount || 0);
    } else if (activeChartTab === "soc") {
      valA = parseFloat(itemA.formData?.SOC || 0);
      valB = parseFloat(itemB.formData?.SOC || 0);
    }

    return [
      { name: "Assessment A", value: valA, displayName: `${itemA.cropType} (${new Date(itemA.timestamp).toLocaleDateString()})` },
      { name: "Assessment B", value: valB, displayName: `${itemB.cropType} (${new Date(itemB.timestamp).toLocaleDateString()})` }
    ];
  };

  const chartData = getChartData();

  // Style compare results
  const cfCompare = itemA && itemB ? compareValues(itemA.carbonFootprint, itemB.carbonFootprint, true) : null;
  const susCompare = itemA && itemB ? compareSustainability(itemA.sustainability, itemB.sustainability) : null;
  const credCompare = itemA && itemB ? compareValues(itemA.carbonCredits, itemB.carbonCredits, false) : null;
  const fertCompare = itemA && itemB ? compareValues(itemA.formData?.Fertilizer_Amount, itemB.formData?.Fertilizer_Amount, true) : null;
  const socCompare = itemA && itemB ? compareValues(itemA.formData?.SOC, itemB.formData?.SOC, false) : null;

  const tickColor = theme === "dark" ? "#64748b" : "#94a3b8";
  const assessmentABarColor = theme === "dark" ? "#475569" : "#64748b";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-6 hover:shadow-lg transition-all duration-300 hover:border-emerald-100 dark:hover:border-emerald-900/40">
      {/* Header Block */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700/80 pb-4">
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-455 border border-emerald-100/50 dark:border-emerald-900/30">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <div>
          <h3 className="text-slate-800 dark:text-white font-extrabold text-sm tracking-tight">Assessment Comparison</h3>
          <p className="text-slate-450 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Compare two assessments side-by-side</p>
        </div>
      </div>

      {/* Select Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="comp-select-a" className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase mb-1">Assessment A</label>
          <select
            id="comp-select-a"
            value={selectedIdA}
            onChange={(e) => setSelectedIdA(e.target.value)}
            className="w-full border border-slate-200 dark:border-slate-750 rounded-lg p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/55 font-semibold"
          >
            <option value="">-- Select Assessment A --</option>
            {history.map((h) => (
              <option key={h.id} value={h.id} disabled={h.id === selectedIdB}>
                {h.cropType} ({new Date(h.timestamp).toLocaleDateString()}) - {Math.round(h.carbonFootprint)} kg/ha
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="comp-select-b" className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase mb-1">Assessment B</label>
          <select
            id="comp-select-b"
            value={selectedIdB}
            onChange={(e) => setSelectedIdB(e.target.value)}
            className="w-full border border-slate-200 dark:border-slate-750 rounded-lg p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/55 font-semibold"
          >
            <option value="">-- Select Assessment B --</option>
            {history.map((h) => (
              <option key={h.id} value={h.id} disabled={h.id === selectedIdA}>
                {h.cropType} ({new Date(h.timestamp).toLocaleDateString()}) - {Math.round(h.carbonFootprint)} kg/ha
              </option>
            ))}
          </select>
        </div>
      </div>

      {itemA && itemB ? (
        <div className="space-y-6">
          {/* Comparison Matrix Table - Desktop */}
          <div className="hidden sm:block overflow-x-auto border border-slate-100 dark:border-slate-750/80 rounded-xl">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-750/50 text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/40 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2.5 text-left">Parameter</th>
                  <th className="px-4 py-2.5 text-center">Assessment A</th>
                  <th className="px-4 py-2.5 text-center">Assessment B</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 font-medium text-slate-700 dark:text-slate-300">
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-slate-500 dark:text-slate-400">Crop Type</td>
                  <td className="px-4 py-2.5 text-center font-bold text-slate-800 dark:text-slate-100">{itemA.cropType}</td>
                  <td className="px-4 py-2.5 text-center font-bold text-slate-800 dark:text-slate-100">{itemB.cropType}</td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-slate-500 dark:text-slate-400">Carbon Footprint</td>
                  <td className={`px-4 py-2.5 text-center border-x border-transparent ${cfCompare.aClass}`}>
                    {Math.round(itemA.carbonFootprint).toLocaleString()} kg CO₂e/ha
                  </td>
                  <td className={`px-4 py-2.5 text-center border-x border-transparent ${cfCompare.bClass}`}>
                    {Math.round(itemB.carbonFootprint).toLocaleString()} kg CO₂e/ha
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-slate-500 dark:text-slate-400">Sustainability Level</td>
                  <td className={`px-4 py-2.5 text-center border-x border-transparent ${susCompare.aClass}`}>
                    {itemA.sustainability}
                  </td>
                  <td className={`px-4 py-2.5 text-center border-x border-transparent ${susCompare.bClass}`}>
                    {itemB.sustainability}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-slate-500 dark:text-slate-400">Carbon Credits</td>
                  <td className={`px-4 py-2.5 text-center border-x border-transparent ${credCompare.aClass}`}>
                    {itemA.carbonCredits} Credits
                  </td>
                  <td className={`px-4 py-2.5 text-center border-x border-transparent ${credCompare.bClass}`}>
                    {itemB.carbonCredits} Credits
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-slate-500 dark:text-slate-400">Fertilizer Amount</td>
                  <td className={`px-4 py-2.5 text-center border-x border-transparent ${fertCompare.aClass}`}>
                    {itemA.formData?.Fertilizer_Amount} kg/ha ({itemA.formData?.Fertilizer_Type})
                  </td>
                  <td className={`px-4 py-2.5 text-center border-x border-transparent ${fertCompare.bClass}`}>
                    {itemB.formData?.Fertilizer_Amount} kg/ha ({itemB.formData?.Fertilizer_Type})
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-slate-500 dark:text-slate-400">Soil Carbon (SOC)</td>
                  <td className={`px-4 py-2.5 text-center border-x border-transparent ${socCompare.aClass}`}>
                    {itemA.formData?.SOC} %
                  </td>
                  <td className={`px-4 py-2.5 text-center border-x border-transparent ${socCompare.bClass}`}>
                    {itemB.formData?.SOC} %
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-slate-500 dark:text-slate-400">Temperature</td>
                  <td className="px-4 py-2.5 text-center text-slate-700 dark:text-slate-300">{itemA.formData?.Temperature} °C</td>
                  <td className="px-4 py-2.5 text-center text-slate-700 dark:text-slate-300">{itemB.formData?.Temperature} °C</td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-slate-500 dark:text-slate-400">Rainfall</td>
                  <td className="px-4 py-2.5 text-center text-slate-700 dark:text-slate-300">{itemA.formData?.Rainfall} mm</td>
                  <td className="px-4 py-2.5 text-center text-slate-700 dark:text-slate-300">{itemB.formData?.Rainfall} mm</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Comparison Cards - Mobile */}
          <div className="sm:hidden grid grid-cols-1 gap-4 text-xs">
            <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 space-y-2.5 bg-white dark:bg-slate-900/20">
              <h4 className="font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Assessment A Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                <p><span className="font-bold text-slate-450 dark:text-slate-500 block">Crop Type</span> {itemA.cropType}</p>
                <p><span className="font-bold text-slate-450 dark:text-slate-500 block">Footprint</span> <span className={`inline-block px-2 py-0.5 rounded border ${cfCompare.aClass}`}>{Math.round(itemA.carbonFootprint)} kg/ha</span></p>
                <p><span className="font-bold text-slate-450 dark:text-slate-500 block">Sustainability</span> <span className={`inline-block px-2 py-0.5 rounded border ${susCompare.aClass}`}>{itemA.sustainability}</span></p>
                <p><span className="font-bold text-slate-455 dark:text-slate-500 block">Credits</span> <span className={`inline-block px-2 py-0.5 rounded border ${credCompare.aClass}`}>{itemA.carbonCredits} Credits</span></p>
                <p><span className="font-bold text-slate-455 dark:text-slate-500 block">Fertilizer</span> <span className={`inline-block px-2 py-0.5 rounded border ${fertCompare.aClass}`}>{itemA.formData?.Fertilizer_Amount} kg/ha</span></p>
                <p><span className="font-bold text-slate-455 dark:text-slate-500 block">SOC</span> <span className={`inline-block px-2 py-0.5 rounded border ${socCompare.aClass}`}>{itemA.formData?.SOC} %</span></p>
              </div>
            </div>

            <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 space-y-2.5 bg-white dark:bg-slate-900/20">
              <h4 className="font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Assessment B Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                <p><span className="font-bold text-slate-455 dark:text-slate-500 block">Crop Type</span> {itemB.cropType}</p>
                <p><span className="font-bold text-slate-455 dark:text-slate-500 block">Footprint</span> <span className={`inline-block px-2 py-0.5 rounded border ${cfCompare.bClass}`}>{Math.round(itemB.carbonFootprint)} kg/ha</span></p>
                <p><span className="font-bold text-slate-455 dark:text-slate-500 block">Sustainability</span> <span className={`inline-block px-2 py-0.5 rounded border ${susCompare.bClass}`}>{itemB.sustainability}</span></p>
                <p><span className="font-bold text-slate-455 dark:text-slate-500 block">Credits</span> <span className={`inline-block px-2 py-0.5 rounded border ${credCompare.bClass}`}>{itemB.carbonCredits} Credits</span></p>
                <p><span className="font-bold text-slate-455 dark:text-slate-500 block">Fertilizer</span> <span className={`inline-block px-2 py-0.5 rounded border ${fertCompare.bClass}`}>{itemB.formData?.Fertilizer_Amount} kg/ha</span></p>
                <p><span className="font-bold text-slate-455 dark:text-slate-500 block">SOC</span> <span className={`inline-block px-2 py-0.5 rounded border ${socCompare.bClass}`}>{itemB.formData?.SOC} %</span></p>
              </div>
            </div>
          </div>

          {/* Comparison Insights Summary Box */}
          {summaries.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-750 p-4 rounded-xl space-y-1.5">
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Comparison Insights Summary</h4>
              <ul className="text-xs text-slate-650 dark:text-slate-350 space-y-1.5 list-disc pl-4 leading-normal">
                {summaries.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Comparison BarChart Visualization with Tabs */}
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-700/80">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider">Visual Comparative Analysis</h4>
              {/* Tab Selector */}
              <div className="inline-flex bg-slate-100 dark:bg-slate-900/60 p-0.5 rounded-lg text-[10px] font-bold text-slate-555 shrink-0">
                <button
                  onClick={() => setActiveChartTab("footprint")}
                  className={`px-2.5 py-1.5 rounded-md transition-all ${activeChartTab === "footprint" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                >
                  Footprint
                </button>
                <button
                  onClick={() => setActiveChartTab("credits")}
                  className={`px-2.5 py-1.5 rounded-md transition-all ${activeChartTab === "credits" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                >
                  Credits
                </button>
                <button
                  onClick={() => setActiveChartTab("fertilizer")}
                  className={`px-2.5 py-1.5 rounded-md transition-all ${activeChartTab === "fertilizer" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                >
                  Fertilizer
                </button>
                <button
                  onClick={() => setActiveChartTab("soc")}
                  className={`px-2.5 py-1.5 rounded-md transition-all ${activeChartTab === "soc" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                >
                  SOC
                </button>
              </div>
            </div>

            <div className="w-full h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={35}>
                  <XAxis dataKey="name" tickStyle={{ fontSize: 10, fontWeight: "bold", fill: tickColor }} axisLine={false} tickLine={false} />
                  <YAxis tickStyle={{ fontSize: 9, fontWeight: "bold", fill: tickColor }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    <Cell fill={assessmentABarColor} />
                    <Cell fill="#10b981" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
          <p className="text-slate-450 dark:text-slate-500 font-bold text-xs font-semibold">Select two assessments to compare.</p>
        </div>
      )}
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-md text-white text-[11px] font-medium">
        <p className="font-bold text-slate-350">{item.name}</p>
        <p className="text-emerald-455 font-black text-xs">{item.displayName}</p>
        <p className="text-white font-extrabold mt-1">{item.value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default AssessmentComparison;
