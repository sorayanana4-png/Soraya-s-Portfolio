import React, { useEffect, useMemo, useState } from 'react';
import { Cloud, Download, RotateCcw, Upload, X } from 'lucide-react';
import { useUniverse } from '../context/UniverseContext';
import {
  CLOUDINARY_SLOT_DEFINITIONS,
  CloudinarySlotGroup,
} from '../data/mediaConfig';
import { COLLECTION_METADATA } from '../data/movies';
import { CinemaCollectionId, KitchenCategory } from '../types/universe';

const MEDIA_SECTIONS = [
  { key: 'clean-and-shop', label: 'Étude de cas Clean & Shop' },
  { key: 'motorsport', label: '24 Hours of Le Mans' },
  { key: 'creative-studio', label: 'The Creative Studio (Freelance)' },
  { key: 'travel-cote-ivoire', label: "Voyages — Côte d'Ivoire" },
  { key: 'travel-malta', label: 'Voyages — Malte' },
  { key: 'concerts', label: 'Musique & Concerts Live' },
  { key: 'lifestyle', label: 'Lifestyle & Équilibre' },
];

const CLOUDINARY_GROUPS: CloudinarySlotGroup[] = [
  'Portrait & Identité',
  'PermiFast',
  'LGD Paris',
  'Clean & Shop',
  '24 Hours of Le Mans',
  'Mahola & La Ville du Mans',
  'The Creative Studio (Freelance)',
  'Carnets de Voyage',
  'Musique & Concerts',
  'Ma Cuisine',
];

const KITCHEN_CATEGORIES: KitchenCategory[] = [
  'Cuisine Africaine',
  'Cuisine Française',
  'Cuisine Maghrébine',
  'Cuisine Italienne',
  'Cuisine Asiatique',
  'Cuisine Coréenne',
  'Pâtisserie & Desserts',
  'Fruits & Découvertes',
];

