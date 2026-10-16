using Kursisi.Application.Helpers;
using Kursisi.Domain.Enums;

namespace Kursisi.Application.DTOs;

public class RecommendationRequest
{
    public double HeightCm { get; set; }
    public double WeightKg { get; set; }
    public FitnessGoal Goal { get; set; } = FitnessGoal.WeightLoss;
    public int Age { get; set; } = 25;
    public bool IsMale { get; set; } = true;
}

public class RecommendationResponse
{
    public BmiResult BmiDetails { get; set; } = new();
    public List<ExerciseDto> RecommendedExercises { get; set; } = new();
    public List<WorkoutPackageDto> MatchingPackages { get; set; } = new();
}
