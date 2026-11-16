'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ScreenshotGalleryProps {
  screenshots: string[];
  projectName: string;
}

export default function ScreenshotGallery({ screenshots, projectName }: ScreenshotGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + screenshots.length) % screenshots.length : null));
  const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % screenshots.length : null));

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {screenshots.map((src, i) => (
          <button
            key={i}
            onClick={() => openLightbox(i)}
            className="relative h-32 sm:h-40 rounded-lg overflow-hidden border border-border hover:border-accent/50 transition-all duration-200 group"
          >
            <Image
              src={src}
              alt={`${projectName} screenshot ${i + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-lg bg-surface border border-border text-white hover:border-accent/50 z-10"
            onClick={closeLightbox}
          >
            <X size={20} />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-lg bg-surface border border-border text-white hover:border-accent/50 z-10"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft size={20} />
          </button>

          <div
            className="relative max-w-5xl w-full max-h-[80vh] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={screenshots[lightboxIndex]}
              alt={`${projectName} screenshot ${lightboxIndex + 1}`}
              width={1200}
              height={700}
              className="w-full h-auto object-contain"
            />
          </div>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-lg bg-surface border border-border text-white hover:border-accent/50 z-10"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {screenshots.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${i === lightboxIndex ? 'bg-accent w-4' : 'bg-border'}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
