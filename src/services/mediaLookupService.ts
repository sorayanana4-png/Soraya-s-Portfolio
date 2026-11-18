const imageCache = new Map<string, string | null>();

/**
 * Resolves official promotional / editorial artwork via Wikipedia's public REST API
 * for a verified article title. Never fabricates URLs and caches results cleanly.
 */
export async function fetchWikipediaThumbnail(wikiTitle: string): Promise<string | null> {
  if (!wikiTitle) return null;
  const cacheKey = `wiki:${wikiTitle}`;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey) ?? null;
  }

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`,
      { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) {
      imageCache.set(cacheKey, null);
      return null;
    }
    const data = (await res.json()) as {
      thumbnail?: { source?: string };
      originalimage?: { source?: string };
    };
    const url = data.thumbnail?.source || data.originalimage?.source || null;
    imageCache.set(cacheKey, url);
    return url;
  } catch {
    imageCache.set(cacheKey, null);
    return null;
  }
}

/**
 * Resolves official album cover artwork via Apple iTunes public Search API
 * for a given artist + album query.
 */
export async function fetchAlbumArtwork(query: string): Promise<string | null> {
  if (!query) return null;
  const cacheKey = `itunes:${query}`;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey) ?? null;
  }

  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album&limit=1`
    );
    if (!res.ok) {
      imageCache.set(cacheKey, null);
      return null;
    }
    const data = (await res.json()) as {
      results?: { artworkUrl100?: string }[];
    };
    const raw = data.results?.[0]?.artworkUrl100;
    const highRes = raw ? raw.replace('100x100bb', '600x600bb') : null;
    imageCache.set(cacheKey, highRes);
    return highRes;
  } catch {
    imageCache.set(cacheKey, null);
    return null;
  }
}
