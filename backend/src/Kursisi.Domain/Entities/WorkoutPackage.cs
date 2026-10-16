using Kursisi.Domain.Common;
using Kursisi.Domain.Enums;

namespace Kursisi.Domain.Entities;

public class WorkoutPackage : BaseEntity
{
    public int TrainerId { get; set; }
    public User Trainer { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public FitnessGoal Goal { get; set; }
    public DifficultyLevel Difficulty { get; set; }
    public int DurationWeeks { get; set; } = 4;
    public string PreviewVideoUrl { get; set; } = string.Empty; // 2-3 sec short preview video
    public string ThumbnailUrl { get; set; } = string.Empty;
    public decimal Price { get; set; } = 0; // 0 for free/included gym membership
    public bool IsActive { get; set; } = true;

    public ICollection<PackageExercise> PackageExercises { get; set; } = new List<PackageExercise>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
