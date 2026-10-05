import React, { useState } from 'react';
import { PitchSlide } from '../types/safeguard';
import {
  Presentation,
  Award,
  Clock,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Target,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const PITCH_SLIDES: PitchSlide[] = [
  {
    id: 1,
    title: 'The Hook & The Crisis: Children in the Unfiltered Web',
    timeEstimate: '0:00 - 0:45 (45 sec)',
    script:
      'Good afternoon judges. 1 in 3 internet users globally is a child. Yet the modern web is built for adults—exposing 8-year-olds to cyberbullying, mature content, and predatory grooming within 3 clicks. Existing parental controls rely on crude DNS blocks that break legitimate sites or invasive spy software that leaks kids\' private data to cloud servers. Today, we are presenting SafeLens AI: the first privacy-first, on-device browser guardian that shields children from inappropriate content in real-time before harmful pixels ever hit their screen.',
    slideBulletPoints: [
      'Problem: 1 in 3 internet users is a child; over 500,000 predatory online approaches occur daily.',
      'Flaw in status quo: DNS blockers are too blunt; cloud surveillance apps breach child privacy.',
      'Our Solution: SafeLens AI — Instant edge computer vision & NLP inside a lightweight Chrome Extension.',
      'UN SDG 16.2 Alignment: Target 16.2 (End abuse, exploitation, and violence against children).',
    ],
    judgeFocus: 'Emotional hook, clear problem urgency, addressable market size.',
    proTip: 'Open with a concrete personal story or statistic. Never start with "Hi, our names are..." Start directly with the problem.',
  },
  {
    id: 2,
    title: 'The Live Demo: Sub-40ms Shielding in Action',
    timeEstimate: '0:45 - 1:45 (60 sec)',
    script:
      'Let me show you how it works in real-time. Notice this simulated video and gaming feed. Without SafeLens, toxic slurs and explicit thumbnails are fully visible. But watch what happens when our lightweight extension runs: our MutationObserver intercepts untrusted DOM nodes at insertion time. Within 28 milliseconds, using on-device quantized computer vision, SafeLens applies a dynamic Gaussian blur shield. The child sees a comforting shield message: "Shielded for your digital safety". And if a parent wants to inspect it, a simple 4-digit PIN reveals the content with a full audit diagnosis.',
    slideBulletPoints: [
      'Live demonstration of DOM element interception using MutationObserver.',
      'Preemptive 28ms visual blur overlay (zero retinal exposure).',
      'Explainable child-friendly badges: "Shielded for safety" vs blunt 404 errors.',
      'Parental PIN override with audit diagnostics.',
    ],
    judgeFocus: 'Technical feasibility, visual "wow" factor, working code rather than slides.',
    proTip: 'Keep your live demo screen ready in a separate tab. If demo crashes, show recorded 5-second video fallback immediately.',
  },
  {
    id: 3,
    title: 'The Secret Sauce: Edge AI & Privacy Architecture',
    timeEstimate: '1:45 - 2:30 (45 sec)',
    script:
      'Under the hood, SafeLens is architected for zero data leakage. Instead of routing a child\'s web traffic to an external server, our extension executes quantized computer vision models like MobileNet and NSFW.js directly inside Chrome using WebGL acceleration. This delivers two breakthrough advantages: first, near-zero latency—classifying in under 40 milliseconds compared to 600ms cloud proxies. Second, absolute COPPA and GDPR compliance: zero browsing history, zero photos, and zero personal credentials ever leave the child\'s device.',
    slideBulletPoints: [
      'Edge WebGL / ONNX runtime: Local model execution directly in browser.',
      'Performance benchmark: 28ms on-device inference vs 650ms cloud roundtrip.',
      'Zero Data Leakage: 100% compliant with COPPA, GDPR-K, and California Age-Appropriate Design Code.',
      'Hybrid fallback: Optional server-side Gemini 3.8 Flash for deep parental threat analysis.',
    ],
    judgeFocus: 'Technical rigor, defensibility, compliance & ethics.',
    proTip: 'Highlight that edge AI makes your operating cost $0 per user. Judges love scalable, free-to-run business models.',
  },
  {
    id: 4,
    title: 'Impact, Scalability & Roadmap',
    timeEstimate: '2:30 - 3:00 (30 sec)',
    script:
      'SafeLens is designed to scale to school Chromebook fleets and family browsers instantly via the Chrome Web Store. Our next milestone is expanding from static media to real-time HTML5 canvas and video stream slicing for platforms like Twitch and YouTube. SafeLens doesn\'t lock kids out of the internet—it gives them a digital guardian so they can explore, learn, and play safely. Thank you, and we welcome your questions!',
    slideBulletPoints: [
      'Distribution: One-click Chrome Web Store install for parents & school MDM (Mobile Device Management) fleets.',
      'Future Roadmap: Real-time WebGL canvas video stream interception for game streaming.',
      'Vision: Empowering kids to explore the digital universe safely and fearlessly.',
    ],
    judgeFocus: 'Long-term vision, commercial or open-source viability, confident closing.',
    proTip: 'End 10 seconds before the buzzer. Judges appreciate teams who respect time limits.',
  },
];

const JUDGE_FAQS = [
  {
    question: 'How do you handle false positives (e.g., blocking medical diagrams or innocent game combat)?',
    answer:
      'We implement a 3-tier age policy (Sprout 4-7, Explorer 8-12, Navigator 13-17). For pre-teens and teens, threshold sensitivity adjusts automatically. Crucially, our parental PIN override allows instant un-shielding, and false positives are cached locally to prevent repeated flagging without ever uploading images to our servers.',
  },
  {
    question: 'Does running computer vision in the browser cause lag or battery drain?',
    answer:
      'We use quantized 8-bit MobileNetV2 and NSFW.js models running over WebGL, consuming less than 4MB of RAM. The content script only triggers on images with dimensions greater than 80x80px, avoiding small UI icons, which keeps CPU overhead below 3%.',
  },
  {
    question: 'Why build a browser extension instead of a DNS filter like NextDNS or Cloudflare Families?',
    answer:
      'DNS filters operate at the domain level: they either block all of YouTube/Reddit or none of it. SafeLens operates at the sub-page DOM level—it lets the child watch the Mars rover landing on YouTube while seamlessly blurring an inappropriate thumbnail in the recommendation sidebar.',
  },
];

export const PitchDeckGuide: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState<number>(1);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const currentSlideData = PITCH_SLIDES.find((s) => s.id === activeSlide) || PITCH_SLIDES[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <span>Competition Winning Strategy</span>
          <span aria-hidden="true">·</span>
          <span>3-Minute Pitch Script</span>
          <span aria-hidden="true">·</span>
          <span>Judge Scoring Rubric</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Hackathon Pitch Playbook & Judge Rubric
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mt-1">
          Learn how to present SafeLens AI to hackathon judges. Use our verbatim 3-minute pitch script,
          learn how judges score, and study answers to tough technical questions.
        </p>
      </div>

      {/* 3-Minute Pitch Presentation Deck */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Presentation className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-bold text-white">
              The 3-Minute Pitch Deck (Word-for-Word Script)
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            {PITCH_SLIDES.map((slide) => (
              <button
                key={slide.id}
                onClick={() => setActiveSlide(slide.id)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  activeSlide === slide.id
                    ? 'bg-teal-400 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Slide {slide.id}
              </button>
            ))}
          </div>
        </div>

        {/* Slide Content Card */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono text-teal-400">
                {currentSlideData.timeEstimate}
              </span>
              <h4 className="text-lg font-bold text-white mt-0.5">
                {currentSlideData.title}
              </h4>
            </div>

            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300">
              <span className="text-slate-500">Judge Criterion: </span>
              <strong className="text-teal-300">{currentSlideData.judgeFocus}</strong>
            </div>
          </div>

          {/* Slide Visual Bullet Points */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Slide Visual Bullets (Display on Screen)
            </div>
            <ul className="space-y-2">
              {currentSlideData.slideBulletPoints.map((bullet, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Spoken Word-for-Word Script */}
          <div className="p-5 bg-teal-950/20 border border-teal-800/40 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Presenter Word-for-Word Pitch Script</span>
              </span>
              <span className="text-[11px] font-mono text-teal-400">Memorize & Rehearse</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans italic">
              "{currentSlideData.script}"
            </p>
          </div>

          {/* Presenter Pro-Tip */}
          <div className="p-3 bg-amber-950/20 border border-amber-800/30 rounded-lg text-xs text-amber-300 flex items-center gap-2">
            <Award className="w-4 h-4 shrink-0" />
            <span><strong>Hackathon Pro Tip:</strong> {currentSlideData.proTip}</span>
          </div>
        </div>
      </div>

      {/* Judge Scoring Rubric Matrix */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-teal-400" />
          <span>Hackathon Judge Scoring Rubric Alignment</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-300">Social Impact (25%)</span>
              <Target className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tackles UN SDG 16.2. Directly prevents cyberbullying, predatory grooming, and violent trauma for minors.
            </p>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-300">Technical Rigor (25%)</span>
              <Cpu className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manifest V3 content scripts, MutationObserver DOM interception, WebGL client-side tensor inference.
            </p>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-300">Innovation & Privacy (25%)</span>
              <Sparkles className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero cloud telemetry. Browsing data never leaves the laptop, setting a new benchmark for kid-safe tech.
            </p>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-300">UX & Design (25%)</span>
              <Presentation className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gentle, non-traumatizing visual shielding, friendly explanations, and an intuitive parental PIN unlock flow.
            </p>
          </div>
        </div>
      </div>

      {/* Tough Judge Questions & Answers */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-teal-400" />
          <span>Tough Judge Q&A Defense Strategy</span>
        </h3>

        <div className="space-y-3">
          {JUDGE_FAQS.map((faq, index) => {
            const isExpanded = expandedFaq === index;
            return (
              <div
                key={index}
                className="rounded-lg border border-slate-800 bg-slate-950 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-bold text-slate-200 hover:text-teal-300 transition-colors"
                >
                  <span>Q: {faq.question}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-300 border-t border-slate-800/80 leading-relaxed">
                    <strong className="text-teal-400 block mb-1">Recommended Response:</strong>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function Cpu(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <path d="M15 2v2" />
      <path d="M15 20v2" />
      <path d="M2 15h2" />
      <path d="M2 9h2" />
      <path d="M20 15h2" />
      <path d="M20 9h2" />
      <path d="M9 2v2" />
      <path d="M9 20v2" />
    </svg>
  );
}
