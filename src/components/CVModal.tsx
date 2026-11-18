import React from 'react';
import { Download, Printer, X } from 'lucide-react';
import { EDUCATION_TIMELINE, EXPERIENCES } from '../data/sorayaData';
import { useUniverse } from '../context/UniverseContext';

export function CVModal() {
  const { isCVModalOpen, setIsCVModalOpen, cmsData } = useUniverse();

  if (!isCVModalOpen) return null;

  const handleDownloadHtmlCV = () => {
    const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<title>CV — Soraya Boua</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #1c1917; max-width: 820px; margin: 40px auto; padding: 0 24px; line-height: 1.55; }
  h1 { font-size: 32px; margin: 0 0 4px; }
  .subtitle { font-size: 15px; color: #57534e; margin-bottom: 16px; }
  .section { margin-top: 28px; border-top: 1px solid #e7e5e4; padding-top: 16px; }
  h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #78716c; margin-bottom: 12px; }
  .exp { margin-bottom: 18px; }
  .exp-head { display: flex; justify-content: space-between; font-weight: 600; }
  .meta { font-size: 13px; color: #57534e; margin-bottom: 6px; }
  ul { margin: 6px 0 0 18px; padding: 0; font-size: 14px; }
</style>
</head>
<body>
  <h1>${cmsData.profile.name}</h1>
  <div class="subtitle">${cmsData.profile.headline} · ${cmsData.profile.email}</div>
  <p>${cmsData.profile.intro}</p>
  <div class="section">
    <h2>Expériences professionnelles</h2>
    ${EXPERIENCES.map(
      (e) => `<div class="exp">
        <div class="exp-head"><span>${e.position} — ${e.company}</span><span>${e.period}</span></div>
        <div class="meta">${e.industry} · ${e.location}${e.dateNote ? ` · ${e.dateNote}` : ''}</div>
        <ul>${e.responsibilities.slice(0, 6).map((r) => `<li>${r}</li>`).join('')}</ul>
      </div>`
    ).join('')}
  </div>
  <div class="section">
    <h2>Formation & Diplômes</h2>
    ${EDUCATION_TIMELINE.map(
      (ed) => `<div class="exp">
        <div class="exp-head"><span>${ed.program}</span><span>${ed.institution}</span></div>
        <div class="meta">${ed.specialization}</div>
      </div>`
    ).join('')}
  </div>
  <div class="section">
    <h2>Langues & Outils</h2>
    <p><strong>Langues :</strong> Français (Langue maternelle), Anglais (${cmsData.profile.englishStatusNote})</p>
    <p><strong>Outils :</strong> Airtable, Excel, Canva, Google Workspace, M-List, Axonaute, Quicktalk, Way-Plan</p>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Soraya_Boua_CV_FR.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setIsCVModalOpen(false)}
    >
      <div
        className="bg-[#FAF8F5] text-stone-900 rounded-2xl max-w-3xl w-full max-h-[88vh] overflow-y-auto border border-stone-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-editorial text-2xl font-semibold">Curriculum Vitae — Soraya Boua</h2>
            <p className="text-xs text-stone-500">{cmsData.profile.headline}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadHtmlCV}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Download className="w-4 h-4" />
              Télécharger le CV
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium border border-stone-300 bg-white rounded-lg hover:bg-stone-50 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Printer className="w-4 h-4" />
              Imprimer / PDF
            </button>
            <button
              type="button"
              aria-label="Fermer l’aperçu du CV"
              onClick={() => setIsCVModalOpen(false)}
              className="p-2 rounded-lg hover:bg-stone-200/70 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="border-b border-stone-200 pb-6">
            <h3 className="font-editorial text-3xl font-semibold">{cmsData.profile.name}</h3>
            <p className="text-sm text-stone-600 mt-1">
              {cmsData.profile.email} · {cmsData.profile.headline}
            </p>
            <p className="text-sm text-stone-700 mt-4 leading-relaxed">{cmsData.profile.intro}</p>
          </div>

          <div className="space-y-5">
            <h4 className="text-xs font-semibold tracking-wider text-stone-500">
              EXPÉRIENCES PROFESSIONNELLES
            </h4>
            {EXPERIENCES.map((exp) => (
              <div key={exp.id} className="pb-5 border-b border-stone-200/70 last:border-b-0">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <p className="font-semibold text-base text-stone-900">
                    {exp.position} — {exp.company}
                  </p>
                  <p className="font-tabular text-xs text-stone-500">{exp.period}</p>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  {exp.industry} · {exp.location}
                  {exp.dateNote ? ` · ${exp.dateNote}` : ''}
                </p>
                <ul className="mt-2.5 space-y-1 text-sm text-stone-700 list-disc pl-5">
                  {exp.responsibilities.slice(0, 5).map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-wider text-stone-500">
              FORMATION &amp; DIPLÔMES
            </h4>
            {EDUCATION_TIMELINE.map((ed) => (
              <div key={ed.id} className="pb-3">
                <p className="font-semibold text-stone-900">
                  {ed.program} — {ed.institution}
                </p>
                <p className="text-sm text-stone-600">{ed.specialization}</p>
              </div>
            ))}
            <p className="text-xs text-stone-500 italic">{cmsData.profile.educationNote}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-200">
            <div>
              <h4 className="text-xs font-semibold tracking-wider text-stone-500 mb-2">
                LANGUES
              </h4>
              <p className="text-sm text-stone-800">Français — Langue maternelle</p>
              <p className="text-sm text-stone-800 mt-1">
                Anglais — {cmsData.profile.englishStatusNote}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold tracking-wider text-stone-500 mb-2">
                OUTILS &amp; ENVIRONNEMENTS
              </h4>
              <p className="text-sm text-stone-700">
                Airtable, Excel, Canva, Google Workspace, M-List, Axonaute, Quicktalk, Way-Plan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
