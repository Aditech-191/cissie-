export type ThreatCategory = 
  | 'clean'
  | 'nsfw'
  | 'cyberbullying'
  | 'violence'
  | 'predatory_grooming'
  | 'toxic_language'
  | 'pii_leakage';

export type SafetyLevel = 'safe' | 'warning' | 'inappropriate' | 'critical';

export type AgeGroup = 'sprout' | 'explorer' | 'navigator';

export type ActionType = 'allow' | 'blur_shield' | 'block_page' | 'notify_parent';

export interface CategoryScores {
  nsfw: number;
  violence: number;
  toxicity: number;
  grooming: number;
  pii: number;
}

export interface ClassificationResult {
  isSafe: boolean;
  classification: SafetyLevel;
  confidence: number;
  primaryCategory: ThreatCategory | string;
  categoryScores: CategoryScores;
  suggestedAction: ActionType;
  childFriendlyExplanation: string;
  parentalNote: string;
  ageSuitability: string;
  latencyMs: number;
  source: 'gemini-3.8-flash' | 'client-edge-fallback' | 'cached-heuristic';
}

export interface FeedItem {
  id: string;
  type: 'video_card' | 'social_post' | 'chat_message' | 'search_result';
  author: string;
  avatar: string;
  title: string;
  content?: string;
  imageUrl?: string;
  timestamp: string;
  simulatedClassification: ClassificationResult;
  isShielded: boolean;
  isUnlockedByPin?: boolean;
  domain: string;
}

export interface ExtensionSettings {
  isEnabled: boolean;
  ageGroup: AgeGroup;
  blurIntensity: number; // 5 to 30px
  strictMode: boolean;
  audioWarning: boolean;
  parentPin: string;
  shieldNsfw: boolean;
  shieldViolence: boolean;
  shieldToxicity: boolean;
  shieldGrooming: boolean;
  shieldPii: boolean;
}

export interface HackathonCodeFile {
  filename: string;
  path: string;
  language: string;
  description: string;
  code: string;
}

export interface PitchSlide {
  id: number;
  title: string;
  timeEstimate: string;
  script: string;
  slideBulletPoints: string[];
  judgeFocus: string;
  proTip: string;
}
