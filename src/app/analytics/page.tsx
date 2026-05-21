'use client';

import { useAppStore } from '@/lib/store';
import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, RadarChart,
  PolarGrid, PolarAngleAxis, Radar, Legend,
} from 'recharts';
import { Loader2, Users, Layers, Star, Zap } from 'lucide-react';
import { FACTION_COLORS, RARITY_ORDER } from '@/lib/api';
import { motion } from 'framer-motion';

const RARITY_COLORS: Record<string, string> = {
  Common: '#888888', Uncommon: '#4ade80', Rare: '#60a5fa', Epic: '#c084fc', Legendary: '#fbbf24',
};

export default function AnalyticsPage() {
  const { normies, isLoading, loadNormies } = useAppStore();

  useEffect(() => {
    if (normies.length === 0) loadNormies();
  }, [normies.length, loadNormies]);

  const stats = useMemo(() => {
    const factions = new Set(normies.map((n) => n.faction));
    const rarityRank: Record<string, number> = { Common: 0, Uncommon: 1, Rare: 2, Epic: 3, Legendary: 4 };
    const rarest = normies.reduce((p, c) => (rarityRank[c.rarity] ?? 0) > (rarityRank[p.rarity] ?? 0) ? c : p, normies[0]);
    const avgPower = normies.length ? Math.round(normies.reduce((s, n) => s + n.powerLevel, 0) / normies.length) : 0;
    return { total: normies.length, factions: factions.size, rarest, avgPower };
  }, [normies]);

  const factionData = useMemo(() => {
    const counts: Record<string, number> = {};
    normies.forEach((n) => { counts[n.faction] = (counts[n.faction] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value, color: FACTION_COLORS[name] ?? '#888' }));
  }, [normies]);

  const rarityData = useMemo(() => {
    const counts: Record<string, number> = {};
    normies.forEach((n) => { counts[n.rarity] = (counts[n.rarity] || 0) + 1; });
    return RARITY_ORDER.map((r) => ({ name: r, value: counts[r] ?? 0, fill: RARITY_COLORS[r] }));
  }, [normies]);

  const radarData = useMemo(() => {
    const factionStats: Record<string, { power: number; count: number }> = {};
    normies.forEach((n) => {
      if (!factionStats[n.faction]) factionStats[n.faction] = { power: 0, count: 0 };
      factionStats[n.faction].power += n.powerLevel;
      factionStats[n.faction].count++;
    });
    const factions = Object.keys(factionStats);
    return factions.map((f) => ({
      faction: f,
      avgPower: Math.round(factionStats[f].power / factionStats[f].count),
      members: factionStats[f].count,
    }));
  }, [normies]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Normies', value: stats.total, icon: Users, color: '#ff0080', glow: 'rgba(255,0,128,0.3)' },
    { label: 'Factions', value: stats.factions, icon: Layers, color: '#00ffff', glow: 'rgba(0,255,255,0.3)' },
    { label: 'Rarest', value: stats.rarest?.rarity ?? '—', icon: Star, color: '#fbbf24', glow: 'rgba(251,191,36,0.3)' },
    { label: 'Avg Power Level', value: stats.avgPower, icon: Zap, color: '#9900ff', glow: 'rgba(153,0,255,0.3)' },
  ];

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tight text-secondary drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
          Verse Analytics
        </h1>
        <p className="mt-2 text-muted-foreground">Real-time data visualization of the NormiesVerse ecosystem.</p>
      </div>

      {/* Stat Cards */}
      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="border-white/5 bg-black/40 backdrop-blur-md overflow-hidden relative">
                <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at top right, ${s.color}40, transparent 60%)` }} />
                <CardContent className="relative p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
                      <p className="mt-1 text-3xl font-black text-white">{s.value}</p>
                    </div>
                    <div className="rounded-xl p-2.5" style={{ backgroundColor: `${s.color}20`, boxShadow: `0 0 20px ${s.glow}` }}>
                      <Icon className="h-5 w-5" style={{ color: s.color }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="mb-6 grid gap-6 md:grid-cols-2">
        {/* Faction Donut */}
        <Card className="border-white/5 bg-black/40 backdrop-blur-md">
          <CardHeader><CardTitle className="text-primary">Faction Distribution</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={factionData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={4} dataKey="value" stroke="none">
                  {factionData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid #ff0080', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                <Legend formatter={(v) => <span style={{ color: '#aaa', fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rarity Bar Chart */}
        <Card className="border-white/5 bg-black/40 backdrop-blur-md">
          <CardHeader><CardTitle className="text-secondary">Rarity Breakdown</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rarityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#555" tick={{ fill: '#888', fontSize: 11 }} />
                <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 11 }} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid #00ffff', borderRadius: '8px' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {rarityData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Radar Chart - Showstopper */}
      <Card className="border-white/5 bg-black/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-yellow-400">Faction Power Radar</CardTitle>
          <p className="text-sm text-muted-foreground">Average power level comparison across all factions</p>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#222" />
              <PolarAngleAxis dataKey="faction" tick={{ fill: '#888', fontSize: 12 }} />
              <Radar name="Avg Power" dataKey="avgPower" stroke="#ff0080" fill="#ff0080" fillOpacity={0.2} strokeWidth={2} />
              <Radar name="Members" dataKey="members" stroke="#00ffff" fill="#00ffff" fillOpacity={0.15} strokeWidth={2} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid #9900ff', borderRadius: '8px' }} />
              <Legend formatter={(v) => <span style={{ color: '#aaa', fontSize: 12 }}>{v}</span>} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
