import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { SkeletonTable } from '../../components/SkeletonLoaders';
import { useLanguage } from '../../context/LanguageContext';
import {
  ShieldAlert,
  Users,
  Dumbbell,
  Layers,
  Award,
  Plus,
  Trash2,
  Edit,
  UploadCloud,
  CheckCircle,
  XCircle,
  Search,
  Check,
  Video,
} from 'lucide-react';

const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Legs',
  'Abs',
  'Cardio',
  'FullBody',
];

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

export default function AdminDashboard() {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('exercises'); // 'overview' | 'exercises' | 'users' | 'packages'

  // Summary state
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Exercise Create/Edit Modal state
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('Chest');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [equipment, setEquipment] = useState('None');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [executionSteps, setExecutionSteps] = useState('');
  const [benefits, setBenefits] = useState('');
  const [risksAndMistakes, setRisksAndMistakes] = useState('');
  const [caloriesPerMin, setCaloriesPerMin] = useState(8.0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [savingExercise, setSavingExercise] = useState(false);

  // Search in exercises
  const [exerciseSearch, setExerciseSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sumRes, usersRes, exRes, pkgRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users'),
        api.get('/exercises?pageSize=100'),
        api.get('/workoutpackages'),
      ]);

      if (sumRes.success) setSummary(sumRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (exRes.success && exRes.data) setExercises(exRes.data.items);
      if (pkgRes.success) setPackages(pkgRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Upload image to Cloud CDN
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    setUploadingImage(true);
    try {
      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.success && res.data) {
        setThumbnailUrl(res.data);
      }
    } catch (err) {
      alert('Şəkil Cloud CDN-ə yüklənərkən xəta: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // Upload video to Cloud CDN
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    setUploadingVideo(true);
    try {
      const res = await api.post('/upload/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.success && res.data) {
        setVideoUrl(res.data);
      }
    } catch (err) {
      alert('Video Cloud CDN-ə yüklənərkən xəta: ' + err.message);
    } finally {
      setUploadingVideo(false);
    }
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingExerciseId(null);
    setTitle('');
    setDescription('');
    setMuscleGroup('Chest');
    setDifficulty('Intermediate');
    setEquipment('Ştanq');
    setThumbnailUrl('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80');
    setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    setExecutionSteps('1. Düzgün vəziyyət alın.\n2. Nəfəs alaraq enin.\n3. Nəfəs verərək qalxın.');
    setBenefits('Əzələ kütləsini və dözümlülüyünü artırır.');
    setRisksAndMistakes('İsinmədən ağır çəki götürməyin.');
    setCaloriesPerMin(8.0);
    setExerciseModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (ex) => {
    setEditingExerciseId(ex.id);
    setTitle(ex.title);
    setDescription(ex.description);
    setMuscleGroup(ex.muscleGroup);
    setDifficulty(ex.difficulty);
    setEquipment(ex.equipment);
    setThumbnailUrl(ex.thumbnailUrl);
    setVideoUrl(ex.videoUrl);
    setExecutionSteps(ex.executionSteps);
    setBenefits(ex.benefits);
    setRisksAndMistakes(ex.risksAndMistakes);
    setCaloriesPerMin(ex.estimatedCaloriesBurnedPerMin);
    setExerciseModalOpen(true);
  };

  // Save (Create or Update) Exercise
  const handleSaveExercise = async (e) => {
    e.preventDefault();
    setSavingExercise(true);
    try {
      const payload = {
        title,
        description,
        muscleGroup,
        difficulty,
        equipment,
        thumbnailUrl,
        videoUrl,
        executionSteps,
        benefits,
        risksAndMistakes,
        estimatedCaloriesBurnedPerMin: parseFloat(caloriesPerMin),
      };

      if (editingExerciseId) {
        await api.put(`/exercises/${editingExerciseId}`, payload);
      } else {
        await api.post('/exercises', payload);
      }

      setExerciseModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingExercise(false);
    }
  };

  // Delete Exercise
  const handleDeleteExercise = async (id) => {
    if (!window.confirm('Bu məşqi silmək istədiyinizdən əminsiniz?')) return;
    try {
      const res = await api.delete(`/exercises/${id}`);
      if (res.success) {
        setExercises((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Update User Role
  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.put('/admin/users/role', {
        userId,
        role: newRole,
      });
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole, roleName: newRole } : u))
        );
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Toggle User Active Status
  const handleStatusToggle = async (userId, currentActive) => {
    try {
      const res = await api.put('/admin/users/status', {
        userId,
        isActive: !currentActive,
      });
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isActive: !currentActive } : u))
        );
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete Package
  const handleDeletePackage = async (id) => {
    if (!window.confirm('Bu məşqçi paketini silmək istədiyinizdən əminsiniz?')) return;
    try {
      const res = await api.delete(`/workoutpackages/${id}`);
      if (res.success) {
        setPackages((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredExercises = exercises.filter(
    (e) =>
      e.title.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
      e.muscleGroup.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-rose-500" />
            Admin İdarəetmə Paneli
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            İstifadəçilərin idarəsi, məşqlərin CRUD əməliyyatları və platforma statistikası.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('exercises')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'exercises' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Məşqlər ({exercises.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'users' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            İstifadəçilər ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'packages' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Paketlər ({packages.length})
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <p className="text-xs text-slate-400">Ümumi İstifadəçi</p>
            <p className="text-2xl font-black text-white">{summary.totalUsers}</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <p className="text-xs text-slate-400">Məşq Bazası</p>
            <p className="text-2xl font-black text-emerald-400">{summary.totalExercises}</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <p className="text-xs text-slate-400">Məşqçi Paketləri</p>
            <p className="text-2xl font-black text-amber-400">{summary.totalPackages}</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <p className="text-xs text-slate-400">İcra Olunmuş Məşqlər</p>
            <p className="text-2xl font-black text-cyan-400">{summary.totalWorkoutsCompleted}</p>
          </div>
        </div>
      )}

      {/* TAB 1: EXERCISES CRUD */}
      {activeTab === 'exercises' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                placeholder="Məşqlərdə axtar..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-emerald-500 outline-none"
              />
            </div>

            <button
              onClick={handleOpenCreate}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" /> Yeni Məşq Əlavə Et
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <SkeletonTable rows={6} />
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 uppercase font-mono text-[10px] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4">Şəkil & Ad</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Əzələ Qrupu</th>
                    <th className="p-4">Çətinlik</th>
                    <th className="p-4">Kalori</th>
                    <th className="p-4 text-right">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredExercises.map((ex) => (
                    <tr key={ex.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={ex.thumbnailUrl}
                          alt={ex.title}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-950"
                        />
                        <span className="font-bold text-white">{ex.title}</span>
                      </td>
                      <td className="p-4 font-mono text-slate-400">/{ex.slug}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-emerald-400">
                          {ex.muscleGroup}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                          {ex.difficulty}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-amber-400">
                        {ex.estimatedCaloriesBurnedPerMin} kkal
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(ex)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="Redaktə et"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExercise(ex.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 uppercase font-mono text-[10px] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">İstifadəçi</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Email Təsdiqi</th>
                  <th className="p-4">Rol</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Məşqlər</th>
                  <th className="p-4">Qeydiyyat Tarixi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      {u.avatarUrl ? (
                        <img
                          src={u.avatarUrl}
                          alt={u.fullName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                          {u.fullName.charAt(0)}
                        </div>
                      )}
                      <span className="font-bold text-white">{u.fullName}</span>
                    </td>
                    <td className="p-4 text-slate-400">{u.email}</td>
                    <td className="p-4">
                      {u.isEmailConfirmed ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> Təsdiqlənib
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          Təsdiq gözləyir
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <select
                        value={u.roleName || u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none cursor-pointer"
                      >
                        <option value="User">User</option>
                        <option value="Trainer">Trainer</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleStatusToggle(u.id, u.isActive)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                          u.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                        }`}
                      >
                        {u.isActive ? 'Aktiv' : 'Deaktiv'}
                      </button>
                    </td>
                    <td className="p-4 font-mono font-bold text-white">
                      {u.totalWorkoutsLogged || 0}
                    </td>
                    <td className="p-4 text-slate-500 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PACKAGES MANAGEMENT */}
      {activeTab === 'packages' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 uppercase font-mono text-[10px] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Paket Adı</th>
                  <th className="p-4">Məşqçi</th>
                  <th className="p-4">Hədəf</th>
                  <th className="p-4">Müddət</th>
                  <th className="p-4">Hərəkət Sayı</th>
                  <th className="p-4 text-right">Əməliyyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {packages.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-bold text-white">{p.title}</td>
                    <td className="p-4 text-emerald-400">{p.trainerName}</td>
                    <td className="p-4">{p.goal}</td>
                    <td className="p-4">{p.durationWeeks} həftə</td>
                    <td className="p-4 font-bold">{p.exercises?.length || 0} məşq</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeletePackage(p.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Exercise Create / Edit Modal with Cloudinary Upload */}
      {exerciseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            <h3 className="text-xl font-bold text-white">
              {editingExerciseId ? 'Məşqə Düzəliş Et' : 'Yeni Məşq Əlavə Et'}
            </h3>

            <form onSubmit={handleSaveExercise} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Məşqin Başlığı:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Məs: Barbell Bench Press"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Əzələ Qrupu:
                  </label>
                  <select
                    value={muscleGroup}
                    onChange={(e) => setMuscleGroup(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  >
                    {MUSCLE_GROUPS.map((mg) => (
                      <option key={mg} value={mg}>
                        {mg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Çətinlik:
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Yandırılan Kalori (kkal/dəq):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={caloriesPerMin}
                    onChange={(e) => setCaloriesPerMin(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Avadanlıq:
                </label>
                <input
                  type="text"
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  placeholder="Ştanq, Skamya"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                />
              </div>

              {/* Media Cloud Upload Section */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4" /> Cloud CDN Media Yükləmə (Şəkil və Video)
                  </span>
                </div>

                {/* Thumbnail upload */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Şəkil Thumbnail URL (Cloud CDN):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                      required
                    />
                    <label className="cursor-pointer px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg shrink-0">
                      <span>{uploadingImage ? 'Yüklənir...' : 'Kompüterdən Seç'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Video upload */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Video URL (7-8 saniyəlik Cloud CDN):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                      required
                    />
                    <label className="cursor-pointer px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg shrink-0">
                      <span>{uploadingVideo ? 'Yüklənir...' : 'Kompüterdən Video Seç'}</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        disabled={uploadingVideo}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Qısa Təsvir:
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  İcra Qaydası (Addım-addım):
                </label>
                <textarea
                  rows={3}
                  value={executionSteps}
                  onChange={(e) => setExecutionSteps(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-emerald-400 mb-1">
                    Faydalı Cəhətləri:
                  </label>
                  <textarea
                    rows={2}
                    value={benefits}
                    onChange={(e) => setBenefits(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-rose-400 mb-1">
                    Səhvlər və Risklər:
                  </label>
                  <textarea
                    rows={2}
                    value={risksAndMistakes}
                    onChange={(e) => setRisksAndMistakes(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setExerciseModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={savingExercise || uploadingImage || uploadingVideo}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  {savingExercise ? 'Yadda saxlanılır...' : 'Yadda Saxla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
