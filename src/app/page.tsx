import { ExpenseDashboard } from "@/components/ExpenseDashboard";

export default function Home() {
  return (
    <main className="h-screen flex flex-col px-4 py-8 max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-white mb-8 shrink-0">
        💸 Expense Tracker
      </h1>
      <ExpenseDashboard />
    </main>
  );
}
