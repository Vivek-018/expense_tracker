'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/',          label: 'Dashboard' },
  { href: '/analytics', label: '📊 Analytics' },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-3">
      {links.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`text-sm px-4 py-2 rounded-lg border transition-colors
              ${isActive
                ? 'text-emerald-400 border-emerald-500 bg-emerald-500/10'
                : 'text-gray-400 border-gray-700 hover:text-emerald-400 hover:border-emerald-500'
              }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}