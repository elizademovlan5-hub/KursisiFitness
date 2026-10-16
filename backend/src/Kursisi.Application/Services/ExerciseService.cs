using Kursisi.Application.Common.Exceptions;
using Kursisi.Application.Common.Models;
using Kursisi.Application.DTOs;
using Kursisi.Application.Helpers;
using Kursisi.Application.Interfaces;
using Kursisi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Kursisi.Application.Services;

public class ExerciseService : IExerciseService
{
    private readonly IApplicationDbContext _context;

    public ExerciseService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<PagedResult<ExerciseDto>>> GetExercisesAsync(ExerciseFilterParams filterParams)
    {
        var query = _context.Exercises
            .Include(e => e.Comments)
            .AsNoTracking()
            .AsQueryable();

        // 5. Search by name
        if (!string.IsNullOrWhiteSpace(filterParams.Search))
        {
            string term = filterParams.Search.Trim().ToLower();
            query = query.Where(e => e.Title.ToLower().Contains(term) ||
                                     e.Description.ToLower().Contains(term) ||
                                     e.Equipment.ToLower().Contains(term));
        }

        // 6. Filter by muscle group
        if (filterParams.MuscleGroup.HasValue)
        {
            query = query.Where(e => e.MuscleGroup == filterParams.MuscleGroup.Value);
        }

        // 7. Filter by difficulty
        if (filterParams.Difficulty.HasValue)
        {
            query = query.Where(e => e.Difficulty == filterParams.Difficulty.Value);
        }

        int totalCount = await query.CountAsync();

        int pageNumber = filterParams.PageNumber > 0 ? filterParams.PageNumber : 1;
        int pageSize = filterParams.PageSize > 0 ? filterParams.PageSize : 12;

        var items = await query
            .OrderBy(e => e.Title)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(e => MapToExerciseDto(e))
            .ToListAsync();

        var pagedResult = new PagedResult<ExerciseDto>(items, totalCount, pageNumber, pageSize);
        return ApiResponse<PagedResult<ExerciseDto>>.Ok(pagedResult);
    }

    public async Task<ApiResponse<ExerciseDto>> GetExerciseBySlugAsync(string slug)
    {
        if (string.IsNullOrWhiteSpace(slug))
            throw new AppException("Slug parametri boş ola bilməz.");

        var exercise = await _context.Exercises
            .Include(e => e.Comments)
            .ThenInclude(c => c.User)
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Slug == slug.ToLower().Trim());

        if (exercise == null)
            throw new NotFoundException($"'{slug}' adlı məşq tapılmadı.");

