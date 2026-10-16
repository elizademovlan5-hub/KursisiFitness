using Kursisi.Domain.Entities;
using Kursisi.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Kursisi.Infrastructure.Persistence;

public static class SeedData
{
    public static async Task InitializeAsync(ApplicationDbContext context)
    {
        // Apply pending migrations or ensure database is created
        await context.Database.EnsureCreatedAsync();

        // 1. Seed Users if not present
        if (!await context.Users.AnyAsync())
        {
            var admin = new User
            {
                FullName = "Admin İdarəçi",
                Email = "admin@kursisi.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                Role = UserRole.Admin,
                IsEmailConfirmed = true,
                AvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
                HeightCm = 180,
                WeightKg = 82,
                TargetGoal = FitnessGoal.Maintenance,
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-3)
            };

            var trainer = new User
            {
                FullName = "Murad Əliyev (Baş Məşqçi)",
                Email = "trainer@kursisi.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Trainer123!"),
                Role = UserRole.Trainer,
                IsEmailConfirmed = true,
                AvatarUrl = "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=300&q=80",
                HeightCm = 185,
                WeightKg = 88,
                TargetGoal = FitnessGoal.MuscleGain,
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-2)
            };

            var user = new User
            {
                FullName = "Tural Qasımov",
                Email = "user@kursisi.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"),
                Role = UserRole.User,
                IsEmailConfirmed = true,
                AvatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
                HeightCm = 178,
                WeightKg = 79,
                TargetGoal = FitnessGoal.WeightLoss,
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-2)
            };

            context.Users.AddRange(admin, trainer, user);
            await context.SaveChangesAsync();
        }

        // 2. Seed Exercises if not present
        if (!await context.Exercises.AnyAsync())
        {
            var exercises = new List<Exercise>
            {
                new()
                {
                    Title = "Barbell Bench Press",
                    Slug = "barbell-bench-press",
                    Description = "Döş (sinə) əzələlərinin böyüməsi və yuxarı bədən gücü üçün klassik baza hərəkəti.",
                    MuscleGroup = MuscleGroupType.Chest,
                    Difficulty = DifficultyLevel.Intermediate,
                    Equipment = "Ştanq, Skamya",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
                    VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    ExecutionSteps = "1. Skamyaya uzanın və ayaqlarınızı möhkəm yerə basın.\n2. Ştanqı çiyin enindən bir qədər geniş tutun.\n3. Nəfəs alaraq ştanqı nəzarətli şəkildə sinənin aşağı hissəsinə endirin.\n4. Nəfəs verərək dirsəkləri kilidləmədən yuxarı qaldırın.",
                    Benefits = "Sinə əzələlərinin qalınlığını artırır, triseps və ön çiyin əzələlərini paralel olaraq inkişaf etdirir.",
                    RisksAndMistakes = "Ştanqı sinədən sıçratmaq olmaz. Dirsəkləri bədəndən 90 dərəcə kənara açmaq çiyin oynağına zərər verə bilər (təxminən 70-75 dərəcə saxlayın).",
                    EstimatedCaloriesBurnedPerMin = 8.5,
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                },
                new()
                {
                    Title = "Incline Dumbbell Press",
                    Slug = "incline-dumbbell-press",
                    Description = "Sinənin yuxarı hissəsini (Upper Chest) xüsusi hədəf alan qantel ilə sıxma hərəkəti.",
                    MuscleGroup = MuscleGroupType.Chest,
                    Difficulty = DifficultyLevel.Beginner,
                    Equipment = "Qantellər, Meyilli skamya",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
                    VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    ExecutionSteps = "1. Skamyanı 30-45 dərəcə bucağa qaldırın.\n2. Qantelləri sinə səviyyəsində saxlayın.\n3. Nəfəs verərək qantelləri yuxarı doğru bir-birinə yaxınlaşdıraraq qaldırın.\n4. Yuxarıda sinəni 1 saniyə sıxın və yavaşca endirin.",
                    Benefits = "Sol və sağ əzələ balanssızlığını aradan qaldırır, körpücük sümüyü ətrafındakı sinə həcmini artırır.",
                    RisksAndMistakes = "Bucağı 45 dərəcədən yuxarı qaldırmaq yükü sinədən çiyinlərə keçirir.",
                    EstimatedCaloriesBurnedPerMin = 7.5,
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                },
                new()
                {
                    Title = "Push-Ups (Otjimaniya)",
                    Slug = "push-ups",
                    Description = "Heç bir avadanlıq tələb etməyən ən effektiv xüsusi bədən çəkisi ilə sinə və qol hərəkəti.",
                    MuscleGroup = MuscleGroupType.Chest,
                    Difficulty = DifficultyLevel.Beginner,
                    Equipment = "Yoxdur (Bədən çəkisi)",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80",
                    VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    ExecutionSteps = "1. Əlləri çiyin bərabərində yerə qoyub plank vəziyyəti alın.\n2. Bədəni düz xətt şəklində saxlayaraq sinə yerə toxunana yaxın endirin.\n3. Nəfəs verərək əvvəlki mövqeyə qayıdın.",
                    Benefits = "Hər yerdə edilə bilər, qarın presini və bədən sabitliyini (core) gücləndirir.",
                    RisksAndMistakes = "Beli aşağı əymək və ya ombanı həddindən artıq yuxarı qaldırmaq olmaz.",
                    EstimatedCaloriesBurnedPerMin = 7.0,
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                },
                new()
                {
                    Title = "Pull-Ups (Turnikdə Çəkinmə)",
                    Slug = "pull-ups",
                    Description = "Kürək əzələlərini genişləndirən (V-taper forması) ən fundamental bədən çəkisi hərəkəti.",
                    MuscleGroup = MuscleGroupType.Back,
                    Difficulty = DifficultyLevel.Intermediate,
                    Equipment = "Turnik",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80",
                    VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    ExecutionSteps = "1. Turnikdən çiyinlərdən bir qədər geniş tutuşla asılın.\n2. Kürək əzələlərini sıxaraq çənə turnik səviyyəsini keçənə qədər dartılın.\n3. Nəzarətlə və yellənmədən başlanğıc vəziyyətinə düşün.",
                    Benefits = "Kürəyi genişləndirir, bisepsləri və qol tutuş gücünü möhkəmləndirir.",
                    RisksAndMistakes = "Ayaqlarla təkan vermək (kipping) və kürək yerinə yalnız qollardan istifadə etmək effektivliyi azaldır.",
                    EstimatedCaloriesBurnedPerMin = 9.0,
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                },
                new()
                {
                    Title = "Barbell Deadlift",
                    Slug = "barbell-deadlift",
                    Description = "Bütün bədənin gücünü, onurğa sütunu əzələlərini və arxa ayaq zəncirini quran kral hərəkət.",
                    MuscleGroup = MuscleGroupType.Back,
                    Difficulty = DifficultyLevel.Advanced,
                    Equipment = "Ştanq, Disklər",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
                    VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    ExecutionSteps = "1. Ayaqları çiyin enində açaraq ştanqın önündə dayanın.\n2. Beli tam düz saxlayaraq dizləri bükün və ştanqdan tutun.\n3. Ayaqlarla yerə basaraq gövdəni dikəldin və ştanqı qaldırın.\n4. Nəzarətlə yerə qoyun.",
                    Benefits = "Hormon ifrazını stimullaşdırır, bütün arxa zənciri və mərkəz gücünü artırır.",
                    RisksAndMistakes = "Beli dairəvi (qozbel) əymək ciddi onurğa yırtıqlarına səbəb ola bilər. Mütləq kəmərdən və düzgün texnikadan istifadə edin.",
                    EstimatedCaloriesBurnedPerMin = 11.0,
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                },
                new()
                {
                    Title = "Seated Cable Row",
                    Slug = "seated-cable-row",
                    Description = "Kürəyin mərkəzi və qalınlığını inkişaf etdirmək üçün blokda dartma hərəkəti.",
                    MuscleGroup = MuscleGroupType.Back,
                    Difficulty = DifficultyLevel.Beginner,
                    Equipment = "Kabel trenajoru",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=800&q=80",
                    VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    ExecutionSteps = "1. Skamyaya əyləşin, ayaqları dayaqlara qoyun.\n2. Dəstəkdən tutaraq kürəyi düz saxlayın.\n3. Nəfəs verərək dəstəyi qarın nahiyəsinə doğru dartın və kürək pərlərini birləşdirin.\n4. Yavaşca irəli buraxın.",
                    Benefits = "Duruşu (posturanı) yaxşılaşdırır, kürəyin qalınlığını və arxa deltanı inkişaf etdirir.",
                    RisksAndMistakes = "Dartma zamanı beli geriyə həddindən artıq yelləmək olmaz.",
                    EstimatedCaloriesBurnedPerMin = 7.0,
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                },
                new()
                {
                    Title = "Overhead Shoulder Press",
                    Slug = "overhead-shoulder-press",
                    Description = "Çiyinlərin ön və yan hissələrini böyütmək üçün dik vəziyyətdə baş üzərinə sıxma.",
                    MuscleGroup = MuscleGroupType.Shoulders,
                    Difficulty = DifficultyLevel.Intermediate,
                    Equipment = "Ştanq və ya Qantellər",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80",
                    VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    ExecutionSteps = "1. Ştanqı sinənin üst hissəsində saxlayın.\n2. Core əzələlərini gərgin tutaraq ştanqı başınızın üzərinə doğru qaldırın.\n3. Yuxarıda qolları tam uzadıb nəzarətlə əvvəlki vəziyyətə endirin.",
                    Benefits = "Geniş çiyin quruluşu yaradır, triseps və trapetsiyaları möhkəmləndirir.",
                    RisksAndMistakes = "Qaldırarkən beli həddindən artıq arxaya əymək bel nahiyəsini zədələyə bilər.",
                    EstimatedCaloriesBurnedPerMin = 8.0,
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                },
                new()
                {
                    Title = "Dumbbell Lateral Raise",
                    Slug = "dumbbell-lateral-raise",
                    Description = "Çiyinlərə kürə (yumru) forma verən yan deltoid izolyasiya hərəkəti.",
                    MuscleGroup = MuscleGroupType.Shoulders,
                    Difficulty = DifficultyLevel.Beginner,
                    Equipment = "Qantellər",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
                    VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    ExecutionSteps = "1. Əllərdə yüngül çəkili qantellərlə dik durun.\n2. Dirsəkləri yüngülcə bükərək qolları yanlara doğru çiyin hündürlüyünə qədər qaldırın.\n3. Nəzarətlə aşağı endirin.",
                    Benefits = "Çiyinləri vizual olaraq genişləndirir, bədən proporsiyasını mükəmməlləşdirir.",
                    RisksAndMistakes = "Ağır çəki götürərək bədənlə yellənmək hərəkətin effektivliyini tamamilə sıfırlayır.",
                    EstimatedCaloriesBurnedPerMin = 6.5,
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                },
                new()
                {
                    Title = "Barbell Squat",
                    Slug = "barbell-squat",
                    Description = "Ayaq və omba əzələləri üçün bütün məşq dünyasının 1 nömrəli hərəkəti.",
                    MuscleGroup = MuscleGroupType.Legs,
                    Difficulty = DifficultyLevel.Intermediate,
                    Equipment = "Ştanq, Çərçivə (Rack)",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
                    VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    ExecutionSteps = "1. Ştanqı trapetsiyanın üzərinə yerləşdirin.\n2. Ayaqları çiyin enindən bir az geniş qoyun, pəncələri azca kənara yönəldin.\n3. Budlar yerə paralel olana qədər oturun və dabanlardan güc alaraq dikəlin.",
                    Benefits = "Kvadriceps, omba və diz bağlarını gücləndirir, güclü anabolik təsir göstərir.",
                    RisksAndMistakes = "Dizləri içəri bükmək və ya dabanları yerdən qaldırmaq diz oynağına ağır zərbə vurur.",
                    EstimatedCaloriesBurnedPerMin = 10.5,
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                },
                new()
                {
                    Title = "Leg Press",
                    Slug = "leg-press",
                    Description = "Onurğaya yük salmadan ayaq əzələlərini maksimum yükləməyə imkan verən trenajor hərəkəti.",
                    MuscleGroup = MuscleGroupType.Legs,
                    Difficulty = DifficultyLevel.Beginner,
                    Equipment = "Leg Press trenajoru",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=800&q=80",
                    VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    ExecutionSteps = "1. Trenajorun oturacağına əyləşin və ayaqları platformanın ortasına qoyun.\n2. Təhlükəsizlik qollarını açıb platformanı dizləri 90 dərəcə bükərək özünüzə yaxınlaşdırın.\n3. Dizləri tam kilidləmədən platformanı yuxarı sıxın.",
                    Benefits = "Bel problemləri olanlar üçün squat əvəzinə təhlükəsiz və ağır yüklənmə təmin edir.",
                    RisksAndMistakes = "Yuxarı nöqtədə dizləri tam bağlayıb kilidləmək diz zədələnməsinə səbəb ola bilər.",
                    EstimatedCaloriesBurnedPerMin = 8.5,
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                },
                new()
                {
                    Title = "Barbell Biceps Curl",
                    Slug = "barbell-biceps-curl",
                    Description = "Qol biseps əzələlərinin zirvəsini və qalınlığını inkişaf etdirmək üçün klassik hərəkət.",
                    MuscleGroup = MuscleGroupType.Arms,
                    Difficulty = DifficultyLevel.Beginner,
                    Equipment = "Düz və ya EZ Ştanq",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
                    VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    ExecutionSteps = "1. Ştanqı ovuc içləri yuxarı baxacaq şəkildə tutun.\n2. Dirsəkləri gövdəyə yaxın saxlayaraq ştanqı sinəyə doğru bükün.\n3. Bisepsi sıxıb yavaşca aşağı endirin.",
                    Benefits = "Güclü qollar və yüksək qol həcmi formalaşdırır.",
                    RisksAndMistakes = "Dirsəkləri irəli atmaq və beli yelləmək hərəkətin gərginliyini azaldır.",
                    EstimatedCaloriesBurnedPerMin = 6.0,
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                },
                new()
                {
                    Title = "Triceps Dips",
                    Slug = "triceps-dips",
                    Description = "Qolun arxa triseps əzələsini və sinənin aşağısını gücləndirən bədən çəkisi hərəkəti.",
                    MuscleGroup = MuscleGroupType.Arms,
                    Difficulty = DifficultyLevel.Intermediate,
                    Equipment = "Brus (Paralel qollar)",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80",
                    VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    ExecutionSteps = "1. Brusda qollar üzərində düz qalxın.\n2. Gövdəni bir qədər dik saxlayaraq dirsəkləri 90 dərəcə olana qədər bədəni endirin.\n3. Trisepsləri sıxaraq yenidən yuxarı qalxın.",
                    Benefits = "Qolun ümumi kütləsinin 60%-ni təşkil edən trisepsləri gücləndirir.",
                    RisksAndMistakes = "90 dərəcədən aşağı həddindən artıq enmək çiyin bağlarını zədələyə bilər.",
                    EstimatedCaloriesBurnedPerMin = 7.5,
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                },
                new()
                {
                    Title = "Plank",
                    Slug = "plank",
                    Description = "Qarın presini, onurğa ətrafı daxili əzələləri bərkidən statik dözümlülük hərəkəti.",
                    MuscleGroup = MuscleGroupType.Abs,
                    Difficulty = DifficultyLevel.Beginner,
                    Equipment = "Mat",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=800&q=80",
                    VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    ExecutionSteps = "1. Qolları dirsəkdən bükərək yerə qoyun və ayaq ucları üstündə dayanın.\n2. Bədəni başdan ayağa qədər düz xətt vəziyyətində saxlayın.\n3. Qarın əzələlərini tam sıxaraq nəfəsi nizamlayın.",
                    Benefits = "Bel ağrılarını azaldır, duruşu düzəldir, qarın əzələlərini möhkəmləndirir.",
                    RisksAndMistakes = "Beli aşağı sallamaq və ya nəfəsi saxlamaq olmaz.",
                    EstimatedCaloriesBurnedPerMin = 5.5,
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                },
                new()
                {
                    Title = "Hanging Leg Raise",
                    Slug = "hanging-leg-raise",
                    Description = "Alt qarın presini xüsusilə izolyasiya edən və dərinləşdirən turnik hərəkəti.",
                    MuscleGroup = MuscleGroupType.Abs,
                    Difficulty = DifficultyLevel.Intermediate,
                    Equipment = "Turnik",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80",
                    VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    ExecutionSteps = "1. Turnikdən asılın.\n2. Bədəni yelləmədən ayaqları düz və ya dizləri yüngül bükərək 90 dərəcə bucağa qaldırın.\n3. Yuxarıda presi sıxaraq yavaşca endirin.",
                    Benefits = "Alt qarın yağlarının yandırılması və bərkiməsi üçün ən güclü hərəkətlərdəndir.",
                    RisksAndMistakes = "İnertsiya ilə yellənərək qaldırmaq əzələ yerinə bağları yükləyir.",
                    EstimatedCaloriesBurnedPerMin = 7.0,
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                },
                new()
                {
                    Title = "Burpees",
                    Slug = "burpees",
                    Description = "Partlayıcı güc, dözümlülük və maksimum kalori yandırma təmin edən tam bədən kardio hərəkəti.",
                    MuscleGroup = MuscleGroupType.Cardio,
                    Difficulty = DifficultyLevel.Advanced,
                    Equipment = "Yoxdur (Bədən çəkisi)",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
                    VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    ExecutionSteps = "1. Dik durun, çömbəlib əlləri yerə qoyun.\n2. Tullanaraq ayaqları arxaya atıb otjimaniya vəziyyəti alın.\n3. Bir otjimaniya edib ayaqları geri çəkin və yuxarı tullanaraq əlləri baş üzərində çırpın.",
                    Benefits = "Ürək-damar dözümlülüyünü artırır, qısa müddətdə böyük miqdarda yağ yandırır.",
                    RisksAndMistakes = "Beli nəzarətsiz yerə çırpmaq onurğaya ziyan vura bilər.",
                    EstimatedCaloriesBurnedPerMin = 13.5,
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                },
                new()
                {
                    Title = "Kettlebell Swing",
                    Slug = "kettlebell-swing",
                    Description = "Omba, arxa ayaq və qarın əzələlərini gücləndirən partlayıcı funksional güc hərəkəti.",
                    MuscleGroup = MuscleGroupType.FullBody,
                    Difficulty = DifficultyLevel.Intermediate,
                    Equipment = "Qirya (Kettlebell)",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80",
                    VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    ExecutionSteps = "1. Qiryanı ayaqlar arasında yerləşdirin.\n2. Beli düz saxlayaraq ombanı arxaya aparın (hip hinge).\n3. Ombadan partlayıcı güc alaraq qiryanı sinə səviyyəsinə qədər yelləyin.",
                    Benefits = "Bütün arxa zəncir əzələlərini işlədir və güclü kardio effekti yaradır.",
                    RisksAndMistakes = "Qiryanı qollarla qaldırmağa çalışmaq olmaz; əsas güc ombanın açılmasından gəlməlidir.",
                    EstimatedCaloriesBurnedPerMin = 11.0,
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                }
            };

            context.Exercises.AddRange(exercises);
            await context.SaveChangesAsync();
        }

        // 3. Seed Workout Packages if not present
        if (!await context.WorkoutPackages.AnyAsync())
        {
            var trainer = await context.Users.FirstOrDefaultAsync(u => u.Role == UserRole.Trainer);
            var benchPress = await context.Exercises.FirstOrDefaultAsync(e => e.Slug == "barbell-bench-press");
            var squat = await context.Exercises.FirstOrDefaultAsync(e => e.Slug == "barbell-squat");
            var pullUps = await context.Exercises.FirstOrDefaultAsync(e => e.Slug == "pull-ups");
            var burpees = await context.Exercises.FirstOrDefaultAsync(e => e.Slug == "burpees");
            var plank = await context.Exercises.FirstOrDefaultAsync(e => e.Slug == "plank");
            var deadlift = await context.Exercises.FirstOrDefaultAsync(e => e.Slug == "barbell-deadlift");

            if (trainer != null)
            {
                var package1 = new WorkoutPackage
                {
                    TrainerId = trainer.Id,
                    Title = "4 Həftəlik Yağ Yandırma və Əzələ Formalaşdırma",
                    Slug = "4-heftelik-yag-yandirma-ve-ezele-formalashdirma",
                    Description = "Metabolizmi sürətləndirən, bədəndəki artıq piyləri yandıraraq relyefli və tonuslu əzələ quran intensiv proqram.",
                    Goal = FitnessGoal.WeightLoss,
                    Difficulty = DifficultyLevel.Intermediate,
                    DurationWeeks = 4,
                    PreviewVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
                    Price = 0,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                };

                if (burpees != null) package1.PackageExercises.Add(new PackageExercise { ExerciseId = burpees.Id, DayOfWeek = DayOfWeekEnum.Monday, Sets = 4, Reps = 15, RestSeconds = 45, OrderIndex = 1 });
                if (squat != null) package1.PackageExercises.Add(new PackageExercise { ExerciseId = squat.Id, DayOfWeek = DayOfWeekEnum.Monday, Sets = 3, Reps = 12, RestSeconds = 60, OrderIndex = 2 });
                if (plank != null) package1.PackageExercises.Add(new PackageExercise { ExerciseId = plank.Id, DayOfWeek = DayOfWeekEnum.Wednesday, Sets = 3, Reps = 60, RestSeconds = 45, OrderIndex = 1 });
                if (pullUps != null) package1.PackageExercises.Add(new PackageExercise { ExerciseId = pullUps.Id, DayOfWeek = DayOfWeekEnum.Friday, Sets = 4, Reps = 8, RestSeconds = 60, OrderIndex = 1 });

                var package2 = new WorkoutPackage
                {
                    TrainerId = trainer.Id,
                    Title = "8 Həftəlik Hipertrofiya və Kütlə Proqramı",
                    Slug = "8-heftelik-hipertrofiya-ve-kutle-proqrami",
                    Description = "Əsas baza hərəkətləri ilə maksimal əzələ hipertrofiyası və həcm qazanmaq üçün təcrübəli idmançılara xüsusi hazırlanmış proqram.",
                    Goal = FitnessGoal.MuscleGain,
                    Difficulty = DifficultyLevel.Intermediate,
                    DurationWeeks = 8,
                    PreviewVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                    ThumbnailUrl = "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
                    Price = 0,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                };

                if (benchPress != null) package2.PackageExercises.Add(new PackageExercise { ExerciseId = benchPress.Id, DayOfWeek = DayOfWeekEnum.Monday, Sets = 4, Reps = 10, RestSeconds = 90, OrderIndex = 1 });
                if (squat != null) package2.PackageExercises.Add(new PackageExercise { ExerciseId = squat.Id, DayOfWeek = DayOfWeekEnum.Wednesday, Sets = 4, Reps = 8, RestSeconds = 120, OrderIndex = 1 });
                if (deadlift != null) package2.PackageExercises.Add(new PackageExercise { ExerciseId = deadlift.Id, DayOfWeek = DayOfWeekEnum.Friday, Sets = 4, Reps = 6, RestSeconds = 120, OrderIndex = 1 });

                context.WorkoutPackages.AddRange(package1, package2);
                await context.SaveChangesAsync();
            }
        }

        // 4. Seed user weekly plan items & logs if not present
        var testUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "user@kursisi.com");
        if (testUser != null && !await context.WeeklyPlanItems.AnyAsync(p => p.UserId == testUser.Id))
        {
            var bench = await context.Exercises.FirstOrDefaultAsync(e => e.Slug == "barbell-bench-press");
            var squat = await context.Exercises.FirstOrDefaultAsync(e => e.Slug == "barbell-squat");
            var pullUps = await context.Exercises.FirstOrDefaultAsync(e => e.Slug == "pull-ups");
            var plank = await context.Exercises.FirstOrDefaultAsync(e => e.Slug == "plank");

            if (bench != null)
            {
                context.WeeklyPlanItems.Add(new WeeklyPlanItem
                {
                    UserId = testUser.Id,
                    ExerciseId = bench.Id,
                    DayOfWeek = DayOfWeekEnum.Monday,
                    TargetSets = 4,
                    TargetReps = 10,
                    TargetWeightKg = 70,
                    Notes = "Texnikaya diqqət edin",
                    IsCompleted = true,
                    CompletedAt = DateTime.UtcNow.AddDays(-2)
                });

                context.WorkoutLogs.Add(new WorkoutLog
                {
                    UserId = testUser.Id,
                    ExerciseId = bench.Id,
                    CompletedAt = DateTime.UtcNow.AddDays(-2),
                    SetsCompleted = 4,
                    RepsCompleted = 10,
                    WeightUsedKg = 70,
                    DurationMinutes = 20,
                    CaloriesBurned = 170,
                    Notes = "Çox yaxşı hiss olundu, çəkini 2.5kq artırmaq olar"
                });
            }

            if (squat != null)
            {
                context.WeeklyPlanItems.Add(new WeeklyPlanItem
                {
                    UserId = testUser.Id,
                    ExerciseId = squat.Id,
                    DayOfWeek = DayOfWeekEnum.Wednesday,
                    TargetSets = 4,
                    TargetReps = 12,
                    TargetWeightKg = 85,
                    IsCompleted = false
                });
            }

            if (pullUps != null)
            {
                context.WeeklyPlanItems.Add(new WeeklyPlanItem
                {
                    UserId = testUser.Id,
                    ExerciseId = pullUps.Id,
                    DayOfWeek = DayOfWeekEnum.Friday,
                    TargetSets = 3,
                    TargetReps = 8,
                    IsCompleted = false
                });
            }

            if (plank != null)
            {
                context.WeeklyPlanItems.Add(new WeeklyPlanItem
                {
                    UserId = testUser.Id,
                    ExerciseId = plank.Id,
                    DayOfWeek = DayOfWeekEnum.Friday,
                    TargetSets = 3,
                    TargetReps = 60,
                    IsCompleted = false
                });
            }

            // Monthly progress photos
            context.MonthlyProgresses.AddRange(
                new MonthlyProgress
                {
                    UserId = testUser.Id,
                    MonthYear = "2026-03",
                    PhotoUrl = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
                    WeightKg = 84.0,
                    ChestCm = 102,
                    WaistCm = 89,
                    ArmCm = 36,
                    Notes = "Məşqlərə yeni başladıq, adaptasiya dövrü.",
                    CreatedAt = DateTime.UtcNow.AddMonths(-2)
                },
                new MonthlyProgress
                {
                    UserId = testUser.Id,
                    MonthYear = "2026-04",
                    PhotoUrl = "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
                    WeightKg = 81.5,
                    ChestCm = 103,
                    WaistCm = 86,
                    ArmCm = 36.5,
                    Notes = "Yağ faizi azaldı, dözümlülük xeyli artdı.",
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                },
                new MonthlyProgress
                {
                    UserId = testUser.Id,
                    MonthYear = "2026-05",
                    PhotoUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
                    WeightKg = 79.0,
                    ChestCm = 104,
                    WaistCm = 83,
                    ArmCm = 37,
                    Notes = "Hədəf çəkiyə çatdıq! Əzələ relyefi aydın görünür.",
                    CreatedAt = DateTime.UtcNow
                }
            );

            // Comments
            if (bench != null)
            {
                context.Comments.Add(new Comment
                {
                    UserId = testUser.Id,
                    ExerciseId = bench.Id,
                    Content = "Çox faydalı hərəkətdir, dirsəkləri düzgün saxlayanda sinə əzələsi dərhal yanır!",
                    Rating = 5,
                    CreatedAt = DateTime.UtcNow.AddDays(-5)
                });
            }

            await context.SaveChangesAsync();
        }
    }
}
