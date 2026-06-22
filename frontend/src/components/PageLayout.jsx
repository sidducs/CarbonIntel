import { Link } from "react-router-dom";

function PageLayout({ title, subtitle, breadcrumbs = [], children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center space-x-2">
                {idx > 0 && <span className="text-slate-300 dark:text-slate-700">/</span>}
                {crumb.path ? (
                  <Link
                    to={crumb.path}
                    className="hover:text-slate-655 dark:hover:text-slate-350 transition-colors focus:outline-none focus:underline"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-600 dark:text-slate-400 font-bold">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-800 gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-slate-550 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="animate-fadeIn">
          {children}
        </div>
      </div>
    </div>
  );
}

export default PageLayout;
