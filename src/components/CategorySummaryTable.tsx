'use client';
import { useEffect, useState } from 'react';
import { CategorySummary } from '@/types/expense';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';

export function CategorySummaryTable() {
  const [data, setData]       = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/expenses/summary')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then(json => setData(json.data))
      .catch(() => setError('Could not load analytics. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error)   return <p className="text-red-400 text-center py-8">{error}</p>;
  if (!data.length) return <EmptyState />;

  // grand total for percentage bar
  const grandTotal = data.reduce((sum, d) => sum + d.totalPaise, 0);

  return (
    <div className="rounded-xl border border-gray-800 overflow-hidden">

      {/* Header */}
      <table className="w-full text-sm shrink-0">
        <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-left">Expenses</th>
            <th className="px-4 py-3 text-left">Total</th>
            <th className="px-4 py-3 text-left">Share</th>
          </tr>
        </thead>
      </table>

      {/* Rows */}
      <div className="overflow-y-auto">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-800">
            {data.map(row => {
              const pct = grandTotal > 0
                ? ((row.totalPaise / grandTotal) * 100).toFixed(1)
                : '0.0';

              return (
                <tr key={row.category} className="bg-gray-950 hover:bg-gray-900 transition-colors">

                  {/* Category */}
                  <td className="px-4 py-3">
                    <span className="bg-gray-800 px-2 py-0.5 rounded-full text-xs text-gray-200">
                      {row.category}
                    </span>
                  </td>

                  {/* Count */}
                  <td className="px-4 py-3 text-gray-400 text-sm">
                    {row.count} {row.count === 1 ? 'entry' : 'entries'}
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3 font-mono text-emerald-400 font-medium">
                    {row.totalDisplay}
                  </td>

                  {/* Share bar */}
                  <td className="px-4 py-3 w-40">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-800 rounded-full h-1.5">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-10 text-right">{pct}%</span>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer total */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-3 flex justify-between items-center">
        <span className="text-sm text-gray-400">Grand Total</span>
        <span className="font-mono font-semibold text-emerald-400">
          ₹{(grandTotal / 100).toFixed(2)}
        </span>
      </div>

    </div>
  );
}