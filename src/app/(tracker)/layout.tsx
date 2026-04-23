import Link from 'next/link';
import { NavLinks } from '@/components/ui/NavLinks';

export default function TrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col max-w-4xl mx-auto w-full px-4 py-8">

      <nav className="shrink-0 flex items-center justify-between mb-8">
        <Link href="/" className="text-2xl font-bold text-white hover:text-emerald-400 transition-colors">
          💸 Expense Tracker
        </Link>
        <NavLinks />
      </nav>

      <div className="flex flex-col flex-1 min-h-0">
        {children}
      </div>

    </div>
  );
}