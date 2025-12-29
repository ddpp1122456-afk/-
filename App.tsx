
import React, { useState } from 'react';
import TreeExperience from './components/TreeExperience';
import UIOverlay from './components/UIOverlay';
import Background from './components/Background';
import { TreeMorphState } from './types';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeMorphState>(TreeMorphState.TREE_SHAPE);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Background />
      
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <TreeExperience state={treeState} />
      </div>

      {/* 2D UI Layer */}
      <UIOverlay state={treeState} setState={setTreeState} />

      {/* Aesthetic Grain Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default App;
