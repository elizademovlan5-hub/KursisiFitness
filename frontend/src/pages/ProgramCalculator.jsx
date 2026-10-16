import React, { useState } from 'react';
import api from '../api/client';
import ExerciseCard from '../components/ExerciseCard';
import { useLanguage } from '../context/LanguageContext';
import {
  Calculator,
  Flame,
  Activity,
  Heart,
  Dumbbell,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';

const GOALS = [
  { key: 'WeightLoss', az: 'Yağ yandırma / Arıqlama', en: 'Weight Loss' },
  { key: 'MuscleGain', az: 'Əzələ kütləsi artımı', en: 'Muscle Gain' },
  { key: 'Maintenance', az: 'Formanı qorumaq', en: 'Maintenance' },
  { key: 'Strength', az: 'Güc və qüvvət', en: 'Strength' },
  { key: 'Endurance', az: 'Dözümlülük və Kardio', en: 'Endurance' },
];

export default function ProgramCalculator() {
  const { lang, t } = useLanguage();

  const [height, setHeight] = useState(178);
  const [weight, setWeight] = useState(78);
  const [age, setAge] = useState(25);
  const [isMale, setIsMale] = useState(true);
  const [goal, setGoal] = useState('WeightLoss');

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/recommendations', {
        heightCm: parseFloat(height),
        weightKg: parseFloat(weight),
        age: parseInt(age, 10),
        isMale: isMale,
        goal: goal,
      });

      if (res.success && res.data) {
        setResult(res.data);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getBmiBadgeColor = (category) => {
    if (category.includes('Normal')) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (category.includes('Underweight') || category.includes('çatışmazlığı'))
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    if (category.includes('Overweight') || category.includes('Artıq'))
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-4 h-4" /> Ağıllı Alqoritm
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {t('calc_title')}
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          {t('calc_subtitle')}
        </p>
      </div>

      {/* Input Parameters Form */}
      <div className="max-w-2xl mx-auto bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <form onSubmit={handleCalculate} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t('height_cm')}:
              </label>
              <input
                type="number"
                min="120"
                max="240"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white focus:border-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t('weight_kg')}:
              </label>
              <input
                type="number"
                step="0.5"
                min="35"
                max="250"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white focus:border-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t('age')}:
              </label>
              <input
                type="number"
                min="14"
                max="90"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white focus:border-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t('gender')}:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsMale(true)}
                  className={`py-3 rounded-2xl text-xs font-bold transition-all ${
                    isMale
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {t('male')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsMale(false)}
                  className={`py-3 rounded-2xl text-xs font-bold transition-all ${
                    !isMale
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {t('female')}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              {t('target_goal')}:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {GOALS.map((g) => {
                const isSelected = goal === g.key;
                return (
                  <button
                    key={g.key}
                    type="button"
                    onClick={() => setGoal(g.key)}
                    className={`p-3 rounded-2xl text-xs font-bold text-left transition-all border ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {lang === 'az' ? g.az : g.en}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.01]"
          >
            {loading ? 'Hesablanır...' : t('calculate_button')}
          </button>
        </form>
      </div>

      {/* Results Presentation */}
      {result && (
        <div className="space-y-10 animate-fade-in">
          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* BMI Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Bədən Kütlə İndeksi (BMI)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">{result.bmiDetails.bmi}</span>
                <span className="text-xs text-slate-500">kq/m²</span>
              </div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getBmiBadgeColor(
                  result.bmiDetails.category
                )}`}
              >
                {result.bmiDetails.category}
              </span>
              <p className="text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                İdeal çəki intervalı: <strong className="text-emerald-400">{result.bmiDetails.idealWeightRange}</strong>
              </p>
            </div>

            {/* Daily Calories Target */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-400" />
                Tövsiyə Edilən Gündəlik Kalori
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-amber-400">
                  {result.bmiDetails.recommendedDailyCalories}
                </span>
                <span className="text-xs text-slate-500">kkal / gün</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
                Metabolizm və gündəlik aktivlik həcminiz nəzərə alınaraq hesablanmış optimal hədəf norması.
              </p>
            </div>

            {/* Split & Advice */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Activity className="w-4 h-4 text-emerald-400" />
                Tövsiyə Olunan Rejim
              </span>
              <h4 className="text-base font-bold text-white">
                {result.bmiDetails.recommendedSplit}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
                {result.bmiDetails.advice}
              </p>
            </div>
          </div>

          {/* Recommended Exercises tailored for user */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Dumbbell className="w-6 h-6 text-emerald-400" />
                Hədəfinizə Uyğun Seçilmiş Məşq Hərəkətləri
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Sizin bədən parametrləriniz və hədəfiniz üçün xüsusi seçilmiş hərəkətlər:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {result.recommendedExercises.map((ex) => (
                <ExerciseCard key={ex.id} exercise={ex} />
              ))}
            </div>
          </div>

          {/* Matching Trainer Packages */}
          {result.matchingPackages?.length > 0 && (
            <div className="space-y-6 pt-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Layers className="w-6 h-6 text-emerald-400" />
                Uyğun Məşqçi Paketləri
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.matchingPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3"
                  >
                    <img
                      src={pkg.thumbnailUrl || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80"}
                      alt={pkg.title}
                      className="w-full h-36 rounded-2xl object-cover"
                    />
                    <h3 className="text-base font-bold text-white">{pkg.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{pkg.description}</p>
                    <Link
                      to={`/packages/${pkg.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline pt-2"
                    >
                      Paketə bax <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
