import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Star, Play, Dumbbell } from 'lucide-react';
import VideoModal from './VideoModal';
import { useLanguage } from '../context/LanguageContext';

export default function ExerciseCard({ exercise }) {
  const { t } = useLanguage();
  const [videoOpen, setVideoOpen] = useState(false);

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Intermediate':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Advanced':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <>
      <div className="group relative bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 flex flex-col">
        {/* Thumbnail Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-950">
          <img
            src={exercise.thumbnailUrl || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"}
            alt={exercise.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

          {/* Video Preview Button Overlay */}
          {exercise.videoUrl && (
            <button
              onClick={() => setVideoOpen(true)}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]"
              title="7-8 saniyəlik videoya bax"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </div>
            </button>
          )}

          {/* Muscle Group Badge */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-slate-700 flex items-center gap-1">
              <Dumbbell className="w-3 h-3" />
              {t(`muscle_${exercise.muscleGroup}`) || exercise.muscleGroup}
            </span>
          </div>

          {/* Difficulty Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full border backdrop-blur-md ${getDifficultyColor(
                exercise.difficulty
              )}`}
            >
              {t(`diff_${exercise.difficulty}`) || exercise.difficulty}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <Link
                to={`/exercises/${exercise.slug}`}
                className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1"
              >
                {exercise.title}
              </Link>
            </div>

            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {exercise.description}
            </p>
          </div>

          {/* Metrics & Footer */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-amber-400 font-medium">
              <Flame className="w-4 h-4 fill-amber-400/20" />
              <span>{exercise.estimatedCaloriesBurnedPerMin} kkal/dəq</span>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold">{exercise.averageRating || '5.0'}</span>
              <span className="text-slate-500">({exercise.commentsCount || 0})</span>
            </div>
          </div>

          <div className="pt-1 flex gap-2">
            <Link
              to={`/exercises/${exercise.slug}`}
              className="flex-1 text-center py-2 px-3 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
            >
              {t('details')}
            </Link>
            {exercise.videoUrl && (
              <button
                onClick={() => setVideoOpen(true)}
                className="p-2 text-xs font-semibold rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors"
                title="Qısa videoya bax"
              >
                <Play className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <VideoModal
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoUrl={exercise.videoUrl}
        title={exercise.title}
        durationText="7-8 saniyəlik icra videosu"
      />
    </>
  );
}
