import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_CLOUDINARY_URLS } from '../data/mediaConfig';
import { MOVIES_CATALOG } from '../data/movies';
import { INITIAL_CMS_DATA } from '../data/sorayaData';
import {
  BookEntry,
  ConcertMemory,
  DishEntry,
  GeneratedSoundtrack,
  KitchenCategory,
  MediaItem,
  MovieItem,
  MusicPlaylist,
  SorayaCMSData,
  TravelDestination,
  UniverseId,
} from '../types/universe';

const STORAGE_KEY = 'soraya_beyond_the_cv_cms_fr_v1';
const LEGACY_KEYS = ['soraya_beyond_the_cv_cms_v2', 'soraya_beyond_the_cv_cms_v1'];

interface UniverseContextValue {
  activeUniverse: UniverseId;
  setActiveUniverse: (id: UniverseId) => void;
  cmsData: SorayaCMSData;
  isCMSOpen: boolean;
  setIsCMSOpen: (open: boolean) => void;
  cmsInitialTab: string;
  openCMSAt: (tab: string) => void;
  lightboxItem: MediaItem | null;
  setLightboxItem: (item: MediaItem | null) => void;
  isCVModalOpen: boolean;
  setIsCVModalOpen: (open: boolean) => void;
  // Gestionnaire Cloudinary
  getMediaUrl: (slotKey: string) => string;
  updateCloudinaryUrl: (slotKey: string, url: string) => void;
  // Bandes-son générées via Lyria (session)
  generatedTracks: GeneratedSoundtrack[];
  addGeneratedTrack: (track: GeneratedSoundtrack) => void;
  // Actions CRUD
  updateProfile: (patch: Partial<SorayaCMSData['profile']>) => void;
  addMediaItem: (item: Omit<MediaItem, 'id'>) => void;
  deleteMediaItem: (id: string) => void;
  replacePlaceholderMedia: (
    id: string,
    src: string,
    mediaType: 'image' | 'video',
    caption?: string,
    title?: string
  ) => void;
  addDestination: (dest: Omit<TravelDestination, 'id'>) => void;
  updateDestinationDiary: (destId: string, entryTitle: string, notes: string, places: string) => void;
  addMovie: (movie: Omit<MovieItem, 'id'>) => void;
  updateMovieNote: (movieId: string, note: string) => void;
  updateMoviePoster: (movieId: string, posterUrl: string) => void;
  updatePlaylistEmbed: (playlistId: string, embedUrl: string) => void;
  addConcert: (concert: Omit<ConcertMemory, 'id'>) => void;
  addBook: (book: Omit<BookEntry, 'id'>) => void;
  addDish: (dish: Omit<DishEntry, 'id'>) => void;
  resetCMS: () => void;
  exportCMSJson: () => void;
  importCMSJson: (raw: string) => boolean;
}

const UniverseContext = createContext<UniverseContextValue | null>(null);

const LEGACY_KITCHEN_MAP: Record<string, KitchenCategory> = {
  'Homemade Favorites': 'Cuisine Française',
  'New Recipes': 'Cuisine Asiatique',
  'African Cuisine': 'Cuisine Africaine',
  'Sweet Treats': 'Pâtisserie & Desserts',
  'Food Discoveries': 'Fruits & Découvertes',
  'Recipes to Try': 'Cuisine Coréenne',
};

const VALID_KITCHEN_CATEGORIES = new Set<KitchenCategory>([
  'Cuisine Africaine',
  'Cuisine Française',
  'Cuisine Maghrébine',
  'Cuisine Italienne',
  'Cuisine Asiatique',
  'Cuisine Coréenne',
  'Pâtisserie & Desserts',
  'Fruits & Découvertes',
]);

function mapBookStatus(status: unknown): BookEntry['status'] {
  if (status === 'Coup de cœur' || status === 'Favorite') return 'Coup de cœur';
  if (status === 'À lire' || status === 'To Read') return 'À lire';
  return 'Réflexion personnelle';
}

