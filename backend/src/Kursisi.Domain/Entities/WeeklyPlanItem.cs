using Kursisi.Domain.Common;
using Kursisi.Domain.Enums;

namespace Kursisi.Domain.Entities;

public class WeeklyPlanItem : BaseEntity
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int ExerciseId { get; set; }
    public Exercise Exercise { get; set; } = null!;

    public DayOfWeekEnum DayOfWeek { get; set; }
    public int TargetSets { get; set; } = 3;
    public int TargetReps { get; set; } = 12;
    public double? TargetWeightKg { get; set; }
    public string? Notes { get; set; }

    public bool IsCompleted { get; set; } = false;
    public DateTime? CompletedAt { get; set; }
}
