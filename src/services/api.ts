import { ClassificationResult, AgeGroup } from '../types/safeguard';

export interface ClassifyPayload {
  text?: string;
  imageBase64?: string;
  mimeType?: string;
  ageGroup?: AgeGroup;
  context?: string;
}

export async function classifyContent(payload: ClassifyPayload): Promise<ClassificationResult> {
  const startTime = performance.now();
  try {
    const res = await fetch('/api/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data: ClassificationResult = await res.json();
    return data;
  } catch (error) {
    console.warn('Backend classify unreachable, running edge fallback:', error);
    // Local fast heuristic fallback
    return localClientHeuristic(payload.text, !!payload.imageBase64, payload.ageGroup || 'explorer', Math.round(performance.now() - startTime));
  }
}

function localClientHeuristic(text?: string, hasImage?: boolean, ageGroup: AgeGroup = 'explorer', elapsed: number = 24): ClassificationResult {
  const t = (text || '').toLowerCase();
  
  const toxicKeywords = ['idiot', 'stupid', 'hate you', 'loser', 'kill yourself', 'die', 'shut up', 'ugly', 'trash'];
  const violenceKeywords = ['gun', 'knife', 'blood', 'shoot', 'murder', 'kill', 'gore', 'weapon', 'attack'];
  const groomingKeywords = ['send me a photo', 'keep it secret', 'dont tell your parents', "what's your address", 'where do you live', 'are you alone', 'how old are you'];
  const piiKeywords = ['my password is', 'credit card', 'social security', 'phone number', 'live at street'];
  const nsfwKeywords = ['nude', 'naked', 'porn', 'sex', 'nsfw', 'xxx'];

  const matchedToxicity = toxicKeywords.filter(k => t.includes(k));
  const matchedViolence = violenceKeywords.filter(k => t.includes(k));
  const matchedGrooming = groomingKeywords.filter(k => t.includes(k));
  const matchedPii = piiKeywords.filter(k => t.includes(k));
  const matchedNsfw = nsfwKeywords.filter(k => t.includes(k));

  if (matchedGrooming.length > 0) {
    return {
      isSafe: false,
      classification: 'critical',
      confidence: 97,
      primaryCategory: 'predatory_grooming',
      categoryScores: { nsfw: 12, violence: 15, toxicity: 65, grooming: 97, pii: 80 },
      suggestedAction: 'block_page',
      childFriendlyExplanation: 'SafeLens blocked this message because someone might be asking for private details or asking to keep secrets. Remember: never share personal secrets online!',
      parentalNote: `Critical risk detected: Grooming phrase signature [${matchedGrooming.join(', ')}]. Contact blocked and logged.`,
      ageSuitability: 'Restricted',
      latencyMs: elapsed,
      source: 'client-edge-fallback',
    };
  }

  if (matchedNsfw.length > 0) {
    return {
      isSafe: false,
      classification: 'inappropriate',
      confidence: 95,
      primaryCategory: 'nsfw',
      categoryScores: { nsfw: 95, violence: 10, toxicity: 20, grooming: 30, pii: 5 },
      suggestedAction: 'blur_shield',
      childFriendlyExplanation: 'This image or text contains mature elements not meant for younger explorers. Shielded for your digital well-being.',
      parentalNote: `Inappropriate adult content flagged: [${matchedNsfw.join(', ')}]. Visual shield activated.`,
      ageSuitability: '18+ Restricted',
      latencyMs: elapsed,
      source: 'client-edge-fallback',
    };
  }

  if (matchedViolence.length > 0) {
    return {
      isSafe: false,
      classification: ageGroup === 'sprout' ? 'inappropriate' : 'warning',
      confidence: 91,
      primaryCategory: 'violence',
      categoryScores: { nsfw: 10, violence: 89, toxicity: 35, grooming: 10, pii: 5 },
      suggestedAction: 'blur_shield',
      childFriendlyExplanation: 'SafeLens blurred this because it depicts intense conflict or weapons.',
      parentalNote: `Violence/weapons detected: [${matchedViolence.join(', ')}]. Shielded according to ${ageGroup} profile.`,
      ageSuitability: '16+',
      latencyMs: elapsed,
      source: 'client-edge-fallback',
    };
  }

  if (matchedToxicity.length > 0) {
    return {
      isSafe: false,
      classification: 'warning',
      confidence: 88,
      primaryCategory: 'toxic_language',
      categoryScores: { nsfw: 5, violence: 25, toxicity: 88, grooming: 15, pii: 5 },
      suggestedAction: 'blur_shield',
      childFriendlyExplanation: 'Someone used unkind words here. We covered it so you can enjoy a friendlier internet!',
      parentalNote: `Toxicity/Cyberbullying tokens detected: [${matchedToxicity.join(', ')}].`,
      ageSuitability: '13+',
      latencyMs: elapsed,
      source: 'client-edge-fallback',
    };
  }

  if (matchedPii.length > 0) {
    return {
      isSafe: false,
      classification: 'warning',
      confidence: 93,
      primaryCategory: 'pii_leakage',
      categoryScores: { nsfw: 2, violence: 2, toxicity: 10, grooming: 40, pii: 94 },
      suggestedAction: 'blur_shield',
      childFriendlyExplanation: 'Looks like someone might be sharing private information like passwords or addresses. Shielding for privacy.',
      parentalNote: 'Potential PII oversharing detected.',
      ageSuitability: 'Sensitive',
      latencyMs: elapsed,
      source: 'client-edge-fallback',
    };
  }

  return {
    isSafe: true,
    classification: 'safe',
    confidence: 96,
    primaryCategory: 'clean',
    categoryScores: { nsfw: 2, violence: 4, toxicity: 3, grooming: 1, pii: 2 },
    suggestedAction: 'allow',
    childFriendlyExplanation: 'This content looks safe, friendly, and appropriate for you to view!',
    parentalNote: 'Content passed baseline automated heuristic safety screening.',
    ageSuitability: 'All Ages',
    latencyMs: elapsed,
    source: 'client-edge-fallback',
  };
}
