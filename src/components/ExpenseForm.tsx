'use client';
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Health', 'Entertainment', 'Shopping', 'Other'];

//backend Zod schema exactly validation
const AMOUNT_MAX      = 10_000_000;
const DESCRIPTION_MAX = 500;

export function ExpenseForm({ onSuccess }: { onSuccess: () => void }) {
  const clientId = useRef(uuidv4());
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState<string | null>(null);

  const [fields, setFields] = useState({
    amount: '', category: 'Food', description: '',
    date: new Date().toISOString().split('T')[0],
  });

  function resetClientId() { clientId.current = uuidv4(); }

  async function handleSubmit() {
    setFormError(null);
    const amount = parseFloat(fields.amount);
    if (!fields.amount || isNaN(amount) || amount <= 0) {
      return setFormError('Enter a valid positive amount');
    }
    //amount max check
    if (amount > AMOUNT_MAX) {
      return setFormError(`Amount cannot exceed ₹${AMOUNT_MAX.toLocaleString('en-IN')}`);
    }
    if (!fields.description.trim()) return setFormError('Description is required');
    // description max check
    if (fields.description.length > DESCRIPTION_MAX) {
      return setFormError(`Description cannot exceed ${DESCRIPTION_MAX} characters`);
    }
    if (!fields.date) return setFormError('Date is required');
    if (fields.date > new Date().toISOString().split('T')[0]) {
      return setFormError('Future dates are not allowed');
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, amount, clientId: clientId.current }),
      });
      const json = await res.json();
      if (!res.ok && res.status !== 200) throw new Error(json.error || 'Failed');
      setFields({ amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0] });
      resetClientId();
      onSuccess();
    } catch (e: any) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  // live character count derived value
  const descLength = fields.description.length;
  const descOver   = descLength > DESCRIPTION_MAX;

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
      <h2 className="text-lg font-semibold">Add Expense</h2>
      {formError && <p className="text-red-400 text-sm">{formError}</p>}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number" placeholder={`Amount ₹ (max ${AMOUNT_MAX.toLocaleString('en-IN')})`} min="0.01" step="0.01" max={AMOUNT_MAX}
          value={fields.amount}
          onChange={e => setFields(f => ({ ...f, amount: e.target.value }))}
          className="col-span-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <select
          value={fields.category}
          onChange={e => setFields(f => ({ ...f, category: e.target.value }))}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>

        <div className="col-span-2 space-y-1">
          <input
            type="text" placeholder="Description"
            value={fields.description}
            onChange={e => setFields(f => ({ ...f, description: e.target.value }))}
            className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors
              ${descOver
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-700 focus:ring-emerald-500'
              }`}
          />
          <p className={`text-xs text-right ${descOver ? 'text-red-400' : 'text-gray-500'}`}>
            {descLength} / {DESCRIPTION_MAX}
          </p>
        </div>

        <input
          type="date"
          value={fields.date}
          max= {new Date().toISOString().split('T')[0]}
          onChange={e => setFields(f => ({ ...f, date: e.target.value }))}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={submitting || descOver}
        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-colors"
      >
        {submitting ? 'Saving...' : 'Add Expense'}
      </button>
    </div>
  );
}