import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Film, Link2, Plus, Star, X } from 'lucide-react';
import { useUniverse } from '../context/UniverseContext';
import { COLLECTION_METADATA } from '../data/movies';
import { fetchWikipediaThumbnail } from '../services/mediaLookupService';
import { CinemaCollectionId, MovieItem } from '../types/universe';

export function CinemaView() {
  const { cmsData, openCMSAt, updateProfile, updateMovieNote, updateMoviePoster } = useUniverse();
  const [genreFilter, setGenreFilter] = useState<'all' | CinemaCollectionId>('all');
  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);
  const [editingReview, setEditingReview] = useState(false);
  const [posterMap, setPosterMap] = useState<Record<string, string>>({});
  const [posterErrors, setPosterErrors] = useState<Record<string, boolean>>({});
  const [draftPosterUrl, setDraftPosterUrl] = useState('');
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    let active = true;
    const resolveArtworks = async () => {
      const entries = await Promise.all(
        cmsData.movies
          .filter((m) => !m.posterUrl && m.wikiTitle && !m.isPlaceholder)
          .map(async (m) => {
            const url = await fetchWikipediaThumbnail(m.wikiTitle!);
            return url ? ([m.id, url] as const) : null;
          })
      );
      if (!active) return;
      const resolved: Record<string, string> = {};
      for (const pair of entries) {
        if (pair) resolved[pair[0]] = pair[1];
      }
      if (Object.keys(resolved).length > 0) {
        setPosterMap((prev) => ({ ...prev, ...resolved }));
      }
    };
    resolveArtworks();
    return () => {
      active = false;
    };
  }, [cmsData.movies]);

  const scrollRow = (id: string, dir: -1 | 1) => {
    rowRefs.current[id]?.scrollBy({ left: dir * 480, behavior: 'smooth' });
  };

  const getPoster = (movie: MovieItem) => {
    if (posterErrors[movie.id]) return '';
    return movie.posterUrl || posterMap[movie.id] || '';
  };

  const visibleCollections =
    genreFilter === 'all'
      ? COLLECTION_METADATA
      : COLLECTION_METADATA.filter((c) => c.id === genreFilter);

  const featuredFilm = cmsData.movies.find((m) => m.isAllTimeFavorite) || cmsData.movies[0];
  const featuredPoster = featuredFilm ? getPoster(featuredFilm) : '';

  const openModal = (movie: MovieItem) => {
    setSelectedMovie(movie);
    setDraftPosterUrl(movie.posterUrl || '');
  };

  const getCreatorLabel = (format: MovieItem['format']) =>
    format === 'Series' ? 'Créateur / Showrunner :' : 'Réalisateur :';

  const getFormatLabel = (format: MovieItem['format']) =>
    format === 'Series' ? 'Série' : 'Film';

  return (
    <div className="bg-[#09090D] text-stone-100 min-h-screen pb-24">
      {/* Bannière phare : Film préféré de tous les temps — Mr. & Mrs. Smith (sans emojis) */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              'radial-gradient(circle at 75% 30%, rgba(225, 29, 72, 0.25), transparent 52%), radial-gradient(circle at 20% 70%, rgba(212, 175, 55, 0.14), transparent 55%), linear-gradient(180deg, #150C10 0%, #09090D 100%)',
          }}
        />
        <div className="relative max-w-[1440px] mx-auto px-5 md:px-10 py-14 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>04 · Cinéma &amp; Séries</span>
              <span aria-hidden="true">·</span>
              <span>Film préféré de tous les temps</span>
            </div>

            <h1 className="font-editorial text-5xl md:text-7xl font-semibold tracking-tight text-white">
              Mr. &amp; Mrs. Smith
            </h1>

            <p className="text-sm text-stone-300">
              Réalisé par {featuredFilm?.directorOrCreator || 'Doug Liman'} ·{' '}
              {featuredFilm?.releaseYear || '2005'} · Action / Comédie romantique · Regardé en version originale
            </p>

            {featuredFilm?.shortDescription && (
              <p className="text-sm text-stone-300/90 max-w-2xl leading-relaxed">
                {featuredFilm.shortDescription}
              </p>
            )}

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 max-w-2xl">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-amber-300">La critique personnelle de Soraya</p>
                <button
                  type="button"
                  onClick={() => setEditingReview((v) => !v)}
                  className="text-xs text-stone-300 hover:text-white underline cursor-pointer"
                >
                  {editingReview ? 'Terminer' : 'Modifier la critique'}
                </button>
              </div>
              {editingReview ? (
                <textarea
                  rows={3}
                  value={cmsData.profile.mrAndMrsSmithReview}
                  onChange={(e) => updateProfile({ mrAndMrsSmithReview: e.target.value })}
                  className="w-full rounded-lg bg-black/50 border border-white/20 p-3 text-sm text-white"
                />
              ) : (
                <p className="text-sm md:text-base text-stone-200 leading-relaxed">
                  {cmsData.profile.mrAndMrsSmithReview}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {featuredFilm && (
                <button
                  type="button"
                  onClick={() => openModal(featuredFilm)}
                  className="px-5 py-2.5 text-xs font-semibold bg-white text-stone-950 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  Ouvrir la fiche du film
                </button>
              )}
              <button
                type="button"
                onClick={() => openCMSAt('cinema')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold bg-white/10 text-white border border-white/15 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Ajouter un film ou une série
              </button>
            </div>
          </div>

          {/* Affiche officielle Mr. & Mrs. Smith */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <button
              type="button"
              onClick={() => featuredFilm && openModal(featuredFilm)}
              className="relative w-full max-w-xs aspect-[2/3] rounded-2xl overflow-hidden border border-amber-400/35 shadow-2xl transition-transform hover:-translate-y-1 cursor-pointer bg-[#140D11] text-left flex flex-col justify-end"
            >
              {featuredPoster ? (
                <img
                  src={featuredPoster}
                  alt="Affiche officielle Mr. & Mrs. Smith"
                  referrerPolicy="no-referrer"
                  onError={() =>
                    featuredFilm &&
                    setPosterErrors((prev) => ({ ...prev, [featuredFilm.id]: true }))
                  }
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#181014]">
                  <Film className="w-8 h-8 text-amber-300/80 mb-2" />
                  <p className="font-editorial text-2xl text-white">Mr. &amp; Mrs. Smith</p>
                  <p className="text-[11px] text-stone-400 mt-1">Cliquer pour personnaliser l’affiche</p>
                </div>
              )}
              <div className="relative z-10 p-6 bg-gradient-to-t from-black/95 via-black/65 to-transparent space-y-1.5">
                <p className="text-[11px] font-medium text-amber-300">2005 · Doug Liman</p>
                <h2 className="font-editorial text-3xl font-semibold text-white leading-tight">
                  Mr. &amp; Mrs. Smith
                </h2>
                <p className="text-xs text-stone-300 line-clamp-2">
                  Film préféré de tous les temps
                </p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Barre de filtres par collection */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 pt-8 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto editorial-scroll pb-2">
          <button
            type="button"
            onClick={() => setGenreFilter('all')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              genreFilter === 'all'
                ? 'bg-white text-stone-950'
                : 'bg-white/5 text-stone-300 hover:bg-white/10'
            }`}
          >
            Toutes les collections ({cmsData.movies.length})
          </button>
          {COLLECTION_METADATA.map((col) => (
            <button
              key={col.id}
              type="button"
              onClick={() => setGenreFilter(col.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                genreFilter === col.id
                  ? 'bg-white text-stone-950'
                  : 'bg-white/5 text-stone-300 hover:bg-white/10'
              }`}
            >
              {col.title}
            </button>
          ))}
        </div>
      </div>

      {/* Carrousels horizontaux inspirés des plateformes de streaming */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 space-y-14 mt-4">
        {visibleCollections.map((col) => {
          const items = cmsData.movies.filter((m) => m.collection === col.id);
          return (
            <section
              key={col.id}
              className={`rounded-2xl p-6 md:p-8 border border-white/10 bg-gradient-to-br ${col.bannerBg}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                <div>
                  <p className="text-xs font-medium" style={{ color: col.accent }}>
                    {col.subtitle}
                  </p>
                  <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-white mt-1">
                    {col.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => openCMSAt('cinema')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Ajouter un titre
                  </button>
                  <button
                    type="button"
                    aria-label={`Défiler ${col.title} vers la gauche`}
                    onClick={() => scrollRow(col.id, -1)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Défiler ${col.title} vers la droite`}
                    onClick={() => scrollRow(col.id, 1)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                ref={(el) => {
                  rowRefs.current[col.id] = el;
                }}
                className="flex items-stretch gap-4 overflow-x-auto editorial-scroll pb-4 snap-x"
              >
                {items.map((movie) => {
                  const poster = getPoster(movie);
                  return (
                    <button
                      key={movie.id}
                      type="button"
                      onClick={() => openModal(movie)}
                      className="snap-start shrink-0 w-[215px] sm:w-[235px] aspect-[2/3] rounded-xl overflow-hidden relative flex flex-col justify-between text-left border border-white/15 hover:border-white/50 transition-transform duration-300 hover:-translate-y-1 cursor-pointer group bg-[#121218]"
                    >
                      {poster ? (
                        <img
                          src={poster}
                          alt={`Affiche de ${movie.title}`}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setPosterErrors((prev) => ({ ...prev, [movie.id]: true }))
                          }
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center bg-gradient-to-b from-[#1F1A24] to-[#0E0E14]">
                          <Film className="w-7 h-7 mb-2 opacity-60" style={{ color: movie.accentColor }} />
                          <p className="font-editorial text-lg font-semibold text-white line-clamp-2">
                            {movie.title}
                          </p>
                          <p className="text-[11px] text-stone-400 mt-1">
                            {movie.isPlaceholder ? 'Emplacement libre' : movie.releaseYear}
                          </p>
                        </div>
                      )}

                      <div className="relative z-10 p-4 flex items-center justify-between text-[11px] text-white/90 bg-gradient-to-b from-black/80 to-transparent">
                        <span className="font-medium">
                          {getFormatLabel(movie.format)} · {movie.releaseYear}
                        </span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      <div className="relative z-10 p-4 pt-12 bg-gradient-to-t from-black/95 via-black/80 to-transparent space-y-1">
                        <p className="text-[11px] font-medium truncate" style={{ color: movie.accentColor }}>
                          {movie.genre}
                        </p>
                        <h3 className="font-editorial text-xl font-semibold text-white leading-tight line-clamp-2">
                          {movie.title}
                        </h3>
                        <p className="text-[11px] text-stone-300 line-clamp-2">
                          {getCreatorLabel(movie.format)} {movie.directorOrCreator}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Modale détaillée d'un titre */}
      {selectedMovie && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="bg-[#121218] text-stone-100 rounded-2xl max-w-2xl w-full border border-white/15 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-7 bg-[#1A1419] border-b border-white/10 flex items-start justify-between gap-4">
              <div className="flex items-start gap-5">
                {getPoster(selectedMovie) ? (
                  <img
                    src={getPoster(selectedMovie)}
                    alt={selectedMovie.title}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setPosterErrors((prev) => ({ ...prev, [selectedMovie.id]: true }))
                    }
                    className="w-24 aspect-[2/3] object-cover rounded-lg border border-white/20 shrink-0"
                  />
                ) : (
                  <div className="w-24 aspect-[2/3] rounded-lg border border-dashed border-white/25 bg-white/5 flex items-center justify-center shrink-0">
                    <Film className="w-6 h-6 text-white/40" />
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-amber-300">
                    {getFormatLabel(selectedMovie.format)} · {selectedMovie.releaseYear} · {selectedMovie.genre}
                  </p>
                  <h3 className="font-editorial text-3xl md:text-4xl font-semibold text-white mt-1">
                    {selectedMovie.title}
                  </h3>
                  <p className="text-xs text-stone-300 mt-1">
                    {getCreatorLabel(selectedMovie.format)} {selectedMovie.directorOrCreator}
                  </p>
                  <p className="text-sm text-stone-300 mt-3 leading-relaxed">
                    {selectedMovie.shortDescription}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Fermer la fiche du titre"
                onClick={() => setSelectedMovie(null)}
                className="p-2 rounded-lg bg-black/40 hover:bg-black/70 text-white cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-7 space-y-5">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-amber-300">Notes personnelles de Soraya</p>
                <textarea
                  rows={3}
                  value={selectedMovie.personalNote}
                  onChange={(e) => {
                    updateMovieNote(selectedMovie.id, e.target.value);
                    setSelectedMovie({ ...selectedMovie, personalNote: e.target.value });
                  }}
                  className="w-full rounded-lg bg-white/5 border border-white/15 p-3 text-sm text-stone-100"
                />
              </div>

              <form
                className="space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setPosterErrors((prev) => ({ ...prev, [selectedMovie.id]: false }));
                  updateMoviePoster(selectedMovie.id, draftPosterUrl);
                  setSelectedMovie({ ...selectedMovie, posterUrl: draftPosterUrl.trim() });
                }}
              >
                <p className="text-xs font-semibold text-stone-300 inline-flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-amber-300" />
                  URL d’affiche personnalisée (Cloudinary ou source officielle)
                </p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={draftPosterUrl}
                    onChange={(e) => setDraftPosterUrl(e.target.value)}
                    placeholder="https://res.cloudinary.com/... (laisser vide pour la couverture par défaut)"
                    className="flex-1 rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-400 text-stone-950 hover:bg-amber-300 cursor-pointer"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-stone-300 leading-relaxed flex items-start gap-3">
                <Film className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <p>
                  Goût pour la version originale : regarder les œuvres en langue originale affine la perception des intonations, du rythme dramatique et de la justesse émotionnelle des interprètes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
