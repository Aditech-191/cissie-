import React, { useState } from 'react';
import { hackathonStarterFiles } from '../data/hackathonCode';
import { HackathonCodeFile } from '../types/safeguard';
import {
  FileCode,
  Copy,
  Check,
  Download,
  FolderTree,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  ChevronRight,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export const HackathonStarterKit: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<HackathonCodeFile>(hackathonStarterFiles[0]);
  const [copiedFilename, setCopiedFilename] = useState<string | null>(null);

  const handleCopy = (file: HackathonCodeFile) => {
    navigator.clipboard.writeText(file.code);
    setCopiedFilename(file.filename);
    setTimeout(() => setCopiedFilename(null), 2000);
  };

  const handleDownloadAll = () => {
    // Combine all files into a single text bundle or download each
    const bundleText = hackathonStarterFiles
      .map((f) => `// ==========================================\n// FILE: ${f.path}\n// ==========================================\n\n${f.code}\n\n`)
      .join('\n');

    const blob = new Blob([bundleText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'safelens-hackathon-extension-bundle.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Beginner Hackathon Competition Starter Kit</span>
            <span aria-hidden="true">·</span>
            <span>Manifest V3</span>
            <span aria-hidden="true">·</span>
            <span>Pre-trained Edge CV</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Browser Extension Codebase & Build Blueprint
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Everything your beginner hackathon team needs to submit and pitch a winning child cyber safety project.
            Copy ready-to-run Manifest V3 code, inspect pre-trained CV pipelines, and follow the 5-minute setup guide.
          </p>
        </div>

        <button
          onClick={handleDownloadAll}
          className="px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-2 self-start md:self-auto shadow-lg shadow-teal-500/10"
        >
          <Download className="w-4 h-4" />
          <span>Download All Code (.txt bundle)</span>
        </button>
      </div>

      {/* Why This Project Wins Hackathons (Judge Appeal Section) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-xs font-mono">
            01
          </div>
          <h3 className="text-sm font-bold text-white">Zero Server Cost & 100% Privacy</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Judges penalize cloud-heavy apps that send children's browsing data or selfies to external servers.
            SafeLens runs quantized models on the client via WebGL. Private, COPPA-compliant, and free to host!
          </p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-xs font-mono">
            02
          </div>
          <h3 className="text-sm font-bold text-white">Sub-40ms Real-Time Shielding</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            By leveraging a MutationObserver in a Manifest V3 content script, you blur DOM nodes before the child’s retina registers harmful pixels, proving technical depth.
          </p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-xs font-mono">
            03
          </div>
          <h3 className="text-sm font-bold text-white">Interactive Parental Reveal Demo</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Judges love live physical interaction: during your 3-minute pitch, show a blurred dangerous feed, type the PIN "1234", and show instant parental unlock with audit logs.
          </p>
        </div>
      </div>

      {/* Code Explorer Interface */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* File Tree Navigation (4 cols) */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 bg-slate-950/60">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-teal-400" />
              <span>Project Files (Manifest V3)</span>
            </div>

            <div className="space-y-1.5">
              {hackathonStarterFiles.map((file) => (
                <button
                  key={file.filename}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between transition-colors ${
                    selectedFile.filename === file.filename
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{file.path}</span>
                  </div>
                  <span className="text-[10px] uppercase text-slate-500 ml-2">
                    {file.language}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <div className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                <span>How to Run in Chrome</span>
              </div>
              <ol className="text-[11px] text-slate-400 space-y-2 list-decimal list-inside leading-relaxed">
                <li>Create a folder named <code className="text-teal-300 font-mono">extension</code>.</li>
                <li>Save the 5 files below into that folder.</li>
                <li>Go to <code className="text-teal-300 font-mono">chrome://extensions</code>.</li>
                <li>Enable <strong className="text-slate-200">Developer mode</strong> (top right).</li>
                <li>Click <strong className="text-slate-200">Load unpacked</strong> & choose folder.</li>
              </ol>
            </div>
          </div>

          {/* Active Code Viewer (8 cols) */}
          <div className="lg:col-span-8 flex flex-col bg-slate-950">
            {/* Code Header */}
            <div className="px-5 py-3 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white font-mono">
                  {selectedFile.path}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {selectedFile.description}
                </p>
              </div>

              <button
                onClick={() => handleCopy(selectedFile)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 border border-slate-700"
              >
                {copiedFilename === selectedFile.filename ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy File</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Content */}
            <div className="p-4 overflow-x-auto max-h-[520px] font-mono text-xs text-slate-300 leading-relaxed">
              <pre className="selection:bg-teal-500/30">
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Pre-Trained Models for Beginners */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-teal-400" />
            <span>Recommended Pre-Trained Models for Hackathons</span>
          </h3>
          <span className="text-xs text-slate-400">No Custom Model Training Required</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-300">NSFW.js (TensorFlow.js)</span>
              <span className="text-[10px] font-mono text-slate-400">~4 MB</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trained on 5 classes (Neutral, Drawing, Sexy, Porn, Hentai). Runs directly in Chrome via WebGL at 60 FPS.
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              <code>npm i nsfwjs @tensorflow/tfjs</code>
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-300">MobileNetV2 (Edge CV)</span>
              <span className="text-[10px] font-mono text-slate-400">~3.5 MB</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ultra-compact vision backbone for detecting weapons, knives, and suspicious everyday hazard objects.
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              <code>tf.loadLayersModel('mobilenet_v2')</code>
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-300">TF.js Toxicity Classifier</span>
              <span className="text-[10px] font-mono text-slate-400">~1.8 MB</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects toxic comments, insults, threats, and cyberbullying directly in the browser content script without server calls.
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              <code>@tensorflow-models/toxicity</code>
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-300">Gemini 3.8 Flash Hybrid</span>
              <span className="text-[10px] font-mono text-teal-400">Cloud Fallback</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              For complex contextual nuances (grooming coercion, subtle sarcasm), forward flagged hashes to Gemini for parental diagnostics.
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              <code>ai.models.generateContent()</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
