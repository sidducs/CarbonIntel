function ExecutiveSummary({ formData, carbonFootprint, sustainability }) {
  const hasValue = carbonFootprint !== null && carbonFootprint !== undefined && formData !== null && formData !== undefined;

  // Empty State: Show nothing until prediction exists
  if (!hasValue) {
    return null;
  }

  const numCF = parseFloat(carbonFootprint);
  const crop = formData.Crop_Type || "Rice";
  const fertType = formData.Fertilizer_Type || "Urea";
  const fertAmount = parseFloat(formData.Fertilizer_Amount || 0);
  const soc = parseFloat(formData.SOC || 0);
  const ph = parseFloat(formData.pH || 0);

  // Carbon credits estimation
  let credits = 0;
  if (numCF < 800) {
    credits = parseFloat(((800 - numCF) / 1000).toFixed(2));
  }
  const revenue = credits * 1500;

  // Benchmark Lookup
  const benchmarks = {
    Rice: 1200,
    Corn: 800,
    Wheat: 600,
    Soybeans: 400,
    Vegetables: 700
  };
  const benchmarkVal = benchmarks[crop] || 800;

  // 1. Generate Key Findings
  const findings = [];
  if (numCF > benchmarkVal) {
    const diffPct = Math.round(((numCF - benchmarkVal) / benchmarkVal) * 100);
    findings.push({
      type: "alert",
      text: `Carbon footprint (${numCF} kg/ha) is ${diffPct}% above the regional industry benchmark for ${crop} (${benchmarkVal} kg/ha).`
    });
  } else {
    const diffPct = Math.round(((benchmarkVal - numCF) / benchmarkVal) * 100);
    findings.push({
      type: "success",
      text: `Carbon footprint is performing well, representing a ${diffPct}% reduction compared to the industry crop benchmark (${benchmarkVal} kg/ha).`
    });
  }

  if (soc < 2.0) {
    findings.push({
      type: "alert",
      text: `Soil Organic Carbon (SOC) level is at ${soc}%, falling below the target threshold of 2.0% required for robust carbon sequestration.`
    });
  } else {
    findings.push({
      type: "success",
      text: `Soil Organic Carbon (SOC) is healthy at ${soc}%, supporting stable organic carbon sink operations.`
    });
  }

  if (fertAmount > 250) {
    findings.push({
      type: "alert",
      text: `Chemical fertilizer application rate (${fertAmount} kg/ha) represents a heavy GHG load, contributing heavily to direct nitrous oxide emissions.`
    });
  }

  if (ph < 5.5 || ph > 7.5) {
    findings.push({
      type: "alert",
      text: `Soil pH (${ph}) is outside the optimal nutrient-absorption range (5.5 - 7.5), potentially causing nutrient lock or plant stress.`
    });
  }

  // 2. Generate Top 3 Recommended Actions
  const recommendations = [];
  if (soc < 2.0) {
    recommendations.push({
      action: "Incorporate Soil Carbon Enhancers",
      details: "Apply biochar, cover crops, or compost to increase soil organic carbon content above 2.0%."
    });
  }
  if (fertAmount > 250) {
    recommendations.push({
      action: "Optimize Fertilizer Dosing",
      details: "Transition to slow-release coated fertilizer types and use split-application methods."
    });
  } else if (fertType === "Urea") {
    recommendations.push({
      action: "Substitute Urea with Lower-Emission Alternatives",
      details: "Consider coated NPK or organic manures to minimize atmospheric ammonia volatilization."
    });
  }
  if (ph < 5.5) {
    recommendations.push({
      action: "Apply Agricultural Lime",
      details: "Buffer excessive acidity by applying CaCO3 to bring soil pH closer to the neutral 6.5 standard."
    });
  } else if (ph > 7.5) {
    recommendations.push({
      action: "Add Elemental Sulfur or Composts",
      details: "Gently lower alkalinity levels to improve trace mineral accessibility for crops."
    });
  }
  if (numCF >= 800) {
    recommendations.push({
      action: "Target Carbon Credit Eligibility",
      details: "Reduce emissions below 800 kg CO2e/ha to unlock carbon offsets and green subsidy channels."
    });
  }

  // Fill up to 3 recommendations
  if (recommendations.length < 3) {
    recommendations.push({
      action: "Regular Carbon Audit & Monitoring",
      details: "Perform quarterly soil testing and climate metrics tracking to maintain sustainability status."
    });
  }
  const topRecommendations = recommendations.slice(0, 3);

  // 3. Generate Overall Assessment Paragraph
  let overallSummary;
  if (sustainability === "High") {
    overallSummary = `This farm demonstrates exemplary sustainability performance, maintaining a low-emission carbon footprint well below industry averages. By preserving these regenerative practices, the operation is highly eligible to participate in carbon credit markets, generating additional green revenue. It is recommended to maintain current fertilizer efficiency schedules and continue conservation tillage.`;
  } else if (sustainability === "Medium") {
    overallSummary = `This farm demonstrates moderate sustainability performance with clear opportunities for emission reduction through improved fertilizer management and soil carbon enhancement. Mitigating chemical fertilizer quantity and replacing standard urea with coated slow-release options can effectively decrease footprint intensity, steering the farm toward a premium low-carbon rating.`;
  } else {
    overallSummary = `This farm demonstrates critical environmental footprint impact and low sustainability performance. Urgent priority interventions are recommended, specifically focusing on curbing high fertilizer usage, buffering soil pH levels, and implementing immediate cover cropping to rebuild depleted soil organic carbon reserves.`;
  }

  return (
    <div id="executive-summary-print" className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6 hover:shadow-lg transition-all duration-300 hover:border-emerald-100 dark:hover:border-emerald-900/40">
      {/* Report Header */}
      <div className="border-b border-slate-100 dark:border-slate-700/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-slate-800 dark:text-white font-extrabold text-base tracking-tight flex items-center gap-2">
            <svg className="w-5.5 h-5.5 text-emerald-600 dark:text-emerald-450" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Executive Assessment Summary
          </h3>
          <p className="text-slate-450 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mt-0.5">Management Reporting & ESG Insights</p>
        </div>
        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-left sm:text-right">
          <p>Generated: {new Date().toLocaleDateString()}</p>
          <p>Status: Certified Evaluation</p>
        </div>
      </div>

      {/* Grid: Overview and Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
        {/* Section 1: Farm Overview */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700/80 pb-1.5">1. Farm Profile Overview</h4>
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-xs font-medium text-slate-650 dark:text-slate-350">
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase">Crop Type</span>
              <span className="text-slate-800 dark:text-slate-100 font-extrabold">{crop}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase">Soil Health (pH)</span>
              <span className="text-slate-800 dark:text-slate-100 font-extrabold">{ph}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase">Fertilizer Type</span>
              <span className="text-slate-800 dark:text-slate-100 font-extrabold">{fertType}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase">Fertilizer Amount</span>
              <span className="text-slate-800 dark:text-slate-100 font-extrabold">{fertAmount} kg/ha</span>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase">Soil Organic Carbon (SOC)</span>
              <span className="text-slate-800 dark:text-slate-100 font-extrabold">{soc}%</span>
            </div>
          </div>
        </div>

        {/* Section 2: Assessment Results */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700/80 pb-1.5">2. Sustainability Metrics</h4>
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-xs font-medium text-slate-650 dark:text-slate-350">
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase">Carbon Footprint</span>
              <span className="text-slate-800 dark:text-slate-100 font-black text-sm">{numCF.toLocaleString()} kg CO₂e/ha</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase">Rating Status</span>
              <span className={`inline-flex px-2 py-0.5 mt-0.5 rounded-full text-[10px] font-bold ${
                sustainability === "High" ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-850 dark:text-emerald-450 border border-emerald-200 dark:border-emerald-900/30" :
                sustainability === "Medium" ? "bg-amber-50 dark:bg-amber-950/20 text-amber-850 dark:text-amber-450 border border-amber-250 dark:border-amber-900/30" :
                "bg-rose-50 dark:bg-rose-950/20 text-rose-850 dark:text-rose-450 border border-rose-250 dark:border-rose-900/30"
              }`}>{sustainability} Sustainability</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase">Carbon Credits</span>
              <span className="text-slate-800 dark:text-slate-100 font-extrabold">{credits} Credits/ha</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase">Estimated Value</span>
              <span className="text-slate-800 dark:text-slate-100 font-extrabold">${revenue.toLocaleString()} USD/ha</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Key Findings */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700/80 pb-1.5">3. Key Diagnostic Findings</h4>
        <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-350">
          {findings.map((f, i) => (
            <li key={i} className="flex items-start gap-2 leading-relaxed text-slate-700 dark:text-slate-300">
              {f.type === "alert" ? (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              )}
              {f.text}
            </li>
          ))}
        </ul>
      </div>

      {/* Section 4: Recommended Actions */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700/80 pb-1.5">4. Recommended Action Roadmap</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {topRecommendations.map((r, i) => (
            <div key={i} className="p-3.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-700/60 rounded-xl space-y-1">
              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Step 0{i + 1}: {r.action}</span>
              <p className="text-slate-550 dark:text-slate-400 text-[11px] leading-relaxed">{r.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Overall Assessment (suitable for PDF export / print) */}
      <div className="bg-slate-50/50 dark:bg-slate-900/20 p-4 border border-slate-100 dark:border-slate-700/60 rounded-xl space-y-2">
        <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">5. General Assessment Statement</h4>
        <p className="text-xs text-slate-750 dark:text-slate-200 font-medium leading-relaxed italic">
          "{overallSummary}"
        </p>
      </div>
    </div>
  );
}

export default ExecutiveSummary;
