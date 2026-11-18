import React from 'react';
import { Sun } from 'lucide-react';
import { useUniverse } from '../context/UniverseContext';
import { MediaGallery } from '../components/MediaGallery';

export function LifestyleView() {
  const { cmsData } = useUniverse();

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#233127] pb-24">
      {/* En-tête Sauge & Lumière naturelle */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 pt-12 pb-12 border-b border-[#DCE2D7]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-medium text-[#5C7462]">
              <Sun className="w-4 h-4" />
              <span>08 · Lifestyle &amp; Équilibre · Univers personnel</span>
            </div>
            <h1 className="font-editorial text-4xl md:text-6xl font-semibold text-[#1B261E]">
              Équilibre, énergie &amp; inspirations du quotidien
            </h1>
            <p className="text-base text-[#445749] leading-relaxed max-w-2xl">
              Au-delà des objectifs commerciaux et des présentations clients, Soraya cultive son énergie par le mouvement, le développement personnel, le bien-être conscient et la curiosité du quotidien — gardant un ancrage solide et authentique.
            </p>
          </div>
          <div className="lg:col-span-4 rounded-2xl bg-[#E3EBE4] p-6 border border-[#CBD7CD] text-sm text-[#2D3E32]">
            <p className="font-editorial text-2xl font-semibold">Ancrée &amp; tournée vers l’avenir</p>
            <p className="mt-2 leading-relaxed opacity-85">
              Un regard sincère sur le sport, l’état d’esprit et les objectifs personnels, dans le plein respect de la vie privée.
            </p>
          </div>
        </div>
      </section>

      {/* Quatre piliers éditoriaux */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 py-14 space-y-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cmsData.lifestylePillars.map((pillar, idx) => (
            <article
              key={pillar.id}
              className="rounded-3xl bg-white border border-[#DCE2D7] p-7 md:p-9 space-y-4"
            >
              <div className="flex items-center justify-between text-xs text-[#5C7462]">
                <span className="font-tabular">0{idx + 1}</span>
                <span>{pillar.focus}</span>
              </div>
              <h2 className="font-editorial text-3xl font-semibold text-[#1B261E]">
                {pillar.title}
              </h2>
              <p className="text-sm md:text-base text-[#3E5043] leading-relaxed">
                {pillar.description}
              </p>
              <p className="text-xs text-[#647A6A] pt-3 border-t border-[#ECEFE9]">
                {pillar.personalNote}
              </p>
            </article>
          ))}
        </div>

        {/* Galerie photo & vidéo Lifestyle */}
        <MediaGallery
          sectionKey="lifestyle"
          heading="Journal photo Lifestyle &amp; Bien-être"
          subheading="Importez vos photographies et moments personnels de sport, de bien-être et d’inspiration."
          accentColor="#5C7462"
          defaultCategory="Lifestyle"
        />
      </section>
    </div>
  );
}
