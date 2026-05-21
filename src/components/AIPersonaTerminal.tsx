'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIPersona } from '@/lib/api';
import { useEffect, useState } from 'react';

const Typewriter = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText(text.substring(0, i));
        i++;
        if (i > text.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <span>
      {displayedText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-2 h-4 bg-secondary ml-1 align-middle"
      />
    </span>
  );
};

export default function AIPersonaTerminal({ persona }: { persona: AIPersona }) {
  return (
    <Card className="border-secondary/50 bg-black/60 shadow-[0_0_30px_rgba(0,255,255,0.15)] backdrop-blur-xl relative overflow-hidden group">
      {/* Animated Scanline Background */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />

      <CardHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-secondary/20 pb-4 relative z-10 bg-secondary/5">
        <div className="p-2 bg-secondary/10 rounded-lg">
          <BrainCircuit className="h-6 w-6 text-secondary animate-pulse" />
        </div>
        <div>
          <CardTitle className="text-2xl text-secondary font-black tracking-widest uppercase">Neural Link</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
            <p className="text-xs text-green-400 font-mono tracking-widest uppercase">Connection Stable</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6 relative z-10 font-mono">
        <div>
          <h4 className="mb-2 text-xs font-bold uppercase text-secondary/60 flex items-center gap-2">
            <Terminal className="w-3 h-3" /> System_Prompt
          </h4>
          <div className="rounded-lg border border-secondary/30 bg-black/80 p-4 text-sm text-secondary/90 shadow-inner">
            <Typewriter text={persona.systemPrompt} delay={500} />
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-xs font-bold uppercase text-secondary/60 flex items-center gap-2">
            <Terminal className="w-3 h-3" /> Behavior_Protocol
          </h4>
          <p className="text-white text-sm border-l-2 border-secondary/50 pl-3">
            <Typewriter text={persona.behavior} delay={2000} />
          </p>
        </div>

        <div>
          <h4 className="mb-2 text-xs font-bold uppercase text-secondary/60 flex items-center gap-2">
            <Terminal className="w-3 h-3" /> Live_Feed
          </h4>
          <div className="border-l-2 border-primary pl-4 py-2 italic text-primary/90 bg-primary/5 rounded-r-lg">
            " <Typewriter text={persona.previewText} delay={3500} /> "
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="w-full gap-2 bg-secondary text-black hover:bg-white font-bold tracking-widest uppercase mt-4 shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all">
            <BrainCircuit className="h-4 w-4" />
            Initialize Chat Sequence
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
