import React from 'react';
import { Dumbbell, Heart, Shield, Code, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Dumbbell className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white">
                Kursisi<span className="text-emerald-400">.Fit</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              ASP.NET Core Web API və React Clean Architecture əsasında hazırlanmış müasir fitnes və məşq idarəetmə platforması.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <Shield className="w-4 h-4" /> Cloud Storage & CDN Ready
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Naviqasiya
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/exercises" className="hover:text-emerald-400 transition-colors">
                  Bütün Məşqlər
                </Link>
              </li>
              <li>
                <Link to="/packages" className="hover:text-emerald-400 transition-colors">
                  Məşqçi Paketləri
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="hover:text-emerald-400 transition-colors">
                  BMI və Proqram Təklifi
                </Link>
              </li>
              <li>
                <Link to="/weekly-plan" className="hover:text-emerald-400 transition-colors">
                  Həftəlik Məşq Cədvəli
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Xüsusiyyətlər
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> 7-8 Saniyəlik Məşq Videoları
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> URL Query Parametr Axtarışı
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> ID Əvəzinə SEO Slug
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Email OTP Təsdiqi
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Aylıq Şəkil və Çəki İzləmə
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Arxitektura & Texnologiyalar
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                'ASP.NET Core Web API',
                'Clean Architecture',
                'React 19',
                'Tailwind CSS',
                'EF Core',
                'JWT Auth',
                'Cloud CDN',
                'Swagger UI',
                'xUnit Tests',
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-xs rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Kursisi Fitness Platforması. Bütün hüquqlar qorunur.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Clean Architecture ilə sevgiylə kodlanmışdır <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
