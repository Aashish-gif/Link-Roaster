import { GoogleGenerativeAI } from '@google/generative-ai';

let genAIInstance = null;

function getGenAI() {
  if (!genAIInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[WARNING] GEMINI_API_KEY is not defined in environment variables.');
    }
    genAIInstance = new GoogleGenerativeAI(apiKey || '');
  }
  return genAIInstance;
}

async function callGemini(prompt, config) {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: config
  });
  return result.response.text();
}

function cleanJsonString(text) {
  let cleaned = text.replace(/```json\s*|```/gi, '').trim();
  
  // Extract content between first '{' and last '}'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned;
}

function extractFieldsWithRegex(text) {
  const fields = { summary: null, roast: null, verdict: null };
  
  for (const key of Object.keys(fields)) {
    // Matches key and its string value, handling unescaped quotes/newlines inside non-greedily
    const regex = new RegExp(`["']?${key}["']?\\s*:\\s*["']([\\s\\S]*?)["']\\s*(?:,|\\n\\s*\\}|\\})`);
    const match = text.match(regex);
    if (match) {
      fields[key] = match[1];
    }
  }
  return fields;
}

function validateParsed(parsed) {
  return (
    parsed &&
    typeof parsed.summary === 'string' && parsed.summary.trim().length > 5 &&
    typeof parsed.roast === 'string' && parsed.roast.trim().length > 5 &&
    typeof parsed.verdict === 'string' && parsed.verdict.trim().length > 5
  );
}

function parseAndValidate(text) {
  const cleaned = cleanJsonString(text);
  
  // Strategy 1: Standard JSON parsing
  try {
    const parsed = JSON.parse(cleaned);
    if (validateParsed(parsed)) {
      return parsed;
    }
  } catch (jsonErr) {
    console.warn('[DEBUG] JSON.parse failed, trying regex fallback:', jsonErr.message);
  }

  // Strategy 2: Regex extraction fallback
  const extracted = extractFieldsWithRegex(cleaned);
  if (validateParsed(extracted)) {
    console.log('[DEBUG] Successfully extracted fields using regex fallback.');
    return extracted;
  }

  // Log raw output for troubleshooting
  console.error('[ERROR] Failed to parse AI response. Raw output was:');
  console.error(text);
  
  throw new Error('Validation failed: Required fields are missing or malformed');
}

function isRateLimitError(err) {
  if (!err) return false;
  if (err.status === 429 || err.statusCode === 429) {
    return true;
  }
  const msg = (err.message || '').toLowerCase();
  if (msg.includes('429') || msg.includes('too many requests') || msg.includes('quota')) {
    return true;
  }
  if (err.errorDetails && Array.isArray(err.errorDetails)) {
    for (const detail of err.errorDetails) {
      if (detail['@type'] && detail['@type'].includes('QuotaFailure')) {
        return true;
      }
    }
  }
  return false;
}

export async function generateRoast(scrapedData) {
  const prompt = `You are "The Roaster" — a sharp witty AI critic who reviews websites.
Tone: intelligent, funny, brutally honest. Like a comedy roast crossed with a tech journalist.
Never attack real people. Roast content, design choices, corporate speak, and irony.

Analyze this webpage content:
---
${scrapedData.content}
---

Generate the following three fields and return them as valid JSON:
1. "summary": A 2-3 sentence factual description of what this page actually is (max 300 chars).
2. "roast": A 3-5 sentence savage funny critique specific to this content (max 600 chars).
3. "verdict": One devastating mic-drop verdict line (max 120 chars).`;

  const config = {
    temperature: 0.85,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048, // Prevent truncation
    responseMimeType: 'application/json',
    responseSchema: {
      type: 'object',
      properties: {
        summary: { 
          type: 'string',
          description: 'A 2-3 sentence factual description of what this page actually is. Max 300 characters.'
        },
        roast: { 
          type: 'string',
          description: 'A 3-5 sentence savage funny critique specific to the webpage content. Max 600 characters.'
        },
        verdict: { 
          type: 'string',
          description: 'One devastating mic-drop verdict line. Max 120 characters.'
        }
      },
      required: ['summary', 'roast', 'verdict']
    }
  };

  let rawText;
  let parsed;

  try {
    rawText = await callGemini(prompt, config);
    parsed = parseAndValidate(rawText);
  } catch (err) {
    if (isRateLimitError(err)) {
      console.error('[ERROR] Gemini rate limit error:', err);
      throw { code: 'AI_FAILED', message: 'Gemini AI API rate limit/quota reached. Please wait a moment and try again.' };
    }
    
    console.error('[DEBUG] First attempt failed:', err);
    // Wait 1000ms and retry ONCE with stricter prompt
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const strictPrompt = `${prompt}\n\nIMPORTANT: Respond ONLY with valid JSON. No text before or after. Just the JSON object.`;
    try {
      rawText = await callGemini(strictPrompt, config);
      parsed = parseAndValidate(rawText);
    } catch (retryErr) {
      if (isRateLimitError(retryErr)) {
        console.error('[ERROR] Gemini rate limit error on retry:', retryErr);
        throw { code: 'AI_FAILED', message: 'Gemini AI API rate limit/quota reached. Please wait a moment and try again.' };
      }
      console.error('[DEBUG] Retry attempt failed:', retryErr);
      throw { code: 'AI_FAILED', message: 'AI failed to generate a roast. Even our AI is speechless.' };
    }
  }

  return {
    summary: parsed.summary.trim().slice(0, 300),
    roast: parsed.roast.trim().slice(0, 600),
    verdict: parsed.verdict.trim().slice(0, 120)
  };
}
