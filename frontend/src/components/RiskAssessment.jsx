function RiskAssessment({ formData, carbonFootprint, sustainability }) {
  const hasValue = carbonFootprint !== null && carbonFootprint !== undefined && formData !== null && formData !== undefined;

  if (!hasValue) {
    return null;
  }

  const temp = parseFloat(formData.Temperature || 0);
  const rain = parseFloat(formData.Rainfall || 0);
  const soc = parseFloat(formData.SOC || 0);
  const ph = parseFloat(formData.pH || 0);
  const fertAmt = parseFloat(formData.Fertilizer_Amount || 0);

  const risks = [];

  // Weather Risks
  if (temp > 32) {
    risks.push({
      category: "Climate",
      title: "Heat Stress Risk",
      description: `Temperature at ${temp}°C exceeds optimal growth thresholds.`,
      severity: "High",
      badge: "bg-orange-50 dark:bg-orange-955/20 text-orange-800 dark:text-orange-400 border-orange-100 dark:border-orange-900/30"
    });
  }
  if (rain < 400) {
    risks.push({
      category: "Climate",
      title: "Severe Drought Risk",
      description: `Low rainfall (${rain} mm) represents serious moisture stress.`,
      severity: "Critical",
      badge: "bg-rose-50 dark:bg-rose-955/20 text-rose-800 dark:text-rose-455 border-rose-250 dark:border-rose-900/30"
    });
  } else if (rain > 1500) {
    risks.push({
      category: "Climate",
      title: "Nutrient Leaching Risk",
      description: `High rainfall (${rain} mm) risks fertilizer run-off and erosion.`,
      severity: "Medium",
      badge: "bg-amber-50 dark:bg-amber-955/20 text-amber-800 dark:text-amber-400 border-amber-100 dark:border-amber-900/30"
    });
  }

  // Soil Risks
  if (soc < 1.0) {
    risks.push({
      category: "Soil",
      title: "Critical Soil Degradation",
      description: `Extremely low Soil Organic Carbon (${soc}%) threatens soil biological health.`,
      severity: "Critical",
      badge: "bg-rose-50 dark:bg-rose-955/20 text-rose-800 dark:text-rose-455 border-rose-250 dark:border-rose-900/30"
    });
  } else if (soc < 2.0) {
    risks.push({
      category: "Soil",
      title: "Organic Matter Depletion",
      description: `Sub-optimal SOC (${soc}%) limits soil structure stability.`,
      severity: "Medium",
      badge: "bg-amber-50 dark:bg-amber-955/20 text-amber-850 dark:text-amber-400 border-amber-200 dark:border-amber-900/30"
    });
  }

  if (ph < 5.5) {
    risks.push({
      category: "Soil",
      title: "Soil Acidification",
      description: `Acidic pH (${ph}) limits macro-nutrient bioavailability.`,
      severity: "High",
      badge: "bg-orange-50 dark:bg-orange-955/20 text-orange-800 dark:text-orange-400 border-orange-100 dark:border-orange-900/30"
    });
  } else if (ph > 7.5) {
    risks.push({
      category: "Soil",
      title: "Soil Alkalinity",
      description: `Alkaline pH (${ph}) restricts essential trace metal absorption.`,
      severity: "Medium",
      badge: "bg-amber-50 dark:bg-amber-955/20 text-amber-850 dark:text-amber-400 border-amber-200 dark:border-amber-900/30"
    });
  }

  // Operational Risks
  if (fertAmt > 300) {
    risks.push({
      category: "Input",
      title: "Chemical Over-Application",
      description: `High fertilizer application rate (${fertAmt} kg/ha) drives volatilization.`,
      severity: "High",
      badge: "bg-orange-50 dark:bg-orange-955/20 text-orange-800 dark:text-orange-400 border-orange-100 dark:border-orange-900/30"
    });
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:border-emerald-100 dark:hover:border-emerald-900/40">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700/80 pb-3">
        <div className="p-2.5 bg-rose-50 dark:bg-rose-955/20 rounded-xl text-rose-650 dark:text-rose-455 border border-rose-100/50 dark:border-rose-900/30">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h3 className="text-slate-800 dark:text-white font-extrabold text-sm tracking-tight">Environmental Risk Assessment</h3>
          <p className="text-slate-455 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Vulnerability and hazard diagnostics</p>
        </div>
      </div>

      <div className="space-y-3">
        {risks.length > 0 ? (
          risks.map((risk, index) => (
            <div key={index} className="p-3 border border-slate-100 dark:border-slate-750/80 rounded-xl flex items-start justify-between gap-3 bg-slate-50/20 dark:bg-slate-900/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.2 bg-slate-100 dark:bg-slate-900 text-slate-550 dark:text-slate-400 font-black text-[8px] uppercase tracking-wider rounded">
                    {risk.category}
                  </span>
                  <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-xs">{risk.title}</h4>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">{risk.description}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border shrink-0 ${risk.badge}`}>
                {risk.severity}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
            <p className="text-slate-450 dark:text-slate-500 font-bold text-xs">No active ecological risks detected.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RiskAssessment;
