import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Shield,
  Eye,
  Lock,
  ArrowRight,
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Zap,
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(2);

  const steps = [
    {
      id: 1,
      title: 'DOM Mutation Observer',
      subtitle: 'Content Script (document_start)',
      time: '~4ms',
      icon: Eye,
      description:
        'As the browser fetches HTML chunks, the MutationObserver intercepts new <img>, <video>, and chat text nodes before the browser finishes rendering them to the screen.',
      technicalDetails: [
        'Runs at document_start in Manifest V3',
        'Applies temporary CSS containment (filter: blur(12px)) if strict mode',
        'Extracts src URL or ImageBitmap via OffscreenCanvas',
      ],
    },
    {
      id: 2,
      title: 'Edge Computer Vision & NLP',
      subtitle: 'WebGL / WebAssembly Pipeline',
      time: '~24ms',
      icon: Cpu,
      description:
        'The image is downscaled to 224x224 and evaluated by pre-trained quantized neural networks running directly on the user’s GPU via WebGL shaders.',
      technicalDetails: [
        'Model: NSFW.js + MobileNetV2 (quantized to 8-bit, ~4MB total)',
        'Zero network requests: 100% on-device tensor processing',
        'Latency benchmark: 22ms - 35ms on standard laptops',
      ],
    },
    {
      id: 3,
      title: 'Dynamic Shielding Policy',
      subtitle: 'Age Tier Evaluation',
      time: '~2ms',
      icon: Shield,
      description:
        'Classification scores are compared against the active child profile (Sprout 4-7, Explorer 8-12, or Navigator 13-17). If thresholds are exceeded, the visual shield locks.',
      technicalDetails: [
        'Permanent Gaussian blur (18px) + overlay badge',
        'Gentle, empowering kid explanation (no scary error codes)',
        'Injects Parental PIN bypass handler for adult review',
      ],
    },
    {
      id: 4,
      title: 'Parental Audit & Gemini Escalation',
      subtitle: 'Hybrid Verification (Optional)',
      time: '~380ms',
      icon: Cloud,
      description:
        'When an ambiguous or critical threat (such as predatory grooming or coercion) is flagged, an encrypted perceptual hash can be evaluated by Gemini 3.8 Flash for deep explainability.',
      technicalDetails: [
        'Structured JSON response via @google/genai SDK',
        'Categorizes into cyberbullying, weapon hazard, or grooming trap',
        'Zero personal credentials or child PII ever shared',
      ],
    },
    {
      id: 5,
      title: 'Local Encrypted Storage',
      subtitle: 'chrome.storage.local',
      time: '~1ms',
      icon: Database,
      description:
        'Incident counters and PIN preferences are saved locally on the client machine. The parent can view daily safety statistics on the extension popup.',
      technicalDetails: [
        'Scoped to extension sandbox',
        'Stores shielded item counter and parent PIN hash',
        'No external analytics, tracking cookies, or ads',
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <span>System Design & Technical Architecture</span>
          <span aria-hidden="true">·</span>
          <span>Zero-Leakage Pipeline</span>
          <span aria-hidden="true">·</span>
          <span>Latency Waterfall</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          SafeLens AI Architectural Pipeline
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mt-1">
          How a client-side Chrome Extension achieves real-time visual classification in under 40ms
          without compromising child privacy or sending data to third-party clouds.
        </p>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Real-Time Dataflow & Interception Waterfall
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === step.id;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`p-4 rounded-xl text-left transition-all duration-200 border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-teal-950/40 border-teal-500/60 shadow-lg shadow-teal-500/10'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? 'bg-teal-400 text-slate-950'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono text-teal-400 tabular-nums">
                      {step.time}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-1 leading-snug">
                    {step.title}
                  </h4>
                  <div className="text-[10px] text-slate-400">
                    {step.subtitle}
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                  <span>Step 0{step.id}</span>
                  {idx < steps.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-slate-600 hidden md:inline" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Deep Dive */}
        {(() => {
          const current = steps.find((s) => s.id === activeStep) || steps[0];
          const CurrentIcon = current.icon;

          return (
            <div className="p-5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                    <CurrentIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Step {current.id}: {current.title}
                    </h4>
                    <span className="text-xs text-slate-400">{current.subtitle}</span>
                  </div>
                </div>

                <div className="text-xs font-mono text-teal-300 bg-teal-950/80 px-2.5 py-1 rounded border border-teal-800/60">
                  Execution Budget: {current.time}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {current.description}
              </p>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Technical Specifications & Invariants
                </span>
                <ul className="space-y-1.5">
                  {current.technicalDetails.map((detail, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Latency Comparison Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-teal-400" />
              <span>SafeLens On-Device Edge CV</span>
            </span>
            <span className="text-xs font-mono text-teal-400 font-bold">~28ms Latency</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
            <div className="h-full bg-teal-400 rounded-full" style={{ width: '8%' }} />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Interception occurs inside the browser engine before paint. The child experiences zero noticeable flicker, and data never leaves device memory.
          </p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Cloud className="w-4 h-4 text-slate-500" />
              <span>Traditional Cloud Proxy Filter</span>
            </span>
            <span className="text-xs font-mono text-rose-400 font-bold">~550ms Latency</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 rounded-full" style={{ width: '85%' }} />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Requires roundtrip network latency, server queueing, and leaks children's IP address and full browsing history to commercial servers.
          </p>
        </div>
      </div>
    </div>
  );
};
