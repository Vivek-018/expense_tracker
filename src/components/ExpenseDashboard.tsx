"use client";
import { useState, useEffect, useCallback } from "react";
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseTable } from "./ExpenseTable";
import { CategoryFilter } from "./CategoryFilter";
import { SortToggle } from "./SortToggle";
import { ExpenseDTO } from "@/types/expense";

export function ExpenseDashboard() {
  const [expenses, setExpenses] = useState<ExpenseDTO[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]); // ← separate, never filtered
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<"date_desc" | "date_asc">("date_desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Runs once on mount — fetches ALL expenses just to build category list
  useEffect(() => {
    fetch("/api/expenses")
      .then((res) => res.json())
      .then((json) => {
        const cats = Array.from(
          new Set((json.data as ExpenseDTO[]).map((e) => e.category)),
        );
        setAllCategories(cats);
      })
      .catch(() => {}); // silent fail — filter still works with empty list
  }, []);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ sort });
      if (category !== "all") params.set("category", category);

      const res = await fetch(`/api/expenses?${params}`);
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      setExpenses(json.data);

      // Also keep allCategories updated when new expenses are added
      setAllCategories((prev) => {
        const incoming = (json.data as ExpenseDTO[]).map((e) => e.category);
        const merged = Array.from(new Set([...prev, ...incoming]));
        return merged;
      });
    } catch {
      setError("Could not load expenses. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [category, sort]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const totalPaise = expenses.reduce((sum, e) => sum + e.amountPaise, 0);
  const totalDisplay = `₹${(totalPaise / 100).toFixed(2)}`;

  return (
    <div className="flex flex-col flex-1 min-h-0 space-y-6">
      {/* Top section — fixed, never scrolls */}
      <div className="shrink-0">
        <ExpenseForm onSuccess={fetchExpenses} />
      </div>

      {/* Controls row — fixed, never scrolls */}
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CategoryFilter
            value={category}
            options={["all", ...allCategories]}
            onChange={setCategory}
          />
          <SortToggle value={sort} onChange={setSort} />
        </div>
        <span className="text-lg font-semibold text-emerald-400">
          Total: {totalDisplay}
        </span>
      </div>

      {/* Table — this section scrolls */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <ExpenseTable expenses={expenses} loading={loading} error={error} />
      </div>
    </div>
  );
}
