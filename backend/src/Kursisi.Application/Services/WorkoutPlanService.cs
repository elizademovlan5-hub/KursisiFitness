using Kursisi.Application.Common.Exceptions;
using Kursisi.Application.Common.Models;
using Kursisi.Application.DTOs;
using Kursisi.Application.Interfaces;
using Kursisi.Domain.Entities;
using Kursisi.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Kursisi.Application.Services;

public class WorkoutPlanService : IWorkoutPlanService
{
    private readonly IApplicationDbContext _context;

    public WorkoutPlanService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<WeeklyPlanItemDto>>> GetWeeklyPlanAsync(int userId)
    {
        var items = await _context.WeeklyPlanItems
            .Include(p => p.Exercise)
            .Where(p => p.UserId == userId)
            .OrderBy(p => p.DayOfWeek)
            .ThenBy(p => p.Id)
            .AsNoTracking()
            .Select(p => MapToPlanItemDto(p))
            .ToListAsync();

        return ApiResponse<List<WeeklyPlanItemDto>>.Ok(items);
    }

    public async Task<ApiResponse<WeeklyPlanItemDto>> AddToPlanAsync(int userId, AddToPlanDto dto)
    {
        var exercise = await _context.Exercises.FindAsync(dto.ExerciseId);
        if (exercise == null)
            throw new NotFoundException("Məşq tapılmadı.");

        var planItem = new WeeklyPlanItem
        {
            UserId = userId,
            ExerciseId = dto.ExerciseId,
            DayOfWeek = dto.DayOfWeek,
            TargetSets = dto.TargetSets > 0 ? dto.TargetSets : 3,
            TargetReps = dto.TargetReps > 0 ? dto.TargetReps : 12,
            TargetWeightKg = dto.TargetWeightKg,
            Notes = dto.Notes?.Trim(),
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.WeeklyPlanItems.Add(planItem);
        await _context.SaveChangesAsync();

        planItem.Exercise = exercise;
        return ApiResponse<WeeklyPlanItemDto>.Ok(MapToPlanItemDto(planItem), "Məşq həftəlik plana əlavə edildi.");
    }

    public async Task<ApiResponse<WeeklyPlanItemDto>> UpdatePlanItemAsync(int userId, int planItemId, UpdatePlanItemDto dto)
    {
        var item = await _context.WeeklyPlanItems
            .Include(p => p.Exercise)
            .FirstOrDefaultAsync(p => p.Id == planItemId && p.UserId == userId);

        if (item == null)
            throw new NotFoundException("Plan elementi tapılmadı.");

        item.DayOfWeek = dto.DayOfWeek;
        item.TargetSets = dto.TargetSets > 0 ? dto.TargetSets : item.TargetSets;
        item.TargetReps = dto.TargetReps > 0 ? dto.TargetReps : item.TargetReps;
        item.TargetWeightKg = dto.TargetWeightKg;
        item.Notes = dto.Notes;
        item.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return ApiResponse<WeeklyPlanItemDto>.Ok(MapToPlanItemDto(item), "Plan elementi yeniləndi.");
    }

    public async Task<ApiResponse<bool>> DeletePlanItemAsync(int userId, int planItemId)
    {
        var item = await _context.WeeklyPlanItems
            .FirstOrDefaultAsync(p => p.Id == planItemId && p.UserId == userId);

        if (item == null)
            throw new NotFoundException("Plan elementi tapılmadı.");

        _context.WeeklyPlanItems.Remove(item);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Məşq plandan çıxarıldı.");
    }

    public async Task<ApiResponse<WorkoutLogDto>> CompleteWorkoutAsync(int userId, CompleteWorkoutDto dto)
    {
        var item = await _context.WeeklyPlanItems
            .Include(p => p.Exercise)
            .FirstOrDefaultAsync(p => p.Id == dto.PlanItemId && p.UserId == userId);

        if (item == null)
            throw new NotFoundException("Plan elementi tapılmadı.");

        item.IsCompleted = true;
        item.CompletedAt = DateTime.UtcNow;

        int duration = dto.DurationMinutes > 0 ? dto.DurationMinutes : 15;
        double calories = Math.Round(duration * item.Exercise.EstimatedCaloriesBurnedPerMin, 1);

        var log = new WorkoutLog
        {
            UserId = userId,
            ExerciseId = item.ExerciseId,
            CompletedAt = DateTime.UtcNow,
            SetsCompleted = dto.SetsCompleted > 0 ? dto.SetsCompleted : item.TargetSets,
            RepsCompleted = dto.RepsCompleted > 0 ? dto.RepsCompleted : item.TargetReps,
            WeightUsedKg = dto.WeightUsedKg > 0 ? dto.WeightUsedKg : (item.TargetWeightKg ?? 0),
            DurationMinutes = duration,
            CaloriesBurned = calories,
            Notes = dto.Notes ?? item.Notes
        };

        _context.WorkoutLogs.Add(log);
        await _context.SaveChangesAsync();

        log.Exercise = item.Exercise;

        var resultDto = new WorkoutLogDto
        {
            Id = log.Id,
            ExerciseId = log.ExerciseId,
            ExerciseTitle = log.Exercise.Title,
            ExerciseSlug = log.Exercise.Slug,
            ExerciseThumbnailUrl = log.Exercise.ThumbnailUrl,
            CompletedAt = log.CompletedAt,
            SetsCompleted = log.SetsCompleted,
            RepsCompleted = log.RepsCompleted,
            WeightUsedKg = log.WeightUsedKg,
            DurationMinutes = log.DurationMinutes,
            CaloriesBurned = log.CaloriesBurned,
            Notes = log.Notes
        };

        return ApiResponse<WorkoutLogDto>.Ok(resultDto, "Məşq tamamlandı və tarixçəyə yazıldı!");
    }

    public async Task<ApiResponse<DailySummaryDto>> GetDailySummaryAsync(int userId, DayOfWeekEnum day)
    {
        var items = await _context.WeeklyPlanItems
            .Include(p => p.Exercise)
            .Where(p => p.UserId == userId && p.DayOfWeek == day)
            .AsNoTracking()
            .ToListAsync();

        var dtoList = items.Select(MapToPlanItemDto).ToList();
        int completedCount = items.Count(i => i.IsCompleted);

        // Calculate calories for completed items today
        double calories = items.Where(i => i.IsCompleted)
            .Sum(i => 15 * i.Exercise.EstimatedCaloriesBurnedPerMin);

        var summary = new DailySummaryDto
        {
            DayOfWeek = day,
            TotalScheduled = items.Count,
            CompletedCount = completedCount,
            TotalCaloriesBurned = Math.Round(calories, 1),
            TotalDurationMinutes = completedCount * 15,
            Items = dtoList
        };

        return ApiResponse<DailySummaryDto>.Ok(summary);
    }

    public async Task<ApiResponse<WeeklyStatsDto>> GetWeeklyStatsAsync(int userId)
    {
        var weekStart = DateTime.UtcNow.Date.AddDays(-(int)DateTime.UtcNow.DayOfWeek + 1);
        var logs = await _context.WorkoutLogs
            .Include(l => l.Exercise)
            .Where(l => l.UserId == userId && l.CompletedAt >= weekStart.AddDays(-7))
            .AsNoTracking()
            .ToListAsync();

        var planItems = await _context.WeeklyPlanItems
            .Where(p => p.UserId == userId)
            .AsNoTracking()
            .ToListAsync();

        int totalPlan = planItems.Count;
        int completedPlan = planItems.Count(p => p.IsCompleted);
        double rate = totalPlan > 0 ? Math.Round((double)completedPlan / totalPlan * 100, 1) : 0;

        var workoutsPerDay = logs
            .GroupBy(l => l.CompletedAt.DayOfWeek.ToString())
            .ToDictionary(g => g.Key, g => g.Count());

        var muscles = logs
            .GroupBy(l => l.Exercise.MuscleGroup.ToString())
            .ToDictionary(g => g.Key, g => g.Count());

        var stats = new WeeklyStatsDto
        {
            TotalWorkoutsCompleted = logs.Select(l => l.CompletedAt.Date).Distinct().Count(),
            TotalExercisesCompleted = logs.Count,
            TotalCaloriesBurned = Math.Round(logs.Sum(l => l.CaloriesBurned), 1),
            TotalMinutesTrained = logs.Sum(l => l.DurationMinutes),
            CompletionRatePercentage = rate,
            WorkoutsPerDay = workoutsPerDay,
            ExercisesByMuscleGroup = muscles
        };

        return ApiResponse<WeeklyStatsDto>.Ok(stats);
    }

    public async Task<ApiResponse<List<WorkoutLogDto>>> GetWorkoutHistoryAsync(int userId)
    {
        var logs = await _context.WorkoutLogs
            .Include(l => l.Exercise)
            .Where(l => l.UserId == userId)
            .OrderByDescending(l => l.CompletedAt)
            .Take(50)
            .AsNoTracking()
            .Select(l => new WorkoutLogDto
            {
                Id = l.Id,
                ExerciseId = l.ExerciseId,
                ExerciseTitle = l.Exercise.Title,
                ExerciseSlug = l.Exercise.Slug,
                ExerciseThumbnailUrl = l.Exercise.ThumbnailUrl,
                CompletedAt = l.CompletedAt,
                SetsCompleted = l.SetsCompleted,
                RepsCompleted = l.RepsCompleted,
                WeightUsedKg = l.WeightUsedKg,
                DurationMinutes = l.DurationMinutes,
                CaloriesBurned = l.CaloriesBurned,
                Notes = l.Notes
            })
            .ToListAsync();

        return ApiResponse<List<WorkoutLogDto>>.Ok(logs);
    }

    private static WeeklyPlanItemDto MapToPlanItemDto(WeeklyPlanItem p)
    {
        return new WeeklyPlanItemDto
        {
            Id = p.Id,
            UserId = p.UserId,
            ExerciseId = p.ExerciseId,
            ExerciseTitle = p.Exercise?.Title ?? string.Empty,
            ExerciseSlug = p.Exercise?.Slug ?? string.Empty,
            ExerciseThumbnailUrl = p.Exercise?.ThumbnailUrl ?? string.Empty,
            ExerciseVideoUrl = p.Exercise?.VideoUrl ?? string.Empty,
            MuscleGroup = p.Exercise?.MuscleGroup ?? MuscleGroupType.FullBody,
            Difficulty = p.Exercise?.Difficulty ?? DifficultyLevel.Beginner,
            DayOfWeek = p.DayOfWeek,
            TargetSets = p.TargetSets,
            TargetReps = p.TargetReps,
            TargetWeightKg = p.TargetWeightKg,
            Notes = p.Notes,
            IsCompleted = p.IsCompleted,
            CompletedAt = p.CompletedAt
        };
    }
}
