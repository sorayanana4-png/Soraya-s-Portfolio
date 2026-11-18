import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Box,
  Car,
  CheckCircle2,
  Database,
  Download,
  ExternalLink,
  Flag,
  Globe,
  GraduationCap,
  HeartHandshake,
  Instagram,
  Layers,
  MapPin,
  Palette,
  PhoneCall,
  Plane,
  Radio,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import {
  EDUCATION_TIMELINE,
  EXPERIENCES,
  SKILL_MAP,
  WHAT_I_BRING,
} from '../data/sorayaData';
import { useUniverse } from '../context/UniverseContext';
import { MediaGallery } from '../components/MediaGallery';
import { CloudinaryImageCard } from '../components/CloudinaryImageCard';
import { ThreeUniverseScene } from '../components/ThreeUniverseScene';

export function CareerView() {
  const { cmsData, setIsCVModalOpen, getMediaUrl } = useUniverse();
  const [selectedExpId, setSelectedExpId] = useState<string>(EXPERIENCES[0].id);
  const [skillFilter, setSkillFilter] = useState<'all' | 'business' | 'marketing' | 'tools' | 'soft'>('all');
  const [selectedSkill, setSelectedSkill] = useState<string | null>('Prospection B2B');
  const [showLeMans3D, setShowLeMans3D] = useState(false);

  const activeExp = EXPERIENCES.find((e) => e.id === selectedExpId) || EXPERIENCES[0];

  const filteredSkills =
    skillFilter === 'all' ? SKILL_MAP : SKILL_MAP.filter((s) => s.category === skillFilter);

  const activeSkillObj = SKILL_MAP.find((s) => s.name === selectedSkill);
  const leMansHero = getMediaUrl('lemans.circuit') || activeExp.heroImage;

  return (
    <div className="bg-[#FAF8F5] text-stone-900">
      {/* En-tête du parcours */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 pt-10 pb-10 border-b border-stone-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <p className="text-xs font-medium text-stone-500">
              01 · Parcours Professionnel · Études de cas visuelles &amp; Compétences
            </p>
            <h1 className="font-editorial text-4xl md:text-6xl font-semibold text-stone-950">
              Un parcours commercial, créatif et polyvalent
            </h1>
            <p className="text-base text-stone-600 leading-relaxed">
              Chaque expérience professionnelle est présentée comme une étude de cas immersive avec interfaces métier, environnements visuels et emplacements dédiés à vos archives personnelles. Sélectionnez une organisation ci-dessous.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCVModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 cursor-pointer whitespace-nowrap shrink-0 self-start md:self-auto"
          >
            <Download className="w-4 h-4" />
            Télécharger le CV complet
          </button>
        </div>

        {/* Frise sélective des entreprises */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {EXPERIENCES.map((exp, idx) => {
            const active = exp.id === selectedExpId;
            return (
              <motion.button
                key={exp.id}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: idx * 0.04 }}
                onClick={() => setSelectedExpId(exp.id)}
                className={`p-3.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between min-h-[82px] ${
                  active
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] opacity-65 w-full">
                  <span className="font-tabular">0{idx + 1}</span>
                  <span className="truncate max-w-[100px]">{exp.period}</span>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-semibold truncate">{exp.company}</p>
                  <p className="text-[11px] opacity-75 truncate">{exp.position}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Étude de cas active */}
      <motion.section
        key={activeExp.id}
        initial={{ opacity: 0.4, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          backgroundColor: activeExp.theme.bg,
          color: activeExp.theme.text,
        }}
        className="py-14 md:py-20 transition-colors duration-300"
      >
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 space-y-12">
          {/* Bannière Motorsport pour 24 Hours of Le Mans */}
          {activeExp.isMotorsport && leMansHero && (
            <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[21/9] min-h-[260px]">
              <img
                src={leMansHero}
                alt="Circuit des 24 Hours of Le Mans au crépuscule"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/40 to-transparent flex flex-col justify-end p-6 md:p-10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-rose-300">
                      <Flag className="w-3.5 h-3.5" />
                      <span>Univers Sport Automobile · Circuit de la Sarthe</span>
                    </div>
                    <h2 className="font-editorial text-3xl md:text-5xl font-semibold text-white mt-1">
                      24 Hours of Le Mans — Paddock &amp; Hospitalité Internationale
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowLeMans3D((v) => !v)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-500 cursor-pointer"
                  >
                    <Box className="w-4 h-4" />
                    {showLeMans3D ? 'Masquer le prototype 3D' : 'Explorer le prototype 3D'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeExp.isMotorsport && showLeMans3D && (
            <ThreeUniverseScene
              initialMode="motorsport"
              heightClass="h-[380px] md:h-[440px]"
              title="24 Hours of Le Mans — Prototype Endurance 3D"
            />
          )}

          {/* En-tête de l'entreprise sélectionnée */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div
                className="flex flex-wrap items-center gap-2 text-xs font-medium"
                style={{ color: activeExp.theme.muted }}
              >
                <span>{activeExp.industry}</span>
                <span aria-hidden="true">·</span>
                <span>{activeExp.location}</span>
                <span aria-hidden="true">·</span>
                <span className="font-tabular">{activeExp.period}</span>
                {activeExp.dateNote && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="italic">{activeExp.dateNote}</span>
                  </>
                )}
              </div>

              <h2 className="font-editorial text-4xl md:text-5xl font-semibold">
                {activeExp.company} — {activeExp.position}
              </h2>

              <p
                className="text-base md:text-lg leading-relaxed max-w-2xl"
                style={{ color: activeExp.theme.muted }}
              >
                {activeExp.summary}
              </p>

              {activeExp.disclaimer && (
                <p className="text-xs italic pt-2" style={{ color: activeExp.theme.muted }}>
                  Précision : {activeExp.disclaimer}
                </p>
              )}
            </div>

            {/* Panneau points clés */}
            <div
              className="lg:col-span-5 rounded-2xl p-6 border space-y-4"
              style={{
                backgroundColor: activeExp.theme.surface,
                borderColor: activeExp.theme.border,
              }}
            >
              <p
                className="text-xs font-semibold tracking-wider"
                style={{ color: activeExp.theme.accent }}
              >
                IMPACT &amp; ENVIRONNEMENT CLÉ
              </p>
              <ul className="space-y-3 text-sm">
                {activeExp.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5">
                    <span
                      className="w-1.5 h-1.5 rounded-sm mt-2 shrink-0"
                      style={{ backgroundColor: activeExp.theme.accent }}
                    />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              {activeExp.tools && (
                <div
                  className="pt-4 border-t text-xs"
                  style={{ borderColor: activeExp.theme.border, color: activeExp.theme.muted }}
                >
                  <span className="font-semibold">Outils utilisés : </span>
                  {activeExp.tools.join(' · ')}
                </div>
              )}
            </div>
          </div>

          {/* =============================================================== */}
          {/* PERMIFAST — ÉTUDE DE CAS PRODUIT & VISUELS                      */}
          {/* =============================================================== */}
          {activeExp.id === 'permifast' && (
            <div className="space-y-10 pt-4 border-t border-slate-200">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-blue-700">
                    Architecture Marketplace &amp; Étude de cas visuelle
                  </p>
                  <h3 className="font-editorial text-3xl font-semibold text-slate-950 mt-1">
                    Connecter les auto-écoles et les élèves sur PermiFast
                  </h3>
                </div>
                <p className="text-xs text-slate-600 max-w-md">
                  Modèle économique : place de marché SaaS permettant aux auto-écoles d’accélérer leurs inscriptions tout en offrant aux candidats transparence et réservation directe.
                </p>
              </div>

              {/* Maquettes interactives : Mobile élève + Espace partenaire + Pipeline Airtable */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-4 rounded-2xl bg-slate-900 text-white p-6 flex flex-col justify-between space-y-5 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-blue-300">
                    <span className="inline-flex items-center gap-1.5 font-semibold">
                      <Smartphone className="w-4 h-4" />
                      Parcours Mobile Élève PermiFast
                    </span>
                    <span className="font-tabular">iOS / Android</span>
                  </div>
                  <div className="mx-auto w-full max-w-[240px] rounded-[24px] bg-white text-slate-900 p-4 border-4 border-slate-700 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-blue-700">PermiFast</span>
                      <span className="text-[10px] text-slate-500">Marketplace Permis</span>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-2.5 text-[11px] space-y-1">
                      <p className="font-semibold text-slate-900">Trouver une auto-école certifiée</p>
                      <p className="text-slate-600">Comparer les forfaits, créneaux et avis élèves</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-2.5 space-y-1 text-[11px]">
                      <div className="flex justify-between font-semibold">
                        <span>Fiche Partenaire Auto-École</span>
                        <span className="text-blue-700">En ligne</span>
                      </div>
                      <p className="text-slate-500">Profil configuré en B2B · Réservation rapide</p>
                    </div>
                    <div className="rounded-lg bg-blue-700 text-white text-center py-1.5 text-[11px] font-semibold">
                      Réserver un forfait conduite
                    </div>
                  </div>
                  <p className="text-xs text-slate-300">
                    L’expérience élève repose directement sur la qualité des profils auto-écoles créés et structurés lors de l’onboarding B2B.
                  </p>
                </div>

                <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between text-xs text-blue-700 font-semibold">
                    <span>Interface Vitrine Partenaire</span>
                    <span>Marketplace B2B</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Espace Auto-École Partenaire</p>
                        <p className="text-[11px] text-slate-500">Vitrine dédiée sur PermiFast</p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-blue-700" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <p className="text-slate-500">Offre présentée</p>
                        <p className="font-semibold text-slate-900">Code + Conduite B</p>
                      </div>
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <p className="text-slate-500">Statut profil</p>
                        <p className="font-semibold text-blue-700">Vérifié &amp; Actif</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Chaque auto-école signée bénéficie d’une fiche complète présentant ses tarifs transparents, disponibilités et flux d’élèves qualifiés.
                    </p>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center justify-between gap-2">
                    <span>
                      <strong className="text-slate-900">Rôle :</strong> Prospection, démo &amp; mise en ligne.
                    </span>
                    <a
                      href="https://www.permifast.com"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-blue-700 font-semibold hover:underline shrink-0"
                    >
                      permifast.com
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between text-xs text-blue-700 font-semibold">
                    <span className="inline-flex items-center gap-1.5">
                      <Database className="w-4 h-4" />
                      Tableau de suivi B2B Airtable
                    </span>
                    <span>CRM &amp; Croissance</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 overflow-hidden text-[11px]">
                    <div className="bg-slate-100 px-3 py-2 grid grid-cols-3 font-semibold text-slate-700">
                      <span>Auto-École</span>
                      <span>Étape</span>
                      <span>Pôle</span>
                    </div>
                    <div className="divide-y divide-slate-100 bg-white">
                      {[
                        ['Prospect qualifié', 'Cold Call', 'Commerce'],
                        ['Démo réalisée', 'Proposition', 'Business Dev'],
                        ['Contrat signé', 'Onboarding', 'Airtable'],
                        ['Profil publié', 'Partenaire actif', 'Marketing'],
                      ].map(([a, b, c]) => (
                        <div key={a} className="px-3 py-2 grid grid-cols-3 text-slate-700">
                          <span className="font-medium text-slate-900">{a}</span>
                          <span className="text-blue-700">{b}</span>
                          <span className="text-slate-500">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">
                    Base Airtable structurée reliant phoning B2B, suivi commercial, activation partenaire et actions marketing conjointes.
                  </p>
                </div>
              </div>

              {/* Visuels officiels & illustrations + emplacement personnel */}
              <div className="space-y-4">
                <h4 className="font-editorial text-2xl font-semibold text-slate-950">
                  Aperçu visuel PermiFast &amp; environnement auto-école
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CloudinaryImageCard slotKey="permifast.logo" accentColor="#1D4ED8" />
                  <CloudinaryImageCard slotKey="permifast.drivingSchoolPhoto" accentColor="#1D4ED8" />
                  <CloudinaryImageCard slotKey="permifast.partnerProfile" accentColor="#1D4ED8" />
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* LGD PARIS — TRANSPORT & MOBILITÉ AÉROPORT                       */}
          {/* =============================================================== */}
          {activeExp.id === 'lgd-paris' && (
            <div className="space-y-10 pt-4 border-t border-slate-700">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-6 rounded-2xl bg-[#131D31] border border-slate-700 p-6 space-y-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
                    <span className="inline-flex items-center gap-1.5">
                      <Plane className="w-4 h-4" />
                      Pôle Transport &amp; Dispatch Paris-Orly
                    </span>
                    <span className="font-tabular">Way-Plan · Axonaute · Quicktalk</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700">
                      <PhoneCall className="w-4 h-4 text-amber-300 mb-2" />
                      <p className="font-semibold text-white">100–150 appels/jour</p>
                      <p className="text-slate-400 mt-1">Prospection sortante intensive sur Quicktalk</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700">
                      <Car className="w-4 h-4 text-amber-300 mb-2" />
                      <p className="font-semibold text-white">Coordination Chauffeurs</p>
                      <p className="text-slate-400 mt-1">Affectation des missions &amp; suivi Way-Plan</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700">
                      <ShieldCheck className="w-4 h-4 text-amber-300 mb-2" />
                      <p className="font-semibold text-white">70 % de renouvellement</p>
                      <p className="text-slate-400 mt-1">~5 devis par semaine gérés sur Axonaute</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 text-xs space-y-2">
                    <div className="flex items-center justify-between text-amber-300 font-semibold">
                      <span>Matrice quotidienne d’exploitation transport</span>
                      <span>Orly / Île-de-France</span>
                    </div>
                    <div className="grid grid-cols-3 text-slate-300 pt-1 border-t border-slate-800">
                      <span>Demande client → Devis</span>
                      <span>Attribution chauffeur</span>
                      <span>Contrôle trajet en direct</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CloudinaryImageCard slotKey="lgd.airportEnvironment" dark accentColor="#D4A359" />
                  <CloudinaryImageCard slotKey="lgd.vehicleFleet" dark accentColor="#D4A359" />
                </div>
              </div>

              <div className="max-w-sm">
                <CloudinaryImageCard slotKey="lgd.logo" dark objectFit="contain" accentColor="#D4A359" />
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* CLEAN & SHOP — STUDIO SNEAKERS & MARKETING                      */}
          {/* =============================================================== */}
          {activeExp.id === 'clean-and-shop' && (
            <div className="space-y-8 pt-4 border-t border-zinc-700">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-amber-400">
                    Atelier de personnalisation Streetwear · Marketing &amp; Développement commercial
                  </p>
                  <h3 className="font-editorial text-3xl font-semibold text-white mt-1">
                    Sneakers personnalisées, textile, flocage maillots &amp; Instagram
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-300">
                  <span className="inline-flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-amber-400" />
                    Illustrations peintes à la main
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Instagram className="w-4 h-4 text-amber-400" />
                    Croissance Instagram &amp; Ventes B2B/B2C
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CloudinaryImageCard slotKey="cleanAndShop.customizedSneakers" dark accentColor="#F59E0B" />
                <CloudinaryImageCard slotKey="cleanAndShop.beforeAfter" dark accentColor="#F59E0B" />
                <CloudinaryImageCard slotKey="cleanAndShop.logo" dark objectFit="contain" accentColor="#F59E0B" />
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* 24 HOURS OF LE MANS — ENVIRONNEMENTS FORD & ALPINE              */}
          {/* =============================================================== */}
          {activeExp.id === 'le-mans' && (
            <div className="space-y-6 pt-4 border-t border-slate-800">
              <div>
                <p className="text-xs font-semibold text-rose-400">
                  Circuit · Voie des stands · Environnements d’hospitalité automobile
                </p>
                <h3 className="font-editorial text-3xl font-semibold text-white mt-1">
                  Environnements Ford &amp; Alpine, Stands et Zones VIP
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <CloudinaryImageCard slotKey="lemans.ford" dark accentColor="#E11D48" />
                <CloudinaryImageCard slotKey="lemans.alpine" dark accentColor="#E11D48" />
                <CloudinaryImageCard slotKey="lemans.paddock" dark accentColor="#E11D48" />
                <CloudinaryImageCard slotKey="lemans.eventPhoto" dark accentColor="#E11D48" />
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* MAHOLA — ACCUEIL ÉVÉNEMENTIEL                                   */}
          {/* =============================================================== */}
          {activeExp.id === 'mahola' && (
            <div className="space-y-6 pt-4 border-t border-stone-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-rose-900">
                    Orientation en direct &amp; Coordination bilingue
                  </p>
                  <h3 className="font-editorial text-2xl font-semibold text-stone-950">
                    Mahola — Accueil VIP &amp; Coordination par talkie-walkie
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-xs text-stone-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-rose-900" />
                    Coordination terrain en temps réel
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-900" />
                    24 Hours of Le Mans
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
                <div className="rounded-2xl overflow-hidden border border-stone-200 bg-white">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src="/src/assets/images/lemans_motorsport_1795008928368.jpg"
                      alt="Circuit des 24 Hours of Le Mans"
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold text-stone-900">Cadre d’intervention événementiel</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Accueil international et orientation des visiteurs lors des 24 Hours of Le Mans.
                    </p>
                  </div>
                </div>
                <CloudinaryImageCard slotKey="mahola.logo" objectFit="contain" accentColor="#881337" />
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* LA VILLE DU MANS — SERVICE EN EHPAD                             */}
          {/* =============================================================== */}
          {activeExp.id === 'ville-du-mans' && (
            <div className="space-y-6 pt-4 border-t border-emerald-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-emerald-800">
                    Service public · Empathie &amp; rigueur d’hygiène
                  </p>
                  <h3 className="font-editorial text-2xl font-semibold text-emerald-950">
                    La Ville du Mans — Accompagnement hôtelier en EHPAD
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-900 font-medium">
                  <HeartHandshake className="w-4 h-4" />
                  Bien-être des résidents &amp; coordination du service repas
                </span>
              </div>
              <div className="max-w-md">
                <CloudinaryImageCard slotKey="villeDuMans.ehpad" accentColor="#2D6A4F" />
              </div>
            </div>
          )}

          {/* Responsabilités détaillées & Compétences */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div
              className="lg:col-span-7 rounded-2xl p-6 md:p-8 border space-y-5"
              style={{
                backgroundColor: activeExp.theme.surface,
                borderColor: activeExp.theme.border,
              }}
            >
              <h3 className="font-editorial text-2xl font-semibold">
                {activeExp.secondaryResponsibilities
                  ? 'Missions Marketing & Image de marque'
                  : 'Missions principales'}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                {activeExp.responsibilities.map((r) => (
                  <li key={r} className="flex items-start gap-2">
                    <span style={{ color: activeExp.theme.accent }}>—</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>

              {activeExp.secondaryResponsibilities && (
                <div
                  className="pt-5 border-t space-y-4"
                  style={{ borderColor: activeExp.theme.border }}
                >
                  <h4 className="font-editorial text-xl font-semibold">
                    {activeExp.secondaryResponsibilities.label}
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                    {activeExp.secondaryResponsibilities.items.map((r) => (
                      <li key={r} className="flex items-start gap-2">
                        <span style={{ color: activeExp.theme.accent }}>—</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div
              className="lg:col-span-5 rounded-2xl p-6 md:p-8 border space-y-5"
              style={{
                backgroundColor: activeExp.theme.surface,
                borderColor: activeExp.theme.border,
              }}
            >
              <h3 className="font-editorial text-2xl font-semibold">Compétences &amp; forces développées</h3>
              <div className="space-y-2">
                {activeExp.skills.map((skill, idx) => (
                  <div
                    key={skill}
                    className="flex items-center justify-between py-2 border-b text-sm"
                    style={{ borderColor: activeExp.theme.border }}
                  >
                    <span>{skill}</span>
                    <span className="font-tabular text-xs opacity-60">0{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Galerie média intégrée (Clean & Shop & Le Mans) */}
          {activeExp.gallerySectionKey && (
            <div className="pt-8 border-t" style={{ borderColor: activeExp.theme.border }}>
              <MediaGallery
                sectionKey={activeExp.gallerySectionKey}
                heading={
                  activeExp.id === 'clean-and-shop'
                    ? 'Galerie visuelle Clean & Shop'
                    : 'Archives événementielles 24 Hours of Le Mans'
                }
                subheading={
                  activeExp.id === 'clean-and-shop'
                    ? 'Illustrations d’atelier et emplacement libre pour vos créations personnalisées et Reels.'
                    : 'Photographies d’ambiance endurance et souvenirs personnels d’accueil.'
                }
                dark={activeExp.theme.bg.startsWith('#0') || activeExp.theme.bg.startsWith('#1')}
                accentColor={activeExp.theme.accent}
              />
            </div>
          )}
        </div>
      </motion.section>

      {/* Cartographie interactive des compétences */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 py-16 md:py-24 border-t border-stone-200 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
              <Layers className="w-3.5 h-3.5" />
              <span>Cartographie interactive des compétences</span>
            </div>
            <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-stone-950">
              Des compétences reliées aux expériences de terrain
            </h2>
            <p className="text-sm text-stone-600 max-w-2xl">
              Cliquez sur n’importe quelle compétence ou outil pour identifier les missions précises au cours desquelles Soraya les a mis en pratique. Aucun score fictif, uniquement du vécu concret.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-200/70 rounded-lg">
            {[
              { id: 'all', label: 'Tout' },
              { id: 'business', label: 'Business Dev' },
              { id: 'marketing', label: 'Marketing Digital' },
              { id: 'tools', label: 'Outils' },
              { id: 'soft', label: 'Savoir-être' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSkillFilter(tab.id as typeof skillFilter)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  skillFilter === tab.id
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 flex flex-wrap gap-2">
            {filteredSkills.map((sk) => {
              const isSelected = selectedSkill === sk.name;
              return (
                <button
                  key={sk.name}
                  type="button"
                  onClick={() => setSelectedSkill(sk.name)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {sk.name}
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-4 rounded-2xl bg-white border border-stone-200 p-6 space-y-4">
            <p className="text-xs font-medium text-stone-500">Missions associées</p>
            {activeSkillObj ? (
              <>
                <h3 className="font-editorial text-2xl font-semibold text-stone-950">
                  {activeSkillObj.name}
                </h3>
                <div className="space-y-2.5 pt-2">
                  {activeSkillObj.experienceIds.map((id) => {
                    const exp = EXPERIENCES.find((e) => e.id === id);
                    if (!exp) return null;
                    return (
                      <button
                        key={exp.id}
                        type="button"
                        onClick={() => {
                          setSelectedExpId(exp.id);
                          window.scrollTo({ top: 180, behavior: 'smooth' });
                        }}
                        className="w-full text-left p-3 rounded-xl border border-stone-200 hover:border-stone-900 transition-colors cursor-pointer"
                      >
                        <p className="text-sm font-semibold text-stone-900">{exp.company}</p>
                        <p className="text-xs text-stone-500">
                          {exp.position} · {exp.period}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-sm text-stone-600">Sélectionnez une compétence pour voir les expériences associées.</p>
            )}
          </div>
        </div>
      </section>

      {/* Formation & Langues */}
      <section className="bg-[#F4F0EA] border-t border-stone-200 py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
              <GraduationCap className="w-4 h-4" />
              <span>Parcours académique</span>
            </div>
            <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-stone-950">
              Formation &amp; Diplômes
            </h2>

            <div className="space-y-5">
              {EDUCATION_TIMELINE.map((ed) => (
                <div
                  key={ed.id}
                  className="rounded-2xl bg-white border border-stone-200 p-6 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="font-editorial text-2xl font-semibold text-stone-950">
                      {ed.institution}
                    </h3>
                    <span className="text-xs text-stone-500">{ed.program}</span>
                  </div>
                  <p className="text-sm font-medium text-amber-800">{ed.specialization}</p>
                  <ul className="space-y-1.5 text-sm text-stone-700 pt-1">
                    {ed.highlights.map((h) => (
                      <li key={h}>— {h}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-stone-500 italic pt-2 border-t border-stone-100">
                    {ed.id === 'rocket-school' ? cmsData.profile.educationNote : ed.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
              <Globe className="w-4 h-4" />
              <span>Langues &amp; Ouverture internationale</span>
            </div>
            <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-stone-950">
              Langues pratiquées
            </h2>

            <div className="rounded-2xl bg-white border border-stone-200 p-6 space-y-5">
              <div className="pb-4 border-b border-stone-100">
                <div className="flex items-baseline justify-between">
                  <p className="font-semibold text-stone-900">Français</p>
                  <span className="text-xs text-stone-600">Langue maternelle</span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Langue principale de négociation B2B, prospection téléphonique, rhétorique et communication de marque.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-semibold text-stone-900">Anglais</p>
                  <span className="text-xs text-amber-800 font-medium">
                    {cmsData.profile.englishStatusNote}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Pratiqué en contexte réel lors de l’accueil international aux 24 Hours of Le Mans, en relation client, en prospection et au contact de cultures étrangères.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-stone-900 text-stone-100 p-6 space-y-3">
              <p className="text-xs text-amber-300 font-medium">Les 7 piliers professionnels</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {WHAT_I_BRING.map((q) => (
                  <div key={q.title} className="border-t border-white/10 pt-2">
                    <p className="font-semibold text-white">{q.title}</p>
                    <p className="text-stone-400 mt-0.5">{q.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
