import { INITIAL_CMS_DATA, EXPERIENCES, EDUCATION_TIMELINE, ENTREPRENEURIAL_PROJECTS } from '../data/sorayaData';
import { UniverseId } from '../types/universe';

export interface UniverseRouteConfig {
  id: UniverseId;
  path: string;
  label: string;
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  priority: string;
  schemaType: 'ProfilePage' | 'CollectionPage' | 'ContactPage';
}

export const UNIVERSE_ROUTES: UniverseRouteConfig[] = [
  {
    id: 'home',
    path: '/',
    label: 'Accueil',
    title: 'Soraya Boua | Business Development & Marketing Digital',
    description:
      'Portfolio interactif BEYOND THE CV de Soraya Boua : Business Development B2B, Marketing Digital en France, entrepreneuriat, projets créatifs et passions.',
    keywords: [
      'Soraya Boua',
      'Business Development France',
      'Marketing Digital',
      'Prospection B2B',
      'BEYOND THE CV',
      'Portfolio Soraya Boua',
      'Rocket School',
    ],
    ogImage: '/src/assets/images/soraya_portrait_1795008927811.jpg',
    priority: '1.0',
    schemaType: 'ProfilePage',
  },
  {
    id: 'career',
    path: '/parcours',
    label: 'Parcours Professionnel',
    title: 'Parcours Pro — Soraya Boua | Business Development France',
    description:
      'Découvrez le parcours B2B et marketing de Soraya Boua : PermiFast, LGD Paris, Clean & Shop, 24 Hours of Le Mans, Mahola, Rocket School et Paris Nanterre.',
    keywords: [
      'Soraya Boua parcours',
      'Business Developer B2B France',
      'PermiFast',
      'LGD Paris',
      'Clean & Shop',
      '24 Hours of Le Mans',
      'Rocket School',
    ],
    ogImage: '/src/assets/images/permifast_b2b_dashboard_1795012546848.jpg',
    priority: '0.9',
    schemaType: 'ProfilePage',
  },
  {
    id: 'projects',
    path: '/projets',
    label: 'Projets & The Creative Studio',
    title: 'Projets & The Creative Studio | Soraya Boua',
    description:
      'Initiatives entrepreneuriales (EasyGadget, PetCare+) et accompagnement social media freelance de Soraya Boua pour restaurants et instituts de beauté.',
    keywords: [
      'Entrepreneuriat Soraya Boua',
      'The Creative Studio',
      'Social Media Freelance France',
      'EasyGadget',
      'PetCare+',
    ],
    ogImage: '/src/assets/images/bistro_food_photo_1795012575623.jpg',
    priority: '0.9',
    schemaType: 'CollectionPage',
  },
  {
    id: 'travel',
    path: '/voyages',
    label: 'Carnets de Voyage',
    title: "Carnets de Voyage — Côte d'Ivoire & Malte | Soraya Boua",
    description:
      "Récits de voyage, ouverture interculturelle et découvertes entre la Côte d'Ivoire et Malte dans l'univers BEYOND THE CV de Soraya Boua.",
    keywords: [
      'Carnets de voyage Soraya Boua',
      "Côte d'Ivoire",
      'Malte',
      'Ouverture internationale',
    ],
    ogImage: '/src/assets/images/travel_cote_ivoire_1795008929357.jpg',
    priority: '0.8',
    schemaType: 'CollectionPage',
  },
  {
    id: 'cinema',
    path: '/cinema',
    label: 'Cinéma & Séries',
    title: 'Cinéma & Séries — Collections VO | Soraya Boua',
    description:
      'Explorez les films et séries favoris de Soraya Boua : Mr. & Mrs. Smith, Game of Thrones, House of the Dragon, Yellowstone et univers de Taylor Sheridan.',
    keywords: [
      'Cinéma Soraya Boua',
      'Mr. & Mrs. Smith',
      'Game of Thrones',
      'Taylor Sheridan',
      'Version originale',
    ],
    ogImage: '/src/assets/images/cinema_backdrop_1795008930404.jpg',
    priority: '0.8',
    schemaType: 'CollectionPage',
  },
  {
    id: 'music',
    path: '/musique',
    label: 'Univers Musical',
    title: 'Univers Musical — The Soundtrack of My Life | Soraya Boua',
    description:
      "Plongez dans l'univers musical R&B et Soul de Soraya Boua : Beyoncé, Rihanna, Sienna Spiro, Adele, FLO, classement annuel et studio de création sonore.",
    keywords: [
      'The Soundtrack of My Life',
      'Soraya Boua musique',
      'R&B Soul',
      'Beyoncé',
      'Rihanna',
      'Sienna Spiro',
    ],
    ogImage: '/src/assets/images/music_rnb_studio_1795008930458.jpg',
    priority: '0.8',
    schemaType: 'CollectionPage',
  },
  {
    id: 'library',
    path: '/bibliotheque',
    label: 'Bibliothèque & Inspiration',
    title: 'Bibliothèque & Inspirations | Soraya Boua',
    description:
      "Lectures marquantes, citations choisies et réflexions autour de la communication, du leadership et de l'entrepreneuriat selon Soraya Boua.",
    keywords: [
      'Bibliothèque Soraya Boua',
      'Lectures communication',
      'Entrepreneuriat',
      'Réflexions personnelles',
    ],
    ogImage: '/src/assets/images/soraya_portrait_1795008927811.jpg',
    priority: '0.8',
    schemaType: 'CollectionPage',
  },
  {
    id: 'kitchen',
    path: '/cuisine',
    label: 'Ma Cuisine',
    title: 'Ma Cuisine — Saveurs du Monde | Soraya Boua',
    description:
      'Carnet culinaire de Soraya Boua : cuisine africaine, française, maghrébine, italienne, asiatique, coréenne, pâtisseries et créations maison.',
    keywords: [
      'Ma Cuisine Soraya Boua',
      'Cuisine Africaine',
      'Cuisine Française',
      'Cuisine Coréenne',
      'Saveurs du monde',
    ],
    ogImage: '/src/assets/images/bistro_food_photo_1795012575623.jpg',
    priority: '0.8',
    schemaType: 'CollectionPage',
  },
  {
    id: 'lifestyle',
    path: '/lifestyle',
    label: 'Lifestyle & Équilibre',
    title: 'Lifestyle & Équilibre | Soraya Boua',
    description:
      "Vitalité, sport, développement personnel et curiosité quotidienne : découvrez l'équilibre de vie et l'énergie de Soraya Boua.",
    keywords: [
      'Lifestyle Soraya Boua',
      'Bien-être',
      'Sport et vitalité',
      'Développement personnel',
    ],
    ogImage: '/src/assets/images/soraya_portrait_1795008927811.jpg',
    priority: '0.8',
    schemaType: 'CollectionPage',
  },
  {
    id: 'contact',
    path: '/contact',
    label: 'Contact & Recrutement',
    title: 'Contacter Soraya Boua | Recrutement & Partenariats',
    description:
      'Contactez Soraya Boua (sorayalopespro@gmail.com) pour vos opportunités en Business Development, Marketing Digital en France ou collaborations freelance.',
    keywords: [
      'Contacter Soraya Boua',
      'Recrutement Business Developer France',
      'Marketing Digital Paris Le Mans',
      'sorayalopespro@gmail.com',
    ],
    ogImage: '/src/assets/images/soraya_portrait_1795008927811.jpg',
    priority: '0.9',
    schemaType: 'ContactPage',
  },
];

