'use client';

import { useAppStore } from '@/lib/store';
import { useEffect, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

function TiltCard({ normie, index }: { normie: any; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Link href={`/normie/${normie.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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
              <div className="relative aspect-square overflow-hidden rounded-t-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
                {/* Glare effect */}
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
                  className="h-full w-full object-contain [image-rendering:pixelated] transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]"
                />
                
                {/* Scanning Laser on hover */}
                <div className="absolute left-0 right-0 h-[2px] bg-secondary/80 shadow-[0_0_8px_#00ffff] opacity-0 group-hover:opacity-100 top-0 group-hover:animate-scan" />
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <h3 className="text-xl font-black uppercase tracking-wider text-white group-hover:text-primary transition-colors">{normie.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-gray-400 font-light">{normie.description}</p>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 p-5 pt-0">
              {normie.attributes.map((attr: any) => (
                <Badge key={attr.trait_type} variant="secondary" className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/30">
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
  const { normies, isLoading, searchQuery, selectedFaction, loadNormies } = useAppStore();

  useEffect(() => {
    if (normies.length === 0) {
      loadNormies();
    }
  }, [normies.length, loadNormies]);

  const filteredNormies = useMemo(() => {
    return normies.filter((normie) => {
      const matchesSearch = normie.name.toLowerCase().includes(searchQuery.toLowerCase());
      const faction = normie.attributes.find((a) => a.trait_type === 'Faction')?.value;
      const matchesFaction = selectedFaction ? faction === selectedFaction : true;
      return matchesSearch && matchesFaction;
    });
  }, [normies, searchQuery, selectedFaction]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary drop-shadow-[0_0_10px_rgba(255,0,128,1)]" />
      </div>
    );
  }

  if (filteredNormies.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-muted-foreground border border-dashed border-white/20 rounded-2xl bg-black/20">
        <p className="text-lg">No Normies detected in this sector.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {filteredNormies.map((normie, index) => (
        <TiltCard key={normie.id} normie={normie} index={index} />
      ))}
    </div>
  );
}
