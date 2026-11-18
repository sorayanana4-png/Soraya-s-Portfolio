export interface MusicGenerationRequest {
  atmosphere: string;
  genre: string;
  description: string;
  mode: 'clip' | 'pro';
}

export interface MusicGenerationResult {
  audioDataUrl: string;
  mimeType: string;
  lyrics: string;
  model: string;
  prompt: string;
}

export interface MusicServiceStatus {
  configured: boolean;
  models: string[];
}

export async function getMusicServiceStatus(): Promise<MusicServiceStatus> {
  try {
    const res = await fetch('/api/music/status');
    if (!res.ok) return { configured: false, models: [] };
    return (await res.json()) as MusicServiceStatus;
  } catch {
    return { configured: false, models: [] };
  }
}

export async function generateOriginalSoundtrack(
  payload: MusicGenerationRequest
): Promise<MusicGenerationResult> {
  const res = await fetch('/api/music/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = (await res.json()) as Partial<MusicGenerationResult> & {
    error?: string;
    configurationRequired?: boolean;
  };

  if (!res.ok || !data.audioDataUrl) {
    const err = new Error(
      data.error ||
        'Le service de création musicale est actuellement indisponible. Vérifiez qu’une clé Gemini API facturable est configurée dans Paramètres > Secrets.'
    ) as Error & { configurationRequired?: boolean };
    err.configurationRequired = Boolean(data.configurationRequired);
    throw err;
  }

  return data as MusicGenerationResult;
}
