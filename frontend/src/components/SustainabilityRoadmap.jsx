function SustainabilityRoadmap({ formData, carbonFootprint, sustainability }) {
  const hasValue = carbonFootprint !== null && carbonFootprint !== undefined && formData !== null && formData !== undefined;

  // Empty state: Only show after prediction exists
  if (!hasValue) {
    return null;
  }

  const rain = parseFloat(formData.Rainfall || 0);
  const soc = parseFloat(formData.SOC || 0);
  const ph = parseFloat(formData.pH || 0);
  const fertAmt = parseFloat(formData.Fertilizer_Amount || 0);

  // Dynamic Phase Actions Generator
  const getPhaseActions = (phaseNumber) => {
    const actionsList = [];
    const isHealthy = sustainability === "High" || (soc >= 2.0 && fertAmt <= 250 && rain >= 400 && ph >= 5.5 && ph <= 7.5);

    if (phaseNumber === 1) {
      // Phase 1: Immediate Actions (0-3 Months)
      if (soc < 2.0) {
        actionsList.push({
          title: "Introduce Organic Amendments",
          description: "Apply biochar, leaf litter compost, or animal manures to reverse soil organic carbon decline.",
          priority: "High",
          impact: "Moderate"
        });
      }
      if (fertAmt > 250) {
        actionsList.push({
          title: "Optimize Fertilizer Rates",
          description: "Reduce immediate nitrogen overload by calibrating spreader rates based on crop targets.",
          priority: "Critical",
          impact: "High"
        });
      }
      if (rain < 400) {
        actionsList.push({
          title: "Irrigation Audit & Assessment",
          description: "Assess aquifer depletion rates and inspect existing pipelines for irrigation leaks.",
          priority: "Critical",
          impact: "Moderate"
        });
      }
      if (ph < 5.5 || ph > 7.5) {
        actionsList.push({
          title: "pH Adjustment Correction",
          description: "Apply buffering agents like agricultural limestone (for acidic soils) or elemental sulfur.",
          priority: "High",
          impact: "Moderate"
        });
      }
      if (isHealthy || actionsList.length === 0) {
        actionsList.push({
          title: "Baseline Carbon Auditing",
          description: "Establish baseline soil profile mapping and track historical yields to verify ESG standards.",
          priority: "Low",
          impact: "Moderate"
        });
      }
    } else if (phaseNumber === 2) {
      // Phase 2: Optimization Actions (3-12 Months)
      if (soc < 2.0) {
        actionsList.push({
          title: "Cover Cropping Program",
          description: "Plant leguminous species like crimson clover to lock nutrients and build root biomass.",
          priority: "High",
          impact: "High"
        });
      }
      if (fertAmt > 250) {
        actionsList.push({
          title: "Precision Nutrient Management",
          description: "Integrate split application scheduling and leaf chlorophyll analysis to match nitrogen needs.",
          priority: "High",
          impact: "High"
        });
      }
      if (rain < 400) {
        actionsList.push({
          title: "Water Efficiency Improvements",
          description: "Implement drip line micro-irrigation and plastic soil mulching to curb evaporation loss.",
          priority: "High",
          impact: "High"
        });
      }
      if (ph < 5.5 || ph > 7.5) {
        actionsList.push({
          title: "pH Mapping & Zoning",
          description: "Perform grid soil testing to map spatial pH variance across management blocks.",
          priority: "Medium",
          impact: "Moderate"
        });
      }
      if (isHealthy || actionsList.length === 0) {
        actionsList.push({
          title: "Voluntary Carbon Certification",
          description: "Register offset records in international databases to qualify for credit issuance.",
          priority: "Medium",
          impact: "High"
        });
      }
    } else if (phaseNumber === 3) {
      // Phase 3: Long-Term Goals (1-3 Years)
      if (soc < 2.0) {
        actionsList.push({
          title: "Carbon Sequestration Strategy",
          description: "Transition permanently to minimum-till or zero-till farming to stabilize long-term sinks.",
          priority: "Medium",
          impact: "Very High"
        });
      }
      if (fertAmt > 250) {
        actionsList.push({
          title: "Alternative Nutrient Inputs",
          description: "Substitute synthetic nitrogen with organic bio-fertilizers and green manures.",
          priority: "Medium",
          impact: "Very High"
        });
      }
      if (rain < 400) {
        actionsList.push({
          title: "Climate Resilience Planning",
          description: "Transition toward drought-tolerant cultivars and modify crop rotation schemes.",
          priority: "Medium",
          impact: "Very High"
        });
      }
      if (ph < 5.5 || ph > 7.5) {
        actionsList.push({
          title: "Integrated Soil Health System",
          description: "Coordinate pH adjustments and organic matter replenishment plans to maintain crop availability.",
          priority: "Medium",
          impact: "High"
        });
      }
      if (isHealthy || actionsList.length === 0) {
        actionsList.push({
          title: "Net-Zero Agriculture Certification",
          description: "Brand crop harvests as carbon-neutral products to capture premium retail pricing.",
          priority: "Medium",
          impact: "Very High"
        });
      }
    }

    return actionsList;
  };

  const roadmapData = [
    {
      phase: 1,
      title: "Phase 1: Immediate Actions",
      timeframe: "0-3 Months",
      themeColor: "border-rose-200 dark:border-rose-900/30 bg-rose-50/20 dark:bg-rose-955/10 text-rose-700 dark:text-rose-455",
      dotColor: "bg-rose-500",
      actions: getPhaseActions(1)
    },
    {
      phase: 2,
      title: "Phase 2: Optimization Actions",
      timeframe: "3-12 Months",
      themeColor: "border-amber-200 dark:border-amber-900/30 bg-amber-50/20 dark:bg-amber-955/10 text-amber-700 dark:text-amber-455",
      dotColor: "bg-amber-500",
      actions: getPhaseActions(2)
    },
    {
      phase: 3,
      title: "Phase 3: Long-Term Goals",
      timeframe: "1-3 Years",
      themeColor: "border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/20 dark:bg-emerald-955/10 text-emerald-700 dark:text-emerald-455",
      dotColor: "bg-emerald-500",
      actions: getPhaseActions(3)
    }
  ];

  const getPriorityBadge = (p) => {
    if (p === "Critical") return "bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-455 border-rose-200 dark:border-rose-900/30";
    if (p === "High") return "bg-orange-50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-400 border-orange-200 dark:border-orange-900/30";
    if (p === "Medium") return "bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900/30";
    return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-150 dark:border-emerald-900/30";
  };

  const getImpactBadge = (i) => {
    if (i === "Very High") return "bg-emerald-100 dark:bg-emerald-955/40 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-900/40";
    if (i === "High") return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-850 dark:text-emerald-450 border border-emerald-200 dark:border-emerald-900/30";
    if (i === "Moderate") return "bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-900/30";
    return "bg-slate-50 dark:bg-slate-900 text-slate-755 dark:text-slate-400 border border-slate-200 dark:border-slate-700";
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-6 hover:shadow-lg transition-all duration-300 hover:border-emerald-100 dark:hover:border-emerald-900/40">
      {/* Header Block */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700/80 pb-4">
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-455 border border-emerald-100/50 dark:border-emerald-900/30">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <div>
          <h3 className="text-slate-800 dark:text-white font-extrabold text-sm tracking-tight">Sustainability Roadmap</h3>
          <p className="text-slate-450 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Phased environmental transition plan</p>
        </div>
      </div>

      {/* Roadmap Container */}
      <div className="relative pl-4 sm:pl-8 border-l border-slate-150 dark:border-slate-700/60 space-y-8 py-2">
        {roadmapData.map((phaseData) => (
          <div key={phaseData.phase} className="relative space-y-3">
            {/* Timeline Circle Milestone */}
            <span className={`absolute -left-[25px] sm:-left-[41px] top-1.5 w-4.5 h-4.5 rounded-full border-4 border-white dark:border-slate-800 shadow-sm ring-4 ring-slate-100/50 dark:ring-slate-900/30 ${phaseData.dotColor}`} />

            {/* Phase Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{phaseData.title}</h4>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${phaseData.themeColor}`}>
                  {phaseData.timeframe}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                {phaseData.actions.length} {phaseData.actions.length === 1 ? "Action" : "Actions"}
              </span>
            </div>

            {/* Action Cards Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {phaseData.actions.map((act, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-750 rounded-xl space-y-3 hover:bg-slate-100/30 dark:hover:bg-slate-900/20 transition-colors">
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-800 dark:text-slate-100 text-[11px] leading-tight">{act.title}</h5>
                    <p className="text-slate-550 dark:text-slate-400 text-[10.5px] leading-relaxed">{act.description}</p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Priority</span>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${getPriorityBadge(act.priority)}`}>
                        {act.priority}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Impact</span>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${getImpactBadge(act.impact)}`}>
                        {act.impact}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SustainabilityRoadmap;
