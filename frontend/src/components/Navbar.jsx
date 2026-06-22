import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Styling helper for NavLinks to highlight active page in a premium SaaS format
  const getLinkClass = ({ isActive }) =>
    isActive
      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 font-semibold px-3 py-2 rounded-lg transition-all text-sm flex items-center gap-1.5"
      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 px-3 py-2 rounded-lg transition-all text-sm font-medium flex items-center gap-1.5";

  const getMobileLinkClass = ({ isActive }) =>
    isActive
      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/20 font-bold block px-4 py-3 rounded-lg text-sm transition-all"
      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 block px-4 py-3 rounded-lg text-sm font-medium transition-all";

  // Escape key handler to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      // Prevent body scrolling when drawer is active
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo / Brand Name */}
            <div className="flex items-center">
              <NavLink to="/" className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <div className="p-1.5 bg-emerald-600 dark:bg-emerald-500 rounded-lg text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 8 0 4.4-3 8-10 10Z"/>
                    <path d="M2 22c0-4 2-7 10-7"/>
                  </svg>
                </div>
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  Carbon<span className="text-emerald-600 dark:text-emerald-400">Intel</span>
                </span>
              </NavLink>
            </div>

            {/* Desktop Navigation Links + Toggle */}
            <div className="hidden md:flex items-center space-x-2">
              <NavLink to="/dashboard" className={getLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/analysis" className={getLinkClass}>
                Analysis
              </NavLink>
              <NavLink to="/optimization" className={getLinkClass}>
                Optimization
              </NavLink>
              <NavLink to="/reports" className={getLinkClass}>
                Reports
              </NavLink>
              <NavLink to="/copilot" className={getLinkClass}>
                Copilot
              </NavLink>
              <NavLink to="/about" className={getLinkClass}>
                About
              </NavLink>
              
              <div className="pl-2 border-l border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile Hamburguer trigger */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(true)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Slide-out Mobile/Tablet Drawer Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-72 max-w-[80vw] bg-white dark:bg-slate-900 z-55 shadow-2xl p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Drawer"
      >
        <div className="space-y-6">
          {/* Drawer Header Close / Logo */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <NavLink to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
              <div className="p-1 bg-emerald-600 rounded text-white">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.1 2 8 0 4.4-3 8-10 10Z"/>
                  <path d="M2 22c0-4 2-7 10-7"/>
                </svg>
              </div>
              <span className="font-black tracking-tight text-slate-800 dark:text-white text-base">
                Carbon<span className="text-emerald-650">Intel</span>
              </span>
            </NavLink>
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* NavLinks List */}
          <div className="space-y-1 flex flex-col">
            <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className={getMobileLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/analysis" onClick={() => setIsOpen(false)} className={getMobileLinkClass}>
              Analysis
            </NavLink>
            <NavLink to="/optimization" onClick={() => setIsOpen(false)} className={getMobileLinkClass}>
              Optimization
            </NavLink>
            <NavLink to="/reports" onClick={() => setIsOpen(false)} className={getMobileLinkClass}>
              Reports
            </NavLink>
            <NavLink to="/copilot" onClick={() => setIsOpen(false)} className={getMobileLinkClass}>
              Copilot
            </NavLink>
            <NavLink to="/about" onClick={() => setIsOpen(false)} className={getMobileLinkClass}>
              About
            </NavLink>
          </div>
        </div>

        {/* Theme Toggle at bottom of drawer */}
        <div className="pt-4 border-t border-slate-155 dark:border-slate-800/80 flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider">Appearance</span>
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}

export default Navbar;