import { fetchNormie, fetchPersonaPreview, fetchNormies, FACTION_COLORS, RARITY_ORDER } from '@/lib/api';
import PixelCanvas from '@/components/PixelCanvas';
import AIPersonaTerminal from '@/components/AIPersonaTerminal';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

const RARITY_COLORS: Record<string, string> = {
  Common: '#888', Uncommon: '#4ade80', Rare: '#60a5fa', Epic: '#c084fc', Legendary: '#fbbf24',
};

// Pre-render all normie pages at build time
export async function generateStaticParams() {
  const normies = await fetchNormies();
  return normies.map((n) => ({ id: n.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const normie = await fetchNormie(params.id);
  if (!normie) return { title: 'Normie Not Found' };
  return {
    title: `${normie.name} — NormiesVerse`,
    description: normie.description,
  };
}

export default async function NormieDetailPage({ params }: { params: { id: string } }) {
  const normie = await fetchNormie(params.id);
  if (!normie) notFound();

  const persona = await fetchPersonaPreview(params.id);
  const factionColor = FACTION_COLORS[normie.faction] ?? '#ff0080';
  const rarityColor = RARITY_COLORS[normie.rarity] ?? '#888';
  const rarityIndex = RARITY_ORDER.indexOf(normie.rarity);

  return (
    <div className="container mx-auto min-h-screen px-4 py-8 relative">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none -z-10 opacity-30" style={{ backgroundColor: factionColor }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none -z-10 opacity-20" style={{ backgroundColor: rarityColor }} />

      {/* Back Button */}
      <div className="mb-8 flex items-center gap-3">
        <Link href="/explore">
          <Button variant="ghost" className="gap-2 text-white hover:bg-white/10 hover:text-primary transition-colors backdrop-blur-md rounded-full px-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Grid
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <span className="rounded-full border px-3 py-1 text-xs font-bold" style={{ color: factionColor, borderColor: `${factionColor}50`, backgroundColor: `${factionColor}15` }}>
            {normie.faction}
          </span>
          <span className="rounded-full border px-3 py-1 text-xs font-bold" style={{ color: rarityColor, borderColor: `${rarityColor}50`, backgroundColor: `${rarityColor}15` }}>
            {'★'.repeat(rarityIndex + 1)} {normie.rarity}
          </span>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          <PixelCanvas imageUrl={normie.imageUrl} alt={normie.name} />

          {/* Biometric Data Card */}
          <Card className="border-white/10 bg-black/40 backdrop-blur-xl rounded-2xl overflow-hidden" style={{ boxShadow: `0 0 30px ${factionColor}20` }}>
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-sm font-bold uppercase tracking-widest" style={{ color: factionColor }}>
                Biometric Data
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              {/* Power Level Bar */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/40">
                    <Zap className="h-3.5 w-3.5" /> Power Level
                  </span>
                  <span className="font-mono text-sm font-bold text-white">{normie.powerLevel}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${normie.powerLevel}%`, backgroundColor: factionColor, boxShadow: `0 0 10px ${factionColor}` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {normie.traits.map((attr) => (
                  <div key={attr.trait_type} className="rounded-xl bg-black/60 border border-white/5 p-3 hover:border-white/20 transition-colors group">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-colors">{attr.trait_type}</p>
                    <p className="mt-1 font-mono text-sm text-white">{attr.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: factionColor }}>
              {normie.faction} Faction
            </p>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-white sm:text-6xl" style={{ textShadow: `0 0 40px ${factionColor}60` }}>
              {normie.name}
            </h1>
            <div className="mt-3 h-1 w-24 rounded-full" style={{ background: `linear-gradient(to right, ${factionColor}, transparent)` }} />
            <p className="mt-5 text-lg text-gray-300 font-light leading-relaxed">{normie.description}</p>
          </div>

          {/* AI Persona Terminal */}
          {persona && <AIPersonaTerminal persona={persona} />}

          {/* Faction Link */}
          <Link
            href={`/factions/${normie.faction.toLowerCase()}`}
            className="flex items-center justify-between rounded-2xl border p-4 transition-all hover:scale-[1.01] group"
            style={{ borderColor: `${factionColor}30`, backgroundColor: `${factionColor}10` }}
          >
            <div>
              <p className="text-xs uppercase tracking-wider text-white/40">Faction Hub</p>
              <p className="mt-0.5 font-bold text-white group-hover:text-primary transition-colors">Explore the {normie.faction} Faction →</p>
            </div>
            <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${factionColor}20` }}>
              <span className="text-lg">⚡</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
