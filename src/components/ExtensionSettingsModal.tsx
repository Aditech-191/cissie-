import React, { useState } from 'react';
import { ExtensionSettings, AgeGroup } from '../types/safeguard';
import {
  Shield,
  X,
  Lock,
  Sliders,
  AlertTriangle,
  Check,
  Eye,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface ExtensionSettingsModalProps {
  settings: ExtensionSettings;
  setSettings: React.Dispatch<React.SetStateAction<ExtensionSettings>>;
  isOpen: boolean;
  onClose: () => void;
}

export const ExtensionSettingsModal: React.FC<ExtensionSettingsModalProps> = ({
  settings,
  setSettings,
  isOpen,
  onClose,
}) => {
  const [pinInput, setPinInput] = useState(settings.parentPin);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  if (!isOpen) return null;

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings((prev) => ({ ...prev, parentPin: pinInput }));
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Shield className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">
                SafeLens AI Extension Policy
              </h3>
              <p className="text-xs text-slate-400">
                Configure browser-level shielding parameters
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Master Protection Toggle */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block text-sm">
                Real-Time DOM Protection
              </span>
              <span className="text-slate-400 text-xs">
                Automatically scans and shields media nodes upon insertion
              </span>
            </div>

            <button
              onClick={() =>
                setSettings((prev) => ({ ...prev, isEnabled: !prev.isEnabled }))
              }
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.isEnabled ? 'bg-teal-400' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                  settings.isEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Age Group Policy Tier */}
          <div>
            <label className="font-bold text-white block mb-2 text-xs uppercase tracking-wider text-slate-400">
              Child Protection Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  id: 'sprout' as AgeGroup,
                  label: 'Sprout',
                  range: '4-7 yrs',
                  desc: 'Maximum shield: blocks all mild gaming violence & unfamiliar links',
                },
                {
                  id: 'explorer' as AgeGroup,
                  label: 'Explorer',
                  range: '8-12 yrs',
                  desc: 'Balanced shield: blocks cyberbullying, mature themes & grooming',
                },
                {
                  id: 'navigator' as AgeGroup,
                  label: 'Navigator',
                  range: '13-17 yrs',
                  desc: 'Autonomy shield: blocks self-harm, coercion & predatory contact',
                },
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, ageGroup: tier.id }))
                  }
                  className={`p-3 rounded-xl border text-left transition-all ${
                    settings.ageGroup === tier.id
                      ? 'bg-teal-950/40 border-teal-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs text-white">{tier.label}</div>
                  <div className="text-[10px] text-teal-400 font-mono mt-0.5">
                    {tier.range}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-tight">
                    {tier.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Shield Blur Intensity Slider */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">
                Visual Shield Blur Intensity
              </span>
              <span className="font-mono text-teal-400 font-bold tabular-nums">
                {settings.blurIntensity}px
              </span>
            </div>
            <input
              type="range"
              min={8}
              max={32}
              value={settings.blurIntensity}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  blurIntensity: Number(e.target.value),
                }))
              }
              className="w-full accent-teal-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>8px (Subtle)</span>
              <span>20px (Recommended)</span>
              <span>32px (Complete Opaque)</span>
            </div>
          </div>

          {/* Active Shield Threat Categories */}
          <div>
            <label className="font-bold text-white block mb-2 text-xs uppercase tracking-wider text-slate-400">
              Active Shield Categories
            </label>
            <div className="space-y-2">
              {[
                { key: 'shieldGrooming' as const, label: 'Predatory Grooming & Unsafe Contact', desc: 'Soliciting secrets, personal photos, or addresses' },
                { key: 'shieldNsfw' as const, label: 'Inappropriate Adult Content (NSFW)', desc: 'Explicit or mature imagery' },
                { key: 'shieldViolence' as const, label: 'Extreme Violence & Weapons', desc: 'Graphic combat, blood, and weapons' },
                { key: 'shieldToxicity' as const, label: 'Cyberbullying & Hate Speech', desc: 'Hostile insults, threats, and harassment' },
                { key: 'shieldPii' as const, label: 'Personal Information Leakage (PII)', desc: 'Passwords, credit cards, or home addresses' },
              ].map((cat) => (
                <label
                  key={cat.key}
                  className="flex items-start gap-3 p-3 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={settings[cat.key]}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, [cat.key]: e.target.checked }))
                    }
                    className="accent-teal-400 w-4 h-4 rounded mt-0.5"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-slate-200 block text-xs">
                      {cat.label}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {cat.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Parental PIN Override Settings */}
          <form onSubmit={handleSavePin} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Parental PIN Override</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Parents use this 4-digit code to immediately un-shield content on the child's screen during review.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-center font-mono text-sm tracking-widest text-white w-28 focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Update PIN
              </button>
              {showSavedFeedback && (
                <span className="text-emerald-400 text-xs flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Saved</span>
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs rounded-lg transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
