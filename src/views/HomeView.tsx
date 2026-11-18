import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Box, Download, ExternalLink, Mail } from 'lucide-react';
import { useUniverse } from '../context/UniverseContext';
import { UNIVERSE_CARDS, WHAT_I_BRING } from '../data/sorayaData';
import { ThreeUniverseScene } from '../components/ThreeUniverseScene';

export function HomeView() {
  const { cmsData, setActiveUniverse, setIsCVModalOpen, getMediaUrl } = useUniverse();
  const [portraitError, setPortraitError] = useState(false);
  const [activeQualityIdx, setActiveQualityIdx] = useState(0);
  const [show3DStage, setShow3DStage] = useState(false);

  const portraitUrl = getMediaUrl('portrait.main') || cmsData.profile.portraitSrc;

  const scrollToUniverses = () => {
    document.getElementById('universe-portal')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#FAF8F5] text-stone-900">
      {/* Séquence d'ouverture : Split éditorial équilibré */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 pt-10 pb-14 md:pt-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Colonne gauche : Hiérarchie éditoriale */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-between py-2"
          >
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-500">
                <span>BEYOND THE CV — SORAYA&apos;S WORLD</span>
                <span aria-hidden="true">·</span>
                <span>Plus qu’un profil. Tout un univers.</span>
              </div>

              <div className="space-y-3">
                <h1 className="font-editorial text-5xl sm:text-6xl xl:text-7xl font-semibold tracking-tight text-stone-950 leading-[0.98]">
                  Soraya Boua
                </h1>
                <p className="text-base sm:text-lg font-medium text-amber-800 tracking-tight">
                  {cmsData.profile.headline}
                </p>
              </div>

              <p className="text-base md:text-lg text-stone-700 leading-relaxed max-w-2xl">
                « {cmsData.profile.intro} »
              </p>

              <p className="text-sm text-stone-600 leading-relaxed max-w-xl">
                Pensé comme un magazine interactif et un portfolio vivant : découvrez le parcours commercial B2B de Soraya, sa créativité marketing, ses initiatives entrepreneuriales ainsi que les univers culturels, musicaux, culinaires et de voyage qui nourrissent sa manière d’aller vers les autres.
              </p>
            </div>

            {/* Actions principales et secondaires */}
            <div className="pt-8 mt-8 border-t border-stone-200/80 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={scrollToUniverses}
                  className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold bg-stone-900 text-[#FAF8F5] rounded-lg hover:bg-stone-800 transition-colors cursor-pointer min-h-[44px]"
                >
                  Explorer mon univers
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsCVModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-white text-stone-900 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer min-h-[44px]"
                >
                  <Download className="w-4 h-4" />
                  Télécharger mon CV
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-stone-600">
                <a
                  href={`mailto:${cmsData.profile.email}`}
                  className="inline-flex items-center gap-1.5 hover:text-stone-950 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {cmsData.profile.email}
                </a>
                <span aria-hidden="true" className="text-stone-300">/</span>
                <a
                  href={cmsData.profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-stone-950 transition-colors"
                >
                  Profil LinkedIn
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <span aria-hidden="true" className="text-stone-300">/</span>
                <button
                  type="button"
                  onClick={() => setActiveUniverse('contact')}
                  className="hover:text-stone-950 underline underline-offset-4 cursor-pointer"
                >
                  Contact recruteurs &amp; partenaires
                </button>
              </div>
            </div>
          </motion.div>

          {/* Colonne droite : Grand portrait éditorial */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-2xl overflow-hidden bg-stone-200 border border-stone-200/80 aspect-[3/4] lg:aspect-auto lg:h-full min-h-[420px]">
              {!portraitError && portraitUrl ? (
                <img
                  src={portraitUrl}
                  alt="Portrait éditorial de Soraya Boua"
                  referrerPolicy="no-referrer"
                  onError={() => setPortraitError(true)}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-stone-200 to-stone-300">
                  <p className="font-editorial text-3xl font-semibold text-stone-800">Soraya Boua</p>
                  <p className="text-xs text-stone-600 mt-1">Emplacement portrait prêt</p>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/75 via-black/30 to-transparent text-white">
                <p className="text-xs text-stone-200">Le Mans · Paris · International</p>
                <p className="font-editorial text-xl font-medium">
                  Là où le développement commercial rencontre la curiosité créative.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bandeau de preuves professionnelles */}
        <div className="mt-10 pt-8 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="font-tabular text-xs text-stone-500">01 · PermiFast (Janv. 2026–)</p>
            <p className="font-semibold text-stone-900 mt-1">Business Developer B2B</p>
            <p className="text-xs text-stone-600 mt-1">
              Prospection d’auto-écoles, onboarding partenaire, négociation &amp; CRM Airtable.
            </p>
          </div>
          <div>
            <p className="font-tabular text-xs text-stone-500">02 · LGD Paris (2024–2025)</p>
            <p className="font-semibold text-stone-900 mt-1">100–150 appels/jour &amp; 70 % renouvellement</p>
            <p className="text-xs text-stone-600 mt-1">
              Prospection téléphonique intensive, ~5 devis/semaine &amp; coordination chauffeurs.
            </p>
          </div>
          <div>
            <p className="font-tabular text-xs text-stone-500">03 · Clean &amp; Shop + Studio</p>
            <p className="font-semibold text-stone-900 mt-1">Marketing &amp; Croissance Sociale</p>
            <p className="text-xs text-stone-600 mt-1">
              Ventes B2B/B2C, création de contenu &amp; community management freelance (restauration &amp; beauté).
            </p>
          </div>
          <div>
            <p className="font-tabular text-xs text-stone-500">04 · 24 Hours of Le Mans</p>
            <p className="font-semibold text-stone-900 mt-1">Hospitalité VIP Internationale</p>
            <p className="text-xs text-stone-600 mt-1">
              Relations invités bilingues dans des environnements d’hospitalité automobile.
            </p>
          </div>
        </div>
      </section>

      {/* Sélection interactive des 8 Univers */}
      <section
        id="universe-portal"
        className="border-t border-stone-200/80 bg-[#F4F0EA] py-16 md:py-24"
      >
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-medium text-stone-500">Choisissez votre porte d’entrée</p>
              <h2 className="font-editorial text-3xl md:text-5xl font-semibold text-stone-950">
                Huit mondes, une histoire authentique
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <p className="text-sm text-stone-600 max-w-md">
                Chaque chapitre possède sa propre palette chromatique, son atmosphère et son expérience interactive.
              </p>
              <button
                type="button"
                onClick={() => setShow3DStage((v) => !v)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Box className="w-4 h-4 text-amber-300" />
                {show3DStage ? 'Masquer la scène 3D' : 'Voir en scène 3D'}
              </button>
            </div>
          </div>

          {show3DStage && (
            <div className="space-y-2">
              <ThreeUniverseScene
                initialMode="astrolabe"
                title="Astrolabe 3D de Soraya’s World"
                onSelectUniverse={(uid) => setActiveUniverse(uid)}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {UNIVERSE_CARDS.map((u, i) => (
              <motion.button
                key={u.id}
                type="button"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                onClick={() => setActiveUniverse(u.id)}
                className={`group relative text-left rounded-2xl overflow-hidden min-h-[280px] flex flex-col justify-between p-6 transition-transform duration-300 hover:-translate-y-1 cursor-pointer ${u.bgClass} ${u.textClass}`}
              >
                {u.coverImage && (
                  <img
                    src={u.coverImage}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-45 group-hover:scale-105 transition-all duration-500"
                  />
                )}
                <div
                  className={`absolute inset-0 ${
                    u.coverImage
                      ? 'bg-gradient-to-t from-black/80 via-black/35 to-black/25'
                      : 'opacity-0'
                  }`}
                />

                <div className="relative z-10 flex items-center justify-between w-full">
                  <span className="font-tabular text-xs font-medium opacity-75">{u.number}</span>
                  <div className="flex items-center gap-1.5">
                    {u.palettePreview.map((hex) => (
                      <span
                        key={hex}
                        className="w-3 h-3 rounded-sm border border-white/20"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative z-10 space-y-2 mt-12">
                  <h3 className="font-editorial text-2xl font-semibold leading-tight">
                    {u.title}
                  </h3>
                  <p className="text-xs opacity-80 leading-relaxed line-clamp-2">{u.subtitle}</p>
                  <div className="pt-2 inline-flex items-center gap-1.5 text-xs font-semibold opacity-90 group-hover:gap-2.5 transition-all">
                    Entrer dans l’univers
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Ce que j'apporte + L'art de la communication */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 py-16 md:py-24 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs font-medium text-stone-500">Valeur professionnelle</p>
            <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-stone-950">
              Ce que j’apporte à une équipe
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Sept qualités clés forgées sur le terrain entre développement commercial intensif, marketing de marque, entrepreneuriat et hospitalité internationale en direct.
            </p>
            <button
              type="button"
              onClick={() => setActiveUniverse('career')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-900 underline underline-offset-4 hover:text-amber-800 cursor-pointer pt-2"
            >
              Découvrir le parcours &amp; la carte des compétences
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {WHAT_I_BRING.map((item, idx) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActiveQualityIdx(idx)}
                  className={`px-3 py-2.5 text-left text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap truncate ${
                    activeQualityIdx === idx
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <span className="font-tabular opacity-60 mr-1.5">0{idx + 1}</span>
                  {item.title}
                </button>
              ))}
            </div>

            <div className="p-6 md:p-8 rounded-2xl bg-white border border-stone-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-editorial text-2xl md:text-3xl font-semibold text-stone-950">
                  {WHAT_I_BRING[activeQualityIdx].title}
                </h3>
                <span className="font-tabular text-xs text-stone-400">
                  0{activeQualityIdx + 1} / 07
                </span>
              </div>
              <p className="text-base text-stone-700 leading-relaxed">
                {WHAT_I_BRING[activeQualityIdx].description}
              </p>
              <p className="text-xs text-stone-500 pt-2 border-t border-stone-100">
                Expérimenté concrètement : {WHAT_I_BRING[activeQualityIdx].anchor}
              </p>
            </div>
          </div>
        </div>

        {/* L'art de la communication */}
        <div className="rounded-2xl bg-stone-900 text-stone-100 p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs font-medium text-amber-300">Note éditoriale · L’art de la communication</p>
            <blockquote className="font-editorial text-2xl md:text-4xl font-medium leading-snug text-white">
              « La communication ne consiste pas seulement à parler. Il s’agit de comprendre les gens, d’adapter son approche et de savoir répondre avec justesse. »
            </blockquote>
          </div>
          <div className="lg:col-span-5 space-y-3 text-sm text-stone-300 leading-relaxed">
            <p>
              Regarder des films et séries en version originale a aiguisé chez Soraya le goût des nuances de voix, du sous-texte, des expressions et du rythme humain.
            </p>
            <p>
              En prospection commerciale comme en accueil international, cette même attention devient une véritable force d’écoute active, d’improvisation fluide et d’adaptation immédiate à chaque interlocuteur.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
