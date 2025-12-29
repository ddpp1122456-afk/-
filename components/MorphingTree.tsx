
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeMorphState } from '../types';
import { generateTreePositions, generateScatterPositions } from '../utils/math';

interface MorphingTreeProps {
  state: TreeMorphState;
  particleCount?: number;
}

const MorphingTree: React.FC<MorphingTreeProps> = ({ state, particleCount = 6000 }) => {
  const leafMeshRef = useRef<THREE.InstancedMesh>(null);
  const lightMeshRef = useRef<THREE.InstancedMesh>(null);
  const ornamentMeshRef = useRef<THREE.InstancedMesh>(null);
  const giftMeshRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const progressRef = useRef(1);
  const targetProgress = state === TreeMorphState.TREE_SHAPE ? 1 : 0;

  // Counts for different elements
  const counts = {
    leaves: particleCount,
    lights: Math.floor(particleCount * 0.15),
    ornaments: Math.floor(particleCount * 0.08),
    gifts: 40
  };

  // Create a 5-pointed star shape for the top
  const starShape = useMemo(() => {
    const shape = new THREE.Shape();
    const points = 5;
    const outerRadius = 1;
    const innerRadius = 0.4;
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);

  const starExtrudeSettings = useMemo(() => ({
    steps: 1,
    depth: 0.3,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 3
  }), []);

  // Positions and Data
  const data = useMemo(() => ({
    leaves: {
      tree: generateTreePositions(counts.leaves, 12, 5),
      scatter: generateScatterPositions(counts.leaves, 30),
      speeds: Array.from({ length: counts.leaves }, () => Math.random() * 0.5 + 0.5),
      offsets: Array.from({ length: counts.leaves }, () => Math.random() * Math.PI * 2),
      colors: Array.from({ length: counts.leaves }, () => {
        const shade = Math.random();
        // Richer Emerald Palette
        if (shade > 0.8) return new THREE.Color('#064e3b'); // Dark Forest Green
        if (shade > 0.5) return new THREE.Color('#10b981'); // Emerald
        if (shade > 0.2) return new THREE.Color('#059669'); // Medium Sea Green
        return new THREE.Color('#34d399'); // Minty Highlight
      })
    },
    lights: {
      tree: generateTreePositions(counts.lights, 11.5, 4.8),
      scatter: generateScatterPositions(counts.lights, 35),
      colors: Array.from({ length: counts.lights }, () => {
        const palette = ['#ff0000', '#ffd700', '#0000ff', '#ffffff', '#ff69b4', '#00ffcc'];
        return new THREE.Color(palette[Math.floor(Math.random() * palette.length)]);
      })
    },
    ornaments: {
      tree: generateTreePositions(counts.ornaments, 11, 4.5),
      scatter: generateScatterPositions(counts.ornaments, 25),
    },
    gifts: {
      tree: Array.from({ length: counts.gifts }, () => {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 4 + 1;
        return [Math.cos(angle) * r, -5.5 + Math.random() * 1, Math.sin(angle) * r] as [number, number, number];
      }),
      scatter: generateScatterPositions(counts.gifts, 40),
      colors: Array.from({ length: counts.gifts }, () => {
        const palette = ['#dc2626', '#d4af37', '#2563eb', '#ffffff', '#10b981'];
        return new THREE.Color(palette[Math.floor(Math.random() * palette.length)]);
      })
    }
  }), [counts.leaves]);

  const materials = useMemo(() => ({
    leaf: new THREE.MeshStandardMaterial({ metalness: 0.7, roughness: 0.2, emissive: '#022c1e', emissiveIntensity: 0.2 }),
    light: new THREE.MeshStandardMaterial({ emissiveIntensity: 12, toneMapped: false }),
    ornament: new THREE.MeshStandardMaterial({ color: '#ffcc33', metalness: 1, roughness: 0.05, emissive: '#4d3b0a', emissiveIntensity: 0.5 }),
    gift: new THREE.MeshStandardMaterial({ metalness: 0.5, roughness: 0.2 }),
    star: new THREE.MeshStandardMaterial({ color: '#ffcc33', metalness: 1, roughness: 0, emissive: '#ffaa00', emissiveIntensity: 5 })
  }), []);

  useFrame((state, delta) => {
    progressRef.current = THREE.MathUtils.lerp(progressRef.current, targetProgress, delta * 1.8);
    const time = state.clock.getElapsedTime();
    const p = progressRef.current;

    const updateMesh = (
      mesh: THREE.InstancedMesh | null, 
      count: number, 
      treePos: [number, number, number][], 
      scatterPos: [number, number, number][],
      scaleRange: [number, number],
      rotOffset: number = 0,
      setColors?: THREE.Color[]
    ) => {
      if (!mesh) return;
      for (let i = 0; i < count; i++) {
        const individualProgress = THREE.MathUtils.clamp(p * 1.5 - (i / count) * 0.5, 0, 1);
        const t = treePos[i];
        const s = scatterPos[i];
        
        const float = (1 - individualProgress) * 0.3;
        const x = THREE.MathUtils.lerp(s[0], t[0], individualProgress) + Math.sin(time + i) * float;
        const y = THREE.MathUtils.lerp(s[1], t[1], individualProgress) + Math.cos(time + i) * float;
        const z = THREE.MathUtils.lerp(s[2], t[2], individualProgress) + Math.sin(time * 0.8 + i) * float;

        dummy.position.set(x, y, z);
        dummy.rotation.set(time * 0.2 + i, rotOffset, 0);
        const scale = THREE.MathUtils.lerp(scaleRange[0], scaleRange[1], individualProgress);
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        if (setColors) mesh.setColorAt(i, setColors[i]);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (setColors) mesh.instanceColor!.needsUpdate = true;
    };

    updateMesh(leafMeshRef.current, counts.leaves, data.leaves.tree, data.leaves.scatter, [0.08, 0.16], 0, data.leaves.colors);
    updateMesh(lightMeshRef.current, counts.lights, data.lights.tree, data.lights.scatter, [0.05, 0.12], 0, data.lights.colors);
    updateMesh(ornamentMeshRef.current, counts.ornaments, data.ornaments.tree, data.ornaments.scatter, [0.1, 0.25]);
    updateMesh(giftMeshRef.current, counts.gifts, data.gifts.tree, data.gifts.scatter, [0.1, 0.6], Math.PI / 4, data.gifts.colors);
    
    if (lightMeshRef.current) {
        materials.light.emissiveIntensity = 10 + Math.sin(time * 5) * 5;
    }
  });

  return (
    <group>
      {/* Leaves */}
      <instancedMesh ref={leafMeshRef} args={[undefined, undefined, counts.leaves]} castShadow>
        <boxGeometry args={[1, 0.15, 0.4]} />
        <primitive object={materials.leaf} attach="material" />
      </instancedMesh>

      {/* Twinkling Lights */}
      <instancedMesh ref={lightMeshRef} args={[undefined, undefined, counts.lights]}>
        <sphereGeometry args={[1, 8, 8]} />
        <primitive object={materials.light} attach="material" />
      </instancedMesh>

      {/* Ornaments */}
      <instancedMesh ref={ornamentMeshRef} args={[undefined, undefined, counts.ornaments]} castShadow>
        <sphereGeometry args={[1, 12, 12]} />
        <primitive object={materials.ornament} attach="material" />
      </instancedMesh>

      {/* Gifts */}
      <instancedMesh ref={giftMeshRef} args={[undefined, undefined, counts.gifts]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={materials.gift} attach="material" />
      </instancedMesh>

      {/* Top Five-Pointed Star */}
      <mesh position={[0, 6.6, 0]} rotation={[0, 0, 0]}>
        <extrudeGeometry args={[starShape, starExtrudeSettings]} />
        <primitive object={materials.star} attach="material" />
        <pointLight intensity={35} color="#f9d423" distance={20} decay={2} />
      </mesh>
    </group>
  );
};

export default MorphingTree;
