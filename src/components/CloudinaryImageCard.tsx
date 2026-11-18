import React, { useMemo, useState } from 'react';
import { Check, ImagePlus, Link2, Maximize2, X } from 'lucide-react';
import { useUniverse } from '../context/UniverseContext';
import { CLOUDINARY_SLOT_DEFINITIONS } from '../data/mediaConfig';

interface CloudinaryImageCardProps {
  slotKey: string;
  titleOverride?: string;
  descriptionOverride?: string;
  aspectClass?: string;
  objectFit?: 'cover' | 'contain';
  dark?: boolean;
  accentColor?: string;
  className?: string;
}

export function CloudinaryImageCard({
  slotKey,
  titleOverride,
  descriptionOverride,
  aspectClass = 'aspect-[16/10]',
  objectFit = 'cover',
  dark = false,
  accentColor = '#D4A359',
  className = '',
}: CloudinaryImageCardProps) {
  const { getMediaUrl, updateCloudinaryUrl, setLightboxItem, openCMSAt } = useUniverse();
  const [imgError, setImgError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftUrl, setDraftUrl] = useState('');

  const slotMeta = useMemo(
    () => CLOUDINARY_SLOT_DEFINITIONS.find((s) => s.key === slotKey),
    [slotKey]
  );

  const url = getMediaUrl(slotKey);
  const hasValidImage = Boolean(url && !imgError);
  const label = titleOverride || slotMeta?.label || slotKey;
  const desc = descriptionOverride || slotMeta?.description || 'Emplacement visuel Cloudinary';

  const openEditor = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDraftUrl(url);
    setEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setImgError(false);
    updateCloudinaryUrl(slotKey, draftUrl);
    setEditing(false);
  };

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden border transition-colors ${
        dark
          ? 'bg-white/[0.03] border-white/15 hover:border-white/30 text-white'
          : 'bg-white border-stone-200 hover:border-stone-400 text-stone-900'
      } ${className}`}
    >
      <div
        className={`relative w-full ${aspectClass} overflow-hidden flex items-center justify-center ${
          dark ? 'bg-black/30' : 'bg-stone-100'
        }`}
      >
        {hasValidImage ? (
          <>
            <img
              src={url}
              alt={label}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className={`w-full h-full ${
                objectFit === 'contain' ? 'object-contain p-4' : 'object-cover'
              } transition-transform duration-500 group-hover:scale-[1.02]`}
            />
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                aria-label={`Agrandir ${label}`}
                onClick={() =>
                  setLightboxItem({
                    id: slotKey,
                    section: slotMeta?.group || 'portfolio',
                    mediaType: 'image',
                    src: url,
                    title: label,
                    caption: desc,
                    date: 'Visuel Cloudinary',
                    category: slotMeta?.group || 'Média',
                  })
                }
                className="p-2 rounded-lg bg-black/70 text-white hover:bg-black cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                aria-label={`Modifier l’URL pour ${label}`}
                onClick={openEditor}
                className="px-2.5 py-1.5 rounded-lg bg-black/70 text-white hover:bg-black text-[11px] font-medium cursor-pointer inline-flex items-center gap-1"
              >
                <Link2 className="w-3 h-3" />
                URL
              </button>
            </div>
          </>
        ) : (
          <div className="p-5 text-center space-y-2.5 max-w-xs">
            <div
              className="w-10 h-10 rounded-full mx-auto flex items-center justify-center border"
              style={{
                borderColor: `${accentColor}55`,
                backgroundColor: `${accentColor}1A`,
                color: accentColor,
              }}
            >
              <ImagePlus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold">{label}</p>
              <p className={`text-[11px] mt-0.5 ${dark ? 'text-stone-400' : 'text-stone-500'}`}>
                {desc}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={openEditor}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white cursor-pointer transition-opacity hover:opacity-90"
                style={{ backgroundColor: accentColor }}
              >
                Coller une URL Cloudinary
              </button>
              <button
                type="button"
                onClick={() => openCMSAt('cloudinary')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border cursor-pointer ${
                  dark
                    ? 'border-white/20 text-stone-300 hover:bg-white/10'
                    : 'border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                Studio
              </button>
            </div>
          </div>
        )}

        {editing && (
          <form
            onSubmit={handleSave}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 z-20 bg-stone-950/95 text-white p-4 flex flex-col justify-center gap-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-300 truncate">{label}</span>
              <button
                type="button"
                aria-label="Fermer l’édition d’URL"
                onClick={() => setEditing(false)}
                className="p-1 rounded hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="url"
              value={draftUrl}
              onChange={(e) => setDraftUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/..."
              className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-xs text-white placeholder:text-stone-400"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-400 text-stone-950 text-xs font-semibold hover:bg-amber-300 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Enregistrer
              </button>
              {url && (
                <button
                  type="button"
                  onClick={() => {
                    updateCloudinaryUrl(slotKey, '');
                    setDraftUrl('');
                    setEditing(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-xs text-stone-300 hover:bg-white/20 cursor-pointer"
                >
                  Effacer
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      <div
        className={`px-4 py-3 border-t flex items-center justify-between gap-2 ${
          dark ? 'border-white/10' : 'border-stone-200/80'
        }`}
      >
        <div className="min-w-0">
          <p className="text-xs font-semibold truncate">{label}</p>
          <p className={`text-[11px] truncate ${dark ? 'text-stone-400' : 'text-stone-500'}`}>
            {desc}
          </p>
        </div>
        {hasValidImage && (
          <button
            type="button"
            onClick={openEditor}
            className={`text-[11px] underline shrink-0 cursor-pointer ${
              dark ? 'text-stone-300 hover:text-white' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Modifier
          </button>
        )}
      </div>
    </div>
  );
}
