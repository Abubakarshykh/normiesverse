export interface Normie {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  model3DUrl?: string; // For 3D view
  attributes: { trait_type: string; value: string }[];
}

export interface AIPersona {
  id: string;
  name: string;
  systemPrompt: string;
  behavior: string;
  previewText: string;
}

const API_BASE = 'https://api.normies.art';

// Mock data as fallback
const mockNormies: Normie[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `${i + 1}`,
  name: `Normie #${i + 1}`,
  description: `A unique cyberpunk retro Normie #${i + 1}`,
  imageUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=Normie${i + 1}`,
  attributes: [
    { trait_type: 'Background', value: 'Neon Space' },
    { trait_type: 'Faction', value: i % 2 === 0 ? 'Cyber' : 'Retro' },
  ],
}));

export async function fetchNormies(): Promise<Normie[]> {
  try {
    const res = await fetch(`${API_BASE}/normies`);
    if (!res.ok) throw new Error('API down');
    return await res.json();
  } catch (error) {
    console.warn('Using mock data for normies');
    return mockNormies;
  }
}

export async function fetchNormie(id: string): Promise<Normie | null> {
  try {
    const res = await fetch(`${API_BASE}/normies/${id}`);
    if (!res.ok) throw new Error('API down');
    return await res.json();
  } catch (error) {
    console.warn(`Using mock data for normie ${id}`);
    return mockNormies.find((n) => n.id === id) || null;
  }
}

export async function fetchPersonaPreview(id: string): Promise<AIPersona | null> {
  try {
    const res = await fetch(`${API_BASE}/agents/persona-preview/${id}`);
    if (!res.ok) throw new Error('API down');
    return await res.json();
  } catch (error) {
    console.warn(`Using mock data for persona ${id}`);
    return {
      id,
      name: `Agent ${id}`,
      systemPrompt: 'You are a cyberpunk rogue agent roaming the NormiesVerse.',
      behavior: 'Sarcastic, insightful, slightly paranoid.',
      previewText: 'Scanning the grid... Looks like we got company. Stay frosty.',
    };
  }
}
