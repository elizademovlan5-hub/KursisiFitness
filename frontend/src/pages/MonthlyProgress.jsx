import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import {
  Camera,
  UploadCloud,
  Plus,
  Trash2,
  TrendingDown,
  Calendar,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function MonthlyProgress() {
  const { t } = useLanguage();
  const [progresses, setProgresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [monthYear, setMonthYear] = useState('2026-05');
  const [weightKg, setWeightKg] = useState(78);
  const [chestCm, setChestCm] = useState(103);
  const [waistCm, setWaistCm] = useState(84);
  const [armCm, setArmCm] = useState(37);
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const res = await api.get('/progress');
      if (res.success) {
        setProgresses(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.success && res.data) {
        setPhotoUrl(res.data);
      }
    } catch (err) {
      alert('Şəkil yüklənərkən xəta baş verdi: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photoUrl) {
      alert('Zəhmət olmasa aylıq inkişaf şəklinizi seçin və ya yükləyin.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/progress', {
        monthYear,
        photoUrl,
        weightKg: parseFloat(weightKg),
        chestCm: chestCm ? parseFloat(chestCm) : null,
        waistCm: waistCm ? parseFloat(waistCm) : null,
        armCm: armCm ? parseFloat(armCm) : null,
        notes,
      });

      if (res.success) {
        setModalOpen(false);
        fetchProgress();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu aylıq inkişaf qeydini silmək istədiyinizdən əminsiniz?')) return;
    try {
      const res = await api.delete(`/progress/${id}`);
      if (res.success) {
        setProgresses((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Camera className="w-8 h-8 text-emerald-400" />
            {t('progress_title')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">{t('progress_subtitle')}</p>
        </div>

        <button
          onClick={() => {
            setPhotoUrl('');
            setModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" /> {t('add_progress_btn')}
        </button>
      </div>

      {/* Progress Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 rounded-3xl bg-slate-900 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : progresses.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl space-y-3">
          <Camera className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">Hələ heç bir aylıq şəkil əlavə edilməyib</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Hər ay üçün bədən şəklinizi və ölçülərinizi qeyd edərək transformasiyanızı arxivləşdirin.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl"
          >
            İlk Nəticəni Əlavə Et
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {progresses.map((p, idx) => {
            const prevItem = progresses[idx + 1];
            const weightDiff = prevItem ? Math.round((p.weightKg - prevItem.weightKg) * 10) / 10 : null;

            return (
              <div
                key={p.id}
                className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Photo container */}
                <div className="relative h-64 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={p.photoUrl}
                    alt={p.monthYear}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-slate-700 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {p.monthYear}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <div className="px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white font-black text-sm">
                      {p.weightKg} kq
                    </div>
                    {weightDiff !== null && (
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          weightDiff < 0
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {weightDiff > 0 ? `+${weightDiff}` : weightDiff} kq
                      </span>
                    )}
                  </div>
                </div>

                {/* Measurements */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Sinə</span>
                      <p className="text-sm font-bold text-white mt-0.5">{p.chestCm || '—'} sm</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Bel</span>
                      <p className="text-sm font-bold text-white mt-0.5">{p.waistCm || '—'} sm</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Qol</span>
                      <p className="text-sm font-bold text-white mt-0.5">{p.armCm || '—'} sm</p>
                    </div>
                  </div>

                  {p.notes && (
                    <p className="text-xs text-slate-300 italic bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                      "{p.notes}"
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Progress Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-400" />
              Yeni Aylıq İnkişaf Qeydi
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    {t('month_year')}:
                  </label>
                  <input
                    type="text"
                    value={monthYear}
                    onChange={(e) => setMonthYear(e.target.value)}
                    placeholder="2026-05"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Çəki (kq):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Photo Upload to Cloud CDN */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Aylıq Şəkil (Cloud CDN-ə yüklənir):
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-2 transition-colors">
                    <UploadCloud className="w-4 h-4 text-emerald-400" />
                    <span>{uploading ? 'Yüklənir...' : 'Kompüterdən Seç'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  <span className="text-xs text-slate-500">və ya birbaşa URL daxil edin:</span>
                </div>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full mt-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                  required
                />
                {photoUrl && (
                  <div className="mt-2 h-20 w-20 rounded-xl overflow-hidden border border-emerald-500/40">
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Body Measurements */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Sinə (sm):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={chestCm}
                    onChange={(e) => setChestCm(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Bel (sm):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={waistCm}
                    onChange={(e) => setWaistCm(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Qol (sm):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={armCm}
                    onChange={(e) => setArmCm(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Qeydlər:
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Məsələn: Bu ay çəkidə azalma və relyefdə artım oldu"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  {submitting ? 'Saxlanılır...' : 'Yadda Saxla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
