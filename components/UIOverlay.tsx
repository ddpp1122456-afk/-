
import React from 'react';
import { TreeMorphState } from '../types';

interface UIOverlayProps {
  state: TreeMorphState;
  setState: (state: TreeMorphState) => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ state, setState }) => {
  const isTree = state === TreeMorphState.TREE_SHAPE;

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Top Left Header */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12 flex flex-col pointer-events-auto">
        <h1 className="text-4xl md:text-7xl font-cinzel font-bold text-[#f9d423] tracking-tighter uppercase leading-none drop-shadow-[0_5px_15px_rgba(249,212,35,0.4)]">
          Arix
        </h1>
        <div className="h-[2px] w-24 bg-[#f9d423] mt-2 mb-4" />
        <p className="text-xs md:text-sm font-cinzel tracking-[0.4em] text-[#f9d423]/80 uppercase font-bold italic">
          Signature Interactive
        </p>
      </div>

      {/* Top Right Info */}
      <div className="absolute top-8 right-8 md:top-12 md:right-12 text-right hidden md:block">
        <p className="text-[#f9d423] font-cinzel text-sm tracking-[0.2em] font-bold">2024 COLLECTION</p>
        <p className="text-[#f9d423]/60 font-cinzel text-[10px] tracking-widest mt-1">EMERALD & GOLD EDITION</p>
      </div>

      {/* Right Side Control Panel */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-end space-y-12 pointer-events-auto">
        <div className="flex flex-col items-end">
          <p className="text-[#f9d423]/50 text-[10px] tracking-[0.4em] uppercase mb-4 font-cinzel">Morphology State</p>
          <button 
              onClick={() => setState(isTree ? TreeMorphState.SCATTERED : TreeMorphState.TREE_SHAPE)}
              className="group relative w-16 h-16 md:w-20 md:h-20 bg-[#041a15] border-2 border-[#f9d423] rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(249,212,35,0.2)]"
          >
              <div className={`absolute w-3 h-3 md:w-4 md:h-4 bg-[#f9d423] rounded-sm transition-all duration-700 ${isTree ? 'rotate-45' : 'scale-150 rounded-full opacity-50 blur-sm'}`} />
              <div className="absolute inset-0 border border-[#f9d423]/30 rounded-full animate-ping opacity-20" />
          </button>
          <p className="mt-4 text-[#f9d423] font-cinzel text-xs tracking-[0.2em] uppercase text-right">
            {isTree ? 'Deconstruct' : 'Manifest'}
          </p>
        </div>

        <div className="h-32 w-[1px] bg-gradient-to-b from-transparent via-[#f9d423]/50 to-transparent" />

        <div className="flex flex-col items-end space-y-4">
           <div className="w-8 h-[1px] bg-[#f9d423]/30" />
           <p className="text-[#f9d423]/40 text-[9px] tracking-[0.3em] uppercase vertical-text transform rotate-180" style={{writingMode: 'vertical-rl'}}>Experience Studio</p>
        </div>
      </div>

      {/* Bottom Left Footer */}
      <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 flex flex-col space-y-2 pointer-events-auto">
        <div className="flex space-x-6 text-[#f9d423]/60 text-[10px] font-cinzel tracking-[0.2em] uppercase">
          <a href="#" className="hover:text-[#f9d423] transition-colors">Art Direction</a>
          <a href="#" className="hover:text-[#f9d423] transition-colors">Physics</a>
          <a href="#" className="hover:text-[#f9d423] transition-colors">Identity</a>
        </div>
        <p className="text-[#f9d423]/30 text-[9px] tracking-widest font-cinzel uppercase">
          Crafted for the high-end digital luxury market.
        </p>
      </div>

      {/* Bottom Right Brand Mark */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12">
         <div className="w-12 h-12 md:w-16 md:h-16 border border-[#f9d423]/20 flex items-center justify-center rotate-45">
            <span className="text-[#f9d423] text-lg font-cinzel -rotate-45">A</span>
         </div>
      </div>
    </div>
  );
};

export default UIOverlay;
