import { fetchNormie, fetchPersonaPreview } from '@/lib/api';
import PixelCanvas from '@/components/PixelCanvas';
import AIPersonaTerminal from '@/components/AIPersonaTerminal';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function NormieDetailPage({ params }: { params: { id: string } }) {
  const normie = await fetchNormie(params.id);
  
  if (!normie) {
    notFound();
  }

  const persona = await fetchPersonaPreview(params.id);

  return (
    <div className="container mx-auto min-h-screen px-4 py-8 relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="mb-8">
        <Link href="/explore">
          <Button variant="ghost" className="gap-2 text-white hover:bg-white/10 hover:text-primary transition-colors backdrop-blur-md rounded-full px-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Grid
          </Button>
        </Link>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Left Column: Canvas */}
        <div className="flex flex-col gap-8">
          <PixelCanvas imageUrl={normie.imageUrl} alt={normie.name} />
          
          <Card className="border-primary/30 bg-black/40 backdrop-blur-xl shadow-[0_0_30px_rgba(255,0,128,0.15)] rounded-2xl">
            <CardHeader className="border-b border-primary/20">
              <CardTitle className="text-xl text-primary font-black uppercase tracking-widest">Biometric Data</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                {normie.attributes.map((attr) => (
                  <div key={attr.trait_type} className="rounded-xl bg-black/60 border border-white/5 p-4 transition-colors hover:border-primary/50 group">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary/60 group-hover:text-primary transition-colors">{attr.trait_type}</p>
                    <p className="mt-1 font-mono text-lg text-white">{attr.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Info & AI Persona */}
        <div className="flex flex-col gap-10">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,0,128,0.8)] sm:text-7xl">
              {normie.name}
            </h1>
            <div className="mt-4 h-1 w-24 bg-gradient-to-r from-primary to-transparent" />
            <p className="mt-6 text-xl text-gray-300 font-light leading-relaxed">
              {normie.description}
            </p>
          </div>

          {persona && <AIPersonaTerminal persona={persona} />}
        </div>
      </div>
    </div>
  );
}