export const SORAYA_GEO_FAQ = [
  {
    question: 'Qui est Soraya Boua et quel est son positionnement professionnel ?',
    answer:
      "Soraya Boua est une professionnelle spécialisée en Business Development B2B, Marketing Digital et Entrepreneuriat en France (Le Mans, Paris et international). Formée en Double Licence Droit, Économie-Gestion & Rhétorique à l'Université Paris Nanterre et au Bachelor Business Developer Digital (Marketing & Acquisition) à Rocket School, elle combine prospection commerciale structurée, création de contenu et aisance relationnelle.",
  },
  {
    question:
      'Quelles sont les principales expériences de Soraya Boua en Business Development et Marketing ?',
    answer:
      "Soraya Boua a assuré la prospection B2B, l'onboarding d'auto-écoles partenaires et la gestion CRM sur Airtable chez PermiFast (depuis janvier 2026). Chez LGD Paris (2024-2025), elle a mené 100 à 150 appels de prospection par jour, produit environ 5 devis par semaine et atteint un taux de renouvellement client de 70 %. Elle a également géré le marketing digital, les ventes B2B/B2C et le compte Instagram de Clean & Shop, ainsi que l'hospitalité VIP aux 24 Hours of Le Mans et chez Mahola.",
  },
  {
    question: 'Quels projets entrepreneuriaux et services freelance développe-t-elle ?',
    answer:
      "Soraya Boua a conçu et lancé plusieurs projets e-commerce et entrepreneuriaux (EasyGadget sur Shopify, E-Commerce Beauté & Perruques, ainsi que le concept académique PetCare+). Via The Creative Studio, elle accompagne en freelance des restaurants et instituts de beauté sur leur identité visuelle Canva, leurs Reels, leurs Stories et leur calendrier éditorial Instagram.",
  },
  {
    question: 'Comment contacter Soraya Boua ou consulter son CV complet ?',
    answer:
      'Les recruteurs, responsables marketing, équipes commerciales et partenaires peuvent contacter Soraya Boua par e-mail à sorayalopespro@gmail.com, utiliser le formulaire dédié sur la page Contact (/contact) ou télécharger son CV complet directement depuis la plateforme BEYOND THE CV.',
  },
];

