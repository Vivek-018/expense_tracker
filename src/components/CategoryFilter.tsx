'use client';

interface CategoryFilterProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export function CategoryFilter({ value, options, onChange }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-400">Filter by:</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>
            {opt === 'all' ? 'All Categories' : opt}
          </option>
        ))}
      </select>
    </div>
  );
}