
export interface Voxel {
  id: string;
  position: [number, number, number];
  color: string;
}

export interface HandData {
  landmarks: Array<{ x: number, y: number, z: number }>;
  gesture: 'none' | 'pinch' | 'open' | 'closed';
}

export enum AppMode {
  BUILD = 'BUILD',
  ERASE = 'ERASE',
  NAVIGATE = 'NAVIGATE'
}

export interface GeminiStructure {
  name: string;
  voxels: Array<{
    x: number;
    y: number;
    z: number;
    color: string;
  }>;
}