export function normalizePathname(rawPath: string): string {
  const clean = (rawPath || '/').split('?')[0].split('#')[0].trim();
  if (!clean || clean === '/') return '/';
  return clean.endsWith('/') ? clean.slice(0, -1) : clean;
}

export function getRouteConfigByUniverse(id: UniverseId): UniverseRouteConfig {
  return UNIVERSE_ROUTES.find((r) => r.id === id) || UNIVERSE_ROUTES[0];
}

export function getUniverseFromPath(rawPath: string): UniverseId {
  const normalized = normalizePathname(rawPath);
  const found = UNIVERSE_ROUTES.find((r) => r.path === normalized);
  return found ? found.id : 'home';
}

export function getPathForUniverse(id: UniverseId): string {
  return getRouteConfigByUniverse(id).path;
}

export function resolveBaseUrl(candidate?: string): string {
  const raw = (candidate || '').trim();
  if (raw && raw !== 'MY_APP_URL' && /^https?:\/\//i.test(raw)) {
    return raw.replace(/\/+$/, '');
  }
  return 'https://ais-pre-eipiii3bv2a7z4hjcag4yn-509305420087.europe-west2.run.app';
}

export function buildRouteJsonLd(universeId: UniverseId, rawBaseUrl?: string): Record<string, unknown>[] {
  const baseUrl = resolveBaseUrl(rawBaseUrl);
  const route = getRouteConfigByUniverse(universeId);
  const canonicalUrl = route.path === '/' ? `${baseUrl}/` : `${baseUrl}${route.path}`;
  const personId = `${baseUrl}/#soraya-boua`;
  const websiteId = `${baseUrl}/#website`;

  const personSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId,
    name: 'Soraya Boua',
    alternateName: "BEYOND THE CV — SORAYA'S WORLD",
    jobTitle: 'Business Development & Marketing Digital',
    description: INITIAL_CMS_DATA.profile.intro,
    email: `mailto:${INITIAL_CMS_DATA.profile.email}`,
    url: baseUrl,
    image: `${baseUrl}/src/assets/images/soraya_portrait_1795008927811.jpg`,
    homeLocation: {
      '@type': 'Country',
      name: 'France',
    },
    alumniOf: EDUCATION_TIMELINE.map((edu) => ({
      '@type': 'EducationalOrganization',
      name: edu.institution,
    })),
    knowsLanguage: ['fr-FR', 'en'],
    knowsAbout: [
      'Business Development B2B',
      'Prospection commerciale',
      'Marketing Digital',
      'Social Media Management',
      'Acquisition client',
      'CRM Airtable',
      'Entrepreneuriat',
      'Hospitalité événementielle',
    ],
  };

  const websiteSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    name: "BEYOND THE CV — SORAYA'S WORLD",
    alternateName: 'Portfolio de Soraya Boua',
    url: baseUrl,
    inLanguage: 'fr-FR',
    publisher: { '@id': personId },
  };

  const pageSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': route.schemaType,
    name: route.title,
    description: route.description,
    url: canonicalUrl,
    inLanguage: 'fr-FR',
    isPartOf: { '@id': websiteId },
    mainEntity: { '@id': personId },
  };

  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Accueil',
      item: `${baseUrl}/`,
    },
  ];
  if (route.id !== 'home') {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: route.label,
      item: canonicalUrl,
    });
  }

  const breadcrumbSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };

  const schemas: Record<string, unknown>[] = [websiteSchema, personSchema, pageSchema, breadcrumbSchema];

  if (route.id === 'home' || route.id === 'career' || route.id === 'contact') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: SORAYA_GEO_FAQ.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  if (route.id === 'career') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Expériences professionnelles de Soraya Boua',
      itemListElement: EXPERIENCES.map((exp, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: `${exp.position} chez ${exp.company}`,
        description: exp.summary,
      })),
    });
  }

  if (route.id === 'projects') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Projets entrepreneuriaux de Soraya Boua',
      itemListElement: ENTREPRENEURIAL_PROJECTS.map((proj, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: proj.name,
        description: proj.concept,
      })),
    });
  }

  return schemas;
}

