import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, Film, ImagePlus, LayoutGrid, Rows3, Trash2, Upload, X } from 'lucide-react';
import { useUniverse } from '../context/UniverseContext';

interface MediaGalleryProps {
  sectionKey: string;
  heading?: string;
  subheading?: string;
  dark?: boolean;
  accentColor?: string;
  defaultCategory?: string;
}

function getSafeVideoEmbed(src: string): string | null {
  try {
    if (!src.startsWith('http')) return null;
    const url = new URL(src);
    if (url.hostname.includes('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${encodeURIComponent(v)}`;
      if (url.pathname.startsWith('/embed/')) return src;
    }
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.replace('/', '');
      if (id) return `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
    }
    if (url.hostname.includes('vimeo.com')) {
      const id = url.pathname.replace('/', '');
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
    return null;
  } catch {
    return null;
  }
}

export function MediaGallery({
  sectionKey,
  heading = 'Exposition visuelle & Archives médias',
  subheading = 'Photographies personnelles, vidéos et souvenirs visuels.',
  dark = false,
  accentColor = '#D4A359',
  defaultCategory = 'Archives personnelles',
}: MediaGalleryProps) {
  const { cmsData, setLightboxItem, replacePlaceholderMedia, deleteMediaItem, openCMSAt } =
    useUniverse();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tout');
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [pendingTargetId, setPendingTargetId] = useState<string | null>(null);

  const items = cmsData.mediaItems.filter((m) => m.section === sectionKey);
  const categories = ['Tout', ...Array.from(new Set(items.map((i) => i.category)))];
  const visibleItems =
    selectedCategory === 'Tout' ? items : items.filter((i) => i.category === selectedCategory);

  const triggerUploadForSlot = (itemId: string) => {
    setPendingTargetId(itemId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingTargetId) return;
    const isVideo = file.type.startsWith('video/');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        replacePlaceholderMedia(
          pendingTargetId,
          reader.result,
          isVideo ? 'video' : 'image',
          file.name.replace(/\.[^/.]+$/, '')
        );
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
    setPendingTargetId(null);
  };

  const scrollCarousel = (dir: -1 | 1) => {
    carouselRef.current?.scrollBy({ left: dir * 380, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="font-editorial text-2xl md:text-3xl font-semibold">{heading}</h3>
          <p className={`text-sm mt-1 ${dark ? 'text-stone-300' : 'text-stone-600'}`}>
            {subheading}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.length > 2 && (
            <div
              className={`flex items-center gap-1 p-1 rounded-lg ${
                dark ? 'bg-white/5 border border-white/10' : 'bg-stone-200/70'
              }`}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? dark
                        ? 'bg-white text-stone-950'
                        : 'bg-white text-stone-900 shadow-sm'
                      : dark
                      ? 'text-stone-300 hover:text-white'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div
            className={`flex items-center gap-1 p-1 rounded-lg ${
              dark ? 'bg-white/5 border border-white/10' : 'bg-stone-200/70'
            }`}
          >
            <button
              type="button"
              aria-label="Affichage en grille éditoriale"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md cursor-pointer ${
                viewMode === 'grid'
                  ? dark
                    ? 'bg-white text-stone-950'
                    : 'bg-white text-stone-900 shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Affichage en carrousel horizontal"
              onClick={() => setViewMode('carousel')}
              className={`p-1.5 rounded-md cursor-pointer ${
                viewMode === 'carousel'
                  ? dark
                    ? 'bg-white text-stone-950'
                    : 'bg-white text-stone-900 shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Rows3 className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => openCMSAt(`media:${sectionKey}:${defaultCategory}`)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] ${
              dark
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
          >
            <ImagePlus className="w-4 h-4" />
            Ajouter photo ou vidéo
          </button>
        </div>
      </div>

      {visibleItems.length === 0 ? (
        <div
          className={`p-10 rounded-2xl border text-center ${
            dark ? 'border-white/10 bg-white/5' : 'border-stone-200 bg-white/60'
          }`}
        >
          <p className="font-editorial text-xl">Aucun média dans cette catégorie pour le moment</p>
          <p className="text-sm opacity-70 mt-1">
            Ajoutez vos photos ou vidéos personnelles à tout moment depuis le Studio de contenu.
          </p>
        </div>
      ) : (
        <div className="relative">
          {viewMode === 'carousel' && visibleItems.length > 1 && (
            <div className="flex justify-end gap-2 mb-3">
              <button
                type="button"
                aria-label="Défiler vers la gauche"
                onClick={() => scrollCarousel(-1)}
                className={`p-2 rounded-lg border cursor-pointer ${
                  dark ? 'border-white/15 bg-white/5 hover:bg-white/15' : 'border-stone-300 bg-white hover:bg-stone-50'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Défiler vers la droite"
                onClick={() => scrollCarousel(1)}
                className={`p-2 rounded-lg border cursor-pointer ${
                  dark ? 'border-white/15 bg-white/5 hover:bg-white/15' : 'border-stone-300 bg-white hover:bg-stone-50'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <div
            ref={carouselRef}
            className={
              viewMode === 'carousel'
                ? 'flex items-stretch gap-5 overflow-x-auto editorial-scroll pb-4 snap-x'
                : 'grid grid-cols-1 md:grid-cols-12 gap-5'
            }
          >
            {visibleItems.map((item, idx) => {
              const isHeroSpan = viewMode === 'grid' && idx === 0 && visibleItems.length >= 3;
              const colClass =
                viewMode === 'carousel'
                  ? 'snap-start shrink-0 w-[300px] sm:w-[360px]'
                  : isHeroSpan
                  ? 'md:col-span-7'
                  : visibleItems.length === 2
                  ? 'md:col-span-6'
                  : 'md:col-span-5';
              const hasValidSrc = Boolean(item.src) && !imgErrors[item.id];
              const videoEmbed = item.mediaType === 'video' ? getSafeVideoEmbed(item.src) : null;

              return (
                <article
                  key={item.id}
                  className={`${colClass} group rounded-2xl overflow-hidden border transition-all ${
                    dark
                      ? 'bg-white/[0.03] border-white/10 hover:border-white/25'
                      : 'bg-white border-stone-200/80 hover:border-stone-300'
                  }`}
                >
                  <div className={`relative overflow-hidden ${isHeroSpan ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
                    {hasValidSrc ? (
                      item.mediaType === 'video' ? (
                        videoEmbed ? (
                          <iframe
                            title={item.title}
                            src={videoEmbed}
                            className="w-full h-full bg-black"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            src={item.src}
                            controls
                            className="w-full h-full object-cover bg-black"
                          />
                        )
                      ) : (
                        <img
                          src={item.src}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={() => setImgErrors((prev) => ({ ...prev, [item.id]: true }))}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      )
                    ) : (
                      <div
                        className={`w-full h-full flex flex-col items-center justify-center p-6 text-center ${
                          dark ? 'bg-white/[0.04]' : 'bg-stone-100'
                        }`}
                        style={{
                          backgroundImage: `radial-gradient(circle at 20% 20%, ${accentColor}22, transparent 60%)`,
                        }}
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 border"
                          style={{ borderColor: `${accentColor}44`, color: accentColor }}
                        >
                          {item.mediaType === 'video' ? (
                            <Film className="w-5 h-5" />
                          ) : (
                            <Upload className="w-5 h-5" />
                          )}
                        </div>
                        <p className="font-editorial text-xl font-semibold">{item.title}</p>
                        <p className="text-xs opacity-70 max-w-xs mt-1">{item.caption}</p>
                        <button
                          type="button"
                          onClick={() => triggerUploadForSlot(item.id)}
                          className={`mt-4 px-4 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                            dark
                              ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                              : 'border-stone-300 bg-white hover:bg-stone-50 text-stone-900'
                          }`}
                        >
                          Importer un média personnel
                        </button>
                      </div>
                    )}

                    {hasValidSrc && (
                      <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          aria-label={`Agrandir ${item.title}`}
                          onClick={() => setLightboxItem(item)}
                          className="p-2 rounded-lg bg-black/70 text-white hover:bg-black cursor-pointer"
                        >
                          <Expand className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Supprimer ${item.title}`}
                          onClick={() => deleteMediaItem(item.id)}
                          className="p-2 rounded-lg bg-black/70 text-white hover:bg-red-700 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex items-start justify-between gap-4">
                    <div>
                      <div className={`flex items-center gap-2 text-xs ${dark ? 'text-stone-400' : 'text-stone-500'}`}>
                        <span>{item.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-tabular">{item.date}</span>
                      </div>
                      <h4 className="font-editorial text-xl font-semibold mt-1">{item.title}</h4>
                      <p className={`text-sm mt-1 ${dark ? 'text-stone-300' : 'text-stone-600'}`}>
                        {item.caption}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function MediaLightbox() {
  const { lightboxItem, setLightboxItem } = useUniverse();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxItem(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setLightboxItem]);

  if (!lightboxItem) return null;

  const videoEmbed =
    lightboxItem.mediaType === 'video' ? getSafeVideoEmbed(lightboxItem.src) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
      onClick={() => setLightboxItem(null)}
    >
      <button
        type="button"
        aria-label="Fermer la vue plein écran"
        onClick={() => setLightboxItem(null)}
        className="absolute top-5 right-5 p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <X className="w-5 h-5" />
      </button>

      <div
        className="max-w-5xl w-full space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-2xl overflow-hidden bg-black border border-white/10 max-h-[75vh] flex items-center justify-center">
          {lightboxItem.mediaType === 'video' ? (
            videoEmbed ? (
              <iframe
                title={lightboxItem.title}
                src={videoEmbed}
                className="w-full aspect-video max-h-[75vh]"
                allowFullScreen
              />
            ) : (
              <video src={lightboxItem.src} controls className="max-h-[75vh] w-full" />
            )
          ) : (
            <img
              src={lightboxItem.src}
              alt={lightboxItem.title}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-auto object-contain"
            />
          )}
        </div>
        <div className="text-white flex flex-col md:flex-row md:items-center justify-between gap-2 px-1">
          <div>
            <p className="text-xs text-stone-400">
              {lightboxItem.category} · {lightboxItem.date}
            </p>
            <h3 className="font-editorial text-2xl font-semibold">{lightboxItem.title}</h3>
            <p className="text-sm text-stone-300">{lightboxItem.caption}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
