'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Hexagon, LayoutGrid, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/', icon: Hexagon },
    { name: 'Explore', href: '/explore', icon: LayoutGrid },
    { name: 'Analytics', href: '/analytics', icon: Sparkles },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 right-0 top-0 z-50 flex justify-center p-4"
    >
      <nav className="flex items-center gap-6 rounded-full border border-primary/20 bg-black/40 px-6 py-3 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <Link href="/" className="mr-4 flex items-center gap-2 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 group-hover:bg-primary/40 transition-colors">
            <Hexagon className="h-5 w-5 text-primary drop-shadow-[0_0_8px_rgba(255,0,128,1)]" />
          </div>
          <span className="font-black uppercase tracking-widest text-white">
            N<span className="text-primary">V</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
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
                <span className={`relative flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}>
                  <Icon className="h-4 w-4" />
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </motion.header>
  );
}
