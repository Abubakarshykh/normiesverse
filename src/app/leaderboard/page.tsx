import { getServerNormies } from '@/lib/data';
import { FACTION_COLORS } from '@/lib/api';
import Link from 'next/link';
import { Trophy, Zap } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leaderboard — NormiesVerse',
  description: 'Top 50 most powerful Normies in the NormiesVerse.',
};

const RARITY_COLORS: Record<string, string> = {
  Common: '#888', Uncommon: '#4ade80', Rare: '#60a5fa', Epic: '#c084fc', Legendary: '#fbbf24',
};

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function LeaderboardPage() {
  const normies = getServerNormies();
  const ranked = [...normies].sort((a, b) => b.powerLevel - a.powerLevel).slice(0, 50);

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-8 w-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
          <h1 className="text-4xl font-black uppercase tracking-tight text-white">
            Leaderboard
          </h1>
        </div>
        <p className="text-muted-foreground">The top 50 most powerful Normies across all factions.</p>
      </div>

      {/* Top 3 Podium */}
      <div className="mb-10 grid grid-cols-3 gap-4">
        {ranked.slice(0, 3).map((n, i) => {
          const color = FACTION_COLORS[n.faction] ?? '#ff0080';
          return (
            <Link key={n.id} href={`/normie/${n.id}`} className={i === 0 ? 'order-2' : i === 1 ? 'order-1' : 'order-3'}>
              <div
                className="group relative overflow-hidden rounded-2xl border p-5 text-center transition-all hover:scale-[1.02]"
                style={{ borderColor: `${color}40`, backgroundColor: `${color}10` }}
              >
                <div className="text-3xl mb-2">{MEDAL[i + 1]}</div>
                <div className="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full border-2" style={{ borderColor: color }}>
                  <img src={n.imageUrl} alt={n.name} className="h-full w-full object-contain [image-rendering:pixelated]" />
                </div>
                <p className="font-black text-white text-sm uppercase tracking-wide">{n.name}</p>
                <p className="text-xs mt-1" style={{ color }}>{n.faction}</p>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-yellow-400" />
                  <span className="font-mono font-bold text-yellow-400">{n.powerLevel}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Full Rankings Table */}
      <div className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md overflow-hidden">
        <div className="grid grid-cols-[3rem_1fr_auto_auto_auto] gap-0 border-b border-white/5 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white/30">
          <span>#</span>
          <span>Normie</span>
          <span className="text-center">Faction</span>
          <span className="text-center">Rarity</span>
          <span className="text-right">Power</span>
        </div>
        {ranked.map((n, i) => {
          const color = FACTION_COLORS[n.faction] ?? '#ff0080';
          const rarityColor = RARITY_COLORS[n.rarity] ?? '#888';
          return (
            <Link key={n.id} href={`/normie/${n.id}`}>
              <div className="group grid grid-cols-[3rem_1fr_auto_auto_auto] items-center gap-0 border-b border-white/5 px-4 py-3 transition-colors hover:bg-white/5">
                <span className="font-mono text-sm text-white/30">{MEDAL[i + 1] ?? i + 1}</span>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full" style={{ border: `1.5px solid ${color}50` }}>
                    <img src={n.imageUrl} alt={n.name} className="h-full w-full object-contain [image-rendering:pixelated]" />
                  </div>
                  <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{n.name}</span>
                </div>
                <span className="text-center text-xs font-bold px-4" style={{ color }}>{n.faction}</span>
                <span className="text-center text-xs font-bold px-4" style={{ color: rarityColor }}>{n.rarity}</span>
                <div className="flex items-center justify-end gap-1">
                  <Zap className="h-3 w-3 text-yellow-400" />
                  <span className="font-mono text-sm font-bold text-white">{n.powerLevel}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
