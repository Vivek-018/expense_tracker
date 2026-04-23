import { ExpenseDTO } from "@/types/expense";
import { Spinner } from "./ui/Spinner";
import { EmptyState } from "./ui/EmptyState";

export function ExpenseTable({
  expenses,
  loading,
  error,
}: {
  expenses: ExpenseDTO[];
  loading: boolean;
  error: string | null;
}) {
  if (loading) return <Spinner />;
  if (error) return <p className="text-red-400 text-center py-8">{error}</p>;
  if (!expenses.length) return <EmptyState />;

  return (
    <div className="rounded-xl border border-gray-800 overflow-hidden flex flex-col h-full">
      {/* Sticky header — never scrolls */}
      <table className="w-full text-sm shrink-0">
        <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
          <tr>
            {["Date", "Category", "Description", "Amount"].map((h) => (
              <th key={h} className="px-4 py-3 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
      </table>

      {/* Scrollable body only */}
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-800">
            {expenses.map((e) => (
              <tr
                key={e._id}
                className="bg-gray-950 hover:bg-gray-900 transition-colors"
              >
                <td className="px-4 py-3 text-gray-400">{e.date}</td>
                <td className="px-4 py-3">
                  <span className="bg-gray-800 px-2 py-0.5 rounded-full text-xs">
                    {e.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-200">{e.description}</td>
                <td className="px-4 py-3 font-mono text-emerald-400 font-medium">
                  {e.amountDisplay}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
