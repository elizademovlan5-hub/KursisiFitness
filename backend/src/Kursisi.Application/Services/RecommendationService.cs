using Kursisi.Application.Common.Models;
using Kursisi.Application.DTOs;
using Kursisi.Application.Helpers;
using Kursisi.Application.Interfaces;
using Kursisi.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Kursisi.Application.Services;

public class RecommendationService : IRecommendationService
{
    private readonly IApplicationDbContext _context;

    public RecommendationService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<RecommendationResponse>> GetRecommendationAsync(RecommendationRequest request)
    {
        var bmiResult = BmiCalculator.Calculate(request.HeightCm, request.WeightKg, request.Goal, request.Age, request.IsMale);

        // Fetch matching exercises
        var matchingMuscleGroups = new List<MuscleGroupType>();
        foreach (var muscleStr in bmiResult.FocusMuscleGroups)
        {
            if (Enum.TryParse<MuscleGroupType>(muscleStr, out var mg))
            {
                matchingMuscleGroups.Add(mg);
            }
        }

        var exercisesQuery = _context.Exercises
            .Include(e => e.Comments)
            .AsNoTracking()
            .Where(e => matchingMuscleGroups.Contains(e.MuscleGroup));

        var exercises = await exercisesQuery
            .Take(8)
            .Select(e => ExerciseService.MapToExerciseDto(e))
            .ToListAsync();

        // If not enough matching, take general popular exercises
        if (exercises.Count < 4)
        {
            var fallback = await _context.Exercises
                .Include(e => e.Comments)
                .AsNoTracking()
                .Take(6)
                .Select(e => ExerciseService.MapToExerciseDto(e))
                .ToListAsync();

            exercises = fallback;
        }

        // Fetch matching workout packages
        var packages = await _context.WorkoutPackages
            .Include(p => p.Trainer)
            .Include(p => p.PackageExercises)
                .ThenInclude(pe => pe.Exercise)
            .Include(p => p.Comments)
            .Where(p => p.Goal == request.Goal && p.IsActive)
            .Take(3)
            .AsNoTracking()
            .Select(p => new WorkoutPackageDto
            {
                Id = p.Id,
                TrainerId = p.TrainerId,
                TrainerName = p.Trainer.FullName,
                TrainerAvatarUrl = p.Trainer.AvatarUrl,
                Title = p.Title,
                Slug = p.Slug,
                Description = p.Description,
                Goal = p.Goal,
                Difficulty = p.Difficulty,
                DurationWeeks = p.DurationWeeks,
                PreviewVideoUrl = p.PreviewVideoUrl,
                ThumbnailUrl = p.ThumbnailUrl,
                Price = p.Price,
                IsActive = p.IsActive,
                Exercises = p.PackageExercises.Select(pe => new PackageExerciseDto
                {
                    Id = pe.Id,
                    ExerciseId = pe.ExerciseId,
                    ExerciseTitle = pe.Exercise.Title,
                    ExerciseSlug = pe.Exercise.Slug,
                    DayOfWeek = pe.DayOfWeek,
                    Sets = pe.Sets,
                    Reps = pe.Reps,
                    RestSeconds = pe.RestSeconds
                }).ToList(),
                CommentsCount = p.Comments.Count,
                AverageRating = p.Comments.Any() ? Math.Round(p.Comments.Average(c => c.Rating), 1) : 5.0,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();

        var response = new RecommendationResponse
        {
            BmiDetails = bmiResult,
            RecommendedExercises = exercises,
            MatchingPackages = packages
        };

        return ApiResponse<RecommendationResponse>.Ok(response, "Bədən parametrlərinizə uyğun xüsusi məşq proqramı hazırlandı.");
    }
}