        return ApiResponse<ExerciseDto>.Ok(MapToExerciseDto(exercise));
    }

    public async Task<ApiResponse<ExerciseDto>> GetExerciseByIdAsync(int id)
    {
        var exercise = await _context.Exercises
            .Include(e => e.Comments)
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id);

        if (exercise == null)
            throw new NotFoundException("Məşq tapılmadı.");

        return ApiResponse<ExerciseDto>.Ok(MapToExerciseDto(exercise));
    }

    public async Task<ApiResponse<ExerciseDto>> CreateExerciseAsync(CreateExerciseDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            throw new AppException("Məşqin başlığı daxil edilməlidir.");

        string baseSlug = SlugHelper.GenerateSlug(dto.Title);
        string slug = baseSlug;
        int counter = 1;

        while (await _context.Exercises.AnyAsync(e => e.Slug == slug))
        {
            slug = $"{baseSlug}-{counter++}";
        }

        var exercise = new Exercise
        {
            Title = dto.Title.Trim(),
            Slug = slug,
            Description = dto.Description.Trim(),
            MuscleGroup = dto.MuscleGroup,
            Difficulty = dto.Difficulty,
            Equipment = string.IsNullOrWhiteSpace(dto.Equipment) ? "None" : dto.Equipment.Trim(),
            ThumbnailUrl = dto.ThumbnailUrl.Trim(),
            VideoUrl = dto.VideoUrl.Trim(),
            ExecutionSteps = dto.ExecutionSteps.Trim(),
            Benefits = dto.Benefits.Trim(),
            RisksAndMistakes = dto.RisksAndMistakes.Trim(),
            EstimatedCaloriesBurnedPerMin = dto.EstimatedCaloriesBurnedPerMin > 0 ? dto.EstimatedCaloriesBurnedPerMin : 7.5,
            CreatedAt = DateTime.UtcNow
        };

        _context.Exercises.Add(exercise);
        await _context.SaveChangesAsync();

        return ApiResponse<ExerciseDto>.Ok(MapToExerciseDto(exercise), "Yeni məşq uğurla əlavə edildi.");
    }

    public async Task<ApiResponse<ExerciseDto>> UpdateExerciseAsync(int id, UpdateExerciseDto dto)
    {
        var exercise = await _context.Exercises.FindAsync(id);
        if (exercise == null)
            throw new NotFoundException("Məşq tapılmadı.");

        if (exercise.Title != dto.Title.Trim())
        {
            string baseSlug = SlugHelper.GenerateSlug(dto.Title);
            string slug = baseSlug;
            int counter = 1;

            while (await _context.Exercises.AnyAsync(e => e.Slug == slug && e.Id != id))
            {
                slug = $"{baseSlug}-{counter++}";
            }
            exercise.Slug = slug;
        }

        exercise.Title = dto.Title.Trim();
        exercise.Description = dto.Description.Trim();
        exercise.MuscleGroup = dto.MuscleGroup;
        exercise.Difficulty = dto.Difficulty;
        exercise.Equipment = string.IsNullOrWhiteSpace(dto.Equipment) ? "None" : dto.Equipment.Trim();
        exercise.ThumbnailUrl = dto.ThumbnailUrl.Trim();
        exercise.VideoUrl = dto.VideoUrl.Trim();
        exercise.ExecutionSteps = dto.ExecutionSteps.Trim();
        exercise.Benefits = dto.Benefits.Trim();
        exercise.RisksAndMistakes = dto.RisksAndMistakes.Trim();
        exercise.EstimatedCaloriesBurnedPerMin = dto.EstimatedCaloriesBurnedPerMin;
        exercise.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return ApiResponse<ExerciseDto>.Ok(MapToExerciseDto(exercise), "Məşq uğurla yeniləndi.");
    }

    public async Task<ApiResponse<bool>> DeleteExerciseAsync(int id)
    {
        var exercise = await _context.Exercises.FindAsync(id);
        if (exercise == null)
            throw new NotFoundException("Məşq tapılmadı.");

        _context.Exercises.Remove(exercise);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Məşq silindi.");
    }

    public async Task<ApiResponse<List<ExerciseDto>>> GetFeaturedExercisesAsync()
    {
        var exercises = await _context.Exercises
            .Include(e => e.Comments)
            .AsNoTracking()
            .OrderByDescending(e => e.CreatedAt)
            .Take(6)
            .Select(e => MapToExerciseDto(e))
            .ToListAsync();

        return ApiResponse<List<ExerciseDto>>.Ok(exercises);
    }

    public static ExerciseDto MapToExerciseDto(Exercise e)
    {
        double avgRating = e.Comments.Any() ? Math.Round(e.Comments.Average(c => c.Rating), 1) : 5.0;

        return new ExerciseDto
        {
            Id = e.Id,
            Title = e.Title,
            Slug = e.Slug,
            Description = e.Description,
            MuscleGroup = e.MuscleGroup,
            Difficulty = e.Difficulty,
            Equipment = e.Equipment,
            ThumbnailUrl = e.ThumbnailUrl,
            VideoUrl = e.VideoUrl,
            ExecutionSteps = e.ExecutionSteps,
            Benefits = e.Benefits,
            RisksAndMistakes = e.RisksAndMistakes,
            EstimatedCaloriesBurnedPerMin = e.EstimatedCaloriesBurnedPerMin,
            CommentsCount = e.Comments.Count,
            AverageRating = avgRating,
            CreatedAt = e.CreatedAt
        };
    }
}
