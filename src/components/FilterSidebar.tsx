'use client';

import { useAppStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, X, Filter, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { FACTION_COLORS, RARITY_ORDER } from '@/lib/api';

const RARITY_COLORS: Record<string, string> = {
  Common: '#888', Uncommon: '#4ade80', Rare: '#60a5fa', Epic: '#c084fc', Legendary: '#fbbf24',
};

const FACTIONS = ['Cyber', 'Retro', 'Neon', 'Void', 'Solar', 'Glitch'];
const SORT_OPTIONS: { label: string; value: 'powerLevel' | 'name' | 'rarity' }[] = [
  { label: '⚡ Power', value: 'powerLevel' },
  { label: 'A-Z Name', value: 'name' },
  { label: '★ Rarity', value: 'rarity' },
];

export default function FilterSidebar() {
  const {
    searchQuery, setSearchQuery,
    selectedFaction, setSelectedFaction,
    selectedRarity, setSelectedRarity,
    sortBy, setSortBy,
  } = useAppStore();

  const hasFilters = searchQuery || selectedFaction || selectedRarity;

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="sticky top-24 flex flex-col gap-6 rounded-2xl border border-primary/30 bg-black/40 p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(255,0,128,0.15)]"
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-primary/20 pb-4">
        <Filter className="h-5 w-5 text-primary drop-shadow-[0_0_8px_rgba(255,0,128,1)]" />
        <h2 className="text-lg font-black uppercase tracking-widest text-white">Filters</h2>
      </div>

      {/* Search */}
      <div>
        <Label className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary/70">Search</Label>
        <div className="relative group">
          <Search className="absolute left-3 top-3 h-4 w-4 text-primary transition-colors group-focus-within:text-white" />
          <Input
            type="text"
            placeholder="Search normies..."
            className="pl-9 border-primary/20 bg-black/50 text-white placeholder:text-muted-foreground focus-visible:ring-primary h-10 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Faction Filter */}
      <div>
        <Label className="mb-3 block text-xs font-bold uppercase tracking-widest text-primary/70">Faction</Label>
        <div className="flex flex-col gap-1.5">
          {FACTIONS.map((faction) => {
            const color = FACTION_COLORS[faction] ?? '#ff0080';
            const isActive = selectedFaction === faction;
            return (
              <button
                key={faction}
                onClick={() => setSelectedFaction(isActive ? null : faction)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all"
                style={{
                  backgroundColor: isActive ? `${color}20` : 'transparent',
                  color: isActive ? color : '#888',
                  border: `1px solid ${isActive ? `${color}50` : 'transparent'}`,
                }}
              >
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                {faction}
                {isActive && <span className="ml-auto text-xs opacity-60">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rarity Filter */}
      <div>
        <Label className="mb-3 block text-xs font-bold uppercase tracking-widest text-primary/70">Rarity</Label>
        <div className="flex flex-col gap-1.5">
          {RARITY_ORDER.map((rarity) => {
            const color = RARITY_COLORS[rarity];
            const isActive = selectedRarity === rarity;
            return (
              <button
                key={rarity}
                onClick={() => setSelectedRarity(isActive ? null : rarity)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all"
                style={{
                  backgroundColor: isActive ? `${color}20` : 'transparent',
                  color: isActive ? color : '#888',
                  border: `1px solid ${isActive ? `${color}50` : 'transparent'}`,
                }}
              >
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                {rarity}
                {isActive && <span className="ml-auto text-xs opacity-60">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort By */}
      <div>
        <Label className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary/70">
          <ArrowUpDown className="h-3 w-3" /> Sort By
        </Label>
        <div className="flex gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className="flex-1 rounded-lg px-2 py-1.5 text-[11px] font-bold transition-all"
              style={{
                backgroundColor: sortBy === opt.value ? 'rgba(255,0,128,0.2)' : 'rgba(255,255,255,0.05)',
                color: sortBy === opt.value ? '#ff0080' : '#888',
                border: `1px solid ${sortBy === opt.value ? 'rgba(255,0,128,0.4)' : 'transparent'}`,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear All */}
      {hasFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-destructive hover:bg-destructive/20 hover:text-destructive border border-destructive/20 rounded-lg"
            onClick={() => { setSearchQuery(''); setSelectedFaction(null); setSelectedRarity(null); }}
          >
            Clear All Filters
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
