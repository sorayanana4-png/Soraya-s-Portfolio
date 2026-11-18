import React, { useState } from 'react';
import { Briefcase, Palette } from 'lucide-react';
import { CREATIVE_STUDIO_CASES, ENTREPRENEURIAL_PROJECTS } from '../data/sorayaData';
import { MediaGallery } from '../components/MediaGallery';
import { CloudinaryImageCard } from '../components/CloudinaryImageCard';

export function ProjectsView() {
  const [filter, setFilter] = useState<
    'Tout' | 'Entreprise indépendante' | 'Projet académique & business' | 'Initiative personnelle'
  >('Tout');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(ENTREPRENEURIAL_PROJECTS[0].id);

  const visibleProjects =
    filter === 'Tout'
      ? ENTREPRENEURIAL_PROJECTS
      : ENTREPRENEURIAL_PROJECTS.filter((p) => p.classification === filter);

  const activeProject =
    ENTREPRENEURIAL_PROJECTS.find((p) => p.id === selectedProjectId) || ENTREPRENEURIAL_PROJECTS[0];

  return (
    <div className="bg-[#FAF7F2] text-zinc-900">
      {/* En-tête */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 pt-12 pb-12 border-b border-zinc-200">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-medium text-amber-800">
            02 · Entrepreneuriat &amp; Freelance
          </p>
          <h1 className="font-editorial text-4xl md:text-6xl font-semibold text-zinc-950">
            Mon parcours entrepreneurial
          </h1>
          <p className="font-editorial text-2xl italic text-zinc-600">
            « Transformer des idées en projets concrets. »
          </p>
          <p className="text-sm md:text-base text-zinc-600 leading-relaxed pt-2">
            E-commerce indépendant, création d’identité de marque, modélisation de projets académiques et direction sociale media freelance — en distinguant avec transparence les initiatives indépendantes des projets académiques, sans chiffres commerciaux fictifs.
          </p>
        </div>

        {/* Filtres */}
        <div className="mt-8 flex flex-wrap items-center gap-1 p-1 bg-zinc-200/70 rounded-lg w-fit">
          {(
            [
              'Tout',
              'Entreprise indépendante',
              'Projet académique & business',
              'Initiative personnelle',
            ] as const
          ).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                filter === cat
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Projets entrepreneuriaux interactifs */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-3">
            {visibleProjects.map((proj) => {
              const active = proj.id === activeProject.id;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => setSelectedProjectId(proj.id)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all cursor-pointer ${
                    active
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs opacity-70 mb-1">
                    <span>{proj.classification}</span>
                    <span>{proj.status}</span>
                  </div>
                  <h2 className="font-editorial text-2xl font-semibold">{proj.name}</h2>
                  <p className="text-xs opacity-75 mt-1 line-clamp-2">{proj.concept}</p>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8 rounded-2xl bg-white border border-zinc-200 p-7 md:p-10 space-y-8">
            <div className="border-b border-zinc-200 pb-6 space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-amber-800">
                <Briefcase className="w-3.5 h-3.5" />
                <span>{activeProject.classification}</span>
                <span aria-hidden="true">·</span>
                <span>{activeProject.status}</span>
              </div>
              <h3 className="font-editorial text-3xl md:text-4xl font-semibold text-zinc-950">
                {activeProject.name}
              </h3>
              <p className="text-base text-zinc-700 leading-relaxed">{activeProject.concept}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-zinc-500">PUBLIC CIBLE</p>
                <p className="text-zinc-800 leading-relaxed">{activeProject.targetAudience}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-zinc-500">MODÈLE ÉCONOMIQUE</p>
                <p className="text-zinc-800 leading-relaxed">{activeProject.businessModel}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-zinc-500">APPROCHE MARKETING</p>
                <p className="text-zinc-800 leading-relaxed">{activeProject.marketingApproach}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-zinc-500">IDENTITÉ VISUELLE</p>
                <p className="text-zinc-800 leading-relaxed">{activeProject.visualIdentity}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-zinc-500">DÉFIS RENCONTRÉS</p>
                <p className="text-zinc-800 leading-relaxed">{activeProject.challenges}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-zinc-500">ENSEIGNEMENTS CLÉS</p>
                <p className="text-zinc-800 leading-relaxed">{activeProject.lessonsLearned}</p>
              </div>
            </div>

            <div className="pt-5 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-600">
              <div>
                <span className="font-semibold text-zinc-900">Outils mobilisés : </span>
                {activeProject.tools.join(' · ')}
              </div>
              <span className="italic text-zinc-500">
                Aucun chiffre d’affaires non vérifié n’est publié.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* THE CREATIVE STUDIO — Accompagnement Social Media Freelance */}
      <section className="bg-zinc-950 text-zinc-100 py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-zinc-800 pb-10">
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-amber-400">
                <Palette className="w-4 h-4" />
                <span>Social Media Freelance &amp; Direction de marque</span>
              </div>
              <h2 className="font-editorial text-4xl md:text-5xl font-semibold text-white">
                The Creative Studio
              </h2>
              <p className="text-sm md:text-base text-zinc-300 leading-relaxed max-w-2xl">
                Soraya accompagne en freelance des restaurants et instituts de beauté sur leurs réseaux sociaux : calendriers éditoriaux, posts Instagram, Reels, Stories, systèmes visuels sur Canva et animation de communauté dans le strict respect de la confidentialité de ses clients.
              </p>
            </div>
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 text-xs text-zinc-300">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="font-semibold text-white">Formats créatifs</p>
                <p className="mt-1 text-zinc-400">Posts Instagram · Stories · Reels · Designs Canva</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="font-semibold text-white">Accompagnement stratégique</p>
                <p className="mt-1 text-zinc-400">Calendriers éditoriaux · Image de marque · Visibilité</p>
              </div>
            </div>
          </div>

          {/* Études sectorielles non confidentielles illustrées */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CREATIVE_STUDIO_CASES.map((cs) => (
              <div
                key={cs.id}
                className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden flex flex-col"
              >
                <div className="aspect-[16/9] overflow-hidden relative">
                  <img
                    src={cs.atmosphereImage}
                    alt={cs.atmosphereCaption}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/75 text-amber-300 text-[11px] font-semibold">
                    {cs.category} · Illustration sectorielle
                  </span>
                </div>
                <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-amber-400">
                      <span>{cs.formatFocus}</span>
                      <span>Confidentialité respectée</span>
                    </div>
                    <h3 className="font-editorial text-2xl font-semibold text-white">
                      {cs.clientType}
                    </h3>
                    <p className="text-sm text-zinc-300 leading-relaxed">{cs.scope}</p>
                    <p className="text-[11px] text-zinc-500 italic">{cs.atmosphereCaption}</p>
                  </div>
                  <div className="pt-3 border-t border-zinc-800 text-xs text-zinc-400">
                    <p className="font-semibold text-zinc-200 mb-1">Livrables types</p>
                    <p>{cs.deliverables.join(' · ')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Vitrine visuelle pré-remplie + slot personnel */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-amber-400">
                Univers visuels &amp; Espace créations personnelles
              </p>
              <h3 className="font-editorial text-3xl font-semibold text-white mt-1">
                Direction artistique Restauration, Beauté &amp; Studio Canva
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <CloudinaryImageCard slotKey="freelance.canvaDesign" dark accentColor="#F59E0B" />
              <CloudinaryImageCard slotKey="freelance.restaurantSocial" dark accentColor="#F59E0B" />
              <CloudinaryImageCard slotKey="freelance.beautySalon" dark accentColor="#F59E0B" />
              <CloudinaryImageCard slotKey="freelance.personalWork" dark accentColor="#F59E0B" />
            </div>
          </div>

          <MediaGallery
            sectionKey="creative-studio"
            heading="Archives & réalisations The Creative Studio"
            subheading="Illustrations sectorielles et emplacement libre pour vos réalisations non confidentielles (posts, Reels, maquettes Canva)."
            dark
            accentColor="#F59E0B"
            defaultCategory="Posts Instagram"
          />
        </div>
      </section>
    </div>
  );
}
