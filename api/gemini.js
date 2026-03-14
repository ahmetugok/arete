// api/gemini.js — Vercel Serverless Function
// Bu dosya API key'i client'tan gizler.
// Client → /api/gemini → Bu fonksiyon → Google Gemini API
export default async function handler(req, res) {
  // Sadece POST kabul et
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }
  const { prompt, systemInstruction } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }
  const fullPrompt = systemInstruction
    ? `[Sistem Talimatı]: ${systemInstruction}\n\n[Kullanıcı]: ${prompt}`
    : prompt;
  const MODELS = ['gemini-2.0-flash', 'gemini-2.0-flash-lite'];
  for (const model of MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }]
          })
        });
        if (response.status === 404 || response.status === 400) break;
        if (response.status === 429) {
          if (attempt < 3) {
            await new Promise(r => setTimeout(r, attempt * 15000));
            continue;
          }
          break;
        }
        if (!response.ok) break;
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return res.status(200).json({ text });
        break;
      } catch (err) {
        if (attempt === 3) break;
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }
  return res.status(503).json({
    error: '⚠️ Kahin şu an yanıt veremiyor — günlük limit dolmuş olabilir, birkaç dakika sonra tekrar dene.'
  });
}