export function buildHeadMetaMarkup(universeId: UniverseId, rawBaseUrl?: string): string {
  const baseUrl = resolveBaseUrl(rawBaseUrl);
  const route = getRouteConfigByUniverse(universeId);
  const canonicalUrl = route.path === '/' ? `${baseUrl}/` : `${baseUrl}${route.path}`;
  const ogImageUrl = route.ogImage.startsWith('http') ? route.ogImage : `${baseUrl}${route.ogImage}`;
  const jsonLd = buildRouteJsonLd(universeId, baseUrl);

  const escapeAttr = (val: string) =>
    val.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return [
    `<title>${escapeAttr(route.title)}</title>`,
    `<meta name="description" content="${escapeAttr(route.description)}" />`,
    `<meta name="keywords" content="${escapeAttr(route.keywords.join(', '))}" />`,
    `<meta name="author" content="Soraya Boua" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />`,
    `<link rel="canonical" href="${escapeAttr(canonicalUrl)}" />`,
    `<meta property="og:locale" content="fr_FR" />`,
    `<meta property="og:type" content="${route.id === 'home' || route.id === 'career' ? 'profile' : 'website'}" />`,
    `<meta property="og:site_name" content="BEYOND THE CV — SORAYA'S WORLD" />`,
    `<meta property="og:title" content="${escapeAttr(route.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(route.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(canonicalUrl)}" />`,
    `<meta property="og:image" content="${escapeAttr(ogImageUrl)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(ogImageUrl)}" />`,
    `<script id="soraya-jsonld" type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  ].join('\n    ');
}

export function buildSitemapXml(rawBaseUrl?: string): string {
  const baseUrl = resolveBaseUrl(rawBaseUrl);
  const today = new Date().toISOString().split('T')[0];
  const urls = UNIVERSE_ROUTES.map((r) => {
    const loc = r.path === '/' ? `${baseUrl}/` : `${baseUrl}${r.path}`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${r.priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function buildRobotsTxt(rawBaseUrl?: string): string {
  const baseUrl = resolveBaseUrl(rawBaseUrl);
  return `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
}

export function buildLlmsTxt(rawBaseUrl?: string): string {
  const baseUrl = resolveBaseUrl(rawBaseUrl);
  const routeLines = UNIVERSE_ROUTES.map((r) => {
    const fullUrl = r.path === '/' ? `${baseUrl}/` : `${baseUrl}${r.path}`;
    return `- [${r.label}](${fullUrl}): ${r.description}`;
  }).join('\n');

  const expLines = EXPERIENCES.map(
    (e) => `- **${e.company} — ${e.position}** (${e.period}, ${e.location}) : ${e.summary}`
  ).join('\n');

  const eduLines = EDUCATION_TIMELINE.map(
    (ed) => `- **${ed.institution}** — ${ed.program} (${ed.specialization})`
  ).join('\n');

  const faqLines = SORAYA_GEO_FAQ.map((f) => `### ${f.question}\n${f.answer}`).join('\n\n');

  return `# BEYOND THE CV — SORAYA'S WORLD

> Portfolio professionnel interactif, journal créatif et univers digital de **Soraya Boua** — orienté **Business Development B2B & Marketing Digital (France)**.

## Identité & Positionnement
- **Nom** : Soraya Boua
- **Spécialité principale** : Business Development B2B, Prospection commerciale, Marketing Digital & Entrepreneuriat (France : Le Mans, Paris, International)
- **Contact professionnel** : sorayalopespro@gmail.com
- **URL officielle** : ${baseUrl}/
- **Langues** : Français (maternelle), Anglais (niveau professionnel / bilingue à confirmer avant diffusion finale)

## Pages prérendues de l'univers
${routeLines}

## Expériences professionnelles clés
${expLines}

## Formation académique
${eduLines}

## Outils & Compétences maîtrisés
- **Commerce & CRM** : Prospection B2B & B2C, phoning intensif (100–150 appels/jour), qualification de leads, négociation, closing, fidélisation (70 % de renouvellement), Airtable, Axonaute, Quicktalk, Way-Plan, M-List.
- **Marketing Digital & Contenu** : Social Media Management, création de contenu Instagram (Reels, Stories), Canva, Shopify, Google Workspace, Excel.

## Réponses synthétiques (GEO / FAQ)
${faqLines}
`;
}
