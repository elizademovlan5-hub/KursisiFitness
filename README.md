# 🏋️ Kursisi.Fit — Professional Gym & Workout Web Platform

[![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-9.0%2F10.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Entity Framework Core](https://img.shields.io/badge/EF_Core-SQLite%2FSQL_Server-512BD4)](https://learn.microsoft.com/ef/core/)
[![xUnit](https://img.shields.io/badge/Unit_Tests-xUnit_Passed-brightgreen)](https://xunit.net/)

> **ASP.NET Core Web API + React kurs layihəsi.**  
> Clean Architecture standartlarına tam uyğun olaraq hazırlanmış, Clean Code və SOLID prinsiplərini dəstəkləyən, bazara çıxarıla biləcək səviyyədə tam funksional Full-Stack fitnes və məşq idarəetmə platforması.

---

## 📌 Mündəricat
- [Layihənin Məqsədi](#-layihənin-məqsədi)
- [Arxitektura və Texnoloji Stack](#-arxitektura-və-texnoloji-stack)
- [Müəllimin Tələblərinə Uyğun Xüsusi Həllər](#-müəllimin-tələblərinə-uyğun-xüsusi-həllər)
- [Funksionallıqlar və İmkanlar (25+ Tələb)](#-funksionallıqlar-və-imkanlar)
- [Layihənin Qovluq Strukturu](#-layihənin-qovluq-strukturu)
- [İşə Salma Təlimatı](#-işə-salma-təlimatı)
  - [Backend-in İşə Salınması](#1-backend-aspnet-core-web-api)
  - [Frontend-in İşə Salınması](#2-frontend-react--vite)
- [Sınaq üçün Hazır Hesablar](#-sınaq-üçün-hazır-hesablar)
- [API Endpointləri və Sənədləşmə (Swagger)](#-api-endpointləri-və-sənədləşmə)
- [Unit Testlər](#-unit-testlər)

---

## 🎯 Layihənin Məqsədi

Gündəlik idman zalına gedən şəxslər və fərdi məşqçilər üçün vahid ekosistem təmin etmək:
- İstifadəçilər hərəkətlərin 7-8 saniyəlik qısa videolarını izləyə, faydaları və səhvləri ilə tanış ola bilirlər.
- Şəxsi boy və çəki məlumatlarını daxil edərək ağıllı BMI alqoritmi vasitəsilə fərdiləşdirilmiş məşq və kalori təklifi ala bilirlər.
- Həftəlik günlər üzrə məşq cədvəli tərtib edir, icra olunmuş dəst/təkrar/çəkiləri qeyd edərək gündəlik və həftəlik statistikalarını izləyirlər.
- Hər ay üçün bədən transformasiya şəkillərini və bədən ölçülərini Cloud CDN-ə yükləyərək inkişafı arxivləşdirirlər.
- Məşqçilər öz xüsusi 4-8 həftəlik paketlərini (2-3 san. video nümayiş ilə) əlavə edir, istifadəçilər isə bir kliklə həmin proqramları öz cədvəllərinə tətbiq edə bilirlər.

---

## 🛠 Arxitektura və Texnoloji Stack

### **Backend:**
- **Framework:** ASP.NET Core Web API (Target: .NET 9.0 / 10.0)
- **Arxitektura:** **Clean Architecture** (Domain, Application, Infrastructure, API)
- **Verilənlər Bazası:** SQLite (avtomatik `kursisi.db` yaradılması ilə istənilən kompüterdə dərhal işə düşür) / SQL Server dəstəyi
- **ORM:** Entity Framework Core (Code-First, Fluent API, Auto-Seeding)
- **Autentifikasiya:** JWT (JSON Web Token) Bearer Token + Role-based Authorization (`Admin`, `Trainer`, `User`)
- **Təhlükəsizlik:** BCrypt Password Hashing, 6 rəqəmli OTP Email təsdiq sistemi
- **Media İdarəsi:** Cloud CDN & Cloudinary Integration (Fiziki layihədə və ya DB-də heç bir şəkil/video saxlanılmır)
- **Sənədləşmə:** Swagger / OpenAPI UI (`/swagger`)
- **Xətaların İdarəsi:** Global Exception Handling Middleware
- **Test:** xUnit ilə biznes məntiqi vahid testləri

### **Frontend:**
- **Kitabxana:** React (Vite 8)
- **Dizayn:** Tailwind CSS (v4), Lucide React İkonları
- **Routing:** React Router DOM (v7)
- **Şəbəkə Sorğuları:** Axios (avtomatik JWT injection və Error Interceptors ilə)
- **Skeleton:** Məlumatlar yüklənərkən animasiyalı Skeleton kartları və cədvəlləri
- **Dillər (i18n):** Azərbaycan (AZ) və İngilis (EN) dilləri arasında canlı keçid düyməsi

---

## 💎 Müəllimin Tələblərinə Uyğun Xüsusi Həllər

1. **Cloud Media Storage & CDN:**  
   Şəkil və videolar fiziki olaraq DB-də və ya layihə qovluğunda saxlanılmır. Bütün media Cloudinary və yüksək sürətli Cloud CDN (Unsplash / Cloud Video CDN) üzərindən optimallaşdırılmış şəkildə çağırılır və yüklənir.
2. **URL Query Parametrləri ilə Filter & Search:**  
   Məşqlər səhifəsində axtarış, əzələ qrupu və çətinlik seçimi birbaşa URL parametrinə yazılır və link kopyalandıqda birbaşa həmin filtrlərlə açılır:  
   `http://localhost:3000/exercises?search=press&muscle=Chest&difficulty=Intermediate`
3. **ID Əvəzinə SEO-Friendly Slug:**  
   Bütün məşqlər və məşqçi paketləri ID əvəzinə təmiz slug ilə işləyir:  
   `/exercises/barbell-bench-press`, `/packages/4-heftelik-yag-yandirma-ve-ezele-formalashdirma`.  
   Azərbaycan şriftlərini (`ə`, `ı`, `ö`, `ü`, `ş`, `ç`, `ğ`) avtomatik təmiz slug-a çevirən xüsusi `SlugHelper` tətbiq olunub.
4. **Email OTP Təsdiqi ilə Qeydiyyat:**  
   İstifadəçi qeydiyyatdan keçdikdə hesab birbaşa aktivləşmir. Sistem 6 rəqəmli OTP kod generasiya edir və emailə göndərir (test üçün backend konsolunda da parıldayan qutuda göstərilir). OTP təsdiqləndikdən sonra qeydiyyat tamamlanır.
5. **Google ilə Sign-In:**  
   Daxil ol səhifəsində Google OAuth / Google Sign-in seçimi mövcuddur.
6. **Skeleton Yükləmə:**  
   Heç bir boş ekran və ya kobud spinner görünmür; bütün məşqlər, cədvəllər və təfərrüatlar yüklənərkən Skeleton Shimmer animasiyası göstərilir.
7. **Tam İşlək UI / UX:**  
   İşləməyən heç bir düymə və ya komponent göstərilmir.

---

## 📋 Funksionallıqlar və İmkanlar

| # | Funksionallıq | Status |
|---|---|:---:|
| 1 | İstifadəçi qeydiyyatı | ✅ |
| 2 | İstifadəçi girişi (JWT Auth) | ✅ |
| 3 | İstifadəçi profil məlumatlarına baxış və yeniləmə | ✅ |
| 4 | Bütün məşqlərin kataloqu | ✅ |
| 5 | Məşqləri adına görə canlı axtarış (URL Param) | ✅ |
| 6 | Məşqləri əzələ qrupuna görə filterləmə (URL Param) | ✅ |
| 7 | Məşqləri çətinlik səviyyəsinə görə filterləmə (URL Param) | ✅ |
| 8 | Hər məşqin detalları (Slug ilə) | ✅ |
| 9 | Məşqi həftəlik plana əlavə etmək (Gün, set, təkrar, çəki) | ✅ |
| 10 | Həftəlik məşq cədvəlinə baxış | ✅ |
| 11 | Plandakı məşqləri silmək | ✅ |
| 12 | Məşqi tamamlandı kimi qeyd etmək (Faktiki nəticə ilə) | ✅ |
| 13 | Gündəlik məşq nəticəsi və yandırılan kalori xülasəsi | ✅ |
| 14 | Həftəlik statistika kartları və əzələ bölgüsü | ✅ |
| 15 | Tamamlanmış məşqlərin tam tarixçəsi | ✅ |
| 16 | Admin: Yeni məşq əlavə etmək (Cloud CDN media ilə) | ✅ |
| 17 | Admin: Mövcud məşqi redaktə etmək | ✅ |
| 18 | Admin: Məşqi silmək | ✅ |
| 19 | Admin: İstifadəçiləri idarə etmək (Rol dəyişmək, deaktiv etmək) | ✅ |
| 20 | Admin və User rollarına görə səlahiyyət bölgüsü | ✅ |
| 21 | Profil şəkli yükləmək (Cloud CDN) | ✅ |
| 22 | Məşq hərəkətini necə etməli: 7-8 saniyəlik video icra nümayişi | ✅ |
| 23 | Hər ay üçün inkişaf şəkli və ölçülərin yüklənməsi | ✅ |
| 24 | Boy və çəki üçün ağıllı BMI və məşq proqram təklifi | ✅ |
| 25 | Şəkil və videoların Cloud CDN vasitəsilə saxlanması | ✅ |
| 26 | Məşqçinin şəxsi planları və istifadəçilərin proqramı seçməsi | ✅ |
| 27 | Məşq planının icrası ilə 2-3 saniyəlik qısa video | ✅ |
| 28 | Məşq planına ətraflı məlumat: Faydalı və diqqət edilməli məqamlar | ✅ |
| 29 | Şərhlər və 5-ulduzlu reytinq sistemi | ✅ |
| 30 | Canlı dil dəyişməsi (AZ / EN) | ✅ |

---

## 📁 Layihənin Qovluq Strukturu

```
Kursisi/
├── backend/
│   ├── Kursisi.slnx
│   ├── src/
│   │   ├── Kursisi.Domain/          # Core Varlıqlar, Enums, BaseEntity
│   │   ├── Kursisi.Application/     # DTO-lar, Interfaces, Services, Helpers
│   │   ├── Kursisi.Infrastructure/  # EF Core DbContext, SeedData, JWT, Cloudinary, Email
│   │   └── Kursisi.API/             # Controllers, Middlewares, Program.cs, appsettings.json
│   └── tests/
│       └── Kursisi.Tests/           # xUnit Vahid Testləri (BMI, Slug, Workout Logic)
├── frontend/
│   ├── src/
│   │   ├── api/                     # Axios Client və Request Interceptors
│   │   ├── components/              # Navbar, Footer, Skeletons, VideoModal, ExerciseCard
│   │   ├── context/                 # AuthContext, LanguageContext
│   │   ├── i18n/                    # az.js, en.js tərcümə lüğətləri
│   │   └── pages/                   # Home, Exercises, WeeklyPlan, Calculator, Admin, etc.
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 İşə Salma Təlimatı

### 1. Backend (ASP.NET Core Web API)

Backend qovluğuna keçid edin və layihəni işə salın:

```bash
cd backend
dotnet restore
dotnet run --project src/Kursisi.API/Kursisi.API.csproj --launch-profile http
```

- API ünvanı: **`http://localhost:5000`**
- Swagger UI sənədləşməsi: **`http://localhost:5000/swagger`**
- *Qeyd:* Layihə işə düşən anda avtomatik olaraq SQLite verilənlər bazası (`kursisi.db`) yaradılır və bütün ilkin məşqlər, məşqçi paketləri və test istifadəçiləri bazaya doldurulur. Əlavə heç bir DB skripti işlətməyə ehtiyac yoxdur!

### 2. Frontend (React + Vite)

Ayrı bir terminal pəncərəsində frontend qovluğuna keçin:

```bash
cd frontend
npm install
npm run dev
```

- Tətbiq açılacaq: **`http://localhost:3000`** (və ya terminalda göstərilən port)

---

## 🔑 Sınaq üçün Hazır Hesablar

Yoxlama zamanı vaxt itirməmək üçün Login səhifəsində 1 kliklə seçilə bilən və ya aşağıdakı məlumatlarla daxil ola biləcəyiniz hazır hesablar:

| Rol | Email | Şifrə | Səlahiyyətlər |
|---|---|---|---|
| **Admin** | `admin@kursisi.com` | `Admin123!` | Bütün CRUD, İstifadəçi İdarəsi, Admin Panel |
| **Məşqçi (Trainer)** | `trainer@kursisi.com` | `Trainer123!` | Məşq əlavə etmək, Məşqçi Paketləri yaratmaq |
| **İstifadəçi (User)** | `user@kursisi.com` | `User123!` | Həftəlik plan, Aylıq şəkillər, Statistika, BMI |

> Yeni istifadəçi kimi qeydiyyatdan keçdikdə daxil etdiyiniz emailə göndərilən 6 rəqəmli OTP kod dərhal **Backend Konsol Terminalında** parlaq çərçivədə çap olunur. Həmin kodu daxil edərək qeydiyyatı tamamlaya bilərsiniz.

---

## 🧪 Unit Testlər

Tətbiqin kritik biznes məntiqi (Bədən kütlə indeksinin hesablanması, kalori paylanması, slug generasiyası və məşq statistikaları) xUnit ilə əhatə olunmuşdur.

Testləri işə salmaq üçün:

```bash
cd backend
dotnet test tests/Kursisi.Tests/Kursisi.Tests.csproj
```

**Nəticə:**
```
Passed! - Failed: 0, Passed: 11, Skipped: 0, Total: 11, Duration: 56 ms
```

---

## 👨‍💻 Müəllif və Təqdimat

Bu layihə kurs layihəsi tələbləri və müəllimin tövsiyələri nəzərə alınaraq yüksək keyfiyyət standartları ilə hazırlanmışdır. Həm lokal mühitdə sıfır xəta ilə işləyir, həm də istənilən Cloud mühitinə (Azure, Render, Railway, Vercel) birbaşa deploy edilə bilər.
