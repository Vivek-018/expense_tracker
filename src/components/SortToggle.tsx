'use client';

interface SortToggleProps {
  value: 'date_desc' | 'date_asc';
  onChange: (value: 'date_desc' | 'date_asc') => void;
}

export function SortToggle({ value, onChange }: SortToggleProps) {
  const isNewestFirst = value === 'date_desc';

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-400">Sort:</label>

      {/* Show current active sort as a label */}
      <span className="text-sm text-emerald-400 font-medium">
        {isNewestFirst ? '↓ Newest First' : '↑ Oldest First'}
      </span>

      {/* Button describes the next action (what clicking will DO) */}
      <button
        onClick={() => onChange(isNewestFirst ? 'date_asc' : 'date_desc')}
        className="bg-gray-800 border border-gray-700 hover:border-emerald-500 rounded-lg px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 transition-colors"
      >
        Switch to {isNewestFirst ? 'Oldest First' : 'Newest First'}
      </button>
    </div>
  );
}