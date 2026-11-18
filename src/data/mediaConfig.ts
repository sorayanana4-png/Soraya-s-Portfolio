export type CloudinarySlotGroup =
  | 'Portrait & Identité'
  | 'PermiFast'
  | 'LGD Paris'
  | 'Clean & Shop'
  | '24 Hours of Le Mans'
  | 'Mahola & La Ville du Mans'
  | 'The Creative Studio (Freelance)'
  | 'Carnets de Voyage'
  | 'Musique & Concerts'
  | 'Ma Cuisine';

export interface CloudinarySlotDefinition {
  key: string;
  group: CloudinarySlotGroup;
  label: string;
  description: string;
  defaultUrl: string;
}

export const CLOUDINARY_SLOT_DEFINITIONS: CloudinarySlotDefinition[] = [
  // Portrait
  {
    key: 'portrait.main',
    group: 'Portrait & Identité',
    label: 'Portrait principal de Soraya Boua',
    description: 'Photographie éditoriale d’accueil',
    defaultUrl: '/src/assets/images/soraya_portrait_1795008927811.jpg',
  },

  // PermiFast (visuel officiel pré-rempli + emplacements personnels)
  {
    key: 'permifast.logo',
    group: 'PermiFast',
    label: 'Aperçu officiel PermiFast',
    description: 'Visuel officiel issu de permifast.com (remplaçable par un logo Cloudinary)',
    defaultUrl: 'https://www.permifast.com/fr/opengraph-image',
  },
  {
    key: 'permifast.drivingSchoolPhoto',
    group: 'PermiFast',
    label: 'Environnement Auto-École partenaire',
    description: 'Véhicule d’apprentissage et conduite en ville',
    defaultUrl: '/src/assets/images/driving_school_car_1795012574312.jpg',
  },
  {
    key: 'permifast.partnerProfile',
    group: 'PermiFast',
    label: 'Photographie ou capture personnelle PermiFast',
    description: 'Emplacement personnel Cloudinary pour vos captures ou photos terrain',
    defaultUrl: '',
  },

  // LGD Paris
  {
    key: 'lgd.logo',
    group: 'LGD Paris',
    label: 'Logo officiel LGD Paris',
    description: 'Emplacement Cloudinary pour le logo LGD Paris',
    defaultUrl: '',
  },
  {
    key: 'lgd.airportEnvironment',
    group: 'LGD Paris',
    label: 'Mobilité Aéroport Paris-Orly & Chauffeur',
    description: 'Berline de transport avec chauffeur au terminal aéroportuaire',
    defaultUrl: '/src/assets/images/airport_executive_car_1795012575023.jpg',
  },
  {
    key: 'lgd.vehicleFleet',
    group: 'LGD Paris',
    label: 'Flotte de transport executive',
    description: 'Berline noire haut de gamme pour transferts et déplacements',
    defaultUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/2026_Mercedes-Benz_V223_IMG_7632.jpg/960px-2026_Mercedes-Benz_V223_IMG_7632.jpg',
  },

  // Clean & Shop
  {
    key: 'cleanAndShop.logo',
    group: 'Clean & Shop',
    label: 'Logo Clean & Shop',
    description: 'Emplacement personnel Cloudinary pour le logo Clean & Shop',
    defaultUrl: '',
  },
  {
    key: 'cleanAndShop.customizedSneakers',
    group: 'Clean & Shop',
    label: 'Atelier de personnalisation Sneakers',
    description: 'Ambiance d’atelier streetwear, pinceaux et peinture sur cuir',
    defaultUrl: '/src/assets/images/sneaker_artisan_bench_1795012547455.jpg',
  },
  {
    key: 'cleanAndShop.beforeAfter',
    group: 'Clean & Shop',
    label: 'Créations personnelles Clean & Shop',
    description: 'Emplacement personnel Cloudinary pour vos réalisations sneakers & maillots',
    defaultUrl: '',
  },

  // 24 Hours of Le Mans
  {
    key: 'lemans.circuit',
    group: '24 Hours of Le Mans',
    label: 'Circuit des 24 Heures du Mans — Ambiance crépuscule',
    description: 'Atmosphère d’endurance sur le Circuit de la Sarthe',
    defaultUrl: '/src/assets/images/lemans_motorsport_1795008928368.jpg',
  },
  {
    key: 'lemans.ford',
    group: '24 Hours of Le Mans',
    label: 'Environnement automobile Ford au Mans',
    description: 'Univers automobile associé à Ford lors de l’épreuve d’endurance',
    defaultUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Ford_GT_2018_and_Ford_GT_1968_at_Legendy_2019_in_Prague_%28cropped%29.jpg/960px-Ford_GT_2018_and_Ford_GT_1968_at_Legendy_2019_in_Prague_%28cropped%29.jpg',
  },
  {
    key: 'lemans.alpine',
    group: '24 Hours of Le Mans',
    label: 'Environnement automobile Alpine Endurance',
    description: 'Prototype d’endurance Alpine en piste',
    defaultUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/2026_6_Hours_of_Spa-Francorchamps_Alpine_Endurance_Team_Alpine_A424_No.36_%28DSC01584%29.jpg/960px-2026_6_Hours_of_Spa-Francorchamps_Alpine_Endurance_Team_Alpine_A424_No.36_%28DSC01584%29.jpg',
  },
  {
    key: 'lemans.paddock',
    group: '24 Hours of Le Mans',
    label: 'Stands & Pit Lane du Mans',
    description: 'Atmosphère technique dans la voie des stands',
    defaultUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Lemans.jpg/960px-Lemans.jpg',
  },
  {
    key: 'lemans.eventPhoto',
    group: '24 Hours of Le Mans',
    label: 'Photo personnelle d’accueil VIP au Mans',
    description: 'Emplacement personnel Cloudinary pour vos photos sur site',
    defaultUrl: '',
  },

  // Mahola & La Ville du Mans
  {
    key: 'mahola.logo',
    group: 'Mahola & La Ville du Mans',
    label: 'Photo ou logo personnel Mahola',
    description: 'Emplacement personnel Cloudinary pour votre mission d’accueil VIP',
    defaultUrl: '',
  },
  {
    key: 'villeDuMans.ehpad',
    group: 'Mahola & La Ville du Mans',
    label: 'Environnement d’accueil & service en EHPAD',
    description: 'Espace de restauration chaleureux et soigné en résidence senior',
    defaultUrl: '/src/assets/images/care_residence_dining_1795012576037.jpg',
  },

  // Freelance Creative Studio
  {
    key: 'freelance.restaurantSocial',
    group: 'The Creative Studio (Freelance)',
    label: 'Direction artistique Restauration (Illustration)',
    description: 'Ambiance culinaire photographiée pour réseaux sociaux de restaurants',
    defaultUrl: '/src/assets/images/bistro_food_photo_1795012575623.jpg',
  },
  {
    key: 'freelance.beautySalon',
    group: 'The Creative Studio (Freelance)',
    label: 'Direction artistique Institut de Beauté (Illustration)',
    description: 'Esthétique lumineuse de salon de beauté et mise en scène éditoriale',
    defaultUrl: '/src/assets/images/beauty_salon_ambiance_1795012547049.jpg',
  },
  {
    key: 'freelance.canvaDesign',
    group: 'The Creative Studio (Freelance)',
    label: 'Bureau de création digitale & contenus Canva',
    description: 'Espace de direction créative, nuanciers et création mobile',
    defaultUrl: '/src/assets/images/creative_studio_workspace_1795012547029.jpg',
  },
  {
    key: 'freelance.personalWork',
    group: 'The Creative Studio (Freelance)',
    label: 'Réalisation personnelle (Cloudinary)',
    description: 'Emplacement personnel pour vos créations Canva ou posts non confidentiels',
    defaultUrl: '',
  },

  // Carnets de Voyage
  {
    key: 'travel.coteIvoireHero',
    group: 'Carnets de Voyage',
    label: "Côte d'Ivoire — Couverture atmosphérique",
    description: 'Lumière dorée et littoral atlantique ivoirien',
    defaultUrl: '/src/assets/images/travel_cote_ivoire_1795008929478.jpg',
  },
  {
    key: 'travel.coteIvoirePersonal',
    group: 'Carnets de Voyage',
    label: "Côte d'Ivoire — Souvenir personnel (Cloudinary)",
    description: 'Votre photographie personnelle de Côte d’Ivoire',
    defaultUrl: '',
  },
  {
    key: 'travel.maltaHero',
    group: 'Carnets de Voyage',
    label: 'Malte — Couverture atmosphérique',
    description: 'Calanques turquoise et pierre dorée méditerranéenne',
    defaultUrl: '/src/assets/images/travel_malta_coast_1795008929787.jpg',
  },
  {
    key: 'travel.maltaPersonal',
    group: 'Carnets de Voyage',
    label: 'Malte — Souvenir personnel (Cloudinary)',
    description: 'Votre photographie personnelle de Malte',
    defaultUrl: '',
  },

  // Musique & Concerts
  {
    key: 'music.studioHero',
    group: 'Musique & Concerts',
    label: 'Studio R&B & Vinyles',
    description: 'Ambiance studio vocal et vinyles',
    defaultUrl: '/src/assets/images/music_rnb_studio_1795008930458.jpg',
  },
  {
    key: 'music.concertBeyonce',
    group: 'Musique & Concerts',
    label: 'Concert Beyoncé — Souvenir personnel',
    description: 'Emplacement Cloudinary pour vos photos ou vidéos de concert',
    defaultUrl: '',
  },
  {
    key: 'music.concertNicki',
    group: 'Musique & Concerts',
    label: 'Concert Nicki Minaj — Souvenir personnel',
    description: 'Emplacement Cloudinary pour vos photos ou vidéos de concert',
    defaultUrl: '',
  },
  {
    key: 'music.concertFlo',
    group: 'Musique & Concerts',
    label: 'Concert FLO — Souvenir personnel',
    description: 'Emplacement Cloudinary pour vos photos ou vidéos de concert',
    defaultUrl: '',
  },

  // Ma Cuisine
  {
    key: 'kitchen.featuredDish',
    group: 'Ma Cuisine',
    label: 'Plat fait maison par Soraya (Cloudinary)',
    description: 'Ajoutez ici une photo personnelle d’un plat que vous avez préparé',
    defaultUrl: '',
  },
];

export const INITIAL_CLOUDINARY_URLS: Record<string, string> = Object.fromEntries(
  CLOUDINARY_SLOT_DEFINITIONS.map((slot) => [slot.key, slot.defaultUrl])
);
