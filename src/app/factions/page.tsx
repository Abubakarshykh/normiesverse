import { getServerNormies, getServerFactions } from '@/lib/data';
import { FACTION_COLORS } from '@/lib/api';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Factions — NormiesVerse',
  description: 'Explore all factions in the NormiesVerse universe.',
};

const FACTION_LORE: Record<string, { tagline: string; lore: string; emoji: string }> = {
  Cyber:  { emoji: '🤖', tagline: 'Data is power. Power is everything.', lore: "Born from the city's neural backbone, Cyber Normies are hackers, brokers, and ghosts of the grid. They trade in data and speak in cipher." },
  Retro:  { emoji: '🕹️', tagline: 'The past is the only truth.', lore: "Keepers of the old code. Retro Normies believe that golden-era tech holds secrets the modern world has forgotten. They're right." },
  Void:   { emoji: '🌑', tagline: 'Nothing is everything.', lore: 'Entities of the null space, dwelling in deleted data and dead links. The Void faction is feared, misunderstood, and ancient.' },
  Solar:  { emoji: '☀️', tagline: 'Energy cannot be destroyed.', lore: 'Radiant beings fueled by photonic consciousness. The Solar faction controls energy networks and beams optimism at everything.' },
  Glitch: { emoji: '⚡', tagline: 'The error is the art.', lore: 'Corruption given sentience. Glitch Normies bend reality through buffer overflows and temporal paradoxes. Creative. Chaotic. Unavoidable.' },
  Neon:   { emoji: '🌈', tagline: 'Color is the language of the grid.', lore: "Masters of light, sound, and influence. The Neon faction controls the city's culture through art, music, and illuminated signage." },
};

export default function FactionsPage() {
  const normies = getServerNormies();
  const factionNames = getServerFactions();

  const factions = factionNames.map((name) => {
    const members = normies.filter((n) => n.faction === name);
    const avgPower = Math.round(members.reduce((s, n) => s + n.powerLevel, 0) / members.length);
    return {
      name,
      count: members.length,
      avgPower,
      color: FACTION_COLORS[name] ?? '#888',
      lore: FACTION_LORE[name],
      preview: members.slice(0, 3),
    };
  });

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black uppercase tracking-tight text-white">
          The <span className="text-primary drop-shadow-[0_0_20px_rgba(255,0,128,0.8)]">Factions</span>
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Six factions. Six philosophies. One verse. Choose your allegiance wisely.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {factions.map((faction) => (
          <Link
            key={faction.name}
            href={`/factions/${faction.name.toLowerCase()}`}
            className="group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_var(--faction-shadow)]"
            style={{
              borderColor: `${faction.color}30`,
              backgroundColor: `${faction.color}08`,
              ['--faction-shadow' as string]: `${faction.color}40`,
            }}
          >
            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(circle at top right, ${faction.color}15, transparent 60%)` }}
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-3xl">{faction.lore?.emoji}</span>
                  <h2 className="mt-2 text-2xl font-black uppercase tracking-wider text-white" style={{ textShadow: `0 0 20px ${faction.color}60` }}>
                    {faction.name}
                  </h2>
                  <p className="text-xs italic font-medium" style={{ color: faction.color }}>{faction.lore?.tagline}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black" style={{ color: faction.color }}>{faction.count}</p>
                  <p className="text-xs text-muted-foreground">members</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">{faction.lore?.lore}</p>

              <div className="flex items-center gap-4 mb-5 pt-3 border-t border-white/5">
                <div>
                  <p className="text-xs text-muted-foreground">Avg Power</p>
                  <p className="font-bold text-white">{faction.avgPower}</p>
                </div>
                <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${faction.avgPower}%`, backgroundColor: faction.color }} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {faction.preview.map((m) => (
                    <div key={m.id} className="h-8 w-8 rounded-full border-2 overflow-hidden bg-black" style={{ borderColor: faction.color }}>
                      <img src={m.imageUrl} alt={m.name} className="h-full w-full object-contain [image-rendering:pixelated]" />
                    </div>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-1 group-hover:text-white transition-colors">View all →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
