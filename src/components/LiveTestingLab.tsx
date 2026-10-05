import React, { useState, useRef } from 'react';
import { ClassificationResult, AgeGroup } from '../types/safeguard';
import { classifyContent } from '../services/api';
import {
  Upload,
  Camera,
  Play,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Sparkles,
  Sliders,
  AlertTriangle,
  Info,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface PresetTest {
  id: string;
  label: string;
  category: string;
  type: 'image' | 'text';
  text?: string;
  imageUrl?: string;
  description: string;
}

const PRESET_TESTS: PresetTest[] = [
  {
    id: 'safe-cartoon',
    label: 'Kid Science Explorer',
    category: 'Clean / Safe',
    type: 'image',
    imageUrl: '/src/assets/images/browser_child_safe_scene_1791215705470.jpg',
    text: 'Learn how astronauts drink water in zero gravity! Space science is fascinating.',
    description: 'Educational STEM content with friendly cartoon imagery.',
  },
  {
    id: 'voxel-game',
    label: 'Voxel Arena Match',
    category: 'Mild Gaming',
    type: 'image',
    imageUrl: '/src/assets/images/gaming_stream_thumbnail_1791215718938.jpg',
    text: 'Check out this fantasy block arena championship match! Great building strategies.',
    description: 'Stylized voxel block game with fantasy elements.',
  },
  {
    id: 'toxic-insult',
    label: 'Toxic Cyberbullying',
    category: 'Cyberbullying',
    type: 'text',
    text: 'You are the most pathetic useless idiot ever. Go cry to your mom and delete your account, nobody wants you here loser.',
    description: 'Aggressive insults and cyberbullying targeting a minor.',
  },
  {
    id: 'grooming-trap',
    label: 'Predatory Grooming',
    category: 'Child Exploitation Alert',
    type: 'text',
    text: 'Hey buddy, keep this our little secret. Don\'t tell your parents. Where do you go to school? Send me a selfie and I will buy you in-game currency.',
    description: 'Classic predator pattern: secret-keeping coercion, asking for location and private photos.',
  },
  {
    id: 'pii-overshare',
    label: 'PII Leakage Risk',
    category: 'Privacy Risk',
    type: 'text',
    text: 'My name is Timmy, I live at 42 Elm Street, Apt 3B, and my mom\'s phone number is 555-0199. My password is gamehero2026.',
    description: 'Unintentional oversharing of sensitive personal contact and credential data.',
  },
];

export const LiveTestingLab: React.FC = () => {
  const [selectedAge, setSelectedAge] = useState<AgeGroup>('explorer');
  const [customText, setCustomText] = useState('');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customImageName, setCustomImageName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [comparisonMode, setComparisonMode] = useState<'both' | 'shielded' | 'unfiltered'>('both');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSelectPreset = (preset: PresetTest) => {
    setCustomText(preset.text || '');
    if (preset.imageUrl) {
      setCustomImage(preset.imageUrl);
      setCustomImageName(preset.label);
    } else {
      setCustomImage(null);
      setCustomImageName('');
    }
    setResult(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomImageName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomImage(event.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 360 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Camera access could not be initialized in this frame. You can upload an image file instead!');
      setIsCameraActive(false);
    }
  };

  const captureCamera = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 480;
    canvas.height = videoRef.current.videoHeight || 360;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCustomImage(dataUrl);
      setCustomImageName('Live Webcam Capture');
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const handleRunInspection = async () => {
    if (!customText && !customImage) {
      alert('Please enter text or select an image to inspect.');
      return;
    }

    setIsLoading(true);
    try {
      const classification = await classifyContent({
        text: customText,
        imageBase64: customImage || undefined,
        ageGroup: selectedAge,
        context: 'Interactive Hackathon Testing Lab for Child Cyber Safety',
      });
      setResult(classification);
    } catch (err) {
      console.error('Inspection failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Multimodal Content Safety Lab</span>
            <span aria-hidden="true">·</span>
            <span>Gemini 3.8 Flash + Edge CV</span>
            <span aria-hidden="true">·</span>
            <span>Zero Data Leakage Architecture</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Real-Time Content Inspection Lab
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Test any sample text, image, or benchmark scenario against the real-time AI classification engine.
            Observe threat taxonomy scores, latency benchmarks, and the automated shield response.
          </p>
        </div>

        {/* Age Profile Selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-lg">
          <span className="text-xs text-slate-400 px-2 font-medium">Child Age Tier:</span>
          {(['sprout', 'explorer', 'navigator'] as AgeGroup[]).map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedAge(tier)}
              className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-colors ${
                selectedAge === tier
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tier} {tier === 'sprout' ? '(4-7)' : tier === 'explorer' ? '(8-12)' : '(13-17)'}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Test Benchmarks */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
          <span>Benchmark Test Scenarios (Click to Load)</span>
          <span className="text-[11px] text-teal-400 font-mono">Curated Safety Corpus</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PRESET_TESTS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className="p-3 bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 rounded-xl text-left transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-teal-300 transition-colors">
                    {preset.label}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-mono">{preset.type}</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-teal-400/80 font-medium">
                {preset.category}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Inspection Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-teal-400" />
              <span>Input Media & Text</span>
            </h3>

            {/* Image Preview & Upload Slot */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Image Element (Simulated DOM Target)
              </label>

              {customImage ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-700 bg-slate-950 group">
                  <img
                    src={customImage}
                    alt="Inspection target"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 bg-slate-800 text-xs text-white rounded hover:bg-slate-700"
                    >
                      Replace Image
                    </button>
                    <button
                      onClick={() => {
                        setCustomImage(null);
                        setCustomImageName('');
                      }}
                      className="px-2.5 py-1 bg-rose-950 text-xs text-rose-300 rounded hover:bg-rose-900"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="absolute bottom-1 left-2 text-[10px] text-slate-300 font-mono bg-slate-950/80 px-1.5 py-0.5 rounded">
                    {customImageName || 'Target Asset'}
                  </div>
                </div>
              ) : isCameraActive ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-teal-500 bg-slate-950">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                    <button
                      onClick={captureCamera}
                      className="px-3 py-1 bg-teal-400 text-slate-950 text-xs font-bold rounded-lg shadow-lg hover:bg-teal-300"
                    >
                      Snap Frame
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-3 py-1 bg-slate-800 text-white text-xs rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video rounded-lg border-2 border-dashed border-slate-800 hover:border-teal-500/50 bg-slate-950/50 flex flex-col items-center justify-center cursor-pointer transition-colors p-4 text-center group"
                >
                  <Upload className="w-6 h-6 text-slate-500 group-hover:text-teal-400 mb-2 transition-colors" />
                  <span className="text-xs font-medium text-slate-300 group-hover:text-white">
                    Upload image or test screenshot
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Supports JPG, PNG, WEBP (DOM &lt;img&gt; elements)
                  </span>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium"
                >
                  <Upload className="w-3 h-3" />
                  <span>Browse File</span>
                </button>
                <span className="text-slate-600">·</span>
                <button
                  type="button"
                  onClick={startCamera}
                  className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium"
                >
                  <Camera className="w-3 h-3" />
                  <span>Webcam Real-Time Frame</span>
                </button>
              </div>
            </div>

            {/* Text Input Slot */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Text Content (Chat, Comment, Search Query, or URL)
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type or paste chat comments, social posts, or search terms to inspect for cyberbullying, slurs, or grooming..."
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none"
              />
            </div>

            {/* Submit Action */}
            <button
              onClick={handleRunInspection}
              disabled={isLoading || (!customText && !customImage)}
              className="w-full py-2.5 px-4 bg-teal-400 hover:bg-teal-300 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-500/10"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Auditing via Gemini 3.8 Flash & Edge CV...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Run Real-Time AI Inspection</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Real-Time Results & Shielding Simulation (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
              {/* Verdict Banner */}
              <div
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  result.isSafe
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                    : result.classification === 'critical'
                    ? 'bg-rose-950/30 border-rose-800/50 text-rose-300'
                    : 'bg-amber-950/20 border-amber-800/40 text-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                      result.isSafe
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400 animate-pulse'
                    }`}
                  >
                    {result.isSafe ? (
                      <ShieldCheck className="w-6 h-6" />
                    ) : (
                      <ShieldAlert className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider font-mono opacity-80">
                      Classifier Verdict
                    </div>
                    <div className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{result.classification.toUpperCase()}</span>
                      <span className="text-xs font-mono opacity-80">
                        ({result.confidence}% Confidence)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end text-xs">
                  <span className="text-slate-400">Extension Shield Action:</span>
                  <span className="font-mono font-bold text-teal-300 uppercase mt-0.5">
                    {result.suggestedAction.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 font-mono">
                    Latency: <strong className="text-teal-400">{result.latencyMs}ms</strong> ({result.source})
                  </span>
                </div>
              </div>

              {/* Visual Side-by-Side Simulation (Unfiltered vs Shielded) */}
              {customImage && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-300">
                      Visual Rendering Comparison (Browser Viewport)
                    </span>
                    <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded border border-slate-800 text-[11px]">
                      <button
                        onClick={() => setComparisonMode('both')}
                        className={`px-2 py-0.5 rounded ${comparisonMode === 'both' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                      >
                        Split View
                      </button>
                      <button
                        onClick={() => setComparisonMode('shielded')}
                        className={`px-2 py-0.5 rounded ${comparisonMode === 'shielded' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                      >
                        Protected View
                      </button>
                      <button
                        onClick={() => setComparisonMode('unfiltered')}
                        className={`px-2 py-0.5 rounded ${comparisonMode === 'unfiltered' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                      >
                        Raw DOM
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(comparisonMode === 'both' || comparisonMode === 'unfiltered') && (
                      <div className="rounded-lg border border-slate-800 overflow-hidden bg-slate-950">
                        <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                          <span>Without Extension (Exposed)</span>
                          <span className="text-rose-400">Unprotected</span>
                        </div>
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={customImage}
                            alt="Unfiltered"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {(comparisonMode === 'both' || comparisonMode === 'shielded') && (
                      <div className="rounded-lg border border-teal-500/40 overflow-hidden bg-slate-950">
                        <div className="px-3 py-1.5 bg-teal-950/60 border-b border-teal-800/40 text-[11px] font-mono text-teal-300 flex items-center justify-between">
                          <span>With SafeLens AI Shield</span>
                          <span className="text-emerald-400 font-semibold">Protected</span>
                        </div>
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={customImage}
                            alt="Shielded view"
                            className={`w-full h-full object-cover transition-all ${
                              !result.isSafe ? 'blur-[24px] scale-110 brightness-75' : 'blur-0'
                            }`}
                          />
                          {!result.isSafe && (
                            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center p-3 text-center">
                              <ShieldAlert className="w-8 h-8 text-rose-400 mb-1" />
                              <span className="text-xs font-bold text-white uppercase tracking-wider">
                                Shielded for Safety
                              </span>
                              <span className="text-[10px] text-slate-300 max-w-[200px] mt-1 line-clamp-2">
                                {result.childFriendlyExplanation}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Explanations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Child-Friendly Note */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold">
                    <Info className="w-3.5 h-3.5" />
                    <span>Child-Safe Educational Prompt</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    "{result.childFriendlyExplanation}"
                  </p>
                </div>

                {/* Parental Diagnostic */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Parent & Audit Log Diagnostic</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {result.parentalNote}
                  </p>
                </div>
              </div>

              {/* Category Threat Taxonomy Scores */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Cyber Safety Risk Taxonomy</span>
                  <span className="text-slate-500 font-mono text-[11px]">Threshold: 45 / 100</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {Object.entries(result.categoryScores).map(([cat, score]) => (
                    <div key={cat} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="capitalize text-slate-300">{cat.replace('_', ' ')}</span>
                        <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                          {score}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full transition-all duration-500 ${
                            score > 50
                              ? 'bg-rose-500'
                              : score > 25
                              ? 'bg-amber-500'
                              : 'bg-teal-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 bg-slate-900/60 border border-slate-800 rounded-xl text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-teal-400 mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Awaiting Inspection Media
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
                Select one of the benchmark scenarios above, upload your own screenshot, or type chat comments to observe real-time AI classification.
              </p>
              <button
                onClick={() => handleSelectPreset(PRESET_TESTS[3])}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
              >
                Try "Predatory Grooming" Benchmark
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
