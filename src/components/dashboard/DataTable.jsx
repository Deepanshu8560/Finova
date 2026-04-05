import React, { useState, useMemo } from 'react';
import { Button } from '../ui/Button';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

/**
 * Sortable, paginated data table for mock user data.
 *
 * @param {Object}   props
 * @param {Array}    props.columns       - Column config: { key, label, sortable?, render? }
 * @param {Array}    [props.data=[]]     - Row data
 * @param {boolean}  [props.isLoading=false]
 * @param {string}   [props.emptyMessage]
 * @returns {JSX.Element}
 */
export const DataTable = ({
  columns,
  data = [],
  isLoading = false,
  emptyMessage = 'No data available',
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig]   = useState(null);
  const rowsPerPage = 8;

  const sortedData = useMemo(() => {
    if (!sortConfig?.key) return data;
    return [...data].sort((a, b) => {
      const av = a[sortConfig.key], bv = b[sortConfig.key];
      if (av < bv) return sortConfig.direction === 'asc' ? -1 :  1;
      if (av > bv) return sortConfig.direction === 'asc' ?  1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const totalPages    = Math.ceil(sortedData.length / rowsPerPage) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev =>
      prev?.key === key && prev.direction === 'asc'
        ? { key, direction: 'desc' }
        : { key, direction: 'asc' }
    );
  };

  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {columns.map(col => (
                  <th key={col.key} className="px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0">
                  {columns.map((col, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className={`h-3.5 bg-slate-200 rounded animate-skeleton-pulse ${j === 0 ? 'w-3/4' : 'w-full'}`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ── Empty state ── */
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-12 text-center">
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 text-slate-300 shadow-sm border border-slate-200">
          <Inbox className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">{emptyMessage}</h3>
        <p className="text-sm text-slate-400 mt-1">Check back later when there is more activity.</p>
      </div>
    );
  }

  /* ── Full table ── */
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider select-none ${
                    col.sortable !== false ? 'cursor-pointer hover:text-slate-600 transition-colors group' : ''
                  }`}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable !== false && (
                      <span className="flex flex-col -space-y-1 opacity-30 group-hover:opacity-70 transition-opacity">
                        <ChevronUp   className={`w-2.5 h-2.5 ${sortConfig?.key === col.key && sortConfig.direction === 'asc'  ? 'opacity-100 text-primary-600' : ''}`} />
                        <ChevronDown className={`w-2.5 h-2.5 ${sortConfig?.key === col.key && sortConfig.direction === 'desc' ? 'opacity-100 text-primary-600' : ''}`} />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {paginatedData.map((row, i) => (
              <tr
                key={row.id ?? i}
                className="transition-colors duration-100 hover:bg-primary-50/40"
              >
                {columns.map(col => (
                  <td key={col.key} className="px-5 py-3.5 text-slate-700">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 bg-slate-50/80 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            Rows <span className="font-semibold text-slate-600">{(currentPage - 1) * rowsPerPage + 1}</span>–<span className="font-semibold text-slate-600">{Math.min(currentPage * rowsPerPage, sortedData.length)}</span> of{' '}
            <span className="font-semibold text-slate-600">{sortedData.length}</span>
          </p>
          <div className="flex gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
