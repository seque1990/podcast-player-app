'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { Home, Search, Library } from 'lucide-react'
import { usePathname } from 'next/navigation';

type LayoutProps = {
  children: React.ReactNode;
};

export default function PodcastLayout({ children }: LayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-900 p-5 hidden md:block">
        <div className="space-y-6">
          <Link href="/player">
            <Button variant="ghost" className={`w-full justify-start text-lg font-semibold ${pathname === '/player' ? 'bg-gray-800' : ''}`}>
              <Home className="mr-2 h-5 w-5" /> Home
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start text-lg font-semibold">
            <Search className="mr-2 h-5 w-5" /> Search
          </Button>
          <Button variant="ghost" className="w-full justify-start text-lg font-semibold">
            <Library className="mr-2 h-5 w-5" /> Your Library
          </Button>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}