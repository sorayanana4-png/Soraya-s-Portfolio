import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '4mb' }));

  app.get('/api/music/status', (_req, res) => {
    const hasKey = Boolean(
      process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
    );
    res.json({
      configured: hasKey,
      models: ['lyria-3-clip-preview', 'lyria-3-pro-preview'],
    });
  });

  app.post('/api/music/generate', async (req, res) => {
    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        configurationRequired: true,
        error:
          'Le studio de génération musicale n’est pas encore activé. Configurez une clé API Gemini facturable dans Paramètres > Secrets pour utiliser Lyria (lyria-3-clip-preview / lyria-3-pro-preview).',
      });
      return;
    }

    const {
      atmosphere = 'Soirée Studio R&B chaleureuse',
      genre = 'R&B / Neo-Soul',
      description = '',
      mode = 'clip',
    } = req.body as {
      atmosphere?: string;
      genre?: string;
      description?: string;
      mode?: 'clip' | 'pro';
    };

    const model = mode === 'pro' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';
    const prompt = [
      `Create an original ${mode === 'pro' ? 'full-length' : '30-second'} instrumental soundtrack.`,
      `Atmosphere: ${atmosphere}.`,
      `Genre: ${genre}.`,
      description?.trim() ? `Creative direction: ${description.trim()}` : '',
    ]
      .filter(Boolean)
      .join(' ');

    try {
      const response = await ai.models.generateContentStream({
        model,
        contents: prompt,
      });

      const audioChunks: Buffer[] = [];
      let lyrics = '';
      let mimeType = 'audio/mpeg';

      for await (const chunk of response) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;
        for (const part of parts) {
          if (part.inlineData?.data) {
            if (audioChunks.length === 0 && part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            audioChunks.push(Buffer.from(part.inlineData.data, 'base64'));
          }
          if (part.text) {
            lyrics += part.text;
          }
        }
      }

      if (audioChunks.length === 0) {
        res.status(502).json({
          error: 'Le modèle musical n’a renvoyé aucun flux audio. Essayez d’affiner votre description.',
        });
        return;
      }

      const audioBase64 = Buffer.concat(audioChunks).toString('base64');
      res.json({
        audioDataUrl: `data:${mimeType};base64,${audioBase64}`,
        mimeType,
        lyrics: lyrics.trim(),
        model,
        prompt,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Échec de la génération musicale.';
      const isAuthOrBilling = /403|400|429|PERMISSION_DENIED|API_KEY|RESOURCE_EXHAUSTED|paid/i.test(
        message
      );
      res.status(isAuthOrBilling ? 402 : 500).json({
        configurationRequired: isAuthOrBilling,
        error: isAuthOrBilling
          ? 'La génération musicale Lyria nécessite une clé Gemini API facturable dans Paramètres > Secrets.'
          : message,
      });
    }
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Beyond the CV server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
