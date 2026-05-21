'use client';

import Universe3D from '@/components/Universe3D';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
};

export default function Home() {
  return (
    <main className="relative flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center overflow-hidden">
      <Universe3D />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center space-y-10 px-4 text-center"
      >
        <motion.div variants={itemVariants} className="space-y-4">
          <h1 className="text-6xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_15px_rgba(0,255,255,0.5)] sm:text-8xl md:text-9xl relative">
            <span className="relative z-10">Normies<span className="text-primary">Verse</span></span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl font-light text-gray-300 sm:text-2xl drop-shadow-md backdrop-blur-sm bg-black/10 rounded-full px-6 py-2 border border-white/5">
            Dive into the neon-drenched, pixelated cosmos. Discover AI-powered entities living on the blockchain.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6 sm:flex-row">
          <Link href="/explore">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="group relative h-16 overflow-hidden rounded-full border border-primary/50 bg-primary/20 px-8 text-lg font-bold text-white shadow-[0_0_30px_rgba(255,0,128,0.4)] backdrop-blur-xl transition-all hover:bg-primary/40 hover:shadow-[0_0_50px_rgba(255,0,128,0.8)]">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                <span className="relative z-10 flex items-center gap-2">
                  Enter the Grid
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </span>
              </Button>
            </motion.div>
          </Link>
          <Link href="/analytics">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" className="group relative h-16 overflow-hidden rounded-full border border-secondary/50 bg-black/40 px-8 text-lg font-bold text-secondary shadow-[0_0_30px_rgba(0,255,255,0.2)] backdrop-blur-xl transition-all hover:bg-secondary/10 hover:text-white hover:shadow-[0_0_50px_rgba(0,255,255,0.5)]">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/30 to-secondary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
                  View Analytics
                </span>
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
