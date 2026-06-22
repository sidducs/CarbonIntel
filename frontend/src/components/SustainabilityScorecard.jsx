import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { useTheme } from "../context/ThemeContext";

// Reusable Scoring Engine for Portfolio and Multi-Farm Analysis
function calculateScorecard(formData, carbonFootprint, sustainability) {
  if (!formData || carbonFootprint === null || carbonFootprint === undefined) {
    return null;
  }

  const cf = parseFloat(carbonFootprint);
  const rain = parseFloat(formData.Rainfall || 0);
  const temp = parseFloat(formData.Temperature || 0);
  const soc = parseFloat(formData.SOC || 0);
  const ph = parseFloat(formData.pH || 0);
  const fertAmt = parseFloat(formData.Fertilizer_Amount || 0);
  const fertType = formData.Fertilizer_Type || "";

  // 1. Carbon Performance Score (35%)
  let carbonScore = 100 - (cf / 20);
  carbonScore = Math.max(0, Math.min(100, carbonScore));

  // 2. Soil Health Score (25%)
  let socSubScore = 20;
  if (soc >= 2.0) socSubScore = 100;
  else if (soc >= 1.0) socSubScore = 60;

  let phSubScore = 20;
  if (ph >= 6.0 && ph <= 7.0) phSubScore = 100;
  else if (ph >= 5.5 && ph <= 7.5) phSubScore = 80;
  else if (ph >= 5.0 && ph <= 8.0) phSubScore = 50;

  const soilScore = (socSubScore + phSubScore) / 2;

  // 3. Fertilizer Efficiency Score (20%)
  let fertScore = 100;
  if (fertAmt > 0) {
    fertScore = 100 - (fertAmt / 4);
  }
  if (fertType === "Urea") {
    fertScore -= 10;
  }
  fertScore = Math.max(0, Math.min(100, fertScore));

  // 4. Climate Resilience Score (10%)
  let tempSubScore = 40;
  if (temp <= 30) tempSubScore = 100;
  else if (temp <= 32) tempSubScore = 75;

  let rainSubScore = 30;
  if (rain >= 500 && rain <= 1200) rainSubScore = 100;
  else if (rain >= 400 && rain <= 1500) rainSubScore = 75;

  const climateScore = (tempSubScore + rainSubScore) / 2;

  // 5. Sustainability Rating Score (10%)
  let ratingScore = 30;
  if (sustainability === "High") ratingScore = 100;
  else if (sustainability === "Medium") ratingScore = 70;

  // Weighted aggregation
  const overallScore = Math.round(
    carbonScore * 0.35 +
    soilScore * 0.25 +
    fertScore * 0.20 +
    climateScore * 0.10 +
    ratingScore * 0.10
  );

  // Determine Performance Band
  let band = "Critical";
  let color = "#ef4444"; // Red
  let textClass = "text-rose-750 dark:text-rose-455 bg-rose-50 dark:bg-rose-955/20 border border-rose-200 dark:border-rose-900/30";

  if (overallScore >= 90) {
    band = "Excellent";
    color = "#10b981"; // Emerald
    textClass = "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-955/20 border border-emerald-250 dark:border-emerald-900/30";
  } else if (overallScore >= 75) {
    band = "Good";
    color = "#22c55e"; // Green
    textClass = "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-955/20 border border-green-200 dark:border-green-900/30";
  } else if (overallScore >= 60) {
    band = "Fair";
    color = "#eab308"; // Yellow
    textClass = "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-955/20 border border-amber-200 dark:border-amber-900/30";
  } else if (overallScore >= 40) {
    band = "Needs Improvement";
    color = "#f97316"; // Orange
    textClass = "text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-955/20 border border-orange-200 dark:border-orange-900/30";
  }

  // Generate Strength & Improvement
  const categories = [
    { name: "Carbon Performance", score: carbonScore },
    { name: "Soil Health", score: soilScore },
    { name: "Fertilizer Efficiency", score: fertScore },
    { name: "Climate Resilience", score: climateScore },
    { name: "Sustainability Rating", score: ratingScore }
  ];

  const sortedCategories = [...categories].sort((a, b) => b.score - a.score);
  const topStrength = sortedCategories[0];
  const topImprovement = sortedCategories[sortedCategories.length - 1];

  return {
    overallScore,
    band,
    color,
    textClass,
    categories,
    topStrength,
    topImprovement
  };
}

