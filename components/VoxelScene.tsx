
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Grid, Box, Sphere, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Voxel, HandData, AppMode } from '../types';

// Fix for JSX intrinsic elements not being recognized in the current environment
// by defining local variables that map to the Three.js element strings.
// This allows lowercase JSX tags to bypass intrinsic element checks.
const meshStandardMaterial = 'meshStandardMaterial' as any;
const meshBasicMaterial = 'meshBasicMaterial' as any;
const group = 'group' as any;
const ambientLight = 'ambientLight' as any;
const pointLight = 'pointLight' as any;
const color = 'color' as any;

interface VoxelSceneProps {
  voxels: Voxel[];
  handData: HandData | null;
  mode: AppMode;
  currentColor: string;
  onVoxelAction: (pos: [number, number, number]) => void;
}

const VoxelObject: React.FC<{ voxel: Voxel }> = ({ voxel }) => {
  return (
    <Box position={voxel.position} args={[1, 1, 1]}>
      <meshStandardMaterial color={voxel.color} />
    </Box>
  );
};

const HandCursor: React.FC<{ handData: HandData | null; mode: AppMode; currentColor: string }> = ({ handData, mode, currentColor }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  // Smoothly move the cursor
  useFrame(() => {
    if (!handData || !meshRef.current) return;
    
    // Convert normalized hand coords to world space
    // Landmark 8 is index tip
    const landmark = handData.landmarks[8];
    const targetX = (landmark.x - 0.5) * 20;
    const targetY = (0.5 - landmark.y) * 15;
    const targetZ = (landmark.z * 10); // Z is depth

    meshRef.current.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.15);
  });

  const cursorColor = mode === AppMode.ERASE ? '#ef4444' : (mode === AppMode.BUILD ? currentColor : '#3b82f6');

  return (
    <group ref={meshRef}>
      <Sphere args={[0.3, 16, 16]}>
        <meshBasicMaterial color={cursorColor} transparent opacity={0.6} />
      </Sphere>
      {/* Voxel preview wireframe */}
      {mode !== AppMode.NAVIGATE && (
        <Box args={[1, 1, 1]}>
          <meshBasicMaterial wireframe color={cursorColor} />
        </Box>
      )}
    </group>
  );
};

const VoxelScene: React.FC<VoxelSceneProps> = ({ voxels, handData, mode, currentColor, onVoxelAction }) => {
  const lastPinchRef = useRef<number>(0);

  // Check for pinch gesture to trigger action
  useFrame(() => {
    if (!handData) return;
    
    const now = Date.now();
    if (handData.gesture === 'pinch' && now - lastPinchRef.current > 400) {
      // Find the grid position nearest to the index finger
      const landmark = handData.landmarks[8];
      const worldX = (landmark.x - 0.5) * 20;
      const worldY = (0.5 - landmark.y) * 15;
      const worldZ = (landmark.z * 10);

      const gridX = Math.round(worldX);
      const gridY = Math.round(worldY);
      const gridZ = Math.round(worldZ);

      onVoxelAction([gridX, gridY, gridZ]);
      lastPinchRef.current = now;
    }
  });

  return (
    <Canvas shadows camera={{ position: [10, 10, 15], fov: 45 }}>
      <color attach="background" args={['#0f172a']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} castShadow />
      <Environment preset="city" />
      
      <group position={[0, 0, 0]}>
        {voxels.map((v) => (
          <VoxelObject key={v.id} voxel={v} />
        ))}
        
        <HandCursor handData={handData} mode={mode} currentColor={currentColor} />
      </group>

      <Grid
        infiniteGrid
        fadeDistance={50}
        fadeStrength={5}
        sectionSize={1}
        sectionColor="#334155"
        cellColor="#1e293b"
      />
      
      <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={20} blur={2.4} far={4.5} />
      
      {mode === AppMode.NAVIGATE && <OrbitControls makeDefault />}
    </Canvas>
  );
};

export default VoxelScene;
