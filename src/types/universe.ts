import type { MovieCollectionId, MovieRecord } from '../data/movies';

export type UniverseId =
  | 'home'
  | 'career'
  | 'projects'
  | 'travel'
  | 'cinema'
  | 'music'
  | 'library'
  | 'kitchen'
  | 'lifestyle'
  | 'contact';

export interface MediaItem {
  id: string;
  section:
    | 'clean-and-shop'
    | 'motorsport'
    | 'creative-studio'
    | 'travel-cote-ivoire'
    | 'travel-malta'
    | 'concerts'
    | 'kitchen'
    | 'lifestyle'
    | string;
  mediaType: 'image' | 'video';
  src: string;
  title: string;
  caption: string;
  date: string;
  category: string;
  isPlaceholder?: boolean;
}

export interface ExperienceVisualAsset {
  title: string;
  subtitle: string;
  imageUrl: string;
  badge: string;
  isExternalLink?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  period: string;
  dateNote?: string;
  industry: string;
  location: string;
  summary: string;
  highlights: string[];
  responsibilities: string[];
  secondaryResponsibilities?: { label: string; items: string[] };
  skills: string[];
  tools?: string[];
  theme: {
    bg: string;
    surface: string;
    accent: string;
    text: string;
    muted: string;
    border: string;
    badgeText: string;
  };
  heroImage?: string;
  illustrativeVisuals?: ExperienceVisualAsset[];
  isMotorsport?: boolean;
  disclaimer?: string;
  gallerySectionKey?: string;
}

export interface SkillLink {
  name: string;
  category: 'business' | 'marketing' | 'tools' | 'soft';
  experienceIds: string[];
}

export interface EntrepreneurialProject {
  id: string;
  name: string;
  classification: 'Entreprise indépendante' | 'Projet académique & business' | 'Initiative personnelle';
  status: string;
  concept: string;
  targetAudience: string;
  businessModel: string;
  marketingApproach: string;
  visualIdentity: string;
  tools: string[];
  challenges: string;
  lessonsLearned: string;
}

export interface CreativeStudioCase {
  id: string;
  clientType: string;
  category: 'Restauration' | 'Institut de beauté' | 'Marque & Lifestyle';
  deliverables: string[];
  scope: string;
  formatFocus: string;
  atmosphereImage: string;
  atmosphereCaption: string;
}

export interface TravelGalleryPhoto {
  id: string;
  title: string;
  locationLabel: string;
  imageUrl: string;
  caption: string;
}

export interface TravelDestination {
  id: string;
  name: string;
  region: string;
  coordinates: { x: number; y: number };
  atmosphere: string;
  palette: {
    primary: string;
    secondary: string;
    bg: string;
    text: string;
    accent: string;
    cardBg: string;
  };
  heroImage?: string;
  illustrativeGallery?: TravelGalleryPhoto[];
  diaryEntries: {
    id: string;
    title: string;
    date: string;
    notes: string;
    placesPlaceholder: string;
  }[];
  gallerySectionKey: string;
}

export type CinemaCollectionId = MovieCollectionId;
export type MovieItem = MovieRecord;

export interface MusicArtist {
  id: string;
  name: string;
  rank?: number;
  tier: 'top-artist' | 'icon' | 'rnb' | 'new-voice';
  roleNote: string;
  highlight: string;
  accentColor: string;
  wikiTitle: string;
  portraitUrl: string;
  signatureTrack?: string;
}

export interface MusicAlbum {
  id: string;
  title: string;
  artist: string;
  year: string;
  genre: string;
  itunesQuery: string;
  coverUrl: string;
  accentColor: string;
  note: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  itunesQuery: string;
  mood: string;
  artworkUrl?: string;
}

export interface MusicDiscovery {
  id: string;
  title: string;
  artist: string;
  context: string;
  note: string;
}

export interface YearlyMusicChapter {
  year: string;
  eraLabel: string;
  leadArtists: string;
  anthem: string;
  story: string;
  accent: string;
}

export interface GeneratedSoundtrack {
  id: string;
  title: string;
  atmosphere: string;
  genre: string;
  description: string;
  audioDataUrl: string;
  mimeType: string;
  lyrics: string;
  model: string;
  createdAt: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  mood: string;
  description: string;
  embedUrl?: string;
}

export interface ConcertMemory {
  id: string;
  artist: string;
  venueType: string;
  date: string;
  memory: string;
  hasMediaPlaceholder: boolean;
}

export interface BookEntry {
  id: string;
  title: string;
  author: string;
  theme: string;
  quote: string;
  reflection: string;
  status: 'Coup de cœur' | 'Réflexion personnelle' | 'À lire';
}

export type KitchenCategory =
  | 'Cuisine Africaine'
  | 'Cuisine Française'
  | 'Cuisine Maghrébine'
  | 'Cuisine Italienne'
  | 'Cuisine Asiatique'
  | 'Cuisine Coréenne'
  | 'Pâtisserie & Desserts'
  | 'Fruits & Découvertes';

export interface CuratedDishVisual {
  id: string;
  title: string;
  category: KitchenCategory;
  origin: string;
  description: string;
  imageUrl: string;
}

export interface DishEntry {
  id: string;
  title: string;
  category: KitchenCategory;
  story: string;
  ingredients: string[];
  date: string;
  imageSrc?: string;
  videoSrc?: string;
  isTemplateSlot?: boolean;
}

export interface LifestylePillar {
  id: string;
  title: string;
  focus: string;
  description: string;
  personalNote: string;
}

export interface SorayaCMSData {
  profile: {
    name: string;
    headline: string;
    intro: string;
    email: string;
    linkedinUrl: string;
    phoneNumber: string;
    showPhonePublicly: boolean;
    portraitSrc: string;
    mrAndMrsSmithReview: string;
    englishStatusNote: string;
    educationNote: string;
  };
  cloudinaryUrls: Record<string, string>;
  mediaItems: MediaItem[];
  destinations: TravelDestination[];
  movies: MovieItem[];
  playlists: MusicPlaylist[];
  concerts: ConcertMemory[];
  books: BookEntry[];
  dishes: DishEntry[];
  lifestylePillars: LifestylePillar[];
}
