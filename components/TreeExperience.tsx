
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, DepthOfField } from '@react-three/postprocessing';
import MorphingTree from './MorphingTree';
import { TreeMorphState } from '../types';

interface TreeExperienceProps {
  state: TreeMorphState;
}

const TreeExperience: React.FC<TreeExperienceProps> = ({ state }) => {
  return (
    <Canvas 
      shadows 
      gl={{ 
        antialias: true, 
        stencil: false,
        depth: true,
        toneMapping: 4,
        powerPreference: 'high-performance'
      }}
    >
      <color attach="background" args={['#010a08']} />
      
      <PerspectiveCamera makeDefault position={[0, 2, 24]} fov={35} />
      <OrbitControls 
        enablePan={false} 
        minDistance={12} 
        maxDistance={45} 
        maxPolarAngle={Math.PI / 1.7}
        autoRotate={state === TreeMorphState.TREE_SHAPE}
        autoRotateSpeed={0.5}
      />

      <Suspense fallback={null}>
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.7} />
        <spotLight 
          position={[20, 30, 20]} 
          angle={0.25} 
          penumbra={1} 
          intensity={4.5} 
          castShadow 
          shadow-mapSize={[2048, 2048]} 
          color="#fffaf0"
        />
        {/* Stronger Green Rim Light */}
        <spotLight 
          position={[-25, 15, 10]} 
          angle={0.4} 
          penumbra={1} 
          intensity={3} 
          color="#10b981"
        />
        <pointLight position={[5, 10, -5]} intensity={1.5} color="#059669" distance={25} />
        
        {/* Golden floor glow */}
        <pointLight position={[0, -6, 0]} intensity={2} color="#ffd700" distance={15} />

        <Environment preset="apartment" />

        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
          <MorphingTree state={state} />
        </Float>

        <ContactShadows 
          opacity={0.6} 
          scale={30} 
          blur={2.5} 
          far={15} 
          resolution={512} 
          color="#000000" 
        />

        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.1} 
            mipmapBlur 
            intensity={2.8} 
            radius={0.7} 
          />
          <DepthOfField 
            focusDistance={0.015} 
            focalLength={0.04} 
            bokehScale={4} 
            height={720} 
          />
          <Vignette eskil={false} offset={0.05} darkness={0.9} />
          <Noise opacity={0.03} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
};

export default TreeExperience;
