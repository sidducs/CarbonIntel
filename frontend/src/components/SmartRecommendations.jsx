function SmartRecommendations({ formData, carbonFootprint, sustainability }) {
  const hasValue = carbonFootprint !== null && carbonFootprint !== undefined && formData !== null && formData !== undefined;

  // Empty State: Show nothing until prediction exists
  if (!hasValue) {
    return null;
  }

  const soc = parseFloat(formData.SOC || 0);
  const fertilizerAmount = parseFloat(formData.Fertilizer_Amount || 0);
  const fertilizerType = formData.Fertilizer_Type || "";
  const temperature = parseFloat(formData.Temperature || 0);
  const rainfall = parseFloat(formData.Rainfall || 0);
  const ph = parseFloat(formData.pH || 0);

  const priorityActions = [];
  const recommendedImprovements = [];

  // Rule 1: SOC < 1
  if (soc < 1.0) {
    priorityActions.push({
      severity: "Critical",
      badge: "bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-900/30",
      indicator: "bg-rose-500",
      recommendation: "Critical Soil Carbon Depletion Warning",
      description: "Apply biochar, compost, or crop residues immediately to rebuild soil carbon."
    });
  }

  // Rule 2: SOC < 2 and >= 1
  if (soc >= 1.0 && soc < 2.0) {
    recommendedImprovements.push({
      severity: "High",
      badge: "bg-orange-50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-400 border-orange-200 dark:border-orange-900/30",
      indicator: "bg-orange-500",
      recommendation: "Increase Organic Matter & Cover Cropping",
      description: "Implement cover cropping and reduce tillage intensity to boost organic carbon reserves."
    });
  }

  // Rule 3: Fertilizer_Amount > 300
  if (fertilizerAmount > 300) {
    priorityActions.push({
      severity: "High",
      badge: "bg-orange-50 dark:bg-orange-950/20 text-orange-850 dark:text-orange-400 border-orange-200 dark:border-orange-900/30",
      indicator: "bg-orange-500",
      recommendation: "Reduce Fertilizer Application Rates",
      description: "Adopt split-application and precision nutrient dosing to prevent excessive emission runoff."
    });
  }

  // Rule 4: Fertilizer_Type = Urea
  if (fertilizerType === "Urea") {
    recommendedImprovements.push({
      severity: "Medium",
      badge: "bg-amber-50 dark:bg-amber-950/20 text-amber-850 dark:text-amber-400 border-amber-200 dark:border-amber-900/30",
      indicator: "bg-amber-500",
      recommendation: "Consider Lower-Emission Fertilizer Alternatives",
      description: "Transition from Urea to slow-release, coated nitrogen formulations to cut volatilization losses."
    });
  }

  // Rule 5: Temperature > 32
  if (temperature > 32) {
    recommendedImprovements.push({
      severity: "Medium",
      badge: "bg-amber-50 dark:bg-amber-950/20 text-amber-850 dark:text-amber-400 border-amber-200 dark:border-amber-900/30",
      indicator: "bg-amber-500",
      recommendation: "Increased Climate Stress Risk Mitigations",
      description: "Integrate agroforestry or windbreaks to provide microclimate cooling for soil and crops."
    });
  }

  // Rule 6: Rainfall < 400
  if (rainfall < 400) {
    priorityActions.push({
      severity: "High",
      badge: "bg-orange-50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-400 border-orange-200 dark:border-orange-900/30",
      indicator: "bg-orange-500",
      recommendation: "Water Stress Risk Mitigation",
      description: "Install drip irrigation networks and heavy organic mulching to conserve moisture."
    });
  }

  // Rule 7: Rainfall > 1500
  if (rainfall > 1500) {
    recommendedImprovements.push({
      severity: "Medium",
      badge: "bg-amber-50 dark:bg-amber-950/20 text-amber-850 dark:text-amber-400 border-amber-200 dark:border-amber-900/30",
      indicator: "bg-amber-500",
      recommendation: "Nutrient Leaching Risk Protection",
      description: "Design vegetative filter strips and cover crops to capture escaping soil nutrients."
    });
  }

  // Rule 8: pH < 5.5
  if (ph < 5.5) {
    recommendedImprovements.push({
      severity: "Medium",
      badge: "bg-amber-50 dark:bg-amber-950/20 text-amber-850 dark:text-amber-400 border-amber-200 dark:border-amber-900/30",
      indicator: "bg-amber-500",
      recommendation: "Soil Acidity Neutralization",
      description: "Apply agricultural lime (calcium carbonate) to buffer acidity and optimize nutrient uptake."
    });
  }

  // Rule 9: pH > 7.5
  if (ph > 7.5) {
    recommendedImprovements.push({
      severity: "Medium",
      badge: "bg-amber-50 dark:bg-amber-950/20 text-amber-850 dark:text-amber-400 border-amber-200 dark:border-amber-900/30",
      indicator: "bg-amber-500",
      recommendation: "Soil Alkalinity Neutralization",
      description: "Incorporate elemental sulfur or composted organic manures to gently lower pH levels."
    });
  }

  // Sustainability Badge Reinforcements
  if (sustainability === "Low") {
    priorityActions.push({
      severity: "Critical",
      badge: "bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-900/30",
      indicator: "bg-rose-500",
      recommendation: "Priority Emission Reduction Required",
      description: "Low sustainability level detected. Immediate intervention in carbon offset strategies is advised."
    });
  } else if (sustainability === "Medium") {
    recommendedImprovements.push({
      severity: "Medium",
      badge: "bg-amber-50 dark:bg-amber-950/20 text-amber-850 dark:text-amber-400 border-amber-200 dark:border-amber-900/30",
      indicator: "bg-amber-500",
      recommendation: "Farm Sustainability Optimizations",
      description: "Refining nitrogen application schedules can elevate your rating to high sustainability."
    });
  } else if (sustainability === "High") {
    recommendedImprovements.push({
      severity: "Low",
      badge: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30",
      indicator: "bg-emerald-500",
      recommendation: "Carbon Market & Offset Monetization",
      description: "Excellent sustainability status. Consider registering your farm in carbon credit programs."
    });
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-6 hover:shadow-lg transition-all duration-300 hover:border-emerald-100 dark:hover:border-emerald-900/40">
      {/* Header Block */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-450 border border-emerald-100/50 dark:border-emerald-900/30">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h3 className="text-slate-800 dark:text-white font-extrabold text-sm tracking-tight">AI Sustainability Recommendations</h3>
          <p className="text-slate-450 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Actionable insights tailored to your farm assessment</p>
        </div>
      </div>

      {/* Recommendations Cards - Priority Actions Section */}
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Priority Actions</h4>
          {priorityActions.length > 0 ? (
            <div className="space-y-3">
              {priorityActions.map((rec, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 hover:border-rose-100 dark:hover:border-rose-900/30 hover:bg-rose-50/10 dark:hover:bg-rose-950/5 transition-all duration-200">
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${rec.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${rec.indicator}`} />
                      {rec.severity}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-800 dark:text-slate-100 text-xs leading-none">{rec.recommendation}</h5>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 dark:text-slate-500 text-xs italic bg-slate-50 dark:bg-slate-900/40 rounded-xl p-3 text-center border border-slate-100 dark:border-slate-700/60">
              No priority alerts. Your farm is operating within safe environmental thresholds.
            </p>
          )}
        </div>

        {/* Recommended Improvements Section */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Recommended Improvements</h4>
          {recommendedImprovements.length > 0 ? (
            <div className="space-y-3">
              {recommendedImprovements.map((rec, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 hover:border-emerald-100 dark:hover:border-emerald-900/30 hover:bg-emerald-50/10 dark:hover:bg-emerald-950/5 transition-all duration-200">
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${rec.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${rec.indicator}`} />
                      {rec.severity}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-800 dark:text-slate-100 text-xs leading-none">{rec.recommendation}</h5>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 dark:text-slate-500 text-xs italic bg-slate-50 dark:bg-slate-900/40 rounded-xl p-3 text-center border border-slate-100 dark:border-slate-700/60">
              No additional optimizations suggested.
            </p>
          )}
        </div>

        {/* Expected Benefits Section */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Expected Benefits</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-700/60 hover:border-emerald-100 dark:hover:border-emerald-900/40 transition-colors">
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Soil Vitality</p>
              <p className="text-slate-550 dark:text-slate-350 text-xs leading-normal">Rebuilds organic carbon matter, boosting crop productivity and retaining soil moisture.</p>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-700/60 hover:border-emerald-100 dark:hover:border-emerald-900/40 transition-colors">
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Carbon Offsets</p>
              <p className="text-slate-550 dark:text-slate-350 text-xs leading-normal">Unlocks direct eligibility for verified carbon certificates and green financing.</p>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-700/60 hover:border-emerald-100 dark:hover:border-emerald-900/40 transition-colors">
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Cost Savings</p>
              <p className="text-slate-550 dark:text-slate-350 text-xs leading-normal">Improves efficiency, reducing synthetic input costs by up to 25% over time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmartRecommendations;
