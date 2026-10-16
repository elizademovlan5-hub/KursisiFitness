using Kursisi.Domain.Enums;

namespace Kursisi.Application.DTOs;

public class WorkoutPackageDto
{
    public int Id { get; set; }
    public int TrainerId { get; set; }
    public string TrainerName { get; set; } = string.Empty;
    public string? TrainerAvatarUrl { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public FitnessGoal Goal { get; set; }
    public string GoalName => Goal.ToString();
    public DifficultyLevel Difficulty { get; set; }
    public string DifficultyName => Difficulty.ToString();
    public int DurationWeeks { get; set; }
    public string PreviewVideoUrl { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public bool IsActive { get; set; }
    public List<PackageExerciseDto> Exercises { get; set; } = new();
    public int CommentsCount { get; set; }
    public double AverageRating { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class PackageExerciseDto
{
    public int Id { get; set; }
    public int ExerciseId { get; set; }
    public string ExerciseTitle { get; set; } = string.Empty;
    public string ExerciseSlug { get; set; } = string.Empty;
    public string ExerciseThumbnailUrl { get; set; } = string.Empty;
    public MuscleGroupType MuscleGroup { get; set; }
    public DayOfWeekEnum DayOfWeek { get; set; }
    public string DayOfWeekName => DayOfWeek.ToString();
    public int Sets { get; set; }
    public int Reps { get; set; }
    public int RestSeconds { get; set; }
    public int OrderIndex { get; set; }
}

public class CreateWorkoutPackageDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public FitnessGoal Goal { get; set; } = FitnessGoal.MuscleGain;
    public DifficultyLevel Difficulty { get; set; } = DifficultyLevel.Intermediate;
    public int DurationWeeks { get; set; } = 4;
    public string PreviewVideoUrl { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public decimal Price { get; set; } = 0;
    public List<CreatePackageExerciseDto> Exercises { get; set; } = new();
}

public class CreatePackageExerciseDto
{
    public int ExerciseId { get; set; }
    public DayOfWeekEnum DayOfWeek { get; set; }
    public int Sets { get; set; } = 3;
    public int Reps { get; set; } = 12;
    public int RestSeconds { get; set; } = 60;
    public int OrderIndex { get; set; } = 1;
}

public class AdoptPackageDto
{
    public int PackageId { get; set; }
    public bool ClearExistingSchedule { get; set; } = false;
}
