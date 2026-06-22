import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-900 via-emerald-850 to-slate-900 dark:from-slate-950 dark:via-emerald-950/70 dark:to-slate-950 text-white overflow-hidden">
        {/* Background decorative vector */}
        <div className="absolute inset-0 opacity-15">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,20 50,50 T100,50 L100,100 L0,100 Z" fill="currentColor" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left md:flex md:items-center md:justify-between gap-12">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Machine Learning Powered
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none">
              Predict Agricultural <br />
              <span className="text-emerald-400">Carbon Footprints</span>
            </h1>
            <p className="text-slate-350 text-lg leading-relaxed">
              Empower your farm management with research-grade predictive intelligence. Assess soil chemistry, fertilizer impact, and weather variables using our tuned XGBoost pipeline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
              <Link
                to="/dashboard"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all text-center flex items-center justify-center gap-2"
              >
                Launch Assessment Tool
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/about"
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-medium px-8 py-3.5 rounded-xl transition text-center"
              >
                Read Methodology
              </Link>
            </div>
          </div>

          {/* Quick Metrics Badge Grid */}
          <div className="mt-12 md:mt-0 grid grid-cols-2 gap-4 max-w-md mx-auto md:mx-0 w-full">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Model R² Score</h3>
              <p className="text-4xl font-extrabold text-emerald-400 mt-2">0.9945</p>
              <p className="text-xs text-slate-400 mt-1">GridTuned XGBoost</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Features Modeled</h3>
              <p className="text-4xl font-extrabold text-emerald-400 mt-2">11</p>
              <p className="text-xs text-slate-400 mt-1">Chemical & Climate</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm col-span-2">
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Regulatory Compliance</h3>
              <p className="text-lg font-bold text-white mt-1.5">IPCC Tiers Equivalent</p>
              <p className="text-xs text-slate-400 mt-0.5">Empirical emission factors models</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Value Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">Key Insights</h2>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Multi-Dimensional Environmental Factors
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Our platform evaluates critical variables across three key domains of the agricultural lifecycle.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1: Soil properties */}
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition duration-300">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Soil Biochemistry</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Analyzes Soil Organic Carbon (SOC), NPK concentration levels, and pH balances. Understand how soil serves as a carbon sink under optimized crop rotations.
            </p>
          </div>

          {/* Card 2: Fertilizer Application */}
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition duration-300">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Fertilizer Impact</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Calculates direct and manufacturing emissions for various nitrogenous blends (Urea, Ammonium Nitrate, NPK) and organic applications based on amount.
            </p>
          </div>

          {/* Card 3: Weather profiles */}
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition duration-300">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Climatic Volatility</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Incorporates temperature, humidity, and rainfall patterns to factor in seasonal volatilization rates, crop respiration shifts, and environmental stressors.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="bg-slate-100 dark:bg-slate-950/20 py-16 px-4">
        <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 shadow-md p-8 sm:p-12 text-center space-y-6">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Ready to compute your carbon footprint index?
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Instantly benchmark your farm parameters. Assess inputs against established agricultural coefficients and download complete reports.
          </p>
          <div className="pt-2">
            <Link
              to="/dashboard"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;