import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import ExerciseCard from '../components/ExerciseCard';
import { SkeletonGrid } from '../components/SkeletonLoaders';
import { useLanguage } from '../context/LanguageContext';
import { Search, Filter, Dumbbell, Sparkles, X } from 'lucide-react';

const MUSCLE_GROUPS = [
  { key: 'All', labelAz: 'Hamısı', labelEn: 'All' },
  { key: 'Chest', labelAz: 'Sinə', labelEn: 'Chest' },
  { key: 'Back', labelAz: 'Kürək', labelEn: 'Back' },
  { key: 'Shoulders', labelAz: 'Çiyin', labelEn: 'Shoulders' },
  { key: 'Arms', labelAz: 'Qollar', labelEn: 'Arms' },
  { key: 'Legs', labelAz: 'Ayaq', labelEn: 'Legs' },
  { key: 'Abs', labelAz: 'Qarın', labelEn: 'Abs' },
  { key: 'Cardio', labelAz: 'Kardio', labelEn: 'Cardio' },
  { key: 'FullBody', labelAz: 'Bütün Bədən', labelEn: 'Full Body' },
];

const DIFFICULTIES = [
  { key: 'All', labelAz: 'Bütün səviyyələr', labelEn: 'All Difficulties' },
  { key: 'Beginner', labelAz: 'Başlanğıc', labelEn: 'Beginner' },
  { key: 'Intermediate', labelAz: 'Orta', labelEn: 'Intermediate' },
  { key: 'Advanced', labelAz: 'İrəli', labelEn: 'Advanced' },
];

export default function Exercises() {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL parameters
  const currentSearch = searchParams.get('search') || '';
  const currentMuscle = searchParams.get('muscle') || 'All';
  const currentDifficulty = searchParams.get('difficulty') || 'All';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagedInfo, setPagedInfo] = useState({ totalPages: 1, totalCount: 0 });

  // Local search input state for smooth typing
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  // Update URL Search Parameters
  const updateUrlParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'All') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.set('page', '1'); // Reset to first page on filter change
    setSearchParams(newParams);
  };

  // Fetch exercises from backend with filter parameters
  const fetchExercises = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: currentPage,
        pageSize: 12,
      };

      if (currentSearch.trim()) params.search = currentSearch.trim();
      if (currentMuscle !== 'All') params.muscleGroup = currentMuscle;
      if (currentDifficulty !== 'All') params.difficulty = currentDifficulty;

      const res = await api.get('/exercises', { params });
      if (res.success && res.data) {
        setExercises(res.data.items);
        setPagedInfo({
          totalPages: res.data.totalPages,
          totalCount: res.data.totalCount,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentSearch, currentMuscle, currentDifficulty, currentPage]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateUrlParam('search', searchTerm.trim());
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = currentSearch || currentMuscle !== 'All' || currentDifficulty !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Dumbbell className="w-8 h-8 text-emerald-400" />
            {t('nav_exercises')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Bütün məşq hərəkətləri, icra videoları və əzələ qrupları üzrə axtarış və filterləmə.
          </p>
        </div>

        {/* Live Active Filters Status */}
        <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl">
          Tapılan məşq sayı: <span className="font-bold text-emerald-400">{pagedInfo.totalCount}</span>
        </div>
      </div>

      {/* Search and Filters Bar (Strictly synced with URL query parameters) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  updateUrlParam('search', '');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Difficulty Dropdown */}
          <div className="min-w-[180px]">
            <select
              value={currentDifficulty}
              onChange={(e) => updateUrlParam('difficulty', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm text-slate-200 outline-none cursor-pointer"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d.key} value={d.key} className="bg-slate-900 text-white">
                  {lang === 'az' ? d.labelAz : d.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button if any active */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <X className="w-4 h-4" /> Filterləri sıfırla
            </button>
          )}
        </div>

        {/* Muscle Groups Filter Chips */}
        <div>
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Əzələ Qrupu:
          </span>
          <div className="flex flex-wrap gap-2">
            {MUSCLE_GROUPS.map((mg) => {
              const isSelected = currentMuscle === mg.key;
              return (
                <button
                  key={mg.key}
                  onClick={() => updateUrlParam('muscle', mg.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 scale-105'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {lang === 'az' ? mg.labelAz : mg.labelEn}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Exercises Grid with Skeleton Loaders */}
      {loading ? (
        <SkeletonGrid count={9} />
      ) : exercises.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl space-y-3">
          <Dumbbell className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">Uyğun məşq tapılmadı</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Axtarış sözünü dəyişməyə və ya filterləri sıfırlamağa cəhd edin.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Bütün məşqləri göstər
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {pagedInfo.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          {Array.from({ length: pagedInfo.totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isCurrent = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('page', pageNum.toString());
                  setSearchParams(newParams);
                }}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
