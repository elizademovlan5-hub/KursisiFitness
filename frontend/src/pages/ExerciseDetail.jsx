import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { SkeletonDetails } from '../components/SkeletonLoaders';
import VideoModal from '../components/VideoModal';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Dumbbell,
  Play,
  Flame,
  CheckCircle2,
  AlertTriangle,
  CalendarPlus,
  Star,
  Send,
  ArrowLeft,
  Clock,
  Layers,
} from 'lucide-react';

const DAYS = [
  { key: 'Monday', az: 'Bazar ertəsi', en: 'Monday' },
  { key: 'Tuesday', az: 'Çərşənbə axşamı', en: 'Tuesday' },
  { key: 'Wednesday', az: 'Çərşənbə', en: 'Wednesday' },
  { key: 'Thursday', az: 'Cümə axşamı', en: 'Thursday' },
  { key: 'Friday', az: 'Cümə', en: 'Friday' },
  { key: 'Saturday', az: 'Şənbə', en: 'Saturday' },
  { key: 'Sunday', az: 'Bazar', en: 'Sunday' },
];

export default function ExerciseDetail() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { lang, t } = useLanguage();

  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [videoOpen, setVideoOpen] = useState(false);

  // Add to plan modal state
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [targetSets, setTargetSets] = useState(3);
  const [targetReps, setTargetReps] = useState(12);
  const [targetWeight, setTargetWeight] = useState('');
  const [planNotes, setPlanNotes] = useState('');
  const [planSuccessMsg, setPlanSuccessMsg] = useState('');

  // Comments state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  useEffect(() => {
    const fetchExerciseData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/exercises/slug/${slug}`);
        if (res.success && res.data) {
          setExercise(res.data);
          // fetch comments
          const commentsRes = await api.get(`/comments/exercise/${slug}`);
          if (commentsRes.success) {
            setComments(commentsRes.data);
          }
        } else {
          setError(res.message || 'Məşq tapılmadı');
        }
      } catch (err) {
        setError(err.message || 'Məşq tapılmadı');
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseData();
  }, [slug]);

  const handleAddToPlan = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    try {
      const res = await api.post('/workoutplans', {
        exerciseId: exercise.id,
        dayOfWeek: selectedDay,
        targetSets: parseInt(targetSets, 10),
        targetReps: parseInt(targetReps, 10),
        targetWeightKg: targetWeight ? parseFloat(targetWeight) : null,
        notes: planNotes,
      });

      if (res.success) {
        setPlanSuccessMsg('Məşq həftəlik cədvələ uğurla əlavə olundu!');
        setTimeout(() => {
          setPlanSuccessMsg('');
          setPlanModalOpen(false);
        }, 1500);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;
    setCommentSubmitting(true);
    try {
      const res = await api.post('/comments', {
        exerciseId: exercise.id,
        content: newComment.trim(),
        rating: rating,
      });

      if (res.success) {
        setComments([res.data, ...comments]);
        setNewComment('');
        setRating(5);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setCommentSubmitting(false);
    }
  };

  if (loading) return <SkeletonDetails />;

  if (error || !exercise) {
    return (
      <div className="max-w-2xl mx-auto my-20 p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
        <h2 className="text-2xl font-bold text-white">Məşq tapılmadı</h2>
        <p className="text-sm text-slate-400">{error || 'Axtardığınız məşq bazada mövcud deyil.'}</p>
        <Link
          to="/exercises"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Məşqlər siyahısına qayıt
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <div>
        <Link
          to="/exercises"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Bütün Məşqlər
        </Link>
      </div>

      {/* Main Exercise Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Media Showcase (Cloud CDN Thumbnail & Video Trigger) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-video sm:aspect-4/3 w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 group shadow-2xl">
            <img
              src={exercise.thumbnailUrl || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80"}
              alt={exercise.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Floating Video Play Button */}
            {exercise.videoUrl && (
              <button
                onClick={() => setVideoOpen(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] group-hover:bg-black/50 transition-all"
              >
                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-xl shadow-emerald-500/30 transform group-hover:scale-105 transition-transform">
                  <Play className="w-5 h-5 fill-white" />
                  <span>{t('watch_preview')}</span>
                </div>
              </button>
            )}

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
              <span className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700">
                Avadanlıq: <strong className="text-white">{exercise.equipment}</strong>
              </span>
              <span className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 flex items-center gap-1 text-amber-400">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                {exercise.estimatedCaloriesBurnedPerMin} kkal/dəq
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Exercise Details and Add to Plan */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {t(`muscle_${exercise.muscleGroup}`) || exercise.muscleGroup}
              </span>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {t(`diff_${exercise.difficulty}`) || exercise.difficulty}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {exercise.title}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              {exercise.description}
            </p>
          </div>

          {/* Action: Add to Plan Button */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-white">Həftəlik rejiminizə əlavə edin</p>
              <p className="text-xs text-slate-400">Gün və təkrarları seçərək proqramınıza daxil edin</p>
            </div>
            {isAuthenticated ? (
              <button
                onClick={() => setPlanModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 shrink-0"
              >
                <CalendarPlus className="w-4 h-4" />
                {t('add_to_plan')}
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors shrink-0"
              >
                Daxil ol və əlavə et
              </Link>
            )}
          </div>

          {/* Quick Slug info for transparency */}
          <div className="text-[11px] text-slate-500 font-mono">
            URL Slug: <span className="text-slate-400">/exercises/{exercise.slug}</span>
          </div>
        </div>
      </div>

      {/* Detailed Accordion / Tabs: Steps, Benefits, Risks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {/* Step-by-Step Instructions */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
            <Clock className="w-5 h-5" />
            <h3>{t('steps')}</h3>
          </div>
          <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
            {exercise.executionSteps || "İcra qaydaları qeyd olunmayıb."}
          </div>
        </div>

        {/* Benefits (Faydalı tərəfləri) */}
        <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
            <CheckCircle2 className="w-5 h-5" />
            <h3>{t('benefits')}</h3>
          </div>
          <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
            {exercise.benefits || "Bu hərəkət əsas hədəf əzələlərini gücləndirir və metabolizmi sürətləndirir."}
          </div>
        </div>

        {/* Risks & Common Mistakes (Diqqət edilməli səhvlər) */}
        <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/20 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
            <AlertTriangle className="w-5 h-5" />
            <h3>{t('risks_mistakes')}</h3>
          </div>
          <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
            {exercise.risksAndMistakes || "Çəkini tədricən artırın və isinmə hərəkətlərini unutmayın."}
          </div>
        </div>
      </div>

      {/* Comments and Reviews Section */}
      <section className="pt-8 border-t border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            {t('comments_and_ratings')} ({comments.length})
          </h2>
          <span className="text-xs text-slate-400">
            Orta reytinq: <strong className="text-white">{exercise.averageRating || 5.0} / 5</strong>
          </span>
        </div>

        {/* Add Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Qiymət verin:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t('write_comment')}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-xs text-white placeholder-slate-500 outline-none resize-none"
              required
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={commentSubmitting}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                {commentSubmitting ? 'Göndərilir...' : t('send_comment')}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
            Şərh yazmaq və qiymətləndirmək üçün zəhmət olmasa{' '}
            <Link to="/login" className="text-emerald-400 font-semibold underline">
              daxil olun
            </Link>
            .
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-3">
          {comments.length === 0 ? (
            <p className="text-xs text-slate-500 italic text-center py-6">
              {t('no_comments')}
            </p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {c.userAvatarUrl ? (
                      <img
                        src={c.userAvatarUrl}
                        alt={c.userName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {c.userName.charAt(0)}
                      </div>
                    )}
                    <span className="text-xs font-bold text-white">{c.userName}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: c.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-9">{c.content}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Video Modal (7-8 second video) */}
      <VideoModal
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoUrl={exercise.videoUrl}
        title={exercise.title}
        durationText="7-8 saniyəlik dəqiq icra videosu"
      />

      {/* Add To Weekly Plan Modal */}
      {planModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CalendarPlus className="w-5 h-5 text-emerald-400" />
              Məşqi Həftəlik Plana Əlavə Et
            </h3>

            {planSuccessMsg && (
              <div className="p-3 bg-emerald-500/20 text-emerald-300 text-xs rounded-xl font-medium border border-emerald-500/30">
                {planSuccessMsg}
              </div>
            )}

            <form onSubmit={handleAddToPlan} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Həftənin Günü:
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                >
                  {DAYS.map((d) => (
                    <option key={d.key} value={d.key}>
                      {lang === 'az' ? d.az : d.en}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Dəst (Set) sayı:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={targetSets}
                    onChange={(e) => setTargetSets(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Təkrar (Rep) sayı:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={targetReps}
                    onChange={(e) => setTargetReps(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Hədəf Çəki (Kq - könüllü):
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  placeholder="Məsələn: 60"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Qeyd (könüllü):
                </label>
                <input
                  type="text"
                  value={planNotes}
                  onChange={(e) => setPlanNotes(e.target.value)}
                  placeholder="Məsələn: dirsəkləri düz saxla"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setPlanModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20"
                >
                  Əlavə et
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
