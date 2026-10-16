import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Dumbbell,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';

const GOALS = [
  { key: 'WeightLoss', az: 'Yağ yandırma / Arıqlama', en: 'Weight Loss' },
  { key: 'MuscleGain', az: 'Əzələ kütləsi artımı', en: 'Muscle Gain' },
  { key: 'Maintenance', az: 'Formanı qorumaq', en: 'Maintenance' },
  { key: 'Strength', az: 'Güc və qüvvət', en: 'Strength' },
  { key: 'Endurance', az: 'Dözümlülük və Kardio', en: 'Endurance' },
];

export default function Register() {
  const { register, verifyOtp, loading } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  // Registration fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [targetGoal, setTargetGoal] = useState('WeightLoss');

  // Multi-step: Registration -> OTP Verification
  const [step, setStep] = useState('FORM'); // 'FORM' or 'OTP'
  const [otpCode, setOtpCode] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [otpSubmitting, setOtpSubmitting] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const res = await register({
        fullName,
        email,
        password,
        heightCm: heightCm ? parseFloat(heightCm) : null,
        weightKg: weightKg ? parseFloat(weightKg) : null,
        targetGoal,
      });

      if (res.success) {
        setInfoMessage(res.message);
        setStep('OTP');
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpSubmitting(true);
    setErrorMessage('');
    try {
      const res = await verifyOtp(email, otpCode);
      if (res.success) {
        navigate('/');
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setOtpSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/25">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {step === 'FORM' ? t('register_title') : t('otp_title')}
          </h2>
          <p className="text-xs text-slate-400">
            {step === 'FORM'
              ? 'Məşqlərinizi planlamaq üçün qeydiyyatdan keçin'
              : `${email} ünvanına göndərilən 6 rəqəmli kodu daxil edin`}
          </p>
        </div>

        {infoMessage && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{infoMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl font-medium">
            {errorMessage}
          </div>
        )}

        {/* Step 1: Initial Registration Form */}
        {step === 'FORM' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {t('fullname')}:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Məsələn: Əli Məmmədov"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {t('email')}:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ali@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {t('password')}:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 simvol"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Boy (sm):
                </label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="Məs: 180"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Çəki (kq):
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="Məs: 78"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Fitnes Hədəfi:
              </label>
              <select
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-500 outline-none cursor-pointer"
              >
                {GOALS.map((g) => (
                  <option key={g.key} value={g.key}>
                    {lang === 'az' ? g.az : g.en}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Göndərilir...' : 'Qeydiyyatdan Keç və OTP Al'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2 text-xs text-slate-400">
              Artıq hesabınız var?{' '}
              <Link to="/login" className="text-emerald-400 font-bold hover:underline">
                {t('nav_login')}
              </Link>
            </div>
          </form>
        )}

        {/* Step 2: Email OTP Verification (Requirement 9) */}
        {step === 'OTP' && (
          <form onSubmit={handleOtpSubmit} className="space-y-5 animate-fade-in">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-2">
              <KeyRound className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-xs text-slate-300">
                Emailinizə göndərilən 6 rəqəmli OTP kodunu daxil edin.
              </p>
              <p className="text-[11px] text-slate-500">
                (Sınaq mərhələsində kod backend terminal pəncərəsində də görünür)
              </p>
            </div>

            <div>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full text-center tracking-[0.5em] text-2xl font-mono p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-black focus:border-emerald-500 outline-none"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={otpSubmitting}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
            >
              {otpSubmitting ? 'Təsdiqlənir...' : t('verify_btn')}
            </button>

            <button
              type="button"
              onClick={() => setStep('FORM')}
              className="w-full text-center text-xs text-slate-400 hover:underline"
            >
              Məlumatlara düzəliş et
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