function SustainabilityScorecard({ formData, carbonFootprint, sustainability }) {
  const { theme } = useTheme();
  const hasValue = carbonFootprint !== null && carbonFootprint !== undefined && formData !== null && formData !== undefined;

  // Empty state: Only show after prediction exists
  if (!hasValue) {
    return null;
  }

  const scorecard = calculateScorecard(formData, carbonFootprint, sustainability);
  if (!scorecard) return null;

  const radarData = scorecard.categories.map((c) => ({
    subject: c.name,
    score: c.score,
    fullMark: 100
  }));

  const angleAxisColor = theme === "dark" ? "#94a3b8" : "#64748b";
  const radiusAxisColor = theme === "dark" ? "#475569" : "#94a3b8";
  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-6 hover:shadow-lg transition-all duration-300 hover:border-emerald-100 dark:hover:border-emerald-900/40">
      {/* Header Block */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700/80 pb-4">
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-455 border border-emerald-100/50 dark:border-emerald-900/30">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-slate-800 dark:text-white font-extrabold text-sm tracking-tight">Portfolio Sustainability Scorecard</h3>
          <p className="text-slate-450 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Weighted ESG performance metric</p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Side: Score Summary (6 cols) */}
        <div className="md:col-span-6 space-y-5">
          {/* Big Score Card */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-750 rounded-xl flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Overall ESG Score</span>
              <span className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-1 block leading-none">{scorecard.overallScore}<span className="text-slate-400 dark:text-slate-500 text-xs font-normal"> /100</span></span>
            </div>
            <div className={`px-3 py-1.5 rounded-lg border text-xs font-extrabold tracking-tight shrink-0 text-center ${scorecard.textClass}`}>
              {scorecard.band}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div className="p-3 bg-emerald-50/30 dark:bg-emerald-955/10 border border-emerald-100/50 dark:border-emerald-900/30 rounded-xl space-y-1">
              <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Top Strength</span>
              <p className="font-extrabold text-slate-800 dark:text-slate-100 leading-tight">{scorecard.topStrength.name}</p>
              <p className="text-slate-550 dark:text-slate-400 font-semibold">{Math.round(scorecard.topStrength.score)}/100 Efficiency</p>
            </div>

            <div className="p-3 bg-rose-50/30 dark:bg-rose-955/10 border border-rose-100/50 dark:border-rose-900/30 rounded-xl space-y-1">
              <span className="text-[9px] font-black text-rose-700 dark:text-rose-450 uppercase tracking-wider">Top Improvement Area</span>
              <p className="font-extrabold text-slate-800 dark:text-slate-100 leading-tight">{scorecard.topImprovement.name}</p>
              <p className="text-slate-550 dark:text-slate-400 font-semibold">{Math.round(scorecard.topImprovement.score)}/100 Rating</p>
            </div>
          </div>

          {/* Breakdown Slider Bars */}
          <div className="space-y-3 pt-2">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider">Category Breakdown</h4>
            <div className="space-y-2">
              {scorecard.categories.map((c, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-655 dark:text-slate-350">
                    <span>{c.name}</span>
                    <span>{Math.round(c.score)}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Radar Chart (6 cols) */}
        <div className="md:col-span-6 flex items-center justify-center">
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke={gridColor} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: angleAxisColor, fontSize: 9, fontWeight: "bold" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: radiusAxisColor, fontSize: 8 }} />
                <Radar
                  name="Farm ESG Score"
                  dataKey="score"
                  stroke={scorecard.color}
                  fill={scorecard.color}
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SustainabilityScorecard;
