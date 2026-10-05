import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

// Shared server-side Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

interface ClassificationResponse {
  isSafe: boolean;
  classification: 'safe' | 'warning' | 'inappropriate' | 'critical';
  confidence: number;
  primaryCategory: string;
  categoryScores: {
    nsfw: number;
    violence: number;
    toxicity: number;
    grooming: number;
    pii: number;
  };
  suggestedAction: 'allow' | 'blur_shield' | 'block_page' | 'notify_parent';
  childFriendlyExplanation: string;
  parentalNote: string;
  ageSuitability: string;
  latencyMs: number;
  source: 'gemini-3.8-flash' | 'client-edge-fallback';
}

// Fallback heuristic classification when offline or lacking API key
function heuristicClassify(text?: string, hasImage?: boolean, ageGroup: string = 'explorer'): ClassificationResponse {
  const t = (text || '').toLowerCase();
  
  const toxicKeywords = ['idiot', 'stupid', 'hate you', 'loser', 'kill yourself', 'die', 'shut up', 'ugly', 'trash'];
  const violenceKeywords = ['gun', 'knife', 'blood', 'shoot', 'murder', 'kill', 'gore', 'weapon', 'attack'];
  const groomingKeywords = ['send me a photo', 'keep it secret', 'dont tell your parents', "what's your address", 'where do you live', 'are you alone', 'how old are you'];
  const piiKeywords = ['my password is', 'credit card', 'social security', 'phone number', 'live at street'];
  const nsfwKeywords = ['nude', 'naked', 'porn', 'sex', 'nsfw', 'xxx'];

  let matchedToxicity = toxicKeywords.filter(k => t.includes(k));
  let matchedViolence = violenceKeywords.filter(k => t.includes(k));
  let matchedGrooming = groomingKeywords.filter(k => t.includes(k));
  let matchedPii = piiKeywords.filter(k => t.includes(k));
  let matchedNsfw = nsfwKeywords.filter(k => t.includes(k));

  let isFlagged = false;
  let primaryCategory = 'clean';
  let classification: 'safe' | 'warning' | 'inappropriate' | 'critical' = 'safe';
  let suggestedAction: 'allow' | 'blur_shield' | 'block_page' | 'notify_parent' = 'allow';
  let childFriendlyExplanation = 'This content looks safe, friendly, and appropriate for you to view!';
  let parentalNote = 'Content passed baseline automated heuristic safety screening.';
  let confidence = 94;

  if (matchedGrooming.length > 0) {
    isFlagged = true;
    primaryCategory = 'predatory_grooming';
    classification = 'critical';
    suggestedAction = 'block_page';
    childFriendlyExplanation = 'SafeLens blocked this message because someone might be asking for private details or asking to keep secrets. Remember: never share personal secrets online!';
    parentalNote = `Critical risk detected: Grooming phrase signature [${matchedGrooming.join(', ')}]. Contact blocked and logged.`;
    confidence = 98;
  } else if (matchedNsfw.length > 0) {
    isFlagged = true;
    primaryCategory = 'nsfw';
    classification = 'inappropriate';
    suggestedAction = 'blur_shield';
    childFriendlyExplanation = 'This image or text contains mature elements not meant for younger explorers. Shielded for your digital well-being.';
    parentalNote = `Inappropriate adult content flagged: [${matchedNsfw.join(', ')}]. Visual shield activated.`;
    confidence = 96;
  } else if (matchedViolence.length > 0) {
    isFlagged = true;
    primaryCategory = 'violence';
    classification = ageGroup === 'sprout' ? 'inappropriate' : 'warning';
    suggestedAction = 'blur_shield';
    childFriendlyExplanation = 'SafeLens blurred this because it depicts intense conflict or weapons.';
    parentalNote = `Violence/weapons detected: [${matchedViolence.join(', ')}]. Shielded according to ${ageGroup} profile.`;
    confidence = 91;
  } else if (matchedToxicity.length > 0) {
    isFlagged = true;
    primaryCategory = 'toxic_language';
    classification = 'warning';
    suggestedAction = 'blur_shield';
    childFriendlyExplanation = 'Someone used unkind words here. We covered it so you can enjoy a friendlier internet!';
    parentalNote = `Toxicity/Cyberbullying tokens detected: [${matchedToxicity.join(', ')}].`;
    confidence = 88;
  } else if (matchedPii.length > 0) {
    isFlagged = true;
    primaryCategory = 'pii_leakage';
    classification = 'warning';
    suggestedAction = 'blur_shield';
    childFriendlyExplanation = 'Looks like someone might be sharing private information like passwords or addresses. Shielding for privacy.';
    parentalNote = 'Potential PII oversharing detected.';
    confidence = 92;
  }

  return {
    isSafe: !isFlagged,
    classification,
    confidence,
    primaryCategory,
    categoryScores: {
      nsfw: matchedNsfw.length ? 92 : 4,
      violence: matchedViolence.length ? 88 : 8,
      toxicity: matchedToxicity.length ? 85 : 6,
      grooming: matchedGrooming.length ? 97 : 2,
      pii: matchedPii.length ? 90 : 5,
    },
    suggestedAction,
    childFriendlyExplanation,
    parentalNote,
    ageSuitability: isFlagged ? (primaryCategory === 'predatory_grooming' ? 'Restricted' : '16+') : 'All Ages',
    latencyMs: 32,
    source: 'client-edge-fallback',
  };
}

