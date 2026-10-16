namespace Kursisi.Domain.Enums;

public enum UserRole
{
    User = 1,
    Trainer = 2,
    Admin = 3
}

public enum DifficultyLevel
{
    Beginner = 1,     // Başlanğıc
    Intermediate = 2, // Orta
    Advanced = 3      // İrəli
}

public enum MuscleGroupType
{
    Chest = 1,      // Sinə
    Back = 2,       // Kürək
    Arms = 3,       // Qollar (Biceps / Triceps)
    Shoulders = 4,  // Çiyin
    Legs = 5,       // Ayaq
    Abs = 6,        // Qarın
    Cardio = 7,     // Kardio
    FullBody = 8    // Bütün Bədən
}

public enum DayOfWeekEnum
{
    Monday = 1,    // Bazar ertəsi
    Tuesday = 2,   // Çərşənbə axşamı
    Wednesday = 3, // Çərşənbə
    Thursday = 4,  // Cümə axşamı
    Friday = 5,    // Cümə
    Saturday = 6,  // Şənbə
    Sunday = 7     // Bazar
}

public enum FitnessGoal
{
    WeightLoss = 1,   // Arıqlama / Yağ yandırma
    MuscleGain = 2,   // Əzələ kütləsi artımı
    Maintenance = 3,  // Formanı qorumaq
    Endurance = 4,    // Dözümlülük və kardio
    Strength = 5      // Güc və qüvvət
}
