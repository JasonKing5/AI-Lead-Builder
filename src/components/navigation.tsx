'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Add Lead', href: '/' },
  { name: 'View Leads', href: '/leads' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden sm:flex items-center space-x-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
