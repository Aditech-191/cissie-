import React from 'react';
import { Shield, Sparkles, Sliders } from 'lucide-react';

interface TopNavProps {
  activeTab: 'simulator' | 'lab' | 'hackathon' | 'pitch' | 'architecture';
  setActiveTab: (tab: 'simulator' | 'lab' | 'hackathon' | 'pitch' | 'architecture') => void;
  isProtectionActive: boolean;
  setIsProtectionActive: (active: boolean) => void;
  onOpenSettings: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  isProtectionActive,
  setIsProtectionActive,
  onOpenSettings,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text wordmark in display face */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveTab('simulator'); }}
            className="text-lg font-bold tracking-tight text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Shield className="w-4 h-4" />
            </span>
            <span>SafeLens AI</span>
          </a>
          <span className="text-xs text-slate-500 hidden sm:inline-block">
            Child Cyber Safety Engine
          </span>
        </div>

        {/* Zone 2: Clean 4-6 text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`transition-colors text-left py-1 ${activeTab === 'simulator' ? 'text-teal-400 border-b-2 border-teal-400 font-semibold' : 'hover:text-slate-200'}`}
          >
            Browser Extension Simulator
          </button>
          <button
            onClick={() => setActiveTab('lab')}
            className={`transition-colors text-left py-1 ${activeTab === 'lab' ? 'text-teal-400 border-b-2 border-teal-400 font-semibold' : 'hover:text-slate-200'}`}
          >
            Live Testing Lab
          </button>
          <button
            onClick={() => setActiveTab('hackathon')}
            className={`transition-colors text-left py-1 ${activeTab === 'hackathon' ? 'text-teal-400 border-b-2 border-teal-400 font-semibold' : 'hover:text-slate-200'}`}
          >
            Hackathon Starter Kit
          </button>
          <button
            onClick={() => setActiveTab('pitch')}
            className={`transition-colors text-left py-1 ${activeTab === 'pitch' ? 'text-teal-400 border-b-2 border-teal-400 font-semibold' : 'hover:text-slate-200'}`}
          >
            Pitch Deck & Rubric
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`transition-colors text-left py-1 ${activeTab === 'architecture' ? 'text-teal-400 border-b-2 border-teal-400 font-semibold' : 'hover:text-slate-200'}`}
          >
            Architecture
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsProtectionActive(!isProtectionActive)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              isProtectionActive
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isProtectionActive ? 'bg-teal-400 animate-pulse' : 'bg-rose-400'}`} />
            <span>{isProtectionActive ? 'Shield Active' : 'Shield Paused'}</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
            title="Configure Safety Policy"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
