using Kursisi.Domain.Common;

namespace Kursisi.Domain.Entities;

public class Comment : BaseEntity
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int? ExerciseId { get; set; }
    public Exercise? Exercise { get; set; }

    public int? WorkoutPackageId { get; set; }
    public WorkoutPackage? WorkoutPackage { get; set; }

    public string Content { get; set; } = string.Empty;
    public int Rating { get; set; } = 5; // 1 to 5 stars
}
