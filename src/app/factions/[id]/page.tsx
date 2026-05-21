import { getServerNormies, getServerNormiesByFaction, getServerFactions } from '@/lib/data';
import { FACTION_COLORS, RARITY_ORDER } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Zap, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Metadata } from 'next';

export function generateStaticParams() {
  const factions = getServerFactions();
  return factions.map((f) => ({ id: f.toLowerCase() }));
}

const FACTION_LORE: Record<string, { tagline: string; lore: string; emoji: string; traits: string[] }> = {
  cyber:  { emoji: '🤖', tagline: 'Data is power. Power is everything.', lore: 'Born from the city\'s neural backbone, Cyber Normies are hackers, brokers, and ghosts of the grid. They trade in data and speak in cipher. To them, every system is a lock, and every lock is an invitation.', traits: ['Hacking', 'Stealth', 'Data Mining', 'Encryption'] },
  retro:  { emoji: '🕹️', tagline: 'The past is the only truth.', lore: 'Keepers of the old code. Retro Normies believe that golden-era tech holds secrets the modern world has forgotten. They preserve, they restore, they remember. And what they remember could change everything.', traits: ['Preservation', 'Nostalgia', 'Pattern Recognition', 'Analog Skills'] },
  void:   { emoji: '🌑', tagline: 'Nothing is everything.', lore: 'Entities of the null space, dwelling in deleted data and dead links. The Void faction is feared, misunderstood, and ancient beyond measure. They do not destroy — they absorb. And nothing absorbed by the Void ever truly returns.', traits: ['Phase Shift', 'Data Absorption', 'Void Walk', 'Null Field'] },
  solar:  { emoji: '☀️', tagline: 'Energy cannot be destroyed.', lore: 'Radiant beings fueled by photonic consciousness. The Solar faction controls energy networks and beams optimism at everything in range. They are powerful, abundant, and blindingly sincere. Never underestimate the power of a sunny disposition backed by 3.8×10²⁶ watts.', traits: ['Photon Burst', 'Energy Harvest', 'Radiant Aura', 'Solar Flare'] },
  glitch: { emoji: '⚡', tagline: 'The error is the art.', lore: 'Corruption given sentience. Glitch Normies bend reality through buffer overflows and temporal paradoxes. Their power is not destructive — it is transformative. They do not break systems. They reveal what was always broken, and make it beautiful.', traits: ['Reality Bend', 'Corruption Pulse', 'Temporal Slip', 'Error Cascade'] },
  neon:   { emoji: '🌈', tagline: 'Color is the language of the grid.', lore: 'Masters of light, sound, and influence. The Neon faction controls the city\'s culture through art, music, and illuminated signage. They don\'t fight with weapons — they fight with aesthetics. And in the NormiesVerse, nothing is more powerful than being unforgettable.', traits: ['Chromatic Blast', 'Neon Pulse', 'Synesthetic Link', 'Aurora Field'] },
};

const RARITY_COLORS: Record<string, string> = {
  Common: '#888', Uncommon: '#4ade80', Rare: '#60a5fa', Epic: '#c084fc', Legendary: '#fbbf24',
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const lore = FACTION_LORE[id.toLowerCase()];
  const name = id.charAt(0).toUpperCase() + id.slice(1);
  return {
    title: `${name} Faction — NormiesVerse`,
    description: lore?.lore?.slice(0, 120) ?? `Explore the ${name} faction.`,
  };
}

