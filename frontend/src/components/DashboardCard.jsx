function DashboardCard({ title, subtitle, icon, children, action, className = "" }) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm p-6 space-y-4 transition-all duration-300 ${className}`}>
      {(title || icon || action) && (
        <div className="flex items-center justify-between pb-2 border-b border-slate-50 dark:border-slate-750/50">
          <div className="flex items-center gap-2.5">
            {icon && (
              <span className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-emerald-600 dark:text-emerald-400 border border-slate-100 dark:border-slate-800 shadow-xs shrink-0">
                {icon}
              </span>
            )}
            <div>
              {title && (
                <h3 className="text-sm font-bold text-slate-850 dark:text-white">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && (
            <div className="shrink-0">
              {action}
            </div>
          )}
        </div>
      )}
      <div className="text-slate-700 dark:text-slate-350">
        {children}
      </div>
    </div>
  );
}

export default DashboardCard;
