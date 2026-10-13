import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const groqApiKey = process.env.GROQ_API_KEY;

async function testGroq() {
  const articles = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'raw_new_articles.json'), 'utf8'));
  const sample = articles.slice(0, 3);

  const prompt = `You are an expert English language educator.
For each of the following reading articles, extract 7 to 10 specific key concepts / factual memory points that a student should recall.
Return ONLY valid JSON array with objects containing "id" and "key_concepts" (an array of strings).
Example format:
[
  { "id": "A2-01", "key_concepts": ["parcel travels", "worker checks address", "weighs parcel", "sender pays", "van to another office", "driver plans journey", "signature required", "leave a card"] }
]

Articles:
${JSON.stringify(sample.map(a => ({ id: a.id, level: a.level, title: a.title, text: a.text })), null, 2)}
`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      response_format: { type: 'json_object' }
    })
  });

  const json = await res.json();
  console.log('Result:', json.choices[0].message.content);
}

testGroq().catch(console.error);
