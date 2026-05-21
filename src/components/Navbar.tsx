'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Hexagon, LayoutGrid, BarChart3, Layers, Trophy, Search } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '@/lib/store';

export default function Navbar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const { setSearchQuery } = useAppStore();

  const navLinks = [
    { name: 'Explore', href: '/explore', icon: LayoutGrid },
    { name: 'Factions', href: '/factions', icon: Layers },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy, badge: 'Top 50' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 right-0 top-0 z-50 flex justify-center p-4"
    >
      <nav className="flex items-center gap-4 rounded-full border border-primary/20 bg-black/50 px-5 py-2.5 backdrop-blur-xl shadow-[0_4px_40px_rgba(0,0,0,0.6)]">
        {/* Logo */}
        <Link href="/" className="mr-2 flex items-center gap-2 group shrink-0">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 group-hover:bg-primary/40 transition-colors">
            <Hexagon className="h-5 w-5 text-primary drop-shadow-[0_0_8px_rgba(255,0,128,1)]" />
          </div>
          <span className="font-black uppercase tracking-widest text-white text-sm">
            Normies<span className="text-primary">Verse</span>
          </span>
        </Link>

        <div className="h-5 w-px bg-white/10" />

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            const Icon = link.icon;
            return (
              <Link key={link.name} href={link.href} className="relative px-3 py-1.5">
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-primary/20 border border-primary/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={`relative flex items-center gap-1.5 text-xs font-semibold transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {link.name}
                  {link.badge && (
                    <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[9px] font-bold text-primary border border-primary/30">
                      {link.badge}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="h-5 w-px bg-white/10" />

        {/* Search Toggle */}
        <div className="flex items-center">
          {searchOpen ? (
            <motion.input
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 140, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              type="text"
              placeholder="Search normies..."
              autoFocus
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => setSearchOpen(false)}
              className="h-7 rounded-full bg-white/10 px-3 text-xs text-white placeholder:text-white/40 outline-none border border-primary/30 focus:border-primary/60"
            />
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
