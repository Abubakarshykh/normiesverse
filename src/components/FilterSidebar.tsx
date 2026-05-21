'use client';

import { useAppStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, X, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FilterSidebar() {
  const { searchQuery, setSearchQuery, selectedFaction, setSelectedFaction } = useAppStore();

  const factions = ['Cyber', 'Retro', 'Neon', 'Void'];

  return (
    <motion.div 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="sticky top-24 flex flex-col gap-6 rounded-2xl border border-primary/30 bg-black/40 p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(255,0,128,0.15)]"
    >
      <div className="flex items-center gap-2 border-b border-primary/20 pb-4">
        <Filter className="h-5 w-5 text-primary drop-shadow-[0_0_8px_rgba(255,0,128,1)]" />
        <h2 className="text-xl font-black uppercase tracking-widest text-white">Database Parameters</h2>
      </div>

      <div>
        <div className="relative group">
          <Search className="absolute left-3 top-3 h-5 w-5 text-primary transition-colors group-focus-within:text-white" />
          <Input
            type="text"
            placeholder="Search identifier..."
            className="pl-10 border-primary/20 bg-black/50 text-white placeholder:text-muted-foreground focus-visible:ring-primary h-11 rounded-xl transition-all shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div>
        <Label className="mb-4 block text-sm font-bold uppercase tracking-widest text-primary/80">Faction Signature</Label>
        <div className="flex flex-wrap gap-3">
          {factions.map((faction) => (
            <Button
              key={faction}
              variant={selectedFaction === faction ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFaction(selectedFaction === faction ? null : faction)}
              className={`transition-all rounded-lg border-primary/30 ${
                selectedFaction === faction 
                  ? 'bg-primary text-white shadow-[0_0_15px_rgba(255,0,128,0.6)]' 
                  : 'bg-black/40 hover:bg-primary/20 hover:text-white hover:border-primary/50'
              }`}
            >
              {faction}
            </Button>
          ))}
        </div>
      </div>

      {(searchQuery || selectedFaction) && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full text-destructive hover:bg-destructive/20 hover:text-destructive border border-destructive/20 rounded-lg"
            onClick={() => {
              setSearchQuery('');
              setSelectedFaction(null);
            }}
          >
            Clear Parameters
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
