using Kursisi.Domain.Enums;

namespace Kursisi.Application.DTOs;

public class WeeklyPlanItemDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ExerciseId { get; set; }
    public string ExerciseTitle { get; set; } = string.Empty;
    public string ExerciseSlug { get; set; } = string.Empty;
    public string ExerciseThumbnailUrl { get; set; } = string.Empty;
    public string ExerciseVideoUrl { get; set; } = string.Empty;
    public MuscleGroupType MuscleGroup { get; set; }
    public DifficultyLevel Difficulty { get; set; }
    public DayOfWeekEnum DayOfWeek { get; set; }
    public string DayOfWeekName => DayOfWeek.ToString();
    public int TargetSets { get; set; }
    public int TargetReps { get; set; }
    public double? TargetWeightKg { get; set; }
    public string? Notes { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public class AddToPlanDto
{
    public int ExerciseId { get; set; }
    public DayOfWeekEnum DayOfWeek { get; set; }
    public int TargetSets { get; set; } = 3;
    public int TargetReps { get; set; } = 12;
    public double? TargetWeightKg { get; set; }
    public string? Notes { get; set; }
}

public class UpdatePlanItemDto
{
    public DayOfWeekEnum DayOfWeek { get; set; }
    public int TargetSets { get; set; }
    public int TargetReps { get; set; }
    public double? TargetWeightKg { get; set; }
    public string? Notes { get; set; }
}

public class CompleteWorkoutDto
{
    public int PlanItemId { get; set; }
    public int SetsCompleted { get; set; } = 3;
    public int RepsCompleted { get; set; } = 12;
    public double WeightUsedKg { get; set; } = 0;
    public int DurationMinutes { get; set; } = 15;
    public string? Notes { get; set; }
}

public class DailySummaryDto
{
    public DayOfWeekEnum DayOfWeek { get; set; }
    public int TotalScheduled { get; set; }
    public int CompletedCount { get; set; }
    public double TotalCaloriesBurned { get; set; }
    public int TotalDurationMinutes { get; set; }
    public List<WeeklyPlanItemDto> Items { get; set; } = new();
}

public class WeeklyStatsDto
{
    public int TotalWorkoutsCompleted { get; set; }
    public int TotalExercisesCompleted { get; set; }
    public double TotalCaloriesBurned { get; set; }
    public int TotalMinutesTrained { get; set; }
    public double CompletionRatePercentage { get; set; }
    public Dictionary<string, int> WorkoutsPerDay { get; set; } = new();
    public Dictionary<string, int> ExercisesByMuscleGroup { get; set; } = new();
}

public class WorkoutLogDto
{
    public int Id { get; set; }
    public int ExerciseId { get; set; }
    public string ExerciseTitle { get; set; } = string.Empty;
    public string ExerciseSlug { get; set; } = string.Empty;
    public string ExerciseThumbnailUrl { get; set; } = string.Empty;
    public DateTime CompletedAt { get; set; }
    public int SetsCompleted { get; set; }
    public int RepsCompleted { get; set; }
    public double WeightUsedKg { get; set; }
    public int DurationMinutes { get; set; }
    public double CaloriesBurned { get; set; }
    public string? Notes { get; set; }
}
