import { CategorySummaryTable } from '@/components/CategorySummaryTable';

export default function AnalyticsPage() {
  return (
    <>
      <p className="shrink-0 text-gray-400 text-sm mb-6">
        Breakdown of all expenses by category.
      </p>
      <div className="flex-1 min-h-0">
        <CategorySummaryTable />
      </div>
    </>
  );
}