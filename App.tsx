
import React, { useState, useCallback, useRef } from 'react';
import VoxelScene from './components/VoxelScene';
import HandTrackerOverlay from './components/HandTrackerOverlay';
import { Voxel, HandData, AppMode } from './types';
import { generateVoxelStructure } from './services/geminiService';
import { 
  CubeIcon, 
  TrashIcon, 
  HandRaisedIcon, 
  SparklesIcon, 
  PaintBrushIcon,
  ArrowPathIcon,
  VideoCameraIcon,
  VideoCameraSlashIcon
} from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [voxels, setVoxels] = useState<Voxel[]>([]);
  const [handData, setHandData] = useState<HandData | null>(null);
  const [mode, setMode] = useState<AppMode>(AppMode.BUILD);
  const [currentColor, setCurrentColor] = useState('#10b981');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(true);

  const colors = [
    '#10b981', '#3b82f6', '#ef4444', '#f59e0b', 
    '#8b5cf6', '#ec4899', '#ffffff', '#000000'
  ];

  const handleVoxelAction = useCallback((pos: [number, number, number]) => {
    if (mode === AppMode.BUILD) {
      const exists = voxels.some(v => 
        v.position[0] === pos[0] && 
        v.position[1] === pos[1] && 
        v.position[2] === pos[2]
      );
      if (!exists) {
        setVoxels(prev => [
          ...prev, 
          { id: Math.random().toString(36), position: pos, color: currentColor }
        ]);
      }
    } else if (mode === AppMode.ERASE) {
      setVoxels(prev => prev.filter(v => 
        !(v.position[0] === pos[0] && 
          v.position[1] === pos[1] && 
          v.position[2] === pos[2])
      ));
    }
  }, [mode, currentColor, voxels]);

  const handleMagicBuild = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    const result = await generateVoxelStructure(prompt);
    if (result) {
      const newVoxels: Voxel[] = result.voxels.map(v => ({
        id: Math.random().toString(36),
        position: [v.x, v.y, v.z],
        color: v.color
      }));
      setVoxels(newVoxels);
    }
    setIsGenerating(false);
    setPrompt('');
  };

  const clearCanvas = () => {
    if (window.confirm('Clear all voxels?')) {
      setVoxels([]);
    }
  };

  return (
    <div className="relative w-screen h-screen">
      {/* 3D Canvas */}
      <VoxelScene 
        voxels={voxels} 
        handData={handData} 
        mode={mode} 
        currentColor={currentColor}
        onVoxelAction={handleVoxelAction}
      />

      {/* Hand Tracker Feed */}
      <HandTrackerOverlay 
        isActive={isCameraActive} 
        onHandUpdate={setHandData} 
      />

      {/* Overlay UI */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none">
        {/* Left: Mode Selection */}
        <div className="flex flex-col gap-4 pointer-events-auto">
          <div className="bg-slate-800/80 backdrop-blur-md p-2 rounded-2xl border border-slate-700 shadow-xl">
            <h1 className="text-xs font-bold text-slate-400 px-3 mb-2 uppercase tracking-widest">Controls</h1>
            <div className="flex flex-col gap-1">
              <button 
                onClick={() => setMode(AppMode.BUILD)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${mode === AppMode.BUILD ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'hover:bg-slate-700 text-slate-300'}`}
              >
                <CubeIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Build (Pinch)</span>
              </button>
              <button 
                onClick={() => setMode(AppMode.ERASE)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${mode === AppMode.ERASE ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'hover:bg-slate-700 text-slate-300'}`}
              >
                <TrashIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Erase</span>
              </button>
              <button 
                onClick={() => setMode(AppMode.NAVIGATE)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${mode === AppMode.NAVIGATE ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'hover:bg-slate-700 text-slate-300'}`}
              >
                <HandRaisedIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Orbit Camera</span>
              </button>
            </div>
          </div>

          {/* Color Palette */}
          <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-xl">
            <div className="flex items-center gap-2 mb-3 text-slate-400">
              <PaintBrushIcon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Colors</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {colors.map(c => (
                <button
                  key={c}
                  onClick={() => setCurrentColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 ${currentColor === c ? 'border-white scale-110 ring-2 ring-slate-400' : 'border-transparent opacity-60 hover:opacity-100'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Camera Toggle & Reset */}
        <div className="flex flex-col gap-2 pointer-events-auto items-end">
          <button 
            onClick={() => setIsCameraActive(!isCameraActive)}
            className={`p-3 rounded-full backdrop-blur-md border border-slate-700 shadow-xl transition-colors ${isCameraActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}
          >
            {isCameraActive ? <VideoCameraIcon className="w-6 h-6" /> : <VideoCameraSlashIcon className="w-6 h-6" />}
          </button>
          <button 
            onClick={clearCanvas}
            className="p-3 bg-slate-800/80 rounded-full backdrop-blur-md border border-slate-700 text-slate-400 hover:text-white shadow-xl"
            title="Clear All"
          >
            <ArrowPathIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Bottom: Gemini Magic Prompt */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-6 pointer-events-none">
        <div className="bg-slate-800/90 backdrop-blur-xl p-4 rounded-3xl border border-slate-700/50 shadow-2xl flex gap-3 pointer-events-auto items-center">
          <div className="bg-emerald-500/10 p-2 rounded-xl">
            <SparklesIcon className="w-6 h-6 text-emerald-400" />
          </div>
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleMagicBuild()}
            placeholder="Describe a structure to build with Gemini..."
            className="bg-transparent border-none outline-none flex-1 text-slate-100 placeholder:text-slate-500 font-medium"
          />
          <button 
            onClick={handleMagicBuild}
            disabled={isGenerating || !prompt.trim()}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 whitespace-nowrap"
          >
            {isGenerating ? 'Generating...' : 'Magic Build'}
          </button>
        </div>
      </div>

      {/* Instructions Overlay */}
      {!handData && isCameraActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px] pointer-events-none">
          <div className="bg-slate-900/80 border border-slate-700 p-8 rounded-3xl text-center shadow-2xl animate-pulse">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <HandRaisedIcon className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Show Your Hand</h2>
            <p className="text-slate-400">Pinch your index and thumb to place a voxel</p>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="absolute bottom-4 left-6 px-4 py-1.5 bg-slate-800/50 backdrop-blur rounded-full border border-slate-700/50 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${handData ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {handData ? `Hand Tracking Active (${handData.gesture})` : 'Searching for hand...'}
          </span>
        </div>
        <div className="w-px h-3 bg-slate-700" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Voxels: {voxels.length}
        </span>
      </div>
    </div>
  );
};

export default App;