export function ContentStudioModal() {
  const {
    isCMSOpen,
    setIsCMSOpen,
    cmsInitialTab,
    cmsData,
    getMediaUrl,
    updateCloudinaryUrl,
    updateProfile,
    addMediaItem,
    addDestination,
    addMovie,
    addConcert,
    addBook,
    addDish,
    exportCMSJson,
    importCMSJson,
    resetCMS,
  } = useUniverse();

  const [tab, setTab] = useState<
    'cloudinary' | 'media' | 'cinema' | 'travel' | 'library' | 'kitchen' | 'music' | 'profile'
  >('cloudinary');
  const [selectedSlotGroup, setSelectedSlotGroup] = useState<CloudinarySlotGroup>('PermiFast');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Formulaire médias
  const [mediaSection, setMediaSection] = useState('clean-and-shop');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaCategory, setMediaCategory] = useState('Galerie personnelle');
  const [mediaDate, setMediaDate] = useState('2026');
  const [mediaCaption, setMediaCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  // Formulaire livres
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookQuote, setBookQuote] = useState('');
  const [bookReflection, setBookReflection] = useState('');

  // Formulaire cuisine
  const [dishTitle, setDishTitle] = useState('');
  const [dishCategory, setDishCategory] = useState<KitchenCategory>('Cuisine Africaine');
  const [dishStory, setDishStory] = useState('');
  const [dishIngredients, setDishIngredients] = useState('');
  const [dishImageSrc, setDishImageSrc] = useState('');

  // Formulaire cinéma
  const [movieTitle, setMovieTitle] = useState('');
  const [movieFormat, setMovieFormat] = useState<'Film' | 'Series'>('Film');
  const [movieCollection, setMovieCollection] = useState<CinemaCollectionId>('taylor-sheridan');
  const [movieDirector, setMovieDirector] = useState('');
  const [movieYear, setMovieYear] = useState('');
  const [movieGenre, setMovieGenre] = useState('');
  const [moviePosterUrl, setMoviePosterUrl] = useState('');
  const [movieNote, setMovieNote] = useState('');

  // Formulaire destination
  const [destName, setDestName] = useState('');
  const [destRegion, setDestRegion] = useState('');
  const [destNotes, setDestNotes] = useState('');

  // Formulaire concert
  const [concertArtist, setConcertArtist] = useState('');
  const [concertVenue, setConcertVenue] = useState('');
  const [concertDate, setConcertDate] = useState('');
  const [concertMemory, setConcertMemory] = useState('');

  useEffect(() => {
    if (!cmsInitialTab) return;
    if (cmsInitialTab.startsWith('media:')) {
      const [, sec, cat] = cmsInitialTab.split(':');
      setTab('media');
      if (sec) setMediaSection(sec);
      if (cat) setMediaCategory(cat);
    } else if (cmsInitialTab.startsWith('cloudinary:')) {
      const [, grp] = cmsInitialTab.split(':');
      setTab('cloudinary');
      if (grp && CLOUDINARY_GROUPS.includes(grp as CloudinarySlotGroup)) {
        setSelectedSlotGroup(grp as CloudinarySlotGroup);
      }
    } else if (
      ['cloudinary', 'media', 'cinema', 'travel', 'library', 'kitchen', 'music', 'profile'].includes(
        cmsInitialTab
      )
    ) {
      setTab(cmsInitialTab as typeof tab);
    }
  }, [cmsInitialTab]);

  const groupSlots = useMemo(
    () => CLOUDINARY_SLOT_DEFINITIONS.filter((s) => s.group === selectedSlotGroup),
    [selectedSlotGroup]
  );

  if (!isCMSOpen) return null;

  const notify = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onResult: (dataUrl: string, isVideo: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onResult(reader.result, isVideo);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setIsCMSOpen(false)}
    >
      <div
        className="bg-[#FAF8F5] text-stone-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-editorial text-2xl font-semibold">Studio de contenu &amp; Cloudinary de Soraya</h2>
            <p className="text-xs text-stone-500">
              Ajoutez vos URLs Cloudinary personnelles ou enrichissez vos films, concerts, plats, livres et carnets de voyage.
            </p>
          </div>
          <button
            type="button"
            aria-label="Fermer le Studio de contenu"
            onClick={() => setIsCMSOpen(false)}
            className="p-2 rounded-lg hover:bg-stone-200/70 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Onglets de navigation */}
        <div className="px-6 pt-4 border-b border-stone-200 flex items-center gap-2 overflow-x-auto editorial-scroll">
          {[
            { id: 'cloudinary', label: 'URLs Cloudinary' },
            { id: 'media', label: 'Photos & Vidéos' },
            { id: 'travel', label: 'Voyages' },
            { id: 'cinema', label: 'Cinéma & Séries' },
            { id: 'music', label: 'Musique' },
            { id: 'library', label: 'Bibliothèque' },
            { id: 'kitchen', label: 'Ma Cuisine' },
            { id: 'profile', label: 'Profil & Sauvegarde' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as typeof tab)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                tab === t.id
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-6">
          {feedback && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-medium">
              {feedback}
            </div>
          )}

          {tab === 'cloudinary' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
                  <Cloud className="w-4 h-4" />
                  <span>Gestionnaire centralisé Cloudinary</span>
                </div>
                <p className="text-xs text-stone-600">
                  Sélectionnez une section ci-dessous et collez vos URLs Cloudinary personnelles. Les modifications s’appliquent instantanément et peuvent aussi être inscrites durablement dans <code className="font-tabular">src/data/mediaConfig.ts</code>.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {CLOUDINARY_GROUPS.map((grp) => (
                  <button
                    key={grp}
                    type="button"
                    onClick={() => setSelectedSlotGroup(grp)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer transition-colors ${
                      selectedSlotGroup === grp
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500'
                    }`}
                  >
                    {grp}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupSlots.map((slot) => {
                  const val = getMediaUrl(slot.key);
                  return (
                    <div
                      key={slot.key}
                      className="rounded-xl border border-stone-200 bg-white p-4 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold text-stone-900">{slot.label}</p>
                          <p className="text-[11px] text-stone-500">{slot.description}</p>
                        </div>
                        <span className="font-tabular text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 shrink-0">
                          {slot.key}
                        </span>
                      </div>
                      <input
                        type="url"
                        value={val}
                        onChange={(e) => updateCloudinaryUrl(slot.key, e.target.value)}
                        placeholder="https://res.cloudinary.com/..."
                        className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-xs text-stone-900"
                      />
                      {val && (
                        <div className="flex items-center justify-between text-[11px] text-emerald-700">
                          <span>Image active enregistrée</span>
                          <button
                            type="button"
                            onClick={() => updateCloudinaryUrl(slot.key, '')}
                            className="text-stone-500 hover:text-red-700 underline cursor-pointer"
                          >
                            Effacer
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'media' && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!mediaTitle.trim()) return;
                addMediaItem({
                  section: mediaSection,
                  mediaType,
                  src: mediaUrl.trim(),
                  title: mediaTitle.trim(),
                  caption: mediaCaption.trim() || 'Ajouté depuis le Studio de contenu',
                  date: mediaDate.trim() || '2026',
                  category: mediaCategory.trim() || 'Galerie personnelle',
                  isPlaceholder: !mediaUrl.trim(),
                });
                setMediaTitle('');
                setMediaCaption('');
                setMediaUrl('');
                notify('Média ajouté à la galerie.');
              }}
            >
              <h3 className="font-editorial text-xl font-semibold">Ajouter une photo ou vidéo à un univers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block text-xs font-medium text-stone-600">
                  Univers cible
                  <select
                    value={mediaSection}
                    onChange={(e) => setMediaSection(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900"
                  >
                    {MEDIA_SECTIONS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-xs font-medium text-stone-600">
                  Type de média
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as 'image' | 'video')}
                    className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900"
                  >
                    <option value="image">Photographie</option>
                    <option value="video">Vidéo</option>
                  </select>
                </label>

                <label className="block text-xs font-medium text-stone-600">
                  Titre
                  <input
                    required
                    value={mediaTitle}
                    onChange={(e) => setMediaTitle(e.target.value)}
                    placeholder="Ex. : Sneakers personnalisées Air Force 1"
                    className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                  />
                </label>

                <label className="block text-xs font-medium text-stone-600">
                  Catégorie &amp; Date
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    <input
                      value={mediaCategory}
                      onChange={(e) => setMediaCategory(e.target.value)}
                      placeholder="Catégorie"
                      className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                    />
                    <input
                      value={mediaDate}
                      onChange={(e) => setMediaDate(e.target.value)}
                      placeholder="Date"
                      className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <label className="block text-xs font-medium text-stone-600">
                  Importer depuis votre appareil
                  <div className="mt-1.5 flex items-center gap-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Choisir image ou vidéo
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e, (url, isVid) => {
                            setMediaUrl(url);
                            setMediaType(isVid ? 'video' : 'image');
                          })
                        }
                      />
                    </label>
                    {mediaUrl && <span className="text-xs text-emerald-700">Fichier prêt</span>}
                  </div>
                </label>

                <label className="block text-xs font-medium text-stone-600">
                  Ou coller une URL Cloudinary / Média
                  <input
                    value={mediaUrl.startsWith('data:') ? 'Fichier local importé' : mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://res.cloudinary.com/..."
                    className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <label className="block text-xs font-medium text-stone-600">
                Légende / Récit
                <textarea
                  rows={2}
                  value={mediaCaption}
                  onChange={(e) => setMediaCaption(e.target.value)}
                  placeholder="Décrivez le souvenir, la réalisation ou le contexte..."
                  className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                />
              </label>

              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 cursor-pointer"
              >
                Publier dans la galerie
              </button>
            </form>
          )}

          {tab === 'travel' && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!destName.trim()) return;
                addDestination({
                  name: destName.trim(),
                  region: destRegion.trim() || 'International',
                  coordinates: { x: 52, y: 42 },
                  atmosphere: 'Carnet de voyage personnel',
                  palette: {
                    primary: '#0EA5A4',
                    secondary: '#E86A24',
                    bg: '#F8FAFC',
                    text: '#0F172A',
                    accent: '#0EA5A4',
                    cardBg: '#FFFFFF',
                  },
                  diaryEntries: [
                    {
                      id: `de-${Date.now()}`,
                      title: `Carnet de voyage — ${destName.trim()}`,
                      date: new Date().toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
                      notes: destNotes.trim() || 'Souvenirs, découvertes et impressions personnelles.',
                      placesPlaceholder: 'Ajouter les lieux visités',
                    },
                  ],
                  gallerySectionKey: `travel-${destName.trim().toLowerCase().replace(/\s+/g, '-')}`,
                });
                setDestName('');
                setDestRegion('');
                setDestNotes('');
                notify('Nouvelle destination ajoutée à Mon Passeport.');
              }}
            >
              <h3 className="font-editorial text-xl font-semibold">Ajouter une destination à Mon Passeport</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block text-xs font-medium text-stone-600">
                  Nom de la destination
                  <input
                    required
                    value={destName}
                    onChange={(e) => setDestName(e.target.value)}
                    placeholder="Ex. : Maroc, Espagne, Londres"
                    className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-xs font-medium text-stone-600">
                  Région
                  <input
                    value={destRegion}
                    onChange={(e) => setDestRegion(e.target.value)}
                    placeholder="Ex. : Méditerranée / Europe"
                    className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                  />
                </label>
              </div>
              <label className="block text-xs font-medium text-stone-600">
                Notes de voyage
                <textarea
                  rows={3}
                  value={destNotes}
                  onChange={(e) => setDestNotes(e.target.value)}
                  placeholder="Partagez vos souvenirs authentiques et coups de cœur..."
                  className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                />
              </label>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 cursor-pointer"
              >
                Ajouter la destination
              </button>
            </form>
          )}

          {tab === 'cinema' && (
            <div className="space-y-6">
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!movieTitle.trim()) return;
                  addMovie({
                    title: movieTitle.trim(),
                    format: movieFormat,
                    collection: movieCollection,
                    directorOrCreator: movieDirector.trim() || 'Créateur / Réalisateur',
                    releaseYear: movieYear.trim() || 'Ajouté par Soraya',
                    genre: movieGenre.trim() || (movieFormat === 'Film' ? 'Film' : 'Série'),
                    shortDescription: movieNote.trim() || 'Ajouté à la vidéothèque personnelle de Soraya.',
                    posterUrl: moviePosterUrl.trim(),
                    wikiTitle: movieTitle.trim().replace(/\s+/g, '_'),
                    tone: movieGenre.trim() || 'Coup de cœur personnel',
                    accentColor: '#F59E0B',
                    personalNote: movieNote.trim() || 'Ajouté par Soraya.',
                  });
                  setMovieTitle('');
                  setMovieDirector('');
                  setMovieYear('');
                  setMovieGenre('');
                  setMoviePosterUrl('');
                  setMovieNote('');
                  notify('Titre ajouté à la section Cinéma & Séries.');
                }}
              >
                <h3 className="font-editorial text-xl font-semibold">Ajouter un film ou une série</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="block text-xs font-medium text-stone-600">
                    Titre original
                    <input
                      required
                      value={movieTitle}
                      onChange={(e) => setMovieTitle(e.target.value)}
                      placeholder="Titre du film ou de la série"
                      className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="block text-xs font-medium text-stone-600">
                    Format
                    <select
                      value={movieFormat}
                      onChange={(e) => setMovieFormat(e.target.value as 'Film' | 'Series')}
                      className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                    >
                      <option value="Film">Film</option>
                      <option value="Series">Série</option>
                    </select>
                  </label>
                  <label className="block text-xs font-medium text-stone-600">
                    Collection
                    <select
                      value={movieCollection}
                      onChange={(e) => setMovieCollection(e.target.value as CinemaCollectionId)}
                      className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                    >
                      {COLLECTION_METADATA.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    value={movieDirector}
                    onChange={(e) => setMovieDirector(e.target.value)}
                    placeholder="Réalisateur ou créateur"
                    className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                  />
                  <input
                    value={movieYear}
                    onChange={(e) => setMovieYear(e.target.value)}
                    placeholder="Année de sortie"
                    className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                  />
                  <input
                    value={movieGenre}
                    onChange={(e) => setMovieGenre(e.target.value)}
                    placeholder="Genre (ex. : Action / Drame)"
                    className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                  />
                </div>

                <input
                  type="url"
                  value={moviePosterUrl}
                  onChange={(e) => setMoviePosterUrl(e.target.value)}
                  placeholder="URL d’affiche officielle optionnelle (sinon recherche automatique)"
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                />

                <label className="block text-xs font-medium text-stone-600">
                  Commentaire personnel
                  <input
                    value={movieNote}
                    onChange={(e) => setMovieNote(e.target.value)}
                    placeholder="Pourquoi aimez-vous ce film ou cette série ?"
                    className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                  />
                </label>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 cursor-pointer"
                >
                  Ajouter à la vidéothèque
                </button>
              </form>

              <div className="pt-4 border-t border-stone-200 space-y-2">
                <h4 className="font-editorial text-lg font-semibold">Modifier la critique personnelle de Mr. &amp; Mrs. Smith</h4>
                <textarea
                  rows={3}
                  value={cmsData.profile.mrAndMrsSmithReview}
                  onChange={(e) => updateProfile({ mrAndMrsSmithReview: e.target.value })}
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}

          {tab === 'music' && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!concertArtist.trim()) return;
                addConcert({
                  artist: concertArtist.trim(),
                  venueType: concertVenue.trim() || 'Salle de concert',
                  date: concertDate.trim() || '2026',
                  memory: concertMemory.trim() || 'Performance live mémorable.',
                  hasMediaPlaceholder: true,
                });
                setConcertArtist('');
                setConcertVenue('');
                setConcertDate('');
                setConcertMemory('');
                notify('Concert ajouté à votre frise live.');
              }}
            >
              <h3 className="font-editorial text-xl font-semibold">Ajouter un souvenir de concert</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  required
                  value={concertArtist}
                  onChange={(e) => setConcertArtist(e.target.value)}
                  placeholder="Artiste / Groupe"
                  className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                />
                <input
                  value={concertVenue}
                  onChange={(e) => setConcertVenue(e.target.value)}
                  placeholder="Salle / Ville"
                  className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                />
                <input
                  value={concertDate}
                  onChange={(e) => setConcertDate(e.target.value)}
                  placeholder="Date"
                  className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <textarea
                rows={2}
                value={concertMemory}
                onChange={(e) => setConcertMemory(e.target.value)}
                placeholder="Partagez votre souvenir de concert..."
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 cursor-pointer"
              >
                Ajouter le concert
              </button>
            </form>
          )}

          {tab === 'library' && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!bookTitle.trim()) return;
                addBook({
                  title: bookTitle.trim(),
                  author: bookAuthor.trim() || 'Auteur',
                  theme: 'Bibliothèque personnelle',
                  quote: bookQuote.trim(),
                  reflection: bookReflection.trim() || 'Ajouté par Soraya.',
                  status: 'Coup de cœur',
                });
                setBookTitle('');
                setBookAuthor('');
                setBookQuote('');
                setBookReflection('');
                notify('Livre ajouté à la bibliothèque.');
              }}
            >
              <h3 className="font-editorial text-xl font-semibold">Ajouter un livre et une réflexion</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  required
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="Titre du livre"
                  className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                />
                <input
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                  placeholder="Auteur"
                  className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <input
                value={bookQuote}
                onChange={(e) => setBookQuote(e.target.value)}
                placeholder="Citation marquante (optionnel)"
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
              />
              <textarea
                rows={3}
                value={bookReflection}
                onChange={(e) => setBookReflection(e.target.value)}
                placeholder="Réflexions personnelles et enseignements clés..."
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 cursor-pointer"
              >
                Ajouter à la bibliothèque
              </button>
            </form>
          )}

          {tab === 'kitchen' && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!dishTitle.trim()) return;
                addDish({
                  title: dishTitle.trim(),
                  category: dishCategory,
                  story: dishStory.trim() || 'Partagé dans Ma Cuisine.',
                  ingredients: dishIngredients
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                  date: new Date().toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
                  imageSrc: dishImageSrc || undefined,
                });
                setDishTitle('');
                setDishStory('');
                setDishIngredients('');
                setDishImageSrc('');
                notify('Plat ajouté à Ma Cuisine.');
              }}
            >
              <h3 className="font-editorial text-xl font-semibold">Ajouter un plat ou une recette à Ma Cuisine</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  required
                  value={dishTitle}
                  onChange={(e) => setDishTitle(e.target.value)}
                  placeholder="Nom du plat"
                  className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                />
                <select
                  value={dishCategory}
                  onChange={(e) => setDishCategory(e.target.value as KitchenCategory)}
                  className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                >
                  {KITCHEN_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <input
                value={dishIngredients}
                onChange={(e) => setDishIngredients(e.target.value)}
                placeholder="Ingrédients principaux (séparés par des virgules)"
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
              />
              <textarea
                rows={2}
                value={dishStory}
                onChange={(e) => setDishStory(e.target.value)}
                placeholder="Histoire du plat ou conseils de préparation..."
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
              />
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-300 bg-white text-xs font-semibold cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Importer une photo du plat
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (url) => setDishImageSrc(url))}
                  />
                </label>
                {dishImageSrc && <span className="text-xs text-emerald-700">Photo jointe</span>}
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 cursor-pointer"
              >
                Publier dans Ma Cuisine
              </button>
            </form>
          )}

          {tab === 'profile' && (
            <div className="space-y-5">
              <h3 className="font-editorial text-xl font-semibold">Paramètres du profil &amp; Sauvegarde</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block text-xs font-medium text-stone-600">
                  URL du profil LinkedIn
                  <input
                    value={cmsData.profile.linkedinUrl}
                    onChange={(e) => updateProfile({ linkedinUrl: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-xs font-medium text-stone-600">
                  Mention du niveau d’anglais
                  <input
                    value={cmsData.profile.englishStatusNote}
                    onChange={(e) => updateProfile({ englishStatusNote: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <label className="block text-xs font-medium text-stone-600">
                  Note académique (affichée sous Formation)
                  <input
                    value={cmsData.profile.educationNote}
                    onChange={(e) => updateProfile({ educationNote: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                  />
                </label>
                <div className="text-xs font-medium text-stone-600">
                  Photographie portrait d’accueil
                  <div className="mt-1.5 flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold cursor-pointer text-stone-900">
                      <Upload className="w-4 h-4" />
                      Importer un nouveau portrait
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e, (url) => {
                            updateProfile({ portraitSrc: url });
                            notify('Portrait principal mis à jour.');
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-3">
                <label className="flex items-center gap-2.5 text-sm font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cmsData.profile.showPhonePublicly}
                    onChange={(e) => updateProfile({ showPhonePublicly: e.target.checked })}
                    className="rounded border-stone-300"
                  />
                  Afficher publiquement mon numéro sur la page Contact (masqué par défaut par confidentialité)
                </label>
                {cmsData.profile.showPhonePublicly && (
                  <input
                    value={cmsData.profile.phoneNumber}
                    onChange={(e) => updateProfile({ phoneNumber: e.target.value })}
                    placeholder="Saisir le numéro de téléphone à afficher"
                    className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                  />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={exportCMSJson}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Exporter le contenu JSON
                </button>
                <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold border border-stone-300 bg-white rounded-lg hover:bg-stone-50 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Importer une sauvegarde JSON
                  <input
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      f.text().then((txt) => {
                        if (importCMSJson(txt)) notify('Sauvegarde importée avec succès.');
                        else notify('Format JSON invalide.');
                      });
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    resetCMS();
                    notify('Contenu réinitialisé aux valeurs par défaut.');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-700 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Réinitialiser
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
