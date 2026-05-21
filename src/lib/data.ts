/**
 * Server-side only data utilities.
 * Uses direct JSON import — safe for SSR / generateStaticParams.
 * Do NOT import this in client components.
 */
import rawData from '../../public/data/normies.json';
import type { Normie } from './api';

const allNormies = rawData as Normie[];

export function getServerNormies(): Normie[] {
  return allNormies;
}

export function getServerNormie(id: string): Normie | null {
  return allNormies.find((n) => n.id === id) ?? null;
}

export function getServerNormiesByFaction(faction: string): Normie[] {
  return allNormies.filter((n) => n.faction === faction);
}

export function getServerFactions(): string[] {
  return [...new Set(allNormies.map((n) => n.faction))];
}
