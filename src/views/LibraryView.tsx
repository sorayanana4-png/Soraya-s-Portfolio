import React, { useState } from 'react';
import { BookOpen, Plus, Quote } from 'lucide-react';
import { useUniverse } from '../context/UniverseContext';

export function LibraryView() {
  const { cmsData, addBook } = useUniverse();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [theme, setTheme] = useState('');
  const [quote, setQuote] = useState('');
  const [reflection, setReflection] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addBook({
      title: title.trim(),
      author: author.trim() || 'Auteur à préciser',
      theme: theme.trim() || 'Inspiration & Idées',
      quote: quote.trim(),
      reflection: reflection.trim() || 'Réflexion de lecture personnelle.',
      status: 'Coup de cœur',
    });
    setTitle('');
    setAuthor('');
    setTheme('');
    setQuote('');
    setReflection('');
    setShowForm(false);
  };

  return (
    <div
      className="min-h-screen bg-[#FBF7F0] text-[#3A2318] pb-24"
      style={{
        backgroundImage:
          'radial-gradient(circle at 85% 10%, rgba(184, 93, 59, 0.09), transparent 45%), radial-gradient(circle at 10% 80%, rgba(74, 46, 32, 0.05), transparent 45%)',
      }}
    >
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 pt-12 pb-10 border-b border-[#E3D5C3]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-medium text-[#B85D3B]">
              <BookOpen className="w-4 h-4" />
              <span>06 · Livres &amp; Inspiration · Ma Bibliothèque</span>
            </div>
            <h1 className="font-editorial text-4xl md:text-6xl font-semibold text-[#2E1A11]">
              Une bibliothèque éditoriale contemporaine
            </h1>
            <p className="text-base text-[#5E4032] leading-relaxed">
              Ouvrages marquants, plumes inspirantes, citations choisies et réflexions personnelles qui nourrissent la curiosité, l’art de convaincre et la vision entrepreneuriale de Soraya.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold bg-[#4A2E20] text-[#FBF7F0] rounded-lg hover:bg-[#3A2318] cursor-pointer whitespace-nowrap shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Fermer le formulaire' : 'Ajouter un livre ou une réflexion'}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl bg-[#EFE5D8] border border-[#D8C5AE] p-6 md:p-8 space-y-4"
          >
            <h2 className="font-editorial text-2xl font-semibold">
              Ajouter un ouvrage ou une citation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre du livre"
                className="rounded-lg border border-[#D1BDA5] bg-[#FBF7F0] px-3.5 py-2.5 text-sm"
              />
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nom de l’auteur(e)"
                className="rounded-lg border border-[#D1BDA5] bg-[#FBF7F0] px-3.5 py-2.5 text-sm"
              />
              <input
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Thème (ex. Leadership, Rhétorique)"
                className="rounded-lg border border-[#D1BDA5] bg-[#FBF7F0] px-3.5 py-2.5 text-sm"
              />
            </div>
            <input
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Citation marquante extraite de l’ouvrage"
              className="w-full rounded-lg border border-[#D1BDA5] bg-[#FBF7F0] px-3.5 py-2.5 text-sm"
            />
            <textarea
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Votre réflexion personnelle, vos idées et enseignements..."
              className="w-full rounded-lg border border-[#D1BDA5] bg-[#FBF7F0] px-3.5 py-2.5 text-sm"
            />
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold bg-[#B85D3B] text-white rounded-lg hover:bg-[#9E4C2E] cursor-pointer"
            >
              Enregistrer dans ma bibliothèque
            </button>
          </form>
        )}
      </section>

      {/* Rayonnages éditoriaux */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 py-14 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cmsData.books.map((book, idx) => (
            <article
              key={book.id}
              className="rounded-2xl bg-[#F4ECE0] border border-[#E2D2BE] p-7 md:p-9 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#8A5A44]">
                  <span>
                    0{idx + 1} · {book.status}
                  </span>
                  <span>{book.theme}</span>
                </div>

                <div>
                  <h2 className="font-editorial text-3xl font-semibold text-[#2E1A11]">
                    {book.title}
                  </h2>
                  <p className="text-sm text-[#6E4D3B] mt-0.5">par {book.author}</p>
                </div>

                {book.quote && (
                  <blockquote className="p-5 rounded-xl bg-[#FBF7F0] border border-[#E5D7C6] space-y-2">
                    <Quote className="w-4 h-4 text-[#B85D3B]" />
                    <p className="font-editorial text-xl italic text-[#3A2318] leading-snug">
                      {book.quote}
                    </p>
                  </blockquote>
                )}
              </div>

              <div className="pt-4 border-t border-[#E2D2BE]">
                <p className="text-xs font-semibold text-[#8A5A44] mb-1">Réflexion personnelle</p>
                <p className="text-sm text-[#4D3224] leading-relaxed">{book.reflection}</p>
              </div>
            </article>
          ))}

          {/* Carte d'ajout rapide */}
          <div className="rounded-2xl border border-dashed border-[#C7B097] bg-[#FBF7F0]/70 p-7 md:p-9 flex flex-col justify-center items-start space-y-4">
            <p className="text-xs font-medium text-[#B85D3B]">Enrichir votre bibliothèque</p>
            <h3 className="font-editorial text-3xl font-semibold text-[#2E1A11]">
              Chaque lecture laisse une empreinte
            </h3>
            <p className="text-sm text-[#5E4032] leading-relaxed max-w-md">
              La bibliothèque de Soraya évolue au fil de son parcours — ajoutez ici vos romans préférés, essais, livres sur la communication ou citations marquantes sans toucher au code.
            </p>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="px-4 py-2 text-xs font-semibold border border-[#4A2E20] text-[#4A2E20] rounded-lg hover:bg-[#4A2E20] hover:text-white transition-colors cursor-pointer"
            >
              + Ajouter un nouveau titre
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
