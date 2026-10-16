using Kursisi.Domain.Enums;

namespace Kursisi.Application.DTOs;

public class ExerciseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public MuscleGroupType MuscleGroup { get; set; }
    public string MuscleGroupName => MuscleGroup.ToString();
    public DifficultyLevel Difficulty { get; set; }
    public string DifficultyName => Difficulty.ToString();
    public string Equipment { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public string VideoUrl { get; set; } = string.Empty;
    public string ExecutionSteps { get; set; } = string.Empty;
    public string Benefits { get; set; } = string.Empty;
    public string RisksAndMistakes { get; set; } = string.Empty;
    public double EstimatedCaloriesBurnedPerMin { get; set; }
    public int CommentsCount { get; set; }
    public double AverageRating { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateExerciseDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public MuscleGroupType MuscleGroup { get; set; }
    public DifficultyLevel Difficulty { get; set; }
    public string Equipment { get; set; } = "None";
    public string ThumbnailUrl { get; set; } = string.Empty;
    public string VideoUrl { get; set; } = string.Empty;
    public string ExecutionSteps { get; set; } = string.Empty;
    public string Benefits { get; set; } = string.Empty;
    public string RisksAndMistakes { get; set; } = string.Empty;
    public double EstimatedCaloriesBurnedPerMin { get; set; } = 7.5;
}

public class UpdateExerciseDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public MuscleGroupType MuscleGroup { get; set; }
    public DifficultyLevel Difficulty { get; set; }
    public string Equipment { get; set; } = "None";
    public string ThumbnailUrl { get; set; } = string.Empty;
    public string VideoUrl { get; set; } = string.Empty;
    public string ExecutionSteps { get; set; } = string.Empty;
    public string Benefits { get; set; } = string.Empty;
    public string RisksAndMistakes { get; set; } = string.Empty;
    public double EstimatedCaloriesBurnedPerMin { get; set; }
}

public class ExerciseFilterParams
{
    public string? Search { get; set; }
    public MuscleGroupType? MuscleGroup { get; set; }
    public DifficultyLevel? Difficulty { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 12;
}
