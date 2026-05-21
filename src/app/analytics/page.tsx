'use client';

import { useAppStore } from '@/lib/store';
import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const COLORS = ['#ff0080', '#00ffff', '#9900ff', '#ff6600'];

export default function AnalyticsPage() {
  const { normies, isLoading, loadNormies } = useAppStore();

  useEffect(() => {
    if (normies.length === 0) {
      loadNormies();
    }
  }, [normies.length, loadNormies]);

  const factionData = useMemo(() => {
    const counts: Record<string, number> = {};
    normies.forEach(n => {
      const faction = n.attributes.find(a => a.trait_type === 'Faction')?.value || 'Unknown';
      counts[faction] = (counts[faction] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [normies]);

  const backgroundData = useMemo(() => {
    const counts: Record<string, number> = {};
    normies.forEach(n => {
      const bg = n.attributes.find(a => a.trait_type === 'Background')?.value || 'Unknown';
      counts[bg] = (counts[bg] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [normies]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Hub
          </Button>
        </Link>
        <h1 className="text-4xl font-black uppercase tracking-tight text-secondary drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
          Verse Analytics
        </h1>
        <p className="mt-2 text-muted-foreground">
          Real-time data visualization of the NormiesVerse ecosystem.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-primary">Faction Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex h-80 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={factionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {factionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #ff0080' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-secondary">Background Traits</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={backgroundData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888' }} />
                <YAxis stroke="#888" tick={{ fill: '#888' }} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #00ffff' }}
                />
                <Bar dataKey="value" fill="#00ffff" radius={[4, 4, 0, 0]}>
                  {backgroundData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
