using Kursisi.Application.Common.Exceptions;
using Kursisi.Application.Common.Models;
using Kursisi.Application.DTOs;
using Kursisi.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Kursisi.Application.Services;

public class AdminService : IAdminService
{
    private readonly IApplicationDbContext _context;

    public AdminService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<DashboardSummaryDto>> GetDashboardSummaryAsync()
    {
        int totalUsers = await _context.Users.CountAsync();
        int totalExercises = await _context.Exercises.CountAsync();
        int totalPackages = await _context.WorkoutPackages.CountAsync();
        int totalCompletions = await _context.WorkoutLogs.CountAsync();

        var recentUsers = await _context.Users
            .OrderByDescending(u => u.CreatedAt)
            .Take(10)
            .AsNoTracking()
            .Select(u => new AdminUserDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                Role = u.Role,
                IsEmailConfirmed = u.IsEmailConfirmed,
                IsActive = u.IsActive,
                AvatarUrl = u.AvatarUrl,
                HeightCm = u.HeightCm,
                WeightKg = u.WeightKg,
                TargetGoal = u.TargetGoal,
                CreatedAt = u.CreatedAt,
                TotalWorkoutsLogged = u.WorkoutLogs.Count
            })
            .ToListAsync();

        var summary = new DashboardSummaryDto
        {
            TotalUsers = totalUsers,
            TotalExercises = totalExercises,
            TotalPackages = totalPackages,
            TotalWorkoutsCompleted = totalCompletions,
            RecentUsers = recentUsers
        };

        return ApiResponse<DashboardSummaryDto>.Ok(summary);
    }

    public async Task<ApiResponse<List<AdminUserDto>>> GetAllUsersAsync()
    {
        var users = await _context.Users
            .Include(u => u.WorkoutLogs)
            .OrderByDescending(u => u.CreatedAt)
            .AsNoTracking()
            .Select(u => new AdminUserDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                Role = u.Role,
                IsEmailConfirmed = u.IsEmailConfirmed,
                IsActive = u.IsActive,
                AvatarUrl = u.AvatarUrl,
                HeightCm = u.HeightCm,
                WeightKg = u.WeightKg,
                TargetGoal = u.TargetGoal,
                CreatedAt = u.CreatedAt,
                TotalWorkoutsLogged = u.WorkoutLogs.Count
            })
            .ToListAsync();

        return ApiResponse<List<AdminUserDto>>.Ok(users);
    }

    public async Task<ApiResponse<bool>> UpdateUserRoleAsync(UpdateUserRoleDto dto)
    {
        var user = await _context.Users.FindAsync(dto.UserId);
        if (user == null)
            throw new NotFoundException("İstifadəçi tapılmadı.");

        user.Role = dto.Role;
        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, $"{user.FullName} istifadəçisinin rolu {dto.Role} olaraq dəyişdirildi.");
    }

    public async Task<ApiResponse<bool>> UpdateUserStatusAsync(UpdateUserStatusDto dto)
    {
        var user = await _context.Users.FindAsync(dto.UserId);
        if (user == null)
            throw new NotFoundException("İstifadəçi tapılmadı.");

        user.IsActive = dto.IsActive;
        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        string statusText = dto.IsActive ? "aktiv edildi" : "deaktiv edildi";
        return ApiResponse<bool>.Ok(true, $"{user.FullName} istifadəçisi {statusText}.");
    }
}
