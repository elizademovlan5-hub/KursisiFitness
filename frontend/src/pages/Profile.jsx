import React, { useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  User as UserIcon,
  UploadCloud,
  Lock,
  Save,
  CheckCircle2,
  Dumbbell,
  Shield,
} from 'lucide-react';

const GOALS = [
  { key: 'WeightLoss', az: 'Yağ yandırma / Arıqlama', en: 'Weight Loss' },
  { key: 'MuscleGain', az: 'Əzələ kütləsi artımı', en: 'Muscle Gain' },
  { key: 'Maintenance', az: 'Formanı qorumaq', en: 'Maintenance' },
  { key: 'Strength', az: 'Güc və qüvvət', en: 'Strength' },
  { key: 'Endurance', az: 'Dözümlülük və Kardio', en: 'Endurance' },
];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { lang, t } = useLanguage();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [heightCm, setHeightCm] = useState(user?.heightCm || '');
  const [weightKg, setWeightKg] = useState(user?.weightKg || '');
  const [targetGoal, setTargetGoal] = useState(user?.targetGoal || 'Maintenance');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  const [uploading, setUploading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  // Avatar upload to Cloud CDN
  const handleAvatarUpload = async (e) => {
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
        setAvatarUrl(res.data);
        // Automatically save new avatar
        await updateProfile({
          fullName,
          heightCm: heightCm ? parseFloat(heightCm) : null,
          weightKg: weightKg ? parseFloat(weightKg) : null,
          targetGoal,
          avatarUrl: res.data,
        });
        setProfileMsg('Profil şəkli Cloud CDN-ə uğurla yükləndi!');
        setTimeout(() => setProfileMsg(''), 3000);
      }
    } catch (err) {
      alert('Şəkil yüklənməsində xəta: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');
    try {
      const res = await updateProfile({
        fullName,
        heightCm: heightCm ? parseFloat(heightCm) : null,
        weightKg: weightKg ? parseFloat(weightKg) : null,
        targetGoal,
        avatarUrl,
      });

      if (res.success) {
        setProfileMsg('Profil məlumatları uğurla yeniləndi!');
        setTimeout(() => setProfileMsg(''), 3000);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');
    setChangingPass(true);
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      if (res.success) {
        setPasswordMsg('Şifrəniz uğurla dəyişdirildi!');
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => setPasswordMsg(''), 3000);
      }
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <UserIcon className="w-8 h-8 text-emerald-400" />
            {t('nav_profile')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Şəxsi profil məlumatlarınızı, hədəfinizi və şifrənizi idarə edin.
          </p>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Rol: {user?.roleName || user?.role}
        </div>
      </div>

      {/* Grid: Profile Info & Avatar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Avatar Card (Cloud CDN Upload) */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 text-center">
          <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden bg-slate-950 border-2 border-emerald-500/40 shadow-xl group">
            {avatarUrl ? (
              <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-4xl font-black text-emerald-400">
                {fullName.charAt(0) || 'U'}
              </div>
            )}
            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer text-white text-xs font-semibold transition-opacity">
              <UploadCloud className="w-6 h-6 text-emerald-400 mb-1" />
              <span>Dəyiş</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <h3 className="text-lg font-black text-white">{fullName}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>

          <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors">
            <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
            <span>{uploading ? 'Yüklənir...' : 'Yeni Şəkil Yüklə (Cloud)'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Profile Edit Form */}
        <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-emerald-400" />
            Profil Məlumatlarını Yenilə
          </h2>

          {profileMsg && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {profileMsg}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Ad və Soyad:
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                Əsas Fitnes Hədəfi:
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
              disabled={savingProfile}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Save className="w-4 h-4" />
              {savingProfile ? 'Yadda saxlanılır...' : 'Dəyişiklikləri Yadda Saxla'}
            </button>
          </form>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6 max-w-xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-400" />
          Şifrəni Dəyişdir
        </h2>

        {passwordMsg && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl font-medium">
            {passwordMsg}
          </div>
        )}

        {passwordError && (
          <div className="p-3 bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs rounded-xl font-medium">
            {passwordError}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Cari Şifrə:
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Yeni Şifrə (minimum 6 simvol):
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-500 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={changingPass}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            {changingPass ? 'Yenilənir...' : 'Şifrəni Yenilə'}
          </button>
        </form>
      </div>
    </div>
  );
}
