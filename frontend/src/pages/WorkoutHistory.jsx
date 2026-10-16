import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import {
  TrendingUp,
  Flame,
  Clock,
  Dumbbell,
  Award,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export default function WorkoutHistory() {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoryAndStats = async () => {
      setLoading(true);
      try {
        const [statsRes, historyRes] = await Promise.all([
          api.get('/workoutplans/stats'),
          api.get('/workoutplans/history'),
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (historyRes.success) setHistory(historyRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryAndStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-emerald-400" />
          {t('stats_title')}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Həftəlik məşq göstəriciləriniz, yandırılan kalori və tamamlanan bütün məşqlərin tam tarixçəsi.
        </p>
      </div>

      {/* 14. Həftəlik Statistika Kartları */}
      {stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Workouts */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Dumbbell className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-400 font-medium">{t('total_workouts')}</p>
              <h3 className="text-2xl font-black text-white">{stats.totalWorkoutsCompleted} gün</h3>
              <p className="text-[11px] text-slate-500">{stats.totalExercisesCompleted} hərəkət tamamlandı</p>
            </div>

            {/* Total Calories */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-400 font-medium">{t('calories_burned')}</p>
              <h3 className="text-2xl font-black text-amber-400">{stats.totalCaloriesBurned} kkal</h3>
              <p className="text-[11px] text-slate-500">Məşqlər zamanı yandırılan enerji</p>
            </div>

            {/* Total Minutes */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-400 font-medium">{t('total_minutes')}</p>
              <h3 className="text-2xl font-black text-white">{stats.totalMinutesTrained} dəq</h3>
              <p className="text-[11px] text-slate-500">Aktiv fiziki fəaliyyət müddəti</p>
            </div>

            {/* Completion Rate */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-400 font-medium">{t('completion_rate')}</p>
              <h3 className="text-2xl font-black text-emerald-400">{stats.completionRatePercentage}%</h3>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: `${stats.completionRatePercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Muscle Group Distribution */}
          {stats.exercisesByMuscleGroup && Object.keys(stats.exercisesByMuscleGroup).length > 0 && (
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Məşq Olunan Əzələ Qrupları Bölgüsü
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(stats.exercisesByMuscleGroup).map(([muscle, count]) => (
                  <div key={muscle} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                    <p className="text-xs text-slate-400 font-medium">{t(`muscle_${muscle}`) || muscle}</p>
                    <p className="text-base font-black text-white mt-0.5">{count} dəfə</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 15. Tamamladığı Məşqlərin Tarixçəsi */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          Tamamlanmış Məşqlər Tarixçəsi ({history.length})
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl space-y-3">
            <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">Hələ tamamlanmış məşq tarixçəsi yoxdur</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Həftəlik planınızdakı məşqləri tamamladıqca bütün nailiyyətləriniz burada arxivlənəcək.
            </p>
            <Link
              to="/weekly-plan"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all"
            >
              Həftəlik Plana Get
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={log.exerciseThumbnailUrl || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=200&q=80"}
                    alt={log.exerciseTitle}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-950 shrink-0"
                  />
                  <div>
                    <Link
                      to={`/exercises/${log.exerciseSlug}`}
                      className="text-sm font-bold text-white hover:text-emerald-400 transition-colors"
                    >
                      {log.exerciseTitle}
                    </Link>
                    <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="text-slate-300 font-semibold">
                        {log.setsCompleted} dəst × {log.repsCompleted} təkrar
                      </span>
                      {log.weightUsedKg > 0 && (
                        <span className="text-amber-400 font-medium">({log.weightUsedKg} kq)</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs self-end sm:self-center">
                  <div className="text-right">
                    <p className="font-bold text-emerald-400">+{log.caloriesBurned} kkal</p>
                    <p className="text-[11px] text-slate-500">{log.durationMinutes} dəqiqə</p>
                  </div>
                  <div className="text-right border-l border-slate-800 pl-4">
                    <p className="font-semibold text-slate-300">
                      {new Date(log.completedAt).toLocaleDateString()}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {new Date(log.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
