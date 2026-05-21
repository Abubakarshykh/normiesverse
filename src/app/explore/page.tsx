import NormieGrid from '@/components/NormieGrid';
import FilterSidebar from '@/components/FilterSidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore NormiesVerse',
  description: 'Discover the unique Cyberpunk and Retro Pixel Normies NFTs.',
};

export default function ExplorePage() {
  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black uppercase tracking-tight text-primary drop-shadow-[0_0_10px_rgba(255,0,128,0.5)]">
          Explore the Verse
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse the entire collection of Normies. Filter by faction, traits, or search by name.
        </p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="w-full md:w-64 lg:w-72 shrink-0">
          <FilterSidebar />
        </aside>

        <main className="flex-1">
          <NormieGrid />
        </main>
      </div>
    </div>
  );
}
