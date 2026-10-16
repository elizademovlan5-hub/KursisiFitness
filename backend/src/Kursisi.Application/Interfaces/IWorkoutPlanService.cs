using Kursisi.Application.Common.Models;
using Kursisi.Application.DTOs;
using Kursisi.Domain.Enums;

namespace Kursisi.Application.Interfaces;

public interface IWorkoutPlanService
{
    Task<ApiResponse<List<WeeklyPlanItemDto>>> GetWeeklyPlanAsync(int userId);
    Task<ApiResponse<WeeklyPlanItemDto>> AddToPlanAsync(int userId, AddToPlanDto dto);
    Task<ApiResponse<WeeklyPlanItemDto>> UpdatePlanItemAsync(int userId, int planItemId, UpdatePlanItemDto dto);
    Task<ApiResponse<bool>> DeletePlanItemAsync(int userId, int planItemId);
    Task<ApiResponse<WorkoutLogDto>> CompleteWorkoutAsync(int userId, CompleteWorkoutDto dto);
    Task<ApiResponse<DailySummaryDto>> GetDailySummaryAsync(int userId, DayOfWeekEnum day);
    Task<ApiResponse<WeeklyStatsDto>> GetWeeklyStatsAsync(int userId);
    Task<ApiResponse<List<WorkoutLogDto>>> GetWorkoutHistoryAsync(int userId);
}
