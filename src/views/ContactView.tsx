import React, { useState } from 'react';
import { Check, Copy, Download, ExternalLink, Mail, PhoneOff, Send } from 'lucide-react';
import { useUniverse } from '../context/UniverseContext';

export function ContactView() {
  const { cmsData, setIsCVModalOpen } = useUniverse();
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Opportunité en Business Development');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const copyEmail = () => {
    navigator.clipboard?.writeText(cmsData.profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 py-14 md:py-20">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Gauche : Coordonnées professionnelles directes */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-medium text-amber-800">Contact &amp; Recrutement</p>
            <h1 className="font-editorial text-4xl md:text-5xl font-semibold text-stone-950">
              Construisons ensemble de beaux projets
            </h1>
            <p className="text-sm md:text-base text-stone-600 leading-relaxed">
              À l’écoute des recruteurs, responsables d’équipes commerciales, agences marketing, entreprises innovantes et partenaires internationaux.
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-stone-200 p-6 space-y-5">
            <div>
              <p className="text-xs text-stone-500">E-mail professionnel</p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <a
                  href={`mailto:${cmsData.profile.email}`}
                  className="font-semibold text-stone-950 hover:underline flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-amber-800" />
                  {cmsData.profile.email}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="px-2.5 py-1.5 text-xs font-medium border border-stone-200 rounded-md hover:bg-stone-50 cursor-pointer inline-flex items-center gap-1"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copied ? 'Copié' : 'Copier'}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500">LinkedIn</p>
                <p className="text-sm font-medium text-stone-900 mt-0.5">Soraya Boua</p>
              </div>
              <a
                href={cmsData.profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border border-stone-300 rounded-lg hover:bg-stone-50"
              >
                Ouvrir LinkedIn
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500">CV professionnel</p>
                <p className="text-sm font-medium text-stone-900 mt-0.5">
                  Version structurée prête au téléchargement
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCVModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Télécharger le CV
              </button>
            </div>

            <div className="pt-4 border-t border-stone-100 text-xs text-stone-500 flex items-center gap-2">
              {cmsData.profile.showPhonePublicly && cmsData.profile.phoneNumber ? (
                <span>Téléphone direct : {cmsData.profile.phoneNumber}</span>
              ) : (
                <>
                  <PhoneOff className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Numéro de téléphone volontairement confidentiel sauf activation explicite par Soraya.
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Droite : Formulaire de contact recruteur / partenaire */}
        <div className="lg:col-span-7 rounded-2xl bg-white border border-stone-200 p-7 md:p-10">
          {sent ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h2 className="font-editorial text-3xl font-semibold text-stone-950">
                Message préparé pour Soraya
              </h2>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Merci {name}. Vous pouvez envoyer directement votre message à{' '}
                <a href={`mailto:${cmsData.profile.email}`} className="underline font-medium">
                  {cmsData.profile.email}
                </a>{' '}
                via votre messagerie habituelle.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <a
                  href={`mailto:${cmsData.profile.email}?subject=${encodeURIComponent(
                    `[${topic}] ${name} (${company || 'Prise de contact'})`
                  )}&body=${encodeURIComponent(message)}`}
                  className="px-5 py-2.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                >
                  Ouvrir dans la messagerie
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setName('');
                    setCompany('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="px-4 py-2.5 text-xs font-medium border border-stone-300 rounded-lg hover:bg-stone-50 cursor-pointer"
                >
                  Rédiger un autre message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="font-editorial text-3xl font-semibold text-stone-950">
                  Prendre contact directement
                </h2>
                <p className="text-sm text-stone-500 mt-1">
                  Écrivez à propos d’un poste en Business Development, d’une mission Marketing ou d’une collaboration freelance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block text-xs font-medium text-stone-600">
                  Votre nom
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Prénom et Nom"
                    className="mt-1.5 w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900"
                  />
                </label>
                <label className="block text-xs font-medium text-stone-600">
                  Entreprise / Agence
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Organisation"
                    className="mt-1.5 w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block text-xs font-medium text-stone-600">
                  Adresse e-mail
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@entreprise.fr"
                    className="mt-1.5 w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900"
                  />
                </label>
                <label className="block text-xs font-medium text-stone-600">
                  Objet
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 bg-white"
                  >
                    <option>Opportunité en Business Development</option>
                    <option>Poste en Marketing Digital</option>
                    <option>Collaboration Freelance Social Media</option>
                    <option>Partenariat international / Événementiel</option>
                    <option>Demande générale</option>
                  </select>
                </label>
              </div>

              <label className="block text-xs font-medium text-stone-600">
                Message
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Précisez l’opportunité, vos objectifs ou vos disponibilités pour un échange..."
                  className="mt-1.5 w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900"
                />
              </label>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Envoyer le message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
