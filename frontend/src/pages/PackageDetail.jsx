import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import VideoModal from '../components/VideoModal';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Layers,
  Play,
  Calendar,
  CheckCircle,
  Star,
  User,
  ArrowLeft,
  Flame,
  Clock,
  Dumbbell,
  Send,
} from 'lucide-react';

export default function PackageDetail() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [videoOpen, setVideoOpen] = useState(false);

  // Adoption modal
  const [adoptModalOpen, setAdoptModalOpen] = useState(false);
  const [clearExisting, setClearExisting] = useState(false);
  const [adopting, setAdopting] = useState(false);

  // Comments
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchPackageData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/workoutpackages/slug/${slug}`);
        if (res.success && res.data) {
          setPkg(res.data);
          const commentsRes = await api.get(`/comments/package/${slug}`);
          if (commentsRes.success) setComments(commentsRes.data);
        } else {
          setError('Məşq paketi tapılmadı');
        }
      } catch (err) {
        setError(err.message || 'Məşq paketi tapılmadı');
      } finally {
        setLoading(false);
      }
    };
    fetchPackageData();
  }, [slug]);

  const handleAdopt = async () => {
    if (!pkg || !isAuthenticated) return;
    setAdopting(true);
    try {
      const res = await api.post('/workoutpackages/adopt', {
        packageId: pkg.id,
        clearExistingSchedule: clearExisting,
      });

      if (res.success) {
        setAdoptModalOpen(false);
        navigate('/weekly-plan');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setAdopting(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;
    setSubmittingComment(true);
    try {
      const res = await api.post('/comments', {
        workoutPackageId: pkg.id,
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
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="max-w-2xl mx-auto my-20 p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
        <h2 className="text-2xl font-bold text-white">Paket tapılmadı</h2>
        <p className="text-sm text-slate-400">{error}</p>
        <Link
          to="/packages"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Bütün paketlərə qayıt
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <Link
          to="/packages"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Bütün Məşqçi Paketləri
        </Link>
      </div>

      {/* Main presentation banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="h-64 sm:h-80 w-full relative">
          <img
            src={pkg.thumbnailUrl || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80"}
            alt={pkg.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/40" />

          {/* 2-3s short preview button */}
          {pkg.previewVideoUrl && (
            <button
              onClick={() => setVideoOpen(true)}
              className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/90 hover:bg-emerald-400 text-white font-bold text-xs shadow-xl backdrop-blur-md transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>2-3 san. video icra</span>
            </button>
          )}

          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white">
                  {t(`goal_${pkg.goal}`) || pkg.goal}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800/80 backdrop-blur-md text-slate-200 border border-slate-700">
                  {pkg.durationWeeks} həftəlik
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white">{pkg.title}</h1>
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                Məşqçi: <strong className="text-white">{pkg.trainerName}</strong>
              </p>
            </div>

            {isAuthenticated ? (
              <button
                onClick={() => setAdoptModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                {t('adopt_package')}
              </button>
            ) : (
              <Link
                to="/login"
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all"
              >
                Daxil ol və tətbiq et
              </Link>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-white">Proqram haqqında ətraflı məlumat:</h3>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{pkg.description}</p>
        </div>
      </div>

      {/* Exercises Included By Day */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-emerald-400" />
          Proqrama Daxil Olan Məşqlər ({pkg.exercises?.length || 0})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pkg.exercises?.map((ex, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4"
            >
              <img
                src={ex.exerciseThumbnailUrl || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=200&q=80"}
                alt={ex.exerciseTitle}
                className="w-16 h-16 rounded-xl object-cover bg-slate-950 shrink-0"
              />
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-emerald-400">
                  {t(`day_${ex.dayOfWeek}`) || ex.dayOfWeek}
                </span>
                <Link
                  to={`/exercises/${ex.exerciseSlug}`}
                  className="block text-sm font-bold text-white hover:text-emerald-400 transition-colors"
                >
                  {ex.exerciseTitle}
                </Link>
                <p className="text-xs text-slate-400">
                  {ex.sets} dəst × {ex.reps} təkrar • {ex.restSeconds} san. istirahət
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <section className="pt-8 border-t border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          Məşqçi Proqramı Rəyləri ({comments.length})
        </h2>

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
              placeholder="Bu məşqçi proqramı haqqında rəyiniz..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-xs text-white placeholder-slate-500 outline-none resize-none"
              required
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingComment}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                {submittingComment ? 'Göndərilir...' : 'Rəyi Göndər'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
            Rəy bildirmək üçün zəhmət olmasa{' '}
            <Link to="/login" className="text-emerald-400 font-semibold underline">
              daxil olun
            </Link>
            .
          </div>
        )}

        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{c.userName}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: c.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-300">{c.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Video Modal (2-3s short video) */}
      <VideoModal
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoUrl={pkg.previewVideoUrl}
        title={pkg.title}
        durationText="2-3 saniyəlik qısa icra videosu"
      />

      {/* Adopt Modal */}
      {adoptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Bu proqramı cədvəlinizə tətbiq edin</h3>
            <p className="text-xs text-slate-300">
              Proqramdakı bütün hərəkətlər təyin olunmuş günlər üzrə həftəlik məşq cədvəlinizə yazılacaq.
            </p>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={clearExisting}
                  onChange={(e) => setClearExisting(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Mövcud köhnə cədvəlimi təmizlə</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAdoptModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Ləğv et
              </button>
              <button
                type="button"
                disabled={adopting}
                onClick={handleAdopt}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                {adopting ? 'Tətbiq edilir...' : 'Təsdiq et'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
