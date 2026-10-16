using Kursisi.Application.Common.Models;
using Kursisi.Application.DTOs;

namespace Kursisi.Application.Interfaces;

public interface IExerciseService
{
    Task<ApiResponse<PagedResult<ExerciseDto>>> GetExercisesAsync(ExerciseFilterParams filterParams);
    Task<ApiResponse<ExerciseDto>> GetExerciseBySlugAsync(string slug);
    Task<ApiResponse<ExerciseDto>> GetExerciseByIdAsync(int id);
    Task<ApiResponse<ExerciseDto>> CreateExerciseAsync(CreateExerciseDto dto);
    Task<ApiResponse<ExerciseDto>> UpdateExerciseAsync(int id, UpdateExerciseDto dto);
    Task<ApiResponse<bool>> DeleteExerciseAsync(int id);
    Task<ApiResponse<List<ExerciseDto>>> GetFeaturedExercisesAsync();
}
