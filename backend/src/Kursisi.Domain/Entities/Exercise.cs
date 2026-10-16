using Kursisi.Domain.Common;
using Kursisi.Domain.Enums;

namespace Kursisi.Domain.Entities;

public class Exercise : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public MuscleGroupType MuscleGroup { get; set; }
    public DifficultyLevel Difficulty { get; set; }
    public string Equipment { get; set; } = "None";
    
    // Cloud hosted Media URLs (Cloudinary / CDN - strictly no local DB file storage)
    public string ThumbnailUrl { get; set; } = string.Empty;
    public string VideoUrl { get; set; } = string.Empty; // 7-8 seconds instructional clip

    public string ExecutionSteps { get; set; } = string.Empty; // How to perform
    public string Benefits { get; set; } = string.Empty;       // Faydalı cəhətləri
    public string RisksAndMistakes { get; set; } = string.Empty; // Səhvlər və diqqət edilməli məqamlar
    public double EstimatedCaloriesBurnedPerMin { get; set; } = 7.5;

    public ICollection<WeeklyPlanItem> WeeklyPlanItems { get; set; } = new List<WeeklyPlanItem>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<PackageExercise> PackageExercises { get; set; } = new List<PackageExercise>();
}
