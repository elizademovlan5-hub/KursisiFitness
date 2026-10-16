using Kursisi.Domain.Enums;

namespace Kursisi.Application.Helpers;

public class BmiResult
{
    public double Bmi { get; set; }
    public string Category { get; set; } = string.Empty;
    public string IdealWeightRange { get; set; } = string.Empty;
    public int RecommendedDailyCalories { get; set; }
    public string RecommendedSplit { get; set; } = string.Empty;
    public string Advice { get; set; } = string.Empty;
    public List<string> FocusMuscleGroups { get; set; } = new();
    public string SuggestedDifficulty { get; set; } = string.Empty;
}

public static class BmiCalculator
{
    public static BmiResult Calculate(double heightCm, double weightKg, FitnessGoal goal, int age = 25, bool isMale = true)
    {
        if (heightCm <= 0 || weightKg <= 0)
        {
            return new BmiResult
            {
                Bmi = 0,
                Category = "Məlumat natamamdır",
                Advice = "Zəhmət olmasa boy və çəki məlumatlarınızı daxil edin."
            };
        }

        double heightM = heightCm / 100.0;
        double bmi = Math.Round(weightKg / (heightM * heightM), 1);

        string category;
        if (bmi < 18.5)
            category = "Çəki çatışmazlığı (Underweight)";
        else if (bmi < 25.0)
            category = "Normal sağlam çəki (Normal)";
        else if (bmi < 30.0)
            category = "Artıq çəki (Overweight)";
        else
            category = "Piylənmə (Obese)";

        double minIdeal = Math.Round(18.5 * heightM * heightM, 1);
        double maxIdeal = Math.Round(24.9 * heightM * heightM, 1);
        string idealRange = $"{minIdeal} - {maxIdeal} kq";

        // BMR Mifflin-St Jeor
        double bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + (isMale ? 5 : -161);
        double tdee = bmr * 1.4; // moderate activity

        int targetCalories = (int)tdee;
        string split;
        string advice;
        var focus = new List<string>();
        string difficulty = "Beginner";

        switch (goal)
        {
            case FitnessGoal.WeightLoss:
                targetCalories = (int)(tdee - 450);
                split = "Həftədə 4 gün: 2 gün Kardio və HIIT + 2 gün Bütün Bədən (Full Body)";
                advice = "Kalori defisiti saxlayın. Kardio və dövri məşqlərə üstünlük verin, gündəlik 2-3 litr su için.";
                focus = new() { "Cardio", "FullBody", "Abs" };
                difficulty = "Beginner";
                break;

            case FitnessGoal.MuscleGain:
                targetCalories = (int)(tdee + 350);
                split = "Həftədə 4-5 gün: Yuxarı / Aşağı Bədən və ya Push / Pull / Legs";
                advice = "Zülal qəbulunu (bədən çəkisinin hər kiloqramına 1.6-2g) artırın və mütəmadi olaraq yüklənməni (progressive overload) artırın.";
                focus = new() { "Chest", "Back", "Legs", "Arms", "Shoulders" };
                difficulty = "Intermediate";
                break;

            case FitnessGoal.Strength:
                targetCalories = (int)(tdee + 250);
                split = "Həftədə 3-4 gün: Əsas baza hərəkətləri (Squat, Bench Press, Deadlift, Overhead Press)";
                advice = "Ağır çəkilər, az təkrar (3-6 təkrar) və dəstlər arası 2-3 dəqiqə istirahət tövsiyə olunur.";
                focus = new() { "Chest", "Legs", "Back" };
                difficulty = "Advanced";
                break;

            case FitnessGoal.Endurance:
                targetCalories = (int)tdee;
                split = "Həftədə 4 gün: Çox təkrarlı dözümlülük və intervallı kardio məşqləri";
                advice = "Yüksək təkrar sayı (15-20 təkrar), qısa istirahət intervalları ilə əzələ dözümlülüyünüzü artırın.";
                focus = new() { "Cardio", "Abs", "FullBody" };
                difficulty = "Intermediate";
                break;

            case FitnessGoal.Maintenance:
            default:
                targetCalories = (int)tdee;
                split = "Həftədə 3 gün: Bütün bədən tonusu və elastiklik məşqləri";
                advice = "Balanslaşdırılmış qidalanma və aktiv həyat tərzi ilə mövcud formanı sabit saxlayın.";
                focus = new() { "FullBody", "Abs", "Cardio" };
                difficulty = "Beginner";
                break;
        }

        return new BmiResult
        {
            Bmi = bmi,
            Category = category,
            IdealWeightRange = idealRange,
            RecommendedDailyCalories = targetCalories,
            RecommendedSplit = split,
            Advice = advice,
            FocusMuscleGroups = focus,
            SuggestedDifficulty = difficulty
        };
    }
}
