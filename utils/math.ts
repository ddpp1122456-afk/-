
import * as THREE from 'three';

export const generateTreePositions = (count: number, height: number, radius: number): [number, number, number][] => {
  const positions: [number, number, number][] = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const angleStep = Math.PI * 2 * goldenRatio;

  for (let i = 0; i < count; i++) {
    // Normalizing t from 0 to 1
    const t = i / count;
    
    // Cone shape: as t increases (going up the tree), radius decreases
    const currentRadius = (1 - t) * radius;
    const currentHeight = t * height;
    
    const angle = i * angleStep;
    
    // Spiral pattern with slight randomness for organic feel
    const randomOffset = (Math.random() - 0.5) * 0.15;
    const x = Math.cos(angle) * currentRadius * (1 + randomOffset);
    const z = Math.sin(angle) * currentRadius * (1 + randomOffset);
    const y = currentHeight + (Math.random() - 0.5) * 0.2;

    positions.push([x, y - height / 2, z]);
  }
  return positions;
};

export const generateScatterPositions = (count: number, range: number): [number, number, number][] => {
  const positions: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * range;
    const y = (Math.random() - 0.5) * range;
    const z = (Math.random() - 0.5) * range;
    positions.push([x, y, z]);
  }
  return positions;
};

export const lerp = (start: number, end: number, t: number) => {
  return start * (1 - t) + end * t;
};
