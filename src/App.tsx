import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { UniverseProvider, useUniverse } from './context/UniverseContext';
import { TopNav } from './components/TopNav';
import { MediaLightbox } from './components/MediaGallery';
import { CVModal } from './components/CVModal';
import { ContentStudioModal } from './components/ContentStudioModal';
import { HomeView } from './views/HomeView';
import { CareerView } from './views/CareerView';
import { ProjectsView } from './views/ProjectsView';
import { TravelView } from './views/TravelView';
import { CinemaView } from './views/CinemaView';
import { MusicView } from './views/MusicView';
import { LibraryView } from './views/LibraryView';
import { KitchenView } from './views/KitchenView';
import { LifestyleView } from './views/LifestyleView';
import { ContactView } from './views/ContactView';

import { getPathForUniverse } from './seo/seoConfig';
import { UniverseId } from './types/universe';

function UniverseStage() {
  const { activeUniverse, setActiveUniverse, openCMSAt } = useUniverse();
  const isDarkUniverse = activeUniverse === 'cinema' || activeUniverse === 'music';

  const renderUniverse = () => {
    switch (activeUniverse) {
      case 'career':
        return <CareerView />;
      case 'projects':
        return <ProjectsView />;
      case 'travel':
        return <TravelView />;
      case 'cinema':
        return <CinemaView />;
      case 'music':
        return <MusicView />;
      case 'library':
        return <LibraryView />;
      case 'kitchen':
        return <KitchenView />;
      case 'lifestyle':
        return <LifestyleView />;
      case 'contact':
        return <ContactView />;
      case 'home':
      default:
        return <HomeView />;
    }
  };

  const handleNavLink = (e: React.MouseEvent<HTMLAnchorElement>, id: UniverseId) => {
    e.preventDefault();
    setActiveUniverse(id);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeUniverse}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {renderUniverse()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer
        className={`border-t text-xs py-10 transition-colors ${
          isDarkUniverse
            ? 'bg-[#09090D] border-white/10 text-stone-400'
            : 'bg-[#F4F0EA] border-stone-200 text-stone-600'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className={`font-editorial text-lg font-semibold ${isDarkUniverse ? 'text-white' : 'text-stone-900'}`}>
              BEYOND THE CV — SORAYA&apos;S WORLD
            </p>
            <p className="mt-0.5">Plus qu’un profil. Tout un univers. · Soraya Boua</p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <a
              href={getPathForUniverse('home')}
              onClick={(e) => handleNavLink(e, 'home')}
              className="hover:underline cursor-pointer"
            >
              Accueil
            </a>
            <a
              href={getPathForUniverse('career')}
              onClick={(e) => handleNavLink(e, 'career')}
              className="hover:underline cursor-pointer"
            >
              Parcours
            </a>
            <a
              href={getPathForUniverse('projects')}
              onClick={(e) => handleNavLink(e, 'projects')}
              className="hover:underline cursor-pointer"
            >
              Projets
            </a>
            <button
              type="button"
              onClick={() => openCMSAt('media')}
              className="hover:underline cursor-pointer"
            >
              Studio de contenu
            </button>
            <a
              href={getPathForUniverse('contact')}
              onClick={(e) => handleNavLink(e, 'contact')}
              className="hover:underline cursor-pointer font-semibold"
            >
              sorayalopespro@gmail.com
            </a>
          </div>
        </div>
      </footer>

      <MediaLightbox />
      <CVModal />
      <ContentStudioModal />
    </div>
  );
}

export function App({ initialUniverse }: { initialUniverse?: UniverseId }) {
  return (
    <UniverseProvider initialUniverse={initialUniverse}>
      <UniverseStage />
    </UniverseProvider>
  );
}

export default App;