function hydrateCMSState(): SorayaCMSData {
  try {
    const savedFr = localStorage.getItem(STORAGE_KEY);
    if (savedFr) {
      const parsed = JSON.parse(savedFr) as Partial<SorayaCMSData>;
      const existingMoviesById = new Map<string, Partial<MovieItem>>();
      if (Array.isArray(parsed.movies)) {
        for (const m of parsed.movies) {
          if (m?.id) existingMoviesById.set(m.id, m);
        }
      }
      const mergedCatalog = MOVIES_CATALOG.map((catalogItem) => {
        const savedMovie = existingMoviesById.get(catalogItem.id);
        return savedMovie
          ? {
              ...catalogItem,
              personalNote: savedMovie.personalNote || catalogItem.personalNote,
              posterUrl: savedMovie.posterUrl || catalogItem.posterUrl,
            }
          : catalogItem;
      });
      const catalogIds = new Set(MOVIES_CATALOG.map((m) => m.id));
      const userAddedMovies = (parsed.movies || []).filter(
        (m): m is MovieItem => Boolean(m?.id && !catalogIds.has(m.id) && m.directorOrCreator)
      );

      // Conserver les nouvelles galeries d'illustration sur Côte d'Ivoire / Malte si absentes
      const mergedDestinations = (parsed.destinations || INITIAL_CMS_DATA.destinations).map((dest) => {
        const initMatch = INITIAL_CMS_DATA.destinations.find((d) => d.id === dest.id);
        return initMatch && (!dest.illustrativeGallery || dest.illustrativeGallery.length === 0)
          ? { ...dest, illustrativeGallery: initMatch.illustrativeGallery }
          : dest;
      });

      return {
        ...INITIAL_CMS_DATA,
        ...parsed,
        profile: { ...INITIAL_CMS_DATA.profile, ...(parsed.profile || {}) },
        cloudinaryUrls: {
          ...INITIAL_CLOUDINARY_URLS,
          ...(parsed.cloudinaryUrls || {}),
        },
        destinations: mergedDestinations,
        movies: [...userAddedMovies, ...mergedCatalog],
      };
    }

    // Migration douce depuis d'anciennes versions anglaises : on récupère uniquement les créations/URLs utilisateur
    const legacyRaw = LEGACY_KEYS.map((k) => localStorage.getItem(k)).find(Boolean);
    if (legacyRaw) {
      const parsed = JSON.parse(legacyRaw) as Partial<SorayaCMSData>;
      const migratedCloudinary: Record<string, string> = { ...INITIAL_CLOUDINARY_URLS };
      if (parsed.cloudinaryUrls) {
        for (const [key, val] of Object.entries(parsed.cloudinaryUrls)) {
          if (typeof val === 'string' && val.trim() && (val.startsWith('https://res.cloudinary.com') || val.startsWith('data:'))) {
            migratedCloudinary[key] = val.trim();
          }
        }
      }

      const initMediaIds = new Set(INITIAL_CMS_DATA.mediaItems.map((m) => m.id));
      const userMedia = (parsed.mediaItems || []).filter(
        (m) => m && m.src && (!initMediaIds.has(m.id) || !m.isPlaceholder)
      );
      const userMediaIds = new Set(userMedia.map((m) => m.id));
      const mergedMedia = [
        ...userMedia,
        ...INITIAL_CMS_DATA.mediaItems.filter((m) => !userMediaIds.has(m.id)),
      ];

      const userBooks = (parsed.books || [])
        .filter((b) => b.id !== 'bk-template-1')
        .map((b) => ({ ...b, status: mapBookStatus(b.status) }));

      const userDishes = (parsed.dishes || [])
        .filter((d) => !d.isTemplateSlot)
        .map((d) => ({
          ...d,
          category: VALID_KITCHEN_CATEGORIES.has(d.category)
            ? d.category
            : LEGACY_KITCHEN_MAP[String(d.category)] || 'Cuisine Française',
        }));

      const migratedPlaylists = INITIAL_CMS_DATA.playlists.map((pl) => {
        const oldPl = parsed.playlists?.find((p) => p.id === pl.id);
        return oldPl?.embedUrl ? { ...pl, embedUrl: oldPl.embedUrl } : pl;
      });

      const oldReview = parsed.profile?.mrAndMrsSmithReview;
      const customReview =
        oldReview && !oldReview.startsWith('Add your personal review of Mr. & Mrs. Smith')
          ? oldReview
          : INITIAL_CMS_DATA.profile.mrAndMrsSmithReview;

      return {
        ...INITIAL_CMS_DATA,
        profile: {
          ...INITIAL_CMS_DATA.profile,
          linkedinUrl: parsed.profile?.linkedinUrl || INITIAL_CMS_DATA.profile.linkedinUrl,
          phoneNumber: parsed.profile?.phoneNumber || '',
          showPhonePublicly: Boolean(parsed.profile?.showPhonePublicly),
          portraitSrc:
            parsed.profile?.portraitSrc && parsed.profile.portraitSrc.startsWith('data:')
              ? parsed.profile.portraitSrc
              : INITIAL_CMS_DATA.profile.portraitSrc,
          mrAndMrsSmithReview: customReview,
        },
        cloudinaryUrls: migratedCloudinary,
        mediaItems: mergedMedia,
        playlists: migratedPlaylists,
        books: [...userBooks, ...INITIAL_CMS_DATA.books],
        dishes: [...userDishes, ...INITIAL_CMS_DATA.dishes],
      };
    }
  } catch {
    // Retour propre au jeu de données initial en français
  }
  return INITIAL_CMS_DATA;
}

