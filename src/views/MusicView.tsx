import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Award,
  Box,
  ChevronLeft,
  ChevronRight,
  Download,
  Headphones,
  Loader2,
  Mic2,
  Music2,
  Pause,
  Play,
  Plus,
  SkipBack,
  SkipForward,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import {
  FAVORITE_ALBUMS,
  FAVORITE_SONGS,
  MUSIC_ARTISTS,
  MUSIC_DISCOVERIES,
  MUSIC_GENRES,
  YEARLY_MUSIC_RANKING,
} from '../data/sorayaData';
import { useUniverse } from '../context/UniverseContext';
import { MediaGallery } from '../components/MediaGallery';
import { CloudinaryImageCard } from '../components/CloudinaryImageCard';
import { ThreeUniverseScene } from '../components/ThreeUniverseScene';
import { fetchAlbumArtwork, fetchWikipediaThumbnail } from '../services/mediaLookupService';
import {
  generateOriginalSoundtrack,
  getMusicServiceStatus,
} from '../services/musicGenerationService';
import { MusicArtist } from '../types/universe';

function getSafeEmbedUrl(raw: string): string | null {
  try {
    const url = new URL(raw.trim());
    if (url.hostname.includes('open.spotify.com')) {
      const path = url.pathname.startsWith('/embed') ? url.pathname : `/embed${url.pathname}`;
      return `https://open.spotify.com${path}`;
    }
    if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
      const list = url.searchParams.get('list');
      if (list) return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(list)}`;
      const v = url.searchParams.get('v') || url.pathname.replace('/', '');
      if (v) return `https://www.youtube.com/embed/${encodeURIComponent(v)}`;
    }
    return null;
  } catch {
    return null;
  }
}

interface PlayerQueueItem {
  id: string;
  title: string;
  artist: string;
  artworkUrl: string;
  audioUrl: string;
  durationLabel?: string;
}

