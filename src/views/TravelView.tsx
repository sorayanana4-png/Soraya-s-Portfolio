import React, { useState } from 'react';
import { Camera, Compass, MapPin, Plus } from 'lucide-react';
import { useUniverse } from '../context/UniverseContext';
import { MediaGallery } from '../components/MediaGallery';
import { CloudinaryImageCard } from '../components/CloudinaryImageCard';

export function TravelView() {
  const { cmsData, openCMSAt, updateDestinationDiary, getMediaUrl } = useUniverse();
  const [selectedDestId, setSelectedDestId] = useState<string>(cmsData.destinations[0]?.id || 'cote-ivoire');
  const [showDiaryForm, setShowDiaryForm] = useState(false);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryPlaces, setEntryPlaces] = useState('');
  const [entryNotes, setEntryNotes] = useState('');
  const [galleryErrors, setGalleryErrors] = useState<Record<string, boolean>>({});

  const activeDest =
    cmsData.destinations.find((d) => d.id === selectedDestId) || cmsData.destinations[0];

  const heroKey =
    activeDest.id === 'cote-ivoire'
      ? 'travel.coteIvoireHero'
      : activeDest.id === 'malta'
        ? 'travel.maltaHero'
        : '';
  const personalSlotKey =
    activeDest.id === 'cote-ivoire'
      ? 'travel.coteIvoirePersonal'
      : activeDest.id === 'malta'
        ? 'travel.maltaPersonal'
        : '';
  const resolvedHero = (heroKey && getMediaUrl(heroKey)) || activeDest.heroImage;

  const handleAddDiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryTitle.trim() || !entryNotes.trim()) return;
    updateDestinationDiary(activeDest.id, entryTitle.trim(), entryNotes.trim(), entryPlaces.trim());
    setEntryTitle('');
    setEntryPlaces('');
    setEntryNotes('');
    setShowDiaryForm(false);
  };

  return (
    <div
      style={{ backgroundColor: activeDest.palette.bg, color: activeDest.palette.text }}
      className="min-h-screen transition-colors duration-500"
    >
      {/* En-tête documentaire voyage */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 pt-10 pb-12 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-medium opacity-75">
              <Compass className="w-4 h-4" />
              <span>03 · Carnets de Voyage · Mon Passeport</span>
            </div>
            <h1 className="font-editorial text-4xl md:text-6xl font-semibold">
              Récits de voyage &amp; Découvertes culturelles
            </h1>
            <p className="text-base opacity-80 leading-relaxed">
              Chaque destination possède sa propre lumière, son rythme et ses rencontres. Sélectionnez un repère sur la carte ou un tampon de passeport ci-dessous pour plonger dans son atmosphère.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openCMSAt('travel')}
            className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold rounded-lg text-white cursor-pointer whitespace-nowrap shrink-0 self-start md:self-auto"
            style={{ backgroundColor: activeDest.palette.primary }}
          >
            <Plus className="w-4 h-4" />
            Ajouter une destination
          </button>
        </div>

        {/* Carte interactive du monde + sélecteur */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-8 rounded-2xl bg-[#0D212F] text-white p-6 relative overflow-hidden border border-black/10 min-h-[320px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-teal-200/80 z-10">
              <span>Carte interactive du Passeport</span>
              <span>{cmsData.destinations.length} destinations enregistrées</span>
            </div>

            <div className="relative w-full aspect-[2/1] my-2">
              <svg viewBox="0 0 1000 500" className="w-full h-full opacity-35" aria-hidden="true">
                <path d="M120,90 Q180,60 250,95 L270,150 Q235,205 205,235 L220,275 Q275,295 295,355 L260,445 Q225,425 220,350 L185,290 Q145,230 130,175 Z" fill="#94A3B8" />
                <path d="M445,85 Q520,65 585,95 L575,155 Q535,175 495,172 L455,155 Q435,125 445,85 Z" fill="#94A3B8" />
                <path d="M450,195 Q525,180 575,215 L605,275 Q585,350 545,415 L510,415 Q485,345 455,285 Q425,240 450,195 Z" fill="#94A3B8" />
                <path d="M585,90 Q725,65 845,115 L865,195 Q795,245 725,255 L635,220 Q585,175 585,90 Z" fill="#94A3B8" />
                <path d="M760,320 Q830,305 865,345 L850,400 Q785,405 755,365 Z" fill="#94A3B8" />
              </svg>

              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
                {cmsData.destinations.map((dest) => (
                  <path
                    key={dest.id}
                    d={`M 49 27 Q ${(49 + dest.coordinates.x) / 2 - 4} ${Math.min(27, dest.coordinates.y) - 6} ${dest.coordinates.x} ${dest.coordinates.y}`}
                    fill="none"
                    stroke={dest.id === activeDest.id ? dest.palette.primary : 'rgba(255,255,255,0.28)'}
                    strokeWidth={dest.id === activeDest.id ? '0.6' : '0.35'}
                    strokeDasharray="1.5 1.5"
                  />
                ))}
              </svg>

              <div style={{ left: '49%', top: '27%' }} className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-2.5 h-2.5 rounded-full bg-white/80 border border-slate-900" />
                <span className="block text-[10px] text-white/70 whitespace-nowrap mt-0.5 -ml-3">France</span>
              </div>

              {cmsData.destinations.map((dest) => {
                const isSelected = dest.id === activeDest.id;
                return (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => setSelectedDestId(dest.id)}
                    style={{ left: `${dest.coordinates.x}%`, top: `${dest.coordinates.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus-visible:outline-none"
                  >
                    <span
                      className={`flex items-center justify-center rounded-full transition-transform ${
                        isSelected ? 'w-7 h-7 scale-110 ring-4 ring-white/30' : 'w-5 h-5 hover:scale-110'
                      }`}
                      style={{ backgroundColor: dest.palette.primary }}
                    >
                      <MapPin className="w-3.5 h-3.5 text-white" />
                    </span>
                    <span
                      className={`block mt-1 px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${
                        isSelected ? 'bg-white text-slate-950' : 'bg-black/60 text-white'
                      }`}
                    >
                      {dest.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-slate-300 z-10">
              Cliquez sur un marqueur pour découvrir ses paysages, son carnet de route et ses souvenirs.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            {cmsData.destinations.map((dest, idx) => {
              const isSelected = dest.id === activeDest.id;
              return (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => setSelectedDestId(dest.id)}
                  className={`text-left p-5 rounded-2xl border transition-all cursor-pointer flex-1 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white shadow-md border-black/20'
                      : 'bg-white/60 border-black/10 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-tabular">Tampon 0{idx + 1}</span>
                    <span>{dest.region}</span>
                  </div>
                  <div className="mt-3">
                    <h2 className="font-editorial text-2xl font-semibold text-stone-950">
                      {dest.name}
                    </h2>
                    <p className="text-xs text-stone-600 mt-1">{dest.atmosphere}</p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-4">
                    <span className="w-4 h-1.5 rounded-sm" style={{ backgroundColor: dest.palette.primary }} />
                    <span className="w-4 h-1.5 rounded-sm" style={{ backgroundColor: dest.palette.secondary }} />
                    <span className="w-4 h-1.5 rounded-sm bg-amber-300" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vitrine documentaire de la destination active */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 pb-20 space-y-12">
        {resolvedHero && (
          <div className="relative rounded-2xl overflow-hidden aspect-[21/9] min-h-[280px] border border-black/10">
            <img
              src={resolvedHero}
              alt={`Atmosphère de ${activeDest.name}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-10 text-white">
              <p className="text-xs text-white/80">
                {activeDest.region} · {activeDest.atmosphere}
              </p>
              <h2 className="font-editorial text-4xl md:text-6xl font-semibold mt-1">
                {activeDest.name}
              </h2>
            </div>
          </div>
        )}

        {/* Galerie photographique de destination (illustrations vérifiées) */}
        {activeDest.illustrativeGallery && activeDest.illustrativeGallery.length > 0 && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold opacity-75">
                  <Camera className="w-4 h-4" />
                  <span>Panorama de la destination (illustrations géographiques)</span>
                </div>
                <h3 className="font-editorial text-3xl font-semibold mt-1">
                  Paysages &amp; Ambiances — {activeDest.name}
                </h3>
              </div>
              <p className="text-xs opacity-70 max-w-md">
                Photographies documentaires illustrant l’architecture, les côtes et la culture de la destination.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeDest.illustrativeGallery.map((photo) => {
                const failed = galleryErrors[photo.id];
                return (
                  <article
                    key={photo.id}
                    className="rounded-2xl overflow-hidden border border-black/10 bg-white text-stone-900 flex flex-col"
                  >
                    <div className="aspect-[16/10] bg-stone-200 overflow-hidden relative">
                      {!failed ? (
                        <img
                          src={photo.imageUrl}
                          alt={`${photo.title} — ${activeDest.name}`}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={() => setGalleryErrors((prev) => ({ ...prev, [photo.id]: true }))}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-100">
                          <MapPin className="w-5 h-5 text-stone-400 mb-1" />
                          <p className="font-editorial text-lg font-semibold text-stone-800">{photo.locationLabel}</p>
                        </div>
                      )}
                      <span
                        className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-semibold text-white bg-black/65"
                      >
                        {photo.locationLabel}
                      </span>
                    </div>
                    <div className="p-4 space-y-1 flex-1">
                      <h4 className="font-editorial text-xl font-semibold text-stone-950">{photo.title}</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">{photo.caption}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {personalSlotKey && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <CloudinaryImageCard slotKey={heroKey} accentColor={activeDest.palette.primary} />
            <CloudinaryImageCard slotKey={personalSlotKey} accentColor={activeDest.palette.primary} />
          </div>
        )}

        {/* Carnet de voyage personnel */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h3 className="font-editorial text-3xl font-semibold">
                {activeDest.name} — Carnet de voyage &amp; Souvenirs
              </h3>
              <p className="text-sm opacity-75 mt-1">
                Lieux réellement visités, observations culturelles et récits personnels de Soraya.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDiaryForm((v) => !v)}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-white cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
              style={{ backgroundColor: activeDest.palette.secondary }}
            >
              {showDiaryForm ? 'Fermer le formulaire' : '+ Écrire une note de voyage'}
            </button>
          </div>

          {showDiaryForm && (
            <form
              onSubmit={handleAddDiary}
              className="rounded-2xl bg-white text-stone-900 p-6 border border-black/10 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  required
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                  placeholder="Titre de la note (ex. : Après-midi au bord de l’eau)"
                  className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
                />
                <input
                  value={entryPlaces}
                  onChange={(e) => setEntryPlaces(e.target.value)}
                  placeholder="Lieux visités"
                  className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
                />
              </div>
              <textarea
                required
                rows={3}
                value={entryNotes}
                onChange={(e) => setEntryNotes(e.target.value)}
                placeholder="Rédigez vos souvenirs authentiques, découvertes et impressions..."
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-lg text-white cursor-pointer"
                style={{ backgroundColor: activeDest.palette.primary }}
              >
                Enregistrer dans le carnet
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeDest.diaryEntries.map((entry) => (
              <article
                key={entry.id}
                className="rounded-2xl p-6 border border-black/10 space-y-3"
                style={{ backgroundColor: activeDest.palette.cardBg }}
              >
                <div className="flex items-center justify-between text-xs opacity-65">
                  <span>{entry.date}</span>
                  <span>{entry.placesPlaceholder}</span>
                </div>
                <h4 className="font-editorial text-2xl font-semibold">{entry.title}</h4>
                <p className="text-sm leading-relaxed opacity-85">{entry.notes}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Galerie personnelle photos & vidéos */}
        <div className="pt-6 border-t border-black/10">
          <MediaGallery
            sectionKey={activeDest.gallerySectionKey}
            heading={`Archives personnelles — ${activeDest.name}`}
            subheading={`Ajoutez vos photographies et vidéos personnelles prises à ${activeDest.name}.`}
            accentColor={activeDest.palette.primary}
            defaultCategory="Galerie personnelle"
          />
        </div>
      </section>
    </div>
  );
}
