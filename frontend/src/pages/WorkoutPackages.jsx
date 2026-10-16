import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import VideoModal from '../components/VideoModal';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Layers,
  Play,
  Calendar,
  Award,
  CheckCircle,
  Star,
  User,
  ArrowRight,
  Flame,
} from 'lucide-react';

export default function WorkoutPackages() {
  const { isAuthenticated } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState({ url: '', title: '' });

  // Adoption modal
  const [adoptModalOpen, setAdoptModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [clearExisting, setClearExisting] = useState(false);
  const [adopting, setAdopting] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const res = await api.get('/workoutpackages');
        if (res.success) {
          setPackages(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const openVideo = (pkg) => {
    setActiveVideo({
      url: pkg.previewVideoUrl,
      title: `${pkg.title} - Qısa Nümayiş`,
    });
    setVideoModalOpen(true);
  };

  const handleAdopt = async () => {
    if (!selectedPackage || !isAuthenticated) return;
    setAdopting(true);
    try {
      const res = await api.post('/workoutpackages/adopt', {
        packageId: selectedPackage.id,
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Layers className="w-8 h-8 text-emerald-400" />
            {t('packages_title')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">{t('packages_subtitle')}</p>
        </div>
      </div>

      {/* Packages Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 rounded-3xl bg-slate-900 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl space-y-3">
          <Layers className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">Hazır paket tapılmadı</h3>
          <p className="text-xs text-slate-500">Məşqçilər tezliklə yeni xüsusi proqramlar əlavə edəcəklər.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/5 flex flex-col justify-between group"
            >
              <div>
                {/* Media Container */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                  <img
                    src={pkg.thumbnailUrl || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80"}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* 2-3 sec short preview video trigger */}
                  {pkg.previewVideoUrl && (
                    <button
                      onClick={() => openVideo(pkg)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]"
                      title="2-3 saniyəlik videoya bax"
                    >
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-white font-bold text-xs shadow-xl">
                        <Play className="w-4 h-4 fill-white" />
                        <span>2-3 san. video icra</span>
                      </div>
                    </button>
                  )}

                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/90 text-white shadow-md">
                      {t(`goal_${pkg.goal}`) || pkg.goal}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 backdrop-blur-md text-slate-200 border border-slate-700">
                      {pkg.durationWeeks} həftəlik
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Trainer Avatar & Info */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      {pkg.trainerAvatarUrl ? (
                        <img
                          src={pkg.trainerAvatarUrl}
                          alt={pkg.trainerName}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-800 text-emerald-400 font-bold flex items-center justify-center text-xs">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                      <span className="text-xs font-semibold text-slate-300">{pkg.trainerName}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{pkg.averageRating || '5.0'}</span>
                    </div>
                  </div>

                  <Link
                    to={`/packages/${pkg.slug}`}
                    className="block text-lg font-black text-white group-hover:text-emerald-400 transition-colors"
                  >
                    {pkg.title}
                  </Link>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                    <span>Daxil olan hərəkətlər:</span>
                    <strong className="text-white font-bold">{pkg.exercises?.length || 0} məşq</strong>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 flex gap-2">
                <Link
                  to={`/packages/${pkg.slug}`}
                  className="flex-1 text-center py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                >
                  {t('details')}
                </Link>

                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setSelectedPackage(pkg);
                      setAdoptModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
                  >
                    Seç
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                  >
                    Daxil ol
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal (2-3s short preview) */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoUrl={activeVideo.url}
        title={activeVideo.title}
        durationText="2-3 saniyəlik qısa icra videosu"
      />

      {/* Adopt Package Modal */}
      {adoptModalOpen && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Paketi Həftəlik Cədvəlinizə Əlavə Edin
            </h3>
            <p className="text-xs text-slate-300">
              <strong className="text-emerald-400">{selectedPackage.title}</strong> paketindəki bütün məşqlər sizin həftəlik məşq planınıza köçürüləcək.
            </p>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={clearExisting}
                  onChange={(e) => setClearExisting(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Mövcud köhnə həftəlik planımı təmizlə və yenisini yaz</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAdoptModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                disabled={adopting}
                onClick={handleAdopt}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20"
              >
                {adopting ? 'Tətbiq edilir...' : 'Təsdiq et və cədvələ yaz'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