export default async function FactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const factionKey = id.toLowerCase();
  const factionName = factionKey.charAt(0).toUpperCase() + factionKey.slice(1);
  const members = getServerNormiesByFaction(factionName);

  if (members.length === 0) notFound();

  const lore = FACTION_LORE[factionKey];
  const color = FACTION_COLORS[factionName] ?? '#ff0080';
  const avgPower = Math.round(members.reduce((s, n) => s + n.powerLevel, 0) / members.length);
  const topNormie = members.reduce((p, c) => c.powerLevel > p.powerLevel ? c : p);
  const rarestMember = members.reduce((p, c) =>
    RARITY_ORDER.indexOf(c.rarity) > RARITY_ORDER.indexOf(p.rarity) ? c : p
  );

  const rarityCounts = RARITY_ORDER.map((r) => ({
    label: r,
    count: members.filter((n) => n.rarity === r).length,
    color: RARITY_COLORS[r],
  })).filter((r) => r.count > 0);

  return (
    <div className="container mx-auto min-h-screen px-4 py-8 relative">
      {/* Ambient glow */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none -z-10 opacity-10" style={{ backgroundColor: color }} />

      {/* Back */}
      <div className="mb-8">
        <Link href="/factions">
          <Button variant="ghost" className="gap-2 text-white hover:bg-white/10 rounded-full px-5">
            <ArrowLeft className="h-4 w-4" /> All Factions
          </Button>
        </Link>
      </div>

      {/* Hero */}
      <div className="mb-14 relative overflow-hidden rounded-3xl border p-10" style={{ borderColor: `${color}30`, background: `linear-gradient(135deg, ${color}10 0%, transparent 60%)` }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${color}20, transparent 50%)` }} />
        <div className="relative z-10 max-w-2xl">
          <span className="text-5xl">{lore?.emoji}</span>
          <h1 className="mt-3 text-6xl font-black uppercase tracking-tighter text-white" style={{ textShadow: `0 0 40px ${color}80` }}>
            {factionName}
          </h1>
          <p className="mt-1 text-lg font-medium italic" style={{ color }}>{lore?.tagline}</p>
          <p className="mt-5 text-base text-gray-300 leading-relaxed">{lore?.lore}</p>

          {/* Faction Traits */}
          {lore?.traits && (
            <div className="mt-6 flex flex-wrap gap-2">
              {lore.traits.map((t) => (
                <span key={t} className="rounded-full border px-3 py-1 text-xs font-bold" style={{ color, borderColor: `${color}40`, backgroundColor: `${color}15` }}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Members', value: members.length, icon: Users },
          { label: 'Avg Power', value: avgPower, icon: Zap },
          { label: 'Top Agent', value: topNormie.name.split('#')[1] ? `#${topNormie.name.split('#')[1]}` : topNormie.name, icon: Star },
          { label: 'Rarest', value: rarestMember.rarity, icon: Star },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="border-white/5 bg-black/40 backdrop-blur-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-3.5 w-3.5" style={{ color }} />
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
                </div>
                <p className="text-xl font-black text-white">{s.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Rarity Breakdown */}
      <div className="mb-10">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color }}>Rarity Breakdown</h2>
        <div className="flex flex-wrap gap-3">
          {rarityCounts.map((r) => (
            <div key={r.label} className="flex items-center gap-2 rounded-full border px-4 py-1.5" style={{ borderColor: `${r.color}30`, backgroundColor: `${r.color}10` }}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
              <span className="text-sm font-bold" style={{ color: r.color }}>{r.label}</span>
              <span className="text-xs text-muted-foreground">×{r.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Member Grid */}
      <div>
        <h2 className="mb-6 text-2xl font-black uppercase tracking-wider text-white">
          All <span style={{ color }}>{factionName}</span> Members
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {members.map((m) => (
            <Link key={m.id} href={`/normie/${m.id}`}>
              <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-black/40 p-3 transition-all duration-300 hover:border-opacity-50 hover:scale-[1.03]" style={{ '--hc': color } as React.CSSProperties}>
                <div className="relative aspect-square overflow-hidden rounded-xl mb-3" style={{ background: `linear-gradient(135deg, ${color}15, transparent)` }}>
                  <img src={m.imageUrl} alt={m.name} className="h-full w-full object-contain [image-rendering:pixelated] transition-transform duration-300 group-hover:scale-110" />
                </div>
                <p className="text-xs font-black uppercase tracking-wider text-white truncate">{m.name}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[10px] font-bold" style={{ color: RARITY_COLORS[m.rarity] }}>{m.rarity}</span>
                  <span className="text-[10px] font-mono text-white/40">⚡{m.powerLevel}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
