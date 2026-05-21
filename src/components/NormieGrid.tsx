'use client';

import { useAppStore } from '@/lib/store';
import { useEffect, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from 'use-debounce';
import { FACTION_COLORS, RARITY_ORDER } from '@/lib/api';
import type { Normie } from '@/lib/api';

const RARITY_COLORS: Record<string, string> = {
  Common: '#888',
  Uncommon: '#4ade80',
  Rare: '#60a5fa',
  Epic: '#c084fc',
  Legendary: '#fbbf24',
};

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md overflow-hidden animate-pulse">
      <div className="aspect-square bg-white/5" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-2/3 rounded-lg bg-white/10" />
        <div className="h-3 w-full rounded-lg bg-white/5" />
        <div className="h-3 w-4/5 rounded-lg bg-white/5" />
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-16 rounded-full bg-white/10" />
          <div className="h-5 w-12 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

function TiltCard({ normie, index }: { normie: Normie; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);

  const factionColor = FACTION_COLORS[normie.faction] ?? '#ff0080';
  const rarityColor = RARITY_COLORS[normie.rarity] ?? '#888';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <Link href={`/normie/${normie.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, type: 'spring', stiffness: 100 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="group perspective-1000"
      >
        <Card className="relative overflow-hidden rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(255,0,128,0.3)]">
          {/* Animated Neon Border */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none">
            <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#ff0080_360deg)] animate-[spin_4s_linear_infinite]" />
            <div className="absolute inset-[2px] bg-black/80 rounded-2xl backdrop-blur-sm" />
          </div>

          <div className="relative z-10 p-1">
            <CardHeader className="p-0">
              <div className="relative aspect-square overflow-hidden rounded-t-xl p-4" style={{ background: `linear-gradient(135deg, ${factionColor}15, transparent)` }}>
                <motion.div
                  className="absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    x: useTransform(mouseXSpring, [-0.5, 0.5], ['-100%', '100%']),
                    y: useTransform(mouseYSpring, [-0.5, 0.5], ['-100%', '100%']),
                  }}
                />
                <img
                  src={normie.imageUrl}
                  alt={normie.name}
                  className="h-full w-full object-contain [image-rendering:pixelated] transition-transform duration-500 group-hover:scale-110"
                  style={{ filter: `drop-shadow(0 0 15px ${factionColor}80)` }}
                />
                {/* Scanning Laser */}
                <div className="absolute left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 top-0 group-hover:animate-scan" style={{ backgroundColor: factionColor, boxShadow: `0 0 8px ${factionColor}` }} />
                {/* Rarity Badge */}
                <div className="absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold border" style={{ color: rarityColor, borderColor: `${rarityColor}50`, backgroundColor: `${rarityColor}15` }}>
                  {normie.rarity}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-black uppercase tracking-wider text-white group-hover:text-primary transition-colors leading-tight">
                  {normie.name}
                </h3>
                <span className="shrink-0 text-xs font-bold text-white/40 font-mono">⚡{normie.powerLevel}</span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-xs text-gray-400 font-light leading-relaxed">{normie.description}</p>
            </CardContent>

            <CardFooter className="flex flex-wrap gap-1.5 p-5 pt-0">
              <Badge variant="secondary" className="text-[10px] border" style={{ color: factionColor, borderColor: `${factionColor}40`, backgroundColor: `${factionColor}15` }}>
                {normie.faction}
              </Badge>
              {normie.traits.filter(t => t.trait_type !== 'Faction').slice(0, 2).map((attr) => (
                <Badge key={attr.trait_type} variant="secondary" className="text-[10px] bg-white/5 text-white/50 border border-white/10">
                  {attr.value}
                </Badge>
              ))}
            </CardFooter>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}

export default function NormieGrid() {
  const { normies, isLoading, searchQuery, selectedFaction, selectedRarity, sortBy, loadNormies } = useAppStore();
  const [debouncedSearch] = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (normies.length === 0) loadNormies();
  }, [normies.length, loadNormies]);

  const filteredNormies = useMemo(() => {
    let result = normies.filter((n) => {
      const matchesSearch = n.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        n.faction.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesFaction = selectedFaction ? n.faction === selectedFaction : true;
      const matchesRarity = selectedRarity ? n.rarity === selectedRarity : true;
      return matchesSearch && matchesFaction && matchesRarity;
    });

    if (sortBy === 'powerLevel') result = [...result].sort((a, b) => b.powerLevel - a.powerLevel);
    else if (sortBy === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'rarity') result = [...result].sort((a, b) => RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity));

    return result;
  }, [normies, debouncedSearch, selectedFaction, selectedRarity, sortBy]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (filteredNormies.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-muted-foreground border border-dashed border-white/10 rounded-2xl bg-black/20">
        <p className="text-4xl">👾</p>
        <p className="mt-3 text-lg">No Normies detected in this sector.</p>
        <p className="text-sm opacity-50">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-xs text-muted-foreground">{filteredNormies.length} Normies found</p>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredNormies.map((normie, index) => (
          <TiltCard key={normie.id} normie={normie} index={index} />
        ))}
      </div>
    </div>
  );
}
