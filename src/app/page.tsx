import { ExpenseDashboard } from '@/components/ExpenseDashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">💸 Expense Tracker</h1>
      <ExpenseDashboard />
    </main>
  );
}