using Kursisi.Application.Common.Exceptions;
using Kursisi.Application.Common.Models;
using Kursisi.Application.DTOs;
using Kursisi.Application.Helpers;
using Kursisi.Application.Interfaces;
using Kursisi.Domain.Entities;
using Kursisi.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Kursisi.Application.Services;

public class WorkoutPackageService : IWorkoutPackageService
{
    private readonly IApplicationDbContext _context;

    public WorkoutPackageService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<WorkoutPackageDto>>> GetAllPackagesAsync()
    {
        var packages = await _context.WorkoutPackages
            .Include(p => p.Trainer)
            .Include(p => p.PackageExercises)
                .ThenInclude(pe => pe.Exercise)
            .Include(p => p.Comments)
            .Where(p => p.IsActive)
            .OrderByDescending(p => p.CreatedAt)
            .AsNoTracking()
            .Select(p => MapToPackageDto(p))
            .ToListAsync();

        return ApiResponse<List<WorkoutPackageDto>>.Ok(packages);
    }

    public async Task<ApiResponse<WorkoutPackageDto>> GetPackageBySlugAsync(string slug)
    {
        if (string.IsNullOrWhiteSpace(slug))
            throw new AppException("Slug parametri boş ola bilməz.");

        var package = await _context.WorkoutPackages
            .Include(p => p.Trainer)
            .Include(p => p.PackageExercises)
                .ThenInclude(pe => pe.Exercise)
            .Include(p => p.Comments)
                .ThenInclude(c => c.User)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Slug == slug.ToLower().Trim());

        if (package == null)
            throw new NotFoundException($"'{slug}' adlı məşq paketi tapılmadı.");

        return ApiResponse<WorkoutPackageDto>.Ok(MapToPackageDto(package));
    }

    public async Task<ApiResponse<WorkoutPackageDto>> GetPackageByIdAsync(int id)
    {
        var package = await _context.WorkoutPackages
            .Include(p => p.Trainer)
            .Include(p => p.PackageExercises)
                .ThenInclude(pe => pe.Exercise)
            .Include(p => p.Comments)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);

        if (package == null)
            throw new NotFoundException("Məşq paketi tapılmadı.");

        return ApiResponse<WorkoutPackageDto>.Ok(MapToPackageDto(package));
    }

    public async Task<ApiResponse<WorkoutPackageDto>> CreatePackageAsync(int trainerId, CreateWorkoutPackageDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            throw new AppException("Paketin adı daxil edilməlidir.");

        string baseSlug = SlugHelper.GenerateSlug(dto.Title);
        string slug = baseSlug;
        int counter = 1;

        while (await _context.WorkoutPackages.AnyAsync(p => p.Slug == slug))
        {
            slug = $"{baseSlug}-{counter++}";
        }

        var package = new WorkoutPackage
        {
            TrainerId = trainerId,
            Title = dto.Title.Trim(),
            Slug = slug,
            Description = dto.Description.Trim(),
            Goal = dto.Goal,
            Difficulty = dto.Difficulty,
            DurationWeeks = dto.DurationWeeks > 0 ? dto.DurationWeeks : 4,
            PreviewVideoUrl = dto.PreviewVideoUrl.Trim(),
            ThumbnailUrl = dto.ThumbnailUrl.Trim(),
            Price = dto.Price,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        foreach (var ex in dto.Exercises)
        {
            package.PackageExercises.Add(new PackageExercise
            {
                ExerciseId = ex.ExerciseId,
                DayOfWeek = ex.DayOfWeek,
                Sets = ex.Sets,
                Reps = ex.Reps,
                RestSeconds = ex.RestSeconds,
                OrderIndex = ex.OrderIndex
            });
        }

        _context.WorkoutPackages.Add(package);
        await _context.SaveChangesAsync();

        return ApiResponse<WorkoutPackageDto>.Ok(MapToPackageDto(package), "Məşqçi paketi uğurla yaradıldı.");
    }

    public async Task<ApiResponse<bool>> DeletePackageAsync(int packageId, int userId, bool isAdmin)
    {
        var package = await _context.WorkoutPackages.FindAsync(packageId);
        if (package == null)
            throw new NotFoundException("Məşq paketi tapılmadı.");

        if (!isAdmin && package.TrainerId != userId)
            throw new AppException("Bu paketi silmək üçün səlahiyyətiniz yoxdur.", 403);

        _context.WorkoutPackages.Remove(package);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Məşq paketi silindi.");
    }

    public async Task<ApiResponse<bool>> AdoptPackageToScheduleAsync(int userId, AdoptPackageDto dto)
    {
        var package = await _context.WorkoutPackages
            .Include(p => p.PackageExercises)
            .FirstOrDefaultAsync(p => p.Id == dto.PackageId);

        if (package == null)
            throw new NotFoundException("Məşq paketi tapılmadı.");

        if (dto.ClearExistingSchedule)
        {
            var oldItems = await _context.WeeklyPlanItems.Where(p => p.UserId == userId).ToListAsync();
            _context.WeeklyPlanItems.RemoveRange(oldItems);
        }

        foreach (var ex in package.PackageExercises)
        {
            _context.WeeklyPlanItems.Add(new WeeklyPlanItem
            {
                UserId = userId,
                ExerciseId = ex.ExerciseId,
                DayOfWeek = ex.DayOfWeek,
                TargetSets = ex.Sets,
                TargetReps = ex.Reps,
                Notes = $"{package.Title} proqramından əlavə edildi",
                IsCompleted = false,
                CreatedAt = DateTime.UtcNow
            });
        }

        await _context.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, $"'{package.Title}' paketi həftəlik məşq cədvəlinizə uğurla əlavə olundu!");
    }

    private static WorkoutPackageDto MapToPackageDto(WorkoutPackage p)
    {
        double avgRating = p.Comments.Any() ? Math.Round(p.Comments.Average(c => c.Rating), 1) : 5.0;

        return new WorkoutPackageDto
        {
            Id = p.Id,
            TrainerId = p.TrainerId,
            TrainerName = p.Trainer?.FullName ?? "FitLife Məşqçi",
            TrainerAvatarUrl = p.Trainer?.AvatarUrl,
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
            Exercises = p.PackageExercises.OrderBy(e => e.DayOfWeek).ThenBy(e => e.OrderIndex).Select(e => new PackageExerciseDto
            {
                Id = e.Id,
                ExerciseId = e.ExerciseId,
                ExerciseTitle = e.Exercise?.Title ?? string.Empty,
                ExerciseSlug = e.Exercise?.Slug ?? string.Empty,
                ExerciseThumbnailUrl = e.Exercise?.ThumbnailUrl ?? string.Empty,
                MuscleGroup = e.Exercise?.MuscleGroup ?? MuscleGroupType.FullBody,
                DayOfWeek = e.DayOfWeek,
                Sets = e.Sets,
                Reps = e.Reps,
                RestSeconds = e.RestSeconds,
                OrderIndex = e.OrderIndex
            }).ToList(),
            CommentsCount = p.Comments.Count,
            AverageRating = avgRating,
            CreatedAt = p.CreatedAt
        };
    }
}
