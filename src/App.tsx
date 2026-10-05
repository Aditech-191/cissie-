/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { initialFeedItems } from './data/mockFeed';
import { ExtensionSettings, FeedItem } from './types/safeguard';
import { TopNav } from './components/TopNav';
import { BrowserSimulator } from './components/BrowserSimulator';
import { LiveTestingLab } from './components/LiveTestingLab';
import { HackathonStarterKit } from './components/HackathonStarterKit';
import { PitchDeckGuide } from './components/PitchDeckGuide';
import { ArchitectureView } from './components/ArchitectureView';
import { ExtensionSettingsModal } from './components/ExtensionSettingsModal';
import {
  Shield,
  Sparkles,
  Zap,
  ArrowRight,
  Code2,
  HeartHandshake,
  Lock,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'simulator' | 'lab' | 'hackathon' | 'pitch' | 'architecture'
  >('simulator');

  const [feed, setFeed] = useState<FeedItem[]>(initialFeedItems);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [settings, setSettings] = useState<ExtensionSettings>({
    isEnabled: true,
    ageGroup: 'explorer',
    blurIntensity: 18,
    strictMode: true,
    audioWarning: false,
    parentPin: '1234',
    shieldNsfw: true,
    shieldViolence: true,
    shieldToxicity: true,
    shieldGrooming: true,
    shieldPii: true,
  });

  const handleInspectItem = (item: FeedItem) => {
    // Optional helper when user clicks inspect in browser simulator
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* Top Bar Contract (Wordmark, Nav links, Action) */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isProtectionActive={settings.isEnabled}
        setIsProtectionActive={(active) =>
          setSettings((prev) => ({ ...prev, isEnabled: active }))
        }
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Hero Banner / Problem Statement Anchor */}
      <section className="border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>AI for Good Hackathon Blueprint</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">UN SDG Target 16.2</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Innovating Safer Cyber Spaces for Children with Edge AI
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              A complete guide and working prototype for beginner hackathon teams: build a lightweight Chrome Extension
              that intercepts DOM media, classifies inappropriate content in under 40 milliseconds using pre-trained computer vision,
              and visually shields kids with zero data leakage.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 self-start md:self-auto shrink-0">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'simulator'
                  ? 'bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>Simulated Extension</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('hackathon')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'hackathon'
                  ? 'bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Starter Codebase</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'simulator' && (
          <BrowserSimulator
            feed={feed}
            setFeed={setFeed}
            settings={settings}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onInspectItem={handleInspectItem}
          />
        )}

        {activeTab === 'lab' && <LiveTestingLab />}

        {activeTab === 'hackathon' && <HackathonStarterKit />}

        {activeTab === 'pitch' && <PitchDeckGuide />}

        {activeTab === 'architecture' && <ArchitectureView />}
      </main>

      {/* Extension Policy Modal */}
      <ExtensionSettingsModal
        settings={settings}
        setSettings={setSettings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Clean Anti-Slop Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">SafeLens AI</span>
            <span aria-hidden="true">·</span>
            <span>Innovating child cyber safety through lightweight edge computer vision & Gemini 3.8 Flash</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>UN SDG 16.2 Protection</span>
            <span aria-hidden="true">·</span>
            <span>COPPA & GDPR-K Compliant Design</span>
            <span aria-hidden="true">·</span>
            <span>Zero-PII Storage</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
