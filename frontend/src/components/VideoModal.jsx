import React from 'react';
import { X, PlayCircle, Flame } from 'lucide-react';

export default function VideoModal({ isOpen, onClose, videoUrl, title, durationText = "7-8 saniyəlik nümayiş" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">{title || "Məşq Hərəkətinin İcrası"}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" /> {durationText}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <video
            src={videoUrl}
            controls
            autoPlay
            loop
            playsInline
            className="w-full h-full object-contain"
          >
            Sizin brauzeriniz video formatını dəstəkləmir.
          </video>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Qeyd: Hərəkəti tələsmədən və düzgün nəfəs alaraq təkrar edin.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-xs transition-colors"
          >
            Bağla
          </button>
        </div>
      </div>
    </div>
  );
}
