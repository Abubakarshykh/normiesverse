'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function PixelCanvas({ imageUrl, alt }: { imageUrl: string; alt: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setIsLoaded(true);

    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [imageUrl]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: 'spring' }}
      className="relative aspect-square w-full overflow-hidden rounded-2xl border border-primary/30 bg-black/60 shadow-[0_0_40px_rgba(255,0,128,0.2)] [perspective:1000px]"
    >
      {/* CRT Curvature / Vignette */}
      <div className="pointer-events-none absolute inset-0 z-30 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] rounded-2xl" />

      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-[url('/grid.svg')] bg-center opacity-10 mix-blend-overlay" />
      
      {/* Scanlines */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-50" />

      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-40">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            className="h-12 w-12 border-4 border-primary border-t-transparent border-b-secondary rounded-full shadow-[0_0_15px_rgba(255,0,128,0.5)]"
          />
          <span className="text-primary font-mono text-sm uppercase tracking-widest animate-pulse">Decrypting Signal...</span>
        </div>
      )}

      {isLoaded && (
        <motion.div
          initial={{ opacity: 0, filter: 'blur(10px) brightness(2)' }}
          animate={{ opacity: 1, filter: 'blur(0px) brightness(1)' }}
          transition={{ duration: 1, ease: 'circOut' }}
          className={`h-full w-full flex items-center justify-center p-8 transition-transform duration-100 ${isGlitching ? 'translate-x-[2px] -translate-y-[1px] hue-rotate-90' : ''}`}
        >
          <img
            src={imageUrl}
            alt={alt}
            className={`h-full w-full object-contain [image-rendering:pixelated] drop-shadow-[0_0_20px_rgba(255,0,128,0.6)] ${isGlitching ? 'opacity-80' : 'opacity-100'}`}
            style={isGlitching ? { filter: 'drop-shadow(3px 0 0 red) drop-shadow(-3px 0 0 cyan)' } : {}}
          />
        </motion.div>
      )}

      {/* Cyberpunk scanning line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-secondary/80 shadow-[0_0_15px_rgba(0,255,255,1)] z-40"
        initial={{ top: '0%' }}
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
      />
    </motion.div>
  );
}
