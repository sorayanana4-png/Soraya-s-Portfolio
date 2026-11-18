import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { UNIVERSE_CARDS } from '../data/sorayaData';
import { useUniverse } from '../context/UniverseContext';
import { UniverseId } from '../types/universe';

export function TopNav() {
  const { activeUniverse, setActiveUniverse, openCMSAt } = useUniverse();
  const [atlasOpen, setAtlasOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDarkUniverse = activeUniverse === 'cinema' || activeUniverse === 'music';

  const navigate = (id: UniverseId) => {
    setActiveUniverse(id);
    setAtlasOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-colors duration-300 border-b backdrop-blur-md ${
          isDarkUniverse
            ? 'bg-[#09090D]/90 border-white/10 text-stone-100'
            : 'bg-[#FAF8F5]/92 border-stone-200/80 text-stone-900'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 h-16 flex items-center justify-between gap-8">
          {/* Zone 1 : Titre éditorial */}
          <button
            type="button"
            onClick={() => navigate('home')}
            className="font-editorial text-2xl font-semibold tracking-tight whitespace-nowrap shrink-0 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 rounded-sm"
          >
            Soraya Boua
          </button>

          {/* Zone 2 : 5 liens de navigation clairs */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <button
              type="button"
              onClick={() => navigate('home')}
              className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors pb-0.5 border-b ${
                activeUniverse === 'home'
                  ? isDarkUniverse
                    ? 'border-amber-400 text-white'
                    : 'border-stone-900 text-stone-900'
                  : 'border-transparent opacity-75 hover:opacity-100'
              }`}
            >
              Accueil
            </button>
            <button
              type="button"
              onClick={() => navigate('career')}
              className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors pb-0.5 border-b ${
                activeUniverse === 'career'
                  ? isDarkUniverse
                    ? 'border-amber-400 text-white'
                    : 'border-stone-900 text-stone-900'
                  : 'border-transparent opacity-75 hover:opacity-100'
              }`}
            >
              Parcours
            </button>
            <button
              type="button"
              onClick={() => navigate('projects')}
              className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors pb-0.5 border-b ${
                activeUniverse === 'projects'
                  ? isDarkUniverse
                    ? 'border-amber-400 text-white'
                    : 'border-stone-900 text-stone-900'
                  : 'border-transparent opacity-75 hover:opacity-100'
              }`}
            >
              Projets &amp; Freelance
            </button>
            <button
              type="button"
              onClick={() => setAtlasOpen((v) => !v)}
              className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors pb-0.5 border-b ${
                atlasOpen ||
                ['travel', 'cinema', 'music', 'library', 'kitchen', 'lifestyle'].includes(activeUniverse)
                  ? isDarkUniverse
                    ? 'border-amber-400 text-white'
                    : 'border-stone-900 text-stone-900'
                  : 'border-transparent opacity-75 hover:opacity-100'
              }`}
            >
              Univers
            </button>
            <button
              type="button"
              onClick={() => openCMSAt('media')}
              className="whitespace-nowrap shrink-0 cursor-pointer transition-colors pb-0.5 border-b border-transparent opacity-75 hover:opacity-100"
            >
              Studio de contenu
            </button>
          </nav>

          {/* Zone 3 : Action principale + menu mobile */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('contact')}
              className={`px-4 py-2 text-xs font-semibold tracking-wide rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] ${
                isDarkUniverse
                  ? 'bg-amber-400 text-stone-950 hover:bg-amber-300'
                  : 'bg-stone-900 text-[#FAF8F5] hover:bg-stone-800'
              }`}
            >
              Me contacter
            </button>
            <button
              type="button"
              aria-label="Ouvrir le menu de navigation"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg border border-current/15 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Sélecteur Atlas des Univers (Desktop) */}
        {atlasOpen && (
          <div
            className={`hidden lg:block border-t ${
              isDarkUniverse ? 'bg-[#111116] border-white/10' : 'bg-[#F4F0EA] border-stone-200'
            }`}
          >
            <div className="max-w-[1440px] mx-auto px-10 py-6">
              <div className="grid grid-cols-4 gap-4">
                {UNIVERSE_CARDS.map((u) => {
                  const active = activeUniverse === u.id;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => navigate(u.id)}
                      className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                        active
                          ? isDarkUniverse
                            ? 'bg-white/10 border-amber-400/60'
                            : 'bg-white border-stone-900 shadow-sm'
                          : isDarkUniverse
                          ? 'bg-white/5 border-white/10 hover:bg-white/10'
                          : 'bg-white/60 border-stone-200/80 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-tabular text-xs opacity-60">{u.number}</span>
                        <div className="flex items-center gap-1">
                          {u.palettePreview.map((hex) => (
                            <span
                              key={hex}
                              className="w-2.5 h-2.5 rounded-sm"
                              style={{ backgroundColor: hex }}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="font-editorial text-lg font-semibold leading-snug">{u.title}</p>
                      <p className="text-xs opacity-70 line-clamp-1 mt-0.5">{u.subtitle}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-t max-h-[80vh] overflow-y-auto px-5 py-5 space-y-4 ${
              isDarkUniverse ? 'bg-[#0E0E13] border-white/10 text-stone-100' : 'bg-[#FAF8F5] border-stone-200 text-stone-900'
            }`}
          >
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => navigate('home')}
                className="p-3 text-left text-sm font-medium rounded-lg border border-current/15 min-h-[44px]"
              >
                Accueil
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCMSAt('media');
                }}
                className="p-3 text-left text-sm font-medium rounded-lg border border-current/15 min-h-[44px]"
              >
                Studio de contenu
              </button>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs opacity-60 px-1">Explorer les univers</p>
              {UNIVERSE_CARDS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => navigate(u.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left text-sm min-h-[44px] ${
                    activeUniverse === u.id ? 'bg-current/10 font-semibold' : 'hover:bg-current/5'
                  }`}
                >
                  <span>
                    <span className="font-tabular opacity-60 mr-2">{u.number}</span>
                    {u.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Bandeau contextuel d'exploration d'univers */}
      {activeUniverse !== 'home' && (
        <div
          className={`border-b text-xs transition-colors ${
            isDarkUniverse
              ? 'bg-[#0E0E14] border-white/10 text-stone-300'
              : 'bg-[#F3EFE8] border-stone-200/80 text-stone-700'
          }`}
        >
          <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-2.5 flex items-center gap-4 overflow-x-auto editorial-scroll">
            <button
              type="button"
              onClick={() => navigate('home')}
              className="whitespace-nowrap shrink-0 font-medium hover:underline cursor-pointer"
            >
              Retour à l’accueil
            </button>
            <span aria-hidden="true" className="opacity-30">/</span>
            {UNIVERSE_CARDS.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => navigate(u.id)}
                className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors px-2.5 py-1 rounded-md ${
                  activeUniverse === u.id
                    ? isDarkUniverse
                      ? 'bg-white/15 text-white font-semibold'
                      : 'bg-stone-900 text-white font-semibold'
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                <span className="font-tabular mr-1.5 opacity-70">{u.number}</span>
                {u.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
