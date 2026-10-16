using Kursisi.Domain.Common;

namespace Kursisi.Domain.Entities;

public class WorkoutLog : BaseEntity
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int ExerciseId { get; set; }
    public Exercise Exercise { get; set; } = null!;

    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
    public int SetsCompleted { get; set; }
    public int RepsCompleted { get; set; }
    public double WeightUsedKg { get; set; }
    public int DurationMinutes { get; set; }
    public double CaloriesBurned { get; set; }
    public string? Notes { get; set; }
}