export function UniverseProvider({ children }: { children: React.ReactNode }) {
  const [activeUniverse, setActiveUniverseState] = useState<UniverseId>('home');
  const [isCMSOpen, setIsCMSOpen] = useState(false);
  const [cmsInitialTab, setCmsInitialTab] = useState('cloudinary');
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [generatedTracks, setGeneratedTracks] = useState<GeneratedSoundtrack[]>([]);

  const [cmsData, setCmsData] = useState<SorayaCMSData>(hydrateCMSState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cmsData));
    } catch {
      // Ignorer les erreurs de quota stockage
    }
  }, [cmsData]);

  const setActiveUniverse = (id: UniverseId) => {
    setActiveUniverseState(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCMSAt = (tab: string) => {
    setCmsInitialTab(tab);
    setIsCMSOpen(true);
  };

  const getMediaUrl = (slotKey: string) => {
    const val = cmsData.cloudinaryUrls?.[slotKey];
    if (typeof val === 'string' && val.trim()) return val.trim();
    return INITIAL_CLOUDINARY_URLS[slotKey] || '';
  };

  const updateCloudinaryUrl = (slotKey: string, url: string) => {
    setCmsData((prev) => ({
      ...prev,
      cloudinaryUrls: {
        ...prev.cloudinaryUrls,
        [slotKey]: url.trim(),
      },
      ...(slotKey === 'portrait.main' && url.trim()
        ? { profile: { ...prev.profile, portraitSrc: url.trim() } }
        : {}),
    }));
  };

  const addGeneratedTrack = (track: GeneratedSoundtrack) => {
    setGeneratedTracks((prev) => [track, ...prev]);
  };

  const updateProfile = (patch: Partial<SorayaCMSData['profile']>) => {
    setCmsData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...patch },
      ...(patch.portraitSrc
        ? { cloudinaryUrls: { ...prev.cloudinaryUrls, 'portrait.main': patch.portraitSrc } }
        : {}),
    }));
  };

  const addMediaItem = (item: Omit<MediaItem, 'id'>) => {
    const newItem: MediaItem = { ...item, id: `media-${Date.now()}` };
    setCmsData((prev) => ({
      ...prev,
      mediaItems: [newItem, ...prev.mediaItems],
    }));
  };

  const deleteMediaItem = (id: string) => {
    setCmsData((prev) => ({
      ...prev,
      mediaItems: prev.mediaItems.filter((m) => m.id !== id),
    }));
  };

  const replacePlaceholderMedia = (
    id: string,
    src: string,
    mediaType: 'image' | 'video',
    caption?: string,
    title?: string
  ) => {
    setCmsData((prev) => ({
      ...prev,
      mediaItems: prev.mediaItems.map((m) =>
        m.id === id
          ? {
              ...m,
              src,
              mediaType,
              isPlaceholder: false,
              caption: caption || m.caption,
              title: title || m.title,
            }
          : m
      ),
    }));
  };

  const addDestination = (dest: Omit<TravelDestination, 'id'>) => {
    const id = `${dest.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    setCmsData((prev) => ({
      ...prev,
      destinations: [...prev.destinations, { ...dest, id }],
    }));
  };

  const updateDestinationDiary = (
    destId: string,
    entryTitle: string,
    notes: string,
    places: string
  ) => {
    setCmsData((prev) => ({
      ...prev,
      destinations: prev.destinations.map((d) =>
        d.id === destId
          ? {
              ...d,
              diaryEntries: [
                {
                  id: `entry-${Date.now()}`,
                  title: entryTitle,
                  date: new Date().toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
                  notes,
                  placesPlaceholder: places,
                },
                ...d.diaryEntries,
              ],
            }
          : d
      ),
    }));
  };

  const addMovie = (movie: Omit<MovieItem, 'id'>) => {
    setCmsData((prev) => ({
      ...prev,
      movies: [{ ...movie, id: `mov-${Date.now()}` }, ...prev.movies],
    }));
  };

  const updateMovieNote = (movieId: string, note: string) => {
    setCmsData((prev) => ({
      ...prev,
      movies: prev.movies.map((m) => (m.id === movieId ? { ...m, personalNote: note } : m)),
    }));
  };

  const updateMoviePoster = (movieId: string, posterUrl: string) => {
    setCmsData((prev) => ({
      ...prev,
      movies: prev.movies.map((m) => (m.id === movieId ? { ...m, posterUrl: posterUrl.trim() } : m)),
    }));
  };

  const updatePlaylistEmbed = (playlistId: string, embedUrl: string) => {
    setCmsData((prev) => ({
      ...prev,
      playlists: prev.playlists.map((p: MusicPlaylist) =>
        p.id === playlistId ? { ...p, embedUrl } : p
      ),
    }));
  };

  const addConcert = (concert: Omit<ConcertMemory, 'id'>) => {
    setCmsData((prev) => ({
      ...prev,
      concerts: [{ ...concert, id: `conc-${Date.now()}` }, ...prev.concerts],
    }));
  };

  const addBook = (book: Omit<BookEntry, 'id'>) => {
    setCmsData((prev) => ({
      ...prev,
      books: [{ ...book, id: `bk-${Date.now()}` }, ...prev.books],
    }));
  };

  const addDish = (dish: Omit<DishEntry, 'id'>) => {
    setCmsData((prev) => ({
      ...prev,
      dishes: [{ ...dish, id: `dish-${Date.now()}`, isTemplateSlot: false }, ...prev.dishes],
    }));
  };

  const resetCMS = () => {
    setCmsData(INITIAL_CMS_DATA);
    localStorage.removeItem(STORAGE_KEY);
    LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
  };

  const exportCMSJson = () => {
    const blob = new Blob([JSON.stringify(cmsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'soraya-world-contenu.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCMSJson = (raw: string): boolean => {
    try {
      const parsed = JSON.parse(raw) as SorayaCMSData;
      if (!parsed.profile || !Array.isArray(parsed.mediaItems)) return false;
      setCmsData({
        ...INITIAL_CMS_DATA,
        ...parsed,
        cloudinaryUrls: {
          ...INITIAL_CLOUDINARY_URLS,
          ...(parsed.cloudinaryUrls || {}),
        },
      });
      return true;
    } catch {
      return false;
    }
  };

  return (
    <UniverseContext.Provider
      value={{
        activeUniverse,
        setActiveUniverse,
        cmsData,
        isCMSOpen,
        setIsCMSOpen,
        cmsInitialTab,
        openCMSAt,
        lightboxItem,
        setLightboxItem,
        isCVModalOpen,
        setIsCVModalOpen,
        getMediaUrl,
        updateCloudinaryUrl,
        generatedTracks,
        addGeneratedTrack,
        updateProfile,
        addMediaItem,
        deleteMediaItem,
        replacePlaceholderMedia,
        addDestination,
        updateDestinationDiary,
        addMovie,
        updateMovieNote,
        updateMoviePoster,
        updatePlaylistEmbed,
        addConcert,
        addBook,
        addDish,
        resetCMS,
        exportCMSJson,
        importCMSJson,
      }}
    >
      {children}
    </UniverseContext.Provider>
  );
}

export function useUniverse() {
  const ctx = useContext(UniverseContext);
  if (!ctx) throw new Error('useUniverse doit être utilisé dans UniverseProvider');
  return ctx;
}
