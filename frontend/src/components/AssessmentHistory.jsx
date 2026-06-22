import { useState } from "react";

function AssessmentHistory({ history, onDelete, onSelect }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All"); // All, High, Medium, Low
  const [sort, setSort] = useState("Newest"); // Newest, Oldest, Highest Emission, Lowest Emission
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset pagination on search/filter/sort changes
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setCurrentPage(1);
  };

  // Process data: search + filter + sort
  const getProcessedHistory = () => {
    let list = [...history];

    // Search
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      list = list.filter((item) => (item.cropType || "").toLowerCase().includes(q));
    }

    // Filter
    if (filter !== "All") {
      list = list.filter((item) => item.sustainability === filter);
    }

    // Sort
    list.sort((a, b) => {
      if (sort === "Newest") {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
      if (sort === "Oldest") {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
      if (sort === "Highest Emission") {
        return b.carbonFootprint - a.carbonFootprint;
      }
      if (sort === "Lowest Emission") {
        return a.carbonFootprint - b.carbonFootprint;
      }
      return 0;
    });

    return list;
  };

  const processed = getProcessedHistory();

  // Pagination
  const totalItems = processed.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = processed.slice(startIndex, startIndex + itemsPerPage);

  const getBadgeStyle = (s) => {
    if (s === "High") return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-150 dark:border-emerald-900/30";
    if (s === "Medium") return "bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900/30";
    return "bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-450 border-rose-150 dark:border-rose-900/30";
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-6 hover:shadow-lg transition-all duration-300 hover:border-emerald-100 dark:hover:border-emerald-900/40">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-450 border border-emerald-100/50 dark:border-emerald-900/30">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-slate-800 dark:text-white font-extrabold text-sm tracking-tight">Assessment History</h3>
            <p className="text-slate-455 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Historical records and carbon benchmarks</p>
          </div>
        </div>

        {/* Count Badge */}
        <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-black bg-slate-100 dark:bg-slate-900 text-slate-650 dark:text-slate-350">
          {history.length} {history.length === 1 ? "Record" : "Records"} Total
        </span>
      </div>

      {/* Controls Bar: Search, Filter, Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="flex flex-col">
          <label htmlFor="history-search" className="text-[10px] font-bold text-slate-455 dark:text-slate-550 uppercase mb-1">Search Crop Type</label>
          <div className="relative">
            <input
              id="history-search"
              type="text"
              placeholder="e.g. Rice, Corn..."
              value={search}
              onChange={handleSearchChange}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg pl-3 pr-8 py-2 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/55"
            />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(""); setCurrentPage(1); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        </div>

        {/* Filter */}
        <div className="flex flex-col">
          <label htmlFor="history-filter" className="text-[10px] font-bold text-slate-455 dark:text-slate-550 uppercase mb-1">Filter Rating</label>
          <select
            id="history-filter"
            value={filter}
            onChange={handleFilterChange}
            className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/55"
          >
            <option value="All">All Ratings</option>
            <option value="High">High Sustainability</option>
            <option value="Medium">Medium Sustainability</option>
            <option value="Low">Low Sustainability</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex flex-col">
          <label htmlFor="history-sort" className="text-[10px] font-bold text-slate-455 dark:text-slate-550 uppercase mb-1">Sort By</label>
          <select
            id="history-sort"
            value={sort}
            onChange={handleSortChange}
            className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/55"
          >
            <option value="Newest">Newest Assessments</option>
            <option value="Oldest">Oldest Assessments</option>
            <option value="Highest Emission">Highest Emissions</option>
            <option value="Lowest Emission">Lowest Emissions</option>
          </select>
        </div>
      </div>

      {/* Main List / Table */}
      {paginatedList.length > 0 ? (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto border border-slate-100 dark:border-slate-750/80 rounded-xl">
            <table className="min-w-full divide-y divide-slate-150 dark:divide-slate-750/50 text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/40 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Crop</th>
                  <th className="px-4 py-3 text-right">Emissions (kg/ha)</th>
                  <th className="px-4 py-3 text-center">Sustainability</th>
                  <th className="px-4 py-3 text-right">Carbon Credits</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 font-medium text-slate-700 dark:text-slate-300">
                {paginatedList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-4 py-3 text-slate-450 dark:text-slate-500">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-100">{item.cropType}</td>
                    <td className="px-4 py-3 text-right font-black">
                      {Math.round(item.carbonFootprint).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${getBadgeStyle(item.sustainability)}`}>
                        {item.sustainability}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-450 font-extrabold">
                      {item.carbonCredits} Cr
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => onSelect(item)}
                          className="px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded border border-emerald-200 dark:border-emerald-900/30 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="px-2.5 py-1 text-[10px] font-bold text-rose-700 dark:text-rose-450 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded border border-rose-200 dark:border-rose-900/30 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="sm:hidden space-y-3">
            {paginatedList.map((item) => (
              <div key={item.id} className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-200 dark:hover:border-slate-700 transition-colors bg-white dark:bg-slate-900/20">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">{item.cropType}</span>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border ${getBadgeStyle(item.sustainability)}`}>
                    {item.sustainability}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Date</p>
                    <p className="font-medium text-slate-650 dark:text-slate-350">{new Date(item.timestamp).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Footprint</p>
                    <p className="font-black text-slate-800 dark:text-slate-150">{Math.round(item.carbonFootprint).toLocaleString()} kg/ha</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Credits</p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-450">{item.carbonCredits} Credits</p>
                  </div>
                </div>

                {/* Actions row */}
                <div className="flex gap-2 pt-2 border-t border-slate-50 dark:border-slate-800 justify-end">
                  <button
                    onClick={() => onSelect(item)}
                    className="px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg border border-emerald-250 dark:border-emerald-900/30 transition-colors flex-1 text-center"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="px-3 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-450 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg border border-rose-250 dark:border-rose-900/30 transition-colors flex-1 text-center"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs">
              <span className="text-slate-450 dark:text-slate-500 font-bold">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} entries
              </span>
              <div className="inline-flex gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
          <p className="text-slate-450 dark:text-slate-500 font-bold text-xs">No previous assessments found.</p>
        </div>
      )}
    </div>
  );
}

export default AssessmentHistory;
