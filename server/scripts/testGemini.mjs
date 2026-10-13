import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY;

async function testGeminiBatch() {
  const articles = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'raw_new_articles.json'), 'utf8'));
  const batch = articles.slice(0, 3);

  const prompt = `You are an expert English language educator designing a reading recall & retention testing system.
For each article below, generate 8 to 12 core factual key concepts/memory points (short phrases or keywords, e.g. "checks address", "weighs parcel", "sender pays", "van to another office") that a reader should remember when reconstructing what they read.
Return ONLY a valid JSON object matching this schema:
{
  "results": [
    {
      "id": "A2-01",
      "key_concepts": ["parcel travels", "worker checks address", "weighs parcel", "sender pays", "van to another office", "driver plans journey", "signature required", "leave a card"]
    }
  ]
}

Articles to process:
${JSON.stringify(batch.map(a => ({ id: a.id, level: a.level, title: a.title, text: a.text })), null, 2)}
`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    })
  });

  const data = await res.json();
  const text = data.candidates[0].content.parts[0].text;
  console.log('Gemini output:\n', text);
}

testGeminiBatch().catch(console.error);
