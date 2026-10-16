using Kursisi.Application.Common.Exceptions;
using Kursisi.Application.Common.Models;
using Kursisi.Application.DTOs;
using Kursisi.Application.Interfaces;
using Kursisi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Kursisi.Application.Services;

public class ProgressService : IProgressService
{
    private readonly IApplicationDbContext _context;

    public ProgressService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<MonthlyProgressDto>>> GetUserProgressAsync(int userId)
    {
        var progresses = await _context.MonthlyProgresses
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.MonthYear)
            .AsNoTracking()
            .Select(p => new MonthlyProgressDto
            {
                Id = p.Id,
                UserId = p.UserId,
                MonthYear = p.MonthYear,
                PhotoUrl = p.PhotoUrl,
                WeightKg = p.WeightKg,
                ChestCm = p.ChestCm,
                WaistCm = p.WaistCm,
                ArmCm = p.ArmCm,
                Notes = p.Notes,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();

        return ApiResponse<List<MonthlyProgressDto>>.Ok(progresses);
    }

    public async Task<ApiResponse<MonthlyProgressDto>> AddProgressAsync(int userId, CreateMonthlyProgressDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.MonthYear))
            throw new AppException("Ay/İl qeyd edilməlidir (məsələn, 2026-05).");

        if (string.IsNullOrWhiteSpace(dto.PhotoUrl))
            throw new AppException("Aylıq bədən şəkli (Cloudinary URL) daxil edilməlidir.");

        var progress = new MonthlyProgress
        {
            UserId = userId,
            MonthYear = dto.MonthYear.Trim(),
            PhotoUrl = dto.PhotoUrl.Trim(),
            WeightKg = dto.WeightKg,
            ChestCm = dto.ChestCm,
            WaistCm = dto.WaistCm,
            ArmCm = dto.ArmCm,
            Notes = dto.Notes?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.MonthlyProgresses.Add(progress);

        // Also update current weight on user profile
        var user = await _context.Users.FindAsync(userId);
        if (user != null && dto.WeightKg > 0)
        {
            user.WeightKg = dto.WeightKg;
        }

        await _context.SaveChangesAsync();

        var resultDto = new MonthlyProgressDto
        {
            Id = progress.Id,
            UserId = progress.UserId,
            MonthYear = progress.MonthYear,
            PhotoUrl = progress.PhotoUrl,
            WeightKg = progress.WeightKg,
            ChestCm = progress.ChestCm,
            WaistCm = progress.WaistCm,
            ArmCm = progress.ArmCm,
            Notes = progress.Notes,
            CreatedAt = progress.CreatedAt
        };

        return ApiResponse<MonthlyProgressDto>.Ok(resultDto, "Aylıq inkişaf şəkli və məlumatları uğurla saxlanıldı.");
    }

    public async Task<ApiResponse<bool>> DeleteProgressAsync(int userId, int progressId)
    {
        var progress = await _context.MonthlyProgresses
            .FirstOrDefaultAsync(p => p.Id == progressId && p.UserId == userId);

        if (progress == null)
            throw new NotFoundException("İnkişaf qeydi tapılmadı.");

        _context.MonthlyProgresses.Remove(progress);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Aylıq inkişaf qeydi silindi.");
    }
}