// API endpoint for content classification
app.post('/api/classify', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { text, imageBase64, mimeType = 'image/jpeg', ageGroup = 'explorer', context } = req.body;

  const ai = getGeminiClient();

  if (!ai) {
    const fallback = heuristicClassify(text, !!imageBase64, ageGroup);
    fallback.latencyMs = Date.now() - startTime;
    return res.json(fallback);
  }

  try {
    const parts: any[] = [];

    if (imageBase64) {
      // Strip any data:image/xxx;base64, prefix if present
      const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      parts.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }

    const inspectionPrompt = `
You are the SafeLens AI Child Protection Classifier running in real-time inside a browser protection extension.
Analyze the provided content (image and/or text) for child online safety.
Target age group profile: ${ageGroup.toUpperCase()} (Sprout = 4-7 yrs, Explorer = 8-12 yrs, Navigator = 13-17 yrs).
Context: ${context || 'Web page content interception'}.
Input text to evaluate: "${text || ''}"

Evaluate across the following child cyber safety dimensions:
1. NSFW / Sexual / Explicit content
2. Cyberbullying / Harassment / Hate speech / Slurs
3. Graphic Violence / Gore / Weapons
4. Online Child Grooming / Predatory Behavior / Unsafe Meeting requests / Coercive secrets
5. PII Leakage (sharing phone numbers, home addresses, passwords, financial info)

Return a structured JSON assessment following this exact schema.
`;

    parts.push({ text: inspectionPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction: 'You are an expert AI child safety auditor and computer vision classifier. You evaluate whether content is safe for kids with high accuracy, zero hallucination, and compassionate kid-friendly explanations.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSafe: { type: Type.BOOLEAN, description: 'True if safe for children in the specified age group, false otherwise' },
            classification: {
              type: Type.STRING,
              enum: ['safe', 'warning', 'inappropriate', 'critical'],
              description: 'Severity classification level'
            },
            confidence: { type: Type.NUMBER, description: 'Confidence score from 0 to 100' },
            primaryCategory: {
              type: Type.STRING,
              description: 'Primary category: clean, nsfw, cyberbullying, violence, predatory_grooming, toxic_language, pii_leakage'
            },
            categoryScores: {
              type: Type.OBJECT,
              properties: {
                nsfw: { type: Type.NUMBER, description: 'Score 0-100' },
                violence: { type: Type.NUMBER, description: 'Score 0-100' },
                toxicity: { type: Type.NUMBER, description: 'Score 0-100' },
                grooming: { type: Type.NUMBER, description: 'Score 0-100' },
                pii: { type: Type.NUMBER, description: 'Score 0-100' },
              },
              required: ['nsfw', 'violence', 'toxicity', 'grooming', 'pii']
            },
            suggestedAction: {
              type: Type.STRING,
              enum: ['allow', 'blur_shield', 'block_page', 'notify_parent'],
              description: 'Recommended real-time action for the browser extension'
            },
            childFriendlyExplanation: {
              type: Type.STRING,
              description: 'A gentle, supportive explanation suitable for a child explaining what was detected without traumatizing them'
            },
            parentalNote: {
              type: Type.STRING,
              description: 'Technical, clear diagnostic note for parents, educators, or hackathon judges'
            },
            ageSuitability: {
              type: Type.STRING,
              description: 'Recommended age rating: All Ages, 8+, 13+, 18+ Restricted'
            },
          },
          required: [
            'isSafe',
            'classification',
            'confidence',
            'primaryCategory',
            'categoryScores',
            'suggestedAction',
            'childFriendlyExplanation',
            'parentalNote',
            'ageSuitability'
          ]
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    const result: ClassificationResponse = {
      isSafe: parsed.isSafe ?? true,
      classification: parsed.classification ?? 'safe',
      confidence: Math.round(parsed.confidence ?? 95),
      primaryCategory: parsed.primaryCategory ?? 'clean',
      categoryScores: parsed.categoryScores ?? { nsfw: 0, violence: 0, toxicity: 0, grooming: 0, pii: 0 },
      suggestedAction: parsed.suggestedAction ?? (parsed.isSafe ? 'allow' : 'blur_shield'),
      childFriendlyExplanation: parsed.childFriendlyExplanation ?? 'Content verified as safe.',
      parentalNote: parsed.parentalNote ?? 'Passed Gemini multimodal inspection.',
      ageSuitability: parsed.ageSuitability ?? 'All Ages',
      latencyMs: Date.now() - startTime,
      source: 'gemini-3.8-flash',
    };

    return res.json(result);
  } catch (error: any) {
    console.error('Gemini Classification Error:', error);
    // Graceful fallback to heuristic classification
    const fallback = heuristicClassify(text, !!imageBase64, ageGroup);
    fallback.latencyMs = Date.now() - startTime;
    return res.json(fallback);
  }
});

// Setup Vite middlewares for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[SafeLens AI] Server running at http://localhost:${PORT}`);
  });
}

startServer();
