import React, { useState } from 'react';
import { FeedItem, ExtensionSettings } from '../types/safeguard';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Eye,
  RefreshCw,
  Globe,
  Info,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  PlaySquare,
  Search,
} from 'lucide-react';

interface BrowserSimulatorProps {
  feed: FeedItem[];
  setFeed: React.Dispatch<React.SetStateAction<FeedItem[]>>;
  settings: ExtensionSettings;
  onOpenSettings: () => void;
  onInspectItem: (item: FeedItem) => void;
}

export const BrowserSimulator: React.FC<BrowserSimulatorProps> = ({
  feed,
  setFeed,
  settings,
  onOpenSettings,
  onInspectItem,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'chat'>('all');
  const [pinPromptItem, setPinPromptItem] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [urlInput, setUrlInput] = useState('https://kids-hub.safe-zone.org/feed');
  const [activeInspectionItem, setActiveInspectionItem] = useState<FeedItem | null>(null);

  const filteredFeed = feed.filter((item) => {
    if (activeTab === 'video') return item.type === 'video_card';
    if (activeTab === 'chat') return item.type === 'chat_message' || item.type === 'social_post';
    return true;
  });

  const totalShielded = feed.filter(
    (i) => i.isShielded && settings.isEnabled && !i.isUnlockedByPin
  ).length;

  const handleUnlockPin = (itemId: string) => {
    if (pinInput === settings.parentPin) {
      setFeed((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, isUnlockedByPin: true } : i))
      );
      setPinPromptItem(null);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleResetLocks = () => {
    setFeed((prev) => prev.map((i) => ({ ...i, isUnlockedByPin: false })));
  };

  return (
    <div className="space-y-6">
      {/* Top Context & Educational Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Client-Side Computer Vision Sandbox</span>
            <span aria-hidden="true">·</span>
            <span>Real-Time DOM Interception</span>
            <span aria-hidden="true">·</span>
            <span>Sub-40ms Shielding</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Simulated Browser & Live Interception
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Experience how the SafeLens lightweight browser extension intercepts untrusted DOM nodes,
            runs on-device CV classification, and shields inappropriate images or toxic chat before a child sees them.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleResetLocks}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Overrides</span>
          </button>
          <button
            onClick={onOpenSettings}
            className="px-3 py-1.5 text-xs font-medium text-teal-300 bg-teal-950/60 border border-teal-800/60 rounded-lg hover:bg-teal-900/60 transition-colors flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Profile: {settings.ageGroup.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* Browser Window Mockup */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Browser Top Chrome / Tabs Bar */}
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-4">
          {/* Window control dots */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          {/* URL bar with SafeLens extension badge */}
          <div className="flex-1 max-w-2xl mx-auto flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300">
            <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="bg-transparent border-none text-slate-200 focus:outline-none w-full font-mono text-[11px]"
            />
            <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
              <span className="text-[10px] text-teal-400 font-medium bg-teal-950/80 border border-teal-800/60 px-1.5 py-0.5 rounded">
                SSL 256-bit
              </span>
            </div>
          </div>

          {/* Browser Extension Icons Bar */}
          <div className="flex items-center gap-2">
            <div
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-teal-950/80 border border-teal-500/40 text-teal-300 cursor-pointer hover:bg-teal-900/60 transition-colors"
              title="SafeLens AI Extension: Click to open popup settings"
            >
              <Shield className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-xs font-semibold">SafeLens</span>
              {totalShielded > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-teal-400 text-slate-950 text-[10px] font-bold rounded-full">
                  {totalShielded}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Browser Secondary Controls Bar */}
        <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'all'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Content ({feed.length})
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'video'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PlaySquare className="w-3 h-3" />
              <span>Media Streams</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>Social & Chat</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <span>Active Policy:</span>
            <span className="text-teal-400 font-semibold">{settings.ageGroup.toUpperCase()}</span>
            <span aria-hidden="true">·</span>
            <span>Shield Radius: {settings.blurIntensity}px</span>
          </div>
        </div>

        {/* Web Viewport Content */}
        <div className="p-6 bg-slate-950 min-h-[500px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeed.map((item) => {
              const isCurrentlyShielded =
                item.isShielded && settings.isEnabled && !item.isUnlockedByPin;

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/60 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all duration-200 relative group"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm border border-slate-700">
                        {item.avatar}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-slate-200 leading-tight">
                          {item.author}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {item.domain} · {item.timestamp}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveInspectionItem(item);
                        onInspectItem(item);
                      }}
                      className="p-1.5 text-slate-400 hover:text-teal-300 hover:bg-slate-800 rounded transition-colors"
                      title="Inspect AI Safety Classification Diagnostics"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card Media / Image Slot with Real-Time Preemptive Shielding */}
                  {item.imageUrl && (
                    <div className="relative aspect-video w-full bg-slate-950 overflow-hidden border-b border-slate-800/60">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          isCurrentlyShielded
                            ? 'blur-[22px] scale-110 brightness-75 filter'
                            : 'blur-0 scale-100'
                        }`}
                      />

                      {/* Shield Overlay When Blocked */}
                      {isCurrentlyShielded && (
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                          <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-2 shadow-lg animate-pulse">
                            <ShieldAlert className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-white tracking-wide uppercase">
                            Visual Shield Activated
                          </span>
                          <span className="text-[11px] text-slate-300 mt-1 max-w-[220px] line-clamp-2">
                            {item.simulatedClassification.childFriendlyExplanation}
                          </span>

                          <div className="flex items-center gap-2 mt-3">
                            <button
                              onClick={() => {
                                setPinPromptItem(item.id);
                                setPinInput('');
                                setPinError(false);
                              }}
                              className="px-2.5 py-1 bg-slate-900/90 border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 rounded text-[11px] font-medium transition-colors flex items-center gap-1"
                            >
                              <Lock className="w-3 h-3 text-amber-400" />
                              <span>Parent Unlock</span>
                            </button>
                            <button
                              onClick={() => {
                                setActiveInspectionItem(item);
                                onInspectItem(item);
                              }}
                              className="px-2.5 py-1 bg-teal-950/80 border border-teal-800 text-teal-300 hover:bg-teal-900 rounded text-[11px] font-medium transition-colors flex items-center gap-1"
                            >
                              <Info className="w-3 h-3" />
                              <span>Diagnostics</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Safe Checkmark for clean images */}
                      {!isCurrentlyShielded && item.simulatedClassification.isSafe && (
                        <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 rounded px-2 py-0.5 text-[10px] text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>SafeLens Verified</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card Body & Text Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100 mb-2 leading-snug">
                        {item.title}
                      </h3>

                      {item.content && (
                        <div className="relative">
                          {isCurrentlyShielded && !item.imageUrl ? (
                            <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-800/40 text-xs">
                              <div className="flex items-center gap-2 text-rose-300 font-semibold mb-1">
                                <ShieldAlert className="w-4 h-4 shrink-0" />
                                <span>Message Content Shielded</span>
                              </div>
                              <p className="text-slate-300 text-[11px]">
                                {item.simulatedClassification.childFriendlyExplanation}
                              </p>
                              <div className="mt-2.5 flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setPinPromptItem(item.id);
                                    setPinInput('');
                                    setPinError(false);
                                  }}
                                  className="px-2 py-1 bg-slate-900 border border-slate-700 text-slate-200 rounded text-[10px] font-medium flex items-center gap-1 hover:border-slate-500"
                                >
                                  <Lock className="w-3 h-3 text-amber-400" />
                                  <span>Unlock with PIN</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {item.content}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Metadata Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span>Latency:</span>
                        <span className="font-mono text-teal-400 tabular-nums">
                          {item.simulatedClassification.latencyMs}ms
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{item.simulatedClassification.source}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.isUnlockedByPin && (
                          <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
                            <Unlock className="w-3 h-3" />
                            <span>Unlocked</span>
                          </span>
                        )}
                        <span
                          className={`font-semibold ${
                            item.simulatedClassification.isSafe
                              ? 'text-emerald-400'
                              : item.simulatedClassification.classification === 'critical'
                              ? 'text-rose-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {item.simulatedClassification.primaryCategory.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Parent PIN Prompt Modal */}
      {pinPromptItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Parental PIN Override</h3>
                <p className="text-xs text-slate-400">Default Demo PIN: <code className="text-teal-400 font-mono">1234</code></p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              SafeLens shielded this media node because it triggered child safety rules. Enter your parental PIN to reveal it for this session.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUnlockPin(pinPromptItem);
              }}
              className="space-y-4"
            >
              <div>
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="Enter 4-digit PIN"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-lg px-4 py-2.5 text-center text-xl tracking-widest text-white focus:outline-none font-mono"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs text-rose-400 mt-1.5 text-center">
                    Incorrect PIN. Try <span className="font-mono font-bold">1234</span> for this demo.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPinPromptItem(null)}
                  className="flex-1 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors"
                >
                  Confirm Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Diagnostics Drawer */}
      {activeInspectionItem && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
              <h3 className="text-sm font-bold text-white">
                AI Classification Diagnostics: "{activeInspectionItem.title}"
              </h3>
            </div>
            <button
              onClick={() => setActiveInspectionItem(null)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Close Diagnostics
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                Verdict & Confidence
              </div>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <span
                  className={
                    activeInspectionItem.simulatedClassification.isSafe
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                  }
                >
                  {activeInspectionItem.simulatedClassification.classification.toUpperCase()}
                </span>
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  ({activeInspectionItem.simulatedClassification.confidence}%)
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Action: <span className="text-teal-300 font-mono">{activeInspectionItem.simulatedClassification.suggestedAction}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                Threat Breakdown
              </div>
              <div className="space-y-1.5 text-xs">
                {Object.entries(activeInspectionItem.simulatedClassification.categoryScores).map(
                  ([category, score]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="capitalize text-slate-300">{category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${score > 50 ? 'bg-rose-500' : 'bg-teal-500'}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-slate-400 w-6 text-right tabular-nums">
                          {score}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                Parent & Educator Diagnostic
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeInspectionItem.simulatedClassification.parentalNote}
              </p>
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Inference: {activeInspectionItem.simulatedClassification.latencyMs}ms</span>
                <span>Rating: {activeInspectionItem.simulatedClassification.ageSuitability}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
