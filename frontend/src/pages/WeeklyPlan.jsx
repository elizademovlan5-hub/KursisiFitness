import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import {
  Calendar,
  CheckCircle,
  Circle,
  Trash2,
  Plus,
  Flame,
  Clock,
  Dumbbell,
  Award,
  ChevronRight,
  TrendingUp,
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

export default function WeeklyPlan() {
  const { lang, t } = useLanguage();
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [planItems, setPlanItems] = useState([]);
  const [dailySummary, setDailySummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Complete workout modal state
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [completingItem, setCompletingItem] = useState(null);
  const [setsCompleted, setSetsCompleted] = useState(3);
  const [repsCompleted, setRepsCompleted] = useState(12);
  const [weightUsed, setWeightUsed] = useState(0);
  const [durationMins, setDurationMins] = useState(15);
  const [logNotes, setLogNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDayData = useCallback(async () => {
    setLoading(true);
    try {
      const summaryRes = await api.get(`/workoutplans/daily/${selectedDay}`);
      if (summaryRes.success && summaryRes.data) {
        setDailySummary(summaryRes.data);
        setPlanItems(summaryRes.data.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDay]);

  useEffect(() => {
    fetchDayData();
  }, [fetchDayData]);

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Bu məşqi həftəlik plandan silmək istədiyinizdən əminsiniz?')) return;
    try {
      const res = await api.delete(`/workoutplans/${itemId}`);
      if (res.success) {
        setPlanItems((prev) => prev.filter((i) => i.id !== itemId));
        fetchDayData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const openCompleteModal = (item) => {
    setCompletingItem(item);
    setSetsCompleted(item.targetSets || 3);
    setRepsCompleted(item.targetReps || 12);
    setWeightUsed(item.targetWeightKg || 0);
    setDurationMins(15);
    setLogNotes(item.notes || '');
    setCompleteModalOpen(true);
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    if (!completingItem) return;
    setSubmitting(true);
    try {
      const res = await api.post('/workoutplans/complete', {
        planItemId: completingItem.id,
        setsCompleted: parseInt(setsCompleted, 10),
        repsCompleted: parseInt(repsCompleted, 10),
        weightUsedKg: parseFloat(weightUsed) || 0,
        durationMinutes: parseInt(durationMins, 10) || 15,
        notes: logNotes,
      });

      if (res.success) {
        setCompleteModalOpen(false);
        fetchDayData();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-8 h-8 text-emerald-400" />
            {t('planner_title')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">{t('planner_subtitle')}</p>
        </div>
        <Link
          to="/exercises"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Yeni Məşq Əlavə Et
        </Link>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
        {DAYS.map((d) => {
          const isSelected = selectedDay === d.key;
          return (
            <button
              key={d.key}
              onClick={() => setSelectedDay(d.key)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex flex-col items-center gap-1 ${
                isSelected
                  ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/25 scale-[1.02]'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{lang === 'az' ? d.az : d.en}</span>
            </button>
          );
        })}
      </div>

      {/* Daily Summary Banner (13. Gündəlik məşq nəticəsi) */}
      {dailySummary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Planlaşdırılmış</p>
              <p className="text-lg font-black text-white">{dailySummary.totalScheduled} məşq</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Tamamlandı</p>
              <p className="text-lg font-black text-emerald-400">{dailySummary.completedCount} məşq</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Yandırılan Kalori</p>
              <p className="text-lg font-black text-amber-400">{dailySummary.totalCaloriesBurned} kkal</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Ümumi Müddət</p>
              <p className="text-lg font-black text-white">{dailySummary.totalDurationMinutes} dəq</p>
            </div>
          </div>
        </div>
      )}

      {/* Plan Items List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : planItems.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl space-y-4">
          <Dumbbell className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">{t('empty_day')}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Hərəkətlər kataloqundan istədiyiniz məşqi seçərək bu günün cədvəlinə daxil edin.
          </p>
          <Link
            to="/exercises"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Məşqlər Siyahısına Get
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {planItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                item.isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => (!item.isCompleted ? openCompleteModal(item) : null)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                    item.isCompleted
                      ? 'bg-emerald-500 text-white cursor-default'
                      : 'border-2 border-slate-600 hover:border-emerald-400 text-slate-600 hover:text-emerald-400'
                  }`}
                  title={item.isCompleted ? 'Tamamlanıb' : 'Tamamla'}
                >
                  {item.isCompleted ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </button>

                <img
                  src={item.exerciseThumbnailUrl || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=200&q=80"}
                  alt={item.exerciseTitle}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 bg-slate-950"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/exercises/${item.exerciseSlug}`}
                      className="text-base font-bold text-white hover:text-emerald-400 transition-colors"
                    >
                      {item.exerciseTitle}
                    </Link>
                    {item.isCompleted && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                        {t('completed_badge')}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="bg-slate-800 px-2.5 py-0.5 rounded-md font-semibold text-slate-300">
                      {item.targetSets} dəst × {item.targetReps} təkrar
                    </span>
                    {item.targetWeightKg && (
                      <span className="text-amber-400 font-semibold">
                        Çəki: {item.targetWeightKg} kq
                      </span>
                    )}
                    {item.notes && <span className="italic text-slate-500">"{item.notes}"</span>}
                  </div>
                </div>
              </div>

              {/* Actions Right */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {!item.isCompleted && (
                  <button
                    onClick={() => openCompleteModal(item)}
                    className="px-4 py-2 bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    Tamamla
                  </button>
                )}
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 bg-slate-950 hover:bg-rose-500/10 rounded-xl border border-slate-800 transition-colors"
                  title="Plandan sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Complete Workout Modal */}
      {completeModalOpen && completingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Məşqi Tamamla və Nəticəni Qeyd Et
            </h3>
            <p className="text-xs text-slate-400">
              <strong className="text-white">{completingItem.exerciseTitle}</strong> məşqini tamamladığınız faktiki parametrləri daxil edin:
            </p>

            <form onSubmit={handleCompleteSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Faktiki Dəst (Set):
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={setsCompleted}
                    onChange={(e) => setSetsCompleted(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Faktiki Təkrar (Rep):
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={repsCompleted}
                    onChange={(e) => setRepsCompleted(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    İstifadə olunan çəki (Kq):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={weightUsed}
                    onChange={(e) => setWeightUsed(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Müddət (Dəqiqə):
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={durationMins}
                    onChange={(e) => setDurationMins(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Məşq qeydi / Təəssürat:
                </label>
                <input
                  type="text"
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="Məsələn: Əla hiss olundu, çəkini artırdım"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCompleteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20"
                >
                  {submitting ? 'Saxlanılır...' : 'Tamamlandı kimi qeyd et'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
