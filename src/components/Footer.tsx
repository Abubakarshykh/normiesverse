import { Hexagon } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-primary/20 bg-black/60 backdrop-blur-md">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 py-8 md:flex-row">

        <div className="flex items-center gap-2">
          <Hexagon className="h-6 w-6 text-primary drop-shadow-[0_0_8px_rgba(255,0,128,1)]" />
          <span className="text-lg font-black uppercase tracking-widest text-white">
            Normies<span className="text-primary">Verse</span>
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/explore" className="hover:text-primary transition-colors">Explore</Link>
          <Link href="/analytics" className="hover:text-primary transition-colors">Analytics</Link>
        </div>

        <div className="text-sm text-muted-foreground/60">
          &copy; {new Date().getFullYear()} NormiesVerse. Built on the Grid by Lazydev.
        </div>
      </div>
    </footer>
  );
}
