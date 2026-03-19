// api/gemini.js — Groq proxy (Gemini yerine)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { prompt, systemInstruction } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
          { role: 'user', content: prompt },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('[Groq] Error:', err);
      return res.status(response.status).json({
        error: err?.error?.message || '⚠️ Kahin şu an yanıt veremiyor.'
      });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    return res.status(200).json({ text: text || '⚠️ Kahin şu an yanıt veremiyor.' });

  } catch (err) {
    console.error('[Groq] fetch error:', err);
    return res.status(503).json({ error: '⚠️ Bağlantı hatası.' });
  }
}
