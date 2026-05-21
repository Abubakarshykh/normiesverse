export interface Normie {
  id: string;
  name: string;
  faction: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  powerLevel: number;
  description: string;
  imageUrl: string;
  traits: { trait_type: string; value: string }[];
  persona: {
    systemPrompt: string;
    behavior: string;
    previewText: string;
  };
}

export interface AIPersona {
  id: string;
  name: string;
  systemPrompt: string;
  behavior: string;
  previewText: string;
}

let cachedNormies: Normie[] | null = null;

export async function fetchNormies(): Promise<Normie[]> {
  if (cachedNormies) return cachedNormies;
  try {
    const res = await fetch('/data/normies.json', { cache: 'force-cache' });
    if (!res.ok) throw new Error('Failed to load normies.json');
    const data: Normie[] = await res.json();
    cachedNormies = data;
    return data;
  } catch (error) {
    console.error('Could not load normies.json', error);
    return [];
  }
}

export async function fetchNormie(id: string): Promise<Normie | null> {
  const normies = await fetchNormies();
  return normies.find((n) => n.id === id) ?? null;
}

export async function fetchNormiesByFaction(faction: string): Promise<Normie[]> {
  const normies = await fetchNormies();
  return normies.filter((n) => n.faction === faction);
}

export async function fetchPersonaPreview(id: string): Promise<AIPersona | null> {
  const normie = await fetchNormie(id);
  if (!normie) return null;
  return {
    id: normie.id,
    name: normie.name,
    systemPrompt: normie.persona.systemPrompt,
    behavior: normie.persona.behavior,
    previewText: normie.persona.previewText,
  };
}

export const FACTION_COLORS: Record<string, string> = {
  Cyber: '#00ffff',
  Retro: '#ff6600',
  Void: '#9900ff',
  Solar: '#ffcc00',
  Glitch: '#00ff88',
  Neon: '#ff0080',
};

export const RARITY_ORDER = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