export function MusicView() {
  const {
    cmsData,
    updatePlaylistEmbed,
    openCMSAt,
    getMediaUrl,
    generatedTracks,
    addGeneratedTrack,
  } = useUniverse();

  const [activePlaylistId, setActivePlaylistId] = useState(cmsData.playlists[0].id);
  const [embedInput, setEmbedInput] = useState('');
  const [selectedArtist, setSelectedArtist] = useState<MusicArtist | null>(null);
  const [show3DStudio, setShow3DStudio] = useState(false);

  // Portraits & pochettes pré-remplis avec fallback dynamique Wikipedia / iTunes
  const [artistImages, setArtistImages] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const a of MUSIC_ARTISTS) {
      if (a.portraitUrl) initial[a.id] = a.portraitUrl;
    }
    return initial;
  });
  const [failedPortraits, setFailedPortraits] = useState<Record<string, boolean>>({});
  const [albumCovers, setAlbumCovers] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const alb of FAVORITE_ALBUMS) {
      if (alb.coverUrl) initial[alb.id] = alb.coverUrl;
    }
    return initial;
  });
  const [failedAlbums, setFailedAlbums] = useState<Record<string, boolean>>({});
  const [songPreviews, setSongPreviews] = useState<
    Record<string, { artworkUrl: string; previewUrl: string }>
  >({});

  // Lecteur audio HTML5 réel
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<PlayerQueueItem[]>(() =>
    FAVORITE_SONGS.map((s) => ({
      id: s.id,
      title: s.title,
      artist: s.artist,
      artworkUrl: s.artworkUrl || '',
      audioUrl: '',
      durationLabel: s.duration,
    }))
  );
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressSec, setProgressSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playerNotice, setPlayerNotice] = useState<string | null>(null);

  // Studio Lyria — Création de bande-son originale
  const [lyriaConfigured, setLyriaConfigured] = useState<boolean | null>(null);
  const [atmosphere, setAtmosphere] = useState('Soirée Studio R&B feutrée');
  const [genre, setGenre] = useState('R&B années 90 & 2000');
  const [description, setDescription] = useState(
    'Accords chaleureux de piano électrique Rhodes, basse analogique ronde, caisse claire R&B 90s ciselée et harmonies vocales aériennes'
  );
  const [genMode, setGenMode] = useState<'clip' | 'pro'>('clip');
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const carouselRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    getMusicServiceStatus().then((s) => setLyriaConfigured(s.configured));
  }, []);

  // Complète tout portrait manquant via Wikipedia REST API
  useEffect(() => {
    let active = true;
    const missing = MUSIC_ARTISTS.filter((a) => !a.portraitUrl);
    if (missing.length === 0) return;
    const loadPortraits = async () => {
      const results = await Promise.all(
        missing.map(async (artist) => {
          const url = await fetchWikipediaThumbnail(artist.wikiTitle);
          return url ? ([artist.id, url] as const) : null;
        })
      );
      if (!active) return;
      setArtistImages((prev) => {
        const next = { ...prev };
        for (const item of results) {
          if (item && !next[item[0]]) next[item[0]] = item[1];
        }
        return next;
      });
    };
    loadPortraits();
    return () => {
      active = false;
    };
  }, []);

  // Complète toute pochette manquante via iTunes Search API
  useEffect(() => {
    let active = true;
    const missing = FAVORITE_ALBUMS.filter((alb) => !alb.coverUrl);
    if (missing.length === 0) return;
    const loadAlbums = async () => {
      const results = await Promise.all(
        missing.map(async (alb) => {
          const url = await fetchAlbumArtwork(alb.itunesQuery);
          return url ? ([alb.id, url] as const) : null;
        })
      );
      if (!active) return;
      setAlbumCovers((prev) => {
        const next = { ...prev };
        for (const item of results) {
          if (item && !next[item[0]]) next[item[0]] = item[1];
        }
        return next;
      });
    };
    loadAlbums();
    return () => {
      active = false;
    };
  }, []);

  // Récupère les extraits audio iTunes de 30 s et pochettes pour Mes titres favoris
  useEffect(() => {
    let active = true;
    const loadSongPreviews = async () => {
      const entries = await Promise.all(
        FAVORITE_SONGS.map(async (song) => {
          try {
            const res = await fetch(
              `https://itunes.apple.com/search?term=${encodeURIComponent(song.itunesQuery)}&entity=song&limit=1`
            );
            if (!res.ok) return null;
            const json = (await res.json()) as {
              results?: { artworkUrl100?: string; previewUrl?: string }[];
            };
            const first = json.results?.[0];
            if (!first) return null;
            return [
              song.id,
              {
                artworkUrl: first.artworkUrl100
                  ? first.artworkUrl100.replace('100x100bb', '300x300bb')
                  : '',
                previewUrl: first.previewUrl || '',
              },
            ] as const;
          } catch {
            return null;
          }
        })
      );
      if (!active) return;
      const next: Record<string, { artworkUrl: string; previewUrl: string }> = {};
      for (const e of entries) {
        if (e) next[e[0]] = e[1];
      }
      setSongPreviews(next);
      setQueue((prev) =>
        prev.map((q) => {
          const found = next[q.id];
          return found
            ? {
                ...q,
                artworkUrl: found.artworkUrl || q.artworkUrl,
                audioUrl: found.previewUrl || q.audioUrl,
              }
            : q;
        })
      );
    };
    loadSongPreviews();
    return () => {
      active = false;
    };
  }, []);

  const currentTrack = queue[currentTrackIdx] || queue[0];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playQueueIndex = (idx: number) => {
    const target = queue[idx];
    if (!target) return;
    setCurrentTrackIdx(idx);
    setProgressSec(0);
    if (!target.audioUrl) {
      setIsPlaying(false);
      setPlayerNotice(
        `Aucun extrait audio direct n'est disponible pour « ${target.title} ». Utilisez Spotify / YouTube ci-dessous ou composez un morceau dans le studio.`
      );
      if (audioRef.current) audioRef.current.pause();
      return;
    }
    setPlayerNotice(null);
    const audio = audioRef.current;
    if (audio) {
      audio.src = target.audioUrl;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
          setPlayerNotice('Cliquez de nouveau sur Lecture pour démarrer l’écoute.');
        });
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!currentTrack?.audioUrl) {
      setPlayerNotice(
        `Aucun flux audio connecté pour « ${currentTrack?.title} ». Choisissez un titre avec extrait disponible, liez une playlist Spotify / YouTube ou générez une piste originale.`
      );
      setIsPlaying(false);
      return;
    }
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio.src !== currentTrack.audioUrl) {
        audio.src = currentTrack.audioUrl;
      }
      audio
        .play()
        .then(() => {
          setPlayerNotice(null);
          setIsPlaying(true);
        })
        .catch(() => setIsPlaying(false));
    }
  };

  const handleGenerateSoundtrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setGenError(null);
    try {
      const result = await generateOriginalSoundtrack({
        atmosphere,
        genre,
        description,
        mode: genMode,
      });
      const newTrack = {
        id: `lyria-${Date.now()}`,
        title: `Soraya Studio · ${genre}`,
        atmosphere,
        genre,
        description,
        audioDataUrl: result.audioDataUrl,
        mimeType: result.mimeType,
        lyrics: result.lyrics,
        model: result.model,
        createdAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      addGeneratedTrack(newTrack);
      const qItem: PlayerQueueItem = {
        id: newTrack.id,
        title: newTrack.title,
        artist: `Soraya Studio (${result.model})`,
        artworkUrl:
          getMediaUrl('music.studioHero') ||
          '/src/assets/images/music_rnb_studio_1795008930458.jpg',
        audioUrl: result.audioDataUrl,
        durationLabel: genMode === 'clip' ? '0:30' : 'Complet',
      };
      setQueue((prev) => [qItem, ...prev]);
      setCurrentTrackIdx(0);
      setPlayerNotice(null);
      if (audioRef.current) {
        audioRef.current.src = result.audioDataUrl;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    } catch (err) {
      setGenError(
        err instanceof Error
          ? err.message
          : 'Impossible de générer la bande-son. Vérifiez la facturation de la clé GEMINI_API_KEY dans Paramètres > Secrets.'
      );
    } finally {
      setGenerating(false);
    }
  };

  const scrollGroup = (key: string, dir: -1 | 1) => {
    carouselRefs.current[key]?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  const activePlaylist =
    cmsData.playlists.find((p) => p.id === activePlaylistId) || cmsData.playlists[0];
  const safeEmbed = activePlaylist.embedUrl ? getSafeEmbedUrl(activePlaylist.embedUrl) : null;

  const topNineArtists = MUSIC_ARTISTS.filter((a) => a.tier === 'top-artist').sort(
    (a, b) => (a.rank || 99) - (b.rank || 99)
  );
  const rnbAndSoulIcons = MUSIC_ARTISTS.filter((a) => a.tier !== 'top-artist');
  const studioCover =
    getMediaUrl('music.studioHero') || '/src/assets/images/music_rnb_studio_1795008930458.jpg';

  const formatTime = (s: number) => {
    if (!Number.isFinite(s) || s <= 0) return '0:00';
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-[#100B0B] text-amber-50 min-h-screen pb-32">
      {/* Lecteur audio HTML5 masqué */}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setProgressSec(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDurationSec(e.currentTarget.duration)}
        onEnded={() => {
          setIsPlaying(false);
          if (currentTrackIdx < queue.length - 1) {
            playQueueIndex(currentTrackIdx + 1);
          }
        }}
      />

      {/* En-tête Studio d'enregistrement */}
      <section className="relative border-b border-amber-200/10 overflow-hidden bg-gradient-to-b from-[#2A1118] via-[#170D0E] to-[#100B0B]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-14 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
              <Mic2 className="w-4 h-4" />
              <span>05 · Mon univers musical · The Soundtrack of My Life</span>
            </div>
            <h1 className="font-editorial text-4xl md:text-6xl font-semibold text-white">
              Voix d’exception, Harmonies R&amp;B &amp; Magie de la Scène
            </h1>
            <p className="text-base text-amber-100/80 leading-relaxed">
              Nourri par la pratique de la chorale et le goût du chant harmonique, l’univers musical de Soraya célèbre les grandes voix féminines, le R&amp;B des années 90 et 2000, les sessions acoustiques et la ferveur des concerts — des grandes arenas aux scènes intimistes.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => playQueueIndex(0)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 text-stone-950 text-xs font-bold hover:bg-amber-300 transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                Lancer la sélection musicale
              </button>
              <button
                type="button"
                onClick={() => setShow3DStudio((v) => !v)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 cursor-pointer"
              >
                <Box className="w-4 h-4 text-amber-300" />
                {show3DStudio ? 'Masquer le studio vinyle 3D' : 'Ouvrir le studio vinyle 3D'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            {show3DStudio ? (
              <ThreeUniverseScene
                initialMode="studio"
                heightClass="h-[340px] md:h-[380px]"
                title="Studio R&B · Platine vinyle & Micro à condensateur"
              />
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-amber-200/15 aspect-[16/9]">
                <img
                  src={studioCover}
                  alt="Studio d’enregistrement R&B feutré avec micro vintage et vinyles"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#100B0B] via-transparent to-transparent" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 1. MES ARTISTES PRÉFÉRÉS (Top 01–09 avec portraits circulaires réels) */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 py-14 space-y-12">
        <div className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-amber-300">
                Piliers musicaux · Classés de 01 à 09
              </p>
              <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-white">
                Mes artistes préférés
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Faire défiler Mes artistes préférés vers la gauche"
                onClick={() => scrollGroup('top9', -1)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Faire défiler Mes artistes préférés vers la droite"
                onClick={() => scrollGroup('top9', 1)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={(el) => {
              carouselRefs.current['top9'] = el;
            }}
            className="flex items-stretch gap-5 overflow-x-auto editorial-scroll pb-4 snap-x"
          >
            {topNineArtists.map((artist) => {
              const portrait = !failedPortraits[artist.id]
                ? artistImages[artist.id] || artist.portraitUrl
                : '';
              return (
                <button
                  key={artist.id}
                  type="button"
                  onClick={() => setSelectedArtist(artist)}
                  className="snap-start shrink-0 w-[195px] rounded-2xl bg-[#1A1314] hover:bg-[#24191B] border border-white/10 hover:border-amber-300/40 p-5 flex flex-col items-center text-center space-y-4 transition-all cursor-pointer group"
                >
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-amber-300/35 bg-[#261B1D] flex items-center justify-center">
                      {portrait ? (
                        <img
                          src={portrait}
                          alt={artist.name}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedPortraits((prev) => ({ ...prev, [artist.id]: true }))
                          }
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <span className="font-editorial text-2xl font-semibold text-amber-200">
                          {artist.name
                            .split(' ')
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join('')}
                        </span>
                      )}
                    </div>
                    <span className="font-tabular absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-stone-950 text-xs font-bold flex items-center justify-center shadow">
                      {artist.rank}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-editorial text-xl font-semibold text-white">
                      {artist.name}
                    </h3>
                    <p className="text-[11px] text-amber-200/80">{artist.roleNote}</p>
                    <p className="text-[11px] text-stone-400 line-clamp-2">{artist.highlight}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Légendes Soul, R&B 2000 & Voix contemporaines */}
        <div className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs text-amber-300/80">Racines vocales &amp; Écoutes R&amp;B</p>
              <h2 className="font-editorial text-3xl font-semibold text-white">
                Légendes Soul, R&amp;B des années 2000 &amp; Voix Contemporaines
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Faire défiler les artistes R&B vers la gauche"
                onClick={() => scrollGroup('rnb', -1)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Faire défiler les artistes R&B vers la droite"
                onClick={() => scrollGroup('rnb', 1)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={(el) => {
              carouselRefs.current['rnb'] = el;
            }}
            className="flex items-stretch gap-4 overflow-x-auto editorial-scroll pb-3 snap-x"
          >
            {rnbAndSoulIcons.map((artist) => {
              const portrait = !failedPortraits[artist.id]
                ? artistImages[artist.id] || artist.portraitUrl
                : '';
              return (
                <button
                  key={artist.id}
                  type="button"
                  onClick={() => setSelectedArtist(artist)}
                  className="snap-start shrink-0 w-[235px] text-left rounded-2xl bg-[#1A1314] border border-white/10 hover:border-amber-300/40 p-4 flex items-center gap-3.5 transition-colors cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-[#2B1D20] border border-white/15 shrink-0 flex items-center justify-center">
                    {portrait ? (
                      <img
                        src={portrait}
                        alt={artist.name}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedPortraits((prev) => ({ ...prev, [artist.id]: true }))
                        }
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <span className="font-editorial text-lg font-semibold text-amber-200">
                        {artist.name[0]}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-editorial text-lg font-semibold text-white truncate">
                      {artist.name}
                    </h3>
                    <p className="text-[11px] text-amber-200/80 truncate">{artist.roleNote}</p>
                    <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                      {artist.signatureTrack}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. MON CLASSEMENT ANNUEL */}
        <div className="space-y-5 pt-2">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs text-amber-300/80 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                Rétrospective sonore · De 2023 à 2026
              </p>
              <h2 className="font-editorial text-3xl font-semibold text-white">
                Mon classement annuel
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {YEARLY_MUSIC_RANKING.map((chapter) => (
              <article
                key={chapter.year}
                className="rounded-2xl bg-[#1A1314] border border-white/10 p-5 flex flex-col justify-between space-y-4"
                style={{ borderTopWidth: 3, borderTopColor: chapter.accent }}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="font-tabular text-2xl font-bold"
                      style={{ color: chapter.accent }}
                    >
                      {chapter.year}
                    </span>
                    <span className="text-[11px] text-stone-400">Chapitre musical</span>
                  </div>
                  <h3 className="font-editorial text-xl font-semibold text-white">
                    {chapter.eraLabel}
                  </h3>
                  <p className="text-xs font-medium text-amber-200/90">{chapter.leadArtists}</p>
                  <p className="text-xs text-stone-300 leading-relaxed">{chapter.story}</p>
                </div>
                <div className="pt-3 border-t border-white/10 text-[11px] text-stone-400">
                  Titre phare : <span className="text-white font-medium">{chapter.anthem}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 3. MES ALBUMS FAVORIS */}
        <div className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs text-amber-300/80">Disques incontournables</p>
              <h2 className="font-editorial text-3xl font-semibold text-white">
                Mes albums favoris
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Faire défiler les albums vers la gauche"
                onClick={() => scrollGroup('albums', -1)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Faire défiler les albums vers la droite"
                onClick={() => scrollGroup('albums', 1)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={(el) => {
              carouselRefs.current['albums'] = el;
            }}
            className="flex items-stretch gap-4 overflow-x-auto editorial-scroll pb-3 snap-x"
          >
            {FAVORITE_ALBUMS.map((alb) => {
              const cover = !failedAlbums[alb.id]
                ? albumCovers[alb.id] || alb.coverUrl
                : '';
              return (
                <div
                  key={alb.id}
                  className="snap-start shrink-0 w-[210px] rounded-2xl bg-[#1A1314] border border-white/10 p-4 space-y-3"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-[#261B1D] border border-white/10 flex items-center justify-center">
                    {cover ? (
                      <img
                        src={cover}
                        alt={`${alb.title} de ${alb.artist}`}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedAlbums((prev) => ({ ...prev, [alb.id]: true }))
                        }
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Music2 className="w-8 h-8 text-amber-300/50" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white truncate">{alb.title}</h3>
                    <p className="text-xs text-amber-200/85 truncate">
                      {alb.artist} · {alb.year}
                    </p>
                    <p className="text-[11px] text-stone-400 line-clamp-2 mt-1">{alb.note}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. MES TITRES FAVORIS, GENRES & DÉCOUVERTES */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 rounded-2xl bg-[#1A1314] border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-amber-300">Sélection essentielle</p>
              <h2 className="font-editorial text-3xl font-semibold text-white">
                Mes titres favoris
              </h2>
            </div>
            <span className="text-xs text-stone-400">Cliquez sur un titre pour l’écouter</span>
          </div>

          <div className="divide-y divide-white/10">
            {FAVORITE_SONGS.map((song, idx) => {
              const preview = songPreviews[song.id];
              const isCurrent = currentTrack?.id === song.id;
              return (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => {
                    const qIdx = queue.findIndex((q) => q.id === song.id);
                    if (qIdx >= 0) playQueueIndex(qIdx);
                  }}
                  className={`w-full py-3 px-3 rounded-lg flex items-center justify-between gap-4 text-left transition-colors cursor-pointer ${
                    isCurrent ? 'bg-amber-400/15' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="font-tabular text-xs text-stone-400 w-5">
                      {isCurrent && isPlaying ? '▶' : `0${idx + 1}`.slice(-2)}
                    </span>
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-[#2B1D20] shrink-0 flex items-center justify-center">
                      {preview?.artworkUrl ? (
                        <img
                          src={preview.artworkUrl}
                          alt={song.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Music2 className="w-4 h-4 text-amber-300/60" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold truncate ${
                          isCurrent ? 'text-amber-300' : 'text-white'
                        }`}
                      >
                        {song.title}
                      </p>
                      <p className="text-xs text-stone-400 truncate">
                        {song.artist} · {song.album}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 text-xs text-stone-400">
                    <span className="hidden sm:inline">{song.mood}</span>
                    <span className="font-tabular">{song.duration}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Genres musicaux & Découvertes */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl bg-[#1A1314] border border-white/10 p-6 space-y-4">
            <div>
              <p className="text-xs text-amber-300">Signatures sonores</p>
              <h2 className="font-editorial text-2xl font-semibold text-white">
                Mes genres musicaux
              </h2>
            </div>
            <div className="space-y-3">
              {MUSIC_GENRES.map((g) => (
                <div
                  key={g.name}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1"
                >
                  <p className="text-xs font-semibold" style={{ color: g.accent }}>
                    {g.name}
                  </p>
                  <p className="text-xs text-stone-300">{g.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#1A1314] border border-white/10 p-6 space-y-4">
            <div>
              <p className="text-xs text-amber-300">Coups de cœur &amp; Écoutes</p>
              <h2 className="font-editorial text-2xl font-semibold text-white">
                Découvertes musicales
              </h2>
            </div>
            <div className="space-y-3">
              {MUSIC_DISCOVERIES.map((d) => (
                <div
                  key={d.id}
                  className="border-t border-white/10 pt-3 first:border-0 first:pt-0"
                >
                  <p className="text-xs font-semibold text-white">{d.title}</p>
                  <p className="text-[11px] text-amber-200/80">{d.context}</p>
                  <p className="text-xs text-stone-400 mt-1">{d.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. PLAYLISTS & LECTEUR SPOTIFY / YOUTUBE */}
      <section className="bg-[#180F11] border-y border-amber-200/10 py-14">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
              <Headphones className="w-4 h-4" />
              <span>Mes playlists</span>
            </div>
            <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-white">
              Playlists par ambiance &amp; couleur vocale
            </h2>
            <div className="space-y-2 pt-2">
              {cmsData.playlists.map((pl) => {
                const active = pl.id === activePlaylist.id;
                return (
                  <button
                    key={pl.id}
                    type="button"
                    onClick={() => {
                      setActivePlaylistId(pl.id);
                      setEmbedInput(pl.embedUrl || '');
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#6E1D2A] border-amber-300/50 text-white'
                        : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm">{pl.title}</p>
                      <span className="text-[11px] opacity-75 shrink-0">{pl.mood}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl bg-[#11090B] border border-white/10 p-6 md:p-8 space-y-6">
            <div className="space-y-1">
              <p className="text-xs text-amber-300">{activePlaylist.mood}</p>
              <h3 className="font-editorial text-3xl font-semibold text-white">
                {activePlaylist.title}
              </h3>
              <p className="text-sm text-stone-300">{activePlaylist.description}</p>
            </div>

            {safeEmbed ? (
              <iframe
                title={activePlaylist.title}
                src={safeEmbed}
                className="w-full h-[260px] rounded-xl border border-white/10"
                allow="encrypted-media"
              />
            ) : (
              <div className="rounded-xl border border-dashed border-amber-200/20 p-6 text-center space-y-3 bg-white/[0.02]">
                <Music2 className="w-7 h-7 mx-auto text-amber-300" />
                <p className="font-editorial text-xl text-white">
                  Connecter une playlist Spotify ou YouTube Music
                </p>
                <p className="text-xs text-stone-400 max-w-md mx-auto">
                  Collez ci-dessous l’URL autorisée d’une playlist Spotify ou YouTube Music pour afficher le lecteur intégré officiel.
                </p>
              </div>
            )}

            <form
              className="flex flex-col sm:flex-row gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                updatePlaylistEmbed(activePlaylist.id, embedInput);
              }}
            >
              <input
                value={embedInput}
                onChange={(e) => setEmbedInput(e.target.value)}
                placeholder="Coller un lien de playlist Spotify ou YouTube Music..."
                className="flex-1 rounded-lg bg-white/5 border border-white/15 px-3.5 py-2 text-sm text-white placeholder:text-stone-500"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-amber-400 text-stone-950 rounded-lg hover:bg-amber-300 cursor-pointer whitespace-nowrap shrink-0"
              >
                Lier la playlist
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 6. CRÉER MA BANDE-SON — STUDIO MUSICAL LYRIA */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 py-14">
        <div className="rounded-2xl bg-gradient-to-br from-[#231218] via-[#171115] to-[#110D10] border border-amber-300/20 p-7 md:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <Sparkles className="w-4 h-4" />
                <span>Générateur de bande-son originale · Propulsé par Lyria</span>
              </div>
              <h2 className="font-editorial text-3xl md:text-5xl font-semibold text-white">
                Créer ma bande-son
              </h2>
              <p className="text-sm text-stone-300 leading-relaxed">
                Composez une piste studio originale inspirée des ambiances R&amp;B, soul ou cinématographiques de Soraya, puis écoutez-la directement dans le lecteur ou téléchargez le fichier MP3.
              </p>
            </div>
            <div className="text-xs text-stone-400">
              {lyriaConfigured ? (
                <span className="text-emerald-400 font-medium">Moteur Lyria prêt</span>
              ) : (
                <span className="text-amber-300 font-medium">
                  Nécessite une clé GEMINI_API_KEY active dans les Secrets
                </span>
              )}
            </div>
          </div>

          {lyriaConfigured === false && (
            <div className="rounded-xl bg-amber-500/10 border border-amber-400/30 p-4 flex items-start gap-3 text-xs text-amber-100">
              <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <p>
                La synthèse audio Lyria s’appuie sur les modèles Gemini audio (<code className="font-tabular">lyria-3-clip-preview</code> / <code className="font-tabular">lyria-3-pro-preview</code>). Connectez une clé <code className="font-tabular">GEMINI_API_KEY</code> avec facturation active dans <strong>Paramètres &gt; Secrets</strong> pour générer et télécharger vos pistes MP3 originales.
              </p>
            </div>
          )}

          <form onSubmit={handleGenerateSoundtrack} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-4">
              <label className="block text-xs font-medium text-stone-300">
                Atmosphère
                <select
                  value={atmosphere}
                  onChange={(e) => setAtmosphere(e.target.value)}
                  className="mt-1.5 w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2.5 text-sm text-white"
                >
                  <option value="Soirée Studio R&B feutrée">Soirée Studio R&amp;B feutrée</option>
                  <option value="Coucher de soleil sur la côte ivoirienne">
                    Coucher de soleil sur la côte ivoirienne
                  </option>
                  <option value="Crépuscule méditerranéen à Malte">
                    Crépuscule méditerranéen à Malte
                  </option>
                  <option value="Salon acoustique & harmonies vocales">
                    Salon acoustique &amp; harmonies vocales
                  </option>
                  <option value="Énergie nocturne des paddocks du Mans">
                    Énergie nocturne des paddocks du Mans
                  </option>
                </select>
              </label>

              <label className="block text-xs font-medium text-stone-300">
                Genre musical
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="mt-1.5 w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2.5 text-sm text-white"
                >
                  <option value="R&B années 90 & 2000">R&amp;B années 90 &amp; 2000</option>
                  <option value="Neo-Soul & harmonies chorales">
                    Neo-Soul &amp; harmonies chorales
                  </option>
                  <option value="Ballade Soul acoustique">Ballade Soul acoustique</option>
                  <option value="Groove Afro-R&B">Groove Afro-R&amp;B</option>
                  <option value="Bande originale cinématographique">
                    Bande originale cinématographique
                  </option>
                </select>
              </label>

              <div className="space-y-1.5">
                <span className="block text-xs font-medium text-stone-300">Format de piste</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGenMode('clip')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border cursor-pointer ${
                      genMode === 'clip'
                        ? 'bg-amber-400 text-stone-950 border-amber-400'
                        : 'bg-white/5 text-stone-300 border-white/15'
                    }`}
                  >
                    Extrait 30 s (Rapide)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenMode('pro')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border cursor-pointer ${
                      genMode === 'pro'
                        ? 'bg-amber-400 text-stone-950 border-amber-400'
                        : 'bg-white/5 text-stone-300 border-white/15'
                    }`}
                  >
                    Morceau complet (Pro)
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
              <label className="block text-xs font-medium text-stone-300">
                Instrumentation, tempo &amp; intention narrative
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez les accords, la texture vocale, le groove et le tempo..."
                  className="mt-1.5 w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3 text-sm text-white"
                />
              </label>

              {genError && (
                <div className="p-3.5 rounded-lg bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200">
                  {genError}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-stone-400">
                  Synthèse MP3 réelle via <code className="font-tabular">/api/music/generate</code>
                </p>
                <button
                  type="submit"
                  disabled={generating}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-400 text-stone-950 text-xs font-bold hover:bg-amber-300 disabled:opacity-50 cursor-pointer"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Composition en cours avec Lyria...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Générer une bande-son originale
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {generatedTracks.length > 0 && (
            <div className="pt-6 border-t border-white/10 space-y-3">
              <p className="text-xs font-semibold text-amber-300">Créations de la session</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedTracks.map((trk) => (
                  <div
                    key={trk.id}
                    className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{trk.title}</p>
                      <p className="text-xs text-stone-400 truncate">
                        {trk.atmosphere} · {trk.createdAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={trk.audioDataUrl}
                        download={`${trk.genre.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.mp3`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white"
                      >
                        <Download className="w-3.5 h-3.5" />
                        MP3
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 7. EXPÉRIENCES LIVE & ARCHIVES DE CONCERTS */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 py-10 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs text-amber-300">Expériences de musique live</p>
            <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-white">
              Souvenirs de concerts &amp; Scènes intimistes
            </h2>
          </div>
          <button
            type="button"
            onClick={() => openCMSAt('music')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/15 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Ajouter un souvenir de concert
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {cmsData.concerts.map((c, idx) => (
            <article
              key={c.id}
              className="rounded-2xl bg-[#1A1314] border border-white/10 p-6 space-y-3"
            >
              <div className="flex items-center justify-between text-xs text-amber-300/80">
                <span className="font-tabular">0{idx + 1}</span>
                <span>{c.date}</span>
              </div>
              <h3 className="font-editorial text-2xl font-semibold text-white">{c.artist}</h3>
              <p className="text-xs text-stone-400">{c.venueType}</p>
              <p className="text-sm text-stone-300 leading-relaxed pt-1">{c.memory}</p>
            </article>
          ))}
        </div>

        {/* Visuels Concerts (Cloudinary / pré-remplis) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CloudinaryImageCard slotKey="music.concertBeyonce" dark accentColor="#D4A359" />
          <CloudinaryImageCard slotKey="music.concertNicki" dark accentColor="#D4A359" />
          <CloudinaryImageCard slotKey="music.concertFlo" dark accentColor="#D4A359" />
        </div>

        <MediaGallery
          sectionKey="concerts"
          heading="Archives vidéo & photos de concerts"
          subheading="Importez vos vidéos de concerts, extraits de bars acoustiques et souvenirs de scène personnels."
          dark
          accentColor="#D4A359"
          defaultCategory="Concerts & Live"
        />
      </section>

      {/* BARRE DE LECTURE PERSISTANTE FAÇON STUDIO */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#140E0F]/95 border-t border-white/15 px-4 md:px-8 py-3">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 w-full sm:w-1/3">
            <div className="w-11 h-11 rounded-md overflow-hidden bg-[#261B1D] border border-white/15 shrink-0 flex items-center justify-center">
              {currentTrack?.artworkUrl ? (
                <img
                  src={currentTrack.artworkUrl}
                  alt={currentTrack.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Music2 className="w-5 h-5 text-amber-300" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentTrack?.title}</p>
              <p className="text-[11px] text-stone-400 truncate">{currentTrack?.artist}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5 w-full sm:w-1/3">
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="Piste précédente"
                onClick={() => playQueueIndex((currentTrackIdx - 1 + queue.length) % queue.length)}
                className="text-stone-300 hover:text-white cursor-pointer"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label={isPlaying ? 'Mettre en pause' : 'Lire'}
                onClick={togglePlayPause}
                className="w-9 h-9 rounded-full bg-white text-stone-950 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>
              <button
                type="button"
                aria-label="Piste suivante"
                onClick={() => playQueueIndex((currentTrackIdx + 1) % queue.length)}
                className="text-stone-300 hover:text-white cursor-pointer"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full flex items-center gap-2 text-[10px] font-tabular text-stone-400">
              <span>{formatTime(progressSec)}</span>
              <input
                type="range"
                aria-label="Progression du titre"
                min={0}
                max={durationSec || 30}
                value={progressSec}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setProgressSec(val);
                  if (audioRef.current) audioRef.current.currentTime = val;
                }}
                className="flex-1 accent-amber-400 h-1 cursor-pointer"
              />
              <span>
                {durationSec ? formatTime(durationSec) : currentTrack?.durationLabel || '0:30'}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center justify-end gap-3 w-1/3">
            {playerNotice && (
              <p className="text-[11px] text-amber-300 max-w-[240px] truncate" title={playerNotice}>
                {playerNotice}
              </p>
            )}
            <Volume2 className="w-4 h-4 text-stone-400" />
            <input
              type="range"
              aria-label="Volume sonore"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-24 accent-amber-400 h-1 cursor-pointer"
            />
          </div>
        </div>
        {playerNotice && (
          <p className="sm:hidden text-[11px] text-amber-300 text-center mt-1">{playerNotice}</p>
        )}
      </div>

      {/* Modale détail artiste */}
      {selectedArtist && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedArtist(null)}
        >
          <div
            className="bg-[#1C1210] text-amber-50 rounded-2xl max-w-md w-full border border-amber-200/15 p-7 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                {!failedPortraits[selectedArtist.id] &&
                  (artistImages[selectedArtist.id] || selectedArtist.portraitUrl) && (
                    <img
                      src={artistImages[selectedArtist.id] || selectedArtist.portraitUrl}
                      alt={selectedArtist.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-full object-cover object-top border border-amber-300/40"
                    />
                  )}
                <div>
                  <p className="text-xs text-amber-300">{selectedArtist.roleNote}</p>
                  <h3 className="font-editorial text-3xl font-semibold text-white mt-0.5">
                    {selectedArtist.name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                aria-label="Fermer la fiche artiste"
                onClick={() => setSelectedArtist(null)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-stone-200 leading-relaxed">{selectedArtist.highlight}</p>
            {selectedArtist.signatureTrack && (
              <p className="text-xs text-amber-200/90">
                Titres emblématiques : {selectedArtist.signatureTrack}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
