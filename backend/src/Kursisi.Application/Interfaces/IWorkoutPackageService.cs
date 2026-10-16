using Kursisi.Application.Common.Models;
using Kursisi.Application.DTOs;

namespace Kursisi.Application.Interfaces;

public interface IWorkoutPackageService
{
    Task<ApiResponse<List<WorkoutPackageDto>>> GetAllPackagesAsync();
    Task<ApiResponse<WorkoutPackageDto>> GetPackageBySlugAsync(string slug);
    Task<ApiResponse<WorkoutPackageDto>> GetPackageByIdAsync(int id);
    Task<ApiResponse<WorkoutPackageDto>> CreatePackageAsync(int trainerId, CreateWorkoutPackageDto dto);
    Task<ApiResponse<bool>> DeletePackageAsync(int packageId, int userId, bool isAdmin);
    Task<ApiResponse<bool>> AdoptPackageToScheduleAsync(int userId, AdoptPackageDto dto);
}
