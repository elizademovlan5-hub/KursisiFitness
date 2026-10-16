using Kursisi.Application.Common.Exceptions;
using Kursisi.Application.Common.Models;
using Kursisi.Application.DTOs;
using Kursisi.Application.Interfaces;
using Kursisi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Kursisi.Application.Services;

public class CommentService : ICommentService
{
    private readonly IApplicationDbContext _context;

    public CommentService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<CommentDto>>> GetCommentsByExerciseSlugAsync(string slug)
    {
        var exercise = await _context.Exercises.FirstOrDefaultAsync(e => e.Slug == slug.ToLower().Trim());
        if (exercise == null)
            throw new NotFoundException("Məşq tapılmadı.");

        var comments = await _context.Comments
            .Include(c => c.User)
            .Where(c => c.ExerciseId == exercise.Id)
            .OrderByDescending(c => c.CreatedAt)
            .AsNoTracking()
            .Select(c => new CommentDto
            {
                Id = c.Id,
                UserId = c.UserId,
                UserName = c.User.FullName,
                UserAvatarUrl = c.User.AvatarUrl,
                ExerciseId = c.ExerciseId,
                Content = c.Content,
                Rating = c.Rating,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();

        return ApiResponse<List<CommentDto>>.Ok(comments);
    }

    public async Task<ApiResponse<List<CommentDto>>> GetCommentsByPackageSlugAsync(string slug)
    {
        var package = await _context.WorkoutPackages.FirstOrDefaultAsync(p => p.Slug == slug.ToLower().Trim());
        if (package == null)
            throw new NotFoundException("Məşq paketi tapılmadı.");

        var comments = await _context.Comments
            .Include(c => c.User)
            .Where(c => c.WorkoutPackageId == package.Id)
            .OrderByDescending(c => c.CreatedAt)
            .AsNoTracking()
            .Select(c => new CommentDto
            {
                Id = c.Id,
                UserId = c.UserId,
                UserName = c.User.FullName,
                UserAvatarUrl = c.User.AvatarUrl,
                WorkoutPackageId = c.WorkoutPackageId,
                Content = c.Content,
                Rating = c.Rating,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();

        return ApiResponse<List<CommentDto>>.Ok(comments);
    }

    public async Task<ApiResponse<CommentDto>> AddCommentAsync(int userId, CreateCommentDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Content))
            throw new AppException("Şərh mətni daxil edilməlidir.");

        if (dto.Rating < 1 || dto.Rating > 5)
            dto.Rating = 5;

        var comment = new Comment
        {
            UserId = userId,
            ExerciseId = dto.ExerciseId,
            WorkoutPackageId = dto.WorkoutPackageId,
            Content = dto.Content.Trim(),
            Rating = dto.Rating,
            CreatedAt = DateTime.UtcNow
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        var user = await _context.Users.FindAsync(userId);

        var resultDto = new CommentDto
        {
            Id = comment.Id,
            UserId = comment.UserId,
            UserName = user?.FullName ?? "İstifadəçi",
            UserAvatarUrl = user?.AvatarUrl,
            ExerciseId = comment.ExerciseId,
            WorkoutPackageId = comment.WorkoutPackageId,
            Content = comment.Content,
            Rating = comment.Rating,
            CreatedAt = comment.CreatedAt
        };

        return ApiResponse<CommentDto>.Ok(resultDto, "Şərhiniz əlavə edildi.");
    }

    public async Task<ApiResponse<bool>> DeleteCommentAsync(int userId, int commentId, bool isAdmin)
    {
        var comment = await _context.Comments.FindAsync(commentId);
        if (comment == null)
            throw new NotFoundException("Şərh tapılmadı.");

        if (!isAdmin && comment.UserId != userId)
            throw new AppException("Bu şərhi silmək səlahiyyətiniz yoxdur.", 403);

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Şərh silindi.");
    }
}
