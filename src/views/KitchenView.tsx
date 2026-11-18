import React, { useState } from 'react';
import { Camera, Plus, Sparkles, Utensils, X } from 'lucide-react';
import { KITCHEN_CURATED_GALLERIES } from '../data/sorayaData';
import { useUniverse } from '../context/UniverseContext';
import { CuratedDishVisual, DishEntry, KitchenCategory } from '../types/universe';
import { CloudinaryImageCard } from '../components/CloudinaryImageCard';

const CATEGORIES: ('Tout' | KitchenCategory)[] = [
  'Tout',
  'Cuisine Africaine',
  'Cuisine Française',
  'Cuisine Maghrébine',
  'Cuisine Italienne',
  'Cuisine Asiatique',
  'Cuisine Coréenne',
  'Pâtisserie & Desserts',
  'Fruits & Découvertes',
];

export function KitchenView() {
  const { cmsData, openCMSAt } = useUniverse();
  const [selectedCategory, setSelectedCategory] = useState<'Tout' | KitchenCategory>('Tout');
  const [activeDish, setActiveDish] = useState<DishEntry | null>(null);
  const [activeInspiration, setActiveInspiration] = useState<CuratedDishVisual | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const visibleCurated =
    selectedCategory === 'Tout'
      ? KITCHEN_CURATED_GALLERIES
      : KITCHEN_CURATED_GALLERIES.filter((item) => item.category === selectedCategory);

  const visibleDishes =
    selectedCategory === 'Tout'
      ? cmsData.dishes
      : cmsData.dishes.filter((d) => d.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FDF8F2] text-[#3B2314] pb-24">
      {/* En-tête magazine culinaire */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 pt-12 pb-10 border-b border-[#EBDCCB]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-medium text-[#C85A32]">
              <Utensils className="w-4 h-4" />
              <span>07 · Ma Cuisine · Saveurs &amp; Art de recevoir</span>
            </div>
            <h1 className="font-editorial text-5xl md:text-6xl font-semibold text-[#2B170C]">
              Ma Cuisine
            </h1>
            <p className="font-editorial text-2xl italic text-[#C85A32]">
              « Saveurs, créativité et moments précieux autour de la table. »
            </p>
            <p className="text-sm md:text-base text-[#5E3E2A] leading-relaxed">
              Un carnet culinaire chaleureux où se croisent les grandes cuisines du monde appréciées par Soraya — africaine, française, maghrébine, italienne, asiatique et coréenne — aux côtés des pâtisseries, fruits tropicaux et créations maison.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openCMSAt('kitchen')}
            className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold bg-[#C85A32] text-white rounded-lg hover:bg-[#AE4A25] cursor-pointer whitespace-nowrap shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Ajouter un plat ou une recette
          </button>
        </div>

        {/* Filtres des 8 univers culinaires */}
        <div className="mt-8 flex items-center gap-1.5 overflow-x-auto editorial-scroll pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-[#3D6B4F] text-white border-[#3D6B4F]'
                  : 'bg-white text-[#4A2E1B] border-[#E5D3C0] hover:border-[#C85A32]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Galerie photographique des inspirations culinaires */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 py-14 space-y-16">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#C85A32] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Sélection gastronomique illustrée ({visibleCurated.length})
              </p>
              <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-[#2B170C]">
                Inspirations culinaires &amp; Saveurs du monde
              </h2>
            </div>
            <span className="text-xs text-[#8C5230]">
              Photographies culinaires éditoriales · Cliquez pour agrandir
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {visibleCurated.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveInspiration(item)}
                className="group text-left rounded-2xl bg-white border border-[#EBDCCB] overflow-hidden hover:border-[#C85A32] transition-all flex flex-col cursor-pointer"
              >
                <div className="aspect-[4/3] w-full bg-[#F6E9DA] relative overflow-hidden flex items-center justify-center">
                  {!failedImages[item.id] ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [item.id]: true }))
                      }
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="p-4 text-center space-y-1.5">
                      <Utensils className="w-6 h-6 text-[#C85A32] mx-auto" />
                      <p className="text-xs font-medium text-[#8C5230]">{item.category}</p>
                    </div>
                  )}
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/65 text-[10px] font-semibold text-amber-100 backdrop-blur-sm">
                    Inspiration culinaire
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-[11px] text-[#8C5230]">
                      <span className="truncate">{item.category}</span>
                      <span className="shrink-0 font-medium text-[#3D6B4F]">{item.origin}</span>
                    </div>
                    <h3 className="font-editorial text-xl font-semibold text-[#2B170C] mt-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#5E3E2A] mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Section dédiée aux créations personnelles de Soraya */}
        <div className="pt-10 border-t border-[#EBDCCB] space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#3D6B4F] flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                Journal personnel de cuisine
              </p>
              <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-[#2B170C]">
                Les créations maison de Soraya
              </h2>
            </div>
            <button
              type="button"
              onClick={() => openCMSAt('kitchen')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold border border-[#C85A32] text-[#C85A32] rounded-lg hover:bg-[#C85A32] hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              Publier un plat fait maison
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-1">
              <CloudinaryImageCard slotKey="kitchen.featuredDish" accentColor="#C85A32" />
            </div>

            <div className="lg:col-span-2">
              {visibleDishes.length === 0 ? (
                <div className="rounded-2xl bg-white border border-[#EBDCCB] p-8 text-center space-y-4">
                  <div className="w-11 h-11 rounded-full bg-[#C85A32]/15 text-[#C85A32] flex items-center justify-center mx-auto">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <h3 className="font-editorial text-2xl font-semibold text-[#2B170C]">
                    {selectedCategory}
                  </h3>
                  <p className="text-sm text-[#5E3E2A] max-w-md mx-auto">
                    Aucune création personnelle n’a encore été ajoutée dans la catégorie « {selectedCategory} ». Partagez votre propre plat fait maison ou une découverte gourmande via le Studio de Contenu.
                  </p>
                  <button
                    type="button"
                    onClick={() => openCMSAt('kitchen')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#C85A32] text-white rounded-lg hover:bg-[#AE4A25] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter une entrée personnelle
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {visibleDishes.map((dish, idx) => (
                    <button
                      key={dish.id}
                      type="button"
                      onClick={() => setActiveDish(dish)}
                      className="group text-left rounded-2xl bg-white border border-[#EBDCCB] overflow-hidden hover:border-[#C85A32] transition-all flex flex-col cursor-pointer"
                    >
                      <div className="aspect-[4/3] w-full bg-[#F6E9DA] relative overflow-hidden flex items-center justify-center">
                        {dish.imageSrc ? (
                          <img
                            src={dish.imageSrc}
                            alt={dish.title}
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="p-6 text-center space-y-2">
                            <div className="w-11 h-11 rounded-full bg-[#C85A32]/15 text-[#C85A32] flex items-center justify-center mx-auto">
                              <Utensils className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-medium text-[#8C5230]">
                              {dish.isTemplateSlot
                                ? 'Ajouter une photo ou vidéo personnelle'
                                : dish.category}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-[#8C5230]">
                            <span>{dish.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>{dish.date}</span>
                          </div>
                          <h3 className="font-editorial text-2xl font-semibold text-[#2B170C] mt-1">
                            {dish.title}
                          </h3>
                          <p className="text-sm text-[#5E3E2A] mt-2 line-clamp-2 leading-relaxed">
                            {dish.story}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#F2E6D8] flex items-center justify-between text-xs font-semibold text-[#3D6B4F]">
                          <span>
                            {dish.isTemplateSlot
                              ? 'Voir la fiche d’emplacement'
                              : 'Lire l’histoire & la recette'}
                          </span>
                          <span className="font-tabular opacity-60">0{idx + 1}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modale recette / création personnelle */}
      {activeDish && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveDish(null)}
        >
          <div
            className="bg-[#FDF8F2] text-[#3B2314] rounded-2xl max-w-xl w-full border border-[#EBDCCB] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#EBDCCB] flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#C85A32]">
                  {activeDish.category} · {activeDish.date}
                </p>
                <h3 className="font-editorial text-3xl font-semibold mt-1">{activeDish.title}</h3>
              </div>
              <button
                type="button"
                aria-label="Fermer la fiche du plat"
                onClick={() => setActiveDish(null)}
                className="p-2 rounded-lg hover:bg-[#EFE2D2] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {activeDish.imageSrc && (
                <img
                  src={activeDish.imageSrc}
                  alt={activeDish.title}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-64 object-cover rounded-xl"
                />
              )}
              <div>
                <p className="text-xs font-semibold text-[#8C5230] mb-1">L’HISTOIRE DU PLAT</p>
                <p className="text-sm leading-relaxed">{activeDish.story}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#8C5230] mb-2">INGRÉDIENTS</p>
                <ul className="space-y-1 text-sm">
                  {activeDish.ingredients.map((ing) => (
                    <li key={ing}>— {ing}</li>
                  ))}
                </ul>
              </div>
              {activeDish.isTemplateSlot && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveDish(null);
                    openCMSAt('kitchen');
                  }}
                  className="w-full py-2.5 text-xs font-semibold bg-[#C85A32] text-white rounded-lg hover:bg-[#AE4A25] cursor-pointer"
                >
                  Ajouter un plat réel &amp; sa photo dans le Studio de Contenu
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Inspiration culinaire */}
      {activeInspiration && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveInspiration(null)}
        >
          <div
            className="bg-[#FDF8F2] text-[#3B2314] rounded-2xl max-w-xl w-full border border-[#EBDCCB] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] bg-[#2B170C]">
              <img
                src={activeInspiration.imageUrl}
                alt={activeInspiration.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                aria-label="Fermer l’aperçu photo"
                onClick={() => setActiveInspiration(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-[#C85A32] font-semibold">
                <span>{activeInspiration.category}</span>
                <span>{activeInspiration.origin} · Inspiration culinaire</span>
              </div>
              <h3 className="font-editorial text-3xl font-semibold text-[#2B170C]">
                {activeInspiration.title}
              </h3>
              <p className="text-sm text-[#5E3E2A] leading-relaxed">
                {activeInspiration.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
