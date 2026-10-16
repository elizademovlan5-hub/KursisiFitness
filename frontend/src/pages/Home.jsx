import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import ExerciseCard from '../components/ExerciseCard';
import { SkeletonGrid } from '../components/SkeletonLoaders';
import { useLanguage } from '../context/LanguageContext';
import {
  Dumbbell,
  Flame,
  Award,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Video,
  Sparkles,
  Layers,
  CalendarCheck,
} from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();
  const [featuredExercises, setFeaturedExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/exercises/featured');
        if (res.success) {
          setFeaturedExercises(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
        <div className="absolute inset-0 bg-radial from-emerald-500/10 via-slate-950/80 to-slate-950 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider animate-pulse">
              <Sparkles className="w-4 h-4" /> Professional Fitness & Workout Platform
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Məqsədinə Uyğun <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Düzgün Məşq</span>, Real Nəticə.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Bütün məşq hərəkətlərinin 7-8 saniyəlik peşəkar video izahatı, fərdiləşdirilmiş həftəlik planlayıcı, BMI proqram təklifi və aylıq inkişaf şəkilləri bir arada.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/exercises"
                className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 flex items-center gap-2"
              >
                <Dumbbell className="w-5 h-5" />
                Məşqləri Kəşf Et
              </Link>
              <Link
                to="/calculator"
                className="px-6 py-3.5 rounded-xl font-bold text-sm text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all flex items-center gap-2"
              >
                BMI & Proqram Təklifi Al
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/30 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">7-8 San. İcra Videosu</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hər məşqin düzgün icra texnikası, faydaları və yol verilən səhvləri aydın nümayiş etdirilir.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/30 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Həftəlik Plan & İzləmə</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Məşqləri günlər üzrə təyin edin, tamamlayın, çəki və təkrarları sistemə qeyd edin.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/30 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Məşqçi Paketləri</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Peşəkar zal təlimçilərinin hazırladığı xüsusi 4-8 həftəlik məşq paketlərini seçin və tətbiq edin.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/30 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Aylıq Şəkil & İnkişaf</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hər ay üçün Cloud CDN-ə bədən şəklinizi yükləyin və vizual transformasiyanızı addım-addım görün.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Exercises Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Populyar Məşq Hərəkətləri
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Ən çox icra olunan və yüksək effektivliyə malik baza hərəkətləri.
            </p>
          </div>
          <Link
            to="/exercises"
            className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Bütün Məşqlərə Bax ({'>'})
          </Link>
        </div>

        {loading ? (
          <SkeletonGrid count={6} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/20">
          <div className="max-w-2xl space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Bədən kütlə indeksinizi (BMI) hesablayıb hədəfinizə uyğun proqram almaq istəyirsiniz?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Sadəcə boy, çəki və hədəfinizi daxil edin. Alqoritmimiz sizin üçün optimal kalori normasını və xüsusi məşq planını təqdim etsin.
            </p>
            <div className="pt-2">
              <Link
                to="/calculator"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/30"
              >
                Hesablayıcıya Keç <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
