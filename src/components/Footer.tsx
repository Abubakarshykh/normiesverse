'use client';
import { Hexagon, X, Code2, MessageCircle, Camera, Share2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import normiesData from '../../public/data/normies.json';
import pkg from '../../package.json';
import { FACTION_COLORS, RARITY_ORDER } from '@/lib/api';
import type { Normie } from '@/lib/api';

const normies = normiesData as Normie[];

// Compute stats at build time
const totalNormies = normies.length;
const factions = [...new Set(normies.map((n) => n.faction))];
const rarestNormie = normies.reduce((prev, cur) =>
  RARITY_ORDER.indexOf(cur.rarity) > RARITY_ORDER.indexOf(prev.rarity) ? cur : prev
);

const exploreLinks = [
  { name: 'Explore', href: '/explore' },
  { name: 'Analytics', href: '/analytics' },
  { name: 'Leaderboard', href: '/leaderboard', badge: 'Top 50' },
  { name: 'Random Normie', href: '/random', badge: 'Try it' },
  { name: 'Factions Hub', href: '/factions' },
];

const communityLinks = [
  { name: 'Discord Server', href: '#', external: true },
  { name: 'Twitter / X', href: '#', external: true },
  { name: 'Submit a Bug', href: '#', external: true },
  { name: 'Changelog', href: '#', badge: 'New', external: false },
  { name: 'About & Lore', href: '#', external: false },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-primary/20 bg-black/80 backdrop-blur-xl">
      {/* Top glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      {/* Newsletter Strip */}
      <div className="border-b border-white/5 bg-primary/5">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-5 sm:flex-row">
          <div>
            <p className="font-bold text-white">Stay in the loop</p>
            <p className="text-sm text-muted-foreground">New Normies, faction drops, and lore updates.</p>
          </div>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="h-9 w-56 rounded-full bg-white/10 px-4 text-sm text-white placeholder:text-white/30 outline-none border border-white/10 focus:border-primary/50 transition-colors"
            />
            <button
              type="submit"
              className="h-9 rounded-full bg-primary px-5 text-sm font-bold text-black hover:bg-primary/80 transition-colors shadow-[0_0_20px_rgba(255,0,128,0.4)]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main 4-Column Grid */}
      <div className="container mx-auto grid grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand Column */}
        <div className="flex flex-col gap-5">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 group-hover:bg-primary/40 transition-colors">
              <Hexagon className="h-5 w-5 text-primary drop-shadow-[0_0_8px_rgba(255,0,128,1)]" />
            </div>
            <span className="text-lg font-black uppercase tracking-widest text-white">
              Normies<span className="text-primary">Verse</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Explore {totalNormies} unique Normies across {factions.length} factions in the Normiesverse.
          </p>

          {/* Live Stat Pills */}
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {totalNormies} Normies
            </span>
            <span className="rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">
              {factions.length} Factions
            </span>
            <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-400">
              ★ {rarestNormie.name}
            </span>
          </div>

          {/* Social Icons */}
          <div className="flex gap-2">
            {[
              { Icon: X, label: 'Twitter / X' },
              { Icon: MessageCircle, label: 'Discord' },
              { Icon: Camera, label: 'Instagram' },
              { Icon: Code2, label: 'GitHub' },
              { Icon: Share2, label: 'Share' },
            ].map(({ Icon, label }) => (
              <button
                key={label}
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-muted-foreground hover:border-primary/50 hover:text-primary hover:shadow-[0_0_10px_rgba(255,0,128,0.3)] transition-all"
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Factions Column */}
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">Factions</h3>
          <ul className="flex flex-col gap-2.5">
            {factions.map((faction) => (
              <li key={faction}>
                <Link
                  href={`/factions/${faction.toLowerCase()}`}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-white transition-colors group"
                >
                  <span
                    className="h-2 w-2 rounded-full shrink-0 group-hover:shadow-[0_0_6px_var(--faction-color)] transition-shadow"
                    style={{ backgroundColor: FACTION_COLORS[faction] ?? '#888', ['--faction-color' as string]: FACTION_COLORS[faction] }}
                  />
                  {faction}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Explore Column */}
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">Explore</h3>
          <ul className="flex flex-col gap-2.5">
            {exploreLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  {link.name}
                  {link.badge && (
                    <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[9px] font-bold text-primary border border-primary/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Community Column */}
        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">Community</h3>
          <ul className="flex flex-col gap-2.5">
            {communityLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  {link.name}
                  {link.external && <ExternalLink className="h-3 w-3 opacity-40" />}
                  {link.badge && (
                    <span className="rounded-full bg-green-500/20 px-1.5 py-0.5 text-[9px] font-bold text-green-400 border border-green-500/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-2">
            <span className="text-[10px] text-muted-foreground">Data source:</span>
            <code className="text-[10px] font-mono text-primary/80">normies.json</code>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-6 py-4 text-xs text-muted-foreground sm:flex-row">
          {/* Copyright */}
          <p>
            &copy; {new Date().getFullYear()}{' '}
            <span className="text-primary/70">NormiesVerse</span>. Built with Next.js.
          </p>

          {/* Version Badge */}
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
            </span>
            <span className="font-mono text-[10px] text-green-400">v{pkg.version}</span>
          </div>

          {/* Data Source + Normie Count */}
          <div className="flex items-center gap-3">
            <code className="font-mono text-[10px] text-white/30">normies.json</code>
            <span className="text-white/20">·</span>
            <span className="text-[10px] text-white/30">{totalNormies} records</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
